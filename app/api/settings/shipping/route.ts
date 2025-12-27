import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SETTING_KEY = 'shipping-settings'
const SETTING_GROUP = 'operations'

// GET /api/settings/shipping - Get shipping settings
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
    console.error('Error fetching shipping settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipping settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings/shipping - Update shipping settings
export async function PUT(request: Request) {
  try {
    const settings = await request.json()

    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: settings,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_SHIP_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'operations',
        value: settings,
        description: 'Shipping configuration settings',
      },
    })

    return NextResponse.json({ data: setting.value })
  } catch (error) {
    console.error('Error saving shipping settings:', error)
    return NextResponse.json(
      { error: 'Failed to save shipping settings' },
      { status: 500 }
    )
  }
}
