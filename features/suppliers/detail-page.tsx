import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getDaysDiff } from '@/lib/date-utils';
import { useSupplierStore } from './store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Edit } from 'lucide-react';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.tsx';
import { RelatedDataTable } from '../../components/data-table/related-data-table.tsx';
import type { ColumnDef } from '../../components/data-table/types.ts';
import { usePurchaseOrderStore } from '../purchase-orders/store.ts';
import { usePaymentStore } from '../payments/store.ts';
import type { Payment } from '../payments/types.ts';
import type { PurchaseOrder, PaymentStatus, DeliveryStatus } from '../purchase-orders/types.ts';
import { usePurchaseReturnStore } from '../purchase-returns/store.ts';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const statusVariants: Record<"Đang Giao Dịch" | "Ngừng Giao Dịch", "success" | "secondary"> = {
  "Đang Giao Dịch": "success",
  "Ngừng Giao Dịch": "secondary",
};

const paymentStatusVariants: Record<PaymentStatus, "success" | "warning"> = {
    "Đã thanh toán": "success",
    "Thanh toán một phần": "warning",
    "Chưa thanh toán": "warning",
};

const purchaseOrderHistoryColumns: ColumnDef<PurchaseOrder>[] = [
    { id: 'id', accessorKey: 'id', header: 'Mã đơn', cell: ({ row }) => <span className="font-medium text-primary">{row.id}</span>, meta: { displayName: 'Mã đơn' } },
    { id: 'orderDate', accessorKey: 'orderDate', header: 'Ngày đặt', cell: ({ row }) => formatDate(row.orderDate), meta: { displayName: 'Ngày đặt' } },
    { id: 'grandTotal', accessorKey: 'grandTotal', header: 'Tổng tiền', cell: ({ row }) => formatCurrency(row.grandTotal), meta: { displayName: 'Tổng tiền' } },
    { id: 'deliveryStatus', accessorKey: 'deliveryStatus', header: 'Giao hàng', cell: ({ row }) => <Badge variant="outline">{row.deliveryStatus}</Badge>, meta: { displayName: 'Giao hàng' } },
    { id: 'paymentStatus', accessorKey: 'paymentStatus', header: 'Thanh toán', cell: ({ row }) => <Badge variant={paymentStatusVariants[row.paymentStatus] as any}>{row.paymentStatus}</Badge>, meta: { displayName: 'Thanh toán' } },
];

const debtColumns: ColumnDef<any>[] = [
    { id: 'documentId', accessorKey: 'documentId', header: 'Mã C.Từ', cell: ({ row }) => <span className="font-medium text-primary">{row.documentId}</span>, meta: { displayName: 'Mã Chứng Từ' } },
    { id: 'creator', accessorKey: 'creator', header: 'Người tạo', cell: ({ row }) => row.creator, meta: { displayName: 'Người tạo' } },
    { id: 'date', accessorKey: 'date', header: 'Ngày', cell: ({ row }) => formatDate(row.date), meta: { displayName: 'Ngày' } },
    { id: 'description', accessorKey: 'description', header: 'Diễn giải', cell: ({ row }) => row.description, meta: { displayName: 'Diễn giải' } },
    { id: 'change', accessorKey: 'change', header: 'Phát sinh', cell: ({ row }) => <span className={row.change > 0 ? 'text-red-600' : 'text-green-600'}>{formatCurrency(row.change)}</span>, meta: { displayName: 'Phát sinh' } },
    { id: 'balance', accessorKey: 'balance', header: 'Số dư cuối', cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.balance)}</span>, meta: { displayName: 'Số dư cuối' } },
];


