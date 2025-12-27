/**
 * Payroll Engine V3
 *
 * Pure calculation engine - NO ID generation.
 * ID generation is delegated to stores (payroll-batch-store.ts)
 * following ID-GOVERNANCE.md guidelines.
 *
 * Features:
 * - Vietnamese labor law compliant (BHXH, BHYT, BHTN, PIT)
 * - Configurable rates from settings (no hardcoded values)
 * - Better penalty integration (selective penalty deduction)
 * - Complaint tracking via linkedComplaintSystemId
 * - Stricter validation (locked attendance required)
 * - Preview mode for dry-run calculations
 */

import { attendanceSnapshotService, type AttendanceSnapshot } from './attendance-snapshot-service';
import type {
  PayrollComponent,
  PayrollComponentEntry,
  PayrollTotals,
} from './payroll-types';
import type { Penalty } from '@/lib/types/prisma-extended';
import type { SystemId, BusinessId } from './id-types';
import { usePenaltyStore } from '../features/settings/penalties/store';
import { useEmployeeSettingsStore } from '../features/settings/employees/employee-settings-store';
import type { InsuranceRates, TaxSettings, TaxBracket } from '@/lib/types/prisma-extended';

// =============================================
// TYPES - Input/Output for Engine
// =============================================

export type EmployeePayrollInput = {
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  employeeName: string;
  departmentSystemId?: SystemId;
  baseSalary: number;
  numberOfDependents?: number;  // Số người phụ thuộc (để tính giảm trừ gia cảnh)
  customComponentOverrides?: Partial<Record<SystemId, number>>;
};

export type PenaltySelectionMode = 'all-unpaid' | 'selected' | 'none';

export type PayrollRunOptions = {
  periodMonthKey: string;
  employees: EmployeePayrollInput[];
  components: PayrollComponent[];
  
  // Penalty integration
  penaltyMode: PenaltySelectionMode;
  selectedPenaltySystemIds?: SystemId[]; // When mode = 'selected'
  
  // Validation options
  requireLockedAttendance?: boolean; // Default: true
  skipAttendanceValidation?: boolean; // For manual overrides
};

/** Calculated payslip data - NO systemId/id, store will assign */
export type CalculatedPayslip = {
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  employeeName: string;
  departmentSystemId?: SystemId;
  periodMonthKey: string;
  components: PayrollComponentEntry[];
  totals: PayrollTotals;
  deductedPenaltySystemIds: SystemId[];
  attendanceSnapshot: AttendanceSnapshot | null;
};

export type PayrollCalculationResult = {
  success: boolean;
  payslips: CalculatedPayslip[];
  summary: {
    totalGross: number;
    totalNet: number;
    totalPenaltyDeductions: number;
    employeeCount: number;
  };
  warnings: PayrollWarning[];
  errors: PayrollError[];
  penaltiesDeducted: DeductedPenaltyInfo[];
};

export type PayrollWarning = {
  type: 'attendance-unlocked' | 'attendance-missing' | 'penalty-partial' | 'component-missing' | 'formula-error';
  employeeSystemId?: SystemId;
  employeeName?: string;
  message: string;
};

export type PayrollError = {
  type: 'validation' | 'calculation' | 'data-missing';
  employeeSystemId?: SystemId;
  employeeName?: string;
  message: string;
  fatal: boolean;
};

export type DeductedPenaltyInfo = {
  penaltySystemId: SystemId;
  penaltyId: BusinessId;
  employeeSystemId: SystemId;
  employeeName: string;
  amount: number;
  reason: string;
  linkedComplaintSystemId?: SystemId;
};

// =============================================
// FORMULA EVALUATOR
// =============================================

type FormulaContext = {
  baseSalary: number;
  workDays: number;
  leaveDays: number;
  absentDays: number;
  lateArrivals: number;
  earlyDepartures: number;
  otHours: number;
  // Chi tiết OT theo loại
  otHoursWeekday: number;
  otHoursWeekend: number;
  otHoursHoliday: number;
  // Tiền OT (đã tính với hệ số)
  otPayWeekday: number;
  otPayWeekend: number;
  otPayHoliday: number;
  otPayTotal: number;
  standardWorkDays: number;
  // OT rate settings
  otHourlyRate: number;
  otRateWeekend: number;
  otRateHoliday: number;
  // Phụ cấp ăn trưa theo ngày
  mealAllowancePerDay: number;
};

