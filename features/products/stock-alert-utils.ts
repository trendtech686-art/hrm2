import type { Product } from './types';
import type { SystemId } from '@/lib/id-types';
import { useSlaSettingsStore } from '../settings/inventory/sla-settings-store';

/**
 * Stock Alert Types for Products
 */
export type StockAlertType = 
  | 'out_of_stock'      // Hết hàng (available = 0)
  | 'low_stock'         // Sắp hết (available < reorderLevel)
  | 'below_safety'      // Dưới mức an toàn (available < safetyStock)
  | 'over_stock';       // Tồn kho cao (onHand > maxStock)

export type StockAlertSeverity = 'critical' | 'warning' | 'info';

export type StockAlert = {
  type: StockAlertType;
  severity: StockAlertSeverity;
  label: string;
  description: string;
  branchSystemId?: SystemId;
  branchName?: string;
};

type Thresholds = {
  reorderLevel?: number;
  safetyStock?: number;
  maxStock?: number;
};

const isDefinedNumber = (value: number | undefined): value is number => typeof value === 'number' && !Number.isNaN(value);

const getEffectiveThresholds = (product: Product): Thresholds => {
  const { settings } = useSlaSettingsStore.getState();
  const thresholds: Thresholds = {};

  const reorderLevel = product.reorderLevel ?? settings.defaultReorderLevel;
  if (isDefinedNumber(reorderLevel)) {
    thresholds.reorderLevel = reorderLevel;
  }

  const safetyStock = product.safetyStock ?? settings.defaultSafetyStock;
  if (isDefinedNumber(safetyStock)) {
    thresholds.safetyStock = safetyStock;
  }

  const maxStock = product.maxStock ?? settings.defaultMaxStock;
  if (isDefinedNumber(maxStock)) {
    thresholds.maxStock = maxStock;
  }

  return thresholds;
};

/**
 * Get stock alert label and color based on type
 */
export const STOCK_ALERT_CONFIG: Record<StockAlertType, {
  label: string;
  severity: StockAlertSeverity;
  badgeVariant: 'destructive' | 'warning' | 'secondary' | 'outline';
  icon: string;
}> = {
  out_of_stock: {
    label: 'Hết hàng',
    severity: 'critical',
    badgeVariant: 'destructive',
    icon: '🔴',
  },
  low_stock: {
    label: 'Sắp hết hàng',
    severity: 'warning',
    badgeVariant: 'warning',
    icon: '🟡',
  },
  below_safety: {
    label: 'Dưới mức an toàn',
    severity: 'warning',
    badgeVariant: 'warning',
    icon: '🟠',
  },
  over_stock: {
    label: 'Tồn kho cao',
    severity: 'info',
    badgeVariant: 'secondary',
    icon: '🔵',
  },
};

/**
 * Calculate total available stock across all branches
 */
export function getTotalAvailableStock(product: Product): number {
  const totalOnHand = Object.values(product.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0);
  const totalCommitted = Object.values(product.committedByBranch || {}).reduce((sum, qty) => sum + qty, 0);
  return totalOnHand - totalCommitted;
}

/**
 * Calculate total on-hand stock across all branches
 */
export function getTotalOnHandStock(product: Product): number {
  return Object.values(product.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0);
}

/**
 * Get stock alerts for a product (total across all branches)
 */
