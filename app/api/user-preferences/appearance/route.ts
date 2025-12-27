import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

const PREFERENCE_KEY = 'appearance'
const PREFERENCE_CATEGORY = 'ui'

// GET /api/user-preferences/appearance
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ data: null })
    }

    const preference = await prisma.userPreference.findUnique({
      where: {
        userId_key: {
          userId: session.user.id,
          key: PREFERENCE_KEY,
        },
      },
    })

    if (!preference) {
      return NextResponse.json({ data: null })
    }

    return NextResponse.json({ data: preference.value })
  } catch (error) {
    console.error('Error fetching appearance preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appearance preferences' },
      { status: 500 }
    )
  }
}

// PUT /api/user-preferences/appearance
export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const settings = await request.json()

    // Get existing preference to merge
    const existing = await prisma.userPreference.findUnique({
      where: {
        userId_key: {
          userId: session.user.id,
          key: PREFERENCE_KEY,
        },
      },
    })

    const mergedValue = {
      ...((existing?.value as object) || {}),
      ...settings,
    }

    const preference = await prisma.userPreference.upsert({
      where: {
        userId_key: {
          userId: session.user.id,
          key: PREFERENCE_KEY,
        },
      },
      update: {
        value: mergedValue,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        key: PREFERENCE_KEY,
        category: PREFERENCE_CATEGORY,
        value: mergedValue,
      },
    })

    return NextResponse.json({ data: preference.value })
  } catch (error) {
    console.error('Error saving appearance preferences:', error)
    return NextResponse.json(
      { error: 'Failed to save appearance preferences' },
      { status: 500 }
    )
  }
}
