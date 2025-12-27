import * as React from "react";
import type { StockLocation } from '@/lib/types/prisma-extended'
import type { Branch } from '../settings/branches/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from '../../components/data-table/types';

export const getColumns = (
  onEdit: (location: StockLocation) => void,
  onDelete: (systemId: string) => void,
  branches: Branch[]
): ColumnDef<StockLocation>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: "Tên điểm lưu kho",
    cell: ({ row }) => <div className="font-medium">{row.name}</div>,
    meta: { displayName: "Tên điểm lưu kho" },
  },
   {
    id: "branchSystemId",
    accessorKey: "branchSystemId",
    header: "Chi nhánh",
    cell: ({ row }) => branches.find(b => b.systemId === row.branchSystemId)?.name || 'N/A',
    meta: { displayName: "Chi nhánh" },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => row.id,
    meta: { displayName: "Mã" },
  },
   {
    id: "actions",
    header: () => <div className="text-right">Hành động</div>,
    cell: ({ row }) => (
       <div className="text-right">
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
    },
    size: 90,
  },
];
