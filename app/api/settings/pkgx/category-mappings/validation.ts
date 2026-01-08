import { z } from 'zod';

export const createCategoryMappingSchema = z.object({
  hrmCategoryId: z.string().min(1, 'HRM Category ID is required'),
  hrmCategoryName: z.string().optional(),
  pkgxCategoryId: z.number({ message: 'PKGX Category ID is required' }),
  pkgxCategoryName: z.string().optional(),
});

export type CreateCategoryMappingInput = z.infer<typeof createCategoryMappingSchema>;
