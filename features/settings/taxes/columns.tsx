import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../../../components/ui/badge.tsx';
import { Button } from '../../../components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu.tsx';
import { MoreHorizontal, Pencil, Trash2, Star } from 'lucide-react';
import type { Tax } from './types.ts';

export const createTaxColumns = (
  onEdit: (tax: Tax) => void,
  onDelete: (tax: Tax) => void,
  onSetDefault: (tax: Tax) => void
): ColumnDef<Tax>[] => [
  {
    accessorKey: 'id',
    header: 'Mã thuế',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.id}</span>
        {row.original.isDefault && (
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        )}
      </div>
    ),
    meta: { displayName: 'Mã thuế' },
  },
  {
    accessorKey: 'name',
    header: 'Tên thuế',
    meta: { displayName: 'Tên thuế' },
  },
  {
    accessorKey: 'rate',
    header: 'Thuế suất',
    cell: ({ row }) => `${row.original.rate}%`,
    meta: { displayName: 'Thuế suất' },
  },
  {
    accessorKey: 'type',
    header: 'Loại thuế',
    cell: ({ row }) => (
      <Badge variant={row.original.type === 'purchase' ? 'default' : 'secondary'}>
        {row.original.type === 'purchase' ? 'Thuế nhập hàng' : 'Thuế bán hàng'}
      </Badge>
    ),
    meta: { displayName: 'Loại thuế' },
  },
  {
    accessorKey: 'inclusionType',
    header: 'Loại giá',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.inclusionType === 'exclusive'
          ? 'Chưa bao gồm thuế'
          : 'Đã bao gồm thuế'}
      </span>
    ),
    meta: { displayName: 'Loại giá' },
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.description || '—'}
      </span>
    ),
    meta: { displayName: 'Mô tả' },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!row.original.isDefault && (
            <>
              <DropdownMenuItem onClick={() => onSetDefault(row.original)}>
                <Star className="mr-2 h-4 w-4" />
                Đặt làm mặc định
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            <Pencil className="mr-2 h-4 w-4" />
            Sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(row.original)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
