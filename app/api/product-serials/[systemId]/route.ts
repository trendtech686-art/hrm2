import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiNotFound, validateBody } from '@/lib/api-utils'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['IN_STOCK', 'SOLD', 'IN_WARRANTY', 'RETURNED', 'DAMAGED', 'TRANSFERRED']).optional(),
  branchId: z.string().optional(),
  orderId: z.string().nullable().optional(),
  warrantyId: z.string().nullable().optional(),
  customerId: z.string().nullable().optional(),
  soldPrice: z.number().nullable().optional(),
  soldDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

// GET /api/product-serials/[systemId]
export const GET = apiHandler(async (_req, { params }) => {
  const { systemId } = params
  const serial = await prisma.productSerial.findUnique({ where: { systemId } })
  if (!serial) return apiNotFound('Serial')
  return apiSuccess(serial)
}, { permission: 'view_products' })

// PATCH /api/product-serials/[systemId]
export const PATCH = apiHandler(async (req, { params }) => {
  const { systemId } = params
  const result = await validateBody(req, updateSchema)
  if (!result.success) return apiError(result.error, 400)
  const body = result.data

  const existing = await prisma.productSerial.findUnique({ where: { systemId } })
  if (!existing) return apiNotFound('Serial')

  const updated = await prisma.productSerial.update({
    where: { systemId },
    data: {
      ...body,
      soldDate: body.soldDate !== undefined
        ? (body.soldDate ? new Date(body.soldDate) : null)
        : undefined,
    } as Record<string, unknown>,
  })

  return apiSuccess(updated)
}, { permission: 'edit_products' })

// DELETE /api/product-serials/[systemId]
export const DELETE = apiHandler(async (_req, { params }) => {
  const { systemId } = params
  const existing = await prisma.productSerial.findUnique({ where: { systemId } })
  if (!existing) return apiNotFound('Serial')

  await prisma.productSerial.delete({ where: { systemId } })
  return apiSuccess({ message: 'Đã xóa serial' })
}, { permission: 'edit_products' })
