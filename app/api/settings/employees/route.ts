import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SETTING_KEY = 'employee-settings'
const SETTING_GROUP = 'hrm'

// GET /api/settings/employees - Get employee settings
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
    console.error('Error fetching employee settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings/employees - Update employee settings
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
        systemId: `SET_EMP_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: settings,
        description: 'Employee management settings',
      },
    })

    return NextResponse.json({ data: setting.value })
  } catch (error) {
    console.error('Error saving employee settings:', error)
    return NextResponse.json(
      { error: 'Failed to save employee settings' },
      { status: 500 }
    )
  }
}
