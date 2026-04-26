'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { PullToRefresh } from '@/components/shared/pull-to-refresh';
import { formatDate } from '@/lib/date-utils';
import { useSupplier, useSupplierMutations } from './hooks/use-suppliers';
import { useSupplierStats } from './hooks/use-supplier-stats';
import { usePageHeader } from '../../contexts/page-header-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Edit, Plus, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { ReceiptForm, type ReceiptFormValues } from '../receipts/receipt-form';
import { PaymentForm, type PaymentFormValues } from '../payments/payment-form';
import { useReceiptMutations } from '../receipts/hooks/use-receipts';
import { usePaymentMutations } from '../payments/hooks/use-payments';
import type { ReceiptInput } from '../receipts/types';
import type { Payment } from '../payments/types';
import { asBusinessId } from '@/lib/id-types';
import { toast } from 'sonner';
import { DetailField } from '../../components/ui/detail-field';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent } from '../../components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger, mobileBleedCardClass } from '@/components/layout/page-section';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { useAuth } from '../../contexts/auth-context';
import { RelatedDataTable } from '../../components/data-table/related-data-table';
import type { ColumnDef } from '../../components/data-table/types';
import { 
  useSupplierPurchaseOrdersPaginated, 
  useSupplierDebtTransactionsPaginated,
  useSupplierPurchaseReturnsPaginated,
  useSupplierProductsOrderedPaginated,
  useSupplierProductsReturnedPaginated,
  useSupplierWarrantiesPaginated,
  useSupplierWarrantyProductsPaginated,
  type DebtTransaction,
  type ProductOrdered,
  type ProductReturned,
  type WarrantyProduct,
} from './hooks/use-supplier-financial-data';
import type { SupplierWarranty } from '../supplier-warranty/types';
import type { PurchaseOrder, PaymentStatus } from '../purchase-orders/types';
import type { PurchaseReturn } from '../purchase-returns/types';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { ROUTES, generatePath } from '../../lib/router';
import type { BreadcrumbItem } from '../../lib/breadcrumb-system';
import { useComments } from '../../hooks/use-comments';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
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
    { id: 'id', accessorKey: 'id', header: 'Mã đơn', cell: ({ row }) => <a href={`/purchase-orders/${row.id}`} className="font-medium text-primary hover:underline cursor-pointer">{row.id}</a>, meta: { displayName: 'Mã đơn' } },
    { id: 'orderDate', accessorKey: 'orderDate', header: 'Ngày đặt', cell: ({ row }) => formatDate(row.orderDate), meta: { displayName: 'Ngày đặt' } },
    { id: 'deliveryDate', accessorKey: 'deliveryDate', header: 'Ngày nhận', cell: ({ row }) => row.deliveryDate ? formatDate(row.deliveryDate) : '-', meta: { displayName: 'Ngày nhận' } },
    { id: 'grandTotal', accessorKey: 'grandTotal', header: 'Tổng tiền', cell: ({ row }) => formatCurrency(row.grandTotal), meta: { displayName: 'Tổng tiền' } },
    { id: 'deliveryStatus', accessorKey: 'deliveryStatus', header: 'Giao hàng', cell: ({ row }) => <Badge variant="outline">{row.deliveryStatus}</Badge>, meta: { displayName: 'Giao hàng' } },
    { id: 'paymentStatus', accessorKey: 'paymentStatus', header: 'Thanh toán', cell: ({ row }) => <Badge variant={paymentStatusVariants[row.paymentStatus] as "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | null | undefined}>{row.paymentStatus}</Badge>, meta: { displayName: 'Thanh toán' } },
];

// Helper to get route based on debt record type
const getDebtRecordRoute = (systemId: string): string | null => {
  if (systemId.startsWith('po-')) {
    return `/purchase-orders/${systemId.replace('po-', '')}`;
  }
  if (systemId.startsWith('payment-')) {
    return `/payments/${systemId.replace('payment-', '')}`;
  }
  if (systemId.startsWith('return-')) {
    return `/purchase-returns/${systemId.replace('return-', '')}`;
  }
  if (systemId.startsWith('receipt-')) {
    return `/receipts/${systemId.replace('receipt-', '')}`;
  }
  return null;
};

const debtColumns: ColumnDef<DebtTransaction>[] = [
    { id: 'documentId', accessorKey: 'documentId', header: 'Mã C.Từ', cell: ({ row }) => <span className="font-medium text-primary cursor-pointer hover:underline">{row.documentId}</span>, meta: { displayName: 'Mã Chứng Từ' } },
    { id: 'creator', accessorKey: 'creator', header: 'Người tạo', cell: ({ row }) => row.creator, meta: { displayName: 'Người tạo' } },
    { id: 'date', accessorKey: 'date', header: 'Ngày', cell: ({ row }) => formatDate(row.date), meta: { displayName: 'Ngày' } },
    { id: 'description', accessorKey: 'description', header: 'Diễn giải', cell: ({ row }) => row.description, meta: { displayName: 'Diễn giải' } },
    { id: 'change', accessorKey: 'change', header: 'Phát sinh', cell: ({ row }) => {
      const prefix = row.change > 0 ? '+' : '';
      return <span className={row.change > 0 ? 'text-red-600' : 'text-green-600'}>{prefix}{formatCurrency(row.change)}</span>;
    }, meta: { displayName: 'Phát sinh' } },
    { id: 'balance', accessorKey: 'balance', header: 'Số dư cuối', cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.balance)}</span>, meta: { displayName: 'Số dư cuối' } },
];

