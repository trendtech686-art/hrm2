'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge, ORDER_MAIN_STATUS_MAP, PAYMENT_STATUS_MAP, DELIVERY_STATUS_MAP } from '@/components/StatusBadge';
import { TouchButton } from '@/components/mobile/touch-button';
import { 
  User, 
  Calendar, 
  Building2, 
  MoreVertical
} from 'lucide-react';
import type { Order } from '@/lib/types/prisma-extended';
import { formatDate } from '@/lib/date-utils';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface OrderCardProps {
  order: Order;
  onCancel?: (systemId: string) => void;
}

export function OrderCard({ order, onCancel: _onCancel }: OrderCardProps) {
  const router = useRouter();

  const totalPaid = (order.payments || []).reduce((sum, p) => sum + p.amount, 0);
  const remaining = order.grandTotal - totalPaid;

  return (
    <div
      className="bg-card rounded-xl border border-border/50 p-4 space-y-3 active:scale-[0.98] transition-transform touch-manipulation"
      onClick={() => router.push(`/orders/${order.systemId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/orders/${order.systemId}`); }}
    >
      {/* Header: Code + Status */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="font-mono font-semibold text-sm">{order.id}</div>
          <StatusBadge status={order.status} statusMap={ORDER_MAIN_STATUS_MAP} />
        </div>
        <TouchButton
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="h-8 w-8 p-0"
        >
          <MoreVertical className="h-4 w-4" />
        </TouchButton>
      </div>

      {/* Customer Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium truncate">{order.customerName}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(order.orderDate)}</span>
        </div>

        {order.branchName && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            <span className="truncate">{order.branchName}</span>
          </div>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={order.paymentStatus} statusMap={PAYMENT_STATUS_MAP} className="text-xs" />
        <StatusBadge status={order.deliveryStatus} statusMap={DELIVERY_STATUS_MAP} className="text-xs" />
      </div>

      {/* Financial Info */}
      <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Tổng tiền:</span>
          <span className="font-semibold">{formatCurrency(order.grandTotal)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Đã thanh toán:</span>
          <span className="text-green-600">{formatCurrency(totalPaid)}</span>
        </div>
        {remaining > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Còn lại:</span>
            <span className="font-semibold text-destructive">{formatCurrency(remaining)}</span>
          </div>
        )}
      </div>

      {/* Salesperson */}
      {order.salesperson && (
        <div className="text-xs text-muted-foreground">
          NV: {order.salesperson}
        </div>
      )}
    </div>
  );
}
