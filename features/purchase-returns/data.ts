import type { PurchaseReturn } from '@/lib/types/prisma-extended';
import { asBusinessId, asSystemId } from '@/lib/id-types';

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const SEED_AUTHOR = asSystemId('EMP000001');
const buildAuditFields = (createdAt: string, createdBy = SEED_AUTHOR) => ({
  createdAt,
  updatedAt: createdAt,
  createdBy,
  updatedBy: createdBy,
});

export const data: PurchaseReturn[] = [
  {
    systemId: asSystemId('PRETURN000001'),
    id: asBusinessId('TH000001'),
    purchaseOrderSystemId: asSystemId('PO00000001'),
    purchaseOrderId: asBusinessId('PO0001'),
    supplierSystemId: asSystemId('SUPP000001'),
    supplierName: 'Công ty CP Phần mềm ABC',
    branchSystemId: asSystemId('BRANCH000002'),
    branchName: 'Chi nhánh Hà Nội',
    returnDate: addDays(-2),
    creatorName: 'Nguyễn Văn An',
    reason: 'Sản phẩm không đúng yêu cầu',
    items: [
      {
        productSystemId: asSystemId('PROD000001'),
        productId: asBusinessId('SP000001'),
        productName: 'Laptop Dell Inspiron 15',
        orderedQuantity: 2,
        returnQuantity: 1,
        unitPrice: 5000000,
        note: 'Sản phẩm giao nhầm cấu hình'
      }
    ],
    totalReturnValue: 5000000,
    refundAmount: 5000000,
    refundMethod: 'Chuyển khoản',
    accountSystemId: asSystemId('ACCOUNT000002'),
    ...buildAuditFields('2025-11-21T08:00:00Z')
  },
  {
    systemId: asSystemId('PRETURN000002'),
    id: asBusinessId('TH000002'),
    purchaseOrderSystemId: asSystemId('PO00000003'),
    purchaseOrderId: asBusinessId('PO0003'),
    supplierSystemId: asSystemId('SUPP000002'),
    supplierName: 'Công ty CP Thiết bị Công Nghệ',
    branchSystemId: asSystemId('BRANCH000001'),
    branchName: 'Chi nhánh TP.HCM',
    returnDate: addDays(-1),
    creatorName: 'Trần Thị Bình',
    reason: 'Chất lượng không đạt',
    items: [
      {
        productSystemId: asSystemId('PROD000004'),
        productId: asBusinessId('SP000004'),
        productName: 'Ốp lưng iPhone 15 Pro',
        orderedQuantity: 5,
        returnQuantity: 1,
        unitPrice: 200000,
        note: 'Bề mặt trầy xước'
      }
    ],
    totalReturnValue: 200000,
    refundAmount: 200000,
    refundMethod: 'Tiền mặt',
    accountSystemId: asSystemId('ACCOUNT000001'),
    ...buildAuditFields('2025-11-22T08:00:00Z')
  }
];
