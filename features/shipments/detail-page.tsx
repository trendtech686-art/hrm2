'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useOrderStore } from '../orders/store';
import { useCustomerStore } from '../customers/store';
import { useProductStore } from '../products/store';
import { useShipmentStore } from './store';
import { useStorageLocationStore } from '../settings/inventory/storage-location-store';
import type { Product } from '../products/types';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory';
import { asSystemId, type SystemId } from '../../lib/id-types';
import { Check, Truck, Package, Home, PackageCheck, PackageSearch, History, ArrowLeft, LifeBuoy, PackagePlus, Printer } from 'lucide-react';
import { usePrint } from '../../lib/use-print';
import { 
  convertShipmentToDeliveryForPrint,
  mapDeliveryToPrintData, 
  mapDeliveryLineItems,
  createStoreSettings,
} from '../../lib/print/shipment-print-helper';
import { useBranchStore } from '../settings/branches/store';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { numberToWords } from '../../lib/print-mappers/types';
import { DetailField } from '../../components/ui/detail-field';
import { Timeline, TimelineItem } from '../../components/ui/timeline';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { cn } from '../../lib/utils';
import type { OrderDeliveryStatus } from '../orders/types';
import { useAuth } from '../../contexts/auth-context';
import { ROUTES, generatePath } from '../../lib/router';
import { ReadOnlyProductsTable } from '../../components/shared/read-only-products-table';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0 ?';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};



