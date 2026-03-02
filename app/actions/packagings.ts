'use server'

/**
 * Server Actions for Packaging Management (Đóng gói)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createPackagingSchema, updatePackagingSchema } from '@/features/packaging/validation'

// Types
type Packaging = NonNullable<Awaited<ReturnType<typeof prisma.packaging.findFirst>>>
type PackagingItem = NonNullable<Awaited<ReturnType<typeof prisma.packagingItem.findFirst>>>

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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
    return { success: true, data: packaging }
  } catch (error) {
    console.error('Error creating packaging:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo quy cách đóng gói',
    }
  }
}

export async function updatePackagingAction(
  input: UpdatePackagingInput
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
    return { success: true, data: packaging }
  } catch (error) {
    console.error('Error updating packaging:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật quy cách đóng gói',
    }
  }
}

export async function deletePackagingAction(
  systemId: string
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const existing = await prisma.packaging.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy quy cách đóng gói' }
    }

    if (existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Chỉ có thể xóa đóng gói ở trạng thái PENDING',
      }
    }

    // Delete items first
    await prisma.packagingItem.deleteMany({
      where: { packagingId: systemId },
    })

    const packaging = await prisma.packaging.delete({
      where: { systemId },
    })

    revalidatePath('/packagings')
    return { success: true, data: packaging }
  } catch (error) {
    console.error('Error deleting packaging:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa quy cách đóng gói',
    }
  }
}

export async function getPackagingAction(
  systemId: string
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const packaging = await prisma.packaging.findUnique({
      where: { systemId },
      include: {
        items: true,
        order: true,
        assignedEmployee: true,
        shipment: true,
      },
    })

    if (!packaging) {
      return { success: false, error: 'Không tìm thấy quy cách đóng gói' }
    }

    return { success: true, data: packaging }
  } catch (error) {
    console.error('Error getting packaging:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy thông tin quy cách đóng gói',
    }
  }
}

export async function startPackagingAction(
  systemId: string,
  employeeId?: string
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const existing = await prisma.packaging.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy quy cách đóng gói' }
    }

    if (existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Chỉ có thể bắt đầu đóng gói ở trạng thái PENDING',
      }
    }

    const packaging = await prisma.packaging.update({
      where: { systemId },
      data: {
        status: 'IN_PROGRESS',
        assignedEmployeeId: employeeId ?? existing.assignedEmployeeId,
      },
      include: { items: true },
    })

    revalidatePath('/packagings')
    revalidatePath(`/packagings/${systemId}`)
    return { success: true, data: packaging }
  } catch (error) {
    console.error('Error starting packaging:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể bắt đầu đóng gói',
    }
  }
}

export async function packItemAction(
  itemId: string,
  quantity: number
): Promise<ActionResult<PackagingItem>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const item = await prisma.packagingItem.findUnique({
      where: { systemId: itemId },
      include: { packaging: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy sản phẩm đóng gói' }
    }

    if (item.packaging.status !== 'IN_PROGRESS') {
      return {
        success: false,
        error: 'Chỉ có thể đóng gói sản phẩm ở trạng thái IN_PROGRESS',
      }
    }

    const maxQuantity = Number(item.requiredQty) - Number(item.packedQty)
    if (quantity > maxQuantity) {
      return {
        success: false,
        error: `Số lượng tối đa có thể đóng gói: ${maxQuantity}`,
      }
    }

    const newPackedQuantity = Number(item.packedQty) + quantity

    const updatedItem = await prisma.packagingItem.update({
      where: { systemId: itemId },
      data: {
        packedQty: newPackedQuantity,
      },
    })

    // Update packaging packedItems count
    const allItems = await prisma.packagingItem.findMany({
      where: { packagingId: item.packagingId },
    })
    const totalPacked = allItems.reduce((sum, i) => sum + Number(i.packedQty), 0)

    await prisma.packaging.update({
      where: { systemId: item.packagingId },
      data: { packedItems: totalPacked },
    })

    revalidatePath('/packagings')
    revalidatePath(`/packagings/${item.packagingId}`)
    return { success: true, data: updatedItem }
  } catch (error) {
    console.error('Error packing item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể đóng gói sản phẩm',
    }
  }
}

export async function completePackagingAction(
  systemId: string,
  confirmedBy: string
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
    return { success: true, data: packaging }
  } catch (error) {
    console.error('Error completing packaging:', error)
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
    return { success: true, data: packaging }
  } catch (error) {
    console.error('Error cancelling packaging:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy đóng gói',
    }
  }
}

export async function updateTrackingInfoAction(
  systemId: string,
  trackingData: {
    carrier?: string
    service?: string
    trackingCode?: string
    partnerStatus?: string
    shippingFeeToPartner?: number
    codAmount?: number
    payer?: string
  }
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const existing = await prisma.packaging.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy quy cách đóng gói' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (trackingData.carrier !== undefined) updateData.carrier = trackingData.carrier
    if (trackingData.service !== undefined) updateData.service = trackingData.service
    if (trackingData.trackingCode !== undefined) updateData.trackingCode = trackingData.trackingCode
    if (trackingData.partnerStatus !== undefined) updateData.partnerStatus = trackingData.partnerStatus
    if (trackingData.shippingFeeToPartner !== undefined) updateData.shippingFeeToPartner = trackingData.shippingFeeToPartner
    if (trackingData.codAmount !== undefined) updateData.codAmount = trackingData.codAmount
    if (trackingData.payer !== undefined) updateData.payer = trackingData.payer

    const packaging = await prisma.packaging.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/packagings')
    revalidatePath(`/packagings/${systemId}`)
    return { success: true, data: packaging }
  } catch (error) {
    console.error('Error updating tracking info:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật thông tin vận chuyển',
    }
  }
}

export async function markAsDeliveredAction(
  systemId: string
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const existing = await prisma.packaging.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy quy cách đóng gói' }
    }

    if (existing.status !== 'COMPLETED') {
      return {
        success: false,
        error: 'Chỉ có thể đánh dấu đã giao cho đóng gói ở trạng thái COMPLETED',
      }
    }

    const packaging = await prisma.packaging.update({
      where: { systemId },
      data: {
        deliveryStatus: 'DELIVERED',
        deliveredDate: new Date(),
      },
    })

    revalidatePath('/packagings')
    revalidatePath(`/packagings/${systemId}`)
    return { success: true, data: packaging }
  } catch (error) {
    console.error('Error marking as delivered:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể đánh dấu đã giao hàng',
    }
  }
}

export async function markAsPrintedAction(
  systemId: string
): Promise<ActionResult<Packaging>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
    return { success: true, data: packaging }
  } catch (error) {
    console.error('Error marking as printed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể đánh dấu đã in',
    }
  }
}
