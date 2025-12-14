import type { StockLocation } from './types.ts';
import { asSystemId, asBusinessId } from '../../lib/id-types.ts';

const SEED_AUTHOR = asSystemId('EMP000001');
const buildAuditFields = (createdAt: string, createdBy = SEED_AUTHOR) => ({
    createdAt,
    updatedAt: createdAt,
    createdBy,
    updatedBy: createdBy,
});

export const data = [
    { systemId: asSystemId('STOCK000001'), id: asBusinessId('MAIN-DEF'), name: 'Kho mặc định', branchSystemId: asSystemId('BRANCH000001'), ...buildAuditFields('2024-01-10T08:00:00Z')},
    { systemId: asSystemId('STOCK000002'), id: asBusinessId('MAIN-A1'), name: 'Kệ A1', branchSystemId: asSystemId('BRANCH000001'), ...buildAuditFields('2024-01-11T08:00:00Z')},
    { systemId: asSystemId('STOCK000003'), id: asBusinessId('HN-DEF'), name: 'Kho mặc định', branchSystemId: asSystemId('BRANCH000002'), ...buildAuditFields('2024-01-12T08:00:00Z')},
] satisfies StockLocation[];
