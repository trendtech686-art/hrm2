import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import { asBusinessId, asSystemId } from '@/lib/id-types';

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

const SEED_AUTHOR = asSystemId('EMP000001');
const buildAuditFields = (createdAt: string, createdBy = SEED_AUTHOR) => ({
  createdAt,
  updatedAt: createdAt,
  createdBy,
  updatedBy: createdBy,
});

export const data: Omit<PurchaseOrder, 'systemId' | 'creatorSystemId' | 'creatorName'>[] = [
  {
    id: asBusinessId('PO0001'),
    supplierSystemId: asSystemId('SUPP000001'),
    supplierName: 'Công ty CP Phần mềm ABC',
    branchSystemId: asSystemId('BRANCH000002'),
    branchName: 'Chi nhánh Hà Nội',
    orderDate: addDays(-5),
    deliveryDate: addDays(5),
    buyerSystemId: asSystemId('EMP000001'),
    buyer: 'Nguyễn Văn An',
    status: 'Đặt hàng',
    paymentStatus: 'Chưa thanh toán',
    deliveryStatus: 'Chưa nhập',
    lineItems: [
      {
        productSystemId: asSystemId('PROD000001'),
        productId: asBusinessId('DV-WEB-01'),
        productName: 'Thiết kế Website Cơ bản',
        quantity: 2,
        unitPrice: 5000000,
        discount: 0,
        discountType: 'fixed',
        taxRate: 10,
        sku: 'DV-WEB-01',
        unit: 'Gói',
        imageUrl: '',
        note: ''
      }
    ],
    subtotal: 10000000,
    shippingFee: 0,
    tax: 1000000,
    grandTotal: 11000000,
    payments: [],
    notes: 'Đơn hàng mới đặt',
    ...buildAuditFields('2025-11-18T08:00:00Z'),
  },
  {
    id: asBusinessId('PO0002'),
    supplierSystemId: asSystemId('SUPP000002'),
    supplierName: 'Công ty TNHH Công nghệ XYZ',
    branchSystemId: asSystemId('BRANCH000002'),
    branchName: 'Chi nhánh Hà Nội',
    orderDate: addDays(-3),
    deliveryDate: addDays(7),
    buyerSystemId: asSystemId('EMP000001'),
    buyer: 'Nguyễn Văn An',
    status: 'Đang giao dịch',
    paymentStatus: 'Chưa thanh toán',
    deliveryStatus: 'Chưa nhập',
    lineItems: [
      {
        productSystemId: asSystemId('PROD000005'),
        productId: asBusinessId('DV-MKT-01'),
        productName: 'Gói Quản lý Fanpage Basic',
        quantity: 3,
        unitPrice: 1500000,
        discount: 0,
        discountType: 'fixed',
        taxRate: 10,
        sku: 'DV-MKT-01',
        unit: 'Tháng',
        imageUrl: '',
        note: ''
      }
    ],
    subtotal: 4500000,
    discount: 100000,
    discountType: 'fixed',
    shippingFee: 0,
    tax: 440000,
    grandTotal: 4840000,
    payments: [],
    notes: 'Đang chờ nhà cung cấp giao hàng',
    ...buildAuditFields('2025-11-20T08:00:00Z'),
  }
];