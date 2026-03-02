/**
 * Reset Print Template to Default API
 */

import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { DEFAULT_TEMPLATES } from '@/features/settings/printer/templates'

const SETTINGS_KEY = 'print_templates'
const SETTINGS_GROUP = 'printer'

type RouteParams = { params: Promise<{ systemId: string }> }

// POST /api/settings/print-templates/[systemId]/reset
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const setting = await prisma.setting.findUnique({
      where: { 
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
    })

    if (!setting?.value) {
      return apiError('Template not found', 404)
    }

    let templates: Array<{ id: string; type: string; [key: string]: unknown }> = []
    try {
      templates = typeof setting.value === 'string' 
        ? JSON.parse(setting.value) 
        : Array.isArray(setting.value) ? setting.value : []
    } catch {
      templates = []
    }

    const templateIndex = templates.findIndex(t => t.id === systemId)
    if (templateIndex === -1) {
      return apiError('Template not found', 404)
    }

    const template = templates[templateIndex]
    const defaultContent = DEFAULT_TEMPLATES[template.type as keyof typeof DEFAULT_TEMPLATES] || ''

    // Reset content to default
    templates[templateIndex] = {
      ...template,
      content: defaultContent,
      updatedAt: new Date().toISOString(),
    }

    // Save templates
    await prisma.setting.update({
      where: { 
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
      data: {
        value: JSON.parse(JSON.stringify(templates)),
        updatedAt: new Date(),
      },
    })

    return apiSuccess(templates[templateIndex])
  } catch (error) {
    console.error('[PRINT-TEMPLATES] RESET error:', error)
    return apiError('Failed to reset print template', 500)
  }
}
