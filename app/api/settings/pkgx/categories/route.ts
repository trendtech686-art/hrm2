import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/settings/pkgx/categories - List all PKGX categories
export async function GET(request: NextRequest) {
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

    return NextResponse.json({ 
      data: categories,
      total: categories.length,
    })
  } catch (error) {
    console.error('Error fetching PKGX categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PKGX categories' },
      { status: 500 }
    )
  }
}

// POST /api/settings/pkgx/categories - Sync categories from PKGX API
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const { categories } = body

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'categories must be an array' },
        { status: 400 }
      )
    }

    // Upsert categories
    const results = await Promise.all(
      categories.map(async (cat: { id: number; name: string; parentId?: number; sortOrder?: number; isShow?: number; catDesc?: string; longDesc?: string; keywords?: string; metaTitle?: string; metaDesc?: string; catAlias?: string; style?: string; grade?: number; filterAttr?: string }) => {
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

    return NextResponse.json({ 
      data: results,
      synced: results.length,
    })
  } catch (error) {
    console.error('Error syncing PKGX categories:', error)
    return NextResponse.json(
      { error: 'Failed to sync PKGX categories' },
      { status: 500 }
    )
  }
}
