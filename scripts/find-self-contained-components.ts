#!/usr/bin/env tsx
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { existsSync, statSync } from 'node:fs';

const PROJECT_ROOT = process.cwd();
const VALID_EXTENSIONS = new Set(['.ts', '.tsx']);
const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.turbo',
  '.output',
  '.parcel-cache',
]);

const ALIAS_PREFIXES: Array<{
  prefix: string;
  resolve: (specifier: string) => string;
}> = [
  {
    prefix: '@/'.replace(/\\/g, '/'),
    resolve: specifier => path.join(PROJECT_ROOT, specifier.slice(2)),
  },
];

async function main() {
  const targets = process.argv.slice(2);
  if (targets.length === 0) {
    console.error('Usage: tsx scripts/find-self-contained-components.ts <dir-or-file> [...more]');
    process.exit(1);
  }

  const allProjectFiles = await collectFiles(PROJECT_ROOT);
  const tsFiles = allProjectFiles.filter(file => VALID_EXTENSIONS.has(path.extname(file)));
  const reverseDeps = await buildReverseDependencyMap(tsFiles);

  const targetFiles = (
    await Promise.all(targets.map(target => expandTarget(target)))
  ).flat();

  if (targetFiles.length === 0) {
    console.error('No TypeScript files found under provided targets.');
    process.exit(1);
  }

  const reportRows = targetFiles
    .map(file => ({
      file,
      importers: Array.from(reverseDeps.get(file) ?? new Set()),
    }))
    .filter(row => row.importers.length === 0)
    .sort((a, b) => a.file.localeCompare(b.file));

  if (reportRows.length === 0) {
    console.log('✅ No self-contained files detected for the given targets.');
    return;
  }

  console.log('⚠️  Potentially self-contained files (only referenced by themselves):');
  for (const row of reportRows) {
    console.log(`- ${path.relative(PROJECT_ROOT, row.file)}`);
  }
}

async function collectFiles(dir: string, acc: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(fullPath, acc);
    } else {
      acc.push(fullPath);
    }
  }
  return acc;
}

async function expandTarget(target: string): Promise<string[]> {
  const absPath = path.resolve(PROJECT_ROOT, target);
  try {
    const stats = await fs.stat(absPath);
    if (stats.isDirectory()) {
      const files = await collectFiles(absPath);
      return files.filter(file => VALID_EXTENSIONS.has(path.extname(file)));
    }
    if (stats.isFile() && VALID_EXTENSIONS.has(path.extname(absPath))) {
      return [absPath];
    }
  } catch {
    console.warn(`⚠️  Target not found: ${target}`);
  }
  return [];
}

async function buildReverseDependencyMap(files: string[]) {
  const reverseMap = new Map<string, Set<string>>();
  const existsCache = new Map<string, boolean>();

  for (const file of files) {
    if (!reverseMap.has(file)) reverseMap.set(file, new Set());
    const content = await fs.readFile(file, 'utf8');
    const specifiers = extractImportSpecifiers(content);
    for (const specifier of specifiers) {
      const resolved = resolveImportSpecifier(file, specifier, existsCache);
      if (!resolved) continue;
      if (!reverseMap.has(resolved)) reverseMap.set(resolved, new Set());
      if (resolved !== file) {
        reverseMap.get(resolved)!.add(file);
      }
    }
  }

  return reverseMap;
}

function extractImportSpecifiers(code: string): string[] {
  const results: string[] = [];
  const staticImportRegex = /(?:import|export)\s+(?:[^'";]+?\s+from\s+)?["']([^"']+)["']/g;
  const dynamicImportRegex = /import\(\s*["']([^"']+)["']\s*\)/g;

  let match: RegExpExecArray | null;
  while ((match = staticImportRegex.exec(code))) {
    results.push(match[1]);
  }
  while ((match = dynamicImportRegex.exec(code))) {
    results.push(match[1]);
  }
  return results;
}

function resolveImportSpecifier(
  importerFile: string,
  specifier: string,
  existsCache: Map<string, boolean>
): string | null {
  if (!specifier) return null;
  if (specifier.startsWith('.')) {
    return resolveWithCandidates(path.resolve(path.dirname(importerFile), specifier), existsCache);
  }

  const alias = ALIAS_PREFIXES.find(({ prefix }) => specifier.startsWith(prefix));
  if (alias) {
    const absolute = alias.resolve(specifier);
    return resolveWithCandidates(absolute, existsCache);
  }

  return null;
}

function resolveWithCandidates(basePath: string, existsCache: Map<string, boolean>): string | null {
  const candidates = buildCandidatePaths(basePath);
  for (const candidate of candidates) {
    if (pathExists(candidate, existsCache)) {
      const stat = safeStat(candidate);
      if (stat?.isFile()) return path.normalize(candidate);
    }
  }
  return null;
}

function buildCandidatePaths(base: string): string[] {
  const withoutExt = removeExtension(base);
  const candidates = new Set<string>();
  [base, withoutExt].forEach(p => {
    if (!p) return;
    candidates.add(p);
    candidates.add(`${p}.ts`);
    candidates.add(`${p}.tsx`);
    candidates.add(`${p}.js`);
    candidates.add(`${p}.jsx`);
    candidates.add(path.join(p, 'index.ts'));
    candidates.add(path.join(p, 'index.tsx'));
    candidates.add(path.join(p, 'index.js'));
    candidates.add(path.join(p, 'index.jsx'));
  });
  return Array.from(candidates);
}

function removeExtension(filePath: string): string {
  return filePath.replace(/(\.(ts|tsx|js|jsx))$/, '');
}

function pathExists(filePath: string, cache: Map<string, boolean>): boolean {
  const normalized = path.normalize(filePath);
  if (cache.has(normalized)) return cache.get(normalized)!;
  let exists = false;
  try {
    exists = existsSync(normalized);
  } catch {
    exists = false;
  }
  cache.set(normalized, exists);
  return exists;
}

function safeStat(filePath: string) {
  try {
    return statSync(filePath);
  } catch {
    return null;
  }
}

main().catch(error => {
  console.error('Failed to analyze project:', error);
  process.exit(1);
});
