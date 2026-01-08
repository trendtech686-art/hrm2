import { prisma } from '@/lib/prisma'
import { Prisma, PayrollStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createPayrollSchema } from './validation'

// Interface for payroll item input
interface PayrollItemInput {
  employeeId: string;
  baseSalary?: number;
  netSalary?: number;
  notes?: string;
}

// GET /api/payroll - List all payroll records
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const status = searchParams.get('status')
    const employeeId = searchParams.get('employeeId')

    const where: Prisma.PayrollWhereInput = {}

    if (month) {
      where.month = parseInt(month)
    }

    if (year) {
      where.year = parseInt(year)
    }

    if (status) {
      where.status = status as PayrollStatus
    }

    if (employeeId) {
      where.items = { some: { employeeId } }
    }

    const [payrolls, total] = await Promise.all([
      prisma.payroll.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: {
          items: {
            include: {
              employee: {
                select: {
                  id: true,
                  fullName: true,
                  avatar: true,
                  department: true,
                  jobTitle: true,
                },
              },
            },
          },
          _count: { select: { items: true } },
        },
      }),
      prisma.payroll.count({ where }),
    ])

    return apiPaginated(payrolls, { page, limit, total })
  } catch (error) {
    console.error('Error fetching payroll:', error)
    return apiError('Failed to fetch payroll', 500)
  }
}

// POST /api/payroll - Create new payroll record
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createPayrollSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Generate business ID
    let businessId = body.id
    if (!businessId) {
      const prefix = `BL${body.year}${String(body.month).padStart(2, '0')}`
      const lastPayroll = await prisma.payroll.findFirst({
        where: { id: { startsWith: prefix } },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastPayroll?.id 
        ? parseInt(lastPayroll.id.replace(prefix, '')) 
        : 0
      businessId = `${prefix}${String(lastNum + 1).padStart(3, '0')}`
    }

    const payroll = await prisma.payroll.create({
      data: {
        systemId: `PAYROLL${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: businessId,
        month: body.month,
        year: body.year,
        status: (body.status || 'DRAFT') as PayrollStatus,
        items: {
          create: await Promise.all(body.items?.map(async (item: PayrollItemInput) => {
            const employee = await prisma.employee.findUnique({
              where: { systemId: item.employeeId },
              select: { systemId: true, id: true, fullName: true }
            })
            if (!employee) throw new Error(`Employee ${item.employeeId} not found`)
            return {
              systemId: `PAYITEM${String(Date.now()).slice(-8)}${Math.random().toString(36).slice(2, 6)}`,
              employeeId: employee.systemId,
              employeeName: employee.fullName,
              employeeCode: employee.id,
              baseSalary: item.baseSalary || 0,
              netSalary: item.netSalary || 0,
              notes: item.notes,
            }
          }) || []),
        },
      },
      include: {
        items: {
          include: { employee: true },
        },
      },
    })

    return apiSuccess(payroll, 201)
  } catch (error) {
    console.error('Error creating payroll:', error)
    return apiError('Failed to create payroll', 500)
  }
}
