/**
 * Add print_date and print_time to all variable files
 * These are common store variables used in footers
 */

const fs = require('fs');
const path = require('path');

const VARIABLES_DIR = path.join(__dirname, '../features/settings/printer/variables');

// Variables to add
const NEW_VARS = `  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },`;

// Skip these files
const SKIP_FILES = ['index.ts'];

function addPrintVarsToFile(filePath) {
  const fileName = path.basename(filePath);
  
  if (SKIP_FILES.includes(fileName)) {
    return { file: fileName, status: 'skipped', reason: 'index file' };
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already has print_date
  if (content.includes("'{print_date}'")) {
    return { file: fileName, status: 'skipped', reason: 'already has print_date' };
  }

  // Find position to insert - after store_phone_number or at end of store info group
  let insertPos = -1;
  let insertAfter = '';

  // Try to find store_phone_number
  const storePhoneMatch = content.match(/\{ key: '\{store_phone_number\}',.*?\},?\n/);
  if (storePhoneMatch) {
    insertPos = storePhoneMatch.index + storePhoneMatch[0].length;
    insertAfter = 'store_phone_number';
  }
  
  // If not found, try store_address
  if (insertPos === -1) {
    const storeAddrMatch = content.match(/\{ key: '\{store_address\}',.*?\},?\n/);
    if (storeAddrMatch) {
      insertPos = storeAddrMatch.index + storeAddrMatch[0].length;
      insertAfter = 'store_address';
    }
  }

  // If not found, try store_name
  if (insertPos === -1) {
    const storeNameMatch = content.match(/\{ key: '\{store_name\}',.*?\},?\n/);
    if (storeNameMatch) {
      insertPos = storeNameMatch.index + storeNameMatch[0].length;
      insertAfter = 'store_name';
    }
  }

  // If still not found, insert at start of array
  if (insertPos === -1) {
    const arrayStartMatch = content.match(/export const \w+ = \[\n/);
    if (arrayStartMatch) {
      insertPos = arrayStartMatch.index + arrayStartMatch[0].length;
      insertAfter = 'array start';
    }
  }

  if (insertPos === -1) {
    return { file: fileName, status: 'error', reason: 'could not find insert position' };
  }

  // Insert the new variables
  const newContent = content.slice(0, insertPos) + NEW_VARS + '\n' + content.slice(insertPos);
  
  fs.writeFileSync(filePath, newContent);
  
  return { file: fileName, status: 'updated', insertAfter };
}

// Main
console.log('='.repeat(70));
console.log('ADD print_date AND print_time TO ALL VARIABLE FILES');
console.log('='.repeat(70));
console.log();

const files = fs.readdirSync(VARIABLES_DIR)
  .filter(f => f.endsWith('.ts'))
  .map(f => path.join(VARIABLES_DIR, f));

let updated = 0;
let skipped = 0;
let errors = 0;

for (const file of files) {
  const result = addPrintVarsToFile(file);
  
  if (result.status === 'updated') {
    console.log(`✅ ${result.file} - Added after ${result.insertAfter}`);
    updated++;
  } else if (result.status === 'skipped') {
    console.log(`⏭️  ${result.file} - ${result.reason}`);
    skipped++;
  } else {
    console.log(`❌ ${result.file} - ${result.reason}`);
    errors++;
  }
}

console.log();
console.log('='.repeat(70));
console.log(`COMPLETE: Updated ${updated}, Skipped ${skipped}, Errors ${errors}`);
console.log('='.repeat(70));
