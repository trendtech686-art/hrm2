import type { BusinessId, SystemId } from '@/lib/id-types';

export type TargetGroup = {
  systemId: SystemId;
  id: BusinessId;
  name: string;
  isActive?: boolean;
};
