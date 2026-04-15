import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiNotFound, validateBody } from '@/lib/api-utils'
import { z } from 'zod'

const updateSchema = z.object({
  batchNumber: z.string().min(1).optional(),
  manufactureDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),
  quantity: z.number().int().min(0).optional(),
  supplierName: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'DEPLETED', 'DISPOSED']).optional(),
})

// GET /api/product-batches/[systemId]
export const GET = apiHandler(async (_req, { params }) => {
  const { systemId } = params
  const batch = await prisma.productBatch.findUnique({ where: { systemId } })
  if (!batch) return apiNotFound('Lô hàng')
  return apiSuccess(batch)
}, { permission: 'view_products' })

// PATCH /api/product-batches/[systemId]
export const PATCH = apiHandler(async (req, { params }) => {
  const { systemId } = params
  const result = await validateBody(req, updateSchema)
  if (!result.success) return apiError(result.error, 400)
  const body = result.data

  const existing = await prisma.productBatch.findUnique({ where: { systemId } })
  if (!existing) return apiNotFound('Lô hàng')

  // Check unique batch number if changed
  if (body.batchNumber && body.batchNumber !== existing.batchNumber) {
    const dup = await prisma.productBatch.findUnique({
      where: {
        productId_branchId_batchNumber: {
          productId: existing.productId,
          branchId: existing.branchId,
          batchNumber: body.batchNumber,
        },
      },
    })
    if (dup) return apiError('Mã lô đã tồn tại', 400)
  }

  const updated = await prisma.productBatch.update({
    where: { systemId },
    data: {
      ...body,
      manufactureDate: body.manufactureDate !== undefined
        ? (body.manufactureDate ? new Date(body.manufactureDate) : null)
        : undefined,
      expiryDate: body.expiryDate !== undefined
        ? (body.expiryDate ? new Date(body.expiryDate) : null)
        : undefined,
    },
  })

  return apiSuccess(updated)
}, { permission: 'edit_products' })

// DELETE /api/product-batches/[systemId]
export const DELETE = apiHandler(async (_req, { params }) => {
  const { systemId } = params
  const existing = await prisma.productBatch.findUnique({ where: { systemId } })
  if (!existing) return apiNotFound('Lô hàng')

  await prisma.productBatch.delete({ where: { systemId } })
  return apiSuccess({ message: 'Đã xóa lô hàng' })
}, { permission: 'edit_products' })
