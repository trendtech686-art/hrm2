import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { logError } from '@/lib/logger'

/**
 * DELETE /api/customers/[systemId]/permanent - Lưu trữ vĩnh viễn khách hàng
 *
 * KHÔNG xóa cứng (hard-delete) record khỏi DB.
 * Thay vào đó:
 * 1. Xóa thông tin cá nhân nhạy cảm (PII) — phone, email, tax code, bank, addresses...
 * 2. Giữ lại: systemId, id, name, company — để đơn hàng, phiếu thu, bảo hành
 *    vẫn hiển thị đúng tên khách hàng.
 * 3. Set permanentlyDeletedAt — để phân biệt "thùng rác" vs "đã lưu trữ".
 *
 * Lý do: Customer có FK từ Order.customerId, Receipt.customerId, Warranty.customerId, v.v.
 * Hard-delete sẽ gỡ liên kết và mất thông tin trên tất cả dữ liệu liên quan.
 */
export const DELETE = apiHandler(async (
  _request,
  { session, params }
) => {
    const { systemId } = await params

    const existing = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Customer')
    }

    if (!existing.isDeleted) {
      return apiError('Khách hàng phải ở trong thùng rác trước khi lưu trữ vĩnh viễn', 400)
    }

    if (existing.permanentlyDeletedAt) {
      return apiError('Khách hàng đã được lưu trữ vĩnh viễn', 400)
    }

    await prisma.$transaction(async (tx) => {
      await tx.customer.update({
        where: { systemId },
        data: {
          permanentlyDeletedAt: new Date(),
          // Xóa PII nhạy cảm
          phone: null,
          taxCode: null,
          representative: null,
          position: null,
          addresses: Prisma.JsonNull,
          gender: null,
          dateOfBirth: null,
          address: null,
          province: null,
          district: null,
          ward: null,
          zaloPhone: null,
          contacts: Prisma.JsonNull,
          businessProfiles: Prisma.JsonNull,
          social: Prisma.JsonNull,
          images: [],
          notes: null,
          // Xóa dữ liệu tài chính nhạy cảm
          currentDebt: 0,
          maxDebt: null,
          defaultDiscount: null,
          // Xóa follow-up
          lastContactDate: null,
          nextFollowUpDate: null,
          followUpReason: null,
          followUpAssigneeId: null,
        },
      });
    });

    // Fire-and-forget activity log
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: systemId,
          action: 'permanently_archived',
          actionType: 'delete',
          note: `Lưu trữ vĩnh viễn khách hàng: ${existing.name} (${existing.id})`,
          metadata: { userName },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    return apiSuccess({ success: true, systemId })
}, { permission: 'delete_customers' })
