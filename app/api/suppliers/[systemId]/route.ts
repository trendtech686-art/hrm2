import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/suppliers/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
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
      return NextResponse.json(
        { error: 'Nhà cung cấp không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(supplier)
  } catch (error) {
    console.error('Error fetching supplier:', error)
    return NextResponse.json(
      { error: 'Failed to fetch supplier' },
      { status: 500 }
    )
  }
}

// PUT /api/suppliers/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

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

    return NextResponse.json(supplier)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Nhà cung cấp không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating supplier:', error)
    return NextResponse.json(
      { error: 'Failed to update supplier' },
      { status: 500 }
    )
  }
}

// DELETE /api/suppliers/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.supplier.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Nhà cung cấp không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting supplier:', error)
    return NextResponse.json(
      { error: 'Failed to delete supplier' },
      { status: 500 }
    )
  }
}
