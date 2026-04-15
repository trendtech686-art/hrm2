'use server'

/**
 * Server Actions for Suppliers Management (Nhà cung cấp)
 * 
 * These are server-side functions that can be called directly from Client Components.
 * They use Prisma transactions for atomic operations.
 */

import { prisma } from '@/lib/prisma'
import { requireActionPermission } from '@/lib/api-utils'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import type { ActionResult } from '@/types/action-result'
import { Prisma } from '@/generated/prisma/client'
import { createSupplierSchema, updateSupplierSchema } from '@/features/suppliers/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

// ====================================
// HELPERS
// ====================================

/**
 * Serialize Prisma Decimal fields to numbers for client components
 */
function serializeSupplier<T extends {
  totalPurchased?: unknown;
  totalDebt?: unknown;
  currentDebt?: unknown;
}>(supplier: T) {
  return {
    ...supplier,
    totalPurchased: supplier.totalPurchased != null ? Number(supplier.totalPurchased) : 0,
    totalDebt: supplier.totalDebt != null ? Number(supplier.totalDebt) : 0,
    currentDebt: supplier.currentDebt != null ? Number(supplier.currentDebt) : null,
  };
}

// ====================================
// TYPES
// ====================================

export type CreateSupplierInput = {
  name: string
  taxCode?: string
  phone?: string
  email?: string
  address?: string
  addressData?: Record<string, unknown> | null
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
  addressData?: Record<string, unknown> | null
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
  const authResult = await requireActionPermission('create_suppliers')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = createSupplierSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { name } = input

  if (!name) {
    return { success: false, error: 'Vui lòng nhập tên nhà cung cấp' }
  }

  try {
    const userName = getSessionUserName(session)

    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()
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
          addressData: (input.addressData as Prisma.InputJsonValue) ?? Prisma.JsonNull,
          website: input.website || null,
          accountManager: input.accountManager || null,
          bankAccount: input.bankAccount || null,
          bankName: input.bankName || null,
          contactPerson: input.contactPerson || null,
          notes: input.notes || null,
          status: 'Đang Giao Dịch',
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
        },
      })

      return supplier
    })

    // Activity log (fire-and-forget)
    prisma.activityLog.create({
      data: {
        entityType: 'supplier',
        entityId: result.systemId,
        action: 'created',
        actionType: 'create',
        note: `Tạo nhà cung cấp: ${result.name} (${result.id})`,
        createdBy: userName,
      },
    }).catch(e => logError('[ActivityLog] supplier created failed', e))

    revalidatePath('/suppliers')

    return { success: true, data: serializeSupplier(result) }
  } catch (error) {
    logError('createSupplierAction error', error)
    return { success: false, error: 'Không thể tạo nhà cung cấp' }
  }
}

// ====================================
// UPDATE SUPPLIER
// ====================================