export function getProductStockAlerts(product: Product): StockAlert[] {
  const alerts: StockAlert[] = [];
  
  // Skip combo products (they have virtual stock)
  if (product.type === 'combo') return alerts;
  
  // Skip non-stock-tracked products (services, digital)
  if (product.isStockTracked === false) return alerts;
  
  const totalOnHand = getTotalOnHandStock(product);
  const totalAvailable = getTotalAvailableStock(product);
  const { reorderLevel, safetyStock, maxStock } = getEffectiveThresholds(product);
  
  // Check out of stock
  if (totalAvailable <= 0) {
    alerts.push({
      type: 'out_of_stock',
      severity: 'critical',
      label: STOCK_ALERT_CONFIG.out_of_stock.label,
      description: 'Sản phẩm đã hết hàng có thể bán',
    });
    return alerts; // If out of stock, don't show other alerts
  }
  
  // Check low stock (below reorder level)
  if (isDefinedNumber(reorderLevel) && totalAvailable < reorderLevel) {
    alerts.push({
      type: 'low_stock',
      severity: 'warning',
      label: STOCK_ALERT_CONFIG.low_stock.label,
      description: `Tồn kho (${totalAvailable}) dưới mức đặt hàng lại (${reorderLevel})`,
    });
  }
  
  // Check below safety stock
  if (
    isDefinedNumber(safetyStock) &&
    totalAvailable < safetyStock &&
    !alerts.some(a => a.type === 'low_stock')
  ) {
    alerts.push({
      type: 'below_safety',
      severity: 'warning',
      label: STOCK_ALERT_CONFIG.below_safety.label,
      description: `Tồn kho (${totalAvailable}) dưới mức an toàn (${safetyStock})`,
    });
  }
  
  // Check over stock
  if (isDefinedNumber(maxStock) && totalOnHand > maxStock) {
    alerts.push({
      type: 'over_stock',
      severity: 'info',
      label: STOCK_ALERT_CONFIG.over_stock.label,
      description: `Tồn kho (${totalOnHand}) vượt mức tối đa (${maxStock})`,
    });
  }
  
  return alerts;
}

/**
 * Get stock alerts for a product at a specific branch
 */
export function getProductStockAlertsByBranch(
  product: Product,
  branchSystemId: SystemId,
  branchName: string
): StockAlert[] {
  const alerts: StockAlert[] = [];
  
  // Skip combo products
  if (product.type === 'combo') return alerts;
  
  // Skip non-stock-tracked products
  if (product.isStockTracked === false) return alerts;
  
  const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
  const committed = product.committedByBranch?.[branchSystemId] || 0;
  const available = onHand - committed;
  const { reorderLevel } = getEffectiveThresholds(product);
  
  // Check out of stock at branch
  if (available <= 0) {
    alerts.push({
      type: 'out_of_stock',
      severity: 'critical',
      label: STOCK_ALERT_CONFIG.out_of_stock.label,
      description: `Hết hàng tại ${branchName}`,
      branchSystemId,
      branchName,
    });
    return alerts;
  }
  
  // Check low stock at branch (using product-level thresholds)
  if (isDefinedNumber(reorderLevel) && available < reorderLevel) {
    alerts.push({
      type: 'low_stock',
      severity: 'warning',
      label: STOCK_ALERT_CONFIG.low_stock.label,
      description: `Tồn (${available}) < mức đặt hàng (${reorderLevel}) tại ${branchName}`,
      branchSystemId,
      branchName,
    });
  }
  
  return alerts;
}

/**
 * Get the most severe alert for display purposes
 */
export function getMostSevereAlert(alerts: StockAlert[]): StockAlert | null {
  if (alerts.length === 0) return null;
  
  // Priority: critical > warning > info
  const critical = alerts.find(a => a.severity === 'critical');
  if (critical) return critical;
  
  const warning = alerts.find(a => a.severity === 'warning');
  if (warning) return warning;
  
  return alerts[0];
}

/**
 * Check if product needs reorder (for reports/dashboards)
 */
export function needsReorder(product: Product): boolean {
  if (product.type === 'combo') return false;
  if (product.isStockTracked === false) return false;
  const { reorderLevel } = getEffectiveThresholds(product);
  if (!isDefinedNumber(reorderLevel)) return false;
  
  const totalAvailable = getTotalAvailableStock(product);
  return totalAvailable < reorderLevel;
}

/**
 * Check if product is out of stock
 */
export function isOutOfStock(product: Product): boolean {
  if (product.type === 'combo') return false;
  if (product.isStockTracked === false) return false;
  
  const totalAvailable = getTotalAvailableStock(product);
  return totalAvailable <= 0;
}

/**
 * Get suggested order quantity to reach safety level
 */
export function getSuggestedOrderQuantity(product: Product): number {
  if (product.type === 'combo') return 0;
  if (product.isStockTracked === false) return 0;
  const { safetyStock, reorderLevel } = getEffectiveThresholds(product);
  const totalOnHand = getTotalOnHandStock(product);
  const targetLevel = safetyStock ?? reorderLevel ?? 0;
  
  if (targetLevel <= totalOnHand) return 0;
  
  return targetLevel - totalOnHand;
}
