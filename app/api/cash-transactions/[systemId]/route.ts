/**
 * Cash Transaction Detail API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single cash transaction
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    const cashTransaction = await prisma.cashTransaction.findUnique({
      where: { systemId },
      include: {
        cash_accounts: true,
      },
    });

    if (!cashTransaction) {
      return NextResponse.json(
        { error: 'Cash transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(cashTransaction);
  } catch (error) {
    console.error('[Cash Transactions API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cash transaction' },
      { status: 500 }
    );
  }
}

// DELETE - Delete cash transaction (and reverse balance)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    // Get transaction first to know the amount to reverse
    const transaction = await prisma.cashTransaction.findUnique({
      where: { systemId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Cash transaction not found' },
        { status: 404 }
      );
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Cash Transactions API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete cash transaction' },
      { status: 500 }
    );
  }
}
