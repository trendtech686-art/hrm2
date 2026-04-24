'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { formatDate } from '@/lib/date-utils';
import { useOrder } from '../hooks/use-orders';
import { useCustomerStats } from '@/features/customers/hooks/use-customer-stats';
import { useOrderActions } from '../hooks/use-order-actions';
import { useOrderMutations } from '../hooks/use-order-mutations';
import type { OrderDeliveryStatus, OrderAddress } from '@/lib/types/prisma-extended';
import { formatOrderAddress } from '../address-utils';
import { ORDER_STATUS_LABELS } from '@/lib/constants/order-enums';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Printer, Copy, ChevronDown, CheckCircle2, FileWarning, Package, Info, ArrowDownLeft, ArrowUpRight, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
// ✅ REMOVED: useAllEmployees + useEmployeeFinder — employee mentions now lazy-loaded via API
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DetailField } from '@/components/ui/detail-field';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';
import { Textarea } from '@/components/ui/textarea';
// ✅ PERFORMANCE: Removed useProductFinder - now using product data embedded in order lineItems
// ✅ PERFORMANCE: Removed useAllWarranties - now using order-specific hook
// ✅ PERFORMANCE: Removed useComplaints - now using order-specific hook
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { usePageHeader } from '@/contexts/page-header-context';
import { MemoizedPackagingInfo as PackagingInfo } from './packaging-info';
import { MemoizedPaymentInfo as PaymentInfo } from './payment-info';
import { MemoizedReceiptInfo as ReceiptInfo } from './receipt-info';
import type { OrderFormValues } from './order-form-page';

// Dynamic imports for dialogs (code-splitting)
const CancelShipmentDialog = dynamic(() => import('./cancel-shipment-dialog').then(mod => ({ default: mod.CancelShipmentDialog })), { ssr: false });
const CancelPackagingDialog = dynamic(() => import('./cancel-packaging-dialog').then(mod => ({ default: mod.CancelPackagingDialog })), { ssr: false });
const DeliveryFailureDialog = dynamic(() => import('./delivery-failure-dialog').then(mod => ({ default: mod.DeliveryFailureDialog })), { ssr: false });

import { ShippingTrackingTab } from './shipping-tracking-tab';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
// ✅ PERFORMANCE: Removed useAllSalesReturns - now using order-specific hook
// ✅ PERFORMANCE: Replaced useAllReceipts/useAllPayments with order-specific hooks
import { 
  useOrderReceipts, useOrderPayments, 
  useSalesReturnReceipts, useSalesReturnPayments, 
  useOrderSalesReturns,
  useOrderWarranties 
} from '../hooks/use-order-financial-data';
import { useAuth } from '@/contexts/auth-context';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { OrderWorkflowCard } from './order-workflow-card';
import { getWorkflowTemplates } from '@/features/settings/printer/workflow-templates-page';
import { Comments } from '@/components/Comments';
import { useComments } from '@/hooks/use-comments';
import { useProductTypeFinder } from '@/features/settings/inventory/hooks/use-all-product-types';
import { OrderPrintButton } from './order-print-button';
import { ShareButton } from '@/components/shared/share-button';
import { useOrderPrintHandlers } from '@/features/orders/hooks/use-order-print-handlers';

// ✅ Import extracted components from detail folder
import { logError } from '@/lib/logger'
import { 
    StatusStepper,
    ProductInfoCard,
    ReturnHistoryTab,
    formatCurrency,
    formatNumber,
    getCustomerAddress,
    statusVariants,
    productTypeFallbackLabels,
    type PaymentFormValues,
} from '../detail';

// Dynamic imports for dialogs from detail folder (code-splitting)
const PaymentDialog = dynamic(() => import('../detail').then(mod => ({ default: mod.PaymentDialog })), { ssr: false });
const CreateShipmentDialog = dynamic(() => import('../detail').then(mod => ({ default: mod.CreateShipmentDialog })), { ssr: false });
const PackerSelectionDialog = dynamic(() => import('../detail').then(mod => ({ default: mod.PackerSelectionDialog })), { ssr: false });

// ✅ Helper to format address object or string (kept inline as it depends on formatOrderAddress)
const formatAddressObject = (address: OrderAddress | string | null | undefined): string => formatOrderAddress(address);

// Removed inline components: StatusStepper, statusVariants, productTypeFallbackLabels, OrderComment 
// Now imported from '../detail/'

// Removed inline components: PaymentFormValues, PaymentDialog
// Now imported from '../detail/'

// Removed inline components: CreateShipmentDialog, PackerSelectionDialog
// Now imported from '../detail/'

// Removed inline components: OrderHistoryTab
// Now imported from '../detail/'

// Removed inline components: ProductInfoCard, ReturnHistoryTab
// Now imported from '../detail/'


