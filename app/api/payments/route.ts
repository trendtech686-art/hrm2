import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/payments - List all payments (phiếu chi)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const supplierId = searchParams.get('supplierId')

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          purchaseOrder: {
            select: { systemId: true, id: true },
          },
          branch: {
            select: { systemId: true, id: true, name: true },
          },
        },
      }),
      prisma.payment.count({ where }),
    ])

    return NextResponse.json({
      data: payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Create new payment
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID
    if (!body.id) {
      const lastPayment = await prisma.payment.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastPayment?.id 
        ? parseInt(lastPayment.id.replace('PC', '')) 
        : 0
      body.id = `PC${String(lastNum + 1).padStart(6, '0')}`
    }

    const payment = await prisma.payment.create({
      data: {
        systemId: `PAY${String(Date.now()).slice(-10).padStart(10, '0')}`,
        id: body.id,
        supplierId: body.supplierId,
        supplierName: body.supplierName,
        purchaseOrderId: body.purchaseOrderId,
        branchId: body.branchId,
        amount: body.amount,
        paymentMethod: body.method || body.paymentMethod || 'CASH',
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : new Date(),
        description: body.description,
      },
      include: {
        purchaseOrder: true,
        branch: true,
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
