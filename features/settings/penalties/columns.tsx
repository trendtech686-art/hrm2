import * as React from "react";
import { formatDate } from '@/lib/date-utils';
import type { SystemId } from '@/lib/id-types';
import type { Penalty, PenaltyStatus, PenaltyCategory } from './types';
import { penaltyCategoryLabels, penaltyCategoryColors } from './types';
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";
import type { ColumnDef } from '../../../components/data-table/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
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
  onMarkPaid: (penalty: Penalty) => void,
  onCancel: (penalty: Penalty) => void,
  navigate: (path: string) => void,
): ColumnDef<Penalty>[] => [
  // Select column - sticky left
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <Checkbox
        checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
        onCheckedChange={(value) => onToggleAll?.(!!value)}
        aria-label="Chọn tất cả"
      />
    ),
    cell: ({ onToggleSelect, isSelected }) => (
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggleSelect}
        aria-label="Chọn hàng"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    size: 48,
    meta: { displayName: "Chọn", sticky: "left" },
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
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.employeeSystemId?.replace('EMP', '')}</span>
    ),
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
    id: "penaltyTypeName",
    accessorKey: "penaltyTypeName",
    header: "Loại phạt",
    cell: ({ row }) => row.penaltyTypeName || '-',
    meta: { displayName: "Loại phạt" },
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Phân loại",
    cell: ({ row }) => {
      if (!row.category) return '-';
      return (
        <Badge variant="outline" className={penaltyCategoryColors[row.category]}>
          {penaltyCategoryLabels[row.category]}
        </Badge>
      );
    },
    meta: { displayName: "Phân loại" },
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
    id: "linkedComplaintSystemId",
    accessorKey: "linkedComplaintSystemId",
    header: "Mã Khiếu nại",
    cell: ({ row }) => row.linkedComplaintSystemId ? (
      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/complaints/${row.linkedComplaintSystemId}`); }}
        className="text-primary hover:underline font-mono text-xs"
      >
        {row.linkedComplaintSystemId}
      </button>
    ) : '-',
    meta: { displayName: "Mã Khiếu nại liên quan" },
  },
  {
    id: "linkedOrderSystemId",
    accessorKey: "linkedOrderSystemId",
    header: "Mã Đơn hàng",
    cell: ({ row }) => row.linkedOrderSystemId ? (
      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/orders/${row.linkedOrderSystemId}`); }}
        className="text-primary hover:underline font-mono text-xs"
      >
        {row.linkedOrderSystemId}
      </button>
    ) : '-',
    meta: { displayName: "Mã Đơn hàng liên quan" },
  },
  {
    id: "deductedInPayrollId",
    accessorKey: "deductedInPayrollId",
    header: "Đã trừ lương",
    cell: ({ row }) => row.deductedInPayrollId ? (
      <Badge variant="outline" className="text-xs">Đã trừ</Badge>
    ) : '-',
    meta: { displayName: "Đã trừ vào lương" },
  },
  {
    id: "deductedAt",
    accessorKey: "deductedAt",
    header: "Ngày trừ lương",
    cell: ({ row }) => row.deductedAt ? formatDate(row.deductedAt) : '-',
    meta: { displayName: "Ngày trừ lương" },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => row.createdAt ? formatDate(row.createdAt) : '-',
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
              {row.status === 'Chưa thanh toán' && (
                <DropdownMenuItem onSelect={() => onMarkPaid(row)}>
                  Đánh dấu đã thanh toán
                </DropdownMenuItem>
              )}
              {row.status !== 'Đã hủy' && (
                <DropdownMenuItem 
                  className="text-destructive"
                  onSelect={() => onCancel(row)}
                >
                  Hủy phiếu phạt
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    ),
    meta: { displayName: "Hành động", sticky: "right" },
    size: 90,
  },
];
