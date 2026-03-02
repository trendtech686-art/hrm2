import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'

const TYPE = 'storage-location'

export async function GET(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const loc = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })
    if (!loc) return apiError('Storage location not found', 404)
    return apiSuccess({ ...loc, ...(loc.metadata as Record<string, unknown> | null | undefined || {}) })
  } catch (error) {
    console.error('Error fetching storage location:', error)
    return apiError('Failed to fetch storage location', 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const body = await request.json()
    const { branchId, ...rest } = body || {}
    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: {
        ...rest,
        metadata: branchId !== undefined ? { ...(rest.metadata || {}), branchId } : rest.metadata,
        updatedBy: session.user.id,
      },
    })
    return apiSuccess({ ...updated, ...(updated.metadata as Record<string, unknown> | null | undefined || {}) })
  } catch (error) {
    console.error('Error updating storage location:', error)
    return apiError('Failed to update storage location', 500)
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    await prisma.settingsData.delete({
      where: { systemId }
    })
    return apiSuccess({ success: true })
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === 'P2025') {
      return apiError('Storage location not found', 404)
    }
    console.error('Error deleting storage location:', error)
    return apiError('Failed to delete storage location', 500)
  }
}
