import type { Order } from '../../orders/types';
import { parseDate, addMonths, toISODate, getCurrentDate } from '../../../lib/date-utils';

/**
 * Thông tin bảo hành của sản phẩm từ đơn hàng
 */
export interface ProductWarrantyInfo {
  orderId: string;
  orderDate: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  warrantyPeriodMonths: number;
  warrantyExpiry: string;
  isExpired: boolean;
  daysRemaining: number;
}

/**
 * Kết quả kiểm tra bảo hành
 */
export interface WarrantyCheckResult {
  isValid: boolean;
  totalPurchased: number;
  totalStillUnderWarranty: number;
  totalExpired: number;
  availableQuantity: number;
  warnings: string[];
  productHistory: ProductWarrantyInfo[];
}

/**
 * Tính ngày hết hạn bảo hành
 */
export function calculateWarrantyExpiry(orderDate: string, warrantyMonths: number): string {
  const date = parseDate(orderDate);
  if (!date) return orderDate;
  
  const expiry = addMonths(date, warrantyMonths);
  return toISODate(expiry);
}

/**
 * Tính số ngày còn lại đến hết hạn (< 0 nghĩa là đã hết hạn)
 */
export function calculateDaysRemaining(expiryDate: string): number {
  const expiry = parseDate(expiryDate);
  const today = getCurrentDate();
  
  if (!expiry) return -999;
  
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Lấy lịch sử mua hàng của sản phẩm từ khách hàng
 */
export function getProductPurchaseHistory(
  customerName: string,
  productName: string,
  allOrders: Order[],
  defaultWarrantyMonths: number = 12
): ProductWarrantyInfo[] {
  // Lọc đơn hàng của khách (đã hoàn thành)
  const customerOrders = allOrders.filter(
    order => 
      order.customerName === customerName && 
      order.status === 'Hoàn thành' // Chỉ tính đơn đã hoàn thành
  );

  const history: ProductWarrantyInfo[] = [];

  // Duyệt qua từng đơn hàng
  for (const order of customerOrders) {
    // Tìm sản phẩm trong đơn hàng
    const matchingItems = order.lineItems.filter(item => 
      item.productName.toLowerCase().includes(productName.toLowerCase()) ||
      productName.toLowerCase().includes(item.productName.toLowerCase())
    );

    for (const item of matchingItems) {
      // Lấy thời gian bảo hành (từ sản phẩm hoặc mặc định 12 tháng)
      const warrantyMonths = (item as { warrantyPeriodMonths?: number }).warrantyPeriodMonths || defaultWarrantyMonths;
      
      // Tính ngày hết hạn
      const expiryDate = calculateWarrantyExpiry(order.orderDate, warrantyMonths);
      const daysRemaining = calculateDaysRemaining(expiryDate);
      
      history.push({
        orderId: order.id,
        orderDate: order.orderDate,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        warrantyPeriodMonths: warrantyMonths,
        warrantyExpiry: expiryDate,
        isExpired: daysRemaining < 0,
        daysRemaining,
      });
    }
  }

  // Sắp xếp theo ngày mua (FIFO - cũ nhất trước)
  return history.sort((a, b) => 
    new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
  );
}

/**
 * Kiểm tra bảo hành sản phẩm theo FIFO
 */
export function checkWarrantyStatus(
  customerName: string,
  productName: string,
  requestedQuantity: number,
  allOrders: Order[],
  defaultWarrantyMonths: number = 12
): WarrantyCheckResult {
  // Lấy lịch sử mua hàng
  const history = getProductPurchaseHistory(
    customerName,
    productName,
    allOrders,
    defaultWarrantyMonths
  );

  const warnings: string[] = [];
  
  // Check 1: Khách chưa từng mua sản phẩm này
  if (history.length === 0) {
    warnings.push(`❌ Khách hàng chưa từng mua "${productName}"`);
    return {
      isValid: false,
      totalPurchased: 0,
      totalStillUnderWarranty: 0,
      totalExpired: 0,
      availableQuantity: 0,
      warnings,
      productHistory: [],
    };
  }

  // Tính tổng số lượng
  const totalPurchased = history.reduce((sum, h) => sum + h.quantity, 0);
  const totalStillUnderWarranty = history
    .filter(h => !h.isExpired)
    .reduce((sum, h) => sum + h.quantity, 0);
  const totalExpired = history
    .filter(h => h.isExpired)
    .reduce((sum, h) => sum + h.quantity, 0);

  // Check 2: Số lượng gửi > Số lượng đã mua
  if (requestedQuantity > totalPurchased) {
    warnings.push(
      `⚠️ Khách gửi ${requestedQuantity} cái nhưng chỉ mua ${totalPurchased} cái`
    );
  }

  // Check 3: Phân bổ theo FIFO và kiểm tra hết hạn
  let remainingToCheck = requestedQuantity;
  let availableCount = 0;

  for (const purchase of history) {
    if (remainingToCheck <= 0) break;

    const qtyToCheck = Math.min(remainingToCheck, purchase.quantity);
    
    if (!purchase.isExpired) {
      availableCount += qtyToCheck;
      
      // Cảnh báo sắp hết hạn (< 30 ngày)
      if (purchase.daysRemaining <= 30 && purchase.daysRemaining > 0) {
        warnings.push(
          `⏰ ${qtyToCheck} cái từ đơn #${purchase.orderId} sắp hết hạn (còn ${purchase.daysRemaining} ngày)`
        );
      }
    } else {
      warnings.push(
        `❌ ${qtyToCheck} cái từ đơn #${purchase.orderId} đã hết hạn bảo hành (${-purchase.daysRemaining} ngày)`
      );
    }

    remainingToCheck -= qtyToCheck;
  }

  // Check 4: Tất cả đều hết hạn
  if (availableCount === 0 && requestedQuantity > 0) {
    warnings.push(`🚫 TẤT CẢ ${requestedQuantity} sản phẩm đều ĐÃ HẾT HẠN bảo hành`);
  }

  // Check 5: Một số hết hạn, một số còn
  if (availableCount > 0 && availableCount < requestedQuantity) {
    warnings.push(
      `⚠️ Chỉ ${availableCount}/${requestedQuantity} cái còn bảo hành. ${requestedQuantity - availableCount} cái đã hết hạn.`
    );
  }

  return {
    isValid: availableCount > 0,
    totalPurchased,
    totalStillUnderWarranty,
    totalExpired,
    availableQuantity: availableCount,
    warnings,
    productHistory: history,
  };
}

/**
 * Tạo thông báo cho nhân viên
 */
export function generateWarrantyWarningMessage(result: WarrantyCheckResult): string {
  if (result.warnings.length === 0) {
    return '✅ Tất cả sản phẩm đều còn trong thời hạn bảo hành';
  }

  return result.warnings.join('\n');
}

/**
 * Lấy badge color cho trạng thái bảo hành
 */
export function getWarrantyStatusBadge(daysRemaining: number): {
  label: string;
  variant: 'default' | 'success' | 'warning' | 'destructive';
} {
  if (daysRemaining < 0) {
    return { label: 'Hết hạn', variant: 'destructive' };
  }
  if (daysRemaining <= 7) {
    return { label: 'Hết hạn trong 7 ngày', variant: 'destructive' };
  }
  if (daysRemaining <= 30) {
    return { label: 'Sắp hết hạn', variant: 'warning' };
  }
  if (daysRemaining <= 90) {
    return { label: `Còn ${daysRemaining} ngày`, variant: 'default' };
  }
  return { label: 'Còn hạn', variant: 'success' };
}
