import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge.tsx';
import { StatusBadge, ORDER_MAIN_STATUS_MAP, PAYMENT_STATUS_MAP, DELIVERY_STATUS_MAP } from '../../components/StatusBadge.tsx';
import { TouchButton } from '../../components/mobile/touch-button.tsx';
import { 
  User, 
  Calendar, 
  Building2, 
  DollarSign,
  Package,
  Truck,
  Printer,
  MoreVertical
} from 'lucide-react';
import type { Order } from './types.ts';
import { formatDate } from '../../lib/date-utils.ts';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface OrderCardProps {
  order: Order;
  onCancel?: (systemId: string) => void;
}

export function OrderCard({ order, onCancel }: OrderCardProps) {
  const navigate = useNavigate();

  const totalPaid = (order.payments || []).reduce((sum, p) => sum + p.amount, 0);
  const remaining = order.grandTotal - totalPaid;

  return (
    <div 
      className="bg-card rounded-lg border p-4 space-y-3 hover:shadow-md transition-shadow"
      onClick={() => navigate(`/orders/${order.systemId}`)}
    >
      {/* Header: Code + Status */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="font-mono font-semibold text-body-sm">{order.id}</div>
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
        <div className="flex items-center gap-2 text-body-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{order.customerName}</span>
        </div>
        
        <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(order.orderDate)}</span>
        </div>

        {order.branchName && (
          <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{order.branchName}</span>
          </div>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={order.paymentStatus} statusMap={PAYMENT_STATUS_MAP} className="text-body-xs" />
        <StatusBadge status={order.deliveryStatus} statusMap={DELIVERY_STATUS_MAP} className="text-body-xs" />
      </div>

      {/* Financial Info */}
      <div className="pt-2 border-t space-y-1">
        <div className="flex justify-between text-body-sm">
          <span className="text-muted-foreground">Tổng tiền:</span>
          <span className="font-semibold">{formatCurrency(order.grandTotal)}</span>
        </div>
        <div className="flex justify-between text-body-sm">
          <span className="text-muted-foreground">Đã thanh toán:</span>
          <span className="text-green-600">{formatCurrency(totalPaid)}</span>
        </div>
        {remaining > 0 && (
          <div className="flex justify-between text-body-sm">
            <span className="text-muted-foreground">Còn lại:</span>
            <span className="font-semibold text-destructive">{formatCurrency(remaining)}</span>
          </div>
        )}
      </div>

      {/* Salesperson */}
      {order.salesperson && (
        <div className="text-body-xs text-muted-foreground">
          NV: {order.salesperson}
        </div>
      )}
    </div>
  );
}
