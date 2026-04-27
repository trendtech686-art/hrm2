'use server'

/**
 * Server Actions for Inventory Check Management (Phiếu kiểm kê)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { requireActionPermission } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createInventoryCheckSchema, updateInventoryCheckSchema, inventoryCheckItemSchema } from '@/features/inventory-checks/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

// Types
type InventoryCheck = NonNullable<Awaited<ReturnType<typeof prisma.inventoryCheck.findFirst>>>
type InventoryCheckItem = NonNullable<Awaited<ReturnType<typeof prisma.inventoryCheckItem.findFirst>>>

export type CreateInventoryCheckInput = {
  branchId: string
  branchSystemId?: string
  branchName?: string
  checkDate: string | Date
  description?: string
  createdBy?: string
  items?: CreateInventoryCheckItemInput[]
}

export type CreateInventoryCheckItemInput = {
  productId: string
  productSystemId?: string
  productSku?: string
  productName?: string
  unit?: string
  systemQuantity: number
  actualQuantity: number
  difference?: number
  reason?: string
  notes?: string
}

export type UpdateInventoryCheckInput = {
  systemId: string
  checkDate?: string | Date
  description?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createInventoryCheckAction(
  input: CreateInventoryCheckInput
): Promise<ActionResult<InventoryCheck>> {
  const authResult = await requireActionPermission('create_inventory_checks')
  if (!authResult.success) return authResult

  const validated = createInventoryCheckSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const systemId = await generateIdWithPrefix('KK', prisma)

    const inventoryCheck = await prisma.inventoryCheck.create({
      data: {
        systemId,
        id: systemId,
        branchId: input.branchId,
        branchSystemId: input.branchSystemId,
        branchName: input.branchName,
        checkDate: new Date(input.checkDate),
        notes: input.description,
        status: 'DRAFT',
        createdBy: input.createdBy,
        items: input.items?.length ? {
          create: input.items.map((item) => ({
            productId: item.productId,
            productSystemId: item.productSystemId,
            productName: item.productName || '',
            productSku: item.productSku || '',
            unit: item.unit || 'Cái',
            systemQty: item.systemQuantity,
            actualQty: item.actualQuantity,
            difference: item.difference ?? (item.actualQuantity - item.systemQuantity),
            reason: item.reason || 'other',
            notes: item.notes,
          })),
        } : undefined,
      },
      include: { items: true },
    })

    revalidatePath('/inventory-checks')

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'inventory_check',
        entityId: inventoryCheck.systemId,
        action: `Thêm phiếu kiểm kê: ${inventoryCheck.systemId}`,
        actionType: 'create',
        note: `Tạo phiếu kiểm kê ${inventoryCheck.systemId} - ${input.branchName || input.branchId} - ${inventoryCheck.items?.length || 0} SP`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] inventory check create failed', e))

    return { success: true, data: inventoryCheck }
  } catch (error) {
    logError('Error creating inventory check', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo phiếu kiểm kê',
    }
  }
}

export async function updateInventoryCheckAction(
  input: UpdateInventoryCheckInput
): Promise<ActionResult<InventoryCheck>> {
  const authResult = await requireActionPermission('edit_inventory_checks')
  if (!authResult.success) return authResult

  const validated = updateInventoryCheckSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ phiếu ở trạng thái NHÁP mới có thể cập nhật',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.checkDate !== undefined) updateData.checkDate = new Date(data.checkDate)
    if (data.description !== undefined) updateData.description = data.description
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const inventoryCheck = await prisma.inventoryCheck.update({
      where: { systemId },
      data: updateData,
      include: { items: true },
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${systemId}`)

    // Activity log with changes diff
    const userName = getSessionUserName(authResult.session)
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (data.checkDate !== undefined && String(existing.checkDate) !== String(new Date(data.checkDate))) {
      changes['Ngày kiểm kê'] = { from: existing.checkDate?.toISOString().split('T')[0], to: String(data.checkDate).split('T')[0] }
    }
    if (data.description !== undefined && data.description !== existing.notes) {
      changes['Ghi chú'] = { from: existing.notes, to: data.description }
    }
    if (Object.keys(changes).length > 0) {
      const changeFields = Object.keys(changes).join(', ')
      prisma.activityLog.create({
        data: {
          entityType: 'inventory_check',
          entityId: systemId,
          action: `Cập nhật phiếu kiểm kê: ${systemId}: ${changeFields}`,
          actionType: 'update',
          changes: JSON.parse(JSON.stringify(changes)),
          metadata: { userName },
          createdBy: userName,
        }
      }).catch(e => logError('[ActivityLog] inventory check update failed', e))
    }

    return { success: true, data: inventoryCheck }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật phiếu kiểm kê',
    }
  }
}

export async function deleteInventoryCheckAction(
  systemId: string
): Promise<ActionResult<InventoryCheck>> {
  const authResult = await requireActionPermission('delete_inventory_checks')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ phiếu ở trạng thái NHÁP mới có thể xóa',
      }
    }

    // Delete items first
    await prisma.inventoryCheckItem.deleteMany({
      where: { checkId: systemId },
    })

    const inventoryCheck = await prisma.inventoryCheck.delete({
      where: { systemId },
    })

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'inventory_check',
        entityId: systemId,
        action: `Xóa phiếu kiểm kê: ${systemId}`,
        actionType: 'delete',
        note: `Xóa phiếu kiểm kê ${systemId} - ${existing.branchName || existing.branchId}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] inventory check delete failed', e))

    revalidatePath('/inventory-checks')
    return { success: true, data: inventoryCheck }
  } catch (error) {
    logError('Error deleting inventory check', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa phiếu kiểm kê',
    }
  }
}

export async function getInventoryCheckAction(
  systemId: string
): Promise<ActionResult<InventoryCheck>> {
  const authResult = await requireActionPermission('view_inventory_checks')
  if (!authResult.success) return authResult

  try {
    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    })

    if (!inventoryCheck) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    return { success: true, data: inventoryCheck }
  } catch (error) {
    logError('Error getting inventory check', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy thông tin phiếu kiểm kê',
    }
  }
}

export async function addInventoryCheckItemAction(
  inventoryCheckId: string,
  item: CreateInventoryCheckItemInput
): Promise<ActionResult<InventoryCheckItem>> {
  const authResult = await requireActionPermission('edit_inventory_checks')
  if (!authResult.success) return authResult

  const validated = inventoryCheckItemSchema.safeParse(item)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId: inventoryCheckId },
      include: { items: true },
    })

    if (!inventoryCheck) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    if (inventoryCheck.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ phiếu ở trạng thái NHÁP mới có thể thêm sản phẩm',
      }
    }

    const newItem = await prisma.inventoryCheckItem.create({
      data: {
        checkId: inventoryCheckId,
        productId: item.productId,
        productSku: item.productSku || '',
        productName: item.productName || '',
        systemQty: item.systemQuantity,
        actualQty: item.actualQuantity,
        difference: item.difference ?? (item.actualQuantity - item.systemQuantity),
        notes: item.notes,
      },
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${inventoryCheckId}`)
    return { success: true, data: newItem }
  } catch (error) {
    logError('Error adding inventory check item', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào phiếu kiểm kê',
    }
  }
}

export async function updateInventoryCheckItemAction(
  itemId: string,
  data: Partial<CreateInventoryCheckItemInput>
): Promise<ActionResult<InventoryCheckItem>> {
  const authResult = await requireActionPermission('edit_inventory_checks')
  if (!authResult.success) return authResult

  const validated = inventoryCheckItemSchema.partial().safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const item = await prisma.inventoryCheckItem.findUnique({
      where: { systemId: itemId },
      include: { inventoryCheck: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    if (item.inventoryCheck.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ sản phẩm trong phiếu ở trạng thái NHÁP mới có thể cập nhật',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.actualQuantity !== undefined) {
      updateData.actualQty = data.actualQuantity
      updateData.difference = data.actualQuantity - Number(item.systemQty)
    }
    if (data.notes !== undefined) updateData.notes = data.notes

    const updatedItem = await prisma.inventoryCheckItem.update({
      where: { systemId: itemId },
      data: updateData,
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${item.checkId}`)
    return { success: true, data: updatedItem }
  } catch (error) {
    logError('Error updating inventory check item', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật sản phẩm trong phiếu kiểm kê',
    }
  }
}

export async function removeInventoryCheckItemAction(
  itemId: string
): Promise<ActionResult<InventoryCheckItem>> {
  const authResult = await requireActionPermission('edit_inventory_checks')
  if (!authResult.success) return authResult

  try {
    const item = await prisma.inventoryCheckItem.findUnique({
      where: { systemId: itemId },
      include: { inventoryCheck: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    if (item.inventoryCheck.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ sản phẩm trong phiếu ở trạng thái NHÁP mới có thể xóa',
      }
    }

    const deletedItem = await prisma.inventoryCheckItem.delete({
      where: { systemId: itemId },
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${item.checkId}`)
    return { success: true, data: deletedItem }
  } catch (error) {
    logError('Error removing inventory check item', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa sản phẩm khỏi phiếu kiểm kê',
    }
  }
}

/**
 * Sync (replace) all items for an inventory check
 * Used before balance to ensure items in DB match form state
 */
