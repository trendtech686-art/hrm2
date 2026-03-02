import { prisma } from '@/lib/prisma'
import { Prisma, EmploymentStatus, Gender, EmployeeType, ContractType, UserRole } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createEmployeeSchema } from './validation'
import { generateNextIdsWithTx, generateNextIds } from '@/lib/id-system'
import bcrypt from 'bcryptjs'

// Route segment config - force dynamic since we use auth and query params
export const dynamic = 'force-dynamic'

// GET /api/employees - List all employees
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    // Support both naming conventions, prefer *SystemId
    const departmentSystemId = searchParams.get('departmentSystemId') || searchParams.get('departmentId')
    const branchSystemId = searchParams.get('branchSystemId') || searchParams.get('branchId')
    const jobTitle = searchParams.get('jobTitle')
    const department = searchParams.get('department')

    // Build where clause
    const where: Prisma.EmployeeWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { workEmail: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.employmentStatus = status as EmploymentStatus
    }

    if (departmentSystemId) {
      where.departmentId = departmentSystemId // Prisma field is departmentId but value is systemId
    }

    if (branchSystemId) {
      where.branchId = branchSystemId // Prisma field is branchId but value is systemId
    }

    // Filter by department name
    if (department) {
      where.department = { name: { equals: department, mode: 'insensitive' } }
    }

    // Filter by job title name
    if (jobTitle) {
      where.jobTitle = { name: { equals: jobTitle, mode: 'insensitive' } }
    }

    // Build orderBy - handle nested relations
    const orderByField = sortBy === 'department' ? { department: { name: sortOrder } }
      : sortBy === 'branch' ? { branch: { name: sortOrder } }
      : sortBy === 'jobTitle' ? { jobTitle: { name: sortOrder } }
      : { [sortBy]: sortOrder }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderByField as Prisma.EmployeeOrderByWithRelationInput,
        include: {
          department: true,
          branch: true,
          jobTitle: true,
          manager: {
            select: {
              systemId: true,
              fullName: true,
            }
          },
        },
      }),
      prisma.employee.count({ where }),
    ])

    // Convert Decimal fields to numbers for JSON serialization
    const convertDecimalToNumber = (value: unknown): number | null => {
      if (value === null || value === undefined) return null
      if (typeof value === 'number') return value
      if (typeof value === 'string') return parseFloat(value) || null
      if (typeof value === 'object' && value !== null && 'toNumber' in value) {
        return (value as { toNumber: () => number }).toNumber()
      }
      return null
    }

    const serializedEmployees = employees.map(emp => ({
      ...emp,
      baseSalary: convertDecimalToNumber(emp.baseSalary),
      socialInsuranceSalary: convertDecimalToNumber(emp.socialInsuranceSalary),
      positionAllowance: convertDecimalToNumber(emp.positionAllowance),
      mealAllowance: convertDecimalToNumber(emp.mealAllowance),
      otherAllowances: convertDecimalToNumber(emp.otherAllowances),
      branchSystemId: emp.branchId,
      departmentSystemId: emp.departmentId,
      jobTitleSystemId: emp.jobTitleId,
    }))

    return apiPaginated(serializedEmployees, { page, limit, total })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return apiError('Failed to fetch employees', 500)
  }
}

// POST /api/employees - Create new employee
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createEmployeeSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

    const employee = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'employees',
        body.id?.trim() || undefined
      );

      return tx.employee.create({
        data: {
          systemId,
          id: businessId,
        fullName: body.fullName,
        dob: body.dob ? new Date(body.dob) : null,
        placeOfBirth: body.placeOfBirth,
        gender: (body.gender || 'OTHER') as Gender,
        phone: body.phone,
        personalEmail: body.personalEmail,
        workEmail: body.workEmail,
        nationalId: body.nationalId,
        nationalIdIssueDate: body.nationalIdIssueDate ? new Date(body.nationalIdIssueDate) : null,
        nationalIdIssuePlace: body.nationalIdIssuePlace,
        avatarUrl: body.avatarUrl,
        permanentAddress: body.permanentAddress === null ? Prisma.JsonNull : body.permanentAddress,
        temporaryAddress: body.temporaryAddress === null ? Prisma.JsonNull : body.temporaryAddress,
        // Use *Id fields which contain systemId values
        department: (body.departmentId || body.department) ? { connect: { systemId: body.departmentId || body.department } } : undefined,
        jobTitle: (body.jobTitleId || body.jobTitle) ? { connect: { systemId: body.jobTitleId || body.jobTitle } } : undefined,
        branch: (body.branchId || body.branchSystemId) ? { connect: { systemId: body.branchId || body.branchSystemId } } : undefined,
        manager: body.managerId ? { connect: { systemId: body.managerId } } : undefined,
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        terminationDate: body.terminationDate ? new Date(body.terminationDate) : null,
        reasonForLeaving: body.reasonForLeaving,
        employeeType: (body.employeeType || 'FULLTIME') as EmployeeType,
        employmentStatus: (body.employmentStatus || 'ACTIVE') as EmploymentStatus,
        role: body.role || 'Nhân viên',
        // Salary & Allowances
        baseSalary: body.baseSalary,
        socialInsuranceSalary: body.socialInsuranceSalary,
        positionAllowance: body.positionAllowance,
        mealAllowance: body.mealAllowance,
        otherAllowances: body.otherAllowances,
        numberOfDependents: body.numberOfDependents,
        // Contract
        contractNumber: body.contractNumber,
        contractType: body.contractType as ContractType | undefined,
        contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : null,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
        probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
        // Bank info
        bankAccountNumber: body.bankAccountNumber,
        bankName: body.bankName,
        bankBranch: body.bankBranch,
        // Tax & Insurance
        personalTaxId: body.personalTaxId,
        socialInsuranceNumber: body.socialInsuranceNumber,
        // Personal info
        maritalStatus: body.maritalStatus,
        emergencyContactName: body.emergencyContactName,
        emergencyContactPhone: body.emergencyContactPhone,
        // Leave
        annualLeaveBalance: body.annualLeaveBalance,
        // Other
        notes: body.notes,
        createdBy: body.createdBy,
      },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
        user: true,
      },
      });
    });

    // If password is provided, create User account for login
    if (body.password && body.workEmail) {
      const hashedPassword = await bcrypt.hash(body.password, 10)
      const { systemId: userSystemId } = await generateNextIds('users')
      await prisma.user.create({
        data: {
          systemId: userSystemId,
          email: body.workEmail,
          password: hashedPassword,
          role: 'STAFF' as UserRole,
          isActive: true,
          employeeId: employee.systemId,
        },
      })
    }

    return apiSuccess(employee, 201)
  } catch (error) {
    console.error('Error creating employee:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Employee ID or email already exists', 400)
    }

    return apiError('Failed to create employee', 500)
  }
}
