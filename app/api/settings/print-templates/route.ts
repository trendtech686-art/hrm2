/**
 * Print Templates API
 * Manages print templates for various document types (orders, receipts, payments, etc.)
 */

import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { DEFAULT_TEMPLATES } from '@/features/settings/printer/templates'
import { generateIdWithPrefix } from '@/lib/id-generator'

const SETTINGS_KEY = 'print_templates'
const SETTINGS_GROUP = 'printer'

// GET /api/settings/print-templates - Get all print templates
// GET /api/settings/print-templates?type=order - Get templates by type
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const type = request.nextUrl.searchParams.get('type')
    
    const setting = await prisma.setting.findUnique({
      where: { 
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
    })

    let templates: Array<{
      id: string
      type: string
      name: string
      content: string
      paperSize: string
      isActive: boolean
      branchId?: string
      updatedAt: string
    }> = []

    if (setting?.value) {
      try {
        templates = typeof setting.value === 'string' 
          ? JSON.parse(setting.value) 
          : Array.isArray(setting.value) ? setting.value : []
      } catch {
        templates = []
      }
    }

    // Filter by type if provided
    if (type) {
      templates = templates.filter(t => t.type === type)
    }

    return apiSuccess(templates)
  } catch (error) {
    console.error('[PRINT-TEMPLATES] GET error:', error)
    return apiError('Failed to fetch print templates', 500)
  }
}

// POST /api/settings/print-templates - Create a new print template
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { type, name, content, paperSize = 'A4', branchId } = body

    if (!type || !name) {
      return apiError('Type and name are required', 400)
    }

    // Get existing templates
    const setting = await prisma.setting.findUnique({
      where: { 
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
    })

    let templates: Array<Record<string, unknown>> = []
    if (setting?.value) {
      try {
        templates = typeof setting.value === 'string' 
          ? JSON.parse(setting.value) 
          : Array.isArray(setting.value) ? setting.value : []
      } catch {
        templates = []
      }
    }

    // Create new template
    const newTemplate = {
      id: await generateIdWithPrefix('PTPL'),
      type,
      name,
      content: content || DEFAULT_TEMPLATES[type as keyof typeof DEFAULT_TEMPLATES] || '',
      paperSize,
      branchId: branchId || null,
      isActive: true,
      updatedAt: new Date().toISOString(),
    }

    templates.push(newTemplate)

    // Save templates
    await prisma.setting.upsert({
      where: { 
        key_group: {
          key: SETTINGS_KEY,
          group: SETTINGS_GROUP,
        },
      },
      update: {
        value: JSON.parse(JSON.stringify(templates)),
        updatedAt: new Date(),
      },
      create: {
        key: SETTINGS_KEY,
        value: JSON.parse(JSON.stringify(templates)),
        type: 'json',
        group: SETTINGS_GROUP,
        category: 'printer',
        description: 'Print templates for various document types',
      },
    })

    return apiSuccess(newTemplate)
  } catch (error) {
    console.error('[PRINT-TEMPLATES] POST error:', error)
    return apiError('Failed to create print template', 500)
  }
}
