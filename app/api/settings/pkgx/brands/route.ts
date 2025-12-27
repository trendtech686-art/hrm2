import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/settings/pkgx/brands - List all PKGX brands
export async function GET(request: NextRequest) {
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

    return NextResponse.json({ 
      data: brands,
      total: brands.length,
    })
  } catch (error) {
    console.error('Error fetching PKGX brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PKGX brands' },
      { status: 500 }
    )
  }
}

// POST /api/settings/pkgx/brands - Sync brands from PKGX API
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const { brands } = body

    if (!Array.isArray(brands)) {
      return NextResponse.json(
        { error: 'brands must be an array' },
        { status: 400 }
      )
    }

    // Upsert brands
    const results = await Promise.all(
      brands.map(async (brand: { id: number; name: string; logo?: string; description?: string; siteUrl?: string; sortOrder?: number; isShow?: number; keywords?: string; metaTitle?: string; metaDesc?: string; shortDescription?: string; longDescription?: string }) => {
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

    return NextResponse.json({ 
      data: results,
      synced: results.length,
    })
  } catch (error) {
    console.error('Error syncing PKGX brands:', error)
    return NextResponse.json(
      { error: 'Failed to sync PKGX brands' },
      { status: 500 }
    )
  }
}
