/**
 * Zod validation schemas for attendance module
 */
import { z } from 'zod';
import { systemIdSchema } from '@/lib/id-types';

// Status enum
export const attendanceStatusSchema = z.enum([
  'present',
  'absent',
  'late',
  'early_leave',
  'half_day',
  'leave',
  'holiday',
  'weekend'
]);

// Daily record schema
export const dailyRecordSchema = z.object({
  status: attendanceStatusSchema,
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  morningCheckOut: z.string().optional(),
  afternoonCheckIn: z.string().optional(),
  overtimeCheckIn: z.string().optional(),
  overtimeCheckOut: z.string().optional(),
  notes: z.string().optional(),
  leaveType: z.string().optional(),
});

// Create attendance schema
export const createAttendanceSchema = z.object({
  employeeSystemId: systemIdSchema,
  employeeId: z.string().optional(),
  fullName: z.string().optional(),
  department: z.string().optional(),
  monthKey: z.string().regex(/^\d{4}-\d{2}$/, 'Định dạng tháng không hợp lệ (yyyy-MM)'),
  records: z.record(z.string(), dailyRecordSchema),
});

// Update attendance schema
export const updateAttendanceSchema = createAttendanceSchema.partial();

// Bulk update schema
export const bulkUpdateAttendanceSchema = z.object({
  updates: z.array(z.object({
    employeeSystemId: systemIdSchema,
    day: z.number().int().min(1).max(31),
    record: dailyRecordSchema,
  })),
});

// Lock month schema
export const lockMonthSchema = z.object({
  monthKey: z.string().regex(/^\d{4}-\d{2}$/, 'Định dạng tháng không hợp lệ (yyyy-MM)'),
  locked: z.boolean(),
});

// Filter schema
export const attendanceFiltersSchema = z.object({
  employeeSystemId: z.string().optional(),
  department: z.string().optional(),
  monthKey: z.string().optional(),
  status: attendanceStatusSchema.optional(),
});

// Types
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;
export type DailyRecord = z.infer<typeof dailyRecordSchema>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type BulkUpdateAttendanceInput = z.infer<typeof bulkUpdateAttendanceSchema>;
export type LockMonthInput = z.infer<typeof lockMonthSchema>;
export type AttendanceFilters = z.infer<typeof attendanceFiltersSchema>;
