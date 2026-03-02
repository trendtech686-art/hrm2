import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'

const TYPE = 'product-type'

export async function GET(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const item = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })
    if (!item) return apiError('Product type not found', 404)
    return apiSuccess({ data: item })
  } catch (error) {
    console.error('[product-types] GET detail error:', error)
    return apiError('Failed to fetch product type', 500)
  }
}

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
    return apiSuccess({ data: updated })
  } catch (error) {
    console.error('[product-types] PATCH error:', error)
    return apiError('Failed to update product type', 500)
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
      return apiError('Product type not found', 404)
    }
    console.error('[product-types] DELETE error:', error)
    return apiError('Failed to delete product type', 500)
  }
}
