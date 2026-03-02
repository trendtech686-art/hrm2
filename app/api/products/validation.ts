/**
 * API Validation Schemas for Products
 */
import { z } from 'zod'

// Query params for listing products
export const listProductsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
})

// Product type enum with case-insensitive parsing
const productTypeEnum = z.preprocess(
  (val) => typeof val === 'string' ? val.toUpperCase() : val,
  z.enum(['PHYSICAL', 'SERVICE', 'DIGITAL', 'COMBO']).optional()
);

// Weight unit enum with case-insensitive parsing and alias support
const weightUnitEnum = z.preprocess(
  (val) => {
    if (typeof val !== 'string') return val;
    const upper = val.toUpperCase();
    if (upper === 'G' || upper === 'GRAM') return 'GRAM';
    if (upper === 'KG' || upper === 'KILOGRAM') return 'KILOGRAM';
    return upper;
  },
  z.enum(['GRAM', 'KILOGRAM']).optional()
);

// Create product schema
export const createProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  sku: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  thumbnailImage: z.string().optional(),
  imageUrl: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  type: productTypeEnum,
  brandId: z.string().optional(),
  brandSystemId: z.string().optional(), // Added for frontend compatibility
  unit: z.string().optional().default('Cái'),
  costPrice: z.number().optional().default(0),
  sellingPrice: z.number().optional().default(0),
  minPrice: z.number().optional().default(0),
  lastPurchasePrice: z.number().optional().default(0),
  lastPurchaseDate: z.string().optional(),
  // taxRate removed - not used for products
  reorderLevel: z.number().optional().default(0),
  maxStock: z.number().optional(),
  weight: z.number().optional(),
  weightUnit: weightUnitEnum,
  barcode: z.string().optional(),
  warrantyPeriodMonths: z.number().optional().default(12),
  primarySupplierId: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional().default(false),
  isNewArrival: z.boolean().optional().default(false),
  isBestSeller: z.boolean().optional().default(false),
  isOnSale: z.boolean().optional().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  ktitle: z.string().optional(),
  sellerNote: z.string().optional(),
  slug: z.string().optional(),
  launchedDate: z.string().optional(),
  publishedAt: z.string().optional(),
  status: z.string().optional().default('ACTIVE'),
  createdBy: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  categorySystemIds: z.array(z.string()).optional(), // Added for frontend compatibility
  pkgxId: z.number().optional(),
  pkgxName: z.string().optional(),
  productTypeSystemId: z.string().optional(),
  seoPkgx: z.any().optional(),
  seoTrendtech: z.any().optional(), // SEO data for Trendtech website
  // Prices from form - Record<policySystemId, number>
  prices: z.record(z.string(), z.number()).optional(),
  // Initial inventory by branch - Record<branchSystemId, number>
  inventoryByBranch: z.record(z.string(), z.number()).optional(),
  // Tem phụ fields
  nameVat: z.string().optional(),
  origin: z.string().optional(),
  usageGuide: z.string().optional(),
  importerName: z.string().optional(),
  importerAddress: z.string().optional(),
  importerSystemId: z.string().optional(),
  // Inventory settings
  safetyStock: z.number().optional(),
  pkgxPrices: z.object({
    shop_price: z.number().optional(),
    market_price: z.number().optional(),
    partner_price: z.number().optional(),
    ace_price: z.number().optional(),
    deal_price: z.number().optional(),
  }).optional(),
  // NOTE: Không import inventory từ PKGX - HRM là nguồn chính cho tồn kho
})

// Update product schema
export const updateProductSchema = createProductSchema.partial()

export type ListProductsInput = z.infer<typeof listProductsSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
