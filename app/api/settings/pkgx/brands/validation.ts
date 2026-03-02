import { z } from 'zod';

const brandSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  siteUrl: z.string().optional().nullable(),
  sortOrder: z.number().optional().nullable(),
  isShow: z.number().optional().nullable(),
  keywords: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
});

export const syncBrandsSchema = z.object({
  brands: z.array(brandSchema),
});

export type SyncBrandsInput = z.infer<typeof syncBrandsSchema>;
