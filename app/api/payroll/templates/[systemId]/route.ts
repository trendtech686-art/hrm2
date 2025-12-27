import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

const SETTING_KEY = 'payroll-templates'
const SETTING_GROUP = 'hrm'

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/payroll/templates/[systemId]
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const templates = (setting?.value as any[]) || []
    const template = templates.find((t: any) => t.systemId === systemId)

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: template })
  } catch (error) {
    console.error('Error fetching payroll template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payroll template' },
      { status: 500 }
    )
  }
}

// PATCH /api/payroll/templates/[systemId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const templates = (setting?.value as any[]) || []
    const existingIndex = templates.findIndex((t: any) => t.systemId === systemId)
    
    if (existingIndex < 0) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    templates[existingIndex] = { ...templates[existingIndex], ...body }

    await prisma.setting.update({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      data: {
        value: templates,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ data: templates[existingIndex] })
  } catch (error) {
    console.error('Error updating payroll template:', error)
    return NextResponse.json(
      { error: 'Failed to update payroll template' },
      { status: 500 }
    )
  }
}

// DELETE /api/payroll/templates/[systemId]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params

    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const templates = (setting?.value as any[]) || []
    const filteredTemplates = templates.filter((t: any) => t.systemId !== systemId)

    await prisma.setting.update({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      data: {
        value: filteredTemplates,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting payroll template:', error)
    return NextResponse.json(
      { error: 'Failed to delete payroll template' },
      { status: 500 }
    )
  }
}
