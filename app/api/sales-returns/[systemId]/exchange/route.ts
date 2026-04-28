/**
 * Sales Return Exchange API Route
 * 
 * POST /api/sales-returns/[systemId]/exchange - Exchange returned product for new product
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound, validateBody } from '@/lib/api-utils';
import { v4 as uuidv4 } from 'uuid';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { z } from 'zod';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// Validation schema for exchange request
const exchangeRequestSchema = z.object({
  newProductSystemId: z.string().min(1, 'New product ID is required'),
  newQuantity: z.number().min(1, 'New quantity must be greater than 0'),
  additionalPayment: z.number().optional(),
  notes: z.string().optional(),
})

// POST - Exchange returned product for new product
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    const validation = await validateBody(request, exchangeRequestSchema);
    if (!validation.success) return apiError(validation.error, 400);
    const { newProductSystemId, newQuantity, additionalPayment, notes } = validation.data;

    // Fetch sales return
    const salesReturn = await prisma.salesReturn.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        status: true,
        branchId: true,
        branchSystemId: true,
        total: true,
        notes: true,
        employeeId: true,
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

    if (!salesReturn) {
      return apiNotFound('SalesReturn');
    }

    if (salesReturn.status === 'REJECTED') {
      return apiError('Cannot exchange rejected returns', 400);
    }

    // Fetch new product details
    const newProduct = await prisma.product.findUnique({
      where: { systemId: newProductSystemId },
    });

    if (!newProduct) {
      return apiError('New product not found', 404);
    }

    // Check inventory availability
    const branchId = salesReturn.branchId || salesReturn.branchSystemId;
    if (!branchId) {
      return apiError('Branch ID is required for exchange', 400);
    }

    const inventory = await prisma.productInventory.findUnique({
      where: {
        productId_branchId: {
          productId: newProductSystemId,
          branchId: branchId,
        },
      },
    });

    const availableQuantity = (inventory?.onHand || 0) - (inventory?.committed || 0);
    if (availableQuantity < newQuantity) {
      return apiError(`Insufficient inventory for exchange. Available: ${availableQuantity}`, 400);
    }

    // Calculate exchange value - use costPrice since sellingPrice was removed
    const newProductPrice = Number(newProduct.costPrice || 0);
    const exchangeTotal = newProductPrice * newQuantity;

    // Perform exchange in atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create exchange items array
      const exchangeItems = [{
        systemId: uuidv4(),
        productSystemId: newProductSystemId,
        productId: newProduct.id,
        productName: newProduct.name,
        productSku: newProduct.id,
        quantity: newQuantity,
        unitPrice: newProductPrice,
        total: exchangeTotal,
      }];

      // Update sales return with exchange information
      const updatedReturn = await tx.salesReturn.update({
        where: { systemId },
        data: {
          status: 'COMPLETED',
          exchangeItems: exchangeItems,
          exchangeOrderSystemId: null, // Could create a new order here
          grandTotalNew: exchangeTotal,
          subtotalNew: exchangeTotal,
          finalAmount: (additionalPayment || 0) - Number(salesReturn.total),
          notes: notes ? `${salesReturn.notes || ''}\nExchange: ${notes}` : salesReturn.notes,
          updatedAt: new Date(),
          updatedBy: session.user?.id || null,
        },
        select: {
          systemId: true,
          id: true,
          status: true,
          exchangeItems: true,
          exchangeOrderSystemId: true,
          grandTotalNew: true,
          subtotalNew: true,
          finalAmount: true,
          notes: true,
          updatedAt: true,
          employeeId: true,
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

      // Update inventory for returned items (add back to stock)
      for (const item of salesReturn.items) {
        if (!item.productId) continue;
        
        const itemInventory = await tx.productInventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: branchId,
            },
          },
        });

        const oldStock = itemInventory?.onHand || 0;
        const newStock = oldStock + item.quantity;

        if (itemInventory) {
          await tx.productInventory.update({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: branchId,
              },
            },
            data: {
              onHand: { increment: item.quantity },
              updatedAt: new Date(),
            },
          });
        } else {
          await tx.productInventory.create({
            data: {
              productId: item.productId,
              branchId: branchId,
              onHand: item.quantity,
              committed: 0,
              inTransit: 0,
            },
          });
        }
        
        // ✅ Create stock history record for returned item
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            branchId: branchId,
            action: 'Nhập kho đổi hàng',
            source: 'Phiếu trả hàng',
            quantityChange: item.quantity,
            newStockLevel: newStock,
            documentId: salesReturn.id,
            documentType: 'sales_return',
            employeeId: session.user?.id,
            employeeName: session.user?.name || undefined,
            note: `Nhập kho hàng đổi - ${item.productName || item.productId}`,
          },
        });
      }

      // Get current inventory for new product to calculate new stock level
      const newProductInventory = await tx.productInventory.findUnique({
        where: {
          productId_branchId: {
            productId: newProductSystemId,
            branchId: branchId,
          },
        },
      });
      const newProductOldStock = newProductInventory?.onHand || 0;
      const newProductNewStock = Math.max(0, newProductOldStock - newQuantity);

      // Update inventory for new product (subtract from stock)
      // ✅ Update inventory for new product - only decrement onHand (stock out)
      // No need to increment committed since we're immediately giving it to customer
      await tx.productInventory.update({
        where: {
          productId_branchId: {
            productId: newProductSystemId,
            branchId: branchId,
          },
        },
        data: {
          onHand: { decrement: newQuantity },
          updatedAt: new Date(),
        },
      });
      
      // ✅ Create stock history record for exchange out item
      await tx.stockHistory.create({
        data: {
          productId: newProductSystemId,
          branchId: branchId,
          action: 'Xuất kho đổi hàng',
          source: 'Phiếu trả hàng',
          quantityChange: -newQuantity,
          newStockLevel: newProductNewStock,
          documentId: salesReturn.id,
          documentType: 'sales_return',
          employeeId: session.user?.id,
          employeeName: session.user?.name || undefined,
          note: `Xuất kho hàng đổi cho khách - ${newProductSystemId}`,
        },
      });

      return updatedReturn;
    });

    // Notify employee about exchange processed
    if (result.employeeId && result.employeeId !== session.user?.employeeId) {
      createNotification({
        type: 'sales_return',
        settingsKey: 'sales-return:updated',
        title: 'Đổi hàng hoàn tất',
        message: `Phếu trả hàng ${result.id || systemId} đã được đổi hàng`,
        link: `/sales-returns/${systemId}`,
        recipientId: result.employeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Sales Return Exchange] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'sales_return',
          entityId: systemId,
          action: 'exchanged',
          actionType: 'update',
          note: `Đổi hàng`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] sales_return exchanged failed', e))

    return apiSuccess({
      ...result,
      exchangeSummary: {
        originalValue: Number(salesReturn.total),
        newValue: exchangeTotal,
        additionalPayment: additionalPayment || 0,
        finalAmount: (additionalPayment || 0) - Number(salesReturn.total),
      },
    });
  } catch (error) {
    logError('[Sales Returns Exchange API] POST error', error);
    if (error instanceof Error) {
      return apiError(error.message, 500);
    }
    return apiError('Failed to process exchange', 500);
  }
}
