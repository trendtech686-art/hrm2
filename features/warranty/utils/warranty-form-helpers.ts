import type { StagingFile } from '../../../lib/file-upload-api';
import type { WarrantyProduct } from '../types';

/**
 * Summary data cho warranty
 */
export interface WarrantySummaryData {
  totalProducts: number;
  totalReplaced: number;
  totalReturned: number;
  totalDeduction: number;
  totalOutOfStock: number;
  totalSettlement: number;
}

/**
 * Convert URL to StagingFile format
 */
export function urlToStagingFile(url: string, idx: number, prefix: string): StagingFile {
  const filename = url.split('/').pop() || `image-${idx}`;
  return {
    id: `${prefix}-${idx}`,
    sessionId: '',
    name: filename,
    originalName: filename,
    slug: filename,
    filename: filename,
    size: 0,
    type: 'image/jpeg',
    url,
    status: 'staging' as const,
    uploadedAt: new Date().toISOString(),
    metadata: '',
  };
}

/**
 * Calculate summary cho warranty form
 * Gộp "out_of_stock" và "deduct" thành "Hết hàng (Khấu trừ)"
 */
export function calculateWarrantySummary(products: WarrantyProduct[]): WarrantySummaryData {
  // Gộp "out_of_stock" và "deduct" thành "Hết hàng (Khấu trừ)"
  const outOfStockProducts = products.filter(p => p.resolution === 'out_of_stock' || p.resolution === 'deduct');
  
  const totalSettlement = outOfStockProducts.reduce((sum, p) => {
    if (p.resolution === 'deduct') return sum + (p.deductionAmount || 0);
    if (p.resolution === 'out_of_stock') return sum + ((p.quantity || 1) * (p.unitPrice || 0));
    return sum;
  }, 0);
  
  return {
    totalProducts: products.length,
    totalReplaced: products.filter(p => p.resolution === 'replace').reduce((sum, p) => sum + (p.quantity || 1), 0),
    totalReturned: products.filter(p => p.resolution === 'return').reduce((sum, p) => sum + (p.quantity || 1), 0),
    totalDeduction: totalSettlement, // Tổng tiền khấu trừ (gộp cả deduct + out_of_stock)
    totalOutOfStock: outOfStockProducts.reduce((sum, p) => sum + (p.quantity || 1), 0), // Số lượng SP hết hàng
    totalSettlement: totalSettlement,
  };
}

/**
 * Extract customer address from customer data
 */
export function extractCustomerAddress(customer: { addresses?: Array<{ street: string; ward: string; province: string }> } | null): string {
  if (!customer) return '';
  
  const selectedAddress = customer.addresses?.[0];
  return selectedAddress 
    ? `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.province}`
    : '';
}

/**
 * Get default form values cho warranty form
 */
export function getWarrantyFormDefaultValues() {
  return {
    id: '', // Mã phiếu bảo hành
    customer: null,
    branchSystemId: '',
    employeeSystemId: '',
    trackingCode: '',
    shippingFee: undefined,
    referenceUrl: '',
    externalReference: '',
    receivedImages: [] as string[],
    processedImages: [] as string[],
    products: [] as WarrantyProduct[],
    status: 'RECEIVED' as const,
    notes: '',
    settlementMethod: '',
    settlementAmount: 0,
    settlementBankAccount: '',
    settlementTransactionCode: '',
    settlementDueDate: '',
    settlementVoucherCode: '',
  };
}

/**
 * Tạo breadcrumb cho warranty form page
 */
export function getWarrantyFormBreadcrumb(
  isUpdateMode: boolean,
  isEditing: boolean,
  ticket?: { id: string; systemId: string } | null
) {
  if (isUpdateMode && ticket) {
    return [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Bảo hành', href: '/warranty', isCurrent: false },
      { label: ticket.id, href: `/warranty/${ticket.systemId}`, isCurrent: false },
      { label: 'Cập nhật thông tin', href: '', isCurrent: true },
    ];
  }
  
  if (isEditing && ticket) {
    return [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Bảo hành', href: '/warranty', isCurrent: false },
      { label: ticket.id, href: `/warranty/${ticket.systemId}`, isCurrent: false },
      { label: 'Chỉnh sửa', href: '', isCurrent: true },
    ];
  }
  
  return [
    { label: 'Trang chủ', href: '/', isCurrent: false },
    { label: 'Bảo hành', href: '/warranty', isCurrent: false },
    { label: 'Thêm mới', href: '', isCurrent: true },
  ];
}

/**
 * Tạo tiêu đề cho warranty form page
 */
export function getWarrantyFormTitle(
  isUpdateMode: boolean,
  isEditing: boolean,
  ticketId?: string
): string {
  if (isUpdateMode) {
    return `Cập nhật thông tin phiếu ${ticketId || ''}`;
  }
  if (isEditing && ticketId) {
    return `Chỉnh sửa phiếu ${ticketId}`;
  }
  return 'Thêm phiếu bảo hành mới';
}
