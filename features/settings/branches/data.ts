import type { Branch } from './types.ts';
import { asSystemId, asBusinessId } from '@/lib/id-types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const data: Branch[] = [
  {
    systemId: asSystemId('BRANCH000001'),
    id: asBusinessId('CN000001'),
    name: 'Trụ sở chính',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '02833334444',
    managerId: asSystemId('EMP000001'), // Nguyễn Văn An
    isDefault: true,
    ...buildSeedAuditFields({ createdAt: '2024-01-01T08:00:00Z' }),
  },
  {
    systemId: asSystemId('BRANCH000002'),
    id: asBusinessId('CN000002'),
    name: 'Chi nhánh Hà Nội',
    address: '456 Đường XYZ, Quận Hai Bà Trưng, Hà Nội',
    phone: '02488889999',
    managerId: asSystemId('EMP000002'), // Trần Thị Bình
    isDefault: false,
    ...buildSeedAuditFields({ createdAt: '2024-01-02T08:00:00Z' }),
  },
];
