/**
 * Update Product Inventory API
 * PATCH /api/products/[systemId]/inventory - Update product stock for a specific branch
 * 
 * Used for receiving goods, stock adjustments, etc.
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { z } from 'zod'
import { generateIdWithPrefix } from '@/lib/id-generator'

const updateInventorySchema = z.object({
  branchSystemId: z.string(),
  quantityChange: z.number(), // Can be positive (add) or negative (reduce)
  reason: z.string().optional(),
  source: z.string().optional(), // e.g., 'inventory_receipt', 'stock_check', 'manual_adjustment'
  referenceId: z.string().optional(), // e.g., inventoryReceiptSystemId
  userId: z.string().optional(),
  userName: z.string().optional(),
})

interface RouteParams {
  params: Promise<{ systemId: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateInventorySchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const { branchSystemId, quantityChange, reason, source, referenceId, userId, userName } = validation.data

  try {
    const { systemId: productSystemId } = await params

    // Fetch product to check if it exists
    const product = await prisma.product.findUnique({
      where: { systemId: productSystemId },
      select: {
        systemId: true,
        id: true,
        name: true,
        type: true,
      },
    })

    if (!product) {
      return apiError('Sản phẩm không tồn tại', 404)
    }

    // Skip if product is service type
    if (product.type === 'SERVICE') {
      return apiSuccess({ 
        product, 
        message: 'Sản phẩm dịch vụ không theo dõi tồn kho' 
      })
    }

    // Verify branch exists
    const branch = await prisma.branch.findUnique({
      where: { systemId: branchSystemId },
      select: { systemId: true, name: true },
    })

    if (!branch) {
      return apiError('Chi nhánh không tồn tại', 404)
    }

    // Update inventory in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Find or create ProductInventory for this product/branch combination
      let productInventory = await tx.productInventory.findUnique({
        where: {
          productId_branchId: {
            productId: productSystemId,
            branchId: branchSystemId,
          },
        },
      })

      const oldStock = productInventory ? productInventory.onHand : 0
      const newStock = oldStock + quantityChange

      if (productInventory) {
        // Update existing inventory
        productInventory = await tx.productInventory.update({
          where: {
            productId_branchId: {
              productId: productSystemId,
              branchId: branchSystemId,
            },
          },
          data: { onHand: newStock },
        })
      } else {
        // Create new inventory record
        productInventory = await tx.productInventory.create({
          data: {
            productId: productSystemId,
            branchId: branchSystemId,
            onHand: newStock,
            inTransit: 0,
            committed: 0,
          },
        })
      }

      // Create StockHistory entry if significant change
      if (quantityChange !== 0) {
        // Determine action based on source type
        let action = quantityChange > 0 ? 'Nhập hàng' : 'Xuất hàng';
        if (source === 'inventory_check') {
          action = 'Cân bằng kho';
        } else if (source === 'stock_transfer') {
          action = quantityChange > 0 ? 'Nhập chuyển kho' : 'Xuất chuyển kho';
        }
        
        await tx.stockHistory.create({
          data: {
            systemId: await generateIdWithPrefix('STH', tx as unknown as typeof prisma),
            productId: productSystemId,
            branchId: branchSystemId,
            action,
            source: source || 'manual_adjustment',
            quantityChange,
            newStockLevel: newStock,
            documentId: referenceId || null,
            documentType: source || 'manual',
            employeeId: userId || null,
            employeeName: userName || 'Hệ thống',
            note: reason || null,
            createdAt: new Date(),
          },
        })
      }

      return {
        productInventory,
        oldStock,
        newStock,
        quantityChange,
      }
    })

    return apiSuccess(result)
  } catch (error) {
    console.error('Error updating product inventory:', error)
    return apiError('Failed to update inventory', 500)
  }
}
