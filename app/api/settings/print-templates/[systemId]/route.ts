/**
 * Print Template Detail API
 * GET, PATCH, DELETE for a specific print template
 */

import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

const SETTINGS_KEY = 'print_templates'
const SETTINGS_GROUP = 'printer'

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/settings/print-templates/[systemId]
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    let templates: Array<{ id: string; [key: string]: unknown }> = []
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

    return apiSuccess(template)
  } catch (error) {
    console.error('[PRINT-TEMPLATES] GET by ID error:', error)
    return apiError('Failed to fetch print template', 500)
  }
}

// PATCH /api/settings/print-templates/[systemId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const updates = await request.json()

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

    let templates: Array<{ id: string; [key: string]: unknown }> = []
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

    // Update template
    templates[templateIndex] = {
      ...templates[templateIndex],
      ...updates,
      id: systemId, // Preserve id
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
    console.error('[PRINT-TEMPLATES] PATCH error:', error)
    return apiError('Failed to update print template', 500)
  }
}

// DELETE /api/settings/print-templates/[systemId]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    let templates: Array<{ id: string; [key: string]: unknown }> = []
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

    // Remove template
    templates.splice(templateIndex, 1)

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

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('[PRINT-TEMPLATES] DELETE error:', error)
    return apiError('Failed to delete print template', 500)
  }
}
