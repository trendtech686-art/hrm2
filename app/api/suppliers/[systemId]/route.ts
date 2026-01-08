import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateSupplierSchema } from './validation'

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

    return apiSuccess(supplier)
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
        name: body.name,
        contactPerson: body.contactPerson,
        phone: body.phone,
        email: body.email,
        address: body.address,
        taxCode: body.taxCode,
        bankAccount: body.bankAccount,
        website: body.website,
      },
    })

    return apiSuccess(supplier)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Nhà cung cấp không tồn tại', 404)
    }
    console.error('Error updating supplier:', error)
    return apiError('Failed to update supplier', 500)
  }
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
