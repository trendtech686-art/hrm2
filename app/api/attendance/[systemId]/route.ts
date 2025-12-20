import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/attendance/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const attendance = await prisma.attendanceRecord.findUnique({
      where: { systemId },
      include: {
        employee: {
          include: {
            department: true,
            branch: true,
          },
        },
      },
    })

    if (!attendance) {
      return NextResponse.json(
        { error: 'Bản ghi chấm công không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

// PUT /api/attendance/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const attendance = await prisma.attendanceRecord.update({
      where: { systemId },
      data: {
        checkIn: body.checkIn ? new Date(body.checkIn) : undefined,
        checkOut: body.checkOut ? new Date(body.checkOut) : undefined,
        status: body.status,
        notes: body.notes,
        workHours: body.workHours,
      },
      include: { employee: true },
    })

    return NextResponse.json(attendance)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Bản ghi chấm công không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating attendance:', error)
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    )
  }
}

// DELETE /api/attendance/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.attendanceRecord.delete({
      where: { systemId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Bản ghi chấm công không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting attendance:', error)
    return NextResponse.json(
      { error: 'Failed to delete attendance' },
      { status: 500 }
    )
  }
}
