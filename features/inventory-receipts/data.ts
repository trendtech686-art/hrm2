import type { InventoryReceipt } from './types.ts';

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

export const data: Omit<InventoryReceipt, 'systemId'>[] = [
  {
    id: 'PNK000001',
    purchaseOrderId: 'PO0001',
    supplierSystemId: 'SUPP000001',
    supplierName: 'Công ty CP Phần mềm ABC',
    receivedDate: addDays(-4),
    receiverSystemId: 'EMP000001',
    receiverName: 'Nguyễn Văn An',
    notes: 'Nhập đầy đủ theo đơn hàng PO0001',
    items: [
      {
        productSystemId: 'DV-WEB-01',
        productId: 'DV-WEB-01',
        productName: 'Thiết kế Website Cơ bản',
        orderedQuantity: 2,
        receivedQuantity: 2,
        unitPrice: 5000000
      }
    ]
  },
  {
    id: 'PNK000002',
    purchaseOrderId: 'PO0002',
    supplierSystemId: 'SUPP000002',
    supplierName: 'Công ty TNHH Công nghệ XYZ',
    receivedDate: addDays(-2),
    receiverSystemId: 'EMP000002',
    receiverName: 'Trần Thị Bình',
    notes: 'Nhập hàng đợt 1',
    items: [
      {
        productSystemId: 'DV-MKT-01',
        productId: 'DV-MKT-01',
        productName: 'Gói Quản lý Fanpage Basic',
        orderedQuantity: 3,
        receivedQuantity: 2,
        unitPrice: 1500000
      }
    ]
  },
  {
    id: 'PNK000003',
    purchaseOrderId: 'PO0003',
    supplierSystemId: 'NCC000001',
    supplierName: 'Công ty CP Phần mềm ABC',
    receivedDate: addDays(-5),
    receiverSystemId: 'EMP00001',
    receiverName: 'Nguyễn Văn An',
    notes: 'Nhập đợt 1 - 2/5 Landing Pages',
    items: [
      {
        productSystemId: 'DV-WEB-03',
        productId: 'DV-WEB-03',
        productName: 'Thiết kế Landing Page',
        orderedQuantity: 5,
        receivedQuantity: 2,
        unitPrice: 2000000
      }
    ]
  },
  {
    id: 'PNK000004',
    purchaseOrderId: 'PO0004',
    supplierSystemId: 'NCC000003',
    supplierName: 'Công ty TNHH Vật liệu XD',
    receivedDate: addDays(-3),
    receiverSystemId: 'EMP00003',
    receiverName: 'Lê Văn Cường',
    notes: 'Nhập đầy đủ theo đơn hàng',
    items: [
      {
        productSystemId: 'DV-SEO-02',
        productId: 'DV-SEO-02',
        productName: 'Gói SEO tổng thể',
        orderedQuantity: 1,
        receivedQuantity: 1,
        unitPrice: 12000000
      }
    ]
  },
  {
    id: 'PNK000005',
    purchaseOrderId: 'PO0005',
    supplierSystemId: 'NCC000002',
    supplierName: 'Công ty TNHH Công nghệ XYZ',
    receivedDate: addDays(-1),
    receiverSystemId: 'EMP00001',
    receiverName: 'Nguyễn Văn An',
    notes: 'Nhập nhanh trong ngày',
    items: [
      {
        productSystemId: 'DV-APP-01',
        productId: 'DV-APP-01',
        productName: 'Phát triển Mobile App',
        orderedQuantity: 1,
        receivedQuantity: 1,
        unitPrice: 50000000
      }
    ]
  }
];
