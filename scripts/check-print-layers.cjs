const fs = require('fs');
const path = require('path');

// Lớp 1: Variables
const varsDir = 'd:/hrm2/features/settings/printer/variables';
const varFiles = fs.readdirSync(varsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

// Lớp 2: Mappers
const mapperDir = 'd:/hrm2/lib/print-mappers';
const mapperFiles = fs.readdirSync(mapperDir).filter(f => f.endsWith('.mapper.ts'));

// Lớp 3: Print Helpers
const printDir = 'd:/hrm2/lib/print';
let helpers = [];
if (fs.existsSync(printDir)) {
    helpers = fs.readdirSync(printDir).filter(f => f.endsWith('-print-helper.ts'));
}

// Mapping tên biến -> mapper -> helper
const mapping = {
    'don-ban-hang': { mapper: 'order', helper: 'order', desc: 'Đơn bán hàng' },
    'don-dat-hang-nhap': { mapper: 'purchase-order', helper: 'purchase-order', desc: 'Đơn đặt hàng nhập' },
    'don-doi-tra-hang': { mapper: 'return-order', helper: 'return-order', desc: 'Đơn đổi trả hàng' },
    'don-nhap-hang': { mapper: 'stock-in', helper: 'stock-in', desc: 'Đơn nhập hàng' },
    'don-tra-hang': { mapper: 'sales-return', helper: 'sales-return', desc: 'Phiếu trả hàng' },
    'nhan-giao-hang': { mapper: 'shipping-label', helper: 'order', desc: 'Nhãn giao hàng' },
    'phieu-ban-giao': { mapper: 'handover', helper: 'shipment', desc: 'Phiếu bàn giao' },
    'phieu-bao-hanh': { mapper: 'warranty', helper: 'warranty', desc: 'Phiếu bảo hành' },
    'phieu-chi': { mapper: 'payment', helper: 'payment', desc: 'Phiếu chi' },
    'phieu-chuyen-hang': { mapper: 'stock-transfer', helper: 'stock-transfer', desc: 'Phiếu chuyển kho' },
    'phieu-don-tam-tinh': { mapper: 'quote', helper: 'quote', desc: 'Phiếu đơn tạm tính' },
    'phieu-dong-goi': { mapper: 'packing', helper: 'order', desc: 'Phiếu đóng gói' },
    'phieu-giao-hang': { mapper: 'delivery', helper: 'order', desc: 'Phiếu giao hàng' },
    'phieu-huong-dan-dong-goi': { mapper: 'packing-guide', helper: 'order', desc: 'Hướng dẫn đóng gói' },
    'phieu-khieu-nai': { mapper: 'complaint', helper: 'complaint', desc: 'Phiếu khiếu nại' },
    'phieu-kiem-hang': { mapper: 'inventory-check', helper: 'inventory-check', desc: 'Phiếu kiểm hàng' },
    'phieu-nhap-kho': { mapper: 'stock-in', helper: 'stock-in', desc: 'Phiếu nhập kho' },
    'phieu-phat': { mapper: 'penalty', helper: 'penalty', desc: 'Phiếu phạt' },
    'phieu-thu': { mapper: 'receipt', helper: 'receipt', desc: 'Phiếu thu' },
    'phieu-tong-ket-ban-hang': { mapper: 'sales-summary', helper: 'sales-summary', desc: 'Tổng kết bán hàng' },
    'phieu-tra-hang-ncc': { mapper: 'supplier-return', helper: 'supplier-return', desc: 'Trả hàng NCC' },
    'phieu-xac-nhan-hoan': { mapper: 'refund-confirmation', helper: 'refund', desc: 'Xác nhận hoàn' },
    'phieu-yeu-cau-bao-hanh': { mapper: 'warranty-request', helper: 'warranty', desc: 'Yêu cầu bảo hành' },
    'phieu-yeu-cau-dong-goi': { mapper: 'packing-request', helper: 'order', desc: 'Yêu cầu đóng gói' },
    'tem-phu-san-pham': { mapper: 'product-label', helper: 'product', desc: 'Tem phụ sản phẩm' },
};

console.log('\n=== KIỂM TRA 4 LỚP HỆ THỐNG IN ===\n');
console.log('Lớp 1: Variables (features/settings/printer/variables/*.ts)');
console.log('Lớp 2: Mappers (lib/print-mappers/*.mapper.ts)');
console.log('Lớp 3: Helpers (lib/print/*-print-helper.ts)');
console.log('Lớp 4: Page Integration (gọi usePrint hook)\n');

console.log('| STT | Loại phiếu               | Lớp1 | Lớp2 | Lớp3 | Ghi chú      |');
console.log('|-----|--------------------------|------|------|------|--------------|');

let idx = 1;
let missing = [];
for (const [varName, info] of Object.entries(mapping)) {
    const hasVar = varFiles.includes(varName + '.ts');
    const hasMapper = mapperFiles.includes(info.mapper + '.mapper.ts');
    const hasHelper = helpers.includes(info.helper + '-print-helper.ts');
    
    const v = hasVar ? '✅' : '❌';
    const m = hasMapper ? '✅' : '❌';
    const h = hasHelper ? '✅' : '❌';
    
    let note = '';
    if (!hasHelper) {
        note = `Cần: ${info.helper}-print-helper.ts`;
        missing.push({ varName, helper: info.helper, desc: info.desc });
    }
    
    console.log(`| ${idx.toString().padStart(2)}  | ${info.desc.padEnd(24)} | ${v}   | ${m}   | ${h}   | ${note.substring(0, 30)} |`);
    idx++;
}

console.log('\n=== THỐNG KÊ ===');
console.log(`Variables: ${varFiles.length} files`);
console.log(`Mappers: ${mapperFiles.length} files`);
console.log(`Helpers: ${helpers.length} files`);

console.log('\n=== HELPERS HIỆN CÓ ===');
helpers.forEach(h => console.log(`  - ${h}`));

console.log('\n=== CẦN TẠO THÊM HELPERS ===');
const uniqueHelpers = [...new Set(missing.map(m => m.helper))];
uniqueHelpers.forEach(h => {
    if (h !== 'order') { // order đã có
        console.log(`  - lib/print/${h}-print-helper.ts`);
    }
});
