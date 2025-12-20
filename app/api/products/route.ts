import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products - List all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const brandId = searchParams.get('brandId')
    const categoryId = searchParams.get('categoryId')

    const skip = (page - 1) * limit

    const where: any = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (brandId) {
      where.brandId = brandId
    }

    if (categoryId) {
      where.categories = {
        some: { categoryId },
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: true,
          categories: {
            include: {
              category: true,
            },
          },
          inventory: true,
          prices: {
            include: {
              pricingPolicy: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID if not provided
    if (!body.id) {
      const lastProduct = await prisma.product.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastProduct?.id 
        ? parseInt(lastProduct.id.replace('SP', '')) 
        : 0
      body.id = `SP${String(lastNum + 1).padStart(5, '0')}`
    }

    const product = await prisma.product.create({
      data: {
        id: body.id,
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription,
        thumbnailImage: body.thumbnailImage,
        galleryImages: body.galleryImages || [],
        type: body.type || 'PHYSICAL',
        brandId: body.brandId,
        unit: body.unit || 'Cái',
        costPrice: body.costPrice || 0,
        sellingPrice: body.sellingPrice,
        minPrice: body.minPrice,
        taxRate: body.taxRate,
        isStockTracked: body.isStockTracked ?? true,
        reorderLevel: body.reorderLevel,
        safetyStock: body.safetyStock,
        maxStock: body.maxStock,
        weight: body.weight,
        weightUnit: body.weightUnit || 'GRAM',
        barcode: body.barcode,
        warrantyPeriodMonths: body.warrantyPeriodMonths ?? 12,
        primarySupplierId: body.primarySupplierId,
        isPublished: body.isPublished ?? false,
        isFeatured: body.isFeatured ?? false,
        sortOrder: body.sortOrder,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords,
        slug: body.slug,
        status: body.status || 'ACTIVE',
        createdBy: body.createdBy,
      },
      include: {
        brand: true,
      },
    })

    // Add categories if provided
    if (body.categoryIds && body.categoryIds.length > 0) {
      await prisma.productCategory.createMany({
        data: body.categoryIds.map((categoryId: string) => ({
          productId: product.systemId,
          categoryId,
        })),
      })
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Product ID or slug already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