export async function updateSupplierAction(
  input: UpdateSupplierInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_suppliers')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = updateSupplierSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { systemId, ...updateData } = input

  if (!systemId) {
    return { success: false, error: 'Thiếu systemId' }
  }

  try {
    const userName = getSessionUserName(session)

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.supplier.findUnique({
        where: { systemId },
      })

      if (!existing) {
        throw new Error('Không tìm thấy nhà cung cấp')
      }

      const data: Record<string, unknown> = {
        updatedAt: new Date(),
        updatedBy: userName,
      }

      // Build changes diff for activity log
      const fieldLabels: Record<string, string> = {
        name: 'Tên', taxCode: 'Mã số thuế', phone: 'Điện thoại', email: 'Email',
        address: 'Địa chỉ', website: 'Website', accountManager: 'Quản lý',
        bankAccount: 'Tài khoản NH', bankName: 'Ngân hàng', contactPerson: 'Người liên hệ',
        notes: 'Ghi chú', status: 'Trạng thái',
      }
      const changes: Record<string, { from: unknown; to: unknown }> = {}

      if (updateData.name !== undefined) data.name = updateData.name
      if (updateData.taxCode !== undefined) data.taxCode = updateData.taxCode
      if (updateData.phone !== undefined) data.phone = updateData.phone
      if (updateData.email !== undefined) data.email = updateData.email
      if (updateData.address !== undefined) data.address = updateData.address
      if (updateData.addressData !== undefined) data.addressData = updateData.addressData ?? Prisma.JsonNull
      if (updateData.website !== undefined) data.website = updateData.website
      if (updateData.accountManager !== undefined) data.accountManager = updateData.accountManager
      if (updateData.bankAccount !== undefined) data.bankAccount = updateData.bankAccount
      if (updateData.bankName !== undefined) data.bankName = updateData.bankName
      if (updateData.contactPerson !== undefined) data.contactPerson = updateData.contactPerson
      if (updateData.notes !== undefined) data.notes = updateData.notes
      if (updateData.status !== undefined) data.status = updateData.status
      if (updateData.isDeleted !== undefined) data.isDeleted = updateData.isDeleted
      if (updateData.deletedAt !== undefined) data.deletedAt = updateData.deletedAt

      // Track changes diff
      for (const key of Object.keys(fieldLabels)) {
        if (updateData[key as keyof typeof updateData] !== undefined) {
          const oldVal = (existing as Record<string, unknown>)[key]
          const newVal = updateData[key as keyof typeof updateData]
          if (String(oldVal ?? '') !== String(newVal ?? '')) {
            const label = fieldLabels[key] || key
            changes[label] = { from: oldVal ?? '', to: newVal ?? '' }
          }
        }
      }

      const supplier = await tx.supplier.update({
        where: { systemId },
        data,
      })

      // Activity log (fire-and-forget)
      if (Object.keys(changes).length > 0) {
        const changedFields = Object.keys(changes).join(', ')
        prisma.activityLog.create({
          data: {
            entityType: 'supplier',
            entityId: systemId,
            action: 'updated',
            actionType: 'update',
            note: `Cập nhật nhà cung cấp: ${existing.name}: ${changedFields}`,
            changes: changes as Prisma.InputJsonValue,
            createdBy: userName,
          },
        }).catch(e => logError('[ActivityLog] supplier updated failed', e))
      }

      return supplier
    })

    revalidatePath('/suppliers')
    revalidatePath(`/suppliers/${systemId}`)

    return { success: true, data: serializeSupplier(result) }
  } catch (error) {
    logError('updateSupplierAction error', error)
    return { success: false, error: 'Không thể cập nhật nhà cung cấp' }
  }
}

// ====================================
// DELETE SUPPLIER (Soft delete by default)
// ====================================

export async function deleteSupplierAction(
  input: DeleteSupplierInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('delete_suppliers')
  if (!authResult.success) return authResult
  const { session } = authResult

  const { systemId } = input

  if (!systemId) {
    return { success: false, error: 'Thiếu systemId' }
  }

  try {
    const userName = getSessionUserName(session)

    const existing = await prisma.supplier.findUnique({
      where: { systemId },
      select: { name: true, id: true },
    })

    await prisma.supplier.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: userName,
      },
    })

    // Activity log (fire-and-forget)
    prisma.activityLog.create({
      data: {
        entityType: 'supplier',
        entityId: systemId,
        action: 'deleted',
        actionType: 'delete',
        note: `Xóa nhà cung cấp: ${existing?.name || systemId} (${existing?.id || systemId})`,
        createdBy: userName,
      },
    }).catch(e => logError('[ActivityLog] supplier deleted failed', e))

    revalidatePath('/suppliers')
    revalidatePath('/suppliers/trash')

    return { success: true }
  } catch (error) {
    logError('deleteSupplierAction error', error)
    return { success: false, error: 'Không thể xóa nhà cung cấp' }
  }
}

// ====================================
// RESTORE SUPPLIER
// ====================================

export async function restoreSupplierAction(
  input: RestoreSupplierInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_suppliers')
  if (!authResult.success) return authResult
  const { session } = authResult

  const { systemId } = input

  if (!systemId) {
    return { success: false, error: 'Thiếu systemId' }
  }

  try {
    const userName = getSessionUserName(session)

    const result = await prisma.supplier.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
        updatedBy: userName,
        updatedAt: new Date(),
      },
    })

    // Activity log (fire-and-forget)
    prisma.activityLog.create({
      data: {
        entityType: 'supplier',
        entityId: systemId,
        action: 'restored',
        actionType: 'update',
        note: `Khôi phục nhà cung cấp: ${result.name} (${result.id})`,
        createdBy: userName,
      },
    }).catch(e => logError('[ActivityLog] supplier restored failed', e))

    revalidatePath('/suppliers')
    revalidatePath('/suppliers/trash')

    return { success: true, data: serializeSupplier(result) }
  } catch (error) {
    logError('restoreSupplierAction error', error)
    return { success: false, error: 'Không thể khôi phục nhà cung cấp' }
  }
}
