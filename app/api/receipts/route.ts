import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/receipts - List all receipts (phiếu thu)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (customerId) {
      where.customerId = customerId
    }

    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true },
          },
          order: {
            select: { id: true },
          },
        },
      }),
      prisma.receipt.count({ where }),
    ])

    return NextResponse.json({
      data: receipts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching receipts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch receipts' },
      { status: 500 }
    )
  }
}

// POST /api/receipts - Create new receipt
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID
    if (!body.id) {
      const lastReceipt = await prisma.receipt.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastReceipt?.id 
        ? parseInt(lastReceipt.id.replace('PT', '')) 
        : 0
      body.id = `PT${String(lastNum + 1).padStart(6, '0')}`
    }

    const receipt = await prisma.receipt.create({
      data: {
        id: body.id,
        type: body.type || 'CUSTOMER_PAYMENT',
        customerId: body.customerId,
        orderId: body.orderId,
        branchId: body.branchId,
        amount: body.amount,
        method: body.method || 'CASH',
        receiptDate: body.receiptDate ? new Date(body.receiptDate) : new Date(),
        description: body.description,
      },
      include: {
        customer: true,
        order: true,
      },
    })

    return NextResponse.json(receipt, { status: 201 })
  } catch (error) {
    console.error('Error creating receipt:', error)
    return NextResponse.json(
      { error: 'Failed to create receipt' },
      { status: 500 }
    )
  }
}
