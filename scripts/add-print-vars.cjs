/**
 * Script thêm print_date, print_time vào tất cả variable files
 */

const fs = require('fs');
const path = require('path');

const variablesDir = path.join(__dirname, '../features/settings/printer/variables');

// Các biến cần thêm vào tất cả files (từ getStoreData)
const COMMON_VARS = [
  "{ key: '{print_date}', label: 'Ngày in', group: 'Thông tin in' },",
  "{ key: '{print_time}', label: 'Giờ in', group: 'Thông tin in' },",
];

const files = fs.readdirSync(variablesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

let updated = 0;

files.forEach(file => {
  const filePath = path.join(variablesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Kiểm tra đã có print_date chưa
  if (content.includes('{print_date}')) {
    console.log('⏭️  ' + file + ' - already has print_date');
    return;
  }
  
  // Tìm vị trí thêm (trước ];)
  const insertPoint = content.lastIndexOf('];');
  if (insertPoint === -1) {
    console.log('⚠️  ' + file + ' - no insertion point');
    return;
  }
  
  const before = content.substring(0, insertPoint);
  const after = content.substring(insertPoint);
  
  const addition = '\n  // === THÔNG TIN IN ===\n  ' + COMMON_VARS.join('\n  ') + '\n';
  content = before + addition + after;
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('✅ ' + file);
  updated++;
});

console.log('\nUpdated ' + updated + ' files with print_date/print_time');
