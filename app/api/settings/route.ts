import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/settings - Get all settings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')
    const key = searchParams.get('key')

    const where: any = {}

    if (group) {
      where.group = group
    }

    if (key) {
      where.key = key
    }

    const settings = await prisma.setting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    })

    // If single key requested, return just the value
    if (key && settings.length === 1) {
      return NextResponse.json(settings[0])
    }

    // Group settings by group name
    const grouped = settings.reduce((acc: any, setting) => {
      if (!acc[setting.group]) {
        acc[setting.group] = {}
      }
      acc[setting.group][setting.key] = setting.value
      return acc
    }, {})

    return NextResponse.json({ data: settings, grouped })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST /api/settings - Create or update setting
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.key || !body.group) {
      return NextResponse.json(
        { error: 'Key và group là bắt buộc' },
        { status: 400 }
      )
    }

    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: body.key,
          group: body.group,
        },
      },
      update: {
        value: body.value,
        description: body.description,
      },
      create: {
        key: body.key,
        group: body.group,
        type: body.type || 'string',
        category: body.category || body.group,
        value: body.value,
        description: body.description,
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error saving setting:', error)
    return NextResponse.json(
      { error: 'Failed to save setting' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Bulk update settings
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!Array.isArray(body.settings)) {
      return NextResponse.json(
        { error: 'Settings array là bắt buộc' },
        { status: 400 }
      )
    }

    const results = await prisma.$transaction(
      body.settings.map((setting: any) =>
        prisma.setting.upsert({
          where: {
            key_group: {
              key: setting.key,
              group: setting.group,
            },
          },
          update: {
            value: setting.value,
            description: setting.description,
          },
          create: {
            key: setting.key,
            group: setting.group,
            type: setting.type || 'string',
            category: setting.category || setting.group,
            value: setting.value,
            description: setting.description,
          },
        })
      )
    )

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error('Error bulk updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
