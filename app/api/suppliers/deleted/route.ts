import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'
import { serializeSupplier } from '../serialize'

// GET /api/suppliers/deleted - Get soft-deleted suppliers (excluding permanently archived)
export const GET = apiHandler(async () => {
  const deletedSuppliers = await prisma.supplier.findMany({
    where: {
      isDeleted: true,
      permanentlyDeletedAt: null,
    },
    orderBy: { deletedAt: 'desc' },
    select: {
      systemId: true,
      id: true,
      name: true,
      phone: true,
      email: true,
      address: true,
      taxCode: true,
      contactPerson: true,
      status: true,
      currentDebt: true,
      totalDebt: true,
      totalPurchased: true,
      deletedAt: true,
      isDeleted: true,
    },
  })

  return apiSuccess(deletedSuppliers.map(serializeSupplier))
})
