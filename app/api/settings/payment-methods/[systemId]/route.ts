import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updatePaymentMethodSchema } from './validation'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
    logError('Error fetching payment method', error)
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

    const existing = await prisma.paymentMethod.findUnique({ where: { systemId } })
    if (!existing) return apiError('Payment method not found', 404)

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
        isActive: body.isActive,
        isDefault: body.isDefault,
        updatedBy: session.user.id,
      },
    })

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.code !== undefined && body.code !== existing.code) changes['Mã'] = { from: existing.code, to: body.code }
    if (body.type !== undefined && body.type !== existing.type) changes['Loại'] = { from: existing.type, to: body.type }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description, to: body.description }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: body.isActive ? 'Hoạt động' : 'Ngừng' }
    if (body.isDefault !== undefined && body.isDefault !== existing.isDefault) changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: body.isDefault ? 'Có' : 'Không' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'payment_method',
        entityId: systemId,
        action: `Cập nhật phương thức thanh toán: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess({ data: method })
  } catch (error) {
    logError('Error updating payment method', error)
    return apiError('Failed to update payment method', 500)
  }
}

// DELETE /api/settings/payment-methods/[systemId]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const existing = await prisma.paymentMethod.findUnique({ where: { systemId } })

    await prisma.paymentMethod.delete({
      where: { systemId },
    })

    if (existing) {
      createActivityLog({
        entityType: 'payment_method',
        entityId: systemId,
        action: `Xóa phương thức thanh toán: ${existing.name}`,
        actionType: 'delete',
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess({ success: true })
  } catch (error) {
    logError('Error deleting payment method', error)
    return apiError('Failed to delete payment method', 500)
  }
}
