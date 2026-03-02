'use server';

import prisma from '@/lib/prisma';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface CustomerDebtInfo {
  systemId: string;
  name: string;
  phone: string | null;
  email: string | null;
  paymentTerms: string | null;
  currentDebt: number;
}

export interface CustomerDebtResponse {
  data: CustomerDebtInfo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get debt for a single customer
 */
export async function getCustomerDebt(
  customerSystemId: string
): Promise<ActionResult<number>> {
  try {
    // Calculate debt from orders - (total - paid amount)
    const orders = await prisma.order.findMany({
      where: {
        customerId: customerSystemId,
        status: { notIn: ['CANCELLED', 'RETURNED'] },
      },
      select: {
        grandTotal: true,
        paidAmount: true,
      },
    });

    const debt = orders.reduce((sum, order) => {
      const total = order.grandTotal?.toNumber() || 0;
      const paid = order.paidAmount?.toNumber() || 0;
      return sum + (total - paid);
    }, 0);

    return { success: true, data: debt };
  } catch (error) {
    console.error('Failed to get customer debt:', error);
    return { success: false, error: 'Không thể tính công nợ khách hàng' };
  }
}

/**
 * Get all customers with their debt
 */
export async function getAllCustomersDebt(
  options: { page?: number; limit?: number } = {}
): Promise<ActionResult<CustomerDebtResponse>> {
  try {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    // Get customers with unpaid orders
    const customersWithDebt = await prisma.customer.findMany({
      where: {
        orders: {
          some: {
            status: { notIn: ['CANCELLED', 'RETURNED'] },
          },
        },
      },
      select: {
        systemId: true,
        name: true,
        phone: true,
        email: true,
        paymentTerms: true,
        orders: {
          where: {
            status: { notIn: ['CANCELLED', 'RETURNED'] },
          },
          select: {
            grandTotal: true,
            paidAmount: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    });

    const total = await prisma.customer.count({
      where: {
        orders: {
          some: {
            status: { notIn: ['CANCELLED', 'RETURNED'] },
          },
        },
      },
    });

    const data: CustomerDebtInfo[] = customersWithDebt
      .map((customer) => {
        const currentDebt = customer.orders.reduce((sum, order) => {
          const total = order.grandTotal?.toNumber() || 0;
          const paid = order.paidAmount?.toNumber() || 0;
          return sum + (total - paid);
        }, 0);

        return {
          systemId: customer.systemId,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          paymentTerms: customer.paymentTerms,
          currentDebt,
        };
      })
      .filter((c) => c.currentDebt > 0); // Only show customers with positive debt

    return {
      success: true,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('Failed to get all customers debt:', error);
    return { success: false, error: 'Không thể tải danh sách công nợ' };
  }
}

/**
 * Get customers with debt exceeding a threshold
 */
export async function getCustomersWithHighDebt(
  threshold: number = 1000000
): Promise<ActionResult<CustomerDebtInfo[]>> {
  try {
    const customersWithDebt = await prisma.customer.findMany({
      where: {
        orders: {
          some: {
            status: { notIn: ['CANCELLED', 'RETURNED'] },
          },
        },
      },
      select: {
        systemId: true,
        name: true,
        phone: true,
        email: true,
        paymentTerms: true,
        orders: {
          where: {
            status: { notIn: ['CANCELLED', 'RETURNED'] },
          },
          select: {
            grandTotal: true,
            paidAmount: true,
          },
        },
      },
    });

    const data: CustomerDebtInfo[] = customersWithDebt
      .map((customer) => {
        const currentDebt = customer.orders.reduce((sum, order) => {
          const total = order.grandTotal?.toNumber() || 0;
          const paid = order.paidAmount?.toNumber() || 0;
          return sum + (total - paid);
        }, 0);

        return {
          systemId: customer.systemId,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          paymentTerms: customer.paymentTerms,
          currentDebt,
        };
      })
      .filter((c) => c.currentDebt >= threshold)
      .sort((a, b) => b.currentDebt - a.currentDebt);

    return { success: true, data };
  } catch (error) {
    console.error('Failed to get high debt customers:', error);
    return { success: false, error: 'Không thể tải danh sách công nợ cao' };
  }
}

/**
 * Get total debt across all customers
 */
export async function getTotalCustomerDebt(): Promise<ActionResult<number>> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: { notIn: ['CANCELLED', 'RETURNED'] },
      },
      select: {
        grandTotal: true,
        paidAmount: true,
      },
    });

    const totalDebt = orders.reduce((sum, order) => {
      const total = order.grandTotal?.toNumber() || 0;
      const paid = order.paidAmount?.toNumber() || 0;
      const debt = total - paid;
      return sum + (debt > 0 ? debt : 0);
    }, 0);

    return { success: true, data: totalDebt };
  } catch (error) {
    console.error('Failed to get total debt:', error);
    return { success: false, error: 'Không thể tính tổng công nợ' };
  }
}
