import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { SalesChannel } from './types.ts';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const data: SalesChannel[] = [
  { systemId: asSystemId('SC000001'), id: asBusinessId('KENH000001'), name: 'TiktokShop', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-01-25T08:00:00Z' }) },
  { systemId: asSystemId('SC000002'), id: asBusinessId('KENH000002'), name: 'GrabMart', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-01-26T08:00:00Z' }) },
  { systemId: asSystemId('SC000003'), id: asBusinessId('KENH000003'), name: 'WebOrder', isApplied: true, isDefault: true, ...buildSeedAuditFields({ createdAt: '2024-01-27T08:00:00Z' }) },
  { systemId: asSystemId('SC000004'), id: asBusinessId('KENH000004'), name: 'Instagram', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-01-28T08:00:00Z' }) },
  { systemId: asSystemId('SC000005'), id: asBusinessId('KENH000005'), name: 'Sendo', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-01-29T08:00:00Z' }) },
  { systemId: asSystemId('SC000006'), id: asBusinessId('KENH000006'), name: 'Khác', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-01-30T08:00:00Z' }) },
  { systemId: asSystemId('SC000007'), id: asBusinessId('KENH000007'), name: 'Shopee', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-01-31T08:00:00Z' }) },
  { systemId: asSystemId('SC000008'), id: asBusinessId('KENH000008'), name: 'Pos', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-02-01T08:00:00Z' }) },
  { systemId: asSystemId('SC000009'), id: asBusinessId('KENH000009'), name: 'Tiki', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-02-02T08:00:00Z' }) },
  { systemId: asSystemId('SC000010'), id: asBusinessId('KENH000010'), name: 'Lazada', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-02-03T08:00:00Z' }) },
  { systemId: asSystemId('SC000011'), id: asBusinessId('KENH000011'), name: 'Zalo', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-02-04T08:00:00Z' }) },
  { systemId: asSystemId('SC000012'), id: asBusinessId('KENH000012'), name: 'Facebook', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-02-05T08:00:00Z' }) },
  { systemId: asSystemId('SC000013'), id: asBusinessId('KENH000013'), name: 'Web', isApplied: true, isDefault: false, ...buildSeedAuditFields({ createdAt: '2024-02-06T08:00:00Z' }) },
];
