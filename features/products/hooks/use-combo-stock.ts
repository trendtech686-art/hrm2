/**
 * Combo Stock Hooks
 * 
 * Reactive hooks để tính toán combo stock
 * Tự động update khi child product inventory thay đổi
 */

import * as React from 'react';
import { useProductStore } from '../store';
import { useBranchStore } from '../../settings/branches/store';
import { 
  calculateComboStock, 
  calculateComboStockAllBranches,
  getComboBottleneckProducts,
  isComboProduct 
} from '../combo-utils';
import type { Product, ComboItem } from '../types';
import type { SystemId } from '@/lib/id-types';

/**
 * Get reactive combo stock for a specific branch
 * Re-calculates when any child product inventory changes
 */
export function useComboStock(
  product: Product | null | undefined,
  branchSystemId: SystemId | undefined
): number {
  const { data: allProducts } = useProductStore();
  
  return React.useMemo(() => {
    if (!product || !branchSystemId) return 0;
    if (!isComboProduct(product) || !product.comboItems) return 0;
    
    return calculateComboStock(product.comboItems, allProducts, branchSystemId);
  }, [product, branchSystemId, allProducts]);
}

/**
 * Get reactive combo stock across all branches
 * Returns Record<BranchSystemId, stock>
 */
export function useComboStockAllBranches(
  product: Product | null | undefined
): Record<SystemId, number> {
  const { data: allProducts } = useProductStore();
  
  return React.useMemo(() => {
    if (!product) return {};
    if (!isComboProduct(product) || !product.comboItems) return {};
    
    return calculateComboStockAllBranches(product.comboItems, allProducts);
  }, [product, allProducts]);
}

/**
 * Get reactive combo stock with branch names
 */
export function useComboStockWithBranches(
  product: Product | null | undefined
): Array<{ branchSystemId: SystemId; branchName: string; stock: number }> {
  const { data: allProducts } = useProductStore();
  const { data: branches } = useBranchStore();
  
  return React.useMemo(() => {
    if (!product) return [];
    if (!isComboProduct(product) || !product.comboItems) return [];
    
    return branches.map(branch => ({
      branchSystemId: branch.systemId,
      branchName: branch.name,
      stock: calculateComboStock(product.comboItems!, allProducts, branch.systemId),
    }));
  }, [product, allProducts, branches]);
}

/**
 * Get bottleneck products for combo (which products limit the combo stock)
 */
export function useComboBottlenecks(
  product: Product | null | undefined,
  branchSystemId: SystemId | undefined
): Array<{ product: Product; availableForCombo: number; itemQuantity: number }> {
  const { data: allProducts } = useProductStore();
  
  return React.useMemo(() => {
    if (!product || !branchSystemId) return [];
    if (!isComboProduct(product) || !product.comboItems) return [];
    
    return getComboBottleneckProducts(product.comboItems, allProducts, branchSystemId);
  }, [product, branchSystemId, allProducts]);
}

/**
 * Get total combo stock across all branches
 */
export function useTotalComboStock(
  product: Product | null | undefined
): number {
  const stockByBranch = useComboStockAllBranches(product);
  
  return React.useMemo(() => {
    return Object.values(stockByBranch).reduce((sum, qty) => sum + qty, 0);
  }, [stockByBranch]);
}

/**
 * Check if combo has sufficient stock for order
 */
export function useHasComboStock(
  product: Product | null | undefined,
  branchSystemId: SystemId | undefined,
  requiredQuantity: number
): boolean {
  const stock = useComboStock(product, branchSystemId);
  return stock >= requiredQuantity;
}

/**
 * Get combo item details with current stock info
 */
export function useComboItemsWithStock(
  comboItems: ComboItem[] | undefined,
  branchSystemId: SystemId | undefined
): Array<{
  item: ComboItem;
  product: Product | undefined;
  onHand: number;
  committed: number;
  available: number;
  canMakeCombos: number;
}> {
  const { data: allProducts } = useProductStore();
  
  return React.useMemo(() => {
    if (!comboItems || !branchSystemId) return [];
    
    return comboItems.map(item => {
      const product = allProducts.find(p => p.systemId === item.productSystemId);
      const onHand = product?.inventoryByBranch?.[branchSystemId] || 0;
      const committed = product?.committedByBranch?.[branchSystemId] || 0;
      const available = onHand - committed;
      const canMakeCombos = Math.floor(available / item.quantity);
      
      return {
        item,
        product,
        onHand,
        committed,
        available,
        canMakeCombos,
      };
    });
  }, [comboItems, branchSystemId, allProducts]);
}