const StatusTimeline = ({ deliveryStatus }: { deliveryStatus?: OrderDeliveryStatus }) => {
    const steps = [
        { name: 'Ch? l?y h�ng', icon: PackageSearch },
        { name: '�� l?y h�ng', icon: PackageCheck },
        { name: '�ang giao h�ng', icon: Truck },
        { name: '�� giao h�ng', icon: Home },
    ];

    let currentStepIndex = -1;
    switch (deliveryStatus) {
        case 'Ch? l?y h�ng': currentStepIndex = 0; break;
        case '�ang giao h�ng': currentStepIndex = 2; break; // Assume '�� l?y h�ng' is skipped visually for simplicity
        case '�� giao h�ng': currentStepIndex = 3; break;
        default: currentStepIndex = -1;
    }
    
    return (
        <div className="flex items-start justify-between w-full p-4">
            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                    <React.Fragment key={step.name}>
                        <div className="flex flex-col items-center text-center w-24">
                             <div className={cn(
                                "flex items-center justify-center w-10 h-9 rounded-full border-2",
                                isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                isCurrent ? "border-primary text-primary" :
                                "border-border bg-muted text-muted-foreground"
                            )}>
                                {isCompleted ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                            </div>
                            <p className={cn("text-sm mt-2 font-medium", isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground")}>{step.name}</p>
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
    const { data: allOrders, dispatchFromWarehouse } = useOrderStore();
    const { findById: findShipmentById } = useShipmentStore();
    const { findById: findCustomerById } = useCustomerStore();
    const { findById: findProductById } = useProductStore();
    const { findBySystemId: findStorageLocationBySystemId } = useStorageLocationStore();
    const { employee: authEmployee } = useAuth();
    const currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM';

    // Comments state with localStorage persistence
    type ShipmentComment = CommentType<SystemId>;
    const [comments, setComments] = React.useState<ShipmentComment[]>(() => {
        const saved = localStorage.getItem(`shipment-comments-${systemId}`);
        return saved ? JSON.parse(saved) : [];
    });

    React.useEffect(() => {
        if (systemId) {
            localStorage.setItem(`shipment-comments-${systemId}`, JSON.stringify(comments));
        }
    }, [comments, systemId]);

    const handleAddComment = React.useCallback((content: string, attachments?: string[], parentId?: string) => {
        const newComment: ShipmentComment = {
            id: asSystemId(`comment-${Date.now()}`),
            content,
            author: {
                systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
                name: authEmployee?.fullName || 'H? th?ng',
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
        name: authEmployee?.fullName || 'H? th?ng',
        avatar: authEmployee?.avatar,
    }), [authEmployee]);

    // Find shipment by systemId (SHIPMENT000001)
    const shipment = React.useMemo(() => {
        if (!systemId) return null;
        return findShipmentById(systemId);
    }, [systemId, findShipmentById]);

    // Find order and packaging using shipment's links
    const { order, packaging } = React.useMemo(() => {
        if (!shipment) return { order: null, packaging: null };
        
        const o = allOrders.find(ord => ord.systemId === shipment.orderSystemId);
        if (!o) return { order: null, packaging: null };
        
        const p = o.packagings.find(pkg => pkg.systemId === shipment.packagingSystemId);
        return { order: o, packaging: p };
    }, [shipment, allOrders]);
    
    const customer = React.useMemo(() => {
        if (!order) return null;
        return findCustomerById(order.customerSystemId);
    }, [order, findCustomerById]);
    
    const handleDispatchAll = React.useCallback(() => {
        if (order && packaging) {
            dispatchFromWarehouse(order.systemId, packaging.systemId, currentUserSystemId);
        }
    }, [order, packaging, dispatchFromWarehouse, currentUserSystemId]);

    const { findById: findBranchById } = useBranchStore();
    const { info: storeInfo } = useStoreInfoStore();
    const { print } = usePrint(order?.branchSystemId);

    const handlePrint = React.useCallback(() => {
        if (!shipment || !order || !packaging) return;

        const branch = order.branchSystemId ? findBranchById(order.branchSystemId) : undefined;

        // Use helper to prepare print data
        const storeSettings = createStoreSettings(storeInfo);
        const deliveryForPrint = convertShipmentToDeliveryForPrint(shipment, order, { 
            customer, 
            branch: branch || undefined,
        });

        const printData = mapDeliveryToPrintData(deliveryForPrint, storeSettings);
        const lineItems = mapDeliveryLineItems(deliveryForPrint.items);

        // Inject extra fields
        printData['amount_text'] = numberToWords(order.finalAmount);

        print('delivery', {
            data: printData,
            lineItems: lineItems
        });
    }, [shipment, order, packaging, customer, storeInfo, print, findBranchById]);

    const headerActions = React.useMemo(() => {
        const actions: React.ReactNode[] = [];

        if (packaging?.deliveryStatus === 'Ch? l?y h�ng') {
            actions.push(
                <Button
                    key="dispatch"
                    size="sm"
                    className="h-9 gap-2"
                    onClick={handleDispatchAll}
                >
                    <PackagePlus className="h-4 w-4" />
                    Xu?t kho
                </Button>
            );
        }

        actions.push(
            <Button
                key="print"
                variant="outline"
                size="sm"
                className="h-9 gap-2"
                onClick={handlePrint}
            >
                <Printer className="h-4 w-4" />
                In phi?u
            </Button>
        );

        if (order) {
            actions.push(
                <Button
                    key="order"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2"
                    onClick={() => router.push(generatePath(ROUTES.SALES.ORDER_VIEW, { systemId: order.systemId }))}
                >
                    <Package className="h-4 w-4" />
                    Xem don h�ng
                </Button>
            );
        }

        actions.push(
            <Button
                key="help"
                variant="ghost"
                size="sm"
                className="h-9 gap-2"
                onClick={() => alert('Ch?c nang dang ph�t tri?n')}
            >
                <LifeBuoy className="h-4 w-4" />
                Tr? gi�p
            </Button>
        );

        actions.push(
            <Button
                key="back"
                variant="outline"
                size="sm"
                className="h-9 gap-2"
                onClick={() => router.push(ROUTES.INTERNAL.SHIPMENTS)}
            >
                <ArrowLeft className="h-4 w-4" />
                V? danh s�ch
            </Button>
        );

        return actions;
    }, [packaging, order, handleDispatchAll, router]);

    const detailBreadcrumb = React.useMemo(() => {
        const shipmentLabel = shipment?.id ?? 'Chi ti?t v?n don';
        return [
            { label: 'Trang ch?', href: ROUTES.DASHBOARD },
            { label: 'V?n chuy?n', href: ROUTES.INTERNAL.SHIPMENTS },
            { label: shipmentLabel, href: shipment ? generatePath(ROUTES.INTERNAL.SHIPMENT_VIEW, { systemId: shipment.systemId }) : ROUTES.INTERNAL.SHIPMENTS }
        ];
    }, [shipment]);

    const statusBadge = React.useMemo(() => {
        if (!packaging) return undefined;
        const variantMap: Partial<Record<OrderDeliveryStatus, "warning" | "default" | "success" | "destructive">> = {
            "Ch? l?y h�ng": "warning",
            "Ch? d�ng g�i": "default",
            "�ang giao h�ng": "default",
            "�� giao h�ng": "success",
            "Ch? giao l?i": "warning",
            "�� h?y": "destructive",
        };
        const variant = variantMap[packaging.deliveryStatus || 'Ch? l?y h�ng'] ?? 'default';
        return (
            <Badge variant={variant} className="capitalize">
                {packaging.deliveryStatus || 'Ch? l?y h�ng'}
            </Badge>
        );
    }, [packaging]);

    usePageHeader({
        title: shipment ? `V?n don ${shipment.id}` : 'Chi ti?t v?n don',
        badge: statusBadge,
        showBackButton: true,
        backPath: ROUTES.INTERNAL.SHIPMENTS,
        actions: headerActions,
        breadcrumb: detailBreadcrumb,
    });

    if (!shipment || !order || !packaging) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-h3 font-bold">Kh�ng t�m th?y v?n don</h2>
                    <Button onClick={() => router.push('/shipments')} className="mt-4">
                        Quay v? danh s�ch
                    </Button>
                </div>
            </div>
        );
    }
    
    const totalValue = order.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Mock status history
    const statusHistory = [
        { status: 'Ch? l?y h�ng', time: packaging.requestDate, details: '�on h�ng d� du?c d�ng g�i v� s?n s�ng b�n giao cho �TVC.' },
        ...(packaging.deliveryStatus === '�ang giao h�ng' || packaging.deliveryStatus === '�� giao h�ng' ? [{ status: '�ang giao h�ng', time: order.dispatchedDate, details: `�on h�ng dang du?c giao b?i ${packaging.carrier || 'd?i t�c v?n chuy?n'}.` }] : []),
        ...(packaging.deliveryStatus === '�� giao h�ng' ? [{ status: '�� giao h�ng', time: packaging.deliveredDate, details: 'Giao h�ng th�nh c�ng.' }] : []),
    ];

    const deliveryStatusVariant: Partial<Record<OrderDeliveryStatus, "warning" | "default" | "success" | "destructive">> = {
        "Ch? l?y h�ng": "warning",
        "Ch? d�ng g�i": "default",
        "�ang giao h�ng": "default",
        "�� giao h�ng": "success",
        "Ch? giao l?i": "warning",
        "�� h?y": "destructive",
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Status Badge + Timeline */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                        <span className="text-sm text-muted-foreground">
                            �on h�ng: <Link href={`/orders/${order.systemId}`} className="text-primary hover:underline font-medium">{order.id}</Link>
                        </span>
                    </div>
                    <StatusTimeline deliveryStatus={packaging.deliveryStatus} />
                </CardContent>
            </Card>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                {/* Right Column - Customer & Shipping Info */}
                <div className="space-y-4 lg:order-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-h6 font-semibold">Th�ng tin ngu?i nh?n</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            {customer ? (
                                <Link href={`/customers/${customer.systemId}`}
                                    className="font-semibold text-primary hover:underline block"
                                >
                                    {order.customerName}
                                </Link>
                            ) : (
                                <p className="font-semibold">{order.customerName}</p>
                            )}
                            <p className="text-muted-foreground">{customer?.phone || '---'}</p>
                            <p className="text-muted-foreground">
                                {[customer?.shippingAddress_street, customer?.shippingAddress_ward, customer?.shippingAddress_province].filter(Boolean).join(', ') || 'Chua c� d?a ch?'}
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-h6 font-semibold">Th�ng tin d?i t�c v?n chuy?n</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <DetailField label="H�ng v?n chuy?n" value={packaging.carrier || 'Chua c�'} />
                            <DetailField label="D?ch v?" value={packaging.service || 'Chua c�'} />
                            <DetailField label="B�n tr? ph�" value={packaging.payer || 'Chua c�'} />
                            <DetailField label="Ph� v?n chuy?n" value={formatCurrency(packaging.shippingFeeToPartner || 0)} />
                            <DetailField label="Thu h? (COD)" value={formatCurrency(packaging.codAmount || 0)} />
                            {packaging.trackingCode && (
                                <DetailField label="M� v?n don" value={packaging.trackingCode} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Left Column - Status History Timeline */}
                <Card className="lg:col-span-2 lg:order-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-h6 font-semibold">L?ch s? tr?ng th�i don giao h�ng</CardTitle>
                        <Button  
                            variant="link" 
                            size="sm" 
                            className="h-auto p-0"
                            onClick={() => alert('Ch?c nang l?ch s? chi ti?t dang ph�t tri?n')}
                        >
                            <History className="mr-1.5 h-4 w-4" />
                            Xem chi ti?t
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Timeline>
                            {statusHistory.map((item, index) => (
                                <TimelineItem key={index} time={item.time}>
                                    <p className="font-semibold">{item.status}</p>
                                    <p className="text-muted-foreground text-sm mt-1">{item.details}</p>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    </CardContent>
                </Card>
            </div>

            {/* Product Details Table */}
            <ReadOnlyProductsTable 
                lineItems={order.lineItems}
                getStorageLocationName={(product: Product | undefined) => {
                    if (!product?.storageLocationSystemId) return '---';
                    const loc = findStorageLocationBySystemId(product.storageLocationSystemId);
                    return loc?.name || '---';
                }}
                summary={{
                    subtotal: totalValue,
                    grandTotal: totalValue,
                }}
                grandTotalLabel="T?ng c?ng"
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
                title="B�nh lu?n"
                placeholder="Th�m b�nh lu?n v? v?n don..."
            />

            {/* Activity History */}
            <ActivityHistory
                history={shipment.activityHistory || []}
                title="L?ch s? ho?t d?ng"
                emptyMessage="Chua c� l?ch s? ho?t d?ng"
                groupByDate
                maxHeight="400px"
            />
        </div>
    );
}
