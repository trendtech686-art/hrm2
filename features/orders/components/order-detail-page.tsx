'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { formatDate, formatDateTime } from '@/lib/date-utils';
import { useOrder, useOrders } from '../hooks/use-orders';
import { useOrderActions } from '../hooks/use-order-actions';
import { useOrderMutations } from '../hooks/use-order-mutations';
import type { OrderDeliveryStatus, OrderAddress } from '@/lib/types/prisma-extended';
import { formatOrderAddress } from '../address-utils';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAllCustomers } from '@/features/customers/hooks/use-all-customers';
import { useCustomerTypes, useCustomerGroups, useCustomerSources } from '@/features/settings/customers/hooks/use-customer-settings';
import { ArrowLeft, Printer, Copy, ChevronDown, CheckCircle2, FileWarning, Package, Info, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAllEmployees, useEmployeeFinder } from '@/features/employees/hooks/use-all-employees';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DetailField } from '@/components/ui/detail-field';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useProductFinder } from '@/features/products/hooks/use-all-products';
import { useAllWarranties } from '@/features/warranty/hooks/use-all-warranties';
import { useComplaints } from '@/features/complaints/hooks/use-complaints';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { usePageHeader } from '@/contexts/page-header-context';
import { PackagingInfo } from './packaging-info';
import { PaymentInfo } from './payment-info';

// Dynamic imports for dialogs (code-splitting)
const CancelShipmentDialog = dynamic(() => import('./cancel-shipment-dialog').then(mod => ({ default: mod.CancelShipmentDialog })), { ssr: false });
const CancelPackagingDialog = dynamic(() => import('./cancel-packaging-dialog').then(mod => ({ default: mod.CancelPackagingDialog })), { ssr: false });
const DeliveryFailureDialog = dynamic(() => import('./delivery-failure-dialog').then(mod => ({ default: mod.DeliveryFailureDialog })), { ssr: false });

import { ShippingTrackingTab } from './shipping-tracking-tab';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAllSalesReturns } from '@/features/sales-returns/hooks/use-all-sales-returns';
import { useAllReceipts } from '@/features/receipts/hooks/use-all-receipts';
import { useAllPayments } from '@/features/payments/hooks/use-all-payments';
import { PartnerShipmentForm as _PartnerShipmentForm } from './partner-shipment-form';
import { useAuth } from '@/contexts/auth-context';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { OrderWorkflowCard } from './order-workflow-card';
import { getWorkflowTemplates } from '@/features/settings/printer/workflow-templates-page';
import { Comments } from '@/components/Comments';
import { useComments } from '@/hooks/use-comments';
import { useProductTypeFinder } from '@/features/settings/inventory/hooks/use-all-product-types';
import { useAllPricingPolicies } from '@/features/settings/pricing/hooks/use-all-pricing-policies';
import { useCustomerSlaEvaluation } from '@/features/customers/sla/hooks';
import { OrderPrintButton } from './order-print-button';
import { useAllBranches, useBranchFinder } from '@/features/settings/branches/hooks/use-all-branches';
import { useBranding, getFullLogoUrl } from '@/hooks/use-branding';
import { mapPaymentToPrintData, PaymentForPrint } from '@/lib/print-mappers/payment.mapper';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import { usePrint } from '@/lib/use-print';
import { StoreSettings, numberToWords, formatTime } from '@/lib/print-service';

