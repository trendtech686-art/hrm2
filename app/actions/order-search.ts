'use server';

import prisma from '@/lib/prisma';
import type { Order } from '@/lib/types/prisma-extended';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface OrderSearchResult {
  value: string;
  label: string;
  subtitle?: string;
}

export interface OrderSearchParams {
  query: string;
  limit?: number;
  branchSystemId?: string;
  status?: string;
}

/**
 * Search orders with server-side filtering
 */
export async function searchOrders(
  params: OrderSearchParams
): Promise<ActionResult<OrderSearchResult[]>> {
  try {
    const { query, limit = 50, branchSystemId, status } = params;

    const where: Record<string, unknown> = {};

    if (branchSystemId) where.branchSystemId = branchSystemId;
    if (status) where.status = status;

    if (query) {
      where.OR = [
        { id: { contains: query, mode: 'insensitive' } },
        { customerName: { contains: query, mode: 'insensitive' } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      select: {
        systemId: true,
        id: true,
        customerName: true,
        grandTotal: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const results: OrderSearchResult[] = orders.map((order) => ({
      value: order.systemId,
      label: `${order.id} - ${order.customerName || 'Khách lẻ'}`,
      subtitle: `${(order.grandTotal?.toNumber() || 0).toLocaleString('vi-VN')} đ`,
    }));

    return { success: true, data: results };
  } catch (error) {
    console.error('Failed to search orders:', error);
    return { success: false, error: 'Không thể tìm kiếm đơn hàng' };
  }
}

/**
 * Get order by ID for quick lookup
 */
export async function getOrderById(
  systemId: string
): Promise<ActionResult<Order | null>> {
  try {
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        customer: true,
        branch: true,
        lineItems: {
          include: {
            product: true,
          },
        },
        payments: true,
        packagings: true,
      },
    });

    return { success: true, data: order as Order | null };
  } catch (error) {
    console.error('Failed to get order:', error);
    return { success: false, error: 'Không thể tải đơn hàng' };
  }
}

/**
 * Get recent orders for a customer
 */
export async function getCustomerRecentOrders(
  customerId: string,
  limit: number = 10
): Promise<ActionResult<OrderSearchResult[]>> {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId },
      select: {
        systemId: true,
        id: true,
        customerName: true,
        grandTotal: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const results: OrderSearchResult[] = orders.map((order) => ({
      value: order.systemId,
      label: `${order.id} - ${new Date(order.createdAt).toLocaleDateString('vi-VN')}`,
      subtitle: `${(order.grandTotal?.toNumber() || 0).toLocaleString('vi-VN')} đ - ${order.status}`,
    }));

    return { success: true, data: results };
  } catch (error) {
    console.error('Failed to get customer orders:', error);
    return { success: false, error: 'Không thể tải đơn hàng của khách' };
  }
}
