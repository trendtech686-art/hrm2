import type { Customer } from './types';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, getDaysDiff } from '@/lib/date-utils';
// RFM Score types
export type RFMScore = {
  recency: 1 | 2 | 3 | 4 | 5;      // 5 = Best (mua gần đây)
  frequency: 1 | 2 | 3 | 4 | 5;    // 5 = Best (mua thường xuyên)
  monetary: 1 | 2 | 3 | 4 | 5;     // 5 = Best (chi tiêu nhiều)
};

// Customer Segment based on RFM
export type CustomerSegment = 
  | 'Champions'           // RFM: 5-5-5, 5-4-5, 4-5-5 - Khách hàng tốt nhất
  | 'Loyal Customers'     // RFM: 4-4-4, 4-5-4, 5-4-4 - Khách thân thiết
  | 'Potential Loyalist'  // RFM: 4-3-*, 3-4-*, 5-3-* - Tiềm năng trở thành thân thiết
  | 'New Customers'       // RFM: 5-1-*, 4-1-* - Khách mới
  | 'Promising'           // RFM: 4-2-*, 3-3-* - Đầy hứa hẹn
  | 'Need Attention'      // RFM: 3-2-*, 2-3-* - Cần chú ý
  | 'About To Sleep'      // RFM: 3-1-*, 2-2-* - Sắp ngủ đông
  | 'At Risk'             // RFM: 2-5-*, 2-4-*, 1-3-* - Có nguy cơ
  | 'Cannot Lose Them'    // RFM: 1-5-5, 1-4-5 - Không thể mất
  | 'Hibernating'         // RFM: 2-1-*, 1-2-* - Ngủ đông
  | 'Lost';               // RFM: 1-1-* - Đã mất

/**
 * Tính RFM scores cho một khách hàng
 */
export const calculateRFMScores = (customer: Customer, allCustomers: Customer[]): RFMScore => {
  // Recency: Số ngày từ lần mua cuối
  const daysSinceLastPurchase = customer.lastPurchaseDate 
    ? getDaysDiff(getCurrentDate(), new Date(customer.lastPurchaseDate))
    : 999999;
  
  // Frequency: Tổng số đơn hàng
  const frequency = customer.totalOrders || 0;
  
  // Monetary: Tổng chi tiêu
  const monetary = customer.totalSpent || 0;

  // Calculate percentiles for scoring
  const allRecencies = allCustomers.map(c => 
    c.lastPurchaseDate ? getDaysDiff(getCurrentDate(), new Date(c.lastPurchaseDate)) : 999999
  ).sort((a, b) => a - b);
  
  const allFrequencies = allCustomers.map(c => c.totalOrders || 0).sort((a, b) => b - a);
  const allMonetary = allCustomers.map(c => c.totalSpent || 0).sort((a, b) => b - a);

  // Score Recency (lower is better, so invert)
  const recencyScore = getScore(daysSinceLastPurchase, allRecencies, true) as RFMScore['recency'];
  
  // Score Frequency (higher is better)
  const frequencyScore = getScore(frequency, allFrequencies, false) as RFMScore['frequency'];
  
  // Score Monetary (higher is better)
  const monetaryScore = getScore(monetary, allMonetary, false) as RFMScore['monetary'];

  return {
    recency: recencyScore,
    frequency: frequencyScore,
    monetary: monetaryScore
  };
};

/**
 * Helper: Tính score 1-5 dựa trên percentile
 */
const getScore = (value: number, sortedValues: number[], invert: boolean): 1 | 2 | 3 | 4 | 5 => {
  const index = sortedValues.indexOf(value);
  if (index === -1) return 1;
  
  const percentile = (index / sortedValues.length) * 100;
  
  let score: number;
  if (percentile >= 80) score = 5;
  else if (percentile >= 60) score = 4;
  else if (percentile >= 40) score = 3;
  else if (percentile >= 20) score = 2;
  else score = 1;
  
  // Invert for recency (lower days = better)
  if (invert) {
    score = 6 - score;
  }
  
  return score as 1 | 2 | 3 | 4 | 5;
};

/**
 * Phân loại segment dựa trên RFM scores
 */
