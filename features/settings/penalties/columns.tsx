import * as React from "react";
import { formatDate } from '@/lib/date-utils';
import type { SystemId } from '@/lib/id-types';
import type { Penalty, PenaltyStatus } from './types.ts';
import { Checkbox } from "../../../components/ui/checkbox.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
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
  onDelete: (systemId: SystemId) => void,
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
    id: "employeeSystemId",
    accessorKey: "employeeSystemId",
    header: "Mã NV",
    cell: ({ row }) => row.employeeSystemId,
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
    id: "issuerName",
    accessorKey: "issuerName",
    header: "Người lập",
    cell: ({ row }) => row.issuerName,
    meta: { displayName: "Người lập phiếu" },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <Badge variant={statusVariants[row.status]}>{row.status}</Badge>,
    meta: { displayName: "Trạng thái" },
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
              <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>
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
