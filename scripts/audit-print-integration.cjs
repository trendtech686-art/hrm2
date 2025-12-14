/**
 * Script kiểm tra tích hợp in ấn toàn diện
 * 
 * Kiểm tra 3 lớp:
 * 1. Variables (định nghĩa biến) vs Mappers (map data)
 * 2. Detail Pages (gọi print) vs Mappers (có import và sử dụng đúng không)
 * 3. Template Types consistency (tên template nhất quán)
 */

const fs = require('fs');
const path = require('path');

// Paths
const VARIABLES_DIR = path.join(__dirname, '../features/settings/printer/variables');
const MAPPERS_DIR = path.join(__dirname, '../lib/print-mappers');
const FEATURES_DIR = path.join(__dirname, '../features');

// Template type mapping
const TEMPLATE_CONFIG = {
  'order': {
    variableFile: 'don-ban-hang.ts',
    mapperFile: 'order.mapper.ts',
    detailPage: 'features/orders/order-detail-page.tsx',
    mapperFn: 'mapOrderToPrintData'
  },
  'sales-return': {
    variableFile: 'don-doi-tra-hang.ts',
    mapperFile: 'sales-return.mapper.ts',
    detailPage: 'features/sales-returns/detail-page.tsx',
    mapperFn: 'mapSalesReturnToPrintData'
  },
  'don-tra-hang': {
    variableFile: 'don-tra-hang.ts',
    mapperFile: 'return-order.mapper.ts',
    detailPage: null, // Không có trang riêng - BUG!
    mapperFn: 'mapReturnOrderToPrintData'
  },
  'receipt': {
    variableFile: 'phieu-thu.ts',
    mapperFile: 'receipt.mapper.ts',
    detailPage: 'features/orders/components/payment-info.tsx',
    mapperFn: 'mapReceiptToPrintData'
  },
  'payment': {
    variableFile: 'phieu-chi.ts',
    mapperFile: 'payment.mapper.ts',
    detailPage: 'features/orders/components/payment-info.tsx',
    mapperFn: 'mapPaymentToPrintData'
  },
  'warranty': {
    variableFile: 'phieu-bao-hanh.ts',
    mapperFile: 'warranty.mapper.ts',
    detailPage: 'features/warranty/warranty-detail-page.tsx',
    mapperFn: 'mapWarrantyToPrintData'
  },
  'stock-transfer': {
    variableFile: 'phieu-chuyen-hang.ts',
    mapperFile: 'stock-transfer.mapper.ts',
    detailPage: 'features/stock-transfers/detail-page.tsx',
    mapperFn: 'mapStockTransferToPrintData'
  },
  'stock-in': {
    variableFile: 'phieu-nhap-kho.ts',
    mapperFile: 'stock-in.mapper.ts',
    detailPage: 'features/inventory-receipts/detail-page.tsx',
    mapperFn: 'mapStockInToPrintData'
  },
  'inventory-check': {
    variableFile: 'phieu-kiem-hang.ts',
    mapperFile: 'inventory-check.mapper.ts',
    detailPage: 'features/inventory-checks/detail-page.tsx',
    mapperFn: 'mapInventoryCheckToPrintData'
  },
  'purchase-order': {
    variableFile: 'don-dat-hang-nhap.ts',
    mapperFile: 'purchase-order.mapper.ts',
    detailPage: 'features/purchase-orders/detail-page.tsx',
    mapperFn: 'mapPurchaseOrderToPrintData'
  },
  'supplier-return': {
    variableFile: 'phieu-tra-hang-ncc.ts',
    mapperFile: 'supplier-return.mapper.ts',
    detailPage: 'features/purchase-returns/detail-page.tsx',
    mapperFn: 'mapSupplierReturnToPrintData'
  },
  'packing': {
    variableFile: 'phieu-dong-goi.ts',
    mapperFile: 'packing.mapper.ts',
    detailPage: 'features/packaging/detail-page.tsx',
    mapperFn: 'mapPackingToPrintData'
  },
  'delivery': {
    variableFile: 'phieu-giao-hang.ts',
    mapperFile: 'delivery.mapper.ts',
    detailPage: 'features/shipments/detail-page.tsx',
    mapperFn: 'mapDeliveryToPrintData'
  },
  'shipping-label': {
    variableFile: 'nhan-giao-hang.ts',
    mapperFile: 'shipping-label.mapper.ts',
    detailPage: 'features/shipments/detail-page.tsx',
    mapperFn: 'mapShippingLabelToPrintData'
  },
  'complaint': {
    variableFile: 'phieu-khieu-nai.ts',
    mapperFile: 'complaint.mapper.ts',
    detailPage: 'features/complaints/detail-page.tsx',
    mapperFn: 'mapComplaintToPrintData'
  },
  'quote': {
    variableFile: 'phieu-don-tam-tinh.ts',
    mapperFile: 'quote.mapper.ts',
    detailPage: null, // Chưa có - cần tạo
    mapperFn: 'mapQuoteToPrintData'
  },
  'penalty': {
    variableFile: 'phieu-phat.ts',
    mapperFile: 'penalty.mapper.ts',
    detailPage: null, // Chưa có
    mapperFn: 'mapPenaltyToPrintData'
  },
  'handover': {
    variableFile: 'phieu-ban-giao.ts',
    mapperFile: 'handover.mapper.ts',
    detailPage: null, // Chưa có
    mapperFn: 'mapHandoverToPrintData'
  },
  'product-label': {
    variableFile: 'tem-phu-san-pham.ts',
    mapperFile: 'product-label.mapper.ts',
    detailPage: 'features/products/page.tsx',
    mapperFn: 'mapProductLabelToPrintData'
  },
};

