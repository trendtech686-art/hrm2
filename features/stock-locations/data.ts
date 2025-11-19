import type { StockLocation } from './types.ts';
import { asSystemId, asBusinessId } from '../../lib/id-types.ts';

export const data = [
    { systemId: asSystemId('STOCK000001'), id: asBusinessId('MAIN-DEF'), name: 'Kho mặc định', branchSystemId: asSystemId('BRANCH000001')},
    { systemId: asSystemId('STOCK000002'), id: asBusinessId('MAIN-A1'), name: 'Kệ A1', branchSystemId: asSystemId('BRANCH000001')},
    { systemId: asSystemId('STOCK000003'), id: asBusinessId('HN-DEF'), name: 'Kho mặc định', branchSystemId: asSystemId('BRANCH000002')},
] satisfies StockLocation[];
