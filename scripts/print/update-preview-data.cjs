/**
 * Script tự động thêm các biến thiếu vào Preview Data
 * Đồng bộ Templates -> Preview Data
 */

const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '../features/settings/printer/templates');
const previewDir = path.join(__dirname, '../features/settings/printer/preview');

// Lấy tất cả biến từ template
function extractVars(content) {
  const matches = content.match(/\{[a-z_][a-z0-9_]*\}/gi) || [];
  return [...new Set(matches)];
}

// Lấy tất cả keys từ preview data
function extractPreviewKeys(content) {
  const matches = content.match(/'\{[a-z_][a-z0-9_]*\}'/gi) || [];
  return matches.map(m => m.slice(1, -1));
}

// Dữ liệu mẫu cho các biến phổ biến
const SAMPLE_VALUES = {
  // Account
  '{account_name}': 'Trần Văn B',
  '{assigned_employee}': 'Nguyễn Thị C',
  
  // Codes
  '{fulfillment_code}': 'FUL000123',
  '{shipment_code}': 'VD123456789',
  '{shipment_barcode}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
  '{shipment_qrcode}': '<img src="https://placehold.co/100x100?text=QR" alt="QR" style="width:100px"/>',
  '{tracking_number}': 'VD123456789',
  '{receipt_barcode}': '<img src="https://placehold.co/150x50?text=PT-BARCODE" alt="Barcode" style="height:50px"/>',
  '{payment_barcode}': '<img src="https://placehold.co/150x50?text=PC-BARCODE" alt="Barcode" style="height:50px"/>',
  '{order_supplier_code}': 'PO000456',
  
  // Customer/Receiver
  '{receiver_name}': 'Nguyễn Văn A',
  '{receiver_phone}': '0912 345 678',
  '{carrier_name}': 'Giao Hàng Nhanh',
  
  // Money
  '{total}': '500,000',
  '{delivery_fee}': '30,000',
  '{cod_amount}': '470,000',
  '{cod}': '470,000',
  '{discount}': '50,000',
  '{tax_vat}': '10%',
  '{total_tax}': '50,000',
  '{paid}': '1,000,000',
  '{remaining}': '500,000',
  
  // Quantities
  '{line_ordered_quantity}': '10',
  '{line_received_quantity}': '10',
  '{total_weight_g}': '500',
  '{total_weight_kg}': '0.5',
  
  // Status
  '{refund_status}': 'Đã hoàn tiền',
  
  // Notes
  '{description}': 'Thanh toán đơn hàng',
  '{note}': 'Gọi trước khi giao',
  '{packing_note}': 'Đóng gói cẩn thận',
  '{order_note}': 'Khách VIP - ưu tiên giao',
  
  // Location
  '{bin_location}': 'Kệ A1-02',
  
  // Time
  '{created_on_time}': '14:30',
  '{issued_on}': '05/12/2025',
  
  // Other
  '{price_list_name}': 'Bảng giá lẻ',
  '{reason_return}': 'Khách đổi size do mua nhầm',
};

// Map template file -> preview file
const FILE_MAP = {
  'delivery.ts': 'delivery.preview.ts',
  'inventory-check.ts': 'inventory-check.preview.ts',
  'order.ts': 'order.preview.ts',
  'packing.ts': 'packing.preview.ts',
  'payment.ts': 'payment.preview.ts',
  'purchase-order.ts': 'purchase-order.preview.ts',
  'quote.ts': 'quote.preview.ts',
  'receipt.ts': 'receipt.preview.ts',
  'sales-return.ts': 'sales-return.preview.ts',
  'shipping-label.ts': 'shipping-label.preview.ts',
  'stock-in.ts': 'stock-in.preview.ts',
  'stock-transfer.ts': 'stock-transfer.preview.ts',
  'supplier-return.ts': 'supplier-return.preview.ts',
  'warranty.ts': 'warranty.preview.ts',
};

console.log('='.repeat(80));
console.log('UPDATE PREVIEW DATA - Adding missing variables');
console.log('='.repeat(80));

let totalAdded = 0;

Object.entries(FILE_MAP).forEach(([templateFile, previewFile]) => {
  const templatePath = path.join(templatesDir, templateFile);
  const previewPath = path.join(previewDir, previewFile);
  
  if (!fs.existsSync(templatePath) || !fs.existsSync(previewPath)) {
    return;
  }
  
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  let previewContent = fs.readFileSync(previewPath, 'utf-8');
  
  const templateVars = extractVars(templateContent);
  const previewKeys = extractPreviewKeys(previewContent);
  
  // Tìm biến thiếu (loại bỏ store_, print_, hotline vì đã có trong shared)
  const missing = templateVars.filter(v => {
    if (v.startsWith('{store_') || v.startsWith('{print_') || v === '{hotline}') return false;
    if (v.startsWith('{location_')) return false; // Usually in shared
    return !previewKeys.includes(v);
  });
  
  if (missing.length === 0) return;
  
  console.log(`\n📄 ${previewFile}`);
  console.log(`   Adding ${missing.length} variables:`);
  
  // Tìm vị trí để thêm (trước dấu }; cuối cùng)
  const insertPoint = previewContent.lastIndexOf('};');
  if (insertPoint === -1) {
    console.log('   ⚠️  Could not find insertion point');
    return;
  }
  
  // Tạo các entry mới
  const newEntries = missing.map(v => {
    const value = SAMPLE_VALUES[v] || `[${v.slice(1, -1)}]`;
    console.log(`   + ${v}: '${value.substring(0, 30)}${value.length > 30 ? '...' : ''}'`);
    return `  '${v}': '${value}',`;
  }).join('\n');
  
  // Chèn vào trước };
  const before = previewContent.substring(0, insertPoint);
  const after = previewContent.substring(insertPoint);
  
  // Thêm comment và entries
  const addition = `\n  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===\n${newEntries}\n`;
  previewContent = before + addition + after;
  
  fs.writeFileSync(previewPath, previewContent, 'utf-8');
  totalAdded += missing.length;
});

console.log('\n' + '='.repeat(80));
console.log(`✅ Added ${totalAdded} variables to preview data files`);
console.log('='.repeat(80));