const evaluateFormula = (formula: string, context: FormulaContext): number => {
  try {
    const safeContext = {
      baseSalary: context.baseSalary,
      workDays: context.workDays,
      leaveDays: context.leaveDays,
      absentDays: context.absentDays,
      lateArrivals: context.lateArrivals,
      earlyDepartures: context.earlyDepartures,
      otHours: context.otHours,
      // Chi tiết OT
      otHoursWeekday: context.otHoursWeekday,
      otHoursWeekend: context.otHoursWeekend,
      otHoursHoliday: context.otHoursHoliday,
      otPayWeekday: context.otPayWeekday,
      otPayWeekend: context.otPayWeekend,
      otPayHoliday: context.otPayHoliday,
      otPayTotal: context.otPayTotal,
      standardWorkDays: context.standardWorkDays,
      otHourlyRate: context.otHourlyRate,
      otRateWeekend: context.otRateWeekend,
      otRateHoliday: context.otRateHoliday,
      mealAllowancePerDay: context.mealAllowancePerDay,
      round: Math.round,
      floor: Math.floor,
      ceil: Math.ceil,
      min: Math.min,
      max: Math.max,
    };

    const contextKeys = Object.keys(safeContext);
    const contextValues = Object.values(safeContext);

    // eslint-disable-next-line no-new-func
    const fn = new Function(...contextKeys, `return ${formula};`);
    const result = fn(...contextValues);

    return typeof result === 'number' && !isNaN(result) ? result : 0;
  } catch {
    console.warn(`[PayrollEngine] Formula evaluation failed: ${formula}`);
    return 0;
  }
};

// =============================================
// OT PAY CALCULATOR
// =============================================

type OTPayResult = {
  otPayWeekday: number;
  otPayWeekend: number;
  otPayHoliday: number;
  otPayTotal: number;
};

const calculateOTPay = (
  otHoursWeekday: number,
  otHoursWeekend: number,
  otHoursHoliday: number
): OTPayResult => {
  const settings = useEmployeeSettingsStore.getState().settings;
  const hourlyRate = settings.otHourlyRate || 0;
  
  // Ngày thường: tiền/giờ * số giờ
  const otPayWeekday = Math.round(otHoursWeekday * hourlyRate);
  
  // Cuối tuần: tiền/giờ * hệ số cuối tuần * số giờ
  const otPayWeekend = Math.round(otHoursWeekend * hourlyRate * (settings.otRateWeekend || 1.5));
  
  // Ngày lễ: tiền/giờ * hệ số ngày lễ * số giờ  
  const otPayHoliday = Math.round(otHoursHoliday * hourlyRate * (settings.otRateHoliday || 3));
  
  return {
    otPayWeekday,
    otPayWeekend,
    otPayHoliday,
    otPayTotal: otPayWeekday + otPayWeekend + otPayHoliday,
  };
};

// =============================================
// COMPONENT CALCULATOR
// =============================================

const getStandardWorkDays = () => useEmployeeSettingsStore.getState().settings.standardWorkDays;

