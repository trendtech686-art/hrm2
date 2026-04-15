import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

/**
 * DELETE /api/suppliers/[systemId]/permanent - Lưu trữ vĩnh viễn nhà cung cấp
 *
 * KHÔNG xóa cứng (hard-delete) record khỏi DB.
 * Thay vào đó:
 * 1. Xóa thông tin nhạy cảm — banking, notes, contact details
 * 2. Giữ lại: systemId, id, name, taxCode, status
 *    → Phiếu nhập, phiếu chi, đơn mua vẫn hiển thị đúng tên NCC.
 * 3. Set permanentlyDeletedAt — để phân biệt "thùng rác" vs "đã lưu trữ".
 *
 * Lý do: Supplier có FK từ PurchaseOrder, Payment, PurchaseReturn, InventoryReceipt.
 * Hard-delete gỡ liên kết và mất thông tin trên tất cả dữ liệu liên quan.
 */
export const DELETE = apiHandler(async (_request, { session, params }) => {
  const { systemId } = params

  const existing = await prisma.supplier.findUnique({
    where: { systemId },
  })

  if (!existing) {
    return apiNotFound('Supplier')
  }

  if (!existing.isDeleted) {
    return apiError('Nhà cung cấp phải ở trong thùng rác trước khi lưu trữ vĩnh viễn', 400)
  }

  if (existing.permanentlyDeletedAt) {
    return apiError('Nhà cung cấp đã được lưu trữ vĩnh viễn', 400)
  }

  await prisma.$transaction(async (tx) => {
    await tx.supplier.update({
      where: { systemId },
      data: {
        permanentlyDeletedAt: new Date(),
        phone: null,
        email: null,
        address: null,
        contactPerson: null,
        website: null,
        bankAccount: null,
        bankName: null,
        notes: null,
        accountManager: null,
        currentDebt: 0,
        totalDebt: 0,
      },
    });
  });

  // Activity log (fire-and-forget)
  getUserNameFromDb(session!.user?.id).then(userName =>
    prisma.activityLog.create({
      data: {
        entityType: 'supplier',
        entityId: systemId,
        action: 'permanently_archived',
        actionType: 'delete',
        note: `Lưu trữ vĩnh viễn nhà cung cấp: ${existing.name} (${existing.id})`,
        createdBy: userName,
      },
    })
  ).catch(e => logError('[ActivityLog] supplier permanent archive failed', e))

  return apiSuccess({ success: true, systemId })
})
