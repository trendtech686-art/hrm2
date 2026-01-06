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
import type { Penalty, PenaltyStatus } from '@/features/settings/penalties/types';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDateDisplay = (date: Date | string | null | undefined) => {
  if (!date) return '—';
  return formatDate(date);
};

const penaltyStatusVariants: Record<PenaltyStatus, 'default' | 'secondary' | 'warning' | 'success' | 'destructive'> = {
  'Chưa thanh toán': 'warning',
  'Đã thanh toán': 'success',
  'Đã hủy': 'destructive',
};

interface PenaltyColumnsOptions {
  onPrint: (row: Penalty) => void;
  onExport: (row: Penalty) => void;
  onViewDetail: (systemId: string) => void;
}

export function getPenaltyColumns(options: PenaltyColumnsOptions): ColumnDef<Penalty>[] {
  const { onPrint, onExport, onViewDetail } = options;

  return [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'Mã Phiếu',
      cell: ({ row }) => <span className="font-medium">{row.id}</span>,
      meta: { displayName: 'Mã Phiếu' },
    },
    {
      id: 'reason',
      accessorKey: 'reason',
      header: 'Lý do',
      cell: ({ row }) => row.reason,
      meta: { displayName: 'Lý do' },
    },
    {
      id: 'issueDate',
      accessorKey: 'issueDate',
      header: 'Ngày',
      cell: ({ row }) => formatDateDisplay(row.issueDate),
      meta: { displayName: 'Ngày' },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge variant={penaltyStatusVariants[row.status]}>{row.status}</Badge>
      ),
      meta: { displayName: 'Trạng thái' },
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: 'Số tiền',
      cell: ({ row }) => (
        <span className="text-destructive font-semibold">{formatCurrency(row.amount)}</span>
      ),
      meta: { displayName: 'Số tiền' },
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
                In phiếu phạt
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
