import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/job-titles/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const jobTitle = await prisma.jobTitle.findUnique({
      where: { systemId },
      include: {
        employees: {
          where: { isDeleted: false },
          take: 10,
          select: {
            systemId: true,
            id: true,
            fullName: true,
            avatar: true,
            department: true,
          },
        },
        _count: { select: { employees: true } },
      },
    })

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Chức danh không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(jobTitle)
  } catch (error) {
    console.error('Error fetching job title:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job title' },
      { status: 500 }
    )
  }
}

// PUT /api/job-titles/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const jobTitle = await prisma.jobTitle.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.description,
      },
    })

    return NextResponse.json(jobTitle)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Chức danh không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating job title:', error)
    return NextResponse.json(
      { error: 'Failed to update job title' },
      { status: 500 }
    )
  }
}

// DELETE /api/job-titles/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    // Soft delete
    await prisma.jobTitle.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Chức danh không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting job title:', error)
    return NextResponse.json(
      { error: 'Failed to delete job title' },
      { status: 500 }
    )
  }
}
