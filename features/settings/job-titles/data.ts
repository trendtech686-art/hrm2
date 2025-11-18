import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { JobTitle } from './types.ts';

const rawData = [
  { asSystemId: 'CV000001', id: asSystemId('CV000001'), name: 'Nhân viên', description: 'Thực hiện các công việc chuyên môn được giao.' },
  { asSystemId: 'CV000002', id: asSystemId('CV000002'), name: 'Trưởng nhóm', description: 'Quản lý một nhóm nhỏ và chịu trách nhiệm về kết quả của nhóm.' },
  { asSystemId: 'CV000003', id: asSystemId('CV000003'), name: 'Trưởng phòng', description: 'Quản lý toàn bộ hoạt động của một phòng ban.' },
  { asSystemId: 'CV000004', id: asSystemId('CV000004'), name: 'Giám đốc', description: 'Chịu trách nhiệm quản lý cấp cao nhất của một khối hoặc toàn bộ công ty.' },
  { asSystemId: 'CV000005', id: asSystemId('CV000005'), name: 'Thực tập sinh', description: 'Nhân viên đang trong giai đoạn học việc và thử việc.' },
  { asSystemId: 'CV000006', id: asSystemId('CV000006'), name: 'Admin', description: 'Chịu trách nhiệm các công việc hành chính.' },
] as const;

export const data: JobTitle[] = rawData.map((item) => ({
  ...item,
  systemId: asSystemId(item.asSystemId),
  id: asBusinessId(item.id),
}));
