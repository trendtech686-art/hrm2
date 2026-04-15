/**
 * Return Report Hooks
 * 
 * Hooks tính toán dữ liệu báo cáo trả hàng
 */

import * as React from 'react';
import { parseISO, isWithinInterval } from 'date-fns';
import { useSalesReturnsByDateRange } from './use-report-data';
import type {
  ReportDateRange,
  ReturnOrderReportRow,
  ReturnProductReportRow,
} from '../types';
import type { SystemId } from '@/lib/id-types';

// Hook: Trả hàng theo đơn hàng
export function useReturnOrderReport(dateRange: ReportDateRange) {
  const { data: returns = [] } = useSalesReturnsByDateRange(dateRange);

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = returns.filter(r => {
      const date = r.returnDate ? parseISO(r.returnDate) : r.createdAt ? parseISO(r.createdAt) : null;
      return date && isWithinInterval(date, { start, end });
    });

    const data: ReturnOrderReportRow[] = filtered.map(r => ({
      returnSystemId: r.systemId,
      returnId: r.id,
      orderId: r.orderId,
      orderSystemId: r.orderSystemId,
      returnDate: r.returnDate || r.createdAt || '',
      customerName: r.customerName || undefined,
      employeeName: r.creatorName || undefined,
      branchName: r.branchName || undefined,
      itemCount: r.items?.length || 0,
      returnAmount: r.totalReturnValue || 0,
      refundAmount: r.refundAmount || r.finalAmount || 0,
      reason: r.reason || undefined,
    }));

    const summary = {
      totalReturns: data.length,
      totalReturnAmount: data.reduce((sum, r) => sum + r.returnAmount, 0),
      totalRefundAmount: data.reduce((sum, r) => sum + r.refundAmount, 0),
      totalItems: data.reduce((sum, r) => sum + r.itemCount, 0),
    };

    return { data, summary };
  }, [returns, dateRange]);
}

// Hook: Trả hàng theo sản phẩm
export function useReturnProductReport(dateRange: ReportDateRange) {
  const { data: returns = [] } = useSalesReturnsByDateRange(dateRange);

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = returns.filter(r => {
      const date = r.returnDate ? parseISO(r.returnDate) : r.createdAt ? parseISO(r.createdAt) : null;
      return date && isWithinInterval(date, { start, end });
    });

    const productMap = new Map<string, ReturnProductReportRow>();
    const reasonsByProduct = new Map<string, Map<string, number>>();

    filtered.forEach(ret => {
      const items = ret.items || [];
      items.forEach((item: { productSystemId?: string; productName?: string; productCode?: string; sku?: string; quantity?: number; returnPrice?: number; total?: number }) => {
        const productId = (item.productSystemId || 'unknown') as SystemId;
        
        if (!productMap.has(productId)) {
          productMap.set(productId, {
            productSystemId: productId,
            productName: item.productName || 'Không xác định',
            productCode: item.productCode,
            sku: item.sku,
            returnCount: 0,
            quantityReturned: 0,
            returnAmount: 0,
            returnRate: 0,
            topReasons: [],
          });
          reasonsByProduct.set(productId, new Map());
        }

        const row = productMap.get(productId)!;
        const reasons = reasonsByProduct.get(productId)!;

        row.returnCount += 1;
        row.quantityReturned += item.quantity || 1;
        row.returnAmount += item.total || (item.returnPrice || 0) * (item.quantity || 1);

        if (ret.reason) {
          reasons.set(ret.reason, (reasons.get(ret.reason) || 0) + 1);
        }
      });
    });

    // Build top reasons
    productMap.forEach((row, productId) => {
      const reasons = reasonsByProduct.get(productId)!;
      row.topReasons = Array.from(reasons.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([reason]) => reason);
    });

    const data = Array.from(productMap.values()).sort((a, b) => b.quantityReturned - a.quantityReturned);

    const summary = {
      totalProducts: data.length,
      totalQuantityReturned: data.reduce((sum, r) => sum + r.quantityReturned, 0),
      totalReturnAmount: data.reduce((sum, r) => sum + r.returnAmount, 0),
    };

    return { data, summary };
  }, [returns, dateRange]);
}
