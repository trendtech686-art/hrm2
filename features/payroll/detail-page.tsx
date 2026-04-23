'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Printer, Lock, Unlock, CheckCircle2, Banknote, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { DetailPageShell, mobileBleedCardClass } from '../../components/layout/page-section';
import { Textarea } from '../../components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { ROUTES } from '../../lib/router';
import { usePayrollById, useAllPayrollTemplates, usePayrollBatchMutations, usePayslipExtendedMutations } from './hooks/use-payroll';
import { PayrollStatusBadge } from './components/status-badge';
import { PayslipDataTable, type PayslipRow, type PayslipActions } from './components/payslip-data-table';
import { PayslipEditDialog, type PayslipUpdatePayload } from './components/payslip-edit-dialog';
import { CreatePaymentDialog } from './components/create-payment-dialog';
import { useAllEmployees } from '../employees/hooks/use-all-employees';
import { useDepartments } from '../settings/departments/hooks/use-departments';
import { usePayments } from '../payments/hooks/use-payments';
import { usePenalties } from '../settings/penalties/hooks/use-penalties';
import type { PayrollAuditLog, PayrollBatch, PayrollPeriod, Payslip } from '../../lib/payroll-types';
import { asSystemId, type BusinessId, type SystemId } from '../../lib/id-types';
import { usePrint } from '../../lib/use-print';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import {
  convertPayrollBatchForPrint,
  convertPayslipForPrint,
  mapPayrollBatchToPrintData,
  mapPayrollBatchLineItems,
  mapPayslipToPrintData,
  mapPayslipComponentLineItems,
  createStoreSettings,
} from '../../lib/print/payroll-print-helper';
import { mapPaymentToPrintData, type PaymentForPrint } from '../../lib/print-mappers/payment.mapper';
import { convertPenaltyForPrint } from '../../lib/print/penalty-print-helper';
import { mapPenaltyToPrintData } from '../../lib/print-mappers/penalty.mapper';
import { usePageHeader } from '../../contexts/page-header-context';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult, PaperSize } from '../../components/shared/simple-print-options-dialog';
import { formatDateForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';

// =============================================
// CONSTANTS
// =============================================

const STATUS_LABEL: Record<PayrollBatch['status'], string> = {
  draft: 'Nháp',
  reviewed: 'Đang duyệt',
  locked: 'Đã khóa',
  cancelled: 'Đã hủy',
};

const STATUS_HINTS: Record<PayrollBatch['status'], { title: string; description: string; tone: 'info' | 'warning' | 'success' | 'destructive' }> = {
  draft: {
    title: 'Bảng lương đang ở trạng thái Nháp',
    description: 'Kiểm tra dữ liệu và bấm "Đánh dấu đã duyệt" để chuyển sang bước xem xét trước khi khóa.',
    tone: 'warning',
  },
  reviewed: {
    title: 'Bảng lương đã được duyệt',
    description: 'Bạn có thể khóa bảng lương để cố định dữ liệu và khóa các tháng chấm công liên quan.',
    tone: 'info',
  },
  locked: {
    title: 'Bảng lương đã được khóa',
    description: 'Dữ liệu chi trả và tháng chấm công tham chiếu hiện chỉ đọc. Mọi thay đổi cần tạo batch mới.',
    tone: 'success',
  },
  cancelled: {
    title: 'Bảng lương đã bị hủy',
    description: 'Bảng lương này đã bị hủy và không còn hiệu lực. Các phiếu thanh toán và phiếu phạt liên quan đã được rollback.',
    tone: 'destructive',
  },
};

const _ALERT_CLASS_BY_TONE: Record<'info' | 'warning' | 'success', string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-400/40 dark:bg-blue-950/40',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-950/40',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-950/40',
};

type ApprovalAction = 'review' | 'lock';

const APPROVAL_DIALOG_CONFIG: Record<ApprovalAction, { title: string; description: string; confirmLabel: string }> = {
  review: {
    title: 'Xác nhận đánh dấu đã duyệt',
    description: 'Sau khi duyệt, bảng lương sẽ chuyển sang bước chờ khóa. Bạn vẫn có thể quay lại chỉnh sửa trước khi khóa.',
    confirmLabel: 'Đánh dấu đã duyệt',
  },
  lock: {
    title: 'Khóa bảng lương',
    description:
      'Bảng lương sẽ khóa vĩnh viễn và các tháng chấm công tham chiếu sẽ chuyển sang chỉ đọc. Hãy chắc chắn rằng số liệu đã chính xác.',
    confirmLabel: 'Khóa bảng lương',
  },
};

// =============================================
// FORMATTERS
// =============================================

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) => (typeof value === 'number' ? currencyFormatter.format(value) : '—');
const formatDate = (value?: string) => (value ? formatDateForDisplay(value) : '—');
const _formatDateTime = (value?: string) => (value ? formatDateTimeForDisplay(value) : '—');

const formatMonthKey = (monthKey?: string) => {
  if (!monthKey) return '—';
  const [year, month] = monthKey.split('-');
  return `Tháng ${month}/${year}`;
};

