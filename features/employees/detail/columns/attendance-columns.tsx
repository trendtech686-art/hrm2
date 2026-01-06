'use client';

import * as React from 'react';
import { Eye, Printer, ExternalLink, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef } from '@/components/data-table/types';
import type { AttendanceHistoryRow } from '../types';

interface AttendanceColumnsOptions {
  onViewDetail: (row: AttendanceHistoryRow) => void;
  onPrint: (row: AttendanceHistoryRow) => void;
  onViewSheet: (monthKey: string) => void;
}

export function getAttendanceColumns(options: AttendanceColumnsOptions): ColumnDef<AttendanceHistoryRow>[] {
  const { onViewDetail, onPrint, onViewSheet } = options;

  return [
    {
      id: 'monthLabel',
      accessorKey: 'monthLabel',
      header: 'Kỳ chấm công',
      size: 120,
      cell: ({ row }) => <span className="font-medium">{row.monthLabel}</span>,
      meta: { displayName: 'Kỳ chấm công' },
    },
    {
      id: 'locked',
      accessorKey: 'locked',
      header: 'Trạng thái',
      size: 100,
      cell: ({ row }) => (
        <Badge variant={row.locked ? 'success' : 'warning'}>
          {row.locked ? 'Đã khóa' : 'Chưa khóa'}
        </Badge>
      ),
      meta: { displayName: 'Trạng thái' },
    },
    {
      id: 'workDays',
      accessorKey: 'workDays',
      header: () => <span className="text-right w-full block">Ngày công</span>,
      size: 80,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums font-medium text-green-600">
          {row.workDays}
        </span>
      ),
      meta: { displayName: 'Ngày công' },
    },
    {
      id: 'leaveDays',
      accessorKey: 'leaveDays',
      header: () => <span className="text-right w-full block">Nghỉ phép</span>,
      size: 80,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums text-blue-600">
          {row.leaveDays || '—'}
        </span>
      ),
      meta: { displayName: 'Nghỉ phép' },
    },
    {
      id: 'absentDays',
      accessorKey: 'absentDays',
      header: () => <span className="text-right w-full block">Vắng</span>,
      size: 70,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums text-destructive">
          {row.absentDays || '—'}
        </span>
      ),
      meta: { displayName: 'Vắng' },
    },
    {
      id: 'lateArrivals',
      accessorKey: 'lateArrivals',
      header: () => <span className="text-right w-full block">Đi trễ</span>,
      size: 70,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums text-orange-600">
          {row.lateArrivals || '—'}
        </span>
      ),
      meta: { displayName: 'Đi trễ' },
    },
    {
      id: 'earlyDepartures',
      accessorKey: 'earlyDepartures',
      header: () => <span className="text-right w-full block">Về sớm</span>,
      size: 70,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums text-orange-600">
          {row.earlyDepartures || '—'}
        </span>
      ),
      meta: { displayName: 'Về sớm' },
    },
    {
      id: 'otHours',
      accessorKey: 'otHours',
      header: () => <span className="text-right w-full block">OT (giờ)</span>,
      size: 80,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums text-purple-600">
          {row.otHours || '—'}
        </span>
      ),
      meta: { displayName: 'Giờ làm thêm' },
    },
    {
      id: 'actions',
      header: '',
      size: 50,
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Mở menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetail(row)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrint(row)}>
                <Printer className="mr-2 h-4 w-4" />
                In phiếu chấm công
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewSheet(row.monthKey)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Xem bảng chấm công
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      meta: { displayName: 'Thao tác', sticky: 'right' as const },
    },
  ];
}