// Helper functions
function extractVariableKeys(filePath) {
  if (!fs.existsSync(filePath)) return [];
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
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /'({[^}]+})':/g;
  const keys = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.push(match[1]);
  }

  // Check for getStoreData usage
  if (content.includes('getStoreData')) {
    keys.push('{store_logo}', '{store_name}', '{store_address}', '{store_phone_number}', '{store_email}', '{store_fax}');
  }

  return [...new Set(keys)];
}

function checkDetailPageIntegration(detailPagePath, templateType, mapperFn) {
  const fullPath = path.join(__dirname, '..', detailPagePath);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, issues: [`File không tồn tại: ${detailPagePath}`] };
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const issues = [];

  // Check 1: Có import usePrint không?
  if (!content.includes('usePrint')) {
    issues.push('Chưa import usePrint hook');
  }

  // Check 2: Có gọi print() với đúng template type không?
  const printCallRegex = new RegExp(`print\\s*\\(\\s*['"]${templateType}['"]`, 'g');
  if (!printCallRegex.test(content)) {
    // Kiểm tra xem có gọi print với template khác không
    const anyPrintCall = content.match(/print\s*\(\s*['"]([^'"]+)['"]/g);
    if (anyPrintCall) {
      const calledTypes = anyPrintCall.map(p => p.match(/['"]([^'"]+)['"]/)[1]);
      issues.push(`Gọi print với template khác: ${calledTypes.join(', ')} (expected: ${templateType})`);
    } else {
      issues.push(`Không tìm thấy lệnh gọi print('${templateType}', ...)`);
    }
  }

  // Check 3: Có import mapper function không?
  if (mapperFn && !content.includes(mapperFn)) {
    issues.push(`Chưa import/sử dụng mapper: ${mapperFn}`);
  }

  // Check 4: Có handlePrint function không?
  if (!content.includes('handlePrint')) {
    issues.push('Không có hàm handlePrint');
  }

  return { exists: true, issues };
}

function runAudit() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║       KIỂM TRA TÍCH HỢP IN ẤN TOÀN DIỆN                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const results = {
    passed: [],
    warnings: [],
    errors: []
  };

  for (const [templateType, config] of Object.entries(TEMPLATE_CONFIG)) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📋 Template: ${templateType}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    const templateIssues = [];

    // Check 1: Variable file
    const varPath = path.join(VARIABLES_DIR, config.variableFile);
    if (!fs.existsSync(varPath)) {
      templateIssues.push(`❌ Variable file không tồn tại: ${config.variableFile}`);
    } else {
      console.log(`   ✅ Variables: ${config.variableFile}`);
    }

    // Check 2: Mapper file
    const mapperPath = path.join(MAPPERS_DIR, config.mapperFile);
    if (!fs.existsSync(mapperPath)) {
      templateIssues.push(`❌ Mapper file không tồn tại: ${config.mapperFile}`);
    } else {
      console.log(`   ✅ Mapper: ${config.mapperFile}`);
    }

    // Check 3: Variables vs Mapper keys
    if (fs.existsSync(varPath) && fs.existsSync(mapperPath)) {
      const varKeys = extractVariableKeys(varPath);
      const mapperKeys = extractMapperKeys(mapperPath);
      const missingInMapper = varKeys.filter(k => !mapperKeys.includes(k));
      
      if (missingInMapper.length > 0) {
        templateIssues.push(`⚠️  ${missingInMapper.length} biến chưa được map: ${missingInMapper.slice(0, 5).join(', ')}${missingInMapper.length > 5 ? '...' : ''}`);
      } else {
        console.log(`   ✅ Mapping: ${varKeys.length}/${varKeys.length} biến`);
      }
    }

    // Check 4: Detail page integration
    if (!config.detailPage) {
      templateIssues.push(`⚠️  Chưa có trang chi tiết tích hợp print`);
    } else {
      const pageCheck = checkDetailPageIntegration(config.detailPage, templateType, config.mapperFn);
      if (!pageCheck.exists) {
        templateIssues.push(`❌ ${pageCheck.issues[0]}`);
      } else if (pageCheck.issues.length > 0) {
        pageCheck.issues.forEach(issue => {
          templateIssues.push(`⚠️  ${issue}`);
        });
      } else {
        console.log(`   ✅ Detail Page: ${config.detailPage}`);
      }
    }

    // Summary for this template
    if (templateIssues.length === 0) {
      results.passed.push(templateType);
      console.log(`   🎉 PASSED`);
    } else {
      templateIssues.forEach(issue => console.log(`   ${issue}`));
      if (templateIssues.some(i => i.startsWith('❌'))) {
        results.errors.push({ type: templateType, issues: templateIssues });
      } else {
        results.warnings.push({ type: templateType, issues: templateIssues });
      }
    }
  }

  // Final Summary
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                        TỔNG KẾT                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log(`\n   ✅ Passed: ${results.passed.length} templates`);
  console.log(`   ⚠️  Warnings: ${results.warnings.length} templates`);
  console.log(`   ❌ Errors: ${results.errors.length} templates`);

  if (results.errors.length > 0) {
    console.log('\n   ❌ Templates có lỗi:');
    results.errors.forEach(e => {
      console.log(`      - ${e.type}`);
    });
  }

  if (results.warnings.length > 0) {
    console.log('\n   ⚠️  Templates cần chú ý:');
    results.warnings.forEach(w => {
      console.log(`      - ${w.type}`);
    });
  }

  return results;
}

// Run audit
runAudit();
