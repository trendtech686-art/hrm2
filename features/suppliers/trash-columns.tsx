import * as React from "react"
import type { NavigateFunction } from 'react-router-dom';
import type { ColumnDef } from "../../components/data-table/types.ts"
import type { Supplier } from "./types.ts"
import { Badge } from "../../components/ui/badge.tsx"
import { Button } from "../../components/ui/button.tsx"
import { RotateCcw, Trash2 } from "lucide-react"

export function getColumns(
  navigate: NavigateFunction,
  onRestore: (systemId: string) => void,
  onPermanentDelete: (systemId: string) => void
): ColumnDef<Supplier>[] {
  return [
    {
      id: "id",
      accessorKey: "id",
      header: "Mã NCC",
      cell: ({ row }) => <span className="font-medium">{row.id}</span>,
      meta: { displayName: "Mã NCC" }
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Tên nhà cung cấp",
      cell: ({ row }) => <span className="font-semibold">{row.name}</span>,
      meta: { displayName: "Tên nhà cung cấp" }
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Số điện thoại",
      cell: ({ row }) => row.phone || '-',
      meta: { displayName: "Số điện thoại" }
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.email || '-',
      meta: { displayName: "Email" }
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const variant = row.status === "Đang Giao Dịch" ? "success" : "secondary";
        return <Badge variant={variant as any}>{row.status}</Badge>;
      },
      meta: { displayName: "Trạng thái" }
    },
    {
      id: "deletedAt",
      accessorKey: "deletedAt",
      header: "Ngày xóa",
      cell: ({ row }) => row.deletedAt ? new Date(row.deletedAt).toLocaleString('vi-VN') : '-',
      meta: { displayName: "Ngày xóa" }
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRestore(row.systemId);
            }}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Khôi phục
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPermanentDelete(row.systemId);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1 text-destructive" />
            Xóa vĩnh viễn
          </Button>
        </div>
      ),
      meta: { displayName: "Thao tác" }
    }
  ]
}
