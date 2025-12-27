/**
 * Auto-update Print Variables from Templates
 * 
 * Script này:
 * 1. Đọc tất cả placeholders từ Templates
 * 2. Thêm missing variables vào Variables files
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

// Label mappings for common variables
const LABEL_MAP = {
  '{account_name}': 'Người tạo',
  '{line_total}': 'Thành tiền',
  '{note}': 'Ghi chú',
  '{reason_return}': 'Lý do trả hàng',
  '{refund_status}': 'Trạng thái hoàn tiền',
  '{assigned_employee}': 'Nhân viên được gán',
  '{bin_location}': 'Vị trí kho',
  '{cod}': 'Tiền thu hộ (COD)',
  '{fulfillment_code}': 'Mã giao hàng',
  '{packing_note}': 'Ghi chú đóng gói',
  '{shipment_barcode}': 'Mã vạch vận đơn',
  '{shipment_code}': 'Mã vận đơn',
  '{shipment_qrcode}': 'QR code vận đơn',
  '{total_weight_g}': 'Tổng khối lượng (g)',
  '{total_weight_kg}': 'Tổng khối lượng (kg)',
  '{discount}': 'Chiết khấu',
  '{line_ordered_quantity}': 'Số lượng đặt',
  '{line_product_name}': 'Tên sản phẩm',
  '{line_variant}': 'Phiên bản sản phẩm',
  '{supplier_phone_number}': 'SĐT nhà cung cấp',
  '{tax_vat}': 'Thuế VAT',
  '{total_order}': 'Tổng đơn hàng',
  '{total}': 'Tổng cộng',
  '{line_received_quantity}': 'Số lượng nhận',
  '{order_supplier_code}': 'Mã đơn nhà cung cấp',
  '{paid}': 'Đã thanh toán',
  '{remaining}': 'Còn lại',
  '{stock_in_code}': 'Mã phiếu nhập kho',
  '{stock_in_status}': 'Trạng thái nhập kho',
  '{target_location_name}': 'Chi nhánh nhận',
  '{transfer_code}': 'Mã phiếu chuyển kho',
  '{inventory_code}': 'Mã phiếu kiểm kho',
  '{inventory_status}': 'Trạng thái kiểm kho',
  '{line_difference}': 'Chênh lệch',
  '{line_note}': 'Ghi chú sản phẩm',
  '{line_on_hand}': 'Tồn kho hiện tại',
  '{line_real_quantity}': 'Số lượng thực tế',
  '{total_items}': 'Tổng số mặt hàng',
  '{total_shortage}': 'Tổng thiếu',
  '{total_surplus}': 'Tổng thừa',
  '{amount_text}': 'Số tiền bằng chữ',
  '{description}': 'Diễn giải',
  '{payment_method}': 'Phương thức thanh toán',
  '{receipt_barcode}': 'Mã vạch phiếu thu',
  '{payment_barcode}': 'Mã vạch phiếu chi',
  '{customer_address}': 'Địa chỉ khách hàng',
  '{product_name}': 'Tên sản phẩm',
  '{serial_number}': 'Số serial',
  '{warranty_code}': 'Mã phiếu bảo hành',
  '{warranty_duration}': 'Thời hạn bảo hành',
  '{warranty_expired_on}': 'Ngày hết bảo hành',
  '{line_variant_code}': 'Mã phiên bản',
  '{refunded}': 'Đã hoàn tiền',
  '{return_supplier_code}': 'Mã phiếu trả NCC',
  '{supplier_address}': 'Địa chỉ NCC',
  '{supplier_email}': 'Email NCC',
  '{bank_account_name}': 'Tên tài khoản ngân hàng',
  '{bank_account}': 'Số tài khoản',
  '{bank_branch}': 'Chi nhánh ngân hàng',
  '{bank_name}': 'Tên ngân hàng',
  '{created_on_time}': 'Giờ tạo',
  '{created_on}': 'Ngày tạo',
  '{customer_name}': 'Tên khách hàng',
  '{customer_phone_number}': 'SĐT khách hàng',
  '{order_date}': 'Ngày đặt hàng',
  '{refund_amount_text}': 'Số tiền hoàn bằng chữ',
  '{refund_amount}': 'Số tiền hoàn',
  '{refund_code}': 'Mã phiếu hoàn',
  '{refund_method}': 'Phương thức hoàn tiền',
  '{refund_reason}': 'Lý do hoàn tiền',
  '{refunded_on}': 'Ngày hoàn tiền',
  '{return_code}': 'Mã đơn trả hàng',
  '{return_date}': 'Ngày trả hàng',
  '{bank_transfer_amount}': 'Tiền chuyển khoản',
  '{card_amount}': 'Tiền thẻ',
  '{cash_amount}': 'Tiền mặt',
  '{cod_amount}': 'Tiền COD',
  '{delivery_revenue}': 'Doanh thu giao hàng',
  '{ewallet_amount}': 'Tiền ví điện tử',
  '{from_date}': 'Từ ngày',
  '{line_amount}': 'Thành tiền',
  '{line_quantity}': 'Số lượng',
  '{line_stt}': 'STT',
  '{period}': 'Kỳ báo cáo',
  '{sales_revenue}': 'Doanh thu bán hàng',
  '{to_date}': 'Đến ngày',
  '{total_collected}': 'Tổng thu',
  '{total_discount}': 'Tổng chiết khấu',
  '{total_orders}': 'Tổng số đơn',
  '{total_returns}': 'Tổng trả hàng',
  '{total_revenue}': 'Tổng doanh thu',
  '{total_tax}': 'Tổng thuế',
  '{order_code}': 'Mã đơn hàng',
  '{shipping_address}': 'Địa chỉ giao hàng',
  '{total_quantity}': 'Tổng số lượng',
  '{carrier_name}': 'Tên đơn vị vận chuyển',
  '{deadline}': 'Hạn hoàn thành',
  '{packing_request_code}': 'Mã yêu cầu đóng gói',
  '{priority}': 'Độ ưu tiên',
  '{service_name}': 'Tên dịch vụ',
  '{special_request}': 'Yêu cầu đặc biệt',
  '{total_weight}': 'Tổng khối lượng',
  '{accessories}': 'Phụ kiện kèm theo',
  '{customer_code}': 'Mã khách hàng',
  '{customer_email}': 'Email khách hàng',
  '{device_condition}': 'Tình trạng thiết bị',
  '{expected_completion_date}': 'Ngày dự kiến hoàn thành',
  '{issue_description}': 'Mô tả sự cố',
  '{issue_type}': 'Loại sự cố',
  '{product_code}': 'Mã sản phẩm',
  '{purchase_date}': 'Ngày mua',
  '{received_by}': 'Người tiếp nhận',
  '{status}': 'Trạng thái',
  '{technician_name}': 'Kỹ thuật viên',
  '{warranty_request_code}': 'Mã yêu cầu bảo hành',
  '{reason}': 'Lý do',
  '{total_text}': 'Tổng tiền bằng chữ',
};

// Group mappings
const GROUP_MAP = {
  'line_': 'Chi tiết sản phẩm',
  'store_': 'Thông tin cửa hàng',
  'customer_': 'Thông tin khách hàng',
  'supplier_': 'Thông tin nhà cung cấp',
  'total': 'Tổng kết',
  'amount': 'Tổng kết',
  'discount': 'Tổng kết',
  'bank_': 'Thông tin thanh toán',
  'payment': 'Thông tin thanh toán',
  'refund': 'Thông tin hoàn tiền',
  'return': 'Thông tin trả hàng',
  'warranty': 'Thông tin bảo hành',
  'shipment': 'Thông tin vận chuyển',
  'shipping': 'Thông tin vận chuyển',
  'order': 'Thông tin đơn hàng',
  'inventory': 'Thông tin kiểm kho',
  'stock': 'Thông tin kho',
  'transfer': 'Thông tin chuyển kho',
  'packing': 'Thông tin đóng gói',
};

function getLabel(key) {
  if (LABEL_MAP[key]) return LABEL_MAP[key];
  const name = key.replace(/[{}]/g, '');
  const words = name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(' ');
}

function getGroup(key) {
  const name = key.replace(/[{}]/g, '');
  for (const [prefix, group] of Object.entries(GROUP_MAP)) {
    if (name.startsWith(prefix) || name.includes(prefix)) {
      return group;
    }
  }
  return 'Thông tin khác';
}

function extractPlaceholders(content) {
  const regex = /\{[a-z_:()0-9]+\}/gi;
  const matches = content.match(regex) || [];
  return [...new Set(matches)].sort();
}

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
console.log('AUTO-UPDATE: Adding missing variables to files');
console.log('='.repeat(80));

let totalAdded = 0;

for (const [templateFile, variableFile] of Object.entries(MAPPING)) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  const variablePath = path.join(VARIABLES_DIR, variableFile);
  
  if (!fs.existsSync(templatePath) || !fs.existsSync(variablePath)) continue;
  
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  let variableContent = fs.readFileSync(variablePath, 'utf-8');
  
  const templateKeys = extractPlaceholders(templateContent);
  const variableKeys = extractVariableKeys(variableContent);
  
  // Find missing (in template but not in variables, excluding store vars)
  const missing = templateKeys.filter(k => !variableKeys.has(k) && !STORE_VARS.has(k));
  
  if (missing.length > 0) {
    console.log(`\n📄 ${variableFile}: Adding ${missing.length} variables`);
    
    // Generate new variable entries
    const newEntries = missing.map(key => {
      return `  { key: '${key}', label: '${getLabel(key)}', group: '${getGroup(key)}' },`;
    });
    
    // Find the position before the closing ];
    const insertPos = variableContent.lastIndexOf('];');
    if (insertPos > 0) {
      // Add a comment section for new vars
      const newSection = `\n  // === TỰ ĐỘNG THÊM TỪ TEMPLATE ===\n${newEntries.join('\n')}\n`;
      variableContent = variableContent.slice(0, insertPos) + newSection + variableContent.slice(insertPos);
      
      fs.writeFileSync(variablePath, variableContent);
      console.log(`   ✅ Added: ${missing.join(', ')}`);
      totalAdded += missing.length;
    }
  }
}

console.log('\n' + '='.repeat(80));
console.log(`COMPLETE: Added ${totalAdded} variables total`);
console.log('='.repeat(80));
