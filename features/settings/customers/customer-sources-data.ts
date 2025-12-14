import { asSystemId, asBusinessId } from '../../../lib/id-types';
import type { CustomerSource } from './types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const defaultCustomerSources: CustomerSource[] = [
  {
    systemId: asSystemId('CSOURCE00000001'),
    id: asBusinessId('WEBSITE'),
    name: 'Website',
    description: 'Khách hàng đến từ website công ty',
    type: 'Online',
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-07T08:00:00Z' }),
  },
  {
    systemId: asSystemId('CSOURCE00000002'),
    id: asBusinessId('FACEBOOK'),
    name: 'Facebook',
    description: 'Khách hàng từ quảng cáo Facebook',
    type: 'Online',
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-08T08:00:00Z' }),
  },
  {
    systemId: asSystemId('CSOURCE00000003'),
    id: asBusinessId('ZALO'),
    name: 'Zalo',
    description: 'Khách hàng từ Zalo',
    type: 'Online',
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-09T08:00:00Z' }),
  },
  {
    systemId: asSystemId('CSOURCE00000004'),
    id: asBusinessId('GIOITHIEU'),
    name: 'Giới thiệu',
    description: 'Khách hàng được giới thiệu bởi khách cũ',
    type: 'Referral',
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-10T08:00:00Z' }),
  },
  {
    systemId: asSystemId('CSOURCE00000005'),
    id: asBusinessId('CUAHANG'),
    name: 'Cửa hàng',
    description: 'Khách hàng đến trực tiếp cửa hàng',
    type: 'Offline',
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-11T08:00:00Z' }),
  },
  {
    systemId: asSystemId('CSOURCE00000006'),
    id: asBusinessId('DOITAC'),
    name: 'Đối tác',
    description: 'Khách hàng từ đối tác liên kết',
    type: 'Other',
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-12T08:00:00Z' }),
  },
];
