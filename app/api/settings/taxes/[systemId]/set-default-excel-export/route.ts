import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  const { systemId } = await params

  try {
    const tax = await prisma.tax.findUnique({
      where: { systemId },
    })

    if (!tax) {
      return apiError('Không tìm thấy thuế', 404)
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.tax.updateMany({
        where: { isDefaultExcelExport: true },
        data: { isDefaultExcelExport: false },
      })

      return tx.tax.update({
        where: { systemId },
        data: {
          isDefaultExcelExport: true,
          updatedBy: session.user.id,
        },
      })
    })

    createActivityLog({
      entityType: 'tax',
      entityId: systemId,
      action: `Đặt thuế mặc định xuất Excel: ${tax.name}`,
      actionType: 'update',
      changes: { 'MĐ xuất Excel': { from: 'Không', to: 'Có' } },
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({ data: updated })
  } catch (error) {
    logError('[taxes] set-default-excel-export error', error)
    return apiError('Không thể đặt thuế mặc định xuất Excel', 500)
  }
}
