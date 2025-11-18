import type { Branch } from './types.ts';

export const data: Branch[] = [
  {
    systemId: 'BRANCH000001',
    id: 'CN000001',
    name: 'Trụ sở chính',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '02833334444',
    managerId: 'EMP000001', // Nguyễn Văn An
    isDefault: true,
  },
  {
    systemId: 'BRANCH000002',
    id: 'CN000002',
    name: 'Chi nhánh Hà Nội',
    address: '456 Đường XYZ, Quận Hai Bà Trưng, Hà Nội',
    phone: '02488889999',
    managerId: 'EMP000002', // Trần Thị Bình
    isDefault: false,
  },
];
