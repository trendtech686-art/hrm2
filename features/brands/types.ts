/**
 * Re-export Brand type from centralized prisma-extended.ts
 * This file exists for backwards compatibility during migration
 */
export { type Brand } from '@/lib/types/prisma-extended';

// Re-export validation types
export type {
  CreateBrandInput,
  UpdateBrandInput,
  BrandFilters,
} from './validation';
