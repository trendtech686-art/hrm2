/**
 * API Hooks - Barrel Export
 * 
 * @deprecated Use feature-specific hooks instead:
 * - import { useEmployees } from '@/features/employees/hooks/use-employees'
 * - import { useProducts } from '@/features/products/hooks/use-products'
 * - import { useCustomers } from '@/features/customers/hooks/use-customers'
 * - import { useOrders } from '@/features/orders/hooks/use-orders'
 * - import { useBranches } from '@/features/settings/branches/hooks/use-branches'
 * 
 * These hooks are kept for backwards compatibility only.
 * All hooks now include gcTime + keepPreviousData for performance.
 */

// Core entities
export * from './use-employees'
export * from './use-products'
export * from './use-customers'
export * from './use-orders'
export * from './use-suppliers'
export * from './use-branches'

// Generic entity hooks factory
export * from './use-entity'
