import { asSystemId, asBusinessId } from '@/lib/id-types';
import type { Department } from './types.ts';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const data: Department[] = [
  {
    systemId: asSystemId("DEP000001"),
    id: asBusinessId("DEP000001"),
    name: "Kỹ thuật",
    managerId: asSystemId("EMP000001"),
    jobTitleIds: ['CV000004', 'CV000002', 'CV000001'],
    ...buildSeedAuditFields({ createdAt: '2024-02-01T08:00:00Z' }),
  },
  {
    systemId: asSystemId("DEP000002"),
    id: asBusinessId("DEP000002"),
    name: "Kinh doanh",
    jobTitleIds: ['CV000003', 'CV000002', 'CV000001'],
    ...buildSeedAuditFields({ createdAt: '2024-02-02T08:00:00Z' }),
  },
  {
    systemId: asSystemId("DEP000003"),
    id: asBusinessId("DEP000003"),
    name: "Nhân sự",
    managerId: asSystemId("EMP000016"),
    jobTitleIds: ['CV000002', 'CV000006'],
    ...buildSeedAuditFields({ createdAt: '2024-02-03T08:00:00Z' }),
  },
  {
    systemId: asSystemId("DEP000004"),
    id: asBusinessId("DEP000004"),
    name: "Marketing",
    managerId: asSystemId("EMP000007"),
    jobTitleIds: ['CV000004', 'CV000002', 'CV000001', 'CV000005'],
    ...buildSeedAuditFields({ createdAt: '2024-02-04T08:00:00Z' }),
  },
  {
    systemId: asSystemId("DEP000005"),
    id: asBusinessId("DEP000005"),
    name: "Kế toán",
    managerId: asSystemId("EMP000041"),
    jobTitleIds: ['CV000003', 'CV000001'],
    ...buildSeedAuditFields({ createdAt: '2024-02-05T08:00:00Z' }),
  },
];
