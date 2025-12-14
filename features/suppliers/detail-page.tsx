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
import { Comments, type Comment as CommentType } from '../../components/Comments.tsx';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory.tsx';
import { useAuth } from '../../contexts/auth-context.tsx';
import { RelatedDataTable } from '../../components/data-table/related-data-table.tsx';
import type { ColumnDef } from '../../components/data-table/types.ts';
import { usePurchaseOrderStore } from '../purchase-orders/store.ts';
import { usePaymentStore } from '../payments/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import type { Payment } from '../payments/types.ts';
import type { PurchaseOrder, PaymentStatus, DeliveryStatus } from '../purchase-orders/types.ts';
import { usePurchaseReturnStore } from '../purchase-returns/store.ts';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { ROUTES, generatePath } from '../../lib/router.ts';
import type { BreadcrumbItem } from '../../lib/breadcrumb-system.ts';
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
    const { systemId: systemIdParam } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById } = useSupplierStore();
  const { data: allPurchaseOrders } = usePurchaseOrderStore();
  const { data: allPayments } = usePaymentStore();
  const { data: allPurchaseReturns } = usePurchaseReturnStore();
  const { employee: authEmployee } = useAuth();
  const { findById: findEmployeeById, data: employees } = useEmployeeStore();

  // Helper để lấy tên nhân viên từ systemId hoặc trả về giá trị gốc nếu đã là tên
  const getEmployeeName = React.useCallback((creatorValue: string): string => {
    if (!creatorValue) return '-';
    // Nếu giá trị có dạng EMP... thì lookup từ store
    if (creatorValue.startsWith('EMP') || creatorValue.match(/^[A-Z]{2,4}\d+$/)) {
      const employee = findEmployeeById(asSystemId(creatorValue)) || employees.find(e => e.id === creatorValue);
      return employee?.fullName || creatorValue;
    }
    return creatorValue;
  }, [findEmployeeById, employees]);

    const supplierSystemId = React.useMemo<SystemId | null>(() => (systemIdParam ? asSystemId(systemIdParam) : null), [systemIdParam]);
    const supplier = React.useMemo(() => (supplierSystemId ? findById(supplierSystemId) : null), [supplierSystemId, findById]);

    // Comments state with localStorage persistence
    type SupplierComment = CommentType<SystemId>;
    const [comments, setComments] = React.useState<SupplierComment[]>(() => {
        const saved = localStorage.getItem(`supplier-comments-${systemIdParam}`);
        return saved ? JSON.parse(saved) : [];
    });

    React.useEffect(() => {
        if (systemIdParam) {
            localStorage.setItem(`supplier-comments-${systemIdParam}`, JSON.stringify(comments));
        }
    }, [comments, systemIdParam]);

    const handleAddComment = React.useCallback((content: string, attachments?: string[], parentId?: string) => {
        const newComment: SupplierComment = {
            id: asSystemId(`comment-${Date.now()}`),
            content,
            author: {
                systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
                name: authEmployee?.fullName || 'Hệ thống',
                avatar: authEmployee?.avatar,
            },
            createdAt: new Date().toISOString(),
            attachments,
            parentId: parentId as SystemId | undefined,
        };
        setComments(prev => [...prev, newComment]);
    }, [authEmployee]);

    const handleUpdateComment = React.useCallback((commentId: string, content: string) => {
        setComments(prev => prev.map(c => 
            c.id === commentId ? { ...c, content, updatedAt: new Date().toISOString() } : c
        ));
    }, []);

    const handleDeleteComment = React.useCallback((commentId: string) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
    }, []);

    const commentCurrentUser = React.useMemo(() => ({
        systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
        name: authEmployee?.fullName || 'Hệ thống',
        avatar: authEmployee?.avatar,
    }), [authEmployee]);
  
  const supplierPurchaseOrders = React.useMemo(() => 
        allPurchaseOrders.filter(po => supplier ? po.supplierSystemId === supplier.systemId : false), 
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
        .filter(payment => payment.recipientSystemId === supplier.systemId)
        .map(payment => ({
            systemId: `payment-${payment.systemId}`,
            documentId: payment.id,
            creator: getEmployeeName(payment.createdBy),
            date: payment.date,
            description: payment.description,
            change: -payment.amount, // Decreases debt
        }));

    const returnTransactions = allPurchaseReturns
        .filter(pr => pr.supplierSystemId === supplier.systemId)
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
                <Button
                    key="edit"
                    className="h-9 gap-2"
                    onClick={() => supplierSystemId && navigate(`/suppliers/${supplierSystemId}/edit`)}
                    disabled={!supplierSystemId}
                >
                        <Edit className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                </Button>
        ], [navigate, supplierSystemId]);

    const statusBadge = supplier ? (
        <Badge variant={statusVariants[supplier.status]}>{supplier.status}</Badge>
    ) : undefined;

    const detailSubtitle = supplier
        ? `Mã: ${supplier.id} • Công nợ hiện tại ${formatCurrency(calculatedDebt)}`
        : undefined;

    const breadcrumb = React.useMemo<BreadcrumbItem[]>(() => {
        const items: BreadcrumbItem[] = [
            { label: 'Trang chủ', href: ROUTES.ROOT },
            { label: 'Nhà cung cấp', href: ROUTES.PROCUREMENT.SUPPLIERS },
        ];
        if (supplierSystemId && supplier?.name) {
            items.push({
                label: supplier.name,
                href: generatePath(ROUTES.PROCUREMENT.SUPPLIER_VIEW, { systemId: supplierSystemId }),
                isCurrent: true,
            });
        } else {
            items.push({ label: 'Chi tiết', href: ROUTES.PROCUREMENT.SUPPLIERS, isCurrent: true });
        }
        return items;
    }, [supplierSystemId, supplier?.name]);

    usePageHeader({
        title: supplier ? supplier.name : 'Chi tiết nhà cung cấp',
        subtitle: detailSubtitle,
        badge: statusBadge,
        backPath: ROUTES.PROCUREMENT.SUPPLIERS,
        breadcrumb,
        context: {
            name: supplier?.name,
        },
        actions: headerActions,
    });

  if (!supplier) {
    return (
      <div className="text-center p-8">
          <h2 className="text-h2 font-bold">Không tìm thấy nhà cung cấp</h2>
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
                <CardTitle className="text-h2">{supplier.name}</CardTitle>
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

        {/* Comments */}
        <Comments
            entityType="supplier"
            entityId={supplier.systemId}
            comments={comments}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            currentUser={commentCurrentUser}
            title="Bình luận"
            placeholder="Thêm bình luận về nhà cung cấp..."
        />

        {/* Activity History */}
        <ActivityHistory
            history={supplier.activityHistory || []}
            title="Lịch sử hoạt động"
            emptyMessage="Chưa có lịch sử hoạt động"
            groupByDate
            maxHeight="400px"
        />
    </div>
  );
}


