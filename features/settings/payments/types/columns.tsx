import * as React from 'react';
import type { PaymentType } from '@/lib/types/prisma-extended';
import type { ColumnDef } from '../../../../components/data-table/types';
import { Button } from '../../../../components/ui/button';
import { Switch } from '../../../../components/ui/switch';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../components/ui/dropdown-menu';
import type { SystemId } from '@/lib/id-types';

interface ColumnOptions {
  onEdit: (item: PaymentType) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleStatus: (item: PaymentType, isActive: boolean) => void;
  onToggleDefault: (item: PaymentType, isDefault: boolean) => void;
}

export const getPaymentTypeColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleDefault,
}: ColumnOptions): ColumnDef<PaymentType>[] => [
  { 
    id: 'id',
    accessorKey: 'id',
    header: 'Mã loại',
    cell: ({ row }) => <span className="font-semibold uppercase">{row.id}</span>,
    meta: { displayName: 'Mã loại' }
  },
  { 
    id: 'name', 
    accessorKey: 'name', 
    header: 'Tên loại', 
    cell: ({ row }) => <span className="font-medium">{row.name}</span>,
    meta: { displayName: 'Tên loại' } 
  },
  { 
    id: 'description', 
    accessorKey: 'description', 
    header: 'Mô tả', 
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.description || "—"}</span>
    ),
    meta: { displayName: 'Mô tả' } 
  },
  { 
    id: 'isDefault', 
    accessorKey: 'isDefault', 
    header: 'Mặc định', 
    cell: ({ row }) => (
      <Switch 
        checked={row.isDefault ?? false} 
        onCheckedChange={(checked) => onToggleDefault(row, checked)}
      />
    ),
    meta: { displayName: 'Mặc định' } 
  },
  { 
    id: 'isActive', 
    accessorKey: 'isActive', 
    header: 'Trạng thái', 
    cell: ({ row }) => (
      <Switch 
        checked={row.isActive} 
        onCheckedChange={(checked) => onToggleStatus(row, checked)}
      />
    ),
    meta: { displayName: 'Trạng thái' } 
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Thao tác</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(row)}>Sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { displayName: 'Thao tác' }
  }
];
