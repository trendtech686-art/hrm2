import * as React from "react";
import * as ReactRouterDOM from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { Penalty, PenaltyStatus } from './types.ts'
import { Checkbox } from "../../../components/ui/checkbox.tsx"
import { Badge } from "../../../components/ui/badge.tsx"
import type { ColumnDef } from '../../../components/data-table/types.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreHorizontal } from "lucide-react";

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const statusVariants: Record<PenaltyStatus, "warning" | "success" | "secondary"> = {
    "Chưa thanh toán": "warning",
    "Đã thanh toán": "success",
    "Đã hủy": "secondary",
};

export const getColumns = (
  onDelete: (id: string) => void,
  onEdit: (penalty: Penalty) => void,
  navigate: (path: string) => void,
): ColumnDef<Penalty>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <Checkbox
        checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
        onCheckedChange={(value) => onToggleAll(!!value)}
      />
    ),
    cell: ({ isSelected, onToggleSelect }) => (
      <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
    ),
    size: 48,
    meta: { displayName: "Select", sticky: "left" },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Mã Phiếu",
    cell: ({ row }) => (
      <button
        onClick={() => navigate(`/penalties/${row.systemId}`)}
        className="font-medium text-primary hover:underline"
      >
        {row.id}
      </button>
    ),
    meta: { displayName: "Mã Phiếu phạt" },
  },
  {
    id: "employeeId",
    accessorKey: "employeeId",
    header: "Mã NV",
    cell: ({ row }) => row.employeeId || '-',
    meta: { displayName: "Mã nhân viên" },
  },
  {
    id: "employeeName",
    accessorKey: "employeeName",
    header: "Nhân viên",
    cell: ({ row }) => row.employeeName,
    meta: { displayName: "Nhân viên" },
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Loại vi phạm",
    cell: ({ row }) => row.category || '-',
    meta: { displayName: "Loại vi phạm" },
  },
  {
    id: "reason",
    accessorKey: "reason",
    header: "Lý do",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.reason}>
        {row.reason}
      </div>
    ),
    meta: { displayName: "Lý do" },
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Số tiền",
    cell: ({ row }) => <span className="font-semibold text-destructive">{formatCurrency(row.amount)}</span>,
    meta: { displayName: "Số tiền phạt" },
  },
  {
    id: "issueDate",
    accessorKey: "issueDate",
    header: "Ngày lập",
    cell: ({ row }) => formatDate(row.issueDate),
    meta: { displayName: "Ngày lập phiếu" },
  },
  {
    id: "dueDate",
    accessorKey: "dueDate",
    header: "Hạn thanh toán",
    cell: ({ row }) => row.dueDate ? formatDate(row.dueDate) : '-',
    meta: { displayName: "Hạn thanh toán" },
  },
  {
    id: "paidDate",
    accessorKey: "paidDate",
    header: "Ngày thanh toán",
    cell: ({ row }) => row.paidDate ? formatDate(row.paidDate) : '-',
    meta: { displayName: "Ngày thanh toán" },
  },
  {
    id: "issuerName",
    accessorKey: "issuerName",
    header: "Người lập",
    cell: ({ row }) => row.issuerName,
    meta: { displayName: "Người lập phiếu" },
  },
  {
    id: "approverName",
    accessorKey: "approverName",
    header: "Người duyệt",
    cell: ({ row }) => row.approverName || '-',
    meta: { displayName: "Người duyệt" },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <Badge variant={statusVariants[row.status]}>{row.status}</Badge>,
    meta: { displayName: "Trạng thái" },
  },
  {
    id: "notes",
    accessorKey: "notes",
    header: "Ghi chú",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.notes}>
        {row.notes || '-'}
      </div>
    ),
    meta: { displayName: "Ghi chú" },
  },
  {
    id: "attachments",
    accessorKey: "attachments",
    header: "Đính kèm",
    cell: ({ row }) => {
      const count = row.attachments?.length || 0;
      return count > 0 ? `${count} file` : '-';
    },
    meta: { displayName: "Tệp đính kèm" },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => row.createdAt ? formatDateTime(row.createdAt) : '-',
    meta: { displayName: "Ngày tạo" },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => navigate(`/penalties/${row.systemId}`)}>Xem chi tiết</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate(`/penalties/${row.systemId}/edit`)}>Sửa</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.id)}>
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    ),
    meta: { displayName: "Hành động", sticky: "right" },
    size: 90,
  },
];
