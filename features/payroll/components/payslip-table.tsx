import * as React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Skeleton } from '../../../components/ui/skeleton';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Printer, Trash2, Calculator } from 'lucide-react';
import type { PayrollTotals } from '../../../lib/payroll-types';
import { cn } from '../../../lib/utils';
import type { BusinessId, SystemId } from '../../../lib/id-types';

export type PayslipTableRow = {
  systemId: SystemId;
  employeeSystemId?: SystemId | undefined;
  employeeId: BusinessId;
  employeeName: string;
  departmentName?: string | undefined;
  positionName?: string | undefined;
  totals: PayrollTotals;
};

export type PayslipTableActions = {
  onEdit?: (row: PayslipTableRow) => void;
  onPrint?: (row: PayslipTableRow) => void;
  onRecalculate?: (row: PayslipTableRow) => void;
  onRemove?: (row: PayslipTableRow) => void;
};

type PayslipTableProps = {
  rows: PayslipTableRow[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: PayslipTableRow) => void;
  actions?: PayslipTableActions;
  isLocked?: boolean;
  className?: string;
};

const formatCurrency = (value?: number) =>
  typeof value === 'number'
    ? value.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' đ'
    : '0 đ';

export function PayslipTable({ rows, isLoading, emptyMessage, onRowClick, actions, isLocked = false, className }: PayslipTableProps) {
  const hasActions = actions && (actions.onEdit || actions.onPrint || actions.onRecalculate || actions.onRemove);
  const colSpan = hasActions ? 12 : 11;

  return (
    <div className={cn('rounded-xl border bg-card overflow-x-auto', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Mã nhân viên</TableHead>
            <TableHead>Nhân viên</TableHead>
            <TableHead>Phòng ban</TableHead>
            <TableHead>Chức vụ</TableHead>
            <TableHead className="text-right">Thu nhập</TableHead>
            <TableHead className="text-right">Bảo hiểm</TableHead>
            <TableHead className="text-right">TN chịu thuế</TableHead>
            <TableHead className="text-right">Thuế TNCN</TableHead>
            <TableHead className="text-right">Khấu trừ khác</TableHead>
            <TableHead className="text-right">Thực lĩnh</TableHead>
            {hasActions && <TableHead className="w-[50px]" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`payslip-loading-${index}`}>
                <TableCell colSpan={colSpan}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={colSpan} className="py-6 text-center text-body-sm text-muted-foreground">
                {emptyMessage ?? 'Chưa có phiếu lương nào trong batch này.'}
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            rows.map((row) => {
              const otherDeductions = (row.totals.penaltyDeductions || 0) + (row.totals.otherDeductions || 0);
              return (
                <TableRow
                  key={row.systemId}
                  className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50')}
                  onClick={() => onRowClick?.(row)}
                >
                  <TableCell>{row.employeeId}</TableCell>
                  <TableCell>{row.employeeName}</TableCell>
                  <TableCell>{row.departmentName ?? '—'}</TableCell>
                  <TableCell>{row.positionName ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.totals.earnings)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.totals.totalEmployeeInsurance)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.totals.taxableIncome)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.totals.personalIncomeTax)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(otherDeductions)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(row.totals.netPay)}
                  </TableCell>
                  {hasActions && (
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.onEdit && (
                          <DropdownMenuItem 
                            onClick={() => actions.onEdit?.(row)}
                            disabled={isLocked}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                        )}
                        {actions.onRecalculate && (
                          <DropdownMenuItem 
                            onClick={() => actions.onRecalculate?.(row)}
                            disabled={isLocked}
                          >
                            <Calculator className="mr-2 h-4 w-4" />
                            Tính lại
                          </DropdownMenuItem>
                        )}
                        {actions.onPrint && (
                          <DropdownMenuItem onClick={() => actions.onPrint?.(row)}>
                            <Printer className="mr-2 h-4 w-4" />
                            In phiếu lương
                          </DropdownMenuItem>
                        )}
                        {actions.onRemove && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => actions.onRemove?.(row)}
                              disabled={isLocked}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa khỏi bảng lương
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
              );
            })}
        </TableBody>
        <TableCaption>Tổng số phiếu: {rows.length}</TableCaption>
      </Table>
    </div>
  );
}
