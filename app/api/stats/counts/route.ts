import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { cache, CACHE_TTL } from '@/lib/cache'
import { logError } from '@/lib/logger'

/**
 * GET /api/stats/counts - Get counts and last IDs for all entities
 * 
 * Used by settings/id-counter page instead of loading all records
 * This is MUCH faster than limit=10000 queries
 */
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    // Check cache first
    const cacheKey = 'stats:counts'
    const cached = cache.get(cacheKey)
    if (cached) {
      return apiSuccess(cached)
    }

    // Run all counts and last items in parallel
    const [
      employeesCount,
      employeesLast,
      customersCount,
      customersLast,
      productsCount,
      productsLast,
      ordersCount,
      ordersLast,
      complaintsCount,
      complaintsLast,
      warrantiesCount,
      warrantiesLast,
      penaltiesCount,
      penaltiesLast,
      leavesCount,
      leavesLast,
      suppliersCount,
      suppliersLast,
      purchaseOrdersCount,
      purchaseOrdersLast,
      purchaseReturnsCount,
      purchaseReturnsLast,
      inventoryReceiptsCount,
      inventoryReceiptsLast,
      branchesCount,
      branchesLast,
      departmentsCount,
      departmentsLast,
      jobTitlesCount,
      jobTitlesLast,
      categoriesCount,
      brandsCount,
      tasksCount,
      stockTransfersCount,
      inventoryChecksCount,
    ] = await Promise.all([
      prisma.employee.count({ where: { isDeleted: false } }),
      prisma.employee.findFirst({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.customer.count({ where: { isDeleted: false } }),
      prisma.customer.findFirst({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.product.findFirst({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.order.count(),
      prisma.order.findFirst({ orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.complaint.count({ where: { isDeleted: false } }),
      prisma.complaint.findFirst({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.warranty.count({ where: { isDeleted: false } }),
      prisma.warranty.findFirst({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.penalty.count(),
      prisma.penalty.findFirst({ orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.leave.count(),
      prisma.leave.findFirst({ orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.supplier.count({ where: { isDeleted: false } }),
      prisma.supplier.findFirst({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.purchaseOrder.count({ where: { isDeleted: false } }),
      prisma.purchaseOrder.findFirst({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.purchaseReturn.count(),
      prisma.purchaseReturn.findFirst({ orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.inventoryReceipt.count(),
      prisma.inventoryReceipt.findFirst({ orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.branch.count({ where: { isDeleted: false } }),
      prisma.branch.findFirst({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.department.count({ where: { isDeleted: false } }),
      prisma.department.findFirst({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.jobTitle.count({ where: { isDeleted: false } }),
      prisma.jobTitle.findFirst({ where: { isDeleted: false }, orderBy: { createdAt: 'desc' }, select: { id: true } }),
      prisma.category.count({ where: { isDeleted: false } }),
      prisma.brand.count({ where: { isDeleted: false } }),
      prisma.task.count({ where: { isDeleted: false } }),
      prisma.stockTransfer.count(),
      prisma.inventoryCheck.count(),
    ])

    const counts = {
      employees: { count: employeesCount, lastId: employeesLast?.id },
      customers: { count: customersCount, lastId: customersLast?.id },
      products: { count: productsCount, lastId: productsLast?.id },
      orders: { count: ordersCount, lastId: ordersLast?.id },
      complaints: { count: complaintsCount, lastId: complaintsLast?.id },
      warranties: { count: warrantiesCount, lastId: warrantiesLast?.id },
      penalties: { count: penaltiesCount, lastId: penaltiesLast?.id },
      leaves: { count: leavesCount, lastId: leavesLast?.id },
      suppliers: { count: suppliersCount, lastId: suppliersLast?.id },
      purchaseOrders: { count: purchaseOrdersCount, lastId: purchaseOrdersLast?.id },
      purchaseReturns: { count: purchaseReturnsCount, lastId: purchaseReturnsLast?.id },
      inventoryReceipts: { count: inventoryReceiptsCount, lastId: inventoryReceiptsLast?.id },
      branches: { count: branchesCount, lastId: branchesLast?.id },
      departments: { count: departmentsCount, lastId: departmentsLast?.id },
      jobTitles: { count: jobTitlesCount, lastId: jobTitlesLast?.id },
      categories: { count: categoriesCount },
      brands: { count: brandsCount },
      tasks: { count: tasksCount },
      stockTransfers: { count: stockTransfersCount },
      inventoryChecks: { count: inventoryChecksCount },
    }

    // Cache for 5 minutes
    cache.set(cacheKey, counts, CACHE_TTL.MEDIUM * 1000)

    return apiSuccess(counts)
  } catch (error) {
    logError('Error fetching counts', error)
    return apiError('Failed to fetch counts', 500)
  }
}
