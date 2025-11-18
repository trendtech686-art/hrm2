import { asSystemId, asBusinessId } from '@/lib/id-types';
import type { Department } from './types.ts'

export const data: Department[] = [
  {
    systemId: asSystemId("DEP000001"),
    id: asBusinessId("DEP000001"),
    name: "Kỹ thuật",
    managerId: asSystemId("EMP000001"),
    jobTitleIds: ['CV000004', 'CV000002', 'CV000001'],
  },
  {
    systemId: asSystemId("DEP000002"),
    id: asBusinessId("DEP000002"),
    name: "Kinh doanh",
    managerId: undefined, // No manager initially
    jobTitleIds: ['CV000003', 'CV000002', 'CV000001'],
  },
    {
    systemId: asSystemId("DEP000003"),
    id: asBusinessId("DEP000003"),
    name: "Nhân sự",
    managerId: asSystemId("EMP000016"),
    jobTitleIds: ['CV000002', 'CV000006'],
    },
    {
    systemId: asSystemId("DEP000004"),
    id: asBusinessId("DEP000004"),
    name: "Marketing",
    managerId: asSystemId("EMP000007"),
    jobTitleIds: ['CV000004', 'CV000002', 'CV000001', 'CV000005'],
    },
    {
    systemId: asSystemId("DEP000005"),
    id: asBusinessId("DEP000005"),
    name: "Kế toán",
    managerId: asSystemId("EMP000041"),
    jobTitleIds: ['CV000003', 'CV000001'],
  },
];
