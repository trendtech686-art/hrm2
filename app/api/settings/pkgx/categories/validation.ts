import { z } from 'zod';

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  parentId: z.number().optional().nullable(),
  sortOrder: z.number().optional().nullable(),
  isShow: z.number().optional().nullable(),
  catDesc: z.string().optional().nullable(),
  longDesc: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
  catAlias: z.string().optional().nullable(),
  style: z.string().optional().nullable(),
  grade: z.number().optional().nullable(),
  filterAttr: z.string().optional().nullable(),
});

export const syncCategoriesSchema = z.object({
  categories: z.array(categorySchema),
});

export type SyncCategoriesInput = z.infer<typeof syncCategoriesSchema>;
