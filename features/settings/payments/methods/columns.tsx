import * as React from 'react';
import type { PaymentMethod } from './types.ts';
import type { ColumnDef } from '../../../../components/data-table/types.ts';
import { Button } from '../../../../components/ui/button.tsx';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../components/ui/dropdown-menu.tsx';
import { Badge } from "../../../../components/ui/badge.tsx";

export const getColumns = (
    onEdit: (method: PaymentMethod) => void,
    onDelete: (systemId: string) => void,
    onSetDefault: (systemId: string) => void,
): ColumnDef<PaymentMethod>[] => [
    { id: 'name', accessorKey: 'name', header: 'Tên hình thức', cell: ({ row }) => row.name, meta: { displayName: 'Tên hình thức' } },
    {
        id: 'isDefault',
        accessorKey: 'isDefault',
        header: 'Mặc định',
        cell: ({ row }) => row.isDefault ? (
            <Badge variant="outline" className="text-amber-600 border-amber-500">
                <Star className="mr-2 h-3 w-3 fill-amber-500 text-amber-500" />
                Mặc định
            </Badge>
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
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
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
