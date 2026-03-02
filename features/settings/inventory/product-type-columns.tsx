import * as React from "react";
import type { ProductType } from "./types";
import type { ColumnDef } from "../../../components/data-table/types";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface ColumnOptions {
  onEdit: (item: ProductType) => void;
  onDelete: (systemId: ProductType["systemId"]) => void;
  onToggleDefault: (item: ProductType) => void;
  onToggleActive: (item: ProductType) => void;
}

export const getProductTypeColumns = ({
  onEdit,
  onDelete,
  onToggleDefault,
  onToggleActive,
}: ColumnOptions): ColumnDef<ProductType>[] => [
  {
    id: "id",
    header: "Mã loại",
    cell: ({ row }) => <span className="text-sm">{row.id}</span>,
    meta: { displayName: "Mã loại" },
    size: 120,
  },
  {
    id: "name",
    header: "Tên loại",
    cell: ({ row }) => <span className="font-medium">{row.name}</span>,
    meta: { displayName: "Tên loại" },
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
    header: "",
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
