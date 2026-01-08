import { z } from 'zod';

export const createBrandMappingSchema = z.object({
  hrmBrandId: z.string().min(1, 'HRM Brand ID is required'),
  hrmBrandName: z.string().optional(),
  pkgxBrandId: z.number({ message: 'PKGX Brand ID is required' }),
  pkgxBrandName: z.string().optional(),
});

export type CreateBrandMappingInput = z.infer<typeof createBrandMappingSchema>;
