import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { JobTitle } from './types.ts';
import { buildSeedAuditFields } from '@/lib/seed-audit';

type JobTitleSeed = {
  systemIdValue: string;
  businessIdValue: string;
  name: string;
  description: string;
  createdAt: string;
};

const rawData: readonly JobTitleSeed[] = [
  {
    systemIdValue: 'CV000001',
    businessIdValue: 'CV000001',
    name: 'Nhân viên',
    description: 'Thực hiện các công việc chuyên môn được giao.',
    createdAt: '2024-02-10T08:00:00Z',
  },
  {
    systemIdValue: 'CV000002',
    businessIdValue: 'CV000002',
    name: 'Trưởng nhóm',
    description: 'Quản lý một nhóm nhỏ và chịu trách nhiệm về kết quả của nhóm.',
    createdAt: '2024-02-11T08:00:00Z',
  },
  {
    systemIdValue: 'CV000003',
    businessIdValue: 'CV000003',
    name: 'Trưởng phòng',
    description: 'Quản lý toàn bộ hoạt động của một phòng ban.',
    createdAt: '2024-02-12T08:00:00Z',
  },
  {
    systemIdValue: 'CV000004',
    businessIdValue: 'CV000004',
    name: 'Giám đốc',
    description: 'Chịu trách nhiệm quản lý cấp cao nhất của một khối hoặc toàn bộ công ty.',
    createdAt: '2024-02-13T08:00:00Z',
  },
  {
    systemIdValue: 'CV000005',
    businessIdValue: 'CV000005',
    name: 'Thực tập sinh',
    description: 'Nhân viên đang trong giai đoạn học việc và thử việc.',
    createdAt: '2024-02-14T08:00:00Z',
  },
  {
    systemIdValue: 'CV000006',
    businessIdValue: 'CV000006',
    name: 'Admin',
    description: 'Chịu trách nhiệm các công việc hành chính.',
    createdAt: '2024-02-15T08:00:00Z',
  },
];

export const data: JobTitle[] = rawData.map((item) => ({
  systemId: asSystemId(item.systemIdValue),
  id: asBusinessId(item.businessIdValue),
  name: item.name,
  description: item.description,
  ...buildSeedAuditFields({ createdAt: item.createdAt }),
}));
