import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { TargetGroup } from './types.ts';

export const data: TargetGroup[] = [
  { systemId: asSystemId('NHOM000001'), id: asBusinessId('KHACHHANG'), name: 'Khách hàng', isActive: true },
  { systemId: asSystemId('NHOM000002'), id: asBusinessId('NHACUNGCAP'), name: 'Nhà cung cấp', isActive: true },
  { systemId: asSystemId('NHOM000003'), id: asBusinessId('NHANVIEN'), name: 'Nhân viên', isActive: true },
  { systemId: asSystemId('NHOM000004'), id: asBusinessId('DOITACVC'), name: 'Đối tác vận chuyển', isActive: true },
  { systemId: asSystemId('NHOM000005'), id: asBusinessId('KHAC'), name: 'Khác', isActive: true },
];
