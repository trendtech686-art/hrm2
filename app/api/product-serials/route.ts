import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiPaginated, parsePagination } from '@/lib/api-utils'
import { z } from 'zod'
import { buildSearchWhere } from '@/lib/search/build-search-where'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import type { ActivityLogEntityType } from '@/lib/types/prisma-extended'

const serialSchema = z.object({
  productId: z.string().min(1),
  branchId: z.string().min(1),
  serialNumber: z.string().min(1),
  purchaseOrderId: z.string().optional(),
  supplierName: z.string().optional(),
  costPrice: z.number().optional(),
  notes: z.string().optional(),
})

const bulkCreateSchema = z.object({
  productId: z.string().min(1),
  branchId: z.string().min(1),
  serialNumbers: z.array(z.string().min(1)).min(1).max(500),
  purchaseOrderId: z.string().optional(),
  supplierName: z.string().optional(),
  costPrice: z.number().optional(),
})

// GET /api/product-serials?productId=&branchId=&status=&search=
export const GET = apiHandler(async (req) => {
  const url = new URL(req.url)
  const productId = url.searchParams.get('productId')
  const branchId = url.searchParams.get('branchId')
  const status = url.searchParams.get('status')
  const search = url.searchParams.get('search')
  const orderId = url.searchParams.get('orderId')
  const { page, limit, skip } = parsePagination(url.searchParams)

  const where: Record<string, unknown> = {}
  if (productId) where.productId = productId
  if (branchId) where.branchId = branchId
  if (status) where.status = status
  if (orderId) where.orderId = orderId
  const searchWhere = buildSearchWhere(search, ['serialNumber'])
  if (searchWhere) Object.assign(where, searchWhere)

  const [serials, total] = await Promise.all([
    prisma.productSerial.findMany({
      where,
      select: {
        systemId: true,
        productId: true,
        branchId: true,
        serialNumber: true,
        orderId: true,
        purchaseOrderId: true,
        supplierName: true,
        costPrice: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.productSerial.count({ where }),
  ])

  return apiPaginated(serials, { page, limit, total })
}, { permission: 'view_products' })

// POST /api/product-serials
export const POST = apiHandler(async (req) => {
  const body = await req.json().catch(() => ({}))

  // Support both single and bulk creation
  if (body.serialNumbers) {
    const validated = bulkCreateSchema.safeParse(body)
    if (!validated.success) {
      return apiError(validated.error.issues[0]?.message || 'Validation failed', 400)
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { systemId: validated.data.productId },
      select: { systemId: true },
    })
    if (!product) return apiError('Sản phẩm không tồn tại', 404)

    // Check duplicates
    const existing = await prisma.productSerial.findMany({
      where: { serialNumber: { in: validated.data.serialNumbers } },
      select: { serialNumber: true },
    })
    if (existing.length > 0) {
      return apiError(
        `Serial đã tồn tại: ${existing.map(e => e.serialNumber).join(', ')}`,
        400
      )
    }

    const created = await prisma.productSerial.createMany({
      data: validated.data.serialNumbers.map(sn => ({
        productId: validated.data.productId,
        branchId: validated.data.branchId,
        serialNumber: sn,
        purchaseOrderId: validated.data.purchaseOrderId,
        supplierName: validated.data.supplierName,
        costPrice: validated.data.costPrice,
      })),
    })

    createActivityLog({
      entityType: 'product' as ActivityLogEntityType,
      entityId: validated.data.productId,
      action: `Thêm ${validated.data.serialNumbers.length} serial numbers`,
      actionType: 'create',
      metadata: {
        productId: validated.data.productId,
        branchId: validated.data.branchId,
        count: validated.data.serialNumbers.length,
      },
      createdBy: 'System',
    }).catch(e => logError('[product-serials] activity log failed', e))

    return apiSuccess({ count: created.count })
  } else {
    const validated = serialSchema.safeParse(body)
    if (!validated.success) {
      return apiError(validated.error.issues[0]?.message || 'Validation failed', 400)
    }

    // Check duplicate
    const existing = await prisma.productSerial.findUnique({
      where: { serialNumber: validated.data.serialNumber },
    })
    if (existing) return apiError('Serial number đã tồn tại', 400)

    const serial = await prisma.productSerial.create({ data: validated.data })

    createActivityLog({
      entityType: 'product' as ActivityLogEntityType,
      entityId: serial.systemId,
      action: `Thêm serial: ${serial.serialNumber}`,
      actionType: 'create',
      metadata: {
        serialNumber: serial.serialNumber,
        productId: serial.productId,
        branchId: serial.branchId,
      },
      createdBy: 'System',
    }).catch(e => logError('[product-serials] activity log failed', e))

    return apiSuccess(serial)
  }
}, { permission: 'edit_products' })