export async function syncInventoryCheckItemsAction(
  checkSystemId: string,
  items: CreateInventoryCheckItemInput[]
): Promise<ActionResult<InventoryCheck>> {
  const authResult = await requireActionPermission('edit_inventory_checks')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId: checkSystemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    if (existing.status !== 'DRAFT' && existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Chỉ phiếu ở trạng thái NHÁP hoặc CHỜ DUYỆT mới có thể cập nhật sản phẩm',
      }
    }

    // Delete existing items and create new ones in a transaction
    const updatedCheck = await prisma.$transaction(async (tx) => {
      // Delete all existing items
      await tx.inventoryCheckItem.deleteMany({
        where: { checkId: checkSystemId },
      })

      // Create new items
      if (items.length > 0) {
        await tx.inventoryCheckItem.createMany({
          data: items.map(item => ({
            checkId: checkSystemId,
            productId: item.productId,
            productSystemId: item.productSystemId,
            productSku: item.productSku || '',
            productName: item.productName || '',
            unit: item.unit || 'Cái',
            systemQty: item.systemQuantity,
            actualQty: item.actualQuantity,
            difference: item.difference ?? (item.actualQuantity - item.systemQuantity),
            reason: item.reason || 'other',
            notes: item.notes,
          })),
        })
      }

      return tx.inventoryCheck.findUnique({
        where: { systemId: checkSystemId },
        include: { items: true },
      })
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${checkSystemId}`)
    return { success: true, data: updatedCheck! }
  } catch (error) {
    logError('Error syncing inventory check items', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật sản phẩm trong phiếu kiểm kê',
    }
  }
}

export async function balanceInventoryCheckAction(
  systemId: string,
  balancedBy: string
): Promise<ActionResult<InventoryCheck>> {
  const authResult = await requireActionPermission('approve_inventory_checks')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    const currentStatus = String(existing.status).toUpperCase();
    if (currentStatus !== 'DRAFT' && currentStatus !== 'PENDING') {
      return {
        success: false,
        error: `Chỉ phiếu ở trạng thái NHÁP hoặc CHỜ DUYỆT mới có thể cân bằng (hiện tại: ${existing.status})`,
      }
    }

    if (!existing.items.length) {
      return {
        success: false,
        error: 'Phiếu kiểm kê phải có ít nhất một sản phẩm',
      }
    }

    const branchId = existing.branchSystemId || existing.branchId;
    if (!branchId) {
      return { success: false, error: 'Không tìm thấy chi nhánh để cân bằng' }
    }

    // ✅ Resolve employee info for StockHistory
    let employeeSystemId: string | null = balancedBy || null;
    let employeeName = 'Hệ thống';
    
    if (balancedBy) {
      // Try to find user and their linked employee
      const user = await prisma.user.findUnique({
        where: { systemId: balancedBy },
        select: { employee: { select: { systemId: true, fullName: true, id: true } } },
      });
      if (user?.employee) {
        employeeSystemId = user.employee.systemId;
        employeeName = user.employee.fullName || user.employee.id || employeeName;
      } else {
        // Try to find employee directly
        const employee = await prisma.employee.findUnique({
          where: { systemId: balancedBy },
          select: { systemId: true, fullName: true, id: true },
        });
        if (employee) {
          employeeSystemId = employee.systemId;
          employeeName = employee.fullName || employee.id || employeeName;
        }
      }
    }

    // Filter items with differences
    const itemsToBalance = existing.items.filter(
      (item) => (item.difference || 0) !== 0 && (item.productSystemId || item.productId || item.productSku)
    );

    // ✅ Build a map to resolve correct product systemId
    // Priority: productSystemId > productId > productSku
    const productIdResolveMap = new Map<string, string>();
    
    for (const item of itemsToBalance) {
      // If item already has productSystemId (UUID), use it directly
      if (item.productSystemId) {
        productIdResolveMap.set(item.productSystemId, item.productSystemId);
        if (item.productId) productIdResolveMap.set(item.productId, item.productSystemId);
        if (item.productSku) productIdResolveMap.set(item.productSku, item.productSystemId);
      }
    }
    
    // For items without productSystemId, look up from database
    const needsLookup = itemsToBalance.filter(item => !item.productSystemId);
    if (needsLookup.length > 0) {
      const productIdsOrSkus = needsLookup
        .map(item => item.productId || item.productSku)
        .filter((id): id is string => !!id);
      
      const productsForResolve = productIdsOrSkus.length > 0 
        ? await prisma.product.findMany({
            where: {
              OR: [
                { systemId: { in: productIdsOrSkus } },
                { id: { in: productIdsOrSkus } },
              ]
            },
            select: { systemId: true, id: true },
          })
        : [];
      
      for (const p of productsForResolve) {
        productIdResolveMap.set(p.systemId, p.systemId);
        if (p.id) productIdResolveMap.set(p.id, p.systemId);
      }
    }

    const now = new Date();

    // Process all inventory updates in a single transaction
    const inventoryCheck = await prisma.$transaction(async (tx) => {
      for (const item of itemsToBalance) {
        // ✅ Resolve to actual systemId - prefer productSystemId
        const rawProductId = item.productSystemId || item.productId || item.productSku || '';
        const productId = productIdResolveMap.get(rawProductId) || rawProductId;

        // Get current inventory state
        const existingInventory = await tx.productInventory.findUnique({
          where: { productId_branchId: { productId, branchId } },
        });

        const oldStock = existingInventory ? existingInventory.onHand : 0;
        
        // ✅ Set inventory to ACTUAL COUNT, not add difference
        const targetStock = item.actualQty;
        const quantityChange = targetStock - oldStock;
        
        // Skip if no actual change needed
        if (quantityChange === 0) {
          continue;
        }

        // Update or create ProductInventory
        if (existingInventory) {
          await tx.productInventory.update({
            where: { productId_branchId: { productId, branchId } },
            data: { onHand: targetStock },
          });
        } else {
          await tx.productInventory.create({
            data: { productId, branchId, onHand: targetStock, inTransit: 0, committed: 0 },
          });
        }

        // ✅ Create StockHistory entry - use targetStock directly for accuracy
        await tx.stockHistory.create({
          data: {
            systemId: await generateIdWithPrefix('STH', tx as unknown as typeof prisma),
            productId,
            branchId,
            action: 'Cân bằng kho',
            source: 'inventory_check',
            quantityChange: quantityChange,
            newStockLevel: targetStock, // ✅ Use targetStock directly (= item.actualQty)
            documentId: existing.id,
            documentType: 'inventory_check',
            employeeId: employeeSystemId,
            employeeName: employeeName,
            note: `Cân bằng từ phiếu kiểm kê ${existing.id}. Trước: ${oldStock}, Sau: ${targetStock}`,
            createdAt: now,
          },
        });
      }

      // Update inventory check status
      return tx.inventoryCheck.update({
        where: { systemId },
        data: {
          status: 'COMPLETED',
          balancedBy,
          balancedAt: now,
          updatedAt: now,
        },
        include: { items: true },
      });
    });

    // ✅ Sync affected products to Meilisearch
    if (itemsToBalance.length > 0) {
      const productSystemIds = itemsToBalance
        .map(item => productIdResolveMap.get(item.productId || item.productSku || '') || item.productId!)
        .filter(Boolean);
      
      // Import and call syncProductsInventory
      const { syncProductsInventory } = await import('@/lib/meilisearch-sync');
      syncProductsInventory(productSystemIds).catch(err => 
        logError('[Balance Action] Meilisearch sync failed', err)
      );
    }

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${systemId}`)
    revalidatePath('/products')

    // Activity log
    const userName = employeeName || getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'inventory_check',
        entityId: systemId,
        action: `Cân bằng phiếu kiểm kê: ${existing.id || systemId}`,
        actionType: 'status',
        changes: JSON.parse(JSON.stringify({ 'Trạng thái': { from: existing.status, to: 'COMPLETED' } })),
        note: `Cân bằng ${itemsToBalance.length} SP tại ${existing.branchName || branchId}`,
        metadata: { userName, itemCount: itemsToBalance.length },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] inventory check balance failed', e))

    return { success: true, data: inventoryCheck }
  } catch (error) {
    logError('Error balancing inventory check', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cân bằng phiếu kiểm kê',
    }
  }
}

