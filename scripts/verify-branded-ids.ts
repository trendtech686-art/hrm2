#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

type Violation = {
  file: string;
  line: number;
  column: number;
  property: string;
  sample: string;
  message: string;
};

const projectRoot = process.cwd();
const includeDirs = ['features', 'server'];
const skipDirNames = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.turbo', 'coverage']);
const tsDataRegex = /(?:^|[-_.])data\.(ts|tsx)$/i;
const jsonDataRegex = /\.json$/i;
const metadataFields = ['createdAt', 'createdBy'];
const args = new Set(process.argv.slice(2));
const skipJson = args.has('--skip-json');
const checkMetadata = args.has('--check-metadata');

const brandRules = [
  {
    property: 'systemId',
    expectedCall: 'asSystemId',
    description: 'systemId literal must be wrapped with asSystemId(...)',
  },
  {
    property: 'id',
    expectedCall: 'asBusinessId',
    description: 'id literal must be wrapped with asBusinessId(...)',
  },
];

void main();

async function main() {
  const files = await collectCandidateFiles();
  const issues: Violation[] = [];

  for (const filePath of files) {
    if (!skipJson && filePath.endsWith('.json')) {
      issues.push(...(await findJsonViolations(filePath)));
      if (checkMetadata) {
        issues.push(...findMetadataHints(filePath, await readFile(filePath, 'utf-8')));
      }
      continue;
    }

    if (filePath.endsWith('.json')) {
      continue;
    }

    issues.push(...(await findTsViolations(filePath)));
    if (checkMetadata) {
      const content = await readFile(filePath, 'utf-8');
      issues.push(...findMetadataHints(filePath, content));
    }
  }

  if (issues.length > 0) {
    console.error(`\n❌ verify-branded-ids found ${issues.length} issue(s):`);
    for (const issue of issues) {
      const relative = path.relative(projectRoot, issue.file).replace(/\\/g, '/');
      console.error(`- ${relative}:${issue.line}:${issue.column} [${issue.property}] ${issue.message}`);
      console.error(`  → ${issue.sample}`);
    }
    console.error('\nUse asSystemId/asBusinessId helpers or add // verify-ids-ignore (or // verify-ids-ignore-next-line) to suppress intentional literals.');
    process.exit(1);
  }

  console.log('✅ All checked seed files are using branded IDs.');
}

async function collectCandidateFiles(): Promise<string[]> {
  const files: string[] = [];

  for (const dir of includeDirs) {
    const absoluteDir = path.join(projectRoot, dir);
    if (!(await exists(absoluteDir))) {
      continue;
    }
    await walkDir(absoluteDir, files);
  }

  return files;
}

async function walkDir(currentDir: string, files: string[]): Promise<void> {
  const entries = await readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      if (skipDirNames.has(entry.name)) {
        continue;
      }
      await walkDir(entryPath, files);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (isTsDataFile(entryPath) || isJsonSeedFile(entryPath)) {
      files.push(entryPath);
    }
  }
}

function isTsDataFile(filePath: string): boolean {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return false;
  }
  if (filePath.endsWith('.d.ts')) {
    return false;
  }
  return tsDataRegex.test(path.basename(filePath));
}

function isJsonSeedFile(filePath: string): boolean {
  if (!filePath.endsWith('.json')) {
    return false;
  }
  return filePath.includes(`${path.sep}server${path.sep}`) && jsonDataRegex.test(path.basename(filePath));
}

async function findTsViolations(filePath: string): Promise<Violation[]> {
  const content = await readFile(filePath, 'utf-8');
  const lineStarts = computeLineStarts(content);
  const issues: Violation[] = [];

  for (const rule of brandRules) {
    const pattern = new RegExp(`\\b${rule.property}\\b\\s*:\\s*(?!${rule.expectedCall}\\()(['"])`, 'g');
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(content)) !== null) {
      const index = match.index;
      const { line, column } = getLineAndColumn(lineStarts, index);
      const lineText = getLineText(content, lineStarts, line);
      const previousLineText = line > 1 ? getLineText(content, lineStarts, line - 1) : '';

      if (lineText.includes('verify-ids-ignore') || previousLineText.includes('verify-ids-ignore-next-line')) {
        continue;
      }

      issues.push({
        file: filePath,
        line,
        column,
        property: rule.property,
        sample: lineText.trim(),
        message: rule.description,
      });
    }
  }

  return issues;
}

async function findJsonViolations(filePath: string): Promise<Violation[]> {
  const content = await readFile(filePath, 'utf-8');
  const lineStarts = computeLineStarts(content);
  const issues: Violation[] = [];

  for (const key of ['"systemId"', '"id"']) {
    const pattern = new RegExp(`${key}\\s*:\\s*"`, 'g');
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(content)) !== null) {
      const index = match.index;
      const { line, column } = getLineAndColumn(lineStarts, index);
      issues.push({
        file: filePath,
        line,
        column,
        property: key.replace(/"/g, ''),
        sample: getLineText(content, lineStarts, line).trim(),
        message: 'JSON seed cannot express branded IDs; migrate to TypeScript or exclude via --skip-json.',
      });
    }
  }

  return issues;
}

function findMetadataHints(filePath: string, content: string): Violation[] {
  const issues: Violation[] = [];
  const usesAuditHelper = /\bbuildSeedAuditFields\s*\(/.test(content);
  if (usesAuditHelper) {
    return issues;
  }
  for (const field of metadataFields) {
    if (!new RegExp(`\\b${field}\\b`).test(content)) {
      issues.push({
        file: filePath,
        line: 1,
        column: 1,
        property: field,
        sample: '(metadata check)',
        message: `Thiếu trường bắt buộc "${field}" trong seed data. Hãy bổ sung để đồng bộ audit trail.`,
      });
    }
  }
  return issues;
}

function computeLineStarts(content: string): number[] {
  const starts: number[] = [0];
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') {
      starts.push(i + 1);
    }
  }
  return starts;
}

function getLineAndColumn(starts: number[], index: number): { line: number; column: number } {
  let low = 0;
  let high = starts.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (starts[mid] <= index) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const line = Math.max(1, high + 1);
  const column = index - starts[Math.max(0, high)] + 1;
  return { line, column };
}

function getLineText(content: string, starts: number[], lineNumber: number): string {
  const lineIndex = lineNumber - 1;
  if (lineIndex < 0 || lineIndex >= starts.length) {
    return '';
  }
  const start = starts[lineIndex];
  const end = lineNumber < starts.length ? starts[lineNumber] - 1 : content.length;
  const raw = content.slice(start, end);
  return raw.replace(/\r$/, '');
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}
