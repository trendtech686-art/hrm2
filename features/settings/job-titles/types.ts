import type { BusinessId, SystemId } from '@/lib/id-types';

export type JobTitle = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string;
};
