'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Users, Wallet, Calendar as CalendarIcon, CheckCircle2, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';
import { MonthPicker } from '../../components/ui/month-picker';
import { DatePicker } from '../../components/ui/date-picker';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { useEmployeeStore } from '../employees/store';
import { useLeaveStore } from '../leaves/store';
import { useAttendanceStore } from '../attendance/store';
import { usePayrollTemplateStore } from './payroll-template-store';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store';
import { usePayrollBatchStore, type GeneratedPayslipPayload } from './payroll-batch-store';
import { usePenaltyStore } from '../settings/penalties/store';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { Checkbox } from '../../components/ui/checkbox';
import type { ColumnDef } from '../../components/data-table/types';
import type { Employee } from '../employees/types';
import { PayrollSummaryCards } from './components/summary-cards';
import { payrollEngine, type CalculatedPayslip, type PayrollCalculationResult } from '../../lib/payroll-engine';
import { toast } from 'sonner';
import { asSystemId, type SystemId } from '../../lib/id-types';
import { attendanceSnapshotService } from '../../lib/attendance-snapshot-service';
import { cn } from '../../lib/utils';
import { buildPayPeriodFromMonthKey, getCurrentDateInTimezone, formatLocalDateString } from '../../lib/date-utils';

const STEPS = [
  { id: 'period', name: 'Kỳ lương', description: 'Chọn tháng, ngày chi trả và template mặc định.' },
  { id: 'employees', name: 'Nhân viên', description: 'Chọn nhân viên sẽ chạy bảng lương.' },
  { id: 'preview', name: 'Xem trước', description: 'Kiểm tra kết quả trước khi tạo batch.' },
] as const;

// =============================================
// PAYROLL STEPPER (giống Order StatusStepper)
// =============================================

function PayrollStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-start justify-between w-full px-4 py-4">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center w-28">
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-body-sm',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isCurrent
                      ? 'border-primary text-primary'
                      : 'border-gray-300 bg-gray-100 text-gray-400'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <p
                className={cn(
                  'text-body-sm mt-2 font-medium',
                  isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.name}
              </p>
              <p className="text-body-xs text-muted-foreground mt-1">{step.description}</p>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 mt-4 h-0.5',
                  index < currentStep ? 'bg-primary' : 'bg-gray-300'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Use helper from date-utils (reads timezone from settings)
const buildPayPeriod = buildPayPeriodFromMonthKey;

const getCurrentMonthKey = () => {
  const now = getCurrentDateInTimezone();
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

// =============================================
// PREVIEW TABLE TYPES & COLUMNS
// =============================================

type PreviewTableRow = {
  systemId: SystemId;
  employeeId: string;
  employeeName: string;
  departmentName?: string;
  positionName?: string;
  totals: {
    // Chấm công
    workDays?: number;
    standardWorkDays?: number;
    otHours?: number;
    otHoursWeekday?: number;
    otHoursWeekend?: number;
    otHoursHoliday?: number;
    // Lương
    earnings: number;
    totalEmployeeInsurance: number;
    taxableIncome: number;
    personalIncomeTax: number;
    penaltyDeductions?: number;
    otherDeductions?: number;
    netPay: number;
  };
};

const previewTableColumns: ColumnDef<PreviewTableRow>[] = [
  {
    id: 'employeeId',
    accessorKey: 'employeeId',
    size: 100,
    meta: { displayName: 'Mã nhân viên' },
    header: () => <span>Mã nhân viên</span>,
    cell: ({ row }) => <span>{row.employeeId}</span>,
  },
  {
    id: 'employeeName',
    accessorKey: 'employeeName',
    size: 150,
    meta: { displayName: 'Nhân viên' },
    header: () => <span>Nhân viên</span>,
    cell: ({ row }) => <span>{row.employeeName}</span>,
  },
  {
    id: 'departmentName',
    accessorKey: 'departmentName',
    size: 120,
    meta: { displayName: 'Phòng ban' },
    header: () => <span>Phòng ban</span>,
    cell: ({ row }) => <span>{row.departmentName ?? '—'}</span>,
  },
  {
    id: 'positionName',
    accessorKey: 'positionName',
    size: 120,
    meta: { displayName: 'Chức vụ' },
    header: () => <span>Chức vụ</span>,
    cell: ({ row }) => <span>{row.positionName ?? '—'}</span>,
  },
  {
    id: 'workDays',
    size: 80,
    meta: { displayName: 'Công' },
    header: () => <span className="text-right w-full block">Công</span>,
    cell: ({ row }) => {
      const workDays = row.totals.workDays ?? 0;
      const standardDays = row.totals.standardWorkDays ?? 26;
      return (
        <span className={`text-right block ${workDays === 0 ? 'text-red-500 font-medium' : ''}`}>
          {workDays}/{standardDays}
        </span>
      );
    },
  },
  {
    id: 'otWeekday',
    size: 100,
    meta: { displayName: 'Thêm Thường' },
    header: () => <span className="text-right w-full block">Thêm Thường</span>,
    cell: ({ row }) => {
      const hours = row.totals.otHoursWeekday ?? 0;
      if (hours === 0) return <span className="text-right block text-muted-foreground">—</span>;
      return <span className="text-right block text-blue-600">{hours}h</span>;
    },
  },
  {
    id: 'otWeekend',
    size: 100,
    meta: { displayName: 'Thêm C.Tuần' },
    header: () => <span className="text-right w-full block">Thêm C.Tuần</span>,
    cell: ({ row }) => {
      const hours = row.totals.otHoursWeekend ?? 0;
      if (hours === 0) return <span className="text-right block text-muted-foreground">—</span>;
      return <span className="text-right block text-orange-600">{hours}h</span>;
    },
  },
  {
    id: 'otHoliday',
    size: 90,
    meta: { displayName: 'Thêm Lễ' },
    header: () => <span className="text-right w-full block">Thêm Lễ</span>,
    cell: ({ row }) => {
      const hours = row.totals.otHoursHoliday ?? 0;
      if (hours === 0) return <span className="text-right block text-muted-foreground">—</span>;
      return <span className="text-right block text-red-600 font-medium">{hours}h</span>;
    },
  },
  {
    id: 'earnings',
    size: 120,
    meta: { displayName: 'Thu nhập' },
    header: () => <span className="text-right w-full block">Thu nhập</span>,
    cell: ({ row }) => (
      <span className="text-right block">
        {row.totals.earnings.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} đ
      </span>
    ),
  },
  {
    id: 'insurance',
    size: 100,
    meta: { displayName: 'Bảo hiểm' },
    header: () => <span className="text-right w-full block">Bảo hiểm</span>,
    cell: ({ row }) => (
      <span className="text-right block">
        {row.totals.totalEmployeeInsurance.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} đ
      </span>
    ),
  },
  {
    id: 'taxableIncome',
    size: 110,
    meta: { displayName: 'TN chịu thuế' },
    header: () => <span className="text-right w-full block">TN chịu thuế</span>,
    cell: ({ row }) => (
      <span className="text-right block">
        {row.totals.taxableIncome.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} đ
      </span>
    ),
  },
  {
    id: 'tax',
    size: 100,
    meta: { displayName: 'Thuế TNCN' },
    header: () => <span className="text-right w-full block">Thuế TNCN</span>,
    cell: ({ row }) => (
      <span className="text-right block">
        {row.totals.personalIncomeTax.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} đ
      </span>
    ),
  },
  {
    id: 'otherDeductions',
    size: 110,
    meta: { displayName: 'Khấu trừ khác' },
    header: () => <span className="text-right w-full block">Khấu trừ khác</span>,
    cell: ({ row }) => {
      const deductions = (row.totals.penaltyDeductions || 0) + (row.totals.otherDeductions || 0);
      return (
        <span className="text-right block">
          {deductions.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} đ
        </span>
      );
    },
  },
  {
    id: 'netPay',
    size: 120,
    meta: { displayName: 'Thực lĩnh' },
    header: () => <span className="text-right w-full block">Thực lĩnh</span>,
    cell: ({ row }) => (
      <span className="text-right block">
        {row.totals.netPay.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} đ
      </span>
    ),
  },
];

// =============================================
// EMPLOYEE SELECTION COLUMNS (for step 2)
// =============================================

const formatCurrency = (value?: number) =>
  typeof value === 'number'
    ? value.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' đ'
    : '—';

function getEmployeeSelectionColumns(
  selectedIds: SystemId[],
  onToggleOne: (id: SystemId, checked: boolean) => void,
  onToggleAll: (checked: boolean) => void,
  employees: Employee[]
): ColumnDef<Employee>[] {
  const allSelected = employees.length > 0 && selectedIds.length === employees.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < employees.length;

  return [
    {
      id: 'select',
      size: 48,
      enableSorting: false,
      meta: { displayName: 'Chọn', sticky: 'left' },
      header: () => (
        <Checkbox
          checked={allSelected ? true : someSelected ? 'indeterminate' : false}
          onCheckedChange={onToggleAll}
          className="h-4 w-4"
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.systemId)}
          onCheckedChange={(checked) => onToggleOne(row.systemId, Boolean(checked))}
          className="h-4 w-4"
          aria-label={`Chọn ${row.fullName}`}
        />
      ),
    },
    {
      id: 'id',
      accessorKey: 'id',
      size: 100,
      meta: { displayName: 'Mã nhân viên' },
      header: () => <span>Mã nhân viên</span>,
      cell: ({ row }) => <span>{row.id}</span>,
    },
    {
      id: 'fullName',
      accessorKey: 'fullName',
      size: 180,
      meta: { displayName: 'Nhân viên' },
      header: () => <span>Nhân viên</span>,
      cell: ({ row }) => <span>{row.fullName}</span>,
    },
    {
      id: 'department',
      accessorKey: 'department',
      size: 120,
      meta: { displayName: 'Phòng ban' },
      header: () => <span>Phòng ban</span>,
      cell: ({ row }) => <span>{row.department ?? '—'}</span>,
    },
    {
      id: 'jobTitle',
      accessorKey: 'jobTitle',
      size: 130,
      meta: { displayName: 'Chức vụ' },
      header: () => <span>Chức vụ</span>,
      cell: ({ row }) => <span>{row.jobTitle ?? '—'}</span>,
    },
    {
      id: 'baseSalary',
      accessorKey: 'baseSalary',
      size: 130,
      meta: { displayName: 'Lương cơ bản' },
      header: () => <span className="text-right w-full block">Lương cơ bản</span>,
      cell: ({ row }) => (
        <span className="text-right block">{formatCurrency(row.baseSalary)}</span>
      ),
    },
    {
      id: 'numberOfDependents',
      accessorKey: 'numberOfDependents',
      size: 100,
      meta: { displayName: 'Người PT' },
      header: () => <span className="text-right w-full block">Người PT</span>,
      cell: ({ row }) => (
        <span className="text-right block">{row.numberOfDependents ?? 0}</span>
      ),
    },
    {
      id: 'employmentStatus',
      accessorKey: 'employmentStatus',
      size: 120,
      meta: { displayName: 'Trạng thái' },
      header: () => <span>Trạng thái</span>,
      cell: ({ row }) => <Badge variant="outline">{row.employmentStatus}</Badge>,
    },
  ];
}

