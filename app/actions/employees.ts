'use server'

/**
 * Server Actions for Employees Management (Nhân viên)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { employeeFormValidationSchema } from '@/features/employees/validation'

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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
        dob: input.dob ? new Date(input.dob) : null,
        placeOfBirth: input.placeOfBirth,
        gender: (input.gender as 'MALE' | 'FEMALE' | 'OTHER') ?? 'OTHER',
        phone: input.phone,
        personalEmail: input.personalEmail,
        workEmail: input.workEmail,
        nationalId: input.nationalId,
        nationalIdIssueDate: input.nationalIdIssueDate ? new Date(input.nationalIdIssueDate) : null,
        nationalIdIssuePlace: input.nationalIdIssuePlace,
        avatarUrl: input.avatarUrl,
        permanentAddress: input.permanentAddress as never,
        temporaryAddress: input.temporaryAddress as never,
        departmentId: input.departmentId,
        jobTitleId: input.jobTitleId,
        branchId: input.branchId,
        managerId: input.managerId,
        hireDate: input.hireDate ? new Date(input.hireDate) : null,
        startDate: input.startDate ? new Date(input.startDate) : null,
        employeeType: (input.employeeType as 'FULLTIME' | 'PARTTIME' | 'PROBATION' | 'INTERN') ?? 'FULLTIME',
        role: input.role ?? 'Nhân viên',
        baseSalary: input.baseSalary,
        socialInsuranceSalary: input.socialInsuranceSalary,
        positionAllowance: input.positionAllowance,
        mealAllowance: input.mealAllowance,
        otherAllowances: input.otherAllowances,
        numberOfDependents: input.numberOfDependents,
        contractNumber: input.contractNumber,
        contractStartDate: input.contractStartDate ? new Date(input.contractStartDate) : null,
        contractEndDate: input.contractEndDate ? new Date(input.contractEndDate) : null,
        contractType: input.contractType as never,
        probationEndDate: input.probationEndDate ? new Date(input.probationEndDate) : null,
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

    revalidatePath('/employees')
    return { success: true, data: employee }
  } catch (error) {
    console.error('Error creating employee:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo nhân viên',
    }
  }
}

export async function updateEmployeeAction(
  input: UpdateEmployeeInput
): Promise<ActionResult<Employee>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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

    const updateData: Record<string, unknown> = {}
    
    if (data.fullName !== undefined) updateData.fullName = data.fullName
    if (data.dob !== undefined) updateData.dob = data.dob ? new Date(data.dob) : null
    if (data.placeOfBirth !== undefined) updateData.placeOfBirth = data.placeOfBirth
    if (data.gender !== undefined) updateData.gender = data.gender
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.personalEmail !== undefined) updateData.personalEmail = data.personalEmail
    if (data.workEmail !== undefined) updateData.workEmail = data.workEmail
    if (data.nationalId !== undefined) updateData.nationalId = data.nationalId
    if (data.nationalIdIssueDate !== undefined) {
      updateData.nationalIdIssueDate = data.nationalIdIssueDate ? new Date(data.nationalIdIssueDate) : null
    }
    if (data.nationalIdIssuePlace !== undefined) updateData.nationalIdIssuePlace = data.nationalIdIssuePlace
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl
    if (data.permanentAddress !== undefined) updateData.permanentAddress = data.permanentAddress
    if (data.temporaryAddress !== undefined) updateData.temporaryAddress = data.temporaryAddress
    if (data.departmentId !== undefined) updateData.departmentId = data.departmentId
    if (data.jobTitleId !== undefined) updateData.jobTitleId = data.jobTitleId
    if (data.branchId !== undefined) updateData.branchId = data.branchId
    if (data.managerId !== undefined) updateData.managerId = data.managerId
    if (data.hireDate !== undefined) updateData.hireDate = data.hireDate ? new Date(data.hireDate) : null
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null
    if (data.terminationDate !== undefined) {
      updateData.terminationDate = data.terminationDate ? new Date(data.terminationDate) : null
    }
    if (data.reasonForLeaving !== undefined) updateData.reasonForLeaving = data.reasonForLeaving
    if (data.employeeType !== undefined) updateData.employeeType = data.employeeType
    if (data.employmentStatus !== undefined) updateData.employmentStatus = data.employmentStatus
    if (data.role !== undefined) updateData.role = data.role
    if (data.baseSalary !== undefined) updateData.baseSalary = data.baseSalary
    if (data.socialInsuranceSalary !== undefined) updateData.socialInsuranceSalary = data.socialInsuranceSalary
    if (data.positionAllowance !== undefined) updateData.positionAllowance = data.positionAllowance
    if (data.mealAllowance !== undefined) updateData.mealAllowance = data.mealAllowance
    if (data.otherAllowances !== undefined) updateData.otherAllowances = data.otherAllowances
    if (data.numberOfDependents !== undefined) updateData.numberOfDependents = data.numberOfDependents
    if (data.contractNumber !== undefined) updateData.contractNumber = data.contractNumber
    if (data.contractStartDate !== undefined) {
      updateData.contractStartDate = data.contractStartDate ? new Date(data.contractStartDate) : null
    }
    if (data.contractEndDate !== undefined) {
      updateData.contractEndDate = data.contractEndDate ? new Date(data.contractEndDate) : null
    }
    if (data.contractType !== undefined) updateData.contractType = data.contractType
    if (data.probationEndDate !== undefined) {
      updateData.probationEndDate = data.probationEndDate ? new Date(data.probationEndDate) : null
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
    if (data.lastReviewDate !== undefined) {
      updateData.lastReviewDate = data.lastReviewDate ? new Date(data.lastReviewDate) : null
    }
    if (data.nextReviewDate !== undefined) {
      updateData.nextReviewDate = data.nextReviewDate ? new Date(data.nextReviewDate) : null
    }
    if (data.skills !== undefined) updateData.skills = data.skills
    if (data.certifications !== undefined) updateData.certifications = data.certifications
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const employee = await prisma.employee.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/employees')
    revalidatePath(`/employees/${systemId}`)
    return { success: true, data: employee }
  } catch (error) {
    console.error('Error updating employee:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật nhân viên',
    }
  }
}

export async function deleteEmployeeAction(
  systemId: string
): Promise<ActionResult<Employee>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        employmentStatus: 'TERMINATED',
      },
    })

    revalidatePath('/employees')
    return { success: true, data: employee }
  } catch (error) {
    console.error('Error deleting employee:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa nhân viên',
    }
  }
}

export async function restoreEmployeeAction(
  systemId: string
): Promise<ActionResult<Employee>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
        employmentStatus: 'ACTIVE',
      },
    })

    revalidatePath('/employees')
    return { success: true, data: employee }
  } catch (error) {
    console.error('Error restoring employee:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể khôi phục nhân viên',
    }
  }
}

export async function getEmployeeAction(
  systemId: string
): Promise<ActionResult<Employee>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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

    return { success: true, data: employee }
  } catch (error) {
    console.error('Error getting employee:', error)
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        employmentStatus: 'TERMINATED',
        terminationDate: terminationDate ? new Date(terminationDate) : new Date(),
        reasonForLeaving: reason,
        endDate: terminationDate ? new Date(terminationDate) : new Date(),
      },
    })

    revalidatePath('/employees')
    revalidatePath(`/employees/${systemId}`)
    return { success: true, data: employee }
  } catch (error) {
    console.error('Error terminating employee:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể chấm dứt hợp đồng nhân viên',
    }
  }
}
