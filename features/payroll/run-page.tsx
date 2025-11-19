import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Wallet, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select.tsx';
import { Checkbox } from '../../components/ui/checkbox.tsx';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert.tsx';
import { Skeleton } from '../../components/ui/skeleton.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { ROUTES } from '../../lib/router.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useAttendanceStore } from '../attendance/store.ts';
import { usePayrollTemplateStore } from './payroll-template-store.ts';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store.ts';
import { usePayrollBatchStore, type GeneratedPayslipPayload } from './payroll-batch-store.ts';
import { PayslipTable } from './components/payslip-table.tsx';
import { PayrollSummaryCards } from './components/summary-cards.tsx';
import { payrollEngine } from '../../lib/payroll-engine.ts';
import type { PayrollEngineResult } from '../../lib/payroll-engine.ts';
import { useToast } from '../../hooks/use-toast.ts';
import { asSystemId, type SystemId } from '../../lib/id-types.ts';

const STEPS = [
  {
    id: 'period',
    title: '1. Kỳ lương & nguồn dữ liệu',
    description: 'Chọn tháng, ngày chi trả và template mặc định.',
  },
  {
    id: 'employees',
    title: '2. Nhân viên & cấu hình',
    description: 'Chọn nhân viên sẽ chạy bảng lương.',
  },
  {
    id: 'preview',
    title: '3. Xem trước & xác nhận',
    description: 'Kiểm tra kết quả trước khi tạo batch.',
  },
] as const;

const buildPayPeriod = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number);
  const startDate = new Date(year, (month ?? 1) - 1, 1);
  const endDate = new Date(year, month ?? 1, 0);
  const format = (date: Date) => date.toISOString().slice(0, 10);
  return {
    monthKey,
    startDate: format(startDate),
    endDate: format(endDate),
  };
};

const getCurrentMonthKey = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
};

const formatMonthLabel = (monthKey: string) => {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-');
  return `Tháng ${month}/${year}`;
};

const buildPayrollDate = (monthKey: string, targetDay: number) => {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) return monthKey;
  const lastDay = new Date(year, month, 0).getDate();
  const nextDay = Math.min(Math.max(targetDay, 1), lastDay);
  return `${monthKey}-${String(nextDay).padStart(2, '0')}`;
};

