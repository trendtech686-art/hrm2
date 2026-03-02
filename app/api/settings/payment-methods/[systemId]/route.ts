import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updatePaymentMethodSchema } from './validation'

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/settings/payment-methods/[systemId]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const method = await prisma.paymentMethod.findUnique({
      where: { systemId },
    })

    if (!method) {
      return apiError('Payment method not found', 404)
    }

    return apiSuccess({ data: method })
  } catch (error) {
    console.error('Error fetching payment method:', error)
    return apiError('Failed to fetch payment method', 500)
  }
}

// PATCH /api/settings/payment-methods/[systemId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updatePaymentMethodSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    // If setting as default, unset all other defaults first
    if (body.isDefault === true) {
      await prisma.paymentMethod.updateMany({
        where: { isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const method = await prisma.paymentMethod.update({
      where: { systemId },
      data: {
        id: body.id,
        name: body.name,
        code: body.code,
        type: body.type,
        description: body.description,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
        bankName: body.bankName,
        isActive: body.isActive,
        isDefault: body.isDefault,
        updatedBy: session.user.id,
      },
    })

    return apiSuccess({ data: method })
  } catch (error) {
    console.error('Error updating payment method:', error)
    return apiError('Failed to update payment method', 500)
  }
}

// DELETE /api/settings/payment-methods/[systemId]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.paymentMethod.delete({
      where: { systemId },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return apiError('Failed to delete payment method', 500)
  }
}
