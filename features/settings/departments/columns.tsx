import * as React from "react";
import type { Department } from './types.ts'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "../../../components/ui/checkbox.tsx"
import { DataTableColumnHeader } from "../../../components/data-table/data-table-column-header.tsx"
import type { ColumnDef } from '../../../components/data-table/types.ts';
import { useEmployeeStore } from "../../employees/store.ts";

// FIX: Changed navigate to onEdit to support modal-based editing, since the dedicated edit page was removed.
export const getColumns = (
  onEdit: (department: Department) => void,
  onDelete: (systemId: string) => void
): ColumnDef<Department>[] => {
  const { data: employees } = useEmployeeStore.getState();

  return [
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
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Tên phòng ban"
        sortKey="name"
        isSorted={sorting.id === 'name'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'name', desc: s.id === 'name' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => row.name,
    meta: {
      displayName: "Tên phòng ban",
    },
  },
  {
    id: "manager",
    accessorKey: "managerId",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Trưởng phòng"
        sortKey="managerId"
        isSorted={sorting.id === 'managerId'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'managerId', desc: s.id === 'managerId' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => {
      const manager = employees.find(e => e.systemId === row.managerId);
      return manager ? manager.fullName : '';
    },
    meta: {
      displayName: "Trưởng phòng",
    },
  },
  {
    id: "actions",
    header: "Sửa",
    cell: ({ row }) => (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* FIX: Changed navigation to trigger the onEdit callback for modal editing. */}
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
    ),
    meta: {
      displayName: "Sửa",
    },
  },
]};
