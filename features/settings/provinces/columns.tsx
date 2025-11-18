import * as React from "react";
import * as ReactRouterDOM from 'react-router-dom';
import type { Province } from './types.ts'
import { Checkbox } from "../../../components/ui/checkbox.tsx"
import type { ColumnDef } from '../../../components/data-table/types.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreHorizontal } from "lucide-react";

export const getColumns = (
  onDelete: (id: string) => void,
  onEdit: (province: Province) => void,
  navigate: (path: string) => void,
): ColumnDef<Province>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
       <div className="flex items-center justify-center">
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ isSelected, onToggleSelect }) => (
       <div className="flex items-center justify-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Select row"
        />
      </div>
    ),
    size: 48,
    meta: {
      displayName: "Select",
      sticky: "left",
    },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Mã Tỉnh thành",
    cell: ({ row }) => <div className="font-medium">{row.id}</div>,
    meta: { displayName: "Mã Tỉnh thành" },
    size: 150,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Tên Tỉnh thành",
    cell: ({ row }) => row.name,
    meta: { displayName: "Tên Tỉnh thành" },
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
              {/* FIX: Use systemId for navigation to the detail page. */}
              <DropdownMenuItem onSelect={() => navigate(`/settings/provinces/${row.systemId}`)}>Xem chi tiết</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(row)}>Sửa</DropdownMenuItem>
              {/* FIX: Use systemId for the delete action. */}
              <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>
                Xóa
              </DropdownMenuItem>
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
