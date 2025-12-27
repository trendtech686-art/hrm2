/**
 * Inventory Check Mock Data
 * Dữ liệu mẫu phiếu kiểm kê - normalized với branded types
 */

import { asSystemId, asBusinessId } from '../../lib/id-types';
import type { InventoryCheck } from '@/lib/types/prisma-extended';

export const data = [
  {
    systemId: asSystemId('INVCHECK000001'),
    id: asBusinessId('PKK000001'),
    branchSystemId: asSystemId('BRANCH000001'),
    branchName: 'Chi nhánh Hà Nội',
    status: 'balanced',
    createdBy: asSystemId('EMP000001'),
    createdAt: '2025-01-15T09:00:00Z',
    balancedAt: '2025-01-15T14:30:00Z',
    balancedBy: asSystemId('EMP000001'),
    note: 'Kiểm kê định kỳ đầu năm',
    items: [
      {
        productSystemId: asSystemId('PRODUCT000001'),
        productId: asBusinessId('SP000001'),
        productName: 'Website Cơ Bản',
        unit: 'Gói',
        systemQuantity: 10,
        actualQuantity: 10,
        difference: 0,
      },
      {
        productSystemId: asSystemId('PRODUCT000002'),
        productId: asBusinessId('SP000002'),
        productName: 'Website Nâng Cao',
        unit: 'Gói',
        systemQuantity: 5,
        actualQuantity: 4,
        difference: -1,
        reason: 'damaged',
        note: 'Gói dịch vụ bị hủy bởi khách hàng',
      },
    ],
  },
  {
    systemId: asSystemId('INVCHECK000002'),
    id: asBusinessId('PKK000002'),
    branchSystemId: asSystemId('BRANCH000002'),
    branchName: 'Chi nhánh TP.HCM',
    status: 'draft',
    createdBy: asSystemId('EMP000002'),
    createdAt: '2025-02-20T10:00:00Z',
    note: 'Kiểm kê phần cứng',
    items: [
      {
        productSystemId: asSystemId('PRODUCT000018'),
        productId: asBusinessId('SP000018'),
        productName: 'PC Văn Phòng Core i5',
        unit: 'Cái',
        systemQuantity: 20,
        actualQuantity: 19,
        difference: -1,
        reason: 'transfer',
        note: 'Chuyển sang chi nhánh khác',
      },
      {
        productSystemId: asSystemId('PRODUCT000020'),
        productId: asBusinessId('SP000020'),
        productName: 'Laptop Dell Latitude 5420',
        unit: 'Cái',
        systemQuantity: 15,
        actualQuantity: 15,
        difference: 0,
      },
    ],
  },
] satisfies InventoryCheck[];
