import * as React from "react";
import Link from 'next/link';
import { formatDate, formatDateTime } from '@/lib/date-utils';
import type { Task, TaskPriority, TaskStatus } from './types'
import type { SystemId } from '../../lib/id-types';
import { Checkbox } from "../../components/ui/checkbox"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import type { ColumnDef } from '../../components/data-table/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { MoreHorizontal } from "lucide-react";

const priorityVariants: Record<TaskPriority, "default" | "secondary" | "warning" | "destructive"> = {
  "Thấp": "secondary",
  "Trung bình": "default",
  "Cao": "warning",
  "Khẩn cấp": "destructive",
  low: "secondary",
  medium: "default",
  high: "warning",
  urgent: "destructive",
};

const statusVariants: Record<TaskStatus, "default" | "secondary" | "warning" | "success" | "outline"> = {
  "Chưa bắt đầu": "outline",
  "Đang thực hiện": "warning",
  "Đang chờ": "secondary",
  "Chờ duyệt": "secondary",
  "Chờ xử lý": "outline",
  "Hoàn thành": "success",
  "Đã hủy": "default",
};export const getColumns = (
  onDelete: (id: SystemId) => void,
  onEdit: (task: Task) => void,
  navigate: (path: string) => void,
  isAdmin: boolean = true, // Add role parameter
): ColumnDef<Task>[] => {
  const columns: ColumnDef<Task>[] = [
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
    size: 48,
    meta: { displayName: "Select", sticky: "left" },
  },
  {
    id: "id",
    accessorKey: "id",
    header: "Mã Task",
    cell: ({ row }) => <div className="font-medium">{row.id}</div>,
    meta: { displayName: "Mã Task" },
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => <div className="max-w-[300px] truncate font-medium">{row.title}</div>,
    meta: { displayName: "Tiêu đề công việc" },
  },
  {
    id: "assigneeName",
    accessorKey: "assigneeName",
    header: "Người thực hiện",
    cell: ({ row }) => row.assigneeName,
    meta: { displayName: "Người thực hiện" },
  },
  {
    id: "assignerName",
    accessorKey: "assignerName",
    header: "Người giao",
    cell: ({ row }) => row.assignerName,
    meta: { displayName: "Người giao việc" },
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: "Độ ưu tiên",
    cell: ({ row }) => <Badge variant={priorityVariants[row.priority]}>{row.priority}</Badge>,
    meta: { displayName: "Độ ưu tiên" },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <Badge variant={statusVariants[row.status]}>{row.status}</Badge>,
    meta: { displayName: "Trạng thái" },
  },
  {
    id: "progress",
    accessorKey: "progress",
    header: "Tiến độ",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-[120px]">
        <Progress value={row.progress} className="h-2 flex-1" />
        <span className="text-body-sm text-muted-foreground min-w-[40px] text-right">{row.progress}%</span>
      </div>
    ),
    meta: { displayName: "Tiến độ hoàn thành" },
  },
  {
    id: "startDate",
    accessorKey: "startDate",
    header: "Ngày bắt đầu",
    cell: ({ row }) => formatDateTime(row.startDate),
    meta: { displayName: "Ngày bắt đầu" },
  },
  {
    id: "dueDate",
    accessorKey: "dueDate",
    header: "Deadline",
    cell: ({ row }) => {
      const isOverdue = new Date(row.dueDate) < new Date() && row.status !== 'Hoàn thành';
      return (
        <span className={isOverdue ? "text-destructive font-semibold" : ""}>
          {formatDateTime(row.dueDate)}
        </span>
      );
    },
    meta: { displayName: "Hạn hoàn thành" },
  },
  {
    id: "estimatedHours",
    accessorKey: "estimatedHours",
    header: "Giờ ước tính",
    cell: ({ row }) => row.estimatedHours ? `${row.estimatedHours}h` : '-',
    meta: { displayName: "Giờ ước tính" },
  },
  {
    id: "actualHours",
    accessorKey: "actualHours",
    header: "Giờ thực tế",
    cell: ({ row }) => {
      // Calculate from totalTrackedSeconds if available
      const totalSeconds = row.totalTrackedSeconds || 0;
      const actualHours = totalSeconds > 0 
        ? (totalSeconds / 3600).toFixed(1)
        : row.actualHours?.toFixed(1) || '-';
      
      // Show timer indicator if running
      if (row.timerRunning) {
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="font-medium">{actualHours}h</span>
          </div>
        );
      }
      
      return actualHours !== '-' ? `${actualHours}h` : '-';
    },
    meta: { displayName: "Giờ thực tế" },
  },
];

  // Only add actions column for admin users
  if (isAdmin) {
    columns.push({
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
                <DropdownMenuItem onSelect={() => navigate(`/tasks/${row.systemId}/edit`)}>Sửa</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      ),
      meta: { displayName: "Hành động", sticky: "right" },
      size: 90,
    });
  }
  
  return columns;
};
