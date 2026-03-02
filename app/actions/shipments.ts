'use server'

/**
 * Server Actions for Shipments Management (Vận đơn)
 * 
 * These are server-side functions that can be called directly from Client Components.
 * They use Prisma transactions for atomic operations.
 */

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import type { ActionResult } from '@/types/action-result'
import { createShipmentSchema, updateShipmentSchema } from '@/features/shipments/validation'

// ====================================
// TYPES
// ====================================

export type CreateShipmentInput = {
  packagingSystemId: string
  orderSystemId: string
  orderId: string
  trackingCode?: string
  carrier?: string
  service?: string
  deliveryStatus?: string
  printStatus?: string
  shippingFeeToPartner?: number
  codAmount?: number
  payer?: string
}

export type UpdateShipmentInput = {
  systemId: string
  trackingCode?: string
  carrier?: string
  service?: string
  deliveryStatus?: string
  printStatus?: string
  shippingFeeToPartner?: number
  codAmount?: number
  payer?: string
  reconciliationStatus?: string
  partnerStatus?: string
  dispatchedAt?: Date
  deliveredAt?: Date
}

export type DeleteShipmentInput = {
  systemId: string
}

// ====================================
// CREATE SHIPMENT
// ====================================

export async function createShipmentAction(
  input: CreateShipmentInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const validated = createShipmentSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { packagingSystemId, orderSystemId, orderId } = input

  if (!packagingSystemId || !orderSystemId) {
    return { success: false, error: 'Thiếu thông tin bắt buộc' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()
      const userName = session.user?.name || session.user?.email || 'Unknown'
      const systemId = await generateIdWithPrefix('VD', tx)

      const shipment = await tx.shipment.create({
        data: {
          systemId,
          id: systemId,
          packagingSystemId,
          orderSystemId,
          orderId,
          trackingCode: input.trackingCode || null,
          carrier: input.carrier || '',
          service: input.service || null,
          deliveryStatus: input.deliveryStatus || 'pending',
          printStatus: input.printStatus || 'not_printed',
          shippingFeeToPartner: input.shippingFeeToPartner || 0,
          codAmount: input.codAmount || 0,
          payer: input.payer || null,
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
        },
      })

      return shipment
    })

    revalidatePath('/shipments')
    revalidatePath(`/orders/${input.orderSystemId}`)

    return { success: true, data: result }
  } catch (error) {
    console.error('createShipmentAction error:', error)
    return { success: false, error: 'Không thể tạo vận đơn' }
  }
}

// ====================================
// UPDATE SHIPMENT
// ====================================

export async function updateShipmentAction(
  input: UpdateShipmentInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const validated = updateShipmentSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { systemId, ...updateData } = input

  if (!systemId) {
    return { success: false, error: 'Thiếu systemId' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.shipment.findUnique({
        where: { systemId },
      })

      if (!existing) {
        throw new Error('Không tìm thấy vận đơn')
      }

      const userName = session.user?.name || session.user?.email || 'Unknown'

      const data: Record<string, unknown> = {
        updatedAt: new Date(),
        updatedBy: userName,
      }

      if (updateData.trackingCode !== undefined) data.trackingCode = updateData.trackingCode
      if (updateData.carrier !== undefined) data.carrier = updateData.carrier
      if (updateData.service !== undefined) data.service = updateData.service
      if (updateData.deliveryStatus !== undefined) data.deliveryStatus = updateData.deliveryStatus
      if (updateData.printStatus !== undefined) data.printStatus = updateData.printStatus
      if (updateData.shippingFeeToPartner !== undefined) data.shippingFeeToPartner = updateData.shippingFeeToPartner
      if (updateData.codAmount !== undefined) data.codAmount = updateData.codAmount
      if (updateData.payer !== undefined) data.payer = updateData.payer
      if (updateData.reconciliationStatus !== undefined) data.reconciliationStatus = updateData.reconciliationStatus
      if (updateData.partnerStatus !== undefined) data.partnerStatus = updateData.partnerStatus
      if (updateData.dispatchedAt !== undefined) data.dispatchedAt = updateData.dispatchedAt
      if (updateData.deliveredAt !== undefined) data.deliveredAt = updateData.deliveredAt

      const shipment = await tx.shipment.update({
        where: { systemId },
        data,
      })

      return shipment
    })

    revalidatePath('/shipments')
    revalidatePath(`/shipments/${systemId}`)

    return { success: true, data: result }
  } catch (error) {
    console.error('updateShipmentAction error:', error)
    const message = error instanceof Error ? error.message : 'Không thể cập nhật vận đơn'
    return { success: false, error: message }
  }
}

// ====================================
// DELETE SHIPMENT
// ====================================

export async function deleteShipmentAction(
  input: DeleteShipmentInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { systemId } = input

  if (!systemId) {
    return { success: false, error: 'Thiếu systemId' }
  }

  try {
    await prisma.shipment.delete({
      where: { systemId },
    })

    revalidatePath('/shipments')

    return { success: true }
  } catch (error) {
    console.error('deleteShipmentAction error:', error)
    const message = error instanceof Error ? error.message : 'Không thể xóa vận đơn'
    return { success: false, error: message }
  }
}
