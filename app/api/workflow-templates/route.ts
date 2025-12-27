import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SETTINGS_KEY = 'workflow_templates'
const SETTINGS_GROUP = 'workflow'

// GET /api/workflow-templates - Get all workflow templates
export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { 
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
    })

    if (!setting?.value) {
      // Return empty array if not configured
      return NextResponse.json({ data: [] })
    }

    // Parse JSON value and return
    let templates = []
    try {
      templates = typeof setting.value === 'string' 
        ? JSON.parse(setting.value) 
        : setting.value
    } catch {
      templates = []
    }

    return NextResponse.json({ data: templates })
  } catch (error) {
    console.error('Error fetching workflow templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow templates' },
      { status: 500 }
    )
  }
}

// POST /api/workflow-templates - Save all workflow templates
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const templates = body.templates

    if (!Array.isArray(templates)) {
      return NextResponse.json(
        { error: 'Templates array is required' },
        { status: 400 }
      )
    }

    // Upsert the setting with templates as JSON value
    await prisma.setting.upsert({
      where: { 
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
      update: {
        value: templates,
      },
      create: {
        systemId: `SET${String(Date.now()).slice(-6).padStart(6, '0')}`,
        key: SETTINGS_KEY,
        group: SETTINGS_GROUP,
        type: 'json',
        category: 'workflow',
        value: templates,
        description: 'Workflow templates for various processes',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving workflow templates:', error)
    return NextResponse.json(
      { error: 'Failed to save workflow templates' },
      { status: 500 }
    )
  }
}
