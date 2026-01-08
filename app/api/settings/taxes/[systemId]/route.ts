import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { z } from 'zod'

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
    console.error('Error fetching tax:', error)
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

    return apiSuccess({ data: tax })
  } catch (error) {
    console.error('Error updating tax:', error)
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
    await prisma.tax.delete({
      where: { systemId },
    })

    return apiSuccess({ message: 'Đã xóa thuế thành công' })
  } catch (error) {
    console.error('Error deleting tax:', error)
    return apiError('Không thể xóa thuế', 500)
  }
}
