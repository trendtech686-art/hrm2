import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateReceiptSchema } from './validation'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'
import type { Prisma } from '@prisma/client'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// Serialize Decimal fields for client components
function serializeReceipt<T extends { amount?: Prisma.Decimal | number | null; runningBalance?: Prisma.Decimal | number | null }>(receipt: T) {
  return {
    ...receipt,
    amount: receipt.amount !== null && receipt.amount !== undefined ? Number(receipt.amount) : 0,
    runningBalance: receipt.runningBalance !== null && receipt.runningBalance !== undefined ? Number(receipt.runningBalance) : null,
  };
}

// GET /api/receipts/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const receipt = await prisma.receipt.findUnique({
      where: { systemId },
      include: {
        order: true,
        customers: true,
      },
    })

    if (!receipt) {
      return apiError('Phiếu thu không tồn tại', 404)
    }

    return apiSuccess(serializeReceipt(receipt))
  } catch (error) {
    console.error('Error fetching receipt:', error)
    return apiError('Failed to fetch receipt', 500)
  }
}

// PUT /api/receipts/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateReceiptSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const receipt = await prisma.receipt.update({
      where: { systemId },
      data: {
        amount: body.amount,
        paymentMethod: body.method || body.paymentMethod,
        description: body.description,
      },
      include: {
        order: true,
        customers: true,
      },
    })

    // Update customer debt if receipt affects debt
    if (receipt.affectsDebt) {
      const customerSystemId = receipt.customerSystemId || receipt.payerSystemId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          console.error('[Update Receipt] Failed to update customer debt:', err);
        });
      }
    }

    return apiSuccess(serializeReceipt(receipt))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu thu không tồn tại', 404)
    }
    console.error('Error updating receipt:', error)
    return apiError('Failed to update receipt', 500)
  }
}

// DELETE /api/receipts/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Get receipt info before deleting to update customer debt
    const receipt = await prisma.receipt.findUnique({
      where: { systemId },
      select: {
        affectsDebt: true,
        customerSystemId: true,
        payerSystemId: true,
      },
    });

    if (!receipt) {
      return apiError('Phiếu thu không tồn tại', 404)
    }

    await prisma.receipt.delete({
      where: { systemId },
    })

    // Update customer debt if receipt affected debt
    if (receipt.affectsDebt) {
      const customerSystemId = receipt.customerSystemId || receipt.payerSystemId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          console.error('[Delete Receipt] Failed to update customer debt:', err);
        });
      }
    }

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu thu không tồn tại', 404)
    }
    console.error('Error deleting receipt:', error)
    return apiError('Failed to delete receipt', 500)
  }
}
