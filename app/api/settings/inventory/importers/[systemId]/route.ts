import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'

const _TYPE = 'importer'

export async function PATCH(request: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const body = await request.json()
    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: { ...body, updatedBy: session.user.id },
    })
    return apiSuccess(updated)
  } catch (error) {
    console.error('[importers] PATCH error:', error)
    return apiError('Failed to update importer', 500)
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
      return apiError('Importer not found', 404)
    }
    console.error('[importers] DELETE error:', error)
    return apiError('Failed to delete importer', 500)
  }
}
