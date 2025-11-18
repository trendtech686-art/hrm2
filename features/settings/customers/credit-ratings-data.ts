import type { CreditRating } from './types';

export const defaultCreditRatings: CreditRating[] = [
  {
    systemId: 'CRATING00000001',
    id: 'AAA',
    name: 'AAA - Xuất sắc',
    description: 'Khách hàng có lịch sử thanh toán hoàn hảo, tín dụng cao',
    level: 1,
    maxCreditLimit: 1000000000, // 1 tỷ
    color: '#4CAF50',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CRATING00000002',
    id: 'AA',
    name: 'AA - Rất tốt',
    description: 'Khách hàng có lịch sử thanh toán rất tốt',
    level: 2,
    maxCreditLimit: 500000000, // 500 triệu
    color: '#8BC34A',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CRATING00000003',
    id: 'A',
    name: 'A - Tốt',
    description: 'Khách hàng có lịch sử thanh toán tốt',
    level: 3,
    maxCreditLimit: 200000000, // 200 triệu
    color: '#CDDC39',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CRATING00000004',
    id: 'B',
    name: 'B - Trung bình',
    description: 'Khách hàng có lịch sử thanh toán trung bình',
    level: 4,
    maxCreditLimit: 50000000, // 50 triệu
    color: '#FF9800',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CRATING00000005',
    id: 'C',
    name: 'C - Yếu',
    description: 'Khách hàng có lịch sử thanh toán chậm trễ',
    level: 5,
    maxCreditLimit: 10000000, // 10 triệu
    color: '#FF5722',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    systemId: 'CRATING00000006',
    id: 'D',
    name: 'D - Rủi ro cao',
    description: 'Khách hàng có lịch sử thanh toán kém, rủi ro cao',
    level: 6,
    maxCreditLimit: 0,
    color: '#F44336',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
