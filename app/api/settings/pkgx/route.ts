import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SETTING_KEY = 'pkgx-settings'
const SETTING_GROUP = 'integrations'

// GET /api/settings/pkgx
export async function GET() {
  try {
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    if (!setting) {
      return NextResponse.json({ data: null })
    }

    return NextResponse.json({ data: setting.value })
  } catch (error) {
    console.error('Error fetching pkgx settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pkgx settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings/pkgx
export async function PUT(request: Request) {
  try {
    const settings = await request.json()

    // Get existing to merge
    const existing = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const mergedValue = {
      ...((existing?.value as object) || {}),
      ...settings,
    }

    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: mergedValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_PKGX_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'integrations',
        value: mergedValue,
        description: 'PKGX integration settings',
      },
    })

    return NextResponse.json({ data: setting.value })
  } catch (error) {
    console.error('Error saving pkgx settings:', error)
    return NextResponse.json(
      { error: 'Failed to save pkgx settings' },
      { status: 500 }
    )
  }
}
