import type { Customer } from './types';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, getStartOfMonth, getEndOfMonth, subtractMonths, isDateBetween, isDateAfter } from '@/lib/date-utils';
/**
 * Tính trend cho stats (so sánh tháng này vs tháng trước)
 */
export const calculateCustomerTrends = (
  customer: Customer,
  allOrders: any[] // Thay any bằng Order type nếu có
) => {
  const now = getCurrentDate();
  const thisMonthStart = getStartOfMonth(now);
  const lastMonthStart = getStartOfMonth(subtractMonths(now, 1));
  const lastMonthEnd = getEndOfMonth(subtractMonths(now, 1));

  // Filter orders for this customer
  const customerOrders = allOrders.filter(o => o.customerSystemId === customer.systemId);

  // This month orders
  const thisMonthOrders = customerOrders.filter(o => 
    isDateAfter(new Date(o.orderDate), thisMonthStart)
  );
  
  // Last month orders
  const lastMonthOrders = customerOrders.filter(o => 
    isDateBetween(new Date(o.orderDate), lastMonthStart, lastMonthEnd)
  );

  // Calculate totals
  const thisMonthSpent = thisMonthOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const lastMonthSpent = lastMonthOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  
  const thisMonthOrderCount = thisMonthOrders.length;
  const lastMonthOrderCount = lastMonthOrders.length;

  // Calculate trends (percentage change)
  const spendingTrend = lastMonthSpent > 0 
    ? Math.round(((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100)
    : thisMonthSpent > 0 ? 100 : 0;
    
  const ordersTrend = lastMonthOrderCount > 0
    ? Math.round(((thisMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount) * 100)
    : thisMonthOrderCount > 0 ? 100 : 0;

  return {
    spending: {
      value: spendingTrend,
      isPositive: spendingTrend >= 0
    },
    orders: {
      value: ordersTrend,
      isPositive: ordersTrend >= 0
    }
  };
};
