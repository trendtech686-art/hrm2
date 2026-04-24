import { prisma } from '@/lib/prisma'

// Treats null, undefined, "", [], {} as equivalent "empty"
function isEmptyValue(val: unknown): boolean {
  if (val == null) return true
  if (typeof val === 'string' && val.trim() === '') return true
  if (Array.isArray(val) && val.length === 0) return true
  if (typeof val === 'object' && val !== null && !('toNumber' in val) && !(val instanceof Date) && Object.keys(val).length === 0) return true
  return false
}

// Normalizes empty-ish values to a canonical form for comparison
function normalizeValue(val: unknown): unknown {
  if (val == null) return null
  if (typeof val === 'string' && val.trim() === '') return null
  if (Array.isArray(val) && val.length === 0) return null
  if (typeof val === 'object' && val !== null && !('toNumber' in val) && !(val instanceof Date) && Object.keys(val).length === 0) return null

  if (typeof val === 'object' && val !== null && 'toNumber' in val) {
    return (val as { toNumber: () => number }).toNumber()
  }

  if (val instanceof Date) {
    return val.getTime()
  }

  return val
}

// Helper to compare values for change detection
function hasValueChanged(oldVal: unknown, newVal: unknown): boolean {
  const normalizedOld = normalizeValue(oldVal)
  const normalizedNew = normalizeValue(newVal)

  if (normalizedOld == null && normalizedNew == null) return false
  if (normalizedOld === 0 && normalizedNew === 0) return false
  if ((normalizedOld == null && normalizedNew === 0) || (normalizedOld === 0 && normalizedNew == null)) return false
  if (normalizedOld == null || normalizedNew == null) return true

  if (typeof normalizedOld === 'number' && typeof normalizedNew === 'number') {
    return normalizedOld !== normalizedNew
  }

  if (typeof normalizedOld === 'object' && typeof normalizedNew === 'object') {
    return JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew)
  }

  return normalizedOld !== normalizedNew
}

// Serialize a value for storage in the activity log
function serializeValue(val: unknown): unknown {
  if (val == null) return null
  if (typeof val === 'object' && val !== null && 'toNumber' in val) {
    return (val as { toNumber: () => number }).toNumber()
  }
  if (val instanceof Date) {
    return val.getTime()
  }
  if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
    return JSON.parse(JSON.stringify(val))
  }
  return val
}

