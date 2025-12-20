import * as React from "react";
import { formatDate } from '@/lib/date-utils';
import type { LeaveRequest, LeaveStatus } from './types';
import { Checkbox } from "../../components/ui/checkbox";
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header";
import { Badge } from "../../components/ui/badge";
import type { ColumnDef } from '../../components/data-table/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { SystemId } from '@/lib/id-types';

const statusVariants: Record<LeaveStatus, "success" | "warning" | "destructive"> = {
    "Chờ duyệt": "warning",
    "Đã duyệt": "success",
    "Đã từ chối": "destructive",
};

export const getColumns = (
  onDelete: (systemId: SystemId) => void,
  onEdit: (request: LeaveRequest) => void,
  onStatusChange: (systemId: SystemId, status: LeaveStatus) => void,
  navigate: (path: string) => void,
): ColumnDef<LeaveRequest>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <Checkbox
        checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
        onCheckedChange={(value) => onToggleAll?.(!!value)}
      />
    ),
    cell: ({ isSelected, onToggleSelect }) => (
      <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
    ),
    size: 60,
    meta: { displayName: "Select", sticky: "left" },
  },
  {
    id: "employeeName",
    accessorKey: "employeeName",
    header: "Nhân viên",
    cell: ({ row }) => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/employees/${row.employeeSystemId}`);
            }}
            className="text-left hover:underline"
        >
            <div className="font-medium">{row.employeeName}</div>
            <div className="text-body-xs text-muted-foreground">{row.employeeId}</div>
        </button>
    ),
    meta: { displayName: "Nhân viên" },
  },
  {
    id: "leaveTypeName",
    accessorKey: "leaveTypeName",
    header: "Loại phép",
    cell: ({ row }) => row.leaveTypeName,
    meta: { displayName: "Loại phép" },
  },
  {
    id: "dateRange",
    header: "Thời gian nghỉ",
    cell: ({ row }) => `${formatDate(row.startDate)} - ${formatDate(row.endDate)}`,
    meta: { displayName: "Thời gian nghỉ" },
  },
  {
    id: "numberOfDays",
    accessorKey: "numberOfDays",
    header: "Số ngày",
    cell: ({ row }) => row.numberOfDays,
    meta: { displayName: "Số ngày" },
  },
  {
    id: "reason",
    accessorKey: "reason",
    header: "Lý do",
    cell: ({ row }) => <span className="truncate max-w-[200px] block">{row.reason}</span>,
    meta: { displayName: "Lý do" },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <Badge variant={statusVariants[row.status] as any} className="text-body-xs">{row.status}</Badge>,
    meta: { displayName: "Trạng thái" },
  },
  {
    id: "startDate",
    accessorKey: "startDate",
    header: "Ngày bắt đầu",
    cell: ({ row }) => formatDate(row.startDate),
    meta: { displayName: "Ngày bắt đầu" },
  },
  {
    id: "endDate",
    accessorKey: "endDate",
    header: "Ngày kết thúc",
    cell: ({ row }) => formatDate(row.endDate),
    meta: { displayName: "Ngày kết thúc" },
  },
  {
    id: "requestDate",
    accessorKey: "requestDate",
    header: "Ngày yêu cầu",
    cell: ({ row }) => formatDate(row.requestDate),
    meta: { displayName: "Ngày yêu cầu" },
  },
  {
    id: "leaveTypeIsPaid",
    accessorKey: "leaveTypeIsPaid",
    header: "Có lương",
    cell: ({ row }) => row.leaveTypeIsPaid ? <Badge variant="success">Có</Badge> : <Badge variant="secondary">Không</Badge>,
    meta: { displayName: "Có lương" },
  },
  {
    id: "leaveTypeRequiresAttachment",
    accessorKey: "leaveTypeRequiresAttachment",
    header: "Yêu cầu đính kèm",
    cell: ({ row }) => row.leaveTypeRequiresAttachment ? <Badge variant="warning">Có</Badge> : <Badge variant="secondary">Không</Badge>,
    meta: { displayName: "Yêu cầu đính kèm" },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => row.createdAt ? formatDate(row.createdAt) : '-',
    meta: { displayName: "Ngày tạo" },
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Cập nhật lần cuối",
    cell: ({ row }) => row.updatedAt ? formatDate(row.updatedAt) : '-',
    meta: { displayName: "Cập nhật lần cuối" },
  },
  {
    id: "employeeId",
    accessorKey: "employeeId",
    header: "Mã nhân viên",
    cell: ({ row }) => row.employeeId,
    meta: { displayName: "Mã nhân viên" },
  },
  {
    id: "leaveTypeId",
    accessorKey: "leaveTypeId",
    header: "Mã loại phép",
    cell: ({ row }) => row.leaveTypeId || '-',
    meta: { displayName: "Mã loại phép" },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-10 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(row)}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onStatusChange(row.systemId, 'Đã duyệt')}>Duyệt</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onStatusChange(row.systemId, 'Đã từ chối')}>Từ chối</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { displayName: "Hành động", sticky: "right" },
    size: 90,
  },
];
