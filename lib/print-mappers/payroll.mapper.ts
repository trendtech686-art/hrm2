/**
 * Payroll Mapper - Bảng lương & Phiếu lương
 * Đồng bộ với variables/bang-luong.ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency, 
  numberToWords, 
  formatDate,
  formatTime,
  getStoreData,
  StoreSettings
} from './types';

// Helper: Format số khấu trừ (có dấu âm khi > 0, không dấu khi = 0)
const formatDeduction = (value: number | undefined): string => {
  if (!value || value === 0) return '0';
  return `-${formatCurrency(value)}`;
};

// ============================================
// TYPES
// ============================================

export interface PayrollBatchForPrint {
  // Thông tin cơ bản
  code: string;
  title: string;
  status: string;
  
  // Kỳ lương
  payPeriod: string; // MM/yyyy
  payPeriodStart?: string | Date;
  payPeriodEnd?: string | Date;
  payrollDate: string | Date;
  referenceMonths?: string[]; // ['2024-01', '2024-02']
  
  // Tổng kết
  totalEmployees: number;
  totalGross: number;
  totalEarnings: number;
  totalDeductions: number;
  totalContributions: number;
  totalNet: number;
  
  // Tổng bảo hiểm & Thuế (cho template in)
  totalInsurance: number;      // Tổng BH nhân viên đóng
  totalTax: number;            // Tổng thuế TNCN
  
  // Audit
  createdAt: string | Date;
  createdBy?: string;
  lockedAt?: string | Date;
  lockedBy?: string;
  notes?: string;
  
  // Chi tiết nhân viên
  payslips?: PayslipForPrint[];
}

export interface PayslipForPrint {
  // Thông tin phiếu
  code: string;
  batchCode?: string;
  batchTitle?: string;
  payPeriod?: string;
  payrollDate?: string | Date;
  
  // Thông tin nhân viên
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  position?: string;
  
  // Thông tin chấm công
  workDays?: number;
  standardWorkDays?: number;
  leaveDays?: number;
  absentDays?: number;
  otHours?: number;
  otHoursWeekday?: number;
  otHoursWeekend?: number;
  otHoursHoliday?: number;
  lateArrivals?: number;
  earlyDepartures?: number;
  
  // Chi tiết lương
  earnings: number;
  deductions: number;
  contributions: number;
  taxableIncome: number;
  socialInsuranceBase: number;
  netPay: number;
  
  // Bảo hiểm chi tiết (NV đóng)
  totalEmployeeInsurance: number;
  employeeSocialInsurance: number;
  employeeHealthInsurance: number;
  employeeUnemploymentInsurance: number;
  
  // Thuế TNCN
  personalIncomeTax: number;
  
  // Khấu trừ phạt & khác
  penaltyDeductions?: number;
  otherDeductions?: number;
  
  // Giảm trừ gia cảnh
  personalDeduction: number;
  dependentDeduction: number;
  numberOfDependents: number;
  
  // Components
  components?: PayrollComponentForPrint[];
}

export interface PayrollComponentForPrint {
  code?: string;
  name: string;
  category: 'earning' | 'deduction' | 'contribution';
  amount: number;
  // Thông tin để tạo công thức
  calculationType?: 'fixed' | 'formula';
  formula?: string;
  metadata?: {
    context?: {
      baseSalary?: number;
      workDays?: number;
      standardWorkDays?: number;
      otHoursWeekday?: number;
      otHoursWeekend?: number;
      otHoursHoliday?: number;
      otPayWeekday?: number;
      otPayWeekend?: number;
      otPayHoliday?: number;
      // OT rate settings
      otHourlyRate?: number;
      otRateWeekend?: number;
      otRateHoliday?: number;
      // Phụ cấp ăn trưa
      mealAllowancePerDay?: number;
    };
    [key: string]: unknown;
  };
}

// ============================================
// BATCH MAPPER (Tổng bảng lương)
// ============================================

const STATUS_MAP: Record<string, string> = {
  'draft': 'Nháp',
  'reviewed': 'Đã duyệt',
  'locked': 'Đã khóa',
};

export function mapPayrollBatchToPrintData(batch: PayrollBatchForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN BẢNG LƯƠNG ===
    '{batch_code}': batch.code,
    '{batch_title}': batch.title,
    '{batch_status}': STATUS_MAP[batch.status] || batch.status,
    '{pay_period}': batch.payPeriod,
    '{pay_period_start}': formatDate(batch.payPeriodStart),
    '{pay_period_end}': formatDate(batch.payPeriodEnd),
    '{payroll_date}': formatDate(batch.payrollDate),
    '{reference_months}': batch.referenceMonths?.join(', ') || '',
    '{created_on}': formatDate(batch.createdAt),
    '{created_by}': batch.createdBy || '',
    '{locked_on}': formatDate(batch.lockedAt),
    '{locked_by}': batch.lockedBy || '',
    '{notes}': batch.notes || '',
    
    // === TỔNG KẾT ===
    '{total_employees}': String(batch.totalEmployees),
    '{total_gross}': formatCurrency(batch.totalGross),
    '{total_gross_text}': numberToWords(batch.totalGross),
    '{total_earnings}': formatCurrency(batch.totalEarnings),
    '{total_deductions}': formatCurrency(batch.totalDeductions),
    '{total_contributions}': formatCurrency(batch.totalContributions),
    '{total_insurance}': formatCurrency(batch.totalInsurance),
    '{total_tax}': formatCurrency(batch.totalTax),
    '{total_net}': formatCurrency(batch.totalNet),
    '{total_net_text}': numberToWords(batch.totalNet),
  };
}

export function mapPayrollBatchLineItems(payslips?: PayslipForPrint[]): PrintLineItem[] {
  if (!payslips?.length) return [];
  
  return payslips.map((slip, index) => ({
    '{line_stt}': String(index + 1),
    '{employee_code}': slip.employeeCode,
    '{employee_name}': slip.employeeName,
    '{department_name}': slip.departmentName || '',
    '{earnings}': formatCurrency(slip.earnings),
    '{deductions}': formatCurrency(slip.deductions),
    '{contributions}': formatCurrency(slip.contributions),
    '{total_insurance}': formatDeduction(slip.totalEmployeeInsurance),
    '{personal_income_tax}': formatDeduction(slip.personalIncomeTax),
    '{net_pay}': formatCurrency(slip.netPay),
  }));
}

// ============================================
// PAYSLIP MAPPER (Phiếu lương cá nhân)
// ============================================

const COMPONENT_CATEGORY_MAP: Record<string, string> = {
  'earning': 'Khoản cộng',
  'deduction': 'Khoản trừ',
  'contribution': 'Đóng góp',
};

export function mapPayslipToPrintData(payslip: PayslipForPrint, storeSettings: StoreSettings): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN PHIẾU LƯƠNG ===
    '{payslip_code}': payslip.code,
    '{batch_code}': payslip.batchCode || '',
    '{batch_title}': payslip.batchTitle || '',
    '{pay_period}': payslip.payPeriod || '',
    '{payroll_date}': formatDate(payslip.payrollDate),
    
    // === THÔNG TIN NHÂN VIÊN ===
    '{employee_code}': payslip.employeeCode,
    '{employee_name}': payslip.employeeName,
    '{department_name}': payslip.departmentName || '',
    '{position}': payslip.position || '',
    
    // === THÔNG TIN CHẤM CÔNG ===
    '{work_days}': String(payslip.workDays ?? 0),
    '{standard_work_days}': String(payslip.standardWorkDays ?? 26),
    '{leave_days}': String(payslip.leaveDays ?? 0),
    '{absent_days}': String(payslip.absentDays ?? 0),
    '{ot_hours}': String(payslip.otHours ?? 0),
    '{ot_hours_weekday}': String(payslip.otHoursWeekday ?? 0),
    '{ot_hours_weekend}': String(payslip.otHoursWeekend ?? 0),
    '{ot_hours_holiday}': String(payslip.otHoursHoliday ?? 0),
    '{late_arrivals}': String(payslip.lateArrivals ?? 0),
    '{early_departures}': String(payslip.earlyDepartures ?? 0),
    
    // === CHI TIẾT LƯƠNG ===
    '{total_earnings}': formatCurrency(payslip.earnings),
    '{total_deductions}': formatCurrency(payslip.deductions),
    '{total_contributions}': formatCurrency(payslip.contributions),
    '{total_insurance}': formatDeduction(payslip.totalEmployeeInsurance),
    
    // === BẢO HIỂM CHI TIẾT ===
    '{bhxh_amount}': formatDeduction(payslip.employeeSocialInsurance),
    '{bhyt_amount}': formatDeduction(payslip.employeeHealthInsurance),
    '{bhtn_amount}': formatDeduction(payslip.employeeUnemploymentInsurance),
    
    // === GIẢM TRỪ GIA CẢNH ===
    '{personal_deduction}': formatCurrency(payslip.personalDeduction),
    '{dependent_deduction}': formatCurrency(payslip.dependentDeduction),
    '{dependents_count}': String(payslip.numberOfDependents || 0),
    
    // === THUẾ & THỰC LĨNH ===
    '{personal_income_tax}': formatDeduction(payslip.personalIncomeTax),
    '{taxable_income}': formatCurrency(payslip.taxableIncome),
    '{social_insurance_base}': formatCurrency(payslip.socialInsuranceBase),
    '{penalty_deductions}': formatDeduction(payslip.penaltyDeductions),
    '{other_deductions}': formatDeduction(payslip.otherDeductions),
    '{net_pay}': formatCurrency(payslip.netPay),
    '{net_pay_text}': numberToWords(payslip.netPay),
  };
}

/**
 * Tạo công thức đọc được cho component
 * Ví dụ: "35,000,000 × (16.98 / 26)" hoặc "Cố định"
 */
