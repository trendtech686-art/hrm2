import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/settings/pkgx/sync-logs - List sync logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const syncType = searchParams.get('syncType')

    const logs = await prisma.pkgxSyncLog.findMany({
      where: syncType ? { syncType } : undefined,
      orderBy: { syncedAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ 
      data: logs,
      total: logs.length,
    })
  } catch (error) {
    console.error('Error fetching sync logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sync logs' },
      { status: 500 }
    )
  }
}

// POST /api/settings/pkgx/sync-logs - Create a new sync log
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const { 
      syncType, 
      action, 
      status, 
      itemsTotal = 0, 
      itemsSuccess = 0, 
      itemsFailed = 0, 
      errorMessage,
      details,
    } = body

    if (!syncType || !action || !status) {
      return NextResponse.json(
        { error: 'syncType, action, and status are required' },
        { status: 400 }
      )
    }

    const log = await prisma.pkgxSyncLog.create({
      data: {
        syncType,
        action,
        status,
        itemsTotal,
        itemsSuccess,
        itemsFailed,
        errorMessage,
        details,
        syncedBy: session?.user?.id,
      },
    })

    return NextResponse.json({ data: log }, { status: 201 })
  } catch (error) {
    console.error('Error creating sync log:', error)
    return NextResponse.json(
      { error: 'Failed to create sync log' },
      { status: 500 }
    )
  }
}
