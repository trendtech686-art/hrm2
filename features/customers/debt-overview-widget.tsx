import * as React from "react";
import { AlertTriangle, Clock, DollarSign, TrendingUp } from "lucide-react";
import { useCustomerStore } from "./store.ts";
import { calculateTotalOverdueDebt } from "./debt-tracking-utils.ts";
import { AlertListBox } from "./components/alert-list-box.tsx";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

interface DebtOverviewWidgetProps {
  activeFilter?: 'all' | 'totalOverdue' | 'overdue' | 'dueSoon' | 'hasDebt';
  onFilterChange?: (filter: 'all' | 'totalOverdue' | 'overdue' | 'dueSoon' | 'hasDebt') => void;
}

export function DebtOverviewWidget({ activeFilter = 'all', onFilterChange }: DebtOverviewWidgetProps) {
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
  
  if (overdueCustomers.length === 0 && dueSoonCustomers.length === 0 && totalCustomersWithDebt === 0) {
    return null;
  }

  const handleFilterChange = (key: string) => {
    if (onFilterChange) {
      onFilterChange(key as 'all' | 'totalOverdue' | 'overdue' | 'dueSoon' | 'hasDebt');
    }
  };

  const debtItems = [
    {
      key: 'totalOverdue',
      label: `Tổng công nợ quá hạn: ${formatCurrency(totalOverdueDebt)}`,
      value: overdueCustomers.length,
      Icon: DollarSign,
      accent: 'text-destructive',
    },
    {
      key: 'overdue',
      label: 'Quá hạn thanh toán',
      value: overdueCustomers.length,
      Icon: AlertTriangle,
      accent: 'text-destructive',
    },
    {
      key: 'dueSoon',
      label: 'Sắp đến hạn (1-3 ngày)',
      value: dueSoonCustomers.length,
      Icon: Clock,
      accent: 'text-orange-500',
    },
    {
      key: 'hasDebt',
      label: 'Tổng KH có công nợ',
      value: totalCustomersWithDebt,
      Icon: TrendingUp,
      accent: 'text-muted-foreground',
    },
  ];
  
  return (
    <AlertListBox
      items={debtItems}
      activeFilter={activeFilter}
      onFilterChange={handleFilterChange}
      variant="destructive"
    />
  );
}
