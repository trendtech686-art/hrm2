import type { BusinessId, SystemId } from '@/lib/id-types';

export type Unit = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  description?: string;
};
