import type { LifecycleStage } from './types';
import { asSystemId, asBusinessId } from '../../../lib/id-types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const defaultLifecycleStages: LifecycleStage[] = [
  {
    systemId: asSystemId('LSTAGE00000001'),
    id: asBusinessId('LEAD'),
    name: 'Tiềm năng (Lead)',
    description: 'Khách hàng mới tiếp cận, chưa có nhu cầu rõ ràng',
    color: '#9E9E9E',
    orderIndex: 1,
    probability: 10,
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-01T08:00:00Z' }),
  },
  {
    systemId: asSystemId('LSTAGE00000002'),
    id: asBusinessId('OPPORTUNITY'),
    name: 'Cơ hội (Opportunity)',
    description: 'Khách hàng đã thể hiện sự quan tâm, có nhu cầu',
    color: '#2196F3',
    orderIndex: 2,
    probability: 30,
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-02T08:00:00Z' }),
  },
  {
    systemId: asSystemId('LSTAGE00000003'),
    id: asBusinessId('CUSTOMER'),
    name: 'Khách hàng (Customer)',
    description: 'Đã mua hàng',
    color: '#4CAF50',
    orderIndex: 3,
    probability: 100,
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-03T08:00:00Z' }),
  },
  {
    systemId: asSystemId('LSTAGE00000004'),
    id: asBusinessId('CHURNED'),
    name: 'Rời bỏ (Churned)',
    description: 'Khách hàng đã ngừng mua hàng',
    color: '#F44336',
    orderIndex: 4,
    probability: 0,
    isActive: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-04T08:00:00Z' }),
  },
];
