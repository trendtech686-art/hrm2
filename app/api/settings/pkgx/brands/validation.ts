import { z } from 'zod';

const brandSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().optional(),
  description: z.string().optional(),
  siteUrl: z.string().optional(),
  sortOrder: z.number().optional(),
  isShow: z.number().optional(),
  keywords: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
});

export const syncBrandsSchema = z.object({
  brands: z.array(brandSchema),
});

export type SyncBrandsInput = z.infer<typeof syncBrandsSchema>;
