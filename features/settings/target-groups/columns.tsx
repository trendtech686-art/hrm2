import * as React from 'react';
import type { TargetGroup } from '@/lib/types/prisma-extended';
import type { ColumnDef } from '../../../components/data-table/types';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import type { SystemId } from '@/lib/id-types';

interface ColumnOptions {
  onEdit: (item: TargetGroup) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleStatus: (item: TargetGroup, isActive: boolean) => void;
  onToggleDefault: (item: TargetGroup, isDefault: boolean) => void;
}

export const getTargetGroupColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleDefault,
}: ColumnOptions): ColumnDef<TargetGroup>[] => [
  { 
    id: 'id',
    accessorKey: 'id',
    header: 'Mã nhóm',
    cell: ({ row }) => <span className="font-medium">{row.id}</span>,
    meta: { displayName: 'Mã nhóm' }
  },
  { 
    id: 'name', 
    accessorKey: 'name', 
    header: 'Tên nhóm', 
    cell: ({ row }) => <span className="font-medium">{row.name}</span>,
    meta: { displayName: 'Tên nhóm' } 
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
        checked={row.isActive ?? true} 
        onCheckedChange={(checked) => onToggleStatus(row, checked)}
      />
    ),
    meta: { displayName: 'Trạng thái' } 
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-11 w-11 p-0">
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
    meta: { displayName: '' }
  }
];
