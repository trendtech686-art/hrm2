import * as React from "react";
import type { JobTitle } from './types.ts'
// FIX: Replaced missing `DataTableRowActions` component with an inline `DropdownMenu` implementation to resolve module error.
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox.tsx"
import type { ColumnDef } from '../../../components/data-table/types.ts';

export const getColumns = (
  onDelete: (systemId: string) => void,
  onEdit: (jobTitle: JobTitle) => void
): ColumnDef<JobTitle>[] => [
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
    size: 60,
    meta: {
      displayName: "Select",
      sticky: "left",
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Tên chức vụ",
    cell: ({ row }) => <div className="font-medium">{row.name}</div>,
    meta: { displayName: "Tên chức vụ" },
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => <span className="text-muted-foreground">{row.description}</span>,
    meta: { displayName: "Mô tả" },
  },
   {
    id: "actions",
    header: () => <div className="text-center">Sửa</div>,
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
      displayName: "Sửa",
      sticky: "right",
    },
    size: 90,
  },
];