const calculateComponent = (
  component: PayrollComponent,
  employee: EmployeePayrollInput,
  attendance: AttendanceSnapshot | null,
  overrideAmount?: number
): PayrollComponentEntry => {
  // Use override if provided
  if (overrideAmount !== undefined) {
    return {
      componentSystemId: component.systemId,
      componentId: component.id,
      label: component.name,
      category: component.category,
      calculationType: 'fixed',
      amount: overrideAmount,
      metadata: { overridden: true },
    };
  }

  // Fixed amount
  if (component.calculationType === 'fixed' && component.amount !== undefined) {
    return {
      componentSystemId: component.systemId,
      componentId: component.id,
      label: component.name,
      category: component.category,
      calculationType: 'fixed',
      amount: component.amount,
      metadata: { 
        partOfSocialInsurance: component.partOfSocialInsurance,
        taxable: component.taxable,
      },
    };
  }

  // Formula calculation
  if (component.calculationType === 'formula' && component.formula) {
    // Lấy chi tiết OT
    const otHoursWeekday = attendance?.totals.otHoursWeekday ?? 0;
    const otHoursWeekend = attendance?.totals.otHoursWeekend ?? 0;
    const otHoursHoliday = attendance?.totals.otHoursHoliday ?? 0;
    const otPay = calculateOTPay(otHoursWeekday, otHoursWeekend, otHoursHoliday);
    
    const standardWorkDays = getStandardWorkDays();
    const context: FormulaContext = {
      baseSalary: employee.baseSalary,
      workDays: attendance?.totals.workDays ?? standardWorkDays,
      leaveDays: attendance?.totals.leaveDays ?? 0,
      absentDays: attendance?.totals.absentDays ?? 0,
      lateArrivals: attendance?.totals.lateArrivals ?? 0,
      earlyDepartures: attendance?.totals.earlyDepartures ?? 0,
      otHours: attendance?.totals.otHours ?? 0,
      // Chi tiết OT
      otHoursWeekday,
      otHoursWeekend,
      otHoursHoliday,
      otPayWeekday: otPay.otPayWeekday,
      otPayWeekend: otPay.otPayWeekend,
      otPayHoliday: otPay.otPayHoliday,
      otPayTotal: otPay.otPayTotal,
      standardWorkDays,
      // OT rate settings for formula display
      otHourlyRate: useEmployeeSettingsStore.getState().settings.otHourlyRate || 0,
      otRateWeekend: useEmployeeSettingsStore.getState().settings.otRateWeekend || 2,
      otRateHoliday: useEmployeeSettingsStore.getState().settings.otRateHoliday || 3,
      // Phụ cấp ăn trưa theo ngày
      mealAllowancePerDay: useEmployeeSettingsStore.getState().settings.mealAllowancePerDay || 30000,
    };

    const amount = evaluateFormula(component.formula, context);

    return {
      componentSystemId: component.systemId,
      componentId: component.id,
      label: component.name,
      category: component.category,
      calculationType: 'formula',
      amount,
      formula: component.formula,
      metadata: { 
        context,
        partOfSocialInsurance: component.partOfSocialInsurance,
        taxable: component.taxable,
      },
    };
  }

  // Fallback
  return {
    componentSystemId: component.systemId,
    componentId: component.id,
    label: component.name,
    category: component.category,
    calculationType: component.calculationType,
    amount: 0,
    metadata: { 
      warning: 'No calculation method available',
      partOfSocialInsurance: component.partOfSocialInsurance,
      taxable: component.taxable,
    },
  };
};

// =============================================
// PENALTY COLLECTOR
// =============================================

const collectPenaltiesForEmployee = (
  employeeSystemId: SystemId,
  mode: PenaltySelectionMode,
  selectedIds?: SystemId[]
): Penalty[] => {
  const { data: allPenalties } = usePenaltyStore.getState();

  const employeePenalties = allPenalties.filter(
    (p) =>
      p.employeeSystemId === employeeSystemId &&
      p.status === 'Chưa thanh toán' &&
      !p.deductedInPayrollId
  );

  switch (mode) {
    case 'none':
      return [];
    case 'all-unpaid':
      return employeePenalties;
    case 'selected':
      if (!selectedIds?.length) return [];
      return employeePenalties.filter((p) => selectedIds.includes(p.systemId));
    default:
      return [];
  }
};

// =============================================
// TOTALS CALCULATOR - Vietnamese Labor Law Compliant
// =============================================

/**
 * Get settings from store
 */
const getPayrollSettings = () => {
  const settings = useEmployeeSettingsStore.getState().settings;
  return {
    insuranceRates: settings.insuranceRates,
    taxSettings: settings.taxSettings,
    standardWorkDays: settings.standardWorkDays,
  };
};

/**
 * Calculate insurance (BHXH, BHYT, BHTN)
 */
