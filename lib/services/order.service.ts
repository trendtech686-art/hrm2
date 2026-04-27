/**
 * Order Service
 * 
 * Business logic layer for Orders
 * Separates business rules from data access (repositories)
 * 
 * Benefits:
 * - Centralized business logic
 * - Reusable across Server Actions and API routes
 * - Easier to test
 * - Clear separation of concerns
 */

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { OrderStatus } from '@/generated/prisma/enums';
import type { Prisma } from '@/generated/prisma/client';
import { generateIdWithPrefix } from '@/lib/id-generator';

// Types
export interface CreateOrderInput {
  customerId?: string;
  customerName: string;
  branchId: string;
  salespersonId: string;
  items: Array<{
    productSystemId: string;
    quantity: number;
    price: number;
    discount?: number;
  }>;
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  notes?: string;
  deliveryMethod?: string;
  expectedPaymentMethod?: string;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  discountType?: 'FIXED' | 'PERCENTAGE';
}

export interface UpdateOrderStatusInput {
  systemId: string;
  status: OrderStatus;
  reason?: string;
}

/**
 * Order Service - Business Logic
 */
export const orderService = {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderInput, userId: string) {
    // 1. Validate input
    this.validateCreateInput(data);

    // 2. Get branch and salesperson info
    const [branch, salesperson] = await Promise.all([
      prisma.branch.findUnique({
        where: { systemId: data.branchId },
        select: { systemId: true, name: true },
      }),
      prisma.employee.findUnique({
        where: { systemId: data.salespersonId },
        select: { systemId: true, fullName: true },
      }),
    ]);

    if (!branch) throw new Error('Chi nhánh không tồn tại');
    if (!salesperson) throw new Error('Nhân viên không tồn tại');

    // 3. Calculate totals
    const { subtotal, items } = await this.calculateOrderTotals(data.items, data.branchId);

    // 4. Generate order ID
    const orderId = await this.generateOrderId();

    // 5. Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          systemId: await generateIdWithPrefix('ORD', tx as unknown as typeof prisma),
          id: orderId,
          customerId: data.customerId,
          customerName: data.customerName,
          branchId: branch.systemId,
          branchName: branch.name,
          salespersonId: salesperson.systemId,
          salespersonName: salesperson.fullName,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          deliveryStatus: 'PENDING_PACK',
          deliveryMethod: (data.deliveryMethod || 'SHIPPING') as 'SHIPPING' | 'PICKUP',
          subtotal,
          // Calculate grandTotal: subtotal + shippingFee + tax - discount
          grandTotal: this.calculateGrandTotal(
            subtotal,
            data.shippingFee || 0,
            data.tax || 0,
            data.discount || 0,
            data.discountType
          ),
          shippingFee: data.shippingFee || 0,
          tax: data.tax || 0,
          discount: data.discount || 0,
          discountType: data.discountType,
          shippingAddress: data.shippingAddress as unknown as Prisma.InputJsonValue,
          billingAddress: data.billingAddress as unknown as Prisma.InputJsonValue,
          notes: data.notes,
          expectedPaymentMethod: data.expectedPaymentMethod,
          createdBy: userId,
          lineItems: {
            create: await Promise.all(items.map(async (item, index) => ({
              systemId: await generateIdWithPrefix('OLI', tx as unknown as typeof prisma),
              productSystemId: item.productSystemId,
              productId: item.productId,
              productSku: item.productSku,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.price,
              discount: item.discount || 0,
              total: item.total,
              sortOrder: index,
            }))),
          },
        },
        include: {
          lineItems: true,
        },
      });

      // Update inventory (commit stock)
      for (const item of items) {
        await tx.productInventory.update({
          where: {
            productId_branchId: {
              productId: item.productSystemId,
              branchId: data.branchId,
            },
          },
          data: {
            committed: { increment: item.quantity },
          },
        });
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          systemId: await generateIdWithPrefix('AL', tx as unknown as typeof prisma),
          entityType: 'order',
          entityId: newOrder.systemId,
          action: 'CREATE',
          changes: { status: 'PENDING' },
          userId,
          userAgent: 'server',
        },
      });

      return newOrder;
    });

    // 6. Invalidate caches
    revalidatePath('/orders');

    return order;
  },

  /**
   * Update order status
   */
  async updateStatus(input: UpdateOrderStatusInput, userId: string) {
    const { systemId, status, reason } = input;

    // 1. Get current order
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: { lineItems: true },
    });

    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    // 2. Validate status transition
    this.validateStatusTransition(order.status, status);

    // 3. Update with transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order
      const updated = await tx.order.update({
        where: { systemId },
        data: {
          status,
          ...(status === 'CANCELLED' && {
            cancelledDate: new Date(),
            cancellationReason: reason,
          }),
          ...(status === 'COMPLETED' && {
            completedDate: new Date(),
          }),
          ...(status === 'CONFIRMED' && {
            approvedDate: new Date(),
          }),
          updatedBy: userId,
        },
      });

      // Handle inventory changes based on status
      if (status === 'CANCELLED') {
        // Release committed stock
        for (const item of order.lineItems) {
          if (!item.productId) continue; // Skip items without product link
          await tx.productInventory.update({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: order.branchId,
              },
            },
            data: {
              committed: { decrement: item.quantity },
            },
          });
        }
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          systemId: await generateIdWithPrefix('AL', tx as unknown as typeof prisma),
          entityType: 'order',
          entityId: systemId,
          action: 'UPDATE_STATUS',
          changes: {
            oldStatus: order.status,
            newStatus: status,
            reason,
          },
          userId,
          userAgent: 'server',
        },
      });

      return updated;
    });

    // 4. Invalidate caches
    revalidatePath('/orders');
    revalidatePath(`/orders/${systemId}`);

    return updatedOrder;
  },

  /**
   * Cancel order
   */
  async cancelOrder(systemId: string, reason: string, userId: string) {
    return this.updateStatus(
      { systemId, status: 'CANCELLED', reason },
      userId
    );
  },

  // ==================== Private Methods ====================

  /**
   * Validate create input
   */
  validateCreateInput(data: CreateOrderInput) {
    if (!data.customerName?.trim()) {
      throw new Error('Tên khách hàng không được để trống');
    }
    if (!data.branchId) {
      throw new Error('Vui lòng chọn chi nhánh');
    }
    if (!data.salespersonId) {
      throw new Error('Vui lòng chọn nhân viên bán hàng');
    }
    if (!data.items?.length) {
      throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm');
    }
  },

  /**
   * Validate status transition
   */
  validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus) {
    const allowedTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['PACKING', 'COMPLETED', 'CANCELLED'],
      PACKING: ['PACKED', 'CANCELLED'],
      PACKED: ['READY_FOR_PICKUP', 'SHIPPING', 'CANCELLED'],
      READY_FOR_PICKUP: ['COMPLETED', 'CANCELLED'],
      SHIPPING: ['DELIVERED', 'FAILED_DELIVERY', 'CANCELLED'],
      DELIVERED: ['COMPLETED', 'RETURNED'],
      COMPLETED: [], // No transitions from completed
      FAILED_DELIVERY: ['SHIPPING', 'RETURNED', 'CANCELLED'],
      RETURNED: [],
      CANCELLED: [], // No transitions from cancelled
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Không thể chuyển trạng thái từ ${currentStatus} sang ${newStatus}`
      );
    }
  },

  /**
   * Calculate order totals and validate products
   */
  async calculateOrderTotals(
    items: CreateOrderInput['items'],
    branchId: string
  ) {
    const productIds = items.map((i) => i.productSystemId);

    // Get products with prices and inventory
    const products = await prisma.product.findMany({
      where: { systemId: { in: productIds } },
      select: {
        systemId: true,
        id: true,
        name: true,
        costPrice: true, // Use costPrice as fallback
        productInventory: {
          where: { branchId },
          select: { onHand: true, committed: true },
        },
      },
    });

    // Map for quick lookup
    const productMap = new Map(products.map((p) => [p.systemId, p]));

    let subtotal = 0;
    const enrichedItems = items.map((item) => {
      const product = productMap.get(item.productSystemId);
      if (!product) {
        throw new Error(`Sản phẩm ${item.productSystemId} không tồn tại`);
      }

      // Check stock
      const inv = product.productInventory[0];
      const available = (inv?.onHand || 0) - (inv?.committed || 0);
      if (available < item.quantity) {
        throw new Error(
          `Sản phẩm "${product.name}" không đủ tồn kho (còn ${available})`
        );
      }

      // Calculate total - use provided price or fallback to costPrice
      const price = item.price || Number(product.costPrice || 0);
      const discount = item.discount || 0;
      const total = (price - discount) * item.quantity;
      subtotal += total;

      return {
        productSystemId: product.systemId,
        productId: product.id,
        productSku: product.id,
        productName: product.name,
        quantity: item.quantity,
        price,
        discount,
        total,
      };
    });

    return { subtotal, items: enrichedItems };
  },

  /**
   * Generate unique order ID
   */
  async generateOrderId() {
    const today = new Date();
    const prefix = `DH${today.getFullYear().toString().slice(-2)}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

    // Get count for today
    const count = await prisma.order.count({
      where: {
        id: { startsWith: prefix },
      },
    });

    return `${prefix}-${String(count + 1).padStart(4, '0')}`;
  },

  /**
   * Calculate grand total from subtotal and additional fees
   * Formula: grandTotal = subtotal + shippingFee + tax - discount
   * For percentage discount, discount is already calculated as amount
   */
  calculateGrandTotal(
    subtotal: number,
    shippingFee: number,
    tax: number,
    discount: number,
    discountType?: 'FIXED' | 'PERCENTAGE'
  ): number {
    // Ensure all values are valid numbers
    const validSubtotal = Number(subtotal) || 0;
    const validShippingFee = Number(shippingFee) || 0;
    const validTax = Number(tax) || 0;
    const validDiscount = Number(discount) || 0;

    // Calculate: subtotal + shipping + tax - discount
    const grandTotal = validSubtotal + validShippingFee + validTax - validDiscount;

    // Grand total should never be negative
    return Math.max(0, grandTotal);
  },
};
