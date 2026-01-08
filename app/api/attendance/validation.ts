/**
 * API Validation Schemas for Attendance
 */
import { z } from 'zod'

// Query params for listing
export const listAttendanceSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  employeeId: z.string().optional(),
  date: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  status: z.string().optional(),
})

// Create/update attendance schema
export const createAttendanceSchema = z.object({
  employeeId: z.string().optional(),
  date: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  // Bulk save action
  action: z.string().optional(),
  monthKey: z.string().optional(),
  data: z.array(z.any()).optional(),
  employeeSystemId: z.string().optional(),
  dayKey: z.string().optional(),
  record: z.any().optional(),
  records: z.array(z.any()).optional(),
})

// Update attendance schema
export const updateAttendanceSchema = createAttendanceSchema.partial()

export type ListAttendanceInput = z.infer<typeof listAttendanceSchema>
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>
