import * as React from "react";
import type { Unit } from './types.ts'
import type { SystemId } from '@/lib/id-types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from '../../../components/data-table/types.ts';

export const getUnitColumns = (
  onEdit: (unit: Unit) => void,
  onDelete: (systemId: SystemId) => void
): ColumnDef<Unit>[] => [
  { id: "name", accessorKey: "name", header: "Tên đơn vị", cell: ({ row }) => <div className="font-medium">{row.name}</div>, meta: { displayName: "Tên đơn vị" } },
  { id: "description", accessorKey: "description", header: "Mô tả", cell: ({ row }) => <span className="text-muted-foreground">{row.description}</span>, meta: { displayName: "Mô tả" } },
  { id: "actions", header: () => <div className="text-right">Hành động</div>, cell: ({ row }) => (
     <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onEdit(row)}>Sửa</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>Xóa</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
     </div>
  ),
  meta: { displayName: "Hành động" }, size: 90 },
];
