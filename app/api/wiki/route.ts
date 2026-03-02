import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createWikiSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'

// GET /api/wiki - List all wiki articles
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const published = searchParams.get('published')

    const where: Prisma.WikiWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (published === 'true') {
      where.isPublished = true
    } else if (published === 'false') {
      where.isPublished = false
    }

    const [articles, total] = await Promise.all([
      prisma.wiki.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          systemId: true,
          id: true,
          title: true,
          slug: true,
          category: true,
          tags: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: { systemId: true, fullName: true },
          },
        },
      }),
      prisma.wiki.count({ where }),
    ])

    return apiPaginated(articles, { page, limit, total })
  } catch (error) {
    console.error('Error fetching wiki:', error)
    return apiError('Failed to fetch wiki', 500)
  }
}

// POST /api/wiki - Create new wiki article
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createWikiSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Generate slug from title if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const wiki = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'wiki',
        undefined
      );

      return tx.wiki.create({
        data: {
          systemId,
          id: businessId,
          title: body.title,
          slug,
          content: body.content,
          category: body.categoryId || body.category,
          tags: body.tags || [],
          isPublished: body.isPublished ?? false,
          authorId: body.authorId,
          updatedAt: new Date(),
        },
      });
    });

    return apiSuccess(wiki, 201)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return apiError('Slug đã tồn tại', 400)
    }
    console.error('Error creating wiki:', error)
    return apiError('Failed to create wiki', 500)
  }
}
