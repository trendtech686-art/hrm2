import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { Tax } from './types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const data: Tax[] = [
  {
    systemId: asSystemId('TAX000001'),
    id: asBusinessId('VAT10'),
    name: 'VAT 10%',
    rate: 10,
    isDefaultSale: true,
    isDefaultPurchase: true,
    description: 'Thuế GTGT 10%',
    ...buildSeedAuditFields({ createdAt: '2024-01-01T08:00:00Z' }),
  },
  {
    systemId: asSystemId('TAX000002'),
    id: asBusinessId('VAT8'),
    name: 'VAT 8%',
    rate: 8,
    isDefaultSale: false,
    isDefaultPurchase: false,
    description: 'Thuế GTGT 8%',
    ...buildSeedAuditFields({ createdAt: '2024-01-02T08:00:00Z' }),
  },
  {
    systemId: asSystemId('TAX000003'),
    id: asBusinessId('VAT5'),
    name: 'VAT 5%',
    rate: 5,
    isDefaultSale: false,
    isDefaultPurchase: false,
    description: 'Thuế GTGT 5%',
    ...buildSeedAuditFields({ createdAt: '2024-01-03T08:00:00Z' }),
  },
  {
    systemId: asSystemId('TAX000004'),
    id: asBusinessId('VAT0'),
    name: 'VAT 0%',
    rate: 0,
    isDefaultSale: false,
    isDefaultPurchase: false,
    description: 'Không áp dụng thuế',
    ...buildSeedAuditFields({ createdAt: '2024-01-04T08:00:00Z' }),
  },
];
