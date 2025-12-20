/**
 * WarrantyProcessingCard
 * 
 * Card xử lý bảo hành - Hiển thị các action và lịch sử thanh toán
 * REFACTORED: Logic tách ra warranty-processing-logic
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { WarrantyPaymentVoucherDialog, WarrantyReceiptVoucherDialog } from '../dialogs/index';
import { useAuth } from '../../../../contexts/auth-context';
import { formatDateTimeForDisplay } from '@/lib/date-utils';
import type { WarrantyTicket } from '../../types';
import { useWarrantyTransactionGroups } from '../../hooks/use-warranty-transaction-groups';
import type { WarrantySettlementState } from '../../hooks/use-warranty-settlement';
import { WarrantyTransactionGroups } from '../sections/index';
import type { Order } from '../../../orders/types';
import type { WarrantyCustomerInfo } from '../../types';

interface WarrantyProcessingCardProps {
  warrantyId: string;
  warrantySystemId: string;
  customer: WarrantyCustomerInfo;
  linkedOrderSystemId?: string | undefined;
  branchSystemId?: string | undefined;
  branchName?: string | undefined;
  ticket?: WarrantyTicket | undefined; // Add ticket to get cancelReason
  settlement: WarrantySettlementState;
  orders: Order[];
}

export function WarrantyProcessingCard({
  warrantyId,
  warrantySystemId,
  customer,
  linkedOrderSystemId,
  branchSystemId,
  branchName,
  ticket,
  settlement,
  orders,
}: WarrantyProcessingCardProps) {
  const { user } = useAuth();

  const {
    totalPayment,
    processingState: settlementState,
    settlementMethods,
  } = settlement;

  // DEBUG: Log để kiểm tra
  React.useEffect(() => {
    console.log('💳 [WARRANTY PROCESSING CARD] State:', {
      totalPayment,
      remainingAmount: settlementState.remainingAmount,
      totalPayments: settlementState.warrantyPayments.reduce((sum, p) => p.status !== 'cancelled' ? sum + p.amount : sum, 0),
      totalReceipts: settlementState.warrantyReceipts.reduce((sum, r) => r.status !== 'cancelled' ? sum + r.amount : sum, 0),
      paymentsCount: settlementState.warrantyPayments.length,
      receiptsCount: settlementState.warrantyReceipts.length,
      isFullyPaid: settlementState.remainingAmount <= 0
    });
  }, [settlementState, totalPayment]);

  // Get current user name and current time
  const currentUserName = user?.name || 'Người dùng';
  const currentTime = formatDateTimeForDisplay(new Date());

  const transactionGroups = useWarrantyTransactionGroups({
    ticket,
    warrantyPayments: settlementState.warrantyPayments,
    warrantyReceipts: settlementState.warrantyReceipts,
    currentUserName,
  });

  // ============================================================
  // SỬ DỤNG STATE TỪ LOGIC FILE - KHÔNG CẦN TÍNH LẠI
  // ============================================================
  
  // 1️⃣ Check điều kiện ẨN CARD
  if (settlementState.shouldHideCard) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Xử lý bảo hành
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Action Buttons - Hiện khi đã xử lý */}
          {settlementState.canShowActionButtons && (
            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/50 rounded-lg border">
              {/* Nút tạo phiếu chi - Hiện khi cần trả tiền khách */}
              {settlementState.canShowPaymentButton && (
                <WarrantyPaymentVoucherDialog
                  warrantyId={warrantyId}
                  warrantySystemId={warrantySystemId}
                  customer={customer}
                  defaultAmount={settlementState.remainingAmount} // Dùng số tiền còn lại
                  linkedOrderId={linkedOrderSystemId}
                  branchSystemId={branchSystemId}
                  branchName={branchName}
                  existingPayments={[]}
                />
              )}

              {/* Nút tạo phiếu thu - Hiện khi cần thu tiền khách */}
              {settlementState.canShowReceiptButton && (
                <WarrantyReceiptVoucherDialog
                  warrantyId={warrantyId}
                  warrantySystemId={warrantySystemId}
                  customer={customer}
                  defaultAmount={settlementState.remainingAmount} // Dùng số tiền còn lại
                  linkedOrderId={linkedOrderSystemId}
                  branchSystemId={branchSystemId}
                  branchName={branchName}
                  existingReceipts={[]}
                />
              )}
            </div>
          )}

          {settlementState.hasTransactions && (
            <WarrantyTransactionGroups
              groups={transactionGroups}
              totalPayment={totalPayment}
              orders={orders}
              settlementMethods={settlementMethods}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
