import * as React from 'react';
import type { PricingPolicy } from './types.ts';
import type { ColumnDef } from '../../../components/data-table/types.ts';
import { Button } from '../../../components/ui/button.tsx';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu.tsx';

export const getColumns = (
    onEdit: (policy: PricingPolicy) => void,
    onDelete: (systemId: string) => void,
    onSetDefault: (systemId: string) => void,
): ColumnDef<PricingPolicy>[] => [
    { id: 'name', accessorKey: 'name', header: 'Tên', cell: ({ row }) => row.name, meta: { displayName: 'Tên' } },
    { id: 'id', accessorKey: 'id', header: 'Mã', cell: ({ row }) => row.id, meta: { displayName: 'Mã' } },
    { id: 'type', accessorKey: 'type', header: 'Loại giá', cell: ({ row }) => row.type, meta: { displayName: 'Loại giá' } },
    {
        id: 'isDefault',
        accessorKey: 'isDefault',
        header: 'Mặc định',
        cell: ({ row }) => row.isDefault ? (
            <div className="flex items-center font-semibold text-sm">
                <span>{row.type.toUpperCase()}</span>
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
                        {!row.isDefault && <DropdownMenuItem onSelect={() => onSetDefault(row.systemId)}>Đặt làm mặc định</DropdownMenuItem>}
                        <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
        meta: { displayName: 'Hành động' }
    }
];
