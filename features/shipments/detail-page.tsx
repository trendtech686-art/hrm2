import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { useOrderStore } from '../orders/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useProductStore } from '../products/store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { HelpCircle, Check, Truck, Package, Home, ThumbsUp, PackageCheck, PackageSearch, PackageX, History } from 'lucide-react';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table.tsx';
import { Timeline, TimelineItem } from '../../components/ui/timeline.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { cn } from '../../lib/utils.ts';
import type { OrderDeliveryStatus } from '../orders/types.ts';
import { useAuth } from '../../contexts/auth-context.tsx';
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
    const { findById: findCustomerById } = useCustomerStore();
    const { findById: findProductById } = useProductStore();
    const { employee: authEmployee } = useAuth();
    const currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM';

    const { order, packaging } = React.useMemo(() => {
        if (!systemId) return { order: null, packaging: null };
        for (const o of allOrders) {
            const p = o.packagings.find(pkg => pkg.systemId === systemId);
            if (p) {
                return { order: o, packaging: p };
            }
        }
        return { order: null, packaging: null };
    }, [systemId, allOrders]);
    
    const customer = React.useMemo(() => {
        if (!order) return null;
        return findCustomerById(order.customerSystemId);
    }, [order, findCustomerById]);
    
    const pageActions = React.useMemo(() => {
        if (!packaging) return null;
        
        return (
            <div className="flex items-center gap-2 flex-wrap">
                {packaging.deliveryStatus === 'Chờ lấy hàng' && (
                    <Button 
                        size="sm" 
                        onClick={() => {
                            if (order && packaging) {
                                dispatchFromWarehouse(order.systemId, packaging.systemId, currentUserSystemId);
                            }
                        }}
                    >
                        Xuất kho toàn bộ
                    </Button>
                )}
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/shipments')}
                >
                    Quay lại
                </Button>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => alert('Chức năng đang phát triển')}
                >
                    Trợ giúp
                </Button>
            </div>
        );
    }, [packaging, order, currentUserSystemId, navigate]);

    usePageHeader({
        title: `Vận đơn ${packaging?.id || ''}`,
        actions: pageActions ? [pageActions] : []
    });

    if (!order || !packaging) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Không tìm thấy vận đơn</h2>
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
                    <div className="flex items-center gap-3 mb-4">
                        <Badge variant={deliveryStatusVariant[packaging.deliveryStatus || 'Chờ lấy hàng']}>
                            {packaging.deliveryStatus || 'Chờ lấy hàng'}
                        </Badge>
                        <Separator orientation="vertical" className="h-6" />
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
                            <CardTitle className="text-base font-semibold">Thông tin người nhận</CardTitle>
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
                            <CardTitle className="text-base font-semibold">Thông tin đối tác vận chuyển</CardTitle>
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
                        <CardTitle className="text-base font-semibold">Lịch sử trạng thái đơn giao hàng</CardTitle>
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
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Chi tiết phiếu giao hàng</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã SKU</TableHead>
                                    <TableHead>Tên sản phẩm</TableHead>
                                    <TableHead className="text-center">Số lượng</TableHead>
                                    <TableHead className="text-right">Đơn giá</TableHead>
                                    <TableHead className="text-right">Thành tiền</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.lineItems.map(item => {
                                    const product = findProductById(item.productSystemId);
                                    return (
                                        <TableRow key={item.productSystemId}>
                                            <TableCell>
                                                {product ? (
                                                    <Link 
                                                        to={`/products/${product.systemId}`}
                                                        className="text-muted-foreground hover:text-primary hover:underline"
                                                    >
                                                        {item.productId}
                                                    </Link>
                                                ) : (
                                                    <span>{item.productId}</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {product ? (
                                                    <Link 
                                                        to={`/products/${product.systemId}`}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        {item.productName}
                                                    </Link>
                                                ) : (
                                                    <span className="font-medium">{item.productName}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(item.unitPrice * item.quantity)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4} className="text-right font-bold">Tổng cộng</TableCell>
                                    <TableCell className="text-right font-bold">{formatCurrency(totalValue)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