export function OrderDetailPage() {
    const params = useParams<{ systemId?: string; id?: string }>();
    const router = useRouter();
    
    // ✅ React Query for single order fetch
    const { data: orderFromQuery, isLoading } = useOrder(params.systemId);
    
    // ✅ Get customer systemId from order for fetching their stats
    const customerSystemIdFromOrder = orderFromQuery?.customerSystemId;
    
    // ✅ PERFORMANCE: Single stats API call replaces 3 fetchAllPages hooks
    // (useCustomerOrders + useCustomerReceipts + useCustomerPayments)
    const { data: customerStats, isLoaded: isStatsLoaded } = useCustomerStats(customerSystemIdFromOrder);
    
    // ✅ React Query for order actions
    const orderActions = useOrderActions({
        onSuccess: () => toast.success('Thao tác thành công'),
        onError: (err) => toast.error(err.message),
    });
    const { update: updateOrder } = useOrderMutations();
    const { employee: authEmployee, can, isAdmin, isAdminOrManager } = useAuth();
    const { isMobile } = useBreakpoint();
    
    const order = React.useMemo(() => {
        // ✅ Use React Query data directly
        if (params.systemId && orderFromQuery) {
            return orderFromQuery;
        }
        return null;
    }, [orderFromQuery, params.systemId]);
    
    // Map React Query actions to legacy action names for compatibility
    const cancelOrder = React.useCallback(
        (systemId: string, _employeeIdOrReason: string, cancelOptionsOrRestock?: { reason: string; restock: boolean } | boolean) => {
            // Handle both old signature (systemId, employeeId, cancelOptions) and new (systemId, reason, restock)
            const reason = typeof cancelOptionsOrRestock === 'object' ? cancelOptionsOrRestock.reason : (_employeeIdOrReason || 'Hủy đơn');
            const restockItems = typeof cancelOptionsOrRestock === 'object' ? cancelOptionsOrRestock.restock : (cancelOptionsOrRestock ?? false);
            return orderActions.cancel.mutate({ systemId, reason, restockItems });
        },
        [orderActions.cancel]
    );
    
    const addPaymentAsync = React.useCallback(
        (systemId: string, data: { amount: number; method: string }) =>
            orderActions.addPayment.mutateAsync({ systemId, amount: data.amount, paymentMethodId: data.method }),
        [orderActions.addPayment]
    );
    
    const requestPackaging = React.useCallback(
        (systemId: string, _employeeId?: string, assignedEmployeeId?: string) =>
            orderActions.requestPackaging.mutate({ systemId, assignedEmployeeId: assignedEmployeeId || _employeeId }),
        [orderActions.requestPackaging]
    );
    
    const confirmPackaging = React.useCallback(
        (systemId: string, packagingId: string) =>
            orderActions.confirmPacking.mutate({ 
                systemId, 
                packagingId,
                confirmingEmployeeId: authEmployee?.systemId,
                confirmingEmployeeName: authEmployee?.fullName,
            }),
        [orderActions.confirmPacking, authEmployee?.systemId, authEmployee?.fullName]
    );
    
    const cancelPackagingRequest = React.useCallback(
        (systemId: string, packagingId: string, _employeeId: string, reason: string) =>
            orderActions.cancelPacking.mutate({ systemId, packagingId, reason }),
        [orderActions.cancelPacking]
    );
    
    const processInStorePickup = React.useCallback(
        (systemId: string, packagingId: string) =>
            orderActions.selectInStorePickup.mutate({ systemId, packagingId }),
        [orderActions.selectInStorePickup]
    );
    
    const confirmInStorePickup = React.useCallback(
        (systemId: string, packagingId: string, _employeeId?: string) =>
            orderActions.confirmPickup.mutate({ systemId, packagingId }),
        [orderActions.confirmPickup]
    );
    
    const _confirmPartnerShipment = React.useCallback(
        async (systemId: string, packagingId?: string) => {
            try {
                await orderActions.requestShipment.mutateAsync({ systemId, provider: 'default', serviceType: 'standard', packagingId });
                return { success: true, message: 'Đã tạo đơn vận chuyển' };
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Không thể tạo đơn vận chuyển';
                return { success: false, message };
            }
        },
        [orderActions.requestShipment]
    );
    
    const dispatchFromWarehouse = React.useCallback(
        (systemId: string, packagingId: string, _employeeId?: string) =>
            orderActions.dispatch.mutate({ systemId, packagingId }),
        [orderActions.dispatch]
    );
    
    const completeDelivery = React.useCallback(
        (systemId: string, packagingId: string, _employeeId?: string) =>
            orderActions.complete.mutate({ systemId, packagingId }),
        [orderActions.complete]
    );
    
    const failDelivery = React.useCallback(
        (systemId: string, packagingId: string, reason: string) =>
            orderActions.fail.mutate({ systemId, packagingId, reason }),
        [orderActions.fail]
    );
    
    const cancelDelivery = React.useCallback(
        (systemId: string, packagingId: string, reason: string, restockItems: boolean) =>
            orderActions.cancelDelivery.mutate({ systemId, packagingId, reason, restockItems }),
        [orderActions.cancelDelivery]
    );
    
    const cancelDeliveryOnly = React.useCallback(
        (systemId: string, packagingId: string, reason: string) =>
            orderActions.cancelDelivery.mutate({ systemId, packagingId, reason, restockItems: false }),
        [orderActions.cancelDelivery]
    );
    
    const cancelGHTKShipment = React.useCallback(
        (systemId: string, packagingId: string, trackingCode: string) =>
            orderActions.cancelGhtk.mutateAsync({ systemId, packagingId, trackingCode }),
        [orderActions.cancelGhtk]
    );
    const { handlePrintProductLabels: sharedPrintProductLabels, handlePrintPayment, handlePrintReceipt, handlePrintOrder } = useOrderPrintHandlers();
    const { findById: findProductTypeById } = useProductTypeFinder();
    // ✅ PERFORMANCE: Use order-specific hooks instead of loading ALL data
    const { data: orderSalesReturns } = useOrderSalesReturns(order?.systemId);
    // ✅ PERFORMANCE: Pricing policy name + sales channel name come from order API (_pricingPolicyName, _salesChannelName)
    const { data: orderWarranties } = useOrderWarranties(order?.systemId);
    // ✅ Customer profile now comes from stats API (merged into single call)
    const customer = customerStats.customer;
    
    // ✅ PERFORMANCE: Use order-specific hooks instead of loading all receipts/payments
    const linkedSalesReturnId = order?.linkedSalesReturnSystemId;
    const { data: orderReceipts, isLoading: isOrderReceiptsLoading } = useOrderReceipts(order?.systemId);
    const { data: orderPayments, isLoading: isOrderPaymentsLoading } = useOrderPayments(order?.systemId);
    const { data: receiptsFromLinkedSalesReturn, isLoading: isLinkedReceiptsLoading } = useSalesReturnReceipts(linkedSalesReturnId);
    const { data: paymentsFromLinkedSalesReturn } = useSalesReturnPayments(linkedSalesReturnId);
    // ✅ PERFORMANCE: Customer debt now calculated server-side in stats API
    // Removed: useCustomerReceipts + useCustomerPayments (fetchAllPages)
    // ✅ REMOVED: useOrderComplaints — dead code, complaint counts come from customerStats
    
    const currentEmployeeSystemId: SystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
    // Check if current user can view financial info (cost, profit)
    const canViewFinancials = isAdminOrManager;
    const [isCopying, setIsCopying] = React.useState(false);

    // State for image preview in ReturnHistoryTab
    const [returnHistoryPreviewState, setReturnHistoryPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
        open: false,
        image: '',
        title: ''
    });
    const handlePreview = React.useCallback((image: string, title: string) => {
        setReturnHistoryPreviewState({ open: true, image, title });
    }, []);

    // ✅ PERFORMANCE: All customer stats come from server-side API (single call)
    // Replaces: useCustomerOrders + useCustomerReceipts + useCustomerPayments (3 fetchAllPages)
    const customerOrderStats = React.useMemo(() => {
        if (!customer) {
            return {
                totalSpent: order?.grandTotal || 0,
                totalOrders: order ? 1 : 0,
                lastOrderDate: order?.orderDate ?? null,
            };
        }
        // Use stats API when loaded (accurate server-side aggregation)
        // Fallback to customer DB fields while stats are loading
        return {
            totalSpent: isStatsLoaded ? customerStats.financial.totalSpent : (Number(customer.totalSpent) || 0),
            totalOrders: isStatsLoaded ? customerStats.orders.total : (customer.totalOrders ?? 0),
            lastOrderDate: customerStats.orders.lastOrderDate ?? customer.lastPurchaseDate ?? order?.orderDate ?? null,
        };
    }, [customer, customerStats, isStatsLoaded, order]);

    // ✅ PERFORMANCE: Debt calculated server-side in stats API
    const customerDebtBalance = React.useMemo(() => {
        if (!customer) return 0;
        // Stats API calculates debt from all transactions (accurate)
        // Fallback to DB currentDebt while loading
        return isStatsLoaded ? customerStats.financial.currentDebt : (Number(customer.currentDebt) || 0);
    }, [customer, customerStats, isStatsLoaded]);

    // ✅ PERFORMANCE: Warranty/complaint counts from stats API (server-side)
    const customerWarrantyCount = customerStats.warranties.total;
    const activeWarrantyCount = customerStats.warranties.active;
    const customerComplaintCount = customerStats.complaints.total;
    const activeComplaintCount = customerStats.complaints.active;

    // SLA removed - use comments instead
    const slaDisplay = React.useMemo(() => {
        return {
            title: 'Bình thường',
            detail: 'Xem bình luận để theo dõi',
            tone: 'secondary' as const,
        };
    }, []);

    // ✅ PERFORMANCE: Order breakdown from stats API (server-side counts)
    const orderBreakdown = React.useMemo(() => ({
        pending: customerStats.orders.pending,
        inProgress: customerStats.orders.inProgress,
        completed: customerStats.orders.completed,
        cancelled: customerStats.orders.cancelled,
    }), [customerStats.orders]);

    const customerMetrics = React.useMemo((): Array<{
        key: string;
        label: string;
        value: string;
        subValue?: string;
        badge?: { label: string; tone: 'warning' | 'destructive' };
        link?: string;
        tone?: 'destructive' | 'warning' | 'success' | 'secondary';
    }> => {
        const lastOrderDate = customerOrderStats.lastOrderDate;
        return [
            {
                key: 'orders',
                label: 'Tổng số đơn đặt',
                value: formatNumber(customerOrderStats.totalOrders),
                subValue: `${orderBreakdown.pending} đặt hàng, ${orderBreakdown.inProgress} đang giao dịch, ${orderBreakdown.completed} hoàn thành, ${orderBreakdown.cancelled} đã hủy`,
            },
            {
                key: 'warranty',
                label: 'Bảo hành (đã trả/tổng)',
                value: customerWarrantyCount > 0 ? `${customerWarrantyCount - activeWarrantyCount}/${customerWarrantyCount}` : '0',
                badge: activeWarrantyCount > 0 ? { label: `${activeWarrantyCount} chưa trả`, tone: 'warning' as const } : undefined,
                link: customer ? `/warranty?customer=${encodeURIComponent(customer.systemId)}` : undefined,
            },
            {
                key: 'complaints',
                label: 'Khiếu nại (đã xử lý/tổng)',
                value: customerComplaintCount > 0 ? `${customerComplaintCount - activeComplaintCount}/${customerComplaintCount}` : '0',
                badge: activeComplaintCount > 0 ? { label: `${activeComplaintCount} chưa xử lý`, tone: 'destructive' as const } : undefined,
                link: customer ? `/complaints?customer=${encodeURIComponent(customer.systemId)}` : undefined,
            },
            {
                key: 'last-order',
                label: 'Lần đặt đơn gần nhất',
                value: lastOrderDate ? formatDate(lastOrderDate) : '---',
            },
            {
                key: 'failed-delivery',
                label: 'Giao hàng thất bại',
                value: '0',
            },
            {
                key: 'sla',
                label: 'SLA',
                value: slaDisplay.title,
                subValue: slaDisplay.detail,
                tone: slaDisplay.tone,
            },
        ];
    }, [customerOrderStats.totalOrders, customerOrderStats.lastOrderDate, customer, orderBreakdown, customerWarrantyCount, customerComplaintCount, activeWarrantyCount, activeComplaintCount, slaDisplay]);

    const handleCopyOrder = React.useCallback(() => {
        if (!order || isCopying) {
            return;
        }

        setIsCopying(true);
        try {
            router.push(`/orders/new?copy=${order.systemId}`);
        } finally {
            // Component will unmount after navigation, but keep defensive reset to be safe when navigation fails
            setTimeout(() => setIsCopying(false), 300);
        }
    }, [order, isCopying, router]);

    // ✅ Customer group name resolved server-side in stats API
    // ✅ REMOVED: useCustomerGroups (replaced by stats API)
    // ✅ REMOVED: useCustomerTypes (dead code — _getTypeName was unused)
    // ✅ REMOVED: useCustomerSources (dead code — _getSourceName was unused)
    const customerGroupName = customerStats.customerGroupName;
    
    // ✅ PERFORMANCE: Sales channel name now comes from order API (_salesChannelName)

    const [isCancelAlertOpen, setIsCancelAlertOpen] = React.useState(false);
    const [cancelReasonText, setCancelReasonText] = React.useState('');
    const [restockItems, setRestockItems] = React.useState(true);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
    const [createShipmentState, setCreateShipmentState] = React.useState<{ packagingSystemId: SystemId } | null>(null);
    const [isPackerSelectionOpen, setIsPackerSelectionOpen] = React.useState(false);
    const [cancelPackagingState, setCancelPackagingState] = React.useState<{ packagingSystemId: SystemId } | null>(null);
    const [cancelShipmentState, setCancelShipmentState] = React.useState<{ packagingSystemId: SystemId; type: 'fail' | 'cancel' } | null>(null);
    const [hasOrderWorkflowTemplate, setHasOrderWorkflowTemplate] = React.useState(true);

    // Comments from database
    const { 
        comments: dbComments, 
        draft: commentDraft,
        addComment: dbAddComment, 
        deleteComment: dbDeleteComment 
    } = useComments('order', order?.systemId || '');

    const orderComments = React.useMemo(() => 
        dbComments.map(c => ({
            id: c.systemId,
            content: c.content,
            author: {
                systemId: asSystemId(c.createdBy || 'system'),
                name: c.createdByName || 'Hệ thống',
                avatar: undefined,
            },
            createdAt: new Date(c.createdAt),
            updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
            attachments: c.attachments,
        })), 
        [dbComments]
    );

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const templates = getWorkflowTemplates('orders');
            setHasOrderWorkflowTemplate(templates.length > 0);
        } catch (error) {
            logError('[OrderDetail] Failed to load workflow templates', error);
            setHasOrderWorkflowTemplate(true);
        }
    }, []);

    const resetCancelForm = React.useCallback(() => {
        setCancelReasonText('');
        setRestockItems(true);
    }, []);

    React.useEffect(() => {
        if (!isCancelAlertOpen) {
            resetCancelForm();
        }
    }, [isCancelAlertOpen, resetCancelForm]);

    const handleAddOrderComment = React.useCallback((content: string, attachments?: string[], _parentId?: string) => {
        if (!order) return;
        const trimmed = content.trim();
        if (!trimmed) return;
        dbAddComment(trimmed, attachments || []);
    }, [order, dbAddComment]);

    const handleUpdateOrderComment = React.useCallback((_commentId: string, _content: string) => {
    }, []);

    const handleDeleteOrderComment = React.useCallback((commentId: string) => {
        dbDeleteComment(commentId);
    }, [dbDeleteComment]);

    const commentCurrentUser = React.useMemo(() => {
        if (!authEmployee) return undefined;
        return {
            systemId: currentEmployeeSystemId,
            name: authEmployee.fullName || authEmployee.workEmail || 'Nhân viên',
            ...(authEmployee.avatarUrl ? { avatar: authEmployee.avatarUrl } : {}),
        };
    }, [authEmployee, currentEmployeeSystemId]);

    // ✅ PERFORMANCE: Lazy-load employee mentions on @ trigger (max 10 results)
    const fetchMentions = React.useCallback(async (query: string) => {
        const res = await fetch(`/api/employees?select=mentions&search=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        return res.json();
    }, []);

    // ✅ PERFORMANCE: orderSalesReturns is already filtered by order from hook
    const salesReturnsForOrder = orderSalesReturns;
    
    const totalReturnedValue = React.useMemo(() => 
        salesReturnsForOrder.reduce((sum, sr) => sum + sr.totalReturnValue, 0),
    [salesReturnsForOrder]);

    // Tính tổng số tiền đã hoàn cho khách từ các phiếu trả hàng
    const totalRefundedFromReturns = React.useMemo(() => 
        salesReturnsForOrder.reduce((sum, sr) => {
            const refundFromArray = (sr.refunds || []).reduce((s, r) => s + (r.amount || 0), 0);
            return sum + (refundFromArray || sr.refundAmount || 0);
        }, 0),
    [salesReturnsForOrder]);

    // ✅ PERFORMANCE: refundPaymentsForOrder now comes from useOrderPayments hook
    // ✅ IMPORTANT: Exclude Payment vouchers already represented as OrderPayment records
    // When warranty order_deduction is processed, both an OrderPayment and Payment voucher
    // are created with the same business ID — avoid showing both.
    const orderPaymentIds = React.useMemo(() => {
        if (!order?.payments) return new Set<string>();
        return new Set(order.payments.map(p => p.id));
    }, [order?.payments]);

    const refundPaymentsForOrder = React.useMemo(() => {
        return orderPayments.filter(p => p.status !== 'cancelled' && !orderPaymentIds.has(p.id));
    }, [orderPayments, orderPaymentIds]);

    // ✅ Lấy các phiếu chi từ sales return (cho đơn đổi hàng)
    // ✅ PERFORMANCE: paymentsFromLinkedSalesReturn now comes directly from useSalesReturnPayments hook
    // No need for client-side filtering from allPayments
    const paymentsFromLinkedSalesReturnFiltered = React.useMemo(() => {
        return paymentsFromLinkedSalesReturn.filter(p => p.status !== 'cancelled');
    }, [paymentsFromLinkedSalesReturn]);

    // ✅ IMPORTANT: Loại trừ các receipts đã được liên kết với OrderPayment để tránh tính 2 lần
    const linkedReceiptSystemIds = React.useMemo(() => {
        if (!order?.payments) return new Set<string>();
        return new Set(
            order.payments
                .filter(p => p.linkedReceiptSystemId)
                .map(p => p.linkedReceiptSystemId as string)
        );
    }, [order?.payments]);

    // ✅ FIX: Also exclude receipts already linked via OrderPayment to avoid duplicate display
    const receiptsFromLinkedSalesReturnFiltered = React.useMemo(() => {
        return receiptsFromLinkedSalesReturn.filter(r => r.status !== 'cancelled' && !linkedReceiptSystemIds.has(r.systemId));
    }, [receiptsFromLinkedSalesReturn, linkedReceiptSystemIds]);

    // ✅ Tạo Set để loại trừ receipts đã hiển thị trong receiptsFromLinkedSalesReturn
    const receiptsFromLinkedSalesReturnIds = React.useMemo(() => {
        return new Set(receiptsFromLinkedSalesReturnFiltered.map(r => r.systemId));
    }, [receiptsFromLinkedSalesReturnFiltered]);

    // ✅ Lấy các phiếu thu liên quan đến đơn hàng này
    // Chỉ lấy phiếu thu có linkedOrderSystemId === order.systemId (link trực tiếp)
    // KHÔNG lấy phiếu thu từ salesReturns vì chúng có thể thuộc về đơn đổi hàng (exchangeOrder)

    // ✅ PERFORMANCE: receiptsFromReturns now uses orderReceipts from useOrderReceipts hook
    const receiptsFromReturns = React.useMemo(() => {
        if (!order) return [];
        return orderReceipts.filter(r => 
            r.status !== 'cancelled' &&
            // ✅ Loại trừ receipts đã được tính trong order.payments (qua linkedReceiptSystemId)
            !linkedReceiptSystemIds.has(r.systemId) &&
            // ✅ Loại trừ receipts đã hiển thị trong receiptsFromLinkedSalesReturn (tránh duplicate)
            !receiptsFromLinkedSalesReturnIds.has(r.systemId)
        );
    }, [order, orderReceipts, linkedReceiptSystemIds, receiptsFromLinkedSalesReturnIds]);

    // ✅ Tổng tiền đã thu từ phiếu thu (đổi hàng)
    // ✅ Bao gồm cả receiptsFromReturns VÀ receiptsFromLinkedSalesReturn
    const totalPaidFromReceipts = React.useMemo(() => {
        const fromReturns = receiptsFromReturns.reduce((sum, r) => sum + (r.amount || 0), 0);
        const fromLinkedSalesReturn = receiptsFromLinkedSalesReturnFiltered.reduce((sum, r) => sum + (r.amount || 0), 0);
        return fromReturns + fromLinkedSalesReturn;
    }, [receiptsFromReturns, receiptsFromLinkedSalesReturnFiltered]);

    const totalPaid = React.useMemo(() => (order?.payments || []).reduce((sum, p) => sum + p.amount, 0), [order?.payments]);
    // totalPaid: số tiền khách đã thanh toán
    // totalRefundedFromReturns: số tiền đã hoàn lại cho khách (từ sales returns)
    // netGrandTotal: công nợ thực tế sau khi trừ hàng trả
    // For exchange orders: subtract linkedSalesReturnValue from grandTotal
    // For original orders with returns: subtract totalReturnedValue
    const linkedReturnValue = order?.linkedSalesReturnValue || 0;
    const netGrandTotal = Math.max(0, (order?.grandTotal || 0) - totalReturnedValue - linkedReturnValue);
    // amountRemaining = netGrandTotal - totalPaid - totalPaidFromReceipts + totalRefundedFromReturns
    // ✅ Trừ cả phiếu thu từ đổi hàng (receiptsFromReturns)
    const amountRemaining = netGrandTotal - totalPaid - totalPaidFromReceipts + totalRefundedFromReturns;

    const totalLineQuantity = React.useMemo(() => {
        if (!order) return 0;
        return order.lineItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [order]);

    const codPayments = React.useMemo(() => (order?.payments || []).filter(p => p.method === 'Đối soát COD'), [order?.payments]);
    const directPayments = React.useMemo(() => (order?.payments || []).filter(p => p.method !== 'Đối soát COD'), [order?.payments]);

    const totalActiveCod = React.useMemo(() => {
        if (!order?.packagings) return 0;
    
        return order.packagings.reduce((sum, pkg) => {
            const activeCodStatuses: OrderDeliveryStatus[] = ['Chờ lấy hàng', 'Đang giao hàng', 'Đã giao hàng'];
            if (pkg.status !== 'Hủy đóng gói' && pkg.reconciliationStatus !== 'Đã đối soát' && pkg.deliveryStatus && activeCodStatuses.includes(pkg.deliveryStatus)) {
                return sum + (pkg.codAmount || 0);
            }
            return sum;
        }, 0);
    }, [order]);
    
    const totalCodAmount = totalActiveCod + codPayments.reduce((s, p) => s + p.amount, 0);
    const payableAmount = Math.max(0, amountRemaining);

    // Helper: find product data from order lineItems (already embedded from API)
    const findProductInOrder = React.useCallback((productSystemId: string) => {
        if (!order) return undefined;
        const lineItem = order.lineItems.find(item => item.productSystemId === productSystemId);
        return lineItem?.product;
    }, [order]);

    const getProductTypeLabel = React.useCallback((productSystemId: string) => {
        const product = findProductInOrder(productSystemId);
        if (!product) return '---';

        if (product.productTypeSystemId) {
            const productType = findProductTypeById(product.productTypeSystemId);
            if (productType?.name) {
                return productType.name;
            }
        }

        if (product.type && productTypeFallbackLabels[product.type]) {
            return productTypeFallbackLabels[product.type];
        }

        return 'Hàng hóa';
    }, [findProductInOrder, findProductTypeById]);
    
    const { costOfGoods, profit, totalDiscount } = React.useMemo(() => {
        if (!order) return { costOfGoods: 0, profit: 0, totalDiscount: 0 };
        const cost = order.lineItems.reduce((sum, item) => {
            const product = findProductInOrder(item.productSystemId);
            return sum + ((product?.costPrice || 0) * item.quantity);
        }, 0);
        const discount = order.lineItems.reduce((sum, item) => {
            const lineGross = item.unitPrice * item.quantity;
            const discountAmount = item.discountType === 'percentage' ? lineGross * (item.discount / 100) : item.discount;
            return sum + (discountAmount * item.quantity);
        }, 0);
        const profit = order.subtotal - cost;
        return { costOfGoods: cost, profit: profit, totalDiscount: discount };
    }, [order, findProductInOrder]);
    
    // ✅ Support both Vietnamese labels (from unified API) and English enums
    const orderStatusStr = (order?.status || '') as string;
    const isCancelledStatus = orderStatusStr === 'Đã hủy' || orderStatusStr === 'CANCELLED';
    const isCompletedStatus = orderStatusStr === 'Hoàn thành' || orderStatusStr === 'COMPLETED';
    
    // ✅ FIX: Check if order has actually been through the workflow
    // Allow actions if status is COMPLETED but workflow isn't actually complete
    // (e.g., packaging still pending, no stock out)
    const hasActuallyCompleted = isCompletedStatus && (
        order?.dispatchedDate || 
        order?.deliveryStatus === 'Đã giao hàng' || 
        order?.deliveryStatus === 'DELIVERED' ||
        order?.stockOutStatus === 'Xuất kho toàn bộ' ||
        order?.stockOutStatus === 'FULLY_STOCKED_OUT'
    );
    
    const isActionable = !isCancelledStatus && (!isCompletedStatus || !hasActuallyCompleted);

    const activePackaging = React.useMemo(() => {
        if (!order || !order.packagings || order.packagings.length === 0) {
            return null;
        }
        return [...order.packagings].reverse().find(p => p.status !== 'Hủy đóng gói') || null;
    }, [order]);

    const existingPackerSystemId = React.useMemo<SystemId | undefined>(() => {
        if (!order) {
            return undefined;
        }

        const explicitPacker = order.assignedPackerSystemId || (order as { packerId?: string }).packerId;
        if (explicitPacker) {
            return asSystemId(explicitPacker);
        }

        if (activePackaging?.assignedEmployeeId) {
            return activePackaging.assignedEmployeeId;
        }

        const fallbackPackaging = [...(order.packagings ?? [])]
            .reverse()
            .find(pkg => pkg.assignedEmployeeId);

        return fallbackPackaging?.assignedEmployeeId;
    }, [order, activePackaging]);

    const handleConfirmCancel = async () => { 
        if (!order) return;
        const finalReason = cancelReasonText.trim();
        if (!finalReason) {
            toast.error('Vui lòng nhập lý do hủy đơn hàng.');
            return;
        }
        const cancelOptions = {
            reason: finalReason,
            restock: restockItems,
        };
        
        // Check if order has active GHTK shipment that needs to be cancelled
        // Must exclude already-cancelled packagings (status can be English enum or Vietnamese)
        const ghtkPackaging = order.packagings.find(p => 
            p.carrier === 'GHTK' && 
            p.trackingCode && 
            p.status !== 'Hủy đóng gói' && p.status !== 'CANCELLED' &&
            p.deliveryStatus !== 'Đã giao hàng' && p.deliveryStatus !== 'DELIVERED' &&
            p.deliveryStatus !== 'Đã hủy' && p.deliveryStatus !== 'CANCELLED'
        );
        
        if (ghtkPackaging && ghtkPackaging.trackingCode) {
            try {
                const result = await cancelGHTKShipment(
                    order.systemId, 
                    ghtkPackaging.systemId, 
                    ghtkPackaging.trackingCode
                );
                
                if (!result?.success) {
                    // GHTK cancel failed, show toast with action to continue
                    toast.error(
                        `Không thể hủy vận đơn GHTK: ${result?.message || 'Không rõ lỗi'}`,
                        {
                            description: 'Bạn có muốn tiếp tục hủy đơn hàng không?',
                            action: {
                                label: 'Tiếp tục',
                                onClick: () => {
                                    cancelOrder(order.systemId, currentEmployeeSystemId, cancelOptions);
                                    resetCancelForm();
                                    setIsCancelAlertOpen(false);
                                }
                            },
                            cancel: {
                                label: 'Hủy bỏ',
                                onClick: () => {
                                    setIsCancelAlertOpen(false);
                                }
                            }
                        }
                    );
                    return;
                }
            } catch (error: unknown) {
                logError('[Cancel Order] GHTK cancel error', error);
                toast.error(
                    `Lỗi khi hủy vận đơn GHTK: ${error instanceof Error ? error.message : 'Không rõ lỗi'}`,

                    {
                        description: 'Bạn có muốn tiếp tục hủy đơn hàng không?',
                        action: {
                            label: 'Tiếp tục',
                            onClick: () => {
                                cancelOrder(order.systemId, currentEmployeeSystemId, cancelOptions);
                                resetCancelForm();
                                setIsCancelAlertOpen(false);
                            }
                        },
                        cancel: {
                            label: 'Hủy bỏ',
                            onClick: () => {
                                setIsCancelAlertOpen(false);
                            }
                        }
                    }
                );
                return;
            }
        }
        
        // Proceed with order cancellation
        cancelOrder(order.systemId, currentEmployeeSystemId, cancelOptions); 
        resetCancelForm();
        setIsCancelAlertOpen(false); 
    };
    const handleAddPayment = async (paymentData: PaymentFormValues) => { 
        if (order) { 
            try {
                await addPaymentAsync(order.systemId, paymentData);
                setIsPaymentDialogOpen(false);
            } catch {
                // Error is handled by onError callback in useOrderActions
            }
        } else {
            logError('[handleAddPayment] No order found', null);
        }
    };
    const handleRequestPackaging = React.useCallback((assignedEmployeeId?: SystemId) => {
        if (order) {
            requestPackaging(order.systemId, assignedEmployeeId);
        }
    }, [order, requestPackaging]);
    const handleConfirmPackaging = React.useCallback((packagingSystemId: SystemId) => { if (order) { confirmPackaging(order.systemId, packagingSystemId); } }, [order, confirmPackaging]);
    const handleCancelPackagingSubmit = (reason: string) => { if (order && cancelPackagingState) { cancelPackagingRequest(order.systemId, cancelPackagingState.packagingSystemId, '', reason); setCancelPackagingState(null); }};
    const handleInStorePickup = React.useCallback((packagingSystemId: SystemId) => { if (order) { processInStorePickup(order.systemId, packagingSystemId); } }, [order, processInStorePickup]);
    const handleShippingSubmit = async (data: Partial<OrderFormValues>, packagingSystemId?: string): Promise<{ success: boolean; message?: string } | undefined> => { 
        const pkgId = packagingSystemId || activePackaging?.systemId;
        if (!order || !pkgId) { 
            return { success: false, message: 'Đơn hàng hoặc phiếu đóng gói không hợp lệ' }; 
        }
        
        // Extract GHTK data from form (set by ShippingIntegration after calling GHTK API)
        let trackingCode = data.trackingCode as string;
        let configuration = data.configuration as Record<string, unknown> | undefined;
        
        // If no trackingCode, try to create GHTK shipment using previewParams from window
        if (!trackingCode) {
            const previewParams = (window as unknown as Record<string, unknown>).__ghtkPreviewParams as Record<string, unknown> | undefined;
            if (!previewParams) {
                return { success: false, message: 'Vui lòng chọn dịch vụ vận chuyển và đợi tải phí trước' };
            }
            
            try {
                // Get GHTK credentials from shipping config (Setting table with key shipping_partners_config)
                const configRes = await fetch('/api/shipping-config');
                const shippingConfig = await configRes.json();
                const ghtkAccounts = shippingConfig?.partners?.GHTK?.accounts || [];
                
                // Find default or first active account
                const activeAccount = ghtkAccounts.find((a: { isDefault?: boolean; active?: boolean }) => a.isDefault && a.active) 
                                    || ghtkAccounts.find((a: { active?: boolean }) => a.active)
                                    || ghtkAccounts[0];
                
                const apiToken = activeAccount?.credentials?.apiToken;
                const partnerCode = activeAccount?.credentials?.partnerCode || 'trendtech';
                
                
                if (!apiToken) {
                    return { success: false, message: 'Chưa cấu hình API Token GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.' };
                }
                
                // Import and use GHTK service
                const { GHTKService } = await import('@/features/settings/shipping/integrations/ghtk-service');
                const ghtkService = new GHTKService(apiToken, partnerCode);
                
                const result = await ghtkService.createOrder(previewParams as never);
                
                if (!result.success || !result.order) {
                    return { success: false, message: result.message || 'Không thể tạo đơn GHTK' };
                }
                
                trackingCode = result.order.label;
                configuration = {
                    ghtkTrackingId: result.order.tracking_id,
                    ghtkEstimatedPickTime: result.order.estimated_pick_time,
                    ghtkEstimatedDeliverTime: result.order.estimated_deliver_time,
                    ghtkFee: result.order.fee, // ✅ Store actual fee from GHTK create-order response
                };
                
                toast.success('Đã tạo đơn GHTK', { description: `Mã vận đơn: ${trackingCode}` });
            } catch (error) {
                logError('[handleShippingSubmit] GHTK error', error);
                const message = error instanceof Error ? error.message : 'Lỗi khi tạo đơn GHTK';
                return { success: false, message };
            }
        }
        
        try {
            // Get previewParams for fallback values
            const storedPreviewParams = (window as unknown as Record<string, unknown>).__ghtkPreviewParams as Record<string, unknown> | undefined;
            
            
            // Cast data to access shipping-specific properties
            const shippingData = data as unknown as { dimensions?: string; service?: string; shippingFee?: number; weight?: number; codAmount?: number; payer?: string };
            
            // Call backend API to save GHTK shipment data to database
            await orderActions.createGhtk.mutateAsync({
                systemId: order.systemId,
                packagingId: pkgId,
                data: {
                    trackingCode,
                    trackingId: configuration?.ghtkTrackingId,
                    estimatedPickTime: configuration?.ghtkEstimatedPickTime,
                    estimatedDeliverTime: configuration?.ghtkEstimatedDeliverTime,
                    // ✅ Prioritize actual fee from GHTK create-order response, fallback to calculate-fee estimate
                    shippingFee: configuration?.ghtkFee || shippingData.shippingFee || storedPreviewParams?.fee,
                    weight: shippingData.weight || storedPreviewParams?.totalWeight,
                    dimensions: shippingData.dimensions,
                    codAmount: shippingData.codAmount ?? storedPreviewParams?.codAmount ?? storedPreviewParams?.pickMoney ?? 0,
                    payer: shippingData.payer || (storedPreviewParams?.isFreeship === 1 ? 'Người gửi' : 'Người nhận'),
                    service: shippingData.service || (window as unknown as Record<string, unknown>).__shippingServiceName as string | undefined,
                },
            });
            
            // Clear previewParams after success
            delete (window as unknown as Record<string, unknown>).__ghtkPreviewParams;
            
            return { success: true, message: 'Đã tạo đơn vận chuyển thành công' };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Không thể lưu đơn vận chuyển';
            return { success: false, message };
        }
    };
    
    const handleDispatch = React.useCallback((packagingSystemId: SystemId) => { 
        if (order) { 
            const pkg = order.packagings.find(p => p.systemId === packagingSystemId);
            if (pkg?.deliveryMethod === 'Nhận tại cửa hàng') {
                confirmInStorePickup(order.systemId, packagingSystemId);
            } else {
                dispatchFromWarehouse(order.systemId, packagingSystemId); 
            }
        } 
    }, [order, confirmInStorePickup, dispatchFromWarehouse]);

    const handleCompleteDelivery = React.useCallback((packagingSystemId: SystemId) => { if (order) { completeDelivery(order.systemId, packagingSystemId); }}, [order, completeDelivery]);
    const handleFailDeliverySubmit = (reason: string) => { if (order && cancelShipmentState) { failDelivery(order.systemId, cancelShipmentState.packagingSystemId, reason); setCancelShipmentState(null); }};
    
    // ✅ Hủy giao hàng trực tiếp - Dùng khi CHƯA xuất kho (không cần dialog xác nhận)
    const handleCancelDeliveryDirectly = React.useCallback(async (packagingSystemId: SystemId) => { 
        if (!order) return;
        
        const packaging = order.packagings.find(p => p.systemId === packagingSystemId);
        const trackingCode = packaging?.trackingCode;
        
        // Nếu có tracking code GHTK, gọi API hủy trước
        if (trackingCode && trackingCode.startsWith('S')) {
            try {
                const result = await cancelGHTKShipment(order.systemId, packagingSystemId, trackingCode);
                
                if (!result?.success) {
                    toast.error(`Lỗi khi hủy vận đơn GHTK: ${result?.message || 'Không rõ lỗi'}. Vui lòng hủy trên hệ thống đối tác.`);
                    return;
                }
            } catch (error: unknown) {
                toast.error(`Lỗi khi hủy vận đơn GHTK: ${error instanceof Error ? error.message : 'Không rõ lỗi'}. Vui lòng hủy trên hệ thống đối tác.`);
                return;
            }
        }
        
        // Chưa xuất kho nên chỉ cần hủy trạng thái, không cần restock
        cancelDeliveryOnly(order.systemId, packagingSystemId, 'Hủy giao hàng'); 
    }, [order, cancelGHTKShipment, cancelDeliveryOnly]);

    // ✅ Hủy giao hàng - KHÔNG trả hàng về kho (hàng bị thất tung/shipper giữ)
    const handleCancelDeliveryOnly = async () => { 
        if (order && cancelShipmentState) { 
            const packaging = order.packagings.find(p => p.systemId === cancelShipmentState.packagingSystemId);
            const trackingCode = packaging?.trackingCode;
            
            // Nếu có tracking code GHTK, gọi API hủy trước
            if (trackingCode && trackingCode.startsWith('S')) {
                try {
                    const result = await cancelGHTKShipment(order.systemId, cancelShipmentState.packagingSystemId, trackingCode);
                    
                    if (!result?.success) {
                        toast.error(`Lỗi khi hủy vận đơn GHTK: ${result?.message || 'Không rõ lỗi'}. Vui lòng hủy trên hệ thống đối tác.`);
                        setCancelShipmentState(null);
                        return;
                    }
                } catch (error: unknown) {
                    toast.error(`Lỗi khi hủy vận đơn GHTK: ${error instanceof Error ? error.message : 'Không rõ lỗi'}. Vui lòng hủy trên hệ thống đối tác.`);
                    setCancelShipmentState(null);
                    return;
                }
            }
            
            // ✅ Chỉ update trạng thái, KHÔNG trả hàng về kho
            cancelDeliveryOnly(order.systemId, cancelShipmentState.packagingSystemId, 'Hủy giao hàng'); 
            setCancelShipmentState(null); 
        }
    };
    
    // ✅ Hủy giao và nhận lại hàng - TRẢ hàng về kho (đã nhận lại từ shipper)
    const handleCancelDeliveryAndRestock = async () => { 
        if (order && cancelShipmentState) { 
            const packaging = order.packagings.find(p => p.systemId === cancelShipmentState.packagingSystemId);
            const trackingCode = packaging?.trackingCode;
            
            // Nếu có tracking code GHTK, gọi API hủy trước
            if (trackingCode && trackingCode.startsWith('S')) {
                try {
                    const result = await cancelGHTKShipment(order.systemId, cancelShipmentState.packagingSystemId, trackingCode);
                    
                    if (!result?.success) {
                        toast.error(`Lỗi khi hủy vận đơn GHTK: ${result?.message || 'Không rõ lỗi'}. Vui lòng hủy trên hệ thống đối tác.`);
                        setCancelShipmentState(null);
                        return;
                    }
                } catch (error: unknown) {
                    toast.error(`Lỗi khi hủy vận đơn GHTK: ${error instanceof Error ? error.message : 'Không rõ lỗi'}. Vui lòng hủy trên hệ thống đối tác.`);
                    setCancelShipmentState(null);
                    return;
                }
            }
            
            // ✅ Update trạng thái + TRẢ hàng về kho
            cancelDelivery(order.systemId, cancelShipmentState.packagingSystemId, "Hủy giao và nhận lại hàng", true); 
            setCancelShipmentState(null); 
        }
    };
    
    const handleCancelGHTKShipment = async (packagingSystemId: SystemId, trackingCode: string) => {
        if (!order) return;
        
        toast.info('Đang hủy vận đơn GHTK...', { description: 'Lưu ý: Chỉ có thể hủy khi đơn chưa được lấy hàng.' });
        
        try {
            const result = await cancelGHTKShipment(order.systemId, packagingSystemId, trackingCode);
            
            if (result?.success) {
                toast.success('Đã hủy vận đơn GHTK thành công!');
            } else {
                toast.error(`Lỗi: ${result?.message || 'Không thể hủy vận đơn'}`);
            }
        } catch (error: unknown) {
            toast.error(`Lỗi: ${error instanceof Error ? error.message : 'Không thể hủy vận đơn'}`);
        }
    };


    const handleRequestPackagingClick = React.useCallback(() => {
        if (existingPackerSystemId) {
            handleRequestPackaging(existingPackerSystemId);
            return;
        }
        setIsPackerSelectionOpen(true);
    }, [existingPackerSystemId, handleRequestPackaging, setIsPackerSelectionOpen]);

    const headerActions = React.useMemo(() => {
        if (!order) {
            return [];
        }

        // ✅ Chỉ cho phép trả hàng nếu đã xuất kho (FULLY_STOCKED_OUT hoặc PARTIALLY_STOCKED_OUT)
        const isDispatched = order.stockOutStatus === 'Xuất kho toàn bộ' || 
                             order.stockOutStatus === 'FULLY_STOCKED_OUT' ||
                             order.stockOutStatus === 'Xuất kho một phần' ||
                             order.stockOutStatus === 'PARTIALLY_STOCKED_OUT';
        
        const canReturn = order.status !== 'Đã hủy' && 
            order.status !== 'CANCELLED' &&
            order.returnStatus !== 'Trả hàng toàn bộ' &&
            isDispatched; // ✅ Must be dispatched to return

        // Packaging-level conditions
        const deliveryStatusStr = String(activePackaging?.deliveryStatus || '');
        const packagingStatusStr = String(activePackaging?.status || '');
        const isPacked = packagingStatusStr === 'Đã đóng gói' || packagingStatusStr === 'PACKED' || packagingStatusStr === 'COMPLETED';
        
        // Chọn hình thức giao: đã đóng gói nhưng chưa chọn delivery method
        const canSelectDelivery = isPacked && !activePackaging?.deliveryMethod;
        
        // Trạng thái giao hàng chi tiết
        const isPendingShip = deliveryStatusStr === 'Chờ lấy hàng' || deliveryStatusStr === 'PENDING_SHIP';
        const isShipping = deliveryStatusStr === 'Đang giao hàng' || deliveryStatusStr === 'SHIPPING';
        const isNotStockedOut = order.stockOutStatus === 'Chưa xuất kho' || order.stockOutStatus === 'NOT_STOCKED_OUT';
        
        // Xác nhận Xuất kho: PENDING_SHIP + chưa xuất kho
        const canDispatch = isPacked && isPendingShip && isNotStockedOut;
        
        // Đã giao hàng: đang giao (SHIPPING)
        const canCompleteDelivery = isShipping;
        
        // Hủy giao hàng: chờ lấy hàng hoặc đang giao
        const canCancelDelivery = isPendingShip || isShipping;

        const actions: React.ReactNode[] = [];

        // Hủy đóng gói: khi đã đóng gói nhưng chưa chọn delivery method
        if (canSelectDelivery && activePackaging) {
            actions.push(
                <Button
                    key="cancel-packaging"
                    variant="outline"
                    size="sm"
                    className="border-destructive text-destructive hover:bg-destructive/5"
                    onClick={() => setCancelPackagingState({ packagingSystemId: activePackaging.systemId })}
                >
                    Hủy đóng gói
                </Button>
            );
        }

        // Dropdown chọn hình thức giao hàng (khi đã đóng gói nhưng chưa chọn)
        if (canSelectDelivery && activePackaging) {
            actions.push(
                <DropdownMenu key="select-delivery">
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                            Giao hàng <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setCreateShipmentState({ packagingSystemId: activePackaging.systemId })}>Đẩy qua hãng vận chuyển</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleInStorePickup(activePackaging.systemId)}>Khách nhận tại cửa hàng</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        // Xác nhận Xuất kho (PENDING_SHIP + chưa xuất kho)
        if (canDispatch && activePackaging) {
            actions.push(
                <Button 
                    key="dispatch" 
                    size="sm" 
                    onClick={() => handleDispatch(activePackaging.systemId)}
                >
                    Xác nhận Xuất kho
                </Button>
            );
        }

        // Hủy giao hàng (PENDING_SHIP only — chưa đang giao)
        if (isPendingShip && canCancelDelivery && activePackaging) {
            actions.push(
                <Button
                    key="cancel-delivery"
                    variant="outline"
                    size="sm"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                        if (isNotStockedOut) {
                            handleCancelDeliveryDirectly(activePackaging.systemId);
                        } else {
                            setCancelShipmentState({ packagingSystemId: activePackaging.systemId, type: 'cancel' });
                        }
                    }}
                >
                    Hủy giao hàng
                </Button>
            );
        }

        // Hủy/Thất bại dropdown (SHIPPING — đang giao)
        if (isShipping && activePackaging) {
            actions.push(
                <DropdownMenu key="fail-delivery">
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/5 hover:text-destructive">
                            Hủy/Thất bại
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setCancelShipmentState({ packagingSystemId: activePackaging.systemId, type: 'fail' })}>Giao thất bại</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => {
                            if (isNotStockedOut) {
                                handleCancelDeliveryDirectly(activePackaging.systemId);
                            } else {
                                setCancelShipmentState({ packagingSystemId: activePackaging.systemId, type: 'cancel' });
                            }
                        }}>Hủy giao hàng</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }

        // Đã giao hàng (SHIPPING — đang giao)
        if (canCompleteDelivery && activePackaging) {
            actions.push(
                <Button 
                    key="complete-delivery" 
                    size="sm" 
                    onClick={() => handleCompleteDelivery(activePackaging.systemId)}
                >
                    Đã giao hàng
                </Button>
            );
        }

        if (canReturn) {
            actions.push(
                <Button
                    key="return"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/orders/${order.systemId}/return`)}
                >
                    Hoàn trả hàng
                </Button>
            );
        }

        // Cho phép hủy đơn nếu:
        // - Chưa hoàn thành (cả enum lẫn Vietnamese)
        // - Chưa hủy (cả enum lẫn Vietnamese)
        // - Chưa lưu trữ
        // - Chưa có phiếu trả hàng (nếu đã trả hàng thì không được hủy vì sẽ gây rối stock và công nợ)
        // 
        // Theo Sapo:
        // - Đặt hàng (PENDING/CONFIRMED) - có thể hủy
        // - Đang giao dịch (PROCESSING/PACKING/PACKED/SHIPPING/DELIVERED) - có thể hủy
        // - Đã hoàn thành (COMPLETED) - KHÔNG được hủy
        // - Đã lưu trữ (ARCHIVED) - KHÔNG được hủy (đã kết thúc)
        // - Đã hủy (CANCELLED) - đã hủy rồi
        const completedStatuses = ['Đã hoàn thành', 'Hoàn thành', 'COMPLETED'];
        const cancelledStatuses = ['Đã hủy', 'CANCELLED'];
        const archivedStatuses = ['Đã lưu trữ', 'ARCHIVED'];
        
        const isCompleted = completedStatuses.includes(order.status);
        const isCancelled = cancelledStatuses.includes(order.status);
        const isArchived = archivedStatuses.includes(order.status);
        // Chỉ ẩn nút hủy nếu đã có trả hàng (một phần hoặc toàn bộ)
        const hasReturns = order.returnStatus === 'Trả hàng một phần' || order.returnStatus === 'Trả hàng toàn bộ' 
            || order.returnStatus === 'PARTIAL_RETURN' || order.returnStatus === 'FULL_RETURN';
        
        const canCancelOrder = !isCompleted && !isCancelled && !isArchived && !hasReturns && (isAdmin || can('cancel_orders'));
        
        if (canCancelOrder) {
            actions.push(
                <Button
                    key="cancel"
                    variant="outline"
                    size="sm"
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setIsCancelAlertOpen(true)}
                >
                    Hủy đơn hàng
                </Button>
            );
        }

        if (order.status !== 'Đã hủy' && (isAdmin || can('edit_orders'))) {
            actions.push(
                <Button
                    key="edit"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/orders/${order.systemId}/edit`)}
                >
                    Sửa
                </Button>
            );
        }

        return actions;
    }, [order, router, setIsCancelAlertOpen, activePackaging, handleDispatch, handleCompleteDelivery, handleCancelDeliveryDirectly, handleInStorePickup, setCreateShipmentState, setCancelShipmentState, setCancelPackagingState, isAdmin, can]);

    // Mobile: gom tất cả actions vào 1 dropdown overflow menu
    const mobileHeaderActions = React.useMemo(() => {
        if (!order || !isMobile) return [];

        const deliveryStatusStr = String(activePackaging?.deliveryStatus || '');
        const packagingStatusStr = String(activePackaging?.status || '');
        const isPacked = packagingStatusStr === 'Đã đóng gói' || packagingStatusStr === 'PACKED' || packagingStatusStr === 'COMPLETED';
        const canSelectDelivery = isPacked && !activePackaging?.deliveryMethod;
        const isPendingShip = deliveryStatusStr === 'Chờ lấy hàng' || deliveryStatusStr === 'PENDING_SHIP';
        const isShipping = deliveryStatusStr === 'Đang giao hàng' || deliveryStatusStr === 'SHIPPING';
        const isNotStockedOut = order.stockOutStatus === 'Chưa xuất kho' || order.stockOutStatus === 'NOT_STOCKED_OUT';
        const canDispatch = isPacked && isPendingShip && isNotStockedOut;
        const canCompleteDelivery = isShipping;
        const canCancelDelivery = isPendingShip || isShipping;
        const isDispatched = order.stockOutStatus === 'Xuất kho toàn bộ' ||
                             order.stockOutStatus === 'FULLY_STOCKED_OUT' ||
                             order.stockOutStatus === 'Xuất kho một phần' ||
                             order.stockOutStatus === 'PARTIALLY_STOCKED_OUT';
        const canReturn = order.status !== 'Đã hủy' &&
            order.status !== 'CANCELLED' &&
            order.returnStatus !== 'Trả hàng toàn bộ' &&
            isDispatched;
        const completedStatuses = ['Đã hoàn thành', 'Hoàn thành', 'COMPLETED'];
        const cancelledStatuses = ['Đã hủy', 'CANCELLED'];
        const archivedStatuses = ['Đã lưu trữ', 'ARCHIVED'];
        const isCompleted = completedStatuses.includes(order.status);
        const isCancelled = cancelledStatuses.includes(order.status);
        const isArchived = archivedStatuses.includes(order.status);
        const hasReturns = order.returnStatus === 'Trả hàng một phần' || order.returnStatus === 'Trả hàng toàn bộ'
            || order.returnStatus === 'PARTIAL_RETURN' || order.returnStatus === 'FULL_RETURN';
        const canCancelOrder = !isCompleted && !isCancelled && !isArchived && !hasReturns && (isAdmin || can('cancel_orders'));
        const isInStorePickup = activePackaging?.deliveryMethod === 'Nhận tại cửa hàng' || activePackaging?.deliveryMethod === 'IN_STORE_PICKUP';
        const hasTrackingCode = !!activePackaging?.trackingCode;
        const isGHTKShipment = activePackaging?.carrier === 'GHTK' && hasTrackingCode;

        const menuItems: { label: string; onClick: () => void; destructive?: boolean }[] = [];

        // Print & Copy & Share
        menuItems.push({ label: 'In đơn hàng', onClick: () => handlePrintOrder(order) });
        menuItems.push({ label: 'Sao chép đơn', onClick: handleCopyOrder });
        menuItems.push({
            label: 'Chia sẻ',
            onClick: async () => {
                const title = `Đơn hàng ${order.id ?? order.systemId}`;
                const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
                if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
                    try {
                        await navigator.share({ title, text: `${title} — ${order.customer?.name ?? ''}`.trim(), url: shareUrl });
                        return;
                    } catch (err) {
                        if (err instanceof Error && err.name === 'AbortError') return;
                    }
                }
                try {
                    await navigator.clipboard?.writeText(shareUrl);
                    toast.success('Đã sao chép liên kết');
                } catch {
                    toast.error('Không thể sao chép liên kết');
                }
            },
        });

        // Workflow actions
        if (canSelectDelivery && activePackaging) {
            menuItems.push({ label: 'Hủy đóng gói', onClick: () => setCancelPackagingState({ packagingSystemId: activePackaging.systemId }), destructive: true });
            menuItems.push({ label: 'Đẩy qua hãng vận chuyển', onClick: () => setCreateShipmentState({ packagingSystemId: activePackaging.systemId }) });
            menuItems.push({ label: 'Khách nhận tại cửa hàng', onClick: () => handleInStorePickup(activePackaging.systemId) });
        }

        if (canDispatch && activePackaging) {
            menuItems.push({ label: 'Xác nhận Xuất kho', onClick: () => handleDispatch(activePackaging.systemId) });
        }

        if (isPendingShip && canCancelDelivery && activePackaging) {
            if (hasTrackingCode) {
                menuItems.push({
                    label: 'Hủy giao hàng',
                    onClick: () => {
                        if (isGHTKShipment) {
                            handleCancelGHTKShipment(activePackaging.systemId, activePackaging.trackingCode!);
                        } else if (isNotStockedOut) {
                            handleCancelDeliveryDirectly(activePackaging.systemId);
                        } else {
                            setCancelShipmentState({ packagingSystemId: activePackaging.systemId, type: 'cancel' });
                        }
                    },
                    destructive: true,
                });
            } else {
                menuItems.push({ label: 'Hủy đóng gói', onClick: () => setCancelPackagingState({ packagingSystemId: activePackaging.systemId }), destructive: true });
            }
        }

        if (isInStorePickup && (activePackaging?.deliveryStatus === 'Đã đóng gói' || activePackaging?.deliveryStatus === 'PACKED' || activePackaging?.status === 'Đã đóng gói' || activePackaging?.status === 'PACKED')) {
            if (!canSelectDelivery && activePackaging) {
                menuItems.push({ label: 'Hủy đóng gói', onClick: () => setCancelPackagingState({ packagingSystemId: activePackaging.systemId }), destructive: true });
            }
        }

        if (isShipping && activePackaging) {
            menuItems.push({ label: 'Giao thất bại', onClick: () => setCancelShipmentState({ packagingSystemId: activePackaging.systemId, type: 'fail' }), destructive: true });
            menuItems.push({
                label: 'Hủy giao hàng',
                onClick: () => {
                    if (isNotStockedOut) {
                        handleCancelDeliveryDirectly(activePackaging.systemId);
                    } else {
                        setCancelShipmentState({ packagingSystemId: activePackaging.systemId, type: 'cancel' });
                    }
                },
                destructive: true,
            });
        }

        if (canCompleteDelivery && activePackaging) {
            menuItems.push({ label: 'Đã giao hàng', onClick: () => handleCompleteDelivery(activePackaging.systemId) });
        }

        if (canReturn) {
            menuItems.push({ label: 'Hoàn trả hàng', onClick: () => router.push(`/orders/${order.systemId}/return`) });
        }

        if (canCancelOrder) {
            menuItems.push({ label: 'Hủy đơn hàng', onClick: () => setIsCancelAlertOpen(true), destructive: true });
        }

        if (order.status !== 'Đã hủy' && (isAdmin || can('edit_orders'))) {
            menuItems.push({ label: 'Sửa', onClick: () => router.push(`/orders/${order.systemId}/edit`) });
        }

        if (menuItems.length === 0) return [];

        return [
            <DropdownMenu key="mobile-overflow">
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {menuItems.map((item, idx) => (
                        <DropdownMenuItem
                            key={idx}
                            onSelect={item.onClick}
                            className={item.destructive ? 'text-destructive focus:text-destructive' : undefined}
                        >
                            {item.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        ];
    }, [order, isMobile, activePackaging, handleDispatch, handleCompleteDelivery, handleCancelDeliveryDirectly, handleInStorePickup, setCreateShipmentState, setCancelShipmentState, setCancelPackagingState, isAdmin, can, router, setIsCancelAlertOpen, handleCopyOrder, handlePrintOrder, handleCancelGHTKShipment]);

    // Get Vietnamese label for status (handles both enum values like 'PROCESSING' and legacy Vietnamese values)
    const getStatusLabel = React.useCallback((status: string | undefined) => {
        if (!status) return undefined;
        // If it's an enum value (uppercase), convert to Vietnamese
        if (ORDER_STATUS_LABELS[status]) {
            return ORDER_STATUS_LABELS[status];
        }
        // Otherwise, it's already Vietnamese
        return status;
    }, []);

    const displayStatus = React.useMemo(() => {
        if (!order) return undefined;
        
        // ✅ SAPO Standard: Main order status only has 5 values:
        // - Đặt hàng (Pending/Draft)
        // - Đang giao dịch (In Progress/Processing)
        // - Hoàn thành (Completed)
        // - Đã lưu trữ (Archived)
        // - Đã hủy (Cancelled)
        // Other statuses like PACKING, PACKED, SHIPPING are workflow statuses tracked separately
        
        const statusStr = order.status as string;
        const paymentStr = order.paymentStatus as string;
        const deliveryStr = (order.deliveryStatus || '') as string;
        const stockOutStr = (order.stockOutStatus || '') as string;
        
        // 1. Cancelled check
        if (statusStr === 'CANCELLED' || statusStr === 'Đã hủy') {
            return 'Đã hủy';
        }
        
        // 2. Archived check
        if (statusStr === 'ARCHIVED' || statusStr === 'Đã lưu trữ') {
            return 'Đã lưu trữ';
        }
        
        // 3. Completed check: Fully delivered + fully paid
        const hasBeenDelivered = deliveryStr === 'Đã giao hàng' || deliveryStr === 'DELIVERED';
        const hasBeenStockedOut = stockOutStr === 'Xuất kho toàn bộ' || stockOutStr === 'FULLY_STOCKED_OUT';
        const isFullyPaid = paymentStr === 'Đã thanh toán' || paymentStr === 'Thanh toán toàn bộ' || paymentStr === 'PAID';
        
        // If delivered AND fully paid → Hoàn thành
        // For in-store pickup: hasBeenStockedOut is enough
        if ((hasBeenDelivered || hasBeenStockedOut) && isFullyPaid) {
            return 'Hoàn thành';
        }
        
        // 4. Processing check: Any activity started → Đang giao dịch
        const hasPackagings = order.packagings && order.packagings.length > 0;
        const hasPayments = order.payments && order.payments.length > 0 && Number(order.paidAmount) > 0;
        const isInTransit = deliveryStr === 'Đang giao hàng' || deliveryStr === 'SHIPPING';
        const hasAnyActivity = hasPackagings || hasPayments || hasBeenStockedOut || hasBeenDelivered || isInTransit;
        
        if (hasAnyActivity) {
            return 'Đang giao dịch';
        }
        
        // 5. Default: Đặt hàng (awaiting processing)
        return 'Đặt hàng';
    }, [order]);

    // In tem phụ cho tất cả sản phẩm trong đơn hàng (mỗi đơn vị 1 tem)
    // In tem phụ cho tất cả sản phẩm trong đơn hàng - dùng chung hook
    const handlePrintProductLabels = React.useCallback(() => {
        if (!order) return;
        sharedPrintProductLabels(order);
    }, [order, sharedPrintProductLabels]);

    const headerBadge = React.useMemo(() => {
        if (!order || !displayStatus) {
            return undefined;
        }
        return (
            <div className="flex items-center gap-2">
                {!isMobile && (
                    <>
                        <OrderPrintButton
                            order={order}
                            onPrintProductLabels={handlePrintProductLabels}
                        />
                        <ShareButton
                            size="sm"
                            className="h-7"
                            title={`Đơn hàng ${order.id ?? order.systemId}`}
                            text={`Đơn hàng ${order.id ?? order.systemId} — ${order.customer?.name ?? ''}`.trim()}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7"
                            onClick={handleCopyOrder}
                            disabled={isCopying}
                        >
                            {isCopying ? (
                                <Spinner className="mr-2 h-4 w-4" />
                            ) : (
                                <Copy className="mr-2 h-4 w-4" />
                            )}
                            Sao chép
                        </Button>
                    </>
                )}
                <Badge variant={statusVariants[displayStatus]} className="uppercase tracking-wide">
                    {displayStatus}
                </Badge>
                {order.returnStatus === 'Trả hàng một phần' && (
                    <Badge variant="outline" className="border-warning/30 text-warning-foreground bg-warning/10">
                        Trả hàng một phần
                    </Badge>
                )}
                {order.returnStatus === 'Trả hàng toàn bộ' && (
                    <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10">
                        Trả hàng toàn bộ
                    </Badge>
                )}
            </div>
        );
    }, [order, displayStatus, handleCopyOrder, isCopying, handlePrintProductLabels, isMobile]);

    const breadcrumb = React.useMemo(() => ([
        { label: 'Trang chủ', href: '/', isCurrent: false },
        { label: 'Đơn hàng', href: '/orders', isCurrent: false },
        { label: order?.id ? `Đơn ${order.id}` : 'Chi tiết', href: order ? `/orders/${order.systemId}` : '/orders', isCurrent: true },
    ]), [order]);

    usePageHeader({ 
        title: order ? `Đơn hàng ${order.id}` : 'Chi tiết đơn hàng',
        breadcrumb,
        badge: headerBadge,
        actions: isMobile ? mobileHeaderActions : headerActions,
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Card className={mobileBleedCardClass}>
                    <CardContent className="pt-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-muted rounded w-1/3" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                        </div>
                    </CardContent>
                </Card>
                <Card className={mobileBleedCardClass}>
                    <CardContent className="pt-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-32 bg-muted rounded" />
                            <div className="h-32 bg-muted rounded" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Không tìm thấy đơn hàng.</h2>
                    <Button onClick={() => router.push('/orders')} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay về danh sách đơn hàng
                    </Button>
                </div>
            </div>
        );
    }
    
    // ✅ Ưu tiên địa chỉ đã lưu trong đơn hàng, fallback về địa chỉ mặc định của khách hàng
    const shippingAddress = formatAddressObject(order.shippingAddress) || (customer ? getCustomerAddress(customer, 'shipping') : '');
    const billingAddress = formatAddressObject(order.billingAddress) || (customer ? getCustomerAddress(customer, 'billing') : '');
    const _isBillingSameAsShipping = shippingAddress === billingAddress || !billingAddress;


    const renderMainPackagingActionButtons = () => {
        if (!isActionable) return null;
    
        // ✅ Cast to string for comparison
        const deliveryStatusStr = String(activePackaging?.deliveryStatus || '');
        const canRequestPackaging = !activePackaging || deliveryStatusStr === 'Chờ giao lại' || deliveryStatusStr === 'FAILED_DELIVERY';
        
        // ✅ Only show "Yêu cầu đóng gói" in card header 
        // "Xác nhận đóng gói" is already shown inside PackagingInfo component
        if (canRequestPackaging) {
            return <Button size="sm" onClick={handleRequestPackagingClick}>Yêu cầu đóng gói</Button>;
        }
        
        return null;
    };
    
    return (
        <>
            <div className="space-y-4 md:space-y-6">
                {/* Status Card - Full width */}
                <Card className={mobileBleedCardClass}>
                    <CardContent className="p-4">
                        <StatusStepper order={order} />
                    </CardContent>
                </Card>

                {/* Row 1: Thông tin khách hàng (40%) + Quy trình xử lý (30%) + Thông tin đơn hàng (30%) */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                    {/* Thông tin khách hàng - 40% width on desktop */}
                    <Card className={cn(mobileBleedCardClass, "lg:col-span-4 flex flex-col")}>
                        <CardHeader className="shrink-0">
                            <CardTitle>Thông tin khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-3">
                                {/* Tên và thông tin liên hệ */}
                                <div>
                                    <p className="font-semibold text-primary cursor-pointer hover:underline text-lg" onClick={() => customer?.systemId && router.push(`/customers/${customer.systemId}`)}>{order.customerName}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                        {customer?.phone && (
                                            <span className="font-medium text-foreground inline-flex items-center gap-1">
                                                {customer.phone}
                                                <Copy 
                                                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                                                    onClick={() => { navigator.clipboard.writeText(customer.phone); toast.success('Đã sao chép số điện thoại'); }}
                                                />
                                            </span>
                                        )}
                                        {customer?.email && (
                                            <span className="inline-flex items-center gap-1">
                                                {customer.email}
                                                <Copy 
                                                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                                                    onClick={() => { navigator.clipboard.writeText(customer.email!); toast.success('Đã sao chép email'); }}
                                                />
                                            </span>
                                        )}
                                        {customer?.taxCode && (
                                            <span className="inline-flex items-center gap-1">
                                                MST: {customer.taxCode}
                                                <Copy 
                                                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                                                    onClick={() => { navigator.clipboard.writeText(customer.taxCode!); toast.success('Đã sao chép mã số thuế'); }}
                                                />
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Địa chỉ giao hàng - 1 hàng */}
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Địa chỉ giao hàng</p>
                                    <div className="flex items-start gap-1">
                                        <p className="text-sm flex-1">{shippingAddress || 'Chưa có thông tin giao hàng'}</p>
                                        {shippingAddress && (
                                            <Copy 
                                                className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground shrink-0 mt-0.5" 
                                                onClick={() => { navigator.clipboard.writeText(shippingAddress); toast.success('Đã sao chép địa chỉ giao hàng'); }}
                                            />
                                        )}
                                    </div>
                                </div>
                                
                                {/* Thông tin xuất hóa đơn - shows invoiceInfo or fallback to billingAddress */}
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Thông tin xuất hóa đơn</p>
                                    {(() => {
                                        const info = (order as { invoiceInfo?: { company?: string; taxCode?: string; representative?: string; position?: string; address?: string; phone?: string; email?: string; bankName?: string; bankAccount?: string } }).invoiceInfo;
                                        if (info?.company) {
                                            const copyText = [
                                                info.company,
                                                info.taxCode ? `MST: ${info.taxCode}` : '',
                                                info.representative ? `Đại diện: ${info.representative}${info.position ? ` - ${info.position}` : ''}` : '',
                                                info.address ? `Địa chỉ: ${info.address}` : '',
                                                [info.phone, info.email].filter(Boolean).join(' • '),
                                                (info.bankName || info.bankAccount) ? `NH: ${[info.bankName, info.bankAccount].filter(Boolean).join(' - ')}` : '',
                                            ].filter(Boolean).join('\n');
                                            return (
                                                <div className="text-sm space-y-0.5">
                                                    <div className="flex items-start gap-1">
                                                        <p className="font-medium flex-1">{info.company}</p>
                                                        <Copy 
                                                            className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                                                            onClick={() => { navigator.clipboard.writeText(copyText); toast.success('Đã sao chép thông tin xuất hóa đơn'); }}
                                                        />
                                                    </div>
                                                    {info.taxCode && <p className="text-xs text-muted-foreground">MST: {info.taxCode}</p>}
                                                    {info.representative && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Đại diện: {info.representative}{info.position ? ` - ${info.position}` : ''}
                                                        </p>
                                                    )}
                                                    {info.address && <p className="text-xs text-muted-foreground">Địa chỉ: {info.address}</p>}
                                                    {(info.phone || info.email) && (
                                                        <p className="text-xs text-muted-foreground">{[info.phone, info.email].filter(Boolean).join(' • ')}</p>
                                                    )}
                                                    {(info.bankName || info.bankAccount) && (
                                                        <p className="text-xs text-muted-foreground">NH: {[info.bankName, info.bankAccount].filter(Boolean).join(' - ')}</p>
                                                    )}
                                                </div>
                                            );
                                        }
                                        // Fallback: show billing address
                                        return (
                                            <div className="flex items-start gap-1">
                                                <p className="text-sm flex-1">{billingAddress || '-'}</p>
                                                {billingAddress && (
                                                    <Copy 
                                                        className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground shrink-0 mt-0.5" 
                                                        onClick={() => { navigator.clipboard.writeText(billingAddress); toast.success('Đã sao chép địa chỉ hóa đơn'); }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                                
                                {/* Tags */}
                                {customer?.tags && customer.tags.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tags</p>
                                        <div className="flex flex-wrap gap-1">
                                            {customer.tags.map((tag, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs font-normal">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Thống kê khách hàng */}
                                <div className="text-sm space-y-1.5 border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nhóm KH:</span>
                                        <span className="font-medium">{customerGroupName || '---'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">NV phụ trách:</span>
                                        <span className="font-medium">{customer?.accountManagerName || '---'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Công nợ/Hạn mức:</span>
                                        <div className="text-right">
                                            <Link href={`/customers/${customer?.systemId}?tab=debt`} 
                                                className="font-medium text-destructive hover:underline cursor-pointer"
                                            >
                                                {formatCurrency(customerDebtBalance)}
                                            </Link>
                                            <span className="text-muted-foreground mx-1">/</span>
                                            <span className="font-medium">{formatCurrency(customer?.maxDebt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tổng chi tiêu:</span>
                                        <span className="font-medium">{formatCurrency(customerOrderStats.totalSpent)}</span>
                                    </div>
                                    <div className="border-t border-dashed my-2" />
                                    {customerMetrics.map(metric => {
                                        const toneClass = metric.tone === 'destructive'
                                            ? 'text-destructive'
                                            : metric.tone === 'warning'
                                                ? 'text-warning'
                                                : metric.tone === 'success'
                                                    ? 'text-success'
                                                    : metric.tone === 'secondary'
                                                        ? 'text-muted-foreground'
                                                        : 'text-foreground';
                                        const ValueContent = (
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className={cn('font-medium', toneClass, metric.link && 'hover:underline cursor-pointer')}>{metric.value}</span>
                                                {metric.badge && (
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(
                                                            'text-xs uppercase tracking-tight',
                                                            metric.badge.tone === 'destructive'
                                                                ? 'bg-destructive/10 text-destructive border-destructive/30'
                                                                : 'bg-warning/10 text-warning-foreground border-warning/30'
                                                        )}
                                                    >
                                                        {metric.badge.label}
                                                    </Badge>
                                                )}
                                            </div>
                                        );
                                        return (
                                            <div key={metric.key} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                                                <span className="text-muted-foreground">{metric.label}:</span>
                                                <div className="text-right space-y-0.5">
                                                    {metric.link ? (
                                                        <Link href={metric.link} className="block">
                                                            {ValueContent}
                                                        </Link>
                                                    ) : (
                                                        ValueContent
                                                    )}
                                                    {metric.subValue && (
                                                        <p className="text-xs text-muted-foreground">{metric.subValue}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quy trình xử lý - 30% width on desktop */}
                    <div className="lg:col-span-3 space-y-3">
                        {!hasOrderWorkflowTemplate && (
                            <Alert className="border-warning/30 bg-warning/10 text-warning-foreground">
                                <Info className="h-4 w-4 text-warning" />
                                <AlertTitle>Chưa cấu hình quy trình xử lý đơn hàng</AlertTitle>
                                <AlertDescription>
                                    Thiết lập quy trình mặc định tại{' '}
                                    <Link href="/settings/workflow-templates" className="font-semibold text-primary underline">
                                        Cài đặt &gt; Quy trình
                                    </Link>{' '}
                                    để đội vận hành có checklist thống nhất.
                                </AlertDescription>
                            </Alert>
                        )}
                        <OrderWorkflowCard 
                            order={order} 
                            onUpdateOrder={(systemId, updates) => {
                                updateOrder.mutate({ id: systemId, ...updates });
                            }} 
                        />
                    </div>

                    {/* Thông tin đơn hàng - 30% width on desktop */}
                    <Card className={cn(mobileBleedCardClass, "lg:col-span-3 flex flex-col h-full lg:h-auto")}>
                        <CardHeader className="shrink-0">
                            <CardTitle>Thông tin đơn hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 overflow-y-auto flex-1 max-h-100 lg:max-h-none"
                            style={{ 
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgb(203 213 225) transparent'
                            }}
                        >
                            <DetailField label="Chính sách giá" value={order._pricingPolicyName || 'Giá bán lẻ'} />
                            <DetailField label="Bán tại" value={order.branchName} />
                            <div className="flex">
                                <span className="text-muted-foreground min-w-35">Bán bởi:</span>
                                <Link href={`/employees/${order.salespersonSystemId}`} className="text-primary hover:underline font-medium">
                                    {order.salesperson}
                                </Link>
                            </div>
                            <DetailField label="Hẹn giao hàng" value={order.expectedDeliveryDate || '---'} />
                            <DetailField label="Nguồn" value={order._salesChannelName || order.source || '---'} />
                            <DetailField label="Kênh bán hàng" value="Khác" />
                            <DetailField label="Ngày bán" value={formatDate(order.orderDate || order.createdAt) || formatDate(new Date())} />
                            {order.expectedPaymentMethod && (
                                <DetailField label="Hình thức thanh toán" value={order.expectedPaymentMethod} />
                            )}
                            {order.referenceUrl && (
                                <div>
                                    <span className="text-muted-foreground">Link đơn hàng:</span>{' '}
                                    <a href={order.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-info hover:underline">
                                        {order.referenceUrl}
                                    </a>
                                </div>
                            )}
                            {order.externalReference && (
                                <DetailField label="Mã tham chiếu" value={order.externalReference} />
                            )}
                            {order.tags && order.tags.length > 0 && (
                                <div>
                                    <span className="text-muted-foreground">Tags:</span>{' '}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {order.tags.map((tag, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {order.serviceFees && order.serviceFees.length > 0 && (
                                <div>
                                    <span className="text-muted-foreground">Phí dịch vụ:</span>
                                    {order.serviceFees.map((fee) => (
                                        <div key={fee.id} className="ml-4 text-sm">
                                            {fee.name}: {fee.amount.toLocaleString()}đ
                                        </div>
                                    ))}
                                </div>
                            )}
                            {orderWarranties.length > 0 && (
                                <div>
                                    <span className="text-muted-foreground">Bảo hành:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {orderWarranties.map(w => (
                                            <Link key={w.systemId} href={`/warranty/${w.systemId}`} className="text-primary hover:underline font-medium text-sm">
                                                {w.id}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {order.notes && (
                                <div>
                                    <span className="text-muted-foreground">Ghi chú:</span>
                                    <p className="mt-1 text-sm whitespace-pre-wrap">{order.notes}</p>
                                </div>
                            )}
                            <Button 
                                variant="link" 
                                className="p-0 h-auto text-sm" 
                                onClick={() => {
                                    const historyTab = document.querySelector('[value="history"]');
                                    if (historyTab) {
                                        (historyTab as HTMLElement).click();
                                        setTimeout(() => {
                                            historyTab.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }, 100);
                                    }
                                }}
                            >
                                <Link href={`/customers/${customer?.systemId}`} className="hover:underline">
                                    Xem lịch sử đơn hàng
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Row 2: Đơn hàng chờ thanh toán - Full width */}
                <Card className={mobileBleedCardClass}>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                                {/* ✅ Check actual amountRemaining instead of paymentStatus */}
                                {amountRemaining <= 0 ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                ) : (
                                    <FileWarning className="h-5 w-5 text-amber-500 shrink-0" />
                                )}
                                <CardTitle>
                                    {/* ✅ Show correct payment status based on actual amount */}
                                    {amountRemaining <= 0 
                                        ? 'Đơn hàng Đã thanh toán'
                                        : amountRemaining >= netGrandTotal
                                            ? 'Đơn hàng chờ thanh toán' 
                                            : 'Đơn hàng Thanh toán một phần'}
                                </CardTitle>
                            </div>
                            {isActionable && payableAmount > 0 && (isAdmin || can('pay_orders')) && (
                                <Button size="sm" onClick={() => setIsPaymentDialogOpen(true)}>
                                    Thanh toán
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 gap-2 bg-muted/50 p-3 sm:p-4 rounded-md text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{totalReturnedValue > 0 ? 'Giá trị đơn gốc:' : 'Tổng tiền ĐH:'}</span>
                                <span className="font-medium">{formatCurrency(order.grandTotal)}</span>
                            </div>
                            {/* ✅ Show linkedSalesReturnValue for exchange orders with link to sales return */}
                            {order.linkedSalesReturnValue && order.linkedSalesReturnValue > 0 && (() => {
                                const linkedReturn = orderSalesReturns.find(sr => sr.systemId === order.linkedSalesReturnSystemId);
                                const displayId = linkedReturn?.id || order.sourceSalesReturnId || order.linkedSalesReturnSystemId;
                                return (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Khấu trừ từ phiếu trả{' '}
                                            {order.linkedSalesReturnSystemId ? (
                                                <Link href={`/sales-returns/${order.linkedSalesReturnSystemId}`} className="text-primary hover:underline">
                                                    {displayId}
                                                </Link>
                                            ) : null}
                                            :
                                        </span>
                                        <span className="font-medium text-green-600">-{formatCurrency(order.linkedSalesReturnValue)}</span>
                                    </div>
                                );
                            })()}
                            {/* ✅ Show refund payments from linked sales return inline */}
                            {paymentsFromLinkedSalesReturnFiltered.length > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Phiếu chi từ phiếu trả hàng{' '}
                                        {paymentsFromLinkedSalesReturnFiltered.map((payment, idx) => (
                                            <React.Fragment key={payment.systemId}>
                                                {idx > 0 && ', '}
                                                <Link href={`/payments/${payment.systemId}`} className="text-primary hover:underline">
                                                    {payment.id}
                                                </Link>
                                            </React.Fragment>
                                        ))}:
                                    </span>
                                    <span className="font-medium text-red-600">-{formatCurrency(paymentsFromLinkedSalesReturnFiltered.reduce((sum, p) => sum + (p.amount || 0), 0))}</span>
                                </div>
                            )}
                            {totalReturnedValue > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Giá trị hàng bị trả lại:</span>
                                    <span className="font-medium text-amber-600">-{formatCurrency(Math.max(0, totalReturnedValue))}</span>
                                </div>
                            )}
                            {totalReturnedValue > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground font-semibold">Công nợ thực tế:</span>
                                    <span className="font-semibold">{formatCurrency(netGrandTotal)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Đã trả:</span>
                                <span className="font-medium">{(totalPaid + totalPaidFromReceipts) > 0 ? formatCurrency(totalPaid + totalPaidFromReceipts) : '0'}</span>
                            </div>
                            {/* Itemize each payment */}
                            {directPayments.length > 0 && directPayments.map(p => {
                                const isWarranty = !!(p as { linkedWarrantySystemId?: string }).linkedWarrantySystemId;
                                const label = isWarranty ? 'Bảo hành' : (p.method || 'Thanh toán');
                                return (
                                    <div key={p.systemId} className="flex justify-between pl-4 text-xs">
                                        <span className="text-muted-foreground">
                                            ↳ {p.id} ({label})
                                        </span>
                                        <span className="font-medium">{formatCurrency(Math.abs(p.amount))}</span>
                                    </div>
                                );
                            })}
                            {receiptsFromReturns.length > 0 && receiptsFromReturns.map(r => (
                                <div key={r.systemId} className="flex justify-between pl-4 text-xs">
                                    <span className="text-muted-foreground">
                                        ↳ {r.id} (Phiếu thu)
                                    </span>
                                    <span className="font-medium">{formatCurrency(Math.abs(r.amount || 0))}</span>
                                </div>
                            ))}
                            {receiptsFromLinkedSalesReturnFiltered.length > 0 && receiptsFromLinkedSalesReturnFiltered.map(r => (
                                <div key={r.systemId} className="flex justify-between pl-4 text-xs">
                                    <span className="text-muted-foreground">
                                        ↳ {r.id} (Phiếu trả hàng)
                                    </span>
                                    <span className="font-medium">{formatCurrency(Math.abs(r.amount || 0))}</span>
                                </div>
                            ))}
                            {totalRefundedFromReturns > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Đã hoàn tiền (trả hàng):</span>
                                    <span className="font-medium text-green-600">-{formatCurrency(totalRefundedFromReturns)}</span>
                                </div>
                            )}
                            
                            {totalCodAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Thu hộ COD:</span>
                                    <span className="font-medium text-blue-600">
                                        {formatCurrency(totalCodAmount)}
                                    </span>
                                </div>
                            )}
                            
                            <div className="border-t my-1" />
                            
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-bold">Còn phải trả:</span>
                                <span className={cn(
                                    "font-bold text-lg",
                                    amountRemaining > 0 ? 'text-red-500' : amountRemaining < 0 ? 'text-green-600' : 'text-foreground'
                                )}>{amountRemaining >= 0 ? formatCurrency(amountRemaining) : formatCurrency(0)}</span>
                            </div>
                            {amountRemaining < 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span className="font-medium">Thừa tiền (cần hoàn thêm):</span>
                                    <span className="font-bold">{formatCurrency(Math.abs(amountRemaining))}</span>
                                </div>
                            )}
                        </div>

                        {/* Phiếu thu thanh toán trực tiếp */}
                        {directPayments.length > 0 && (
                            <div className="space-y-2 pt-2">
                                {[...directPayments].reverse().map((payment, index) => (
                                    <React.Fragment key={`direct-${payment.systemId}-${index}`}>
                                        <PaymentInfo payment={payment} order={order} />
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        {/* ✅ Phiếu thu từ phiếu trả hàng - hiển thị cùng UI với directPayments */}
                        {isLinkedReceiptsLoading && linkedSalesReturnId ? (
                            <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                                <span>Đang tải phiếu thu...</span>
                            </div>
                        ) : receiptsFromLinkedSalesReturnFiltered.length > 0 ? (
                            <div className="space-y-2 pt-2">
                                {[...receiptsFromLinkedSalesReturnFiltered].reverse().map((receipt, index) => (
                                    <React.Fragment key={`sr-receipt-${receipt.systemId}-${index}`}>
                                        <ReceiptInfo receipt={receipt} order={order} label="Phiếu trả hàng" linkedSalesReturnSystemId={order.linkedSalesReturnSystemId} />
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : null}
                        
                        {(totalActiveCod > 0 || codPayments.length > 0) && (
                            <div className="space-y-2 pt-2">
                                {codPayments.length > 0 && [...codPayments].reverse().map((payment, index) => (
                                    <React.Fragment key={`cod-${payment.systemId}-${index}`}>
                                        <PaymentInfo payment={payment} order={order} />
                                    </React.Fragment>
                                ))}

                                {totalActiveCod > 0 && (
                                    <div className="border rounded-md bg-background text-sm p-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Chờ đối soát</p>
                                            <p className="text-muted-foreground text-xs">Đối tác vận chuyển sẽ hoàn tiền sau khi đối soát</p>
                                        </div>
                                        <div className="font-semibold">{formatCurrency(totalActiveCod)}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Phiếu chi hoàn tiền từ trả hàng */}
                        {isOrderPaymentsLoading ? (
                            <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                                <span>Đang tải phiếu chi...</span>
                            </div>
                        ) : refundPaymentsForOrder.length > 0 ? (
                            <div className="space-y-2 pt-2 border-t">
                                <p className="text-sm font-medium text-muted-foreground pt-2">Phiếu chi hoàn tiền</p>
                                {[...refundPaymentsForOrder].reverse().map((refund, index) => (
                                    <div key={`refund-${refund.systemId}-${index}`} className="border rounded-md text-sm">
                                        <Collapsible>
                                            <CollapsibleTrigger asChild>
                                                <div className="w-full p-3 flex items-center justify-between hover:bg-muted/50 rounded-md transition-colors cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                                                    <Link href={`/payments/${refund.systemId}`} 
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        {refund.id}
                                                    </Link>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-muted-foreground">{formatDate(refund.date)}</span>
                                                    <span className="font-semibold text-green-600">-{formatCurrency(refund.amount)}</span>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-6 w-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePrintPayment(order, refund, customer);
                                                        }}
                                                        title="In phiếu"
                                                    >
                                                        <Printer className="h-4 w-4" />
                                                    </Button>
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="px-3 pb-3">
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2 border-t">
                                                    <div>
                                                        <span className="text-muted-foreground">Phương thức</span>
                                                        <p className="font-medium">{refund.paymentMethodName}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Người tạo</span>
                                                        <p className="font-medium">{(refund as unknown as Record<string, unknown>).createdByName as string || refund.createdBy}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-muted-foreground">Diễn giải</span>
                                                        <p className="font-medium">{refund.description}</p>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {/* Phiếu thu liên quan đến đơn hàng này (chênh lệch khách trả thêm) */}
                        {isOrderReceiptsLoading ? (
                            <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                                <span>Đang tải phiếu thu...</span>
                            </div>
                        ) : receiptsFromReturns.length > 0 ? (
                            <div className="space-y-2 pt-2 border-t">
                                <p className="text-sm font-medium text-muted-foreground pt-2">Phiếu thu chênh lệch</p>
                                {[...receiptsFromReturns].reverse().map((receipt, index) => (
                                    <div key={`receipt-${receipt.systemId}-${index}`} className="border rounded-md text-sm">
                                        <Collapsible>
                                            <CollapsibleTrigger asChild>
                                                <div className="w-full p-3 flex items-center justify-between hover:bg-muted/50 rounded-md transition-colors cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <ArrowUpRight className="h-4 w-4 text-blue-600" />
                                                    <Link href={`/receipts/${receipt.systemId}`} 
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        {receipt.id}
                                                    </Link>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-muted-foreground">{formatDate(receipt.date)}</span>
                                                    <span className="font-semibold text-blue-600">+{formatCurrency(receipt.amount)}</span>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-6 w-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePrintReceipt(order, receipt, customer);
                                                        }}
                                                        title="In phiếu"
                                                    >
                                                        <Printer className="h-4 w-4" />
                                                    </Button>
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="px-3 pb-3">
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2 border-t">
                                                    <div>
                                                        <span className="text-muted-foreground">Phương thức</span>
                                                        <p className="font-medium">{receipt.paymentMethodName}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Người tạo</span>
                                                        <p className="font-medium">{(receipt as unknown as Record<string, unknown>).createdByName as string || receipt.createdBy}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-muted-foreground">Diễn giải</span>
                                                        <p className="font-medium">{receipt.description}</p>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {/* ✅ Phiếu chi từ phiếu trả hàng liên quan (cho đơn đổi hàng) */}
                        {paymentsFromLinkedSalesReturnFiltered.length > 0 && (
                            <div className="space-y-2 pt-2 border-t">
                                <p className="text-sm font-medium text-muted-foreground pt-2">
                                    Phiếu chi từ phiếu trả hàng
                                </p>
                                {[...paymentsFromLinkedSalesReturnFiltered].reverse().map((payment, index) => (
                                    <div key={`sr-payment-${payment.systemId}-${index}`} className="border rounded-md text-sm">
                                        <div className="w-full p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ArrowDownLeft className="h-4 w-4 text-red-600" />
                                                <Link href={`/payments/${payment.systemId}`} 
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="font-medium text-primary hover:underline"
                                                >
                                                    {payment.id}
                                                </Link>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-muted-foreground">{formatDate(payment.date)}</span>
                                                <span className="font-semibold text-red-600">-{formatCurrency(payment.amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Row 3: Đóng gói và Giao hàng - Full width */}
                <Card className={mobileBleedCardClass}>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-muted-foreground shrink-0" />
                                <CardTitle>Đóng gói và Giao hàng</CardTitle>
                            </div>
                            {renderMainPackagingActionButtons()}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.packagings.length === 0 && (
                            <div className="flex min-h-[160px] items-center justify-center text-sm text-muted-foreground">
                                Chưa có yêu cầu đóng gói.
                            </div>
                        )}
                        {[...order.packagings]
                            .sort((a, b) => {
                                // Cancelled packagings go to bottom
                                const aCancelled = a.status === 'Hủy đóng gói' || a.deliveryStatus === 'Đã hủy';
                                const bCancelled = b.status === 'Hủy đóng gói' || b.deliveryStatus === 'Đã hủy';
                                if (aCancelled && !bCancelled) return 1;
                                if (!aCancelled && bCancelled) return -1;
                                // Otherwise, newer ones first
                                return new Date(b.requestDate || 0).getTime() - new Date(a.requestDate || 0).getTime();
                            })
                            .map(pkg => (
                            <React.Fragment key={pkg.systemId}>
                                <PackagingInfo
                                    order={order}
                                    packaging={pkg}
                                    isActionable={isActionable}
                                    onConfirmPackaging={() => handleConfirmPackaging(pkg.systemId)}
                                    onCancelPackaging={() => setCancelPackagingState({ packagingSystemId: pkg.systemId })}
                                    onDispatch={() => handleDispatch(pkg.systemId)}
                                    onCompleteDelivery={() => handleCompleteDelivery(pkg.systemId)}
                                    onOpenShipmentDialog={() => setCreateShipmentState({ packagingSystemId: pkg.systemId })}
                                    onFailDelivery={() => setCancelShipmentState({ packagingSystemId: pkg.systemId, type: 'fail'})}
                                    onCancelDelivery={() => {
                                        // Nếu chưa xuất kho → hủy luôn không cần xác nhận
                                        if (order.stockOutStatus === 'Chưa xuất kho') {
                                            handleCancelDeliveryDirectly(pkg.systemId);
                                        } else {
                                            // Đã xuất kho → cần hỏi có muốn nhận lại hàng không
                                            setCancelShipmentState({ packagingSystemId: pkg.systemId, type: 'cancel' });
                                        }
                                    }}
                                    onInStorePickup={() => handleInStorePickup(pkg.systemId)}
                                    onCancelGHTKShipment={pkg.trackingCode ? () => handleCancelGHTKShipment(pkg.systemId, pkg.trackingCode!) : undefined}
                                />
                            </React.Fragment>
                        ))}
                    </CardContent>
                </Card>

                {/* Product Info Card - Always visible */}
                <ProductInfoCard 
                    order={order} 
                    costOfGoods={costOfGoods} 
                    profit={profit} 
                    totalDiscount={totalDiscount} 
                    salesReturns={orderSalesReturns} 
                    getProductTypeLabel={getProductTypeLabel}
                    canViewFinancials={canViewFinancials}
                    paymentsFromLinkedSalesReturn={paymentsFromLinkedSalesReturnFiltered}
                />
                
                {/* Return History Card - Show only if there are returns */}
                {salesReturnsForOrder.length > 0 && (
                    <Card className={mobileBleedCardClass}>
                        <CardHeader>
                            <CardTitle>
                                Lịch sử trả hàng ({salesReturnsForOrder.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ReturnHistoryTab 
                                order={order} 
                                salesReturnsForOrder={salesReturnsForOrder}
                                getProductTypeLabel={getProductTypeLabel}
                                onPreview={handlePreview}
                            />
                        </CardContent>
                    </Card>
                )}

                <Comments
                    entityType="order"
                    entityId={order.systemId}
                    comments={orderComments}
                    onAddComment={handleAddOrderComment}
                    onUpdateComment={handleUpdateOrderComment}
                    onDeleteComment={handleDeleteOrderComment}
                    currentUser={commentCurrentUser}
                    title="Bình luận nội bộ"
                    placeholder="Nhập bình luận cho đơn hàng..."
                    fetchMentions={fetchMentions}
                    initialDraft={commentDraft}
                />
                
                {/* Order History & Notes */}
                <EntityActivityTable entityType="order" entityId={order.systemId} />

                {/* Shipping Tracking - Show if order has shipping partner delivery */}
                {order.packagings.some(p => p.deliveryMethod === 'Dịch vụ giao hàng' && p.status !== 'Hủy đóng gói') && (
                    <ShippingTrackingTab order={order} />
                )}
            </div>

            <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-center">Hủy đơn hàng</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            Hành động này không thể hoàn tác. Hệ thống sẽ tự động cập nhật tồn kho và công nợ.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-4">
                        {/* Warning for paid orders */}
                        {order && order.payments && order.payments.length > 0 && (
                            <div className="flex gap-2 rounded-md border border-warning/30 bg-warning/10 p-3">
                                <Info className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                                <p className="text-xs text-warning-foreground">
                                    Đơn hàng đã có thanh toán. Sau khi hủy, bạn cần tạo phiếu chi hoàn tiền thủ công nếu cần.
                                </p>
                            </div>
                        )}

                        {/* Reason */}
                        <div className="space-y-2">
                            <Label htmlFor="cancel-reason-textarea" className="text-sm font-medium">
                                Lý do hủy <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="cancel-reason-textarea"
                                value={cancelReasonText}
                                onChange={(event) => setCancelReasonText(event.target.value)}
                                placeholder="Nhập rõ lý do hủy để đội vận hành nắm được..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        {/* Stock info - depends on dispatch status */}
                        {order && (!order.stockOutStatus || order.stockOutStatus === 'NOT_STOCKED_OUT' || order.stockOutStatus === 'Chưa xuất kho') ? (
                            /* Not dispatched - just release committed */
                            <div className="flex gap-2 rounded-md border border-info/30 bg-info/10 p-3">
                                <Info className="h-4 w-4 text-info mt-0.5 shrink-0" />
                                <p className="text-xs text-info-foreground">
                                    Đơn chưa xuất kho — hệ thống sẽ giải phóng {totalLineQuantity} sản phẩm đang tạm giữ.
                                </p>
                            </div>
                        ) : (
                            /* Already dispatched - show restock option */
                            <div className="flex items-start gap-3 rounded-md border p-3">
                                <Checkbox
                                    id="cancel-restock-option"
                                    checked={restockItems}
                                    onCheckedChange={(checked) => setRestockItems(checked === true)}
                                    className="mt-0.5"
                                />
                                <div className="space-y-0.5">
                                    <Label htmlFor="cancel-restock-option" className="text-sm font-medium leading-none cursor-pointer">
                                        Hoàn kho {totalLineQuantity} sản phẩm
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Trả hàng về kho và cập nhật số liệu tồn kho.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel>Giữ đơn hàng</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmCancel}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hủy đơn hàng
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

             <PaymentDialog 
                isOpen={isPaymentDialogOpen}
                onOpenChange={setIsPaymentDialogOpen}
                onSubmit={handleAddPayment}
                amountDue={payableAmount}
                isSubmitting={orderActions.addPayment.isPending}
            />
            
            <CreateShipmentDialog
                isOpen={!!createShipmentState}
                onOpenChange={(open) => !open && setCreateShipmentState(null)}
                onSubmit={handleShippingSubmit}
                order={order}
                customer={customer ?? null}
                packagingSystemId={createShipmentState?.packagingSystemId}
            />

            {isPackerSelectionOpen && (
            <PackerSelectionDialog
                isOpen={isPackerSelectionOpen}
                onOpenChange={setIsPackerSelectionOpen}
                onSubmit={handleRequestPackaging}
                {...(existingPackerSystemId ? { existingPackerSystemId } : {})}
            />
            )}
            
            <CancelPackagingDialog
                isOpen={!!cancelPackagingState}
                onOpenChange={(open) => !open && setCancelPackagingState(null)}
                onConfirm={handleCancelPackagingSubmit}
            />

            {cancelShipmentState?.type === 'fail' && (
                <DeliveryFailureDialog
                    isOpen={true}
                    onOpenChange={(open) => !open && setCancelShipmentState(null)}
                    onConfirm={handleFailDeliverySubmit}
                />
            )}
            {cancelShipmentState?.type === 'cancel' && (
                <CancelShipmentDialog
                    isOpen={true}
                    onOpenChange={(open) => !open && setCancelShipmentState(null)}
                    onCancelShipment={handleCancelDeliveryOnly}
                    onCancelAndRestock={handleCancelDeliveryAndRestock}
                />
            )}

            {/* Image Preview Dialog for ReturnHistoryTab */}
            <ImagePreviewDialog 
                open={returnHistoryPreviewState.open} 
                onOpenChange={(open) => setReturnHistoryPreviewState(prev => ({ ...prev, open }))} 
                images={[returnHistoryPreviewState.image]} 
                title={returnHistoryPreviewState.title}
            />
        </>
    );
}
