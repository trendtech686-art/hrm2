import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'

const TYPE = 'receipt-type'

interface SettingsDataRecord {
  systemId: string;
  id: string;
  name: string;
  description?: string | null;
  type: string;
  isActive: boolean;
  isDefault: boolean;
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
}

function mapRecord(item: SettingsDataRecord) {
  const meta = (item?.metadata as Record<string, unknown> | null) || {}
  return { ...item, ...meta }
}

export async function GET(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const item = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })
    if (!item) return apiError('Receipt type not found', 404)
    return apiSuccess(mapRecord(item as unknown as SettingsDataRecord))
  } catch (error) {
    console.error('[receipt-types] GET detail error:', error)
    return apiError('Failed to fetch receipt type', 500)
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const body = await request.json()
    const existing = await prisma.settingsData.findUnique({ where: { systemId } })
    if (!existing || existing.type !== TYPE) return apiError('Receipt type not found', 404)

    const metadata = {
      ...(existing.metadata as Record<string, unknown> | null || {}),
    }
    if (Object.prototype.hasOwnProperty.call(body, 'isBusinessResult')) metadata.isBusinessResult = body.isBusinessResult
    if (Object.prototype.hasOwnProperty.call(body, 'color')) metadata.color = body.color

    // If setting as default, unset all other defaults of same type
    if (body.isDefault === true) {
      await prisma.settingsData.updateMany({
        where: { type: TYPE, isDeleted: false, isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: {
        id: body.id ?? existing.id,
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        isActive: body.isActive ?? existing.isActive,
        isDefault: body.isDefault ?? existing.isDefault,
        metadata: metadata as Prisma.InputJsonObject,
        updatedBy: session.user.id,
      },
    })

    return apiSuccess(mapRecord(updated as unknown as SettingsDataRecord))
  } catch (error) {
    console.error('[receipt-types] PATCH error:', error)
    return apiError('Failed to update receipt type', 500)
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    await prisma.settingsData.delete({ where: { systemId } })
    return apiSuccess({ success: true })
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === 'P2025') return apiError('Receipt type not found', 404)
    console.error('[receipt-types] DELETE error:', error)
    return apiError('Failed to delete receipt type', 500)
  }
}
