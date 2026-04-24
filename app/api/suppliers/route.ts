import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import type { SupplierStatus } from '@/lib/types/prisma-extended'
import { apiHandler } from '@/lib/api-handler'
import { validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createSupplierSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// GET /api/suppliers - List all suppliers
export const GET = apiHandler(async (request) => {

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const all = searchParams.get('all') === 'true'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    const where: Prisma.SupplierWhereInput = {
      isDeleted: false,
    }

    const searchWhere = buildSearchWhere<Prisma.SupplierWhereInput>(search, [
      'name',
      'id',
      { key: 'phone', caseSensitive: true },
      'email',
      'taxCode',
    ])
    if (searchWhere) Object.assign(where, searchWhere)

    if (status && status !== 'all') {
      where.status = status as SupplierStatus
    }

    if (all) {
      const suppliers = await prisma.supplier.findMany({
        where,
        orderBy: { name: 'asc' },
      })
      // Transform dates to ISO strings
      const transformedSuppliers = suppliers.map(supplier => ({
        ...supplier,
        createdAt: supplier.createdAt?.toISOString() || null,
        updatedAt: supplier.updatedAt?.toISOString() || null,
        deletedAt: supplier.deletedAt?.toISOString() || null,
        currentDebt: supplier.currentDebt ? Number(supplier.currentDebt) : 0,
        totalDebt: supplier.totalDebt ? Number(supplier.totalDebt) : 0,
        totalPurchased: supplier.totalPurchased ? Number(supplier.totalPurchased) : 0,
      }));
      return apiSuccess({ data: transformedSuppliers })
    }

    // Build orderBy
    const orderBy: Prisma.SupplierOrderByWithRelationInput = { [sortBy]: sortOrder }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          _count: { select: { purchaseOrders: true } },
        },
      }),
      prisma.supplier.count({ where }),
    ])

    // Transform dates to ISO strings
    const transformedSuppliers = suppliers.map(supplier => ({
      ...supplier,
      createdAt: supplier.createdAt?.toISOString() || null,
      updatedAt: supplier.updatedAt?.toISOString() || null,
      deletedAt: supplier.deletedAt?.toISOString() || null,
      currentDebt: supplier.currentDebt ? Number(supplier.currentDebt) : 0,
      totalDebt: supplier.totalDebt ? Number(supplier.totalDebt) : 0,
      totalPurchased: supplier.totalPurchased ? Number(supplier.totalPurchased) : 0,
    }));

    return apiPaginated(transformedSuppliers, { page, limit, total })
  } catch (error) {
    logError('Error fetching suppliers', error)
    return apiError('Lỗi khi lấy danh sách nhà cung cấp', 500)
  }
})

// POST /api/suppliers - Create new supplier
export const POST = apiHandler(async (request, { session }) => {

  const result = await validateBody(request, createSupplierSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

    const supplier = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'suppliers',
        body.id?.trim() || undefined
      );

      return tx.supplier.create({
        data: {
          systemId,
          id: businessId,
          name: body.name,
          contactPerson: body.contactPerson || '',
          phone: body.phone || '',
          email: body.email || '',
          address: body.address || '',
          addressData: (body.addressData ?? Prisma.JsonNull) as Prisma.InputJsonValue,
          taxCode: body.taxCode || '',
          bankAccount: body.bankAccount || '',
          bankName: body.bankName || '',
          website: body.website || '',
          accountManager: body.accountManager || '',
          currentDebt: body.currentDebt || 0,
          notes: body.notes || '',
          status: body.status || 'Đang Giao Dịch',
        },
      });
    });

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'supplier',
          entityId: supplier.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo nhà cung cấp: ${supplier.name} (${supplier.id})`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] supplier created failed', e))

    return apiSuccess(supplier, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã nhà cung cấp đã tồn tại', 400)
    }
    logError('Error creating supplier', error)
    return apiError('Lỗi khi tạo nhà cung cấp', 500)
  }
})
