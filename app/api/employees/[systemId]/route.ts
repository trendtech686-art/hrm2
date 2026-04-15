import { prisma } from '@/lib/prisma'
import { Prisma, Gender, EmployeeType, EmploymentStatus, ContractType, UserRole } from '@/generated/prisma/client'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { serializeEmployee } from '../serialize'
import bcrypt from 'bcryptjs'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { getPasswordRules, validatePassword } from '@/lib/password-rules'

// Helper functions to convert Vietnamese labels to enum values
const parseGender = (value: string | null | undefined): Gender | undefined => {
  if (!value) return undefined
  const map: Record<string, Gender> = {
    'Nam': 'MALE',
    'MALE': 'MALE',
    'Nữ': 'FEMALE', 
    'FEMALE': 'FEMALE',
    'Khác': 'OTHER',
    'OTHER': 'OTHER',
  }
  return map[value] || undefined
}

const parseEmployeeType = (value: string | null | undefined): EmployeeType | undefined => {
  if (!value) return undefined
  const map: Record<string, EmployeeType> = {
    'Toàn thời gian': 'FULLTIME',
    'FULLTIME': 'FULLTIME',
    'Bán thời gian': 'PARTTIME',
    'PARTTIME': 'PARTTIME',
    'Thực tập': 'INTERN',
    'INTERN': 'INTERN',
    'Thử việc': 'PROBATION',
    'PROBATION': 'PROBATION',
  }
  return map[value] || undefined
}

const parseEmploymentStatus = (value: string | null | undefined): EmploymentStatus | undefined => {
  if (!value) return undefined
  const map: Record<string, EmploymentStatus> = {
    'Đang làm việc': 'ACTIVE',
    'ACTIVE': 'ACTIVE',
    'Tạm nghỉ': 'ON_LEAVE',
    'ON_LEAVE': 'ON_LEAVE',
    'Đã nghỉ việc': 'TERMINATED',
    'Đã sa thải': 'TERMINATED',
    'TERMINATED': 'TERMINATED',
  }
  return map[value] || undefined
}

const parseContractType = (value: string | null | undefined): ContractType | undefined => {
  if (!value) return undefined
  const map: Record<string, ContractType> = {
    'Thử việc': 'PROBATION',
    'PROBATION': 'PROBATION',
    '1 năm': 'ONE_YEAR',
    'ONE_YEAR': 'ONE_YEAR',
    '2 năm': 'TWO_YEARS',
    'TWO_YEARS': 'TWO_YEARS',
    '3 năm': 'THREE_YEARS',
    'THREE_YEARS': 'THREE_YEARS',
    'Vô thời hạn': 'INDEFINITE',
    'INDEFINITE': 'INDEFINITE',
  }
  return map[value] || undefined
}

// GET /api/employees/[systemId] - Get single employee
export const GET = apiHandler(async (request, { params }) => {
    const { systemId } = params

    const employee = await prisma.employee.findUnique({
      where: { systemId },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
        user: {
          select: {
            systemId: true,
            email: true,
            role: true,
            isActive: true,
            // Don't expose password hash to frontend for security
            // Just check if exists via a computed field
          },
        },
        manager: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
        subordinates: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
      },
    })

    if (!employee || employee.isDeleted) {
      return apiNotFound('Employee')
    }

    // Add hasPassword flag for UI to know if user account has password set
    const responseData = {
      ...serializeEmployee(employee),
      hasPassword: !!employee.user, // If user relation exists, password is set
    }

    return apiSuccess(responseData)
})

