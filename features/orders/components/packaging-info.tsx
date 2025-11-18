import * as React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { Order, Packaging, PackagingStatus, OrderDeliveryStatus } from '../types.ts';
import { Button } from '../../../components/ui/button.tsx';
import { DetailField } from '../../../components/ui/detail-field.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu.tsx';
import { cn } from '../../../lib/utils.ts';
import { Truck, PackageSearch, PackageCheck, Ban, Edit, Printer, ChevronRight, ChevronDown, Copy, Check, Info, AlertCircle } from 'lucide-react';
import { Separator } from '../../../components/ui/separator.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { getGHTKStatusVariant, getGHTKStatusText } from '../../../lib/ghtk-constants.ts';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};



const packagingStatusIcons: Record<PackagingStatus, React.ElementType> = {
    'Chờ đóng gói': PackageSearch,
    'Đã đóng gói': PackageCheck,
    'Hủy đóng gói': Ban,
};

const packagingStatusColors: Record<PackagingStatus, string> = {
    'Chờ đóng gói': 'text-amber-500',
    'Đã đóng gói': 'text-green-500',
    'Hủy đóng gói': 'text-red-500',
};

interface PackagingInfoProps {
    order: Order;
    packaging: Packaging;
    isActionable: boolean;
    onConfirmPackaging: () => void;
    onCancelPackaging: () => void;
    onOpenShipmentDialog: () => void;
    onInStorePickup: () => void;
    onDispatch: () => void;
    onCompleteDelivery: () => void;
    onFailDelivery: () => void;
    onCancelDelivery: () => void;
    onCancelGHTKShipment?: () => void; // NEW: Cancel GHTK shipment
}

