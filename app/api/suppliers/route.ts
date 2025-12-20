import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/suppliers - List all suppliers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const all = searchParams.get('all') === 'true'

    const where: any = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (all) {
      const suppliers = await prisma.supplier.findMany({
        where,
        orderBy: { name: 'asc' },
      })
      return NextResponse.json({ data: suppliers })
    }

    const skip = (page - 1) * limit

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { purchaseOrders: true } },
        },
      }),
      prisma.supplier.count({ where }),
    ])

    return NextResponse.json({
      data: suppliers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}

// POST /api/suppliers - Create new supplier
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID if not provided
    if (!body.id) {
      const lastSupplier = await prisma.supplier.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastSupplier?.id 
        ? parseInt(lastSupplier.id.replace('NCC', '')) 
        : 0
      body.id = `NCC${String(lastNum + 1).padStart(4, '0')}`
    }

    const supplier = await prisma.supplier.create({
      data: {
        id: body.id,
        name: body.name,
        contactPerson: body.contactPerson,
        phone: body.phone,
        email: body.email,
        address: body.address,
        taxCode: body.taxCode,
        bankAccount: body.bankAccount,
        website: body.website,
      },
    })

    return NextResponse.json(supplier, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Mã nhà cung cấp đã tồn tại' },
        { status: 400 }
      )
    }
    console.error('Error creating supplier:', error)
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    )
  }
}
