export type TemplateType = 
  | 'order' 
  | 'receipt' 
  | 'payment' 
  | 'warranty' 
  | 'inventory-check' 
  | 'stock-transfer'
  | 'sales-return'
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
  | 'handover'
  | 'payroll'
  | 'payslip'
  | 'attendance';

export type PaperSize = 'A4' | 'A5' | 'A6' | 'K80' | 'K57';

export interface PrintTemplate {
  id: string;
  type: TemplateType;
  name: string;
  content: string; // HTML content with variables
  paperSize: PaperSize;
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
  { value: 'packing', label: 'Phiếu đóng gói' },
  { value: 'delivery', label: 'Phiếu giao hàng' },
  { value: 'shipping-label', label: 'Nhãn giao hàng' },
  { value: 'product-label', label: 'Tem phụ sản phẩm' },
  { value: 'purchase-order', label: 'Đơn đặt hàng nhập' },
  { value: 'stock-in', label: 'Phiếu nhập kho' },
  { value: 'stock-transfer', label: 'Phiếu chuyển kho' },
  { value: 'inventory-check', label: 'Phiếu kiểm kho' },
  { value: 'cost-adjustment', label: 'Phiếu điều chỉnh giá vốn' },
  { value: 'receipt', label: 'Phiếu thu' },
  { value: 'payment', label: 'Phiếu chi' },
  { value: 'warranty', label: 'Phiếu bảo hành' },
  { value: 'supplier-return', label: 'Phiếu trả hàng NCC' },
  { value: 'complaint', label: 'Phiếu khiếu nại' },
  { value: 'penalty', label: 'Phiếu phạt' },
  { value: 'payroll', label: 'Bảng lương' },
  { value: 'payslip', label: 'Phiếu lương' },
  { value: 'attendance', label: 'Bảng chấm công' },
];

export const PAPER_SIZES: { value: PaperSize; label: string }[] = [
  { value: 'A4', label: 'Khổ A4' },
  { value: 'A5', label: 'Khổ A5' },
  { value: 'A6', label: 'Khổ A6' },
  { value: 'K80', label: 'Khổ K80 (Máy in nhiệt)' },
  { value: 'K57', label: 'Khổ K57 (Máy in nhiệt nhỏ)' },
];
