import { SystemId, BusinessId } from '../../../lib/id-types';

export type Department = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  managerId?: SystemId | undefined; // systemId of the employee who is the manager
  jobTitleIds: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
}
