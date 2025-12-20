import * as React from "react";
import type { StorageLocation } from "./storage-location-types";
import type { ColumnDef } from "../../../components/data-table/types";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface ColumnOptions {
  onEdit: (item: StorageLocation) => void;
  onDelete: (systemId: StorageLocation["systemId"]) => void;
  onToggleDefault: (item: StorageLocation) => void;
  onToggleActive: (item: StorageLocation) => void;
}

export const getStorageLocationColumns = ({
  onEdit,
  onDelete,
  onToggleDefault,
  onToggleActive,
}: ColumnOptions): ColumnDef<StorageLocation>[] => [
  {
    id: "id",
    header: "Mã",
    cell: ({ row }) => <span className="font-mono text-sm">{row.id}</span>,
    meta: { displayName: "Mã" },
    size: 120,
  },
  {
    id: "name",
    header: "Tên điểm lưu kho",
    cell: ({ row }) => <span className="font-medium">{row.name}</span>,
    meta: { displayName: "Tên điểm lưu kho" },
  },
  {
    id: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.description || "—"}</span>
    ),
    meta: { displayName: "Mô tả" },
  },
  {
    id: "isDefault",
    header: "Mặc định",
    cell: ({ row }) => (
      <Switch
        checked={row.isDefault ?? false}
        onCheckedChange={() => onToggleDefault(row)}
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
    header: () => <div className="text-right">Thao tác</div>,
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
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onEdit(row)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    size: 100,
    meta: { displayName: "Thao tác" },
  },
];
