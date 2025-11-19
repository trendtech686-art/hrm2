import { SystemId, BusinessId } from '../../../lib/id-types.ts';

export type Department = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  managerId?: SystemId; // systemId of the employee who is the manager
  jobTitleIds: string[];
}
