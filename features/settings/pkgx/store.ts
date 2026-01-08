/**
 * PKGX Settings Store
 * Re-export from modular store structure
 * 
 * @deprecated Use React Query hooks instead:
 * - `usePkgxCategories()` for categories
 * - `usePkgxBrands()` for brands
 * - `useCategoryMappings()` for mappings
 * 
 * Import from: `@/features/settings/pkgx/hooks/use-pkgx`
 * 
 * Note: Keep config in Zustand, move sync data to React Query.
 * 
 * @module features/settings/pkgx/store
 */

export * from './store/index';
