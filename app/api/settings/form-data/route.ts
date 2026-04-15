/**
 * Combined API endpoint for form settings data
 * Returns payment-methods, payment-types, and taxes in a single request
 * Reduces API calls from 3 to 1 for forms like PO, Order, etc.
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

// GET /api/settings/form-data
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  try {
    const [paymentMethods, paymentTypesRaw, taxes] = await Promise.all([
      // Payment methods
      prisma.paymentMethod.findMany({
        orderBy: { createdAt: 'asc' },
      }),
      // Payment types (from SettingsData)
      prisma.settingsData.findMany({
        where: { type: 'payment-type', isDeleted: false },
        orderBy: [{ id: 'asc' }],
      }),
      // Taxes
      prisma.tax.findMany({
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
      }),
    ])

    // Map payment methods
    const mappedPaymentMethods = paymentMethods.map((m) => ({
      systemId: m.systemId,
      id: m.id,
      name: m.name,
      code: m.code,
      type: m.type,
      description: m.description,
      isActive: m.isActive,
      isDefault: m.isDefault ?? false,
    }))

    // Map payment types (flatten metadata)
    const mappedPaymentTypes = paymentTypesRaw.map((item) => {
      const meta = (item.metadata as Record<string, unknown> | null) || {}
      return {
        systemId: item.systemId,
        id: item.id,
        name: item.name,
        description: item.description,
        type: item.type,
        isActive: item.isActive,
        isDefault: item.isDefault,
        ...meta,
      }
    })

    return apiSuccess({
      paymentMethods: mappedPaymentMethods,
      paymentTypes: mappedPaymentTypes,
      taxes,
    })
  } catch (error) {
    logError('Error fetching form settings data', error)
    return apiError('Không thể tải dữ liệu cài đặt', 500)
  }
}