const purchaseReturnColumns: ColumnDef<PurchaseReturn>[] = [
    { id: 'id', accessorKey: 'id', header: 'Mã đơn', cell: ({ row }) => <a href={`/purchase-returns/${row.id}`} className="font-medium text-primary hover:underline cursor-pointer">{row.id}</a>, meta: { displayName: 'Mã đơn' } },
    { id: 'returnDate', accessorKey: 'returnDate', header: 'Ngày trả', cell: ({ row }) => formatDate(row.returnDate), meta: { displayName: 'Ngày trả' } },
    { id: 'totalReturnValue', accessorKey: 'totalReturnValue', header: 'Tổng tiền trả', cell: ({ row }) => formatCurrency(Number(row.totalReturnValue)), meta: { displayName: 'Tổng tiền trả' } },
    { id: 'refundAmount', accessorKey: 'refundAmount', header: 'Tiền hoàn', cell: ({ row }) => formatCurrency(Number(row.refundAmount)), meta: { displayName: 'Tiền hoàn' } },
    { id: 'reason', accessorKey: 'reason', header: 'Lý do', cell: ({ row }) => row.reason || '-', meta: { displayName: 'Lý do' } },
];

const productsOrderedColumns: ColumnDef<ProductOrdered>[] = [
    { id: 'orderId', accessorKey: 'orderId', header: 'Mã đơn nhập', cell: ({ row }) => <a href={`/purchase-orders/${row.orderId}`} className="font-medium text-primary hover:underline cursor-pointer">{row.orderId}</a>, meta: { displayName: 'Mã đơn nhập' } },
    { id: 'orderDate', accessorKey: 'orderDate', header: 'Ngày đặt', cell: ({ row }) => row.orderDate ? formatDate(row.orderDate) : '-', meta: { displayName: 'Ngày đặt' } },
    { id: 'productSku', accessorKey: 'productSku', header: 'SKU', cell: ({ row }) => <a href={`/products/${row.productId}`} className="font-medium text-primary hover:underline cursor-pointer">{row.productSku}</a>, meta: { displayName: 'SKU' } },
    { id: 'productName', accessorKey: 'productName', header: 'Sản phẩm', cell: ({ row }) => row.productName, meta: { displayName: 'Sản phẩm' } },
    { id: 'quantity', accessorKey: 'quantity', header: 'Số lượng', cell: ({ row }) => row.quantity.toLocaleString('vi-VN'), meta: { displayName: 'Số lượng' } },
    { id: 'unitPrice', accessorKey: 'unitPrice', header: 'Đơn giá', cell: ({ row }) => formatCurrency(row.unitPrice), meta: { displayName: 'Đơn giá' } },
    { id: 'total', accessorKey: 'total', header: 'Thành tiền', cell: ({ row }) => formatCurrency(row.total), meta: { displayName: 'Thành tiền' } },
];

const warrantyStatusLabels: Record<string, string> = {
  DRAFT: 'Nháp',
  APPROVED: 'Đã duyệt',
  PACKED: 'Đã đóng gói',
  EXPORTED: 'Đã xuất kho',
  SENT: 'Đã gửi',
  DELIVERED: 'Đã giao',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const warrantyStatusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  DRAFT: 'outline',
  APPROVED: 'secondary',
  PACKED: 'secondary',
  EXPORTED: 'warning',
  SENT: 'warning',
  DELIVERED: 'warning',
  CONFIRMED: 'success',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
};

const warrantyColumns: ColumnDef<SupplierWarranty>[] = [
    { id: 'id', accessorKey: 'id', header: 'Mã BH', cell: ({ row }) => <a href={`/supplier-warranty/${row.systemId}`} className="font-medium text-primary hover:underline cursor-pointer">{row.id}</a>, meta: { displayName: 'Mã BH' } },
    { id: 'createdAt', accessorKey: 'createdAt', header: 'Ngày tạo', cell: ({ row }) => formatDate(row.createdAt), meta: { displayName: 'Ngày tạo' } },
    { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <Badge variant={warrantyStatusVariants[row.status] || 'outline'}>{warrantyStatusLabels[row.status] || row.status}</Badge>, meta: { displayName: 'Trạng thái' } },
    { id: 'reason', accessorKey: 'reason', header: 'Lý do', cell: ({ row }) => row.reason || '-', meta: { displayName: 'Lý do' } },
    { id: 'itemCount', accessorKey: 'items', header: 'Số SP', cell: ({ row }) => row.items?.length || 0, meta: { displayName: 'Số SP' } },
    { id: 'totalWarrantyCost', accessorKey: 'totalWarrantyCost', header: 'Chi phí BH', cell: ({ row }) => formatCurrency(row.totalWarrantyCost), meta: { displayName: 'Chi phí BH' } },
    { id: 'branchName', accessorKey: 'branchName', header: 'Chi nhánh', cell: ({ row }) => row.branchName || '-', meta: { displayName: 'Chi nhánh' } },
];

