import { z } from 'zod';

// =============================================
// PRODUCT TYPE SETTINGS SCHEMAS
// =============================================

export const createProductTypeSchema = z.object({
  id: z.string().min(1, 'Mã loại sản phẩm không được để trống'),
  name: z.string().min(1, 'Tên loại sản phẩm không được để trống'),
  description: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const updateProductTypeSchema = createProductTypeSchema.partial();

export const productTypeFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateProductTypeInput = z.infer<typeof createProductTypeSchema>;
export type UpdateProductTypeInput = z.infer<typeof updateProductTypeSchema>;
export type ProductTypeFilter = z.infer<typeof productTypeFilterSchema>;

// =============================================
// PRODUCT CATEGORY SCHEMAS
// =============================================

export const websiteSeoDataSchema = z.object({
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
});

export const multiWebsiteSeoSchema = z.record(z.string(), websiteSeoDataSchema).optional();

export const createProductCategorySchema = z.object({
  id: z.string().min(1, 'Mã danh mục không được để trống'),
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  slug: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  websiteSeo: multiWebsiteSeoSchema,
  parentId: z.string().optional(),
  path: z.string().optional(),
  level: z.number().int().min(0).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  thumbnailImage: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateProductCategorySchema = createProductCategorySchema.partial();

export const productCategoryFilterSchema = z.object({
  search: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional(),
  level: z.number().optional(),
});

export type CreateProductCategoryInput = z.infer<typeof createProductCategorySchema>;
export type UpdateProductCategoryInput = z.infer<typeof updateProductCategorySchema>;
export type ProductCategoryFilter = z.infer<typeof productCategoryFilterSchema>;

// =============================================
// BRAND SCHEMAS
// =============================================

export const createBrandSchema = z.object({
  id: z.string().min(1, 'Mã thương hiệu không được để trống'),
  name: z.string().min(1, 'Tên thương hiệu không được để trống'),
  description: z.string().optional(),
  website: z.string().url('URL website không hợp lệ').optional().or(z.literal('')),
  logo: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  websiteSeo: multiWebsiteSeoSchema,
  isActive: z.boolean().optional().default(true),
});

export const updateBrandSchema = createBrandSchema.partial();

export const brandFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type BrandFilter = z.infer<typeof brandFilterSchema>;

// =============================================
// IMPORTER SCHEMAS
// =============================================

export const createImporterSchema = z.object({
  id: z.string().min(1, 'Mã nhà nhập khẩu không được để trống'),
  name: z.string().min(1, 'Tên nhà nhập khẩu không được để trống'),
  address: z.string().optional(),
  origin: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  taxCode: z.string().optional(),
  usageGuide: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const updateImporterSchema = createImporterSchema.partial();

export const importerFilterSchema = z.object({
  search: z.string().optional(),
  origin: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateImporterInput = z.infer<typeof createImporterSchema>;
export type UpdateImporterInput = z.infer<typeof updateImporterSchema>;
export type ImporterFilter = z.infer<typeof importerFilterSchema>;

// =============================================
// PRODUCT SLA SETTINGS SCHEMAS
// =============================================

export const productSlaSettingsSchema = z.object({
  defaultReorderLevel: z.number().int().min(0, 'Mức đặt hàng lại phải lớn hơn hoặc bằng 0').optional(),
  defaultSafetyStock: z.number().int().min(0, 'Tồn kho an toàn phải lớn hơn hoặc bằng 0').optional(),
  defaultMaxStock: z.number().int().min(0, 'Tồn kho tối đa phải lớn hơn hoặc bằng 0').optional(),
  deadStockDays: z.number().int().min(0, 'Số ngày tồn đọng phải lớn hơn hoặc bằng 0').optional(),
  slowMovingDays: z.number().int().min(0, 'Số ngày bán chậm phải lớn hơn hoặc bằng 0').optional(),
  enableEmailAlerts: z.boolean().optional(),
  alertEmailRecipients: z.array(z.string().email('Email không hợp lệ')).optional(),
  alertFrequency: z.enum(['daily', 'weekly', 'realtime']).optional(),
  showOnDashboard: z.boolean().optional(),
  dashboardAlertTypes: z.array(z.enum(['out_of_stock', 'low_stock', 'below_safety', 'over_stock', 'dead_stock'])).optional(),
});

export const updateProductSlaSettingsSchema = productSlaSettingsSchema.partial();

export type ProductSlaSettingsInput = z.infer<typeof productSlaSettingsSchema>;
export type UpdateProductSlaSettingsInput = z.infer<typeof updateProductSlaSettingsSchema>;

// =============================================
// LOGISTICS PRESET SCHEMAS
// =============================================

export const logisticsPresetSchema = z.object({
  weight: z.number().min(0, 'Trọng lượng phải lớn hơn hoặc bằng 0').optional(),
  weightUnit: z.enum(['g', 'kg']).optional(),
  length: z.number().min(0, 'Chiều dài phải lớn hơn hoặc bằng 0').optional(),
  width: z.number().min(0, 'Chiều rộng phải lớn hơn hoặc bằng 0').optional(),
  height: z.number().min(0, 'Chiều cao phải lớn hơn hoặc bằng 0').optional(),
});

export const productLogisticsSettingsSchema = z.object({
  physicalDefaults: logisticsPresetSchema,
  comboDefaults: logisticsPresetSchema,
});

export const updateProductLogisticsSettingsSchema = productLogisticsSettingsSchema.partial();

export type LogisticsPresetInput = z.infer<typeof logisticsPresetSchema>;
export type ProductLogisticsSettingsInput = z.infer<typeof productLogisticsSettingsSchema>;
export type UpdateProductLogisticsSettingsInput = z.infer<typeof updateProductLogisticsSettingsSchema>;
