import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { z } from 'zod'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// Validation schema
const updateTaxSchema = z.object({
  name: z.string().min(1, 'Tên thuế không được để trống').optional(),
  rate: z.number().min(0, 'Tỷ lệ thuế phải >= 0').max(100, 'Tỷ lệ thuế phải <= 100').optional(),
  description: z.string().optional(),
  isDefaultSale: z.boolean().optional(),
  isDefaultPurchase: z.boolean().optional(),
})

// GET /api/settings/taxes/[systemId] - Get tax by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  const { systemId } = await params

  try {
    const tax = await prisma.tax.findUnique({
      where: { systemId },
    })

    if (!tax) {
      return apiNotFound('Không tìm thấy thuế')
    }

    return apiSuccess({ data: tax })
  } catch (error) {
    logError('Error fetching tax', error)
    return apiError('Không thể tải thông tin thuế', 500)
  }
}

// PUT /api/settings/taxes/[systemId] - Update tax
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  const { systemId } = await params

  const validation = await validateBody(request, updateTaxSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const existing = await prisma.tax.findUnique({ where: { systemId } })
    if (!existing) return apiNotFound('Không tìm thấy thuế')

    // If setting as default sale, unset others
    if (body.isDefaultSale) {
      await prisma.tax.updateMany({
        where: { isDefaultSale: true, systemId: { not: systemId } },
        data: { isDefaultSale: false },
      })
    }

    // If setting as default purchase, unset others
    if (body.isDefaultPurchase) {
      await prisma.tax.updateMany({
        where: { isDefaultPurchase: true, systemId: { not: systemId } },
        data: { isDefaultPurchase: false },
      })
    }

    const tax = await prisma.tax.update({
      where: { systemId },
      data: body,
    })

    // Activity log
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.rate !== undefined && Number(body.rate) !== Number(existing.rate)) changes['Thuế suất'] = { from: `${Number(existing.rate)}%`, to: `${body.rate}%` }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description, to: body.description }
    if (body.isDefaultSale !== undefined && body.isDefaultSale !== existing.isDefaultSale) changes['MĐ bán hàng'] = { from: existing.isDefaultSale ? 'Có' : 'Không', to: body.isDefaultSale ? 'Có' : 'Không' }
    if (body.isDefaultPurchase !== undefined && body.isDefaultPurchase !== existing.isDefaultPurchase) changes['MĐ nhập hàng'] = { from: existing.isDefaultPurchase ? 'Có' : 'Không', to: body.isDefaultPurchase ? 'Có' : 'Không' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'tax',
        entityId: systemId,
        action: `Cập nhật thuế: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess({ data: tax })
  } catch (error) {
    logError('Error updating tax', error)
    return apiError('Không thể cập nhật thuế', 500)
  }
}

// DELETE /api/settings/taxes/[systemId] - Delete tax
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  const { systemId } = await params

  try {
    const existing = await prisma.tax.findUnique({ where: { systemId } })
    if (!existing) return apiNotFound('Không tìm thấy thuế')

    await prisma.tax.delete({
      where: { systemId },
    })

    createActivityLog({
      entityType: 'tax',
      entityId: systemId,
      action: `Xóa thuế: ${existing.name}`,
      actionType: 'delete',
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({ message: 'Đã xóa thuế thành công' })
  } catch (error) {
    logError('Error deleting tax', error)
    return apiError('Không thể xóa thuế', 500)
  }
}
