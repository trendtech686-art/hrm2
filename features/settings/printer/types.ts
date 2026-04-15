export type TemplateType = 
  | 'order' 
  | 'receipt' 
  | 'payment' 
  | 'warranty' 
  | 'inventory-check' 
  | 'stock-transfer'
  | 'sales-return'
  | 'sales-exchange'
  | 'purchase-order'
  | 'packing'
  | 'quote'
  | 'delivery'
  | 'shipping-label'
  | 'product-label'
  | 'stock-in'
  | 'supplier-return'
  | 'complaint'
  | 'penalty'
  | 'leave'
  | 'cost-adjustment'
  | 'price-adjustment'
  | 'handover'
  | 'payroll'
  | 'payslip'
  | 'attendance'
  // Extended types
  | 'supplier-order'
  | 'return-order'
  | 'refund-confirmation'
  | 'packing-guide'
  | 'sales-summary'
  | 'warranty-request'
  | 'packing-request'
  | 'stock-out'
  | 'sales-contract'
  | 'goods-handover-report'
  | 'customer-mark-label';

// Named paper sizes + any 'WxH' label sizes (e.g. '50x30', '100x75')
export type PaperSize = 'A4' | 'A5' | 'A6' | 'K80' | 'K57' | (string & {});

export type PrintOrientation = 'portrait' | 'landscape';

/** Parse label size string 'WxH' → { width, height } in mm */
export function parseLabelSize(size: string): { width: number; height: number } | null {
  const match = size.match(/^(\d+)x(\d+)$/);
  if (!match) return null;
  return { width: parseInt(match[1]), height: parseInt(match[2]) };
}

/** Check if a PaperSize is a label size (WxH format) */
export function isLabelSize(size: PaperSize): boolean {
  return /^\d+x\d+$/.test(size);
}

/** Common label sizes grouped by width (mm) — format: WxH (width × height) */
export const LABEL_SIZES: { label: string; sizes: { value: string; label: string }[] }[] = [
  {
    label: 'Tem nhỏ',
    sizes: [
      { value: '50x30', label: '50×30' },
    ],
  },
  {
    label: '40mm',
    sizes: [
      { value: '40x60', label: '40×60' },
      { value: '40x70', label: '40×70' },
      { value: '40x80', label: '40×80' },
      { value: '40x90', label: '40×90' },
    ],
  },
  {
    label: '45mm',
    sizes: [
      { value: '45x20', label: '45×20' },
      { value: '45x30', label: '45×30' },
      { value: '45x35', label: '45×35' },
      { value: '45x90', label: '45×90' },
    ],
  },
  {
    label: '50mm',
    sizes: [
      { value: '50x20', label: '50×20' },
      { value: '50x30', label: '50×30' },
      { value: '50x50', label: '50×50' },
      { value: '50x60', label: '50×60' },
      { value: '50x80', label: '50×80' },
    ],
  },
  {
    label: '60mm',
    sizes: [
      { value: '60x40', label: '60×40' },
      { value: '60x50', label: '60×50' },
      { value: '60x60', label: '60×60' },
      { value: '60x80', label: '60×80' },
    ],
  },
  {
    label: '70mm',
    sizes: [
      { value: '70x60', label: '70×60' },
      { value: '70x80', label: '70×80' },
    ],
  },
  {
    label: '80mm',
    sizes: [
      { value: '80x30', label: '80×30' },
      { value: '80x40', label: '80×40' },
      { value: '80x50', label: '80×50' },
      { value: '80x60', label: '80×60' },
      { value: '80x70', label: '80×70' },
      { value: '80x80', label: '80×80' },
    ],
  },
  {
    label: '100mm',
    sizes: [
      { value: '100x25', label: '100×25' },
      { value: '100x50', label: '100×50' },
      { value: '100x60', label: '100×60' },
      { value: '100x75', label: '100×75' },
      { value: '100x80', label: '100×80' },
      { value: '100x100', label: '100×100' },
      { value: '100x150', label: '100×150' },
      { value: '100x180', label: '100×180' },
    ],
  },
];

