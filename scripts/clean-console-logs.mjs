/**
 * Script to remove console.log statements from production code.
 * 
 * Strategy:
 * - SKIP files in: node_modules, .next, generated, scripts, seeds, prisma/dev-utils
 * - KEEP with eslint-disable: instrumentation.ts, sentry.*.config.ts, lib/safe-logger.ts
 * - CONVERT to console.warn: auth.ts, auth.config.ts (auth events are important)
 * - REMOVE: all other console.log calls
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Files to skip (keep console.log as-is, will add eslint-disable manually)
const SKIP_FILES = new Set([
  'instrumentation.ts',
  'sentry.client.config.ts', 
  'sentry.server.config.ts',
]);

// Files where console.log → eslint-disable-next-line (intentional logging)
const ESLINT_DISABLE_FILES = new Set([
  'lib/safe-logger.ts',
]);

// Files where console.log → console.warn (important auth events)
const CONVERT_TO_WARN_FILES = new Set([
  'auth.ts',
  'auth.config.ts',
]);

// Directories to completely skip
const SKIP_DIRS = ['node_modules', '.next', 'generated', 'scripts', 'seeds', 'prisma/dev-utils', 'backups'];

function getAllFiles(dir, exts = ['.ts', '.tsx']) {
  const results = [];
  
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
      
      if (entry.isDirectory()) {
        if (SKIP_DIRS.some(skip => relPath.startsWith(skip) || relPath.includes('/' + skip))) continue;
        walk(fullPath);
      } else if (entry.isFile() && exts.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return results;
}

function getRelPath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function removeConsoleLogStatements(content) {
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  let removed = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this line contains console.log
    if (trimmed.includes('console.log(') || trimmed.includes('console.log (')) {
      // Case 1: Line is ONLY a console.log statement (most common)
      // e.g., "  console.log('debug', value);"
      if (/^\s*console\.log\s*\(/.test(line)) {
        // Check if it's complete on one line (balanced parens ending with ;)
        if (isCompleteSingleLine(trimmed)) {
          removed++;
          i++;
          // Also remove trailing empty line if it creates a double blank
          continue;
        }
        
        // Multi-line console.log - find the closing
        let depth = 0;
        let found = false;
        let endIdx = i;
        
        for (let j = i; j < lines.length; j++) {
          const l = lines[j];
          for (const ch of l) {
            if (ch === '(') depth++;
            if (ch === ')') depth--;
          }
          if (depth <= 0) {
            endIdx = j;
            found = true;
            break;
          }
        }
        
        if (found) {
          removed++;
          i = endIdx + 1;
          continue;
        }
      }
      
      // Case 2: console.log is part of an expression (e.g., "condition && console.log(...)")
      // or inside something like "} catch (e) { console.log(e); }"
      // Just remove the console.log part if possible, or comment it out
      if (/&&\s*console\.log\s*\(/.test(trimmed) || /\|\|\s*console\.log\s*\(/.test(trimmed)) {
        // "something && console.log(...)" → remove the && console.log part
        const cleaned = line.replace(/\s*&&\s*console\.log\s*\([^)]*\)\s*;?/, ';');
        const cleaned2 = cleaned.replace(/\s*\|\|\s*console\.log\s*\([^)]*\)\s*;?/, ';');
        result.push(cleaned2);
        removed++;
        i++;
        continue;
      }
    }
    
    result.push(line);
    i++;
  }
  
  return { content: result.join('\n'), removed };
}

function isCompleteSingleLine(trimmed) {
  // Count parens
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let escaped = false;
  let inTemplate = false;
  let templateDepth = 0;
  
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    const prev = i > 0 ? trimmed[i-1] : '';
    
    if (escaped) {
      escaped = false;
      continue;
    }
    
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    
    if (inString) {
      if (ch === stringChar && !inTemplate) {
        inString = false;
      } else if (inTemplate && ch === '`') {
        inString = false;
        inTemplate = false;
      }
      continue;
    }
    
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      if (ch === '`') inTemplate = true;
      continue;
    }
    
    if (ch === '(') depth++;
    if (ch === ')') depth--;
  }
  
  // Complete if depth is 0 and ends with ; or )
  return depth === 0 && (trimmed.endsWith(';') || trimmed.endsWith(')'));
}

function addEslintDisableToConsoleLogs(content) {
  const lines = content.split('\n');
  const result = [];
  let modified = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/console\.log\s*\(/.test(line)) {
      // Check if previous line already has eslint-disable
      const prevLine = result.length > 0 ? result[result.length - 1].trim() : '';
      if (!prevLine.includes('eslint-disable') || !prevLine.includes('no-console')) {
        const indent = line.match(/^(\s*)/)[1];
        result.push(`${indent}// eslint-disable-next-line no-console`);
        modified++;
      }
    }
    result.push(line);
  }
  
  return { content: result.join('\n'), modified };
}

function convertConsoleLogToWarn(content) {
  let modified = 0;
  const result = content.replace(/console\.log\s*\(/g, () => {
    modified++;
    return 'console.warn(';
  });
  return { content: result, modified };
}

// Main
const files = getAllFiles(ROOT);
let totalRemoved = 0;
let totalConverted = 0;
let totalDisabled = 0;
let filesModified = 0;

const stats = {
  removed: [],
  converted: [],
  disabled: [],
  skipped: [],
};

for (const filePath of files) {
  const relPath = getRelPath(filePath);
  const fileName = path.basename(filePath);
  
  // Skip files
  if (SKIP_FILES.has(fileName) || SKIP_FILES.has(relPath)) {
    stats.skipped.push(relPath);
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if no console.log
  if (!content.includes('console.log')) continue;
  
  // eslint-disable files
  if (ESLINT_DISABLE_FILES.has(relPath)) {
    const { content: newContent, modified } = addEslintDisableToConsoleLogs(content);
    if (modified > 0) {
      fs.writeFileSync(filePath, newContent);
      stats.disabled.push({ file: relPath, count: modified });
      totalDisabled += modified;
      filesModified++;
    }
    continue;
  }
  
  // Convert to warn files 
  if (CONVERT_TO_WARN_FILES.has(relPath)) {
    const { content: newContent, modified } = convertConsoleLogToWarn(content);
    if (modified > 0) {
      fs.writeFileSync(filePath, newContent);
      stats.converted.push({ file: relPath, count: modified });
      totalConverted += modified;
      filesModified++;
    }
    continue;
  }
  
  // Remove console.log from all other files
  const { content: newContent, removed } = removeConsoleLogStatements(content);
  if (removed > 0) {
    fs.writeFileSync(filePath, newContent);
    stats.removed.push({ file: relPath, count: removed });
    totalRemoved += removed;
    filesModified++;
  }
}

console.log('\n=== Console.log Cleanup Report ===\n');
console.log(`Files modified: ${filesModified}`);
console.log(`Removed: ${totalRemoved} console.log calls`);
console.log(`Converted to console.warn: ${totalConverted}`);
console.log(`Added eslint-disable: ${totalDisabled}`);
console.log(`Skipped files: ${stats.skipped.length}`);

if (stats.removed.length) {
  console.log('\n--- Removed ---');
  for (const { file, count } of stats.removed) {
    console.log(`  ${count}\t${file}`);
  }
}

if (stats.converted.length) {
  console.log('\n--- Converted to console.warn ---');
  for (const { file, count } of stats.converted) {
    console.log(`  ${count}\t${file}`);
  }
}

if (stats.disabled.length) {
  console.log('\n--- Added eslint-disable ---');
  for (const { file, count } of stats.disabled) {
    console.log(`  ${count}\t${file}`);
  }
}

console.log('\nDone!');