const calculateInsurance = (
  insurableIncome: number, // Thu nhập đóng BHXH
  insuranceRates: InsuranceRates
): {
  employee: { social: number; health: number; unemployment: number; total: number };
  employer: { social: number; health: number; unemployment: number; total: number };
  socialInsuranceBase: number;
} => {
  // Áp dụng trần đóng BHXH
  const cappedIncome = Math.min(insurableIncome, insuranceRates.insuranceSalaryCap);
  
  // Phần NV đóng
  const employeeSocial = cappedIncome * (insuranceRates.socialInsurance.employeeRate / 100);
  const employeeHealth = cappedIncome * (insuranceRates.healthInsurance.employeeRate / 100);
  const employeeUnemployment = cappedIncome * (insuranceRates.unemploymentInsurance.employeeRate / 100);
  
  // Phần DN đóng
  const employerSocial = cappedIncome * (insuranceRates.socialInsurance.employerRate / 100);
  const employerHealth = cappedIncome * (insuranceRates.healthInsurance.employerRate / 100);
  const employerUnemployment = cappedIncome * (insuranceRates.unemploymentInsurance.employerRate / 100);
  
  return {
    employee: {
      social: Math.round(employeeSocial),
      health: Math.round(employeeHealth),
      unemployment: Math.round(employeeUnemployment),
      total: Math.round(employeeSocial + employeeHealth + employeeUnemployment),
    },
    employer: {
      social: Math.round(employerSocial),
      health: Math.round(employerHealth),
      unemployment: Math.round(employerUnemployment),
      total: Math.round(employerSocial + employerHealth + employerUnemployment),
    },
    socialInsuranceBase: cappedIncome,
  };
};

/**
 * Calculate Personal Income Tax (Thuế TNCN) - Progressive tax
 */
const calculatePersonalIncomeTax = (
  taxableIncome: number, // Thu nhập tính thuế (sau giảm trừ)
  taxBrackets: TaxBracket[]
): number => {
  if (taxableIncome <= 0) return 0;
  
  let tax = 0;
  let remainingIncome = taxableIncome;
  
  for (const bracket of taxBrackets) {
    if (remainingIncome <= 0) break;
    
    const bracketMax = bracket.toAmount ?? Infinity;
    const bracketRange = bracketMax - bracket.fromAmount;
    const incomeInBracket = Math.min(remainingIncome, bracketRange);
    
    tax += incomeInBracket * (bracket.rate / 100);
    remainingIncome -= incomeInBracket;
  }
  
  return Math.round(tax);
};

/**
 * Main totals calculator
 */
