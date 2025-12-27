/**
 * Orders Hooks - Index file
 * 
 * ⚠️ IMPORTANT: Only import from specific hook files, not from this index
 * 
 * This index is provided for convenience but direct imports are preferred:
 * ✅ import { useOrders } from '@/features/orders/hooks/use-orders'
 * ❌ import { useOrders } from '@/features/orders/hooks'
 */

// Query hooks
export { useOrders, useOrder, useOrderStats, orderKeys } from './use-orders';

// Mutation hooks
export { useOrderMutations } from './use-order-mutations';
export { useOrderActions } from './use-order-actions';

// Utility hooks
export { useDebounce } from './use-debounce';
export { useGlobalShippingConfig } from './use-global-shipping-config';
export { useShippingCalculator } from './use-shipping-calculator';
