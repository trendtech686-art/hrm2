/**
 * Helper functions for warranty tracking page
 */
import { WARRANTY_STATUS_LABELS } from '../types';
import type { WarrantyStatus } from '../types';
import type { PublicWarrantyTicket, PublicWarrantyProduct } from '../public-warranty-api';

/**
 * Get timestamp for a specific status from history
 */
export function getStatusTimestamp(ticket: PublicWarrantyTicket, status: WarrantyStatus): string | null {
  const directTimestampByStatus: Partial<Record<WarrantyStatus, string | undefined>> = {
    RECEIVED: ticket.createdAt,
    PROCESSING: ticket.processingStartedAt,
    WAITING_PARTS: undefined,
    COMPLETED: ticket.processedAt,
    RETURNED: ticket.returnedAt,
    CANCELLED: ticket.cancelledAt,
  };

  const directTimestamp = directTimestampByStatus[status];
  if (directTimestamp) {
    return directTimestamp;
  }

  const statusLabel = (WARRANTY_STATUS_LABELS[status] || '').toLowerCase();

  const completionKeywords = ['hoàn tất phiếu', 'kết thúc phiếu', 'complete'];

  const historyEntry = ticket.history.find((entry) => {
    const action = (entry.action || '').toLowerCase();
    const actionLabel = (entry.actionLabel || '').toLowerCase();

    if (status === 'RETURNED') {
      return completionKeywords.some((keyword) => action.includes(keyword) || actionLabel.includes(keyword))
        || action.includes('-> RETURNED')
        || action.includes(': RETURNED');
    }

    return (
      action.includes(`-> ${status}`) ||
      action.includes(`: ${status}`) ||
      actionLabel.includes(`-> ${status}`) ||
      actionLabel.includes(`: ${status}`) ||
      (!!statusLabel && (action.includes(statusLabel) || actionLabel.includes(statusLabel)))
    );
  });

  return historyEntry?.performedAt || null;
}

/**
 * Calculate total warranty value
 */
export function calculateTotalWarrantyValue(products: PublicWarrantyProduct[]): number {
  return products.reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0);
}

/**
 * Calculate returned products value
 */
export function calculateReturnedValue(products: PublicWarrantyProduct[]): { value: number; quantity: number } {
  const filtered = products.filter(p => p.resolution === 'return');
  return {
    value: filtered.reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0),
    quantity: filtered.reduce((sum, p) => sum + (p.quantity || 1), 0),
  };
}

/**
 * Calculate replaced products value
 */
export function calculateReplacedValue(products: PublicWarrantyProduct[]): { value: number; quantity: number } {
  const filtered = products.filter(p => p.resolution === 'replace');
  return {
    value: filtered.reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0),
    quantity: filtered.reduce((sum, p) => sum + (p.quantity || 1), 0),
  };
}

/**
 * Calculate out of stock products value
 */
export function calculateOutOfStockValue(products: PublicWarrantyProduct[]): number {
  return products
    .filter(p => p.resolution === 'out_of_stock')
    .reduce((sum, p) => sum + ((p.quantity || 1) * (p.unitPrice || 0)), 0);
}

/**
 * Calculate total quantity
 */
export function calculateTotalQuantity(products: PublicWarrantyProduct[]): number {
  return products.reduce((sum, p) => sum + (p.quantity || 1), 0);
}

/**
 * Calculate quantity by resolution type
 */
export function calculateQuantityByResolution(
  products: PublicWarrantyProduct[], 
  resolution: 'return' | 'replace' | 'out_of_stock'
): number {
  return products
    .filter(p => p.resolution === resolution)
    .reduce((sum, p) => sum + (p.quantity || 1), 0);
}

/**
 * Calculate grand total (out of stock + shipping fee)
 */
export function calculateGrandTotal(products: PublicWarrantyProduct[], shippingFee?: number): number {
  const outOfStockValue = calculateOutOfStockValue(products);
  return outOfStockValue + (shippingFee || 0);
}

/**
 * Format currency in Vietnamese format
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}
