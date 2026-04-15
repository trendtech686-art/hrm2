import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { syncBrandsSchema } from './validation'
import { logError } from '@/lib/logger'

// GET /api/settings/pkgx/brands - List all PKGX brands
export async function GET(_request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const brands = await prisma.pkgxBrand.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
      include: {
        mappings: true,
      },
    })

    return apiSuccess({ 
      data: brands,
      total: brands.length,
    })
  } catch (error) {
    logError('Error fetching PKGX brands', error)
    return apiError('Failed to fetch PKGX brands', 500)
  }
}

// POST /api/settings/pkgx/brands - Sync brands from PKGX API
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, syncBrandsSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }

  try {
    const { brands } = validation.data

    // Upsert brands
    const results = await Promise.all(
      brands.map(async (brand) => {
        return prisma.pkgxBrand.upsert({
          where: { id: brand.id },
          update: {
            name: brand.name,
            logo: brand.logo,
            description: brand.description,
            siteUrl: brand.siteUrl,
            sortOrder: brand.sortOrder ?? 0,
            isShow: brand.isShow ?? 1,
            keywords: brand.keywords,
            metaTitle: brand.metaTitle,
            metaDesc: brand.metaDesc,
            shortDescription: brand.shortDescription,
            longDescription: brand.longDescription,
            syncedAt: new Date(),
          },
          create: {
            id: brand.id,
            name: brand.name,
            logo: brand.logo,
            description: brand.description,
            siteUrl: brand.siteUrl,
            sortOrder: brand.sortOrder ?? 0,
            isShow: brand.isShow ?? 1,
            keywords: brand.keywords,
            metaTitle: brand.metaTitle,
            metaDesc: brand.metaDesc,
            shortDescription: brand.shortDescription,
            longDescription: brand.longDescription,
          },
        })
      })
    )

    return apiSuccess({ 
      data: results,
      synced: results.length,
    })
  } catch (error) {
    logError('Error syncing PKGX brands', error)
    return apiError('Failed to sync PKGX brands', 500)
  }
}
