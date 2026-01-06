'use client';

import * as React from 'react';
import Link from 'next/link';
import { Eye, Printer, ExternalLink, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PayrollStatusBadge } from '@/features/payroll/components/status-badge';
import { ROUTES } from '@/lib/router';
import type { ColumnDef } from '@/components/data-table/types';
import type { PayrollHistoryRow } from '../types';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface PayrollColumnsOptions {
  onViewDetail: (row: PayrollHistoryRow) => void;
  onPrint: (row: PayrollHistoryRow) => void;
  onViewBatch: (batchSystemId?: string) => void;
}

export function getPayrollColumns(options: PayrollColumnsOptions): ColumnDef<PayrollHistoryRow>[] {
  const { onViewDetail, onPrint, onViewBatch } = options;

  return [
    {
      id: 'batchId',
      accessorKey: 'batchId',
      header: 'Mã BL',
      size: 95,
      cell: ({ row }) => (
        <Link
          href={row.batchSystemId ? ROUTES.PAYROLL.DETAIL.replace(':systemId', row.batchSystemId) : '#'}
          className="font-mono text-xs text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.batchId}
        </Link>
      ),
      meta: { displayName: 'Mã BL' },
    },
    {
      id: 'monthLabel',
      accessorKey: 'monthLabel',
      header: 'Kỳ lương',
      size: 110,
      cell: ({ row }) => <span className="whitespace-nowrap">{row.monthLabel}</span>,
      meta: { displayName: 'Kỳ lương' },
    },
    {
      id: 'payDate',
      accessorKey: 'payDate',
      header: 'Ngày trả',
      size: 100,
      cell: ({ row }) => <span className="whitespace-nowrap">{row.payDate}</span>,
      meta: { displayName: 'Ngày trả' },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Trạng thái',
      size: 90,
      cell: ({ row }) => <PayrollStatusBadge status={row.status} />,
      meta: { displayName: 'Trạng thái' },
    },
    {
      id: 'grossEarnings',
      accessorKey: 'grossEarnings',
      header: () => <span className="text-right w-full block">Tổng TN</span>,
      size: 115,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums">{formatCurrency(row.grossEarnings)}</span>
      ),
      meta: { displayName: 'Tổng thu nhập' },
    },
    {
      id: 'totalInsurance',
      accessorKey: 'totalInsurance',
      header: () => <span className="text-right w-full block">Bảo hiểm</span>,
      size: 100,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums text-orange-600">
          {row.totalInsurance > 0 ? `-${formatCurrency(row.totalInsurance)}` : '—'}
        </span>
      ),
      meta: { displayName: 'Bảo hiểm' },
    },
    {
      id: 'personalIncomeTax',
      accessorKey: 'personalIncomeTax',
      header: () => <span className="text-right w-full block">Thuế TNCN</span>,
      size: 100,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums text-purple-600">
          {row.personalIncomeTax > 0 ? `-${formatCurrency(row.personalIncomeTax)}` : '—'}
        </span>
      ),
      meta: { displayName: 'Thuế TNCN' },
    },
    {
      id: 'otherDeductions',
      accessorKey: 'otherDeductions',
      header: () => <span className="text-right w-full block">Khác</span>,
      size: 90,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums text-gray-600">
          {row.otherDeductions > 0 ? `-${formatCurrency(row.otherDeductions)}` : '—'}
        </span>
      ),
      meta: { displayName: 'Khấu trừ khác' },
    },
    {
      id: 'totalDeductions',
      accessorKey: 'totalDeductions',
      header: () => <span className="text-right w-full block">Tổng trừ</span>,
      size: 110,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums text-destructive font-medium">
          {formatCurrency(row.totalDeductions)}
        </span>
      ),
      meta: { displayName: 'Tổng khấu trừ' },
    },
    {
      id: 'netPay',
      accessorKey: 'netPay',
      header: () => <span className="text-right w-full block">Thực lĩnh</span>,
      size: 120,
      cell: ({ row }) => (
        <span className="text-right block tabular-nums font-bold text-green-600">
          {formatCurrency(row.netPay)}
        </span>
      ),
      meta: { displayName: 'Thực lĩnh' },
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
                In phiếu lương
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewBatch(row.batchSystemId)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Xem bảng lương
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      meta: { displayName: 'Thao tác', sticky: 'right' as const },
    },
  ];
}
