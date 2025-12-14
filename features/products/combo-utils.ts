/**
 * Combo Product Utilities
 * ═══════════════════════════════════════════════════════════════
 * Tham khảo: Sapo Combo
 * - Combo không có tồn kho riêng
 * - Tồn kho combo = MIN(tồn kho SP con / số lượng trong combo)
 * - Tối đa 20 sản phẩm con
 * - Không cho phép combo lồng combo
 * ═══════════════════════════════════════════════════════════════
 */

import type { Product, ComboItem, ComboPricingType } from './types';
import type { SystemId } from '@/lib/id-types';

// Constants
export const MAX_COMBO_ITEMS = 20;
export const MIN_COMBO_ITEMS = 2;

/**
 * Check if product is a combo
 */
export function isComboProduct(product: Product): boolean {
  return product.type === 'combo';
}

/**
 * Check if a product can be added to combo
 * - Không cho phép thêm combo vào combo (no nested combo)
 * - Sản phẩm phải active
 */
export function canAddToCombo(product: Product): boolean {
  if (product.type === 'combo') return false;
  if (product.status === 'discontinued') return false;
  if (product.isDeleted) return false;
  return true;
}

/**
 * Validate combo items
 * Returns error message or null if valid
 */
export function validateComboItems(
  comboItems: ComboItem[],
  allProducts: Product[]
): string | null {
  // Check minimum items
  if (comboItems.length < MIN_COMBO_ITEMS) {
    return `Combo phải có ít nhất ${MIN_COMBO_ITEMS} sản phẩm`;
  }
  
  // Check maximum items
  if (comboItems.length > MAX_COMBO_ITEMS) {
    return `Combo chỉ được tối đa ${MAX_COMBO_ITEMS} sản phẩm`;
  }
  
  // Check for duplicate products
  const productIds = comboItems.map(item => item.productSystemId);
  const uniqueIds = new Set(productIds);
  if (uniqueIds.size !== productIds.length) {
    return 'Combo không được chứa sản phẩm trùng lặp';
  }
  
  // Check each item
  for (const item of comboItems) {
    // Check quantity
    if (item.quantity < 1) {
      return 'Số lượng sản phẩm trong combo phải >= 1';
    }
    
    if (!Number.isInteger(item.quantity)) {
      return 'Số lượng sản phẩm trong combo phải là số nguyên';
    }
    
    // Check product exists and is valid
    const product = allProducts.find(p => p.systemId === item.productSystemId);
    if (!product) {
      return 'Sản phẩm trong combo không tồn tại';
    }
    
    if (!canAddToCombo(product)) {
      return `Sản phẩm "${product.name}" không thể thêm vào combo`;
    }
  }
  
  return null;
}

/**
 * Calculate combo available stock for a specific branch
 * Formula: MIN(child_product_available / quantity_in_combo)
 * 
 * @param comboItems - List of combo items
 * @param allProducts - All products to lookup
 * @param branchSystemId - Branch to calculate stock for
 * @returns Available combo quantity (floored to integer)
 */
export function calculateComboStock(
  comboItems: ComboItem[],
  allProducts: Product[],
  branchSystemId: SystemId
): number {
  if (!comboItems || comboItems.length === 0) return 0;
  
  let minComboQuantity = Infinity;
  
  for (const item of comboItems) {
    const product = allProducts.find(p => p.systemId === item.productSystemId);
    if (!product) return 0; // If any product not found, combo unavailable
    
    // Available = On-hand - Committed
    const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
    const committed = product.committedByBranch?.[branchSystemId] || 0;
    const available = onHand - committed;
    
    // How many combos can we make from this product?
    const comboQuantityFromThisProduct = Math.floor(available / item.quantity);
    
    minComboQuantity = Math.min(minComboQuantity, comboQuantityFromThisProduct);
  }
  
  return minComboQuantity === Infinity ? 0 : Math.max(0, minComboQuantity);
}

/**
 * Calculate combo stock across all branches
 * Returns a map of branchSystemId -> available combo quantity
 */
export function calculateComboStockAllBranches(
  comboItems: ComboItem[],
  allProducts: Product[]
): Record<SystemId, number> {
  if (!comboItems || comboItems.length === 0) return {};
  
  // Collect all branch IDs from child products
  const allBranchIds = new Set<SystemId>();
  for (const item of comboItems) {
    const product = allProducts.find(p => p.systemId === item.productSystemId);
    if (product?.inventoryByBranch) {
      Object.keys(product.inventoryByBranch).forEach(branchId => {
        allBranchIds.add(branchId as SystemId);
      });
    }
  }
  
  // Calculate stock for each branch
  const result: Record<SystemId, number> = {};
  for (const branchId of allBranchIds) {
    result[branchId] = calculateComboStock(comboItems, allProducts, branchId);
  }
  
  return result;
}

