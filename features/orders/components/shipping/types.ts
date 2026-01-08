/**
 * Shipping Integration Types
 * Re-export from centralized prisma-extended
 */

// Re-export all shipping types from central prisma-extended
export type {
  DeliveryMethod,
  OrderShippingService as ShippingService,
  ShippingCalculationRequest,
  ShippingCalculationResult,
  SelectedShippingConfig,
  ShippingAddressInfo as ShippingAddress,
  PackageInfo,
  ShippingCacheKey,
  ShippingOptions,
} from '@/lib/types/prisma-extended';
