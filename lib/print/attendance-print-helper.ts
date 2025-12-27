/**
 * Attendance Print Helper
 * Helpers để chuẩn bị dữ liệu in cho bảng chấm công
 */

import type { Branch } from '@/lib/types/prisma-extended';
import type { Employee } from '@/lib/types/prisma-extended';
import { 
  AttendanceSheetForPrint,
  AttendanceEmployeeForPrint,
  AttendanceDetailForPrint,
  DailyAttendanceRecord,
  AttendanceStatus,
  mapAttendanceSheetToPrintData, 
  mapAttendanceSheetLineItems,
  mapAttendanceDetailToPrintData,
  mapAttendanceDetailLineItems,
} from '../print-mappers/attendance.mapper';
import { StoreSettings, getStoreLogo, getGeneralSettings } from '../print-service';
import type { SystemId } from '../id-types';

// ============================================
// INTERFACES
// ============================================

// Interface cho DailyRecord từ attendance store
interface DailyRecordLike {
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  overtimeCheckIn?: string;
  overtimeCheckOut?: string;
  notes?: string;
}

// Interface cho AttendanceDataRow từ attendance page
interface AttendanceDataRowLike {
  systemId: string;
  employeeSystemId: string;
  employeeId: string;
  fullName: string;
  department?: string;
  workDays: number;
  leaveDays: number;
  absentDays: number;
  lateArrivals: number;
  earlyDepartures: number;
  otHours: number;
  [key: `day_${number}`]: DailyRecordLike | undefined;
}

// ============================================
// CONVERTERS
// ============================================

/**
 * Chuyển đổi danh sách AttendanceDataRow sang AttendanceSheetForPrint
 */
export function convertAttendanceSheetForPrint(
  monthKey: string,
  attendanceData: AttendanceDataRowLike[],
  options: {
    isLocked?: boolean;
    departmentName?: string;
    createdBy?: string;
  } = {}
): AttendanceSheetForPrint {
  const { isLocked, departmentName, createdBy } = options;

  // Calculate totals
  const totalWorkDays = attendanceData.reduce((sum, row) => sum + (row.workDays || 0), 0);
  const totalLeaveDays = attendanceData.reduce((sum, row) => sum + (row.leaveDays || 0), 0);
  const totalAbsentDays = attendanceData.reduce((sum, row) => sum + (row.absentDays || 0), 0);
  const totalLateArrivals = attendanceData.reduce((sum, row) => sum + (row.lateArrivals || 0), 0);
  const totalEarlyDepartures = attendanceData.reduce((sum, row) => sum + (row.earlyDepartures || 0), 0);
  const totalOtHours = attendanceData.reduce((sum, row) => sum + (row.otHours || 0), 0);

  // Convert employees
  const employees: AttendanceEmployeeForPrint[] = attendanceData.map(row => {
    const dailyRecords: Record<string, AttendanceStatus | string> = {};
    const dailyCheckIn: Record<string, string> = {};
    const dailyCheckOut: Record<string, string> = {};
    const dailyOtIn: Record<string, string> = {};
    const dailyOtOut: Record<string, string> = {};
    const dailyNotes: Record<string, string> = {};
    
    // Extract day_1 to day_31
    for (let d = 1; d <= 31; d++) {
      const dayKey = `day_${d}` as keyof AttendanceDataRowLike;
      const record = row[dayKey] as DailyRecordLike | undefined;
      if (record) {
        dailyRecords[`day_${d}`] = record.status;
        if (record.checkIn) dailyCheckIn[`day_${d}`] = record.checkIn;
        if (record.checkOut) dailyCheckOut[`day_${d}`] = record.checkOut;
        if (record.overtimeCheckIn) dailyOtIn[`day_${d}`] = record.overtimeCheckIn;
        if (record.overtimeCheckOut) dailyOtOut[`day_${d}`] = record.overtimeCheckOut;
        if (record.notes) dailyNotes[`day_${d}`] = record.notes;
      }
    }

    return {
      employeeCode: row.employeeId || '',
      employeeName: row.fullName || '',
      departmentName: row.department || '',
      workDays: row.workDays || 0,
      leaveDays: row.leaveDays || 0,
      absentDays: row.absentDays || 0,
      lateArrivals: row.lateArrivals || 0,
      earlyDepartures: row.earlyDepartures || 0,
      otHours: row.otHours || 0,
      dailyRecords,
      dailyCheckIn,
      dailyCheckOut,
      dailyOtIn,
      dailyOtOut,
      dailyNotes,
    };
  });

  const [year, month] = monthKey.split('-').map(Number);

  return {
    monthKey,
    month,
    year,
    departmentName,
    isLocked,
    createdBy,
    totalEmployees: attendanceData.length,
    totalWorkDays,
    totalLeaveDays,
    totalAbsentDays,
    totalLateArrivals,
    totalEarlyDepartures,
    totalOtHours,
    employees,
  };
}

/**
 * Chuyển đổi AttendanceDataRow sang AttendanceDetailForPrint (cho in chi tiết cá nhân)
 */
export function convertAttendanceDetailForPrint(
  monthKey: string,
  row: AttendanceDataRowLike
): AttendanceDetailForPrint {
  const [year, month] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Extract daily details
  const dailyDetails: DailyAttendanceRecord[] = [];
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dayKey = `day_${d}` as keyof AttendanceDataRowLike;
    const record = row[dayKey] as DailyRecordLike | undefined;
    
    if (record) {
      const date = new Date(year, month - 1, d);
      const dayOfWeekMap: Record<number, string> = {
        0: 'CN', 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7',
      };
      
      dailyDetails.push({
        day: d,
        dayOfWeek: dayOfWeekMap[date.getDay()] || '',
        status: record.status,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        overtimeCheckIn: record.overtimeCheckIn,
        overtimeCheckOut: record.overtimeCheckOut,
        notes: record.notes,
      });
    }
  }

  return {
    monthKey,
    employeeCode: row.employeeId || '',
    employeeName: row.fullName || '',
    departmentName: row.department || '',
    workDays: row.workDays || 0,
    leaveDays: row.leaveDays || 0,
    absentDays: row.absentDays || 0,
    lateArrivals: row.lateArrivals || 0,
    earlyDepartures: row.earlyDepartures || 0,
    otHours: row.otHours || 0,
    dailyDetails,
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
  return {
    name: storeInfo?.companyName || storeInfo?.brandName || generalSettings?.companyName || '',
    address: storeInfo?.headquartersAddress || generalSettings?.companyAddress || '',
    phone: storeInfo?.hotline || generalSettings?.phoneNumber || '',
    email: storeInfo?.email || generalSettings?.email || '',
    website: storeInfo?.website,
    taxCode: storeInfo?.taxCode,
    province: storeInfo?.province,
    logo: getStoreLogo(storeInfo?.logo),
  };
}

// Re-export mappers
export {
  mapAttendanceSheetToPrintData,
  mapAttendanceSheetLineItems,
  mapAttendanceDetailToPrintData,
  mapAttendanceDetailLineItems,
};
