import type { CustomerGroup } from './types';
import { asSystemId, asBusinessId } from '../../../lib/id-types';

export const defaultCustomerGroups: CustomerGroup[] = [
  {
    systemId: asSystemId('CGROUP00000001'),
    id: asBusinessId('VIP'),
    name: 'VIP',
    description: 'Khách hàng VIP, mua nhiều, giá trị cao',
    color: '#FFD700',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: asSystemId('CGROUP00000002'),
    id: asBusinessId('THUONGXUYEN'),
    name: 'Thường xuyên',
    description: 'Khách hàng mua thường xuyên',
    color: '#4CAF50',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: asSystemId('CGROUP00000003'),
    id: asBusinessId('MOI'),
    name: 'Mới',
    description: 'Khách hàng mới, lần đầu mua',
    color: '#2196F3',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: asSystemId('CGROUP00000004'),
    id: asBusinessId('TIEMNANG'),
    name: 'Tiềm năng',
    description: 'Khách hàng tiềm năng, đang tìm hiểu',
    color: '#FF9800',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
