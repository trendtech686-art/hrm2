/**
 * Payroll Print Helper
 * Helpers để chuẩn bị dữ liệu in cho bảng lương và phiếu lương
 */

import type { Branch } from '../../features/settings/branches/types';
import type { Employee } from '../../features/employees/types';
import { attendanceSnapshotService } from '../attendance-snapshot-service';
import { 
  PayrollBatchForPrint,
  PayslipForPrint,
  PayrollComponentForPrint,
  mapPayrollBatchToPrintData, 
  mapPayrollBatchLineItems,
  mapPayslipToPrintData,
  mapPayslipComponentLineItems,
} from '../print-mappers/payroll.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';
import type { PayrollBatch, Payslip, PayrollComponentEntry, PayrollTotals } from '../payroll-types';
import type { SystemId } from '../id-types';

// ============================================
// INTERFACES
// ============================================

// Interface cho PayrollBatch - flexible
interface PayrollBatchLike {
  systemId: string;
  id: string;
  title: string;
  status: 'draft' | 'reviewed' | 'locked' | 'cancelled';
  payPeriod?: {
    monthKey?: string;
    startDate?: string;
    endDate?: string;
  };
  payrollDate?: string;
  referenceAttendanceMonthKeys?: string[];
  totalGross?: number;
  totalNet?: number;
  createdAt?: string;
  createdBy?: SystemId;
  reviewedAt?: string;
  reviewedBy?: SystemId;
  lockedAt?: string;
  lockedBy?: SystemId;
  notes?: string;
}

// Interface cho Payslip - flexible
interface PayslipLike {
  systemId: string;
  id: string;
  batchSystemId?: string;
  employeeSystemId: string;
  employeeId?: string;
  departmentSystemId?: string;
  periodMonthKey?: string;
  components?: PayrollComponentEntry[];
  totals: PayrollTotals;
  lockedAt?: string;
}

// ============================================
// CONVERTERS
// ============================================

/**
 * Chuyển đổi PayrollBatch entity sang PayrollBatchForPrint
 */
export function convertPayrollBatchForPrint(
  batch: PayrollBatchLike,
  payslips: PayslipLike[],
  options: {
    employeeLookup?: Record<SystemId, { fullName?: string; id?: string; department?: string }>;
    departmentLookup?: Record<SystemId, { name?: string }>;
    creatorName?: string;
    lockerName?: string;
  } = {}
): PayrollBatchForPrint {
  const { employeeLookup = {}, departmentLookup = {}, creatorName, lockerName } = options;

  // Calculate totals from payslips
  const totalEarnings = payslips.reduce((sum, p) => sum + p.totals.earnings, 0);
  const totalDeductions = payslips.reduce((sum, p) => sum + p.totals.deductions, 0);
  const totalContributions = payslips.reduce((sum, p) => sum + p.totals.contributions, 0);
  const totalInsurance = payslips.reduce((sum, p) => sum + (p.totals.totalEmployeeInsurance || 0), 0);
  const totalTax = payslips.reduce((sum, p) => sum + (p.totals.personalIncomeTax || 0), 0);

  // Convert payslips
  const payslipsForPrint: PayslipForPrint[] = payslips.map(payslip => {
    const employee = employeeLookup[payslip.employeeSystemId as SystemId];
    const departmentName = payslip.departmentSystemId
      ? departmentLookup[payslip.departmentSystemId as SystemId]?.name
      : (employee as { departmentName?: string })?.departmentName;

    return {
      code: payslip.id || payslip.systemId,
      batchCode: batch.id,
      batchTitle: batch.title,
      payPeriod: batch.payPeriod?.monthKey,
      payrollDate: batch.payrollDate,
      employeeCode: employee?.id || payslip.employeeId || '',
      employeeName: employee?.fullName || `Nhân viên ${payslip.employeeId || payslip.employeeSystemId}`,
      departmentName: departmentName || 'Không xác định',
      earnings: payslip.totals.earnings,
      deductions: payslip.totals.deductions,
      contributions: payslip.totals.contributions,
      taxableIncome: payslip.totals.taxableIncome,
      socialInsuranceBase: payslip.totals.socialInsuranceBase,
      netPay: payslip.totals.netPay,
      // Bảo hiểm chi tiết
      totalEmployeeInsurance: payslip.totals.totalEmployeeInsurance || 0,
      employeeSocialInsurance: payslip.totals.employeeSocialInsurance || 0,
      employeeHealthInsurance: payslip.totals.employeeHealthInsurance || 0,
      employeeUnemploymentInsurance: payslip.totals.employeeUnemploymentInsurance || 0,
      // Thuế TNCN
      personalIncomeTax: payslip.totals.personalIncomeTax || 0,
      // Khấu trừ phạt & khác
      penaltyDeductions: payslip.totals.penaltyDeductions || 0,
      otherDeductions: payslip.totals.otherDeductions || 0,
      // Giảm trừ gia cảnh
      personalDeduction: payslip.totals.personalDeduction || 0,
      dependentDeduction: payslip.totals.dependentDeduction || 0,
      numberOfDependents: payslip.totals.numberOfDependents || 0,
      components: payslip.components?.map(c => ({
        code: c.componentId,
        name: c.label,
        category: c.category,
        amount: c.amount,
      })),
    };
  });

  return {
    code: batch.id,
    title: batch.title,
    status: batch.status,
    payPeriod: batch.payPeriod?.monthKey || '',
    payPeriodStart: batch.payPeriod?.startDate,
    payPeriodEnd: batch.payPeriod?.endDate,
    payrollDate: batch.payrollDate || '',
    referenceMonths: batch.referenceAttendanceMonthKeys,
    totalEmployees: payslips.length,
    totalGross: batch.totalGross || 0,
    totalEarnings,
    totalDeductions,
    totalContributions,
    totalInsurance,
    totalTax,
    totalNet: batch.totalNet || 0,
    createdAt: batch.createdAt || '',
    createdBy: creatorName,
    lockedAt: batch.lockedAt,
    lockedBy: lockerName,
    notes: batch.notes,
    payslips: payslipsForPrint,
  };
}

