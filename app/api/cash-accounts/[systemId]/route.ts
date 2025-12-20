import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/cash-accounts/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const account = await prisma.cashAccount.findUnique({
      where: { systemId },
      include: {
        transactions: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!account) {
      return NextResponse.json(
        { error: 'Quỹ tiền không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error('Error fetching cash account:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cash account' },
      { status: 500 }
    )
  }
}

// PUT /api/cash-accounts/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const account = await prisma.cashAccount.update({
      where: { systemId },
      data: {
        name: body.name,
        accountType: body.type || body.accountType,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        isActive: body.isActive,
      },
    })

    return NextResponse.json(account)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Quỹ tiền không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating cash account:', error)
    return NextResponse.json(
      { error: 'Failed to update cash account' },
      { status: 500 }
    )
  }
}

// DELETE /api/cash-accounts/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params

    await prisma.cashAccount.update({
      where: { systemId },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Quỹ tiền không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting cash account:', error)
    return NextResponse.json(
      { error: 'Failed to delete cash account' },
      { status: 500 }
    )
  }
}