/**
 * Calculate combo price based on pricing type
 * 
 * @param comboItems - List of combo items
 * @param allProducts - All products to lookup prices
 * @param pricingPolicySystemId - Which pricing policy to use
 * @param comboPricingType - How to calculate price
 * @param comboDiscount - Discount value (% or fixed amount)
 * @returns Calculated combo price
 */
export function calculateComboPrice(
  comboItems: ComboItem[],
  allProducts: Product[],
  pricingPolicySystemId: SystemId,
  comboPricingType: ComboPricingType,
  comboDiscount: number = 0
): number {
  if (comboPricingType === 'fixed') {
    // Fixed price is stored directly, not calculated
    return comboDiscount; // In fixed mode, comboDiscount IS the price
  }
  
  // Calculate sum of child products' prices
  let sumPrice = 0;
  for (const item of comboItems) {
    const product = allProducts.find(p => p.systemId === item.productSystemId);
    if (!product) continue;
    
    const unitPrice = product.prices?.[pricingPolicySystemId] || 0;
    sumPrice += unitPrice * item.quantity;
  }
  
  // Apply discount
  if (comboPricingType === 'sum_discount_percent') {
    const discountAmount = sumPrice * (comboDiscount / 100);
    return Math.round(sumPrice - discountAmount);
  }
  
  if (comboPricingType === 'sum_discount_amount') {
    return Math.max(0, sumPrice - comboDiscount);
  }
  
  return sumPrice;
}

/**
 * Calculate combo cost price (sum of child products' cost prices)
 */
type ComboCostOptions = {
  /**
   * Optional pricing policy to use when we have to fall back to selling price data.
   * Ensures cost previews stay in sync with the price policy that users actually see.
   */
  fallbackPricingPolicyId?: SystemId;
  /**
   * Allow falling back to selling price data if cost/last purchase/min price are missing.
   * Defaults to true to avoid showing zero cost when data is incomplete.
   */
  allowPriceFallback?: boolean;
};

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

export function calculateComboCostPrice(
  comboItems: ComboItem[],
  allProducts: Product[],
  options: ComboCostOptions = {}
): number {
  const { fallbackPricingPolicyId, allowPriceFallback = true } = options;
  let totalCost = 0;
  
  for (const item of comboItems) {
    const product = allProducts.find(p => p.systemId === item.productSystemId);
    if (!product) continue;

    let unitCost = product.costPrice;

    if (!isNumber(unitCost) && isNumber(product.lastPurchasePrice)) {
      unitCost = product.lastPurchasePrice;
    }

    if (!isNumber(unitCost) && allowPriceFallback) {
      if (fallbackPricingPolicyId && isNumber(product.prices?.[fallbackPricingPolicyId])) {
        unitCost = product.prices![fallbackPricingPolicyId];
      }

      if (!isNumber(unitCost)) {
        const firstPrice = Object.values(product.prices || {}).find((price): price is number => isNumber(price));
        if (isNumber(firstPrice)) {
          unitCost = firstPrice;
        }
      }
    }

    if (!isNumber(unitCost) && isNumber(product.minPrice)) {
      unitCost = product.minPrice;
    }
    
    totalCost += (unitCost || 0) * item.quantity;
  }
  
  return totalCost;
}

/**
 * Calculate combo last purchase price (sum of child products' last purchase prices)
 */
export function calculateComboLastPurchasePrice(
  comboItems: ComboItem[],
  allProducts: Product[]
): number {
  let total = 0;
  
  for (const item of comboItems) {
    const product = allProducts.find(p => p.systemId === item.productSystemId);
    if (!product) continue;
    
    total += (product.lastPurchasePrice || 0) * item.quantity;
  }
  
  return total;
}

/**
 * Calculate combo min price (sum of child products' min prices)
 */
export function calculateComboMinPrice(
  comboItems: ComboItem[],
  allProducts: Product[]
): number {
  let total = 0;
  
  for (const item of comboItems) {
    const product = allProducts.find(p => p.systemId === item.productSystemId);
    if (!product) continue;
    
    total += (product.minPrice || 0) * item.quantity;
  }
  
  return total;
}

/**
 * Calculate combo prices by policy (sum of child products' prices per policy)
 * This returns the RAW sum without any discount applied
 */