const calculateTotals = (
  components: PayrollComponentEntry[],
  penaltyDeductions: number,
  numberOfDependents: number = 0,
  attendance: AttendanceSnapshot | null = null
): PayrollTotals => {
  const { insuranceRates, taxSettings } = getPayrollSettings();
  const standardWorkDays = getStandardWorkDays();
  const workDays = attendance?.totals.workDays ?? standardWorkDays;
  
  // === SPECIAL CASE: Nhân viên không đi làm ngày nào trong tháng ===
  // Nếu workDays = 0, không tính lương (nghỉ việc cả tháng không được trợ cấp)
  if (workDays === 0) {
    return {
      // Thông tin chấm công
      workDays: 0,
      standardWorkDays,
      leaveDays: attendance?.totals.leaveDays ?? 0,
      absentDays: attendance?.totals.absentDays ?? 0,
      otHours: 0,
      otHoursWeekday: 0,
      otHoursWeekend: 0,
      otHoursHoliday: 0,
      lateArrivals: 0,
      earlyDepartures: 0,
      // Thu nhập = 0
      grossEarnings: 0,
      earnings: 0,
      // Bảo hiểm = 0
      employeeSocialInsurance: 0,
      employeeHealthInsurance: 0,
      employeeUnemploymentInsurance: 0,
      totalEmployeeInsurance: 0,
      employerSocialInsurance: 0,
      employerHealthInsurance: 0,
      employerUnemploymentInsurance: 0,
      totalEmployerInsurance: 0,
      // Thuế = 0
      taxableIncome: 0,
      personalIncomeTax: 0,
      // Giảm trừ
      personalDeduction: taxSettings.personalDeduction,
      dependentDeduction: taxSettings.dependentDeduction * numberOfDependents,
      numberOfDependents,
      // Khấu trừ
      penaltyDeductions: 0,
      otherDeductions: 0,
      deductions: 0,
      contributions: 0,
      socialInsuranceBase: 0,
      netPay: 0,
    };
  }
  
  // 1. Tính tổng thu nhập (Earnings)
  const grossEarnings = components
    .filter((c) => c.category === 'earning')
    .reduce((sum, c) => sum + c.amount, 0);

  // 2. Tính thu nhập đóng BHXH (chỉ các khoản partOfSocialInsurance = true)
  // Lấy từ metadata của component
  const insurableIncome = components
    .filter((c) => c.category === 'earning' && c.metadata?.partOfSocialInsurance === true)
    .reduce((sum, c) => sum + c.amount, 0);
  
  // Nếu không có metadata, dùng toàn bộ earnings (fallback)
  const effectiveInsurableIncome = insurableIncome > 0 ? insurableIncome : grossEarnings;

  // 3. Tính bảo hiểm
  const insurance = calculateInsurance(effectiveInsurableIncome, insuranceRates);

  // 4. Tính giảm trừ gia cảnh
  const personalDeduction = taxSettings.personalDeduction;
  const dependentDeduction = taxSettings.dependentDeduction * numberOfDependents;
  const totalDeduction = personalDeduction + dependentDeduction;

  // 5. Tính thu nhập chịu thuế
  // Thu nhập chịu thuế = Tổng thu nhập - BHXH,BHYT,BHTN (phần NV) - Giảm trừ gia cảnh
  const taxableIncome = Math.max(0, grossEarnings - insurance.employee.total - totalDeduction);

  // 6. Tính thuế TNCN
  const personalIncomeTax = calculatePersonalIncomeTax(taxableIncome, taxSettings.taxBrackets);

  // 7. Các khoản khấu trừ khác từ components
  const otherDeductions = components
    .filter((c) => c.category === 'deduction')
    .reduce((sum, c) => sum + c.amount, 0);

  // 8. Tổng đóng góp (contributions)
  const contributions = components
    .filter((c) => c.category === 'contribution')
    .reduce((sum, c) => sum + c.amount, 0);

  // 9. Tổng khấu trừ = BH (NV) + Thuế + Phạt + Khấu trừ khác
  const totalDeductions = insurance.employee.total + personalIncomeTax + penaltyDeductions + otherDeductions;

  // 10. Thực lĩnh
  const netPay = Math.max(0, grossEarnings - totalDeductions);

  return {
    // Thông tin chấm công
    workDays: attendance?.totals.workDays ?? standardWorkDays,
    standardWorkDays,
    leaveDays: attendance?.totals.leaveDays ?? 0,
    absentDays: attendance?.totals.absentDays ?? 0,
    otHours: attendance?.totals.otHours ?? 0,
    otHoursWeekday: attendance?.totals.otHoursWeekday ?? 0,
    otHoursWeekend: attendance?.totals.otHoursWeekend ?? 0,
    otHoursHoliday: attendance?.totals.otHoursHoliday ?? 0,
    lateArrivals: attendance?.totals.lateArrivals ?? 0,
    earlyDepartures: attendance?.totals.earlyDepartures ?? 0,
    
    // Thu nhập
    grossEarnings,
    earnings: grossEarnings, // Backward compatible
    
    // Bảo hiểm NV đóng
    employeeSocialInsurance: insurance.employee.social,
    employeeHealthInsurance: insurance.employee.health,
    employeeUnemploymentInsurance: insurance.employee.unemployment,
    totalEmployeeInsurance: insurance.employee.total,
    
    // Bảo hiểm DN đóng (để báo cáo)
    employerSocialInsurance: insurance.employer.social,
    employerHealthInsurance: insurance.employer.health,
    employerUnemploymentInsurance: insurance.employer.unemployment,
    totalEmployerInsurance: insurance.employer.total,
    
    // Thuế TNCN
    taxableIncome,
    personalIncomeTax,
    
    // Giảm trừ (thông tin)
    personalDeduction,
    dependentDeduction,
    numberOfDependents,
    
    // Các khoản khấu trừ
    penaltyDeductions,
    otherDeductions,
    
    // Tổng hợp
    deductions: totalDeductions,
    contributions,
    socialInsuranceBase: insurance.socialInsuranceBase,
    netPay,
  };
};

// =============================================
// SINGLE EMPLOYEE CALCULATOR
// =============================================

