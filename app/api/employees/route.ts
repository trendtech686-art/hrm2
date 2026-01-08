import { prisma } from '@/lib/prisma'
import { Prisma, EmploymentStatus, Gender, EmployeeType, ContractType } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createEmployeeSchema } from './validation'

// GET /api/employees - List all employees
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const departmentId = searchParams.get('departmentId')
    const branchId = searchParams.get('branchId')

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

    if (departmentId) {
      where.departmentId = departmentId
    }

    if (branchId) {
      where.branchId = branchId
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          department: true,
          branch: true,
          jobTitle: true,
        },
      }),
      prisma.employee.count({ where }),
    ])

    return apiPaginated(employees, { page, limit, total })
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

    // Generate business ID if not provided
    if (!body.id) {
      const lastEmployee = await prisma.employee.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastEmployee?.id 
        ? parseInt(lastEmployee.id.replace('NV', '')) 
        : 0
      body.id = `NV${String(lastNum + 1).padStart(3, '0')}`
    }

    const employee = await prisma.employee.create({
      data: {
        systemId: `EMP${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        fullName: body.fullName,
        dob: body.dob ? new Date(body.dob) : null,
        placeOfBirth: body.placeOfBirth,
        gender: (body.gender || 'OTHER') as Gender,
        phone: body.phone,
        personalEmail: body.personalEmail,
        workEmail: body.workEmail,
        nationalId: body.nationalId,
        avatarUrl: body.avatarUrl,
        permanentAddress: body.permanentAddress,
        temporaryAddress: body.temporaryAddress,
        department: body.departmentId ? { connect: { systemId: body.departmentId } } : undefined,
        jobTitle: body.jobTitleId ? { connect: { systemId: body.jobTitleId } } : undefined,
        branch: body.branchId ? { connect: { systemId: body.branchId } } : undefined,
        manager: body.managerId ? { connect: { systemId: body.managerId } } : undefined,
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        employeeType: (body.employeeType || 'FULLTIME') as EmployeeType,
        employmentStatus: (body.employmentStatus || 'ACTIVE') as EmploymentStatus,
        role: body.role || 'Nhân viên',
        baseSalary: body.baseSalary,
        contractNumber: body.contractNumber,
        contractType: body.contractType as ContractType | undefined,
        notes: body.notes,
        createdBy: body.createdBy,
      },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
      },
    })

    return apiSuccess(employee, 201)
  } catch (error) {
    console.error('Error creating employee:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Employee ID or email already exists', 400)
    }

    return apiError('Failed to create employee', 500)
  }
}
