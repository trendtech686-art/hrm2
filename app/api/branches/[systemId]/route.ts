import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/branches/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const branch = await prisma.branch.findUnique({
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
            jobTitle: true,
            department: true,
          },
        },
        _count: { select: { employees: true } },
      },
    })

    if (!branch) {
      return NextResponse.json(
        { error: 'Chi nhánh không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(branch)
  } catch (error) {
    console.error('Error fetching branch:', error)
    return NextResponse.json(
      { error: 'Failed to fetch branch' },
      { status: 500 }
    )
  }
}

// PUT /api/branches/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const branch = await prisma.branch.update({
      where: { systemId },
      data: {
        name: body.name,
        address: body.address,
        phone: body.phone,
        isDefault: body.isDefault,
      },
    })

    return NextResponse.json(branch)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Chi nhánh không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating branch:', error)
    return NextResponse.json(
      { error: 'Failed to update branch' },
      { status: 500 }
    )
  }
}

// DELETE /api/branches/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    // Soft delete
    await prisma.branch.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Chi nhánh không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting branch:', error)
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 }
    )
  }
}
