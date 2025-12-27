import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { StockTransfer, StockTransferStatus } from '@/lib/types/prisma-extended';
import type { ColumnDef } from '../../components/data-table/types';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { MoreHorizontal, Printer } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { useProductStore } from '../products/store';
import { useStockTransferStore } from './store';
import { asSystemId } from '../../lib/id-types';

const getStatusVariant = (status: StockTransferStatus): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
  switch (status) {
    case 'pending': return 'secondary';
    case 'transferring': return 'default';
    case 'completed': return 'success';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const getStatusLabel = (status: StockTransferStatus): string => {
  switch (status) {
    case 'pending': return 'Chờ chuyển';
    case 'transferring': return 'Đang chuyển';
    case 'completed': return 'Hoàn thành';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

export const getColumns = (onPrint?: (transfer: StockTransfer) => void): ColumnDef<StockTransfer>[] => [
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
        href={`/stock-transfers/${(row as any).systemId}`}
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
    id: 'fromBranchName',
    accessorKey: 'fromBranchName',
    header: 'Chi nhánh chuyển',
    cell: ({ row }) => (row as any).fromBranchName,
    meta: { displayName: 'Chi nhánh chuyển' },
  },
  {
    id: 'toBranchName',
    accessorKey: 'toBranchName',
    header: 'Chi nhánh nhận',
    cell: ({ row }) => (row as any).toBranchName,
    meta: { displayName: 'Chi nhánh nhận' },
  },
  {
    id: 'itemCount',
    accessorKey: 'items',
    header: 'Số SP',
    cell: ({ row }) => ((row as any).items?.length || 0),
    meta: { displayName: 'Số sản phẩm' },
  },
  {
    id: 'totalQuantity',
    accessorKey: 'items',
    header: 'Tổng SL',
    cell: ({ row }) => ((row as any).items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0),
    meta: { displayName: 'Tổng số lượng' },
  },
  {
    id: 'totalValue',
    accessorKey: 'items',
    header: 'Tổng giá trị chuyển',
    cell: ({ row }) => {
      const { findById: findProductById } = useProductStore.getState();
      const totalValue = (row as any).items?.reduce((sum: number, item: any) => {
        const product = findProductById(asSystemId(item.productSystemId));
        const price = product?.costPrice || 0;
        return sum + (price * item.quantity);
      }, 0) || 0;
      
      return <span className="font-medium">{totalValue.toLocaleString('vi-VN')} đ</span>;
    },
    meta: { displayName: 'Tổng giá trị chuyển' },
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
    id: 'createdByName',
    accessorKey: 'createdByName',
    header: 'Người tạo',
    cell: ({ row }) => (row as any).createdByName,
    meta: { displayName: 'Người tạo' },
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
      const router = useRouter();
      const transfer = row as any;
      const isPending = transfer.status === 'pending';
      const isTransferring = transfer.status === 'transferring';
      const isCompleted = transfer.status === 'completed';
      const isCancelled = transfer.status === 'cancelled';
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onPrint?.(transfer)}>
              <Printer className="mr-2 h-4 w-4" />
              In phiếu chuyển
            </DropdownMenuItem>
            {isPending && (
              <>
                <DropdownMenuItem onClick={() => router.push(`/stock-transfers/${transfer.systemId}/edit`)}>
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/stock-transfers/${transfer.systemId}`)}>
                  Chuyển hàng khỏi kho
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => router.push(`/stock-transfers/${transfer.systemId}`)}
                >
                  Hủy phiếu
                </DropdownMenuItem>
              </>
            )}
            
            {isTransferring && (
              <>
                <DropdownMenuItem onClick={() => router.push(`/stock-transfers/${transfer.systemId}`)}>
                  Nhận hàng vào kho
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => router.push(`/stock-transfers/${transfer.systemId}`)}
                >
                  Hủy phiếu
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: { displayName: 'Hành động' },
  },
];

export const getStatusOptions = () => [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ chuyển' },
  { value: 'transferring', label: 'Đang chuyển' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];
