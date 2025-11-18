export interface StorageLocation {
  systemId: string;
  id: string; // User-facing code
  name: string;
  description?: string;
  branchId?: string; // Link to Branch if location belongs to a specific branch
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
