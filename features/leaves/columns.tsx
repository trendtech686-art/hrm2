import * as React from "react";
import { formatDate } from '@/lib/date-utils';
import type { LeaveRequest, LeaveStatus } from './types.ts';
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import type { ColumnDef } from '../../components/data-table/types.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import { Button } from "../../components/ui/button.tsx";
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
        onCheckedChange={(value) => onToggleAll(!!value)}
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
            <div className="text-xs text-muted-foreground">{row.employeeId}</div>
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
    cell: ({ row }) => <span className="truncate">{row.reason}</span>,
    meta: { displayName: "Lý do" },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <Badge variant={statusVariants[row.status] as any}>{row.status}</Badge>,
    meta: { displayName: "Trạng thái" },
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
