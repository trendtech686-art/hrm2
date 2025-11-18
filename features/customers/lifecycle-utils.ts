import type { Customer, CustomerLifecycleStage } from './types';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, getDaysDiff } from '@/lib/date-utils';
/**
 * Tự động tính toán giai đoạn vòng đời khách hàng dựa trên hành vi
 */
export const calculateLifecycleStage = (customer: Customer): CustomerLifecycleStage => {
  const totalOrders = customer.totalOrders || 0;
  const totalSpent = customer.totalSpent || 0;
  const lastPurchaseDate = customer.lastPurchaseDate;
  
  // Nếu chưa mua lần nào
  if (totalOrders === 0) {
    return "Khách tiềm năng";
  }
  
  // Tính số ngày từ lần mua cuối
  const daysSinceLastPurchase = lastPurchaseDate 
    ? getDaysDiff(getCurrentDate(), new Date(lastPurchaseDate))
    : Infinity;
  
  // Khách đã mất (không mua > 365 ngày)
  if (daysSinceLastPurchase > 365) {
    return "Mất khách";
  }
  
  // Không hoạt động (không mua > 180 ngày)
  if (daysSinceLastPurchase > 180) {
    return "Không hoạt động";
  }
  
  // Khách VIP: Top 10% spending (>= 50 triệu) và mua >= 5 lần
  if (totalSpent >= 50_000_000 && totalOrders >= 5) {
    return "Khách VIP";
  }
  
  // Khách thân thiết: Mua >= 5 lần
  if (totalOrders >= 5) {
    return "Khách thân thiết";
  }
  
  // Khách quay lại: Mua 2-4 lần
  if (totalOrders >= 2) {
    return "Khách quay lại";
  }
  
  // Khách mới: Mua lần đầu
  return "Khách mới";
};

/**
 * Lấy màu badge cho lifecycle stage
 */
export const getLifecycleStageVariant = (stage?: CustomerLifecycleStage): 
  'default' | 'secondary' | 'success' | 'warning' | 'destructive' => {
  switch (stage) {
    case "Khách VIP":
      return "success";
    case "Khách thân thiết":
      return "success";
    case "Khách quay lại":
      return "default";
    case "Khách mới":
      return "secondary";
    case "Khách tiềm năng":
      return "secondary";
    case "Không hoạt động":
      return "warning";
    case "Mất khách":
      return "destructive";
    default:
      return "secondary";
  }
};

/**
 * Cập nhật lifecycle stage cho tất cả customers (chạy batch)
 */
export const updateAllCustomerLifecycleStages = (customers: Customer[]): Customer[] => {
  return customers.map(customer => ({
    ...customer,
    lifecycleStage: calculateLifecycleStage(customer)
  }));
};
