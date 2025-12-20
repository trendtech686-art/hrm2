/**
 * Penalty Sync Service
 * Tự động tạo phiếu phạt khi phát hiện đi trễ hoặc về sớm trong chấm công
 */

import { usePenaltyStore } from '../settings/penalties/store';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store';
import type { Penalty } from '../settings/penalties/types';
import type { AttendanceDataRow, DailyRecord, AnyAttendanceDataRow } from './types';
import type { EmployeeSettings } from '../settings/employees/types';
import { asBusinessId, asSystemId, type SystemId, type BusinessId } from '@/lib/id-types';
import { toISODate, getDayOfWeek, isValidDate } from '../../lib/date-utils';
import { getCurrentUserSystemId } from '../../contexts/auth-context';

// Penalty type SystemIds (từ data.ts)
const LATE_ARRIVAL_PENALTY_TYPE = asSystemId('PENTYPE000004'); // Đi làm trễ
const EARLY_LEAVE_PENALTY_TYPE = asSystemId('PENTYPE000006'); // Quên chấm công (có thể tạo mới cho về sớm)

export type ViolationInfo = {
  day: number;
  date: string; // YYYY-MM-DD
  type: 'late' | 'early';
  checkIn?: string;
  checkOut?: string;
  minutesLate?: number;
  minutesEarly?: number;
};

/**
 * Phân tích dữ liệu chấm công để tìm các vi phạm (đi trễ/về sớm)
 */
