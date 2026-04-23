'use client'

import * as React from 'react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { useOrder } from '../orders/hooks/use-orders';
import { usePackagingActions } from '../orders/hooks/use-packaging-actions';
import { useShipmentById } from './hooks/use-shipments';
import { usePageHeader } from '../../contexts/page-header-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { DetailPageShell, mobileBleedCardClass } from '@/components/layout/page-section';
import { asSystemId, type SystemId } from '../../lib/id-types';
import Link from 'next/link';
import { Truck, Package, Home, PackageCheck, PackageSearch, Printer, Check, PackagePlus, LifeBuoy, ArrowLeft, History, XCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { getGHTKStatusInfo, getGHTKReasonText } from '@/lib/ghtk-constants';
import { usePrint } from '../../lib/use-print';
import { 
  convertShipmentToDeliveryForPrint,
  mapDeliveryToPrintData, 
  mapDeliveryLineItems,
  createStoreSettings,
} from '../../lib/print/shipment-print-helper';
import { useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { useCustomerStats } from '../customers/hooks/use-customer-stats';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { numberToWords } from '../../lib/print-service';
import { DetailField } from '../../components/ui/detail-field';
import { Timeline, TimelineItem } from '../../components/ui/timeline';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import type { OrderDeliveryStatus } from '../orders/types';
import { getDeliveryStatusLabel } from '../../lib/constants/order-status-labels';
import { useAuth } from '../../contexts/auth-context';
import { ROUTES, generatePath } from '../../lib/router';
import { ReadOnlyProductsTable } from '../../components/shared/read-only-products-table';
import { useComments } from '../../hooks/use-comments';
import dynamic from 'next/dynamic';
const CancelShipmentDialog = dynamic(() => import('../orders/components/cancel-shipment-dialog').then(mod => ({ default: mod.CancelShipmentDialog })), { ssr: false });
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0 ?';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Helper to format shipping address (can be string or object)
const formatShippingAddress = (address: unknown): string | null => {
    if (!address) return null;
    if (typeof address === 'string') return address;
    if (typeof address === 'object') {
        const addr = address as Record<string, unknown>;
        // Handle ShippingAddressInfo format: { address, ward, district, province }
        const parts = [
            addr.address || addr.street,
            addr.ward || addr.wardName,
            addr.district || addr.districtName,
            addr.province || addr.provinceName || addr.city,
        ].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : null;
    }
    return null;
};



import { formatDateTime } from '../../lib/date-utils';

const StatusTimeline = ({ deliveryStatus, webhookHistory, requestDate }: { 
    deliveryStatus?: OrderDeliveryStatus;
    webhookHistory?: Array<Record<string, unknown>>;
    requestDate?: string | Date | null;
}) => {
    const steps = [
        { name: 'Chờ lấy hàng', icon: PackageSearch },
        { name: 'Đã lấy hàng', icon: PackageCheck },
        { name: 'Đang giao hàng', icon: Truck },
        { name: 'Đã giao hàng', icon: Home },
    ];

    let currentStepIndex = -1;
    const statusLabel = deliveryStatus ? getDeliveryStatusLabel(deliveryStatus) : '';
    switch (statusLabel) {
        case 'Chờ lấy hàng': currentStepIndex = 0; break;
        case 'Đã lấy hàng': currentStepIndex = 1; break;
        case 'Đang giao hàng': currentStepIndex = 2; break;
        case 'Đã giao hàng': currentStepIndex = 3; break;
        default: currentStepIndex = -1;
    }

    // "Đã giao hàng" is the final step — mark ALL steps as completed
    const isFullyCompleted = currentStepIndex === steps.length - 1;

    // Find first timestamp for each step from webhook history
    const findTimeForStatusIds = (ids: number[]): string | null => {
        if (!webhookHistory?.length) return null;
        const match = webhookHistory.find(entry => {
            const sid = (entry.status_id || entry.statusId) as number | undefined;
            return sid != null && ids.includes(sid);
        });
        return match ? (match.action_time || match.timestamp || null) as string | null : null;
    };

    const pickupTime = findTimeForStatusIds([3, 123]); // Đã lấy hàng
    const transitTime = findTimeForStatusIds([4, 10]); // Đã điều phối / Delay giao
    const deliveredTime = findTimeForStatusIds([5, 6, 45]); // Đã giao hàng

    const stepTimes: (string | null)[] = [
        requestDate ? (typeof requestDate === 'string' ? requestDate : requestDate.toISOString()) : null, // Chờ lấy hàng = thời gian tạo đơn
        pickupTime,                                    // Đã lấy hàng
        transitTime,                                   // Đang giao hàng: chỉ hiện nếu GHTK thực sự gửi status 4
        deliveredTime,                                 // Đã giao hàng
    ];
    
    return (
        <div className="flex items-start justify-between w-full p-4">
            {steps.map((step, index) => {
                const isCompleted = isFullyCompleted ? true : index < currentStepIndex;
                const isCurrent = isFullyCompleted ? false : index === currentStepIndex;
                return (
                    <React.Fragment key={step.name}>
                        <div className="flex flex-col items-center text-center w-24">
                             <div className={cn(
                                "flex items-center justify-center w-10 h-9 rounded-full border-2",
                                isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                isCurrent ? "border-primary text-primary" :
                                "border bg-muted text-muted-foreground"
                            )}>
                                {isCompleted ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                            </div>
                            <p className={cn("text-sm mt-2 font-medium", isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground")}>{step.name}</p>
                            {stepTimes[index] && (isCompleted || isCurrent) && (
                                <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(stepTimes[index]!)}</p>
                            )}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn("flex-1 mt-5 border-t-2", isCompleted ? "border-primary" : "border-border")} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};




export function ShipmentDetailPage() {
    const { systemId } = useParams<{ systemId: string }>();
    const router = useRouter();
    const { dispatchFromWarehouse, isDispatching, cancelDelivery } = usePackagingActions();
    const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
    const [isCancelling, setIsCancelling] = React.useState(false);
    // ✅ Phase A3: Use single-item query instead of loading ALL shipments
    const { data: shipmentData, isLoading: isLoadingShipment } = useShipmentById(systemId);
    const { employee: authEmployee } = useAuth();
    const { isMobile } = useBreakpoint();
    const _currentUserSystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');

    // ✅ Sử dụng useComments hook thay vì localStorage trực tiếp
    const { 
      comments: dbComments, 
      addComment: dbAddComment, 
      deleteComment: dbDeleteComment 
    } = useComments('shipment', systemId || '');
    
    type ShipmentComment = CommentType<SystemId>;
    const comments = React.useMemo<ShipmentComment[]>(() => 
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
    }, []);

    const handleDeleteComment = React.useCallback((commentId: string) => {
        dbDeleteComment(commentId);
    }, [dbDeleteComment]);

    const commentCurrentUser = React.useMemo(() => ({
        systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
        name: authEmployee?.fullName || 'Hệ thống',
        avatar: authEmployee?.avatar,
    }), [authEmployee]);

    const shipment = shipmentData ?? null;

    // ⚡ PERFORMANCE: Fetch only the order linked to this shipment
    const orderSystemId = shipment?.orderSystemId || shipment?.orderId;
    const { data: orderData, isLoading: isLoadingOrder } = useOrder(orderSystemId || null);

    // ⚡ Customer stats for recipient info
    const customerSystemId = orderData?.customerSystemId;
    const { data: customerStats, isLoaded: isStatsLoaded } = useCustomerStats(customerSystemId);
    
    // Find order and packaging using shipment's links
    const { order, packaging } = React.useMemo(() => {
        if (!shipment) return { order: null, packaging: null };
        
        // Use the fetched order directly
        const o = orderData;
        if (!o) return { order: null, packaging: null };
        
        const p = o.packagings.find(pkg => pkg.systemId === shipment.packagingSystemId);
        return { order: o, packaging: p };
    }, [shipment, orderData]);
    
    const handleDispatchAll = React.useCallback(async () => {
        if (order && packaging) {
            await dispatchFromWarehouse(order.systemId, packaging.systemId);
        }
    }, [order, packaging, dispatchFromWarehouse]);

    const handleCancelDeliveryOnly = React.useCallback(async () => {
        if (!order || !packaging) return;
        setIsCancelling(true);
        try {
            await cancelDelivery(order.systemId, packaging.systemId, 'Hủy giao hàng');
            setCancelDialogOpen(false);
        } catch {
            // error handled by cancelDelivery
        } finally {
            setIsCancelling(false);
        }
    }, [order, packaging, cancelDelivery]);

    const handleCancelDeliveryAndRestock = React.useCallback(async () => {
        if (!order || !packaging) return;
        setIsCancelling(true);
        try {
            await cancelDelivery(order.systemId, packaging.systemId, 'Hủy giao hàng và nhận lại hàng', true);
            setCancelDialogOpen(false);
        } catch {
            // error handled by cancelDelivery
        } finally {
            setIsCancelling(false);
        }
    }, [order, packaging, cancelDelivery]);

    const { findById: findBranchById } = useBranchFinder();
    const { print } = usePrint(order?.branchSystemId);

    // ⚡ OPTIMIZED: Lazy load print data only when print is clicked
    const handlePrint = React.useCallback(async () => {
        if (!shipment || !order || !packaging) return;

        const { storeInfo } = await fetchPrintData();
        const branch = order.branchSystemId ? findBranchById(order.branchSystemId) : undefined;

        // Use helper to prepare print data
        const storeSettings = createStoreSettings(storeInfo);
        const deliveryForPrint = convertShipmentToDeliveryForPrint(shipment, order, { 
            branch: branch || undefined,
        });

        const printData = mapDeliveryToPrintData(deliveryForPrint, storeSettings);
        const lineItems = mapDeliveryLineItems(deliveryForPrint.items);

        // Inject extra fields
        printData['amount_text'] = numberToWords(order.grandTotal);

        print('delivery', {
            data: printData,
            lineItems: lineItems
        });
    }, [shipment, order, packaging, print, findBranchById]);

    const headerActions = React.useMemo(() => {
        const actions: React.ReactNode[] = [];

        const deliveryLabel = packaging?.deliveryStatus ? getDeliveryStatusLabel(packaging.deliveryStatus) : '';

        if (deliveryLabel === 'Chờ lấy hàng') {
            actions.push(
                <Button
                    key="dispatch"
                    size="sm"
                    className="gap-2"
                    disabled={isDispatching}
                    onClick={handleDispatchAll}
                >
                    <PackagePlus className="h-4 w-4" />
                    {isDispatching ? 'Đang xử lý...' : 'Xuất kho'}
                </Button>
            );
        }

        if (deliveryLabel && deliveryLabel !== 'Đã hủy' && deliveryLabel !== 'Đã giao hàng') {
            actions.push(
                <Button
                    key="cancel"
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    disabled={isCancelling}
                    onClick={() => setCancelDialogOpen(true)}
                >
                    <XCircle className="h-4 w-4" />
                    Hủy giao hàng
                </Button>
            );
        }

        actions.push(
            <Button
                key="print"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handlePrint}
            >
                <Printer className="h-4 w-4" />
                In phiếu
            </Button>
        );

        if (order) {
            actions.push(
                <Button
                    key="order"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => router.push(generatePath(ROUTES.SALES.ORDER_VIEW, { systemId: order.systemId }))}
                >
                    <Package className="h-4 w-4" />
                    Xem đơn hàng
                </Button>
            );
        }

        actions.push(
            <Button
                key="help"
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => toast.info('Chức năng đang phát triển')}
            >
                <LifeBuoy className="h-4 w-4" />
                Trợ giúp
            </Button>
        );

        actions.push(
            <Button
                key="back"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => router.push(ROUTES.INTERNAL.SHIPMENTS)}
            >
                <ArrowLeft className="h-4 w-4" />
                Về danh sách
            </Button>
        );

        return actions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [packaging, order, handleDispatchAll, router, handlePrint, isCancelling]);

    const mobileHeaderActions = React.useMemo(() => {
        if (!isMobile) return headerActions;
        const deliveryLabel = packaging?.deliveryStatus ? getDeliveryStatusLabel(packaging.deliveryStatus) : '';

        return [
            <DropdownMenu key="mobile-actions">
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {deliveryLabel === 'Chờ lấy hàng' && (
                        <DropdownMenuItem disabled={isDispatching} onClick={handleDispatchAll}>
                            <PackagePlus className="mr-2 h-4 w-4" />
                            {isDispatching ? 'Đang xử lý...' : 'Xuất kho'}
                        </DropdownMenuItem>
                    )}
                    {deliveryLabel && deliveryLabel !== 'Đã hủy' && deliveryLabel !== 'Đã giao hàng' && (
                        <DropdownMenuItem disabled={isCancelling} className="text-destructive focus:text-destructive" onClick={() => setCancelDialogOpen(true)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Hủy giao hàng
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        In phiếu
                    </DropdownMenuItem>
                    {order && (
                        <DropdownMenuItem onClick={() => router.push(generatePath(ROUTES.SALES.ORDER_VIEW, { systemId: order.systemId }))}>
                            <Package className="mr-2 h-4 w-4" />
                            Xem đơn hàng
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>,
        ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, headerActions, packaging, order, handleDispatchAll, handlePrint, isCancelling]);

    const detailBreadcrumb = React.useMemo(() => {
        const shipmentLabel = shipment?.id ?? 'Chi tiết vận đơn';
        return [
            { label: 'Trang chủ', href: ROUTES.DASHBOARD },
            { label: 'Vận chuyển', href: ROUTES.INTERNAL.SHIPMENTS },
            { label: shipmentLabel, href: shipment ? generatePath(ROUTES.INTERNAL.SHIPMENT_VIEW, { systemId: shipment.systemId }) : ROUTES.INTERNAL.SHIPMENTS }
        ];
    }, [shipment]);

    const statusBadge = React.useMemo(() => {
        if (!packaging) return undefined;
        const label = packaging.deliveryStatus ? getDeliveryStatusLabel(packaging.deliveryStatus) : 'Chờ lấy hàng';
        const variantMap: Record<string, "warning" | "default" | "success" | "destructive"> = {
            "Chờ lấy hàng": "warning",
            "Chờ đóng gói": "default",
            "Đang giao hàng": "default",
            "Đã giao hàng": "success",
            "Chờ giao lại": "warning",
            "Đã hủy": "destructive",
        };
        const variant = variantMap[label] ?? 'default';
        return (
            <Badge variant={variant} className="capitalize">
                {label}
            </Badge>
        );
    }, [packaging]);

    usePageHeader({
        title: shipment ? `Vận đơn ${shipment.id}` : 'Chi tiết vận đơn',
        badge: statusBadge,
        showBackButton: true,
        backPath: ROUTES.INTERNAL.SHIPMENTS,
        actions: isMobile ? mobileHeaderActions : headerActions,
        breadcrumb: detailBreadcrumb,
    });

    if (isLoadingShipment || isLoadingOrder) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!shipment || !order || !packaging) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-h3 font-bold">Không tìm thấy vận đơn</h2>
                    <Button onClick={() => router.push('/shipments')} className="mt-4">
                        Quay về danh sách
                    </Button>
                </div>
            </div>
        );
    }
    
    const totalValue = order.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Build status history from GHTK webhook data if available, otherwise fallback to system timestamps
    const currentStatusLabel = packaging.deliveryStatus ? getDeliveryStatusLabel(packaging.deliveryStatus) : 'Chờ lấy hàng';
    // Support both old format (statusId/statusText/timestamp) and new format (status_id/status_text/action_time)
    const rawWebhookHistory = packaging.ghtkWebhookHistory as Array<Record<string, unknown>> | undefined;

    const statusHistory = rawWebhookHistory && rawWebhookHistory.length > 0
        ? rawWebhookHistory
            .map(entry => {
                const sid = (entry.status_id || entry.statusId) as number | undefined;
                const rc = (entry.reason_code || entry.reasonCode) as string | undefined;
                // Enrich from constants for backward-compatible old entries
                const statusMapping = sid != null ? getGHTKStatusInfo(sid) : null;
                const reasonCodeText = rc ? getGHTKReasonText(rc) : '';
                return {
                    status: (entry.status_text || entry.statusText || statusMapping?.statusText || `Trạng thái ${sid}`) as string,
                    time: (entry.action_time || entry.timestamp || '') as string,
                    // Rich detail: reason from GHTK > reason_code mapping > status description
                    details: (entry.detail || entry.reason_text || entry.reasonText || reasonCodeText || entry.reason_code_text || entry.description || statusMapping?.description || '') as string,
                    statusId: sid,
                    reasonCode: rc,
                };
            })
            .filter(entry => !entry.status.startsWith('late_'))
            .reverse() // Newest first
        : [
            { status: 'Chờ lấy hàng', time: packaging.requestDate, details: 'Đơn hàng đã được đóng gói và sẵn sàng bàn giao cho ĐTVC.' },
            ...(currentStatusLabel === 'Đang giao hàng' || currentStatusLabel === 'Đã giao hàng' ? [{ status: 'Đang giao hàng', time: order.dispatchedDate, details: `Đơn hàng đang được giao bởi ${packaging.carrier || 'đối tác vận chuyển'}.` }] : []),
            ...(currentStatusLabel === 'Đã giao hàng' ? [{ status: 'Đã giao hàng', time: packaging.deliveredDate, details: 'Giao hàng thành công.' }] : []),
            ...(currentStatusLabel === 'Đã hủy' ? [{ status: 'Đã hủy', time: shipment.cancelledAt, details: 'Đơn giao hàng đã bị hủy.' }] : []),
        ];

    const _deliveryStatusVariant: Partial<Record<OrderDeliveryStatus, "warning" | "default" | "success" | "destructive">> = {
        "Chờ lấy hàng": "warning",
        "Chờ đóng gói": "default",
        "Đang giao hàng": "default",
        "Đã giao hàng": "success",
        "Chờ giao lại": "warning",
        "Đã hủy": "destructive",
    };

    return (
        <DetailPageShell gap="lg">
            {/* Status Badge + Timeline */}
            <Card className={mobileBleedCardClass}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                        <span className="text-sm text-muted-foreground">
                            Đơn hàng: <Link href={`/orders/${order.systemId}`} className="text-primary hover:underline font-medium">{order.id}</Link>
                        </span>
                    </div>
                    <StatusTimeline deliveryStatus={packaging.deliveryStatus} webhookHistory={rawWebhookHistory} requestDate={packaging.requestDate} />
                </CardContent>
            </Card>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                {/* Right Column - Customer & Shipping Info */}
                <div className="space-y-4 lg:order-2">
                    <Card className={mobileBleedCardClass}>
                        <CardHeader>
                            <CardTitle>Thông tin người nhận</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            {order.customerSystemId ? (
                                <Link href={`/customers/${order.customerSystemId}`}
                                    className="font-semibold text-primary hover:underline block"
                                >
                                    {shipment.recipientName || order.customerName}
                                </Link>
                            ) : (
                                <p className="font-semibold">{shipment.recipientName || order.customerName}</p>
                            )}
                            <p className="text-muted-foreground">{shipment.recipientPhone || (order as { customer?: { phone?: string } }).customer?.phone || '---'}</p>
                            <p className="text-muted-foreground">
                                {shipment.recipientAddress || formatShippingAddress(order.shippingAddress) || formatShippingAddress((order as { deliveryAddress?: unknown }).deliveryAddress) || 'Chưa có địa chỉ'}
                            </p>
                            {isStatsLoaded && (
                                <div className="pt-3 border-t space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tổng đơn hàng</span>
                                        <span className="font-medium">{customerStats.orders.total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tổng chi tiêu</span>
                                        <span className="font-medium">{formatCurrency(customerStats.financial.totalSpent)}</span>
                                    </div>
                                    {customerStats.financial.currentDebt > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Công nợ hiện tại</span>
                                            <span className="font-medium text-destructive">{formatCurrency(customerStats.financial.currentDebt)}</span>
                                        </div>
                                    )}
                                    {customerStats.orders.cancelled > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Đơn đã hủy</span>
                                            <span className="font-medium text-destructive">{customerStats.orders.cancelled}</span>
                                        </div>
                                    )}
                                    {(customerStats.warranties.active > 0 || customerStats.complaints.active > 0) && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">BH/KN đang mở</span>
                                            <span className="font-medium text-warning">{customerStats.warranties.active + customerStats.complaints.active}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    
                    <Card className={mobileBleedCardClass}>
                        <CardHeader>
                            <CardTitle>Thông tin đối tác vận chuyển</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <DetailField label="Hãng vận chuyển" value={packaging.carrier || 'Chưa có'} />
                            <DetailField label="Dịch vụ" value={packaging.service || 'Chưa có'} />
                            <DetailField label="Bên trả phí" value={packaging.payer || 'Chưa có'} />
                            <DetailField label="Phí vận chuyển" value={formatCurrency(packaging.shippingFeeToPartner || 0)} />
                            <DetailField label="Thu hộ (COD)" value={formatCurrency(packaging.codAmount || 0)} />
                            {packaging.trackingCode && (
                                <DetailField label="Mã vận đơn" value={packaging.trackingCode} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Left Column - Status History Timeline */}
                <Card className={cn(mobileBleedCardClass, 'lg:col-span-2 lg:order-1')}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Lịch sử trạng thái đơn giao hàng</CardTitle>
                        {packaging.trackingCode && packaging.carrier === 'GHTK' && (
                            <a
                                href={`https://i.ghtk.vn/${packaging.trackingCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                            >
                                <History className="h-4 w-4" />
                                Xem trên GHTK
                            </a>
                        )}
                    </CardHeader>
                    <CardContent>
                        <Timeline>
                            {statusHistory.map((item, index) => (
                                <TimelineItem key={index} time={item.time ?? ''}>
                                    <p className="font-semibold">{item.status}</p>
                                    {item.details && (
                                        <p className="text-muted-foreground text-sm mt-1">{item.details}</p>
                                    )}
                                    {'reasonCode' in item && item.reasonCode && (
                                        <p className="text-xs text-muted-foreground/70 mt-0.5">Mã lý do: {item.reasonCode}</p>
                                    )}
                                </TimelineItem>
                            ))}
                        </Timeline>
                    </CardContent>
                </Card>
            </div>

            {/* Product Details Table */}
            <ReadOnlyProductsTable 
                lineItems={order.lineItems}
                summary={{
                    subtotal: totalValue,
                    grandTotal: totalValue,
                }}
                grandTotalLabel="Tổng cộng"
            />

            {/* Comments */}
            <Comments
                entityType="shipment"
                entityId={shipment.systemId}
                comments={comments}
                onAddComment={handleAddComment}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
                currentUser={commentCurrentUser}
                title="Bình luận"
                placeholder="Thêm bình luận về vận đơn..."
            />

            {/* Activity History */}
            <EntityActivityTable entityType="shipment" entityId={systemId} />

            {/* Cancel Dialog */}
            {cancelDialogOpen && (
                <CancelShipmentDialog
                    isOpen={cancelDialogOpen}
                    onOpenChange={setCancelDialogOpen}
                    onCancelShipment={handleCancelDeliveryOnly}
                    onCancelAndRestock={handleCancelDeliveryAndRestock}
                />
            )}
        </DetailPageShell>
    );
}
