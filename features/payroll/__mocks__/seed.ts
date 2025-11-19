import { useEmployeeStore } from '../../employees/store.ts';
import { useAttendanceStore } from '../../attendance/store.ts';
import { usePayrollTemplateStore } from '../payroll-template-store.ts';
import { usePayrollBatchStore, type GeneratedPayslipPayload } from '../payroll-batch-store.ts';
import { useEmployeeCompStore } from '../../employees/employee-comp-store.ts';
import { useEmployeeSettingsStore } from '../../settings/employees/employee-settings-store.ts';
import { payrollEngine } from '../../../lib/payroll-engine.ts';
import type { AttendanceDataRow } from '../../attendance/types.ts';
import type { Employee } from '../../employees/types.ts';
import type { SystemId } from '../../../lib/id-types.ts';

/**
 * Seed helper dùng để tạo nhanh dữ liệu demo cho module payroll nhằm phục vụ QA Phase 3.
 */

export type PayrollSeedOptions = {
  monthKey?: string;
  employeeSystemIds?: SystemId[];
  resetExisting?: boolean;
  markAsReviewed?: boolean;
  lockBatch?: boolean;
};

export type PayrollSeedSummary = {
  monthKey: string;
  employeesSeeded: number;
  batchSystemId: SystemId;
  payslipCount: number;
  lockedMonth: boolean;
  templateSystemId: SystemId;
  status: 'draft' | 'reviewed' | 'locked';
};

const ALLOWED_DEPARTMENTS: AttendanceDataRow['department'][] = ['Kỹ thuật', 'Nhân sự', 'Kinh doanh', 'Marketing'];

const toDepartment = (value?: string): AttendanceDataRow['department'] =>
  ALLOWED_DEPARTMENTS.includes(value as AttendanceDataRow['department'])
    ? (value as AttendanceDataRow['department'])
    : 'Kinh doanh';

const pad = (value: number) => String(Math.max(1, Math.min(31, value))).padStart(2, '0');