export function PayrollRunPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: employeeData, getActive } = useEmployeeStore();
  const lockedMonths = useAttendanceStore((state) => state.lockedMonths);
  const templates = usePayrollTemplateStore((state) => state.templates);
  const ensureDefaultTemplate = usePayrollTemplateStore((state) => state.ensureDefaultTemplate);
  const createBatchWithResults = usePayrollBatchStore((state) => state.createBatchWithResults);
  const payrollWindow = useEmployeeSettingsStore((state) => state.getDefaultPayrollWindow());

  React.useEffect(() => {
    ensureDefaultTemplate();
  }, [ensureDefaultTemplate]);

  const latestLockedMonth = React.useMemo(() => {
    const lockedKeys = Object.keys(lockedMonths).filter((key) => lockedMonths[key]);
    return lockedKeys.sort().reverse()[0];
  }, [lockedMonths]);

  const [currentStep, setCurrentStep] = React.useState(0);
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [preview, setPreview] = React.useState<{ results: PayrollEngineResult[]; totalGross: number; totalNet: number } | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);

  const defaultMonthKey = latestLockedMonth ?? getCurrentMonthKey();
  const defaultPayrollDate = React.useMemo(
    () => buildPayrollDate(defaultMonthKey, payrollWindow.payday),
    [defaultMonthKey, payrollWindow.payday]
  );

  const defaultTemplateSystemId = React.useMemo(
    () => templates.find((template) => template.isDefault)?.systemId,
    [templates]
  );

  const [formState, setFormState] = React.useState({
    title: '',
    monthKey: defaultMonthKey,
    payrollDate: defaultPayrollDate,
    templateSystemId: defaultTemplateSystemId,
    selectedEmployeeSystemIds: [] as SystemId[],
  });

  React.useEffect(() => {
    setFormState((prev) => {
      const hasValidSelection = prev.templateSystemId
        ? templates.some((template) => template.systemId === prev.templateSystemId)
        : false;
      if (hasValidSelection || !defaultTemplateSystemId) {
        return prev;
      }
      return {
        ...prev,
        templateSystemId: defaultTemplateSystemId,
      };
    });
  }, [templates, defaultTemplateSystemId]);

  const employees = React.useMemo(() => getActive(), [employeeData, getActive]);
  const employeeLookup = React.useMemo(() => {
    return employees.reduce<Record<SystemId, (typeof employees)[number]>>(
      (acc, employee) => {
        acc[employee.systemId] = employee;
        return acc;
      },
      {} as Record<SystemId, (typeof employees)[number]>
    );
  }, [employees]);

  const filteredEmployees = React.useMemo(() => {
    if (!searchKeyword.trim()) {
      return employees;
    }
    const keyword = searchKeyword.trim().toLowerCase();
    return employees.filter((employee) =>
      employee.fullName.toLowerCase().includes(keyword) || employee.id.toLowerCase().includes(keyword)
    );
  }, [employees, searchKeyword]);
  const canProceedStep1 = Boolean(formState.monthKey && formState.payrollDate && formState.templateSystemId);
  const canProceedStep2 = formState.selectedEmployeeSystemIds.length > 0;

  const goNext = () => {
    if (currentStep === 0 && !canProceedStep1) return;
    if (currentStep === 1 && !canProceedStep2) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };
  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  React.useEffect(() => {
    if (currentStep !== 2) {
      setPreview(null);
      setIsPreviewLoading(false);
      return;
    }
    if (!formState.selectedEmployeeSystemIds.length) {
      setPreview(null);
      return;
    }
    const inputs = formState.selectedEmployeeSystemIds.map((employeeSystemId) => ({
      employeeSystemId,
      monthKey: formState.monthKey,
      templateSystemId: formState.templateSystemId,
    }));
    setIsPreviewLoading(true);
    const result = payrollEngine.runBatch(inputs);
    setPreview(result);
    setIsPreviewLoading(false);
  }, [currentStep, formState.selectedEmployeeSystemIds, formState.monthKey, formState.templateSystemId]);

  const handleSelectEmployee = (systemId: SystemId, checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      selectedEmployeeSystemIds: checked
        ? (prev.selectedEmployeeSystemIds.includes(systemId)
            ? prev.selectedEmployeeSystemIds
            : [...prev.selectedEmployeeSystemIds, systemId])
        : prev.selectedEmployeeSystemIds.filter((id) => id !== systemId),
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      selectedEmployeeSystemIds: checked ? filteredEmployees.map((employee) => employee.systemId) : [],
    }));
  };

  const handleCreateBatch = () => {
    if (!preview || !preview.results.length) {
      toast({
        title: 'Chưa có dữ liệu preview',
        description: 'Vui lòng chọn nhân viên và chạy lại bước xem trước.',
      });
      return;
    }

    const title = formState.title?.trim() || `Bảng lương ${formatMonthLabel(formState.monthKey)}`;
    const payPeriod = buildPayPeriod(formState.monthKey);
    const batch = createBatchWithResults(
      {
        title,
        payPeriod,
        payrollDate: formState.payrollDate,
        templateSystemId: formState.templateSystemId,
        referenceAttendanceMonthKeys: [formState.monthKey],
      },
      preview.results.map<GeneratedPayslipPayload>((result) => ({
        employeeSystemId: result.employeeSystemId,
        employeeId: result.employeeId,
        departmentSystemId: undefined,
        periodMonthKey: formState.monthKey,
        components: result.components,
        totals: result.totals,
        attendanceSnapshotSystemId: undefined,
      }))
    );

    toast({ title: 'Đã tạo bảng lương', description: 'Bạn có thể xem chi tiết để duyệt hoặc khóa batch.' });
    navigate(ROUTES.PAYROLL.DETAIL.replace(':systemId', batch.systemId));
  };

  const headerActions = React.useMemo(
    () => [
      <Button key="cancel" variant="outline" className="h-9" onClick={() => navigate(ROUTES.PAYROLL.LIST)}>
        Hủy
      </Button>,
    ],
    [navigate]
  );

  usePageHeader({
    title: 'Chạy bảng lương',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD },
      { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST },
      { label: 'Chạy mới', href: ROUTES.PAYROLL.RUN },
    ],
    actions: headerActions,
  });

  const previewWarnings = React.useMemo(() => {
    if (!preview?.results.length) return [] as string[];
    return preview.results.flatMap((result) =>
      result.warnings.map((warning) => `${result.employeeId} · ${warning}`)
    );
  }, [preview]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Tiến trình</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <li key={step.id} className="rounded-lg border p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Badge variant={isActive ? 'default' : 'secondary'} className="h-6 w-6 justify-center">
                        {index + 1}
                      </Badge>
                    )}
                    <span>{step.title}</span>
                  </div>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cấu hình kỳ lương</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="payroll-title">Tiêu đề</Label>
                <Input
                  id="payroll-title"
                  placeholder="VD: Lương Tháng 11/2025"
                  value={formState.title}
                  onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payroll-month">Tháng tham chiếu</Label>
                <Input
                  id="payroll-month"
                  type="month"
                  className="h-9"
                  value={formState.monthKey}
                  onChange={(event) =>
                    setFormState((prev) => {
                      const currentDay = Number(prev.payrollDate.split('-')[2]) || payrollWindow.payday;
                      const nextMonthKey = event.target.value;
                      return {
                        ...prev,
                        monthKey: nextMonthKey,
                        payrollDate: buildPayrollDate(nextMonthKey, currentDay),
                      };
                    })
                  }
                  min="2024-01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payroll-date">Ngày chi trả</Label>
                <Input
                  id="payroll-date"
                  type="date"
                  className="h-9"
                  value={formState.payrollDate}
                  onChange={(event) => setFormState((prev) => ({ ...prev, payrollDate: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Template</Label>
                <Select
                  value={formState.templateSystemId ?? ''}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      templateSystemId: value ? asSystemId(value) : undefined,
                    }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.systemId} value={template.systemId}>
                        {template.name}
                        {template.isDefault ? ' · Mặc định' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!latestLockedMonth && (
              <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-950/40">
                <AlertTitle>Chưa có tháng chấm công nào được khóa</AlertTitle>
                <AlertDescription>
                  Bạn vẫn có thể chạy bảng lương với dữ liệu hiện tại nhưng hãy khóa tháng trong Chấm công để tránh sai lệch.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chọn nhân viên ({formState.selectedEmployeeSystemIds.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <Input
                placeholder="Tìm theo tên hoặc mã"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                className="h-9 md:w-64"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="h-9"
                  onClick={() => handleSelectAll(true)}
                >
                  Chọn tất cả
                </Button>
                <Button
                  variant="ghost"
                  className="h-9"
                  onClick={() => handleSelectAll(false)}
                >
                  Bỏ chọn
                </Button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    <th className="w-12 p-3 text-left">
                      <Checkbox
                        checked={formState.selectedEmployeeSystemIds.length > 0 && formState.selectedEmployeeSystemIds.length === filteredEmployees.length}
                        onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                        className="h-4 w-4"
                      />
                    </th>
                    <th className="p-3 text-left">Nhân viên</th>
                    <th className="p-3 text-left">Phòng ban</th>
                    <th className="p-3 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => {
                    const checked = formState.selectedEmployeeSystemIds.includes(employee.systemId);
                    return (
                      <tr key={employee.systemId} className="border-t">
                        <td className="p-3">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => handleSelectEmployee(employee.systemId, Boolean(value))}
                            className="h-4 w-4"
                          />
                        </td>
                        <td className="p-3">
                          <p className="font-medium">{employee.fullName}</p>
                          <p className="text-xs text-muted-foreground">{employee.id}</p>
                        </td>
                        <td className="p-3">{employee.department}</td>
                        <td className="p-3">
                          <Badge variant="outline">{employee.employmentStatus}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        Không tìm thấy nhân viên phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Xem trước kết quả</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPreviewLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : preview ? (
              <>
                <PayrollSummaryCards
                  items={[
                    {
                      id: 'selected',
                      title: 'Nhân viên',
                      value: preview.results.length,
                      description: 'Đang chạy bảng lương',
                      icon: Users,
                    },
                    {
                      id: 'gross',
                      title: 'Tổng thu nhập',
                      value: preview.totalGross.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }),
                      icon: Wallet,
                    },
                    {
                      id: 'net',
                      title: 'Tổng thực lĩnh',
                      value: preview.totalNet.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }),
                      icon: CalendarIcon,
                    },
                    {
                      id: 'month',
                      title: 'Tháng tham chiếu',
                      value: formatMonthLabel(formState.monthKey),
                    },
                  ]}
                />

                {previewWarnings.length > 0 && (
                  <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-950/40">
                    <AlertTitle>Cảnh báo</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-4">
                        {previewWarnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <PayslipTable
                  rows={preview.results.map((result) => ({
                    systemId: result.employeeSystemId,
                    employeeId: result.employeeId,
                    employeeName: result.employeeName,
                    departmentName: employeeLookup[result.employeeSystemId]?.department,
                    totals: result.totals,
                  }))}
                  isLoading={false}
                  emptyMessage="Không có dữ liệu để hiển thị."
                />
              </>
            ) : (
              <Alert>
                <AlertTitle>Chưa có dữ liệu preview</AlertTitle>
                <AlertDescription>
                  Vui lòng quay lại bước trước để chọn nhân viên, sau đó quay lại đây để xem kết quả.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" className="h-9" disabled={currentStep === 0} onClick={goPrev}>
          Quay lại
        </Button>
        {currentStep < 2 ? (
          <Button className="h-9" onClick={goNext} disabled={(currentStep === 0 && !canProceedStep1) || (currentStep === 1 && !canProceedStep2)}>
            Tiếp tục
          </Button>
        ) : (
          <Button className="h-9" disabled={!preview || !preview.results.length} onClick={handleCreateBatch}>
            Tạo bảng lương
          </Button>
        )}
      </div>
    </div>
  );
}
