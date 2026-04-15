/**
 * API Routes for Supplier Warranty (BH Nhà cung cấp)
 * GET /api/supplier-warranties — List with filters + pagination
 */
import { apiHandler } from '@/lib/api-handler'
import { apiPaginated, parsePagination, serializeDecimals } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'

export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url)
  const { page, limit, skip } = parsePagination(searchParams)

  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const supplierId = searchParams.get('supplierId') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

  const where: Prisma.SupplierWarrantyWhereInput = {
    isDeleted: false,
  }

  if (search) {
    where.OR = [
      { id: { contains: search, mode: 'insensitive' } },
      { supplierName: { contains: search, mode: 'insensitive' } },
      { trackingNumber: { contains: search, mode: 'insensitive' } },
      { reason: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status) {
    where.status = status as Prisma.SupplierWarrantyWhereInput['status']
  }

  if (supplierId) {
    where.supplierSystemId = supplierId
  }

  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = new Date(startDate)
    if (endDate) where.createdAt.lte = new Date(endDate + 'T23:59:59.999Z')
  }

  const allowedSortFields = ['createdAt', 'id', 'status', 'supplierName', 'totalWarrantyCost', 'sentDate']
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'

  const [data, total] = await Promise.all([
    prisma.supplierWarranty.findMany({
      where,
      include: { items: true },
      orderBy: { [orderField]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.supplierWarranty.count({ where }),
  ])

  return apiPaginated(
    serializeDecimals(data),
    { total, page, limit }
  )
}, { permission: 'view_supplier_warranty' })
