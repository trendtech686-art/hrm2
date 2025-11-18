import type { CustomerGroup } from './types';

export const defaultCustomerGroups: CustomerGroup[] = [
  {
    systemId: 'CGROUP00000001',
    id: 'VIP',
    name: 'VIP',
    description: 'Khách hàng VIP, mua nhiều, giá trị cao',
    color: '#FFD700',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CGROUP00000002',
    id: 'THUONGXUYEN',
    name: 'Thường xuyên',
    description: 'Khách hàng mua thường xuyên',
    color: '#4CAF50',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CGROUP00000003',
    id: 'MOI',
    name: 'Mới',
    description: 'Khách hàng mới, lần đầu mua',
    color: '#2196F3',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CGROUP00000004',
    id: 'TIEMNANG',
    name: 'Tiềm năng',
    description: 'Khách hàng tiềm năng, đang tìm hiểu',
    color: '#FF9800',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
