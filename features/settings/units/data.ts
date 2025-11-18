import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { Unit } from './types.ts';

export const data: Unit[] = [
  { systemId: asSystemId('U00000001'), id: asBusinessId('CAI'), name: 'Cái', description: 'Đơn vị cơ bản' },
  { systemId: asSystemId('U00000002'), id: asBusinessId('CHIEC'), name: 'Chiếc', description: 'Tương tự "Cái"' },
  { systemId: asSystemId('U00000003'), id: asBusinessId('HOP'), name: 'Hộp', description: 'Đơn vị đóng gói' },
  { systemId: asSystemId('U00000004'), id: asBusinessId('KG'), name: 'Kg', description: 'Kilogram' },
  { systemId: asSystemId('U00000005'), id: asBusinessId('GOI'), name: 'Gói', description: 'Đơn vị đóng gói' },
  { systemId: asSystemId('U00000006'), id: asBusinessId('LAN'), name: 'Lần', description: 'Dùng cho dịch vụ' },
  { systemId: asSystemId('U00000007'), id: asBusinessId('GIO'), name: 'Giờ', description: 'Dùng cho dịch vụ tư vấn' },
];
