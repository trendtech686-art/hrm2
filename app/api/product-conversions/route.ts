import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import { z } from 'zod'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import type { ActivityLogEntityType } from '@/lib/types/prisma-extended'

const conversionSchema = z.object({
  baseProductId: z.string().min(1),
  conversionUnit: z.string().min(1),
  conversionRate: z.number().int().min(2, 'Tỷ lệ quy đổi phải >= 2'),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  name: z.string().optional(),
  sellingPrice: z.number().optional(),
  costPrice: z.number().optional(),
  weight: z.number().optional(),
  weightUnit: z.string().optional(),
  thumbnailImage: z.string().optional(),
})

// GET /api/product-conversions?baseProductId=xxx
export const GET = apiHandler(async (req) => {
  const url = new URL(req.url)
  const baseProductId = url.searchParams.get('baseProductId')

  const where = baseProductId
    ? { baseProductId, isActive: true }
    : { isActive: true }

  const conversions = await prisma.productConversion.findMany({
    where,
    include: { baseProduct: { select: { systemId: true, id: true, name: true, unit: true } } },
    orderBy: { sortOrder: 'asc' },
  })

  return apiSuccess(conversions)
}, { permission: 'view_products' })

// POST /api/product-conversions
export const POST = apiHandler(async (req) => {
  const result = await validateBody(req, conversionSchema)
  if (!result.success) return apiError(result.error, 400)
  const body = result.data

  // Verify base product exists
  const product = await prisma.product.findUnique({
    where: { systemId: body.baseProductId },
    select: { systemId: true, name: true },
  })
  if (!product) return apiError('Sản phẩm gốc không tồn tại', 404)

  // Check unique SKU
  if (body.sku) {
    const existing = await prisma.productConversion.findUnique({ where: { sku: body.sku } })
    if (existing) return apiError('Mã SKU đã tồn tại', 400)
  }

  const conversion = await prisma.productConversion.create({
    data: {
      baseProductId: body.baseProductId,
      conversionUnit: body.conversionUnit,
      conversionRate: body.conversionRate,
      sku: body.sku,
      barcode: body.barcode,
      name: body.name,
      sellingPrice: body.sellingPrice,
      costPrice: body.costPrice,
      weight: body.weight,
      weightUnit: body.weightUnit,
      thumbnailImage: body.thumbnailImage,
    },
    include: { baseProduct: { select: { systemId: true, id: true, name: true, unit: true } } },
  })

  createActivityLog({
    entityType: 'product' as ActivityLogEntityType,
    entityId: conversion.systemId,
    action: `Thêm quy đổi: ${conversion.conversionUnit} cho ${product.name}`,
    actionType: 'create',
    metadata: {
      baseProductId: conversion.baseProductId,
      conversionUnit: conversion.conversionUnit,
      conversionRate: conversion.conversionRate,
    },
    createdBy: 'System',
  }).catch(e => logError('[product-conversions] activity log failed', e))

  return apiSuccess(conversion)
}, { permission: 'edit_products' })
