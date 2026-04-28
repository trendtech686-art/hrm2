'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '../../lib/date-utils';
import type { WarrantyTicket } from './types';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS } from './types';
import { Badge } from '../../components/ui/badge';
import { Package, Phone, Truck, User, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { checkWarrantyOverdue, DEFAULT_WARRANTY_SLA_TARGETS, type WarrantySLATargets } from './warranty-sla-utils';
import { SlaTimer } from '../../components/SlaTimer';
import { MobileCard } from '../../components/mobile/mobile-card';
import { useWarrantySettings } from '../settings/warranty/hooks/use-warranty-settings';

interface WarrantyCardProps {
  ticket: WarrantyTicket;
  onClick?: (ticket: WarrantyTicket) => void;
}

// ✅ OPTIMIZATION: Memoize component to prevent unnecessary re-renders
// Only re-render if ticket data or callbacks change
export const WarrantyCard = React.memo(function WarrantyCard({ ticket, onClick }: WarrantyCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Ignore right-click
    if (e.type === 'contextmenu' || e.button === 2) {
      return;
    }
    
    if (onClick) {
      onClick(ticket);
    } else {
      router.push(`/warranty/${ticket.systemId}`);
    }
  };

  // Load card color + SLA settings from DB via React Query
  const { data: warrantySettings } = useWarrantySettings();
  const cardColors = warrantySettings.cardColors;
  const slaMedium = warrantySettings.sla.medium;
  const slaTargets: WarrantySLATargets = React.useMemo(() => ({
    response: slaMedium.responseTime ?? DEFAULT_WARRANTY_SLA_TARGETS.response,
    processing: (slaMedium.resolveTime ?? 24) * 60,
    return: DEFAULT_WARRANTY_SLA_TARGETS.return,
  }), [slaMedium]);

  // Check if overdue
  const overdueStatus = checkWarrantyOverdue(ticket, slaTargets);
  const isOverdue = 
    overdueStatus.isOverdueResponse || 
    overdueStatus.isOverdueProcessing || 
    overdueStatus.isOverdueReturn;

  // Calculate summary with fallback from products
  const summary = React.useMemo(() => {
    if (ticket.summary?.totalReplaced !== undefined && ticket.summary?.totalOutOfStock !== undefined) {
      return ticket.summary;
    }
    // Fallback: Calculate from products (with null checks)
    if (!ticket.products || !Array.isArray(ticket.products)) {
      return {
        ...ticket.summary,
        totalProducts: 0,
        totalReplaced: 0,
        totalReturned: 0,
        totalOutOfStock: 0,
        totalDeduction: 0,
      };
    }
    
    const totalProducts = ticket.products.reduce((sum: number, p: { quantity?: number }) => sum + (p.quantity || 1), 0);
    const totalReplaced = ticket.products
      .filter((p: { resolution?: string }) => p.resolution === 'replace')
      .reduce((sum: number, p: { quantity?: number }) => sum + (p.quantity || 1), 0);
    const totalReturned = ticket.products
      .filter((p: { resolution?: string }) => p.resolution === 'return')
      .reduce((sum: number, p: { quantity?: number }) => sum + (p.quantity || 1), 0);
    
    // Gộp "out_of_stock" và "deduct" thành "Hết hàng (Khấu trừ)"
    const outOfStockProducts = ticket.products.filter((p: { resolution?: string }) => 
      p.resolution === 'out_of_stock' || p.resolution === 'deduct'
    );
    
    const totalOutOfStock = outOfStockProducts.reduce((sum: number, p: { quantity?: number }) => sum + (p.quantity || 1), 0);
    const totalDeduction = outOfStockProducts.reduce((sum: number, p: { resolution?: string; deductionAmount?: number; quantity?: number; unitPrice?: number }) => {
      if (p.resolution === 'deduct') return sum + (p.deductionAmount || 0);
      if (p.resolution === 'out_of_stock') return sum + ((p.quantity || 1) * (p.unitPrice || 0));
      return sum;
    }, 0);
    
    const calculated = {
      ...ticket.summary,
      totalProducts,
      totalReplaced,
      totalReturned,
      totalOutOfStock,
      totalDeduction,
    };
    
    return calculated;
  }, [ticket.summary, ticket.products]);

  // Determine card color (priority: overdue > status)
  let cardColorClass = "";
  let borderClass = "border-l-4";

  if (cardColors.enableOverdueColor && isOverdue) {
    cardColorClass = cardColors.overdueColor || 'bg-destructive/10';
    borderClass += ' border-l-destructive';
  } else if (cardColors.enableStatusColors) {
    cardColorClass = cardColors.statusColors[ticket.status] || '';
    const statusBorderColors: Record<string, string> = {
      RECEIVED: 'border-l-warning',
      PROCESSING: 'border-l-info',
      COMPLETED: 'border-l-success',
      RETURNED: 'border-l-muted-foreground',
      CANCELLED: 'border-l-destructive',
    };
    borderClass += ' ' + (statusBorderColors[ticket.status] || 'border-l-border');
  }

  return (
    <MobileCard
      className={cn(
        borderClass,
        cardColorClass,
        ticket.status === 'CANCELLED' && "opacity-60"
      )}
      onClick={handleCardClick}
    >
        {/* Header: ID + Status + Overdue Badge (1 row) */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "font-semibold text-primary text-sm font-mono",
              ticket.status === 'CANCELLED' && "line-through"
            )}>
              {ticket.id}
            </span>
            <Badge className={WARRANTY_STATUS_COLORS[ticket.status] + " text-xs"}>
              {WARRANTY_STATUS_LABELS[ticket.status]}
            </Badge>
          </div>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs whitespace-nowrap">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Quá hạn
            </Badge>
          )}
        </div>

        {/* Customer Name */}
        <div className={cn(
          "flex items-center text-sm font-medium mb-2",
          ticket.status === 'CANCELLED' && "line-through"
        )}>
          <User className="h-3.5 w-3.5 mr-1.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{ticket.customerName}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 mb-2" />

        {/* Info Grid */}
        <div className="space-y-1.5">
          {/* Row 1: Phone + Tracking */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {ticket.customerPhone && (
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                <span>{ticket.customerPhone}</span>
              </div>
            )}
            <div className="flex items-center">
              <Truck className="h-3 w-3 mr-1" />
              <span className="font-mono">{ticket.trackingCode}</span>
            </div>
          </div>

          {/* Row 2: Products Summary inline */}
          <div className="flex items-center text-xs gap-1.5 flex-wrap">
            <div className="flex items-center text-muted-foreground">
              <Package className="h-3 w-3 mr-1" />
              <span className="font-semibold">{summary?.totalProducts || ticket.products?.length || 0}</span>
            </div>
            {summary && (
              <>
                {summary.totalReplaced > 0 && <span className="text-green-600 font-medium">• {summary.totalReplaced}đổi mới</span>}
                {(summary.totalReturned ?? 0) > 0 && <span className="text-blue-600 font-medium">• {summary.totalReturned}trả lại</span>}
                {(summary.totalOutOfStock ?? 0) > 0 && <span className="text-orange-600 font-medium">• {summary.totalOutOfStock}hết hàng</span>}
                {summary.totalDeduction > 0 && (
                  <span className="text-red-600 font-medium ml-auto">
                    Bù trừ {new Intl.NumberFormat('vi-VN').format(summary.totalDeduction)}₫
                  </span>
                )}
              </>
            )}
          </div>

          {/* SLA Timer */}
          <SlaTimer
            startTime={ticket.createdAt}
            targetMinutes={
              ticket.status === 'RECEIVED'
                ? slaMedium.responseTime
                : slaMedium.resolveTime * 60
            }
            isCompleted={ticket.status === 'RETURNED'}
            className="mt-1"
          />

          {/* Row 3: Created + Updated */}
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/50">
            <span className="text-muted-foreground">Tạo {formatDateTime(ticket.createdAt)}</span>
            <span className="text-muted-foreground">CN {formatDateTime(ticket.updatedAt)}</span>
          </div>

          {/* Row 4: Returned + Created By */}
          <div className="flex items-center justify-between text-xs">
            {ticket.completedAt ? (
              <span className="text-blue-700 font-medium">✓ Hoàn tất {formatDateTime(ticket.completedAt)}</span>
            ) : ticket.returnedAt ? (
              <span className="text-green-700 font-medium">✓ Đã trả {formatDateTime(ticket.returnedAt)}</span>
            ) : (
              <span className="text-muted-foreground">Người tạo: {ticket.createdBy}</span>
            )}
          </div>
        </div>
    </MobileCard>
  );
});