const warrantyProductColumns: ColumnDef<WarrantyProduct>[] = [
    { id: 'warrantyBusinessId', accessorKey: 'warrantyBusinessId', header: 'Mã BH', cell: ({ row }) => <a href={`/supplier-warranty/${row.warrantyId}`} className="font-medium text-primary hover:underline cursor-pointer">{row.warrantyBusinessId}</a>, meta: { displayName: 'Mã BH' } },
    { id: 'warrantyDate', accessorKey: 'warrantyDate', header: 'Ngày BH', cell: ({ row }) => row.warrantyDate ? formatDate(row.warrantyDate) : '-', meta: { displayName: 'Ngày BH' } },
    { id: 'warrantyStatus', accessorKey: 'warrantyStatus', header: 'Trạng thái', cell: ({ row }) => <Badge variant={warrantyStatusVariants[row.warrantyStatus] || 'outline'}>{warrantyStatusLabels[row.warrantyStatus] || row.warrantyStatus}</Badge>, meta: { displayName: 'Trạng thái' } },
    { id: 'productSku', accessorKey: 'productSku', header: 'SKU', cell: ({ row }) => <a href={`/products/${row.productId}`} className="font-medium text-primary hover:underline cursor-pointer">{row.productSku}</a>, meta: { displayName: 'SKU' } },
    { id: 'productName', accessorKey: 'productName', header: 'Sản phẩm', cell: ({ row }) => row.productName, meta: { displayName: 'Sản phẩm' } },
    { id: 'sentQuantity', accessorKey: 'sentQuantity', header: 'SL gửi', cell: ({ row }) => row.sentQuantity.toLocaleString('vi-VN'), meta: { displayName: 'SL gửi' } },
    { id: 'returnedQuantity', accessorKey: 'returnedQuantity', header: 'SL trả', cell: ({ row }) => row.returnedQuantity.toLocaleString('vi-VN'), meta: { displayName: 'SL trả' } },
    { id: 'warrantyCost', accessorKey: 'warrantyCost', header: 'Chi phí BH', cell: ({ row }) => formatCurrency(row.warrantyCost), meta: { displayName: 'Chi phí BH' } },
    { id: 'warrantyResult', accessorKey: 'warrantyResult', header: 'Kết quả', cell: ({ row }) => row.warrantyResult || '-', meta: { displayName: 'Kết quả' } },
];

const productsReturnedColumns: ColumnDef<ProductReturned>[] = [
    { id: 'returnId', accessorKey: 'returnId', header: 'Mã đơn trả', cell: ({ row }) => <a href={`/purchase-returns/${row.returnId}`} className="font-medium text-primary hover:underline cursor-pointer">{row.returnId}</a>, meta: { displayName: 'Mã đơn trả' } },
    { id: 'returnDate', accessorKey: 'returnDate', header: 'Ngày trả', cell: ({ row }) => row.returnDate ? formatDate(row.returnDate) : '-', meta: { displayName: 'Ngày trả' } },
    { id: 'productSku', accessorKey: 'productSku', header: 'SKU', cell: ({ row }) => <a href={`/products/${row.productId}`} className="font-medium text-primary hover:underline cursor-pointer">{row.productSku}</a>, meta: { displayName: 'SKU' } },
    { id: 'productName', accessorKey: 'productName', header: 'Sản phẩm', cell: ({ row }) => row.productName, meta: { displayName: 'Sản phẩm' } },
    { id: 'quantity', accessorKey: 'quantity', header: 'Số lượng', cell: ({ row }) => row.quantity.toLocaleString('vi-VN'), meta: { displayName: 'Số lượng' } },
    { id: 'unitPrice', accessorKey: 'unitPrice', header: 'Đơn giá', cell: ({ row }) => formatCurrency(row.unitPrice), meta: { displayName: 'Đơn giá' } },
    { id: 'total', accessorKey: 'total', header: 'Thành tiền', cell: ({ row }) => formatCurrency(row.total), meta: { displayName: 'Thành tiền' } },
    { id: 'reason', accessorKey: 'reason', header: 'Lý do', cell: ({ row }) => row.reason || '-', meta: { displayName: 'Lý do' } },
];


