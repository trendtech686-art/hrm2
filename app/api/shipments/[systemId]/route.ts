import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/shipments/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const shipment = await prisma.shipment.findUnique({
      where: { systemId },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
    })

    if (!shipment) {
      return NextResponse.json(
        { error: 'Vận đơn không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(shipment)
  } catch (error) {
    console.error('Error fetching shipment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipment' },
      { status: 500 }
    )
  }
}

// PUT /api/shipments/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const shipment = await prisma.shipment.update({
      where: { systemId },
      data: {
        carrier: body.carrier,
        trackingNumber: body.trackingNumber,
        shippingFee: body.shippingFee,
        status: body.status,
        deliveredAt: body.deliveredAt ? new Date(body.deliveredAt) : undefined,
        recipientName: body.recipientName,
        recipientPhone: body.recipientPhone,
        recipientAddress: body.recipientAddress,
        notes: body.notes,
      },
      include: {
        order: true,
      },
    })

    return NextResponse.json(shipment)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vận đơn không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating shipment:', error)
    return NextResponse.json(
      { error: 'Failed to update shipment' },
      { status: 500 }
    )
  }
}

// DELETE /api/shipments/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.shipment.delete({
      where: { systemId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vận đơn không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting shipment:', error)
    return NextResponse.json(
      { error: 'Failed to delete shipment' },
      { status: 500 }
    )
  }
}
