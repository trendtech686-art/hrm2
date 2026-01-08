import { prisma } from '@/lib/prisma'
import { Prisma, ProductStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createProductSchema } from './validation'

// GET /api/products - List all products
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const brandId = searchParams.get('brandId')
    const categoryId = searchParams.get('categoryId')

    const where: Prisma.ProductWhereInput = {
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
      where.status = status as Prisma.EnumProductStatusFilter<"Product">
    }

    if (brandId) {
      where.brandId = brandId
    }

    if (categoryId) {
      where.categorySystemIds = {
        has: categoryId,
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
          inventoryRecords: true,
          prices: {
            include: {
              pricingPolicy: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return apiPaginated(products, { page, limit, total })
  } catch (error) {
    console.error('Error fetching products:', error)
    return apiError('Failed to fetch products', 500)
  }
}

// POST /api/products - Create new product
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createProductSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

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
        systemId: `PROD${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        sku: body.sku || body.id,
        description: body.description,
        shortDescription: body.shortDescription,
        thumbnailImage: body.thumbnailImage || body.imageUrl,
        imageUrl: body.thumbnailImage || body.imageUrl,
        galleryImages: body.galleryImages || body.images || [],
        brand: body.brandId ? { connect: { systemId: body.brandId } } : undefined,
        unit: body.unit || 'Cái',
        costPrice: body.costPrice || 0,
        sellingPrice: body.sellingPrice || 0,
        minPrice: body.minPrice || 0,
        taxRate: body.taxRate || 0,
        reorderLevel: body.reorderLevel || 0,
        maxStock: body.maxStock,
        weight: body.weight,
        barcode: body.barcode,
        warrantyPeriodMonths: body.warrantyPeriodMonths ?? 12,
        primarySupplierId: body.primarySupplierId,
        isFeatured: body.isFeatured ?? false,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        slug: body.slug,
        status: (body.status || 'ACTIVE') as ProductStatus,
        createdBy: body.createdBy,
      },
      include: {
        brand: true,
      },
    })

// Interface for line item in order creation
interface _LineItemInput {
  productSystemId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountType?: string;
  tax?: number;
  total?: number;
  note?: string;
}

    // Add categories if provided
    if (body.categoryIds && body.categoryIds.length > 0) {
      await prisma.productCategory.createMany({
        data: body.categoryIds.map((categoryId: string) => ({
          productId: product.systemId,
          categoryId,
        })),
      })
    }

    return apiSuccess(product, 201)
  } catch (error) {
    console.error('Error creating product:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Product ID or slug already exists', 400)
    }

    return apiError('Failed to create product', 500)
  }
}
