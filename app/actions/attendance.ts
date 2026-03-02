'use server'

/**
 * Server Actions for Attendance Management (Chấm công)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createAttendanceSchema, updateAttendanceSchema } from '@/features/attendance/validation'

// Types
type AttendanceRecord = NonNullable<Awaited<ReturnType<typeof prisma.attendanceRecord.findFirst>>>

export type CreateAttendanceInput = {
  employeeId: string
  employeeSystemId?: string
  employeeBusinessId?: string
  fullName?: string
  department?: string
  date: string | Date
  checkIn?: string | Date
  checkOut?: string | Date
  morningCheckOut?: string | Date
  afternoonCheckIn?: string | Date
  overtimeCheckIn?: string | Date
  overtimeCheckOut?: string | Date
  workHours?: number
  status?: string
  notes?: string
}

export type UpdateAttendanceInput = {
  systemId: string
  checkIn?: string | Date | null
  checkOut?: string | Date | null
  morningCheckOut?: string | Date | null
  afternoonCheckIn?: string | Date | null
  overtimeCheckIn?: string | Date | null
  overtimeCheckOut?: string | Date | null
  workHours?: number
  status?: string
  notes?: string
  workDays?: number
  leaveDays?: number
  absentDays?: number
  lateArrivals?: number
  earlyDepartures?: number
  otHours?: number
  otHoursWeekday?: number
  otHoursWeekend?: number
  otHoursHoliday?: number
}

export type BulkCreateAttendanceInput = {
  records: CreateAttendanceInput[]
}

// ====================================
// ACTIONS
// ====================================

export async function createAttendanceAction(
  input: CreateAttendanceInput
): Promise<ActionResult<AttendanceRecord>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  const validated = createAttendanceSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const systemId = await generateIdWithPrefix('CC', prisma)

    const attendance = await prisma.attendanceRecord.create({
      data: {
        systemId,
        employeeId: input.employeeId,
        employeeSystemId: input.employeeSystemId,
        employeeBusinessId: input.employeeBusinessId,
        fullName: input.fullName,
        department: input.department,
        date: new Date(input.date),
        checkIn: input.checkIn ? new Date(input.checkIn) : null,
        checkOut: input.checkOut ? new Date(input.checkOut) : null,
        morningCheckOut: input.morningCheckOut ? new Date(input.morningCheckOut) : null,
        afternoonCheckIn: input.afternoonCheckIn ? new Date(input.afternoonCheckIn) : null,
        overtimeCheckIn: input.overtimeCheckIn ? new Date(input.overtimeCheckIn) : null,
        overtimeCheckOut: input.overtimeCheckOut ? new Date(input.overtimeCheckOut) : null,
        workHours: input.workHours,
        status: input.status as AttendanceRecord['status'] ?? 'PRESENT',
        notes: input.notes,
      },
    })

    revalidatePath('/attendance')
    return { success: true, data: attendance }
  } catch (error) {
    console.error('Error creating attendance:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo chấm công',
    }
  }
}

export async function updateAttendanceAction(
  input: UpdateAttendanceInput
): Promise<ActionResult<AttendanceRecord>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  const validated = updateAttendanceSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const { systemId, ...data } = input

    const existing = await prisma.attendanceRecord.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy chấm công' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.checkIn !== undefined) {
      updateData.checkIn = data.checkIn ? new Date(data.checkIn) : null
    }
    if (data.checkOut !== undefined) {
      updateData.checkOut = data.checkOut ? new Date(data.checkOut) : null
    }
    if (data.morningCheckOut !== undefined) {
      updateData.morningCheckOut = data.morningCheckOut ? new Date(data.morningCheckOut) : null
    }
    if (data.afternoonCheckIn !== undefined) {
      updateData.afternoonCheckIn = data.afternoonCheckIn ? new Date(data.afternoonCheckIn) : null
    }
    if (data.overtimeCheckIn !== undefined) {
      updateData.overtimeCheckIn = data.overtimeCheckIn ? new Date(data.overtimeCheckIn) : null
    }
    if (data.overtimeCheckOut !== undefined) {
      updateData.overtimeCheckOut = data.overtimeCheckOut ? new Date(data.overtimeCheckOut) : null
    }
    if (data.workHours !== undefined) updateData.workHours = data.workHours
    if (data.status !== undefined) updateData.status = data.status
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.workDays !== undefined) updateData.workDays = data.workDays
    if (data.leaveDays !== undefined) updateData.leaveDays = data.leaveDays
    if (data.absentDays !== undefined) updateData.absentDays = data.absentDays
    if (data.lateArrivals !== undefined) updateData.lateArrivals = data.lateArrivals
    if (data.earlyDepartures !== undefined) updateData.earlyDepartures = data.earlyDepartures
    if (data.otHours !== undefined) updateData.otHours = data.otHours
    if (data.otHoursWeekday !== undefined) updateData.otHoursWeekday = data.otHoursWeekday
    if (data.otHoursWeekend !== undefined) updateData.otHoursWeekend = data.otHoursWeekend
    if (data.otHoursHoliday !== undefined) updateData.otHoursHoliday = data.otHoursHoliday

    const attendance = await prisma.attendanceRecord.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/attendance')
    return { success: true, data: attendance }
  } catch (error) {
    console.error('Error updating attendance:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật chấm công',
    }
  }
}

export async function deleteAttendanceAction(
  systemId: string
): Promise<ActionResult<AttendanceRecord>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const attendance = await prisma.attendanceRecord.delete({
      where: { systemId },
    })

    revalidatePath('/attendance')
    return { success: true, data: attendance }
  } catch (error) {
    console.error('Error deleting attendance:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa chấm công',
    }
  }
}

export async function getAttendanceAction(
  systemId: string
): Promise<ActionResult<AttendanceRecord>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const attendance = await prisma.attendanceRecord.findUnique({
      where: { systemId },
      include: { employee: true },
    })

    if (!attendance) {
      return { success: false, error: 'Không tìm thấy chấm công' }
    }

    return { success: true, data: attendance }
  } catch (error) {
    console.error('Error getting attendance:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy chấm công',
    }
  }
}

export async function bulkCreateAttendanceAction(
  input: BulkCreateAttendanceInput
): Promise<ActionResult<{ created: number }>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      let created = 0

      for (const record of input.records) {
        const systemId = await generateIdWithPrefix('CC', tx)

        await tx.attendanceRecord.create({
          data: {
            systemId,
            employeeId: record.employeeId,
            employeeSystemId: record.employeeSystemId,
            employeeBusinessId: record.employeeBusinessId,
            fullName: record.fullName,
            department: record.department,
            date: new Date(record.date),
            checkIn: record.checkIn ? new Date(record.checkIn) : null,
            checkOut: record.checkOut ? new Date(record.checkOut) : null,
            workHours: record.workHours,
            status: record.status as AttendanceRecord['status'] ?? 'PRESENT',
            notes: record.notes,
          },
        })
        created++
      }

      return { created }
    })

    revalidatePath('/attendance')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error bulk creating attendance:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo hàng loạt chấm công',
    }
  }
}

export async function checkInAction(
  employeeId: string,
  employeeName?: string
): Promise<ActionResult<AttendanceRecord>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if record exists for today
    const existing = await prisma.attendanceRecord.findFirst({
      where: {
        employeeId,
        date: today,
      },
    })

    if (existing) {
      // Update check-in time
      const attendance = await prisma.attendanceRecord.update({
        where: { systemId: existing.systemId },
        data: { checkIn: new Date() },
      })
      revalidatePath('/attendance')
      return { success: true, data: attendance }
    }

    // Create new record
    const systemId = await generateIdWithPrefix('CC', prisma)
    const attendance = await prisma.attendanceRecord.create({
      data: {
        systemId,
        employeeId,
        fullName: employeeName,
        date: today,
        checkIn: new Date(),
        status: 'PRESENT',
      },
    })

    revalidatePath('/attendance')
    return { success: true, data: attendance }
  } catch (error) {
    console.error('Error checking in:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể chấm công vào',
    }
  }
}

export async function checkOutAction(
  employeeId: string
): Promise<ActionResult<AttendanceRecord>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existing = await prisma.attendanceRecord.findFirst({
      where: {
        employeeId,
        date: today,
      },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy chấm công hôm nay' }
    }

    // Calculate work hours
    const checkIn = existing.checkIn
    const checkOut = new Date()
    let workHours = 0

    if (checkIn) {
      workHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
    }

    const attendance = await prisma.attendanceRecord.update({
      where: { systemId: existing.systemId },
      data: {
        checkOut,
        workHours,
      },
    })

    revalidatePath('/attendance')
    return { success: true, data: attendance }
  } catch (error) {
    console.error('Error checking out:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể chấm công ra',
    }
  }
}
