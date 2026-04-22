'use server'

/**
 * Server Actions for Supplier Warranty Management (BH Nhà cung cấp)
 * 
 * Schema: SupplierWarranty, SupplierWarrantyItem
 * Status: DRAFT → APPROVED → PACKED → EXPORTED → DELIVERED → CONFIRMED → COMPLETED / CANCELLED
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateNextIds } from '@/lib/id-system'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { requireActionPermission, serializeDecimals } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createSupplierWarrantySchema, updateSupplierWarrantySchema, confirmSupplierWarrantySchema, completeSupplierWarrantySchema, approveSupplierWarrantySchema, packSupplierWarrantySchema, cancelPackSupplierWarrantySchema, exportSupplierWarrantySchema, deliverSupplierWarrantySchema, createWarrantyReceiptSchema } from '@/features/supplier-warranty/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'
import type { Prisma, DeliveryMethod } from '@/generated/prisma/client'

// ============================================
// CREATE
// ============================================
export async function createSupplierWarrantyAction(
  input: unknown
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('create_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    const parsed = createSupplierWarrantySchema.parse(input)
    const { session } = authResult

    const { systemId, businessId } = await generateNextIds('supplier-warranty')

    // Pre-generate item IDs
    const itemIds: string[] = []
    for (const _item of parsed.items) {
      itemIds.push(await generateIdWithPrefix('SWITEM'))
    }

    // Determine if we should auto-pack (delivery method selected at creation)
    const shouldAutoPack = parsed.deliveryMethod && parsed.deliveryMethod !== 'deliver-later'

    // Map delivery method → Packaging DeliveryMethod enum
    const deliveryMethodMap: Record<string, DeliveryMethod> = {
      'shipping-partner': 'SHIPPING',
      'external': 'SHIPPING',
      'pickup': 'IN_STORE_PICKUP',
      'in-store': 'IN_STORE_PICKUP',
    }

    const userName = await getSessionUserName(authResult.session)

    if (shouldAutoPack) {
      // Auto: DRAFT → APPROVED → PACKED + create Packaging
      const packagingId = await generateIdWithPrefix('WDGM')
      const packagingDeliveryMethod = parsed.deliveryMethod
        ? deliveryMethodMap[parsed.deliveryMethod] || null
        : null
      const trackingCode = parsed.trackingNumber
        || (packagingDeliveryMethod === 'IN_STORE_PICKUP' ? `INSTORE-${packagingId}` : null)
      const now = new Date()

      // Pre-generate shipment ID outside transaction if needed
      let shipmentId: string | undefined
      if (trackingCode) {
        shipmentId = await generateIdWithPrefix('SHIP')
      }

      const warranty = await prisma.$transaction(async (tx) => {
        // 1. Create warranty (unchecked: raw supplierSystemId instead of relation)
        const w = await tx.supplierWarranty.create({
          data: {
            systemId,
            id: businessId,
            supplierSystemId: parsed.supplierSystemId,
            supplierName: parsed.supplierName,
            branchSystemId: parsed.branchSystemId || null,
            branchName: parsed.branchName || null,
            reason: parsed.reason,
            notes: parsed.notes || null,
            assignedToSystemId: parsed.assignedToSystemId || null,
            assignedToName: parsed.assignedToName || null,
            createdBySystemId: session.user.id,
            createdByName: session.user.name || null,
            status: 'PACKED',
            approvedAt: now,
            packedAt: now,
            deliveryMethod: parsed.deliveryMethod || null,
            trackingNumber: trackingCode,
            sentDate: parsed.sentDate ? new Date(parsed.sentDate) : null,
            items: {
              create: parsed.items.map((item, index) => ({
                systemId: itemIds[index],
                productSystemId: item.productSystemId,
                productId: item.productId,
                productName: item.productName,
                productImage: item.productImage || null,
                sentQuantity: item.sentQuantity,
                unitPrice: item.unitPrice,
                itemNote: item.itemNote || null,
              })),
            },
          },
        })

        // 2. Create Packaging
        await tx.packaging.create({
          data: {
            systemId: packagingId,
            id: packagingId,
            warrantyId: systemId,
            branchId: parsed.branchSystemId || '',
            status: 'COMPLETED',
            deliveryMethod: packagingDeliveryMethod,
            deliveryStatus: 'PACKED',
            trackingCode,
            confirmDate: now,
            createdBy: userName,
            requestingEmployeeName: userName,
            confirmingEmployeeName: userName,
            sourceType: 'WARRANTY',
          },
        })

        // 3. Create Shipment (so warranty appears in shipment management)
        if (trackingCode && shipmentId) {
          await tx.shipment.create({
            data: {
              systemId: shipmentId,
              id: shipmentId,
              orderId: null,
              warrantyId: systemId,
              packagingSystemId: packagingId,
              trackingCode,
              trackingNumber: trackingCode,
              carrier: packagingDeliveryMethod === 'IN_STORE_PICKUP' ? 'IN_STORE_PICKUP' : 'OTHER',
              status: 'PENDING',
              deliveryStatus: 'Chờ lấy hàng',
              recipientName: parsed.supplierName,
              createdBy: userName,
            },
          })
        }

        return w
      })

      prisma.activityLog.create({
        data: {
          entityType: 'SupplierWarranty',
          entityId: warranty.systemId,
          action: 'CREATE',
          note: `Tạo phiếu BH NCC ${warranty.id} — tự động đóng gói${trackingCode ? ` — MVĐ: ${trackingCode}` : ''}`,
          changes: { supplier: parsed.supplierName, reason: parsed.reason } as unknown as Prisma.InputJsonValue,
          createdBy: userName,
        },
      }).catch(e => logError('Activity log failed', e))

      revalidatePath('/supplier-warranties')
      return { success: true, data: serializeDecimals(warranty) }
    }

    // Standard: create as DRAFT (deliver-later or no method)
    const warranty = await prisma.supplierWarranty.create({
      data: {
        systemId,
        id: businessId,
        supplierSystemId: parsed.supplierSystemId,
        supplierName: parsed.supplierName,
        branchSystemId: parsed.branchSystemId || null,
        branchName: parsed.branchName || null,
        reason: parsed.reason,
        notes: parsed.notes || null,
        assignedToSystemId: parsed.assignedToSystemId || null,
        assignedToName: parsed.assignedToName || null,
        createdBySystemId: session.user.id,
        createdByName: session.user.name || null,
        status: 'DRAFT' as const,
        deliveryMethod: parsed.deliveryMethod || null,
        trackingNumber: parsed.trackingNumber || null,
        sentDate: parsed.sentDate ? new Date(parsed.sentDate) : null,
        items: {
          create: parsed.items.map((item, index) => ({
            systemId: itemIds[index],
            productSystemId: item.productSystemId,
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage || null,
            sentQuantity: item.sentQuantity,
            unitPrice: item.unitPrice,
            itemNote: item.itemNote || null,
          })),
        },
      },
    })

    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: warranty.systemId,
        action: 'CREATE',
        note: `Tạo phiếu BH NCC ${warranty.id}`,
        changes: { supplier: parsed.supplierName, reason: parsed.reason } as unknown as Prisma.InputJsonValue,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    return { success: true, data: serializeDecimals(warranty) }
  } catch (error) {
    logError('Error creating supplier warranty', error)
    return { success: false, error: error instanceof Error ? error.message : 'Không thể tạo phiếu BH NCC' }
  }
}

// ============================================
// UPDATE (only DRAFT)
// ============================================
export async function updateSupplierWarrantyAction(
  systemId: string,
  input: unknown
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('edit_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    const parsed = updateSupplierWarrantySchema.parse(input)

    const existing = await prisma.supplierWarranty.findUnique({ where: { systemId }, include: { items: true } })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    if (!['DRAFT', 'APPROVED'].includes(existing.status)) return { success: false, error: 'Chỉ có thể sửa phiếu ở trạng thái Nháp hoặc Đã duyệt' }

    // Pre-generate item IDs if items are being replaced
    const itemIds: string[] = []
    if (parsed.items && parsed.items.length > 0) {
      for (const _item of parsed.items) {
        itemIds.push(await generateIdWithPrefix('SWITEM'))
      }
    }

    // Nested write: updates warranty + replaces items atomically
    const warranty = await prisma.supplierWarranty.update({
      where: { systemId },
      data: {
        ...(parsed.supplierSystemId && { supplierSystemId: parsed.supplierSystemId }),
        ...(parsed.supplierName && { supplierName: parsed.supplierName }),
        ...(parsed.branchSystemId !== undefined && { branchSystemId: parsed.branchSystemId || null }),
        ...(parsed.branchName !== undefined && { branchName: parsed.branchName || null }),
        ...(parsed.reason && { reason: parsed.reason }),
        ...(parsed.notes !== undefined && { notes: parsed.notes || null }),
        ...(parsed.assignedToSystemId !== undefined && { assignedToSystemId: parsed.assignedToSystemId || null }),
        ...(parsed.assignedToName !== undefined && { assignedToName: parsed.assignedToName || null }),
        ...(parsed.deliveryMethod !== undefined && { deliveryMethod: parsed.deliveryMethod || null }),
        ...(parsed.trackingNumber !== undefined && { trackingNumber: parsed.trackingNumber || null }),
        ...(parsed.sentDate !== undefined && { sentDate: parsed.sentDate ? new Date(parsed.sentDate) : null }),
        ...('subtasks' in parsed && { subtasks: (parsed as Record<string, unknown>).subtasks ?? undefined }),
        ...(parsed.items && parsed.items.length > 0 && {
          items: {
            deleteMany: {},
            create: parsed.items.map((item, index) => ({
              systemId: itemIds[index],
              productSystemId: item.productSystemId,
              productId: item.productId,
              productName: item.productName,
              productImage: item.productImage || null,
              sentQuantity: item.sentQuantity,
              unitPrice: item.unitPrice,
              itemNote: item.itemNote || null,
            })),
          },
        }),
      },
    })

    const userName = await getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'UPDATE',
        note: `Cập nhật phiếu BH NCC ${warranty.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    return { success: true, data: serializeDecimals(warranty) }
  } catch (error) {
    logError('Error updating supplier warranty', error)
    return { success: false, error: error instanceof Error ? error.message : 'Không thể cập nhật phiếu BH NCC' }
  }
}

// ============================================
// DELETE (only DRAFT)
// ============================================
export async function deleteSupplierWarrantyAction(
  systemId: string
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('delete_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.supplierWarranty.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    if (existing.status !== 'DRAFT') return { success: false, error: 'Chỉ có thể xóa phiếu ở trạng thái Nháp' }

    // Cascade delete: items auto-deleted via onDelete: Cascade
    await prisma.supplierWarranty.delete({ where: { systemId } })

    const userName = await getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'DELETE',
        note: `Xóa phiếu BH NCC ${existing.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    return { success: true, data: null }
  } catch (error) {
    logError('Error deleting supplier warranty', error)
    return { success: false, error: 'Không thể xóa phiếu BH NCC' }
  }
}

// ============================================
// CONFIRM (SENT → CONFIRMED)
// Xác nhận kết quả BH: SP nào được BH, trừ tiền, SP nào trả lại
// ============================================
export async function confirmSupplierWarrantyAction(
  systemId: string,
  input: unknown
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('confirm_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    const parsed = confirmSupplierWarrantySchema.parse(input)
    const { session } = authResult

    const existing = await prisma.supplierWarranty.findUnique({
      where: { systemId },
      include: { items: true },
    })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    if (!['SENT', 'DELIVERED'].includes(existing.status)) return { success: false, error: 'Chỉ có thể xác nhận phiếu đã giao thành công' }

    const warranty = await (async () => {
      let totalWarrantyCost = 0
      let totalReturnedItems = 0

      // Validate all items first
      for (const confirmItem of parsed.items) {
        const existingItem = existing.items.find(i => i.systemId === confirmItem.systemId)
        if (!existingItem) continue

        if (confirmItem.approvedQuantity + confirmItem.returnedQuantity > existingItem.sentQuantity) {
          throw new Error(`SL xác nhận vượt quá SL gửi cho SP ${existingItem.productName}`)
        }

        totalWarrantyCost += confirmItem.warrantyCost
        totalReturnedItems += confirmItem.returnedQuantity
      }

      // Build batch transaction operations (array form — avoids interactive tx proxy)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const operations: any[] = [
        // Update each item
        ...parsed.items
          .filter(item => existing.items.some(i => i.systemId === item.systemId))
          .map(item =>
            prisma.supplierWarrantyItem.update({
              where: { systemId: item.systemId },
              data: {
                approvedQuantity: item.approvedQuantity,
                returnedQuantity: item.returnedQuantity,
                warrantyCost: item.warrantyCost,
                warrantyResult: item.warrantyResult || null,
              },
            })
          ),
        // Update warranty header
        prisma.supplierWarranty.update({
          where: { systemId },
          data: {
            status: 'CONFIRMED',
            confirmedBySystemId: session.user.id,
            confirmedByName: session.user.name || null,
            confirmedAt: new Date(),
            totalWarrantyCost,
            totalReturnedItems,
            confirmNotes: parsed.confirmNotes || null,
          },
          include: { items: true },
        }),
      ]

      // Create receipt (phiếu thu) moved to detail page — createWarrantyReceiptAction

      const results = await prisma.$transaction(operations)
      // The warranty update is the last item before optional payment
      const headerIndex = parsed.items.filter(item => existing.items.some(i => i.systemId === item.systemId)).length
      return results[headerIndex]
    })()

    const userName = await getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'CONFIRM',
        note: `Xác nhận BH NCC ${warranty.id} - BH: ${Number(warranty.totalWarrantyCost).toLocaleString()}đ, Trả: ${warranty.totalReturnedItems} SP`,
        changes: {
          totalWarrantyCost: Number(warranty.totalWarrantyCost),
          totalReturnedItems: warranty.totalReturnedItems,
          confirmedBy: session.user.name,
        } as unknown as Prisma.InputJsonValue,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    revalidatePath('/receipts')
    return { success: true, data: serializeDecimals(warranty) }
  } catch (error) {
    logError('Error confirming supplier warranty', error)
    return { success: false, error: error instanceof Error ? error.message : 'Không thể xác nhận phiếu BH NCC' }
  }
}

// ============================================
// CANCEL (DRAFT/SENT → CANCELLED)
// ============================================
export async function cancelSupplierWarrantyAction(
  systemId: string
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('edit_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    const existing = await prisma.supplierWarranty.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    if (!['DRAFT', 'APPROVED', 'PACKED', 'SENT'].includes(existing.status)) {
      return { success: false, error: 'Chỉ có thể hủy phiếu trước khi xuất kho' }
    }

    const warranty = await prisma.supplierWarranty.update({
      where: { systemId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    })

    const userName = await getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'CANCEL',
        note: `Hủy phiếu BH NCC ${warranty.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    return { success: true, data: serializeDecimals(warranty) }
  } catch (error) {
    logError('Error cancelling supplier warranty', error)
    return { success: false, error: 'Không thể hủy phiếu BH NCC' }
  }
}

// ============================================
// COMPLETE (CONFIRMED → COMPLETED)
// Hoàn thành phiếu BH (SP đã nhận lại)
// ============================================
export async function completeSupplierWarrantyAction(
  systemId: string,
  input: unknown
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('confirm_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    const parsed = completeSupplierWarrantySchema.parse(input)
    const { session } = authResult

    const existing = await prisma.supplierWarranty.findUnique({
      where: { systemId },
      include: { items: true },
    })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    if (existing.status !== 'CONFIRMED') return { success: false, error: 'Chỉ có thể hoàn thành phiếu đã xác nhận' }

    const warranty = await prisma.supplierWarranty.update({
      where: { systemId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      include: { items: true },
    })

    const userName = await getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'COMPLETE',
        note: `Hoàn thành BH NCC ${warranty.id}${parsed.completionNotes ? ` - ${parsed.completionNotes}` : ''}`,
        changes: {
          completedBy: session.user.name,
        } as unknown as Prisma.InputJsonValue,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    return { success: true, data: serializeDecimals(warranty) }
  } catch (error) {
    logError('Error completing supplier warranty', error)
    return { success: false, error: error instanceof Error ? error.message : 'Không thể hoàn thành phiếu BH NCC' }
  }
}

// ============================================
// APPROVE (DRAFT → APPROVED)
// ============================================
export async function approveSupplierWarrantyAction(
  systemId: string,
  input: unknown
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('confirm_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    approveSupplierWarrantySchema.parse(input)
    const { session } = authResult

    const existing = await prisma.supplierWarranty.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    if (existing.status !== 'DRAFT') return { success: false, error: 'Chỉ có thể duyệt phiếu ở trạng thái Nháp' }

    const warranty = await prisma.supplierWarranty.update({
      where: { systemId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBySystemId: session.user.id,
        approvedByName: session.user.name || null,
      },
    })

    const userName = await getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'APPROVE',
        note: `Duyệt phiếu BH NCC ${warranty.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    return { success: true, data: serializeDecimals(warranty) }
  } catch (error) {
    logError('Error approving supplier warranty', error)
    return { success: false, error: error instanceof Error ? error.message : 'Không thể duyệt phiếu BH NCC' }
  }
}

// ============================================
// PACK (APPROVED/PACKED → PACKED) — creates Packaging entry
// ============================================
export async function packSupplierWarrantyAction(
  systemId: string,
  input: unknown
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('edit_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    const parsed = packSupplierWarrantySchema.parse(input)

    const existing = await prisma.supplierWarranty.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    // Only allow pack from APPROVED (single packaging per warranty)
    if (existing.status !== 'APPROVED') return { success: false, error: 'Chỉ có thể đóng gói phiếu đã duyệt' }

    const userName = await getSessionUserName(authResult.session)

    // Map warranty delivery method string → Packaging DeliveryMethod enum
    const deliveryMethodMap: Record<string, DeliveryMethod> = {
      'shipping-partner': 'SHIPPING',
      'external': 'SHIPPING',
      'pickup': 'IN_STORE_PICKUP',
      'in-store': 'IN_STORE_PICKUP',
      'deliver-later': 'PICKUP',
    }
    const packagingDeliveryMethod = parsed.deliveryMethod
      ? deliveryMethodMap[parsed.deliveryMethod] || null
      : null

    // Create Packaging entry + Shipment + move warranty to PACKED atomically
    const packagingId = await generateIdWithPrefix('WDGM')
    // Auto-generate tracking code for in-store pickup (like orders: INSTORE-{id})
    const trackingCode = parsed.trackingNumber
      || (packagingDeliveryMethod === 'IN_STORE_PICKUP' ? `INSTORE-${packagingId}` : null)

    // Pre-generate shipment ID outside transaction if needed
    let shipmentId: string | undefined
    if (trackingCode) {
      shipmentId = await generateIdWithPrefix('SHIP')
    }

    const warranty = await prisma.$transaction(async (tx) => {
      // 1. Update warranty status
      const w = await tx.supplierWarranty.update({
        where: { systemId },
        data: {
          status: 'PACKED',
          packedAt: existing.packedAt || new Date(),
          ...(trackingCode && { trackingNumber: trackingCode }),
          ...(parsed.deliveryMethod && { deliveryMethod: parsed.deliveryMethod }),
        },
        include: { items: true, packagings: { orderBy: { createdAt: 'desc' } } },
      })

      // 2. Create Packaging
      await tx.packaging.create({
        data: {
          systemId: packagingId,
          id: packagingId,
          warrantyId: systemId,
          branchId: existing.branchSystemId || '',
          status: 'COMPLETED',
          deliveryMethod: packagingDeliveryMethod,
          deliveryStatus: 'PACKED',
          trackingCode,
          confirmDate: new Date(),
          createdBy: userName,
          requestingEmployeeName: userName,
          confirmingEmployeeName: userName,
          sourceType: 'WARRANTY',
          ...(parsed.shippingFee != null && { shippingFeeToPartner: parsed.shippingFee }),
          ...(parsed.payer && { payer: parsed.payer }),
          ...(parsed.carrier && { carrier: parsed.carrier }),
        },
      })

      // 3. Create Shipment (so warranty appears in shipment management)
      if (trackingCode && shipmentId) {
        await tx.shipment.create({
          data: {
            systemId: shipmentId,
            id: shipmentId,
            orderId: null,
            warrantyId: systemId,
            packagingSystemId: packagingId,
            trackingCode,
            trackingNumber: trackingCode,
            carrier: parsed.carrier || (packagingDeliveryMethod === 'IN_STORE_PICKUP' ? 'IN_STORE_PICKUP' : 'OTHER'),
            status: 'PENDING',
            deliveryStatus: 'Chờ lấy hàng',
            recipientName: existing.supplierName,
            createdBy: userName,
          },
        })
      }

      return w
    })

    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'PACK',
        note: `Đóng gói phiếu BH NCC ${warranty.id}${trackingCode ? ` — MVĐ: ${trackingCode}` : ''}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    return { success: true, data: serializeDecimals(warranty) }
  } catch (error) {
    logError('Error packing supplier warranty', error)
    return { success: false, error: error instanceof Error ? error.message : 'Không thể đóng gói phiếu BH NCC' }
  }
}

// ============================================
// CANCEL PACK (PACKED → APPROVED) — cancels ALL active packagings
// ============================================
export async function cancelPackSupplierWarrantyAction(
  systemId: string,
  input: unknown
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('edit_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    const parsed = cancelPackSupplierWarrantySchema.parse(input)

    const existing = await prisma.supplierWarranty.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    if (existing.status !== 'PACKED') return { success: false, error: 'Chỉ có thể hủy đóng gói phiếu đang ở trạng thái đã đóng gói' }

    // ── Cancel GHTK shipment if applicable ──
    const activePackagings = await prisma.packaging.findMany({
      where: { warrantyId: systemId, status: { not: 'CANCELLED' } },
      select: { systemId: true, carrier: true, trackingCode: true },
    })

    for (const pkg of activePackagings) {
      if (pkg.carrier === 'GHTK' && pkg.trackingCode) {
        try {
          const { loadGHTKConfig, GHTK_API_BASE } = await import('@/lib/ghtk-sync')
          const ghtkConfig = await loadGHTKConfig()
          if (ghtkConfig) {
            const cancelUrl = `${GHTK_API_BASE}/services/shipment/cancel/${pkg.trackingCode}`
            const resp = await fetch(cancelUrl, {
              method: 'POST',
              headers: {
                'Token': ghtkConfig.apiToken,
                'X-Client-Source': ghtkConfig.partnerCode || '',
                'Content-Type': 'application/json',
              },
            })
            const data = await resp.json().catch(() => ({}))
            if (!resp.ok || !data.success) {
              logError(`[GHTK Cancel] Failed for warranty ${systemId}`, data.message || resp.status)
              // Continue — still cancel locally even if GHTK API fails
            }
          }
        } catch (e) {
          logError(`[GHTK Cancel] Error for warranty ${systemId}`, e)
        }
      }
    }

    // Cancel warranty + all active packagings + shipments atomically
    const [warranty] = await prisma.$transaction([
      prisma.supplierWarranty.update({
        where: { systemId },
        data: {
          status: 'APPROVED',
          packedAt: null,
          trackingNumber: null,
          deliveryMethod: null,
        },
        include: { items: true, packagings: { orderBy: { createdAt: 'desc' } } },
      }),
      prisma.packaging.updateMany({
        where: { warrantyId: systemId, status: { not: 'CANCELLED' } },
        data: {
          status: 'CANCELLED',
          cancelReason: parsed.reason || null,
          cancelDate: new Date(),
          deliveryStatus: 'CANCELLED',
          ghtkStatusId: -1,
          partnerStatus: 'Đã hủy',
        },
      }),
      prisma.shipment.updateMany({
        where: { warrantyId: systemId, status: { not: 'CANCELLED' } },
        data: { status: 'CANCELLED' },
      }),
    ])

    const userName = await getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'CANCEL_PACK',
        note: `Hủy đóng gói phiếu BH NCC ${warranty.id}${parsed.reason ? `. Lý do: ${parsed.reason}` : ''}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    return { success: true, data: serializeDecimals(warranty) }
  } catch (error) {
    logError('Error cancelling pack supplier warranty', error)
    return { success: false, error: error instanceof Error ? error.message : 'Không thể hủy đóng gói phiếu BH NCC' }
  }
}

// ============================================
// EXPORT (PACKED → EXPORTED) — also marks active packagings exported
// ============================================
export async function exportSupplierWarrantyAction(
  systemId: string,
  input: unknown
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('edit_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    const parsed = exportSupplierWarrantySchema.parse(input)

    const existing = await prisma.supplierWarranty.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    if (existing.status !== 'PACKED') return { success: false, error: 'Chỉ có thể xuất kho phiếu đã đóng gói' }

    const [warranty] = await prisma.$transaction([
      prisma.supplierWarranty.update({
        where: { systemId },
        data: {
          status: 'EXPORTED',
          exportedAt: new Date(),
          sentDate: new Date(),
          ...(parsed.trackingNumber && { trackingNumber: parsed.trackingNumber }),
        },
        include: { items: true, packagings: { orderBy: { createdAt: 'desc' } } },
      }),
      // Mark all active packagings as exported
      prisma.packaging.updateMany({
        where: { warrantyId: systemId, status: { not: 'CANCELLED' }, deliveryStatus: { not: null } },
        data: { deliveryStatus: 'SHIPPING' },
      }),
    ])

    const userName = await getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'EXPORT',
        note: `Xuất kho phiếu BH NCC ${warranty.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    return { success: true, data: serializeDecimals(warranty) }
  } catch (error) {
    logError('Error exporting supplier warranty', error)
    return { success: false, error: error instanceof Error ? error.message : 'Không thể xuất kho phiếu BH NCC' }
  }
}

// ============================================
// DELIVER (EXPORTED → DELIVERED) — also marks active packagings delivered
// ============================================
export async function deliverSupplierWarrantyAction(
  systemId: string,
  input: unknown
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('edit_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    deliverSupplierWarrantySchema.parse(input)

    const existing = await prisma.supplierWarranty.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    if (existing.status !== 'EXPORTED') return { success: false, error: 'Chỉ có thể xác nhận giao hàng cho phiếu đã xuất kho' }

    const [warranty] = await prisma.$transaction([
      prisma.supplierWarranty.update({
        where: { systemId },
        data: {
          status: 'DELIVERED',
          deliveredAt: new Date(),
        },
        include: { items: true, packagings: { orderBy: { createdAt: 'desc' } } },
      }),
      // Mark all active packagings as delivered
      prisma.packaging.updateMany({
        where: { warrantyId: systemId, status: { not: 'CANCELLED' }, deliveryStatus: { not: null } },
        data: { deliveryStatus: 'DELIVERED', deliveredDate: new Date() },
      }),
    ])

    const userName = await getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'DELIVER',
        note: `Giao hàng thành công phiếu BH NCC ${warranty.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    return { success: true, data: serializeDecimals(warranty) }
  } catch (error) {
    logError('Error delivering supplier warranty', error)
    return { success: false, error: error instanceof Error ? error.message : 'Không thể xác nhận giao hàng phiếu BH NCC' }
  }
}

// ============================================
// CREATE RECEIPT (tạo phiếu thu từ detail page)
// ============================================
export async function createWarrantyReceiptAction(
  systemId: string,
  input: unknown
): Promise<ActionResult<unknown>> {
  const authResult = await requireActionPermission('confirm_supplier_warranty')
  if (!authResult.success) return authResult

  try {
    const parsed = createWarrantyReceiptSchema.parse(input)

    const existing = await prisma.supplierWarranty.findUnique({
      where: { systemId },
    })
    if (!existing || existing.isDeleted) return { success: false, error: 'Phiếu BH không tồn tại' }
    if (!['CONFIRMED', 'COMPLETED'].includes(existing.status)) {
      return { success: false, error: 'Phiếu BH chưa được xác nhận' }
    }
    if (Number(existing.totalWarrantyCost) <= 0) {
      return { success: false, error: 'Không có khoản trừ tiền nào' }
    }

    // Check if receipt already exists
    const existingReceipt = await prisma.receipt.findFirst({
      where: { linkedWarrantySystemId: systemId, status: { not: 'cancelled' } },
    })
    if (existingReceipt) {
      return { success: false, error: 'Phiếu thu đã được tạo trước đó' }
    }

    const receiptIds = await generateNextIds('receipts')
    const userName = await getSessionUserName(authResult.session)

    // Lookup branch name if warranty has branchSystemId but missing branchName
    let branchName = existing.branchName || ''
    if (existing.branchSystemId && !branchName) {
      const branch = await prisma.branch.findFirst({
        where: { systemId: existing.branchSystemId, isDeleted: false },
        select: { name: true },
      })
      branchName = branch?.name || ''
    }

    const receipt = await prisma.receipt.create({
      data: {
        systemId: receiptIds.systemId,
        id: receiptIds.businessId,
        type: 'OTHER_INCOME',
        branchId: existing.branchSystemId || '',
        branchSystemId: existing.branchSystemId || '',
        branchName,
        amount: existing.totalWarrantyCost,
        description: `Thu tiền BH NCC - ${existing.id} - ${existing.supplierName}`,
        category: 'supplier_warranty',
        payerSystemId: existing.supplierSystemId,
        payerName: existing.supplierName,
        payerTypeName: 'Nhà cung cấp',
        paymentReceiptTypeName: 'Thu tiền bảo hành NCC',
        paymentMethodName: 'Tiền mặt',
        accountSystemId: parsed.accountSystemId || null,
        createdBy: userName,
        linkedWarrantySystemId: systemId,
      },
    })

    prisma.activityLog.create({
      data: {
        entityType: 'SupplierWarranty',
        entityId: systemId,
        action: 'CREATE_RECEIPT',
        note: `Tạo phiếu thu ${receipt.id} - ${Number(existing.totalWarrantyCost).toLocaleString()}đ`,
        changes: {
          receiptId: receipt.id,
          amount: Number(existing.totalWarrantyCost),
        } as unknown as Prisma.InputJsonValue,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/supplier-warranties')
    revalidatePath('/receipts')
    return { success: true, data: serializeDecimals(receipt) }
  } catch (error) {
    logError('Error creating warranty receipt', error)
    return { success: false, error: error instanceof Error ? error.message : 'Không thể tạo phiếu thu' }
  }
}
