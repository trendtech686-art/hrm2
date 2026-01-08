/**
 * Cash Transaction Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single cash transaction
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    const cashTransaction = await prisma.cashTransaction.findUnique({
      where: { systemId },
      include: {
        cash_accounts: true,
      },
    });

    if (!cashTransaction) {
      return apiNotFound('Cash transaction');
    }

    return apiSuccess(cashTransaction);
  } catch (error) {
    console.error('[Cash Transactions API] GET by ID error:', error);
    return apiError('Failed to fetch cash transaction', 500);
  }
}

// DELETE - Delete cash transaction (and reverse balance)
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    // Get transaction first to know the amount to reverse
    const transaction = await prisma.cashTransaction.findUnique({
      where: { systemId },
    });

    if (!transaction) {
      return apiNotFound('Cash transaction');
    }

    // Delete transaction and reverse balance
    await prisma.$transaction(async (tx) => {
      // Reverse the balance change
      const balanceChange = transaction.type === 'INCOME' 
        ? -Number(transaction.amount) 
        : Number(transaction.amount);
      
      await tx.cashAccount.update({
        where: { systemId: transaction.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });

      await tx.cashTransaction.delete({
        where: { systemId },
      });
    });

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Cash Transactions API] DELETE error:', error);
    return apiError('Failed to delete cash transaction', 500);
  }
}
