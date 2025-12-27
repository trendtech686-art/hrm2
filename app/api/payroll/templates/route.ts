import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SETTING_KEY = 'payroll-templates'
const SETTING_GROUP = 'hrm'

// GET /api/payroll/templates - Get all payroll templates
export async function GET(request: Request) {
  try {
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    if (!setting || !setting.value) {
      return NextResponse.json({ data: [] })
    }

    return NextResponse.json({ data: setting.value })
  } catch (error) {
    console.error('Error fetching payroll templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payroll templates' },
      { status: 500 }
    )
  }
}

// POST /api/payroll/templates - Create template
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Get existing templates
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const templates = (setting?.value as any[]) || []
    templates.push(body)

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: templates,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_PAYTPL_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: templates,
        description: 'Payroll templates',
      },
    })

    return NextResponse.json({ data: body })
  } catch (error) {
    console.error('Error creating payroll template:', error)
    return NextResponse.json(
      { error: 'Failed to create payroll template' },
      { status: 500 }
    )
  }
}

// PUT /api/payroll/templates - Bulk update templates
export async function PUT(request: Request) {
  try {
    const { templates } = await request.json()

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: templates,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_PAYTPL_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: templates,
        description: 'Payroll templates',
      },
    })

    return NextResponse.json({ data: templates })
  } catch (error) {
    console.error('Error updating payroll templates:', error)
    return NextResponse.json(
      { error: 'Failed to update payroll templates' },
      { status: 500 }
    )
  }
}
