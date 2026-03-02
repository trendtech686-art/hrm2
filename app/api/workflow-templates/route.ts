import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiSuccessCached, apiError } from '@/lib/api-utils'
import { saveWorkflowTemplatesSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'

const SETTINGS_KEY = 'workflow_templates'
const SETTINGS_GROUP = 'workflow'

// GET /api/workflow-templates - Get all workflow templates
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

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
      return apiSuccessCached({ data: [] })
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

    return apiSuccessCached({ data: templates })
  } catch (error) {
    console.error('Error fetching workflow templates:', error)
    return apiError('Failed to fetch workflow templates', 500)
  }
}

// POST /api/workflow-templates - Save all workflow templates
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, saveWorkflowTemplatesSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const { templates } = validation.data

  try {
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
        systemId: await generateIdWithPrefix('SETWF'),
        key: SETTINGS_KEY,
        group: SETTINGS_GROUP,
        type: 'json',
        category: 'workflow',
        value: templates,
        description: 'Workflow templates for various processes',
      },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Error saving workflow templates:', error)
    return apiError('Failed to save workflow templates', 500)
  }
}
