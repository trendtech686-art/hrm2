'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { usePurchaseOrderStore } from '../store';
import { useAllInventoryReceipts } from '@/features/inventory-receipts/hooks/use-all-inventory-receipts';
import { usePurchaseReturnStore } from '@/features/purchase-returns/store';

interface POStats {
  totalOrdered: number;
  totalReceived: number;
  totalReturned: number;
  netInStock: number;
  receivedRate: string;
  returnedRate: string;
}

export function usePOStats(): POStats {
  const { data: purchaseOrders } = usePurchaseOrderStore();
  const { data: allReceipts } = useAllInventoryReceipts();
  const { data: allPurchaseReturns } = usePurchaseReturnStore();

  return React.useMemo(() => {
    const stats = new Map<string, { 
      totalOrdered: number; 
      totalReceived: number; 
      totalReturned: number;
      variance: number;
    }>();

    // Collect all PO IDs
    purchaseOrders.forEach(po => {
      const totalOrdered = po.lineItems.reduce((sum, item) => sum + item.quantity, 0);
      stats.set(po.id, { totalOrdered, totalReceived: 0, totalReturned: 0, variance: totalOrdered });
    });

    // Add received quantities
    allReceipts.forEach(receipt => {
      if (receipt.purchaseOrderId && stats.has(receipt.purchaseOrderId)) {
        const totalReceived = receipt.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
        const current = stats.get(receipt.purchaseOrderId)!;
        current.totalReceived += totalReceived;
        current.variance = current.totalOrdered - current.totalReceived + current.totalReturned;
      }
    });

    // Add returned quantities
    allPurchaseReturns.forEach(ret => {
      if (ret.purchaseOrderId && stats.has(ret.purchaseOrderId)) {
        const totalReturned = ret.items.reduce((sum, item) => sum + item.returnQuantity, 0);
        const current = stats.get(ret.purchaseOrderId)!;
        current.totalReturned += totalReturned;
        current.variance = current.totalOrdered - current.totalReceived + current.totalReturned;
      }
    });

    // Calculate totals
    let totalOrdered = 0;
    let totalReceived = 0;
    let totalReturned = 0;
    stats.forEach(stat => {
      totalOrdered += stat.totalOrdered;
      totalReceived += stat.totalReceived;
      totalReturned += stat.totalReturned;
    });

    return { 
      totalOrdered, 
      totalReceived, 
      totalReturned,
      netInStock: totalReceived - totalReturned,
      receivedRate: totalOrdered > 0 ? ((totalReceived / totalOrdered) * 100).toFixed(1) : '0',
      returnedRate: totalReceived > 0 ? ((totalReturned / totalReceived) * 100).toFixed(1) : '0'
    };
  }, [purchaseOrders, allReceipts, allPurchaseReturns]);
}

export function POStatisticsCards() {
  const stats = usePOStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-body-sm text-muted-foreground">Tổng đặt hàng</p>
          <p className="text-h3">{stats.totalOrdered} SP</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-body-sm text-muted-foreground">Đã nhận</p>
          <p className="text-h3 text-green-600">
            {stats.totalReceived} SP
            <span className="text-body-sm text-muted-foreground ml-2">({stats.receivedRate}%)</span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-body-sm text-muted-foreground">Đã trả lại</p>
          <p className="text-h3 text-orange-600">
            {stats.totalReturned} SP
            <span className="text-body-sm text-muted-foreground ml-2">({stats.returnedRate}%)</span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-body-sm text-muted-foreground">Tồn kho thực</p>
          <p className={`text-h3 ${stats.netInStock >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {stats.netInStock > 0 ? '+' : ''}{stats.netInStock} SP
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
