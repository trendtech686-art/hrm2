// Re-export all PKGX types from central prisma-extended
export type {
  PkgxCategory,
  PkgxBrand,
  PkgxGalleryImage,
  PkgxCategoryMapping,
  PkgxBrandMapping,
  PkgxPriceMapping,
  PkgxSyncSettings,
  PkgxSyncLog,
  PkgxSyncResult,
  PkgxSettings,
  PkgxProduct,
  PkgxProductsResponse,
  PkgxImageUploadResponse,
  PkgxCategoryFromApi,
  PkgxCategoriesResponse,
  PkgxBrandFromApi,
  PkgxBrandsResponse,
  PkgxGalleryResponse,
  PkgxProductPayload,
} from '@/lib/types/prisma-extended';

export {
  DEFAULT_PKGX_SETTINGS,
  SYNC_INTERVAL_OPTIONS,
} from '@/lib/types/prisma-extended';

// ========================================
// UI State Types (local - không có trong prisma-extended)
// ========================================

export type PkgxSettingsTab = 
  | 'general'
  | 'categories'
  | 'brands'
  | 'category-mapping'
  | 'brand-mapping'
  | 'price-mapping'
  | 'product-mapping'
  | 'sync';

export type ConnectionTestResult = {
  success: boolean;
  message: string;
  productCount?: number;
};
