import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateSupplierSchema } from './validation'

// Helper to serialize Decimal fields for client
function serializeSupplier<T extends { 
  totalPurchased?: Prisma.Decimal | number | null;
  totalDebt?: Prisma.Decimal | number | null;
  currentDebt?: Prisma.Decimal | number | null;
  purchaseOrders?: { subtotal?: Prisma.Decimal | number | null; discount?: Prisma.Decimal | number | null; tax?: Prisma.Decimal | number | null; total?: Prisma.Decimal | number | null; paid?: Prisma.Decimal | number | null; debt?: Prisma.Decimal | number | null }[];
}>(supplier: T) {
  return {
    ...supplier,
    totalPurchased: supplier.totalPurchased !== null && supplier.totalPurchased !== undefined ? Number(supplier.totalPurchased) : 0,
    totalDebt: supplier.totalDebt !== null && supplier.totalDebt !== undefined ? Number(supplier.totalDebt) : 0,
    currentDebt: supplier.currentDebt !== null && supplier.currentDebt !== undefined ? Number(supplier.currentDebt) : null,
    purchaseOrders: supplier.purchaseOrders?.map(po => ({
      ...po,
      subtotal: po.subtotal !== null && po.subtotal !== undefined ? Number(po.subtotal) : 0,
      discount: po.discount !== null && po.discount !== undefined ? Number(po.discount) : 0,
      tax: po.tax !== null && po.tax !== undefined ? Number(po.tax) : 0,
      total: po.total !== null && po.total !== undefined ? Number(po.total) : 0,
      paid: po.paid !== null && po.paid !== undefined ? Number(po.paid) : 0,
      debt: po.debt !== null && po.debt !== undefined ? Number(po.debt) : 0,
    })),
  };
}

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/suppliers/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const supplier = await prisma.supplier.findUnique({
      where: { systemId },
      include: {
        purchaseOrders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { purchaseOrders: true } },
      },
    })

    if (!supplier) {
      return apiError('Nhà cung cấp không tồn tại', 404)
    }

    return apiSuccess(serializeSupplier(supplier))
  } catch (error) {
    console.error('Error fetching supplier:', error)
    return apiError('Failed to fetch supplier', 500)
  }
}

// PUT /api/suppliers/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateSupplierSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const supplier = await prisma.supplier.update({
      where: { systemId },
      data: {
        ...(body.id !== undefined && { id: body.id }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.contactPerson !== undefined && { contactPerson: body.contactPerson || '' }),
        ...(body.phone !== undefined && { phone: body.phone || '' }),
        ...(body.email !== undefined && { email: body.email || '' }),
        ...(body.address !== undefined && { address: body.address || '' }),
        ...(body.taxCode !== undefined && { taxCode: body.taxCode || '' }),
        ...(body.bankAccount !== undefined && { bankAccount: body.bankAccount || '' }),
        ...(body.bankName !== undefined && { bankName: body.bankName || '' }),
        ...(body.website !== undefined && { website: body.website || '' }),
        ...(body.accountManager !== undefined && { accountManager: body.accountManager || '' }),
        ...(body.notes !== undefined && { notes: body.notes || '' }),
        ...(body.status !== undefined && { status: body.status || 'Đang Giao Dịch' }),
      },
    })

    return apiSuccess(serializeSupplier(supplier))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Nhà cung cấp không tồn tại', 404)
    }
    console.error('Error updating supplier:', error)
    return apiError('Failed to update supplier', 500)
  }
}

// PATCH /api/suppliers/[systemId] - same as PUT
export async function PATCH(request: Request, { params }: RouteParams) {
  return PUT(request, { params })
}

// DELETE /api/suppliers/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.supplier.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Nhà cung cấp không tồn tại', 404)
    }
    console.error('Error deleting supplier:', error)
    return apiError('Failed to delete supplier', 500)
  }
}
