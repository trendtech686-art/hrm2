import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/inventory - List all inventory
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const productId = searchParams.get('productId')
    const locationId = searchParams.get('locationId')
    const lowStock = searchParams.get('lowStock') === 'true'

    const skip = (page - 1) * limit

    const where: any = {}

    if (productId) {
      where.productId = productId
    }

    if (locationId) {
      where.locationId = locationId
    }

    if (search) {
      where.product = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    // Filter low stock items (quantity below minQuantity)
    if (lowStock) {
      where.quantity = {
        lte: prisma.inventory.fields.minQuantity,
      }
    }

    const [inventory, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          product: {
            select: {
              systemId: true,
              id: true,
              name: true,
              thumbnailImage: true,
              unit: true,
            },
          },
          location: true,
        },
      }),
      prisma.inventory.count({ where }),
    ])

    return NextResponse.json({
      data: inventory,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

// POST /api/inventory - Create/Update inventory
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.productId) {
      return NextResponse.json(
        { error: 'Product ID là bắt buộc' },
        { status: 400 }
      )
    }

    // Upsert inventory - update if exists, create if not
    const inventory = await prisma.inventory.upsert({
      where: {
        productId_locationId: {
          productId: body.productId,
          locationId: body.locationId || null,
        },
      },
      update: {
        quantity: body.quantity,
        minQuantity: body.minQuantity,
        maxQuantity: body.maxQuantity,
      },
      create: {
        productId: body.productId,
        locationId: body.locationId,
        quantity: body.quantity || 0,
        minQuantity: body.minQuantity || 0,
        maxQuantity: body.maxQuantity,
      },
      include: {
        product: true,
        location: true,
      },
    })

    return NextResponse.json(inventory, { status: 201 })
  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
