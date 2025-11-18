import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { AlertTriangle, Clock, DollarSign, TrendingUp } from "lucide-react";
import { useCustomerStore } from "./store.ts";
import { calculateTotalOverdueDebt } from "./debt-tracking-utils.ts";
import { cn } from "../../lib/utils.ts";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

export function DebtOverviewWidget() {
  const { getOverdueDebtCustomers, getDueSoonCustomers, getActive } = useCustomerStore();
  
  const overdueCustomers = React.useMemo(() => getOverdueDebtCustomers(), [getOverdueDebtCustomers]);
  const dueSoonCustomers = React.useMemo(() => getDueSoonCustomers(), [getDueSoonCustomers]);
  const activeCustomers = React.useMemo(() => getActive(), [getActive]);
  
  const totalOverdueDebt = React.useMemo(() => 
    calculateTotalOverdueDebt(activeCustomers), 
    [activeCustomers]
  );
  
  const totalCustomersWithDebt = React.useMemo(() => 
    activeCustomers.filter(c => (c.currentDebt || 0) > 0).length,
    [activeCustomers]
  );
  
  if (overdueCustomers.length === 0 && dueSoonCustomers.length === 0) {
    return null; // Don't show widget if no debt issues
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-4 mb-4">
      {/* Total Overdue Debt */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng công nợ quá hạn</CardTitle>
          <DollarSign className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{formatCurrency(totalOverdueDebt)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {overdueCustomers.length} khách hàng
          </p>
        </CardContent>
      </Card>
      
      {/* Overdue Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quá hạn thanh toán</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overdueCustomers.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Cần xử lý ngay
          </p>
        </CardContent>
      </Card>
      
      {/* Due Soon Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sắp đến hạn</CardTitle>
          <Clock className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dueSoonCustomers.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Trong 1-3 ngày tới
          </p>
        </CardContent>
      </Card>
      
      {/* Total Customers with Debt */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng KH có công nợ</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomersWithDebt}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Đang theo dõi
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
