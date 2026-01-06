import { z } from 'zod';

// Website Schema
export const createWebsiteSchema = z.object({
  domain: z.string().min(1, 'Domain không được để trống'),
  name: z.string().min(1, 'Tên website không được để trống'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  isPrimary: z.boolean().default(false),
  
  // SEO Settings
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  ogImage: z.string().optional(),
  favicon: z.string().optional(),
  
  // Analytics
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  
  // Theme
  themeId: z.string().optional(),
  customCss: z.string().optional(),
});

export const updateWebsiteSchema = createWebsiteSchema.partial();

// Filter Schema
export const websiteFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Types
export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;
export type UpdateWebsiteInput = z.infer<typeof updateWebsiteSchema>;
export type WebsiteFilter = z.infer<typeof websiteFilterSchema>;
