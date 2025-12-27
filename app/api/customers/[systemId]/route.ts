import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/customers/[systemId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
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
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}

// PUT /api/customers/[systemId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const existing = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!existing || existing.isDeleted) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
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

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

// DELETE /api/customers/[systemId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  try {
    const { systemId } = await params

    const customer = await prisma.customer.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, systemId: customer.systemId })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    )
  }
}
