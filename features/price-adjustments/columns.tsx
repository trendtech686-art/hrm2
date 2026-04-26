import * as React from 'react';
import Link from 'next/link';
import type { ColumnDef } from '../../components/data-table/types';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Printer } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import type { PriceAdjustment, PriceAdjustmentStatus } from './types';

const getStatusVariant = (status: PriceAdjustmentStatus): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
  const s = status?.toLowerCase?.() || status;
  switch (s) {
    case 'draft': return 'secondary';
    case 'confirmed': return 'success';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const getStatusLabel = (status: PriceAdjustmentStatus): string => {
  const s = status?.toLowerCase?.() || status;
  switch (s) {
    case 'draft': return 'Nháp';
    case 'confirmed': return 'Đã xác nhận';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

export const getColumns = (
  navigate: (path: string) => void,
  onPrint: (adjustment: PriceAdjustment) => void
): ColumnDef<PriceAdjustment>[] => [
  {
    id: 'select',
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Chọn tất cả"
          className="h-4 w-4"
        />
      </div>
    ),
    cell: ({ isSelected, onToggleSelect }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Chọn hàng"
          className="h-4 w-4"
        />
      </div>
    ),
    enableSorting: false,
    size: 50,
    meta: { displayName: 'Chọn' },
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Mã phiếu',
    cell: ({ row }) => (
      <Link
        href={`/price-adjustments/${row.systemId}`}
        className="font-medium text-primary hover:underline"
      >
        {row.id}
      </Link>
    ),
    meta: { displayName: 'Mã phiếu' },
  },
  {
    id: 'pricingPolicyName',
    accessorKey: 'pricingPolicyName',
    header: 'Bảng giá',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.pricingPolicyName || '-'}
      </span>
    ),
    meta: { displayName: 'Bảng giá' },
  },
  {
    id: 'createdDate',
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => formatDate(row.createdAt),
    meta: { displayName: 'Ngày tạo' },
  },
  {
    id: 'createdByName',
    accessorKey: 'createdByName',
    header: 'Người tạo',
    cell: ({ row }) => row.createdByName || '-',
    meta: { displayName: 'Người tạo' },
  },
  {
    id: 'itemCount',
    accessorKey: 'items',
    header: 'Số SP',
    cell: ({ row }) => row.items?.length || 0,
    meta: { displayName: 'Số SP' },
  },
  {
    id: 'totalOldValue',
    header: 'Tổng giá cũ',
    cell: ({ row }) => {
      const total = row.items?.reduce((sum, item) => sum + (Number(item.oldPrice) || 0), 0) || 0;
      return formatCurrency(total);
    },
    meta: { displayName: 'Tổng giá cũ' },
  },
  {
    id: 'totalNewValue',
    header: 'Tổng giá mới',
    cell: ({ row }) => {
      const total = row.items?.reduce((sum, item) => sum + (Number(item.newPrice) || 0), 0) || 0;
      return formatCurrency(total);
    },
    meta: { displayName: 'Tổng giá mới' },
  },
  {
    id: 'reason',
    accessorKey: 'reason',
    header: 'Lý do',
    cell: ({ row }) => (
      <span className="truncate max-w-37 block">
        {row.reason || '-'}
      </span>
    ),
    meta: { displayName: 'Lý do' },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.status)}>
        {getStatusLabel(row.status)}
      </Badge>
    ),
    meta: { displayName: 'Trạng thái' },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-11 w-11">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/price-adjustments/${row.systemId}`)}>
            <Eye className="mr-2 h-4 w-4" />
            Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onPrint(row)}>
            <Printer className="mr-2 h-4 w-4" />
            In phiếu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    size: 80,
    meta: { displayName: 'Hành động' },
  },
];
