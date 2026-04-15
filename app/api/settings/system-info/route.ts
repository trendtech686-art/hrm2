import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const GET = apiHandler(async () => {
  // Real DB stats via parallel queries
  const [
    totalUsers,
    activeUsers,
    totalOrders,
    totalProducts,
    totalCustomers,
    totalEmployees,
    activityLogsCount,
    dbSize,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.order.count().catch(() => 0),
    prisma.product.count().catch(() => 0),
    prisma.customer.count().catch(() => 0),
    prisma.employee.count().catch(() => 0),
    prisma.activityLog.count().catch(() => 0),
    prisma.$queryRaw<Array<{ size: string }>>`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `.catch(() => [{ size: 'N/A' }]),
  ])

  return apiSuccess({
    database: {
      size: dbSize[0]?.size ?? 'N/A',
      tables: {
        users: totalUsers,
        activeUsers,
        orders: totalOrders,
        products: totalProducts,
        customers: totalCustomers,
        employees: totalEmployees,
        activityLogs: activityLogsCount,
      },
    },
    environment: {
      nodeEnv: process.env.NODE_ENV ?? 'development',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: Math.floor(process.uptime()),
      memoryUsage: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    },
  })
}, { permission: 'edit_settings' })