export const getCustomerSegment = (rfm: RFMScore): CustomerSegment => {
  const { recency: R, frequency: F, monetary: M } = rfm;
  
  // Champions: RFM 5-5-5, 5-4-5, 4-5-5, 5-5-4
  if ((R >= 4 && F >= 4 && M >= 4) && (R === 5 || F === 5)) {
    return 'Champions';
  }
  
  // Loyal Customers: RFM 4-4-4, 4-5-4, 5-4-4, 4-4-5
  if (R >= 4 && F >= 4 && M >= 4) {
    return 'Loyal Customers';
  }
  
  // Potential Loyalist: High frequency, good recency
  if (R >= 3 && F >= 3 && M >= 3) {
    return 'Potential Loyalist';
  }
  
  // New Customers: High recency, low frequency
  if (R >= 4 && F <= 2) {
    return 'New Customers';
  }
  
  // Promising: Good recency, moderate frequency
  if (R >= 3 && F >= 2 && F <= 3) {
    return 'Promising';
  }
  
  // Need Attention: Moderate scores
  if (R === 3 && F === 2) {
    return 'Need Attention';
  }
  
  // About To Sleep: Low frequency, moderate recency
  if ((R === 3 || R === 2) && F <= 2) {
    return 'About To Sleep';
  }
  
  // Cannot Lose Them: Low recency but high value
  if (R === 1 && F >= 4 && M >= 4) {
    return 'Cannot Lose Them';
  }
  
  // At Risk: Low recency, good history
  if (R <= 2 && F >= 3) {
    return 'At Risk';
  }
  
  // Hibernating: Low recency and frequency
  if (R <= 2 && F <= 2 && M >= 2) {
    return 'Hibernating';
  }
  
  // Lost: Lowest scores
  return 'Lost';
};

/**
 * Lấy màu badge cho segment
 */
export const getSegmentBadgeVariant = (segment: CustomerSegment): 
  'default' | 'secondary' | 'success' | 'warning' | 'destructive' => {
  switch (segment) {
    case 'Champions':
    case 'Loyal Customers':
      return 'success';
    case 'Potential Loyalist':
    case 'Promising':
      return 'default';
    case 'New Customers':
      return 'secondary';
    case 'Need Attention':
    case 'About To Sleep':
      return 'warning';
    case 'At Risk':
    case 'Cannot Lose Them':
    case 'Hibernating':
    case 'Lost':
      return 'destructive';
    default:
      return 'secondary';
  }
};

/**
 * Dịch segment sang tiếng Việt
 */
export const getSegmentLabel = (segment: CustomerSegment): string => {
  const labels: Record<CustomerSegment, string> = {
    'Champions': 'Xuất sắc',
    'Loyal Customers': 'Trung thành',
    'Potential Loyalist': 'Tiềm năng cao',
    'New Customers': 'Khách mới',
    'Promising': 'Hứa hẹn',
    'Need Attention': 'Cần quan tâm',
    'About To Sleep': 'Sắp ngủ đông',
    'At Risk': 'Có nguy cơ',
    'Cannot Lose Them': 'Không thể mất',
    'Hibernating': 'Ngủ đông',
    'Lost': 'Đã mất'
  };
  return labels[segment];
};

/**
 * Tính Customer Health Score (0-100)
 * Dựa trên 4 yếu tố: Recency, Frequency, Monetary, Payment Behavior
 */
export const calculateHealthScore = (customer: Customer): number => {
  let score = 0;
  
  // 1. Recency - Thời gian mua gần nhất (30 points)
  const daysSinceLastPurchase = customer.lastPurchaseDate 
    ? getDaysDiff(getCurrentDate(), new Date(customer.lastPurchaseDate))
    : Infinity;
    
  if (daysSinceLastPurchase <= 7) score += 30;
  else if (daysSinceLastPurchase <= 30) score += 25;
  else if (daysSinceLastPurchase <= 60) score += 20;
  else if (daysSinceLastPurchase <= 90) score += 15;
  else if (daysSinceLastPurchase <= 180) score += 10;
  else if (daysSinceLastPurchase <= 365) score += 5;
  
  // 2. Frequency - Tần suất mua (25 points)
  const totalOrders = customer.totalOrders || 0;
  if (totalOrders >= 20) score += 25;
  else if (totalOrders >= 10) score += 20;
  else if (totalOrders >= 5) score += 15;
  else if (totalOrders >= 3) score += 10;
  else if (totalOrders >= 1) score += 5;
  
  // 3. Monetary - Tổng chi tiêu (30 points)
  const totalSpent = customer.totalSpent || 0;
  if (totalSpent >= 500_000_000) score += 30;
  else if (totalSpent >= 200_000_000) score += 25;
  else if (totalSpent >= 100_000_000) score += 20;
  else if (totalSpent >= 50_000_000) score += 15;
  else if (totalSpent >= 20_000_000) score += 10;
  else if (totalSpent >= 5_000_000) score += 5;
  
  // 4. Payment Behavior - Hành vi thanh toán (15 points)
  // Dựa trên tỷ lệ nợ hiện tại so với hạn mức
  if (customer.maxDebt && customer.maxDebt > 0) {
    const debtRatio = (customer.currentDebt || 0) / customer.maxDebt;
    if (debtRatio <= 0.2) score += 15;
    else if (debtRatio <= 0.4) score += 12;
    else if (debtRatio <= 0.6) score += 8;
    else if (debtRatio <= 0.8) score += 4;
    // > 80% = 0 điểm
  } else {
    // Không có hạn mức công nợ → xem như thanh toán tốt
    score += 15;
  }
  
  return Math.min(100, score);
};

