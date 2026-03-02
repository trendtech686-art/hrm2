import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'

type UnitParams = { params: Promise<{ systemId: string }> };

// GET /api/units/[systemId]
export async function GET(_request: Request, { params }: UnitParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params

  try {
    const unit = await prisma.unit.findUnique({ where: { systemId } })
    if (!unit) return apiError('Unit not found', 404)
    return apiSuccess(unit)
  } catch (error) {
    console.error('Error fetching unit:', error)
    return apiError('Failed to fetch unit', 500)
  }
}

// PUT /api/units/[systemId]
export async function PUT(request: Request, { params }: UnitParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params

  try {
    const body = await request.json()
    const updated = await prisma.unit.update({
      where: { systemId },
      data: {
        ...body,
        updatedBy: session.user.id,
      },
    })
    return apiSuccess(updated)
  } catch (error) {
    console.error('Error updating unit:', error)
    return apiError('Failed to update unit', 500)
  }
}

// DELETE /api/units/[systemId]
export async function DELETE(_request: Request, { params }: UnitParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params

  try {
    await prisma.unit.delete({
      where: { systemId }
    })
    return apiSuccess({ success: true })
  } catch (error: unknown) {
    const prismaError = error as { code?: string; message?: string; meta?: unknown; stack?: string };
    console.error('[DELETE unit] Error:', {
      code: prismaError?.code,
      message: prismaError?.message,
      meta: prismaError?.meta,
      stack: prismaError?.stack?.split('\n').slice(0, 3).join('\n')
    })
    if (prismaError?.code === 'P2025') {
      return apiError('Unit not found', 404)
    }
    return apiError('Failed to delete unit', 500, prismaError?.message)
  }
}