// Helper to compute changes between old and new data
function computeChanges(
  existing: Record<string, unknown>,
  updateData: Record<string, unknown>
): Record<string, { from: unknown; to: unknown }> | null {
  const changes: Record<string, { from: unknown; to: unknown }> = {}

  const ignoreFields = ['updatedAt', 'updatedBy']

  for (const [key, newValue] of Object.entries(updateData)) {
    if (ignoreFields.includes(key)) continue

    const oldValue = existing[key]
    if (hasValueChanged(oldValue, newValue)) {
      changes[key] = { from: serializeValue(oldValue), to: serializeValue(newValue) }
    }
  }

  return Object.keys(changes).length > 0 ? changes : null
}
import { Prisma, PurchaseOrderStatus } from '@/generated/prisma/client'
import { validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { updatePurchaseOrderSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// Interface for purchase order item input
interface PurchaseOrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total?: number;
}

// Helper to serialize Decimal fields for client
function serializePurchaseOrder<T extends { 
  subtotal?: Prisma.Decimal | number | null;
  discount?: Prisma.Decimal | number | null;
  tax?: Prisma.Decimal | number | null;
  total?: Prisma.Decimal | number | null;
  paid?: Prisma.Decimal | number | null;
  debt?: Prisma.Decimal | number | null;
  shippingFee?: Prisma.Decimal | number | null;
  items?: { unitPrice?: Prisma.Decimal | number | null; discount?: Prisma.Decimal | number | null; total?: Prisma.Decimal | number | null }[];
}>(order: T) {
  return {
    ...order,
    subtotal: order.subtotal !== null && order.subtotal !== undefined ? Number(order.subtotal) : 0,
    discount: order.discount !== null && order.discount !== undefined ? Number(order.discount) : 0,
    tax: order.tax !== null && order.tax !== undefined ? Number(order.tax) : 0,
    total: order.total !== null && order.total !== undefined ? Number(order.total) : 0,
    grandTotal: order.total !== null && order.total !== undefined ? Number(order.total) : 0,
    paid: order.paid !== null && order.paid !== undefined ? Number(order.paid) : 0,
    debt: order.debt !== null && order.debt !== undefined ? Number(order.debt) : 0,
    shippingFee: order.shippingFee !== null && order.shippingFee !== undefined ? Number(order.shippingFee) : 0,
    items: order.items?.map(item => ({
      ...item,
      unitPrice: item.unitPrice !== null && item.unitPrice !== undefined ? Number(item.unitPrice) : 0,
      discount: item.discount !== null && item.discount !== undefined ? Number(item.discount) : 0,
      total: item.total !== null && item.total !== undefined ? Number(item.total) : 0,
    })),
  };
}

// Map Vietnamese status to Prisma enum
function mapStatusToPrismaEnum(status?: string): PurchaseOrderStatus | undefined {
  if (!status) return undefined;
  
  const statusMap: Record<string, PurchaseOrderStatus> = {
    // Vietnamese names
    'Đặt hàng': 'PENDING',
    'Đang giao dịch': 'CONFIRMED',
    'Hoàn thành': 'COMPLETED',
    'Đã hủy': 'CANCELLED',
    'Kết thúc': 'COMPLETED',
    'Đã trả hàng': 'CANCELLED',
    // English names (already valid)
    'DRAFT': 'DRAFT',
    'PENDING': 'PENDING',
    'CONFIRMED': 'CONFIRMED',
    'RECEIVING': 'RECEIVING',
    'COMPLETED': 'COMPLETED',
    'CANCELLED': 'CANCELLED',
    // Lowercase English (from frontend)
    'draft': 'DRAFT',
    'pending': 'PENDING',
    'confirmed': 'CONFIRMED',
    'receiving': 'RECEIVING',
    'completed': 'COMPLETED',
    'cancelled': 'CANCELLED',
  };
  
  return statusMap[status];
}

// GET /api/purchase-orders/[systemId]
export const GET = apiHandler(async (_request, { session: _session, params }) => {
  try {
    const { systemId } = params

    // ⚡ OPTIMIZED: Fetch PO with all related financial data in parallel
    const [order, payments, financialReceipts, inventoryReceipts, purchaseReturns] = await Promise.all([
      prisma.purchaseOrder.findFirst({
        where: {
          OR: [{ systemId }, { id: systemId }],
          isDeleted: false,
        },
        include: {
          supplier: {
            select: {
              systemId: true,
              id: true,
              name: true,
              phone: true,
              email: true,
              address: true,
              bankAccount: true,
              bankName: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  systemId: true,
                  id: true,
                  name: true,
                  imageUrl: true,
                  unit: true,
                  productTypeSystemId: true,
                },
              },
            },
          },
        },
      }),
      // Fetch payments for this PO
      prisma.payment.findMany({
        where: {
          OR: [
            { purchaseOrderSystemId: systemId },
            { purchaseOrderId: systemId },
          ],
          status: { not: 'cancelled' },
        },
        orderBy: { createdAt: 'desc' },
      }),
      // Fetch financial receipts for this PO
      prisma.receipt.findMany({
        where: {
          OR: [
            { purchaseOrderSystemId: systemId },
            { purchaseOrderId: systemId },
          ],
          status: { not: 'cancelled' },
        },
        orderBy: { createdAt: 'desc' },
      }),
      // Fetch inventory receipts for this PO
      prisma.inventoryReceipt.findMany({
        where: {
          purchaseOrderSystemId: systemId,
          status: { not: 'CANCELLED' },
        },
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      // Fetch purchase returns for this PO
      prisma.purchaseReturn.findMany({
        where: {
          purchaseOrderSystemId: systemId,
          status: { not: 'CANCELLED' },
        },
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (!order) {
      return apiError('Đơn mua hàng không tồn tại', 404)
    }

    // ⚡ Lookup products for inventoryReceipts and purchaseReturns items
    const irProductIds = inventoryReceipts.flatMap(ir => ir.items.map(item => item.productId)).filter(Boolean) as string[];
    const prProductIds = purchaseReturns.flatMap(pr => pr.items.map(item => item.productId)).filter(Boolean) as string[];
    // Also include productSystemIds from returnItems JSON (for existing data)
    interface PrReturnItem { productSystemId?: string; productId?: string }
    const prJsonProductIds = purchaseReturns.flatMap(pr => {
      const returnItems = pr.returnItems as PrReturnItem[] | null;
      return returnItems && Array.isArray(returnItems) 
        ? returnItems.map(item => item.productSystemId).filter(Boolean) as string[]
        : [];
    });
    const allProductIds = [...new Set([...irProductIds, ...prProductIds, ...prJsonProductIds])];
    
    const productsForItems = allProductIds.length > 0
      ? await prisma.product.findMany({
          where: { systemId: { in: allProductIds } },
          select: { systemId: true, id: true, name: true, imageUrl: true },
        })
      : [];
    const productMap = new Map(productsForItems.map(p => [p.systemId, p]));
    
    // ✅ Also create a map by business ID (SKU) for legacy data that might have business IDs
    const productByBusinessIdMap = new Map(productsForItems.map(p => [p.id, p]));
    
    // ✅ Also build a map from PO lineItems (most reliable source for this PO's products)
    const poProductMap = new Map(order.items.map(item => [
      item.productId, // systemId
      {
        systemId: item.productId,
        id: item.product?.id || item.productSku || '',
        name: item.productName || item.product?.name || '',
        imageUrl: item.product?.imageUrl || null,
      }
    ]));

    // ⚡ Lookup employee names for createdBy fields when name is missing
    const employeeIdsForLookup = [
      ...inventoryReceipts.filter(ir => !ir.receiverName && ir.createdBy).map(ir => ir.createdBy!),
      ...purchaseReturns.filter(pr => !pr.creatorName && pr.createdBy).map(pr => pr.createdBy!),
      // ✅ Also lookup for payments and receipts
      ...payments.filter(p => p.createdBy).map(p => p.createdBy!),
      ...financialReceipts.filter(r => r.createdBy).map(r => r.createdBy!),
    ].filter(Boolean);
    const uniqueEmployeeIds = [...new Set(employeeIdsForLookup)];
    const employeesForNames = uniqueEmployeeIds.length > 0
      ? await prisma.employee.findMany({
          where: { systemId: { in: uniqueEmployeeIds } },
          select: { systemId: true, fullName: true },
        })
      : [];
    // Use fullName first, then fallback to systemId
    const employeeNameMap = new Map(employeesForNames.map(e => [e.systemId, e.fullName || e.systemId]));

    // Transform items to lineItems for frontend compatibility
    const transformedOrder = {
      ...order,
      // Map to frontend expected fields
      supplierSystemId: order.supplierId,
      supplierName: order.supplier?.name || order.supplierName || '',
      branchSystemId: order.branchSystemId || order.branchId || '', // ✅ FIX: Use branchId as fallback
      branchName: order.branchName || '',
      // ⚡ Embedded objects for print/display - avoid separate API calls
      supplier: order.supplier ? {
        systemId: order.supplier.systemId,
        id: order.supplier.id,
        name: order.supplier.name,
        phone: order.supplier.phone,
        email: order.supplier.email,
        address: order.supplier.address,
        bankAccount: order.supplier.bankAccount,
        bankName: order.supplier.bankName,
      } : null,
      // Branch from denormalized fields (no relation in schema)
      branch: (order.branchSystemId || order.branchId) ? { // ✅ FIX: Use branchId as fallback
        systemId: order.branchSystemId || order.branchId, // ✅ FIX: Use branchId as fallback
        name: order.branchName || '',
      } : null,
      buyerSystemId: order.buyerSystemId || '',
      buyer: order.buyer || '',
      creatorSystemId: order.creatorSystemId || '',
      creatorName: order.creatorName || '',
      deliveryDate: order.expectedDate?.toISOString() || order.deliveryDate?.toISOString() || null,
      // Map Prisma status to frontend status
      status: mapPrismaStatusToVietnamese(order.status),
      deliveryStatus: order.deliveryStatus || 'Chưa nhập',
      paymentStatus: order.paymentStatus || 'Chưa thanh toán',
      returnStatus: order.returnStatus || 'Chưa hoàn trả',
      refundStatus: order.refundStatus || 'Chưa hoàn tiền',
      // Transform items to lineItems
      lineItems: order.items.map(item => ({
        systemId: item.systemId,
        productSystemId: item.productId,
        productId: item.product?.id || item.productSku,
        productName: item.productName,
        sku: item.productSku,
        unit: item.product?.unit || 'Cái',
        imageUrl: item.product?.imageUrl || null,
        productTypeSystemId: item.product?.productTypeSystemId || null,
        quantity: item.quantity,
        receivedQuantity: item.receivedQty || 0,
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount) || 0,
        discountType: 'fixed' as const,
        taxRate: 0, // PurchaseOrderItem doesn't have per-item tax, tax is at PO level
        total: Number(item.total),
        notes: null,
      })),
      // Financial fields
      subtotal: Number(order.subtotal),
      discount: Number(order.discount) || 0,
      discountType: order.discountType || 'fixed' as const,
      shippingFee: Number(order.shippingFee) || 0,
      tax: Number(order.tax) || 0,
      grandTotal: Number(order.total),
      // ⚡ OPTIMIZED: Embedded financial data - eliminates 4 separate API calls
      payments: payments.map(p => ({
        ...p,
        amount: Number(p.amount),
        createdAt: p.createdAt?.toISOString() || null,
        updatedAt: p.updatedAt?.toISOString() || null,
        paymentDate: p.paymentDate?.toISOString() || null,
        // ✅ Include creator name for display
        createdByName: p.createdBy ? employeeNameMap.get(p.createdBy) || p.createdBy : null,
        creatorSystemId: p.createdBy || null,
      })),
      financialReceipts: financialReceipts.map(r => ({
        ...r,
        amount: Number(r.amount),
        createdAt: r.createdAt?.toISOString() || null,
        updatedAt: r.updatedAt?.toISOString() || null,
        receiptDate: r.receiptDate?.toISOString() || null,
        // ✅ Include creator name for display
        createdByName: r.createdBy ? employeeNameMap.get(r.createdBy) || r.createdBy : null,
        creatorSystemId: r.createdBy || null,
      })),
      inventoryReceipts: inventoryReceipts.map(ir => {
        // Calculate totalValue from items since InventoryReceipt doesn't have it directly
        const totalValue = ir.items.reduce((sum, item) => sum + Number(item.totalCost || 0), 0);
        // Use receiverName or lookup from employee
        const receiverName = ir.receiverName || (ir.createdBy ? employeeNameMap.get(ir.createdBy) : null) || '';
        return {
          ...ir,
          totalValue,
          receiverName, // ✅ Include resolved receiver name
          createdAt: ir.createdAt?.toISOString() || null,
          updatedAt: ir.updatedAt?.toISOString() || null,
          receivedDate: ir.receivedDate?.toISOString() || null,
          receiptDate: ir.receiptDate?.toISOString() || null, // ✅ Include receipt date for timeline
          items: ir.items.map(item => {
            // ✅ Try multiple lookups: productMap -> poProductMap for better coverage
            const product = (item.productId ? productMap.get(item.productId) : null)
              || (item.productId ? poProductMap.get(item.productId) : null);
            // Lookup original unit price from PO lineItems
            const poLineItem = order.items.find(li => li.productId === item.productId);
            const originalUnitPrice = poLineItem ? Number(poLineItem.unitPrice) : 0;
            return {
              ...item,
              // Map DB fields to frontend expected names
              productSystemId: item.productId,
              productId: item.productSku || product?.id || item.productId, // SKU for display
              productName: item.productName || product?.name || '',
              receivedQuantity: item.quantity,
              orderedQuantity: item.quantity,
              unitPrice: originalUnitPrice, // Original purchase price (without fees)
              unitCost: Number(item.unitCost || 0), // Cost price (with allocated fees)
              totalValue: Number(item.totalCost || 0),
              imageUrl: product?.imageUrl || null,
            };
          }),
        };
      }),
      purchaseReturns: purchaseReturns.map(pr => {
        // Prefer returnItems JSON (has complete data) over relational items
        interface ReturnItemData {
          productSystemId: string;
          productId?: string;
          productName?: string;
          orderedQuantity?: number;
          returnQuantity: number;
          unitPrice: number;
          note?: string;
          imageUrl?: string | null;
        }
        let items: ReturnItemData[] = [];
        
        // Parse returnItems JSON if available
        const returnItemsData = pr.returnItems;
        if (returnItemsData && Array.isArray(returnItemsData)) {
          // Enrich items with product info from multiple sources
          items = (returnItemsData as unknown as ReturnItemData[]).map(item => {
            // ✅ Priority: returnItems JSON -> poProductMap (PO lineItems) -> productMap -> productByBusinessIdMap
            const poProduct = item.productSystemId ? poProductMap.get(item.productSystemId) : null;
            const product = poProduct 
              || (item.productSystemId ? productMap.get(item.productSystemId) : null)
              || (item.productId ? productByBusinessIdMap.get(item.productId) : null);
            
            // ✅ FIX: Prefer product lookup over stored values (stored values may be SKU instead of name)
            const productName = poProduct?.name || product?.name || item.productName || '';
            const imageUrl = poProduct?.imageUrl || product?.imageUrl || item.imageUrl || null;
            
            return {
              productSystemId: item.productSystemId,
              productId: item.productId || product?.id || item.productSystemId,
              productName,
              orderedQuantity: item.orderedQuantity || 0,
              returnQuantity: item.returnQuantity,
              unitPrice: Number(item.unitPrice),
              note: item.note,
              imageUrl,
            };
          });
        } else if (pr.items && pr.items.length > 0) {
          // Fallback to relational items
          items = pr.items.map(item => {
            // ✅ Try multiple lookups: poProductMap -> productMap
            const poProduct = item.productId ? poProductMap.get(item.productId) : null;
            const product = poProduct || (item.productId ? productMap.get(item.productId) : null);
            return {
              productSystemId: item.productId || '',
              productId: product?.id || item.productId || '',
              productName: poProduct?.name || product?.name || 'Sản phẩm',
              returnQuantity: item.quantity,
              orderedQuantity: 0,
              unitPrice: Number(item.unitPrice),
              note: item.reason || undefined,
              imageUrl: poProduct?.imageUrl || product?.imageUrl || null,
            };
          });
        }
        
        // Use creatorName or lookup from employee
        const creatorName = pr.creatorName || (pr.createdBy ? employeeNameMap.get(pr.createdBy) : null) || '';
        
        // ✅ Explicitly build object to avoid Decimal serialization issues
        return {
          systemId: pr.systemId,
          id: pr.id,
          supplierId: pr.supplierId,
          purchaseOrderId: pr.purchaseOrderId,
          branchId: pr.branchId,
          employeeId: pr.employeeId,
          status: pr.status,
          reason: pr.reason,
          purchaseOrderSystemId: pr.purchaseOrderSystemId,
          purchaseOrderBusinessId: pr.purchaseOrderBusinessId,
          supplierSystemId: pr.supplierSystemId,
          supplierName: pr.supplierName,
          branchSystemId: pr.branchSystemId,
          branchName: pr.branchName,
          refundMethod: pr.refundMethod,
          accountSystemId: pr.accountSystemId,
          creatorName, // ✅ Use resolved creator name (from field or employee lookup)
          createdBy: pr.createdBy,
          updatedBy: pr.updatedBy,
          // Convert all Decimal fields to numbers
          subtotal: Number(pr.subtotal || 0),
          total: Number(pr.total || 0),
          totalReturnValue: Number(pr.totalReturnValue || 0),
          refundAmount: Number(pr.refundAmount || 0),
          // Convert dates to ISO strings
          createdAt: pr.createdAt?.toISOString() || null,
          updatedAt: pr.updatedAt?.toISOString() || null,
          returnDate: pr.returnDate?.toISOString() || null,
          items,
        };
      }),
      inventoryReceiptIds: inventoryReceipts.map(ir => ir.systemId),
    };

    return apiSuccess(transformedOrder)
  } catch (error) {
    logError('Error fetching purchase order', error)
    return apiError('Không thể tải đơn mua hàng', 500)
  }
})

// Helper to map Prisma enum back to Vietnamese
function mapPrismaStatusToVietnamese(status: PurchaseOrderStatus): string {
  const statusMap: Record<PurchaseOrderStatus, string> = {
    'DRAFT': 'Đặt hàng',
    'PENDING': 'Đặt hàng',
    'CONFIRMED': 'Đang giao dịch',
    'RECEIVING': 'Đang giao dịch',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy',
  };
  return statusMap[status] || 'Đặt hàng';
}

// PUT /api/purchase-orders/[systemId]
export const PUT = apiHandler(async (request, { session, params }) => {
  const validation = await validateBody(request, updatePurchaseOrderSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = params

    // G1: Fetch old PO for inTransit tracking
    const IN_TRANSIT_STATUSES = ['PENDING', 'CONFIRMED', 'RECEIVING'];
    const oldPO = await prisma.purchaseOrder.findUnique({
      where: { systemId },
      include: { items: true },
    });
    if (!oldPO) return apiError('Đơn mua hàng không tồn tại', 404);

    const oldActive = IN_TRANSIT_STATUSES.includes(oldPO.status);
    const newStatus = mapStatusToPrismaEnum(body.status);
    const newActive = newStatus ? IN_TRANSIT_STATUSES.includes(newStatus) : oldActive;
    const poBranchId = oldPO.branchSystemId;
    const statusChanged = newStatus && newStatus !== oldPO.status;
    const itemsChanged = !!body.items;

    // Delete existing items and recreate if items provided
    if (body.items) {
      await prisma.purchaseOrderItem.deleteMany({
        where: { purchaseOrderId: systemId },
      })
    }

    const order = await prisma.purchaseOrder.update({
      where: { systemId },
      data: {
        supplierId: body.supplierId,
        orderDate: body.orderDate ? new Date(body.orderDate) : undefined,
        expectedDate: body.expectedDate ? new Date(body.expectedDate) : undefined,
        receivedDate: body.receivedDate ? new Date(body.receivedDate) : undefined,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,
        status: mapStatusToPrismaEnum(body.status),
        deliveryStatus: body.deliveryStatus,
        paymentStatus: body.paymentStatus,
        // Financial
        subtotal: body.subtotal,
        tax: body.tax,
        discount: body.discount,
        shippingFee: body.shippingFee,
        total: body.total,
        grandTotal: body.grandTotal,
        notes: body.notes,
        items: body.items ? {
          create: await Promise.all(body.items.map(async (item: PurchaseOrderItemInput) => {
            const product = await prisma.product.findUnique({
              where: { systemId: item.productId },
              select: { systemId: true, id: true, name: true }
            })
            if (!product) throw new Error(`Product ${item.productId} not found`)
            return {
              systemId: await generateIdWithPrefix('POI', prisma),
              productId: product.systemId,
              productName: product.name,
              productSku: product.id,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount || 0,
              total: item.total ?? item.quantity * item.unitPrice,
            }
          })),
        } : undefined,
      },
      include: {
        supplier: true,
        items: {
          include: { product: true },
        },
      },
    })

    // G1: Update inTransit when status or items change
    if (poBranchId && (statusChanged || itemsChanged)) {
      // Remove old inTransit if PO was active
      if (oldActive) {
        for (const item of oldPO.items) {
          if (!item.productId) continue;
          const inv = await prisma.productInventory.findUnique({
            where: { productId_branchId: { productId: item.productId, branchId: poBranchId } },
          });
          if (inv && inv.inTransit > 0) {
            await prisma.productInventory.update({
              where: { productId_branchId: { productId: item.productId, branchId: poBranchId } },
              data: { inTransit: { decrement: Math.min(item.quantity, inv.inTransit) } },
            });
          }
        }
      }
      // Add new inTransit if PO is now active
      if (newActive) {
        for (const item of order.items) {
          if (!item.productId) continue;
          await prisma.productInventory.upsert({
            where: { productId_branchId: { productId: item.productId, branchId: poBranchId } },
            update: { inTransit: { increment: item.quantity } },
            create: { productId: item.productId, branchId: poBranchId, onHand: 0, committed: 0, inTransit: item.quantity, inDelivery: 0 },
          });
        }
      }
    }

    // Notify buyer about purchase order update
    if (order.buyerSystemId && order.buyerSystemId !== session!.user?.employeeId) {
      createNotification({
        type: 'purchase_order',
        settingsKey: 'purchase-order:updated',
        title: 'Đơn mua hàng cập nhật',
        message: `Đơn mua hàng ${order.id || systemId} đã được cập nhật`,
        link: `/purchase-orders/${systemId}`,
        recipientId: order.buyerSystemId,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Purchase Order Update] notification failed', e));
    }

    // Log activity
    const changes = computeChanges(
      {
        supplierId: oldPO.supplierId,
        status: oldPO.status,
        deliveryStatus: oldPO.deliveryStatus,
        paymentStatus: oldPO.paymentStatus,
        orderDate: oldPO.orderDate,
        expectedDate: oldPO.expectedDate,
        subtotal: oldPO.subtotal,
        tax: oldPO.tax,
        discount: oldPO.discount,
        shippingFee: oldPO.shippingFee,
        total: oldPO.total,
        grandTotal: oldPO.grandTotal,
        notes: oldPO.notes,
      },
      {
        supplierId: body.supplierId,
        status: body.status,
        deliveryStatus: body.deliveryStatus,
        paymentStatus: body.paymentStatus,
        orderDate: body.orderDate ? new Date(body.orderDate) : null,
        expectedDate: body.expectedDate ? new Date(body.expectedDate) : null,
        subtotal: body.subtotal,
        tax: body.tax,
        discount: body.discount,
        shippingFee: body.shippingFee,
        total: body.total,
        grandTotal: body.grandTotal,
        notes: body.notes,
      }
    );

    if (!changes) {
      // No meaningful changes, skip logging
      return apiSuccess(serializePurchaseOrder(order))
    }

    const changedFields = Object.keys(changes).join(', ');
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'purchase_order',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật đơn mua hàng ${order.id || systemId}: ${changedFields}`,
          changes: JSON.parse(JSON.stringify(changes)),
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] purchase_order updated failed', e))

    return apiSuccess(serializePurchaseOrder(order))
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Đơn mua hàng không tồn tại', 404)
    }
    logError('Error updating purchase order', error)
    return apiError('Không thể cập nhật đơn mua hàng', 500)
  }
})

// PATCH /api/purchase-orders/[systemId] - Same as PUT for partial updates
export const PATCH = PUT

// DELETE /api/purchase-orders/[systemId]
export const DELETE = apiHandler(async (_request, { session, params }) => {
  try {
    const { systemId } = params

    await prisma.purchaseOrder.update({
      where: { systemId },
      data: { isDeleted: true, deletedAt: new Date() },
    })

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'purchase_order',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa đơn đặt hàng`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] purchase_order deleted failed', e))

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiError('Đơn mua hàng không tồn tại', 404)
    }
    logError('Error deleting purchase order', error)
    return apiError('Không thể xóa đơn mua hàng', 500)
  }
})
