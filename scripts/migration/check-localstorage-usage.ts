/**
 * Script kiểm tra trạng thái migration từ localStorage sang Database
 * 
 * Chạy: npx ts-node scripts/check-localstorage-usage.ts
 * 
 * Báo cáo:
 * 1. Các file còn sử dụng localStorage trực tiếp
 * 2. Các Zustand store còn dùng persistKey
 * 3. Các settings sync files còn cache localStorage
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const IGNORE_DIRS = ['node_modules', '.next', 'dist', '.git'];

interface FileMatch {
  file: string;
  line: number;
  content: string;
  type: 'localStorage' | 'persistKey' | 'settingsSync';
}

const results: FileMatch[] = [];

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        walkDir(filePath, callback);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      callback(filePath);
    }
  }
}

function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relativePath = path.relative(ROOT_DIR, filePath);
  
  lines.forEach((line, index) => {
    // Check localStorage usage
    if (/localStorage\.(get|set|remove)Item/.test(line)) {
      results.push({
        file: relativePath,
        line: index + 1,
        content: line.trim(),
        type: 'localStorage'
      });
    }
    
    // Check Zustand persistKey
    if (/persistKey:\s*['"]/.test(line)) {
      results.push({
        file: relativePath,
        line: index + 1,
        content: line.trim(),
        type: 'persistKey'
      });
    }
  });
}

console.log('🔍 Scanning codebase for localStorage usage...\n');

walkDir(ROOT_DIR, checkFile);

// Group by type
const localStorageUsages = results.filter(r => r.type === 'localStorage');
const persistKeyUsages = results.filter(r => r.type === 'persistKey');

console.log('=' .repeat(80));
console.log('📊 MIGRATION STATUS REPORT');
console.log('=' .repeat(80));

console.log('\n📁 FILES USING localStorage DIRECTLY:', localStorageUsages.length, 'occurrences\n');

// Group by file
const byFile = new Map<string, FileMatch[]>();
localStorageUsages.forEach(r => {
  if (!byFile.has(r.file)) byFile.set(r.file, []);
  byFile.get(r.file)!.push(r);
});

byFile.forEach((matches, file) => {
  console.log(`\n  📄 ${file} (${matches.length} usages)`);
  matches.slice(0, 3).forEach(m => {
    console.log(`     Line ${m.line}: ${m.content.substring(0, 80)}...`);
  });
  if (matches.length > 3) {
    console.log(`     ... and ${matches.length - 3} more`);
  }
});

console.log('\n\n📦 ZUSTAND STORES WITH persistKey:', persistKeyUsages.length, 'stores\n');
persistKeyUsages.forEach(r => {
  console.log(`  📄 ${r.file}:${r.line}`);
  console.log(`     ${r.content}`);
});

console.log('\n\n' + '=' .repeat(80));
console.log('📋 SUMMARY');
console.log('=' .repeat(80));
console.log(`Total localStorage usages: ${localStorageUsages.length}`);
console.log(`Total Zustand persistKey stores: ${persistKeyUsages.length}`);
console.log(`Unique files with localStorage: ${byFile.size}`);

// List critical files to migrate
const criticalFiles = [
  'hooks/use-column-visibility.ts',
  'hooks/use-settings-storage.ts', 
  'hooks/use-workflow-templates.ts',
  'hooks/use-persistent-state.ts',
  'lib/settings-cache.ts',
  'lib/website-settings-sync.ts',
  'lib/warranty-settings-sync.ts',
  'lib/complaints-settings-sync.ts',
  'lib/active-timer-sync.ts',
];

console.log('\n\n🎯 CRITICAL FILES TO MIGRATE:');
criticalFiles.forEach(f => {
  const found = localStorageUsages.filter(r => r.file.includes(f.replace(/\//g, path.sep)));
  const status = found.length > 0 ? '❌ NEEDS MIGRATION' : '✅ OK';
  console.log(`  ${status} ${f}`);
});

console.log('\n');
