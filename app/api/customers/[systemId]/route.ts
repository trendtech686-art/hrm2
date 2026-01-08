import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// GET /api/customers/[systemId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const customer = await prisma.customer.findUnique({
      where: { systemId },
      include: {
        orders: {
          take: 10,
          orderBy: { orderDate: 'desc' },
          select: {
            systemId: true,
            id: true,
            orderDate: true,
            status: true,
            grandTotal: true,
          },
        },
      },
    })

    if (!customer || customer.isDeleted) {
      return apiNotFound('Customer')
    }

    return apiSuccess(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return apiError('Failed to fetch customer', 500)
  }
}

// PUT /api/customers/[systemId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const existing = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!existing || existing.isDeleted) {
      return apiNotFound('Customer')
    }

    const customer = await prisma.customer.update({
      where: { systemId },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        companyName: body.company || body.companyName,
        company: body.company || body.companyName,
        taxCode: body.taxCode,
        representative: body.representative || body.contactPerson,
        addresses: body.addresses,
        currentDebt: body.currentDebt,
        maxDebt: body.maxDebt || body.creditLimit,
        lifecycleStage: body.lifecycleStage || body.customerType,
        notes: body.notes,
        updatedBy: body.updatedBy,
      },
    })

    return apiSuccess(customer)
  } catch (error) {
    console.error('Error updating customer:', error)
    return apiError('Failed to update customer', 500)
  }
}

// DELETE /api/customers/[systemId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const customer = await prisma.customer.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return apiSuccess({ success: true, systemId: customer.systemId })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return apiError('Failed to delete customer', 500)
  }
}
