import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { v4 as uuidv4 } from 'uuid'

// GET /api/settings/pkgx/brand-mappings - List all brand mappings
export async function GET(request: NextRequest) {
  try {
    const mappings = await prisma.pkgxBrandMapping.findMany({
      where: { isActive: true },
      include: {
        pkgxBrand: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ 
      data: mappings,
      total: mappings.length,
    })
  } catch (error) {
    console.error('Error fetching brand mappings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand mappings' },
      { status: 500 }
    )
  }
}

// POST /api/settings/pkgx/brand-mappings - Create a new brand mapping
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const { hrmBrandId, hrmBrandName, pkgxBrandId, pkgxBrandName } = body

    if (!hrmBrandId || !pkgxBrandId) {
      return NextResponse.json(
        { error: 'hrmBrandId and pkgxBrandId are required' },
        { status: 400 }
      )
    }

    // Check if mapping already exists
    const existing = await prisma.pkgxBrandMapping.findFirst({
      where: {
        OR: [
          { hrmBrandId },
          { pkgxBrandId },
        ],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Mapping already exists for this HRM brand or PKGX brand' },
        { status: 409 }
      )
    }

    const mapping = await prisma.pkgxBrandMapping.create({
      data: {
        systemId: uuidv4(),
        hrmBrandId,
        hrmBrandName: hrmBrandName || '',
        pkgxBrandId,
        pkgxBrandName: pkgxBrandName || '',
        createdBy: session?.user?.id,
      },
      include: {
        pkgxBrand: true,
      },
    })

    return NextResponse.json({ data: mapping }, { status: 201 })
  } catch (error) {
    console.error('Error creating brand mapping:', error)
    return NextResponse.json(
      { error: 'Failed to create brand mapping' },
      { status: 500 }
    )
  }
}

// DELETE /api/settings/pkgx/brand-mappings - Delete a brand mapping
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const systemId = searchParams.get('systemId')
    const hrmBrandId = searchParams.get('hrmBrandId')

    if (!systemId && !hrmBrandId) {
      return NextResponse.json(
        { error: 'systemId or hrmBrandId is required' },
        { status: 400 }
      )
    }

    const deleted = await prisma.pkgxBrandMapping.deleteMany({
      where: systemId 
        ? { systemId }
        : { hrmBrandId: hrmBrandId! },
    })

    return NextResponse.json({ deleted: deleted.count })
  } catch (error) {
    console.error('Error deleting brand mapping:', error)
    return NextResponse.json(
      { error: 'Failed to delete brand mapping' },
      { status: 500 }
    )
  }
}
