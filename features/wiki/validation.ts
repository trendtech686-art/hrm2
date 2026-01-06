/**
 * Zod validation schemas for wiki module
 */
import { z } from 'zod';
import type { SystemId } from '@/lib/id-types';

// Wiki page status enum
export const wikiStatusSchema = z.enum([
  'draft',
  'published',
  'archived'
]);

// Wiki page type enum
export const wikiTypeSchema = z.enum([
  'page',
  'guide',
  'faq',
  'policy',
  'procedure',
  'reference',
  'template'
]);

// Wiki visibility enum
export const wikiVisibilitySchema = z.enum([
  'public',
  'internal',
  'private',
  'restricted'
]);

// Create wiki page schema
export const createWikiSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  slug: z.string().optional(),
  type: wikiTypeSchema.default('page'),
  content: z.string().min(1, 'Nội dung không được để trống'),
  summary: z.string().optional(),
  
  // Hierarchy
  parentSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  categorySystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  categoryName: z.string().optional(),
  order: z.number().int().min(0).default(0),
  
  // Access control
  visibility: wikiVisibilitySchema.default('internal'),
  allowedRoles: z.array(z.string()).optional(),
  allowedUserSystemIds: z.array(z.string() as z.ZodType<SystemId>).optional(),
  
  // Metadata
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  
  // Settings
  allowComments: z.boolean().default(true),
  isPinned: z.boolean().default(false),
  showInNavigation: z.boolean().default(true),
  
  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Update wiki page schema
export const updateWikiSchema = createWikiSchema.partial().extend({
  status: wikiStatusSchema.optional(),
});

// Publish schema
export const publishWikiSchema = z.object({
  publishedAt: z.date().optional(),
  publishNote: z.string().optional(),
});

// Wiki category schema
export const createWikiCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  slug: z.string().optional(),
  description: z.string().optional(),
  parentSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  order: z.number().int().min(0).default(0),
  icon: z.string().optional(),
  color: z.string().optional(),
});

// Wiki revision schema (for tracking changes)
export const createWikiRevisionSchema = z.object({
  pageSystemId: z.string() as z.ZodType<SystemId>,
  content: z.string(),
  changeNote: z.string().optional(),
  isMajorRevision: z.boolean().default(false),
});

// Filter schema
export const wikiFiltersSchema = z.object({
  status: wikiStatusSchema.optional(),
  type: wikiTypeSchema.optional(),
  visibility: wikiVisibilitySchema.optional(),
  categorySystemId: z.string().optional(),
  parentSystemId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  authorSystemId: z.string().optional(),
  isPinned: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

// Types
export type WikiStatus = z.infer<typeof wikiStatusSchema>;
export type WikiType = z.infer<typeof wikiTypeSchema>;
export type WikiVisibility = z.infer<typeof wikiVisibilitySchema>;
export type CreateWikiInput = z.infer<typeof createWikiSchema>;
export type UpdateWikiInput = z.infer<typeof updateWikiSchema>;
export type PublishWikiInput = z.infer<typeof publishWikiSchema>;
export type CreateWikiCategoryInput = z.infer<typeof createWikiCategorySchema>;
export type CreateWikiRevisionInput = z.infer<typeof createWikiRevisionSchema>;
export type WikiFilters = z.infer<typeof wikiFiltersSchema>;
