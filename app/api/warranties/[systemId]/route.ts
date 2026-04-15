import { prisma } from '@/lib/prisma'
import { WarrantyStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateWarrantySchema } from './validation'
import { serializeWarranty } from '../serialize'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { notifyWarrantyStatusChanged, notifyWarrantyAssigned } from '@/lib/warranty-notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/warranties/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  try {
    const { systemId } = await params

    const warranty = await prisma.warranty.findUnique({
      where: { systemId },
      include: {
        product: true,
        order: {
          select: { systemId: true, id: true, orderDate: true },
        },
        // ✅ Include customer for CustomerSelector stats
        customers: {
          select: { systemId: true, id: true, name: true, phone: true },
        },
      },
    })

    if (!warranty) {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }

    // Debug: Log warranty data including customer

    return apiSuccess(serializeWarranty(warranty))
  } catch (error) {
    logError('Error fetching warranty', error)
    return apiError('Không thể tải phiếu bảo hành', 500)
  }
}

// PUT /api/warranties/[systemId] - Update warranty details
/**
 * Update warranty flow:
 * 1. Verify warranty exists
 * 2. Validate update data
 * 3. If changing type from REPLACE to REPAIR/REFUND, uncommit stock
 * 4. Update warranty record
 * 5. Create history entry
 */
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  const validation = await validateBody(request, updateWarrantySchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params
    
    // Fetch existing warranty to detect changes for notifications
    const existing = await prisma.warranty.findUnique({
      where: { systemId },
      select: { status: true, assigneeId: true, title: true, id: true, createdBySystemId: true, processedImages: true },
    });
    if (!existing) {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }

    // Build update data - only include fields that are provided
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
      updatedBy: session.user?.email || 'system',
      updatedBySystemId: session.user?.id,
    };

    // Basic fields
    if (body.issueDescription !== undefined) updateData.issueDescription = body.issueDescription;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.status !== undefined) updateData.status = body.status as WarrantyStatus;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.solution !== undefined) updateData.solution = body.solution;
    if (body.diagnosis !== undefined) updateData.diagnosis = body.diagnosis;
    if (body.assigneeId !== undefined) updateData.assigneeId = body.assigneeId;
    
    // Customer info
    if (body.customerName !== undefined) updateData.customerName = body.customerName;
    if (body.customerPhone !== undefined) updateData.customerPhone = body.customerPhone;
    if (body.customerEmail !== undefined) updateData.customerEmail = body.customerEmail;
    if (body.customerAddress !== undefined) updateData.customerAddress = body.customerAddress;
    
    // Branch & employee
    if (body.branchSystemId !== undefined) updateData.branchSystemId = body.branchSystemId;
    if (body.branchName !== undefined) updateData.branchName = body.branchName;
    if (body.employeeSystemId !== undefined) updateData.employeeSystemId = body.employeeSystemId;
    if (body.employeeName !== undefined) updateData.employeeName = body.employeeName;
    
    // Shipping & external refs
    if (body.trackingCode !== undefined) updateData.trackingCode = body.trackingCode;
    if (body.shippingFee !== undefined) updateData.shippingFee = body.shippingFee;
    if (body.referenceUrl !== undefined) updateData.referenceUrl = body.referenceUrl;
    if (body.externalReference !== undefined) updateData.externalReference = body.externalReference;
    
    // Images
    if (body.receivedImages !== undefined) updateData.receivedImages = body.receivedImages;
    if (body.processedImages !== undefined) updateData.processedImages = body.processedImages;
    
    // Products (JSON array)
    if (body.products !== undefined) updateData.products = body.products;
    
    // Settlement (JSON object)
    if (body.settlement !== undefined) updateData.settlement = body.settlement;
    if (body.settlementStatus !== undefined) updateData.settlementStatus = body.settlementStatus;
    
    // Summary (JSON object)
    if (body.summary !== undefined) updateData.summary = body.summary;
    
    // History & comments (JSON arrays)
    if (body.history !== undefined) updateData.history = body.history;
    if (body.comments !== undefined) updateData.comments = body.comments;
    
    // Subtasks
    if (body.subtasks !== undefined) updateData.subtasks = body.subtasks;
    
    // Order linking
    if (body.linkedOrderSystemId !== undefined) updateData.linkedOrderSystemId = body.linkedOrderSystemId;

    const warranty = await prisma.warranty.update({
      where: { systemId },
      data: updateData,
      include: {
        product: {
          select: { systemId: true, id: true, name: true, imageUrl: true },
        },
        customers: {
          select: { systemId: true, id: true, name: true, phone: true },
        },
      },
    })

    // Activity log: processedImages upload
    if (body.processedImages !== undefined) {
      const oldCount = existing.processedImages?.length ?? 0
      const newCount = Array.isArray(body.processedImages) ? body.processedImages.length : 0
      const addedCount = newCount - oldCount
      if (addedCount > 0) {
        const logUserName = session.user?.name || session.user?.email || 'system'
        prisma.activityLog.create({
          data: {
            entityType: 'warranty',
            entityId: systemId,
            action: `Cập nhật phiếu bảo hành: ${existing.id}`,
            actionType: 'update',
            note: `Thêm ${addedCount} hình ảnh đã xử lý (tổng: ${newCount} ảnh)`,
            metadata: { userName: logUserName },
            createdBy: logUserName,
          }
        }).catch(e => logError('[ActivityLog] warranty processedImages upload failed', e))
      }
    }

    // TODO: Handle stock adjustments if warranty type changes
    // This would require knowing the previous warranty type and new type
    // If changing from REPLACE to REPAIR/REFUND, uncommit stock

    // Notify on status or assignee changes (non-blocking)
    const warrantyStatusLabels: Record<string, string> = {
      RECEIVED: 'Đã tiếp nhận', IN_PROGRESS: 'Đang xử lý', WAITING_PARTS: 'Chờ linh kiện',
      COMPLETED: 'Hoàn thành', RETURNED: 'Đã trả khách', CANCELLED: 'Đã hủy',
    };
    const currentUserEmployeeId = session.user?.employeeId;
    const warrantyLink = `/warranty/${systemId}`;

    if (body.status !== undefined && body.status !== existing.status && warranty.assigneeId) {
      if (warranty.assigneeId !== currentUserEmployeeId) {
        const label = warrantyStatusLabels[body.status as string] || body.status;
        createNotification({
          type: 'warranty',
          title: 'Cập nhật bảo hành',
          message: `Phiếu ${existing.id} → ${label}`,
          link: warrantyLink,
          recipientId: warranty.assigneeId,
          senderId: currentUserEmployeeId || undefined,
          senderName: session.user?.name || undefined,
          settingsKey: 'warranty:status',
        }).catch(e => logError('[Warranty] Status notification failed', e));

        // Send email notification (non-blocking)
        notifyWarrantyStatusChanged({
          systemId,
          title: existing.title,
          id: existing.id,
          assigneeId: warranty.assigneeId,
          creatorId: existing.createdBySystemId,
          status: body.status as string,
          oldStatus: existing.status,
        }).catch(e => logError('[Warranty] Status email failed', e));
      }
    }

    if (body.assigneeId !== undefined && body.assigneeId !== existing.assigneeId && body.assigneeId) {
      if (body.assigneeId !== currentUserEmployeeId) {
        createNotification({
          type: 'warranty',
          title: 'Phiếu bảo hành mới',
          message: `Bạn được giao phiếu bảo hành "${existing.title}"`,
          link: warrantyLink,
          recipientId: body.assigneeId,
          senderId: currentUserEmployeeId || undefined,
          senderName: session.user?.name || undefined,
          settingsKey: 'warranty:assigned',
        }).catch(e => logError('[Warranty] Assignment notification failed', e));

        // Send email notification (non-blocking)
        notifyWarrantyAssigned({
          systemId,
          title: existing.title,
          id: existing.id,
          assigneeId: body.assigneeId,
          assignerName: session.user?.name,
        }).catch(e => logError('[Warranty] Assignment email failed', e));
      }
    }

    return apiSuccess(serializeWarranty(warranty))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }
    logError('Error updating warranty', error)
    return apiError('Không thể cập nhật phiếu bảo hành', 500)
  }
}

// PATCH /api/warranties/[systemId] - Partial update warranty
export async function PATCH(request: Request, { params }: RouteParams) {
  return PUT(request, { params })
}

// DELETE /api/warranties/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  try {
    const { systemId } = await params

    await prisma.warranty.update({
      where: { systemId },
      data: { isDeleted: true, deletedAt: new Date() },
    })

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'warranty',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật phiếu bảo hành`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] warranty update failed', e))
    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }
    logError('Error deleting warranty', error)
    return apiError('Không thể xóa phiếu bảo hành', 500)
  }
}
