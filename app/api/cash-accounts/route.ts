import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/cash-accounts - List all cash accounts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    const where: any = {
      isActive: true,
    }

    const accounts = await prisma.cashAccount.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ data: accounts })
  } catch (error) {
    console.error('Error fetching cash accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cash accounts' },
      { status: 500 }
    )
  }
}

// POST /api/cash-accounts - Create new cash account
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: 'Mã và tên quỹ là bắt buộc' },
        { status: 400 }
      )
    }

    const account = await prisma.cashAccount.create({
      data: {
        systemId: `CASH${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        type: body.type || body.accountType || 'CASH',
        balance: body.balance || body.currentBalance || 0,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        isActive: body.isActive ?? true,
      },
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Mã quỹ đã tồn tại' },
        { status: 400 }
      )
    }
    console.error('Error creating cash account:', error)
    return NextResponse.json(
      { error: 'Failed to create cash account' },
      { status: 500 }
    )
  }
}
