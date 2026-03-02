/**
 * Inventory Service
 * 
 * Business logic for inventory management
 * Handles stock movements, reservations, and adjustments
 */

import prisma from '@/lib/prisma';
import { revalidateTag } from '@/lib/revalidation';

// Types
export type StockMovementType = 
  | 'IN_PURCHASE'      // Nhập từ mua hàng
  | 'IN_TRANSFER'      // Nhập từ chuyển kho
  | 'IN_RETURN'        // Nhập từ trả hàng
  | 'IN_ADJUSTMENT'    // Nhập từ điều chỉnh
  | 'OUT_SALE'         // Xuất bán hàng
  | 'OUT_TRANSFER'     // Xuất chuyển kho
  | 'OUT_RETURN'       // Xuất trả nhà cung cấp
  | 'OUT_ADJUSTMENT';  // Xuất từ điều chỉnh

export interface StockMovementInput {
  productSystemId: string;
  branchSystemId: string;
  quantity: number;
  type: StockMovementType;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
}

/**
 * Inventory Service
 */
export const inventoryService = {
  /**
   * Reserve stock for pending orders
   * Increases "committed" field
   */
  async reserveStock(
    items: Array<{ productSystemId: string; quantity: number }>,
    branchId: string
  ) {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        // Check available stock
        const inventory = await tx.productInventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productSystemId,
              branchId,
            },
          },
        });

        if (!inventory) {
          throw new Error(`Sản phẩm ${item.productSystemId} chưa có tồn kho tại chi nhánh`);
        }

        const available = inventory.onHand - inventory.committed;
        if (available < item.quantity) {
          throw new Error(
            `Không đủ tồn kho. Còn lại: ${available}, Yêu cầu: ${item.quantity}`
          );
        }

        // Reserve (increase committed)
        await tx.productInventory.update({
          where: {
            productId_branchId: {
              productId: item.productSystemId,
              branchId,
            },
          },
          data: {
            committed: { increment: item.quantity },
          },
        });
      }
    });

    revalidateTag('inventory', 'default');
  },

  /**
   * Release reserved stock (when order is cancelled)
   */
  async releaseStock(
    items: Array<{ productSystemId: string; quantity: number }>,
    branchId: string
  ) {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.productInventory.update({
          where: {
            productId_branchId: {
              productId: item.productSystemId,
              branchId,
            },
          },
          data: {
            committed: { decrement: item.quantity },
          },
        });
      }
    });

    revalidateTag('inventory', 'default');
  },

  /**
   * Deduct stock when order is shipped/completed
   * Decreases both "onHand" and "committed"
   */
  async deductStock(
    items: Array<{ productSystemId: string; quantity: number }>,
    branchId: string,
    referenceType: string,
    referenceId: string,
    userId: string
  ) {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        // Update inventory
        await tx.productInventory.update({
          where: {
            productId_branchId: {
              productId: item.productSystemId,
              branchId,
            },
          },
          data: {
            onHand: { decrement: item.quantity },
            committed: { decrement: item.quantity },
          },
        });

        // Update product totals
        await this.updateProductTotals(tx, item.productSystemId);

        // Create stock history
        await tx.stockHistory.create({
          data: {
            productId: item.productSystemId,
            branchId: branchId,
            action: 'Xuất kho bán hàng',
            source: referenceType,
            quantityChange: -item.quantity,
            documentType: referenceType,
            documentId: referenceId,
            note: `Xuất bán - ${referenceId}`,
            employeeId: userId,
          },
        });
      }
    });

    revalidateTag('inventory', 'default');
    revalidateTag('products', 'default');
  },

  /**
   * Add stock (purchase, return, adjustment)
   */
  async addStock(input: StockMovementInput, userId: string) {
    const { productSystemId, branchSystemId, quantity, type, referenceType, referenceId, notes } = input;

    await prisma.$transaction(async (tx) => {
      // Upsert inventory record
      await tx.productInventory.upsert({
        where: {
          productId_branchId: {
            productId: productSystemId,
            branchId: branchSystemId,
          },
        },
        create: {
          productId: productSystemId,
          branchId: branchSystemId,
          onHand: quantity,
          committed: 0,
          inTransit: 0,
          inDelivery: 0,
        },
        update: {
          onHand: { increment: quantity },
        },
      });

      // Update product totals
      await this.updateProductTotals(tx, productSystemId);

      // Create stock history
      await tx.stockHistory.create({
        data: {
          productId: productSystemId,
          branchId: branchSystemId,
          action: type,
          source: referenceType,
          quantityChange: quantity,
          documentType: referenceType,
          documentId: referenceId,
          note: notes,
          employeeId: userId,
        },
      });
    });

    revalidateTag('inventory', 'default');
    revalidateTag('products', 'default');
  },

  /**
   * Transfer stock between branches
   */
  async transferStock(
    productSystemId: string,
    fromBranchId: string,
    toBranchId: string,
    quantity: number,
    referenceId: string,
    userId: string
  ) {
    await prisma.$transaction(async (tx) => {
      // Check source stock
      const sourceInventory = await tx.productInventory.findUnique({
        where: {
          productId_branchId: {
            productId: productSystemId,
            branchId: fromBranchId,
          },
        },
      });

      if (!sourceInventory || sourceInventory.onHand < quantity) {
        throw new Error('Không đủ tồn kho để chuyển');
      }

      // Deduct from source
      await tx.productInventory.update({
        where: {
          productId_branchId: {
            productId: productSystemId,
            branchId: fromBranchId,
          },
        },
        data: {
          onHand: { decrement: quantity },
        },
      });

      // Add to destination
      await tx.productInventory.upsert({
        where: {
          productId_branchId: {
            productId: productSystemId,
            branchId: toBranchId,
          },
        },
        create: {
          productId: productSystemId,
          branchId: toBranchId,
          onHand: quantity,
          committed: 0,
          inTransit: 0,
          inDelivery: 0,
        },
        update: {
          onHand: { increment: quantity },
        },
      });

      // Update product totals
      await this.updateProductTotals(tx, productSystemId);

      // Create stock history for both branches
      await tx.stockHistory.createMany({
        data: [
          {
            productId: productSystemId,
            branchId: fromBranchId,
            action: 'Xuất kho chuyển kho',
            source: 'Phiếu chuyển kho',
            quantityChange: -quantity,
            documentType: 'StockTransfer',
            documentId: referenceId,
            note: `Chuyển đến ${toBranchId}`,
            employeeId: userId,
          },
          {
            productId: productSystemId,
            branchId: toBranchId,
            action: 'Nhập kho chuyển kho',
            source: 'Phiếu chuyển kho',
            quantityChange: quantity,
            documentType: 'StockTransfer',
            documentId: referenceId,
            note: `Nhận từ ${fromBranchId}`,
            employeeId: userId,
          },
        ],
      });
    });

    revalidateTag('inventory', 'default');
    revalidateTag('products', 'default');
  },

  /**
   * Get available stock (onHand - committed)
   */
  async getAvailableStock(productSystemId: string, branchId?: string) {
    const where: { productId: string; branchId?: string } = { productId: productSystemId };
    if (branchId) {
      where.branchId = branchId;
    }

    const inventories = await prisma.productInventory.findMany({
      where,
      select: {
        branchId: true,
        onHand: true,
        committed: true,
      },
    });

    if (branchId) {
      const inv = inventories[0];
      return inv ? inv.onHand - inv.committed : 0;
    }

    return inventories.reduce((sum, inv) => sum + (inv.onHand - inv.committed), 0);
  },

  /**
   * Check if product has enough stock
   */
  async hasStock(productSystemId: string, branchId: string, requiredQuantity: number) {
    const available = await this.getAvailableStock(productSystemId, branchId);
    return available >= requiredQuantity;
  },

  // ==================== Private Methods ====================

  /**
   * Update product's totalInventory, totalCommitted, totalAvailable
   */
  async updateProductTotals(tx: { productInventory: { findMany: typeof prisma.productInventory.findMany }; product: { update: typeof prisma.product.update } }, productSystemId: string) {
    const inventories = await tx.productInventory.findMany({
      where: { productId: productSystemId },
      select: { onHand: true, committed: true },
    });

    type InventoryItem = { onHand: number; committed: number };
    const totalInventory = inventories.reduce((sum: number, i: InventoryItem) => sum + i.onHand, 0);
    const totalCommitted = inventories.reduce((sum: number, i: InventoryItem) => sum + i.committed, 0);

    await tx.product.update({
      where: { systemId: productSystemId },
      data: {
        totalInventory,
        totalCommitted,
        totalAvailable: totalInventory - totalCommitted,
        inventoryUpdatedAt: new Date(),
      },
    });
  },
};
