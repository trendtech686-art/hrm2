import type { PurchaseReturn } from './types.ts';

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

export const data: Omit<PurchaseReturn, 'systemId'>[] = [
  {
    id: 'PTH000001',
    purchaseOrderId: 'PO0001',
    supplierSystemId: 'NCC000001',
    supplierName: 'Công ty CP Phần mềm ABC',
    branchSystemId: 'CN001',
    branchName: 'Chi nhánh Hà Nội',
    returnDate: addDays(-2),
    creatorName: 'Nguyễn Văn An',
    reason: 'Sản phẩm không đúng yêu cầu',
    items: [
      {
        productSystemId: 'DV-WEB-01',
        productId: 'DV-WEB-01',
        productName: 'Thiết kế Website Cơ bản',
        orderedQuantity: 2,
        returnQuantity: 1,
        unitPrice: 5000000,
        note: 'Thiết kế không đúng template'
      }
    ],
    totalReturnValue: 5000000,
    refundAmount: 5000000,
    refundMethod: 'Chuyển khoản',
    accountSystemId: 'TK001'
  },
  {
    id: 'PTH000002',
    purchaseOrderId: 'PO0003',
    supplierSystemId: 'NCC000001',
    supplierName: 'Công ty CP Phần mềm ABC',
    branchSystemId: 'CN002',
    branchName: 'Chi nhánh TP.HCM',
    returnDate: addDays(-1),
    creatorName: 'Trần Thị Bình',
    reason: 'Chất lượng không đạt',
    items: [
      {
        productSystemId: 'DV-WEB-03',
        productId: 'DV-WEB-03',
        productName: 'Thiết kế Landing Page',
        orderedQuantity: 5,
        returnQuantity: 1,
        unitPrice: 2000000,
        note: 'Landing page không responsive'
      }
    ],
    totalReturnValue: 2000000,
    refundAmount: 2000000,
    refundMethod: 'Tiền mặt',
    accountSystemId: 'TM001'
  }
];
