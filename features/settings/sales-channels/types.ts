import type { BusinessId, SystemId } from '@/lib/id-types';

export type SalesChannel = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  isApplied: boolean;
  isDefault: boolean;
};
