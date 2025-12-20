import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/warranties - List all warranties
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const skip = (page - 1) * limit

    const where: any = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (customerId) {
      where.customerId = customerId
    }

    const [warranties, total] = await Promise.all([
      prisma.warranty.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true },
          },
          product: {
            select: { id: true, name: true, thumbnailImage: true },
          },
        },
      }),
      prisma.warranty.count({ where }),
    ])

    return NextResponse.json({
      data: warranties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching warranties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch warranties' },
      { status: 500 }
    )
  }
}

// POST /api/warranties - Create new warranty
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID
    if (!body.id) {
      const lastWarranty = await prisma.warranty.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastWarranty?.id 
        ? parseInt(lastWarranty.id.replace('BH', '')) 
        : 0
      body.id = `BH${String(lastNum + 1).padStart(6, '0')}`
    }

    const warranty = await prisma.warranty.create({
      data: {
        id: body.id,
        customerId: body.customerId,
        productId: body.productId,
        orderId: body.orderId,
        customerName: body.customerName || '',
        customerPhone: body.customerPhone || '',
        productName: body.productName || '',
        title: body.title || '',
        serialNumber: body.serialNumber,
        issueDescription: body.issueDescription,
        status: body.status || 'RECEIVED',
        receivedAt: body.receivedAt ? new Date(body.receivedAt) : new Date(),
        solution: body.solution,
        totalCost: body.totalCost || 0,
        notes: body.notes,
      },
      include: {
        customer: true,
        product: true,
      },
    })

    return NextResponse.json(warranty, { status: 201 })
  } catch (error) {
    console.error('Error creating warranty:', error)
    return NextResponse.json(
      { error: 'Failed to create warranty' },
      { status: 500 }
    )
  }
}
