import { asSystemId, asBusinessId } from '../../../lib/id-types.ts';
import type { CustomerType } from './types';

export const defaultCustomerTypes: CustomerType[] = [
  {
    systemId: asSystemId('CTYPE00000001'),
    id: asBusinessId('CANHAN'),
    name: 'Cá nhân',
    description: 'Khách hàng cá nhân, mua lẻ',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: asSystemId('CTYPE00000002'),
    id: asBusinessId('DOANHNGHIEP'),
    name: 'Doanh nghiệp',
    description: 'Khách hàng là công ty, doanh nghiệp',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
