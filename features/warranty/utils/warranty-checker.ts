import type { Order } from '../../orders/types';
import { parseDate, addMonths, toISODate, getCurrentDate, formatDate } from '../../../lib/date-utils';

/**
 * Format date to dd/MM/yyyy for display
 */
export function formatDisplayDate(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date) return dateStr;
  return formatDate(date, 'dd/MM/yyyy');
}

/**
 * Thông tin bảo hành của sản phẩm từ đơn hàng
 */
export interface ProductWarrantyInfo {
  orderId: string;
  orderSystemId: string; // ✅ Thêm systemId để tạo link
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
  totalClaimed: number; // Số lượng đã bảo hành trước đó
  availableQuantity: number; // Số lượng còn có thể bảo hành = tổng mua - đã bảo hành
  warnings: string[];
  productHistory: ProductWarrantyInfo[];
  warrantyIds: string[]; // ✅ Danh sách mã phiếu BH liên quan
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
 * ✅ Cache kết quả để tránh tính toán trùng lặp
 */
const purchaseHistoryCache = new Map<string, ProductWarrantyInfo[]>();
const CACHE_TTL = 5000; // 5 seconds

export function getProductPurchaseHistory(
  customerName: string,
  productName: string,
  allOrders: Order[],
  defaultWarrantyMonths: number = 12
): ProductWarrantyInfo[] {
  // Create cache key
  const cacheKey = `${customerName}|${productName}|${defaultWarrantyMonths}`;

  // Check cache first
  const cached = purchaseHistoryCache.get(cacheKey);
  if (cached && cached._cachedAt && Date.now() - cached._cachedAt < CACHE_TTL) {
    return cached;
  }

  // Lọc đơn hàng của khách (đã hoàn thành)
  const customerOrders = allOrders.filter(
    order =>
      order.customerName === customerName &&
      order.status === 'Hoàn thành'
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
        orderSystemId: order.systemId, // ✅ Thêm systemId để tạo link
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
  const sortedHistory = history.sort((a, b) =>
    new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
  );

  // Cache kết quả
  const cachedResult = sortedHistory as (ProductWarrantyInfo & { _cachedAt: number })[];
  cachedResult._cachedAt = Date.now();
  purchaseHistoryCache.set(cacheKey, cachedResult);

  return sortedHistory;
}

/**
 * Kiểm tra bảo hành sản phẩm theo FIFO
 * ✅ Export function để clear cache khi cần
 * @param claimedQuantity Số lượng đã được bảo hành trước đó (từ warranty tickets đã hoàn tất)
 * @param warrantyIds Danh sách mã phiếu BH liên quan
 */
export function checkWarrantyStatus(
  customerName: string,
  productName: string,
  requestedQuantity: number,
  allOrders: Order[],
  defaultWarrantyMonths: number = 12,
  claimedQuantity: number = 0, // Số lượng đã bảo hành trước đó
  warrantyIds: string[] = [] // ✅ Danh sách mã phiếu BH
): WarrantyCheckResult {
  // Clear cache when orders change to ensure fresh data
  purchaseHistoryCache.clear();

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
    // ✅ KHÔNG hiện claimed quantity nếu chưa từng mua - có thể là sản phẩm khác trùng tên
    warnings.push(`❌ Khách hàng chưa từng mua "${productName}"`);
    return {
      isValid: false,
      totalPurchased: 0,
      totalStillUnderWarranty: 0,
      totalExpired: 0,
      totalClaimed: 0, // ✅ Không hiện claimed nếu chưa mua
      availableQuantity: 0,
      warnings,
      productHistory: [],
    };
  }

  // Tính tổng số lượng
  const totalPurchased = history.reduce((sum, h) => sum + h.quantity, 0);
  const firstPurchaseDate = history.length > 0 ? formatDisplayDate(history[0].orderDate) : '';
  const totalStillUnderWarranty = history
    .filter(h => !h.isExpired)
    .reduce((sum, h) => sum + h.quantity, 0);
  const totalExpired = history
    .filter(h => h.isExpired)
    .reduce((sum, h) => sum + h.quantity, 0);

  // Tính số lượng khả dụng = tổng mua - đã bảo hành
  const totalClaimed = claimedQuantity;
  const availableQuantity = Math.max(0, totalPurchased - claimedQuantity);

  // Warning nếu đã từng bảo hành
  if (claimedQuantity > 0) {
    warnings.push(`📋 Đã bảo hành: ${claimedQuantity} cái → Còn ${availableQuantity} cái khả dụng`);
  }

  // Check: Số lượng gửi > Số lượng đã mua
  if (requestedQuantity > totalPurchased) {
    warnings.push(
      `❌ Vượt quá: Khách gửi ${requestedQuantity} cái nhưng chỉ mua ${totalPurchased} cái (từ ${firstPurchaseDate})`
    );
  }

  // Check 3: Phân bổ theo FIFO và kiểm tra hết hạn
  let remainingToCheck = Math.min(requestedQuantity, availableQuantity);
  let stillAvailable = 0;

  for (const purchase of history) {
    if (remainingToCheck <= 0) break;

    const qtyToCheck = Math.min(remainingToCheck, purchase.quantity);
    const purchaseDateDisplay = formatDisplayDate(purchase.orderDate);

    if (!purchase.isExpired) {
      stillAvailable += qtyToCheck;

      // Cảnh báo sắp hết hạn (< 30 ngày)
      if (purchase.daysRemaining <= 30 && purchase.daysRemaining > 0) {
        warnings.push(
          `⏰ #${purchase.orderId} sắp hết BH (còn ${purchase.daysRemaining} ngày)`
        );
      }
    } else {
      warnings.push(
        `❌ #${purchase.orderId} đã hết hạn BH (quá ${-purchase.daysRemaining} ngày)`
      );
    }

    remainingToCheck -= qtyToCheck;
  }

  // Check 4: Tất cả đều hết hạn
  if (stillAvailable === 0 && requestedQuantity > 0 && totalStillUnderWarranty === 0) {
    warnings.push(`🚫 Tất cả sản phẩm đều ĐÃ HẾT HẠN bảo hành`);
  }

  // Check 5: Một số hết hạn, một số còn
  if (stillAvailable > 0 && stillAvailable < requestedQuantity) {
    warnings.push(
      `⚠️ Chỉ ${stillAvailable}/${requestedQuantity} cái còn hạn BH`
    );
  }

  return {
    isValid: stillAvailable > 0,
    totalPurchased,
    totalStillUnderWarranty,
    totalExpired,
    totalClaimed,
    availableQuantity: stillAvailable,
    warnings,
    productHistory: history,
    warrantyIds,
  };
}

/**
 * Clear purchase history cache - call when orders change
 */
export function clearPurchaseHistoryCache() {
  purchaseHistoryCache.clear();
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
