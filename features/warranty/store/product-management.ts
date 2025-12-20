import { getCurrentDate, toISODateTime } from '../../../lib/date-utils';
import { asSystemId } from '../../../lib/id-types';
import type { SystemId } from '../../../lib/id-types';
import type { WarrantyProduct, WarrantyHistory, WarrantyTicket } from '../types';
import { baseStore, originalUpdate, getCurrentUserName } from './base-store';
import { commitWarrantyStock, uncommitWarrantyStock } from './stock-management';

/**
 * Tính summary từ danh sách sản phẩm
 */
export function calculateSummary(products: WarrantyProduct[]) {
  const outOfStockProducts = products.filter(p => p.resolution === 'out_of_stock' || p.resolution === 'deduct');
  
  const totalSettlement = outOfStockProducts.reduce((sum, p) => {
    if (p.resolution === 'deduct') return sum + (p.deductionAmount || 0);
    if (p.resolution === 'out_of_stock') return sum + ((p.quantity || 1) * (p.unitPrice || 0));
    return sum;
  }, 0);
  
  return {
    totalProducts: products.reduce((sum, p) => sum + (p.quantity || 1), 0),
    totalReplaced: products.filter(p => p.resolution === 'replace').reduce((sum, p) => sum + (p.quantity || 1), 0),
    totalReturned: products.filter(p => p.resolution === 'return').reduce((sum, p) => sum + (p.quantity || 1), 0),
    totalDeduction: totalSettlement,
    totalOutOfStock: outOfStockProducts.reduce((sum, p) => sum + (p.quantity || 1), 0),
    totalSettlement: totalSettlement,
  };
}

function adjustReplacementStock(
  ticket: WarrantyTicket,
  previousProduct?: WarrantyProduct,
  nextProduct?: WarrantyProduct
) {
  if (!ticket) return;

  const previousQty = previousProduct?.resolution === 'replace' ? (previousProduct.quantity || 1) : 0;
  const nextQty = nextProduct?.resolution === 'replace' ? (nextProduct.quantity || 1) : 0;

  if (previousQty === nextQty) {
    return;
  }

  const diff = Math.abs(nextQty - previousQty);
  const referenceProduct = nextQty > previousQty ? nextProduct : previousProduct;
  if (!referenceProduct || diff <= 0) return;

  const tempProduct: WarrantyProduct = {
    ...referenceProduct,
    quantity: diff,
  };

  const tempTicket = {
    ...ticket,
    products: [tempProduct],
  } as WarrantyTicket;

  if (nextQty > previousQty) {
    commitWarrantyStock(tempTicket);
  } else {
    uncommitWarrantyStock(tempTicket, { silent: true });
  }
}

/**
 * Thêm sản phẩm vào phiếu bảo hành
 */
