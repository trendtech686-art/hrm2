import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { Unit } from './types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const data: Unit[] = [
  { systemId: asSystemId('U00000001'), id: asBusinessId('CAI'), name: 'Cái', description: 'Đơn vị cơ bản', isDefault: true, isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-03T08:00:00Z' }) },
  { systemId: asSystemId('U00000002'), id: asBusinessId('CHIEC'), name: 'Chiếc', description: 'Tương tự "Cái"', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-04T08:00:00Z' }) },
  { systemId: asSystemId('U00000003'), id: asBusinessId('HOP'), name: 'Hộp', description: 'Đơn vị đóng gói', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-05T08:00:00Z' }) },
  { systemId: asSystemId('U00000004'), id: asBusinessId('KG'), name: 'Kg', description: 'Kilogram', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-06T08:00:00Z' }) },
  { systemId: asSystemId('U00000005'), id: asBusinessId('GOI'), name: 'Gói', description: 'Đơn vị đóng gói', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-07T08:00:00Z' }) },
  { systemId: asSystemId('U00000006'), id: asBusinessId('LAN'), name: 'Lần', description: 'Dùng cho dịch vụ', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-08T08:00:00Z' }) },
  { systemId: asSystemId('U00000007'), id: asBusinessId('GIO'), name: 'Giờ', description: 'Dùng cho dịch vụ tư vấn', isActive: true, ...buildSeedAuditFields({ createdAt: '2024-01-09T08:00:00Z' }) },
];
