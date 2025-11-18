import * as React from "react";
import type { TargetGroup } from './types.ts'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from '../../../components/data-table/types.ts';

export const getColumns = (
  onEdit: (group: TargetGroup) => void,
  onDelete: (systemId: string) => void
): ColumnDef<TargetGroup>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: "Tên nhóm",
    cell: ({ row }) => <div className="font-medium">{row.name}</div>,
    meta: { displayName: "Tên nhóm" },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Mã nhóm",
    cell: ({ row }) => row.id,
    meta: { displayName: "Mã nhóm" },
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
            <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
       </div>
    ),
    meta: {
      displayName: "Hành động",
      sticky: "right",
    },
    size: 90,
  },
];
