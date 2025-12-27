/**
 * Customer SLA API
 * Stores SLA acknowledgements and activity log
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const GROUP = 'customer-sla'

// GET /api/customer-sla?type=ack|log|evaluation
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const type = request.nextUrl.searchParams.get('type')
    
    if (!type || !['ack', 'log', 'evaluation'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
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
      if (type === 'ack') return NextResponse.json({})
      if (type === 'log') return NextResponse.json([])
      if (type === 'evaluation') return NextResponse.json(null)
    }

    return NextResponse.json(setting!.value)
  } catch (error) {
    console.error('[CUSTOMER-SLA] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/customer-sla
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, data } = await request.json()
    
    if (!type || !['ack', 'log', 'evaluation'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CUSTOMER-SLA] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
