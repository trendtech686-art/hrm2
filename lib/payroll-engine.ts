import { attendanceSnapshotService, type AttendanceSnapshot } from './attendance-snapshot-service.ts';
import type { PayrollComponentEntry, PayrollTotals } from './payroll-types.ts';
import { useEmployeeStore } from '../features/employees/store.ts';
import { useEmployeeCompStore } from '../features/employees/employee-comp-store.ts';
import { useEmployeeSettingsStore } from '../features/settings/employees/employee-settings-store.ts';
import { usePayrollTemplateStore } from '../features/payroll/payroll-template-store.ts';
import type { Employee } from '../features/employees/types.ts';
import type { SalaryComponent } from '../features/settings/employees/types.ts';
import { asBusinessId, asSystemId } from './id-types.ts';
import type { SystemId, BusinessId } from './id-types.ts';

export type PayrollEngineEmployeeInput = {
  employeeSystemId: SystemId;
  monthKey: string;
  templateSystemId?: SystemId;
};

export type PayrollEngineResult = {
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  employeeName: string;
  components: PayrollComponentEntry[];
  totals: PayrollTotals;
  attendanceSnapshot: AttendanceSnapshot | null;
  warnings: string[];
};

export type PayrollBatchComputation = {
  results: PayrollEngineResult[];
  totalGross: number;
  totalNet: number;
};

const DEFAULT_WORKING_DAYS = 26;
const SOCIAL_RATES = {
  socialInsurance: 0.08,
  healthInsurance: 0.015,
  unemploymentInsurance: 0.01,
};

type FormulaVariables = Record<string, number>;

const buildVariableMap = (
  employee: Employee,
  attendance: AttendanceSnapshot | null
): FormulaVariables => ({
  LUONG_CO_BAN: employee.baseSalary ?? 0,
  LUONG_DONG_BHXH: employee.socialInsuranceSalary ?? employee.baseSalary ?? 0,
  CONG_CHUAN: DEFAULT_WORKING_DAYS,
  CONG_THUC_TE: attendance?.totals.workDays ?? 0,
  OT_GIO: attendance?.totals.otHours ?? 0,
  NGAY_NGHI_PHEP: attendance?.totals.leaveDays ?? 0,
  NGAY_VANG: attendance?.totals.absentDays ?? 0,
});

