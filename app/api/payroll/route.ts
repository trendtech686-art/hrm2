import { prisma } from '@/lib/prisma'
import { Prisma, PayrollStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createPayrollSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createBulkNotifications } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

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
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    const where: Prisma.PayrollWhereInput = {}

    if (month) {
      where.month = parseInt(month)
    }

    if (year) {
      where.year = parseInt(year)
    }

    if (status && status !== 'all') {
      where.status = status as PayrollStatus
    }

    if (employeeId) {
      where.items = { some: { employeeId } }
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build orderBy - handle multiple sort fields
    let orderBy: Prisma.PayrollOrderByWithRelationInput | Prisma.PayrollOrderByWithRelationInput[];
    if (sortBy === 'createdAt') {
      orderBy = { createdAt: sortOrder };
    } else {
      orderBy = [{ year: 'desc' }, { month: 'desc' }];
    }

    const [payrolls, total] = await Promise.all([
      prisma.payroll.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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

    // Map status from DB enum to frontend type
    const statusMap: Record<string, string> = {
      'DRAFT': 'draft',
      'PROCESSING': 'reviewed',
      'COMPLETED': 'locked',
      'PAID': 'locked',
    }

    // Transform to frontend format
    const transformedPayrolls = payrolls.map((payroll) => {
      const monthKey = `${payroll.year}-${String(payroll.month).padStart(2, '0')}`
      const lastDay = new Date(payroll.year, payroll.month, 0).getDate()
      
      return {
        systemId: payroll.systemId,
        id: payroll.id,
        title: `Bảng lương tháng ${payroll.month}/${payroll.year}`,
        status: statusMap[payroll.status] || 'draft',
        templateSystemId: undefined,
        payPeriod: {
          startDate: `${payroll.year}-${String(payroll.month).padStart(2, '0')}-01`,
          endDate: `${payroll.year}-${String(payroll.month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
        },
        payrollDate: payroll.processedAt?.toISOString() || payroll.createdAt.toISOString(),
        referenceAttendanceMonthKeys: [monthKey],
        payslipSystemIds: payroll.items.map(item => item.systemId),
        totalGross: Number(payroll.totalGross),
        totalDeductions: Number(payroll.totalDeductions),
        totalNet: Number(payroll.totalNet),
        totalEmployees: payroll.totalEmployees,
        createdAt: payroll.createdAt.toISOString(),
        updatedAt: payroll.updatedAt.toISOString(),
        createdBy: payroll.createdBy,
      }
    })

    return apiPaginated(transformedPayrolls, { page, limit, total })
  } catch (error) {
    logError('Error fetching payroll', error)
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
    const payroll = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const customBusinessId = body.id?.trim() || undefined;
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'payroll',
        customBusinessId
      );

      return tx.payroll.create({
        data: {
          systemId,
          id: businessId,
          month: body.month,
          year: body.year,
          status: (body.status || 'DRAFT') as PayrollStatus,
          items: {
            create: await Promise.all(body.items?.map(async (item: PayrollItemInput) => {
              const employee = await tx.employee.findUnique({
                where: { systemId: item.employeeId },
                select: { systemId: true, id: true, fullName: true }
              });
              if (!employee) throw new Error(`Employee ${item.employeeId} not found`);
              return {
                systemId: await generateIdWithPrefix('PAYITEM', tx as unknown as typeof prisma),
                employeeId: employee.systemId,
                employeeName: employee.fullName,
                employeeCode: employee.id,
                baseSalary: item.baseSalary || 0,
                netSalary: item.netSalary || 0,
                notes: item.notes,
              };
            }) || []),
          },
        },
        include: {
          items: {
            include: { employee: true },
          },
        },
      });
    });

    // Notify employees included in payroll
    const employeeIds = payroll.items?.map(item => item.employee?.systemId || '').filter(Boolean) || [];
    if (employeeIds.length > 0) {
      createBulkNotifications({
        type: 'payroll',
        settingsKey: 'payroll:updated',
        title: 'Bảng lương mới',
        message: `Bảng lương ${payroll.id} đã được tạo`,
        link: `/payroll/${payroll.systemId}`,
        recipientIds: employeeIds,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Payroll] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'payroll',
          entityId: payroll.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo bảng lương`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] payroll created failed', e))

    return apiSuccess(payroll, 201)
  } catch (error) {
    logError('Error creating payroll', error)
    return apiError('Failed to create payroll', 500)
  }
}
