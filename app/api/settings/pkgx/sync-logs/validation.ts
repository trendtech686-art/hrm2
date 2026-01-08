import { z } from 'zod';

export const createSyncLogSchema = z.object({
  syncType: z.string().min(1, 'Sync type is required'),
  action: z.string().min(1, 'Action is required'),
  status: z.string().min(1, 'Status is required'),
  itemsTotal: z.number().optional().default(0),
  itemsSuccess: z.number().optional().default(0),
  itemsFailed: z.number().optional().default(0),
  errorMessage: z.string().optional().nullable(),
  details: z.any().optional(),
});

export type CreateSyncLogInput = z.infer<typeof createSyncLogSchema>;
