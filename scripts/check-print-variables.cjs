const fs = require('fs');
const path = require('path');

const VARIABLES_DIR = path.join(__dirname, '../features/settings/printer/variables');
const MAPPERS_DIR = path.join(__dirname, '../lib/print-mappers');

// Map variable filenames to mapper filenames
// This is a heuristic mapping, might need adjustment
const FILE_MAPPING = {
  'don-ban-hang.ts': 'order.mapper.ts',
  'phieu-thu.ts': 'receipt.mapper.ts',
  'phieu-chi.ts': 'payment.mapper.ts',
  'phieu-nhap-kho.ts': 'stock-in.mapper.ts',
  'phieu-xuat-kho.ts': 'stock-out.mapper.ts', // Assuming this exists or similar
  'phieu-chuyen-hang.ts': 'stock-transfer.mapper.ts',
  'phieu-kiem-hang.ts': 'inventory-check.mapper.ts',
  'phieu-khieu-nai.ts': 'complaint.mapper.ts',
  'phieu-phat.ts': 'penalty.mapper.ts',
  'don-dat-hang-nhap.ts': 'purchase-order.mapper.ts',
  'don-doi-tra-hang.ts': 'sales-return.mapper.ts',
  'phieu-tra-hang-ncc.ts': 'supplier-return.mapper.ts',
  'phieu-bao-hanh.ts': 'warranty.mapper.ts',
  'phieu-don-tam-tinh.ts': 'quote.mapper.ts',
  'phieu-dong-goi.ts': 'packing.mapper.ts',
  'phieu-giao-hang.ts': 'delivery.mapper.ts',
  'nhan-giao-hang.ts': 'shipping-label.mapper.ts',
  'tem-phu-san-pham.ts': 'product-label.mapper.ts',
  
  // Extended templates
  'phieu-ban-giao.ts': 'handover.mapper.ts',
  'phieu-huong-dan-dong-goi.ts': 'packing-guide.mapper.ts',
  'phieu-tong-ket-ban-hang.ts': 'sales-summary.mapper.ts',
  'phieu-xac-nhan-hoan.ts': 'refund-confirmation.mapper.ts',
  'phieu-yeu-cau-bao-hanh.ts': 'warranty-request.mapper.ts',
  'phieu-yeu-cau-dong-goi.ts': 'packing-request.mapper.ts',
  'don-nhap-hang.ts': 'supplier-order.mapper.ts', // Assuming this maps to Supplier Order (Don nhap hang)
  'don-tra-hang.ts': 'return-order.mapper.ts', // Assuming this maps to Return Order (Don tra hang)
};

function extractVariableKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /key:\s*'({[^}]+})'/g;
  const keys = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.push(match[1]);
  }
  return keys;
}

function extractMapperKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Look for keys in the return object of the mapper function
  // This is a simple regex, might miss some if they are dynamically generated
  const regex = /'({[^}]+})':/g;
  const keys = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.push(match[1]);
  }

  // Check for getStoreData usage
  if (content.includes('getStoreData')) {
    keys.push('{store_logo}');
    keys.push('{store_name}');
    keys.push('{store_address}');
    keys.push('{store_phone_number}');
    keys.push('{store_email}');
    keys.push('{store_fax}');
  }

  return keys;
}

function checkMappings() {
  console.log('Checking print variable mappings...\n');
  
  const variableFiles = fs.readdirSync(VARIABLES_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  
  let totalMissing = 0;

  for (const varFile of variableFiles) {
    const mapperFile = FILE_MAPPING[varFile];
    if (!mapperFile) {
      console.log(`[WARN] No mapper mapping found for ${varFile}`);
      continue;
    }

    const varPath = path.join(VARIABLES_DIR, varFile);
    const mapperPath = path.join(MAPPERS_DIR, mapperFile);

    if (!fs.existsSync(mapperPath)) {
      console.log(`[ERROR] Mapper file not found: ${mapperFile} (for ${varFile})`);
      continue;
    }

    const definedKeys = extractVariableKeys(varPath);
    const mappedKeys = extractMapperKeys(mapperPath);
    
    const missingKeys = definedKeys.filter(key => !mappedKeys.includes(key));

    if (missingKeys.length > 0) {
      console.log(`\n❌ ${varFile} -> ${mapperFile}`);
      console.log(`   Missing ${missingKeys.length} mappings:`);
      missingKeys.forEach(k => console.log(`   - ${k}`));
      totalMissing += missingKeys.length;
    } else {
      console.log(`✅ ${varFile} -> ${mapperFile} (All ${definedKeys.length} keys mapped)`);
    }
  }

  console.log(`\nTotal missing mappings: ${totalMissing}`);
}

checkMappings();
