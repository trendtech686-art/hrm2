import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../../components/ui/badge.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog.tsx';
import { Label } from '../../components/ui/label.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useToast } from '../../hooks/use-toast.ts';
import { ROUTES } from '../../lib/router.ts';
import { usePayrollBatchStore } from './payroll-batch-store.ts';
import { usePayrollTemplateStore } from './payroll-template-store.ts';
import { PayrollStatusBadge } from './components/status-badge.tsx';
import { PayslipTable, type PayslipTableRow } from './components/payslip-table.tsx';
import { useEmployeeStore } from '../employees/store.ts';
import { useDepartmentStore } from '../settings/departments/store.ts';
import type { PayrollAuditAction, PayrollBatch, PayrollPeriod } from '../../lib/payroll-types.ts';
import { ensureSystemId, type BusinessId, type SystemId } from '../../lib/id-types.ts';

const STATUS_LABEL: Record<PayrollBatch['status'], string> = {
  draft: 'Nháp',
  reviewed: 'Đang duyệt',
  locked: 'Đã khóa',
};

const STATUS_HINTS: Record<PayrollBatch['status'], { title: string; description: string; tone: 'info' | 'warning' | 'success' }> = {
  draft: {
    title: 'Bảng lương đang ở trạng thái Nháp',
    description: 'Kiểm tra dữ liệu và bấm “Đánh dấu đã duyệt” để chuyển sang bước xem xét trước khi khóa.',
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
};

const AUDIT_ACTION_LABEL: Record<PayrollAuditAction, string> = {
  run: 'Khởi tạo',
  recalculate: 'Tái tính toán',
  review: 'Đánh dấu duyệt',
  lock: 'Khóa bảng lương',
  unlock: 'Mở khóa',
  export: 'Xuất dữ liệu',
};

const ALERT_CLASS_BY_TONE: Record<'info' | 'warning' | 'success', string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-400/40 dark:bg-blue-950/40',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-950/40',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-950/40',
};

type ApprovalAction = 'review' | 'lock';

type DepartmentSummaryRow = {
  departmentSystemId?: SystemId;
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

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) => (typeof value === 'number' ? currencyFormatter.format(value) : '—');

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('vi-VN') : '—');

const formatDateTime = (value?: string) => (value ? new Date(value).toLocaleString('vi-VN') : '—');

const formatMonthKey = (monthKey?: string) => {
  if (!monthKey) return '—';
  const [year, month] = monthKey.split('-');
  return `Tháng ${month}/${year}`;
};

const formatPeriod = (period?: PayrollPeriod) => {
  if (!period) return '—';
  return `${formatDate(period.startDate)} – ${formatDate(period.endDate)}`;
};