const formatPeriod = (period?: PayrollPeriod) => {
  if (!period) return '—';
  return `${formatDate(period.startDate)} – ${formatDate(period.endDate)}`;
};

// =============================================
// TYPES
// =============================================

type DepartmentSummaryRow = {
  departmentSystemId?: SystemId | undefined;
  departmentName: string;
  headcount: number;
  totalEarnings: number;
  totalDeductions: number;
  totalContributions: number;
  totalNet: number;
};

type PayslipExportRow = {
  employeeId: BusinessId;
  employeeName: string;
  departmentName: string;
  earnings: number;
  deductions: number;
  contributions: number;
  net: number;
};

type PayrollExportMetadata = {
  batchId: string;
  title: string;
  payPeriodLabel: string;
  payrollDateLabel: string;
  referenceMonths: string;
};

// =============================================
// CSV HELPERS
// =============================================

const CSV_BOM = '\uFEFF';

const _buildDepartmentReportCsv = (rows: DepartmentSummaryRow[], metadata: PayrollExportMetadata) => {
  const headerRows: Array<Array<string | number>> = [
    ['Bảng lương', metadata.batchId],
    ['Tiêu đề', metadata.title],
    ['Kỳ lương', metadata.payPeriodLabel],
    ['Ngày chi trả', metadata.payrollDateLabel],
    ['Tháng chấm công', metadata.referenceMonths || 'Không xác định'],
    [],
    ['Phòng ban', 'Số nhân viên', 'Tổng thu nhập', 'Tổng khấu trừ', 'Đóng góp doanh nghiệp', 'Tổng thực lĩnh'],
  ];
  const bodyRows = rows.map((row) => [
    row.departmentName,
    row.headcount,
    row.totalEarnings,
    row.totalDeductions,
    row.totalContributions,
    row.totalNet,
  ]);
  return buildCsvContent([...headerRows, ...bodyRows]);
};

const _buildPayslipReportCsv = (rows: PayslipExportRow[], metadata: PayrollExportMetadata) => {
  const headerRows: Array<Array<string | number>> = [
    ['Bảng lương', metadata.batchId],
    ['Tiêu đề', metadata.title],
    ['Kỳ lương', metadata.payPeriodLabel],
    ['Ngày chi trả', metadata.payrollDateLabel],
    ['Tháng chấm công', metadata.referenceMonths || 'Không xác định'],
    [],
    ['Mã nhân viên', 'Họ tên', 'Phòng ban', 'Tổng thu nhập', 'Tổng khấu trừ', 'Đóng góp doanh nghiệp', 'Thực lĩnh'],
  ];
  const bodyRows = rows.map((row) => [
    row.employeeId,
    row.employeeName,
    row.departmentName,
    row.earnings,
    row.deductions,
    row.contributions,
    row.net,
  ]);
  return buildCsvContent([...headerRows, ...bodyRows]);
};

const buildCsvContent = (rows: Array<Array<string | number>>) =>
  rows.map((row) => row.map(serializeCsvValue).join(',')).join('\n');

