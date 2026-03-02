import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import type { Prisma } from '@/generated/prisma/client'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

type Decimal = Prisma.Decimal;

// Helper to convert Decimal to number
function toNumber(val: Decimal | number | null | undefined): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  return Number(val);
}

// GET /api/payments/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const [payment, auditLogs] = await Promise.all([
      prisma.payment.findUnique({
        where: { systemId },
        include: {
          purchaseOrder: {
            include: {
              items: {
                include: {
                  product: {
                    select: { systemId: true, id: true, name: true },
                  },
                },
              },
            },
          },
          suppliers: true,
        },
      }),
      prisma.auditLog.findMany({
        where: {
          entityType: 'Payment',
          entityId: systemId,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    if (!payment) {
      return apiNotFound('Payment')
    }

    // Transform to frontend format
    const transformed = {
      ...payment,
      date: payment.paymentDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      amount: toNumber(payment.amount),
      runningBalance: toNumber(payment.runningBalance),
      createdAt: payment.createdAt?.toISOString(),
      updatedAt: payment.updatedAt?.toISOString(),
      paymentDate: payment.paymentDate?.toISOString(),
      cancelledAt: payment.cancelledAt?.toISOString(),
      recognitionDate: payment.recognitionDate?.toISOString(),
      auditLogs: auditLogs.map(log => ({
        ...log,
        timestamp: log.createdAt?.toISOString(),
      })),
    }

    return apiSuccess(transformed)
  } catch (error) {
    console.error('Error fetching payment:', error)
    return apiError('Failed to fetch payment', 500)
  }
}

// PUT /api/payments/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const payment = await prisma.payment.update({
      where: { systemId },
      data: {
        amount: body.amount,
        paymentMethod: body.method || body.paymentMethod,
        description: body.description,
      },
      include: {
        purchaseOrder: true,
        suppliers: true,
      },
    })

    // Update customer debt if payment affects debt
    if (payment.affectsDebt && !payment.linkedSalesReturnSystemId) {
      const customerSystemId = payment.customerSystemId || payment.recipientSystemId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          console.error('[Update Payment] Failed to update customer debt:', err);
        });
      }
    }

    // Serialize for client
    const serialized = {
      ...payment,
      amount: toNumber(payment.amount),
      runningBalance: toNumber(payment.runningBalance),
    };

    return apiSuccess(serialized)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Payment')
    }
    console.error('Error updating payment:', error)
    return apiError('Failed to update payment', 500)
  }
}

// DELETE /api/payments/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Get payment info before deleting to update customer debt
    const payment = await prisma.payment.findUnique({
      where: { systemId },
      select: {
        affectsDebt: true,
        customerSystemId: true,
        recipientSystemId: true,
        linkedSalesReturnSystemId: true,
      },
    });

    if (!payment) {
      return apiNotFound('Payment')
    }

    await prisma.payment.delete({
      where: { systemId },
    })

    // Update customer debt if payment affected debt
    if (payment.affectsDebt && !payment.linkedSalesReturnSystemId) {
      const customerSystemId = payment.customerSystemId || payment.recipientSystemId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          console.error('[Delete Payment] Failed to update customer debt:', err);
        });
      }
    }

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Payment')
    }
    console.error('Error deleting payment:', error)
    return apiError('Failed to delete payment', 500)
  }
}
