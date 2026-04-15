/**
 * Script: Migrate console.error → logError in API routes and lib files
 * Run: node scripts/migrate-console-to-logger.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function getAllFiles(dir, ext = '.ts') {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...getAllFiles(fullPath, ext));
    } else if (item.name.endsWith(ext) || item.name.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const IMPORT_LINE = "import { logError } from '@/lib/logger'";

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if no console.error
  if (!content.includes('console.error')) return false;
  
  // Skip if already has logError import
  const hasLoggerImport = content.includes("from '@/lib/logger'");
  
  // Add import if needed
  if (!hasLoggerImport) {
    // Find the last import statement
    const importRegex = /^import\s.+$/gm;
    let lastImportMatch = null;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportMatch = match;
    }
    
    if (lastImportMatch) {
      const insertPos = lastImportMatch.index + lastImportMatch[0].length;
      content = content.slice(0, insertPos) + '\n' + IMPORT_LINE + content.slice(insertPos);
    }
  }
  
  // Replace patterns:
  // 1. console.error('Fixed message:', error)  →  logError('Fixed message', error)
  // 2. console.error('Fixed message', error)   →  logError('Fixed message', error)
  // 3. console.error(`Template ${var}:`, error) →  logError(`Template ${var}`, error)
  // 4. console.error(`Template ${var}`, error)  →  logError(`Template ${var}`, error)
  
  // Single-quote string with trailing colon + variable
  content = content.replace(
    /console\.error\('([^']+?)[:,]\s*'\s*,\s*(\w+)\)/g,
    (_, msg, errVar) => `logError('${msg.replace(/[:,]\s*$/, '')}', ${errVar})`
  );
  
  // Single-quote string without colon + variable
  content = content.replace(
    /console\.error\('([^']+?)'\s*,\s*(\w+)\)/g,
    (_, msg, errVar) => `logError('${msg.replace(/[:,]\s*$/, '')}', ${errVar})`
  );
  
  // Template literal with trailing colon + variable
  content = content.replace(
    /console\.error\(`([^`]+?)[:,]\s*`\s*,\s*(\w+)\)/g,
    (_, msg, errVar) => `logError(\`${msg.replace(/[:,]\s*$/, '')}\`, ${errVar})`
  );
  
  // Template literal without colon + variable
  content = content.replace(
    /console\.error\(`([^`]+?)`\s*,\s*(\w+)\)/g,
    (_, msg, errVar) => `logError(\`${msg.replace(/[:,]\s*$/, '')}\`, ${errVar})`
  );
  
  // Double-quote string with trailing colon + variable
  content = content.replace(
    /console\.error\("([^"]+?)[:,]\s*"\s*,\s*(\w+)\)/g,
    (_, msg, errVar) => `logError('${msg.replace(/[:,]\s*$/, '')}', ${errVar})`
  );
  
  // Double-quote string without colon + variable
  content = content.replace(
    /console\.error\("([^"]+?)"\s*,\s*(\w+)\)/g,
    (_, msg, errVar) => `logError('${msg.replace(/[:,]\s*$/, '')}', ${errVar})`
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

// Directories to process
const dirs = [
  path.join(root, 'app', 'api'),
  path.join(root, 'lib'),
  path.join(root, 'features'),
  path.join(root, 'components'),
  path.join(root, 'hooks'),
  path.join(root, 'contexts'),
  path.join(root, 'repositories'),
];

let totalUpdated = 0;
let totalFiles = 0;

for (const dir of dirs) {
  const files = getAllFiles(dir);
  for (const file of files) {
    totalFiles++;
    if (migrateFile(file)) {
      totalUpdated++;
      const rel = path.relative(root, file);
      console.log(`  ✅ ${rel}`);
    }
  }
}

console.log(`\nDone: ${totalUpdated}/${totalFiles} files updated`);

// Verify: count remaining console.error
let remaining = 0;
for (const dir of dirs) {
  const files = getAllFiles(dir);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(/console\.error/g);
    if (matches) remaining += matches.length;
  }
}
console.log(`Remaining console.error calls: ${remaining}`);
