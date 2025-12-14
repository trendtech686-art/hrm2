/**
 * useGlobalShippingConfig Hook
 * Get global shipping configuration and apply to order forms
 */

import * as React from 'react';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration';
import type { GlobalShippingConfig, DeliveryRequirement } from '@/lib/types/shipping-config';

/**
 * Map DeliveryRequirement to display text
 */
export const DELIVERY_REQUIREMENT_LABELS: Record<DeliveryRequirement, string> = {
  'ALLOW_CHECK_NOT_TRY': 'Cho xem hàng, không cho thử',
  'ALLOW_TRY': 'Cho thử hàng',
  'NOT_ALLOW_CHECK': 'Không cho xem hàng',
};

/**
 * Map DeliveryRequirement to GHTK tag
 * Tag 10: Cho xem hàng
 */
export function getGHTKTagsFromRequirement(requirement: DeliveryRequirement): number[] {
  switch (requirement) {
    case 'ALLOW_CHECK_NOT_TRY':
    case 'ALLOW_TRY':
      return [10]; // Tag 10: Cho xem hàng
    case 'NOT_ALLOW_CHECK':
    default:
      return [];
  }
}

/**
 * Calculate weight based on global config
 */
export function calculateWeight(
  config: GlobalShippingConfig,
  productWeights: number[] // Array of product weights in grams
): number {
  if (config.weight.mode === 'FROM_PRODUCTS') {
    // Sum all product weights
    const totalWeight = productWeights.reduce((sum, w) => sum + (w || 0), 0);
    // Minimum 100g for GHTK
    return Math.max(totalWeight, 100);
  } else {
    // Use custom value
    return config.weight.customValue || 100;
  }
}

/**
 * Get default dimensions from global config
 */
export function getDefaultDimensions(config: GlobalShippingConfig) {
  return {
    length: config.dimensions.length || 30,
    width: config.dimensions.width || 20,
    height: config.dimensions.height || 10,
  };
}

/**
 * Hook to get global shipping configuration
 */
export function useGlobalShippingConfig() {
  const [globalConfig, setGlobalConfig] = React.useState<GlobalShippingConfig>(() => {
    const config = loadShippingConfig();
    return config.global;
  });

  // Reload config when needed
  const reload = React.useCallback(() => {
    const config = loadShippingConfig();
    setGlobalConfig(config.global);
  }, []);

  // Get default shipping options based on global config
  const getDefaultShippingOptions = React.useCallback(() => {
    return {
      // Delivery requirement
      requirement: globalConfig.requirement,
      requirementLabel: DELIVERY_REQUIREMENT_LABELS[globalConfig.requirement],
      
      // Default note
      note: globalConfig.note || '',
      
      // GHTK specific tags based on requirement
      ghtkTags: getGHTKTagsFromRequirement(globalConfig.requirement),
      
      // Auto sync settings
      autoSyncCancelStatus: globalConfig.autoSyncCancelStatus,
      autoSyncCODCollection: globalConfig.autoSyncCODCollection,
      
      // Warning days
      latePickupWarningDays: globalConfig.latePickupWarningDays,
      lateDeliveryWarningDays: globalConfig.lateDeliveryWarningDays,
    };
  }, [globalConfig]);

  // Calculate weight for order based on products
  const getWeight = React.useCallback((productWeights: number[]) => {
    return calculateWeight(globalConfig, productWeights);
  }, [globalConfig]);

  // Get default dimensions
  const getDimensions = React.useCallback(() => {
    return getDefaultDimensions(globalConfig);
  }, [globalConfig]);

  return {
    globalConfig,
    reload,
    getDefaultShippingOptions,
    getWeight,
    getDimensions,
    // Direct access to config values
    weightMode: globalConfig.weight.mode,
    customWeight: globalConfig.weight.customValue,
    defaultDimensions: globalConfig.dimensions,
    deliveryRequirement: globalConfig.requirement,
    defaultNote: globalConfig.note,
  };
}
