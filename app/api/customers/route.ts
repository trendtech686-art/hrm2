import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/customers - List all customers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where: any = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ])

    return NextResponse.json({
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST /api/customers - Create new customer
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID if not provided
    if (!body.id) {
      const lastCustomer = await prisma.customer.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastCustomer?.id 
        ? parseInt(lastCustomer.id.replace('KH', '')) 
        : 0
      body.id = `KH${String(lastNum + 1).padStart(5, '0')}`
    }

    const customer = await prisma.customer.create({
      data: {
        id: body.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        status: body.status || 'ACTIVE',
        taxCode: body.taxCode,
        representative: body.representative,
        position: body.position,
        addresses: body.addresses,
        maxDebt: body.maxDebt,
        lifecycleStage: body.lifecycleStage || 'LEAD',
        pricingLevel: body.pricingLevel,
        defaultDiscount: body.defaultDiscount,
        accountManagerId: body.accountManagerId,
        tags: body.tags || [],
        notes: body.notes,
        createdBy: body.createdBy,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error: any) {
    console.error('Error creating customer:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Customer ID already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