const evaluateFormula = (formula: string | undefined, variables: FormulaVariables): number => {
  if (!formula?.trim()) {
    return 0;
  }

  const tokenPattern = /\[([A-Z0-9_]+)\]/g;
  const replacedExpression = formula.replace(tokenPattern, (_, token: string) => {
    const upperToken = token.toUpperCase();
    const value = variables[upperToken];
    return typeof value === 'number' ? String(value) : '0';
  });

  if (!/^[0-9+\-*/().\s]*$/.test(replacedExpression)) {
    return 0;
  }

  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${replacedExpression})`)();
    return Number.isFinite(result) ? Number(result) : 0;
  } catch (error) {
    console.error('[payroll-engine] Lỗi khi tính công thức', error);
    return 0;
  }
};

const buildComponentEntries = (
  componentSystemIds: SystemId[],
  salaryComponentMap: Record<SystemId, SalaryComponent>,
  variables: FormulaVariables
): { entries: PayrollComponentEntry[]; warnings: string[] } => {
  const warnings: string[] = [];

  const entries = componentSystemIds
    .map((systemId) => salaryComponentMap[systemId])
    .filter((component): component is SalaryComponent => Boolean(component))
    .map((component) => {
      const amount = component.type === 'fixed'
        ? component.amount ?? 0
        : evaluateFormula(component.formula, variables);

      if (component.type === 'formula' && !component.formula?.trim()) {
        warnings.push(`Thành phần "${component.name}" chưa có công thức hợp lệ.`);
      }

      return {
        componentSystemId: asSystemId(component.systemId),
        componentId: asBusinessId(component.id),
        label: component.name,
        category: 'earning',
        calculationType: component.type,
        amount,
        formula: component.formula,
      } satisfies PayrollComponentEntry;
    });

  return { entries, warnings };
};

const buildTotals = (
  entries: PayrollComponentEntry[],
  salaryComponentMap: Record<SystemId, SalaryComponent>,
  employee: Employee
): PayrollTotals => {
  const earnings = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const taxableIncome = entries.reduce((sum, entry) => {
    const component = salaryComponentMap[entry.componentSystemId];
    if (component?.taxable) {
      return sum + entry.amount;
    }
    return sum;
  }, 0);

  const socialBase = entries.reduce((sum, entry) => {
    const component = salaryComponentMap[entry.componentSystemId];
    if (component?.partOfSocialInsurance) {
      return sum + entry.amount;
    }
    return sum;
  }, employee.socialInsuranceSalary ?? employee.baseSalary ?? 0);

  const contributions = Math.round(
    socialBase * (
      SOCIAL_RATES.socialInsurance + SOCIAL_RATES.healthInsurance + SOCIAL_RATES.unemploymentInsurance
    )
  );

  const deductions = 0; // Sẽ bổ sung ở Phase 3 khi có dữ liệu khấu trừ cụ thể
  const netPay = earnings - deductions - contributions;

  return {
    earnings,
    deductions,
    contributions,
    taxableIncome,
    socialInsuranceBase: socialBase,
    netPay,
  } satisfies PayrollTotals;
};

const mapSalaryComponents = () => {
  const components = useEmployeeSettingsStore.getState().getSalaryComponents();
  return components.reduce<Record<SystemId, SalaryComponent>>((acc, component) => {
    acc[asSystemId(component.systemId)] = component;
    return acc;
  }, {} as Record<SystemId, SalaryComponent>);
};

export const payrollEngine = {
  runForEmployee(input: PayrollEngineEmployeeInput): PayrollEngineResult | null {
    const employeeStore = useEmployeeStore.getState();
    const employee = employeeStore.findById(input.employeeSystemId);
    if (!employee) {
      console.warn('[payroll-engine] Không tìm thấy nhân viên', input.employeeSystemId);
      return null;
    }

    const payrollProfile = useEmployeeCompStore.getState().getPayrollProfile(employee.systemId);
    const templateStore = usePayrollTemplateStore.getState();
    const template = input.templateSystemId
      ? templateStore.getTemplateBySystemId(input.templateSystemId)
      : templateStore.getDefaultTemplate();
    const fallbackComponentIds = payrollProfile.salaryComponentSystemIds.map((id) => asSystemId(id));
    const componentSystemIds = template?.componentSystemIds?.length
      ? template.componentSystemIds
      : fallbackComponentIds;

    const salaryComponentMap = mapSalaryComponents();
    const attendanceSnapshot = attendanceSnapshotService.getSnapshot({
      monthKey: input.monthKey,
      employeeSystemId: employee.systemId,
    });

    const variables = buildVariableMap(employee, attendanceSnapshot);
    const { entries, warnings } = buildComponentEntries(componentSystemIds, salaryComponentMap, variables);
    if (!attendanceSnapshot) {
      warnings.push('Chưa có snapshot chấm công đã khóa cho nhân viên này.');
    }

    const totals = buildTotals(entries, salaryComponentMap, employee);

    return {
      employeeSystemId: employee.systemId,
      employeeId: employee.id,
      employeeName: employee.fullName,
      components: entries,
      totals,
      attendanceSnapshot,
      warnings,
    } satisfies PayrollEngineResult;
  },
  runBatch(inputs: PayrollEngineEmployeeInput[]): PayrollBatchComputation {
    const results = inputs
      .map((input) => payrollEngine.runForEmployee(input))
      .filter((result): result is PayrollEngineResult => Boolean(result));

    const totalGross = results.reduce((sum, result) => sum + result.totals.earnings, 0);
    const totalNet = results.reduce((sum, result) => sum + result.totals.netPay, 0);

    return {
      results,
      totalGross,
      totalNet,
    };
  },
};
