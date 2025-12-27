import { asBusinessId, asSystemId } from '../../lib/id-types';
import type { CashAccount } from '@/lib/types/prisma-extended';

const SEED_AUTHOR = asSystemId('EMP000001');
const buildAuditFields = (createdAt: string, createdBy = SEED_AUTHOR) => ({
  createdAt,
  updatedAt: createdAt,
  createdBy,
  updatedBy: createdBy,
});

export const data: CashAccount[] = [
  {
    systemId: asSystemId('ACCOUNT000001'),
    id: asBusinessId('TK000001'),
    name: 'Quỹ tiền mặt',
    initialBalance: 1727238671,
    type: 'cash',
    branchSystemId: asSystemId('BRANCH000001'),
    isActive: true,
    isDefault: true,
    minBalance: 1000000,
    maxBalance: 5000000000,
    ...buildAuditFields('2024-01-01T08:00:00Z'),
  },
  {
    systemId: asSystemId('ACCOUNT000002'),
    id: asBusinessId('TK000002'),
    name: 'Tài khoản Vietcombank',
    initialBalance: 500000000,
    type: 'bank',
    bankAccountNumber: '0123456789',
    bankBranch: 'PGD Bến Thành',
    branchSystemId: asSystemId('BRANCH000001'),
    isActive: true,
    isDefault: true,
    bankName: 'Vietcombank',
    bankCode: 'VCB',
    accountHolder: 'CÔNG TY TNHH ABC',
    minBalance: 5000000,
    ...buildAuditFields('2024-01-02T08:00:00Z'),
  },
  {
    systemId: asSystemId('ACCOUNT000003'),
    id: asBusinessId('TK000003'),
    name: 'Tài khoản ACB',
    initialBalance: 250000000,
    type: 'bank',
    bankAccountNumber: '9876543210',
    bankBranch: 'Chi nhánh Sài Gòn',
    branchSystemId: asSystemId('BRANCH000002'),
    isActive: true,
    isDefault: false,
    bankName: 'ACB',
    bankCode: 'ACB',
    accountHolder: 'CÔNG TY TNHH ABC',
    ...buildAuditFields('2024-01-03T08:00:00Z'),
  },
];
