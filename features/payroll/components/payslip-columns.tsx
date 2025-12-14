import * as React from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Pencil, Printer, Trash2, Calculator, ExternalLink, Receipt, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/button.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu.tsx';
import type { ColumnDef } from '../../../components/data-table/types.ts';
import type { PayrollTotals, PayrollComponentEntry } from '../../../lib/payroll-types.ts';
import type { BusinessId, SystemId } from '../../../lib/id-types.ts';
import { ROUTES } from '../../../lib/router.ts';

// =============================================
// TYPES
// =============================================

export type PayslipRow = {
  systemId: SystemId;
  employeeSystemId?: SystemId | undefined;
  employeeId: BusinessId;
  employeeName: string;
  departmentName?: string | undefined;
  positionName?: string | undefined;
  totals: PayrollTotals;
  components?: PayrollComponentEntry[];
};

export type PayslipActions = {
  onEdit?: (row: PayslipRow) => void;
  onPrint?: (row: PayslipRow) => void;
  onPrintPayment?: (row: PayslipRow) => void;
  onPrintPenalties?: (row: PayslipRow) => void;
  onRecalculate?: (row: PayslipRow) => void;
  onRemove?: (row: PayslipRow) => void;
  onViewEmployee?: (row: PayslipRow) => void;
};

// =============================================
// HELPERS
// =============================================

const formatCurrency = (value?: number) =>
  typeof value === 'number'
    ? value.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' đ'
    : '0 đ';

// =============================================
// COLUMN DEFINITIONS
// =============================================

