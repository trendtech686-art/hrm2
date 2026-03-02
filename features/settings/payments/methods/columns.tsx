import * as React from "react";
import type { PaymentMethod } from '@/lib/types/prisma-extended';
import type { ColumnDef } from "../../../../components/data-table/types";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { SystemId } from "@/lib/id-types";

interface ColumnOptions {
  onEdit: (method: PaymentMethod) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleStatus: (method: PaymentMethod, isActive: boolean) => void;
  onToggleDefault: (method: PaymentMethod, isDefault: boolean) => void;
  onSetDefault: (systemId: SystemId) => void;
}

export const getPaymentMethodColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleDefault,
  onSetDefault,
}: ColumnOptions): ColumnDef<PaymentMethod>[] => [
  {
    id: "id",
    header: "Mã",
    size: 110,
    cell: ({ row }) => (
      <span className="font-medium">{row.id ?? '—'}</span>
    ),
    meta: { displayName: "Mã" },
  },
  {
    id: "name",
    header: "Tên & mô tả",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.name}</p>
        {row.description && (
          <p className="text-sm text-muted-foreground">{row.description}</p>
        )}
      </div>
    ),
    meta: { displayName: "Tên" },
  },
  {
    id: "accountInfo",
    header: "Thông tin tài khoản",
    size: 220,
    cell: ({ row }) => {
      if (row.accountName || row.accountNumber || row.bankName) {
        return (
          <div className="text-sm leading-relaxed">
            {row.accountName && <p className="font-medium">{row.accountName}</p>}
            {row.accountNumber && (
              <p className="text-xs text-muted-foreground">{row.accountNumber}</p>
            )}
            {row.bankName && <p className="text-muted-foreground">{row.bankName}</p>}
          </div>
        );
      }
      return <span className="text-sm text-muted-foreground">—</span>;
    },
    meta: { displayName: "Thông tin tài khoản" },
  },
  {
    id: "isDefault",
    header: "Mặc định",
    size: 100,
    cell: ({ row }) => (
      <Switch
        checked={row.isDefault ?? false}
        onCheckedChange={(checked) => onToggleDefault(row, checked)}
      />
    ),
    meta: { displayName: "Mặc định" },
  },
  {
    id: "isActive",
    header: "Trạng thái",
    size: 100,
    cell: ({ row }) => (
      <Switch
        checked={row.isActive ?? true}
        onCheckedChange={(checked) => onToggleStatus(row, checked)}
      />
    ),
    meta: { displayName: "Trạng thái" },
  },
  {
    id: "actions",
    header: '',
    size: 80,
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
            <DropdownMenuItem onSelect={() => onEdit(row)}>Chỉnh sửa</DropdownMenuItem>
            {!row.isDefault && (
              <DropdownMenuItem onSelect={() => onSetDefault(row.systemId)}>
                Đặt làm mặc định
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={() => onDelete(row.systemId)}
              className="text-destructive"
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { displayName: "Thao tác" },
  },
];
