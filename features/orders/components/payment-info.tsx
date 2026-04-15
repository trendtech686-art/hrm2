import * as React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/date-utils';
import type { OrderPayment, Order, OrderAddress } from '../types';
import { Button } from '../../../components/ui/button';
import { DetailField } from '../../../components/ui/detail-field';
import { cn } from '../../../lib/utils';
import { ChevronRight, ChevronDown, Printer, Banknote, Minus } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { useBranchFinder } from '../../settings/branches/hooks/use-all-branches';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { usePrint } from '../../../lib/use-print';
import { numberToWords, formatTime, StoreSettings } from '../../../lib/print-service';
import { mapReceiptToPrintData, ReceiptForPrint } from '../../../lib/print-mappers/receipt.mapper';
import { mapPaymentToPrintData, PaymentForPrint } from '../../../lib/print-mappers/payment.mapper';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};



interface PaymentInfoProps {
    payment: OrderPayment;
    order: Order;
}

export function PaymentInfo({ payment, order }: PaymentInfoProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { findById: findBranchById } = useBranchFinder();
    // ⚡ OPTIMIZED: storeInfo lazy loaded in print handler
    const { print } = usePrint(order.branchSystemId);

    // Use createdByName from API data
    const creatorName = (payment as unknown as Record<string, unknown>).createdByName as string || payment.createdBy;
    const creatorSystemId = payment.createdBy;
    
    // Determine if this is a payment (negative amount) or receipt (positive amount)
    const isPayment = payment.amount < 0;
    const isWarrantyPayment = !!(payment as { linkedWarrantySystemId?: string }).linkedWarrantySystemId;
    
    // Get linked receipt/payment systemId for navigation
    const linkedReceiptSystemId = (payment as { linkedReceiptSystemId?: string }).linkedReceiptSystemId;
    const linkedPaymentSystemId = (payment as { linkedPaymentSystemId?: string }).linkedPaymentSystemId;
    const detailLink = isPayment 
        ? (linkedPaymentSystemId ? `/payments/${linkedPaymentSystemId}` : null)
        : (linkedReceiptSystemId ? `/receipts/${linkedReceiptSystemId}` : null);

    const handlePrint = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        const amount = Math.abs(payment.amount);
        const type = isPayment ? 'payment' : 'receipt';
        
        // Helper to get address string safely
        const getAddressStr = (addr: string | OrderAddress | undefined) => {
            if (!addr) return '';
            return typeof addr === 'string' ? addr : addr.formattedAddress || '';
        };

        // Try shipping address first, then billing address
        const addressStr = getAddressStr(order.shippingAddress) || getAddressStr(order.billingAddress);
            
        const phoneStr = typeof order.shippingAddress === 'object' 
            ? order.shippingAddress?.phone || order.shippingAddress?.contactPhone || ''
            : '';

        // Get branch info
        const branch = findBranchById(order.branchSystemId);

        // Prepare store settings - lazy fetch
        const { storeInfo } = await fetchPrintData();
        const storeSettings: StoreSettings = {
            name: storeInfo?.brandName || storeInfo?.companyName || '',
            address: storeInfo?.headquartersAddress,
            phone: storeInfo?.hotline,
            email: storeInfo?.email,
            province: storeInfo?.province,
            // logo: undefined // TODO: Add logo if available
        };

        let printData;

        if (isPayment) {
            const paymentData: PaymentForPrint = {
                code: payment.id,
                createdAt: payment.date,
                issuedAt: payment.date,
                createdBy: creatorName,
                recipientName: order.customerName,
                recipientPhone: phoneStr,
                recipientAddress: addressStr,
                recipientType: 'Khách hàng',
                amount: amount,
                description: payment.description,
                paymentMethod: payment.method,
                documentRootCode: order.id,
                note: payment.description,
                location: branch ? {
                    name: branch.name,
                    address: branch.address,
                    province: branch.province
                } : undefined
            };
            printData = mapPaymentToPrintData(paymentData, storeSettings);
        } else {
            const receiptData: ReceiptForPrint = {
                code: payment.id,
                createdAt: payment.date,
                issuedAt: payment.date,
                createdBy: creatorName,
                payerName: order.customerName,
                payerPhone: phoneStr,
                payerAddress: addressStr,
                payerType: 'Khách hàng',
                amount: amount,
                description: payment.description,
                paymentMethod: payment.method,
                documentRootCode: order.id,
                note: payment.description,
                location: branch ? {
                    name: branch.name,
                    address: branch.address,
                    province: branch.province
                } : undefined
            };
            printData = mapReceiptToPrintData(receiptData, storeSettings);
        }

        // Add extra fields that might be missing in mapper but present in template
        printData['amount_text'] = numberToWords(amount);
        printData['print_date'] = formatDate(new Date());
        printData['print_time'] = formatTime(new Date());
        printData['receipt_barcode'] = payment.id;
        printData['description'] = payment.description;
        printData['payment_method'] = payment.method;

        print(type, { data: printData });
    };

    return (
        <div className="border rounded-md bg-background text-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center p-3 cursor-pointer gap-1 md:gap-0" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center min-w-0">
                    {isPayment ? (
                        <Minus className="h-4 w-4 text-red-500 mr-3 shrink-0" />
                    ) : (
                        <Banknote className="h-4 w-4 text-green-500 mr-3 shrink-0" />
                    )}
                    {/* Link to receipt/payment detail page if linked, otherwise show as text */}
                    {detailLink ? (
                        <Link href={detailLink} 
                            className="font-semibold text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {payment.id}
                        </Link>
                    ) : (
                        <span className="font-semibold text-foreground">
                            {payment.id}
                        </span>
                    )}
                    {isWarrantyPayment && (
                        <Badge variant="secondary" className="ml-2 text-xs">Bảo hành</Badge>
                    )}
                </div>
                <div className="flex items-center ml-7 md:ml-0 md:grow">
                    <div className="text-muted-foreground md:grow md:text-right md:px-4">
                        {formatDate(payment.date)}
                    </div>
                    <div className={cn(
                        "ml-auto md:ml-0 md:w-28 text-right font-semibold",
                        isPayment ? "text-red-600" : "text-green-600"
                    )}>
                        {isPayment ? '-' : '+'}{formatCurrency(Math.abs(payment.amount))}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 shrink-0" onClick={handlePrint} title="In phiếu">
                        <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 shrink-0">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            
            {/* Content */}
            {isExpanded && (
                <div className="p-4 border-t bg-muted/50 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                        <DetailField label="Phương thức" value={payment.method} className="py-1 border-0" />
                        <DetailField 
                            label="Người tạo" 
                            className="py-1 border-0"
                            value={creatorSystemId ? (
                                <Link href={`/employees/${creatorSystemId}`} className="text-primary hover:underline">
                                    {creatorName}
                                </Link>
                            ) : payment.createdBy}
                        />
                        <DetailField label="Diễn giải" value={payment.description} className="py-1 border-0 col-span-2" />
                        {isWarrantyPayment && (payment as { linkedWarrantySystemId?: string }).linkedWarrantySystemId && (
                            <DetailField 
                                label="Liên kết" 
                                value={
                                    <Link href={`/warranty/${(payment as { linkedWarrantySystemId?: string }).linkedWarrantySystemId}`}
                                        className="text-primary hover:underline"
                                    >
                                        Xem phiếu bảo hành
                                    </Link>
                                } 
                                className="py-1 border-0 col-span-2" 
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ✅ Export memoized component for performance
export const MemoizedPaymentInfo = React.memo(PaymentInfo);
