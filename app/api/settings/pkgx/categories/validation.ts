import { z } from 'zod';

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  parentId: z.number().optional().nullable(),
  sortOrder: z.number().optional(),
  isShow: z.number().optional(),
  catDesc: z.string().optional(),
  longDesc: z.string().optional(),
  keywords: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  catAlias: z.string().optional(),
  style: z.string().optional(),
  grade: z.number().optional(),
  filterAttr: z.string().optional(),
});

export const syncCategoriesSchema = z.object({
  categories: z.array(categorySchema),
});

export type SyncCategoriesInput = z.infer<typeof syncCategoriesSchema>;
