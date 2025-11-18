import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { AlertTriangle, Phone, MessageSquare, DollarSign, ShoppingBag, ChevronRight } from "lucide-react";
import { useCustomerStore } from "../customers/store.ts";
import { calculateDebtTrackingInfo, formatDebtDate } from "../customers/debt-tracking-utils.ts";
import { useMediaQuery } from "../../lib/use-media-query.ts";
import type { Customer } from "../customers/types.ts";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

interface CustomerDebtCardProps {
  customer: Customer;
  onClick: () => void;
}

const CustomerDebtCard = ({ customer, onClick }: CustomerDebtCardProps) => {
  const info = calculateDebtTrackingInfo(customer);
  const isMobile = !useMediaQuery("(min-width: 768px)");
  
  const getVariantColor = () => {
    if (!info.debtStatus) return 'border-muted';
    if (info.maxDaysOverdue > 30) return 'border-destructive bg-destructive/5';
    if (info.maxDaysOverdue > 0) return 'border-yellow-500 bg-yellow-50';
    return 'border-yellow-300 bg-yellow-50/50';
  };

  return (
    <Card 
      className={`${getVariantColor()} hover:shadow-md transition-all cursor-pointer group`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header: Name + Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              {customer.name}
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </h4>
            <p className="text-xs text-muted-foreground">{customer.id}</p>
          </div>
          {info.debtStatus && (
            <Badge 
              variant={info.maxDaysOverdue > 30 ? 'destructive' : info.maxDaysOverdue > 0 ? 'warning' : 'default'}
              className="text-xs"
            >
              {info.maxDaysOverdue > 0 && `Quá ${info.maxDaysOverdue}d`}
              {info.maxDaysOverdue === 0 && info.debtStatus}
            </Badge>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 mb-3">
          {customer.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{customer.phone}</span>
            </div>
          )}
          {customer.zaloPhone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              <span>{customer.zaloPhone}</span>
            </div>
          )}
        </div>

        {/* Financial Info */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Công nợ
            </span>
            <span className={`font-semibold text-sm ${info.maxDaysOverdue > 30 ? 'text-destructive' : info.maxDaysOverdue > 0 ? 'text-yellow-700' : ''}`}>
              {formatCurrency(customer.currentDebt || 0)}
            </span>
          </div>
          
          {info.oldestDebtDueDate && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Hạn thanh toán</span>
              <span className="text-xs font-medium">{formatDebtDate(info.oldestDebtDueDate)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" />
              Tổng đơn
            </span>
            <span className="text-xs font-medium">
              {customer.totalOrders || 0} đơn / {formatCurrency(customer.totalSpent || 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function DebtAlertWidget() {
  const navigate = useNavigate();
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const { getOverdueDebtCustomers, getDueSoonCustomers } = useCustomerStore();
  
  const overdueCustomers = React.useMemo(() => getOverdueDebtCustomers(), [getOverdueDebtCustomers]);
  const dueSoonCustomers = React.useMemo(() => getDueSoonCustomers(), [getDueSoonCustomers]);
  
  // Combine and sort by severity
  const allDebtCustomers = React.useMemo(() => {
    const combined = [...overdueCustomers, ...dueSoonCustomers];
    // Remove duplicates
    const unique = combined.filter((customer, index, self) => 
      index === self.findIndex(c => c.systemId === customer.systemId)
    );
    
    // Sort by days overdue (descending)
    return unique.sort((a, b) => {
      const infoA = calculateDebtTrackingInfo(a);
      const infoB = calculateDebtTrackingInfo(b);
      return infoB.maxDaysOverdue - infoA.maxDaysOverdue;
    });
  }, [overdueCustomers, dueSoonCustomers]);
  
  // Don't show widget if no debt issues
  if (allDebtCustomers.length === 0) {
    return null;
  }

  const handleCustomerClick = (systemId: string) => {
    navigate(`/customers/${systemId}`);
  };

  const criticalCount = allDebtCustomers.filter(c => {
    const info = calculateDebtTrackingInfo(c);
    return info.maxDaysOverdue > 30;
  }).length;

  const totalDebt = allDebtCustomers.reduce((sum, c) => sum + (c.currentDebt || 0), 0);
  
  return (
    <Card className={`${overdueCustomers.length > 0 ? 'border-destructive/50 bg-destructive/5' : 'border-yellow-500/50 bg-yellow-50'}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center gap-2`}>
              <AlertTriangle className={`h-5 w-5 ${overdueCustomers.length > 0 ? 'text-destructive' : 'text-yellow-600'}`} />
              Cảnh báo công nợ khách hàng
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-muted-foreground">
                Tổng: <span className="font-semibold text-destructive">{formatCurrency(totalDebt)}</span>
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {allDebtCustomers.length} khách hàng
              </span>
              {criticalCount > 0 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="destructive" className="text-xs">
                    {criticalCount} nợ xấu
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {allDebtCustomers.map(customer => (
            <CustomerDebtCard
              key={customer.systemId}
              customer={customer}
              onClick={() => handleCustomerClick(customer.systemId)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
