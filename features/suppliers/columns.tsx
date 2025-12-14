import * as React from "react";
import type { Supplier, SupplierStatus } from './types.ts'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import { Button } from "../../components/ui/button.tsx";
import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox.tsx"
import { Badge } from "../../components/ui/badge.tsx"
import { formatDateForDisplay } from '@/lib/date-utils';
import type { ColumnDef } from '../../components/data-table/types.ts';
import type { SystemId } from '@/lib/id-types';

const statusVariants: Record<SupplierStatus, "success" | "secondary"> = {
  "Đang Giao Dịch": "success",
  "Ngừng Giao Dịch": "secondary",
};


export const getColumns = (
  onDelete: (systemId: SystemId) => void,
  onRestore: (systemId: SystemId) => void,
  onEdit: (supplier: Supplier) => void,
  navigate: (path: string) => void,
): ColumnDef<Supplier>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
       <div className="flex items-center justify-center">
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
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
    size: 48,
    meta: {
      displayName: "Select",
      sticky: "left",
    },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Mã NCC",
    cell: ({ row }) => <div className="font-medium">{row.id}</div>,
    meta: { displayName: "Mã NCC" },
    size: 100,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Tên Nhà cung cấp",
    cell: ({ row }) => row.name,
    meta: { displayName: "Tên Nhà cung cấp" },
  },
  {
    id: "taxCode",
    accessorKey: "taxCode",
    header: "Mã số thuế",
    cell: ({ row }) => row.taxCode,
    meta: { displayName: "Mã số thuế" },
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => row.phone,
    meta: { displayName: "Số điện thoại" },
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.email,
    meta: { displayName: "Email" },
  },
    {
    id: "address",
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => row.address,
    meta: { displayName: "Địa chỉ" },
  },
  {
    id: "website",
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => row.website || "-",
    meta: { displayName: "Website" },
  },
  {
    id: "contactPerson",
    accessorKey: "contactPerson",
    header: "Người liên hệ",
    cell: ({ row }) => row.contactPerson || "-",
    meta: { displayName: "Người liên hệ" },
  },
  {
    id: "accountManager",
    accessorKey: "accountManager",
    header: "Người phụ trách",
    cell: ({ row }) => row.accountManager,
    meta: { displayName: "Người phụ trách" },
  },
  {
    id: "currentDebt",
    accessorKey: "currentDebt",
    header: "Công nợ",
    cell: ({ row }) => {
      if (!row.currentDebt) return "0 ₫";
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.currentDebt);
    },
    meta: { displayName: "Công nợ" },
  },
  {
    id: "bankAccount",
    accessorKey: "bankAccount",
    header: "Số tài khoản",
    cell: ({ row }) => row.bankAccount || "-",
    meta: { displayName: "Số tài khoản" },
  },
  {
    id: "bankName",
    accessorKey: "bankName",
    header: "Ngân hàng",
    cell: ({ row }) => row.bankName || "-",
    meta: { displayName: "Ngân hàng" },
  },
  {
    id: "notes",
    accessorKey: "notes",
    header: "Ghi chú",
    cell: ({ row }) => row.notes || "-",
    meta: { displayName: "Ghi chú" },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
        const variant = statusVariants[row.status];
        return <Badge variant={variant as any}>{row.status}</Badge>
    },
    meta: { displayName: "Trạng thái" },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      if (!row.createdAt) return "-";
      return formatDateForDisplay(row.createdAt);
    },
    meta: { displayName: "Ngày tạo" },
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Cập nhật",
    cell: ({ row }) => {
      if (!row.updatedAt) return "-";
      return formatDateForDisplay(row.updatedAt);
    },
    meta: { displayName: "Cập nhật" },
  },
  {
    id: "createdBy",
    accessorKey: "createdBy",
    header: "Người tạo",
    cell: ({ row }) => row.createdBy || "-",
    meta: { displayName: "Người tạo" },
  },
   {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => {
      // ✅ Show restore button for deleted items
      if (row.deletedAt) {
        return (
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRestore(row.systemId)}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Khôi phục
            </Button>
          </div>
        );
      }
      
      // ✅ Show edit/delete for active items
      return (
        <div className="flex items-center justify-center">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Mở menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onEdit(row)}>
                  Sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={() => onDelete(row.systemId)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Chuyển vào thùng rác
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
    meta: {
      displayName: "Hành động",
      sticky: "right",
    },
    size: 90,
  },
];
