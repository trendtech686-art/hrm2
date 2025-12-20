import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/payroll/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const payroll = await prisma.payroll.findUnique({
      where: { systemId },
      include: {
        items: {
          include: {
            employee: {
              include: {
                department: true,
                branch: true,
                jobTitle: true,
              },
            },
          },
        },
      },
    })

    if (!payroll) {
      return NextResponse.json(
        { error: 'Bảng lương không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(payroll)
  } catch (error) {
    console.error('Error fetching payroll:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payroll' },
      { status: 500 }
    )
  }
}

// PUT /api/payroll/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    // Delete existing items if new items provided
    if (body.items) {
      await prisma.payrollItem.deleteMany({
        where: { payrollId: systemId },
      })
    }

    const payroll = await prisma.payroll.update({
      where: { systemId },
      data: {
        status: body.status,
        paidAt: body.paidAt ? new Date(body.paidAt) : undefined,
        items: body.items ? {
          create: body.items.map((item: any) => ({
            employeeId: item.employeeId,
            employeeName: item.employeeName || '',
            employeeCode: item.employeeCode || '',
            baseSalary: item.baseSalary || 0,
            netSalary: item.netSalary || 0,
            notes: item.notes,
          })),
        } : undefined,
      },
      include: {
        items: {
          include: { employee: true },
        },
      },
    })

    return NextResponse.json(payroll)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Bảng lương không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating payroll:', error)
    return NextResponse.json(
      { error: 'Failed to update payroll' },
      { status: 500 }
    )
  }
}

// DELETE /api/payroll/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    // Delete items first, then payroll
    await prisma.payrollItem.deleteMany({
      where: { payrollId: systemId },
    })

    await prisma.payroll.delete({
      where: { systemId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Bảng lương không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting payroll:', error)
    return NextResponse.json(
      { error: 'Failed to delete payroll' },
      { status: 500 }
    )
  }
}