export function PayrollRunPage() {
  const router = useRouter();
  const { data: employeeData, getActive } = useEmployeeStore();
  const { data: leaveRequests } = useLeaveStore();
  const lockedMonths = useAttendanceStore((state) => state.lockedMonths);
  const templates = usePayrollTemplateStore((state) => state.templates);
  const ensureDefaultTemplate = usePayrollTemplateStore((state) => state.ensureDefaultTemplate);
  const createBatchWithResults = usePayrollBatchStore((state) => state.createBatchWithResults);
  const defaultPayday = useEmployeeSettingsStore((state) => state.settings.payday);

  React.useEffect(() => {
    ensureDefaultTemplate();
  }, [ensureDefaultTemplate]);

  const latestLockedMonth = React.useMemo(() => {
    const lockedKeys = Object.keys(lockedMonths).filter((key) => lockedMonths[key]);
    return lockedKeys.sort().reverse()[0];
  }, [lockedMonths]);

  const [currentStep, setCurrentStep] = React.useState(0);
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [preview, setPreview] = React.useState<PayrollCalculationResult | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);

  // Employee selection table state
  const [empPagination, setEmpPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [empSorting, setEmpSorting] = React.useState<{ id: string; desc: boolean }>({ id: '', desc: false });

  // Preview table state
  const [previewPagination, setPreviewPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [previewSorting, setPreviewSorting] = React.useState<{ id: string; desc: boolean }>({ id: '', desc: false });
  const [previewSearchKeyword, setPreviewSearchKeyword] = React.useState('');

  const defaultMonthKey = latestLockedMonth ?? getCurrentMonthKey();
  const defaultPayrollDate = React.useMemo(
    () => buildPayrollDate(defaultMonthKey, defaultPayday),
    [defaultMonthKey, defaultPayday]
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
      // Only update if current is invalid AND default exists AND they differ
      if (hasValidSelection || !defaultTemplateSystemId || prev.templateSystemId === defaultTemplateSystemId) {
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

  const selectedMonthLabel = React.useMemo(
    () => formatMonthLabel(formState.monthKey) || formState.monthKey || 'Chưa chọn',
    [formState.monthKey]
  );

  const selectedMonthBounds = React.useMemo(() => {
    if (!formState.monthKey) return null;
    const [year, month] = formState.monthKey.split('-').map(Number);
    if (!year || !month) return null;
    return {
      start: new Date(year, month - 1, 1),
      end: new Date(year, month, 0),
    };
  }, [formState.monthKey]);

  const isSelectedMonthLocked = React.useMemo(
    () => Boolean(formState.monthKey && lockedMonths[formState.monthKey]),
    [formState.monthKey, lockedMonths]
  );

  const pendingLeavesInMonth = React.useMemo(() => {
    if (!selectedMonthBounds) return [] as typeof leaveRequests;
    return leaveRequests.filter((leave) => {
      if (leave.status !== 'Chờ duyệt') return false;
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return false;
      }
      return start <= selectedMonthBounds.end && end >= selectedMonthBounds.start;
    });
  }, [leaveRequests, selectedMonthBounds]);

  const snapshotBlockingEmployees = React.useMemo(() => {
    if (!isSelectedMonthLocked || !formState.monthKey || !formState.selectedEmployeeSystemIds.length) {
      return [] as string[];
    }
    const blocked = new Set<string>();
    formState.selectedEmployeeSystemIds.forEach((employeeSystemId) => {
      const snapshot = attendanceSnapshotService.getSnapshot({
        monthKey: formState.monthKey,
        employeeSystemId,
      });
      if (!snapshot?.locked) {
        const employee = employeeLookup[employeeSystemId];
        blocked.add(employee?.fullName ?? employee?.id ?? employeeSystemId);
      }
    });
    return Array.from(blocked);
  }, [employeeLookup, formState.monthKey, formState.selectedEmployeeSystemIds, isSelectedMonthLocked]);

  const payrollBlockingReasons = React.useMemo(() => {
    const reasons: string[] = [];
    if (!isSelectedMonthLocked) {
      reasons.push(`Tháng ${selectedMonthLabel} chưa được khóa trong Chấm công.`);
    }
    if (pendingLeavesInMonth.length > 0) {
      reasons.push(`${pendingLeavesInMonth.length} đơn nghỉ đang chờ duyệt trong tháng này.`);
    }
    if (snapshotBlockingEmployees.length > 0) {
      const names = snapshotBlockingEmployees.slice(0, 4).join(', ');
      const remaining = snapshotBlockingEmployees.length > 4
        ? ` và ${snapshotBlockingEmployees.length - 4} người khác`
        : '';
      reasons.push(`Chưa có snapshot chấm công đã khóa cho: ${names}${remaining}.`);
    }
    return reasons;
  }, [formState.monthKey, isSelectedMonthLocked, pendingLeavesInMonth.length, snapshotBlockingEmployees]);

  const canProceedStep1 = Boolean(formState.monthKey && formState.payrollDate && formState.templateSystemId);
  const canProceedStep2 = formState.selectedEmployeeSystemIds.length > 0;

  const goNext = () => {
    if (currentStep === 0 && !canProceedStep1) return;
    if (currentStep === 1 && !canProceedStep2) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };
  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  // Get salary components for PayrollComponent conversion
  const salaryComponents = useEmployeeSettingsStore((state) => state.getSalaryComponents());
  
  // Convert SalaryComponent to PayrollComponent format
  const payrollComponents = React.useMemo(() => {
    // Get template's component IDs if template selected
    const template = formState.templateSystemId 
      ? templates.find(t => t.systemId === formState.templateSystemId)
      : undefined;
    const templateComponentIds = template?.componentSystemIds ?? [];
    
    // Filter by template if exists, otherwise use all
    // Also filter by isActive
    const filteredComponents = (templateComponentIds.length > 0
      ? salaryComponents.filter(c => templateComponentIds.includes(c.systemId))
      : salaryComponents
    ).filter(c => c.isActive !== false); // Only include active components
    
    return filteredComponents.map((c, idx) => ({
      systemId: c.systemId,
      id: c.id,
      name: c.name,
      code: c.id,
      category: c.category ?? 'earning', // Use category from SalaryComponent
      calculationType: c.type,
      amount: c.amount,
      formula: c.formula,
      taxable: c.taxable,
      partOfSocialInsurance: c.partOfSocialInsurance,
      applicableDepartmentSystemIds: c.applicableDepartmentSystemIds,
      isDefault: true,
      sortOrder: c.sortOrder ?? idx,
      createdAt: c.createdAt ?? new Date().toISOString(),
      updatedAt: c.updatedAt ?? new Date().toISOString(),
    }));
  }, [salaryComponents, formState.templateSystemId, templates]);

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
    
    // Build employee inputs for the new engine
    const employeeInputs = formState.selectedEmployeeSystemIds.map((systemId) => {
      const emp = employeeData.find(e => e.systemId === systemId);
      return {
        employeeSystemId: systemId,
        employeeId: emp?.id ?? ('' as typeof emp extends { id: infer T } ? T : never),
        employeeName: emp?.fullName ?? 'Unknown',
        departmentSystemId: emp?.departmentId,
        baseSalary: emp?.baseSalary ?? 0,
      };
    }).filter(e => e.employeeId);
    
    setIsPreviewLoading(true);
    const result = payrollEngine.calculate({
      periodMonthKey: formState.monthKey,
      employees: employeeInputs,
      components: payrollComponents,
      penaltyMode: 'all-unpaid', // Auto-deduct all unpaid penalties
    });
    setPreview(result);
    setIsPreviewLoading(false);
  }, [currentStep, formState.selectedEmployeeSystemIds, formState.monthKey, payrollComponents, employeeData]);

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

  // Employee selection columns with handlers
  const employeeSelectionColumns = React.useMemo(
    () => getEmployeeSelectionColumns(
      formState.selectedEmployeeSystemIds,
      handleSelectEmployee,
      handleSelectAll,
      filteredEmployees
    ),
    [formState.selectedEmployeeSystemIds, filteredEmployees]
  );

  // Paginated employee data
  const empPageCount = Math.ceil(filteredEmployees.length / empPagination.pageSize);
  const paginatedEmployees = React.useMemo(() => {
    const start = empPagination.pageIndex * empPagination.pageSize;
    const end = start + empPagination.pageSize;
    return filteredEmployees.slice(start, end);
  }, [filteredEmployees, empPagination.pageIndex, empPagination.pageSize]);

  // Row selection state for ResponsiveDataTable
  const empRowSelection = React.useMemo(() => {
    const selection: Record<string, boolean> = {};
    formState.selectedEmployeeSystemIds.forEach((id) => {
      selection[id] = true;
    });
    return selection;
  }, [formState.selectedEmployeeSystemIds]);

  const setEmpRowSelection = React.useCallback(
    (updater: Record<string, boolean> | ((old: Record<string, boolean>) => Record<string, boolean>)) => {
      const newSelection = typeof updater === 'function' ? updater(empRowSelection) : updater;
      const newSelectedIds = Object.keys(newSelection).filter((key) => newSelection[key]) as SystemId[];
      setFormState((prev) => ({ ...prev, selectedEmployeeSystemIds: newSelectedIds }));
    },
    [empRowSelection]
  );

  const handleCreateBatch = () => {
    if (!preview || !preview.payslips.length) {
      toast('Chưa có dữ liệu preview', {
        description: 'Vui lòng chọn nhân viên và chạy lại bước xem trước.',
      });
      return;
    }

    if (payrollBlockingReasons.length) {
      toast.error('Không thể tạo bảng lương', {
        description: payrollBlockingReasons[0],
      });
      if (!isSelectedMonthLocked || snapshotBlockingEmployees.length) {
        router.push(ROUTES.HRM.ATTENDANCE);
      } else if (pendingLeavesInMonth.length) {
        router.push(ROUTES.HRM.LEAVES);
      }
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
      preview.payslips.map<GeneratedPayslipPayload>((payslip) => ({
        employeeSystemId: payslip.employeeSystemId,
        employeeId: payslip.employeeId,
        departmentSystemId: payslip.departmentSystemId,
        periodMonthKey: formState.monthKey,
        components: payslip.components,
        totals: payslip.totals,
        attendanceSnapshotSystemId: undefined,
        deductedPenaltySystemIds: payslip.deductedPenaltySystemIds,
      }))
    );

    // Update penalties status to "Đã thanh toán" and link to this batch
    const penaltyStore = usePenaltyStore.getState();
    const now = new Date().toISOString();
    
    // Use penaltiesDeducted from engine result
    const penaltiesDeducted = preview.penaltiesDeducted ?? [];
    penaltiesDeducted.forEach((info) => {
      const penalty = penaltyStore.data.find(p => p.systemId === info.penaltySystemId);
      if (penalty) {
        penaltyStore.update(penalty.systemId, {
          ...penalty,
          status: 'Đã thanh toán',
          deductedInPayrollId: batch.systemId,
          deductedAt: now,
          updatedAt: now,
        });
      }
    });

    const penaltyMessage = penaltiesDeducted.length > 0 
      ? ` Đã trừ ${penaltiesDeducted.length} phiếu phạt vào lương.`
      : '';
    
    toast.success('Đã tạo bảng lương', { 
      description: `Bạn có thể xem chi tiết để duyệt hoặc khóa batch.${penaltyMessage}` 
    });
    router.push(ROUTES.PAYROLL.DETAIL.replace(':systemId', batch.systemId));
  };

  const headerActions = React.useMemo(
    () => [
      <Button
        key="templates"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => router.push(ROUTES.PAYROLL.TEMPLATES)}
      >
        Quản lý mẫu
      </Button>,
      <Button
        key="cancel"
        variant="ghost"
        size="sm"
        className="h-9"
        onClick={() => router.push(ROUTES.PAYROLL.LIST)}
      >
        Thoát
      </Button>,
    ],
    [router]
  );

  usePageHeader({
    title: 'Chạy bảng lương',
    subtitle: 'Wizard 3 bước để chọn kỳ, nhân sự và tạo batch lương mới',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD, isCurrent: false },
      { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST, isCurrent: false },
      { label: 'Chạy mới', href: ROUTES.PAYROLL.RUN, isCurrent: true },
    ],
    showBackButton: true,
    backPath: ROUTES.PAYROLL.LIST,
    actions: headerActions,
  });

  const previewWarnings = React.useMemo(() => {
    if (!preview?.payslips.length) return [] as string[];
    return preview.warnings.map((w) => 
      w.employeeName ? `${w.employeeName} · ${w.message}` : w.message
    );
  }, [preview]);

  const canCreateBatch = Boolean(preview?.payslips.length && payrollBlockingReasons.length === 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 font-semibold">Tiến trình</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <PayrollStepper currentStep={currentStep} />
        </CardContent>
      </Card>

      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-h4">Cấu hình kỳ lương</CardTitle>
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
                <MonthPicker
                  id="payroll-month"
                  value={formState.monthKey}
                  onChange={(monthKey) =>
                    setFormState((prev) => {
                      const currentDay = Number(prev.payrollDate.split('-')[2]) || defaultPayday;
                      return {
                        ...prev,
                        monthKey: monthKey,
                        payrollDate: buildPayrollDate(monthKey, currentDay),
                      };
                    })
                  }
                  minYear={2024}
                  maxYear={2030}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payroll-date">Ngày chi trả</Label>
                <DatePicker
                  id="payroll-date"
                  value={formState.payrollDate ? new Date(formState.payrollDate + 'T00:00:00') : null}
                  onChange={(date) => setFormState((prev) => ({ 
                    ...prev, 
                    payrollDate: date 
                      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                      : prev.payrollDate 
                  }))}
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

            {!isSelectedMonthLocked && (
              <Alert variant="destructive">
                <AlertTitle>Tháng {selectedMonthLabel} chưa được khóa</AlertTitle>
                <AlertDescription>
                  Khóa chấm công trước khi chạy lương để cố định dữ liệu attendance và tránh chỉnh sửa sau khi trả lương.
                </AlertDescription>
                <div className="mt-3">
                  <Button size="sm" className="h-8" onClick={() => router.push(ROUTES.HRM.ATTENDANCE)}>
                    Mở trang Chấm công
                  </Button>
                </div>
              </Alert>
            )}

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
            <CardTitle className="text-h4">Chọn nhân viên ({formState.selectedEmployeeSystemIds.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <Input
                placeholder="Tìm theo tên hoặc mã"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                className="h-9 md:w-64"
              />
            </div>

            <ResponsiveDataTable<Employee>
              data={paginatedEmployees}
              columns={employeeSelectionColumns}
              isLoading={false}
              emptyTitle="Không có nhân viên"
              emptyDescription="Không tìm thấy nhân viên phù hợp."
              rowSelection={empRowSelection}
              setRowSelection={setEmpRowSelection}
              pageCount={empPageCount}
              pagination={empPagination}
              setPagination={setEmpPagination}
              rowCount={filteredEmployees.length}
              sorting={empSorting}
              setSorting={setEmpSorting}
            />
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-h4">Xem trước kết quả</CardTitle>
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
                      value: preview.payslips.length,
                      description: 'Đang chạy bảng lương',
                      icon: Users,
                    },
                    {
                      id: 'gross',
                      title: 'Tổng thu nhập',
                      value: preview.summary.totalGross.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }),
                      icon: Wallet,
                    },
                    {
                      id: 'net',
                      title: 'Tổng thực lĩnh',
                      value: preview.summary.totalNet.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }),
                      icon: CalendarIcon,
                    },
                    {
                      id: 'month',
                      title: 'Tháng tham chiếu',
                      value: selectedMonthLabel,
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

                {(() => {
                  const allPreviewData = preview.payslips.map((payslip) => ({
                    systemId: payslip.employeeSystemId,
                    employeeId: payslip.employeeId,
                    employeeName: payslip.employeeName,
                    departmentName: employeeLookup[payslip.employeeSystemId]?.department,
                    positionName: employeeLookup[payslip.employeeSystemId]?.jobTitle,
                    totals: payslip.totals,
                  }));
                  
                  // Filter by search keyword
                  const filteredPreviewData = previewSearchKeyword.trim()
                    ? allPreviewData.filter((row) => {
                        const query = previewSearchKeyword.toLowerCase().trim();
                        return (
                          row.employeeId?.toLowerCase().includes(query) ||
                          row.employeeName?.toLowerCase().includes(query) ||
                          row.departmentName?.toLowerCase().includes(query) ||
                          row.positionName?.toLowerCase().includes(query)
                        );
                      })
                    : allPreviewData;
                    
                  const previewPageCount = Math.ceil(filteredPreviewData.length / previewPagination.pageSize);
                  const paginatedPreview = filteredPreviewData.slice(
                    previewPagination.pageIndex * previewPagination.pageSize,
                    (previewPagination.pageIndex + 1) * previewPagination.pageSize
                  );

                  return (
                    <>
                      <Input
                        placeholder="Tìm theo mã, tên, phòng ban..."
                        value={previewSearchKeyword}
                        onChange={(e) => {
                          setPreviewSearchKeyword(e.target.value);
                          setPreviewPagination((prev) => ({ ...prev, pageIndex: 0 }));
                        }}
                        className="h-9 md:w-64"
                      />
                      <ResponsiveDataTable<PreviewTableRow>
                        data={paginatedPreview}
                        columns={previewTableColumns}
                        isLoading={false}
                        emptyTitle="Không có dữ liệu"
                        emptyDescription="Không có dữ liệu để hiển thị."
                        pageCount={previewPageCount}
                        pagination={previewPagination}
                        setPagination={setPreviewPagination}
                        rowCount={filteredPreviewData.length}
                        sorting={previewSorting}
                        setSorting={setPreviewSorting}
                      />
                    </>
                  );
                })()}

                {payrollBlockingReasons.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTitle>Không thể tạo bảng lương</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc space-y-1 pl-4">
                        {payrollBlockingReasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {!isSelectedMonthLocked && (
                          <Button size="sm" className="h-8" onClick={() => router.push(ROUTES.HRM.ATTENDANCE)}>
                            Khóa chấm công
                          </Button>
                        )}
                        {pendingLeavesInMonth.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => router.push(ROUTES.HRM.LEAVES)}
                          >
                            Xem đơn nghỉ chờ duyệt
                          </Button>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
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
          <Button className="h-9" disabled={!canCreateBatch} onClick={handleCreateBatch}>
            Tạo bảng lương
          </Button>
        )}
      </div>
    </div>
  );
}
