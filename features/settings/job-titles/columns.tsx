import * as React from "react";
import type { JobTitle } from '@/lib/types/prisma-extended'
// FIX: Replaced missing `DataTableRowActions` component with an inline `DropdownMenu` implementation to resolve module error.
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Switch } from "../../../components/ui/switch";
import type { ColumnDef } from '../../../components/data-table/types';

export const getColumns = (
  onDelete: (systemId: string) => void,
  onEdit: (jobTitle: JobTitle) => void,
  onToggleActive?: (jobTitle: JobTitle) => void
): ColumnDef<JobTitle>[] => [
  {
    id: "id",
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => <span>{row.id}</span>,
    meta: { displayName: "Mã chức vụ" },
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Tên chức vụ",
    cell: ({ row }) => <div>{row.name}</div>,
    meta: { displayName: "Tên chức vụ" },
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => <span>{row.description}</span>,
    meta: { displayName: "Mô tả" },
  },
  {
    id: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => (
      <Switch 
        checked={row.isActive !== false}
        onCheckedChange={() => onToggleActive?.(row)}
      />
    ),
    meta: { displayName: "Trạng thái" },
    size: 100,
  },
   {
    id: "actions",
    header: "",
    cell: ({ row }) => (
       <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-11 w-11 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(row)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => onDelete(row.systemId)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
       </div>
    ),
    meta: {
      displayName: "",
      sticky: "right",
    },
    size: 90,
  },
];
