import * as React from 'react';
import { formatDateCustom } from '../../lib/date-utils.ts';
import type { InventoryCheck } from './types.ts';
import { Checkbox } from '../../components/ui/checkbox.tsx';
import { DataTableColumnHeader } from '../../components/data-table/data-table-column-header.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import type { ColumnDef } from '../../components/data-table/types.ts';
import { Button } from '../../components/ui/button.tsx';
import { MoreHorizontal, Pencil, Trash2, Check, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu.tsx';

const formatDate = (d?: string) => (d ? formatDateCustom(new Date(d), 'dd/MM/yyyy HH:mm') : '');

export const getColumns = (
  onEdit: (item: InventoryCheck) => void,
  onDelete: (systemId: string) => void,
  onBalance: (systemId: string) => void,
  navigate: (path: string) => void,
) : ColumnDef<InventoryCheck>[] => [
  // 1 - Select
  {
    id: 'select',
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <Checkbox
        checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false}
        onCheckedChange={(v) => onToggleAll(!!v)}
      />
    ),
    cell: ({ onToggleSelect, isSelected }) => (
      <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
    ),
    size: 48,
    meta: { displayName: 'Chọn', sticky: 'left' },
  },

  // 2 - ID (clickable)
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader
        title="Mã"
        sortKey="id"
        isSorted={sorting.id === 'id'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => (
      <div
        className="font-medium text-primary cursor-pointer hover:underline"
        onClick={() => navigate(`/inventory-checks/${row.systemId}`)}
      >
        {row.id}
      </div>
    ),
    meta: { displayName: 'Mã phiếu' },
  },

  // 3 - Branch
  {
    id: 'branch',
    accessorKey: 'branchName',
    header: 'Chi nhánh',
    cell: ({ row }) => row.branchName,
    meta: { displayName: 'Chi nhánh' },
  },

  // 4 - Status
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge variant={row.status === 'balanced' ? 'secondary' : row.status === 'draft' ? 'outline' : 'destructive'}>
        {row.status === 'draft' ? 'Nháp' : row.status === 'balanced' ? 'Đã cân bằng' : 'Đã hủy'}
      </Badge>
    ),
    meta: { displayName: 'Trạng thái' },
  },

  // 5 - Created At
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => formatDate(row.createdAt),
    meta: { displayName: 'Ngày tạo' },
  },

  // 6 - Created By
  {
    id: 'createdBy',
    accessorKey: 'createdBy',
    header: 'Người tạo',
    cell: ({ row }) => row.createdBy,
    meta: { displayName: 'Người tạo' },
  },

  // 7 - Balanced At
  {
    id: 'balancedAt',
    accessorKey: 'balancedAt',
    header: 'Ngày cân bằng',
    cell: ({ row }) => formatDate(row.balancedAt),
    meta: { displayName: 'Ngày cân bằng' },
  },

  // 8 - Items count
  {
    id: 'itemsCount',
    header: 'Số dòng',
    cell: ({ row }) => row.items?.length ?? 0,
    meta: { displayName: 'Số dòng' },
  },

  // 9 - System qty total
  {
    id: 'systemQty',
    header: 'Tổng hệ thống',
    cell: ({ row }) => row.items?.reduce((s, i) => s + (i.systemQuantity || 0), 0),
    meta: { displayName: 'Tổng hệ thống' },
  },

  // 10 - Actual qty total
  {
    id: 'actualQty',
    header: 'Tổng thực tế',
    cell: ({ row }) => row.items?.reduce((s, i) => s + (i.actualQuantity || 0), 0),
    meta: { displayName: 'Tổng thực tế' },
  },

  // 11 - Difference total
  {
    id: 'difference',
    header: 'Chênh lệch',
    cell: ({ row }) => row.items?.reduce((s, i) => s + ((i.actualQuantity || 0) - (i.systemQuantity || 0)), 0),
    meta: { displayName: 'Chênh lệch' },
  },

  // 12 - Item preview
  {
    id: 'itemPreview',
    header: 'Mô tả hàng',
    cell: ({ row }) => (
      <div className="max-w-[240px] truncate" title={row.items?.map(i => i.productName).slice(0,3).join(', ')}>
        {row.items?.map(i => i.productName).slice(0,3).join(', ')}{row.items && row.items.length > 3 ? '...' : ''}
      </div>
    ),
    meta: { displayName: 'Mô tả hàng' },
  },

  // 13 - Note
  {
    id: 'note',
    accessorKey: 'note',
    header: 'Ghi chú',
    cell: ({ row }) => (
      <div className="max-w-[240px] truncate" title={row.note}>{row.note}</div>
    ),
    meta: { displayName: 'Ghi chú' },
  },

  // 14 - Actions (sticky right)
  {
    id: 'actions',
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/inventory-checks/${row.systemId}`)}>
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Pencil className="mr-2 h-4 w-4" />Sửa
            </DropdownMenuItem>
            {row.status === 'draft' && (
              <DropdownMenuItem onClick={() => onBalance(row.systemId)}>
                <Check className="mr-2 h-4 w-4" />Cân bằng
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(row.systemId)}>
              <Trash2 className="mr-2 h-4 w-4" />Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { displayName: 'Hành động', sticky: 'right' },
    size: 90,
  }
];
