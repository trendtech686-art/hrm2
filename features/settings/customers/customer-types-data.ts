import type { CustomerType } from './types';

export const defaultCustomerTypes: CustomerType[] = [
  {
    systemId: 'CTYPE00000001',
    id: 'CANHAN',
    name: 'Cá nhân',
    description: 'Khách hàng cá nhân, mua lẻ',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CTYPE00000002',
    id: 'DOANHNGHIEP',
    name: 'Doanh nghiệp',
    description: 'Khách hàng là công ty, doanh nghiệp',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