export function PackagingInfo({
    order,
    packaging,
    isActionable,
    onConfirmPackaging,
    onCancelPackaging,
    onOpenShipmentDialog,
    onInStorePickup,
    onDispatch,
    onCompleteDelivery,
    onFailDelivery,
    onCancelDelivery,
    onCancelGHTKShipment,
}: PackagingInfoProps) {
    // ✅ If cancelled, default to collapsed
    const isCancelled = packaging.deliveryStatus === 'Đã hủy' || packaging.status === 'Hủy đóng gói';
    const [isExpanded, setIsExpanded] = React.useState(!isCancelled);
    const [isCopied, setIsCopied] = React.useState(false);

    const displayStatusText = React.useMemo(() => {
        // ✅ If delivery is cancelled, always show "Đã hủy"
        if (packaging.deliveryStatus === 'Đã hủy') {
            return 'Đã hủy';
        }
        
        if (packaging.partnerStatus) {
            return packaging.partnerStatus;
        }
        const deliverySpecificStatuses: OrderDeliveryStatus[] = ['Chờ lấy hàng', 'Đang giao hàng', 'Đã giao hàng', 'Chờ giao lại'];
        if (packaging.deliveryStatus && deliverySpecificStatuses.includes(packaging.deliveryStatus)) {
            return packaging.deliveryStatus;
        }
        return packaging.status;
    }, [packaging.partnerStatus, packaging.deliveryStatus, packaging.status]);

    // ✅ Use appropriate icon and color for cancelled status
    const Icon = (packaging.deliveryStatus === 'Đã hủy' || packaging.status === 'Hủy đóng gói') 
        ? Ban 
        : (packaging.deliveryStatus && !['Chờ đóng gói', 'Đã đóng gói'].includes(packaging.deliveryStatus) ? Truck : packagingStatusIcons[packaging.status]);
    
    const color = (packaging.deliveryStatus === 'Đã hủy' || packaging.status === 'Hủy đóng gói')
        ? 'text-red-500'
        : (packaging.deliveryStatus && !['Chờ đóng gói', 'Đã đóng gói'].includes(packaging.deliveryStatus) ? 'text-primary' : packagingStatusColors[packaging.status]);
    
    const getDisplayDateForPackage = (pkg: Packaging, order: Order) => {
        if (pkg.status === 'Hủy đóng gói') {
            return pkg.cancelDate || pkg.requestDate;
        }
        switch (pkg.deliveryStatus) {
            case 'Đã giao hàng':
                return pkg.deliveredDate || order.completedDate || pkg.confirmDate || pkg.requestDate;
            case 'Đang giao hàng':
                return order.dispatchedDate || pkg.confirmDate || pkg.requestDate;
            default: // Chờ lấy hàng, Đã đóng gói, Chờ đóng gói
                if (pkg.status === 'Đã đóng gói') {
                    return pkg.confirmDate || pkg.requestDate;
                }
                return pkg.requestDate;
        }
    };
    const displayDate = getDisplayDateForPackage(packaging, order);

    const handleCopy = () => {
        if (packaging.trackingCode) {
            navigator.clipboard.writeText(packaging.trackingCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const renderActionButtons = () => {
        if (!isActionable) return null;
        
        // ✅ Không hiển thị action nếu đã hủy
        if (packaging.deliveryStatus === 'Đã hủy' || packaging.status === 'Hủy đóng gói') {
            return null;
        }
    
        if (packaging.status === 'Chờ đóng gói') {
            return (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={onCancelPackaging}>Hủy yêu cầu</Button>
                    <Button size="sm" onClick={onConfirmPackaging}>Xác nhận đã đóng gói</Button>
                </div>
            );
        }

        if (packaging.status === 'Đã đóng gói' && !packaging.deliveryMethod) {
            return (
                <div className="flex items-center gap-2">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-destructive text-destructive hover:bg-destructive/5"
                        onClick={onCancelPackaging}
                    >
                        Hủy đóng gói
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button size="sm" variant="outline">Giao hàng <ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={onOpenShipmentDialog}>Đẩy qua hãng vận chuyển</DropdownMenuItem>
                            <DropdownMenuItem disabled>Tự gọi shipper</DropdownMenuItem>
                            <DropdownMenuItem onSelect={onInStorePickup}>Khách nhận tại cửa hàng</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        }

        if (packaging.deliveryMethod === 'Nhận tại cửa hàng' && packaging.deliveryStatus === 'Đã đóng gói') {
            return (
                <div className="flex items-center gap-2">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-destructive text-destructive hover:bg-destructive/5"
                        onClick={onCancelPackaging}
                    >
                        Hủy đóng gói
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                                Giao hàng <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={onOpenShipmentDialog}>Đẩy qua hãng vận chuyển</DropdownMenuItem>
                            <DropdownMenuItem disabled>Tự gọi shipper</DropdownMenuItem>
                            <DropdownMenuItem onSelect={onInStorePickup}>Khách nhận tại cửa hàng</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" onClick={onDispatch}>Xác nhận Xuất kho</Button>
                </div>
            );
        }

        if (packaging.deliveryStatus === 'Chờ lấy hàng') {
            // Check if can cancel GHTK shipment
            const canCancelGHTK = packaging.carrier === 'GHTK' && 
                                  packaging.trackingCode && 
                                  packaging.ghtkStatusId && 
                                  [1, 2, 12].includes(packaging.ghtkStatusId) &&
                                  onCancelGHTKShipment;
            
            return (
                <div className="flex items-center gap-2">
                    {canCancelGHTK ? (
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-destructive text-destructive hover:bg-destructive/5"
                            onClick={onCancelGHTKShipment}
                        >
                            Hủy vận đơn GHTK
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" onClick={() => onCancelDelivery()}>Hủy giao hàng</Button>
                    )}
                    <Button size="sm" onClick={onDispatch}>Xác nhận Xuất kho</Button>
                </div>
            );
        }
        
         if (packaging.deliveryStatus === 'Đang giao hàng') {
            return (
                <div className="flex items-center gap-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/5 hover:text-destructive">Hủy/Thất bại</Button></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={onFailDelivery}>Giao thất bại</DropdownMenuItem>
                            <DropdownMenuItem onSelect={onCancelDelivery}>Hủy giao hàng</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" onClick={onCompleteDelivery}>Đã giao hàng</Button>
                </div>
            );
        }
        
         if (packaging.deliveryStatus === 'Chờ giao lại') {
            return (
                 <Button size="sm" onClick={onOpenShipmentDialog}>Tạo lại đơn giao hàng</Button>
            )
         }


        return null;
    };

    return (
        <div className="border rounded-md bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b">
                 <div className="flex items-center gap-2 flex-grow cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <Icon className={cn("h-5 w-5", color)} />
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{displayStatusText}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(displayDate)}</p>
                        
                        {/* GHTK Status Badge */}
                        {packaging.carrier === 'GHTK' && packaging.ghtkStatusId !== undefined && (
                            <Badge variant={getGHTKStatusVariant(packaging.ghtkStatusId)} className="text-xs">
                                {getGHTKStatusText(packaging.ghtkStatusId)}
                            </Badge>
                        )}
                    </div>
                    {packaging.trackingCode && (
                        <>
                            <Separator orientation="vertical" className="h-4 mx-2" />
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-mono text-primary">{packaging.trackingCode}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleCopy(); }}>
                                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                            </div>
                        </>
                    )}
                    
                    {/* GHTK Reason Tooltip */}
                    {packaging.carrier === 'GHTK' && packaging.ghtkReasonText && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <AlertCircle className="h-4 w-4 text-amber-500" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p className="font-semibold mb-1">Lý do:</p>
                                    <p>{packaging.ghtkReasonText}</p>
                                    {packaging.ghtkReasonCode && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Mã: {packaging.ghtkReasonCode}
                                        </p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {renderActionButtons()}
                    {/* ✅ Print button next to toggle */}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            
            {/* Content */}
            {isExpanded && (
                <div className="p-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 text-sm gap-x-6 gap-y-1">
                        <DetailField label="Mã đóng gói" className="py-1 border-0">
                            <Link to={`/packaging/${packaging.systemId}`} className="font-mono text-primary hover:underline">{packaging.id}</Link>
                        </DetailField>
                        <DetailField label="Mã vận đơn" value={packaging.trackingCode} className="py-1 border-0" />
                        
                        {packaging.deliveryMethod === 'Dịch vụ giao hàng' ? (
                            <>
                                <DetailField label="Phí trả ĐTVC" value={formatCurrency(packaging.shippingFeeToPartner)} className="py-1 border-0" />
                                <DetailField label="Vận chuyển bởi" value={packaging.carrier} className="py-1 border-0" />
                                <DetailField label="Tổng tiền thu hộ COD" value={formatCurrency(packaging.codAmount)} className="py-1 border-0" />
                                <DetailField label="Người trả phí" value={packaging.payer} className="py-1 border-0" />
                                <DetailField label="Đối soát" value={packaging.reconciliationStatus} className="py-1 border-0" />
                                <DetailField label="Hình thức giao" value={packaging.deliveryMethod} className="py-1 border-0" />
                                {packaging.weight && (
                                    <DetailField label="Trọng lượng" value={`${packaging.weight}g`} className="py-1 border-0" />
                                )}
                                {packaging.dimensions && (
                                    <DetailField label="Kích thước" value={packaging.dimensions} className="py-1 border-0" />
                                )}
                                <DetailField label="Ghi chú" value={packaging.noteToShipper} className="py-1 border-0 col-span-full" />
                            </>
                        ) : (
                            <>
                                <DetailField label="NV được gán" value={packaging.assignedEmployeeName} className="py-1 border-0" />
                                <DetailField label="Người YC" value={packaging.requestingEmployeeName} className="py-1 border-0" />
                                {packaging.status !== 'Chờ đóng gói' && <DetailField label="Người xác nhận" value={packaging.confirmingEmployeeName} className="py-1 border-0" />}
                                <DetailField label="Hình thức giao" value={packaging.deliveryMethod} className="py-1 border-0" />
                            </>
                        )}
                        {/* ✅ Show canceller info for cancelled packaging or delivery */}
                        {(packaging.status === 'Hủy đóng gói' || packaging.deliveryStatus === 'Đã hủy') && (
                            <>
                                <DetailField label="Người hủy" value={packaging.cancelingEmployeeName || '-'} className="py-1 border-0" />
                                <DetailField label="Lý do hủy" value={packaging.cancelReason || '-'} className="py-1 border-0 col-span-full md:col-span-2" />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
