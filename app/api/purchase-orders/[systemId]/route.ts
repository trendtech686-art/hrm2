import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/purchase-orders/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const order = await prisma.purchaseOrder.findUnique({
      where: { systemId },
      include: {
        supplier: true,
        items: {
          include: {
            product: {
              select: {
                systemId: true,
                id: true,
                name: true,
                thumbnailImage: true,
                unit: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Đơn mua hàng không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching purchase order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase order' },
      { status: 500 }
    )
  }
}

// PUT /api/purchase-orders/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    // Delete existing items and recreate if items provided
    if (body.items) {
      await prisma.purchaseOrderItem.deleteMany({
        where: { purchaseOrderId: systemId },
      })
    }

    const order = await prisma.purchaseOrder.update({
      where: { systemId },
      data: {
        supplierId: body.supplierId,
        orderDate: body.orderDate ? new Date(body.orderDate) : undefined,
        expectedDate: body.expectedDate ? new Date(body.expectedDate) : undefined,
        receivedDate: body.receivedDate ? new Date(body.receivedDate) : undefined,
        status: body.status,
        subtotal: body.subtotal,
        tax: body.tax,
        discount: body.discount,
        total: body.total,
        notes: body.notes,
        items: body.items ? {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            total: item.total,
          })),
        } : undefined,
      },
      include: {
        supplier: true,
        items: {
          include: { product: true },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Đơn mua hàng không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating purchase order:', error)
    return NextResponse.json(
      { error: 'Failed to update purchase order' },
      { status: 500 }
    )
  }
}

// DELETE /api/purchase-orders/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.purchaseOrder.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Đơn mua hàng không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting purchase order:', error)
    return NextResponse.json(
      { error: 'Failed to delete purchase order' },
      { status: 500 }
    )
  }
}
