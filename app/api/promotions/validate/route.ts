import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import { serializeDecimals } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { z } from 'zod'

const validatePromotionSchema = z.object({
  code: z.string().min(1).transform(v => v.trim().toUpperCase()),
  orderTotal: z.number().min(0),
})

// POST /api/promotions/validate - Validate and calculate discount for a promo code
export const POST = apiHandler(async (req) => {
  try {
    const validation = await validateBody(req, validatePromotionSchema)
    if (!validation.success) {
      return apiError(validation.error, 400)
    }
    const { code, orderTotal } = validation.data

    const promotion = await prisma.promotion.findUnique({ where: { code } })
    if (!promotion) {
      return apiError('Mã giảm giá không tồn tại', 404)
    }

    if (!promotion.isActive) {
      return apiError('Mã giảm giá đã hết hiệu lực', 400)
    }

    const now = new Date()
    if (promotion.startDate && now < promotion.startDate) {
      return apiError('Mã giảm giá chưa đến thời gian sử dụng', 400)
    }
    if (promotion.endDate && now > promotion.endDate) {
      return apiError('Mã giảm giá đã hết hạn', 400)
    }

    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return apiError('Mã giảm giá đã hết lượt sử dụng', 400)
    }

    const minAmount = Number(promotion.minOrderAmount) || 0
    if (orderTotal < minAmount) {
      return apiError(`Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN').format(minAmount)}đ`, 400)
    }

    // Calculate discount amount
    let discountAmount: number
    if (promotion.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((orderTotal * Number(promotion.discountValue)) / 100)
      const maxDiscount = Number(promotion.maxDiscount) || 0
      if (maxDiscount > 0 && discountAmount > maxDiscount) {
        discountAmount = maxDiscount
      }
    } else {
      discountAmount = Number(promotion.discountValue)
    }

    // Don't exceed order total
    if (discountAmount > orderTotal) {
      discountAmount = orderTotal
    }

    return apiSuccess(serializeDecimals({
      code: promotion.code,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: Number(promotion.discountValue),
      discountAmount,
    }))
  } catch (error) {
    logError('POST /api/promotions/validate failed', error)
    return apiError('Failed to validate promotion', 500)
  }
}, { auth: true, permission: 'view_orders' })
