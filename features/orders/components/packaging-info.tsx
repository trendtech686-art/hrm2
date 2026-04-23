import * as React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/date-utils';
import type { Order, Packaging, OrderDeliveryStatus } from '../types';
import { Button } from '../../../components/ui/button';
import { DetailField } from '../../../components/ui/detail-field';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { cn } from '../../../lib/utils';
import { Truck, PackageSearch, PackageCheck, Ban, Printer, ChevronRight, ChevronDown, Copy, Check, AlertCircle } from 'lucide-react';
import { Separator } from '../../../components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { Badge } from '../../../components/ui/badge';
import { getGHTKStatusVariant, getGHTKStatusText } from '../../../lib/ghtk-constants';
import { useBranchFinder } from '../../settings/branches/hooks/use-all-branches';
import { useCustomerFinder } from '../../customers/hooks/use-all-customers';
import { usePrint } from '@/lib/use-print';
import { mapPackingToPrintData, mapPackingLineItems } from '@/lib/print-mappers/packing.mapper';
import { mapShippingLabelToPrintData } from '@/lib/print-mappers/shipping-label.mapper';
import { mapDeliveryToPrintData, mapDeliveryLineItems } from '@/lib/print-mappers/delivery.mapper';
import { createStoreSettings } from '@/lib/print/order-print-helper';
import { toast } from 'sonner';
import type { SystemId } from '@/lib/id-types';
import { logError } from '@/lib/logger'
import { useBreakpoint } from '@/contexts/breakpoint-context';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};



const packagingStatusIcons: Record<string, React.ElementType> = {
    'Chờ đóng gói': PackageSearch,
    'Đã đóng gói': PackageCheck,
    'Hủy đóng gói': Ban,
    'PENDING': PackageSearch,
    'PACKED': PackageCheck,
    'CANCELLED': Ban,
};

