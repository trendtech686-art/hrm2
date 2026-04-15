import * as React from 'react';
import { Badge } from '../../../../components/ui/badge';
import { CheckCircle } from 'lucide-react';
import type { WarrantyTransactionGroup } from '../../types/transactions';
import type { SettlementMethod } from '../../types';
import { WarrantyTransactionItem } from './warranty-transaction-item';

interface WarrantyTransactionGroupsProps {
  groups: WarrantyTransactionGroup[];
  totalPayment: number;
  settlementMethods?: SettlementMethod[];
}

export function WarrantyTransactionGroups({ groups, totalPayment, settlementMethods = [] }: WarrantyTransactionGroupsProps) {
  const methodByVoucherId = React.useMemo(() => {
    const map = new Map<string, SettlementMethod>();
    settlementMethods.forEach(method => {
      if (method.paymentVoucherId) {
        map.set(method.paymentVoucherId, method);
      }
    });
    return map;
  }, [settlementMethods]);

  if (!groups.length) {
    return null;
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      {groups.map(group => {
        const groupTime = new Date(group.createdAt).toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        const sortedTransactions = [...group.transactions].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const directionLabel = totalPayment >= 0 ? 'Đã trả' : 'Đã thu';
        const directionAmount = totalPayment >= 0
          ? group.summary.paymentAmount
          : group.summary.receiptAmount;
        const transactionsLabel = `${group.summary.totalTransactions} giao dịch (${group.summary.paymentCount} phiếu chi • ${group.summary.receiptCount} phiếu thu)`;

        return (
          <div key={group.id} className="border rounded-lg px-4 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              <div className="text-left flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium text-sm ${group.allCancelled ? 'line-through text-muted-foreground' : ''}`}>
                    Xử lý bảo hành - {group.performedBy} - {groupTime}
                  </span>
                  {group.allCancelled && (
                    <Badge variant="secondary" className="text-xs">
                      Đã hủy
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {transactionsLabel}
                  {' • '}
                  {directionLabel}: {directionAmount.toLocaleString('vi-VN')} đ / {Math.abs(totalPayment).toLocaleString('vi-VN')} đ
                  {group.allCancelled && group.cancelReason && (
                    <>
                      {' • '}
                      <span className="font-medium text-foreground">Lý do: {group.cancelReason}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {sortedTransactions.map(transaction => {
                const relatedMethod = methodByVoucherId.get(transaction.systemId);
                return (
                  <WarrantyTransactionItem
                    key={transaction.systemId}
                    transaction={transaction}
                    settlementMethod={relatedMethod}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
