import * as React from 'react';
import type { CashAccount } from '../../cashbook/types.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from '../../../components/data-table/types.ts';
import type { Branch } from "../branches/types.ts";
import type { SystemId } from "../../../lib/id-types.ts";

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export const getColumns = (
  onEdit: (account: CashAccount) => void,
  onDelete: (systemId: SystemId) => void,
  branches: Branch[]
): ColumnDef<CashAccount>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: "Tên tài khoản quỹ",
    cell: ({ row }) => <div className="font-medium">{row.name}</div>,
    meta: { displayName: "Tên tài khoản quỹ" },
  },
  {
    id: "branch",
    accessorKey: "branchSystemId",
    header: "Chi nhánh",
    cell: ({ row }) => {
      const branch = branches.find(b => b.systemId === row.branchSystemId);
      return branch?.name || 'N/A';
    },
    meta: { displayName: "Chi nhánh" },
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => row.type === 'bank' ? 'Ngân hàng' : 'Tiền mặt',
    meta: { displayName: "Loại tài khoản" },
  },
  {
    id: "bankAccountNumber",
    accessorKey: "bankAccountNumber",
    header: "Số tài khoản",
    cell: ({ row }) => row.bankAccountNumber || '-',
    meta: { displayName: "Số tài khoản" },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Mã tài khoản",
    cell: ({ row }) => row.id,
    meta: { displayName: "Mã tài khoản" },
  },
  {
    id: "initialBalance",
    accessorKey: "initialBalance",
    header: "Số dư ban đầu",
    cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.initialBalance)}</span>,
    meta: { displayName: "Số dư ban đầu" },
  },
   {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => (
       <div className="flex items-center justify-center">
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
      sticky: "right",
    },
    size: 90,
  },
];
