/**
 * Sales Returns API Route
 * 
 * GET    /api/sales-returns       - List all sales returns with pagination and filtering
 * POST   /api/sales-returns       - Create new sales return with inventory updates
 * 
 * Related: /api/sales-returns/[systemId]/route.ts for single item operations
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { SalesReturnStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { apiHandler } from '@/lib/api-handler';
import { createSalesReturnSchema } from './validation';
import { generateNextIdsWithTx } from '@/lib/id-system';
import type { EntityType } from '@/lib/id-config-constants';
import { v4 as uuidv4 } from 'uuid';
import { updateCustomerDebt } from '@/lib/services/customer-debt-service';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'
import { formatCurrency } from '@/lib/print-service'

// Interface for sales return item input
interface _SalesReturnItemInput {
  systemId: string;
  productId?: string;
  quantity?: number;
  unitPrice?: number;
  returnValue?: number;
  reason?: string;
}

// GET - List sales returns with pagination and filters
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const orderId = searchParams.get('orderId');
    const orderSystemId = searchParams.get('orderSystemId');
    const branchId = searchParams.get('branchId');
    const isReceived = searchParams.get('isReceived');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null;

    const where: Prisma.SalesReturnWhereInput = {};
    
    const searchWhere = buildSearchWhere<Prisma.SalesReturnWhereInput>(search, [
      'id',
      'reason',
      'customerName',
    ])
    if (searchWhere) Object.assign(where, searchWhere)

    if (status) {
      where.status = status as SalesReturnStatus;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (orderId) {
      where.orderId = orderId;
    }

    if (orderSystemId) {
      where.orderSystemId = orderSystemId;
    }

    if (branchId) {
      where.branchId = branchId;
    }

    if (isReceived !== null && isReceived !== undefined) {
      where.isReceived = isReceived === 'true';
    }

    if (startDate || endDate) {
      where.returnDate = {};
      if (startDate) {
        where.returnDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.returnDate.lte = new Date(endDate);
      }
    }

    // Build sort order
    const allowedSortFields = ['createdAt', 'returnDate', 'id', 'customerName', 'totalReturnValue', 'branchName'];
    const orderBy: Record<string, 'asc' | 'desc'> = allowedSortFields.includes(sortBy || '')
      ? { [sortBy!]: sortOrder || 'desc' }
      : { createdAt: 'desc' };

    const [rawData, total] = await Promise.all([
      prisma.salesReturn.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          systemId: true,
          id: true,
          orderId: true,
          customerId: true,
          employeeId: true,
          branchId: true,
          returnDate: true,
          status: true,
          reason: true,
          subtotal: true,
          total: true,
          refunded: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          orderSystemId: true,
          orderBusinessId: true,
          customerSystemId: true,
          customerName: true,
          branchSystemId: true,
          branchName: true,
          note: true,
          notes: true,
          reference: true,
          returnItems: true,
          totalReturnValue: true,
          isReceived: true,
          exchangeItems: true,
          exchangeOrderSystemId: true,
          subtotalNew: true,
          shippingFeeNew: true,
          discountNew: true,
          discountNewType: true,
          grandTotalNew: true,
          deliveryMethod: true,
          shippingPartnerId: true,
          shippingServiceId: true,
          shippingAddress: true,
          packageInfo: true,
          configuration: true,
          finalAmount: true,
          refundMethod: true,
          refundAmount: true,
          accountSystemId: true,
          refunds: true,
          payments: true,
          paymentVoucherSystemId: true,
          paymentVoucherSystemIds: true,
          receiptVoucherSystemIds: true,
          creatorSystemId: true,
          creatorName: true,
          items: {
            select: {
              systemId: true,
              returnId: true,
              productId: true,
              productName: true,
              productSku: true,
              quantity: true,
              unitPrice: true,
              total: true,
              reason: true,
            },
          },
          // Include original order to get orderId (business ID)
          orders: {
            select: {
              systemId: true,
              id: true,
            },
          },
          // Include exchange order with packaging to get tracking code
          exchangeOrder: {
            select: {
              systemId: true,
              id: true,
              packagings: {
                select: {
                  trackingCode: true,
                },
                take: 1,
              },
            },
          },
        },
      }),
      prisma.salesReturn.count({ where }),
    ]);

    // ✅ Fetch product info for all items across all returns (including exchange items)
    const allProductIds = rawData.flatMap(sr => sr.items.map(item => item.productId).filter(Boolean)) as string[];
    // ✅ Also collect product IDs from exchange items (JSON)
    const allExchangeProductIds = rawData.flatMap(sr => {
      try {
        const items = typeof sr.exchangeItems === 'string' ? JSON.parse(sr.exchangeItems) : (sr.exchangeItems || []);
        return (items as { productSystemId?: string }[]).map(item => item.productSystemId).filter(Boolean);
      } catch { return []; }
    }) as string[];
    const uniqueProductIds = [...new Set([...allProductIds, ...allExchangeProductIds])];
    const products = uniqueProductIds.length > 0
      ? await prisma.product.findMany({
          where: { systemId: { in: uniqueProductIds } },
          select: {
            systemId: true,
            id: true,
            name: true,
            thumbnailImage: true,
            imageUrl: true,
            productTypeSystemId: true,
          },
        })
      : [];
    const productMap = new Map(products.map(p => [p.systemId, p]));

    // ✅ Fetch product types for type labels
    const uniqueProductTypeIds = [...new Set(products.map(p => p.productTypeSystemId).filter(Boolean))] as string[];
    const productTypes = uniqueProductTypeIds.length > 0
      ? await prisma.settingsData.findMany({
          where: { type: 'product-type', systemId: { in: uniqueProductTypeIds }, isDeleted: false },
          select: { systemId: true, name: true },
        })
      : [];
    const productTypeMap = new Map(productTypes.map(pt => [pt.systemId, pt.name]));

    // ✅ Fetch payment and receipt info for display (business IDs)
    const allPaymentSystemIds = rawData.flatMap(sr => sr.paymentVoucherSystemIds || []).filter(Boolean);
    const allReceiptSystemIds = rawData.flatMap(sr => sr.receiptVoucherSystemIds || []).filter(Boolean);
    
    const [paymentsInfo, receiptsInfo] = await Promise.all([
      allPaymentSystemIds.length > 0
        ? prisma.payment.findMany({
            where: { systemId: { in: allPaymentSystemIds } },
            select: { systemId: true, id: true },
          })
        : [],
      allReceiptSystemIds.length > 0
        ? prisma.receipt.findMany({
            where: { systemId: { in: allReceiptSystemIds } },
            select: { systemId: true, id: true },
          })
        : [],
    ]);
    
    const paymentMap = new Map<string, string>(paymentsInfo.map(p => [p.systemId, p.id] as [string, string]));
    const receiptMap = new Map<string, string>(receiptsInfo.map(r => [r.systemId, r.id] as [string, string]));

    // ✅ Transform data to match ReturnLineItem type
    const data = rawData.map(sr => ({
      ...sr,
      // ✅ Get original order business ID from relation
      orderId: sr.orders?.id || sr.orderBusinessId || null,
      orderSystemId: sr.orderId || sr.orderSystemId || null,
      // ✅ Ensure exchangeOrderSystemId and deliveryMethod are explicitly included
      exchangeOrderSystemId: sr.exchangeOrderSystemId || null,
      // ✅ Get exchange order business ID from relation
      exchangeOrderId: sr.exchangeOrder?.id || null,
      // ✅ Add payment/receipt business IDs for display without lookup
      paymentVoucherIds: (sr.paymentVoucherSystemIds || []).map(id => paymentMap.get(id)).filter(Boolean),
      receiptVoucherIds: (sr.receiptVoucherSystemIds || []).map(id => receiptMap.get(id)).filter(Boolean),
      // ✅ Get tracking code from exchange order's packaging
      exchangeTrackingCode: sr.exchangeOrder?.packagings?.[0]?.trackingCode || null,
      deliveryMethod: sr.deliveryMethod || null,
      // ✅ Parse exchangeItems from JSON if stored as string, enrich with product data
      exchangeItems: (() => { try {
        const items = typeof sr.exchangeItems === 'string' 
          ? JSON.parse(sr.exchangeItems) 
          : (sr.exchangeItems || []);
        return (items as { productSystemId?: string; [key: string]: unknown }[]).map(item => {
          const prod = item.productSystemId ? productMap.get(item.productSystemId) : null;
          return {
            ...item,
            thumbnailImage: (item as { thumbnailImage?: string }).thumbnailImage || prod?.thumbnailImage || prod?.imageUrl || undefined,
            productType: prod?.productTypeSystemId ? (productTypeMap.get(prod.productTypeSystemId) || undefined) : undefined,
          };
        });
      } catch { return [] } })(),
      // Convert Date fields to ISO string
      returnDate: sr.returnDate?.toISOString() || sr.createdAt?.toISOString() || null,
      createdAt: sr.createdAt?.toISOString() || null,
      updatedAt: sr.updatedAt?.toISOString() || null,
      // Convert Decimal fields to Number
      subtotal: Number(sr.subtotal) || 0,
      total: Number(sr.total) || 0,
      refunded: Number(sr.refunded) || 0,
      totalReturnValue: Number(sr.totalReturnValue) || 0,
      subtotalNew: Number(sr.subtotalNew) || 0,
      shippingFeeNew: Number(sr.shippingFeeNew) || 0,
      discountNew: Number(sr.discountNew) || 0,
      grandTotalNew: Number(sr.grandTotalNew) || 0,
      // ✅ Calculate finalAmount if not stored: grandTotalNew - totalReturnValue
      finalAmount: Number(sr.finalAmount) || ((Number(sr.grandTotalNew) || 0) - (Number(sr.totalReturnValue) || 0)),
      refundAmount: Number(sr.refundAmount) || 0,
      items: sr.items.map(item => {
        const product = item.productId ? productMap.get(item.productId) : null;
        return {
          productSystemId: item.productId || '',
          productId: item.productSku || product?.id || '', // business ID (SKU)
          productName: item.productName,
          returnQuantity: item.quantity,
          unitPrice: Number(item.unitPrice) || 0,
          totalValue: Number(item.total) || 0,
          note: item.reason || undefined,
          thumbnailImage: product?.thumbnailImage || product?.imageUrl || undefined,
          productType: product?.productTypeSystemId ? (productTypeMap.get(product.productTypeSystemId) || undefined) : undefined,
        };
      }),
    }));

    return apiPaginated(data, { page, limit, total });
  } catch (error) {
    logError('[Sales Returns API] GET error', error);
    return apiError('Không thể tải danh sách phiếu trả hàng', 500);
  }
}

// POST - Create new sales return with inventory and order updates
export const POST = apiHandler(async (request: NextRequest, { session }) => {
  const result = await validateBody(request, createSalesReturnSchema);
  if (!result.success) return apiError(result.error, 400);

  try {
    const {
      orderId,
      reason,
      items,
      createdBy,
      exchangeItems,
      branchId: requestBranchId,
      isReceived,
      deliveryMethod: inputDeliveryMethod,
      // ✅ Tracking code from external shipping partner (e.g., GHTK)
      exchangeTrackingCode: inputExchangeTrackingCode,
      // ✅ Shipping info for exchange order
      shippingPartnerId: inputShippingPartnerId,
      shippingServiceId: inputShippingServiceId,
      shippingAddress: inputShippingAddress,
      packageInfo: inputPackageInfo,
      configuration: _inputConfiguration,
      // Financial data
      totalReturnValue: _inputTotalReturnValue,
      subtotalNew: _subtotalNew,
      shippingFeeNew: inputShippingFeeNew,
      grandTotalNew,
      finalAmount: inputFinalAmount,
      payments,
      refunds,
    } = result.data;

    // Validate that order exists
    const order = await prisma.order.findUnique({
      where: { systemId: orderId },
      select: {
        systemId: true,
        id: true,
        branchId: true,
        branchName: true,
        customerId: true,
        customerName: true,
        salespersonId: true,
        salespersonName: true,
        status: true,
        stockOutStatus: true,
        deliveryStatus: true,
        lineItems: {
          select: {
            productId: true,
            productName: true,
            productSku: true,
            quantity: true,
            unitPrice: true,
          },
        },
        customer: {
          select: {
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return apiError('Order not found', 404);
    }

    // ✅ Check if order has been dispatched (xuất kho) - cannot return if not yet dispatched
    // Check order-level statuses
    const validDispatchStatuses = ['FULLY_STOCKED_OUT', 'PARTIALLY_STOCKED_OUT'];
    const validDeliveryStatuses = ['SHIPPING', 'DELIVERED', 'RESCHEDULED', 'PENDING_SHIP', 'Đang giao hàng', 'Đã giao hàng', 'Chờ giao lại', 'Chờ lấy hàng'];
    const validOrderStatuses = ['SHIPPING', 'DELIVERED', 'COMPLETED', 'FAILED_DELIVERY'];
    
    let isDispatched = validDispatchStatuses.includes(order.stockOutStatus || '') ||
                         validDeliveryStatuses.includes(order.deliveryStatus || '') ||
                         validOrderStatuses.includes(order.status);
    
    // Also check packaging-level delivery status (packaging may be delivered while order status is stale)
    if (!isDispatched) {
      const packagings = await prisma.packaging.findMany({
        where: { orderId: order.systemId },
        select: { deliveryStatus: true, status: true },
      });
      isDispatched = packagings.some(p => 
        validDeliveryStatuses.includes(p.deliveryStatus || '') ||
        p.status === 'COMPLETED'
      );
    }
    
    if (!isDispatched) {
      return apiError('Không thể tạo phiếu trả hàng cho đơn chưa xuất kho. Vui lòng xuất kho trước khi trả hàng.', 400);
    }
    
    const branchId = requestBranchId || order.branchId;
    
    // ✅ Fetch sales settings to check allowNegativeStockOut
    const salesSettings = await prisma.setting.findFirst({
      where: { key: 'salesManagement' },
    });
    const allowNegativeStockOut = salesSettings?.value 
      ? (() => { try { return (JSON.parse(salesSettings.value as string) as { allowNegativeStockOut?: boolean }).allowNegativeStockOut ?? true } catch { return true } })()
      : true;

    // Validate return items against order (allow empty if only exchanging)
    const hasReturnItems = items && items.length > 0;
    const hasExchangeItems = exchangeItems && exchangeItems.length > 0;
    
    if (!hasReturnItems && !hasExchangeItems) {
      return apiError('At least one return item or exchange item is required', 400);
    }

    // ✅ Fetch all previous returns for this order to calculate returnable quantities
    const previousReturns = await prisma.salesReturn.findMany({
      where: { orderId: order.systemId },
      select: {
        systemId: true,
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });

    // Calculate total already returned for each product
    const alreadyReturnedQty: Record<string, number> = {};
    for (const sr of previousReturns) {
      for (const item of sr.items) {
        const productId = item.productId || '';
        alreadyReturnedQty[productId] = (alreadyReturnedQty[productId] || 0) + item.quantity;
      }
    }

    if (hasReturnItems) {
      for (const item of items!) {
        // ✅ FIX: productSystemId is the DB FK (PROD087353), productId is now the SKU (ZP7)
        const productSysId = item.productSystemId || item.productId;
        if (!productSysId) {
          return apiError('Product ID is required for all return items', 400);
        }

        const orderItem = order.lineItems.find(li => li.productId === productSysId);
        if (!orderItem) {
          return apiError(`Product ${item.productId || productSysId} not found in order`, 400);
        }

        if ((item.quantity || 0) <= 0) {
          return apiError('Return quantity must be greater than 0', 400);
        }

        // ✅ Check against RETURNABLE quantity (ordered - already returned)
        const alreadyReturned = alreadyReturnedQty[productSysId] || 0;
        const returnableQty = orderItem.quantity - alreadyReturned;
        
        if ((item.quantity || 0) > returnableQty) {
          const productName = orderItem.productName || item.productId;
          return apiError(`Sản phẩm "${productName}" chỉ còn có thể trả ${returnableQty} (đã trả ${alreadyReturned}/${orderItem.quantity})`, 400);
        }
      }
    }

    // Calculate totals
    const returnSubtotal = (items || []).reduce((sum, item) => 
      sum + ((item.unitPrice || 0) * (item.quantity || 0)), 0);
    const exchangeSubtotal = (exchangeItems || []).reduce((sum, item) => 
      sum + ((item.unitPrice || 0) * (item.quantity || 0)), 0);
    const total = returnSubtotal;

    // Create sales return with atomic transaction
    const salesReturn = await prisma.$transaction(async (tx) => {
      // Generate IDs using ID system
      const { systemId, businessId } = await generateNextIdsWithTx(tx, 'sales-returns' as EntityType);

      // Create sales return record
      const newReturn = await tx.salesReturn.create({
        data: {
          systemId,
          id: businessId,
          orderId: order.systemId,
          customerId: order.customerId,
          customerName: order.customerName,
          customerSystemId: order.customerId,
          employeeId: session!.user?.id || null,
          branchId: branchId,
          branchSystemId: branchId,
          branchName: order.branchName,
          orderSystemId: order.systemId,
          orderBusinessId: order.id,
          returnDate: new Date(),
          status: isReceived ? SalesReturnStatus.APPROVED : SalesReturnStatus.PENDING,
          reason: reason || null,
          note: reason || null,
          notes: reason || null,
          subtotal: returnSubtotal,
          total,
          totalReturnValue: total,
          subtotalNew: exchangeSubtotal,
          grandTotalNew: exchangeSubtotal,
          refunded: 0,
          isReceived: isReceived || false,
          createdBy: createdBy || session!.user?.id || null,
          creatorSystemId: session!.user?.id || null,
          creatorName: session!.user?.name || null,
          // Store return items as JSON for flexible structure
          returnItems: (items || []).map(item => ({
            systemId: item.systemId || uuidv4(),
            productSystemId: item.productSystemId || item.productId,
            productId: item.productId || item.productSystemId,
            quantity: item.quantity || 0,
            unitPrice: item.unitPrice || 0,
            returnValue: (item.unitPrice || 0) * (item.quantity || 0),
            reason: item.reason || null,
          })),
          // Store exchange items as JSON
          exchangeItems: hasExchangeItems ? (exchangeItems || []).map(item => ({
            systemId: uuidv4(),
            productSystemId: item.productSystemId,
            productId: item.productId || item.productSystemId,
            productName: item.productName || '',
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            discount: item.discount || 0,
            discountType: item.discountType || 'fixed',
            total: (item.unitPrice || 0) * (item.quantity || 1),
          })) : [],
          // Create individual item records
          items: {
            create: (items || []).map(item => {
              // ✅ Lookup by productSystemId (PROD112654) - matches order.lineItems.productId
              const productSystemId = item.productSystemId || item.productId;
              const orderItem = order.lineItems.find(li => li.productId === productSystemId);
              return {
                systemId: item.systemId || uuidv4(),
                // ✅ Store productSystemId (PROD112654) để detail page có thể lookup product info
                productId: productSystemId!,
                productName: orderItem?.productName || 'Unknown Product',
                // ✅ Store business ID (ZP8) in productSku for display
                productSku: item.productId || orderItem?.productSku || 'N/A',
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || orderItem?.unitPrice || 0,
                total: (Number(item.unitPrice) || Number(orderItem?.unitPrice) || 0) * (item.quantity || 1),
                reason: item.reason || null,
              };
            }),
          },
        },
        select: {
          systemId: true,
          id: true,
          orderId: true,
          customerId: true,
          customerSystemId: true,
          status: true,
          totalReturnValue: true,
          items: {
            select: {
              systemId: true,
              returnId: true,
              productId: true,
              productName: true,
              productSku: true,
              quantity: true,
              unitPrice: true,
              total: true,
              reason: true,
            },
          },
        },
      });

      // ✅ Update inventory for exchange items - SUBTRACT from stock
      if (hasExchangeItems && branchId) {
        for (const item of exchangeItems!) {
          const productId = item.productSystemId;
          const quantity = item.quantity || 1;

          // Check if inventory record exists
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: productId,
                branchId: branchId,
              },
            },
          });

          const oldStock = inventory?.onHand || 0;
          const newStock = oldStock - quantity;

          if (inventory) {
            // ✅ Check available stock ONLY if allowNegativeStockOut is false
            if (!allowNegativeStockOut) {
              const available = (inventory.onHand || 0) - (inventory.committed || 0);
              if (available < quantity) {
                throw new Error(`Không đủ tồn kho cho sản phẩm ${item.productName || productId}. Tồn: ${available}, Cần: ${quantity}`);
              }
            }

            // Update inventory - subtract from onHand
            await tx.productInventory.update({
              where: {
                productId_branchId: {
                  productId: productId,
                  branchId: branchId,
                },
              },
              data: {
                onHand: { decrement: quantity },
                updatedAt: new Date(),
              },
            });
          } else {
            // ✅ If allowNegativeStockOut, create inventory with negative value; otherwise throw error
            if (allowNegativeStockOut) {
              await tx.productInventory.create({
                data: {
                  productId: productId,
                  branchId: branchId,
                  onHand: -quantity,
                  committed: 0,
                  inTransit: 0,
                  inDelivery: 0,
                },
              });
            } else {
              throw new Error(`Không tìm thấy tồn kho cho sản phẩm ${item.productName || productId}`);
            }
          }

          // ✅ Create stock history record for exchange item (stock out)
          await tx.stockHistory.create({
            data: {
              productId: productId,
              branchId: branchId,
              action: 'Xuất kho đổi hàng',
              source: 'Phiếu trả hàng',
              quantityChange: -quantity,
              newStockLevel: newStock,
              documentId: newReturn.id,
              documentType: 'sales_return',
              employeeId: createdBy || session!.user?.id,
              employeeName: session!.user?.name || undefined,
              note: `Xuất kho cho hàng đổi - ${item.productName || productId}`,
            },
          });
        }
      }

      // ✅ Update inventory for returned items if isReceived = true (ADD to stock)
      if (isReceived && hasReturnItems && branchId) {
        for (const item of items!) {
          // ✅ FIX: use productSystemId for DB FK lookups (productId is now SKU)
          const productSysId = item.productSystemId || item.productId;
          if (!productSysId) continue;
          
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: productSysId,
                branchId: branchId,
              },
            },
          });

          const oldStock = inventory?.onHand || 0;
          const quantity = item.quantity || 0;
          const newStock = oldStock + quantity;

          if (inventory) {
            await tx.productInventory.update({
              where: {
                productId_branchId: {
                  productId: productSysId,
                  branchId: branchId,
                },
              },
              data: {
                onHand: { increment: quantity },
                updatedAt: new Date(),
              },
            });
          } else {
            await tx.productInventory.create({
              data: {
                productId: productSysId,
                branchId: branchId,
                onHand: quantity,
                committed: 0,
                inTransit: 0,
              },
            });
          }

          // ✅ Create stock history record for returned item (stock in)
          await tx.stockHistory.create({
            data: {
              productId: productSysId,
              branchId: branchId,
              action: 'Nhập kho trả hàng',
              source: 'Phiếu trả hàng',
              quantityChange: quantity,
              newStockLevel: newStock,
              documentId: newReturn.id,
              documentType: 'sales_return',
              employeeId: createdBy || session!.user?.id,
              employeeName: session!.user?.name || undefined,
              note: `Nhập kho hàng trả - ${item.productId || productSysId}`,
            },
          });
        }
      }

      return newReturn;
    });

    // ========================================
    // CREATE EXCHANGE ORDER (new order for exchange items)
    // ========================================
    let exchangeOrderId: string | null = null;
    let exchangeOrderBusinessId: string | null = null;
    let exchangeTrackingCode: string | null = null;
    
    if (hasExchangeItems) {
      // ✅ Retry logic for unique constraint violations
      const MAX_RETRIES = 3;
      let lastError: Error | null = null;
      
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const exchangeOrderResult = await prisma.$transaction(async (tx) => {
            // Generate IDs for new order
            const { systemId: orderSystemId, businessId: orderBusinessId, counter: orderCounter } = await generateNextIdsWithTx(tx, 'orders' as EntityType);
            
            // Generate packaging ID using order counter with suffix (same format as regular orders)
            // Example: ORDER000040 → PACKAGE000040-01, DG000040-01
            const pkgSystemId = `PACKAGE${String(orderCounter).padStart(6, '0')}-01`;
            const pkgBusinessId = `DG${String(orderCounter).padStart(6, '0')}-01`;
            
            // Determine delivery method and tracking code
            // ✅ All delivery methods should have tracking codes
            const isPickup = inputDeliveryMethod === 'pickup';
            // ✅ Use tracking code from GHTK if provided, otherwise generate internal code
            const trackingCode = inputExchangeTrackingCode || (isPickup ? `INSTORE-${pkgBusinessId}` : `SHIP-${pkgBusinessId}`);
            const deliveryMethod = isPickup ? 'IN_STORE_PICKUP' : 'SHIPPING';
            // ✅ DeliveryStatus enum: PENDING_PACK, PACKED, PENDING_SHIP, SHIPPING, DELIVERED, RESCHEDULED, CANCELLED
            // ✅ For pickup: PACKED (ready for customer to pick up, NOT delivered yet - need staff to confirm stock out)
            // ✅ For shipping: PENDING_SHIP (waiting to be shipped)
            const deliveryStatus = isPickup ? 'PACKED' : 'PENDING_SHIP';
            // ✅ PackagingStatus enum: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
            // ✅ Packaging is complete (items are packed), but order is NOT complete until stock out is confirmed
            const packagingStatus = 'COMPLETED';
            
            // ✅ Calculate total paid from payments FIRST (needed for COD calculation)
            const totalPaidFromPayments = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
            
            // ✅ Get COD amount from form input (user entered value)
            // If user specified codAmount in packageInfo, use that value
            // Otherwise calculate: COD = grandTotal - returnValue - paidAmount
            const exchangeGrandTotal = grandTotalNew ?? exchangeSubtotal;
            const returnValue = Number(salesReturn.totalReturnValue) || 0;
            const netTotal = Math.max(0, exchangeGrandTotal - returnValue);
            // ✅ Read from validated schema - now has proper types
            const inputCodAmount = inputPackageInfo?.codAmount;
            const inputPayer = inputPackageInfo?.payer;
            const inputShippingFeeToPartner = inputPackageInfo?.shippingFeeToPartner;
            // ✅ Use form input if provided, otherwise calculate
            const codAmount = isPickup ? 0 : (inputCodAmount ?? Math.max(0, netTotal - totalPaidFromPayments));
            
            const shippingFee = inputShippingFeeNew ?? 0;
            // ✅ Get shippingFeeToPartner from GHTK response (stored in packageInfo)
            const shippingFeeToPartner = inputShippingFeeToPartner ?? shippingFee;
            
            // Create the exchange order
            // ✅ Use original order's salesperson to ensure valid foreign key
          const newOrder = await tx.order.create({
            data: {
              systemId: orderSystemId,
              id: orderBusinessId,
              customerId: order.customerId,
              customerName: order.customerName || '',
              branchId: branchId,
              branchName: order.branchName || '',
              salespersonId: order.salespersonId,
              salespersonName: order.salespersonName || '',
              // ✅ Order is PROCESSING until staff confirms stock out (even for pickup)
              status: 'PROCESSING',
              // ✅ Payment status based on actual payments made
              paymentStatus: totalPaidFromPayments >= (grandTotalNew ?? exchangeSubtotal) ? 'PAID' 
                : totalPaidFromPayments > 0 ? 'PARTIAL' 
                : 'UNPAID',
              subtotal: exchangeSubtotal,
              tax: 0,
              discount: 0,
              // ✅ Use grandTotalNew if provided (includes shipping), otherwise use subtotal
              grandTotal: grandTotalNew ?? exchangeSubtotal,
              // ✅ Use actual paid amount from payments
              paidAmount: totalPaidFromPayments,
              // ✅ Add shipping fee and COD amount
              shippingFee: shippingFee,
              codAmount: codAmount,
              orderDate: new Date(),
              // ✅ Exchange order is pre-approved (created from sales return, packaging already done)
              approvedDate: new Date(),
              source: 'DOIHANG', // ✅ Use business ID from sales channels settings
              notes: `Đơn đổi hàng từ phiếu trả ${salesReturn.id} (Đơn gốc: ${order.id})`,
              createdBy: session!.user?.id || createdBy,
              linkedSalesReturnSystemId: salesReturn.systemId,
              // ✅ Store return value for display in order detail
              linkedSalesReturnValue: salesReturn.totalReturnValue,
              sourceSalesReturnId: salesReturn.id,
              // ✅ Shipping address for exchange order
              shippingAddress: inputShippingAddress || undefined,
              // Line items
              lineItems: {
                create: (exchangeItems || []).map((item) => ({
                  systemId: uuidv4(),
                  productId: item.productSystemId || null,
                  productSku: item.productId || item.productSystemId || '',
                  productName: item.productName || '',
                  quantity: item.quantity || 1,
                  unitPrice: item.unitPrice || 0,
                  discount: item.discount || 0,
                  discountType: item.discount ? (item.discountType === 'percentage' ? 'PERCENTAGE' : 'FIXED') : null,
                  tax: 0,
                  total: (item.unitPrice || 0) * (item.quantity || 1),
                })),
              },
              // Packaging
              packagings: {
                create: {
                  systemId: pkgSystemId,
                  id: pkgBusinessId,
                  branchId: branchId,
                  requestDate: new Date(),
                  confirmDate: isPickup ? new Date() : null,
              requestingEmployeeId: session!.user?.id || createdBy,
              requestingEmployeeName: session!.user?.name || 'System',
              confirmingEmployeeId: isPickup ? (session!.user?.id || createdBy) : null,
              confirmingEmployeeName: isPickup ? (session!.user?.name || 'System') : null,
                  status: packagingStatus,
                  deliveryStatus: deliveryStatus,
                  deliveryMethod: deliveryMethod,
                  trackingCode: trackingCode,
                  printStatus: 'NOT_PRINTED',
                  createdBy: session!.user?.name || 'System',
                  notes: `Đổi hàng từ phiếu trả ${salesReturn.id}`,
                  // ✅ Add requestor info for pickup (người nhận hàng)
                  requestorName: isPickup ? (order.customerName || 'Khách lẻ') : null,
                  requestorPhone: isPickup ? (order.customer?.phone || null) : null,
                  requestorId: isPickup ? order.customerId : null,
                  // ✅ Add shipping info to packaging
                  shippingFeeToPartner: shippingFeeToPartner,
                  codAmount: codAmount,
                  carrier: inputShippingPartnerId || null,
                  service: inputShippingServiceId || null,
                  // ✅ Payer: lấy từ packageInfo (form gửi), default 'Người gửi' for exchange
                  payer: inputPayer || 'Người gửi',
                },
              },
            },
            select: {
              systemId: true,
              id: true,
              packagings: {
                select: {
                  trackingCode: true,
                },
                take: 1,
              },
            },
          });
          
          return { order: newOrder, trackingCode };
        });
        
        exchangeOrderId = exchangeOrderResult.order.systemId;
        exchangeOrderBusinessId = exchangeOrderResult.order.id;
        exchangeTrackingCode = exchangeOrderResult.trackingCode;
        
        // Update salesReturn with exchange order info
        await prisma.salesReturn.update({
          where: { systemId: salesReturn.systemId },
          data: {
            exchangeOrderSystemId: exchangeOrderId,
            deliveryMethod: inputDeliveryMethod || 'pickup',
          },
        });
        
        // ✅ Success - break out of retry loop
        lastError = null;
        break;
      } catch (err) {
        lastError = err as Error;
        const isUniqueConstraint = (err as Error)?.message?.includes('Unique constraint');
        logError(`[SalesReturn] Attempt ${attempt} failed`, err);
        
        if (isUniqueConstraint && attempt < MAX_RETRIES) {
          // Small delay before retry
          await new Promise(resolve => setTimeout(resolve, 100 * attempt));
          continue;
        }
        
        logError('[SalesReturn] Failed to create exchange order', err);
      }
      } // end for retry loop
      
      // ✅ If all retries failed, throw error
      if (lastError) {
        throw new Error(`Không thể tạo đơn hàng đổi: ${lastError.message || 'Lỗi không xác định'}`);
      }
    }

    // ========================================
    // CREATE PAYMENT/RECEIPT VOUCHERS
    // ========================================
    const createdPaymentIds: string[] = [];
    const createdReceiptIds: string[] = [];

    // Create Payment vouchers (phiếu chi) when refunding customer (finalAmount < 0)
    // ✅ Note: Frontend đã check maxRefundableAmount > 0 trước khi gửi refunds
    // Nếu khách chưa thanh toán đơn gốc, refunds sẽ = undefined (không tạo phiếu chi)
    if (refunds && refunds.length > 0 && (inputFinalAmount ?? 0) < 0) {
      for (const refund of refunds) {
        if (!refund.amount || refund.amount <= 0) continue;
        
        try {
          const payment = await prisma.$transaction(async (tx) => {
            const { systemId, businessId } = await generateNextIdsWithTx(tx, 'payments' as EntityType);
            
            return tx.payment.create({
              data: {
                systemId,
                id: businessId,
                branchId: branchId,
                branchSystemId: branchId,
                branchName: order.branchName || undefined,
                type: 'OTHER_EXPENSE', // Use OTHER_EXPENSE for customer refunds
                amount: refund.amount,
                paymentMethod: refund.method || 'CASH',
                paymentMethodName: refund.method || 'Tiền mặt',
                paymentDate: new Date(),
                description: `Hoàn tiền đổi/trả hàng từ đơn ${order.id} (Phiếu trả: ${salesReturn.id})`,
                // ✅ Recipient info (người nhận tiền hoàn)
                recipientTypeName: 'Khách hàng',
                recipientName: order.customerName || 'Khách lẻ',
                recipientSystemId: order.customerId,
                // ✅ Customer info
                customerSystemId: order.customerId,
                customerName: order.customerName || 'Khách lẻ',
                // ✅ Account & Type
                accountSystemId: refund.accountSystemId,
                paymentReceiptTypeName: 'Hoàn tiền khách hàng',
                // ✅ Original document
                originalDocumentId: order.id,
                category: 'complaint_refund',
                affectsDebt: true,
                linkedSalesReturnSystemId: salesReturn.systemId,
                linkedOrderSystemId: order.systemId,
                createdBy: createdBy || session!.user?.id,
                status: 'completed',
              },
            });
          });
          
          createdPaymentIds.push(payment.systemId);
        } catch (err) {
          logError('[SalesReturn] Failed to create payment voucher', err);
        }
      }
    }

    // Create Receipt vouchers (phiếu thu) when customer needs to pay more (finalAmount > 0)
    // ✅ Link to EXCHANGE ORDER (not original order) so payment shows in new order
    if (payments && payments.length > 0 && (inputFinalAmount ?? 0) > 0) {
      // ✅ Define linkedOrderId outside transaction so it's accessible in log
      const paymentLinkedOrderId = exchangeOrderId || order.systemId;
      const paymentLinkedOrderBusinessId = exchangeOrderBusinessId || order.id;
      
      for (const payment of payments) {
        if (!payment.amount || payment.amount <= 0) continue;
        
        try {
          const receipt = await prisma.$transaction(async (tx) => {
            const { systemId, businessId } = await generateNextIdsWithTx(tx, 'receipts' as EntityType);
            
            const created = await tx.receipt.create({
              data: {
                systemId,
                id: businessId,
                branchId: branchId,
                branchSystemId: branchId,
                branchName: order.branchName || undefined,
                type: 'CUSTOMER_PAYMENT',
                amount: payment.amount,
                paymentMethod: payment.method || 'CASH',
                paymentMethodName: payment.method || 'Tiền mặt',
                receiptDate: new Date(),
                description: `Thu tiền chênh lệch đổi hàng từ đơn ${order.id} (Phiếu trả: ${salesReturn.id})${exchangeOrderBusinessId ? ` → Đơn đổi: ${exchangeOrderBusinessId}` : ''}`,
                // ✅ Payer info (người nộp tiền)
                payerTypeName: 'Khách hàng',
                payerName: order.customerName || 'Khách lẻ',
                payerSystemId: order.customerId,
                // ✅ Customer info
                customerSystemId: order.customerId,
                customerName: order.customerName || 'Khách lẻ',
                // ✅ Account & Type
                accountSystemId: payment.accountSystemId,
                paymentReceiptTypeName: 'Thu tiền khách hàng',
                // ✅ Original document
                originalDocumentId: paymentLinkedOrderBusinessId,
                category: 'sale',
                affectsDebt: true,
                linkedSalesReturnSystemId: salesReturn.systemId,
                // ✅ Link to exchange order if exists
                linkedOrderSystemId: paymentLinkedOrderId,
                createdBy: createdBy || session!.user?.id,
                status: 'completed',
              },
            });

            // ✅ Create OrderPayment so order.payments relation stays in sync
            if (paymentLinkedOrderId) {
              await tx.orderPayment.create({
                data: {
                  id: businessId,
                  orderId: paymentLinkedOrderId,
                  amount: payment.amount,
                  method: payment.method || 'Tiền mặt',
                  description: `Thu tiền chênh lệch đổi hàng (${salesReturn.id})`,
                  createdBy: createdBy || session!.user?.id || 'system',
                  linkedReceiptSystemId: systemId,
                },
              });
            }

            return created;
          });
          
          createdReceiptIds.push(receipt.systemId);
        } catch (err) {
          logError('[SalesReturn] Failed to create receipt voucher', err);
        }
      }
    }

    // ✅ FIX: paidAmount is already set correctly during exchange order creation (line ~692)
    // Previously this block incremented paidAmount AGAIN, causing double-counting
    // Only update paymentStatus if receipts were created (paidAmount already correct)
    if (exchangeOrderId && createdReceiptIds.length > 0 && (inputFinalAmount ?? 0) > 0) {
      const totalPaid = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      if (totalPaid > 0) {
        try {
          await prisma.order.update({
            where: { systemId: exchangeOrderId },
            data: {
              paymentStatus: totalPaid >= (grandTotalNew ?? 0) ? 'PAID' : 'PARTIAL',
            },
          });
        } catch (err) {
          logError('[SalesReturn] Failed to update exchange order paymentStatus', err);
        }
      }
    }

    // Update sales return with voucher IDs
    if (createdPaymentIds.length > 0 || createdReceiptIds.length > 0) {
      await prisma.salesReturn.update({
        where: { systemId: salesReturn.systemId },
        data: {
          refundAmount: refunds?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0,
          refunded: refunds?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0,
          paymentVoucherSystemIds: createdPaymentIds,
          receiptVoucherSystemIds: createdReceiptIds,
        },
      });
    }

    // Update customer debt after creating sales return (trả hàng giảm công nợ)
    if (salesReturn.customerSystemId || order.customerId) {
      const customerSystemId = salesReturn.customerSystemId || order.customerId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          logError('[Create SalesReturn] Failed to update customer debt', err);
        });
      }
    }

    // ✅ Fetch updated salesReturn with all fields including exchangeOrderSystemId
    const updatedSalesReturn = await prisma.salesReturn.findUnique({
      where: { systemId: salesReturn.systemId },
      select: {
        systemId: true,
        id: true,
        orderId: true,
        customerId: true,
        employeeId: true,
        branchId: true,
        returnDate: true,
        status: true,
        reason: true,
        subtotal: true,
        total: true,
        refunded: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        orderSystemId: true,
        orderBusinessId: true,
        customerSystemId: true,
        customerName: true,
        branchSystemId: true,
        branchName: true,
        note: true,
        notes: true,
        reference: true,
        returnItems: true,
        totalReturnValue: true,
        isReceived: true,
        exchangeItems: true,
        exchangeOrderSystemId: true,
        subtotalNew: true,
        shippingFeeNew: true,
        discountNew: true,
        discountNewType: true,
        grandTotalNew: true,
        deliveryMethod: true,
        shippingPartnerId: true,
        shippingServiceId: true,
        shippingAddress: true,
        packageInfo: true,
        configuration: true,
        finalAmount: true,
        refundMethod: true,
        refundAmount: true,
        accountSystemId: true,
        refunds: true,
        payments: true,
        paymentVoucherSystemId: true,
        paymentVoucherSystemIds: true,
        receiptVoucherSystemIds: true,
        creatorSystemId: true,
        creatorName: true,
        items: {
          select: {
            systemId: true,
            returnId: true,
            productId: true,
            productName: true,
            productSku: true,
            quantity: true,
            unitPrice: true,
            total: true,
            reason: true,
          },
        },
      },
    });

    // Return with debug info
    const responseData = {
      ...(updatedSalesReturn || salesReturn),
      _debug: {
        hasExchangeItems,
        inputDeliveryMethod,
        exchangeOrderId,
        exchangeOrderBusinessId,
        exchangeTrackingCode,
      }
    };

    // ✅ Notify order salesperson about sales return
    if (order.salespersonId && order.salespersonId !== session!.user?.employeeId) {
      createNotification({
        type: 'sales_return',
        settingsKey: 'sales-return:updated',
        title: 'Trả hàng mới',
        message: `Phiếu trả hàng cho đơn ${order.id || orderId} - Lý do: ${reason || 'Không rõ'}`,
        link: `/sales-returns/${(updatedSalesReturn || salesReturn).systemId}`,
        recipientId: order.salespersonId,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Sales Returns POST] notification failed', e))
    }

    // Log activity
    const returnId = (updatedSalesReturn || salesReturn).id || (updatedSalesReturn || salesReturn).systemId;
    const orderIdStr = order.id || orderId || '';
    const totalReturnValue = Number((updatedSalesReturn || salesReturn).totalReturnValue) || 0;
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'sales_return',
          entityId: (updatedSalesReturn || salesReturn).systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo phiếu trả hàng: ${returnId} - Đơn gốc: ${orderIdStr} - Giá trị: ${formatCurrency(totalReturnValue)}`,
          metadata: { userName, orderId: orderIdStr, totalReturnValue },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] sales_return create failed', e))
    return apiSuccess(responseData, 201);
  } catch (error) {
    logError('[Sales Returns API] POST error', error);
    if (error instanceof Error) {
      return apiError(error.message, 500);
    }
    return apiError('Không thể tạo phiếu trả hàng', 500);
  }
}, { auth: true, rateLimit: { max: 30, windowMs: 60_000 } })