export function calculateComboPricesByPolicy(
  comboItems: ComboItem[],
  allProducts: Product[]
): Record<string, number> {
  const pricesByPolicy: Record<string, number> = {};
  
  for (const item of comboItems) {
    const product = allProducts.find(p => p.systemId === item.productSystemId);
    if (!product || !product.prices) continue;
    
    for (const [policyId, price] of Object.entries(product.prices)) {
      if (!pricesByPolicy[policyId]) {
        pricesByPolicy[policyId] = 0;
      }
      pricesByPolicy[policyId] += (price || 0) * item.quantity;
    }
  }
  
  return pricesByPolicy;
}

/**
 * Calculate final combo prices by policy with discount applied
 * This returns the actual selling prices for the combo
 * 
 * @param comboItems - List of combo items
 * @param allProducts - All products to lookup prices
 * @param comboPricingType - How to calculate price
 * @param comboDiscount - Discount value (% or fixed amount or fixed price)
 * @param defaultPolicyId - Default selling policy ID (used for fixed pricing)
 * @returns Final combo prices by policy
 */
export function calculateFinalComboPricesByPolicy(
  comboItems: ComboItem[],
  allProducts: Product[],
  comboPricingType: ComboPricingType,
  comboDiscount: number = 0,
  defaultPolicyId?: string
): Record<string, number> {
  // Get raw sum prices first
  const rawPricesByPolicy = calculateComboPricesByPolicy(comboItems, allProducts);
  const finalPricesByPolicy: Record<string, number> = {};
  
  if (comboPricingType === 'fixed') {
    // For fixed pricing, only policies that exist on child products should be auto-filled.
    for (const policyId of Object.keys(rawPricesByPolicy)) {
      finalPricesByPolicy[policyId] = comboDiscount; // comboDiscount IS the price in fixed mode
    }
    return finalPricesByPolicy;
  }
  
  // For discount-based pricing, apply discount to each policy's sum
  for (const [policyId, sumPrice] of Object.entries(rawPricesByPolicy)) {
    if (comboPricingType === 'sum_discount_percent') {
      const discountAmount = sumPrice * (comboDiscount / 100);
      finalPricesByPolicy[policyId] = Math.round(sumPrice - discountAmount);
    } else if (comboPricingType === 'sum_discount_amount') {
      finalPricesByPolicy[policyId] = Math.max(0, sumPrice - comboDiscount);
    } else {
      // No discount, use raw sum
      finalPricesByPolicy[policyId] = sumPrice;
    }
  }
  
  return finalPricesByPolicy;
}

/**
 * Get summary text for combo (e.g., "3 sản phẩm, tồn kho: 15")
 */
export function getComboSummary(
  comboItems: ComboItem[],
  allProducts: Product[],
  branchSystemId?: SystemId
): string {
  const itemCount = comboItems?.length || 0;
  
  if (!branchSystemId) {
    return `${itemCount} sản phẩm`;
  }
  
  const stock = calculateComboStock(comboItems, allProducts, branchSystemId);
  return `${itemCount} sản phẩm, tồn kho: ${stock}`;
}

/**
 * Check if combo has sufficient stock for a quantity
 */
export function hasComboStock(
  comboItems: ComboItem[],
  allProducts: Product[],
  branchSystemId: SystemId,
  requiredQuantity: number
): boolean {
  const available = calculateComboStock(comboItems, allProducts, branchSystemId);
  return available >= requiredQuantity;
}

/**
 * Get the limiting product(s) for combo stock
 * Returns the product(s) that have the lowest available combo quantity
 */
export function getComboBottleneckProducts(
  comboItems: ComboItem[],
  allProducts: Product[],
  branchSystemId: SystemId
): Array<{ product: Product; availableForCombo: number; itemQuantity: number }> {
  if (!comboItems || comboItems.length === 0) return [];
  
  const comboStock = calculateComboStock(comboItems, allProducts, branchSystemId);
  const bottlenecks: Array<{ product: Product; availableForCombo: number; itemQuantity: number }> = [];
  
  for (const item of comboItems) {
    const product = allProducts.find(p => p.systemId === item.productSystemId);
    if (!product) continue;
    
    const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
    const committed = product.committedByBranch?.[branchSystemId] || 0;
    const available = onHand - committed;
    const comboQuantityFromThisProduct = Math.floor(available / item.quantity);
    
    // This product is a bottleneck if it limits the combo quantity
    if (comboQuantityFromThisProduct === comboStock) {
      bottlenecks.push({
        product,
        availableForCombo: comboQuantityFromThisProduct,
        itemQuantity: item.quantity,
      });
    }
  }
  
  return bottlenecks;
}
