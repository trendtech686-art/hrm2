import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/warranties/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const warranty = await prisma.warranty.findUnique({
      where: { systemId },
      include: {
        customer: true,
        product: true,
        order: {
          select: { id: true, orderDate: true },
        },
      },
    })

    if (!warranty) {
      return NextResponse.json(
        { error: 'Phiếu bảo hành không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(warranty)
  } catch (error) {
    console.error('Error fetching warranty:', error)
    return NextResponse.json(
      { error: 'Failed to fetch warranty' },
      { status: 500 }
    )
  }
}

// PUT /api/warranties/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const warranty = await prisma.warranty.update({
      where: { systemId },
      data: {
        issueDescription: body.issueDescription,
        status: body.status,
        completedAt: body.completedAt ? new Date(body.completedAt) : undefined,
        solution: body.solution,
        totalCost: body.totalCost,
        notes: body.notes,
      },
      include: {
        customer: true,
        product: true,
      },
    })

    return NextResponse.json(warranty)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Phiếu bảo hành không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating warranty:', error)
    return NextResponse.json(
      { error: 'Failed to update warranty' },
      { status: 500 }
    )
  }
}

// DELETE /api/warranties/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.warranty.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Phiếu bảo hành không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting warranty:', error)
    return NextResponse.json(
      { error: 'Failed to delete warranty' },
      { status: 500 }
    )
  }
}