const calculateForEmployee = (
  employee: EmployeePayrollInput,
  periodMonthKey: string,
  components: PayrollComponent[],
  penaltyMode: PenaltySelectionMode,
  selectedPenaltySystemIds?: SystemId[]
): {
  payslip: CalculatedPayslip;
  penalties: DeductedPenaltyInfo[];
  warning?: PayrollWarning;
} => {
  // Get attendance
  const attendance = attendanceSnapshotService.getSnapshot({
    monthKey: periodMonthKey,
    employeeSystemId: employee.employeeSystemId,
  });

  // Filter applicable components
  const applicableComponents = components.filter((c) => {
    if (c.applicableDepartmentSystemIds.length > 0) {
      if (!employee.departmentSystemId) return false;
      if (!c.applicableDepartmentSystemIds.includes(employee.departmentSystemId)) {
        return false;
      }
    }
    if (c.applicableEmployeeSystemIds?.length) {
      if (!c.applicableEmployeeSystemIds.includes(employee.employeeSystemId)) {
        return false;
      }
    }
    return true;
  });

  // Calculate components
  const componentEntries = applicableComponents.map((comp) =>
    calculateComponent(
      comp,
      employee,
      attendance,
      employee.customComponentOverrides?.[comp.systemId]
    )
  );

  // Collect penalties
  const penalties = collectPenaltiesForEmployee(
    employee.employeeSystemId,
    penaltyMode,
    selectedPenaltySystemIds
  );

  const penaltyDeductions = penalties.reduce((sum, p) => sum + p.amount, 0);
  const deductedPenaltySystemIds = penalties.map((p) => p.systemId);

  // Calculate totals (with number of dependents for tax deduction and attendance info)
  const totals = calculateTotals(componentEntries, penaltyDeductions, employee.numberOfDependents ?? 0, attendance);

  // Build result
  const payslip: CalculatedPayslip = {
    employeeSystemId: employee.employeeSystemId,
    employeeId: employee.employeeId,
    employeeName: employee.employeeName,
    departmentSystemId: employee.departmentSystemId,
    periodMonthKey,
    components: componentEntries,
    totals,
    deductedPenaltySystemIds,
    attendanceSnapshot: attendance,
  };

  const deductedPenalties: DeductedPenaltyInfo[] = penalties.map((p) => ({
    penaltySystemId: p.systemId,
    penaltyId: p.id,
    employeeSystemId: p.employeeSystemId,
    employeeName: employee.employeeName,
    amount: p.amount,
    reason: p.reason,
    linkedComplaintSystemId: p.linkedComplaintSystemId,
  }));

  return { payslip, penalties: deductedPenalties };
};

// =============================================
// MAIN ENGINE
// =============================================