export function SupplierDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById } = useSupplierStore();
  const { data: allPurchaseOrders } = usePurchaseOrderStore();
  const { data: allPayments } = usePaymentStore();
  const { data: allPurchaseReturns } = usePurchaseReturnStore();

  const supplier = React.useMemo(() => (systemId ? findById(systemId) : null), [systemId, findById]);
  
  const supplierPurchaseOrders = React.useMemo(() => 
    allPurchaseOrders.filter(po => po.supplierSystemId === supplier?.systemId || po.supplierSystemId === supplier?.id), 
  [allPurchaseOrders, supplier]);

  const { supplierDebtTransactions, calculatedDebt } = React.useMemo(() => {
    if (!supplier) return { supplierDebtTransactions: [], calculatedDebt: 0 };

    const purchaseOrderTransactions = supplierPurchaseOrders.map(po => ({
        systemId: `po-${po.systemId}`,
        documentId: po.id,
        creator: po.buyer,
        date: po.orderDate,
        description: `Đơn mua hàng #${po.id}`,
        change: po.grandTotal, // Increases debt
    }));

    const paymentTransactions = allPayments
        .filter(payment => payment.recipientName === supplier.name || payment.recipientSystemId === supplier.systemId)
        .map(payment => ({
            systemId: `payment-${payment.systemId}`,
            documentId: payment.id,
            creator: payment.createdBy,
            date: payment.date,
            description: payment.description,
            change: -payment.amount, // Decreases debt
        }));

    const returnTransactions = allPurchaseReturns
        .filter(pr => pr.supplierId === supplier.systemId)
        .map(pr => ({
            systemId: `return-${pr.systemId}`,
            documentId: pr.id,
            creator: pr.creatorName,
            date: pr.returnDate,
            description: `Hoàn trả hàng cho đơn ${pr.purchaseOrderId}`,
            change: -pr.totalReturnValue, // Decreases debt
        }));


    const allTransactions = [...purchaseOrderTransactions, ...paymentTransactions, ...returnTransactions];
    allTransactions.sort((a, b) => getDaysDiff(parseDate(a.date), parseDate(b.date)));
    
    let runningBalance = supplier.currentDebt || 0;
    const transactionsWithBalance = allTransactions.map(t => {
        runningBalance += t.change;
        return { ...t, balance: runningBalance };
    });

    return { 
        supplierDebtTransactions: transactionsWithBalance.reverse(),
        calculatedDebt: runningBalance
    };
  }, [supplier, supplierPurchaseOrders, allPayments, allPurchaseReturns]);

  const headerActions = React.useMemo(() => [
    <Button key="back" variant="outline" onClick={() => navigate('/suppliers')}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Quay lại
    </Button>,
    <Button key="edit" onClick={() => navigate(`/suppliers/${systemId}/edit`)}>
      <Edit className="mr-2 h-4 w-4" />
      Chỉnh sửa
    </Button>
  ], [navigate, systemId]);

  usePageHeader({
    title: supplier ? `Chi tiết nhà cung cấp: ${supplier.name}` : 'Chi tiết nhà cung cấp',
    subtitle: supplier ? `Mã: ${supplier.id} • ${supplier.status || 'Đang giao dịch'}` : undefined,
    context: {
      name: supplier?.name,
    },
    actions: headerActions,
  });

  if (!supplier) {
    return (
      <div className="text-center p-8">
          <h2 className="text-2xl font-bold">Không tìm thấy nhà cung cấp</h2>
          <Button onClick={() => navigate('/suppliers')} className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Quay về danh sách</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <Card>
        <CardHeader>
            <div className="flex items-start justify-between">
            <div>
                <CardTitle className="text-2xl">{supplier.name}</CardTitle>
                <CardDescription className="mt-1">
                Mã NCC: {supplier.id}
                </CardDescription>
            </div>
            </div>
        </CardHeader>
        <CardContent>
            <dl>
                <DetailField label="Tên nhà cung cấp" value={supplier.name} />
                <DetailField label="Mã số thuế" value={supplier.taxCode} />
                <DetailField label="Số điện thoại" value={supplier.phone} />
                <DetailField label="Email" value={supplier.email} />
                <DetailField label="Địa chỉ" value={supplier.address} />
                <DetailField label="Website" value={supplier.website} />
                <DetailField label="Người phụ trách" value={supplier.accountManager} />
                <DetailField label="Công nợ hiện tại" value={formatCurrency(calculatedDebt)} />
                <DetailField label="Trạng thái">
                    <Badge variant={statusVariants[supplier.status]}>{supplier.status}</Badge>
                </DetailField>
            </dl>
        </CardContent>
        </Card>

        <Tabs defaultValue="purchase-history">
            <TabsList>
                <TabsTrigger value="purchase-history">Lịch sử nhập hàng</TabsTrigger>
                <TabsTrigger value="debt">Công nợ</TabsTrigger>
            </TabsList>
            <TabsContent value="purchase-history" className="mt-4">
                <Card>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={supplierPurchaseOrders}
                            columns={purchaseOrderHistoryColumns}
                            searchKeys={['id', 'status']}
                            searchPlaceholder="Tìm theo mã đơn hàng..."
                            dateFilterColumn="orderDate"
                            dateFilterTitle="Ngày đặt"
                            exportFileName={`Lich_su_nhap_hang_${supplier.id}`}
                            onRowClick={(row) => navigate(`/purchase-orders/${row.systemId}`)}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="debt" className="mt-4">
                <Card>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={supplierDebtTransactions}
                            columns={debtColumns}
                            searchKeys={['voucherId', 'description']}
                            searchPlaceholder="Tìm theo mã CT, diễn giải..."
                            dateFilterColumn="date"
                            dateFilterTitle="Ngày giao dịch"
                            exportFileName={`Cong_no_${supplier.id}`}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}


