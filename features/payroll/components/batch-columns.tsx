/**
 * Payroll Batch Column Definitions
 * Chuẩn theo guide copy-employee-features-guide.md
 */

import * as React from 'react';
import Link from 'next/link';
import { MoreHorizontal, Eye, Lock, Unlock, Trash2 } from 'lucide-react';
import type { ColumnDef } from '../../../components/data-table/types';
import type { PayrollBatch } from '../../../lib/payroll-types';
import { ROUTES } from '../../../lib/router';
import { Checkbox } from '../../../components/ui/checkbox';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { PayrollStatusBadge } from './status-badge';
import { formatDateForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) =>
  typeof value === 'number' ? currencyFormatter.format(value) : '—';

const formatMonthKey = (monthKey: string) => {
  if (!monthKey) return '—';
  const [year, month] = monthKey.split('-');
  return `Tháng ${month}/${year}`;
};

const formatDate = (value?: string) => {
  if (!value) return '—';
  return formatDateForDisplay(value);
};

const formatDateTime = (value?: string) => {
  if (!value) return '—';
  return formatDateTimeForDisplay(value);
};

type BatchColumnActions = {
  onLock?: (systemId: string) => void;
  onUnlock?: (systemId: string) => void;
  onCancel?: (systemId: string) => void;
  navigate: (path: string) => void;
};

export const getBatchColumns = (actions: BatchColumnActions): ColumnDef<PayrollBatch>[] => [
  // 1. Select column
  {
    id: 'select',
    size: 48,
    enableSorting: false,
    header: ({ isAllPageRowsSelected, onToggleAll }) => (
      <Checkbox
        checked={isAllPageRowsSelected}
        onCheckedChange={(value) => onToggleAll?.(!!value)}
        aria-label="Chọn tất cả"
      />
    ),
    cell: ({ row, isSelected, onToggleSelect }) => (
      <Checkbox
        checked={isSelected}
        onCheckedChange={(value) => onToggleSelect(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Chọn hàng"
      />
    ),
    meta: { displayName: 'Chọn', sticky: 'left' },
  },

  // 2. ID column - Clickable, navigate to detail
  {
    id: 'id',
    accessorKey: 'id',
    size: 120,
    header: 'Mã bảng lương',
    cell: ({ row }) => (
      <Link href={ROUTES.PAYROLL.DETAIL.replace(':systemId', row.systemId)}
        className="font-mono text-body-xs text-primary hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {row.id}
      </Link>
    ),
    meta: { displayName: 'Mã bảng lương' },
  },

  // 3. Title
  {
    id: 'title',
    accessorKey: 'title',
    size: 200,
    header: 'Tiêu đề',
    cell: ({ row }) => (
      <span className="font-medium">{row.title}</span>
    ),
    meta: { displayName: 'Tiêu đề' },
  },

  // 4. Reference Month
  {
    id: 'referenceMonth',
    accessorKey: 'referenceAttendanceMonthKeys',
    size: 150,
    header: 'Tháng tham chiếu',
    cell: ({ row }) => formatMonthKey(row.referenceAttendanceMonthKeys[0]),
    meta: { displayName: 'Tháng tham chiếu' },
  },

  // 5. Payroll Date
  {
    id: 'payrollDate',
    accessorKey: 'payrollDate',
    size: 120,
    header: 'Ngày trả',
    cell: ({ row }) => formatDate(row.payrollDate),
    meta: { displayName: 'Ngày trả' },
  },

  // 6. Status
  {
    id: 'status',
    accessorKey: 'status',
    size: 120,
    header: 'Trạng thái',
    cell: ({ row }) => <PayrollStatusBadge status={row.status} />,
    meta: { displayName: 'Trạng thái' },
  },

  // 7. Total Net Pay
  {
    id: 'totalNet',
    accessorKey: 'totalNet',
    size: 150,
    header: () => <div className="text-right">Tổng thực lĩnh</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold text-primary">
        {formatCurrency(row.totalNet)}
      </div>
    ),
    meta: { displayName: 'Tổng thực lĩnh' },
  },

  // 8. Employee Count
  {
    id: 'employeeCount',
    accessorKey: 'payslipSystemIds',
    size: 100,
    header: () => <div className="text-center">Số NV</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.payslipSystemIds?.length ?? 0}
      </div>
    ),
    meta: { displayName: 'Số nhân viên' },
  },

  // 9. Created At
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    size: 160,
    header: 'Ngày tạo',
    cell: ({ row }) => formatDateTime(row.createdAt),
    meta: { displayName: 'Ngày tạo' },
  },

  // Actions column
  {
    id: 'actions',
    size: 90,
    enableSorting: false,
    header: () => <div className="text-right">Thao tác</div>,
    cell: ({ row }) => {
      const batch = row;
      const isLocked = batch.status === 'locked';

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Mở menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  actions.navigate(ROUTES.PAYROLL.DETAIL.replace(':systemId', batch.systemId));
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!isLocked && actions.onLock && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.onLock?.(batch.systemId);
                  }}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Khóa bảng lương
                </DropdownMenuItem>
              )}
              {isLocked && actions.onUnlock && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.onUnlock?.(batch.systemId);
                  }}
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  Mở khóa
                </DropdownMenuItem>
              )}
              {!isLocked && actions.onCancel && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.onCancel?.(batch.systemId);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hủy bảng lương
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    meta: { displayName: 'Thao tác', sticky: 'right' },
  },
];
