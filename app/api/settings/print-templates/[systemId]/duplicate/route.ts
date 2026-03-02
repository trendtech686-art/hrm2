/**
 * Duplicate Print Template API
 */

import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { generateIdWithPrefix } from '@/lib/id-generator'

const SETTINGS_KEY = 'print_templates'
const SETTINGS_GROUP = 'printer'

type RouteParams = { params: Promise<{ systemId: string }> }

// POST /api/settings/print-templates/[systemId]/duplicate
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

    let templates: Array<{ id: string; name: string; [key: string]: unknown }> = []
    try {
      templates = typeof setting.value === 'string' 
        ? JSON.parse(setting.value) 
        : Array.isArray(setting.value) ? setting.value : []
    } catch {
      templates = []
    }

    const template = templates.find(t => t.id === systemId)
    if (!template) {
      return apiError('Template not found', 404)
    }

    // Create duplicate
    const duplicatedTemplate = {
      ...template,
      id: await generateIdWithPrefix('TPL', prisma),
      name: `${template.name} (Copy)`,
      updatedAt: new Date().toISOString(),
    }

    templates.push(duplicatedTemplate)

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

    return apiSuccess(duplicatedTemplate)
  } catch (error) {
    console.error('[PRINT-TEMPLATES] DUPLICATE error:', error)
    return apiError('Failed to duplicate print template', 500)
  }
}
