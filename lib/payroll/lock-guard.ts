/**
 * Payroll Lock Guard — Policy chung cho việc khóa bảng lương.
 *
 * Strict policy (đồng ý với anh):
 * - Trạng thái ∈ {`COMPLETED`, `PAID`} → **không ai** được sửa/xoá phiếu hoặc batch.
 * - Muốn sửa phải huỷ toàn bộ kỳ (endpoint `/cancel`, chỉ chạy khi `DRAFT`/`PROCESSING`)
 *   và chạy lại từ đầu.
 *
 * Đặt một nơi để mọi API mutate đều đi qua cùng một cổng check, tránh drift.
 */

import type { PayrollStatus } from '@/generated/prisma/client';

/** Trạng thái đã "khoá" — không cho phép bất kỳ mutation nào. */
export const LOCKED_PAYROLL_STATUSES = ['COMPLETED', 'PAID'] as const satisfies readonly PayrollStatus[];

export type LockedPayrollStatus = (typeof LOCKED_PAYROLL_STATUSES)[number];

export function isPayrollLocked(status: PayrollStatus | string | null | undefined): status is LockedPayrollStatus {
  if (!status) return false;
  return (LOCKED_PAYROLL_STATUSES as readonly string[]).includes(status);
}

/**
 * Thông điệp lỗi Tiếng Việt chuẩn khi bị chặn bởi lock.
 */
export function lockedPayrollMessage(status: PayrollStatus | string): string {
  const label = status === 'PAID' ? 'đã chi trả' : 'đã chốt';
  return `Kỳ lương ${label}. Không thể chỉnh sửa. Muốn sửa, hãy huỷ kỳ (yêu cầu trạng thái Nháp/Đang duyệt) rồi chạy lại.`;
}

/**
 * Month key helper: `YYYY-MM` từ year+month, khớp với `AttendanceLock.monthKey`.
 */
export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}
