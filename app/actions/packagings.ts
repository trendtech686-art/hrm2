'use server'

/**
 * Server Actions for Packaging Management (Đóng gói)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { requireActionPermission } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createPackagingSchema, updatePackagingSchema } from '@/features/packaging/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

// Types
type Packaging = NonNullable<Awaited<ReturnType<typeof prisma.packaging.findFirst>>>

export type CreatePackagingInput = {
  orderId: string
  branchId: string
  employeeId?: string
  assignedEmployeeId?: string
  assignedEmployeeName?: string
  packDate?: string | Date
  notes?: string
  deliveryMethod?: 'SHIPPING' | 'PICKUP' | 'IN_STORE_PICKUP'
  carrier?: string
  service?: string
  requestorName?: string
  requestorId?: string
  requestorPhone?: string
  createdBy?: string
  items?: CreatePackagingItemInput[]
}

export type CreatePackagingItemInput = {
  orderItemId?: string
  productId: string
  productSystemId?: string
  productSku?: string
  productName?: string
  productUnit?: string
  quantity: number
  packedQuantity?: number
  notes?: string
}

export type UpdatePackagingInput = {
  systemId: string
  assignedEmployeeId?: string
  assignedEmployeeName?: string
  packDate?: string | Date
  notes?: string
  carrier?: string
  service?: string
  noteToShipper?: string
  weight?: number
  dimensions?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createPackagingAction(
  input: CreatePackagingInput
): Promise<ActionResult<Packaging>> {
  const authResult = await requireActionPermission('create_packaging')
  if (!authResult.success) return authResult
  const { session } = authResult
  const validated = createPackagingSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const systemId = await generateIdWithPrefix('DG', prisma)

    const totalItems = input.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

    const packaging = await prisma.packaging.create({
      data: {
        systemId,
        id: systemId,
        orderId: input.orderId,
        branchId: input.branchId,
        employeeId: input.employeeId,
        assignedEmployeeId: input.assignedEmployeeId,
        assignedEmployeeName: input.assignedEmployeeName,
        packDate: input.packDate ? new Date(input.packDate) : new Date(),
        requestDate: new Date(),
        totalItems,
        packedItems: 0,
        notes: input.notes,
        deliveryMethod: input.deliveryMethod as 'SHIPPING' | 'PICKUP' | 'IN_STORE_PICKUP' | undefined,
        carrier: input.carrier,
        service: input.service,
        requestorName: input.requestorName,
        requestorId: input.requestorId,
        requestorPhone: input.requestorPhone,
        status: 'PENDING',
        printStatus: 'NOT_PRINTED',
        createdBy: input.createdBy,
        items: input.items?.length ? {
          create: input.items.map((item) => ({
            productId: item.productId,
            requiredQty: item.quantity,
            packedQty: item.packedQuantity ?? 0,
          })),
        } : undefined,
      },
      include: { items: true },
    })

    revalidatePath('/packagings')
    revalidatePath(`/orders/${input.orderId}`)

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'packaging',
        entityId: systemId,
        action: `Tạo phiếu đóng gói: ${systemId}`,
        actionType: 'create',
        metadata: { userName: logUserName, orderId: input.orderId },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] packaging create failed', e))

    return { success: true, data: packaging }
  } catch (error) {
    logError('Error creating packaging', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo quy cách đóng gói',
    }
  }
}

export async function updatePackagingAction(
  input: UpdatePackagingInput
): Promise<ActionResult<Packaging>> {
  const authResult = await requireActionPermission('edit_packaging')
  if (!authResult.success) return authResult
  const { session } = authResult
  const validated = updatePackagingSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const { systemId, ...data } = input

    const existing = await prisma.packaging.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy quy cách đóng gói' }
    }

    if (existing.status !== 'PENDING' && existing.status !== 'IN_PROGRESS') {
      return {
        success: false,
        error: 'Chỉ có thể cập nhật đóng gói ở trạng thái PENDING hoặc IN_PROGRESS',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.assignedEmployeeId !== undefined) updateData.assignedEmployeeId = data.assignedEmployeeId
    if (data.assignedEmployeeName !== undefined) updateData.assignedEmployeeName = data.assignedEmployeeName
    if (data.packDate !== undefined) updateData.packDate = new Date(data.packDate)
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.carrier !== undefined) updateData.carrier = data.carrier
    if (data.service !== undefined) updateData.service = data.service
    if (data.noteToShipper !== undefined) updateData.noteToShipper = data.noteToShipper
    if (data.weight !== undefined) updateData.weight = data.weight
    if (data.dimensions !== undefined) updateData.dimensions = data.dimensions

    const packaging = await prisma.packaging.update({
      where: { systemId },
      data: updateData,
      include: { items: true },
    })

    revalidatePath('/packagings')
    revalidatePath(`/packagings/${systemId}`)

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'packaging',
        entityId: systemId,
        action: `Cập nhật phiếu đóng gói: ${systemId}`,
        actionType: 'update',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] packaging update failed', e))

    return { success: true, data: packaging }
  } catch (error) {
    logError('Error updating packaging', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật quy cách đóng gói',
    }
  }
}

export async function completePackagingAction(
  systemId: string,
  confirmedBy: string
): Promise<ActionResult<Packaging>> {
  const authResult = await requireActionPermission('edit_packaging')
  if (!authResult.success) return authResult
  const { session } = authResult
  try {
    const existing = await prisma.packaging.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy quy cách đóng gói' }
    }

    if (existing.status !== 'IN_PROGRESS') {
      return {
        success: false,
        error: 'Chỉ có thể hoàn thành đóng gói ở trạng thái IN_PROGRESS',
      }
    }

    // Check if all items are packed
    const unpackedItems = existing.items.filter(
      item => Number(item.packedQty) < Number(item.requiredQty)
    )

    if (unpackedItems.length > 0) {
      return {
        success: false,
        error: `${unpackedItems.length} sản phẩm chưa được đóng gói đầy đủ`,
      }
    }

    const packaging = await prisma.packaging.update({
      where: { systemId },
      data: {
        status: 'COMPLETED',
        confirmDate: new Date(),
        confirmingEmployeeId: confirmedBy,
      },
      include: { items: true },
    })

    revalidatePath('/packagings')
    revalidatePath(`/packagings/${systemId}`)

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'packaging',
        entityId: systemId,
        action: `Hoàn thành đóng gói: ${systemId}`,
        actionType: 'update',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] packaging complete failed', e))

    return { success: true, data: packaging }
  } catch (error) {
    logError('Error completing packaging', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hoàn thành đóng gói',
    }
  }
}

export async function cancelPackagingAction(
  systemId: string,
  canceledBy: string,
  reason?: string
): Promise<ActionResult<Packaging>> {
  const authResult = await requireActionPermission('edit_packaging')
  if (!authResult.success) return authResult
  const { session } = authResult
  try {
    const existing = await prisma.packaging.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy quy cách đóng gói' }
    }

    if (existing.status === 'CANCELLED' || existing.status === 'COMPLETED') {
      return {
        success: false,
        error: 'Không thể hủy đóng gói đã CANCELLED hoặc COMPLETED',
      }
    }

    const packaging = await prisma.packaging.update({
      where: { systemId },
      data: {
        status: 'CANCELLED',
        cancelDate: new Date(),
        cancelingEmployeeId: canceledBy,
        cancelReason: reason,
      },
    })

    revalidatePath('/packagings')
    revalidatePath(`/packagings/${systemId}`)

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'packaging',
        entityId: systemId,
        action: `Hủy đóng gói: ${systemId}`,
        actionType: 'update',
        note: reason ? `Lý do: ${reason}` : undefined,
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] packaging cancel failed', e))

    return { success: true, data: packaging }
  } catch (error) {
    logError('Error cancelling packaging', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy đóng gói',
    }
  }
}

export async function markAsPrintedAction(
  systemId: string
): Promise<ActionResult<Packaging>> {
  const authResult = await requireActionPermission('edit_packaging')
  if (!authResult.success) return authResult
  const { session } = authResult
  try {
    const existing = await prisma.packaging.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy quy cách đóng gói' }
    }

    const packaging = await prisma.packaging.update({
      where: { systemId },
      data: { printStatus: 'PRINTED' },
    })

    revalidatePath('/packagings')
    revalidatePath(`/packagings/${systemId}`)

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'packaging',
        entityId: systemId,
        action: `Đánh dấu đã in đóng gói: ${systemId}`,
        actionType: 'update',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] packaging markAsPrinted failed', e))

    return { success: true, data: packaging }
  } catch (error) {
    logError('Error marking as printed', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể đánh dấu đã in',
    }
  }
}
