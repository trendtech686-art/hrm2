import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createBrandSchema } from './validation'

// GET /api/brands - List all brands
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'

    const where: Prisma.BrandWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (all) {
      const brands = await prisma.brand.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      })
      return apiSuccess({ data: brands })
    }

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.brand.count({ where }),
    ])

    return apiPaginated(brands, { page, limit, total })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return apiError('Failed to fetch brands', 500)
  }
}

// POST /api/brands - Create new brand
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createBrandSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

    const brand = await prisma.brand.create({
      data: {
        systemId: `BRAND${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        description: body.description,
        logoUrl: body.logo || body.logoUrl,
        website: body.website,
      },
    })

    return apiSuccess(brand, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã thương hiệu đã tồn tại', 400)
    }
    console.error('Error creating brand:', error)
    return apiError('Failed to create brand', 500)
  }
}
