import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/settings/payment-methods/[systemId]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const method = await prisma.paymentMethod.findUnique({
      where: { systemId },
    })

    if (!method) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: method })
  } catch (error) {
    console.error('Error fetching payment method:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment method' },
      { status: 500 }
    )
  }
}

// PATCH /api/settings/payment-methods/[systemId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const method = await prisma.paymentMethod.update({
      where: { systemId },
      data: {
        name: body.name,
        code: body.code,
        type: body.type,
        isActive: body.isActive,
      },
    })

    return NextResponse.json({ data: method })
  } catch (error) {
    console.error('Error updating payment method:', error)
    return NextResponse.json(
      { error: 'Failed to update payment method' },
      { status: 500 }
    )
  }
}

// DELETE /api/settings/payment-methods/[systemId]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.paymentMethod.delete({
      where: { systemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    )
  }
}
