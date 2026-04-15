'use client';

import * as React from 'react';
import { StockOrdersDialog, type StockOrderType } from './stock-orders-dialog';
import { useStockOrders } from '../hooks/use-stock-orders';
import type { SystemId } from '@/lib/id-types';

interface StockOrdersDialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: StockOrderType;
  productSystemId: SystemId;
  productName: string;
  branchSystemId: string;
  branchName: string;
}

const PAGE_SIZE = 20;

/**
 * Wrapper component that handles data fetching for StockOrdersDialog
 * ⚡ Uses server-side pagination for better performance with large datasets
 */
export function StockOrdersDialogWrapper({
  open,
  onOpenChange,
  type,
  productSystemId,
  productName,
  branchSystemId,
  branchName,
}: StockOrdersDialogWrapperProps) {
  const [page, setPage] = React.useState(1);
  
  // Reset page when dialog opens
  React.useEffect(() => {
    if (open) {
      setPage(1);
    }
  }, [open]);

  const { items, isLoading, totalQuantity, orderQuantity, warrantyQuantity, pagination } = useStockOrders({
    productSystemId,
    branchSystemId,
    type,
    enabled: open, // Only fetch when dialog is open
    page,
    limit: PAGE_SIZE,
  });

  return (
    <StockOrdersDialog
      open={open}
      onOpenChange={onOpenChange}
      type={type}
      productName={productName}
      branchName={branchName}
      items={items}
      isLoading={isLoading}
      totalQuantity={totalQuantity}
      orderQuantity={orderQuantity}
      warrantyQuantity={warrantyQuantity}
      pagination={pagination}
      onPageChange={setPage}
    />
  );
}