// ✅ Import extracted components from detail folder
import { 
    StatusStepper,
    OrderHistoryTab,
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

// _simpleHash kept for internal use if needed
function _simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

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
    
    // ✅ Fetch all orders for customer comparison
    const { data: ordersData } = useOrders({ limit: 10000 });
    const orders = React.useMemo(() => ordersData?.data ?? [], [ordersData?.data]);
    
    // ✅ React Query for order actions
    const orderActions = useOrderActions({
        onSuccess: () => toast.success('Thao tác thành công'),
        onError: (err) => toast.error(err.message),
    });
    const { update: updateOrder } = useOrderMutations();
    
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
    
    const addPayment = React.useCallback(
        (systemId: string, data: { amount: number; method: string }, _employeeId?: string) =>
            orderActions.addPayment.mutate({ systemId, amount: data.amount, paymentMethodId: data.method }),
        [orderActions.addPayment]
    );
    
    const requestPackaging = React.useCallback(
        (systemId: string, _employeeId?: string, assignedEmployeeId?: string) =>
            orderActions.requestPackaging.mutate({ systemId, assignedEmployeeId: assignedEmployeeId || _employeeId }),
        [orderActions.requestPackaging]
    );
    
    const confirmPackaging = React.useCallback(
        (systemId: string, packagingId: string, _employeeId?: string) =>
            orderActions.confirmPacking.mutate({ systemId, packagingId }),
        [orderActions.confirmPacking]
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
    
    const confirmPartnerShipment = React.useCallback(
        (systemId: string) =>
            orderActions.requestShipment.mutate({ systemId, provider: 'default', serviceType: 'standard' }),
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
            orderActions.cancelGhtk.mutate({ systemId, packagingId, trackingCode }),
        [orderActions.cancelGhtk]
    );
    const { findById: findProductById } = useProductFinder();
    const { findById: findProductTypeById } = useProductTypeFinder();
    const { data: allSalesReturns } = useAllSalesReturns();
    const { data: pricingPolicies } = useAllPricingPolicies();
    const defaultPricingPolicy = React.useMemo(
        () => (pricingPolicies ?? []).find(policy => policy.type === 'Bán hàng' && policy.isDefault),
        [pricingPolicies]
    );
    const { data: warranties } = useAllWarranties();
    const { data: allReceipts } = useAllReceipts();
    const { data: allPayments } = useAllPayments();
    const { data: queryData } = useComplaints({ limit: 1000 });
    const complaints = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
    const slaEngine = useCustomerSlaEvaluation();
    const { data: _branches } = useAllBranches();
    const { findById: findBranchById } = useBranchFinder();
    const { info: storeInfo } = useStoreInfoData();
    const { print } = usePrint();
    
    const { data: customers } = useAllCustomers();
    const customer = order ? customers.find(c => c.systemId === order.customerSystemId) : null;
    const orderBranch = order ? findBranchById?.(order.branchSystemId) : null;
    const { employee: authEmployee } = useAuth();
    const currentEmployeeSystemId: SystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
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

    const customerOrders = React.useMemo(() => {
        if (!customer) return [];
        return orders.filter(o => o.customerSystemId === customer.systemId);
    }, [customer, orders]);
    // Orders that create debt: status='Hoàn thành' OR deliveryStatus='Đã giao hàng' OR stockOutStatus='Xuất kho toàn bộ'
    const deliveredCustomerOrders = React.useMemo(
        () => customerOrders.filter(o => 
            o.status !== 'Đã hủy' &&
            (o.status === 'Hoàn thành' || 
             o.deliveryStatus === 'Đã giao hàng' || 
             o.stockOutStatus === 'Xuất kho toàn bộ')
        ),
        [customerOrders]
    );

    const customerOrderStats = React.useMemo(() => {
        if (!customer) {
            return {
                totalSpent: order?.grandTotal || 0,
                totalOrders: order ? 1 : 0,
                lastOrderDate: order?.orderDate ?? null,
            };
        }

        if (!customerOrders.length) {
            return {
                totalSpent: customer.totalSpent ?? 0,
                totalOrders: customer.totalOrders ?? 0,
                lastOrderDate: customer.lastPurchaseDate ?? order?.orderDate ?? null,
            };
        }

        let totalSpent = 0;
        let lastOrderDate: string | null = null;

        deliveredCustomerOrders.forEach(o => {
            totalSpent += o.grandTotal || 0;
        });

        const recencySource = deliveredCustomerOrders.length ? deliveredCustomerOrders : customerOrders;

        recencySource.forEach(o => {
            if (!lastOrderDate || new Date(o.orderDate).getTime() > new Date(lastOrderDate).getTime()) {
                lastOrderDate = o.orderDate;
            }
        });

        return {
            totalSpent,
            totalOrders: customerOrders.length,
            lastOrderDate: lastOrderDate ?? customer.lastPurchaseDate ?? order?.orderDate ?? null,
        };
    }, [customer, customerOrders, deliveredCustomerOrders, order]);

    const customerDebtBalance = React.useMemo(() => {
        if (!customer) return 0;

        const transactions: Array<{ date: string; change: number }> = [];

        deliveredCustomerOrders.forEach(o => {
            // ✅ Use grandTotal (không trừ paidAmount) vì phiếu thu đã được tính riêng
            transactions.push({ date: o.orderDate, change: o.grandTotal || 0 });
        });

        allReceipts
            .filter(r => r.payerTypeName === 'Khách hàng' && r.payerName === customer.name)
            .forEach(receipt => {
                transactions.push({ date: receipt.date, change: -receipt.amount });
            });

        allPayments
            .filter(p => p.recipientTypeName === 'Khách hàng' && p.recipientName === customer.name)
            .forEach(payment => {
                transactions.push({ date: payment.date, change: payment.amount });
            });

        if (!transactions.length) {
            return customer.currentDebt ?? 0;
        }

        transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let balance = 0;
        transactions.forEach(entry => {
            balance += entry.change;
        });

        return balance;
    }, [customer, deliveredCustomerOrders, allReceipts, allPayments]);

    const customerWarranties = React.useMemo(() => {
        if (!customer) return [];
        return warranties.filter(ticket => ticket.customerPhone === customer.phone);
    }, [customer, warranties]);

    const customerWarrantyCount = customerWarranties.length;

    const activeWarrantyCount = React.useMemo(() => {
        return customerWarranties.filter(ticket => !['returned', 'completed', 'cancelled'].includes(ticket.status)).length;
    }, [customerWarranties]);

    const customerComplaints = React.useMemo(() => {
        if (!customer) return [];
        return complaints.filter(complaint => complaint.customerSystemId === customer.systemId);
    }, [customer, complaints]);

    const customerComplaintCount = customerComplaints.length;

    const activeComplaintCount = React.useMemo(() => {
        return customerComplaints.filter(complaint => complaint.status === 'pending' || complaint.status === 'investigating').length;
    }, [customerComplaints]);

    const slaDisplay = React.useMemo(() => {
        if (!customer) {
            return {
                title: 'Đúng hạn',
                detail: 'Chưa có dữ liệu SLA',
                tone: 'secondary' as const,
            };
        }

        const entry = slaEngine.index?.entries?.[customer.systemId];
        const alerts = entry?.alerts ?? [];
        if (!alerts.length) {
            return {
                title: 'Đúng hạn',
                detail: 'Không có cảnh báo',
                tone: 'success' as const,
            };
        }

        const sortedAlerts = [...alerts].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
        const nextAlert = sortedAlerts[0];
        const remaining = nextAlert.daysRemaining;
        const timeText = remaining === 0
            ? 'Hôm nay'
            : remaining > 0
                ? `Còn ${remaining} ngày`
                : `Trễ ${Math.abs(remaining)} ngày`;
        const tone = remaining < 0
            ? 'destructive'
            : nextAlert.alertLevel === 'warning'
                ? 'warning'
                : 'secondary';

        return {
            title: nextAlert.slaName,
            detail: `${timeText}${nextAlert.targetDate ? ` • hạn ${formatDate(nextAlert.targetDate)}` : ''}`,
            tone,
        } as const;
    }, [customer, slaEngine.index]);

    // Order breakdown by status
    const orderBreakdown = React.useMemo(() => {
        const pending = customerOrders.filter(o => o.status === 'Đặt hàng').length;
        const inProgress = customerOrders.filter(o => o.status === 'Đang giao dịch').length;
        const completed = customerOrders.filter(o => o.status === 'Hoàn thành').length;
        const cancelled = customerOrders.filter(o => o.status === 'Đã hủy').length;
        return { pending, inProgress, completed, cancelled };
    }, [customerOrders]);

    const customerMetrics = React.useMemo(() => {
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
                label: 'Tổng số lần bảo hành',
                value: formatNumber(customerWarrantyCount),
                badge: activeWarrantyCount > 0 ? { label: `${activeWarrantyCount} chưa trả`, tone: 'warning' as const } : undefined,
                link: customer ? `/warranty?customer=${encodeURIComponent(customer.systemId)}` : undefined,
            },
            {
                key: 'complaints',
                label: 'Tổng số lần khiếu nại',
                value: formatNumber(customerComplaintCount),
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
                value: formatNumber(customer?.failedDeliveries ?? 0),
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

    // Customer Settings Stores
    const { data: customerTypesData } = useCustomerTypes();
    const customerTypes = customerTypesData || [];
    const { data: customerGroupsData } = useCustomerGroups();
    const customerGroups = customerGroupsData || [];
    const { data: customerSourcesData } = useCustomerSources();
    const customerSources = customerSourcesData || [];
    const { findById: findEmployeeById } = useEmployeeFinder();

    // Branding for print
    const { logoUrl } = useBranding();

    const _getTypeName = (id?: string) => id ? customerTypes.find(ct => ct.systemId === id)?.name : undefined;
    const getGroupName = (id?: string) => id ? customerGroups.find(cg => cg.systemId === id)?.name : undefined;
    const _getSourceName = (id?: string) => id ? customerSources.find(cs => cs.systemId === id)?.name : undefined;
    const getEmployeeName = (id?: string) => id ? findEmployeeById(asSystemId(id))?.fullName : undefined;

    // Get salesperson employee for print
    const salespersonEmployee = React.useMemo(() => {
        if (!order?.salespersonSystemId) return null;
        return findEmployeeById(asSystemId(order.salespersonSystemId));
    }, [order?.salespersonSystemId, findEmployeeById]);

    const [isCancelAlertOpen, setIsCancelAlertOpen] = React.useState(false);
    const [cancelReasonText, setCancelReasonText] = React.useState('');
    const [restockItems, setRestockItems] = React.useState(true);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
    const [isCreateShipmentDialogOpen, setIsCreateShipmentDialogOpen] = React.useState(false);
    const [isPackerSelectionOpen, setIsPackerSelectionOpen] = React.useState(false);
    const [cancelPackagingState, setCancelPackagingState] = React.useState<{ packagingSystemId: SystemId } | null>(null);
    const [cancelShipmentState, setCancelShipmentState] = React.useState<{ packagingSystemId: SystemId; type: 'fail' | 'cancel' } | null>(null);
    const [hasOrderWorkflowTemplate, setHasOrderWorkflowTemplate] = React.useState(true);

    // Comments from database
    const { 
        comments: dbComments, 
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
            console.error('[OrderDetail] Failed to load workflow templates', error);
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

    // Get all employees for @mention in comments
    const { data: allEmployees } = useAllEmployees();
    const employeeMentions = React.useMemo(() => {
        return allEmployees
            .filter(e => !e.isDeleted)
            .map(e => ({
                id: e.systemId,
                label: e.fullName,
                avatar: e.avatarUrl,
            }));
    }, [allEmployees]);

    const salesReturnsForOrder = React.useMemo(() => {
        if (!order) return [];
        return allSalesReturns.filter(sr => sr.orderSystemId === order.systemId);
    }, [order, allSalesReturns]);
    
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

    // Lấy các phiếu chi hoàn tiền liên quan đến đơn hàng này (từ sales returns)
    const refundPaymentsForOrder = React.useMemo(() => {
        if (!order) return [];
        return allPayments.filter(p => 
            p.status !== 'cancelled' &&
            (p.linkedOrderSystemId === order.systemId || 
             salesReturnsForOrder.some(sr => sr.paymentVoucherSystemIds?.includes(p.systemId)))
        );
    }, [order, allPayments, salesReturnsForOrder]);

    const totalPaid = React.useMemo(() => (order?.payments || []).reduce((sum, p) => sum + p.amount, 0), [order?.payments]);
    // totalPaid: số tiền khách đã thanh toán
    // totalRefundedFromReturns: số tiền đã hoàn lại cho khách (từ sales returns)
    // netGrandTotal: công nợ thực tế sau khi trừ hàng trả
    // amountRemaining = netGrandTotal - totalPaid + totalRefundedFromReturns
    const netGrandTotal = Math.max(0, (order?.grandTotal || 0) - totalReturnedValue);
    const amountRemaining = netGrandTotal - totalPaid + totalRefundedFromReturns;

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

    const getProductTypeLabel = React.useCallback((productSystemId: SystemId) => {
        const product = findProductById(productSystemId);
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
    }, [findProductById, findProductTypeById]);
    
    const { costOfGoods, profit, totalDiscount } = React.useMemo(() => {
        if (!order) return { costOfGoods: 0, profit: 0, totalDiscount: 0 };
        const cost = order.lineItems.reduce((sum, item) => {
            const product = findProductById(item.productSystemId);
            return sum + ((product?.costPrice || 0) * item.quantity);
        }, 0);
        const discount = order.lineItems.reduce((sum, item) => {
            const lineGross = item.unitPrice * item.quantity;
            const discountAmount = item.discountType === 'percentage' ? lineGross * (item.discount / 100) : item.discount;
            return sum + (discountAmount * item.quantity);
        }, 0);
        const profit = order.subtotal - cost;
        return { costOfGoods: cost, profit: profit, totalDiscount: discount };
    }, [order, findProductById]);
    
    const isActionable = order?.status !== 'Hoàn thành' && order?.status !== 'Đã hủy';

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

    // Auto-sync GHTK status on page load
    const [isSyncing, setIsSyncing] = React.useState(false);
    React.useEffect(() => {
        if (!order) return;
        
        const ghtkPackagings = order.packagings.filter(
            p => p.carrier === 'GHTK' && p.trackingCode
        );
        
        if (ghtkPackagings.length === 0) return;
        
        setIsSyncing(true);
        
        // Dynamically import to avoid circular dependencies
        import('@/lib/ghtk-sync-service').then(({ ghtkSyncService }) => {
            ghtkSyncService.syncOrder(order.systemId)
                .catch(error => {
                    console.error('[Order Detail] GHTK sync failed:', error);
                })
                .finally(() => {
                    setIsSyncing(false);
                });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync when order systemId changes
    }, [order?.systemId]);

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
        const ghtkPackaging = order.packagings.find(p => 
            p.carrier === 'GHTK' && 
            p.trackingCode && 
            p.status !== 'Hủy đóng gói' &&
            p.deliveryStatus !== 'Đã giao hàng'
        );
        
        if (ghtkPackaging && ghtkPackaging.trackingCode) {
            try {
                const result: any = await cancelGHTKShipment(
                    order.systemId, 
                    ghtkPackaging.systemId, 
                    ghtkPackaging.trackingCode
                );
                
                if (!(result as any).success) {
                    // GHTK cancel failed, show toast with action to continue
                    toast.error(
                        `Không thể hủy vận đơn GHTK: ${result.message}`,
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
                console.error('[Cancel Order] GHTK cancel error:', error);
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
    const handleAddPayment = (paymentData: PaymentFormValues) => { if (order) { addPayment(order.systemId, paymentData); setIsPaymentDialogOpen(false); } };
    const handleRequestPackaging = React.useCallback((assignedEmployeeId?: SystemId) => {
        if (order) {
            requestPackaging(order.systemId, assignedEmployeeId);
        }
    }, [order, requestPackaging]);
    const handleConfirmPackaging = React.useCallback((packagingSystemId: SystemId) => { if (order) { confirmPackaging(order.systemId, packagingSystemId); } }, [order, confirmPackaging]);
    const handleCancelPackagingSubmit = (reason: string) => { if (order && cancelPackagingState) { cancelPackagingRequest(order.systemId, cancelPackagingState.packagingSystemId, '', reason); setCancelPackagingState(null); }};
    const handleInStorePickup = (packagingSystemId: SystemId) => { if (order) { (processInStorePickup as any)(order.systemId, packagingSystemId); } };
    const handleShippingSubmit = (data: Record<string, unknown>) => { if (order && activePackaging) { return (confirmPartnerShipment as any)(order.systemId, activePackaging.systemId, data); } return Promise.resolve({success: false, message: 'Đơn hàng không hợp lệ'}); };
    
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

    const handleCompleteDelivery = (packagingSystemId: SystemId) => { if (order) { completeDelivery(order.systemId, packagingSystemId); }};
    const handleFailDeliverySubmit = (reason: string) => { if (order && cancelShipmentState) { failDelivery(order.systemId, cancelShipmentState.packagingSystemId, reason); setCancelShipmentState(null); }};
    
    // ✅ Hủy giao hàng - KHÔNG trả hàng về kho (hàng bị thất tung/shipper giữ)
    const handleCancelDeliveryOnly = async () => { 
        if (order && cancelShipmentState) { 
            const packaging = order.packagings.find(p => p.systemId === cancelShipmentState.packagingSystemId);
            const trackingCode = packaging?.trackingCode;
            
            // Nếu có tracking code GHTK, gọi API hủy trước
            if (trackingCode && trackingCode.startsWith('S')) {
                try {
                    const result: any = await cancelGHTKShipment(order.systemId, cancelShipmentState.packagingSystemId, trackingCode);
                    
                    if (!result.success) {
                        toast.error(`⚠️ Không thể hủy vận đơn GHTK: ${result.message}\n\nVui lòng hủy trên hệ thống đối tác.`);
                        setCancelShipmentState(null);
                        return;
                    }
                } catch (error: unknown) {
                    toast.error(`⚠️ Lỗi khi hủy vận đơn GHTK: ${error instanceof Error ? error.message : 'Không rõ lỗi'}\n\nVui lòng hủy trên hệ thống đối tác.`);
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
                    const result: any = await cancelGHTKShipment(order.systemId, cancelShipmentState.packagingSystemId, trackingCode);
                    
                    if (!result.success) {
                        toast.error(`⚠️ Không thể hủy vận đơn GHTK: ${result.message}\n\nVui lòng hủy trên hệ thống đối tác.`);
                        setCancelShipmentState(null);
                        return;
                    }
                } catch (error: unknown) {
                    toast.error(`⚠️ Lỗi khi hủy vận đơn GHTK: ${error instanceof Error ? error.message : 'Không rõ lỗi'}\n\nVui lòng hủy trên hệ thống đối tác.`);
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
            const result: any = await cancelGHTKShipment(order.systemId, packagingSystemId, trackingCode);
            
            if (result.success) {
                toast.success('Đã hủy vận đơn GHTK thành công!');
            } else {
                toast.error(`Lỗi: ${result.message}`);
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

        const canReturn = order.status !== 'Đã hủy' && 
            order.returnStatus !== 'Trả hàng toàn bộ' &&
            order.stockOutStatus !== 'Chưa xuất kho';
        
        const canRequestPackaging = isActionable && (!activePackaging || activePackaging.deliveryStatus === 'Chờ giao lại');
        const canConfirmPackaging = activePackaging?.status === 'Chờ đóng gói';
        const canShip = activePackaging?.status === 'Đã đóng gói' && 
                        activePackaging?.deliveryStatus === 'Chờ lấy hàng' &&
                        order.stockOutStatus !== 'Chưa xuất kho';
        
        // ✅ Chỉ hiện nút Xuất kho khi đã đóng gói xong VÀ đã chọn hình thức giao hàng (theo yêu cầu user)
        const canStockOut = order.stockOutStatus === 'Chưa xuất kho' && 
                            order.status !== 'Đã hủy' && 
                            activePackaging?.status === 'Đã đóng gói' &&
                            !!activePackaging?.deliveryMethod;

        const actions: React.ReactNode[] = [];

        if (canStockOut) {
            actions.push(
                <Button 
                    key="stockout" 
                    size="sm" 
                    className="h-9" 
                    onClick={() => {
                        if (activePackaging) {
                            handleDispatch(activePackaging.systemId);
                        } else {
                            toast.error('Vui lòng tạo yêu cầu đóng gói trước khi xuất kho');
                        }
                    }}
                >
                    Xác nhận xuất kho
                </Button>
            );
        }

        if (canRequestPackaging) {
            actions.push(
                <Button key="request-packaging" size="sm" className="h-9" onClick={handleRequestPackagingClick}>
                    Yêu cầu đóng gói
                </Button>
            );
        }

        if (canConfirmPackaging) {
            actions.push(
                <Button 
                    key="confirm-packaging" 
                    size="sm" 
                    className="h-9" 
                    onClick={() => {
                        if (activePackaging) {
                            handleConfirmPackaging(activePackaging.systemId);
                        } else {
                            toast.error('Không tìm thấy gói hàng cần đóng gói');
                        }
                    }}
                >
                    Xác nhận đóng gói
                </Button>
            );
        }

        if (canShip) {
            actions.push(
                <Button 
                    key="ship" 
                    size="sm" 
                    className="h-9" 
                    onClick={() => {
                        if (activePackaging) {
                            handleDispatch(activePackaging.systemId);
                        } else {
                            toast.error('Không tìm thấy gói hàng để giao');
                        }
                    }}
                >
                    Giao hàng
                </Button>
            );
        }

        if (canReturn) {
            actions.push(
                <Button
                    key="return"
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => router.push(`/orders/${order.systemId}/return`)}
                >
                    Hoàn trả hàng
                </Button>
            );
        }

        // Cho phép hủy đơn nếu:
        // - Chưa hủy
        // - Chưa có phiếu trả hàng (nếu đã trả hàng thì không được hủy vì sẽ gây rối stock và công nợ)
        const canCancelOrder = order.status !== 'Đã hủy' && 
            (!order.returnStatus || order.returnStatus === 'Chưa trả hàng');
        
        if (canCancelOrder) {
            actions.push(
                <Button
                    key="cancel"
                    variant="outline"
                    size="sm"
                    className="h-9 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setIsCancelAlertOpen(true)}
                >
                    Hủy đơn hàng
                </Button>
            );
        }

        if (order.status !== 'Đã hủy') {
            actions.push(
                <Button
                    key="edit"
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => router.push(`/orders/${order.systemId}/edit`)}
                >
                    Sửa
                </Button>
            );
        }

        return actions;
    }, [order, isActionable, router, setIsCancelAlertOpen, activePackaging, handleRequestPackagingClick, handleConfirmPackaging, handleDispatch]);

    const displayStatus = React.useMemo(() => {
        if (!order) return undefined;
        // Fix for existing orders that are stuck in 'Đặt hàng' but have been dispatched
        if (order.status === 'Đặt hàng' && (order.stockOutStatus === 'Xuất kho toàn bộ' || order.deliveryStatus === 'Đang giao hàng' || order.deliveryStatus === 'Đã giao hàng')) {
            return 'Đang giao dịch';
        }
        return order.status;
    }, [order]);

    const headerBadge = React.useMemo(() => {
        if (!order || !displayStatus) {
            return undefined;
        }
        return (
            <div className="flex items-center gap-2">
                <OrderPrintButton
                    order={order}
                    customer={customer}
                    branch={orderBranch}
                    createdByEmployee={salespersonEmployee}
                    logoUrl={getFullLogoUrl(logoUrl)}
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
                <Badge variant={statusVariants[displayStatus]} className="uppercase tracking-wide">
                    {displayStatus}
                </Badge>
                {order.returnStatus === 'Trả hàng một phần' && (
                    <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50">
                        Trả hàng một phần
                    </Badge>
                )}
                {order.returnStatus === 'Trả hàng toàn bộ' && (
                    <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50">
                        Trả hàng toàn bộ
                    </Badge>
                )}
            </div>
        );
    }, [order, displayStatus, handleCopyOrder, isCopying, customer, orderBranch, salespersonEmployee, logoUrl]);

    const breadcrumb = React.useMemo(() => ([
        { label: 'Trang chủ', href: '/', isCurrent: false },
        { label: 'Đơn hàng', href: '/orders', isCurrent: false },
        { label: order?.id ? `Đơn ${order.id}` : 'Chi tiết', href: order ? `/orders/${order.systemId}` : '/orders', isCurrent: true },
    ]), [order]);

    usePageHeader({ 
        title: order ? `Đơn hàng ${order.id}` : 'Chi tiết đơn hàng',
        breadcrumb,
        badge: headerBadge,
        actions: headerActions,
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-muted rounded w-1/3" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
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
    
        const canRequestPackaging = !activePackaging || activePackaging.deliveryStatus === 'Chờ giao lại';
        
        if (canRequestPackaging) {
            return <Button size="sm" onClick={handleRequestPackagingClick}>Yêu cầu đóng gói</Button>;
        }
        
        return null;
    };
    
    return (
        <>
            <div className="space-y-4 md:space-y-6">
                {/* GHTK Sync Indicator */}
                {isSyncing && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Spinner className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-900">Đang đồng bộ trạng thái vận chuyển GHTK...</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                {/* Status Card - Full width */}
                <Card>
                    <CardContent className="p-4">
                        <StatusStepper order={order} />
                    </CardContent>
                </Card>

                {/* Row 1: Thông tin khách hàng (40%) + Quy trình xử lý (30%) + Thông tin đơn hàng (30%) */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                    {/* Thông tin khách hàng - 40% width on desktop */}
                    <Card className="lg:col-span-4 flex flex-col">
                        <CardHeader className="shrink-0">
                            <CardTitle className="text-base font-semibold">Thông tin khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-3">
                                {/* Tên và thông tin liên hệ */}
                                <div>
                                    <p className="font-semibold text-primary cursor-pointer hover:underline text-lg" onClick={() => router.push(`/customers/${customer?.systemId}`)}>{order.customerName}</p>
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
                                
                                {/* Địa chỉ nhận hóa đơn - 1 hàng */}
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Địa chỉ nhận hóa đơn</p>
                                    <div className="flex items-start gap-1">
                                        <p className="text-sm flex-1">{billingAddress || '-'}</p>
                                        {billingAddress && (
                                            <Copy 
                                                className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground shrink-0 mt-0.5" 
                                                onClick={() => { navigator.clipboard.writeText(billingAddress); toast.success('Đã sao chép địa chỉ hóa đơn'); }}
                                            />
                                        )}
                                    </div>
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
                                        <span className="font-medium">{getGroupName(customer?.customerGroup) || '---'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">NV phụ trách:</span>
                                        <span className="font-medium">{getEmployeeName(customer?.accountManagerId) || '---'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Công nợ/Hạn mức:</span>
                                        <div className="text-right">
                                            <Link href={`/customers/${customer?.systemId}?tab=debt`} 
                                                className="font-medium text-red-500 hover:underline cursor-pointer"
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
                                            ? 'text-red-600'
                                            : metric.tone === 'warning'
                                                ? 'text-amber-600'
                                                : metric.tone === 'success'
                                                    ? 'text-green-600'
                                                    : 'text-foreground';
                                        const ValueContent = (
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className={cn('font-medium', toneClass, metric.link && 'hover:underline cursor-pointer')}>{metric.value}</span>
                                                {metric.badge && (
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(
                                                            'text-[11px] uppercase tracking-tight',
                                                            metric.badge.tone === 'destructive'
                                                                ? 'bg-red-100 text-red-700 border-red-200'
                                                                : 'bg-amber-100 text-amber-700 border-amber-200'
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
                            <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                                <Info className="h-4 w-4 text-amber-600" />
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
                                updateOrder.mutate({ id: systemId, ...updates } as any);
                            }} 
                        />
                    </div>

                    {/* Thông tin đơn hàng - 30% width on desktop */}
                    <Card className="lg:col-span-3 flex flex-col h-full lg:h-auto">
                        <CardHeader className="shrink-0">
                            <CardTitle className="text-base font-semibold">Thông tin đơn hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 overflow-y-auto flex-1 max-h-100 lg:max-h-none"
                            style={{ 
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgb(203 213 225) transparent'
                            }}
                        >
                            <DetailField label="Chính sách giá" value={defaultPricingPolicy?.name || 'Giá bán lẻ'} />
                            <DetailField label="Bán tại" value={order.branchName} />
                            <div className="flex">
                                <span className="text-muted-foreground min-w-35">Bán bởi:</span>
                                <Link href={`/employees/${order.salespersonSystemId}`} className="text-primary hover:underline font-medium">
                                    {order.salesperson}
                                </Link>
                            </div>
                            <DetailField label="Hẹn giao hàng" value={order.expectedDeliveryDate || '---'} />
                            <DetailField label="Nguồn" value={order.source || '---'} />
                            <DetailField label="Kênh bán hàng" value="Khác" />
                            <DetailField label="Ngày bán" value={formatDate(order.orderDate)} />
                            {order.expectedPaymentMethod && (
                                <DetailField label="Hình thức thanh toán" value={order.expectedPaymentMethod} />
                            )}
                            {order.referenceUrl && (
                                <div>
                                    <span className="text-muted-foreground">Link đơn hàng:</span>{' '}
                                    <a href={order.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                                {order.paymentStatus === 'Thanh toán toàn bộ' ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                ) : (
                                    <FileWarning className="h-5 w-5 text-amber-500 shrink-0" />
                                )}
                                <CardTitle className="text-base font-semibold">
                                    {order.paymentStatus === 'Chưa thanh toán' 
                                        ? 'Đơn hàng chờ thanh toán' 
                                        : `Đơn hàng thanh toán ${order.paymentStatus.toLowerCase()}`}
                                </CardTitle>
                            </div>
                            {isActionable && payableAmount > 0 && (
                                <Button size="sm" onClick={() => setIsPaymentDialogOpen(true)}>
                                    Thanh toán
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 gap-2 bg-muted/50 p-3 sm:p-4 rounded-md text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tổng tiền ĐH:</span>
                                <span className="font-medium">{formatCurrency(order.grandTotal)}</span>
                            </div>
                            {totalReturnedValue > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Giá trị hàng bị trả lại:</span>
                                    <span className="font-medium text-amber-600">-{formatCurrency(totalReturnedValue)}</span>
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
                                <span className="font-medium">{totalPaid > 0 ? formatCurrency(totalPaid) : '0'}</span>
                            </div>
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

                        {directPayments.length > 0 && (
                            <div className="space-y-2 pt-2">
                                {[...directPayments].reverse().map((payment, index) => (
                                    <React.Fragment key={`direct-${payment.systemId}-${index}`}>
                                        <PaymentInfo payment={payment} order={order} />
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                        
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
                        {refundPaymentsForOrder.length > 0 && (
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
                                                            // Reuse handlePrintTransaction logic or similar
                                                            // Since we don't have handlePrintTransaction here, we need to implement it or pass it
                                                            // But wait, we are inside OrderDetailPage, we can access print function
                                                            // Let's implement inline or call a helper
                                                            
                                                            const branch = findBranchById(order.branchSystemId);
                                                            const storeSettings: StoreSettings = {
                                                                name: storeInfo?.brandName || storeInfo?.companyName || '',
                                                                address: storeInfo?.headquartersAddress,
                                                                phone: storeInfo?.hotline,
                                                                email: storeInfo?.email,
                                                                province: storeInfo?.province,
                                                            };
                                                            
                                                            const paymentData: PaymentForPrint = {
                                                                code: refund.id,
                                                                createdAt: refund.date,
                                                                issuedAt: refund.date,
                                                                createdBy: findEmployeeById(refund.createdBy)?.fullName || refund.createdBy,
                                                                recipientName: order.customerName,
                                                                recipientPhone: customer?.phone || '',
                                                                recipientAddress: customer?.addresses?.[0]?.street || '',
                                                                recipientType: 'Khách hàng',
                                                                amount: refund.amount,
                                                                description: refund.description,
                                                                paymentMethod: refund.paymentMethodName,
                                                                documentRootCode: order.id,
                                                                note: refund.description,
                                                                location: branch ? {
                                                                    name: branch.name,
                                                                    address: branch.address,
                                                                    province: branch.province
                                                                } : undefined
                                                            };
                                                            
                                                            const printData = mapPaymentToPrintData(paymentData, storeSettings);
                                                            printData['amount_text'] = numberToWords(refund.amount);
                                                            printData['print_date'] = formatDateTime(new Date());
                                                            printData['print_time'] = formatTime(new Date());
                                                            
                                                            print('payment', { data: printData });
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
                                                        <p className="font-medium">{findEmployeeById(refund.createdBy)?.fullName || refund.createdBy}</p>
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
                        )}
                    </CardContent>
                </Card>

                {/* Row 3: Đóng gói và Giao hàng - Full width */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-muted-foreground shrink-0" />
                                <CardTitle className="text-base font-semibold">Đóng gói và Giao hàng</CardTitle>
                            </div>
                            {renderMainPackagingActionButtons()}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.packagings.length === 0 && (
                            <div className="text-center text-muted-foreground py-4">
                                Chưa có yêu cầu đóng gói.
                            </div>
                        )}
                        {[...order.packagings].reverse().map(pkg => (
                            <React.Fragment key={pkg.systemId}>
                                <PackagingInfo
                                    order={order}
                                    packaging={pkg}
                                    isActionable={isActionable}
                                    onConfirmPackaging={() => handleConfirmPackaging(pkg.systemId)}
                                    onCancelPackaging={() => setCancelPackagingState({ packagingSystemId: pkg.systemId })}
                                    onDispatch={() => handleDispatch(pkg.systemId)}
                                    onCompleteDelivery={() => handleCompleteDelivery(pkg.systemId)}
                                    onOpenShipmentDialog={() => setIsCreateShipmentDialogOpen(true)}
                                    onFailDelivery={() => setCancelShipmentState({ packagingSystemId: pkg.systemId, type: 'fail'})}
                                    onCancelDelivery={() => setCancelShipmentState({ packagingSystemId: pkg.systemId, type: 'cancel' })}
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
                    salesReturns={allSalesReturns} 
                    getProductTypeLabel={getProductTypeLabel}
                />
                
                {/* Return History Card - Show only if there are returns */}
                {salesReturnsForOrder.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
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
                    mentions={employeeMentions}
                />
                
                {/* Order History & Notes */}
                <OrderHistoryTab order={order} salesReturnsForOrder={salesReturnsForOrder} orderComments={orderComments} />

                {/* Shipping Tracking - Show if order has shipping partner delivery */}
                {order.packagings.some(p => p.deliveryMethod === 'Dịch vụ giao hàng' && p.status !== 'Hủy đóng gói') && (
                    <ShippingTrackingTab order={order} />
                )}
            </div>

            <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                            <div className="space-y-3">
                                <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
                                <p className="text-sm">Khi hủy đơn hàng, hệ thống sẽ thực hiện các thay đổi sau:</p>
                                <ul className="text-sm space-y-1 ml-4 list-disc">
                                    <li>Trả hàng về kho và cập nhật số lượng tồn kho</li>
                                    <li>Hủy các vận đơn liên quan (nếu có)</li>
                                    <li>Hủy các phiếu thu thanh toán đơn hàng</li>
                                    <li>Hủy các phiếu thu đặt cọc shipper (nếu có)</li>
                                    <li>Cập nhật công nợ khách hàng</li>
                                    <li>Cập nhật công nợ đối tác vận chuyển</li>
                                    <li>Hoàn lại khuyến mại và điểm tích lũy (nếu có)</li>
                                </ul>
                                {order && order.payments && order.payments.length > 0 && (
                                    <p className="text-amber-600 font-medium">
                                        Lưu ý: Đơn hàng đã có thanh toán. Một phiếu chi hoàn tiền sẽ được tạo tự động.
                                    </p>
                                )}
                                <p className="font-semibold text-destructive">Hành động này không thể hoàn tác!</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cancel-reason-textarea" className="text-sm font-semibold">
                                    Lý do hủy đơn hàng
                                </Label>
                                <Textarea
                                    id="cancel-reason-textarea"
                                    value={cancelReasonText}
                                    onChange={(event) => setCancelReasonText(event.target.value)}
                                    placeholder="Nhập rõ lý do hủy để đội vận hành nắm được..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Tùy chọn bổ sung</Label>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-3 rounded-md border p-3">
                                        <Checkbox
                                            id="cancel-restock-option"
                                            checked={restockItems}
                                            onCheckedChange={(checked) => setRestockItems(checked === true)}
                                        />
                                        <div className="space-y-1">
                                            <Label htmlFor="cancel-restock-option" className="text-sm font-medium">
                                                Hoàn kho {totalLineQuantity} sản phẩm
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Giữ tồn kho và số liệu chi phí chính xác sau khi hủy.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Không, giữ đơn hàng</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCancel} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                            Có, hủy đơn hàng
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

             <PaymentDialog 
                isOpen={isPaymentDialogOpen}
                onOpenChange={setIsPaymentDialogOpen}
                onSubmit={handleAddPayment}
                amountDue={payableAmount}
            />
            
            <CreateShipmentDialog
                isOpen={isCreateShipmentDialogOpen}
                onOpenChange={setIsCreateShipmentDialogOpen}
                onSubmit={handleShippingSubmit as any}
                order={order}
                customer={customer ?? null}
            />

            <PackerSelectionDialog
                isOpen={isPackerSelectionOpen}
                onOpenChange={setIsPackerSelectionOpen}
                onSubmit={handleRequestPackaging}
                {...(existingPackerSystemId ? { existingPackerSystemId } : {})}
            />
            
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