/**
 * Chuyển đổi Payslip entity sang PayslipForPrint (cho in phiếu lương cá nhân)
 */
export function convertPayslipForPrint(
  payslip: PayslipLike,
  batch: PayrollBatchLike,
  options: {
    employee?: { fullName?: string; id?: string; department?: string; position?: string };
    departmentName?: string;
  } = {}
): PayslipForPrint {
  const { employee, departmentName } = options;

  // Lấy attendance info: từ totals trước, nếu không có thì lấy từ snapshot
  let attendance = {
    workDays: payslip.totals.workDays,
    standardWorkDays: payslip.totals.standardWorkDays ?? 26,
    leaveDays: payslip.totals.leaveDays ?? 0,
    absentDays: payslip.totals.absentDays ?? 0,
    otHours: payslip.totals.otHours ?? 0,
    otHoursWeekday: payslip.totals.otHoursWeekday ?? 0,
    otHoursWeekend: payslip.totals.otHoursWeekend ?? 0,
    otHoursHoliday: payslip.totals.otHoursHoliday ?? 0,
    lateArrivals: payslip.totals.lateArrivals ?? 0,
    earlyDepartures: payslip.totals.earlyDepartures ?? 0,
  };

  // Nếu totals không có workDays (dữ liệu cũ), thử lấy từ attendance snapshot
  if (attendance.workDays === undefined || attendance.workDays === null) {
    const monthKey = payslip.periodMonthKey || batch.payPeriod?.monthKey;
    if (monthKey) {
      const snapshot = attendanceSnapshotService.getSnapshot({
        monthKey,
        employeeSystemId: payslip.employeeSystemId as SystemId,
      });
      if (snapshot) {
        attendance = {
          workDays: snapshot.totals.workDays,
          standardWorkDays: 26,
          leaveDays: snapshot.totals.leaveDays,
          absentDays: snapshot.totals.absentDays,
          otHours: snapshot.totals.otHours,
          otHoursWeekday: snapshot.totals.otHoursWeekday ?? 0,
          otHoursWeekend: snapshot.totals.otHoursWeekend ?? 0,
          otHoursHoliday: snapshot.totals.otHoursHoliday ?? 0,
          lateArrivals: snapshot.totals.lateArrivals,
          earlyDepartures: snapshot.totals.earlyDepartures,
        };
      }
    }
  }

  return {
    code: payslip.id || payslip.systemId,
    batchCode: batch.id,
    batchTitle: batch.title,
    payPeriod: batch.payPeriod?.monthKey,
    payrollDate: batch.payrollDate,
    employeeCode: employee?.id || payslip.employeeId || '',
    employeeName: employee?.fullName || `Nhân viên ${payslip.employeeId || payslip.employeeSystemId}`,
    departmentName: departmentName || employee?.department || 'Không xác định',
    position: employee?.position,
    // Thông tin chấm công (từ attendance object đã resolve)
    workDays: attendance.workDays,
    standardWorkDays: attendance.standardWorkDays,
    leaveDays: attendance.leaveDays,
    absentDays: attendance.absentDays,
    otHours: attendance.otHours,
    otHoursWeekday: attendance.otHoursWeekday,
    otHoursWeekend: attendance.otHoursWeekend,
    otHoursHoliday: attendance.otHoursHoliday,
    lateArrivals: attendance.lateArrivals,
    earlyDepartures: attendance.earlyDepartures,
    // Chi tiết lương
    earnings: payslip.totals.earnings,
    deductions: payslip.totals.deductions,
    contributions: payslip.totals.contributions,
    taxableIncome: payslip.totals.taxableIncome,
    socialInsuranceBase: payslip.totals.socialInsuranceBase,
    netPay: payslip.totals.netPay,
    // Bảo hiểm chi tiết
    totalEmployeeInsurance: payslip.totals.totalEmployeeInsurance || 0,
    employeeSocialInsurance: payslip.totals.employeeSocialInsurance || 0,
    employeeHealthInsurance: payslip.totals.employeeHealthInsurance || 0,
    employeeUnemploymentInsurance: payslip.totals.employeeUnemploymentInsurance || 0,
    // Thuế TNCN
    personalIncomeTax: payslip.totals.personalIncomeTax || 0,
    // Khấu trừ phạt & khác
    penaltyDeductions: payslip.totals.penaltyDeductions || 0,
    otherDeductions: payslip.totals.otherDeductions || 0,
    // Giảm trừ gia cảnh
    personalDeduction: payslip.totals.personalDeduction || 0,
    dependentDeduction: payslip.totals.dependentDeduction || 0,
    numberOfDependents: payslip.totals.numberOfDependents || 0,
    components: payslip.components?.map(c => ({
      code: c.componentId,
      name: c.label,
      category: c.category,
      amount: c.amount,
      calculationType: c.calculationType,
      formula: c.formula,
      metadata: c.metadata as PayrollComponentForPrint['metadata'],
    })),
  };
}

