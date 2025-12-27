/**
 * Auto-sync Print Variables from Templates
 * 
 * Script này:
 * 1. Đọc tất cả placeholders từ Templates
 * 2. So sánh với Variables hiện tại
 * 3. Tạo suggestion để thêm vào Variables
 */

const fs = require('fs');
const path = require('path');

const VARIABLES_DIR = path.join(__dirname, '../features/settings/printer/variables');
const TEMPLATES_DIR = path.join(__dirname, '../features/settings/printer/templates');

// Template type to variable file mapping
const MAPPING = {
  'order.ts': 'don-ban-hang.ts',
  'quote.ts': 'phieu-don-tam-tinh.ts', 
  'sales-return.ts': 'don-doi-tra-hang.ts',
  'packing.ts': 'phieu-dong-goi.ts',
  'delivery.ts': 'phieu-giao-hang.ts',
  'shipping-label.ts': 'nhan-giao-hang.ts',
  'product-label.ts': 'tem-phu-san-pham.ts',
  'purchase-order.ts': 'don-dat-hang-nhap.ts',
  'stock-in.ts': 'phieu-nhap-kho.ts',
  'stock-transfer.ts': 'phieu-chuyen-hang.ts',
  'inventory-check.ts': 'phieu-kiem-hang.ts',
  'receipt.ts': 'phieu-thu.ts',
  'payment.ts': 'phieu-chi.ts',
  'warranty.ts': 'phieu-bao-hanh.ts',
  'supplier-return.ts': 'phieu-tra-hang-ncc.ts',
  'complaint.ts': 'phieu-khieu-nai.ts',
  'penalty.ts': 'phieu-phat.ts',
  'handover.ts': 'phieu-ban-giao.ts',
  'refund-confirmation.ts': 'phieu-xac-nhan-hoan.ts',
  'sales-summary.ts': 'phieu-tong-ket-ban-hang.ts',
  'packing-guide.ts': 'phieu-huong-dan-dong-goi.ts',
  'packing-request.ts': 'phieu-yeu-cau-dong-goi.ts',
  'warranty-request.ts': 'phieu-yeu-cau-bao-hanh.ts',
  'return-order.ts': 'don-tra-hang.ts',
};

// Store variables (auto-included via getStoreData)
const STORE_VARS = new Set([
  '{store_logo}', '{store_name}', '{store_address}', '{store_phone_number}',
  '{hotline}', '{store_hotline}', '{store_email}', '{store_fax}',
  '{store_website}', '{store_tax_code}', '{print_date}', '{print_time}',
]);

// Guess label from key
function guessLabel(key) {
  const name = key.replace(/[{}]/g, '');
  const words = name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(' ');
}

// Guess group from key
function guessGroup(key) {
  const name = key.replace(/[{}]/g, '');
  if (name.startsWith('line_')) return 'Chi tiết sản phẩm';
  if (name.startsWith('store_') || name.includes('logo')) return 'Thông tin cửa hàng';
  if (name.startsWith('customer_')) return 'Thông tin khách hàng';
  if (name.startsWith('supplier_')) return 'Thông tin nhà cung cấp';
  if (name.includes('total') || name.includes('amount') || name.includes('discount')) return 'Tổng giá trị';
  if (name.includes('print_') || name.includes('created') || name.includes('date')) return 'Thông tin phiếu';
  return 'Thông tin khác';
}

// Extract placeholders
function extractPlaceholders(content) {
  const regex = /\{[a-z_:()0-9]+\}/gi;
  const matches = content.match(regex) || [];
  return [...new Set(matches)].sort();
}

// Extract existing variable keys
function extractVariableKeys(content) {
  const regex = /key:\s*['"](\{[^}]+\})['"]/g;
  const keys = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.push(match[1]);
  }
  return new Set(keys);
}

// Main
console.log('='.repeat(80));
console.log('AUTO-SYNC: Templates → Variables');
console.log('='.repeat(80));

let totalMissing = 0;
const suggestions = [];

for (const [templateFile, variableFile] of Object.entries(MAPPING)) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  const variablePath = path.join(VARIABLES_DIR, variableFile);
  
  if (!fs.existsSync(templatePath) || !fs.existsSync(variablePath)) continue;
  
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  const variableContent = fs.readFileSync(variablePath, 'utf-8');
  
  const templateKeys = extractPlaceholders(templateContent);
  const variableKeys = extractVariableKeys(variableContent);
  
  // Find missing (in template but not in variables, excluding store vars)
  const missing = templateKeys.filter(k => !variableKeys.has(k) && !STORE_VARS.has(k));
  
  if (missing.length > 0) {
    console.log(`\n📄 ${templateFile} → ${variableFile}`);
    console.log(`   Missing ${missing.length} variables:`);
    
    const varSuggestions = missing.map(key => {
      const suggestion = `  { key: '${key}', label: '${guessLabel(key)}', group: '${guessGroup(key)}' },`;
      console.log(`   ${key}`);
      return suggestion;
    });
    
    suggestions.push({
      file: variableFile,
      vars: varSuggestions
    });
    
    totalMissing += missing.length;
  }
}

console.log('\n' + '='.repeat(80));
console.log(`SUMMARY: ${totalMissing} variables need to be added`);
console.log('='.repeat(80));

// Output suggestions to file
if (suggestions.length > 0) {
  let output = '// AUTO-GENERATED SUGGESTIONS\n// Copy these into the respective variable files\n\n';
  
  for (const s of suggestions) {
    output += `// === ${s.file} ===\n`;
    output += s.vars.join('\n') + '\n\n';
  }
  
  const outputPath = path.join(__dirname, 'variable-suggestions.txt');
  fs.writeFileSync(outputPath, output);
  console.log(`\nSuggestions written to: ${outputPath}`);
}
