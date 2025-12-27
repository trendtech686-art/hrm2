// Re-export all product types from central prisma-extended
export type {
  ProductStatus,
  ProductType,
  ComboItem,
  ComboPricingType,
  ProductVariant,
  VariantAttribute,
  Product,
} from '@/lib/types/prisma-extended';

// Re-export website SEO types from settings/inventory
export type { WebsiteSeoData, MultiWebsiteSeo } from '@/features/settings/inventory/types';