// PUT /api/employees/[systemId] - Update employee
export const PUT = apiHandler(async (request, { session, params }) => {
    const { systemId } = params
    const rawBody = await request.json()
    
    // Support both { data: {...} } and direct {...} body formats
    const body = rawBody.data || rawBody

    // Check if employee exists
    const existing = await prisma.employee.findUnique({
      where: { systemId },
    })

    if (!existing || existing.isDeleted) {
      return apiNotFound('Employee')
    }

    // Helper to normalize string fields: empty string → undefined (don't update)
    const normalizeString = (value: unknown): string | undefined => {
      if (typeof value !== 'string') return undefined
      const trimmed = value.trim()
      return trimmed === '' ? undefined : trimmed
    }

    let employee
    try {
      employee = await prisma.employee.update({
      where: { systemId },
      data: {
        fullName: normalizeString(body.fullName),
        dob: body.dob ? new Date(body.dob) : null,
        placeOfBirth: normalizeString(body.placeOfBirth),
        gender: parseGender(body.gender),
        phone: normalizeString(body.phone),
        personalEmail: normalizeString(body.personalEmail),
        workEmail: normalizeString(body.workEmail),
        nationalId: normalizeString(body.nationalId),
        nationalIdIssueDate: body.nationalIdIssueDate ? new Date(body.nationalIdIssueDate) : null,
        nationalIdIssuePlace: normalizeString(body.nationalIdIssuePlace),
        avatarUrl: normalizeString(body.avatarUrl),
        permanentAddress: body.permanentAddress,
        temporaryAddress: body.temporaryAddress,
        // Hỗ trợ nhiều field name: *SystemId, *Id, hoặc chỉ tên field
        departmentId: body.departmentSystemId || body.departmentId || body.department || undefined,
        jobTitleId: body.jobTitleSystemId || body.jobTitleId || body.jobTitle || undefined,
        branchId: body.branchSystemId || body.branchId || undefined,
        managerId: body.managerId,
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        terminationDate: body.terminationDate ? new Date(body.terminationDate) : null,
        reasonForLeaving: normalizeString(body.reasonForLeaving),
        employeeType: parseEmployeeType(body.employeeType),
        employmentStatus: parseEmploymentStatus(body.employmentStatus),
        role: normalizeString(body.role),
        baseSalary: body.baseSalary,
        socialInsuranceSalary: body.socialInsuranceSalary,
        positionAllowance: body.positionAllowance,
        mealAllowance: body.mealAllowance,
        otherAllowances: body.otherAllowances,
        numberOfDependents: body.numberOfDependents,
        contractNumber: normalizeString(body.contractNumber),
        contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : null,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
        contractType: parseContractType(body.contractType),
        probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
        bankAccountNumber: normalizeString(body.bankAccountNumber),
        bankName: normalizeString(body.bankName),
        bankBranch: normalizeString(body.bankBranch),
        personalTaxId: normalizeString(body.personalTaxId),
        socialInsuranceNumber: normalizeString(body.socialInsuranceNumber),
        annualLeaveBalance: body.annualLeaveBalance,
        notes: normalizeString(body.notes),
        // Personal info
        maritalStatus: normalizeString(body.maritalStatus),
        emergencyContactName: normalizeString(body.emergencyContactName),
        emergencyContactPhone: normalizeString(body.emergencyContactPhone),
        updatedBy: session!.user.id,
      },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
        user: true,
      },
    })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return apiError('Email already exists', 400)
      }
      throw error
    }

    // Handle user account sync (email + password)
    let userAction: 'created' | 'updated' | null = null
    const existingUser = await prisma.user.findFirst({
      where: { employeeId: systemId },
    })

    // Sync employee → users khi thay đổi workEmail, employmentStatus
    const userSyncData: Record<string, unknown> = {}
    const newEmail = normalizeString(body.workEmail)
    if (existingUser && newEmail && newEmail !== existingUser.email) {
      userSyncData.email = newEmail
    }
    if (existingUser && body.employmentStatus && body.employmentStatus !== existing.employmentStatus) {
      userSyncData.isActive = body.employmentStatus === 'ACTIVE' || body.employmentStatus === 'ON_LEAVE'
    }
    if (existingUser && Object.keys(userSyncData).length > 0) {
      await prisma.user.update({
        where: { systemId: existingUser.systemId },
        data: userSyncData,
      })
      userAction = 'updated'
    }

    // Handle password update/creation
    if (body.password && (newEmail || existing.workEmail)) {
      const rules = await getPasswordRules()
      const pwError = validatePassword(body.password, rules)
      if (pwError) return apiError(pwError, 400)
      const hashedPassword = await bcrypt.hash(body.password, 10)
      
      if (existingUser) {
        await prisma.user.update({
          where: { systemId: existingUser.systemId },
          data: { password: hashedPassword },
        })
        userAction = 'updated'
      } else {
        // Create new user
        const { systemId: userSystemId } = await generateNextIds('users')
        await prisma.user.create({
          data: {
            systemId: userSystemId,
            email: (newEmail || existing.workEmail)!,
            password: hashedPassword,
            role: 'STAFF' as UserRole,
            isActive: true,
            employeeId: systemId,
          },
        })
        userAction = 'created'
      }
    }

    // Build changes diff
    const fieldLabels: Record<string, string> = {
      fullName: 'Họ tên',
      phone: 'Số điện thoại',
      personalEmail: 'Email cá nhân',
      workEmail: 'Email công việc',
      gender: 'Giới tính',
      employeeType: 'Loại nhân viên',
      employmentStatus: 'Trạng thái',
      role: 'Vai trò',
      departmentId: 'Phòng ban',
      jobTitleId: 'Chức vụ',
      branchId: 'Chi nhánh',
      managerId: 'Quản lý',
      baseSalary: 'Lương cơ bản',
      contractType: 'Loại hợp đồng',
      bankAccountNumber: 'Số tài khoản',
      bankName: 'Ngân hàng',
      notes: 'Ghi chú',
    }
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    const changedFields: string[] = []
    for (const [dbKey, label] of Object.entries(fieldLabels)) {
      const oldVal = (existing as Record<string, unknown>)[dbKey]
      const newVal = (employee as Record<string, unknown>)[dbKey]
      if (oldVal !== newVal && newVal !== undefined) {
        changes[label] = { from: oldVal ?? '', to: newVal ?? '' }
        changedFields.push(label)
      }
    }

    // Log activity with diff
    getUserNameFromDb(session!.user?.id).then(userName => {
      const noteFields = changedFields.length > 0 ? `: ${changedFields.join(', ')}` : ''
      prisma.activityLog.create({
        data: {
          entityType: 'employee',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật nhân viên: ${employee.fullName}${noteFields}`,
          changes: Object.keys(changes).length > 0 ? JSON.parse(JSON.stringify(changes)) : undefined,
          metadata: { userName },
          createdBy: userName,
        }
      }).catch(e => logError('[ActivityLog] employee updated failed', e))

      // Log User account side-effect
      if (userAction === 'created') {
        prisma.activityLog.create({
          data: {
            entityType: 'employee',
            entityId: systemId,
            action: 'created',
            actionType: 'create',
            note: `Tạo tài khoản đăng nhập cho nhân viên: ${employee.fullName}`,
            metadata: { userName },
            createdBy: userName,
          }
        }).catch(e => logError('[ActivityLog] user account created failed', e))
      } else if (userAction === 'updated') {
        prisma.activityLog.create({
          data: {
            entityType: 'employee',
            entityId: systemId,
            action: 'updated',
            actionType: 'update',
            note: `Đổi mật khẩu tài khoản nhân viên: ${employee.fullName}`,
            metadata: { userName },
            createdBy: userName,
          }
        }).catch(e => logError('[ActivityLog] user password updated failed', e))
      }
    }).catch(e => logError('[ActivityLog] getUserName failed', e))

    return apiSuccess(employee)
}, { permission: 'edit_employees' })

// DELETE /api/employees/[systemId] - Soft delete employee
export const DELETE = apiHandler(async (request, { session, params }) => {
    const { systemId } = params

    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'employee',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa nhân viên (soft delete)`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] employee deleted failed', e))

    return apiSuccess({ success: true, systemId: employee.systemId })
}, { permission: 'delete_employees' })