/**
 * Tạo StoreSettings từ storeInfo
 */
export function createStoreSettings(storeInfo?: {
  companyName?: string;
  brandName?: string;
  hotline?: string;
  email?: string;
  website?: string;
  taxCode?: string;
  headquartersAddress?: string;
  province?: string;
  logo?: string;
}): StoreSettings {
  const generalSettings = getGeneralSettings();
  
  // Fallback: đọc từ store-info-settings nếu storeInfo rỗng
  let storeInfoFromStorage: typeof storeInfo | null = null;
  if (!storeInfo?.companyName && !storeInfo?.brandName) {
    try {
      const stored = localStorage.getItem('store-info-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        storeInfoFromStorage = parsed?.state?.info;
      }
    } catch (e) { /* ignore */ }
  }
  
  const info = storeInfo?.companyName || storeInfo?.brandName ? storeInfo : storeInfoFromStorage;
  
  return {
    name: info?.companyName || info?.brandName || generalSettings?.companyName || '',
    address: info?.headquartersAddress || generalSettings?.companyAddress || '',
    phone: info?.hotline || generalSettings?.phoneNumber || '',
    email: info?.email || generalSettings?.email || '',
    website: info?.website,
    taxCode: info?.taxCode,
    province: info?.province,
    logo: getStoreLogo(info?.logo),
  };
}

// Re-export mappers
export {
  mapPayrollBatchToPrintData,
  mapPayrollBatchLineItems,
  mapPayslipToPrintData,
  mapPayslipComponentLineItems,
};
