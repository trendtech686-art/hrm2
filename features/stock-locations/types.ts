import type { SystemId, BusinessId } from '../../lib/id-types.ts';

export type StockLocation = {
    systemId: SystemId;
    id: BusinessId; // user-facing id
    name: string; // e.g., "Kệ A, Tầng 1"
    branchSystemId: SystemId; // ✅ Branch systemId
};
