import type { CustomerGroup } from './types';
import { asSystemId, asBusinessId } from '../../../lib/id-types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const defaultCustomerGroups: CustomerGroup[] = [
  {
    systemId: asSystemId('CGROUP00000001'),
    id: asBusinessId('VIP'),
    name: 'VIP',
    description: 'Khách hàng VIP, mua nhiều, giá trị cao',
    color: '#FFD700',
    defaultCreditLimit: 50000000,
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-01T08:00:00Z' }),
  },
  {
    systemId: asSystemId('CGROUP00000002'),
    id: asBusinessId('THUONGXUYEN'),
    name: 'Thường xuyên',
    description: 'Khách hàng mua thường xuyên',
    color: '#4CAF50',
    defaultCreditLimit: 20000000,
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-02T08:00:00Z' }),
  },
  {
    systemId: asSystemId('CGROUP00000003'),
    id: asBusinessId('MOI'),
    name: 'Mới',
    description: 'Khách hàng mới, lần đầu mua',
    color: '#2196F3',
    defaultCreditLimit: 5000000,
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-03T08:00:00Z' }),
  },
  {
    systemId: asSystemId('CGROUP00000004'),
    id: asBusinessId('TIEMNANG'),
    name: 'Tiềm năng',
    description: 'Khách hàng tiềm năng, đang tìm hiểu',
    color: '#FF9800',
    defaultCreditLimit: 0,
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-04T08:00:00Z' }),
  },
];
