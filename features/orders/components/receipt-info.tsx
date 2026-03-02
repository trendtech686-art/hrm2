import * as React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/date-utils';
import type { Receipt } from '@/lib/types/prisma-extended';
import type { Order, OrderAddress } from '../types';
import { Button } from '../../../components/ui/button';
import { DetailField } from '../../../components/ui/detail-field';
import { ChevronRight, ChevronDown, Printer, Banknote } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { useEmployeeFinder } from '../../employees/hooks/use-all-employees';
import { useBranchFinder } from '../../settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '../../settings/store-info/hooks/use-store-info';
import { usePrint } from '../../../lib/use-print';
import { numberToWords, formatTime, StoreSettings } from '../../../lib/print-service';
import { mapReceiptToPrintData, ReceiptForPrint } from '../../../lib/print-mappers/receipt.mapper';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

interface ReceiptInfoProps {
    receipt: Receipt;
    order: Order;
    label?: string; // Optional label like "Phiếu trả hàng"
    linkedSalesReturnSystemId?: string; // Link to sales return detail page
}

export function ReceiptInfo({ receipt, order, label, linkedSalesReturnSystemId }: ReceiptInfoProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { findById: findEmployeeById } = useEmployeeFinder();
    const { findById: findBranchById } = useBranchFinder();
    const { info: storeInfo } = useStoreInfoData();
    const { print } = usePrint(order.branchSystemId);

    const creator = React.useMemo(() => {
        return findEmployeeById(receipt.createdBy);
    }, [findEmployeeById, receipt.createdBy]);

    // Helper to get address string safely
    const getAddressStr = (addr: string | OrderAddress | undefined) => {
        if (!addr) return '';
        return typeof addr === 'string' ? addr : addr.formattedAddress || '';
    };

    const handlePrint = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        const amount = receipt.amount;

        // Try shipping address first, then billing address
        const addressStr = getAddressStr(order.shippingAddress) || getAddressStr(order.billingAddress);
            
        const phoneStr = typeof order.shippingAddress === 'object' 
            ? order.shippingAddress?.phone || order.shippingAddress?.contactPhone || ''
            : '';

        // Get branch info
        const branch = findBranchById(order.branchSystemId);

        // Prepare store settings
        const storeSettings: StoreSettings = {
            name: storeInfo?.brandName || storeInfo?.companyName || '',
            address: storeInfo?.headquartersAddress,
            phone: storeInfo?.hotline,
            email: storeInfo?.email,
            province: storeInfo?.province,
        };

        const receiptData: ReceiptForPrint = {
            code: receipt.id,
            createdAt: receipt.date,
            issuedAt: receipt.date,
            createdBy: creator?.fullName || receipt.createdBy,
            payerName: order.customerName,
            payerPhone: phoneStr,
            payerAddress: addressStr,
            payerType: 'Khách hàng',
            amount: amount,
            description: receipt.description,
            paymentMethod: receipt.paymentMethodName,
            documentRootCode: order.id,
            note: receipt.description,
            location: branch ? {
                name: branch.name,
                address: branch.address,
                province: branch.province
            } : undefined
        };
        
        const printData = mapReceiptToPrintData(receiptData, storeSettings);
        printData['amount_text'] = numberToWords(amount);
        printData['print_date'] = formatDate(new Date());
        printData['print_time'] = formatTime(new Date());
        printData['receipt_barcode'] = receipt.id;
        printData['description'] = receipt.description;
        printData['payment_method'] = receipt.paymentMethodName;

        print('receipt', { data: printData });
    };

    return (
        <div className="border rounded-md bg-background text-sm">
            {/* Header */}
            <div className="flex items-center p-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <Banknote className="h-4 w-4 text-green-500 mr-3 shrink-0" />
                <Link href={`/receipts/${receipt.systemId}`} 
                    className="font-semibold text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    {receipt.id}
                </Link>
                {label && linkedSalesReturnSystemId ? (
                    <Link href={`/sales-returns/${linkedSalesReturnSystemId}`} onClick={(e) => e.stopPropagation()}>
                        <Badge variant="secondary" className="ml-2 text-xs hover:bg-secondary/80 cursor-pointer">{label}</Badge>
                    </Link>
                ) : label ? (
                    <Badge variant="secondary" className="ml-2 text-xs">{label}</Badge>
                ) : null}
                <div className="grow text-right text-muted-foreground px-4">
                    {formatDate(receipt.date)}
                </div>
                <div className="w-28 text-right font-semibold text-green-600">
                    +{formatCurrency(receipt.amount)}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 shrink-0" onClick={handlePrint} title="In phiếu">
                    <Printer className="h-4 w-4" />
                </Button>
                {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground ml-1 shrink-0" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-1 shrink-0" />
                )}
            </div>

            {/* Expandable Details */}
            {isExpanded && (
                <div className="border-t px-3 py-3 bg-muted/50">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <DetailField label="Phương thức" value={receipt.paymentMethodName || '---'} />
                        <DetailField label="Người tạo" value={creator?.fullName || receipt.createdBy} />
                        <DetailField label="Chi nhánh" value={receipt.branchName || '---'} />
                        {receipt.description && (
                            <div className="col-span-2 md:col-span-3">
                                <DetailField label="Diễn giải" value={receipt.description} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export const MemoizedReceiptInfo = React.memo(ReceiptInfo);
