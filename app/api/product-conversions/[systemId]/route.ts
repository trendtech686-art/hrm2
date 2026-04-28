import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiNotFound, validateBody } from '@/lib/api-utils'
import { z } from 'zod'

const updateSchema = z.object({
  conversionUnit: z.string().min(1).optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  name: z.string().optional(),
  sellingPrice: z.number().optional(),
  costPrice: z.number().optional(),
  weight: z.number().optional(),
  weightUnit: z.string().optional(),
  thumbnailImage: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

// GET /api/product-conversions/[systemId]
export const GET = apiHandler(async (_req, { params }) => {
  const { systemId } = params
  const conversion = await prisma.productConversion.findUnique({
    where: { systemId },
    select: {
      systemId: true,
      baseProductId: true,
      conversionUnit: true,
      conversionRate: true,
      sku: true,
      barcode: true,
      name: true,
      sellingPrice: true,
      costPrice: true,
      weight: true,
      weightUnit: true,
      thumbnailImage: true,
      isActive: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
      baseProduct: { select: { systemId: true, id: true, name: true, unit: true } },
    },
  })
  if (!conversion) return apiNotFound('Sản phẩm quy đổi')
  return apiSuccess(conversion)
}, { permission: 'view_products' })

// PATCH /api/product-conversions/[systemId]
export const PATCH = apiHandler(async (req, { params }) => {
  const { systemId } = params
  const result = await validateBody(req, updateSchema)
  if (!result.success) return apiError(result.error, 400)
  const body = result.data

  const existing = await prisma.productConversion.findUnique({ where: { systemId } })
  if (!existing) return apiNotFound('Sản phẩm quy đổi')

  // SKU uniqueness check
  if (body.sku && body.sku !== existing.sku) {
    const dup = await prisma.productConversion.findUnique({ where: { sku: body.sku } })
    if (dup) return apiError('Mã SKU đã tồn tại', 400)
  }

  const updated = await prisma.productConversion.update({
    where: { systemId },
    data: body as Record<string, unknown>,
    select: {
      systemId: true,
      baseProductId: true,
      conversionUnit: true,
      conversionRate: true,
      sku: true,
      barcode: true,
      name: true,
      sellingPrice: true,
      costPrice: true,
      weight: true,
      weightUnit: true,
      thumbnailImage: true,
      isActive: true,
      sortOrder: true,
      createdAt: true,
      updatedAt: true,
      baseProduct: { select: { systemId: true, id: true, name: true, unit: true } },
    },
  })

  return apiSuccess(updated)
}, { permission: 'edit_products' })

// DELETE /api/product-conversions/[systemId]
export const DELETE = apiHandler(async (_req, { params }) => {
  const { systemId } = params
  
  const existing = await prisma.productConversion.findUnique({ where: { systemId } })
  if (!existing) return apiNotFound('Sản phẩm quy đổi')

  await prisma.productConversion.delete({ where: { systemId } })
  return apiSuccess({ message: 'Đã xóa sản phẩm quy đổi' })
}, { permission: 'edit_products' })
