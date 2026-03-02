import { prisma } from '@/lib/prisma'
import { Prisma, Gender, EmployeeType, EmploymentStatus, ContractType, UserRole } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import bcrypt from 'bcryptjs'
import { generateNextIds } from '@/lib/id-system'

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
export async function GET(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

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

    // Convert Decimal fields to numbers for JSON serialization
    const convertDecimalToNumber = (value: unknown): number | null => {
      if (value === null || value === undefined) return null
      if (typeof value === 'number') return value
      if (typeof value === 'string') return parseFloat(value) || null
      // Prisma Decimal objects have a toNumber method
      if (typeof value === 'object' && value !== null && 'toNumber' in value) {
        return (value as { toNumber: () => number }).toNumber()
      }
      return null
    }

    // Add hasPassword flag for UI to know if user account has password set
    const responseData = {
      ...employee,
      // Convert Decimal fields to numbers
      baseSalary: convertDecimalToNumber(employee.baseSalary),
      socialInsuranceSalary: convertDecimalToNumber(employee.socialInsuranceSalary),
      positionAllowance: convertDecimalToNumber(employee.positionAllowance),
      mealAllowance: convertDecimalToNumber(employee.mealAllowance),
      otherAllowances: convertDecimalToNumber(employee.otherAllowances),
      // Also expose branchId as branchSystemId for frontend compatibility
      branchSystemId: employee.branchId,
      departmentSystemId: employee.departmentId,
      jobTitleSystemId: employee.jobTitleId,
      hasPassword: !!employee.user, // If user relation exists, password is set
    }

    return apiSuccess(responseData)
  } catch (error) {
    console.error('Error fetching employee:', error)
    return apiError('Failed to fetch employee', 500)
  }
}

// PUT /api/employees/[systemId] - Update employee
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
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

    const employee = await prisma.employee.update({
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
        updatedBy: body.updatedBy,
      },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
        user: true,
      },
    })

    // Handle password update/creation
    if (body.password && existing.workEmail) {
      const hashedPassword = await bcrypt.hash(body.password, 10)
      
      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: { employeeId: systemId },
      })
      
      if (existingUser) {
        // Update existing user's password
        await prisma.user.update({
          where: { systemId: existingUser.systemId },
          data: { password: hashedPassword },
        })
      } else {
        // Create new user
        const { systemId: userSystemId } = await generateNextIds('users')
        await prisma.user.create({
          data: {
            systemId: userSystemId,
            email: existing.workEmail,
            password: hashedPassword,
            role: 'STAFF' as UserRole,
            isActive: true,
            employeeId: systemId,
          },
        })
      }
    }

    return apiSuccess(employee)
  } catch (error) {
    console.error('Error updating employee:', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Email already exists', 400)
    }

    return apiError('Failed to update employee', 500)
  }
}

// DELETE /api/employees/[systemId] - Soft delete employee
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return apiSuccess({ success: true, systemId: employee.systemId })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return apiError('Failed to delete employee', 500)
  }
}