const serializeCsvValue = (value: string | number) => {
  const normalized = value === undefined || value === null ? '' : String(value);
  const escaped = normalized.replace(/"/g, '""');
  return `"${escaped}"`;
};

const _downloadCsv = (content: string, filename: string) => {
  const blob = new Blob([CSV_BOM + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// =============================================
// STABLE DATA HOOK - Prevents infinite loops
// =============================================

function usePayrollDetailData(systemId: SystemId | undefined) {
  // Get data from React Query hooks
  const { data: batch, isLoading: isBatchLoading } = usePayrollById(systemId);
  // ✅ Use items from batch response instead of separate API call
  // const { data: payslipsData } = usePayslipsByBatch(systemId);
  type BatchWithItems = PayrollBatch & { items?: Payslip[]; auditLogs?: PayrollAuditLog[] };
  const payslips = React.useMemo(() => (batch as BatchWithItems | undefined)?.items ?? [], [batch]);
  const templates = useAllPayrollTemplates();
  const { data: employees } = useAllEmployees();
  const { data: departmentsData } = useDepartments();
  const departments = React.useMemo(() => departmentsData?.data ?? [], [departmentsData?.data]);

  // Get audit logs from batch data
  const auditLogs = React.useMemo(() => (batch as BatchWithItems | undefined)?.auditLogs ?? [], [batch]);

  const template = React.useMemo(() => {
    if (!batch?.templateSystemId) return undefined;
    return templates.find((t) => t.systemId === batch.templateSystemId);
  }, [templates, batch?.templateSystemId]);

  const batchAuditLogs = React.useMemo(() => {
    return auditLogs
      .filter((entry) => entry.batchSystemId === batch?.systemId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [auditLogs, batch]);

  // Lookup maps
  const employeeLookup = React.useMemo(() => {
    return employees.reduce<Record<SystemId, (typeof employees)[number]>>(
      (acc, employee) => {
        acc[employee.systemId] = employee;
        return acc;
      },
      {} as Record<SystemId, (typeof employees)[number]>
    );
  }, [employees]);

  const departmentLookup = React.useMemo(() => {
    return departments.reduce<Record<SystemId, (typeof departments)[number]>>(
      (acc, department) => {
        acc[department.systemId] = department;
        return acc;
      },
      {} as Record<SystemId, (typeof departments)[number]>
    );
  }, [departments]);

  // Derived data
  const batchPayslips = React.useMemo<PayslipRow[]>(() => {
    if (!batch) return [];
    return payslips.map((payslip) => {
      const employee = employeeLookup[payslip.employeeSystemId];
      const departmentName = payslip.departmentSystemId
        ? departmentLookup[payslip.departmentSystemId]?.name
        : undefined;
      return {
        systemId: payslip.systemId,
        employeeSystemId: payslip.employeeSystemId,
        employeeId: employee?.id ?? payslip.employeeId,
        employeeName: employee?.fullName ?? `Nhân viên ${payslip.employeeId}`,
        departmentName: departmentName ?? employee?.department ?? '—',
        positionName: employee?.positionName,
        totals: payslip.totals,
      } satisfies PayslipRow;
    });
  }, [batch, payslips, employeeLookup, departmentLookup]);

  const departmentSummaries = React.useMemo<DepartmentSummaryRow[]>(() => {
    if (!payslips.length) return [];
    const summaryMap = new Map<string, DepartmentSummaryRow>();
    payslips.forEach((slip) => {
      const departmentKey = slip.departmentSystemId ?? '__unknown__';
      const departmentName = slip.departmentSystemId
        ? departmentLookup[slip.departmentSystemId]?.name
        : employeeLookup[slip.employeeSystemId]?.department;
      const current = summaryMap.get(departmentKey) ?? {
        departmentSystemId: slip.departmentSystemId,
        departmentName: departmentName ?? 'Không xác định',
        headcount: 0,
        totalEarnings: 0,
        totalDeductions: 0,
        totalContributions: 0,
        totalNet: 0,
      };
      current.headcount += 1;
      current.totalEarnings += slip.totals.earnings;
      current.totalDeductions += slip.totals.deductions;
      current.totalContributions += slip.totals.contributions;
      current.totalNet += slip.totals.netPay;
      summaryMap.set(departmentKey, current);
    });
    return Array.from(summaryMap.values()).sort((a, b) => b.totalNet - a.totalNet);
  }, [payslips, departmentLookup, employeeLookup]);

  const payslipExports = React.useMemo<PayslipExportRow[]>(() => {
    if (!payslips.length) return [];
    return payslips.map((slip) => {
      const employee = employeeLookup[slip.employeeSystemId];
      const departmentName = slip.departmentSystemId
        ? departmentLookup[slip.departmentSystemId]?.name
        : employee?.department;
      return {
        employeeId: employee?.id ?? slip.employeeId,
        employeeName: employee?.fullName ?? `Nhân viên ${slip.employeeId}`,
        departmentName: departmentName ?? 'Không xác định',
        earnings: slip.totals.earnings,
        deductions: slip.totals.deductions,
        contributions: slip.totals.contributions,
        net: slip.totals.netPay,
      } satisfies PayslipExportRow;
    });
  }, [payslips, employeeLookup, departmentLookup]);

  const totals = React.useMemo(() => {
    return payslips.reduce(
      (acc, slip) => {
        acc.earnings += slip.totals.earnings;
        acc.deductions += slip.totals.deductions;
        acc.contributions += slip.totals.contributions;
        acc.net += slip.totals.netPay;
        return acc;
      },
      { earnings: 0, deductions: 0, contributions: 0, net: 0 }
    );
  }, [payslips]);

  // Labels
  const referenceMonthsLabel = React.useMemo(() => {
    if (!batch?.referenceAttendanceMonthKeys?.length) return '';
    return batch.referenceAttendanceMonthKeys.map((month) => formatMonthKey(month)).join(', ');
  }, [batch?.referenceAttendanceMonthKeys]);

  const payPeriodLabel = React.useMemo(() => (batch ? formatPeriod(batch.payPeriod) : ''), [batch]);

  const exportMetadata = React.useMemo<PayrollExportMetadata | null>(() => {
    if (!batch) return null;
    return {
      batchId: batch.id,
      title: batch.title,
      payPeriodLabel,
      payrollDateLabel: formatDate(batch.payrollDate),
      referenceMonths: referenceMonthsLabel,
    };
  }, [batch, payPeriodLabel, referenceMonthsLabel]);

  return {
    batch,
    isLoading: isBatchLoading,
    payslips,
    template,
    batchAuditLogs,
    historyEntries: [],
    batchPayslips,
    departmentSummaries,
    payslipExports,
    totals,
    referenceMonthsLabel,
    payPeriodLabel,
    exportMetadata,
    employeeLookup,
    departmentLookup,
  };
}

// =============================================
// =============================================
// MAIN COMPONENT
// =============================================

export function PayrollDetailPage() {
  const params = useParams<{ systemId?: string }>();
  const router = useRouter();

  // Parse systemId once
  const resolvedSystemId = React.useMemo(
    () => (params.systemId ? asSystemId(params.systemId) : undefined),
    [params.systemId]
  );

  // Get all data from custom hook
  const {
    batch,
    isLoading,
    payslips,
    template: _template,
    batchAuditLogs: _batchAuditLogs,
    historyEntries: _historyEntries,
    batchPayslips,
    departmentSummaries: _departmentSummaries,
    payslipExports: _payslipExports,
    totals,
    referenceMonthsLabel,
    payPeriodLabel,
    exportMetadata: _exportMetadata,
    employeeLookup,
    departmentLookup,
  } = usePayrollDetailData(resolvedSystemId);

  // Mutations
  const { updateStatus } = usePayrollBatchMutations({
    onSuccess: () => {},
    onError: (err) => toast.error('Lỗi', { description: err.message }),
  });
  const { updateWithAudit, removeFromBatch } = usePayslipExtendedMutations({
    onSuccess: () => {},
    onError: (err) => toast.error('Lỗi', { description: err.message }),
  });
  
  // Payment store - chỉ load payments liên quan đến payroll batch này
  const { data: allPaymentsData } = usePayments();
  const allPayments = React.useMemo(() => allPaymentsData?.data ?? [], [allPaymentsData?.data]);
  const linkedPayments = React.useMemo(
    () => allPayments.filter((p) => batch && p.linkedPayrollBatchSystemId === batch.systemId),
    [allPayments, batch]
  );

  // Penalty store
  const { data: allPenaltiesData } = usePenalties();
  const allPenalties = React.useMemo(() => allPenaltiesData?.data ?? [], [allPenaltiesData?.data]);

  // Print integration
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();

  // Dialog state
  const [approvalAction, setApprovalAction] = React.useState<ApprovalAction | null>(null);
  const [approvalNote, setApprovalNote] = React.useState('');
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false);
  
  // Edit payslip dialog state
  const [editingPayslipId, setEditingPayslipId] = React.useState<SystemId | null>(null);
  const editingPayslip = React.useMemo(() => {
    if (!editingPayslipId) return undefined;
    return payslips.find((p) => p.systemId === editingPayslipId);
  }, [editingPayslipId, payslips]);

  // Create payment dialog state
  const [isCreatePaymentOpen, setIsCreatePaymentOpen] = React.useState(false);

  // Derived state
  const _canReview = batch?.status === 'draft';
  const _canLock = batch?.status === 'reviewed';
  const isLocked = batch?.status === 'locked';

  // Handlers
  const handleBack = React.useCallback(() => {
    router.push(ROUTES.PAYROLL.LIST);
  }, [router]);

  const handlePrint = React.useCallback(() => {
    if (!batch) return;

    const storeSettings = createStoreSettings(storeInfo);
    const batchForPrint = convertPayrollBatchForPrint(
      batch,
      payslips,
      {
        employeeLookup: employeeLookup as Record<SystemId, { fullName?: string; id?: string; department?: string }>,
        departmentLookup: departmentLookup as Record<SystemId, { name?: string }>,
      }
    );

    print('payroll', {
      data: mapPayrollBatchToPrintData(batchForPrint, storeSettings),
      lineItems: mapPayrollBatchLineItems(batchForPrint.payslips),
    });
  }, [batch, payslips, employeeLookup, departmentLookup, storeInfo, print]);

  const handleRunNew = React.useCallback(() => {
    router.push(ROUTES.PAYROLL.RUN);
  }, [router]);

  // Approval dialog handlers (moved up for headerActions dependency)
  const openApprovalDialog = React.useCallback((action: ApprovalAction) => {
    setApprovalAction(action);
    setApprovalNote('');
    setIsApprovalDialogOpen(true);
  }, []);

  // Build header actions
  const headerActions = React.useMemo(() => {
    if (!batch) return undefined;
    const actions: React.ReactNode[] = [];
    
    // === TRẠNG THÁI NHÁP (draft) ===
    if (batch.status === 'draft') {
      actions.push(
        <Button key="review" size="sm" className="h-9" onClick={() => openApprovalDialog('review')} disabled={updateStatus.isPending}>
          {updateStatus.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
          {updateStatus.isPending ? 'Đang xử lý...' : 'Đánh dấu đã duyệt'}
        </Button>
      );
    }
    
    // === TRẠNG THÁI ĐÃ DUYỆT (reviewed) ===
    if (batch.status === 'reviewed') {
      actions.push(
        <Button key="lock" size="sm" className="h-9" onClick={() => openApprovalDialog('lock')} disabled={updateStatus.isPending}>
          {updateStatus.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lock className="h-4 w-4 mr-2" />}
          {updateStatus.isPending ? 'Đang xử lý...' : 'Khóa bảng lương'}
        </Button>
      );
    }
    
    // === TRẠNG THÁI ĐÃ KHÓA (locked) ===
    // Create payment button (only when locked and no linked payments)
    if (isLocked && linkedPayments.length === 0) {
      actions.push(
        <Button key="create-payment" size="sm" className="h-9" onClick={() => setIsCreatePaymentOpen(true)}>
          <Banknote className="h-4 w-4 mr-2" />
          Tạo phiếu chi
        </Button>
      );
    }
    
    // Unlock button
    if (isLocked) {
      actions.push(
        <Button key="unlock" size="sm" className="h-9" variant="outline" disabled={updateStatus.isPending} onClick={() => {
          if (!batch) return;
          updateStatus.mutate(
            { systemId: batch.systemId, data: { status: 'reviewed', note: 'Mở khóa bảng lương' } },
            {
              onSuccess: () => {
                toast.success('Cập nhật trạng thái thành công', {
                  description: 'Bảng lương đã chuyển sang trạng thái Đang duyệt.',
                });
              },
            }
          );
        }}>
          {updateStatus.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Unlock className="h-4 w-4 mr-2" />}
          {updateStatus.isPending ? 'Đang xử lý...' : 'Mở khóa'}
        </Button>
      );
    }
    
    // Print button
    actions.push(
      <Button key="print" variant="outline" size="sm" className="h-9" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" />
        In
      </Button>
    );
    
    // Run new button
    actions.push(
      <Button key="run-new" variant="outline" size="sm" className="h-9" onClick={handleRunNew}>
        Chạy kỳ mới
      </Button>
    );
    
    return actions;
  }, [batch, isLocked, linkedPayments.length, handlePrint, handleRunNew, updateStatus, openApprovalDialog]);

  // Header subtitle
  const headerSubtitle = React.useMemo(() => {
    if (!batch) return 'Đang tải...';
    const parts: string[] = [];
    if (payPeriodLabel) parts.push(`Kỳ ${payPeriodLabel}`);
    if (referenceMonthsLabel) parts.push(`Chấm công: ${referenceMonthsLabel}`);
    return parts.join(' • ') || 'Bảng lương nội bộ';
  }, [batch, payPeriodLabel, referenceMonthsLabel]);

  // Page header with breadcrumb - set after batch is loaded
  const { setPageHeader, clearPageHeader } = usePageHeader();
  React.useEffect(() => {
    setPageHeader({ 
      title: batch ? `Bảng lương ${batch.id}` : 'Chi tiết bảng lương',
      subtitle: headerSubtitle,
      breadcrumb: [
        { label: 'Trang chủ', href: ROUTES.DASHBOARD },
        { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST },
        { label: batch?.id ?? 'Chi tiết', href: '' },
      ],
      actions: headerActions,
      badge: batch ? <PayrollStatusBadge status={batch.status} /> : undefined,
      showBackButton: true,
    });
    return () => clearPageHeader();
  }, [setPageHeader, clearPageHeader, batch, headerSubtitle, headerActions]);

  const closeApprovalDialog = React.useCallback(() => {
    setIsApprovalDialogOpen(false);
    setApprovalAction(null);
    setApprovalNote('');
  }, []);

  const handleStatusChange = React.useCallback((status: PayrollBatch['status'], note?: string) => {
    if (!batch) return;
    updateStatus.mutate(
      { systemId: batch.systemId, data: { status, note } },
      {
        onSuccess: () => {
          toast.success('Cập nhật trạng thái thành công', {
            description: `Bảng lương đã chuyển sang trạng thái ${STATUS_LABEL[status]}.`,
          });
        },
      }
    );
  }, [batch, updateStatus]);

  const handleConfirmApproval = React.useCallback(() => {
    if (!approvalAction || !batch) return;
    const status = approvalAction === 'review' ? 'reviewed' : 'locked';
    const note = approvalNote.trim() || undefined;
    handleStatusChange(status, note);
    closeApprovalDialog();
  }, [approvalAction, batch, approvalNote, handleStatusChange, closeApprovalDialog]);

  const _handleUnlock = React.useCallback(() => {
    if (!batch) return;
    handleStatusChange('reviewed', 'Mở khóa bảng lương');
  }, [batch, handleStatusChange]);

  const _handleOpenEmployee = React.useCallback((row: PayslipRow) => {
    if (!row.employeeSystemId) return;
    router.push(ROUTES.HRM.EMPLOYEE_VIEW.replace(':systemId', row.employeeSystemId));
  }, [router]);

  // Payslip action handlers
  const handleEditPayslip = React.useCallback((row: PayslipRow) => {
    if (isLocked) {
      toast.error('Không thể sửa', { description: 'Bảng lương đã khóa.' });
      return;
    }
    setEditingPayslipId(row.systemId);
  }, [isLocked]);

  const handleSavePayslip = React.useCallback((payload: PayslipUpdatePayload) => {
    if (!editingPayslipId) return;
    updateWithAudit.mutate(
      {
        systemId: editingPayslipId,
        data: payload,
      },
      {
        onSuccess: () => {
          toast.success('Đã cập nhật phiếu lương');
          setEditingPayslipId(null);
        },
        onError: (err) => {
          toast.error('Không thể cập nhật', { description: err.message });
        },
      }
    );
  }, [editingPayslipId, updateWithAudit]);

  const handlePrintPayslip = React.useCallback((row: PayslipRow) => {
    const payslip = payslips.find((p) => p.systemId === row.systemId);
    if (!payslip || !batch) return;

    // Get employee info
    const employee = employeeLookup[payslip.employeeSystemId as SystemId];
    const departmentName = payslip.departmentSystemId
      ? departmentLookup[payslip.departmentSystemId as SystemId]?.name
      : undefined;

    const storeSettings = createStoreSettings(storeInfo);
    
    // Convert to PayslipForPrint for individual payslip printing
    const payslipForPrint = convertPayslipForPrint(
      payslip,
      batch,
      {
        employee: employee ? {
          id: employee.id,
          fullName: employee.fullName,
          department: departmentName,
          position: employee.positionName,
        } : undefined,
        departmentName,
      }
    );

    // Debug: log components

    // Use payslip template (not payroll)
    print('payslip', {
      data: mapPayslipToPrintData(payslipForPrint, storeSettings),
      lineItems: mapPayslipComponentLineItems(payslipForPrint.components),
    });
  }, [batch, payslips, employeeLookup, departmentLookup, storeInfo, print]);

  const handleRemovePayslip = React.useCallback((row: PayslipRow) => {
    if (isLocked) {
      toast.error('Không thể xóa', { description: 'Bảng lương đã khóa.' });
      return;
    }
    removeFromBatch.mutate(row.systemId, {
      onSuccess: () => {
        toast.success('Đã xóa phiếu lương khỏi bảng lương');
      },
      onError: (err) => {
        toast.error('Không thể xóa', { description: err.message });
      },
    });
  }, [isLocked, removeFromBatch]);

  // Print payment voucher for a payslip (In phiếu chi)
  const handlePrintPayment = React.useCallback((row: PayslipRow) => {
    if (!batch) return;
    
    // Find payment linked to this payslip (by payslipSystemId)
    const payslip = payslips.find((p) => p.systemId === row.systemId);
    if (!payslip) {
      toast.error('Không tìm thấy phiếu lương');
      return;
    }
    
    // Find payment voucher that matches this payslip
    const payment = linkedPayments.find(
      (p) => p.linkedPayslipSystemId === payslip.systemId
    );
    
    if (!payment) {
      toast.error('Chưa tạo phiếu chi', {
        description: 'Nhân viên này chưa có phiếu chi. Hãy tạo phiếu chi trước.',
      });
      return;
    }

    // Convert payment to print format
    const storeSettings = createStoreSettings(storeInfo);
    const employee = employeeLookup[payslip.employeeSystemId as SystemId];

    const paymentForPrint: PaymentForPrint = {
      code: payment.id,
      createdAt: payment.createdAt,
      amount: payment.amount,
      paymentMethod: payment.paymentMethodName,
      recipientName: employee?.fullName ?? payslip.employeeId,
      recipientType: 'Nhân viên',
      description: payment.description,
      groupName: payment.paymentReceiptTypeName,
      location: {
        name: payment.branchName,
      },
    };

    print('payment', {
      data: mapPaymentToPrintData(paymentForPrint, storeSettings),
      lineItems: [],
    });
    
    toast.success('Đã gửi in phiếu chi');
  }, [batch, payslips, linkedPayments, employeeLookup, storeInfo, print]);

  // Print penalties for a payslip (In phiếu phạt)
  const handlePrintPenalties = React.useCallback((row: PayslipRow) => {
    if (!batch) return;
    
    // Find payslip to get deducted penalty IDs
    const payslip = payslips.find((p) => p.systemId === row.systemId);
    if (!payslip) {
      toast.error('Không tìm thấy phiếu lương');
      return;
    }
    
    // Get deducted penalties
    const penaltyIds = payslip.deductedPenaltySystemIds || [];
    if (penaltyIds.length === 0) {
      toast.info('Không có phiếu phạt', {
        description: 'Nhân viên này không có phiếu phạt nào trong kỳ lương.',
      });
      return;
    }
    
    // Get penalties from store
    const penalties = penaltyIds
      .map((id) => allPenalties.find((p) => p.systemId === id))
      .filter(Boolean);
    
    if (penalties.length === 0) {
      toast.error('Không tìm thấy phiếu phạt');
      return;
    }
    
    // Build print jobs for all penalties
    const storeSettings = createStoreSettings(storeInfo);
    const employee = employeeLookup[payslip.employeeSystemId as SystemId];
    
    const printJobs = penalties
      .filter((penalty): penalty is NonNullable<typeof penalty> => penalty != null)
      .map((penalty) => {
        const penaltyForPrint = convertPenaltyForPrint(penalty, {
          employee: employee || null,
        });
        
        return {
          data: mapPenaltyToPrintData(penaltyForPrint, storeSettings),
          lineItems: [] as never[],
        };
      });
    
    // Print all penalties at once (single popup)
    printMultiple('penalty', printJobs);
    
    toast.success(`Đã in ${penalties.length} phiếu phạt`);
  }, [batch, payslips, allPenalties, employeeLookup, storeInfo, printMultiple]);

  // Print dialog state
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintRows, setPendingPrintRows] = React.useState<PayslipRow[]>([]);
  const [printMode, setPrintMode] = React.useState<'payslips' | 'penalties'>('payslips');

  // Bulk print penalties - open dialog
  const handleBulkPrintPenalties = React.useCallback((rows: PayslipRow[]) => {
    if (!batch || rows.length === 0) return;
    setPendingPrintRows(rows);
    setPrintMode('penalties');
    setIsPrintDialogOpen(true);
  }, [batch]);

  // Bulk print payslips - open dialog
  const handleBulkPrintPayslips = React.useCallback((rows: PayslipRow[]) => {
    if (!batch || rows.length === 0) return;
    setPendingPrintRows(rows);
    setPrintMode('payslips');
    setIsPrintDialogOpen(true);
  }, [batch]);

  // Handle print confirm from dialog
  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    if (!batch) return;
    
    const { paperSize } = options;
    const storeSettings = createStoreSettings(storeInfo);
    
    if (printMode === 'penalties') {
      // Print penalties
      const printOptionsList: Array<{
        data: ReturnType<typeof mapPenaltyToPrintData>;
        lineItems: never[];
        paperSize: PaperSize;
      }> = [];
      
      pendingPrintRows.forEach((row) => {
        const payslip = payslips.find((p) => p.systemId === row.systemId);
        if (!payslip) return;
        
        const penaltyIds = payslip.deductedPenaltySystemIds || [];
        if (penaltyIds.length === 0) return;
        
        const penalties = penaltyIds
          .map((id) => allPenalties.find((p) => p.systemId === id))
          .filter(Boolean);
        
        const employee = employeeLookup[payslip.employeeSystemId as SystemId];
        
        penalties.forEach((penalty) => {
          if (!penalty) return;
          
          const penaltyForPrint = convertPenaltyForPrint(penalty, {
            employee: employee || null,
          });
          
          printOptionsList.push({
            data: mapPenaltyToPrintData(penaltyForPrint, storeSettings),
            lineItems: [],
            paperSize,
          });
        });
      });
      
      if (printOptionsList.length > 0) {
        printMultiple('penalty', printOptionsList);
        toast.success(`Đã gửi lệnh in ${printOptionsList.length} phiếu phạt`);
      } else {
        toast.info('Không có phiếu phạt', {
          description: 'Các nhân viên được chọn không có phiếu phạt nào.',
        });
      }
    } else {
      // Print payslips
      const printOptionsList: Array<{
        data: ReturnType<typeof mapPayslipToPrintData>;
        lineItems: ReturnType<typeof mapPayslipComponentLineItems>;
        paperSize: PaperSize;
      }> = [];
      
      pendingPrintRows.forEach((row) => {
        const payslip = payslips.find((p) => p.systemId === row.systemId);
        if (!payslip) return;

        const employee = employeeLookup[payslip.employeeSystemId as SystemId];
        const departmentName = payslip.departmentSystemId
          ? departmentLookup[payslip.departmentSystemId as SystemId]?.name
          : undefined;

        const payslipForPrint = convertPayslipForPrint(
          payslip,
          batch,
          {
            employee: employee ? {
              id: employee.id,
              fullName: employee.fullName,
              department: departmentName,
              position: employee.positionName,
            } : undefined,
            departmentName,
          }
        );

        printOptionsList.push({
          data: mapPayslipToPrintData(payslipForPrint, storeSettings),
          lineItems: mapPayslipComponentLineItems(payslipForPrint.components),
          paperSize,
        });
      });
      
      if (printOptionsList.length > 0) {
        printMultiple('payslip', printOptionsList);
        toast.success(`Đã gửi lệnh in ${printOptionsList.length} phiếu lương`);
      }
    }
    
    setPendingPrintRows([]);
  }, [batch, printMode, pendingPrintRows, payslips, allPenalties, employeeLookup, departmentLookup, storeInfo, printMultiple]);

  // Bulk delete
  const handleBulkDeletePayslips = React.useCallback((rows: PayslipRow[]) => {
    if (isLocked) {
      toast.error('Không thể xóa', { description: 'Bảng lương đã khóa.' });
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    rows.forEach((row) => {
      try {
        removeFromBatch.mutate(row.systemId);
        successCount++;
      } catch (_e) {
        errorCount++;
      }
    });
    
    if (successCount > 0) {
      toast.success(`Đã xóa ${successCount} phiếu lương`);
    }
    if (errorCount > 0) {
      toast.error(`Không thể xóa ${errorCount} phiếu lương`);
    }
  }, [isLocked, removeFromBatch]);

  // Payslip table actions
  const payslipActions = React.useMemo<PayslipActions>(() => ({
    onEdit: handleEditPayslip,
    onPrint: handlePrintPayslip,
    onPrintPayment: handlePrintPayment,
    onPrintPenalties: handlePrintPenalties,
    onRemove: handleRemovePayslip,
  }), [handleEditPayslip, handlePrintPayslip, handlePrintPayment, handlePrintPenalties, handleRemovePayslip]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-72 flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold">Đang tải...</p>
        <p className="text-sm text-muted-foreground">Vui lòng đợi trong giây lát.</p>
      </div>
    );
  }

  // Not found state
  if (!batch) {
    return (
      <div className="flex h-72 flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold">Không tìm thấy bảng lương.</p>
        <p className="text-sm text-muted-foreground">Vui lòng kiểm tra lại đường dẫn hoặc quay về danh sách.</p>
        <Button className="mt-4 h-9" onClick={handleBack}>
          Về danh sách
        </Button>
      </div>
    );
  }

  const _statusHint = STATUS_HINTS[batch.status];

  return (
    <DetailPageShell gap="lg">
      {/* Info Card - 2 cột */}
      <Card className={mobileBleedCardClass}>
        <CardHeader className="pb-3">
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {/* Cột trái */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Mã</span>
              <span>{batch.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tiêu đề</span>
              <span className="font-medium text-right">{batch.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Kỳ lương</span>
              <span className="text-right">{payPeriodLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tháng chấm công</span>
              <span className="text-right">{referenceMonthsLabel || '—'}</span>
            </div>
          </div>
          
          {/* Cột phải */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ngày chi trả</span>
              <span>{formatDate(batch.payrollDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tổng thực lĩnh</span>
              <span className="font-semibold text-primary">{formatCurrency(batch.totalNet)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Số phiếu lương</span>
              <span>{batchPayslips.length} nhân viên</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Trạng thái</span>
              <PayrollStatusBadge status={batch.status} />
            </div>
          </div>
          
          {/* Phiếu chi lương - full width */}
          <div className="md:col-span-2 pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Phiếu chi lương</span>
              <span>{linkedPayments.length > 0 ? `${linkedPayments.length} phiếu chi` : 'Chưa tạo'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Totals & Notes */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className={mobileBleedCardClass}>
          <CardHeader className="pb-3">
            <CardTitle>Tổng quan chi trả</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground text-xs">Tổng thu nhập</p>
              <p className="text-base font-semibold text-emerald-600">{formatCurrency(totals.earnings)}</p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground text-xs">Tổng khấu trừ</p>
              <p className="text-base font-semibold text-red-500">{formatCurrency(totals.deductions)}</p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground text-xs">Đóng góp DN</p>
              <p className="text-base font-semibold text-blue-500">{formatCurrency(totals.contributions)}</p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground text-xs">Tổng thực lĩnh</p>
              <p className="text-base font-semibold">{formatCurrency(totals.net)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={mobileBleedCardClass}>
          <CardHeader className="pb-3">
            <CardTitle>Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-30"
              placeholder="Ghi chú nội bộ sẽ được hỗ trợ ở bước tiếp theo."
              readOnly
              value={batch.notes ?? ''}
            />
            {!batch.notes && (
              <p className="mt-2 text-xs text-muted-foreground">
                Bạn có thể cập nhật ghi chú sau khi hoàn thiện tính năng chỉnh sửa batch.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payslip Table */}
      <PayslipDataTable
        data={batchPayslips}
        isLocked={isLocked}
        actions={payslipActions}
        onBulkPrintBatch={handlePrint}
        onBulkPrint={handleBulkPrintPayslips}
        onBulkPrintPenalties={handleBulkPrintPenalties}
        onBulkDelete={handleBulkDeletePayslips}
      />

      {/* Edit Payslip Dialog */}
      <PayslipEditDialog
        open={!!editingPayslipId}
        onOpenChange={(open) => { if (!open) setEditingPayslipId(null); }}
        payslip={editingPayslip}
        employeeName={editingPayslip ? (employeeLookup[editingPayslip.employeeSystemId]?.fullName ?? `Nhân viên ${editingPayslip.employeeId}`) : ''}
        isLocked={isLocked}
        onSave={handleSavePayslip}
        isSaving={updateWithAudit.isPending}
      />

      {/* Create Payment Dialog */}
      <CreatePaymentDialog
        open={isCreatePaymentOpen}
        onOpenChange={setIsCreatePaymentOpen}
        batch={batch}
        payslips={payslips}
        employeeLookup={employeeLookup as Record<SystemId, import('../employees/types').Employee | undefined>}
      />

      {/* Audit Logs */}
      <EntityActivityTable entityType="payroll" entityId={params.systemId} />

      {/* Approval Dialog */}
      <AlertDialog
        open={isApprovalDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeApprovalDialog();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {approvalAction ? APPROVAL_DIALOG_CONFIG[approvalAction].title : 'Xác nhận'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {approvalAction
                ? APPROVAL_DIALOG_CONFIG[approvalAction].description
                : 'Thao tác sẽ được áp dụng cho bảng lương hiện tại.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="approval-note" className="text-sm font-medium">
              Ghi chú nội bộ (không bắt buộc)
            </Label>
            <Textarea
              id="approval-note"
              placeholder="Nhập lý do duyệt/khóa để lưu vào nhật ký."
              className="min-h-20"
              value={approvalNote}
              onChange={(event) => setApprovalNote(event.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9" onClick={closeApprovalDialog}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction className="h-9" onClick={handleConfirmApproval} disabled={!approvalAction}>
              {approvalAction ? APPROVAL_DIALOG_CONFIG[approvalAction].confirmLabel : 'Xác nhận'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Options Dialog */}
      <SimplePrintOptionsDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        onConfirm={handlePrintConfirm}
        selectedCount={pendingPrintRows.length}
        title={printMode === 'payslips' ? 'In phiếu lương' : 'In phiếu phạt'}
      />
    </DetailPageShell>
  );
}
