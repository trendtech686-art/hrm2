// Re-export tax types from central prisma-extended
export type { Tax } from '@/lib/types/prisma-extended';

// Local derived type - not in prisma-extended
import type { Tax } from '@/lib/types/prisma-extended';
export type TaxFormValues = Omit<Tax, 'systemId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;
