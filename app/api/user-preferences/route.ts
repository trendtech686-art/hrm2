import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/user-preferences?userId=xxx or ?userId=xxx&key=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const key = searchParams.get('key')
    const category = searchParams.get('category')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId là bắt buộc' },
        { status: 400 }
      )
    }

    const where: any = { userId }

    if (key) {
      where.key = key
    }

    if (category) {
      where.category = category
    }

    const preferences = await prisma.userPreference.findMany({
      where,
      orderBy: { key: 'asc' },
    })

    // If single key requested, return just the value
    if (key && preferences.length === 1) {
      return NextResponse.json(preferences[0])
    }

    // Return as key-value map for easy frontend use
    const prefMap = preferences.reduce((acc: Record<string, any>, pref) => {
      acc[pref.key] = pref.value
      return acc
    }, {})

    return NextResponse.json({ data: preferences, map: prefMap })
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user preferences' },
      { status: 500 }
    )
  }
}

// POST /api/user-preferences - Create or update preference
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.key) {
      return NextResponse.json(
        { error: 'userId và key là bắt buộc' },
        { status: 400 }
      )
    }

    const preference = await prisma.userPreference.upsert({
      where: {
        userId_key: {
          userId: body.userId,
          key: body.key,
        },
      },
      update: {
        value: body.value,
        category: body.category,
        updatedAt: new Date(),
      },
      create: {
        userId: body.userId,
        key: body.key,
        value: body.value ?? {},
        category: body.category,
      },
    })

    return NextResponse.json(preference)
  } catch (error) {
    console.error('Error saving user preference:', error)
    return NextResponse.json(
      { error: 'Failed to save user preference' },
      { status: 500 }
    )
  }
}

// PUT /api/user-preferences - Bulk update
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body.userId || !Array.isArray(body.preferences)) {
      return NextResponse.json(
        { error: 'userId và preferences array là bắt buộc' },
        { status: 400 }
      )
    }

    const results = await Promise.all(
      body.preferences.map((pref: any) =>
        prisma.userPreference.upsert({
          where: {
            userId_key: {
              userId: body.userId,
              key: pref.key,
            },
          },
          update: {
            value: pref.value,
            category: pref.category,
            updatedAt: new Date(),
          },
          create: {
            userId: body.userId,
            key: pref.key,
            value: pref.value ?? {},
            category: pref.category,
          },
        })
      )
    )

    return NextResponse.json({ success: true, count: results.length })
  } catch (error) {
    console.error('Error bulk updating preferences:', error)
    return NextResponse.json(
      { error: 'Failed to bulk update preferences' },
      { status: 500 }
    )
  }
}

// DELETE /api/user-preferences?userId=xxx&key=xxx
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const key = searchParams.get('key')

    if (!userId || !key) {
      return NextResponse.json(
        { error: 'userId và key là bắt buộc' },
        { status: 400 }
      )
    }

    await prisma.userPreference.delete({
      where: {
        userId_key: {
          userId,
          key,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user preference:', error)
    return NextResponse.json(
      { error: 'Failed to delete user preference' },
      { status: 500 }
    )
  }
}
