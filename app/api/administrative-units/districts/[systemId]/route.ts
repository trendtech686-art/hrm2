import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/logger'
import { requireAuth } from '@/lib/api-utils'
import { createActivityLog } from '@/lib/services/activity-log-service'

type RouteParams = { params: Promise<{ systemId: string }> }

/**
 * PUT /api/administrative-units/districts/[systemId]
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { systemId } = await params
    const body = await request.json()
    const { name, id } = body

    const existing = await prisma.district.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy quận/huyện' }, { status: 404 })
    }

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (name && name !== existing.name) changes.name = { from: existing.name, to: name }

    const district = await prisma.district.update({
      where: { systemId },
      data: {
        ...(name && { name }),
        ...(id && { id: typeof id === 'string' ? parseInt(id, 10) : id }),
        updatedBy: session.user?.id,
      },
    })

    await createActivityLog({
      entityType: 'district',
      entityId: systemId,
      action: `Cập nhật quận/huyện "${district.name}"`,
      actionType: 'update',
      changes,
      metadata: { userName: session.user?.name },
      createdBy: session.user?.id,
    })

    return NextResponse.json({ success: true, data: district })
  } catch (error) {
    logError('Failed to update district', error)
    return NextResponse.json({ success: false, error: 'Không thể cập nhật quận/huyện' }, { status: 500 })
  }
}

/**
 * DELETE /api/administrative-units/districts/[systemId]
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { systemId } = await params

    const existing = await prisma.district.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy quận/huyện' }, { status: 404 })
    }

    await prisma.district.update({
      where: { systemId },
      data: { isDeleted: true, updatedBy: session.user?.id },
    })

    await createActivityLog({
      entityType: 'district',
      entityId: systemId,
      action: `Xóa quận/huyện "${existing.name}"`,
      actionType: 'delete',
      metadata: { userName: session.user?.name, districtName: existing.name },
      createdBy: session.user?.id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logError('Failed to delete district', error)
    return NextResponse.json({ success: false, error: 'Không thể xóa quận/huyện' }, { status: 500 })
  }
}
