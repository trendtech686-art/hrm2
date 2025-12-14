import type { InventoryReceipt } from './types.ts';
import { asSystemId, asBusinessId } from '@/lib/id-types';

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.abs(days));
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

export const data = [
  {
    systemId: asSystemId('INVRECEIPT000001'),
    id: asBusinessId('PNK000001'),
    purchaseOrderId: asBusinessId('PO0001'),
    purchaseOrderSystemId: asSystemId('PO00000001'),
    supplierSystemId: asSystemId('SUPP000001'),
    supplierName: 'Công ty CP Phần mềm ABC',
    branchSystemId: asSystemId('BRANCH000002'),
    branchName: 'Chi nhánh Hà Nội',
    receivedDate: daysAgo(4),
    receiverSystemId: asSystemId('EMP000001'),
    receiverName: 'Nguyễn Văn An',
    warehouseName: 'Kho chính Hà Nội',
    notes: 'Nhập đầy đủ theo đơn hàng PO0001',
    items: [
      {
        productSystemId: asSystemId('PROD000001'),
        productId: asBusinessId('DV-WEB-01'),
        productName: 'Thiết kế Website Cơ bản',
        orderedQuantity: 2,
        receivedQuantity: 2,
        unitPrice: 5_000_000,
      },
    ],
    ...buildAuditFields('2025-11-19T08:00:00Z'),
  },
  {
    systemId: asSystemId('INVRECEIPT000002'),
    id: asBusinessId('PNK000002'),
    purchaseOrderId: asBusinessId('PO0002'),
    purchaseOrderSystemId: asSystemId('PO00000002'),
    supplierSystemId: asSystemId('SUPP000002'),
    supplierName: 'Công ty TNHH Công nghệ XYZ',
    branchSystemId: asSystemId('BRANCH000002'),
    branchName: 'Chi nhánh Hà Nội',
    receivedDate: daysAgo(2),
    receiverSystemId: asSystemId('EMP000002'),
    receiverName: 'Trần Thị Bình',
    warehouseName: 'Kho chính Hà Nội',
    notes: 'Nhập hàng đợt 1 (2/3 sản phẩm)',
    items: [
      {
        productSystemId: asSystemId('PROD000005'),
        productId: asBusinessId('DV-MKT-01'),
        productName: 'Gói Quản lý Fanpage Basic',
        orderedQuantity: 3,
        receivedQuantity: 2,
        unitPrice: 1_500_000,
      },
    ],
    ...buildAuditFields('2025-11-21T08:00:00Z'),
  },
] satisfies InventoryReceipt[];