function formatComponentFormula(comp: PayrollComponentForPrint): string {
  // Fixed amount
  if (comp.calculationType === 'fixed' || !comp.formula) {
    return 'Cố định';
  }
  
  const ctx = comp.metadata?.context;
  if (!ctx) return comp.formula || '';
  
  // Lương cơ bản: baseSalary × (workDays / standardWorkDays)
  if (comp.formula?.includes('baseSalary') && comp.formula?.includes('workDays')) {
    const baseSalary = ctx.baseSalary ?? 0;
    const workDays = ctx.workDays ?? 0;
    const standardWorkDays = ctx.standardWorkDays ?? 26;
    return `${formatCurrency(baseSalary)} × (${workDays} / ${standardWorkDays})`;
  }
  
  // Phụ cấp ăn trưa: workDays × mealAllowancePerDay
  if (comp.formula?.includes('mealAllowancePerDay') || comp.name.toLowerCase().includes('ăn trưa')) {
    const workDays = ctx.workDays ?? 0;
    const mealAllowancePerDay = ctx.mealAllowancePerDay ?? 30000;
    return `${workDays} ngày × ${formatCurrency(mealAllowancePerDay)}`;
  }
  
  // OT ngày thường (không có hệ số, chỉ nhân hourlyRate)
  if (comp.formula?.includes('otPayWeekday') || comp.name.toLowerCase().includes('ngày thường')) {
    const hours = ctx.otHoursWeekday ?? 0;
    const hourlyRate = ctx.otHourlyRate ?? 0;
    if (hours > 0 && hourlyRate > 0) {
      return `${hours}h × ${formatCurrency(hourlyRate)}`;
    }
    return hours > 0 ? `${hours}h OT` : '—';
  }
  
  // OT cuối tuần (hourlyRate × hệ số)
  if (comp.formula?.includes('otPayWeekend') || comp.name.toLowerCase().includes('cuối tuần')) {
    const hours = ctx.otHoursWeekend ?? 0;
    const hourlyRate = ctx.otHourlyRate ?? 0;
    const rate = ctx.otRateWeekend ?? 2;
    if (hours > 0 && hourlyRate > 0) {
      return `${hours}h × ${formatCurrency(hourlyRate)} × ${rate}`;
    }
    return hours > 0 ? `${hours}h OT` : '—';
  }
  
  // OT ngày lễ (hourlyRate × hệ số)
  if (comp.formula?.includes('otPayHoliday') || comp.name.toLowerCase().includes('ngày lễ')) {
    const hours = ctx.otHoursHoliday ?? 0;
    const hourlyRate = ctx.otHourlyRate ?? 0;
    const rate = ctx.otRateHoliday ?? 3;
    if (hours > 0 && hourlyRate > 0) {
      return `${hours}h × ${formatCurrency(hourlyRate)} × ${rate}`;
    }
    return hours > 0 ? `${hours}h OT` : '—';
  }
  
  // Fallback - hiển thị formula gốc nếu có
  return comp.formula || 'Cố định';
}

export function mapPayslipComponentLineItems(components?: PayrollComponentForPrint[]): PrintLineItem[] {
  if (!components?.length) return [];
  
  return components.map((comp, index) => ({
    '{line_stt}': String(index + 1),
    '{component_code}': comp.code || '',
    '{component_name}': comp.name,
    '{component_category}': COMPONENT_CATEGORY_MAP[comp.category] || comp.category,
    '{component_formula}': formatComponentFormula(comp),    '{component_amount}': formatCurrency(comp.amount),
  }));
}