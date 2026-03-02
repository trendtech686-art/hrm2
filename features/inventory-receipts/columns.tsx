/**
 * Columns definition cho InventoryReceiptsPage
 * Tách từ page.tsx để giảm kích thước file
 */
import * as React from 'react';
import { formatDateCustom } from '@/lib/date-utils';
import type { ColumnDef } from '@/components/data-table/types';
import type { InventoryReceipt } from '@/lib/types/prisma-extended';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export interface InventoryReceiptColumnHandlers {
  onPrint: (receipt: InventoryReceipt) => void;
}

export function getColumns(
  handlers: InventoryReceiptColumnHandlers
): ColumnDef<InventoryReceipt>[] {
  return [
    {
      id: "select",
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
            onCheckedChange={(value) => onToggleAll?.(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ isSelected, onToggleSelect }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelect}
            aria-label="Select row"
          />
        </div>
      ),
      size: 48,
      meta: {
        displayName: "Chọn",
        sticky: "left",
      },
    },
    {
      id: 'id',
      accessorKey: 'id',
      header: 'Mã phiếu',
      cell: ({ row }) => (
        <span className="font-medium text-primary">{row.id}</span>
      ),
      meta: { displayName: 'Mã phiếu' },
      size: 120,
    },
    {
      id: 'receivedDate',
      accessorKey: 'receivedDate',
      header: 'Ngày nhập',
      cell: ({ row }) => {
        if (!row.receivedDate) return '-';
        return formatDateCustom(row.receivedDate, 'dd/MM/yyyy HH:mm');
      },
      meta: { displayName: 'Ngày nhập' },
      size: 150,
    },
    {
      id: 'supplierName',
      accessorKey: 'supplierName',
      header: 'Nhà cung cấp',
      cell: ({ row }) => row.supplierName || 'Nhập trực tiếp',
      meta: { displayName: 'Nhà cung cấp' },
    },
    {
      id: 'purchaseOrderId',
      accessorKey: 'purchaseOrderId',
      header: 'Đơn mua hàng',
      cell: ({ row }) => row.purchaseOrderId || 'Không có',
      meta: { displayName: 'Đơn mua hàng' },
      size: 140,
    },
    {
      id: 'totalQuantity',
      header: 'Tổng SL nhập',
      cell: ({ row }) => {
        const items = row.items || [];
        const total = items.reduce((sum, item) => {
          const qty = Number(item.receivedQuantity) || 0;
          return sum + qty;
        }, 0);
        return <span className="font-medium">{total}</span>;
      },
      meta: { displayName: 'Tổng SL nhập' },
      size: 120,
    },
    {
      id: 'receiverName',
      accessorKey: 'receiverName',
      header: 'Người nhận',
      cell: ({ row }) => row.receiverName || '-',
      meta: { displayName: 'Người nhận' },
      size: 150,
    },
    {
      id: 'notes',
      accessorKey: 'notes',
      header: 'Ghi chú',
      cell: ({ row }) => (
        <span 
          className="text-body-xs max-w-50 line-clamp-2 cursor-help" 
          title={row.notes || ''}
        >
          {row.notes || '-'}
        </span>
      ),
      meta: { displayName: 'Ghi chú' },
      size: 200,
    },
    {
      id: 'itemsCount',
      header: 'Số mặt hàng',
      cell: ({ row }) => (
        <span className="font-medium">{row.items.length}</span>
      ),
      meta: { displayName: 'Số mặt hàng' },
      size: 120,
    },
    {
      id: 'productNames',
      header: 'Sản phẩm',
      cell: ({ row }) => {
        const firstProduct = row.items[0]?.productName || '';
        const remaining = row.items.length - 1;
        return (
          <span className="text-body-xs">
            {firstProduct}
            {remaining > 0 && ` +${remaining}`}
          </span>
        );
      },
      meta: { displayName: 'Sản phẩm' },
      size: 200,
    },
    {
      id: 'totalValue',
      header: 'Tổng giá trị',
      cell: ({ row }) => {
        const total = row.items.reduce((sum, item) => 
          sum + (item.receivedQuantity * item.unitPrice), 0
        );
        return (
          <span className="font-semibold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
          </span>
        );
      },
      meta: { displayName: 'Tổng giá trị' },
      size: 150,
    },
    {
      id: 'branchName',
      accessorKey: 'branchName',
      header: 'Chi nhánh',
      cell: ({ row }) => row.branchName || '-',
      meta: { displayName: 'Chi nhánh' },
      size: 150,
    },
    {
      id: 'warehouseName',
      accessorKey: 'warehouseName',
      header: 'Kho',
      cell: ({ row }) => row.warehouseName || '-',
      meta: { displayName: 'Kho' },
      size: 150,
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={(e) => {
            e.stopPropagation();
            handlers.onPrint(row);
          }}
        >
          <Printer className="h-4 w-4 mr-1" />
          In
        </Button>
      ),
      size: 120,
      meta: {
        displayName: 'Hành động',
        sticky: 'right',
      },
    },
  ];
}

// Helper để tạo default column visibility
export function getDefaultColumnVisibility(): Record<string, boolean> {
  const cols = getColumns({ onPrint: () => {} });
  const initial: Record<string, boolean> = {};
  cols.forEach(c => { 
    if (c.id) initial[c.id] = true; 
  });
  return initial;
}
