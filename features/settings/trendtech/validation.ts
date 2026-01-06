import { z } from 'zod';

// Trendtech Config Schema
export const trendtechConfigSchema = z.object({
  apiKey: z.string().min(1, 'API Key không được để trống'),
  apiSecret: z.string().min(1, 'API Secret không được để trống'),
  baseUrl: z.string().url('URL không hợp lệ'),
  isEnabled: z.boolean().default(false),
  autoSync: z.boolean().default(false),
  syncIntervalMinutes: z.number().min(5).max(1440).default(60),
});

// Product Mapping Schema
export const trendtechProductMappingSchema = z.object({
  localProductSystemId: z.string().min(1),
  trendtechProductId: z.string().min(1),
  trendtechSku: z.string().optional(),
  syncInventory: z.boolean().default(true),
  syncPrice: z.boolean().default(false),
  priceMarkupPercent: z.number().min(-100).max(1000).default(0),
  isActive: z.boolean().default(true),
});

// Sync Settings
export const trendtechSyncSettingsSchema = z.object({
  syncInventoryEnabled: z.boolean().default(true),
  syncPriceEnabled: z.boolean().default(false),
  syncOrdersEnabled: z.boolean().default(true),
  inventoryBuffer: z.number().min(0).default(0),
  priceMarkupDefault: z.number().min(-100).max(1000).default(0),
  autoPublishProducts: z.boolean().default(false),
});

// Filter Schema
export const trendtechMappingFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  syncInventory: z.boolean().optional(),
  syncPrice: z.boolean().optional(),
});

// Types
export type TrendtechConfig = z.infer<typeof trendtechConfigSchema>;
export type TrendtechProductMapping = z.infer<typeof trendtechProductMappingSchema>;
export type TrendtechSyncSettings = z.infer<typeof trendtechSyncSettingsSchema>;
export type TrendtechMappingFilter = z.infer<typeof trendtechMappingFilterSchema>;
