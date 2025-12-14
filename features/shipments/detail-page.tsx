import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrderStore } from '../orders/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useProductStore } from '../products/store.ts';
import { useShipmentStore } from './store.ts';
import { useStorageLocationStore } from '../settings/inventory/storage-location-store.ts';
import type { Product } from '../products/types.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Comments, type Comment as CommentType } from '../../components/Comments.tsx';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory.tsx';
import { asSystemId, type SystemId } from '../../lib/id-types.ts';
import { Check, Truck, Package, Home, PackageCheck, PackageSearch, History, ArrowLeft, LifeBuoy, PackagePlus, Printer } from 'lucide-react';
import { usePrint } from '../../lib/use-print.ts';
import { 
  convertShipmentToDeliveryForPrint,
  mapDeliveryToPrintData, 
  mapDeliveryLineItems,
  createStoreSettings,
} from '../../lib/print/shipment-print-helper.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { useStoreInfoStore } from '../settings/store-info/store-info-store.ts';
import { numberToWords } from '../../lib/print-mappers/types.ts';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Timeline, TimelineItem } from '../../components/ui/timeline.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { cn } from '../../lib/utils.ts';
import type { OrderDeliveryStatus } from '../orders/types.ts';
import { useAuth } from '../../contexts/auth-context.tsx';
import { ROUTES, generatePath } from '../../lib/router.ts';
import { ReadOnlyProductsTable } from '../../components/shared/read-only-products-table.tsx';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};



const StatusTimeline = ({ deliveryStatus }: { deliveryStatus?: OrderDeliveryStatus }) => {
    const steps = [
        { name: 'Chờ lấy hàng', icon: PackageSearch },
        { name: 'Đã lấy hàng', icon: PackageCheck },
        { name: 'Đang giao hàng', icon: Truck },
        { name: 'Đã giao hàng', icon: Home },
    ];

    let currentStepIndex = -1;
    switch (deliveryStatus) {
        case 'Chờ lấy hàng': currentStepIndex = 0; break;
        case 'Đang giao hàng': currentStepIndex = 2; break; // Assume 'Đã lấy hàng' is skipped visually for simplicity
        case 'Đã giao hàng': currentStepIndex = 3; break;
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
    const navigate = useNavigate();
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

        if (packaging?.deliveryStatus === 'Chờ lấy hàng') {
            actions.push(
                <Button
                    key="dispatch"
                    size="sm"
                    className="h-9 gap-2"
                    onClick={handleDispatchAll}
                >
                    <PackagePlus className="h-4 w-4" />
                    Xuất kho
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
                In phiếu
            </Button>
        );

        if (order) {
            actions.push(
                <Button
                    key="order"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2"
                    onClick={() => navigate(generatePath(ROUTES.SALES.ORDER_VIEW, { systemId: order.systemId }))}
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
                className="h-9 gap-2"
                onClick={() => alert('Chức năng đang phát triển')}
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
                className="h-9 gap-2"
                onClick={() => navigate(ROUTES.INTERNAL.SHIPMENTS)}
            >
                <ArrowLeft className="h-4 w-4" />
                Về danh sách
            </Button>
        );

        return actions;
    }, [packaging, order, handleDispatchAll, navigate]);

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
        const variantMap: Partial<Record<OrderDeliveryStatus, "warning" | "default" | "success" | "destructive">> = {
            "Chờ lấy hàng": "warning",
            "Chờ đóng gói": "default",
            "Đang giao hàng": "default",
            "Đã giao hàng": "success",
            "Chờ giao lại": "warning",
            "Đã hủy": "destructive",
        };
        const variant = variantMap[packaging.deliveryStatus || 'Chờ lấy hàng'] ?? 'default';
        return (
            <Badge variant={variant} className="capitalize">
                {packaging.deliveryStatus || 'Chờ lấy hàng'}
            </Badge>
        );
    }, [packaging]);

    usePageHeader({
        title: shipment ? `Vận đơn ${shipment.id}` : 'Chi tiết vận đơn',
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
                    <h2 className="text-h3 font-bold">Không tìm thấy vận đơn</h2>
                    <Button onClick={() => navigate('/shipments')} className="mt-4">
                        Quay về danh sách
                    </Button>
                </div>
            </div>
        );
    }
    
    const totalValue = order.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Mock status history
    const statusHistory = [
        { status: 'Chờ lấy hàng', time: packaging.requestDate, details: 'Đơn hàng đã được đóng gói và sẵn sàng bàn giao cho ĐTVC.' },
        ...(packaging.deliveryStatus === 'Đang giao hàng' || packaging.deliveryStatus === 'Đã giao hàng' ? [{ status: 'Đang giao hàng', time: order.dispatchedDate, details: `Đơn hàng đang được giao bởi ${packaging.carrier || 'đối tác vận chuyển'}.` }] : []),
        ...(packaging.deliveryStatus === 'Đã giao hàng' ? [{ status: 'Đã giao hàng', time: packaging.deliveredDate, details: 'Giao hàng thành công.' }] : []),
    ];

    const deliveryStatusVariant: Partial<Record<OrderDeliveryStatus, "warning" | "default" | "success" | "destructive">> = {
        "Chờ lấy hàng": "warning",
        "Chờ đóng gói": "default",
        "Đang giao hàng": "default",
        "Đã giao hàng": "success",
        "Chờ giao lại": "warning",
        "Đã hủy": "destructive",
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Status Badge + Timeline */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                        <span className="text-sm text-muted-foreground">
                            Đơn hàng: <Link to={`/orders/${order.systemId}`} className="text-primary hover:underline font-medium">{order.id}</Link>
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
                            <CardTitle className="text-h6 font-semibold">Thông tin người nhận</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            {customer ? (
                                <Link 
                                    to={`/customers/${customer.systemId}`}
                                    className="font-semibold text-primary hover:underline block"
                                >
                                    {order.customerName}
                                </Link>
                            ) : (
                                <p className="font-semibold">{order.customerName}</p>
                            )}
                            <p className="text-muted-foreground">{customer?.phone || '---'}</p>
                            <p className="text-muted-foreground">
                                {[customer?.shippingAddress_street, customer?.shippingAddress_ward, customer?.shippingAddress_province].filter(Boolean).join(', ') || 'Chưa có địa chỉ'}
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-h6 font-semibold">Thông tin đối tác vận chuyển</CardTitle>
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
                <Card className="lg:col-span-2 lg:order-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-h6 font-semibold">Lịch sử trạng thái đơn giao hàng</CardTitle>
                        <Button  
                            variant="link" 
                            size="sm" 
                            className="h-auto p-0"
                            onClick={() => alert('Chức năng lịch sử chi tiết đang phát triển')}
                        >
                            <History className="mr-1.5 h-4 w-4" />
                            Xem chi tiết
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
            <ActivityHistory
                history={shipment.activityHistory || []}
                title="Lịch sử hoạt động"
                emptyMessage="Chưa có lịch sử hoạt động"
                groupByDate
                maxHeight="400px"
            />
        </div>
    );
}