export function detectViolations(
  row: AnyAttendanceDataRow,
  year: number,
  month: number,
  settings: EmployeeSettings
): ViolationInfo[] {
  const violations: ViolationInfo[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  const workStartParts = settings.workStartTime.split(':').map(Number);
  const workEndParts = settings.workEndTime.split(':').map(Number);
  const workStartMinutes = workStartParts[0] * 60 + workStartParts[1];
  const workEndMinutes = workEndParts[0] * 60 + workEndParts[1];

  for (let d = 1; d <= daysInMonth; d++) {
    const record = row[`day_${d}`] as DailyRecord;
    const workDate = new Date(year, month - 1, d);
    const dayOfWeek = getDayOfWeek(workDate);
    const isWorkingDay = dayOfWeek !== null && settings.workingDays.includes(dayOfWeek);
    const workDateStr = toISODate(workDate);

    if (record && isWorkingDay && record.checkIn && record.checkOut) {
      const checkInTime = new Date(`${workDateStr}T${record.checkIn}`);
      const checkOutTime = new Date(`${workDateStr}T${record.checkOut}`);
      
      if (!isValidDate(checkInTime) || !isValidDate(checkOutTime)) continue;
      
      const checkInMins = checkInTime.getHours() * 60 + checkInTime.getMinutes();
      const checkOutMins = checkOutTime.getHours() * 60 + checkOutTime.getMinutes();
      
      // Kiểm tra đi trễ
      const allowedLateMinutes = workStartMinutes + settings.allowedLateMinutes;
      if (checkInMins > allowedLateMinutes) {
        violations.push({
          day: d,
          date: workDateStr,
          type: 'late',
          checkIn: record.checkIn,
          minutesLate: checkInMins - workStartMinutes,
        });
      }
      
      // Kiểm tra về sớm
      if (checkOutMins < workEndMinutes) {
        violations.push({
          day: d,
          date: workDateStr,
          type: 'early',
          checkOut: record.checkOut,
          minutesEarly: workEndMinutes - checkOutMins,
        });
      }
    }
  }
  
  return violations;
}

/**
 * Tính số tiền phạt dựa trên số phút và bảng mức phạt
 */
function getPenaltyAmount(
  minutes: number,
  tiers: { fromMinutes: number; toMinutes: number | null; amount: number }[]
): number {
  if (!tiers || tiers.length === 0) return 0;
  
  // Sắp xếp tiers theo fromMinutes
  const sortedTiers = [...tiers].sort((a, b) => a.fromMinutes - b.fromMinutes);
  
  for (const tier of sortedTiers) {
    const inRange = minutes >= tier.fromMinutes && 
                    (tier.toMinutes === null || minutes < tier.toMinutes);
    if (inRange) {
      return tier.amount;
    }
  }
  
  // Nếu vượt quá tất cả các mức, lấy mức cao nhất
  const lastTier = sortedTiers[sortedTiers.length - 1];
  if (lastTier && lastTier.toMinutes === null && minutes >= lastTier.fromMinutes) {
    return lastTier.amount;
  }
  
  return 0;
}

/**
 * Tạo phiếu phạt từ các vi phạm đã phát hiện
 * Trả về penalty không có systemId (store sẽ tự tạo)
 */
export function createPenaltiesFromViolations(
  violations: ViolationInfo[],
  employeeSystemId: SystemId,
  employeeName: string,
  settings: EmployeeSettings
): Omit<Penalty, 'systemId'>[] {
  const penalties: Omit<Penalty, 'systemId'>[] = [];
  const now = new Date().toISOString();
  const currentUserStr = getCurrentUserSystemId();
  const currentUser = currentUserStr ? asSystemId(currentUserStr) : undefined;
  
  violations.forEach((violation, index) => {
    const isLate = violation.type === 'late';
    const minutes = isLate ? (violation.minutesLate || 0) : (violation.minutesEarly || 0);
    
    // Tính số tiền phạt theo bảng mức phạt
    const tiers = isLate ? settings.latePenaltyTiers : settings.earlyLeavePenaltyTiers;
    const amount = getPenaltyAmount(minutes, tiers || []);
    
    // Nếu số tiền phạt = 0, không tạo phiếu phạt
    if (amount <= 0) return;
    
    // Không cần tạo ID - store sẽ tự generate với prefix PF đúng chuẩn
    const penalty: Omit<Penalty, 'systemId'> = {
      id: '' as BusinessId, // Store sẽ auto-generate: PF000001, PF000002...
      employeeSystemId,
      employeeName,
      reason: isLate 
        ? `Đi làm trễ ${violation.minutesLate} phút ngày ${violation.date} (vào lúc ${violation.checkIn})`
        : `Về sớm ${violation.minutesEarly} phút ngày ${violation.date} (ra lúc ${violation.checkOut})`,
      amount,
      issueDate: violation.date,
      status: 'Chưa thanh toán',
      issuerName: 'Hệ thống',
      issuerSystemId: currentUser,
      penaltyTypeSystemId: isLate ? LATE_ARRIVAL_PENALTY_TYPE : LATE_ARRIVAL_PENALTY_TYPE,
      penaltyTypeName: isLate ? 'Đi làm trễ' : 'Về sớm',
      category: 'attendance',
      createdAt: now,
      createdBy: currentUser,
    };
    
    penalties.push(penalty);
  });
  
  return penalties;
}

export type PenaltyPreviewItem = Omit<Penalty, 'systemId'> & {
  violation: ViolationInfo;
  isDuplicate: boolean;
  previewId: string; // ID tạm thời để tracking trong UI (không phải BusinessId)
};

/**
 * Preview các phiếu phạt sẽ tạo từ dữ liệu chấm công (không tạo ngay)
 * @returns Danh sách phiếu phạt sẽ tạo (có đánh dấu trùng)
 */
export function previewAttendancePenalties(
  attendanceData: AttendanceDataRow[],
  year: number,
  month: number
): PenaltyPreviewItem[] {
  const settings = useEmployeeSettingsStore.getState().settings;
  const allPenaltiesPreview: PenaltyPreviewItem[] = [];
  
  attendanceData.forEach((row) => {
    const violations = detectViolations(row, year, month, settings);
    
    if (violations.length > 0) {
      const penalties = createPenaltiesFromViolations(
        violations,
        row.employeeSystemId,
        row.fullName,
        settings
      );
      
      // Map mỗi penalty với violation tương ứng và check duplicate
      penalties.forEach((penalty, index) => {
        const violation = violations[index];
        const isDuplicate = hasPenaltyForDate(
          row.employeeSystemId,
          violation.date,
          violation.type
        );
        
        // Tạo previewId tạm thời cho UI tracking
        const previewId = `${row.employeeSystemId}-${violation.date}-${violation.type}`;
        
        allPenaltiesPreview.push({
          ...penalty,
          violation,
          isDuplicate,
          previewId,
        });
      });
    }
  });
  
  return allPenaltiesPreview;
}

/**
 * Tạo các phiếu phạt đã được xác nhận
 * @param penalties Danh sách phiếu phạt đã được user chọn để tạo
 * @returns Số phiếu phạt đã tạo
 */
export function confirmCreatePenalties(
  penalties: Omit<Penalty, 'systemId'>[]
): number {
  const penaltyStore = usePenaltyStore.getState();
  
  penalties.forEach((penalty) => {
    penaltyStore.add(penalty);
  });
  
  return penalties.length;
}

/**
 * Xử lý tự động tạo phiếu phạt từ dữ liệu chấm công
 * @deprecated Sử dụng previewAttendancePenalties + confirmCreatePenalties thay thế
 * @returns Số phiếu phạt đã tạo
 */
export function processAttendancePenalties(
  attendanceData: AttendanceDataRow[],
  year: number,
  month: number
): { created: number; violations: ViolationInfo[] } {
  const settings = useEmployeeSettingsStore.getState().settings;
  const penaltyStore = usePenaltyStore.getState();
  
  let totalCreated = 0;
  const allViolations: ViolationInfo[] = [];
  
  attendanceData.forEach((row) => {
    const violations = detectViolations(row, year, month, settings);
    
    if (violations.length > 0) {
      allViolations.push(...violations);
      
      const penalties = createPenaltiesFromViolations(
        violations,
        row.employeeSystemId,
        row.fullName,
        settings
      );
      
      // Kiểm tra duplicate trước khi thêm
      penalties.forEach((penalty, index) => {
        const violation = violations[index];
        const isDuplicate = hasPenaltyForDate(
          row.employeeSystemId,
          violation.date,
          violation.type
        );
        
        if (!isDuplicate) {
          penaltyStore.add(penalty);
          totalCreated++;
        }
      });
    }
  });
  
  return { created: totalCreated, violations: allViolations };
}

/**
 * Kiểm tra xem đã có phiếu phạt cho ngày này chưa (tránh tạo trùng)
 */
export function hasPenaltyForDate(
  employeeSystemId: SystemId,
  date: string,
  type: 'late' | 'early'
): boolean {
  const penalties = usePenaltyStore.getState().data;
  const reason = type === 'late' ? 'Đi làm trễ' : 'Về sớm';
  
  return penalties.some(
    (p) => 
      p.employeeSystemId === employeeSystemId &&
      p.issueDate === date &&
      p.reason.includes(reason) &&
      p.status !== 'Đã hủy'
  );
}