export function SupplierDetailPage() {
    const { systemId: systemIdParam } = useParams<{ systemId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: supplier, isLoading: isLoadingSupplier } = useSupplier(systemIdParam);
  const { data: supplierStats } = useSupplierStats(systemIdParam);
  const { update: updateSupplier } = useSupplierMutations();
  const { employee: authEmployee, can, isAdmin } = useAuth();
  const { isMobile } = useBreakpoint();

    const supplierSystemId = React.useMemo<SystemId | null>(() => (systemIdParam ? asSystemId(systemIdParam) : null), [systemIdParam]);

  // ⚡ OPTIMIZED: Track visited tabs to lazy-load financial data
  const [visitedTabs, setVisitedTabs] = React.useState<Set<string>>(() => new Set(['purchase-history']));
  const handleTabChange = React.useCallback((tab: string) => {
    setVisitedTabs(prev => {
      if (prev.has(tab)) return prev;
      const next = new Set(prev);
      next.add(tab);
      return next;
    });
  }, []);

  // ⚡ Server-side paginated data - lazy loaded when respective tabs are visited
  const purchaseOrdersResult = useSupplierPurchaseOrdersPaginated(supplierSystemId, { 
    enabled: visitedTabs.has('purchase-history') || visitedTabs.has('debt') // ⚡ Also fetch for debt tab
  });
  // ⚡ Server-side paginated data for debt transactions
  const debtTransactionsResult = useSupplierDebtTransactionsPaginated(supplierSystemId, { 
    enabled: visitedTabs.has('debt') 
  });
  // ⚡ Server-side paginated data for purchase returns
  const purchaseReturnsResult = useSupplierPurchaseReturnsPaginated(supplierSystemId, { 
    enabled: visitedTabs.has('purchase-returns') 
  });
  // ⚡ Server-side paginated data for products ordered
  const productsOrderedResult = useSupplierProductsOrderedPaginated(supplierSystemId, { 
    enabled: visitedTabs.has('products-ordered') 
  });
  // ⚡ Server-side paginated data for products returned
  const productsReturnedResult = useSupplierProductsReturnedPaginated(supplierSystemId, { 
    enabled: visitedTabs.has('products-returned') 
  });
  // ⚡ Server-side paginated data for warranties
  const warrantiesResult = useSupplierWarrantiesPaginated(supplierSystemId, { 
    enabled: visitedTabs.has('warranties') 
  });
  // ⚡ Server-side paginated data for warranty products
  const warrantyProductsResult = useSupplierWarrantyProductsPaginated(supplierSystemId, { 
    enabled: visitedTabs.has('warranty-products') 
  });



    // ✅ Sử dụng useComments hook thay vì localStorage trực tiếp
    const { 
      comments: dbComments, 
      addComment: dbAddComment, 
      deleteComment: dbDeleteComment,
      isLoading: _commentsLoading 
    } = useComments('supplier', systemIdParam || '');
    
    // Transform database comments to component format
    type SupplierComment = CommentType<SystemId>;
    const comments = React.useMemo<SupplierComment[]>(() => 
      dbComments.map(c => ({
        id: asSystemId(c.systemId),
        content: c.content,
        author: {
          systemId: asSystemId(c.createdBy || 'system'),
          name: c.createdByName || 'Hệ thống',
        },
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        attachments: c.attachments,
      })), 
      [dbComments]
    );

    const handleAddComment = React.useCallback((content: string, attachments?: string[], _parentId?: string) => {
        dbAddComment(content, attachments || []);
    }, [dbAddComment]);

    const handleUpdateComment = React.useCallback((_commentId: string, _content: string) => {
        // TODO: Add update API support in useComments hook
    }, []);

    const handleDeleteComment = React.useCallback((commentId: string) => {
        dbDeleteComment(commentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const commentCurrentUser = React.useMemo(() => ({
        systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
        name: authEmployee?.fullName || 'Hệ thống',
        avatar: authEmployee?.avatar,
    }), [authEmployee]);
  
  // Get data from paginated results
  const supplierPurchaseOrders = purchaseOrdersResult.data;
  const supplierDebtTransactions = debtTransactionsResult.data;
  const supplierPurchaseReturns = purchaseReturnsResult.data;
  const supplierProductsOrdered = productsOrderedResult.data;
  const supplierProductsReturned = productsReturnedResult.data;
  const supplierWarranties = warrantiesResult.data;
  const supplierWarrantyProducts = warrantyProductsResult.data;
  // ⚡ Use dynamically calculated debt from stats (includes POs - payments - returns)
  const calculatedDebt = supplierStats?.financial?.debtBalance || 0;

  // ⚡ Sync DB currentDebt immediately if it differs from live calculation
  // Uses stats API (always loaded) as source of truth for server-computed debt
  React.useEffect(() => {
    if (!supplier || !supplierStats) return;
    const dbDebt = Number(supplier.currentDebt ?? 0) ?? 0;
    const calculatedDebtValue = supplierStats?.financial?.debtBalance ?? 0;
    if (Math.abs(dbDebt - calculatedDebtValue) > 0.01) {
      updateSupplier.mutate({ systemId: supplier.systemId, currentDebt: calculatedDebtValue } as Parameters<typeof updateSupplier.mutate>[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierStats?.financial?.debtBalance, supplier?.systemId, supplier?.currentDebt, updateSupplier]);

  const [receiptDialogOpen, setReceiptDialogOpen] = React.useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const receiptFormRef = React.useRef<HTMLFormElement>(null);
  const paymentFormRef = React.useRef<HTMLFormElement>(null);

  const { create: createReceipt } = useReceiptMutations({
    onCreateSuccess: () => {
      toast.success("Tạo phiếu thu thành công");
      setReceiptDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (error) => toast.error(error.message || "Tạo phiếu thu thất bại"),
  });

  const { create: createPayment } = usePaymentMutations({
    onCreateSuccess: () => {
      toast.success("Tạo phiếu chi thành công");
      setPaymentDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (error) => toast.error(error.message || "Tạo phiếu chi thất bại"),
  });

  const handleReceiptSubmit = React.useCallback((values: ReceiptFormValues) => {
    const name = values.payerTypeName?.toLowerCase() || '';
    const category = name.includes('nhà cung cấp') || name.includes('supplier') ? 'other' as const : 'other' as const;
    const { id, payerTypeSystemId, payerSystemId, paymentMethodSystemId, accountSystemId, paymentReceiptTypeSystemId, branchSystemId, ...rest } = values;
    createReceipt.mutate({
      ...rest,
      ...(id ? { id: asBusinessId(id) } : {}),
      payerTypeSystemId: asSystemId(payerTypeSystemId),
      payerSystemId: payerSystemId ? asSystemId(payerSystemId) : undefined,
      paymentMethodSystemId: asSystemId(paymentMethodSystemId),
      accountSystemId: asSystemId(accountSystemId),
      paymentReceiptTypeSystemId: asSystemId(paymentReceiptTypeSystemId),
      branchSystemId: asSystemId(branchSystemId),
      createdBy: authEmployee?.systemId ?? asSystemId('SYSTEM'),
      category,
      createdAt: new Date().toISOString(),
    } as ReceiptInput);
  }, [createReceipt, authEmployee]);

  const handlePaymentSubmit = React.useCallback((values: PaymentFormValues) => {
    createPayment.mutate({
      ...values,
      category: 'supplier_payment',
      branchId: values.branchSystemId,
      createdBy: authEmployee?.systemId ?? asSystemId('SYSTEM'),
      createdAt: new Date().toISOString(),
    } as Omit<Payment, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>);
  }, [createPayment, authEmployee]);

        const headerActions = React.useMemo(() => {
            const actions: React.ReactNode[] = [];
            if (isAdmin || can('edit_suppliers')) {
                actions.push(
                    <Button
                        key="receipt"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setReceiptDialogOpen(true)}
                    >
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo phiếu thu
                    </Button>,
                    <Button
                        key="payment"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setPaymentDialogOpen(true)}
                    >
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo phiếu chi
                    </Button>,
                    <Button
                        key="edit"
                        className="gap-2"
                        onClick={() => supplierSystemId && router.push(`/suppliers/${supplierSystemId}/edit`)}
                        disabled={!supplierSystemId}
                    >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                    </Button>
                );
            }
            return actions;
        }, [router, supplierSystemId, isAdmin, can]);

        const mobileHeaderActions = React.useMemo(() => {
            if (!isMobile || !(isAdmin || can('edit_suppliers'))) return null;
            return [
                <DropdownMenu key="mobile-actions">
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setReceiptDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo phiếu thu
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPaymentDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo phiếu chi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => supplierSystemId && router.push(`/suppliers/${supplierSystemId}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>,
            ];
        }, [isMobile, router, supplierSystemId, isAdmin, can]);

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
        actions: isMobile ? mobileHeaderActions : headerActions,
    });

  // ⚡ Show loading while data is being fetched, only show "not found" after loading completes
  if (isLoadingSupplier) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-center p-8">
          <h2 className="text-h2 font-bold">Không tìm thấy nhà cung cấp</h2>
          <Button onClick={() => router.push('/suppliers')} className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Quay về danh sách</Button>
      </div>
    );
  }

  const handlePullRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['supplier', systemIdParam] }),
      queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
      queryClient.invalidateQueries({ queryKey: ['supplier-stats', systemIdParam] }),
      queryClient.invalidateQueries({ queryKey: ['supplier-purchase-orders', systemIdParam] }),
      queryClient.invalidateQueries({ queryKey: ['supplier-purchase-returns', systemIdParam] }),
      queryClient.invalidateQueries({ queryKey: ['supplier-debt', systemIdParam] }),
      queryClient.invalidateQueries({ queryKey: ['supplier-warranty', systemIdParam] }),
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] }),
    ]);
  };

  return (
    <PullToRefresh onRefresh={handlePullRefresh} disabled={!isMobile}>
      {/* Receipt Create Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent mobileFullScreen className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo phiếu thu - {supplier.name}</DialogTitle>
          </DialogHeader>
          <ReceiptForm
            ref={receiptFormRef}
            initialData={null}
            onSubmit={handleReceiptSubmit}
            defaultPayer={{
              systemId: supplier.systemId,
              name: supplier.name,
              typeId: 'NHACUNGCAP',
            }}
            defaultAmount={calculatedDebt < 0 ? Math.abs(calculatedDebt) : undefined}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiptDialogOpen(false)}>Hủy</Button>
            <Button onClick={() => receiptFormRef.current?.requestSubmit()}>Lưu phiếu thu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Create Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent mobileFullScreen className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo phiếu chi - {supplier.name}</DialogTitle>
          </DialogHeader>
          <PaymentForm
            ref={paymentFormRef}
            initialData={null}
            onSubmit={handlePaymentSubmit}
            defaultRecipient={{
              systemId: supplier.systemId,
              name: supplier.name,
              typeId: 'NHACUNGCAP',
            }}
            defaultAmount={calculatedDebt > 0 ? calculatedDebt : undefined}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Hủy</Button>
            <Button onClick={() => paymentFormRef.current?.requestSubmit()}>Lưu phiếu chi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-md:-mx-4 max-md:px-4 max-md:[&>*:not(:first-child)]:border-l max-md:[&>*:not(:first-child)]:border-l-border">
        {/* Tổng mua */}
        <Card className="max-md:rounded-none max-md:border-x-0 max-md:shadow-none">
          <CardContent className="p-3 text-center">
            <div className="text-xs text-muted-foreground">Tổng mua</div>
            <div className="text-sm font-bold mt-1 truncate" title={formatCurrency(supplierStats?.financial?.totalPurchases || 0)}>
              {formatCurrency(supplierStats?.financial?.totalPurchases || 0)}
            </div>
          </CardContent>
        </Card>

        {/* Đã thanh toán */}
        <Card className="max-md:rounded-none max-md:border-x-0 max-md:shadow-none">
          <CardContent className="p-3 text-center">
            <div className="text-xs text-muted-foreground">Đã trả</div>
            <div className="text-sm font-bold mt-1 text-green-600 truncate" title={formatCurrency(supplierStats?.financial?.totalPayments || 0)}>
              {formatCurrency(supplierStats?.financial?.totalPayments || 0)}
            </div>
          </CardContent>
        </Card>

        {/* Công nợ */}
        <Card className="max-md:rounded-none max-md:border-x-0 max-md:shadow-none">
          <CardContent className="p-3 text-center">
            <div className="text-xs text-muted-foreground">Công nợ</div>
            <div className={`text-sm font-bold mt-1 truncate ${(supplierStats?.financial?.debtBalance || 0) > 0 ? 'text-orange-600' : 'text-green-600'}`} title={formatCurrency(calculatedDebt)}>
              {formatCurrency(calculatedDebt)}
            </div>
          </CardContent>
        </Card>

        {/* Đơn hàng (desktop only) */}
        <Card className="hidden md:block">
          <CardContent className="p-3 text-center">
            <div className="text-xs text-muted-foreground">Đơn hàng</div>
            <div className="text-sm font-bold mt-1">{supplierStats?.purchaseOrders?.total || 0}</div>
          </CardContent>
        </Card>

        {/* Bảo hành (desktop only) */}
        <Card className="hidden md:block">
          <CardContent className="p-3 text-center">
            <div className="text-xs text-muted-foreground">Bảo hành</div>
            <div className="text-sm font-bold mt-1">{supplierStats?.warranties?.total || 0}</div>
          </CardContent>
        </Card>
      </div>

    <div className="space-y-4">
        <Card className={mobileBleedCardClass}>
        <CardContent className="pt-6">
            <dl>
                <DetailField label="Mã số thuế" value={supplier.taxCode} />
                <DetailField label="Số điện thoại" value={supplier.phone} />
                <DetailField label="Email" value={supplier.email} />
                <DetailField label="Địa chỉ">
                    {(() => {
                      const ad = supplier.addressData as Record<string, unknown> | null;
                      if (ad?.province) {
                        return (
                          <span>
                            {[ad.street, ad.ward, ad.district !== ad.ward ? ad.district : '', ad.province].filter(Boolean).join(', ')}
                          </span>
                        );
                      }
                      return <span>{supplier.address || '—'}</span>;
                    })()}
                </DetailField>
                <DetailField label="Website" value={supplier.website} />
                <DetailField label="Người phụ trách" value={supplier.accountManager} />
                <DetailField label="Công nợ hiện tại" value={formatCurrency(calculatedDebt)} />
                <DetailField label="Tổng số đơn đặt">
                    <span>
                        {supplierStats?.purchaseOrders?.ordered || 0} đặt hàng, {supplierStats?.purchaseOrders?.inProgress || 0} đang giao dịch, {supplierStats?.purchaseOrders?.completed || 0} hoàn thành, {supplierStats?.purchaseOrders?.cancelled || 0} đã hủy
                    </span>
                </DetailField>
                <DetailField label="Tổng SL đặt" value={(supplierStats?.products?.totalQuantityOrdered || 0).toLocaleString('vi-VN')} />
                <DetailField label="Tổng SL trả" value={(supplierStats?.products?.totalQuantityReturned || 0).toLocaleString('vi-VN')} />
                {supplierStats?.warranties && supplierStats.warranties.total > 0 && (
                  <>
                    <DetailField label="Bảo hành">
                      <span>{(supplierStats.warranties.sent || 0) + (supplierStats.warranties.confirmed || 0)} chưa trả, {supplierStats.warranties.completed || 0} đã trả</span>
                    </DetailField>
                    <DetailField label="Tổng SL SP BH">
                      <span>{(supplierStats.warranties.totalSentQty || 0).toLocaleString('vi-VN')} gửi đi / {(supplierStats.warranties.totalWarrantyProductQty || 0).toLocaleString('vi-VN')} được BH / {(supplierStats.warranties.totalNonWarrantyQty || 0).toLocaleString('vi-VN')} trả lại</span>
                    </DetailField>
                    {supplierStats.warranties.totalWarrantyDeduction > 0 && (
                      <DetailField label="Tổng tiền trừ BH">
                        <span>{(supplierStats.warranties.totalWarrantyProductQty || 0).toLocaleString('vi-VN')} SP — {formatCurrency(supplierStats.warranties.totalWarrantyDeduction)}</span>
                      </DetailField>
                    )}
                  </>
                )}
                <DetailField label="Lần đặt đơn gần nhất" value={supplierStats?.purchaseOrders?.lastOrderDate ? formatDate(supplierStats.purchaseOrders.lastOrderDate) : 'Chưa có'} />
                <DetailField label="Trạng thái">
                    <Badge variant={statusVariants[supplier.status]}>{supplier.status}</Badge>
                </DetailField>
            </dl>
        </CardContent>
        </Card>

        <Tabs defaultValue="purchase-history" onValueChange={handleTabChange}>
            <MobileTabsList>
                <MobileTabsTrigger value="purchase-history">
                  Lịch sử nhập hàng{purchaseOrdersResult.pagination.total > 0 ? ` (${purchaseOrdersResult.pagination.total})` : ''}
                </MobileTabsTrigger>
                <MobileTabsTrigger value="purchase-returns">
                  Đơn trả hàng{purchaseReturnsResult.pagination.total > 0 ? ` (${purchaseReturnsResult.pagination.total})` : ''}
                </MobileTabsTrigger>
                <MobileTabsTrigger value="products-ordered">
                  SP đã đặt{productsOrderedResult.pagination.total > 0 ? ` (${productsOrderedResult.pagination.total})` : ''}
                </MobileTabsTrigger>
                <MobileTabsTrigger value="products-returned">
                  SP trả lại{productsReturnedResult.pagination.total > 0 ? ` (${productsReturnedResult.pagination.total})` : ''}
                </MobileTabsTrigger>
                <MobileTabsTrigger value="debt">Công nợ</MobileTabsTrigger>
                <MobileTabsTrigger value="warranties">
                  Bảo hành{warrantiesResult.pagination.total > 0 ? ` (${warrantiesResult.pagination.total})` : ''}
                </MobileTabsTrigger>
                <MobileTabsTrigger value="warranty-products">
                  SP đã bảo hành{warrantyProductsResult.pagination.total > 0 ? ` (${warrantyProductsResult.pagination.total})` : ''}
                </MobileTabsTrigger>
            </MobileTabsList>
            <TabsContent value="purchase-history" className="mt-4">
                <Card className={mobileBleedCardClass}>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={supplierPurchaseOrders}
                            columns={purchaseOrderHistoryColumns}
                            searchKeys={['id', 'status']}
                            searchPlaceholder="Tìm theo mã đơn hàng..."
                            dateFilterColumn="orderDate"
                            dateFilterTitle="Ngày đặt"
                            exportFileName={`Lich_su_nhap_hang_${supplier.id}`}
                            onRowClick={(row) => router.push(`/purchase-orders/${row.systemId}`)}
                            serverPagination={{
                                page: purchaseOrdersResult.pagination.page,
                                pageSize: purchaseOrdersResult.pagination.pageSize,
                                totalItems: purchaseOrdersResult.pagination.total,
                                onPageChange: purchaseOrdersResult.setPage,
                                onPageSizeChange: purchaseOrdersResult.setPageSize,
                            }}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="debt" className="mt-4">
                <Card className={mobileBleedCardClass}>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={supplierDebtTransactions}
                            columns={debtColumns}
                            searchKeys={['documentId', 'description']}
                            searchPlaceholder="Tìm theo mã CT, diễn giải..."
                            dateFilterColumn="date"
                            dateFilterTitle="Ngày giao dịch"
                            exportFileName={`Cong_no_${supplier.id}`}
                            onRowClick={(row) => {
                                const route = getDebtRecordRoute(row.systemId);
                                if (route) router.push(route);
                            }}
                            serverPagination={{
                                page: debtTransactionsResult.pagination.page,
                                pageSize: debtTransactionsResult.pagination.pageSize,
                                totalItems: debtTransactionsResult.pagination.total,
                                onPageChange: debtTransactionsResult.setPage,
                                onPageSizeChange: debtTransactionsResult.setPageSize,
                            }}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="purchase-returns" className="mt-4">
                <Card className={mobileBleedCardClass}>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={supplierPurchaseReturns}
                            columns={purchaseReturnColumns}
                            searchKeys={['id', 'reason']}
                            searchPlaceholder="Tìm theo mã đơn, lý do..."
                            dateFilterColumn="returnDate"
                            dateFilterTitle="Ngày trả"
                            exportFileName={`Don_tra_hang_${supplier.id}`}
                            onRowClick={(row) => router.push(`/purchase-returns/${row.systemId}`)}
                            serverPagination={{
                                page: purchaseReturnsResult.pagination.page,
                                pageSize: purchaseReturnsResult.pagination.pageSize,
                                totalItems: purchaseReturnsResult.pagination.total,
                                onPageChange: purchaseReturnsResult.setPage,
                                onPageSizeChange: purchaseReturnsResult.setPageSize,
                            }}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="products-ordered" className="mt-4">
                <Card className={mobileBleedCardClass}>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={supplierProductsOrdered}
                            columns={productsOrderedColumns}
                            searchKeys={['productSku', 'productName']}
                            searchPlaceholder="Tìm theo SKU, tên sản phẩm..."
                            exportFileName={`San_pham_da_dat_${supplier.id}`}
                            serverPagination={{
                                page: productsOrderedResult.pagination.page,
                                pageSize: productsOrderedResult.pagination.pageSize,
                                totalItems: productsOrderedResult.pagination.total,
                                onPageChange: productsOrderedResult.setPage,
                                onPageSizeChange: productsOrderedResult.setPageSize,
                                search: productsOrderedResult.search,
                                onSearchChange: productsOrderedResult.setSearch,
                            }}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="products-returned" className="mt-4">
                <Card className={mobileBleedCardClass}>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={supplierProductsReturned}
                            columns={productsReturnedColumns}
                            searchKeys={['productSku', 'productName']}
                            searchPlaceholder="Tìm theo SKU, tên sản phẩm..."
                            exportFileName={`San_pham_tra_lai_${supplier.id}`}
                            serverPagination={{
                                page: productsReturnedResult.pagination.page,
                                pageSize: productsReturnedResult.pagination.pageSize,
                                totalItems: productsReturnedResult.pagination.total,
                                onPageChange: productsReturnedResult.setPage,
                                onPageSizeChange: productsReturnedResult.setPageSize,
                                search: productsReturnedResult.search,
                                onSearchChange: productsReturnedResult.setSearch,
                            }}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="warranties" className="mt-4">
                <Card className={mobileBleedCardClass}>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={supplierWarranties}
                            columns={warrantyColumns}
                            searchKeys={['id', 'reason']}
                            searchPlaceholder="Tìm theo mã BH, lý do..."
                            dateFilterColumn="createdAt"
                            dateFilterTitle="Ngày tạo"
                            exportFileName={`Bao_hanh_${supplier.id}`}
                            onRowClick={(row) => router.push(`/supplier-warranty/${row.systemId}`)}
                            serverPagination={{
                                page: warrantiesResult.pagination.page,
                                pageSize: warrantiesResult.pagination.pageSize,
                                totalItems: warrantiesResult.pagination.total,
                                onPageChange: warrantiesResult.setPage,
                                onPageSizeChange: warrantiesResult.setPageSize,
                                search: warrantiesResult.search,
                                onSearchChange: warrantiesResult.setSearch,
                            }}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="warranty-products" className="mt-4">
                <Card className={mobileBleedCardClass}>
                    <CardContent className="p-4">
                        <RelatedDataTable 
                            data={supplierWarrantyProducts}
                            columns={warrantyProductColumns}
                            searchKeys={['productSku', 'productName']}
                            searchPlaceholder="Tìm theo SKU, tên sản phẩm..."
                            exportFileName={`SP_bao_hanh_${supplier.id}`}
                            serverPagination={{
                                page: warrantyProductsResult.pagination.page,
                                pageSize: warrantyProductsResult.pagination.pageSize,
                                totalItems: warrantyProductsResult.pagination.total,
                                onPageChange: warrantyProductsResult.setPage,
                                onPageSizeChange: warrantyProductsResult.setPageSize,
                                search: warrantyProductsResult.search,
                                onSearchChange: warrantyProductsResult.setSearch,
                            }}
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
        <EntityActivityTable entityType="supplier" entityId={systemIdParam} />
    </div>
    </PullToRefresh>
  );
}


