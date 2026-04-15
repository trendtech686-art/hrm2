import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateSupplierSchema } from './validation'
import { serializeSupplier } from '../serialize'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

// GET /api/suppliers/[systemId]
export const GET = apiHandler(async (_request, { params }) => {
  const { systemId } = params

  const supplier = await prisma.supplier.findUnique({
    where: { systemId },
  })

  if (!supplier) {
    return apiError('Nhà cung cấp không tồn tại', 404)
  }

  return apiSuccess(serializeSupplier(supplier))
})

// PUT /api/suppliers/[systemId]
export const PUT = apiHandler(async (request, { session, params }) => {
  const { systemId } = params

  const validation = await validateBody(request, updateSupplierSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Fetch existing for changes diff
    const existing = await prisma.supplier.findUnique({ where: { systemId } })
    if (!existing) return apiError('Nhà cung cấp không tồn tại', 404)

    const supplier = await prisma.supplier.update({
      where: { systemId },
      data: {
        ...(body.id !== undefined && { id: body.id }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.contactPerson !== undefined && { contactPerson: body.contactPerson || '' }),
        ...(body.phone !== undefined && { phone: body.phone || '' }),
        ...(body.email !== undefined && { email: body.email || '' }),
        ...(body.address !== undefined && { address: body.address || '' }),
        ...(body.addressData !== undefined && { addressData: (body.addressData ?? Prisma.JsonNull) as Prisma.InputJsonValue }),
        ...(body.taxCode !== undefined && { taxCode: body.taxCode || '' }),
        ...(body.bankAccount !== undefined && { bankAccount: body.bankAccount || '' }),
        ...(body.bankName !== undefined && { bankName: body.bankName || '' }),
        ...(body.website !== undefined && { website: body.website || '' }),
        ...(body.accountManager !== undefined && { accountManager: body.accountManager || '' }),
        ...(body.notes !== undefined && { notes: body.notes || '' }),
        ...(body.status !== undefined && { status: body.status || 'Đang Giao Dịch' }),
      } satisfies Prisma.SupplierUpdateInput,
    })

    // Activity log with changes diff (fire-and-forget)
    const fieldLabels: Record<string, string> = {
      name: 'Tên', taxCode: 'Mã số thuế', phone: 'Điện thoại', email: 'Email',
      address: 'Địa chỉ', website: 'Website', accountManager: 'Quản lý',
      bankAccount: 'Tài khoản NH', bankName: 'Ngân hàng', contactPerson: 'Người liên hệ',
      notes: 'Ghi chú', status: 'Trạng thái',
    }
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    for (const key of Object.keys(fieldLabels)) {
      if (body[key as keyof typeof body] !== undefined) {
        const oldVal = (existing as Record<string, unknown>)[key]
        const newVal = body[key as keyof typeof body]
        if (String(oldVal ?? '') !== String(newVal ?? '')) {
          changes[fieldLabels[key]] = { from: oldVal ?? '', to: newVal ?? '' }
        }
      }
    }
    if (Object.keys(changes).length > 0) {
      getUserNameFromDb(session!.user?.id).then(userName =>
        prisma.activityLog.create({
          data: {
            entityType: 'supplier',
            entityId: systemId,
            action: 'updated',
            actionType: 'update',
            note: `Cập nhật nhà cung cấp: ${existing.name}: ${Object.keys(changes).join(', ')}`,
            changes: changes as Prisma.InputJsonValue,
            createdBy: userName,
          },
        })
      ).catch(e => logError('[ActivityLog] supplier updated failed', e))
    }

    return apiSuccess(serializeSupplier(supplier))
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return apiError('Nhà cung cấp không tồn tại', 404)
    }
    logError('Error updating supplier', error)
    return apiError('Lỗi khi cập nhật nhà cung cấp', 500)
  }
})

// PATCH /api/suppliers/[systemId] - same as PUT
export const PATCH = PUT

// DELETE /api/suppliers/[systemId]
export const DELETE = apiHandler(async (_request, { session, params }) => {
  const { systemId } = params

  try {
    const existing = await prisma.supplier.findUnique({
      where: { systemId },
      select: { name: true, id: true },
    })

    await prisma.supplier.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    // Log activity (fire-and-forget)
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'supplier',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa nhà cung cấp: ${existing?.name || systemId} (${existing?.id || systemId})`,
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] supplier deleted failed', e))

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2025') {
      return apiError('Nhà cung cấp không tồn tại', 404)
    }
    logError('Error deleting supplier', error)
    return apiError('Lỗi khi xóa nhà cung cấp', 500)
  }
})