export async function cancelInventoryCheckAction(
  systemId: string
): Promise<ActionResult<InventoryCheck>> {
  const authResult = await requireActionPermission('edit_inventory_checks')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ phiếu ở trạng thái NHÁP mới có thể hủy',
      }
    }

    const inventoryCheck = await prisma.inventoryCheck.update({
      where: { systemId },
      data: { status: 'CANCELLED' },
    })

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'inventory_check',
        entityId: systemId,
        action: `Hủy phiếu kiểm kê: ${existing.id || systemId}`,
        actionType: 'status',
        changes: JSON.parse(JSON.stringify({ 'Trạng thái': { from: existing.status, to: 'CANCELLED' } })),
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] inventory check cancel failed', e))

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${systemId}`)
    return { success: true, data: inventoryCheck }
  } catch (error) {
    logError('Error cancelling inventory check', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy phiếu kiểm kê',
    }
  }
}

/**
 * Force cancel inventory check from complaint reversal
 * This action cancels ANY status inventory check (not just DRAFT)
 * Used when reverting complaint verification
 */
export async function forceCancelInventoryCheckAction(
  input: {
    systemId: string
    reason: string
    cancelledBy?: string
  }
): Promise<ActionResult<InventoryCheck>> {
  const authResult = await requireActionPermission('approve_inventory_checks')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId: input.systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    // Already cancelled? Return success
    if (existing.status === 'CANCELLED') {
      return { success: true, data: existing }
    }

    const inventoryCheck = await prisma.inventoryCheck.update({
      where: { systemId: input.systemId },
      data: { 
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy: input.cancelledBy || null,
        cancelledReason: input.reason,
        notes: existing.notes 
          ? `${existing.notes}\n[HỦY] ${input.reason}`
          : `[HỦY] ${input.reason}`,
      },
    })

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'inventory_check',
        entityId: input.systemId,
        action: `Hủy bắt buộc phiếu kiểm kê: ${existing.id || input.systemId}`,
        actionType: 'status',
        changes: JSON.parse(JSON.stringify({ 'Trạng thái': { from: existing.status, to: 'CANCELLED' } })),
        note: `Lý do: ${input.reason}`,
        metadata: { userName, reason: input.reason },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] inventory check force cancel failed', e))

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${input.systemId}`)
    return { success: true, data: inventoryCheck }
  } catch (error) {
    logError('Error force cancelling inventory check', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy bắt buộc phiếu kiểm kê',
    }
  }
}
