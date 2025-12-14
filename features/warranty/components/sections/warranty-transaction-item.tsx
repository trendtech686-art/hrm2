import * as React from 'react';
import { Badge } from '../../../../components/ui/badge.tsx';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Order } from '../../../orders/types.ts';
import type { WarrantyTransaction } from '../../types/transactions.ts';
import type { SettlementMethod } from '../../types.ts';
import { SETTLEMENT_STATUS_LABELS, SETTLEMENT_TYPE_LABELS } from '../../types.ts';
import { formatDateTimeForDisplay } from '@/lib/date-utils';

interface WarrantyTransactionItemProps {
  transaction: WarrantyTransaction;
  orders: Order[];
  settlementMethod?: SettlementMethod | null | undefined;
}

export function WarrantyTransactionItem({ transaction, orders, settlementMethod }: WarrantyTransactionItemProps) {
  const paymentTransaction = transaction.kind === 'payment' ? transaction : null;
  const receiptTransaction = transaction.kind === 'receipt' ? transaction : null;
  const linkedOrder = paymentTransaction?.linkedOrderSystemId
    ? orders.find(order => order.systemId === paymentTransaction.linkedOrderSystemId)
    : null;
  const methodTypeLabel = settlementMethod ? SETTLEMENT_TYPE_LABELS[settlementMethod.type] : null;
  const methodStatusLabel = settlementMethod ? SETTLEMENT_STATUS_LABELS[settlementMethod.status] : null;
  const methodStatusVariant = settlementMethod?.status === 'completed'
    ? 'default'
    : settlementMethod?.status === 'partial'
      ? 'outline'
      : 'secondary';

  return (
    <div
      className={`p-3 rounded-md border ${
        transaction.status === 'cancelled'
          ? 'bg-muted/50 opacity-60'
          : 'bg-card'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${transaction.status === 'cancelled' ? 'line-through' : ''}`}>
              {transaction.kind === 'payment' ? 'Phiếu chi:' : 'Phiếu thu:'}
            </span>
            <Link
              to={transaction.kind === 'payment' ? `/payments/${transaction.systemId}` : `/receipts/${transaction.systemId}`}
              className={`text-sm text-primary hover:underline font-semibold ${
                transaction.status === 'cancelled' ? 'line-through' : ''
              }`}
            >
              {transaction.id}
            </Link>
            {transaction.status === 'cancelled' && (
              <Badge variant="secondary" className="text-xs">
                Đã hủy
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Phương thức:</span>
            <span className="font-medium">
              {transaction.kind === 'payment'
                ? linkedOrder
                  ? 'Trừ vào đơn hàng'
                  : transaction.paymentMethodName || 'N/A'
                : transaction.paymentMethodName || 'N/A'}
            </span>
          </div>

          {settlementMethod && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {methodTypeLabel && (
                <Badge variant="outline" className="text-[10px]">
                  {methodTypeLabel}
                </Badge>
              )}
              {methodStatusLabel && (
                <Badge variant={methodStatusVariant} className="text-[10px]">
                  {methodStatusLabel}
                </Badge>
              )}
            </div>
          )}

          {settlementMethod?.notes && (
            <p className="text-xs text-muted-foreground">
              {settlementMethod.notes}
            </p>
          )}

          {linkedOrder && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Đơn hàng:</span>
              <Link
                to={`/orders/${linkedOrder.systemId}`}
                className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                onClick={event => event.stopPropagation()}
              >
                {linkedOrder.id}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            {new Date(transaction.createdAt).toLocaleString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
            {transaction.createdBy && <span> - {transaction.createdBy}</span>}
          </div>

          {transaction.status === 'cancelled' && transaction.cancelledAt && (
            <span className="text-xs text-muted-foreground">
              Hủy lúc: {formatDateTimeForDisplay(transaction.cancelledAt)}
            </span>
          )}
        </div>

        <span
          className={`text-sm font-semibold whitespace-nowrap ${
            transaction.status === 'cancelled'
              ? 'text-muted-foreground line-through'
              : transaction.kind === 'payment'
                ? 'text-destructive'
                : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {transaction.kind === 'payment' ? '-' : '+'}
          {transaction.amount.toLocaleString('vi-VN')} đ
        </span>
      </div>
    </div>
  );
}
