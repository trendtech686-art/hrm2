import type { SystemId, BusinessId } from '@/lib/id-types';

export interface StorageLocation {
  systemId: SystemId;
  id: BusinessId; // User-facing code
  name: string;
  description?: string;
  branchId?: SystemId; // Link to Branch if location belongs to a specific branch
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
