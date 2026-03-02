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

/**
 * Wrapper component that handles data fetching for StockOrdersDialog
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
  const { items, isLoading } = useStockOrders({
    productSystemId,
    branchSystemId,
    type,
    enabled: open, // Only fetch when dialog is open
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
    />
  );
}
