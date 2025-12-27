import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { v4 as uuidv4 } from 'uuid'

// GET /api/settings/pkgx/category-mappings - List all category mappings
export async function GET(request: NextRequest) {
  try {
    const mappings = await prisma.pkgxCategoryMapping.findMany({
      where: { isActive: true },
      include: {
        pkgxCategory: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ 
      data: mappings,
      total: mappings.length,
    })
  } catch (error) {
    console.error('Error fetching category mappings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category mappings' },
      { status: 500 }
    )
  }
}

// POST /api/settings/pkgx/category-mappings - Create a new category mapping
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const { hrmCategoryId, hrmCategoryName, pkgxCategoryId, pkgxCategoryName } = body

    if (!hrmCategoryId || !pkgxCategoryId) {
      return NextResponse.json(
        { error: 'hrmCategoryId and pkgxCategoryId are required' },
        { status: 400 }
      )
    }

    // Check if mapping already exists
    const existing = await prisma.pkgxCategoryMapping.findFirst({
      where: {
        OR: [
          { hrmCategoryId },
          { pkgxCategoryId },
        ],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Mapping already exists for this HRM category or PKGX category' },
        { status: 409 }
      )
    }

    const mapping = await prisma.pkgxCategoryMapping.create({
      data: {
        systemId: uuidv4(),
        hrmCategoryId,
        hrmCategoryName: hrmCategoryName || '',
        pkgxCategoryId,
        pkgxCategoryName: pkgxCategoryName || '',
        createdBy: session?.user?.id,
      },
      include: {
        pkgxCategory: true,
      },
    })

    return NextResponse.json({ data: mapping }, { status: 201 })
  } catch (error) {
    console.error('Error creating category mapping:', error)
    return NextResponse.json(
      { error: 'Failed to create category mapping' },
      { status: 500 }
    )
  }
}

// DELETE /api/settings/pkgx/category-mappings - Delete a category mapping
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const systemId = searchParams.get('systemId')
    const hrmCategoryId = searchParams.get('hrmCategoryId')

    if (!systemId && !hrmCategoryId) {
      return NextResponse.json(
        { error: 'systemId or hrmCategoryId is required' },
        { status: 400 }
      )
    }

    const deleted = await prisma.pkgxCategoryMapping.deleteMany({
      where: systemId 
        ? { systemId }
        : { hrmCategoryId: hrmCategoryId! },
    })

    return NextResponse.json({ deleted: deleted.count })
  } catch (error) {
    console.error('Error deleting category mapping:', error)
    return NextResponse.json(
      { error: 'Failed to delete category mapping' },
      { status: 500 }
    )
  }
}
