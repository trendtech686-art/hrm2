/**
 * WarrantyProcessingCard
 * 
 * Card xử lý bảo hành - Hiển thị các action và lịch sử thanh toán
 * REFACTORED: Logic tách ra warranty-processing-logic
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { WarrantyPaymentVoucherDialog } from '../dialogs/warranty-payment-voucher-dialog';
import { WarrantyReceiptVoucherDialog } from '../dialogs/warranty-receipt-voucher-dialog';
import { useAuth } from '../../../../contexts/auth-context';
import { formatDateTimeForDisplay } from '@/lib/date-utils';
import type { WarrantyTicket } from '../../types';
import { useWarrantyTransactionGroups } from '../../hooks/use-warranty-transaction-groups';
import type { WarrantySettlementState } from '../../hooks/use-warranty-settlement';
import { WarrantyTransactionGroups } from '../sections/warranty-transaction-groups';
import type { WarrantyCustomerInfo } from '../../types';
import { mobileBleedCardClass } from '@/components/layout/page-section';

interface WarrantyProcessingCardProps {
  warrantyId: string;
  warrantySystemId: string;
  customer: WarrantyCustomerInfo;
  linkedOrderSystemId?: string | undefined;
  branchSystemId?: string | undefined;
  branchName?: string | undefined;
  ticket?: WarrantyTicket | undefined;
  settlement: WarrantySettlementState;
  asSection?: boolean;
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
  asSection = false,
}: WarrantyProcessingCardProps) {
  const { user } = useAuth();

  const {
    totalPayment,
    processingState: settlementState,
    settlementMethods,
  } = settlement;

  // DEBUG: Log để kiểm tra
  React.useEffect(() => {
  }, [settlementState, totalPayment]);

  // Get current user name and current time
  const currentUserName = user?.name || 'Người dùng';
  const _currentTime = formatDateTimeForDisplay(new Date());

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

  const content = (
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
              defaultAmount={settlementState.remainingAmount}
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
              defaultAmount={settlementState.remainingAmount}
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
          settlementMethods={settlementMethods}
        />
      )}
    </div>
  );

  if (asSection) {
    return content;
  }

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader>
        <CardTitle>
          Xử lý bảo hành
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