const getPreviousMonthKey = () => {
  const now = new Date();
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, '0')}`;
};

const buildPayPeriod = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) {
    throw new Error(`monthKey không hợp lệ: ${monthKey}`);
  }
  const lastDay = new Date(year, month, 0).getDate();
  return {
    monthKey,
    startDate: `${monthKey}-01`,
    endDate: `${monthKey}-${String(lastDay).padStart(2, '0')}`,
  } as const;
};

const buildPayrollDate = (monthKey: string, targetDay: number) => {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) {
    throw new Error(`monthKey không hợp lệ: ${monthKey}`);
  }
  const lastDay = new Date(year, month, 0).getDate();
  const day = pad(Math.min(targetDay, lastDay));
  return `${monthKey}-${day}`;
};

const resetStores = (monthKey: string) => {
  usePayrollBatchStore.setState((state) => ({
    ...state,
    batches: [],
    payslips: [],
    auditLogs: [],
    counters: {
      payroll: { systemId: 0, businessId: 0 },
      payslips: { systemId: 0, businessId: 0 },
      'payroll-audit-log': { systemId: 0, businessId: 0 },
    },
  }));

  const attendanceStore = useAttendanceStore.getState();
  attendanceStore.saveAttendanceData(monthKey, []);
  attendanceStore.unlockMonth(monthKey);
};

const buildAttendanceRows = (employees: Employee[], monthKey: string): AttendanceDataRow[] =>
  employees.map((employee, index) => {
    const workDays = 21 + ((index + 1) % 3);
    const leaveDays = index % 3 === 0 ? 1 : 0;
    const absentDays = index % 4 === 0 ? 1 : 0;
    const otHours = 4 + index * 2;
    const lateArrivals = index % 2;
    const earlyDepartures = index % 3 === 1 ? 1 : 0;

    return {
      systemId: employee.systemId,
      employeeSystemId: employee.systemId,
      employeeId: employee.id,
      fullName: employee.fullName,
      department: toDepartment(employee.department),
      workDays,
      leaveDays,
      absentDays,
      lateArrivals,
      earlyDepartures,
      otHours,
    } satisfies AttendanceDataRow;
  });

const ensurePayrollProfiles = (employeeSystemIds: SystemId[]) => {
  const componentIds = useEmployeeSettingsStore
    .getState()
    .getSalaryComponents()
    .map((component) => component.systemId);

  if (!componentIds.length) {
    return;
  }
  const compStore = useEmployeeCompStore.getState();

  employeeSystemIds.forEach((systemId, index) => {
    const hasProfile = Boolean(compStore.profiles?.[systemId]);
    if (hasProfile) return;

    const slicePoint = index % componentIds.length;
    const customizedComponentIds = slicePoint ? componentIds.slice(0, slicePoint + 1) : componentIds;

    compStore.assignComponents(systemId as any, {
      salaryComponentSystemIds: customizedComponentIds,
      paymentMethod: index % 2 === 0 ? 'bank_transfer' : 'cash',
      payrollBankAccount:
        index % 2 === 0
          ? {
              accountNumber: `9704${String(123400 + index).padStart(4, '0')}`,
              bankName: 'ACB',
              bankBranch: 'Chi nhánh Sài Gòn',
              accountHolder: 'Công ty TNHH HRM2',
            }
          : undefined,
    });
  });
};

export const seedPayrollDemoData = (options: PayrollSeedOptions = {}): PayrollSeedSummary => {
  const monthKey = options.monthKey ?? getPreviousMonthKey();
  if (options.resetExisting) {
    resetStores(monthKey);
  }

  const employeeStore = useEmployeeStore.getState();
  const attendanceStore = useAttendanceStore.getState();
  const templateStore = usePayrollTemplateStore.getState();
  const batchStore = usePayrollBatchStore.getState();
  const settingsStore = useEmployeeSettingsStore.getState();

  const employees = employeeStore.getActive();
  if (!employees.length) {
    throw new Error('Không có nhân viên nào để seed payroll.');
  }

  const selectedEmployees = options.employeeSystemIds?.length
    ? employees.filter((employee) => options.employeeSystemIds?.includes(employee.systemId))
    : employees.slice(0, Math.min(5, employees.length));

  if (!selectedEmployees.length) {
    throw new Error('Danh sách nhân viên seed trống.');
  }

  ensurePayrollProfiles(selectedEmployees.map((employee) => employee.systemId));

  const attendanceRows = buildAttendanceRows(selectedEmployees, monthKey);
  attendanceStore.saveAttendanceData(monthKey, attendanceRows);
  attendanceStore.lockMonth(monthKey);

  const template = templateStore.ensureDefaultTemplate();
  const payrollWindow = settingsStore.getDefaultPayrollWindow();
  const payPeriod = buildPayPeriod(monthKey);
  const payrollDate = buildPayrollDate(monthKey, payrollWindow.payday);

  const computation = payrollEngine.runBatch(
    selectedEmployees.map((employee) => ({
      employeeSystemId: employee.systemId,
      monthKey,
      templateSystemId: template.systemId,
    }))
  );

  if (!computation.results.length) {
    throw new Error('Payroll engine không tạo được kết quả nào.');
  }

  const batch = batchStore.createBatchWithResults(
    {
      title: `Bảng lương demo ${monthKey}`,
      templateSystemId: template.systemId,
      payPeriod,
      payrollDate,
      referenceAttendanceMonthKeys: [monthKey],
      notes: 'Seed payroll demo phục vụ Phase 3',
    },
    computation.results.map<GeneratedPayslipPayload>((result) => ({
      employeeSystemId: result.employeeSystemId,
      employeeId: result.employeeId,
      departmentSystemId: undefined,
      periodMonthKey: monthKey,
      components: result.components,
      totals: result.totals,
      attendanceSnapshotSystemId: undefined,
    }))
  );

  if (!batch) {
    throw new Error('Không thể tạo batch demo.');
  }

  const shouldReview = options.markAsReviewed ?? true;
  const shouldLock = options.lockBatch ?? false;
  let status: PayrollSeedSummary['status'] = 'draft';

  if (shouldReview) {
    batchStore.updateBatchStatus(batch.systemId, 'reviewed');
    status = 'reviewed';
  }

  if (shouldLock) {
    batchStore.updateBatchStatus(batch.systemId, 'locked');
    status = 'locked';
  }

  return {
    monthKey,
    employeesSeeded: selectedEmployees.length,
    batchSystemId: batch.systemId,
    payslipCount: computation.results.length,
    lockedMonth: Boolean(attendanceStore.lockedMonths[monthKey]),
    templateSystemId: template.systemId,
    status,
  };
};

export default seedPayrollDemoData;
