import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

const SETTING_KEY = 'employee-documents'
const SETTING_GROUP = 'hrm'

// Interface for employee document
interface EmployeeDocument {
  employeeSystemId: string;
  documentType: string;
  documentUrl: string;
  uploadedAt: string;
  [key: string]: unknown;
}

// GET /api/employee-documents - Get employee documents metadata
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

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
      return apiSuccess({ data: [] })
    }

    let documents = setting.value as EmployeeDocument[]
    
    if (employeeSystemId) {
      documents = documents.filter((d) => d.employeeSystemId === employeeSystemId)
    }

    return apiSuccess({ data: documents })
  } catch (error) {
    console.error('Error fetching employee documents:', error)
    return apiError('Failed to fetch employee documents', 500)
  }
}

// POST /api/employee-documents - Create document metadata
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()

    // Get existing documents
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const documents = (setting?.value as EmployeeDocument[]) || []
    documents.push(body)

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: documents as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_DOCS_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: documents as unknown as Prisma.InputJsonValue,
        description: 'Employee documents metadata',
      },
    })

    return apiSuccess({ data: body })
  } catch (error) {
    console.error('Error creating employee document:', error)
    return apiError('Failed to create employee document', 500)
  }
}

// PUT /api/employee-documents - Bulk update documents
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

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
        value: documents as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_DOCS_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: documents as unknown as Prisma.InputJsonValue,
        description: 'Employee documents metadata',
      },
    })

    return apiSuccess({ data: documents })
  } catch (error) {
    console.error('Error updating employee documents:', error)
    return apiError('Failed to update employee documents', 500)
  }
}
