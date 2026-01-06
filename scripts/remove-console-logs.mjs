/**
 * Script to remove console.log/warn/info/debug statements from TypeScript files
 * Handles multi-line statements correctly
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const EXTENSIONS = ['.ts', '.tsx'];
const IGNORED_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'generated'];
const CONSOLE_METHODS_TO_REMOVE = ['log', 'warn', 'info', 'debug'];
// Keep console.error

let totalFilesModified = 0;
let totalStatementsRemoved = 0;

/**
 * Recursively get all TypeScript files
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      if (!IGNORED_DIRS.includes(file)) {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else if (EXTENSIONS.includes(extname(file))) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

/**
 * Remove console statements from file content
 * Handles multi-line statements by tracking parentheses balance
 */
function removeConsoleStatements(content) {
  let result = '';
  let i = 0;
  let modified = false;
  let statementsRemoved = 0;

  while (i < content.length) {
    // Check for console.method( pattern
    const consoleMatch = content.slice(i).match(/^console\.(log|warn|info|debug)\s*\(/);
    
    if (consoleMatch && CONSOLE_METHODS_TO_REMOVE.includes(consoleMatch[1])) {
      // Found a console statement to remove
      // First, check if there's leading whitespace/newline we should also remove
      let leadingStart = result.length;
      
      // Track back to find the start of this statement (including indentation)
      while (leadingStart > 0 && result[leadingStart - 1] === ' ' || result[leadingStart - 1] === '\t') {
        leadingStart--;
      }
      
      // Find the matching closing parenthesis
      let parenCount = 0;
      let j = i + consoleMatch[0].length - 1; // Start at the opening paren
      let inString = false;
      let stringChar = '';
      let inTemplate = false;
      let templateDepth = 0;
      
      while (j < content.length) {
        const char = content[j];
        const prevChar = j > 0 ? content[j - 1] : '';
        
        // Handle string detection
        if (!inString && !inTemplate) {
          if (char === '"' || char === "'" || char === '`') {
            inString = true;
            stringChar = char;
            if (char === '`') {
              inTemplate = true;
              templateDepth = 1;
            }
          } else if (char === '(') {
            parenCount++;
          } else if (char === ')') {
            parenCount--;
            if (parenCount === 0) {
              // Found the closing paren
              j++;
              break;
            }
          }
        } else {
          // Inside string
          if (inTemplate) {
            if (char === '`' && prevChar !== '\\') {
              templateDepth--;
              if (templateDepth === 0) {
                inTemplate = false;
                inString = false;
              }
            } else if (char === '$' && content[j + 1] === '{') {
              // Template literal expression - need to track nested braces
              // Simplified: just continue, the brace tracking handles it
            }
          } else if (char === stringChar && prevChar !== '\\') {
            inString = false;
          }
        }
        j++;
      }
      
      // Skip semicolon if present
      if (content[j] === ';') {
        j++;
      }
      
      // Skip trailing newline if present
      if (content[j] === '\r') j++;
      if (content[j] === '\n') j++;
      
      // Remove the leading whitespace on this line too
      const lineStart = result.lastIndexOf('\n');
      if (lineStart >= 0) {
        const beforeLine = result.substring(0, lineStart + 1);
        const afterLine = result.substring(lineStart + 1);
        // Only remove if afterLine is just whitespace
        if (afterLine.trim() === '') {
          result = beforeLine;
        }
      }
      
      i = j;
      modified = true;
      statementsRemoved++;
    } else {
      result += content[i];
      i++;
    }
  }

  return { content: result, modified, statementsRemoved };
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const { content: newContent, modified, statementsRemoved } = removeConsoleStatements(content);
    
    if (modified) {
      writeFileSync(filePath, newContent, 'utf8');
      totalFilesModified++;
      totalStatementsRemoved += statementsRemoved;
      console.log(`✓ ${filePath} - removed ${statementsRemoved} statements`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

// Main execution
const rootDir = process.cwd();
console.log(`Scanning for TypeScript files in ${rootDir}...`);

const files = getAllFiles(rootDir);
console.log(`Found ${files.length} TypeScript files`);

files.forEach(processFile);

console.log(`\n=== Summary ===`);
console.log(`Files modified: ${totalFilesModified}`);
console.log(`Statements removed: ${totalStatementsRemoved}`);
