'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Printer, FileSpreadsheet } from 'lucide-react';
import { Eye, MoreHorizontal, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/date-utils';
import { useAttendanceByEmployee } from '@/features/attendance/hooks/use-attendance-by-employee';
import { useLockedMonths } from '@/features/attendance/hooks/use-attendance-locks';
import { fetchAttendanceByEmployeeMonth } from '@/features/attendance/api/attendance-api';
import { usePayrollByEmployee } from '@/features/payroll/hooks/use-payroll-by-employee';
import type { EmployeePayrollHistoryItem } from '@/features/payroll/hooks/use-payroll-by-employee';
import { PayrollStatusBadge } from '@/features/payroll/components/status-badge';
import { ROUTES } from '@/lib/router';
import { usePrint } from '@/lib/use-print';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import {
  convertPayslipForPrint,
  mapPayslipToPrintData,
  mapPayslipComponentLineItems,
  createStoreSettings,
} from '@/lib/print/payroll-print-helper';
import {
  convertAttendanceDetailForPrint,
  mapAttendanceDetailToPrintData,
  mapAttendanceDetailLineItems,
  createStoreSettings as createAttendanceStoreSettings,
} from '@/lib/print/attendance-print-helper';
import type { PrintData, PrintLineItem } from '@/lib/print-service';
import { RelatedDataTable } from '@/components/data-table/related-data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef } from '@/components/data-table/types';
import type { Employee } from '@/lib/types/prisma-extended';
import {
  PayslipDetailDialog,
  AttendanceDetailDialog,
  type PayrollHistoryRow,
  type PayslipLike,
  type PayrollBatchLike,
  type AttendanceHistoryRow,
} from './index';
import { formatCurrency, formatMonthLabel } from './types';

// Helper function for lazy loading XLSX
async function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  headers: string[],
  sheetName: string,
  filename: string
) {
  const XLSX = await import('xlsx');
  const ws = XLSX.utils.json_to_sheet(data, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

interface PayrollAttendanceTabProps {
  employee: Employee;
}

export function PayrollAttendanceTab({ employee }: PayrollAttendanceTabProps) {
  const router = useRouter();
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();

  // ✅ Server-side data
  const { data: attendanceSummaryData } = useAttendanceByEmployee(employee.systemId);
  const { data: lockedMonthsData } = useLockedMonths();
  const { data: serverPayrollHistory } = usePayrollByEmployee(employee.systemId);

  // ========== ATTENDANCE ==========
  const attendanceHistory: AttendanceHistoryRow[] = React.useMemo(() => {
    const lockedMonths = lockedMonthsData?.lockedMonths ?? {};
    if (!attendanceSummaryData) return [];
    return attendanceSummaryData.map(summary => {
      const [year, month] = summary.monthKey.split('-');
      return {
        systemId: `${summary.monthKey}-${employee.systemId}`,
        monthKey: summary.monthKey,
        monthLabel: `Tháng ${month}/${year}`,
        workDays: summary.workDays,
        leaveDays: summary.leaveDays,
        absentDays: summary.absentDays,
        lateArrivals: summary.lateArrivals,
        earlyDepartures: summary.earlyDepartures,
        otHours: summary.otHours,
        locked: Boolean(lockedMonths[summary.monthKey]),
      };
    });
  }, [employee.systemId, attendanceSummaryData, lockedMonthsData?.lockedMonths]);

  const handlePrintSingleAttendance = React.useCallback(async (row: AttendanceHistoryRow) => {
    try {
      const employeeRow = await fetchAttendanceByEmployeeMonth(employee.systemId, row.monthKey);
      if (!employeeRow) {
        toast.error('Không thể in', { description: 'Không tìm thấy dữ liệu chấm công.' });
        return;
      }
      const storeSettings = createAttendanceStoreSettings(storeInfo);
      const attendanceForPrint = convertAttendanceDetailForPrint(row.monthKey, employeeRow as unknown as Parameters<typeof convertAttendanceDetailForPrint>[1]);
      print('attendance', {
        data: mapAttendanceDetailToPrintData(attendanceForPrint, storeSettings),
        lineItems: mapAttendanceDetailLineItems(attendanceForPrint.dailyDetails),
      });
      toast.success('Đang in phiếu chấm công...', { description: `${employee.fullName} - ${row.monthLabel}` });
    } catch (error) {
      console.error('Error printing attendance:', error);
      toast.error('Không thể in', { description: 'Lỗi khi tải dữ liệu chấm công.' });
    }
  }, [employee, storeInfo, print]);

  // State for attendance detail dialog
  const [selectedAttendance, setSelectedAttendance] = React.useState<AttendanceHistoryRow | null>(null);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = React.useState(false);

  const attendanceColumns: ColumnDef<AttendanceHistoryRow>[] = React.useMemo(() => [
    { id: 'monthLabel', accessorKey: 'monthLabel', header: 'Kỳ chấm công', size: 130, cell: ({ row }) => <span className="font-medium">{row.monthLabel}</span>, meta: { displayName: 'Kỳ chấm công' } },
    { id: 'locked', accessorKey: 'locked', header: 'Trạng thái', size: 100, cell: ({ row }) => (
      <Badge variant={row.locked ? 'default' : 'outline'} className={row.locked ? 'bg-green-600' : ''}>
        {row.locked ? 'Đã khóa' : 'Chưa khóa'}
      </Badge>
    ), meta: { displayName: 'Trạng thái' } },
    { id: 'workDays', accessorKey: 'workDays', header: () => <span className="text-right w-full block">Ngày công</span>, size: 90, cell: ({ row }) => <span className="text-right block tabular-nums font-medium text-green-600">{row.workDays}</span>, meta: { displayName: 'Ngày công' } },
    { id: 'leaveDays', accessorKey: 'leaveDays', header: () => <span className="text-right w-full block">Nghỉ phép</span>, size: 90, cell: ({ row }) => <span className="text-right block tabular-nums text-blue-600">{row.leaveDays}</span>, meta: { displayName: 'Nghỉ phép' } },
    { id: 'absentDays', accessorKey: 'absentDays', header: () => <span className="text-right w-full block">Vắng</span>, size: 80, cell: ({ row }) => <span className={`text-right block tabular-nums ${row.absentDays > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>{row.absentDays}</span>, meta: { displayName: 'Vắng' } },
    { id: 'lateArrivals', accessorKey: 'lateArrivals', header: () => <span className="text-right w-full block">Đi trễ</span>, size: 80, cell: ({ row }) => <span className={`text-right block tabular-nums ${row.lateArrivals > 0 ? 'text-orange-600' : 'text-muted-foreground'}`}>{row.lateArrivals}</span>, meta: { displayName: 'Đi trễ' } },
    { id: 'earlyDepartures', accessorKey: 'earlyDepartures', header: () => <span className="text-right w-full block">Về sớm</span>, size: 80, cell: ({ row }) => <span className={`text-right block tabular-nums ${row.earlyDepartures > 0 ? 'text-orange-600' : 'text-muted-foreground'}`}>{row.earlyDepartures}</span>, meta: { displayName: 'Về sớm' } },
    { id: 'otHours', accessorKey: 'otHours', header: () => <span className="text-right w-full block">Làm thêm</span>, size: 80, cell: ({ row }) => <span className={`text-right block tabular-nums ${row.otHours > 0 ? 'text-purple-600 font-medium' : 'text-muted-foreground'}`}>{row.otHours}h</span>, meta: { displayName: 'Giờ làm thêm' } },
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
              <DropdownMenuItem onClick={() => { setSelectedAttendance(row); setIsAttendanceDialogOpen(true); }}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintSingleAttendance(row)}>
                <Printer className="mr-2 h-4 w-4" />
                In phiếu chấm công
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/attendance?month=${row.monthKey}`)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Xem bảng chấm công
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ), 
      meta: { displayName: 'Thao tác', sticky: 'right' as const } 
    },
  ], [handlePrintSingleAttendance, router]);

  const attendanceBulkActions = React.useMemo(() => {
    const handlePrintAttendances = async (rows: AttendanceHistoryRow[]) => {
      if (rows.length === 0) { toast.error('Chưa chọn kỳ chấm công nào'); return; }
      const storeSettings = createAttendanceStoreSettings(storeInfo);
      const results = await Promise.allSettled(
        rows.map(row => fetchAttendanceByEmployeeMonth(employee.systemId, row.monthKey))
      );
      const printOptionsList = results
        .map((result, i) => {
          if (result.status !== 'fulfilled' || !result.value) return null;
          const attendanceForPrint = convertAttendanceDetailForPrint(rows[i].monthKey, result.value as unknown as Parameters<typeof convertAttendanceDetailForPrint>[1]);
          return {
            data: mapAttendanceDetailToPrintData(attendanceForPrint, storeSettings),
            lineItems: mapAttendanceDetailLineItems(attendanceForPrint.dailyDetails),
          };
        })
        .filter(Boolean) as Array<{ data: PrintData; lineItems: PrintLineItem[] }>;
      if (printOptionsList.length === 0) { toast.error('Không tìm thấy dữ liệu chấm công'); return; }
      printMultiple('attendance', printOptionsList);
      toast.success(`Đang in ${printOptionsList.length} phiếu chấm công...`);
    };

    const handleExportExcel = async (rows: AttendanceHistoryRow[]) => {
      if (rows.length === 0) { toast.error('Chưa chọn dữ liệu nào'); return; }
      const headers = ['Kỳ chấm công', 'Trạng thái', 'Ngày công', 'Nghỉ phép', 'Vắng', 'Đi trễ', 'Về sớm', 'Giờ làm thêm'];
      const mappedData = rows.map(row => ({
        'Kỳ chấm công': row.monthLabel, 'Trạng thái': row.locked ? 'Đã khóa' : 'Chưa khóa',
        'Ngày công': row.workDays, 'Nghỉ phép': row.leaveDays, 'Vắng': row.absentDays,
        'Đi trễ': row.lateArrivals, 'Về sớm': row.earlyDepartures, 'Giờ làm thêm': row.otHours,
      }));
      await exportToExcel(mappedData, headers, 'ChamCong', `ChamCong_${employee.id}_selected.xlsx`);
      toast.success(`Đã xuất ${rows.length} dòng ra Excel`);
    };

    return [
      { label: 'In phiếu chấm công', icon: Printer, onSelect: handlePrintAttendances },
      { label: 'Xuất Excel', icon: FileSpreadsheet, onSelect: handleExportExcel },
    ];
  }, [employee, storeInfo, printMultiple]);

  // ========== PAYROLL ==========
  const payrollHistoryAdapted = React.useMemo(() => {
    if (!serverPayrollHistory) return [];
    return serverPayrollHistory.map((item: EmployeePayrollHistoryItem) => {
      const slip: PayslipLike = {
        systemId: item.systemId,
        id: item.systemId,
        batchSystemId: item.batchSystemId,
        employeeSystemId: employee.systemId,
        employeeId: employee.id,
        periodMonthKey: item.monthKey,
        components: [] as never[],
        createdAt: item.payrollDate,
        updatedAt: item.payrollDate,
        totals: {
          workDays: item.workDays,
          standardWorkDays: 26,
          leaveDays: item.leaveDays,
          absentDays: 0,
          otHours: item.otHours,
          otHoursWeekday: 0, otHoursWeekend: 0, otHoursHoliday: 0,
          lateArrivals: 0, earlyDepartures: 0,
          grossEarnings: item.grossSalary,
          earnings: item.grossSalary,
          employeeSocialInsurance: item.socialInsurance,
          employeeHealthInsurance: item.healthInsurance,
          employeeUnemploymentInsurance: item.unemploymentIns,
          totalEmployeeInsurance: item.socialInsurance + item.healthInsurance + item.unemploymentIns,
          employerSocialInsurance: 0, employerHealthInsurance: 0, employerUnemploymentInsurance: 0, totalEmployerInsurance: 0,
          taxableIncome: 0,
          personalIncomeTax: item.tax,
          penaltyDeductions: 0,
          otherDeductions: item.otherDeductions,
          deductions: item.totalDeductions,
          contributions: 0,
          socialInsuranceBase: 0,
          netPay: item.netSalary,
          personalDeduction: 0, dependentDeduction: 0, numberOfDependents: 0,
        },
      };
      const batch: PayrollBatchLike = {
        systemId: item.batchSystemId,
        id: item.batchId,
        title: `Bảng lương Tháng ${item.monthKey.split('-')[1]}/${item.monthKey.split('-')[0]}`,
        status: item.status as 'draft' | 'reviewed' | 'locked' | 'cancelled',
        payPeriod: { monthKey: item.monthKey },
        payrollDate: item.payrollDate,
      };
      return { slip, batch };
    });
  }, [employee, serverPayrollHistory]);

  const displayedPayrollHistory = payrollHistoryAdapted.slice(0, 5);

  // State for payslip detail dialog
  const [selectedPayslip, setSelectedPayslip] = React.useState<{ slip: PayslipLike; batch?: PayrollBatchLike } | null>(null);
  const [isPayslipDialogOpen, setIsPayslipDialogOpen] = React.useState(false);

  const payrollHistoryTableData: PayrollHistoryRow[] = React.useMemo(() => 
    displayedPayrollHistory.map(({ slip, batch }) => ({
      systemId: slip.systemId,
      batchId: batch?.id ?? '—',
      monthLabel: formatMonthLabel(batch?.payPeriod?.monthKey ?? slip.periodMonthKey),
      payDate: formatDate(batch?.payrollDate || slip.createdAt) || '—',
      status: batch?.status ?? 'draft',
      grossEarnings: slip.totals.grossEarnings ?? slip.totals.earnings ?? 0,
      totalInsurance: slip.totals.totalEmployeeInsurance ?? 0,
      personalIncomeTax: slip.totals.personalIncomeTax ?? 0,
      otherDeductions: (slip.totals.penaltyDeductions ?? 0) + (slip.totals.otherDeductions ?? 0),
      totalDeductions: slip.totals.deductions ?? 0,
      netPay: slip.totals.netPay,
      batchSystemId: batch?.systemId,
      payslipSystemId: slip.systemId,
      slip,
      batch,
    })),
    [displayedPayrollHistory]
  );

  const handlePrintSinglePayslip = React.useCallback((row: PayrollHistoryRow) => {
    if (!row.slip) {
      toast.error('Không thể in', { description: 'Không tìm thấy dữ liệu phiếu lương.' });
      return;
    }
    const storeSettings = createStoreSettings(storeInfo);
    const payslipForPrint = convertPayslipForPrint(
      row.slip,
      row.batch || {
        systemId: '', id: row.batchId, title: `Bảng lương ${row.monthLabel}`,
        status: row.status, payPeriod: { monthKey: row.slip.periodMonthKey }, payrollDate: row.payDate,
      },
      {
        employee: { fullName: employee.fullName, id: employee.id, department: employee.department, position: employee.positionName },
        departmentName: employee.department,
      }
    );
    print('payslip', {
      data: mapPayslipToPrintData(payslipForPrint, storeSettings),
      lineItems: mapPayslipComponentLineItems(payslipForPrint.components || []),
    });
    toast.success('Đang in phiếu lương...', { description: `${employee.fullName} - ${row.monthLabel}` });
  }, [employee, storeInfo, print]);

  const payrollColumns: ColumnDef<PayrollHistoryRow>[] = React.useMemo(() => [
    { id: 'batchId', accessorKey: 'batchId', header: 'Mã BL', size: 95, cell: ({ row }) => (
      <Link href={row.batchSystemId ? ROUTES.PAYROLL.DETAIL.replace(':systemId', row.batchSystemId) : '#'}
        className="font-mono text-xs text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
        {row.batchId}
      </Link>
    ), meta: { displayName: 'Mã BL' } },
    { id: 'monthLabel', accessorKey: 'monthLabel', header: 'Kỳ lương', size: 110, cell: ({ row }) => <span className="whitespace-nowrap">{row.monthLabel}</span>, meta: { displayName: 'Kỳ lương' } },
    { id: 'payDate', accessorKey: 'payDate', header: 'Ngày trả', size: 100, cell: ({ row }) => <span className="whitespace-nowrap">{row.payDate}</span>, meta: { displayName: 'Ngày trả' } },
    { id: 'status', accessorKey: 'status', header: 'Trạng thái', size: 90, cell: ({ row }) => <PayrollStatusBadge status={row.status} />, meta: { displayName: 'Trạng thái' } },
    { id: 'grossEarnings', accessorKey: 'grossEarnings', header: () => <span className="text-right w-full block">Tổng TN</span>, size: 115, cell: ({ row }) => <span className="text-right block tabular-nums">{formatCurrency(row.grossEarnings)}</span>, meta: { displayName: 'Tổng thu nhập' } },
    { id: 'totalInsurance', accessorKey: 'totalInsurance', header: () => <span className="text-right w-full block">Bảo hiểm</span>, size: 100, cell: ({ row }) => <span className="text-right block tabular-nums text-orange-600">{row.totalInsurance > 0 ? `-${formatCurrency(row.totalInsurance)}` : '—'}</span>, meta: { displayName: 'Bảo hiểm' } },
    { id: 'personalIncomeTax', accessorKey: 'personalIncomeTax', header: () => <span className="text-right w-full block">Thuế TNCN</span>, size: 100, cell: ({ row }) => <span className="text-right block tabular-nums text-purple-600">{row.personalIncomeTax > 0 ? `-${formatCurrency(row.personalIncomeTax)}` : '—'}</span>, meta: { displayName: 'Thuế TNCN' } },
    { id: 'otherDeductions', accessorKey: 'otherDeductions', header: () => <span className="text-right w-full block">Khác</span>, size: 90, cell: ({ row }) => <span className="text-right block tabular-nums text-gray-600">{row.otherDeductions > 0 ? `-${formatCurrency(row.otherDeductions)}` : '—'}</span>, meta: { displayName: 'Khấu trừ khác' } },
    { id: 'totalDeductions', accessorKey: 'totalDeductions', header: () => <span className="text-right w-full block">Tổng trừ</span>, size: 110, cell: ({ row }) => <span className="text-right block tabular-nums text-destructive font-medium">{formatCurrency(row.totalDeductions)}</span>, meta: { displayName: 'Tổng khấu trừ' } },
    { id: 'netPay', accessorKey: 'netPay', header: () => <span className="text-right w-full block">Thực lĩnh</span>, size: 120, cell: ({ row }) => <span className="text-right block tabular-nums font-bold text-green-600">{formatCurrency(row.netPay)}</span>, meta: { displayName: 'Thực lĩnh' } },
    { 
      id: 'actions', header: '', size: 50,
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
              <DropdownMenuItem onClick={() => { setSelectedPayslip({ slip: row.slip, batch: row.batch }); setIsPayslipDialogOpen(true); }}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintSinglePayslip(row)}>
                <Printer className="mr-2 h-4 w-4" />
                In phiếu lương
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { if (row.batchSystemId) router.push(ROUTES.PAYROLL.DETAIL.replace(':systemId', row.batchSystemId)); }}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Xem bảng lương
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ), 
      meta: { displayName: 'Thao tác', sticky: 'right' as const } 
    },
  ], [router, handlePrintSinglePayslip]);

  const handlePayrollRowClick = React.useCallback((row: PayrollHistoryRow) => {
    const historyItem = displayedPayrollHistory.find(h => h.slip.systemId === row.systemId);
    if (historyItem) { setSelectedPayslip(historyItem); setIsPayslipDialogOpen(true); }
  }, [displayedPayrollHistory]);

  const handleViewPayroll = React.useCallback((batchSystemId?: string) => {
    if (!batchSystemId) return;
    router.push(ROUTES.PAYROLL.DETAIL.replace(':systemId', batchSystemId));
  }, [router]);

  const payrollBulkActions = React.useMemo(() => {
    const handlePrintPayslips = (rows: PayrollHistoryRow[]) => {
      if (rows.length === 0) { toast.error('Chưa chọn phiếu lương nào'); return; }
      const sSettings = createStoreSettings(storeInfo);
      const printOptionsList = rows.map(row => {
        const payslipForPrint = convertPayslipForPrint(
          row.slip,
          row.batch || { systemId: '', id: row.batchId, title: `Bảng lương ${row.monthLabel}`, status: row.status, payPeriod: { monthKey: row.slip.periodMonthKey }, payrollDate: row.payDate },
          { employee: { fullName: employee.fullName, id: employee.id, department: employee.department, position: employee.positionName }, departmentName: employee.department }
        );
        return { data: mapPayslipToPrintData(payslipForPrint, sSettings), lineItems: mapPayslipComponentLineItems(payslipForPrint.components || []) };
      });
      printMultiple('payslip', printOptionsList);
      toast.success(`Đang in ${rows.length} phiếu lương...`);
    };

    const handleExportExcel = async (rows: PayrollHistoryRow[]) => {
      if (rows.length === 0) { toast.error('Chưa chọn dữ liệu nào'); return; }
      const headers = ['Mã BL', 'Kỳ lương', 'Ngày trả', 'Trạng thái', 'Tổng TN', 'Bảo hiểm', 'Thuế TNCN', 'Khấu trừ khác', 'Tổng trừ', 'Thực lĩnh'];
      const mappedData = rows.map(row => ({
        'Mã BL': row.batchId, 'Kỳ lương': row.monthLabel, 'Ngày trả': row.payDate, 'Trạng thái': row.status,
        'Tổng TN': row.grossEarnings, 'Bảo hiểm': row.totalInsurance, 'Thuế TNCN': row.personalIncomeTax,
        'Khấu trừ khác': row.otherDeductions, 'Tổng trừ': row.totalDeductions, 'Thực lĩnh': row.netPay,
      }));
      await exportToExcel(mappedData, headers, 'Lương', `Luong_${employee.id}_selected.xlsx`);
      toast.success(`Đã xuất ${rows.length} dòng ra Excel`);
    };

    return [
      { label: 'In phiếu lương', icon: Printer, onSelect: handlePrintPayslips },
      { label: 'Xuất Excel', icon: FileSpreadsheet, onSelect: handleExportExcel },
    ];
  }, [employee, storeInfo, printMultiple]);

  return (
    <>
      {/* Bảng lương gần đây */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng lương gần đây</CardTitle>
          <CardDescription>
            Hiển thị tối đa 5 kỳ gần nhất mà nhân viên tham gia. Click vào dòng để xem chi tiết.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payrollHistoryTableData.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                Nhân viên chưa có phiếu lương nào được tạo.
              </p>
            </div>
          ) : (
            <RelatedDataTable
              data={payrollHistoryTableData}
              columns={payrollColumns}
              searchKeys={['batchId', 'monthLabel']}
              searchPlaceholder="Tìm bảng lương..."
              exportFileName={`Luong_${employee.id}`}
              onRowClick={handlePayrollRowClick}
              showCheckbox
              defaultSorting={{ id: 'payDate', desc: true }}
              customBulkActions={payrollBulkActions}
            />
          )}
        </CardContent>
      </Card>

      {/* Lịch sử chấm công */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử chấm công</CardTitle>
          <CardDescription>
            Hiển thị dữ liệu chấm công theo từng tháng. Click vào dòng để xem chi tiết.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceHistory.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                Chưa có dữ liệu chấm công cho nhân viên này.
              </p>
            </div>
          ) : (
            <RelatedDataTable
              data={attendanceHistory}
              columns={attendanceColumns}
              searchKeys={['monthLabel']}
              searchPlaceholder="Tìm theo tháng..."
              exportFileName={`ChamCong_${employee.id}`}
              onRowClick={(row) => { setSelectedAttendance(row); setIsAttendanceDialogOpen(true); }}
              showCheckbox
              defaultSorting={{ id: 'monthKey', desc: true }}
              customBulkActions={attendanceBulkActions}
            />
          )}
        </CardContent>
      </Card>

      {/* Payslip Detail Dialog */}
      <PayslipDetailDialog
        open={isPayslipDialogOpen}
        onOpenChange={setIsPayslipDialogOpen}
        selectedPayslip={selectedPayslip}
        onViewPayroll={handleViewPayroll}
      />

      {/* Attendance Detail Dialog */}
      <AttendanceDetailDialog
        open={isAttendanceDialogOpen}
        onOpenChange={setIsAttendanceDialogOpen}
        selectedAttendance={selectedAttendance}
        employee={{ fullName: employee.fullName, id: employee.id }}
        onPrintSingle={handlePrintSingleAttendance}
      />
    </>
  );
}
