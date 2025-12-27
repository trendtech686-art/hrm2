import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SETTING_KEY = 'trendtech-settings'
const SETTING_GROUP = 'integrations'

// GET /api/settings/trendtech
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
    console.error('Error fetching trendtech settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trendtech settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings/trendtech
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
        systemId: `SET_TREND_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'integrations',
        value: mergedValue,
        description: 'Trendtech integration settings',
      },
    })

    return NextResponse.json({ data: setting.value })
  } catch (error) {
    console.error('Error saving trendtech settings:', error)
    return NextResponse.json(
      { error: 'Failed to save trendtech settings' },
      { status: 500 }
    )
  }
}
