import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/payments/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const payment = await prisma.payment.findUnique({
      where: { systemId },
      include: {
        supplier: true,
        purchaseOrder: {
          include: {
            items: {
              include: {
                product: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Phiếu chi không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    )
  }
}

// PUT /api/payments/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const payment = await prisma.payment.update({
      where: { systemId },
      data: {
        amount: body.amount,
        method: body.method,
        description: body.description,
      },
      include: {
        supplier: true,
        purchaseOrder: true,
      },
    })

    return NextResponse.json(payment)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Phiếu chi không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}

// DELETE /api/payments/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.payment.delete({
      where: { systemId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Phiếu chi không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting payment:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    )
  }
}
