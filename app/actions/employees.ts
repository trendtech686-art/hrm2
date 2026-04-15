'use server'

/**
 * Server Actions for Employees Management (Nhân viên)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import type { ActionResult } from '@/types/action-result'
import { employeeFormValidationSchema } from '@/features/employees/validation'
import { logError } from '@/lib/logger'
import { requireActionPermission, serializeDecimals } from '@/lib/api-utils'
import { hasPermission } from '@/features/employees/permissions'
import { getSessionUserName } from '@/lib/get-user-name'

/** Convert a date value to a valid Date or null (rejects Invalid Date) */
const toSafeDate = (value: string | Date | null | undefined): Date | null => {
  if (!value) return null
  
  // If already a Date object
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value
  }
  
  // Try to parse dd/MM/yyyy format (Vietnamese format)
  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/').map(Number)
    const d = new Date(year, month - 1, day) // month is 0-indexed
    return isNaN(d.getTime()) ? null : d
  }
  
  // Try ISO format or other formats
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

// Types
type Employee = NonNullable<Awaited<ReturnType<typeof prisma.employee.findFirst>>>

export type CreateEmployeeInput = {
  fullName: string
  dob?: string | Date
  placeOfBirth?: string
  gender?: string
  phone?: string
  personalEmail?: string
  workEmail?: string
  nationalId?: string
  nationalIdIssueDate?: string | Date
  nationalIdIssuePlace?: string
  avatarUrl?: string
  permanentAddress?: unknown
  temporaryAddress?: unknown
  departmentId?: string
  jobTitleId?: string
  branchId?: string
  managerId?: string
  hireDate?: string | Date
  startDate?: string | Date
  employeeType?: string
  role?: string
  baseSalary?: number
  socialInsuranceSalary?: number
  positionAllowance?: number
  mealAllowance?: number
  otherAllowances?: number
  numberOfDependents?: number
  contractNumber?: string
  contractStartDate?: string | Date
  contractEndDate?: string | Date
  contractType?: string
  probationEndDate?: string | Date
  bankAccountNumber?: string
  bankName?: string
  bankBranch?: string
  personalTaxId?: string
  socialInsuranceNumber?: string
  annualLeaveBalance?: number
  notes?: string
  maritalStatus?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  workingHoursPerDay?: number
  workingDaysPerWeek?: number
  shiftType?: string
  skills?: unknown
  certifications?: unknown
  createdBy?: string
}

