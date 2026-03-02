import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import type { SupplierStatus } from '@/lib/types/prisma-extended'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createSupplierSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'

// GET /api/suppliers - List all suppliers
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

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

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { taxCode: { contains: search, mode: 'insensitive' } },
      ]
    }

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
    console.error('Error fetching suppliers:', error)
    return apiError('Failed to fetch suppliers', 500)
  }
}

// POST /api/suppliers - Create new supplier
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

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

    return apiSuccess(supplier, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã nhà cung cấp đã tồn tại', 400)
    }
    console.error('Error creating supplier:', error)
    return apiError('Failed to create supplier', 500)
  }
}
