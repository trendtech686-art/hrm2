import * as React from 'react';
import type { SalesChannel } from '@/lib/types/prisma-extended';
import type { ColumnDef } from '../../../components/data-table/types';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import type { SystemId } from '@/lib/id-types';

interface ColumnOptions {
  onEdit: (channel: SalesChannel) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleStatus: (channel: SalesChannel, isApplied: boolean) => void;
  onToggleDefault: (channel: SalesChannel, isDefault: boolean) => void;
}

export const getSalesChannelColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleDefault,
}: ColumnOptions): ColumnDef<SalesChannel>[] => [
    { 
        id: 'id',
        accessorKey: 'id',
        header: 'Mã',
        cell: ({ row }) => <span className="text-sm uppercase text-muted-foreground">{row.id ?? '—'}</span>,
        meta: { displayName: 'Mã nguồn' }
    },
    { 
        id: 'name', 
        accessorKey: 'name', 
        header: 'Tên nguồn bán hàng', 
        cell: ({ row }) => <span className="font-medium">{row.name}</span>,
        meta: { displayName: 'Tên nguồn bán hàng' } 
    },
    { 
        id: 'isApplied', 
        accessorKey: 'isApplied', 
        header: 'Trạng thái', 
        cell: ({ row }) => (
            <Switch 
                checked={row.isApplied} 
                onCheckedChange={(checked) => onToggleStatus(row, checked)}
            />
        ),
        meta: { displayName: 'Trạng thái' } 
    },
    { 
        id: 'isDefault', 
        accessorKey: 'isDefault', 
        header: 'Mặc định', 
        cell: ({ row }) => (
            <Switch 
                checked={row.isDefault} 
                onCheckedChange={(checked) => onToggleDefault(row, checked)}
            />
        ),
        meta: { displayName: 'Mặc định' } 
    },
    {
        id: 'actions',
        header: '',
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
        meta: { displayName: '' }
    }
];
