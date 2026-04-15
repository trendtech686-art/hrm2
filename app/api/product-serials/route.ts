import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiPaginated, validateBody, parsePagination } from '@/lib/api-utils'
import { z } from 'zod'

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
  if (search) where.serialNumber = { contains: search, mode: 'insensitive' }

  const [serials, total] = await Promise.all([
    prisma.productSerial.findMany({
      where,
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
  const body = await req.json()

  // Support both single and bulk creation
  if (body.serialNumbers) {
    const validated = bulkCreateSchema.parse(body)

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { systemId: validated.productId },
      select: { systemId: true },
    })
    if (!product) return apiError('Sản phẩm không tồn tại', 404)

    // Check duplicates
    const existing = await prisma.productSerial.findMany({
      where: { serialNumber: { in: validated.serialNumbers } },
      select: { serialNumber: true },
    })
    if (existing.length > 0) {
      return apiError(
        `Serial đã tồn tại: ${existing.map(e => e.serialNumber).join(', ')}`,
        400
      )
    }

    const created = await prisma.productSerial.createMany({
      data: validated.serialNumbers.map(sn => ({
        productId: validated.productId,
        branchId: validated.branchId,
        serialNumber: sn,
        purchaseOrderId: validated.purchaseOrderId,
        supplierName: validated.supplierName,
        costPrice: validated.costPrice,
      })),
    })

    return apiSuccess({ count: created.count })
  } else {
    const validated = serialSchema.parse(body)

    // Check duplicate
    const existing = await prisma.productSerial.findUnique({
      where: { serialNumber: validated.serialNumber },
    })
    if (existing) return apiError('Serial number đã tồn tại', 400)

    const serial = await prisma.productSerial.create({ data: validated })
    return apiSuccess(serial)
  }
}, { permission: 'edit_products' })
