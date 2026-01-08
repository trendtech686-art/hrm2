/**
 * Re-export ProductCategory type from centralized prisma-extended.ts
 * This file exists for backwards compatibility during migration
 */
export { type ProductCategory as Category } from '@/lib/types/prisma-extended';

// Re-export validation types
export type {
  CategoryBase,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilters,
} from './validation';