export const payrollEngine = {
  /**
   * Calculate payroll for multiple employees
   * Returns calculation results - NO IDs generated
   * Store will handle ID generation when saving
   */
  calculate(options: PayrollRunOptions): PayrollCalculationResult {
    const {
      periodMonthKey,
      employees,
      components,
      penaltyMode,
      selectedPenaltySystemIds,
      requireLockedAttendance = true,
      skipAttendanceValidation = false,
    } = options;

    const warnings: PayrollWarning[] = [];
    const errors: PayrollError[] = [];
    const allDeductedPenalties: DeductedPenaltyInfo[] = [];
    const payslips: CalculatedPayslip[] = [];

    // Validate inputs
    if (!components.length) {
      errors.push({
        type: 'validation',
        message: 'Chưa có thành phần lương nào được chọn',
        fatal: true,
      });
      return {
        success: false,
        payslips: [],
        summary: { totalGross: 0, totalNet: 0, totalPenaltyDeductions: 0, employeeCount: 0 },
        warnings,
        errors,
        penaltiesDeducted: [],
      };
    }

    if (!employees.length) {
      errors.push({
        type: 'validation',
        message: 'Chưa chọn nhân viên nào',
        fatal: true,
      });
      return {
        success: false,
        payslips: [],
        summary: { totalGross: 0, totalNet: 0, totalPenaltyDeductions: 0, employeeCount: 0 },
        warnings,
        errors,
        penaltiesDeducted: [],
      };
    }

    // Process each employee
    for (const employee of employees) {
      // Attendance validation
      if (!skipAttendanceValidation) {
        const attendance = attendanceSnapshotService.getSnapshot({
          monthKey: periodMonthKey,
          employeeSystemId: employee.employeeSystemId,
        });

        if (!attendance) {
          warnings.push({
            type: 'attendance-missing',
            employeeSystemId: employee.employeeSystemId,
            employeeName: employee.employeeName,
            message: `Không có dữ liệu chấm công cho ${employee.employeeName} trong kỳ ${periodMonthKey}`,
          });
        } else if (requireLockedAttendance && !attendance.locked) {
          warnings.push({
            type: 'attendance-unlocked',
            employeeSystemId: employee.employeeSystemId,
            employeeName: employee.employeeName,
            message: `Chấm công chưa khóa cho ${employee.employeeName} trong kỳ ${periodMonthKey}`,
          });
        }
      }

      // Calculate
      const { payslip, penalties } = calculateForEmployee(
        employee,
        periodMonthKey,
        components,
        penaltyMode,
        selectedPenaltySystemIds
      );

      payslips.push(payslip);
      allDeductedPenalties.push(...penalties);
    }

    // Calculate summary
    const totalGross = payslips.reduce((sum, p) => sum + p.totals.earnings, 0);
    const totalNet = payslips.reduce((sum, p) => sum + p.totals.netPay, 0);
    const totalPenaltyDeductions = payslips.reduce((sum, p) => sum + (p.totals.penaltyDeductions ?? 0), 0);

    return {
      success: true,
      payslips,
      summary: {
        totalGross,
        totalNet,
        totalPenaltyDeductions,
        employeeCount: payslips.length,
      },
      warnings,
      errors,
      penaltiesDeducted: allDeductedPenalties,
    };
  },

  /**
   * Preview calculation (alias for calculate - no side effects)
   */
  preview(options: PayrollRunOptions): PayrollCalculationResult {
    return this.calculate(options);
  },

  /**
   * Calculate for a single employee
   */
  calculateSingle(
    employee: EmployeePayrollInput,
    periodMonthKey: string,
    components: PayrollComponent[],
    penaltyMode: PenaltySelectionMode = 'none',
    selectedPenaltySystemIds?: SystemId[]
  ): CalculatedPayslip {
    const { payslip } = calculateForEmployee(
      employee,
      periodMonthKey,
      components,
      penaltyMode,
      selectedPenaltySystemIds
    );
    return payslip;
  },

  /**
   * Get unpaid penalties for an employee
   */
  getUnpaidPenalties(employeeSystemId: SystemId): Penalty[] {
    return collectPenaltiesForEmployee(employeeSystemId, 'all-unpaid');
  },

  /**
   * Get unpaid penalties for multiple employees
   */
  getUnpaidPenaltiesMap(employeeSystemIds: SystemId[]): Map<SystemId, Penalty[]> {
    const result = new Map<SystemId, Penalty[]>();
    for (const systemId of employeeSystemIds) {
      result.set(systemId, this.getUnpaidPenalties(systemId));
    }
    return result;
  },

  /**
   * Validate prerequisites before running payroll
   */
  validatePrerequisites(
    periodMonthKey: string,
    employeeSystemIds: SystemId[],
    employeeNames?: Map<SystemId, string>
  ): { valid: boolean; issues: PayrollWarning[] } {
    const issues: PayrollWarning[] = [];

    for (const employeeSystemId of employeeSystemIds) {
      const attendance = attendanceSnapshotService.getSnapshot({
        monthKey: periodMonthKey,
        employeeSystemId,
      });

      const employeeName = employeeNames?.get(employeeSystemId) ?? employeeSystemId;

      if (!attendance) {
        issues.push({
          type: 'attendance-missing',
          employeeSystemId,
          employeeName,
          message: `Không có dữ liệu chấm công cho kỳ ${periodMonthKey}`,
        });
      } else if (!attendance.locked) {
        issues.push({
          type: 'attendance-unlocked',
          employeeSystemId,
          employeeName,
          message: `Chấm công chưa được khóa cho kỳ ${periodMonthKey}`,
        });
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  },
};

export default payrollEngine;
