import * as React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../../components/ui/accordion.tsx';
import { Badge } from '../../../../components/ui/badge.tsx';
import { CheckCircle } from 'lucide-react';
import type { Order } from '../../../orders/types.ts';
import type { WarrantyTransactionGroup } from '../../types/transactions.ts';
import type { SettlementMethod } from '../../types.ts';
import { WarrantyTransactionItem } from './warranty-transaction-item.tsx';

interface WarrantyTransactionGroupsProps {
  groups: WarrantyTransactionGroup[];
  totalPayment: number;
  orders: Order[];
  settlementMethods?: SettlementMethod[];
}

export function WarrantyTransactionGroups({ groups, totalPayment, orders, settlementMethods = [] }: WarrantyTransactionGroupsProps) {
  if (!groups.length) {
    return null;
  }

  const methodByVoucherId = React.useMemo(() => {
    const map = new Map<string, SettlementMethod>();
    settlementMethods.forEach(method => {
      if (method.paymentVoucherId) {
        map.set(method.paymentVoucherId, method);
      }
    });
    return map;
  }, [settlementMethods]);

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
          <Accordion key={group.id} type="single" collapsible className="w-full">
            <AccordionItem value={group.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-medium ${group.allCancelled ? 'line-through text-muted-foreground' : ''}`}>
                        Xử lý bảo hành - {group.performedBy} - {groupTime}
                      </span>
                      {group.allCancelled && (
                        <Badge variant="secondary" className="text-xs">
                          Đã hủy
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
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
              </AccordionTrigger>

              <AccordionContent>
                <div className="space-y-3 pt-4">
                  {sortedTransactions.map(transaction => {
                    const relatedMethod = methodByVoucherId.get(transaction.systemId);
                    return (
                      <WarrantyTransactionItem
                        key={transaction.systemId}
                        transaction={transaction}
                        orders={orders}
                        settlementMethod={relatedMethod}
                      />
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
