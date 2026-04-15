'use server'

/**
 * Server Actions for Sales Returns Management (Trả hàng)
 * 
 * SIMPLIFIED VERSION - Uses existing API routes for complex operations
 * These actions handle basic CRUD and status updates
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { requireActionPermission, serializeDecimals } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { updateSalesReturnSchema } from '@/features/sales-returns/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

// Types from Prisma (auto-inferred)
type SalesReturn = NonNullable<Awaited<ReturnType<typeof prisma.salesReturn.findFirst>>>

// ====================================
// TYPES
// ====================================

export type UpdateSalesReturnInput = {
  systemId: string
  status?: string
  reason?: string
  note?: string
  notes?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

/**
 * Update a sales return (basic fields only)
 */
export async function updateSalesReturnAction(
  input: UpdateSalesReturnInput
): Promise<ActionResult<SalesReturn>> {
  const authResult = await requireActionPermission('edit_sales_returns')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = updateSalesReturnSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.salesReturn.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng bán' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.status) updateData.status = data.status
    if (data.reason !== undefined) updateData.reason = data.reason
    if (data.note !== undefined) updateData.note = data.note
    if (data.notes !== undefined) updateData.notes = data.notes

    const salesReturn = await prisma.salesReturn.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/sales-returns')
    revalidatePath(`/sales-returns/${systemId}`)

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'sales_return',
        entityId: systemId,
        action: `Cập nhật phiếu trả hàng: ${systemId}`,
        actionType: 'update',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] sales-return update failed', e))

    return { success: true, data: serializeDecimals(salesReturn) }
  } catch (error) {
    logError('Error updating sales return', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật phiếu trả hàng bán',
    }
  }
}

/**
 * Delete a sales return (soft delete)
 */
export async function deleteSalesReturnAction(
  systemId: string
): Promise<ActionResult<SalesReturn>> {
  const authResult = await requireActionPermission('delete_sales_returns')
  if (!authResult.success) return authResult
  const { session } = authResult
  try {
    const existing = await prisma.salesReturn.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng bán' }
    }

    // Check if can be deleted (only PENDING status)
    if (existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Chỉ có thể xóa phiếu trả hàng ở trạng thái chờ xử lý',
      }
    }

    // Delete associated items first
    await prisma.salesReturnItem.deleteMany({
      where: { returnId: systemId },
    })

    // Delete the sales return
    const salesReturn = await prisma.salesReturn.delete({
      where: { systemId },
    })

    revalidatePath('/sales-returns')

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'sales_return',
        entityId: systemId,
        action: `Xóa phiếu trả hàng: ${systemId}`,
        actionType: 'delete',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] sales-return delete failed', e))

    return { success: true, data: serializeDecimals(salesReturn) }
  } catch (error) {
    logError('Error deleting sales return', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa phiếu trả hàng bán',
    }
  }
}

/**
 * Note: For CREATE, RECEIVE, and EXCHANGE operations,
 * use the existing API routes which handle complex inventory operations:
 * - POST /api/sales-returns (create)
 * - POST /api/sales-returns/[systemId]/receive (receive)
 * - POST /api/sales-returns/[systemId]/exchange (exchange)
 */
