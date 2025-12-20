import * as React from "react";
import type { Unit } from './types'
import type { SystemId } from '@/lib/id-types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from '../../../components/data-table/types';

interface ColumnOptions {
  onEdit: (unit: Unit) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleDefault: (unit: Unit, checked: boolean) => void;
  onToggleActive: (unit: Unit) => void;
}

export const getUnitColumns = ({
  onEdit,
  onDelete,
  onToggleDefault,
  onToggleActive,
}: ColumnOptions): ColumnDef<Unit>[] => [
  { 
    id: "name", 
    accessorKey: "name", 
    header: "Tên đơn vị", 
    cell: ({ row }) => <span className="font-medium">{row.name}</span>, 
    meta: { displayName: "Tên đơn vị" } 
  },
  { 
    id: "description", 
    accessorKey: "description", 
    header: "Mô tả", 
    cell: ({ row }) => <span className="text-muted-foreground">{row.description || '—'}</span>, 
    meta: { displayName: "Mô tả" } 
  },
  {
    id: "isDefault",
    header: "Mặc định",
    cell: ({ row }) => (
      <Switch
        checked={row.isDefault ?? false}
        onCheckedChange={(checked) => onToggleDefault(row, checked)}
        aria-label="Đặt làm mặc định"
      />
    ),
    meta: { displayName: "Mặc định" },
    size: 100,
  },
  {
    id: "isActive",
    header: "Hoạt động",
    cell: ({ row }) => (
      <Switch
        checked={row.isActive !== false}
        onCheckedChange={() => onToggleActive(row)}
        aria-label="Bật/tắt hoạt động"
      />
    ),
    meta: { displayName: "Hoạt động" },
    size: 100,
  },
  { 
    id: "actions", 
    header: () => <div className="text-right">Hành động</div>, 
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(row)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { displayName: "Hành động" }, 
    size: 90 
  },
];
