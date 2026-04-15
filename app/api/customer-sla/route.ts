/**
 * Customer SLA API
 * Stores SLA acknowledgements and activity log
 */

import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

const GROUP = 'customer-sla'

// GET /api/customer-sla?type=ack|log|evaluation
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const type = request.nextUrl.searchParams.get('type')
    
    if (!type || !['ack', 'log', 'evaluation'].includes(type)) {
      return apiError('Invalid type parameter', 400)
    }

    const settingKey = `customer_sla_${type}`
    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key: settingKey,
          group: GROUP,
        }
      }
    })

    if (!setting) {
      // Return empty defaults based on type
      if (type === 'ack') return apiSuccess({})
      if (type === 'log') return apiSuccess([])
      if (type === 'evaluation') return apiSuccess(null)
    }

    return apiSuccess(setting!.value)
  } catch (error) {
    logError('[CUSTOMER-SLA] GET error', error)
    return apiError('Internal server error', 500)
  }
}

// POST /api/customer-sla
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { type, data } = await request.json()
    
    if (!type || !['ack', 'log', 'evaluation'].includes(type)) {
      return apiError('Invalid type parameter', 400)
    }

    const settingKey = `customer_sla_${type}`

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: settingKey,
          group: GROUP,
        }
      },
      update: {
        value: data,
        updatedAt: new Date(),
      },
      create: {
        key: settingKey,
        value: data,
        type: 'customer-sla',
        group: GROUP,
        category: 'system',
        description: `Customer SLA ${type} data`,
      }
    })

    return apiSuccess({ success: true })
  } catch (error) {
    logError('[CUSTOMER-SLA] POST error', error)
    return apiError('Internal server error', 500)
  }
}
