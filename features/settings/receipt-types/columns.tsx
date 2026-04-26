import * as React from "react";
import type { ReceiptType } from '@/lib/types/prisma-extended';
import type { ColumnDef } from "../../../components/data-table/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { MoreHorizontal } from "lucide-react";

interface ColumnOptions {
  onEdit: (receiptType: ReceiptType) => void;
  onToggleDefault: (receiptType: ReceiptType, isDefault: boolean) => void;
  onToggleStatus: (receiptType: ReceiptType, isActive: boolean) => void;
  onToggleBusinessResult: (receiptType: ReceiptType, isBusinessResult: boolean) => void;
  onDelete: (systemId: ReceiptType["systemId"]) => void;
}

export const getReceiptTypeColumns = ({
  onEdit,
  onToggleDefault,
  onToggleStatus,
  onToggleBusinessResult,
  onDelete,
}: ColumnOptions): ColumnDef<ReceiptType>[] => [
  {
    id: "id",
    header: "Mã loại",
    cell: ({ row }) => <span className="font-medium">{row.id}</span>,
    meta: { displayName: "Mã loại" },
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
    id: "isBusinessResult",
    header: "Hạch toán",
    cell: ({ row }) => (
      <Switch 
        checked={row.isBusinessResult ?? false} 
        onCheckedChange={(checked) => onToggleBusinessResult(row, checked)}
      />
    ),
    meta: { displayName: "Hạch toán" },
  },
  {
    id: "default",
    header: "Mặc định",
    cell: ({ row }) => (
      <Switch 
        checked={row.isDefault ?? false} 
        onCheckedChange={(checked) => onToggleDefault(row, checked)}
      />
    ),
    meta: { displayName: "Mặc định" },
  },
  {
    id: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <Switch 
        checked={row.isActive} 
        onCheckedChange={(checked) => onToggleStatus(row, checked)}
      />
    ),
    meta: { displayName: "Trạng thái" },
  },
  {
    id: "actions",
    header: '',
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-11 w-11 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(row)}>
              Chỉnh sửa
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
    meta: { displayName: "Thao tác" },
    size: 130,
  },
];
