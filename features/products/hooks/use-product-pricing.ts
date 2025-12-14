/**
 * Product Pricing Hooks
 * 
 * Custom hooks để tránh gọi getState() trong render
 * và đảm bảo reactivity với pricing policy changes
 */

import * as React from 'react';
import { usePricingPolicyStore } from '../../settings/pricing/store';
import type { PricingPolicy } from '../../settings/pricing/types';
import type { Product } from '../types';
import { calculateComboPrice, isComboProduct } from '../combo-utils';
import { useProductStore } from '../store';
import type { SystemId } from '@/lib/id-types';

/**
 * Get default selling pricing policy (reactive)
 */
export function useDefaultSellingPolicy(): PricingPolicy | undefined {
  const { data: pricingPolicies } = usePricingPolicyStore();
  
  return React.useMemo(() => {
    return pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault);
  }, [pricingPolicies]);
}

/**
 * Get all selling pricing policies (reactive)
 */
export function useSalesPolicies(): PricingPolicy[] {
  const { data: pricingPolicies } = usePricingPolicyStore();
  
  return React.useMemo(() => {
    return pricingPolicies.filter(p => p.type === 'Bán hàng');
  }, [pricingPolicies]);
}

/**
 * Get product price for default policy (reactive)
 * Handles both regular products and combos
 */
export function useProductDefaultPrice(product: Product | null | undefined): number {
  const defaultPolicy = useDefaultSellingPolicy();
  const { data: allProducts } = useProductStore();
  
  return React.useMemo(() => {
    if (!product || !defaultPolicy) return 0;
    
    // For combo products, calculate price based on pricing type
    if (isComboProduct(product) && product.comboItems) {
      return calculateComboPrice(
        product.comboItems,
        allProducts,
        defaultPolicy.systemId as SystemId,
        product.comboPricingType || 'fixed',
        product.comboDiscount || 0
      );
    }
    
    // Regular product - get from prices record
    return product.prices?.[defaultPolicy.systemId] || 0;
  }, [product, defaultPolicy, allProducts]);
}

/**
 * Get product prices for all policies (reactive)
 */
export function useProductPrices(product: Product | null | undefined): Record<string, number> {
  const { data: pricingPolicies } = usePricingPolicyStore();
  const { data: allProducts } = useProductStore();
  
  return React.useMemo(() => {
    if (!product) return {};
    
    const salesPolicies = pricingPolicies.filter(p => p.type === 'Bán hàng');
    const prices: Record<string, number> = {};
    
    for (const policy of salesPolicies) {
      if (isComboProduct(product) && product.comboItems) {
        prices[policy.systemId] = calculateComboPrice(
          product.comboItems,
          allProducts,
          policy.systemId as SystemId,
          product.comboPricingType || 'fixed',
          product.comboDiscount || 0
        );
      } else {
        prices[policy.systemId] = product.prices?.[policy.systemId] || 0;
      }
    }
    
    return prices;
  }, [product, pricingPolicies, allProducts]);
}

/**
 * Format price with policy name
 */
export function usePriceWithPolicyName(
  product: Product | null | undefined, 
  policySystemId: string
): { price: number; policyName: string } {
  const { data: pricingPolicies } = usePricingPolicyStore();
  const { data: allProducts } = useProductStore();
  
  return React.useMemo(() => {
    const policy = pricingPolicies.find(p => p.systemId === policySystemId);
    if (!product || !policy) return { price: 0, policyName: '' };
    
    let price = 0;
    if (isComboProduct(product) && product.comboItems) {
      price = calculateComboPrice(
        product.comboItems,
        allProducts,
        policySystemId as SystemId,
        product.comboPricingType || 'fixed',
        product.comboDiscount || 0
      );
    } else {
      price = product.prices?.[policySystemId] || 0;
    }
    
    return { price, policyName: policy.name };
  }, [product, policySystemId, pricingPolicies, allProducts]);
}