export type UpdateEmployeeInput = {
  systemId: string
  fullName?: string
  dob?: string | Date | null
  placeOfBirth?: string
  gender?: string
  phone?: string
  personalEmail?: string
  workEmail?: string
  nationalId?: string
  nationalIdIssueDate?: string | Date | null
  nationalIdIssuePlace?: string
  avatarUrl?: string
  permanentAddress?: unknown
  temporaryAddress?: unknown
  departmentId?: string | null
  jobTitleId?: string | null
  branchId?: string | null
  managerId?: string | null
  hireDate?: string | Date | null
  startDate?: string | Date | null
  endDate?: string | Date | null
  terminationDate?: string | Date | null
  reasonForLeaving?: string
  employeeType?: string
  employmentStatus?: string
  role?: string
  baseSalary?: number
  socialInsuranceSalary?: number
  positionAllowance?: number
  mealAllowance?: number
  otherAllowances?: number
  numberOfDependents?: number
  contractNumber?: string
  contractStartDate?: string | Date | null
  contractEndDate?: string | Date | null
  contractType?: string
  probationEndDate?: string | Date | null
  bankAccountNumber?: string
  bankName?: string
  bankBranch?: string
  personalTaxId?: string
  socialInsuranceNumber?: string
  annualLeaveBalance?: number
  notes?: string
  maritalStatus?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  workingHoursPerDay?: number
  workingDaysPerWeek?: number
  shiftType?: string
  performanceRating?: string
  lastReviewDate?: string | Date | null
  nextReviewDate?: string | Date | null
  skills?: unknown
  certifications?: unknown
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createEmployeeAction(
  input: CreateEmployeeInput
): Promise<ActionResult<Employee>> {
  const authResult = await requireActionPermission('create_employees')
  if (!authResult.success) return authResult
  const validated = employeeFormValidationSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const systemId = await generateIdWithPrefix('NV', prisma)

    const employee = await prisma.employee.create({
      data: {
        systemId,
        id: systemId,
        fullName: input.fullName,
        dob: toSafeDate(input.dob),
        placeOfBirth: input.placeOfBirth,
        gender: (input.gender as 'MALE' | 'FEMALE' | 'OTHER') ?? 'OTHER',
        phone: input.phone,
        personalEmail: input.personalEmail,
        workEmail: input.workEmail,
        nationalId: input.nationalId,
        nationalIdIssueDate: toSafeDate(input.nationalIdIssueDate),
        nationalIdIssuePlace: input.nationalIdIssuePlace,
        avatarUrl: input.avatarUrl,
        permanentAddress: input.permanentAddress as never,
        temporaryAddress: input.temporaryAddress as never,
        departmentId: input.departmentId,
        jobTitleId: input.jobTitleId,
        branchId: input.branchId,
        managerId: input.managerId,
        hireDate: toSafeDate(input.hireDate),
        startDate: toSafeDate(input.startDate),
        employeeType: (input.employeeType as 'FULLTIME' | 'PARTTIME' | 'PROBATION' | 'INTERN') ?? 'FULLTIME',
        role: input.role ?? 'Nhân viên',
        baseSalary: input.baseSalary,
        socialInsuranceSalary: input.socialInsuranceSalary,
        positionAllowance: input.positionAllowance,
        mealAllowance: input.mealAllowance,
        otherAllowances: input.otherAllowances,
        numberOfDependents: input.numberOfDependents,
        contractNumber: input.contractNumber,
        contractStartDate: toSafeDate(input.contractStartDate),
        contractEndDate: toSafeDate(input.contractEndDate),
        contractType: input.contractType as never,
        probationEndDate: toSafeDate(input.probationEndDate),
        bankAccountNumber: input.bankAccountNumber,
        bankName: input.bankName,
        bankBranch: input.bankBranch,
        personalTaxId: input.personalTaxId,
        socialInsuranceNumber: input.socialInsuranceNumber,
        annualLeaveBalance: input.annualLeaveBalance ?? 12,
        notes: input.notes,
        maritalStatus: input.maritalStatus,
        emergencyContactName: input.emergencyContactName,
        emergencyContactPhone: input.emergencyContactPhone,
        workingHoursPerDay: input.workingHoursPerDay ?? 8,
        workingDaysPerWeek: input.workingDaysPerWeek ?? 5,
        shiftType: input.shiftType,
        skills: input.skills as never,
        certifications: input.certifications as never,
        createdBy: input.createdBy,
      },
    })

    // Log activity for creation
    const userName = getSessionUserName(authResult.session);
    prisma.activityLog.create({
      data: {
        entityType: 'employee',
        entityId: employee.systemId,
        action: 'created',
        actionType: 'create',
        note: `Tạo nhân viên mới: ${input.fullName} (${employee.id || employee.systemId})`,
        metadata: { userName },
        createdBy: userName,
      },
    }).catch(e => console.error('Activity log failed:', e))

    revalidatePath('/employees')
    return { success: true, data: serializeDecimals(employee) }
  } catch (error) {
    logError('Error creating employee', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo nhân viên',
    }
  }
}

