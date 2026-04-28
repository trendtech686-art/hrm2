import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiPaginated, validateBody, parsePagination } from '@/lib/api-utils'
import { z } from 'zod'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import type { ActivityLogEntityType } from '@/lib/types/prisma-extended'

const batchSchema = z.object({
  productId: z.string().min(1),
  branchId: z.string().min(1),
  batchNumber: z.string().min(1),
  manufactureDate: z.string().optional(),
  expiryDate: z.string().optional(),
  quantity: z.number().int().min(0),
  supplierName: z.string().optional(),
  notes: z.string().optional(),
})

// GET /api/product-batches?productId=&branchId=&status=&nearExpiry=
export const GET = apiHandler(async (req) => {
  const url = new URL(req.url)
  const productId = url.searchParams.get('productId')
  const branchId = url.searchParams.get('branchId')
  const status = url.searchParams.get('status')
  const nearExpiry = url.searchParams.get('nearExpiry') // days until expiry
  const { page, limit, skip } = parsePagination(url.searchParams)

  const where: Record<string, unknown> = {}
  if (productId) where.productId = productId
  if (branchId) where.branchId = branchId
  if (status) where.status = status

  // Near-expiry filter: batches expiring within N days
  if (nearExpiry) {
    const days = parseInt(nearExpiry)
    if (!isNaN(days)) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + days)
      where.expiryDate = { lte: futureDate, gte: new Date() }
      where.status = 'ACTIVE'
    }
  }

  const [batches, total] = await Promise.all([
    prisma.productBatch.findMany({
      where,
      orderBy: [{ expiryDate: 'asc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.productBatch.count({ where }),
  ])

  return apiPaginated(batches, { page, limit, total })
}, { permission: 'view_products' })

// POST /api/product-batches
export const POST = apiHandler(async (req) => {
  try {
    const result = await validateBody(req, batchSchema)
    if (!result.success) return apiError(result.error, 400)
    const body = result.data

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { systemId: body.productId },
      select: { systemId: true },
    })
    if (!product) return apiError('Sản phẩm không tồn tại', 404)

    // Check unique batch number per product+branch
    const existing = await prisma.productBatch.findUnique({
      where: {
        productId_branchId_batchNumber: {
          productId: body.productId,
          branchId: body.branchId,
          batchNumber: body.batchNumber,
        },
      },
    })
    if (existing) return apiError('Mã lô đã tồn tại cho sản phẩm này tại chi nhánh', 400)

    const batch = await prisma.productBatch.create({
      data: {
        productId: body.productId,
        branchId: body.branchId,
        batchNumber: body.batchNumber,
        manufactureDate: body.manufactureDate ? new Date(body.manufactureDate) : null,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        quantity: body.quantity,
        initialQty: body.quantity,
        supplierName: body.supplierName,
        notes: body.notes,
      },
    })

    createActivityLog({
      entityType: 'product' as ActivityLogEntityType,
      entityId: batch.systemId,
      action: `Thêm lô sản phẩm: ${batch.batchNumber}`,
      actionType: 'create',
      metadata: {
        batchNumber: batch.batchNumber,
        productId: batch.productId,
        branchId: batch.branchId,
        quantity: batch.quantity,
      },
      createdBy: 'System',
    }).catch(e => logError('[product-batches] activity log failed', e))

    return apiSuccess(batch)
  } catch (error) {
    logError('POST /api/product-batches failed', error)
    return apiError('Failed to create product batch', 500)
  }
}, { permission: 'edit_products' })
