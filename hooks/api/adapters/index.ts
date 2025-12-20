/**
 * Store Adapters - Barrel Export
 * These adapters bridge React Query with zustand-like interfaces
 * 
 * Usage:
 * - import { useEmployeeStoreV2 } from '@/hooks/api/adapters'
 * - Replace useEmployeeStore() with useEmployeeStoreV2()
 */

export * from './employee-adapter'
export * from './product-adapter'
export * from './customer-adapter'
export * from './order-adapter'