export async function updateEmployeeAction(
  input: UpdateEmployeeInput
): Promise<ActionResult<Employee>> {
  const authResult = await requireActionPermission('edit_employees')
  if (!authResult.success) return authResult
  const validated = employeeFormValidationSchema.partial().safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const { systemId, ...data } = input

    const existing = await prisma.employee.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy nhân viên' }
    }

    // Helper: Compare dates by date-part only (ignore time/timezone)
    const isSameDateValue = (newVal: string | Date | null | undefined, existingVal: Date | null | undefined): boolean => {
      if (!newVal && !existingVal) return true
      if (!newVal || !existingVal) return false
      const newDate = toSafeDate(newVal)
      if (!newDate) return !existingVal
      // Compare YYYY-MM-DD only
      const newDateStr = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`
      const existingDateStr = `${existingVal.getFullYear()}-${String(existingVal.getMonth() + 1).padStart(2, '0')}-${String(existingVal.getDate()).padStart(2, '0')}`
      return newDateStr === existingDateStr
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.fullName !== undefined) updateData.fullName = data.fullName
    // Only update dates if they actually changed (compare date part only)
    if (data.dob !== undefined && !isSameDateValue(data.dob, existing.dob)) {
      updateData.dob = toSafeDate(data.dob)
    }
    if (data.placeOfBirth !== undefined) updateData.placeOfBirth = data.placeOfBirth
    if (data.gender !== undefined) updateData.gender = data.gender
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.personalEmail !== undefined) updateData.personalEmail = data.personalEmail
    if (data.workEmail !== undefined) updateData.workEmail = data.workEmail
    if (data.nationalId !== undefined) updateData.nationalId = data.nationalId
    if (data.nationalIdIssueDate !== undefined && !isSameDateValue(data.nationalIdIssueDate, existing.nationalIdIssueDate)) {
      updateData.nationalIdIssueDate = toSafeDate(data.nationalIdIssueDate)
    }
    if (data.nationalIdIssuePlace !== undefined) updateData.nationalIdIssuePlace = data.nationalIdIssuePlace
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl
    if (data.permanentAddress !== undefined) updateData.permanentAddress = data.permanentAddress
    if (data.temporaryAddress !== undefined) updateData.temporaryAddress = data.temporaryAddress
    if (data.departmentId !== undefined) updateData.departmentId = data.departmentId
    if (data.jobTitleId !== undefined) updateData.jobTitleId = data.jobTitleId
    if (data.branchId !== undefined) updateData.branchId = data.branchId
    if (data.managerId !== undefined) updateData.managerId = data.managerId
    if (data.hireDate !== undefined && !isSameDateValue(data.hireDate, existing.hireDate)) {
      updateData.hireDate = toSafeDate(data.hireDate)
    }
    if (data.startDate !== undefined && !isSameDateValue(data.startDate, existing.startDate)) {
      updateData.startDate = toSafeDate(data.startDate)
    }
    if (data.endDate !== undefined && !isSameDateValue(data.endDate, existing.endDate)) {
      updateData.endDate = toSafeDate(data.endDate)
    }
    if (data.terminationDate !== undefined && !isSameDateValue(data.terminationDate, existing.terminationDate)) {
      updateData.terminationDate = toSafeDate(data.terminationDate)
    }
    if (data.reasonForLeaving !== undefined) updateData.reasonForLeaving = data.reasonForLeaving
    if (data.employeeType !== undefined) updateData.employeeType = data.employeeType
    if (data.employmentStatus !== undefined) updateData.employmentStatus = data.employmentStatus
    // Role changes require manage_roles permission (privilege escalation prevention)
    if (data.role !== undefined && data.role !== existing.role) {
      if (!hasPermission(authResult.session.user.role, 'manage_roles')) {
        return { success: false, error: 'Bạn không có quyền thay đổi vai trò nhân viên' }
      }
      updateData.role = data.role
    }
    if (data.baseSalary !== undefined) updateData.baseSalary = data.baseSalary
    if (data.socialInsuranceSalary !== undefined) updateData.socialInsuranceSalary = data.socialInsuranceSalary
    if (data.positionAllowance !== undefined) updateData.positionAllowance = data.positionAllowance
    if (data.mealAllowance !== undefined) updateData.mealAllowance = data.mealAllowance
    if (data.otherAllowances !== undefined) updateData.otherAllowances = data.otherAllowances
    if (data.numberOfDependents !== undefined) updateData.numberOfDependents = data.numberOfDependents
    if (data.contractNumber !== undefined) updateData.contractNumber = data.contractNumber
    if (data.contractStartDate !== undefined && !isSameDateValue(data.contractStartDate, existing.contractStartDate)) {
      updateData.contractStartDate = toSafeDate(data.contractStartDate)
    }
    if (data.contractEndDate !== undefined && !isSameDateValue(data.contractEndDate, existing.contractEndDate)) {
      updateData.contractEndDate = toSafeDate(data.contractEndDate)
    }
    if (data.contractType !== undefined) updateData.contractType = data.contractType
    if (data.probationEndDate !== undefined && !isSameDateValue(data.probationEndDate, existing.probationEndDate)) {
      updateData.probationEndDate = toSafeDate(data.probationEndDate)
    }
    if (data.bankAccountNumber !== undefined) updateData.bankAccountNumber = data.bankAccountNumber
    if (data.bankName !== undefined) updateData.bankName = data.bankName
    if (data.bankBranch !== undefined) updateData.bankBranch = data.bankBranch
    if (data.personalTaxId !== undefined) updateData.personalTaxId = data.personalTaxId
    if (data.socialInsuranceNumber !== undefined) updateData.socialInsuranceNumber = data.socialInsuranceNumber
    if (data.annualLeaveBalance !== undefined) updateData.annualLeaveBalance = data.annualLeaveBalance
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.maritalStatus !== undefined) updateData.maritalStatus = data.maritalStatus
    if (data.emergencyContactName !== undefined) updateData.emergencyContactName = data.emergencyContactName
    if (data.emergencyContactPhone !== undefined) updateData.emergencyContactPhone = data.emergencyContactPhone
    if (data.workingHoursPerDay !== undefined) updateData.workingHoursPerDay = data.workingHoursPerDay
    if (data.workingDaysPerWeek !== undefined) updateData.workingDaysPerWeek = data.workingDaysPerWeek
    if (data.shiftType !== undefined) updateData.shiftType = data.shiftType
    if (data.performanceRating !== undefined) updateData.performanceRating = data.performanceRating
    if (data.lastReviewDate !== undefined && !isSameDateValue(data.lastReviewDate, existing.lastReviewDate)) {
      updateData.lastReviewDate = toSafeDate(data.lastReviewDate)
    }
    if (data.nextReviewDate !== undefined && !isSameDateValue(data.nextReviewDate, existing.nextReviewDate)) {
      updateData.nextReviewDate = toSafeDate(data.nextReviewDate)
    }
    if (data.skills !== undefined) updateData.skills = data.skills
    if (data.certifications !== undefined) updateData.certifications = data.certifications
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const employee = await prisma.employee.update({
      where: { systemId },
      data: updateData,
    })

    // Sync employee → users khi thay đổi workEmail, employmentStatus
    const userSyncData: Record<string, unknown> = {}
    if (data.workEmail !== undefined && data.workEmail !== existing.workEmail && data.workEmail) {
      userSyncData.email = data.workEmail
    }
    if (data.employmentStatus !== undefined && data.employmentStatus !== existing.employmentStatus) {
      userSyncData.isActive = data.employmentStatus === 'ACTIVE' || data.employmentStatus === 'ON_LEAVE'
    }
    if (Object.keys(userSyncData).length > 0) {
      await prisma.user.updateMany({
        where: { employeeId: systemId },
        data: userSyncData,
      })
    }

    // Log activity: compute changed fields
    {
      // Helper to normalize values for comparison
      // Treats null, undefined, "", [], {} as equivalent "empty" to avoid false changes
      const isEmptyValue = (val: unknown): boolean => {
        if (val === null || val === undefined) return true;
        if (typeof val === 'string' && val.trim() === '') return true;
        if (Array.isArray(val) && val.length === 0) return true;
        if (typeof val === 'object' && val !== null && !(val instanceof Date) && Object.keys(val).length === 0) return true;
        return false;
      };
      const normalizeForCompare = (val: unknown): string => {
        if (isEmptyValue(val)) return 'null';
        if (val instanceof Date) {
          return val.toISOString().split('T')[0]; // Only compare date part
        }
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
          return val.split('T')[0]; // Only compare date part
        }
        if (typeof val === 'number') return String(val);
        return JSON.stringify(val);
      };
      
      const changes: Record<string, { from: unknown; to: unknown }> = {}
      for (const key of Object.keys(updateData)) {
        const oldVal = (existing as Record<string, unknown>)[key]
        const newVal = (employee as Record<string, unknown>)[key]
        // Compare normalized values to handle Date timezone differences
        if (normalizeForCompare(oldVal) !== normalizeForCompare(newVal)) {
          changes[key] = { from: oldVal ?? null, to: newVal ?? null }
        }
      }
      if (Object.keys(changes).length > 0) {
        const fieldLabels: Record<string, string> = {
          firstName: 'Tên', lastName: 'Họ', fullName: 'Họ tên',
          gender: 'Giới tính', dob: 'Ngày sinh', dateOfBirth: 'Ngày sinh', 
          phone: 'Điện thoại', placeOfBirth: 'Nơi sinh',
          personalEmail: 'Email cá nhân', workEmail: 'Email công việc',
          nationalId: 'Số CCCD/CMND', nationalIdIssueDate: 'Ngày cấp CCCD', 
          nationalIdIssuePlace: 'Nơi cấp CCCD', avatarUrl: 'Ảnh đại diện',
          permanentAddress: 'Địa chỉ thường trú', temporaryAddress: 'Địa chỉ tạm trú',
          departmentId: 'Phòng ban', jobTitleId: 'Chức danh', branchId: 'Chi nhánh',
          managerId: 'Quản lý trực tiếp', hireDate: 'Ngày vào làm', startDate: 'Ngày bắt đầu',
          employeeType: 'Loại nhân viên', role: 'Vai trò hệ thống',
          baseSalary: 'Lương cơ bản', socialInsuranceSalary: 'Lương đóng BHXH',
          positionAllowance: 'Phụ cấp chức vụ', mealAllowance: 'Phụ cấp ăn trưa',
          otherAllowances: 'Phụ cấp khác', numberOfDependents: 'Số người phụ thuộc',
          contractNumber: 'Số hợp đồng', contractStartDate: 'Ngày bắt đầu HĐ',
          contractEndDate: 'Ngày hết hạn HĐ', contractType: 'Loại hợp đồng',
          probationEndDate: 'Ngày kết thúc thử việc', terminationDate: 'Ngày nghỉ việc',
          bankAccountNumber: 'Số tài khoản ngân hàng', bankName: 'Ngân hàng', bankBranch: 'Chi nhánh NH',
          personalTaxId: 'Mã số thuế cá nhân', socialInsuranceNumber: 'Số sổ BHXH',
          employmentStatus: 'Trạng thái làm việc', annualLeaveBalance: 'Số ngày phép còn lại',
          maritalStatus: 'Tình trạng hôn nhân', notes: 'Ghi chú',
          emergencyContactName: 'Liên hệ khẩn cấp', emergencyContactPhone: 'SĐT liên hệ khẩn cấp',
          workingHoursPerDay: 'Giờ làm/ngày', workingDaysPerWeek: 'Ngày làm/tuần',
          shiftType: 'Ca làm việc', skills: 'Kỹ năng', certifications: 'Chứng chỉ',
          performanceRating: 'Đánh giá hiệu suất', lastReviewDate: 'Ngày đánh giá gần nhất',
          nextReviewDate: 'Ngày đánh giá tiếp theo',
        };

        // Convert changes to Vietnamese keys
        const changesVi: Record<string, { from: unknown; to: unknown }> = {}
        for (const [key, value] of Object.entries(changes)) {
          const label = fieldLabels[key] || key
          changesVi[label] = value
        }

        const changedFieldNames = Object.keys(changes)
          .map(k => fieldLabels[k] || k)
          .slice(0, 5);
        const suffix = Object.keys(changes).length > 5 ? ` và ${Object.keys(changes).length - 5} trường khác` : '';
        const note = `Cập nhật nhân viên: ${existing.fullName}: ${changedFieldNames.join(', ')}${suffix}`;
        
        const userName = getSessionUserName(authResult.session);
        
        prisma.activityLog.create({
          data: {
            entityType: 'employee',
            entityId: systemId,
            action: 'updated',
            actionType: 'update',
            changes: JSON.parse(JSON.stringify(changesVi)),
            note,
            metadata: { userName },
            createdBy: userName,
          },
        }).catch(e => console.error('Activity log failed:', e))

        // Also log role changes under 'user' entityType for the employee-roles settings page
        if (changes.role) {
          const roleLabelsVi: Record<string, string> = {
            Admin: 'Quản trị viên', Manager: 'Quản lý', Sales: 'Kinh doanh', Warehouse: 'Kho',
          }
          const fromLabel = roleLabelsVi[String(changes.role.from)] ?? String(changes.role.from ?? '(không)')
          const toLabel = roleLabelsVi[String(changes.role.to)] ?? String(changes.role.to)
          prisma.activityLog.create({
            data: {
              entityType: 'user',
              entityId: systemId,
              action: 'updated',
              actionType: 'update',
              changes: JSON.parse(JSON.stringify({ 'Vai trò': { from: fromLabel, to: toLabel } })),
              note: `Thay đổi vai trò ${existing.fullName}: ${fromLabel} → ${toLabel}`,
              metadata: { userName, employeeName: existing.fullName },
              createdBy: userName,
            },
          }).catch(e => console.error('Activity log failed:', e))
        }
      }
    }

    revalidatePath('/employees')
    revalidatePath(`/employees/${systemId}`)
    return { success: true, data: serializeDecimals(employee) }
  } catch (error) {
    logError('Error updating employee', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật nhân viên',
    }
  }
}

export async function deleteEmployeeAction(
  systemId: string
): Promise<ActionResult<Employee>> {
  const authResult = await requireActionPermission('delete_employees')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.employee.findUnique({ where: { systemId }, select: { fullName: true, id: true } });
    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        employmentStatus: 'TERMINATED',
      },
    })

    // Sync: deactivate linked user account
    await prisma.user.updateMany({
      where: { employeeId: systemId },
      data: { isActive: false },
    })

    // Log activity for deletion
    const userName = getSessionUserName(authResult.session);
    prisma.activityLog.create({
      data: {
        entityType: 'employee',
        entityId: systemId,
        action: 'deleted',
        actionType: 'delete',
        note: `Xóa nhân viên: ${existing?.fullName || ''} (${existing?.id || systemId})`,
        metadata: { userName },
        createdBy: userName,
      },
    }).catch(e => console.error('Activity log failed:', e))

    revalidatePath('/employees')
    return { success: true, data: serializeDecimals(employee) }
  } catch (error) {
    logError('Error deleting employee', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa nhân viên',
    }
  }
}

export async function restoreEmployeeAction(
  systemId: string
): Promise<ActionResult<Employee>> {
  const authResult = await requireActionPermission('edit_employees')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.employee.findUnique({ where: { systemId }, select: { fullName: true, id: true } });
    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
        employmentStatus: 'ACTIVE',
      },
    })

    // Sync: reactivate linked user account
    await prisma.user.updateMany({
      where: { employeeId: systemId },
      data: { isActive: true },
    })

    // Log activity for restoration
    const userName = getSessionUserName(authResult.session);
    prisma.activityLog.create({
      data: {
        entityType: 'employee',
        entityId: systemId,
        action: 'restored',
        actionType: 'update',
        note: `Khôi phục nhân viên: ${existing?.fullName || ''} (${existing?.id || systemId})`,
        metadata: { userName },
        createdBy: userName,
      },
    }).catch(e => console.error('Activity log failed:', e))

    revalidatePath('/employees')
    return { success: true, data: serializeDecimals(employee) }
  } catch (error) {
    logError('Error restoring employee', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể khôi phục nhân viên',
    }
  }
}

export async function getEmployeeAction(
  systemId: string
): Promise<ActionResult<Employee>> {
  const authResult = await requireActionPermission('view_employees')
  if (!authResult.success) return authResult
  try {
    const employee = await prisma.employee.findUnique({
      where: { systemId },
      include: {
        department: true,
        jobTitle: true,
        branch: true,
        manager: true,
      },
    })

    if (!employee) {
      return { success: false, error: 'Không tìm thấy nhân viên' }
    }

    return { success: true, data: serializeDecimals(employee) }
  } catch (error) {
    logError('Error getting employee', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy thông tin nhân viên',
    }
  }
}

export async function terminateEmployeeAction(
  systemId: string,
  reason?: string,
  terminationDate?: string | Date
): Promise<ActionResult<Employee>> {
  const authResult = await requireActionPermission('edit_employees')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.employee.findUnique({
      where: { systemId },
      select: { fullName: true, id: true, employmentStatus: true },
    })
    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        employmentStatus: 'TERMINATED',
        terminationDate: terminationDate ? new Date(terminationDate) : new Date(),
        reasonForLeaving: reason,
        endDate: terminationDate ? new Date(terminationDate) : new Date(),
      },
    })

    // Sync: deactivate linked user account
    await prisma.user.updateMany({
      where: { employeeId: systemId },
      data: { isActive: false },
    })

    // Log activity for termination
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'employee',
        entityId: systemId,
        action: 'updated',
        actionType: 'update',
        note: `Chấm dứt hợp đồng nhân viên: ${existing?.fullName || ''} (${existing?.id || systemId})`,
        changes: {
          'Trạng thái': { from: existing?.employmentStatus || '', to: 'TERMINATED' },
          ...(reason ? { 'Lý do nghỉ việc': { from: '', to: reason } } : {}),
        },
        metadata: { userName },
        createdBy: userName,
      },
    }).catch(e => console.error('Activity log failed:', e))

    revalidatePath('/employees')
    revalidatePath(`/employees/${systemId}`)
    return { success: true, data: employee }
  } catch (error) {
    logError('Error terminating employee', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể chấm dứt hợp đồng nhân viên',
    }
  }
}
