import * as React from 'react';
import Link from 'next/link';
import type { CostAdjustment, CostAdjustmentStatus } from '@/lib/types/prisma-extended';
import type { ColumnDef } from '../../components/data-table/types';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Printer } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';

const getStatusVariant = (status: CostAdjustmentStatus): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
  switch (status) {
    case 'draft': return 'secondary';
    case 'confirmed': return 'success';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const getStatusLabel = (status: CostAdjustmentStatus): string => {
  switch (status) {
    case 'draft': return 'Nháp';
    case 'confirmed': return 'Đã xác nhận';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

export const getColumns = (
  navigate: (path: string) => void,
  onPrint: (adjustment: CostAdjustment) => void
): ColumnDef<CostAdjustment>[] => [
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
        href={`/cost-adjustments/${(row as any).systemId}`}
        className="font-medium text-primary hover:underline"
      >
        {(row as any).id}
      </Link>
    ),
    meta: { displayName: 'Mã phiếu' },
  },
  {
    id: 'referenceCode',
    accessorKey: 'referenceCode',
    header: 'Mã tham chiếu',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {(row as any).referenceCode || '-'}
      </span>
    ),
    meta: { displayName: 'Mã tham chiếu' },
  },
  {
    id: 'createdDate',
    accessorKey: 'createdDate',
    header: 'Ngày tạo',
    cell: ({ row }) => formatDate((row as any).createdDate),
    meta: { displayName: 'Ngày tạo' },
  },
  {
    id: 'createdByName',
    accessorKey: 'createdByName',
    header: 'Người tạo',
    cell: ({ row }) => (row as any).createdByName,
    meta: { displayName: 'Người tạo' },
  },
  {
    id: 'itemCount',
    accessorKey: 'items',
    header: 'Số SP',
    cell: ({ row }) => ((row as any).items?.length || 0),
    meta: { displayName: 'Số sản phẩm' },
  },
  {
    id: 'totalOldValue',
    accessorKey: 'items',
    header: 'Tổng giá vốn cũ',
    cell: ({ row }) => {
      const totalOldValue = (row as any).items?.reduce((sum: number, item: any) => sum + item.oldCostPrice, 0) || 0;
      return <span>{formatCurrency(totalOldValue)}</span>;
    },
    meta: { displayName: 'Tổng giá vốn cũ' },
  },
  {
    id: 'totalNewValue',
    accessorKey: 'items',
    header: 'Tổng giá vốn mới',
    cell: ({ row }) => {
      const totalNewValue = (row as any).items?.reduce((sum: number, item: any) => sum + item.newCostPrice, 0) || 0;
      return <span>{formatCurrency(totalNewValue)}</span>;
    },
    meta: { displayName: 'Tổng giá vốn mới' },
  },
  {
    id: 'totalDifference',
    accessorKey: 'items',
    header: 'Chênh lệch',
    cell: ({ row }) => {
      const totalDifference = (row as any).items?.reduce((sum: number, item: any) => sum + item.adjustmentAmount, 0) || 0;
      const isPositive = totalDifference > 0;
      const isNegative = totalDifference < 0;
      
      return (
        <span className={`font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : ''}`}>
          {isPositive ? '+' : ''}{formatCurrency(totalDifference)}
        </span>
      );
    },
    meta: { displayName: 'Chênh lệch' },
  },
  {
    id: 'reason',
    accessorKey: 'reason',
    header: 'Lý do',
    cell: ({ row }) => (
      <span className="text-muted-foreground truncate max-w-[200px] block">
        {(row as any).reason || '-'}
      </span>
    ),
    meta: { displayName: 'Lý do' },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge variant={getStatusVariant((row as any).status)}>
        {getStatusLabel((row as any).status)}
      </Badge>
    ),
    meta: { displayName: 'Trạng thái' },
  },
  {
    id: 'confirmedDate',
    accessorKey: 'confirmedDate',
    header: 'Ngày xác nhận',
    cell: ({ row }) => (row as any).confirmedDate ? formatDate((row as any).confirmedDate) : '-',
    meta: { displayName: 'Ngày xác nhận' },
  },
  {
    id: 'confirmedByName',
    accessorKey: 'confirmedByName',
    header: 'Người xác nhận',
    cell: ({ row }) => (row as any).confirmedByName || '-',
    meta: { displayName: 'Người xác nhận' },
  },
  {
    id: 'note',
    accessorKey: 'note',
    header: 'Ghi chú',
    cell: ({ row }) => (
      <span className="text-muted-foreground truncate max-w-[200px] block">
        {(row as any).note || '-'}
      </span>
    ),
    meta: { displayName: 'Ghi chú' },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => {
      const adjustment = row as CostAdjustment;
      const isDraft = adjustment.status === 'draft';
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/cost-adjustments/${adjustment.systemId}`)}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
            {isDraft && (
              <>
                <DropdownMenuItem onClick={() => navigate(`/cost-adjustments/${adjustment.systemId}`)}>
                  Xác nhận
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => navigate(`/cost-adjustments/${adjustment.systemId}`)}
                >
                  Hủy phiếu
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onPrint(adjustment)}>
              <Printer className="mr-2 h-4 w-4" />
              In phiếu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: { displayName: 'Hành động' },
  },
];

export const getStatusOptions = () => [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'draft', label: 'Nháp' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'cancelled', label: 'Đã hủy' },
];
