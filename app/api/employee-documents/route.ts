import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SETTING_KEY = 'employee-documents'
const SETTING_GROUP = 'hrm'

// GET /api/employee-documents - Get employee documents metadata
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeSystemId = searchParams.get('employeeSystemId')

    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    if (!setting || !setting.value) {
      return NextResponse.json({ data: [] })
    }

    let documents = setting.value as any[]
    
    if (employeeSystemId) {
      documents = documents.filter((d: any) => d.employeeSystemId === employeeSystemId)
    }

    return NextResponse.json({ data: documents })
  } catch (error) {
    console.error('Error fetching employee documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee documents' },
      { status: 500 }
    )
  }
}

// POST /api/employee-documents - Create document metadata
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Get existing documents
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const documents = (setting?.value as any[]) || []
    documents.push(body)

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: documents,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_DOCS_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: documents,
        description: 'Employee documents metadata',
      },
    })

    return NextResponse.json({ data: body })
  } catch (error) {
    console.error('Error creating employee document:', error)
    return NextResponse.json(
      { error: 'Failed to create employee document' },
      { status: 500 }
    )
  }
}

// PUT /api/employee-documents - Bulk update documents
export async function PUT(request: Request) {
  try {
    const { documents } = await request.json()

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: documents,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_DOCS_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: documents,
        description: 'Employee documents metadata',
      },
    })

    return NextResponse.json({ data: documents })
  } catch (error) {
    console.error('Error updating employee documents:', error)
    return NextResponse.json(
      { error: 'Failed to update employee documents' },
      { status: 500 }
    )
  }
}
