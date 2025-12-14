import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { PaymentMethod } from './types.ts';

const SEED_AUTHOR = asSystemId('EMP000001');
const buildAuditFields = (createdAt: string, createdBy = SEED_AUTHOR) => ({
  createdAt,
  updatedAt: createdAt,
  createdBy,
  updatedBy: createdBy,
});

export const data: PaymentMethod[] = [
  {
    systemId: asSystemId('PM000001'),
    id: asBusinessId('TIEN_MAT'),
    name: 'Tiền mặt',
    isDefault: true,
    isActive: true,
    color: '#10b981',
    icon: 'Wallet',
    ...buildAuditFields('2024-01-05T08:00:00Z'),
  },
  {
    systemId: asSystemId('PM000002'),
    id: asBusinessId('CHUYEN_KHOAN'),
    name: 'Chuyển khoản',
    isDefault: false,
    isActive: true,
    color: '#3b82f6',
    icon: 'ArrowRightLeft',
    ...buildAuditFields('2024-01-06T08:00:00Z'),
  },
  {
    systemId: asSystemId('PM000003'),
    id: asBusinessId('QUET_THE'),
    name: 'Quẹt thẻ',
    isDefault: false,
    isActive: true,
    color: '#8b5cf6',
    icon: 'CreditCard',
    ...buildAuditFields('2024-01-07T08:00:00Z'),
  },
  {
    systemId: asSystemId('PM000004'),
    id: asBusinessId('COD'),
    name: 'COD',
    isDefault: false,
    isActive: true,
    color: '#f59e0b',
    icon: 'Package',
    ...buildAuditFields('2024-01-08T08:00:00Z'),
  },
];
