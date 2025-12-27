import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { TargetGroup } from '@/lib/types/prisma-extended';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const data: TargetGroup[] = [
  { systemId: asSystemId('NHOM000001'), id: asBusinessId('KHACHHANG'), name: 'Khách hàng', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-05T08:00:00Z' }) },
  { systemId: asSystemId('NHOM000002'), id: asBusinessId('NHACUNGCAP'), name: 'Nhà cung cấp', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-06T08:00:00Z' }) },
  { systemId: asSystemId('NHOM000003'), id: asBusinessId('NHANVIEN'), name: 'Nhân viên', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-07T08:00:00Z' }) },
  { systemId: asSystemId('NHOM000004'), id: asBusinessId('DOITACVC'), name: 'Đối tác vận chuyển', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-08T08:00:00Z' }) },
  { systemId: asSystemId('NHOM000005'), id: asBusinessId('KHAC'), name: 'Khác', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-09T08:00:00Z' }) },
];
