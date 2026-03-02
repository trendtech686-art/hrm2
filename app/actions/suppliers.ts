'use server'

/**
 * Server Actions for Suppliers Management (Nhà cung cấp)
 * 
 * These are server-side functions that can be called directly from Client Components.
 * They use Prisma transactions for atomic operations.
 */

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import type { ActionResult } from '@/types/action-result'
import { createSupplierSchema, updateSupplierSchema } from '@/features/suppliers/validation'

// ====================================
// TYPES
// ====================================

export type CreateSupplierInput = {
  name: string
  taxCode?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  accountManager?: string
  bankAccount?: string
  bankName?: string
  contactPerson?: string
  notes?: string
}

export type UpdateSupplierInput = {
  systemId: string
  name?: string
  taxCode?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  accountManager?: string
  bankAccount?: string
  bankName?: string
  contactPerson?: string
  notes?: string
  status?: string
  isDeleted?: boolean
  deletedAt?: Date | string | null
}

export type DeleteSupplierInput = {
  systemId: string
  permanent?: boolean
}

export type RestoreSupplierInput = {
  systemId: string
}

// ====================================
// CREATE SUPPLIER
// ====================================

export async function createSupplierAction(
  input: CreateSupplierInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const validated = createSupplierSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { name } = input

  if (!name) {
    return { success: false, error: 'Vui lòng nhập tên nhà cung cấp' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()
      const userName = session.user?.name || session.user?.email || 'Unknown'
      const systemId = await generateIdWithPrefix('NCC', tx)

      const supplier = await tx.supplier.create({
        data: {
          systemId,
          id: systemId,
          name,
          taxCode: input.taxCode || null,
          phone: input.phone || null,
          email: input.email || null,
          address: input.address || null,
          website: input.website || null,
          accountManager: input.accountManager || null,
          bankAccount: input.bankAccount || null,
          bankName: input.bankName || null,
          contactPerson: input.contactPerson || null,
          notes: input.notes || null,
          status: 'active',
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
        },
      })

      return supplier
    })

    revalidatePath('/suppliers')

    return { success: true, data: result }
  } catch (error) {
    console.error('createSupplierAction error:', error)
    return { success: false, error: 'Không thể tạo nhà cung cấp' }
  }
}

// ====================================
// UPDATE SUPPLIER
// ====================================

export async function updateSupplierAction(
  input: UpdateSupplierInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const validated = updateSupplierSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { systemId, ...updateData } = input

  if (!systemId) {
    return { success: false, error: 'Thiếu systemId' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.supplier.findUnique({
        where: { systemId },
      })

      if (!existing) {
        throw new Error('Không tìm thấy nhà cung cấp')
      }

      const userName = session.user?.name || session.user?.email || 'Unknown'

      const data: Record<string, unknown> = {
        updatedAt: new Date(),
        updatedBy: userName,
      }

      if (updateData.name !== undefined) data.name = updateData.name
      if (updateData.taxCode !== undefined) data.taxCode = updateData.taxCode
      if (updateData.phone !== undefined) data.phone = updateData.phone
      if (updateData.email !== undefined) data.email = updateData.email
      if (updateData.address !== undefined) data.address = updateData.address
      if (updateData.website !== undefined) data.website = updateData.website
      if (updateData.accountManager !== undefined) data.accountManager = updateData.accountManager
      if (updateData.bankAccount !== undefined) data.bankAccount = updateData.bankAccount
      if (updateData.bankName !== undefined) data.bankName = updateData.bankName
      if (updateData.contactPerson !== undefined) data.contactPerson = updateData.contactPerson
      if (updateData.notes !== undefined) data.notes = updateData.notes
      if (updateData.status !== undefined) data.status = updateData.status
      if (updateData.isDeleted !== undefined) data.isDeleted = updateData.isDeleted
      if (updateData.deletedAt !== undefined) data.deletedAt = updateData.deletedAt

      const supplier = await tx.supplier.update({
        where: { systemId },
        data,
      })

      return supplier
    })

    revalidatePath('/suppliers')
    revalidatePath(`/suppliers/${systemId}`)

    return { success: true, data: result }
  } catch (error) {
    console.error('updateSupplierAction error:', error)
    const message = error instanceof Error ? error.message : 'Không thể cập nhật nhà cung cấp'
    return { success: false, error: message }
  }
}

// ====================================
// DELETE SUPPLIER (Soft delete by default)
// ====================================

export async function deleteSupplierAction(
  input: DeleteSupplierInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { systemId, permanent = false } = input

  if (!systemId) {
    return { success: false, error: 'Thiếu systemId' }
  }

  try {
    const userName = session.user?.name || session.user?.email || 'Unknown'

    if (permanent) {
      await prisma.supplier.delete({
        where: { systemId },
      })
    } else {
      await prisma.supplier.update({
        where: { systemId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          updatedBy: userName,
        },
      })
    }

    revalidatePath('/suppliers')

    return { success: true }
  } catch (error) {
    console.error('deleteSupplierAction error:', error)
    const message = error instanceof Error ? error.message : 'Không thể xóa nhà cung cấp'
    return { success: false, error: message }
  }
}

// ====================================
// RESTORE SUPPLIER
// ====================================

export async function restoreSupplierAction(
  input: RestoreSupplierInput
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
    const userName = session.user?.name || session.user?.email || 'Unknown'

    const result = await prisma.supplier.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
        updatedBy: userName,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/suppliers')
    revalidatePath('/suppliers/trash')

    return { success: true, data: result }
  } catch (error) {
    console.error('restoreSupplierAction error:', error)
    const message = error instanceof Error ? error.message : 'Không thể khôi phục nhà cung cấp'
    return { success: false, error: message }
  }
}
