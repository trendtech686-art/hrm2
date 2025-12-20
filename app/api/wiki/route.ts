import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/wiki - List all wiki articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const published = searchParams.get('published')

    const skip = (page - 1) * limit

    const where: any = {
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
      where.categoryId = category
    }

    if (published === 'true') {
      where.isPublished = true
    } else if (published === 'false') {
      where.isPublished = false
    }

    const [articles, total] = await Promise.all([
      prisma.wikiPage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          systemId: true,
          id: true,
          title: true,
          slug: true,
          categoryId: true,
          category: {
            select: { systemId: true, name: true },
          },
          tags: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.wikiPage.count({ where }),
    ])

    return NextResponse.json({
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching wiki:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wiki' },
      { status: 500 }
    )
  }
}

// POST /api/wiki - Create new wiki article
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate slug from title if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Generate business ID
    if (!body.id) {
      const lastWiki = await prisma.wikiPage.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastWiki?.id 
        ? parseInt(lastWiki.id.replace('TL', '')) 
        : 0
      body.id = `TL${String(lastNum + 1).padStart(6, '0')}`
    }

    const wiki = await prisma.wikiPage.create({
      data: {
        systemId: `WIKI${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        title: body.title,
        slug: body.slug,
        content: body.content,
        categoryId: body.categoryId || body.category,
        tags: body.tags || [],
        isPublished: body.isPublished ?? false,
        createdBy: body.authorId,
      },
    })

    return NextResponse.json(wiki, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Slug đã tồn tại' },
        { status: 400 }
      )
    }
    console.error('Error creating wiki:', error)
    return NextResponse.json(
      { error: 'Failed to create wiki' },
      { status: 500 }
    )
  }
}
