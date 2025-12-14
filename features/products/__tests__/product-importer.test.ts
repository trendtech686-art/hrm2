import { describe, it, expect } from 'vitest';
import { transformImportedRows, normalizeFieldKey, type BranchInventoryIdentifier } from '../product-importer';
import { asSystemId } from '../../../lib/id-types';

const HANOI_BRANCH = asSystemId('BR-1');
const HCM_BRANCH = asSystemId('BR-2');
const CURRENT_EMPLOYEE = asSystemId('EMP-1');

const branchIdentifiers: BranchInventoryIdentifier[] = [
  {
    systemId: HANOI_BRANCH,
    identifiers: new Set(['br1', normalizeFieldKey('Hà Nội'), normalizeFieldKey('CN Hà Nội')]),
  },
  {
    systemId: HCM_BRANCH,
    identifiers: new Set(['br2', normalizeFieldKey('Hồ Chí Minh'), normalizeFieldKey('CN HCM')]),
  },
];

describe('transformImportedRows', () => {
  const baseOptions = {
    branchIdentifiers,
    defaultBranchSystemId: HANOI_BRANCH,
    currentEmployeeSystemId: CURRENT_EMPLOYEE,
  };

  it('maps inventory quantities to matching branches', () => {
    const [product] = transformImportedRows([
      {
        name: 'Áo thun basic',
        'CN Hà Nội tồn': '12',
        'CN HCM tồn': '3',
      },
    ], baseOptions);

    expect(product.inventoryByBranch[HANOI_BRANCH]).toBe(12);
    expect(product.inventoryByBranch[HCM_BRANCH]).toBe(3);
  });

  it('falls back to default branch when generic inventory column provided', () => {
    const [product] = transformImportedRows([
      {
        name: 'Váy midi',
        inventory: '15',
      },
    ], {
      ...baseOptions,
      branchIdentifiers: [],
    });

    expect(product.inventoryByBranch[HANOI_BRANCH]).toBe(15);
  });

  it('throws descriptive error when product name missing', () => {
    expect(() => transformImportedRows([
      { name: '' },
    ], baseOptions)).toThrow(/thiếu tên sản phẩm/);
  });
});
