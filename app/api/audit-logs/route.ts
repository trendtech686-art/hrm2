import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/audit-logs - List audit logs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const entity = searchParams.get('entity')
    const entityId = searchParams.get('entityId')
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    const skip = (page - 1) * limit

    const where: any = {}

    if (entity) {
      where.entity = entity
    }

    if (entityId) {
      where.entityId = entityId
    }

    if (action) {
      where.action = action
    }

    if (userId) {
      where.userId = userId
    }

    if (fromDate || toDate) {
      where.createdAt = {}
      if (fromDate) where.createdAt.gte = new Date(fromDate)
      if (toDate) where.createdAt.lte = new Date(toDate)
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ])

    return NextResponse.json({
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}

// POST /api/audit-logs - Create audit log entry
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const log = await prisma.auditLog.create({
      data: {
        entityType: body.entityType,
        entityId: body.entityId,
        entityName: body.entityName,
        action: body.action,
        oldData: body.oldData,
        newData: body.newData,
        userId: body.userId,
        ipAddress: body.ipAddress,
        userAgent: body.userAgent,
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Error creating audit log:', error)
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    )
  }
}