export function getPayslipColumns(
  actions?: PayslipActions,
  isLocked: boolean = false,
): ColumnDef<PayslipRow>[] {
  const columns: ColumnDef<PayslipRow>[] = [
    // 1. SELECT COLUMN - sticky left
    {
      id: 'select',
      size: 48,
      enableSorting: false,
      meta: {
        displayName: 'Chọn',
        sticky: 'left',
      },
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : (isSomePageRowsSelected ? 'indeterminate' : false)}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row, isSelected, onToggleSelect }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(value) => onToggleSelect(!!value)}
          aria-label="Chọn dòng"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },

    // 2. MÃ NHÂN VIÊN
    {
      id: 'employeeId',
      accessorKey: 'employeeId',
      size: 110,
      meta: {
        displayName: 'Mã nhân viên',
      },
      header: () => <span>Mã nhân viên</span>,
      cell: ({ row }) => (
        <Link 
          to={row.employeeSystemId ? ROUTES.HRM.EMPLOYEE_VIEW.replace(':systemId', row.employeeSystemId) : '#'}
          className="text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.employeeId}
        </Link>
      ),
    },

    // 3. TÊN NHÂN VIÊN
    {
      id: 'employeeName',
      accessorKey: 'employeeName',
      size: 180,
      meta: {
        displayName: 'Nhân viên',
      },
      header: () => <span>Nhân viên</span>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.employeeName}</span>
          {actions?.onViewEmployee && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                actions.onViewEmployee?.(row);
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
    },

    // 4. PHÒNG BAN
    {
      id: 'departmentName',
      accessorKey: 'departmentName',
      size: 140,
      meta: {
        displayName: 'Phòng ban',
      },
      header: () => <span>Phòng ban</span>,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.departmentName ?? '—'}
        </span>
      ),
    },

    // 5. CHỨC VỤ (optional)
    {
      id: 'positionName',
      accessorKey: 'positionName',
      size: 120,
      meta: {
        displayName: 'Chức vụ',
      },
      header: () => <span>Chức vụ</span>,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.positionName ?? '—'}
        </span>
      ),
    },

    // 5.1 CÔNG LÀM (workDays)
    {
      id: 'workDays',
      accessorKey: 'totals',
      size: 90,
      meta: {
        displayName: 'Công',
      },
      header: () => <span className="text-right w-full block">Công</span>,
      cell: ({ row }) => (
        <span className="text-right block">
          {row.totals.workDays ?? '—'}/{row.totals.standardWorkDays ?? 26}
        </span>
      ),
    },

    // 5.2 LÀM THÊM NGÀY THƯỜNG
    {
      id: 'otWeekday',
      accessorKey: 'totals',
      size: 110,
      meta: {
        displayName: 'Thêm Thường',
      },
      header: () => <span className="text-right w-full block">Thêm Thường</span>,
      cell: ({ row }) => {
        const hours = row.totals.otHoursWeekday ?? 0;
        if (hours === 0) {
          return <span className="text-right block text-muted-foreground">—</span>;
        }
        return <span className="text-right block text-blue-600">{hours}h</span>;
      },
    },

    // 5.3 LÀM THÊM CUỐI TUẦN
    {
      id: 'otWeekend',
      accessorKey: 'totals',
      size: 110,
      meta: {
        displayName: 'Thêm C.Tuần',
      },
      header: () => <span className="text-right w-full block">Thêm C.Tuần</span>,
      cell: ({ row }) => {
        const hours = row.totals.otHoursWeekend ?? 0;
        if (hours === 0) {
          return <span className="text-right block text-muted-foreground">—</span>;
        }
        return <span className="text-right block text-orange-600">{hours}h</span>;
      },
    },

    // 5.4 LÀM THÊM NGÀY LỄ
    {
      id: 'otHoliday',
      accessorKey: 'totals',
      size: 100,
      meta: {
        displayName: 'Thêm Lễ',
      },
      header: () => <span className="text-right w-full block">Thêm Lễ</span>,
      cell: ({ row }) => {
        const hours = row.totals.otHoursHoliday ?? 0;
        if (hours === 0) {
          return <span className="text-right block text-muted-foreground">—</span>;
        }
        return <span className="text-right block text-red-600 font-medium">{hours}h</span>;
      },
    },

    // 6. THU NHẬP (earnings)
    {
      id: 'earnings',
      accessorKey: 'totals',
      size: 110,
      meta: {
        displayName: 'Thu nhập',
      },
      header: () => <span className="text-right w-full block">Thu nhập</span>,
      cell: ({ row }) => (
        <span className="text-right block">
          {formatCurrency(row.totals.earnings)}
        </span>
      ),
    },

    // 7. BẢO HIỂM (totalEmployeeInsurance)
    {
      id: 'insurance',
      accessorKey: 'totals',
      size: 90,
      meta: {
        displayName: 'Bảo hiểm',
      },
      header: () => <span className="text-right w-full block">Bảo hiểm</span>,
      cell: ({ row }) => (
        <span className="text-right block">
          {formatCurrency(row.totals.totalEmployeeInsurance)}
        </span>
      ),
    },

    // 8. THU NHẬP CHỊU THUẾ
    {
      id: 'taxableIncome',
      accessorKey: 'totals',
      size: 120,
      meta: {
        displayName: 'TN chịu thuế',
      },
      header: () => <span className="text-right w-full block">TN chịu thuế</span>,
      cell: ({ row }) => (
        <span className="text-right block">
          {formatCurrency(row.totals.taxableIncome)}
        </span>
      ),
    },

    // 9. THUẾ TNCN
    {
      id: 'personalIncomeTax',
      accessorKey: 'totals',
      size: 100,
      meta: {
        displayName: 'Thuế TNCN',
      },
      header: () => <span className="text-right w-full block">Thuế TNCN</span>,
      cell: ({ row }) => (
        <span className="text-right block text-destructive">
          {formatCurrency(row.totals.personalIncomeTax)}
        </span>
      ),
    },

    // 10. KHẤU TRỪ KHÁC (penalty + other deductions)
    {
      id: 'otherDeductions',
      accessorKey: 'totals',
      size: 110,
      meta: {
        displayName: 'Khấu trừ khác',
      },
      header: () => <span className="text-right w-full block">Khấu trừ khác</span>,
      cell: ({ row }) => {
        const total = (row.totals.penaltyDeductions || 0) + (row.totals.otherDeductions || 0);
        return (
          <span className="text-right block text-destructive">
            {formatCurrency(total)}
          </span>
        );
      },
    },

    // 11. THỰC LĨNH (netPay)
    {
      id: 'netPay',
      accessorKey: 'totals',
      size: 120,
      meta: {
        displayName: 'Thực lĩnh',
      },
      header: () => <span className="text-right w-full block">Thực lĩnh</span>,
      cell: ({ row }) => (
        <span className="text-right block font-semibold">
          {formatCurrency(row.totals.netPay)}
        </span>
      ),
    },

    // 13. ACTIONS COLUMN - sticky right
    {
      id: 'actions',
      size: 60,
      enableSorting: false,
      meta: {
        displayName: 'Thao tác',
        sticky: 'right',
      },
      header: () => null,
      cell: ({ row }) => {
        const hasAnyAction = actions && (
          actions.onEdit || actions.onPrint || actions.onPrintPayment || actions.onPrintPenalties || actions.onRecalculate || actions.onRemove
        );
        if (!hasAnyAction) return null;

        return (
          <div onClick={(e) => e.stopPropagation()}>
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
                {actions.onPrintPayment && (
                  <DropdownMenuItem onClick={() => actions.onPrintPayment?.(row)}>
                    <Receipt className="mr-2 h-4 w-4" />
                    In phiếu chi
                  </DropdownMenuItem>
                )}
                {actions.onPrintPenalties && (
                  <DropdownMenuItem onClick={() => actions.onPrintPenalties?.(row)}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    In phiếu phạt
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
          </div>
        );
      },
    },
  ];

  return columns;
}
