import * as React from "react";
import type { PaymentMethod } from "./types";
import type { ColumnDef } from "../../../../components/data-table/types";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Power, PowerOff, Star, Trash2 } from "lucide-react";
import * as Icons from "lucide-react";

interface ColumnOptions {
  onEdit: (method: PaymentMethod) => void;
  onToggleStatus: (method: PaymentMethod) => void;
  onSetDefault: (systemId: PaymentMethod["systemId"]) => void;
  onDelete: (systemId: PaymentMethod["systemId"]) => void;
}

const getIconComponent = (icon?: string) => {
  if (!icon) return null;
  const library = Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return library[icon] ?? null;
};

export const getPaymentMethodColumns = ({
  onEdit,
  onToggleStatus,
  onSetDefault,
  onDelete,
}: ColumnOptions): ColumnDef<PaymentMethod>[] => [
  {
    id: "name",
    header: "Tên hình thức",
    cell: ({ row }) => {
      const IconComponent = getIconComponent(row.icon);

      return (
        <div className="flex items-center gap-2">
          {IconComponent && (
            <div
              className="flex h-8 w-8 items-center justify-center rounded"
              style={{ backgroundColor: row.color || "#6b7280" }}
            >
              <IconComponent className="h-4 w-4 text-white" />
            </div>
          )}
          <span className="font-medium">{row.name}</span>
        </div>
      );
    },
    meta: { displayName: "Tên hình thức" },
  },
  {
    id: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <Badge variant={row.isActive ? "default" : "secondary"}>
        {row.isActive ? "Hoạt động" : "Ngừng"}
      </Badge>
    ),
    meta: { displayName: "Trạng thái" },
  },
  {
    id: "isDefault",
    header: "Mặc định",
    cell: ({ row }) =>
      row.isDefault ? <Badge variant="outline">Mặc định</Badge> : null,
    meta: { displayName: "Mặc định" },
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
            <DropdownMenuItem onSelect={() => onToggleStatus(row)}>
              {row.isActive ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Ngừng hoạt động
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Kích hoạt
                </>
              )}
            </DropdownMenuItem>
            {!row.isDefault && (
              <DropdownMenuItem onSelect={() => onSetDefault(row.systemId)}>
                <Star className="mr-2 h-4 w-4" />
                Đặt làm mặc định
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={() => onDelete(row.systemId)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { displayName: "Thao tác" },
    size: 120,
  },
];