export function PayrollDetailPage() {
  const params = useParams<{ systemId?: string }>();
  const resolvedSystemId = React.useMemo(
    () => (params.systemId ? ensureSystemId(params.systemId, 'PayrollDetailPage') : undefined),
    [params.systemId]
  );
  const navigate = useNavigate();
  const { toast } = useToast();
  const batch = usePayrollBatchStore(
    React.useCallback(
      (state) => (resolvedSystemId ? state.getBatchBySystemId(resolvedSystemId) : undefined),
      [resolvedSystemId]
    )
  );
  const payslips = usePayrollBatchStore(
    React.useCallback(
      (state) => (resolvedSystemId ? state.getPayslipsByBatch(resolvedSystemId) : []),
      [resolvedSystemId]
    )
  );
  const auditLogs = usePayrollBatchStore((state) => state.auditLogs);
  const updateBatchStatus = usePayrollBatchStore((state) => state.updateBatchStatus);

  const template = usePayrollTemplateStore(
    React.useCallback(
      (state) =>
        batch?.templateSystemId
          ? state.templates.find((item) => item.systemId === batch.templateSystemId)
          : undefined,
      [batch?.templateSystemId]
    )
  );

  const employeeStore = useEmployeeStore();
  const { data: departments } = useDepartmentStore();
  const employeeLookup = React.useMemo(() => {
    return employeeStore.data.reduce<Record<SystemId, (typeof employeeStore.data)[number]>>(
      (acc, employee) => {
        acc[employee.systemId] = employee;
        return acc;
      },
      {} as Record<SystemId, (typeof employeeStore.data)[number]>
    );
  }, [employeeStore.data]);
  const departmentLookup = React.useMemo(() => {
    return departments.reduce<Record<SystemId, (typeof departments)[number]>>(
      (acc, department) => {
        acc[department.systemId] = department;
        return acc;
      },
      {} as Record<SystemId, (typeof departments)[number]>
    );
  }, [departments]);

  const batchPayslips = React.useMemo<PayslipTableRow[]>(() => {
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
        totals: payslip.totals,
      } satisfies PayslipTableRow;
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

  const batchAuditLogs = React.useMemo(() => {
    if (!batch) return [];
    return auditLogs
      .filter((entry) => entry.batchSystemId === batch.systemId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [auditLogs, batch]);

  const canReview = batch?.status === 'draft';
  const canLock = batch?.status === 'reviewed';
  const [approvalAction, setApprovalAction] = React.useState<ApprovalAction | null>(null);
  const [approvalNote, setApprovalNote] = React.useState('');
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false);
  const logAction = usePayrollBatchStore((state) => state.logAction);

  const openApprovalDialog = (action: ApprovalAction) => {
    setApprovalAction(action);
    setApprovalNote('');
    setIsApprovalDialogOpen(true);
  };

  const closeApprovalDialog = () => {
    setIsApprovalDialogOpen(false);
    setApprovalAction(null);
    setApprovalNote('');
  };

  const handleStatusChange = (status: PayrollBatch['status'], note?: string) => {
    if (!batch) return;
    updateBatchStatus(batch.systemId, status, note);
    toast({
      title: 'Cập nhật trạng thái thành công',
      description: `Bảng lương đã chuyển sang trạng thái ${STATUS_LABEL[status]}.`,
    });
  };

  const handleConfirmApproval = () => {
    if (!approvalAction || !batch) return;
    const status = approvalAction === 'review' ? 'reviewed' : 'locked';
    const note = approvalNote.trim() || undefined;
    handleStatusChange(status, note);
    closeApprovalDialog();
  };

  const handleOpenEmployee = (row: PayslipTableRow) => {
    if (!row.employeeSystemId) return;
    navigate(ROUTES.HRM.EMPLOYEE_VIEW.replace(':systemId', row.employeeSystemId));
  };

  const headerActions = React.useMemo(
    () => [
      <Button key="close" variant="outline" className="h-9" onClick={() => navigate(ROUTES.PAYROLL.LIST)}>
        Quay lại
      </Button>,
    ],
    [navigate]
  );

  usePageHeader({
    title: batch ? `Bảng lương ${batch.id}` : 'Chi tiết bảng lương',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD },
      { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST },
      { label: batch?.id ?? 'Chi tiết', href: ROUTES.PAYROLL.DETAIL.replace(':systemId', params.systemId ?? '') },
    ],
    badge: batch ? <PayrollStatusBadge status={batch.status} /> : undefined,
    actions: headerActions,
  });

  if (!batch) {
    return (
      <div className="flex h-72 flex-col items-center justify-center text-center">
        <p className="text-base font-semibold">Không tìm thấy bảng lương.</p>
        <p className="text-sm text-muted-foreground">Vui lòng kiểm tra lại đường dẫn hoặc quay về danh sách.</p>
        <Button className="mt-4 h-9" onClick={() => navigate(ROUTES.PAYROLL.LIST)}>
          Về danh sách
        </Button>
      </div>
    );
  }

  const statusHint = STATUS_HINTS[batch.status];
  const referenceMonths = batch.referenceAttendanceMonthKeys.map((month) => formatMonthKey(month)).join(', ');
  const payPeriodLabel = formatPeriod(batch.payPeriod);
  const exportMetadata = React.useMemo<PayrollExportMetadata | null>(() => {
    if (!batch) return null;
    return {
      batchId: batch.id,
      title: batch.title,
      payPeriodLabel,
      payrollDateLabel: formatDate(batch.payrollDate),
      referenceMonths,
    };
  }, [batch, payPeriodLabel, referenceMonths]);
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

  const auditEmptyLabel = batchAuditLogs.length === 0;

  const handleExportDepartmentReport = () => {
    if (!batch || !exportMetadata) return;
    if (!departmentSummaries.length) {
      toast({
        title: 'Không có dữ liệu',
        description: 'Chưa có phòng ban nào trong batch để xuất báo cáo.',
      });
      return;
    }
    const csvContent = buildDepartmentReportCsv(departmentSummaries, exportMetadata);
    const filename = `bao-cao-phong-ban-${batch.id}.csv`;
    downloadCsv(csvContent, filename);
    logAction({
      batchSystemId: batch.systemId,
      action: 'export',
      payload: { type: 'department-summary', rows: departmentSummaries.length },
    });
    toast({ title: 'Xuất báo cáo thành công', description: `Đã tải xuống ${filename}.` });
  };

  const handleExportPayslipReport = () => {
    if (!batch || !exportMetadata) return;
    if (!payslipExports.length) {
      toast({
        title: 'Không có dữ liệu',
        description: 'Chưa có phiếu lương nào để xuất.',
      });
      return;
    }
    const csvContent = buildPayslipReportCsv(payslipExports, exportMetadata);
    const filename = `payslip-${batch.id}.csv`;
    downloadCsv(csvContent, filename);
    logAction({
      batchSystemId: batch.systemId,
      action: 'export',
      payload: { type: 'payslip-list', rows: payslipExports.length },
    });
    toast({ title: 'Xuất phiếu lương thành công', description: `Đã tải xuống ${filename}.` });
  };

  return (
    <div className="space-y-6">
      {statusHint && (
        <Alert className={ALERT_CLASS_BY_TONE[statusHint.tone]}>
          <AlertTitle>{statusHint.title}</AlertTitle>
          <AlertDescription>{statusHint.description}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Mã</span>
              <span className="font-mono text-xs">{batch.id}</span>
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
              <span className="text-right">{referenceMonths}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Ngày chi trả</span>
              <span>{formatDate(batch.payrollDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tổng thực lĩnh</span>
              <span className="font-semibold text-primary">{formatCurrency(batch.totalNet)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hành động</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button className="h-9" disabled={!canReview} onClick={() => openApprovalDialog('review')}>
              Đánh dấu đã duyệt
            </Button>
            <Button
              className="h-9"
              variant="destructive"
              disabled={!canLock}
              onClick={() => openApprovalDialog('lock')}
            >
              Khóa bảng lương
            </Button>
            <Badge variant="outline" className="justify-center">
              Trạng thái hiện tại: {STATUS_LABEL[batch.status]}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Bấm khóa sẽ tự động khóa các tháng chấm công tham chiếu: {referenceMonths || 'Không xác định'}.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Template & nguồn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Template áp dụng</span>
              <span className="font-medium text-right">{template?.name ?? 'Không có template'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Số thành phần</span>
              <span>{template?.componentSystemIds.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Phiếu lương</span>
              <span>{batchPayslips.length} nhân viên</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cập nhật lần cuối</span>
              <span>{formatDateTime(batch.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tổng quan chi trả</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Tổng thu nhập</p>
              <p className="text-lg font-semibold text-emerald-600">{formatCurrency(totals.earnings)}</p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Tổng khấu trừ</p>
              <p className="text-lg font-semibold text-red-500">{formatCurrency(totals.deductions)}</p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Đóng góp DN</p>
              <p className="text-lg font-semibold text-blue-500">{formatCurrency(totals.contributions)}</p>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Tổng thực lĩnh</p>
              <p className="text-lg font-semibold">{formatCurrency(totals.net)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[120px]"
              placeholder="Ghi chú nội bộ sẽ được hỗ trợ ở bước tiếp theo."
              readOnly
              value={batch.notes ?? ''}
            />
            {!batch.notes && (
              <p className="mt-2 text-xs text-muted-foreground">Bạn có thể cập nhật ghi chú sau khi hoàn thiện tính năng chỉnh sửa batch.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-base">Báo cáo & xuất file</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button className="h-9" onClick={handleExportDepartmentReport} disabled={!departmentSummaries.length}>
                Xuất báo cáo phòng ban
              </Button>
              <Button
                className="h-9"
                variant="secondary"
                onClick={handleExportPayslipReport}
                disabled={!payslipExports.length}
              >
                Xuất danh sách phiếu lương
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Xem nhanh tổng hợp theo phòng ban và tải file phục vụ kế toán hoặc nhân sự.</p>
        </CardHeader>
        <CardContent>
          {departmentSummaries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu phòng ban để hiển thị.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Phòng ban</th>
                    <th className="px-3 py-2 font-medium">Số nhân viên</th>
                    <th className="px-3 py-2 font-medium">Tổng thu nhập</th>
                    <th className="px-3 py-2 font-medium">Tổng khấu trừ</th>
                    <th className="px-3 py-2 font-medium">Đóng góp DN</th>
                    <th className="px-3 py-2 font-medium">Thực lĩnh</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentSummaries.map((row) => (
                    <tr key={row.departmentSystemId ?? row.departmentName} className="border-t">
                      <td className="px-3 py-2 font-medium">{row.departmentName}</td>
                      <td className="px-3 py-2">{row.headcount}</td>
                      <td className="px-3 py-2">{formatCurrency(row.totalEarnings)}</td>
                      <td className="px-3 py-2">{formatCurrency(row.totalDeductions)}</td>
                      <td className="px-3 py-2">{formatCurrency(row.totalContributions)}</td>
                      <td className="px-3 py-2 font-semibold">{formatCurrency(row.totalNet)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <PayslipTable
        rows={batchPayslips}
        emptyMessage="Chưa có phiếu lương nào trong batch."
        onRowClick={handleOpenEmployee}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nhật ký thao tác</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {auditEmptyLabel && <p className="text-sm text-muted-foreground">Chưa có nhật ký nào.</p>}
          {batchAuditLogs.map((entry, index) => (
            <React.Fragment key={entry.systemId}>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{AUDIT_ACTION_LABEL[entry.action] ?? entry.action}</p>
                  <p className="text-muted-foreground">
                    {formatDateTime(entry.createdAt)} · {entry.actorDisplayName ?? entry.actorSystemId}
                  </p>
                  {entry.payload?.note && (
                    <p className="text-xs text-muted-foreground">Ghi chú: {String(entry.payload.note)}</p>
                  )}
                </div>
                <Badge variant="outline">#{batchAuditLogs.length - index}</Badge>
              </div>
              {index < batchAuditLogs.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      <AlertDialog
        open={isApprovalDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeApprovalDialog();
          } else {
            setIsApprovalDialogOpen(true);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{approvalAction ? APPROVAL_DIALOG_CONFIG[approvalAction].title : 'Xác nhận'}</AlertDialogTitle>
            <AlertDialogDescription>
              {approvalAction ? APPROVAL_DIALOG_CONFIG[approvalAction].description : 'Thao tác sẽ được áp dụng cho bảng lương hiện tại.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="approval-note" className="text-sm font-medium">
              Ghi chú nội bộ (không bắt buộc)
            </Label>
            <Textarea
              id="approval-note"
              placeholder="Nhập lý do duyệt/khóa để lưu vào nhật ký."
              className="min-h-[80px]"
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
    </div>
  );
}

const CSV_BOM = '\uFEFF';

const buildDepartmentReportCsv = (rows: DepartmentSummaryRow[], metadata: PayrollExportMetadata) => {
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

const buildPayslipReportCsv = (rows: PayslipExportRow[], metadata: PayrollExportMetadata) => {
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

const downloadCsv = (content: string, filename: string) => {
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
