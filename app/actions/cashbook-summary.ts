'use server';

import prisma from '@/lib/prisma';
import type { SystemId } from '@/lib/id-types';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface CashbookParams {
  startDate?: string;
  endDate?: string;
  branchId?: string;
  accountId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CashbookTransaction {
  systemId: SystemId;
  id: string;
  date: Date | string;
  amount: number;
  description?: string | null;
  targetName?: string | null;
  accountSystemId: string;
  branchSystemId?: string | null;
  branchName?: string | null;
  status: string;
  paymentMethodName?: string | null;
  paymentReceiptTypeName?: string | null;
  originalDocumentId?: string | null;
  createdBy?: string | null;
  createdAt: Date | string;
  type: 'receipt' | 'payment';
}

export interface CashbookSummary {
  openingBalance: number;
  totalReceipts: number;
  totalPayments: number;
  closingBalance: number;
}

export interface CashbookResponse {
  transactions: CashbookTransaction[];
  summary: CashbookSummary;
  pagination: {
    page: number;
    limit: number;
    totalReceipts: number;
    totalPayments: number;
    total: number;
  };
}

/**
 * Get cashbook data with summary
 */
export async function getCashbook(
  params: CashbookParams = {}
): Promise<ActionResult<CashbookResponse>> {
  try {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const dateFilter: Record<string, unknown> = {};
    if (params.startDate) dateFilter.gte = new Date(params.startDate);
    if (params.endDate) dateFilter.lte = new Date(params.endDate);

    // Build where clauses for receipts and payments
    const receiptWhere: Record<string, unknown> = { status: { not: 'cancelled' } };
    const paymentWhere: Record<string, unknown> = { status: { not: 'cancelled' } };

    if (params.startDate || params.endDate) {
      receiptWhere.receiptDate = dateFilter;
      paymentWhere.paymentDate = dateFilter;
    }
    if (params.branchId) {
      receiptWhere.branchSystemId = params.branchId;
      paymentWhere.branchSystemId = params.branchId;
    }
    if (params.accountId) {
      receiptWhere.accountSystemId = params.accountId;
      paymentWhere.accountSystemId = params.accountId;
    }

    // Fetch receipts and payments
    const [receipts, payments, receiptCount, paymentCount] = await Promise.all([
      prisma.receipt.findMany({
        where: receiptWhere,
        orderBy: { receiptDate: 'desc' },
      }),
      prisma.payment.findMany({
        where: paymentWhere,
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.receipt.count({ where: receiptWhere }),
      prisma.payment.count({ where: paymentWhere }),
    ]);

    // Transform to transactions
    const transactions: CashbookTransaction[] = [
      ...receipts.map((r) => ({
        systemId: r.systemId as SystemId,
        id: r.id,
        date: r.receiptDate,
        amount: r.amount.toNumber(),
        description: r.description,
        targetName: r.payerName || r.customerName,
        accountSystemId: r.accountSystemId || '',
        branchSystemId: r.branchSystemId,
        branchName: r.branchName || null,
        status: r.status,
        paymentMethodName: r.paymentMethodName || null,
        paymentReceiptTypeName: r.paymentReceiptTypeName || null,
        originalDocumentId: r.originalDocumentId,
        createdBy: r.createdBy,
        createdAt: r.createdAt,
        type: 'receipt' as const,
      })),
      ...payments.map((p) => ({
        systemId: p.systemId as SystemId,
        id: p.id,
        date: p.paymentDate,
        amount: p.amount.toNumber(),
        description: p.description,
        targetName: p.recipientName || p.customerName,
        accountSystemId: p.accountSystemId || '',
        branchSystemId: p.branchSystemId,
        branchName: p.branchName || null,
        status: p.status,
        paymentMethodName: p.paymentMethodName || null,
        paymentReceiptTypeName: p.paymentReceiptTypeName || null,
        originalDocumentId: p.originalDocumentId,
        createdBy: p.createdBy,
        createdAt: p.createdAt,
        type: 'payment' as const,
      })),
    ];

    // Sort by date descending
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Paginate
    const paginatedTransactions = transactions.slice(skip, skip + limit);

    // Calculate summary
    const totalReceipts = receipts.reduce((sum, r) => sum + r.amount.toNumber(), 0);
    const totalPayments = payments.reduce((sum, p) => sum + p.amount.toNumber(), 0);

    // Get opening balance (transactions before startDate)
    let openingBalance = 0;
    if (params.startDate) {
      const [priorReceipts, priorPayments] = await Promise.all([
        prisma.receipt.aggregate({
          where: {
            receiptDate: { lt: new Date(params.startDate) },
            status: { not: 'cancelled' },
            ...(params.branchId && { branchSystemId: params.branchId }),
            ...(params.accountId && { accountSystemId: params.accountId }),
          },
          _sum: { amount: true },
        }),
        prisma.payment.aggregate({
          where: {
            paymentDate: { lt: new Date(params.startDate) },
            status: { not: 'cancelled' },
            ...(params.branchId && { branchSystemId: params.branchId }),
            ...(params.accountId && { accountSystemId: params.accountId }),
          },
          _sum: { amount: true },
        }),
      ]);
      openingBalance =
        (priorReceipts._sum?.amount?.toNumber() || 0) -
        (priorPayments._sum?.amount?.toNumber() || 0);
    }

    return {
      success: true,
      data: {
        transactions: paginatedTransactions,
        summary: {
          openingBalance,
          totalReceipts,
          totalPayments,
          closingBalance: openingBalance + totalReceipts - totalPayments,
        },
        pagination: {
          page,
          limit,
          totalReceipts: receiptCount,
          totalPayments: paymentCount,
          total: receiptCount + paymentCount,
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch cashbook:', error);
    return { success: false, error: 'Không thể tải sổ quỹ' };
  }
}

/**
 * Get cashbook summary only (without transactions)
 */
export async function getCashbookSummary(
  params: { startDate?: string; endDate?: string; branchId?: string; accountId?: string } = {}
): Promise<ActionResult<CashbookSummary>> {
  try {
    const receiptDateFilter: Record<string, unknown> = {};
    const paymentDateFilter: Record<string, unknown> = {};
    if (params.startDate) {
      receiptDateFilter.gte = new Date(params.startDate);
      paymentDateFilter.gte = new Date(params.startDate);
    }
    if (params.endDate) {
      receiptDateFilter.lte = new Date(params.endDate);
      paymentDateFilter.lte = new Date(params.endDate);
    }

    const receiptWhereBase = {
      status: { not: 'cancelled' },
      ...(params.startDate || params.endDate ? { receiptDate: receiptDateFilter } : {}),
      ...(params.branchId && { branchSystemId: params.branchId }),
      ...(params.accountId && { accountSystemId: params.accountId }),
    };

    const paymentWhereBase = {
      status: { not: 'cancelled' },
      ...(params.startDate || params.endDate ? { paymentDate: paymentDateFilter } : {}),
      ...(params.branchId && { branchSystemId: params.branchId }),
      ...(params.accountId && { accountSystemId: params.accountId }),
    };

    const [receiptsSum, paymentsSum] = await Promise.all([
      prisma.receipt.aggregate({ where: receiptWhereBase, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: paymentWhereBase, _sum: { amount: true } }),
    ]);

    const totalReceipts = receiptsSum._sum?.amount?.toNumber() || 0;
    const totalPayments = paymentsSum._sum?.amount?.toNumber() || 0;

    // Get opening balance
    let openingBalance = 0;
    if (params.startDate) {
      const [priorReceipts, priorPayments] = await Promise.all([
        prisma.receipt.aggregate({
          where: {
            receiptDate: { lt: new Date(params.startDate) },
            status: { not: 'cancelled' },
            ...(params.branchId && { branchSystemId: params.branchId }),
            ...(params.accountId && { accountSystemId: params.accountId }),
          },
          _sum: { amount: true },
        }),
        prisma.payment.aggregate({
          where: {
            paymentDate: { lt: new Date(params.startDate) },
            status: { not: 'cancelled' },
            ...(params.branchId && { branchSystemId: params.branchId }),
            ...(params.accountId && { accountSystemId: params.accountId }),
          },
          _sum: { amount: true },
        }),
      ]);
      openingBalance =
        (priorReceipts._sum?.amount?.toNumber() || 0) -
        (priorPayments._sum?.amount?.toNumber() || 0);
    }

    return {
      success: true,
      data: {
        openingBalance,
        totalReceipts,
        totalPayments,
        closingBalance: openingBalance + totalReceipts - totalPayments,
      },
    };
  } catch (error) {
    console.error('Failed to fetch cashbook summary:', error);
    return { success: false, error: 'Không thể tải tổng hợp sổ quỹ' };
  }
}
