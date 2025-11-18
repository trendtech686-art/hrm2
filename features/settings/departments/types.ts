import type { SystemId } from '@/lib/id-config';

export type Department = {
  systemId: SystemId;
  id: string
  name: string
  managerId?: string; // systemId of the employee who is the manager
  jobTitleIds: string[];
}
