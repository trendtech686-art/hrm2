/**
 * API Routes for Supplier Warranty (BH Nhà cung cấp)
 * GET /api/supplier-warranties — List with filters + pagination
 */
import { apiHandler } from '@/lib/api-handler'
import { apiPaginated, parsePagination, serializeDecimals } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { buildSearchWhere } from '@/lib/search/build-search-where'

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

  const searchWhere = buildSearchWhere<Prisma.SupplierWarrantyWhereInput>(search, [
    'id',
    'supplierName',
    'trackingNumber',
    'reason',
  ])
  if (searchWhere) Object.assign(where, searchWhere)

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
      select: {
        systemId: true,
        id: true,
        supplierSystemId: true,
        supplierName: true,
        status: true,
        trackingNumber: true,
        sentDate: true,
        receivedDate: true,
        reason: true,
        totalWarrantyCost: true,
        notes: true,
        isDeleted: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        items: true,
      },
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
