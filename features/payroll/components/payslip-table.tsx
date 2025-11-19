import * as React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table.tsx';
import { Skeleton } from '../../../components/ui/skeleton.tsx';
import type { PayrollTotals } from '../../../lib/payroll-types.ts';
import { cn } from '../../../lib/utils.ts';
import type { BusinessId, SystemId } from '../../../lib/id-types.ts';

export type PayslipTableRow = {
  systemId: SystemId;
  employeeSystemId?: SystemId;
  employeeId: BusinessId;
  employeeName: string;
  departmentName?: string;
  totals: PayrollTotals;
};

type PayslipTableProps = {
  rows: PayslipTableRow[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: PayslipTableRow) => void;
  className?: string;
};

const formatCurrency = (value?: number) =>
  typeof value === 'number'
    ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
    : '—';

export function PayslipTable({ rows, isLoading, emptyMessage, onRowClick, className }: PayslipTableProps) {
  return (
    <div className={cn('rounded-xl border bg-card', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã nhân viên</TableHead>
            <TableHead>Nhân viên</TableHead>
            <TableHead>Phòng ban</TableHead>
            <TableHead className="text-right">Thu nhập</TableHead>
            <TableHead className="text-right">Khấu trừ</TableHead>
            <TableHead className="text-right">Đóng góp</TableHead>
            <TableHead className="text-right">Thực lĩnh</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`payslip-loading-${index}`}>
                <TableCell colSpan={7}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage ?? 'Chưa có phiếu lương nào trong batch này.'}
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            rows.map((row) => (
              <TableRow
                key={row.systemId}
                className={cn(onRowClick && 'cursor-pointer')}
                onClick={() => onRowClick?.(row)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{row.employeeId}</TableCell>
                <TableCell className="font-medium">{row.employeeName}</TableCell>
                <TableCell>{row.departmentName ?? '—'}</TableCell>
                <TableCell className="text-right font-semibold text-emerald-600">
                  {formatCurrency(row.totals.earnings)}
                </TableCell>
                <TableCell className="text-right text-red-500">
                  {formatCurrency(row.totals.deductions)}
                </TableCell>
                <TableCell className="text-right text-blue-500">
                  {formatCurrency(row.totals.contributions)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(row.totals.netPay)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableCaption>Tổng số phiếu: {rows.length}</TableCaption>
      </Table>
    </div>
  );
}
