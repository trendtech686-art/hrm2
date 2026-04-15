import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { syncCategoriesSchema } from './validation'
import { logError } from '@/lib/logger'

// GET /api/settings/pkgx/categories - List all PKGX categories
export async function GET(_request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const categories = await prisma.pkgxCategory.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
      include: {
        mappings: true,
      },
    })

    return apiSuccess({ 
      data: categories,
      total: categories.length,
    })
  } catch (error) {
    logError('Error fetching PKGX categories', error)
    return apiError('Failed to fetch PKGX categories', 500)
  }
}

// POST /api/settings/pkgx/categories - Sync categories from PKGX API
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, syncCategoriesSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }

  try {
    const { categories } = validation.data

    // Upsert categories
    const results = await Promise.all(
      categories.map(async (cat) => {
        return prisma.pkgxCategory.upsert({
          where: { id: cat.id },
          update: {
            name: cat.name,
            parentId: cat.parentId ?? null,
            sortOrder: cat.sortOrder ?? 0,
            isShow: cat.isShow ?? 1,
            catDesc: cat.catDesc,
            longDesc: cat.longDesc,
            keywords: cat.keywords,
            metaTitle: cat.metaTitle,
            metaDesc: cat.metaDesc,
            catAlias: cat.catAlias,
            style: cat.style,
            grade: cat.grade,
            filterAttr: cat.filterAttr,
            syncedAt: new Date(),
          },
          create: {
            id: cat.id,
            name: cat.name,
            parentId: cat.parentId ?? null,
            sortOrder: cat.sortOrder ?? 0,
            isShow: cat.isShow ?? 1,
            catDesc: cat.catDesc,
            longDesc: cat.longDesc,
            keywords: cat.keywords,
            metaTitle: cat.metaTitle,
            metaDesc: cat.metaDesc,
            catAlias: cat.catAlias,
            style: cat.style,
            grade: cat.grade,
            filterAttr: cat.filterAttr,
          },
        })
      })
    )

    return apiSuccess({ 
      data: results,
      synced: results.length,
    })
  } catch (error) {
    logError('Error syncing PKGX categories', error)
    return apiError('Failed to sync PKGX categories', 500)
  }
}
