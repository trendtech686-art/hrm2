import * as React from "react";
import type { Ward } from './types.ts'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from '../../../components/data-table/types.ts';

export const getWardColumns = (
  onEdit: (ward: Ward) => void,
  onDelete: (systemId: string) => void
): ColumnDef<Ward>[] => [
  {
    id: "id",
    accessorKey: "id",
    header: "Mã Phường/Xã",
    cell: ({ row }) => <div className="font-medium">{row.id}</div>,
    meta: { displayName: "Mã Phường/Xã" },
    size: 150,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Tên Phường/Xã",
    cell: ({ row }) => row.name,
    meta: { displayName: "Tên Phường/Xã" },
  },
   {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => (
       <div className="flex items-center justify-center">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(row)}>Sửa</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
       </div>
    ),
    meta: {
      displayName: "Hành động",
    },
    size: 90,
  },
];
