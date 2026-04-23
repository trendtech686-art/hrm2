'use client'

import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Printer } from 'lucide-react';
import { formatDateCustom } from '../../lib/date-utils';
import type { ColumnDef } from '../../components/data-table/types';
import type { PurchaseReturn } from '@/lib/types/prisma-extended';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const getColumns = (onPrint: (purchaseReturn: PurchaseReturn) => void): ColumnDef<PurchaseReturn>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Chọn tất cả"
        />
      </div>
    ),
    cell: ({ isSelected, onToggleSelect }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Chọn dòng"
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
    header: 'Mã phiếu trả',
    cell: ({ row }) => (
      <button 
        className="text-sm font-medium text-primary hover:underline"
        onClick={(e) => {
          e.stopPropagation();
          // Navigate is handled by onRowClick
        }}
      >
        {row.id}
      </button>
    ),
    meta: { displayName: 'Mã phiếu trả' },
    size: 120,
  },
  {
    id: 'returnDate',
    accessorKey: 'returnDate',
    header: 'Ngày trả',
    cell: ({ row }) => {
      if (!row.returnDate) return '-';
      return formatDateCustom(row.returnDate, 'dd/MM/yyyy');
    },
    meta: { displayName: 'Ngày trả' },
    size: 120,
  },
  {
    id: 'purchaseOrderId',
    accessorKey: 'purchaseOrderId',
    header: 'Đơn nhập hàng',
    cell: ({ row }) => row.purchaseOrderId,
    meta: { displayName: 'Đơn nhập hàng' },
    size: 140,
  },
  {
    id: 'supplierName',
    accessorKey: 'supplierName',
    header: 'Nhà cung cấp',
    cell: ({ row }) => row.supplierName,
    meta: { displayName: 'Nhà cung cấp' },
  },
  {
    id: 'branchName',
    accessorKey: 'branchName',
    header: 'Chi nhánh',
    cell: ({ row }) => row.branchName,
    meta: { displayName: 'Chi nhánh' },
    size: 150,
  },
  {
    id: 'totalQuantity',
    header: 'Tổng SL',
    cell: ({ row }) => {
      const total = row.items.reduce((sum, item) => sum + (item.returnQuantity || 0), 0);
      return <span className="text-sm font-medium">{total}</span>;
    },
    meta: { displayName: 'Tổng SL' },
    size: 100,
  },
  {
    id: 'totalReturnValue',
    accessorKey: 'totalReturnValue',
    header: 'Giá trị trả',
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-orange-600">
        {formatCurrency(row.totalReturnValue)}
      </span>
    ),
    meta: { displayName: 'Giá trị trả' },
    size: 150,
  },
  {
    id: 'refundAmount',
    accessorKey: 'refundAmount',
    header: 'Tiền hoàn',
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-green-600">
        {formatCurrency(row.refundAmount)}
      </span>
    ),
    meta: { displayName: 'Tiền hoàn' },
    size: 150,
  },
  {
    id: 'creatorName',
    accessorKey: 'creatorName',
    header: 'Người tạo',
    cell: ({ row }) => row.creatorName,
    meta: { displayName: 'Người tạo' },
    size: 150,
  },
  {
    id: 'reason',
    accessorKey: 'reason',
    header: 'Lý do',
    cell: ({ row }) => (
      <span className="text-xs max-w-xs line-clamp-2">
        {row.reason || '-'}
      </span>
    ),
    meta: { displayName: 'Lý do' },
    size: 200,
  },
  {
    id: 'refundMethod',
    accessorKey: 'refundMethod',
    header: 'Hình thức hoàn',
    cell: ({ row }) => row.refundMethod || '-',
    meta: { displayName: 'Hình thức hoàn' },
    size: 150,
  },
  {
    id: 'itemsCount',
    header: 'Số mặt hàng',
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.items.length}</span>
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
        <span className="text-xs">
          {firstProduct}
          {remaining > 0 && ` +${remaining}`}
        </span>
      );
    },
    meta: { displayName: 'Sản phẩm' },
    size: 200,
  },
  {
    id: 'accountSystemId',
    accessorKey: 'accountSystemId',
    header: 'Tài khoản',
    cell: ({ row }) => row.accountSystemId || '-',
    meta: { displayName: 'Tài khoản' },
    size: 120,
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onPrint(row);
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
