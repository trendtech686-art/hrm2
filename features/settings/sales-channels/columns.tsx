import * as React from 'react';
import type { SalesChannel } from './types.ts';
import type { ColumnDef } from '../../../components/data-table/types.ts';
import { Button } from '../../../components/ui/button.tsx';
import { MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu.tsx';
import type { SystemId } from '@/lib/id-types';

export const getColumns = (
    onEdit: (channel: SalesChannel) => void,
    onDelete: (systemId: SystemId) => void
): ColumnDef<SalesChannel>[] => [
    { 
        id: 'id',
        accessorKey: 'id',
        header: 'Mã',
        cell: ({ row }) => <span className="font-mono text-sm">{row.id}</span>,
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
        header: 'Áp dụng cho cửa hàng', 
        cell: ({ row }) => (
            <span className={row.isApplied ? 'text-green-600' : 'text-muted-foreground'}>
                {row.isApplied ? 'Đang áp dụng' : 'Không áp dụng'}
            </span>
        ),
        meta: { displayName: 'Áp dụng cho cửa hàng' } 
    },
    { 
        id: 'isDefault', 
        accessorKey: 'isDefault', 
        header: 'Mặc định', 
        cell: ({ row }) => row.isDefault ? (
            <div className="flex justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
        ) : null,
        meta: { displayName: 'Mặc định' } 
    },
    {
        id: 'actions',
        header: () => <div className="text-right">Hành động</div>,
        cell: ({ row }) => (
            <div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onEdit(row)}>Sửa</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
        meta: { displayName: 'Hành động' }
    }
];