export function addProduct(ticketSystemId: SystemId, product: Omit<WarrantyProduct, 'systemId'>) {
  const ticket = baseStore.getState().data.find(t => t.systemId === ticketSystemId);
  if (!ticket) return;
  
  const newProduct: WarrantyProduct = {
    ...product,
    systemId: asSystemId(`WP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  };

  adjustReplacementStock(ticket, undefined, newProduct);
  
  const updatedProducts = [...ticket.products, newProduct];
  const summary = calculateSummary(updatedProducts);
  
  originalUpdate(ticketSystemId, {
    ...ticket,
    products: updatedProducts,
    summary,
    updatedAt: toISODateTime(getCurrentDate()),
  } as any);
  
  // Add history
  const resolutionLabels: Record<string, string> = {
    replace: 'Thay thế',
    refund: 'Hoàn tiền',
    deduct: 'Trừ tiền',
    warranty_extension: 'Gia hạn BH',
    no_warranty: 'Không BH',
    out_of_stock: 'Hết hàng',
    return: 'Trả hàng'
  };
  const resolution = resolutionLabels[newProduct.resolution] || newProduct.resolution;
  const quantity = newProduct.quantity || 1;
  
  addHistory(ticketSystemId, `Thêm SP: ${newProduct.productName} (${resolution}, SL: ${quantity})`, getCurrentUserName());
}

/**
 * Cập nhật sản phẩm trong phiếu
 */
export function updateProduct(ticketSystemId: SystemId, productSystemId: SystemId, updates: Partial<WarrantyProduct>) {
  const ticket = baseStore.getState().data.find(t => t.systemId === ticketSystemId);
  if (!ticket) return;
  const originalProduct = ticket.products.find(p => p.systemId === productSystemId);
  if (!originalProduct) return;
  
  const updatedProducts = ticket.products.map(p =>
    p.systemId === productSystemId ? { ...p, ...updates } : p
  );
  
  const summary = calculateSummary(updatedProducts);
  const updatedProduct = updatedProducts.find(p => p.systemId === productSystemId);
  adjustReplacementStock(ticket, originalProduct, updatedProduct);
  
  originalUpdate(ticketSystemId, {
    ...ticket,
    products: updatedProducts,
    summary,
    updatedAt: toISODateTime(getCurrentDate()),
  } as any);
  
  // Add history
  if (updatedProduct) {
    addHistory(ticketSystemId, `Cập nhật SP: ${updatedProduct.productName}`, getCurrentUserName());
  }
}

/**
 * Xóa sản phẩm khỏi phiếu
 */
export function removeProduct(ticketSystemId: SystemId, productSystemId: SystemId) {
  const ticket = baseStore.getState().data.find(t => t.systemId === ticketSystemId);
  if (!ticket) return;
  
  const productToRemove = ticket.products.find(p => p.systemId === productSystemId);
  const updatedProducts = ticket.products.filter(p => p.systemId !== productSystemId);
  
  const summary = calculateSummary(updatedProducts);

  if (productToRemove) {
    adjustReplacementStock(ticket, productToRemove, undefined);
  }
  
  originalUpdate(ticketSystemId, {
    ...ticket,
    products: updatedProducts,
    summary,
    updatedAt: toISODateTime(getCurrentDate()),
  } as any);
  
  if (productToRemove) {
    addHistory(ticketSystemId, `Xóa SP: ${productToRemove.productName}`, getCurrentUserName());
  }
}

/**
 * Tính toán lại summary
 */
export function recalculateSummary(ticketSystemId: SystemId) {
  const ticket = baseStore.getState().data.find(t => t.systemId === ticketSystemId);
  if (!ticket) return;
  
  const summary = calculateSummary(ticket.products);
  
  originalUpdate(ticketSystemId, {
    ...ticket,
    summary,
  } as any);
}

/**
 * Helper: Tính trạng thái thanh toán
 */
export function calculateSettlementStatus(
  totalSettlement: number, 
  totalPaid: number, 
  shippingFee: number = 0
): 'pending' | 'partial' | 'completed' {
  if (totalSettlement <= 0) return 'completed';
  
  const netAmount = totalSettlement - shippingFee;
  if (netAmount <= 0) return 'completed';
  
  if (totalPaid === 0) return 'pending';
  if (totalPaid >= netAmount) return 'completed';
  return 'partial';
}

/**
 * Thêm lịch sử (internal use only)
 */
export function addHistory(
  ticketSystemId: SystemId, 
  action: string, 
  performedBy: string, 
  note?: string,
  metadata?: Record<string, any>
) {
  const ticket = baseStore.getState().data.find(t => t.systemId === ticketSystemId);
  if (!ticket) return;
  
  const historyEntry: WarrantyHistory = {
    systemId: asSystemId(`WH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
    action,
    actionLabel: action,
    performedBy,
    performedAt: toISODateTime(getCurrentDate()),
    note,
    metadata,
  };
  
  originalUpdate(ticketSystemId, {
    ...ticket,
    history: [...(ticket.history || []), historyEntry],
  } as any);
}