/**
 * Lấy health score level
 */
export const getHealthScoreLevel = (score: number): {
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  label: string;
  variant: 'success' | 'default' | 'warning' | 'destructive';
} => {
  if (score >= 80) return { level: 'excellent', label: 'Xuất sắc', variant: 'success' };
  if (score >= 60) return { level: 'good', label: 'Tốt', variant: 'default' };
  if (score >= 40) return { level: 'fair', label: 'Trung bình', variant: 'warning' };
  if (score >= 20) return { level: 'poor', label: 'Yếu', variant: 'destructive' };
  return { level: 'critical', label: 'Nguy hiểm', variant: 'destructive' };
};

/**
 * Dự đoán Churn Risk
 */
export const calculateChurnRisk = (customer: Customer): {
  risk: 'low' | 'medium' | 'high';
  label: string;
  variant: 'success' | 'warning' | 'destructive';
  reason: string;
} => {
  const daysSinceLastPurchase = customer.lastPurchaseDate 
    ? getDaysDiff(getCurrentDate(), new Date(customer.lastPurchaseDate))
    : Infinity;
  
  const totalOrders = customer.totalOrders || 0;
  
  // Nếu khách mới (chưa có đơn hoặc chỉ 1 đơn), dùng default 30 ngày
  // Nếu khách cũ, tính dựa trên thời gian từ createdAt đến lastPurchaseDate / số đơn
  let avgDaysBetweenOrders = 30; // Default
  if (totalOrders > 1 && customer.createdAt && customer.lastPurchaseDate) {
    const customerAge = getDaysDiff(new Date(customer.lastPurchaseDate), new Date(customer.createdAt));
    avgDaysBetweenOrders = Math.max(7, customerAge / (totalOrders - 1)); // Tối thiểu 7 ngày
  }
  
  // Khách vừa mua hàng gần đây (< 7 ngày) = low risk
  if (daysSinceLastPurchase <= 7) {
    return {
      risk: 'low',
      label: 'Nguy cơ thấp',
      variant: 'success',
      reason: 'Khách hàng đang hoạt động tốt'
    };
  }
  
  // High risk: Không mua > 2x thời gian trung bình hoặc > 365 ngày
  if (daysSinceLastPurchase > avgDaysBetweenOrders * 2 || daysSinceLastPurchase > 365) {
    return {
      risk: 'high',
      label: 'Nguy cơ cao',
      variant: 'destructive',
      reason: `Không mua hàng ${Math.floor(daysSinceLastPurchase)} ngày, vượt quá 2x chu kỳ trung bình`
    };
  }
  
  // Medium risk: Không mua > 1.5x thời gian trung bình hoặc > 180 ngày
  if (daysSinceLastPurchase > avgDaysBetweenOrders * 1.5 || daysSinceLastPurchase > 180) {
    return {
      risk: 'medium',
      label: 'Nguy cơ trung bình',
      variant: 'warning',
      reason: `Không mua hàng ${Math.floor(daysSinceLastPurchase)} ngày, đang giảm tần suất`
    };
  }
  
  // Low risk
  return {
    risk: 'low',
    label: 'Nguy cơ thấp',
    variant: 'success',
    reason: 'Khách hàng đang hoạt động tốt'
  };
};
