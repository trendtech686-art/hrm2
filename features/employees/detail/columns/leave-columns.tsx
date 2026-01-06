'use client';

import * as React from 'react';
import { Eye, Printer, FileSpreadsheet, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/date-utils';
import type { ColumnDef } from '@/components/data-table/types';
import type { LeaveRequest, LeaveStatus } from '@/features/leaves/types';

const formatDateDisplay = (date: Date | string | null | undefined) => {
  if (!date) return '—';
  return formatDate(date);
};

const leaveStatusVariants: Record<LeaveStatus, 'default' | 'secondary' | 'warning' | 'success' | 'destructive'> = {
  'Chờ duyệt': 'warning',
  'Đã duyệt': 'success',
  'Đã từ chối': 'destructive',
};

interface LeaveColumnsOptions {
  onPrint: (row: LeaveRequest) => void;
  onExport: (row: LeaveRequest) => void;
  onViewDetail: (systemId: string) => void;
}

export function getLeaveColumns(options: LeaveColumnsOptions): ColumnDef<LeaveRequest>[] {
  const { onPrint, onExport, onViewDetail } = options;

  return [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'Mã Đơn',
      cell: ({ row }) => <span className="font-medium">{row.id}</span>,
      meta: { displayName: 'Mã Đơn' },
    },
    {
      id: 'leaveTypeName',
      accessorKey: 'leaveTypeName',
      header: 'Loại phép',
      cell: ({ row }) => row.leaveTypeName,
      meta: { displayName: 'Loại phép' },
    },
    {
      id: 'startDate',
      accessorKey: 'startDate',
      header: 'Từ ngày',
      cell: ({ row }) => formatDateDisplay(row.startDate),
      meta: { displayName: 'Từ ngày' },
    },
    {
      id: 'endDate',
      accessorKey: 'endDate',
      header: 'Đến ngày',
      cell: ({ row }) => formatDateDisplay(row.endDate),
      meta: { displayName: 'Đến ngày' },
    },
    {
      id: 'numberOfDays',
      accessorKey: 'numberOfDays',
      header: () => <span className="text-right w-full block">Số ngày</span>,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums font-medium">{row.numberOfDays}</span>
      ),
      meta: { displayName: 'Số ngày' },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={leaveStatusVariants[row.status]}>{row.status}</Badge>
      ),
      meta: { displayName: 'Trạng thái' },
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPrint(row)}>
                <Printer className="mr-2 h-4 w-4" />
                In đơn nghỉ phép
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport(row)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Xuất Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewDetail(row.systemId)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      meta: { displayName: 'Thao tác', sticky: 'right' as const },
    },
  ];
}
