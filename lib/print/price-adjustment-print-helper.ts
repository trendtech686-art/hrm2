/**
 * Price Adjustment Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu điều chỉnh giá bán
 */

import type { PriceAdjustment, PriceAdjustmentItem } from '@/features/price-adjustments/types';
import type { Branch } from '@/lib/types/prisma-extended';

export interface PriceAdjustmentForPrint {
  code: string;
  pricingPolicyName: string;
  createdAt: Date;
  confirmedDate?: Date;
  createdBy?: string;
  createdByName?: string;
  confirmedBy?: string;
  confirmedByName?: string;
  status: string;
  reason?: string;
  location?: {
    name: string;
    address?: string | null;
    province?: string | null;
  };
  items: {
    productCode: string;
    productName: string;
    oldPrice: number;
    newPrice: number;
    difference: number;
  }[];
  totalItems: number;
  totalOldValue: number;
  totalNewValue: number;
  totalDifference: number;
  totalIncrease: number;
  totalDecrease: number;
  note?: string;
}

export interface PriceAdjustmentPrintData {
  [key: string]: string | number | boolean | undefined | null | PriceAdjustmentLineItem[];
  documentType: string;
  documentTitle: string;
  documentCode: string;
  pricingPolicy: string;
  createdAt: string;
  confirmedAt?: string;
  createdBy: string;
  confirmedBy?: string;
  status: string;
  reason: string;
  totalItems: number;
  totalOldValue: string;
  totalNewValue: string;
  totalDifference: string;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  storeEmail?: string;
  storeWebsite?: string;
  storeTaxCode?: string;
  storeLogo?: string;
  note?: string;
}

export interface PriceAdjustmentLineItem {
  [key: string]: string | number | boolean | undefined | null;
  stt: number;
  productCode: string;
  productName: string;
  oldPrice: string;
  newPrice: string;
  difference: string;
  differenceClass: string;
}

/**
 * Chuyển đổi PriceAdjustment entity sang PriceAdjustmentForPrint
 */
export function convertPriceAdjustmentForPrint(
  adjustment: PriceAdjustment,
  options: {
    branch?: Branch | null;
    creatorName?: string;
  } = {}
): PriceAdjustmentForPrint {
  const { branch, creatorName } = options;

  const items = (adjustment.items || []) as PriceAdjustmentItem[];
  
  // Tính tổng
  const totalItems = items.length;
  const totalOldValue = items.reduce((sum, item) => sum + (item.oldPrice || 0), 0);
  const totalNewValue = items.reduce((sum, item) => sum + (item.newPrice || 0), 0);
  const totalDifference = totalNewValue - totalOldValue;
  const totalIncrease = items.reduce((sum, item) => {
    const diff = (item.newPrice || 0) - (item.oldPrice || 0);
    return diff > 0 ? sum + diff : sum;
  }, 0);
  const totalDecrease = items.reduce((sum, item) => {
    const diff = (item.newPrice || 0) - (item.oldPrice || 0);
    return diff < 0 ? sum + Math.abs(diff) : sum;
  }, 0);

  // Map trạng thái sang tiếng Việt
  const statusMap: Record<string, string> = {
    'draft': 'Nháp',
    'DRAFT': 'Nháp',
    'confirmed': 'Đã xác nhận',
    'CONFIRMED': 'Đã xác nhận',
    'cancelled': 'Đã hủy',
    'CANCELLED': 'Đã hủy',
  };

  return {
    code: adjustment.id || '',
    pricingPolicyName: adjustment.pricingPolicyName || '',
    createdAt: adjustment.createdAt ? new Date(adjustment.createdAt) : new Date(),
    confirmedDate: adjustment.confirmedDate ? new Date(adjustment.confirmedDate) : undefined,
    createdBy: adjustment.createdBy || undefined,
    createdByName: creatorName ?? adjustment.createdByName ?? undefined,
    confirmedBy: adjustment.confirmedBy || undefined,
    confirmedByName: adjustment.confirmedByName ?? undefined,
    status: statusMap[adjustment.status] || adjustment.status,
    reason: adjustment.reason || undefined,
    
    location: branch ? {
      name: branch.name,
      address: branch.address,
      province: branch.province,
    } : undefined,
    
    items: items.map(item => ({
      productCode: item.productId || '',
      productName: item.productName || '',
      oldPrice: item.oldPrice || 0,
      newPrice: item.newPrice || 0,
      difference: (item.newPrice || 0) - (item.oldPrice || 0),
    })),
    
    totalItems,
    totalOldValue,
    totalNewValue,
    totalDifference,
    totalIncrease,
    totalDecrease,
    
    note: adjustment.note || undefined,
  };
}

const formatCurrency = (value: number): string => {
  return value.toLocaleString('vi-VN') + ' đ';
};

const formatDateTime = (date?: Date | string | null): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Map PriceAdjustmentForPrint to print data
 */
export function mapPriceAdjustmentToPrintData(
  adjustment: PriceAdjustmentForPrint,
  storeSettings?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    taxCode?: string;
    logo?: string;
  }
): PriceAdjustmentPrintData {
  return {
    documentType: 'PHIẾU ĐIỀU CHỈNH GIÁ BÁN',
    documentTitle: 'Phiếu điều chỉnh giá bán',
    documentCode: adjustment.code,
    pricingPolicy: adjustment.pricingPolicyName,
    createdAt: formatDateTime(adjustment.createdAt),
    confirmedAt: adjustment.confirmedDate ? formatDateTime(adjustment.confirmedDate) : undefined,
    createdBy: adjustment.createdByName || '-',
    confirmedBy: adjustment.confirmedByName,
    status: adjustment.status,
    reason: adjustment.reason || '-',
    totalItems: adjustment.totalItems,
    totalOldValue: formatCurrency(adjustment.totalOldValue),
    totalNewValue: formatCurrency(adjustment.totalNewValue),
    totalDifference: formatCurrency(adjustment.totalDifference),
    storeName: storeSettings?.name || '',
    storeAddress: storeSettings?.address || '',
    storePhone: storeSettings?.phone || '',
    storeEmail: storeSettings?.email,
    storeWebsite: storeSettings?.website,
    storeTaxCode: storeSettings?.taxCode,
    storeLogo: storeSettings?.logo,
    note: adjustment.note,
  };
}

/**
 * Map items to line items for print
 */
export function mapPriceAdjustmentLineItems(
  items: PriceAdjustmentForPrint['items']
): PriceAdjustmentLineItem[] {
  return items.map((item, index) => ({
    stt: index + 1,
    productCode: item.productCode,
    productName: item.productName,
    oldPrice: formatCurrency(item.oldPrice),
    newPrice: formatCurrency(item.newPrice),
    difference: (item.difference >= 0 ? '+' : '') + formatCurrency(item.difference),
    differenceClass: item.difference > 0 ? 'text-green-600' : item.difference < 0 ? 'text-red-600' : '',
  }));
}
