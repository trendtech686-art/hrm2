'use server'

/**
 * Server Actions for Payment Method Management (Phương thức thanh toán)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'

// Types
type PaymentMethod = NonNullable<Awaited<ReturnType<typeof prisma.paymentMethod.findFirst>>>

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export type CreatePaymentMethodInput = {
  name: string
  description?: string
  code?: string
  type?: string
  isDefault?: boolean
  isActive?: boolean
  color?: string
  icon?: string
  accountNumber?: string
  accountName?: string
  bankName?: string
  createdBy?: string
}

export type UpdatePaymentMethodInput = {
  systemId: string
  name?: string
  description?: string
  code?: string
  type?: string
  isDefault?: boolean
  isActive?: boolean
  color?: string
  icon?: string
  accountNumber?: string
  accountName?: string
  bankName?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createPaymentMethodAction(
  input: CreatePaymentMethodInput
): Promise<ActionResult<PaymentMethod>> {
  try {
    const systemId = await generateIdWithPrefix('PTTT', prisma)

    if (input.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        description: input.description,
        code: input.code,
        type: input.type,
        isDefault: input.isDefault ?? false,
        isActive: input.isActive ?? true,
        color: input.color,
        icon: input.icon,
        accountNumber: input.accountNumber,
        accountName: input.accountName,
        bankName: input.bankName,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/settings/payment-methods')
    return { success: true, data: paymentMethod }
  } catch (error) {
    console.error('Error creating payment method:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment method',
    }
  }
}

export async function updatePaymentMethodAction(
  input: UpdatePaymentMethodInput
): Promise<ActionResult<PaymentMethod>> {
  try {
    const { systemId, ...data } = input

    if (data.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.code !== undefined) updateData.code = data.code
    if (data.type !== undefined) updateData.type = data.type
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.color !== undefined) updateData.color = data.color
    if (data.icon !== undefined) updateData.icon = data.icon
    if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber
    if (data.accountName !== undefined) updateData.accountName = data.accountName
    if (data.bankName !== undefined) updateData.bankName = data.bankName
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const paymentMethod = await prisma.paymentMethod.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/settings/payment-methods')
    return { success: true, data: paymentMethod }
  } catch (error) {
    console.error('Error updating payment method:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update payment method',
    }
  }
}

export async function deletePaymentMethodAction(
  systemId: string
): Promise<ActionResult<PaymentMethod>> {
  try {
    const existing = await prisma.paymentMethod.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Payment method not found' }
    }

    if (existing.isDefault) {
      return { success: false, error: 'Cannot delete default payment method' }
    }

    const paymentMethod = await prisma.paymentMethod.delete({
      where: { systemId },
    })

    revalidatePath('/settings/payment-methods')
    return { success: true, data: paymentMethod }
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete payment method',
    }
  }
}

export async function getPaymentMethodAction(
  systemId: string
): Promise<ActionResult<PaymentMethod>> {
  try {
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { systemId },
    })

    if (!paymentMethod) {
      return { success: false, error: 'Payment method not found' }
    }

    return { success: true, data: paymentMethod }
  } catch (error) {
    console.error('Error getting payment method:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get payment method',
    }
  }
}

export async function setDefaultPaymentMethodAction(
  systemId: string
): Promise<ActionResult<PaymentMethod>> {
  try {
    await prisma.paymentMethod.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    })

    const paymentMethod = await prisma.paymentMethod.update({
      where: { systemId },
      data: { isDefault: true },
    })

    revalidatePath('/settings/payment-methods')
    return { success: true, data: paymentMethod }
  } catch (error) {
    console.error('Error setting default payment method:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set default payment method',
    }
  }
}

export async function togglePaymentMethodActiveAction(
  systemId: string
): Promise<ActionResult<PaymentMethod>> {
  try {
    const existing = await prisma.paymentMethod.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Payment method not found' }
    }

    const paymentMethod = await prisma.paymentMethod.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    })

    revalidatePath('/settings/payment-methods')
    return { success: true, data: paymentMethod }
  } catch (error) {
    console.error('Error toggling payment method:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle payment method',
    }
  }
}
