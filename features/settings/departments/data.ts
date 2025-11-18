import type { Department } from './types.ts'

export const data: Department[] = [
  {
    systemId: "DEP000001",
    id: "DEP000001",
    name: "Kỹ thuật",
    managerId: "EMP000001",
    jobTitleIds: ['CV000004', 'CV000002', 'CV000001'],
  },
  {
    systemId: "DEP000002",
    id: "DEP000002",
    name: "Kinh doanh",
    managerId: undefined, // No manager initially
    jobTitleIds: ['CV000003', 'CV000002', 'CV000001'],
  },
    {
    systemId: "DEP000003",
    id: "DEP000003",
    name: "Nhân sự",
    managerId: "EMP000016",
    jobTitleIds: ['CV000002', 'CV000006'],
    },
    {
    systemId: "DEP000004",
    id: "DEP000004",
    name: "Marketing",
    managerId: "EMP000007",
    jobTitleIds: ['CV000004', 'CV000002', 'CV000001', 'CV000005'],
    },
    {
    systemId: "DEP000005",
    id: "DEP000005",
    name: "Kế toán",
    managerId: "EMP000041",
    jobTitleIds: ['CV000003', 'CV000001'],
  },
];
