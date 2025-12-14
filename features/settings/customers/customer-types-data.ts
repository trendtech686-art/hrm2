import { asSystemId, asBusinessId } from '../../../lib/id-types.ts';
import type { CustomerType } from './types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const defaultCustomerTypes: CustomerType[] = [
  {
    systemId: asSystemId('CTYPE00000001'),
    id: asBusinessId('CANHAN'),
    name: 'Cá nhân',
    description: 'Khách hàng cá nhân, mua lẻ',
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-05T08:00:00Z' }),
  },
  {
    systemId: asSystemId('CTYPE00000002'),
    id: asBusinessId('DOANHNGHIEP'),
    name: 'Doanh nghiệp',
    description: 'Khách hàng là công ty, doanh nghiệp',
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-06T08:00:00Z' }),
  },
];
