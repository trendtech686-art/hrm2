import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../lib/date-utils.ts';
import type { WarrantyTicket } from './types.ts';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS } from './types.ts';
import { Card, CardContent } from '../../components/ui/card.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu.tsx';
import { Package, Phone, Truck, User, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils.ts';
import { checkWarrantyOverdue } from './warranty-sla-utils.ts';
import { SlaTimer, WARRANTY_SLA_CONFIGS } from '../../components/SlaTimer.tsx';
import { loadCardColorSettings } from '../settings/warranty/warranty-settings-page.tsx';

interface WarrantyCardProps {
  ticket: WarrantyTicket;
  onEdit?: (ticket: WarrantyTicket) => void;
  onDelete?: (systemId: string) => void;
  onClick?: (ticket: WarrantyTicket) => void;
}

// ✅ OPTIMIZATION: Memoize component to prevent unnecessary re-renders
// Only re-render if ticket data or callbacks change
export const WarrantyCard = React.memo(function WarrantyCard({ ticket, onEdit, onDelete, onClick }: WarrantyCardProps) {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Ignore right-click
    if (e.type === 'contextmenu' || e.button === 2) {
      return;
    }
    
    if (onClick) {
      onClick(ticket);
    } else {
      navigate(`/warranty/${ticket.systemId}`);
    }
  };

  // Check if overdue
  const overdueStatus = checkWarrantyOverdue(ticket);
  const isOverdue = 
    overdueStatus.isOverdueResponse || 
    overdueStatus.isOverdueProcessing || 
    overdueStatus.isOverdueReturn;

  // Load card color settings
  const cardColors = React.useMemo(() => loadCardColorSettings(), []);

  // Calculate summary with fallback from products
  const summary = React.useMemo(() => {
    if (ticket.summary?.totalReplaced !== undefined && ticket.summary?.totalOutOfStock !== undefined) {
      console.log('✅ Using existing summary:', ticket.id, ticket.summary);
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
    
    const totalProducts = ticket.products.reduce((sum: number, p: any) => sum + (p.quantity || 1), 0);
    const totalReplaced = ticket.products
      .filter((p: any) => p.resolution === 'replace')
      .reduce((sum: number, p: any) => sum + (p.quantity || 1), 0);
    const totalReturned = ticket.products
      .filter((p: any) => p.resolution === 'return')
      .reduce((sum: number, p: any) => sum + (p.quantity || 1), 0);
    
    // Gộp "out_of_stock" và "deduct" thành "Hết hàng (Khấu trừ)"
    const outOfStockProducts = ticket.products.filter((p: any) => 
      p.resolution === 'out_of_stock' || p.resolution === 'deduct'
    );
    
    const totalOutOfStock = outOfStockProducts.reduce((sum: number, p: any) => sum + (p.quantity || 1), 0);
    const totalDeduction = outOfStockProducts.reduce((sum: number, p: any) => {
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
    
    console.log('⚙️ Calculated summary:', ticket.id, calculated);
    return calculated;
  }, [ticket.summary, ticket.products]);

  // Determine card color (priority: overdue > status)
  let cardColorClass = "";
  let borderClass = "border-l-4";

  if (cardColors.enableOverdueColor && isOverdue) {
    cardColorClass = cardColors.overdueColor || "bg-red-50"; // Fallback
    borderClass += " border-l-red-500";
  } else if (cardColors.enableStatusColors) {
    cardColorClass = cardColors.statusColors[ticket.status] || "";
    const statusBorderColors = {
      new: "border-l-blue-500",
      pending: "border-l-yellow-500",
      processed: "border-l-green-500",
      returned: "border-l-gray-500",
    };
    borderClass += " " + statusBorderColors[ticket.status];
  }

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-all cursor-pointer",
        borderClass,
        cardColorClass,
        ticket.status === 'cancelled' && "opacity-60" // Dim cancelled tickets
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        {/* Header: ID + Status + Overdue Badge (1 row) */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "font-semibold text-primary text-sm font-mono",
              ticket.status === 'cancelled' && "line-through" // Strike through cancelled ID
            )}>
              {ticket.id}
            </span>
            <Badge className={WARRANTY_STATUS_COLORS[ticket.status] + " text-xs"}>
              {WARRANTY_STATUS_LABELS[ticket.status]}
            </Badge>
          </div>
          {isOverdue && (
            <Badge variant="outline" className="text-xs bg-red-100 text-red-800 whitespace-nowrap">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Quá hạn
            </Badge>
          )}
        </div>

        {/* Customer Name */}
        <div className={cn(
          "flex items-center text-sm font-medium mb-2",
          ticket.status === 'cancelled' && "line-through" // Strike through cancelled customer name
        )}>
          <User className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-muted-foreground" />
          <span className="truncate">{ticket.customerName}</span>
        </div>

        {/* Divider */}
        <div className="border-t mb-2" />

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
                {summary.totalReturned > 0 && <span className="text-blue-600 font-medium">• {summary.totalReturned}trả lại</span>}
                {summary.totalOutOfStock > 0 && <span className="text-orange-600 font-medium">• {summary.totalOutOfStock}hết hàng</span>}
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
              ticket.status === 'incomplete'
                ? WARRANTY_SLA_CONFIGS.response.targetMinutes
                : ticket.status === 'pending'
                ? WARRANTY_SLA_CONFIGS.processing.targetMinutes
                : WARRANTY_SLA_CONFIGS.return.targetMinutes
            }
            isCompleted={ticket.status === 'returned'}
            thresholds={
              ticket.status === 'incomplete'
                ? WARRANTY_SLA_CONFIGS.response.thresholds
                : ticket.status === 'pending'
                ? WARRANTY_SLA_CONFIGS.processing.thresholds
                : WARRANTY_SLA_CONFIGS.return.thresholds
            }
            className="mt-1"
          />

          {/* Row 3: Created + Updated */}
          <div className="flex items-center justify-between text-xs pt-1.5 border-t">
            <span className="text-muted-foreground">Tạo {formatDateTime(ticket.createdAt)}</span>
            <span className="text-muted-foreground">CN {formatDateTime(ticket.updatedAt)}</span>
          </div>

          {/* Row 4: Returned + Created By */}
          <div className="flex items-center justify-between text-xs">
            {ticket.status === 'completed' && ticket.completedAt ? (
              <span className="text-blue-700 font-medium">✓ Kết thúc {formatDateTime(ticket.completedAt)}</span>
            ) : ticket.returnedAt ? (
              <span className="text-green-700 font-medium">✓ Đã trả {formatDateTime(ticket.returnedAt)}</span>
            ) : (
              <span className="text-muted-foreground">Người tạo: {ticket.createdBy}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