const packagingStatusColors: Record<string, string> = {
    'Chờ đóng gói': 'text-amber-500',
    'Đã đóng gói': 'text-green-500',
    'Hủy đóng gói': 'text-red-500',
    'PENDING': 'text-amber-500',
    'PACKED': 'text-green-500',
    'CANCELLED': 'text-red-500',
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
    onCancelGHTKShipment?: (() => void) | undefined; // NEW: Cancel GHTK shipment
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
    const { isMobile } = useBreakpoint();
    // ✅ If cancelled, default to collapsed - Support both Vietnamese and English
    const isCancelled = packaging.deliveryStatus === 'Đã hủy' || 
                        packaging.deliveryStatus === 'CANCELLED' ||
                        packaging.status === 'Hủy đóng gói' || 
                        packaging.status === 'CANCELLED';
    const [isExpanded, setIsExpanded] = React.useState(!isCancelled);
    const [isCopied, setIsCopied] = React.useState(false);
    const { findById: findBranchById } = useBranchFinder();
    const { findById: findCustomerById } = useCustomerFinder();
    
    // Print functionality
    const branch = findBranchById(order.branchSystemId);
    const customer = findCustomerById(order.customerSystemId);
    const { print } = usePrint(order.branchSystemId);
    
    // Shipment is already included via packaging relation from API
    const shipment = packaging.shipment;

    const renderEmployeeLink = React.useCallback((employeeId?: SystemId, employeeName?: string) => {
        const resolvedName = employeeName;
        if (!employeeId && !resolvedName) {
            return '---';
        }

        if (!employeeId) {
            return resolvedName;
        }

        return (
            <Link href={`/employees/${employeeId}`} className="text-primary hover:underline">
                {resolvedName || employeeId}
            </Link>
        );
    }, []);

    const displayStatusText = React.useMemo(() => {
        // ✅ If delivery is cancelled, always show "Đã hủy"
        if (packaging.deliveryStatus === 'Đã hủy') {
            return 'Đã hủy';
        }
        
        if (packaging.partnerStatus) {
            return packaging.partnerStatus;
        }
        const deliverySpecificStatuses: OrderDeliveryStatus[] = ['Chờ lấy hàng', 'PENDING_SHIP', 'Đang giao hàng', 'SHIPPING', 'Đã giao hàng', 'DELIVERED', 'Chờ giao lại', 'RESCHEDULED'];
        if (packaging.deliveryStatus && deliverySpecificStatuses.includes(packaging.deliveryStatus)) {
            return packaging.deliveryStatus;
        }
        return packaging.status;
    }, [packaging.partnerStatus, packaging.deliveryStatus, packaging.status]);

    // ✅ Use appropriate icon and color for cancelled status - Support both Vietnamese and English
    const isCancelledForDisplay = packaging.deliveryStatus === 'Đã hủy' || 
                                   packaging.deliveryStatus === 'CANCELLED' ||
                                   packaging.status === 'Hủy đóng gói' || 
                                   packaging.status === 'CANCELLED';
    const isPackStatusForTruck = packaging.deliveryStatus && 
                                  !['Chờ đóng gói', 'Đã đóng gói', 'PENDING', 'PACKED', 'COMPLETED'].includes(packaging.deliveryStatus);
    
    const Icon = isCancelledForDisplay 
        ? Ban 
        : (isPackStatusForTruck ? Truck : packagingStatusIcons[packaging.status] || PackageSearch);
    
    const color = isCancelledForDisplay
        ? 'text-red-500'
        : (isPackStatusForTruck ? 'text-primary' : packagingStatusColors[packaging.status] || 'text-amber-500');
    
    const getDisplayDateForPackage = (pkg: Packaging, order: Order) => {
        // ✅ Support both Vietnamese and English enum values - cast to string for comparison
        const statusStr = String(pkg.status || '');
        const isCancelled = statusStr === 'Hủy đóng gói' || statusStr === 'CANCELLED';
        const isPacked = statusStr === 'Đã đóng gói' || statusStr === 'PACKED' || statusStr === 'COMPLETED';
        
        if (isCancelled) {
            return pkg.cancelDate || pkg.requestDate;
        }
        switch (pkg.deliveryStatus) {
            case 'Đã giao hàng':
            case 'DELIVERED':
                return pkg.deliveredDate || order.completedDate || pkg.confirmDate || pkg.requestDate;
            case 'Đang giao hàng':
            case 'SHIPPING':
                return order.dispatchedDate || pkg.confirmDate || pkg.requestDate;
            default: // Chờ lấy hàng, Đã đóng gói, Chờ đóng gói, etc.
                if (isPacked) {
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

    // === PRINT HANDLERS ===
    const storeSettings = React.useMemo(() => 
        createStoreSettings(branch)
    , [branch]);

    // Helper to safely get address fields
    const getShippingAddressField = React.useCallback(<T extends keyof import('../types').OrderAddress>(
        field: T
    ): import('../types').OrderAddress[T] | undefined => {
        if (typeof order.shippingAddress === 'string') return undefined;
        return order.shippingAddress?.[field];
    }, [order.shippingAddress]);

    const getFormattedShippingAddress = React.useCallback(() => {
        if (typeof order.shippingAddress === 'string') return order.shippingAddress;
        return order.shippingAddress?.formattedAddress || order.shippingAddress?.street || '';
    }, [order.shippingAddress]);

    const handlePrintPacking = React.useCallback(() => {
        const packingData = {
            code: packaging.id,
            createdAt: packaging.requestDate,
            packedAt: packaging.confirmDate,
            createdBy: packaging.requestingEmployeeName,
            orderCode: order.id,
            fulfillmentStatus: packaging.status,
            assignedEmployee: packaging.assignedEmployeeName,
            location: {
                name: branch?.name,
                address: branch?.address,
                province: branch?.province,
                phone: branch?.phone,
            },
            customerName: customer?.name || order.customerName || '',
            customerCode: customer?.id,
            customerPhone: customer?.phone || getShippingAddressField('phone'),
            customerAddress: customer?.addresses?.[0]?.street,
            shippingAddress: getFormattedShippingAddress(),
            shippingProvince: getShippingAddressField('province'),
            shippingDistrict: getShippingAddressField('district'),
            shippingWard: getShippingAddressField('ward'),
            items: order.lineItems.map(item => ({
                variantCode: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                price: item.unitPrice,
                amount: item.quantity * item.unitPrice,
                note: item.note,
            })),
            totalQuantity: order.lineItems.reduce((sum, item) => sum + item.quantity, 0),
            total: order.grandTotal,
            codAmount: packaging.codAmount,
            note: packaging.notes,
            orderNote: order.notes,
        };
        const printData = mapPackingToPrintData(packingData, storeSettings);
        const lineItems = mapPackingLineItems(packingData.items);
        print('packing', { data: printData, lineItems });
    }, [packaging, order, branch, customer, storeSettings, print, getShippingAddressField, getFormattedShippingAddress]);

    const handlePrintShippingLabel = React.useCallback(() => {
        const labelData = {
            orderCode: order.id,
            createdAt: packaging.requestDate,
            createdBy: packaging.requestingEmployeeName,
            status: packaging.status,
            location: {
                name: branch?.name,
                address: branch?.address,
                phone: branch?.phone,
                province: branch?.province,
            },
            customerName: getShippingAddressField('contactName') || customer?.name || order.customerName || '',
            customerPhone: getShippingAddressField('phone') || customer?.phone,
            shippingAddress: getFormattedShippingAddress(),
            city: getShippingAddressField('province'),
            district: getShippingAddressField('district'),
            receiverName: getShippingAddressField('contactName') || customer?.name || order.customerName || '',
            receiverPhone: getShippingAddressField('phone') || customer?.phone,
            trackingCode: packaging.trackingCode,
            carrierName: packaging.carrier,
            serviceName: packaging.service,
            totalItems: order.lineItems.reduce((sum, item) => sum + item.quantity, 0),
            total: order.grandTotal,
            deliveryFee: packaging.shippingFeeToPartner || order.shippingFee,
            codAmount: packaging.codAmount || order.codAmount,
            totalAmount: order.grandTotal,
            packingWeight: packaging.weight ? packaging.weight / 1000 : undefined, // Convert grams to kg
            note: packaging.noteToShipper,
        };
        const printData = mapShippingLabelToPrintData(labelData, storeSettings);
        print('shipping-label', { data: printData });
    }, [packaging, order, branch, customer, storeSettings, print, getShippingAddressField, getFormattedShippingAddress]);

    const handlePrintDelivery = React.useCallback(() => {
        const deliveryData = {
            code: packaging.trackingCode || packaging.id,
            orderCode: order.id,
            createdAt: packaging.requestDate,
            createdBy: packaging.requestingEmployeeName,
            shipperName: packaging.assignedEmployeeName,
            deliveryStatus: packaging.deliveryStatus || packaging.status,
            location: {
                name: branch?.name,
                address: branch?.address,
                phone: branch?.phone,
                province: branch?.province,
            },
            trackingCode: packaging.trackingCode,
            carrierName: packaging.carrier || (packaging.deliveryMethod === 'Dịch vụ giao hàng' ? 'Tự giao hàng' : ''),
            // Thông tin khách hàng
            customerName: customer?.name || order.customerName || '',
            customerCode: customer?.id,
            customerPhone: customer?.phone,
            customerEmail: customer?.email,
            // Thông tin người nhận
            receiverName: getShippingAddressField('contactName') || customer?.name || order.customerName || '',
            receiverPhone: getShippingAddressField('phone') || customer?.phone || '',
            shippingAddress: getFormattedShippingAddress(),
            city: getShippingAddressField('province'),
            district: getShippingAddressField('district'),
            ward: getShippingAddressField('ward'),
            // Danh sách sản phẩm
            items: order.lineItems.map(item => ({
                variantCode: item.productId,
                productName: item.productName,
                variantName: '',
                unit: 'Cái',
                quantity: item.quantity,
                price: item.unitPrice,
                amount: item.quantity * item.unitPrice,
                note: item.note,
            })),
            // Tổng giá trị
            totalQuantity: order.lineItems.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: order.subtotal,
            deliveryFee: order.shippingFee,
            codAmount: packaging.codAmount || order.codAmount,
            totalAmount: order.grandTotal,
            note: packaging.noteToShipper || order.notes,
        };
        const printData = mapDeliveryToPrintData(deliveryData, storeSettings);
        const lineItems = mapDeliveryLineItems(deliveryData.items);
        print('delivery', { data: printData, lineItems });
    }, [packaging, order, branch, customer, storeSettings, print, getShippingAddressField, getFormattedShippingAddress]);

    // ✅ In nhãn GHTK (lấy PDF từ GHTK có QR code)
    const handlePrintGHTKLabel = React.useCallback(async () => {
        if (!packaging.trackingCode || packaging.carrier !== 'GHTK') {
            toast.error('Không có mã vận đơn GHTK');
            return;
        }
        
        try {
            // Build URL - credentials are loaded server-side from database
            const url = new URL(`/api/shipping/ghtk/print-label/${packaging.trackingCode}`, window.location.origin);
            url.searchParams.set('original', 'portrait'); // dọc
            url.searchParams.set('page_size', 'A5');
            
            toast.info('Đang tải nhãn từ GHTK...');
            
            const response = await fetch(url.toString());
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Không thể lấy nhãn từ GHTK');
            }
            
            // PDF không thể print qua iframe ẩn (Chrome PDF viewer limitation)
            // → Mở popup nhỏ, auto-trigger print, auto-close sau khi in
            const pdfBlob = await response.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            const printWindow = window.open(pdfUrl, 'ghtkLabel', 'width=820,height=600,left=100,top=100');
            if (printWindow) {
                printWindow.addEventListener('load', () => {
                    setTimeout(() => {
                        printWindow.focus();
                        printWindow.print();
                    }, 500);
                });
                printWindow.addEventListener('afterprint', () => {
                    printWindow.close();
                });
                setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
            }
            
            toast.success('Đang mở hộp thoại in...');
        } catch (error) {
            logError('Error printing GHTK label', error);
            toast.error(error instanceof Error ? error.message : 'Lỗi in nhãn GHTK');
        }
    }, [packaging.trackingCode, packaging.carrier]);

    const renderActionButtons = () => {
        if (!isActionable) return null;
        
        // ✅ Cast to string for comparison - supports both Vietnamese and English enum values
        const statusStr = String(packaging.status || '');
        const deliveryStatusStr = String(packaging.deliveryStatus || '');
        
        // ✅ Không hiển thị action nếu đã hủy
        if (deliveryStatusStr === 'Đã hủy' || statusStr === 'Hủy đóng gói' || statusStr === 'CANCELLED') {
            return null;
        }
    
        const isPending = statusStr === 'Chờ đóng gói' || statusStr === 'PENDING';
        const isPacked = statusStr === 'Đã đóng gói' || statusStr === 'PACKED' || statusStr === 'COMPLETED';
        
        if (isPending) {
            return (
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={onCancelPackaging}>Hủy yêu cầu</Button>
                    <Button size="sm" onClick={onConfirmPackaging}>Xác nhận đã đóng gói</Button>
                </div>
            );
        }

        if (isPacked && !packaging.deliveryMethod) {
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

        // ✅ In-store pickup flow: show "Xác nhận Xuất kho" button
        // Check deliveryMethod indicates in-store pickup
        const isInStorePickup = packaging.deliveryMethod === 'Nhận tại cửa hàng' || 
                                 packaging.deliveryMethod === 'IN_STORE_PICKUP';
        if (isInStorePickup && (packaging.deliveryStatus === 'Đã đóng gói' || packaging.deliveryStatus === 'PACKED' || packaging.status === 'Đã đóng gói' || packaging.status === 'PACKED')) {
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
                    <Button size="sm" onClick={onDispatch}>Xác nhận Xuất kho</Button>
                </div>
            );
        }

        if (packaging.deliveryStatus === 'Chờ lấy hàng' || packaging.deliveryStatus === 'PENDING_SHIP') {
            // Check if has tracking code (đã có mã vận đơn từ đối tác vận chuyển)
            const hasTrackingCode = !!packaging.trackingCode;
            
            // ✅ Nếu là GHTK và có tracking code → phải gọi API hủy GHTK
            // Không cần check ghtkStatusId vì GHTK API sẽ trả về lỗi nếu không được phép hủy
            const isGHTKShipment = packaging.carrier === 'GHTK' && hasTrackingCode && onCancelGHTKShipment;
            
            return (
                <div className="flex items-center gap-2">
                    {hasTrackingCode ? (
                        // ✅ Có mã vận đơn: Hủy giao hàng (nếu là GHTK thì gọi API hủy GHTK)
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-destructive text-destructive hover:bg-destructive/5"
                            onClick={isGHTKShipment ? onCancelGHTKShipment : onCancelDelivery}
                        >
                            Hủy giao hàng
                        </Button>
                    ) : (
                        // ✅ Chưa có mã vận đơn: Hủy đóng gói
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-destructive text-destructive hover:bg-destructive/5"
                            onClick={onCancelPackaging}
                        >
                            Hủy đóng gói
                        </Button>
                    )}
                    <Button size="sm" onClick={onDispatch}>Xác nhận Xuất kho</Button>
                </div>
            );
        }
        
         if (packaging.deliveryStatus === 'Đang giao hàng' || packaging.deliveryStatus === 'SHIPPING') {
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
        
         if (packaging.deliveryStatus === 'Chờ giao lại' || packaging.deliveryStatus === 'RESCHEDULED') {
            return (
                 <Button size="sm" onClick={onOpenShipmentDialog}>Tạo lại đơn giao hàng</Button>
            )
         }


        return null;
    };

    return (
        <div className="border bg-background rounded-md max-md:-mx-4 max-md:rounded-none max-md:border-x-0">
            {/* Header */}
            <div className="flex flex-col p-3 border-b border-border gap-2">
                <div className="flex items-start sm:items-center justify-between gap-2">
                     <div role="button" tabIndex={0} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 grow cursor-pointer min-w-0" onClick={() => setIsExpanded(!isExpanded)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded); } }}>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <Icon className={cn("h-5 w-5 shrink-0", color)} />
                            <p className="text-sm font-semibold whitespace-nowrap">{displayStatusText}</p>
                            <p className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(displayDate)}</p>
                            
                            {/* GHTK Status Badge - Only show when ghtkStatusId is a valid number */}
                            {packaging.carrier === 'GHTK' && packaging.ghtkStatusId != null && (
                                <Badge variant={getGHTKStatusVariant(packaging.ghtkStatusId)} className="text-xs">
                                    {getGHTKStatusText(packaging.ghtkStatusId)}
                                </Badge>
                            )}
                        </div>
                        {packaging.trackingCode && (
                            <div className="flex items-center gap-1 min-w-0">
                                <Separator orientation="vertical" className="h-4 mx-1 hidden sm:block" />
                                <span className="text-sm text-primary truncate">{packaging.trackingCode}</span>
                                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={(e) => { e.stopPropagation(); handleCopy(); }}>
                                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                                </Button>
                            </div>
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
                    <div className="flex items-center gap-1 shrink-0">
                        {!isMobile && renderActionButtons()}
                        {/* ✅ Print button - In phiếu giao hàng */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        onClick={handlePrintDelivery}
                                    >
                                        <Printer className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>In phiếu giao hàng</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                {/* Mobile: action buttons on separate row */}
                {isMobile && renderActionButtons() && (
                    <div className="flex flex-wrap items-center gap-2">
                        {renderActionButtons()}
                    </div>
                )}
            </div>
            
            {/* Content */}
            {isExpanded && (
                <div className="p-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 text-sm gap-x-6 gap-y-1">
                        <DetailField label="Mã đóng gói" className="py-1 border-0">
                            <div className="flex items-center gap-1">
                                <Link href={`/packaging/${packaging.systemId}`} className="text-primary hover:underline">{packaging.id}</Link>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6" 
                                                onClick={handlePrintPacking}
                                            >
                                                <Printer className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>In phiếu đóng gói</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </DetailField>
                        <DetailField 
                            label="Mã vận đơn" 
                            className="py-1 border-0"
                        >
                            {packaging.trackingCode ? (
                                <div className="flex items-center gap-1">
                                    {shipment ? (
                                        <Link href={`/shipments/${shipment.systemId}`} className="text-primary hover:underline">
                                            {packaging.trackingCode}
                                        </Link>
                                    ) : (
                                        // Fallback: link đến packaging detail khi shipment chưa có trong cache
                                        <Link href={`/packaging/${packaging.systemId}`} className="text-primary hover:underline">
                                            {packaging.trackingCode}
                                        </Link>
                                    )}
                                    {/* ✅ Print label dropdown - GHTK có 2 options */}
                                    {packaging.carrier === 'GHTK' ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6"
                                                >
                                                    <Printer className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={handlePrintGHTKLabel}>
                                                    In nhãn GHTK (có QR code)
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={handlePrintShippingLabel}>
                                                    In nhãn nội bộ
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-6 w-6" 
                                                        onClick={handlePrintShippingLabel}
                                                    >
                                                        <Printer className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>In nhãn giao hàng</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                            ) : (
                                <span className="text-muted-foreground">---</span>
                            )}
                        </DetailField>
                        
                        {packaging.deliveryMethod === 'Dịch vụ giao hàng' ? (
                            <>
                                <DetailField label="Phí trả ĐTVC" value={formatCurrency(packaging.shippingFeeToPartner)} className="py-1 border-0" />
                                <DetailField label="Vận chuyển bởi" value={packaging.carrier} className="py-1 border-0" />
                                <DetailField label="Tổng tiền thu hộ COD" value={formatCurrency(packaging.codAmount)} className="py-1 border-0" />
                                <DetailField label="Người trả phí" value={packaging.payer} className="py-1 border-0" />
                                <DetailField label="Đối soát" value={packaging.reconciliationStatus || 'Chưa đối soát'} className="py-1 border-0" />
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
                                <DetailField label="NV được gán" value={renderEmployeeLink(packaging.assignedEmployeeId, packaging.assignedEmployeeName)} className="py-1 border-0" />
                                <DetailField label="Người YC" value={renderEmployeeLink(packaging.requestingEmployeeId, packaging.requestingEmployeeName)} className="py-1 border-0" />
                                {(packaging.deliveryMethod === 'IN_STORE_PICKUP' || packaging.deliveryMethod === 'Nhận tại cửa hàng') && (
                                    <DetailField label="Người nhận hàng" value={packaging.requestorName || order.customerName || '---'} className="py-1 border-0" />
                                )}
                                {packaging.status !== 'Chờ đóng gói' && packaging.status !== 'PENDING' && (
                                    <DetailField label="Người xác nhận" value={renderEmployeeLink(packaging.confirmingEmployeeId, packaging.confirmingEmployeeName)} className="py-1 border-0" />
                                )}
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

// ✅ Export memoized component for performance
export const MemoizedPackagingInfo = React.memo(PackagingInfo);
