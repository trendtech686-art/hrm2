import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/complaints/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const complaint = await prisma.complaint.findUnique({
      where: { systemId },
      include: {
        customer: true,
        assignee: {
          select: { id: true, fullName: true, avatar: true, phone: true },
        },
      },
    })

    if (!complaint) {
      return NextResponse.json(
        { error: 'Khiếu nại không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(complaint)
  } catch (error) {
    console.error('Error fetching complaint:', error)
    return NextResponse.json(
      { error: 'Failed to fetch complaint' },
      { status: 500 }
    )
  }
}

// PUT /api/complaints/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const complaint = await prisma.complaint.update({
      where: { systemId },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        priority: body.priority,
        status: body.status,
        assigneeId: body.assigneeId,
        resolution: body.resolution,
        resolvedAt: body.resolvedAt ? new Date(body.resolvedAt) : undefined,
      },
      include: {
        customer: true,
        assignee: true,
      },
    })

    return NextResponse.json(complaint)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Khiếu nại không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating complaint:', error)
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    )
  }
}

// DELETE /api/complaints/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.complaint.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Khiếu nại không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting complaint:', error)
    return NextResponse.json(
      { error: 'Failed to delete complaint' },
      { status: 500 }
    )
  }
}