/** Flat list of all common label sizes */
export const ALL_LABEL_SIZES = LABEL_SIZES.flatMap(g => g.sizes);

export interface PrintMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const DEFAULT_MARGINS: Record<string, PrintMargins> = {
  label: { top: 1, right: 1, bottom: 1, left: 1 },
  document: { top: 15, right: 15, bottom: 15, left: 15 },
};

export interface PrintTemplate {
  id: string;
  type: TemplateType;
  name: string;
  content: string; // HTML content with variables
  paperSize: PaperSize;
  margins?: PrintMargins;
  isActive: boolean;
  updatedAt: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  description?: string;
  group?: string;
}

export const TEMPLATE_TYPES: { value: TemplateType; label: string }[] = [
  { value: 'order', label: 'Đơn bán hàng' },
  { value: 'quote', label: 'Phiếu đơn tạm tính' },
  { value: 'sales-return', label: 'Đơn đổi trả hàng' },
  { value: 'sales-exchange', label: 'Phiếu đổi hàng' },
  { value: 'packing', label: 'Phiếu đóng gói' },
  { value: 'delivery', label: 'Phiếu giao hàng' },
  { value: 'shipping-label', label: 'Nhãn giao hàng' },
  { value: 'product-label', label: 'Tem phụ sản phẩm' },
  { value: 'purchase-order', label: 'Đơn đặt hàng nhập' },
  { value: 'stock-in', label: 'Phiếu nhập kho' },
  { value: 'stock-transfer', label: 'Phiếu chuyển kho' },
  { value: 'inventory-check', label: 'Phiếu kiểm kho' },
  { value: 'cost-adjustment', label: 'Phiếu điều chỉnh giá vốn' },
  { value: 'price-adjustment', label: 'Phiếu điều chỉnh giá bán' },
  { value: 'receipt', label: 'Phiếu thu' },
  { value: 'payment', label: 'Phiếu chi' },
  { value: 'warranty', label: 'Phiếu bảo hành' },
  { value: 'supplier-return', label: 'Phiếu trả hàng NCC' },
  { value: 'complaint', label: 'Phiếu khiếu nại' },
  { value: 'penalty', label: 'Phiếu phạt' },
  { value: 'leave', label: 'Đơn nghỉ phép' },
  { value: 'handover', label: 'Phiếu bàn giao' },
  { value: 'payroll', label: 'Bảng lương' },
  { value: 'payslip', label: 'Phiếu lương' },
  { value: 'attendance', label: 'Bảng chấm công' },
  // Extended
  { value: 'supplier-order', label: 'Đơn đặt hàng NCC' },
  { value: 'return-order', label: 'Phiếu trả hàng' },
  { value: 'refund-confirmation', label: 'Phiếu xác nhận hoàn tiền' },
  { value: 'packing-guide', label: 'Hướng dẫn đóng gói' },
  { value: 'sales-summary', label: 'Báo cáo tổng kết bán hàng' },
  { value: 'warranty-request', label: 'Phiếu yêu cầu bảo hành' },
  { value: 'packing-request', label: 'Phiếu yêu cầu đóng gói' },
  { value: 'stock-out', label: 'Phiếu xuất kho' },
  { value: 'sales-contract', label: 'Hợp đồng mua bán' },
  { value: 'goods-handover-report', label: 'Biên bản giao nhận hàng hóa' },
  { value: 'customer-mark-label', label: 'Tem đánh dấu khách hàng' },
];

export const PAPER_SIZES: { value: PaperSize; label: string }[] = [
  { value: 'A4', label: 'Khổ A4' },
  { value: 'A5', label: 'Khổ A5' },
  { value: 'A6', label: 'Khổ A6' },
  { value: 'K80', label: 'Khổ K80 (Máy in nhiệt)' },
  { value: 'K57', label: 'Khổ K57 (Máy in nhiệt nhỏ)' },
  ...ALL_LABEL_SIZES.map(s => ({ value: s.value, label: `Khổ ${s.label}mm` })),
];
