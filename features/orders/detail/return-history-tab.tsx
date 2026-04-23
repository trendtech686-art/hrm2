'use client'

import * as React from 'react';
import Link from 'next/link';
import { Printer, ChevronDown, ChevronRight, StickyNote } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import type { Order } from '@/lib/types/prisma-extended';
import type { SalesReturn } from '@/features/sales-returns/types';
import { useOrderFinder } from '@/features/orders/hooks/use-all-orders';
import { useProductFinder } from '@/features/products/hooks/use-all-products';
import { useBranchFinder } from '@/features/settings/branches/hooks/use-all-branches';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { useCustomerFinder } from '@/features/customers/hooks/use-all-customers';
import { usePaymentFinder } from '@/features/payments/hooks/use-all-payments';
import { useReceiptFinder } from '@/features/receipts/hooks/use-all-receipts';
import { usePrint } from '@/lib/use-print';
import { mapSalesReturnToPrintData, type SalesReturnForPrint } from '@/lib/print-mappers/sales-return.mapper';
import type { StoreSettings } from '@/lib/print-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { MobileCard, MobileCardBody, MobileCardFooter, MobileCardHeader } from '@/components/mobile/mobile-card';
import { formatCurrency } from './types';
import { ProductThumbnailCell } from './product-thumbnail-cell';
import { mobileBleedCardClass } from '@/components/layout/page-section';

interface ReturnHistoryTabProps {
  order: Order;
  salesReturnsForOrder: SalesReturn[];
  getProductTypeLabel?: (productSystemId: string) => string;
  onPreview?: (image: string, title: string) => void;
}

export function ReturnHistoryTab({ order, salesReturnsForOrder, getProductTypeLabel, onPreview }: ReturnHistoryTabProps) {
    const [expandedReturnId, setExpandedReturnId] = React.useState<string | null>(null);
    const [expandedCombos, setExpandedCombos] = React.useState<Record<string, boolean>>({});
    const { findById: findOrderById } = useOrderFinder();
    const { findById: findProductById } = useProductFinder();
    const { findById: findBranchById } = useBranchFinder();
    // ⚡ OPTIMIZED: storeInfo lazy loaded in print handler
    const { print } = usePrint(order.branchSystemId);
    const { findById: findCustomerById } = useCustomerFinder();
    const { findById: findPaymentById } = usePaymentFinder();
    const { findById: findReceiptById } = useReceiptFinder();

    const toggleComboRow = React.useCallback((key: string) => {
        setExpandedCombos(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const handlePrintReturn = React.useCallback(async (e: React.MouseEvent, salesReturn: SalesReturn) => {
        e.stopPropagation();
        if (!salesReturn) return;

        const branch = findBranchById(salesReturn.branchSystemId);
        const customer = findCustomerById(salesReturn.customerSystemId);
        const { storeInfo } = await fetchPrintData();
        const storeSettings: StoreSettings = {
            name: storeInfo?.brandName || storeInfo?.companyName || '',
            address: storeInfo?.headquartersAddress,
            phone: storeInfo?.hotline,
            email: storeInfo?.email,
            province: storeInfo?.province,
        };

        const printData: SalesReturnForPrint = {
            code: salesReturn.id,
            orderCode: salesReturn.orderId,
            createdAt: salesReturn.returnDate,
            createdBy: salesReturn.creatorName,
            customerName: salesReturn.customerName,
            customerPhone: customer?.phone,
            shippingAddress: customer?.addresses?.[0] ? 
                [customer.addresses[0].street, customer.addresses[0].ward, customer.addresses[0].district, customer.addresses[0].province].filter(Boolean).join(', ') 
                : undefined,
            location: branch ? {
                name: branch.name,
                address: branch.address,
                province: branch.province
            } : undefined,
            items: salesReturn.exchangeItems.map(item => ({
                productName: item.productName,
                quantity: item.quantity,
                price: item.unitPrice,
                amount: item.quantity * item.unitPrice,
                unit: 'Cái',
            })),
            returnItems: salesReturn.items.map(item => ({
                productName: item.productName,
                quantity: item.returnQuantity,
                price: item.unitPrice,
                amount: item.totalValue,
                unit: 'Cái',
            })),
            total: salesReturn.grandTotalNew,
            returnTotalAmount: salesReturn.totalReturnValue,
            totalAmount: Math.abs(salesReturn.finalAmount),
            note: salesReturn.note,
        };

        const mappedData = mapSalesReturnToPrintData(printData, storeSettings);
        mappedData['{reason_return}'] = salesReturn.reason || '';
        mappedData['{reason}'] = salesReturn.reason || '';
        mappedData['{note}'] = salesReturn.note || '';
        
        let refundStatus = 'Chưa hoàn tiền';
        const totalRefunded = (salesReturn.refunds || []).reduce((sum, r) => sum + (Number(r.amount) || 0), 0) || Number(salesReturn.refundAmount) || 0;
        const totalPaid = (salesReturn.payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        
        if (salesReturn.finalAmount < 0) {
             if (totalRefunded >= Math.abs(salesReturn.finalAmount)) {
                 refundStatus = 'Đã hoàn tiền';
             } else if (totalRefunded > 0) {
                 refundStatus = 'Hoàn tiền một phần';
             }
        } else if (salesReturn.finalAmount > 0) {
             if (totalPaid >= salesReturn.finalAmount) {
                 refundStatus = 'Đã thanh toán';
             } else if (totalPaid > 0) {
                 refundStatus = 'Thanh toán một phần';
             } else {
                 refundStatus = 'Chưa thanh toán';
             }
        } else {
            refundStatus = 'Đã hoàn thành';
        }
        mappedData['refund_status'] = refundStatus;

        const lineItems = salesReturn.items.map((item, index) => ({
            '{line_stt}': (index + 1).toString(),
            '{line_product_name}': item.productName,
            '{line_variant_code}': item.productId,
            '{line_variant}': '',
            '{line_unit}': 'Cái',
            '{line_quantity}': item.returnQuantity.toString(),
            '{line_price}': formatCurrency(item.unitPrice),
            '{line_total}': formatCurrency(item.totalValue),
            '{line_amount}': formatCurrency(item.totalValue),
        }));

        print('sales-return', { data: mappedData, lineItems });
    }, [findBranchById, print, findCustomerById]);

    return (
        <Card className={mobileBleedCardClass}>
            <CardContent className="p-0">
                <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Mã đơn trả hàng</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày trả hàng</TableHead>
                            <TableHead className="text-center">Số lượng hàng trả</TableHead>
                            <TableHead className="text-right">Giá trị hàng trả</TableHead>
                            <TableHead>Mã vận đơn</TableHead>
                            <TableHead className="text-center">Số lượng hàng đổi</TableHead>
                            <TableHead className="text-right">Giá trị hàng đổi</TableHead>
                            <TableHead className="text-right">Chênh lệch</TableHead>
                            <TableHead>Phiếu thu/chi</TableHead>
                            <TableHead className="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salesReturnsForOrder.map(returnSlip => {
                            const isExpanded = expandedReturnId === returnSlip.systemId;
                            const totalReturnQty = (returnSlip.items || []).reduce((sum, item) => sum + (Number(item.returnQuantity) || 0), 0);
                            const totalExchangeQty = (returnSlip.exchangeItems || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
                            // ✅ FIX: Use data from API response directly instead of cache-only findOrderById
                            const exchangeTrackingCode = (returnSlip as Record<string, unknown>).exchangeTrackingCode as string | null;
                            const exchangeOrderBusinessId = (returnSlip as Record<string, unknown>).exchangeOrderId as string | null;
                            const exchangeOrder = returnSlip.exchangeOrderSystemId ? findOrderById(returnSlip.exchangeOrderSystemId) : null;

                            return (
                                <React.Fragment key={returnSlip.systemId}>
                                    <TableRow onClick={() => setExpandedReturnId(isExpanded ? null : returnSlip.systemId)} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/returns/${returnSlip.systemId}`} 
                                                onClick={e => e.stopPropagation()} 
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {returnSlip.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                returnSlip.isReceived 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {returnSlip.isReceived ? 'Đã nhận' : 'Chưa nhận'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {returnSlip.returnDate 
                                                ? formatDate(returnSlip.returnDate) 
                                                : (returnSlip.createdAt 
                                                    ? formatDate(returnSlip.createdAt) 
                                                    : <span className="text-muted-foreground">-</span>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell className="text-center">{totalReturnQty}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(returnSlip.totalReturnValue)}</TableCell>
                                        <TableCell>
                                            {exchangeTrackingCode ? (
                                                <Link href={`/orders/${returnSlip.exchangeOrderSystemId || order.systemId}`} 
                                                    onClick={e => e.stopPropagation()} 
                                                    className="text-primary hover:underline font-mono text-xs"
                                                >
                                                    {exchangeTrackingCode}
                                                </Link>
                                            ) : (exchangeOrderBusinessId || exchangeOrder) ? (
                                                <Link href={`/orders/${returnSlip.exchangeOrderSystemId}`} 
                                                    onClick={e => e.stopPropagation()} 
                                                    className="text-primary hover:underline"
                                                >
                                                    {exchangeOrderBusinessId || exchangeOrder?.id}
                                                </Link>
                                            ) : totalExchangeQty > 0 ? (
                                                <span className="text-muted-foreground text-xs">Chờ xử lý</span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {totalExchangeQty > 0 ? totalExchangeQty : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {returnSlip.grandTotalNew > 0 ? formatCurrency(returnSlip.grandTotalNew) : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {(() => {
                                                // Chênh lệch = grandTotalNew - totalReturnValue (finalAmount)
                                                const difference = Number(returnSlip.finalAmount) || (Number(returnSlip.grandTotalNew) - Number(returnSlip.totalReturnValue));
                                                
                                                if (difference === 0) {
                                                    return <span className="text-muted-foreground">0</span>;
                                                }
                                                
                                                if (difference > 0) {
                                                    // Khách cần trả thêm
                                                    return <span className="text-amber-600">+{formatCurrency(difference)}</span>;
                                                }
                                                
                                                // Cần hoàn tiền cho khách
                                                return <span className="text-green-600">{formatCurrency(difference)}</span>;
                                            })()}
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                // ✅ Use business IDs from API directly instead of lookup
                                                const paymentIds = returnSlip.paymentVoucherSystemIds || (returnSlip.paymentVoucherSystemId ? [returnSlip.paymentVoucherSystemId] : []);
                                                const receiptIds = returnSlip.receiptVoucherSystemIds || [];
                                                const refundAmount = Number(returnSlip.refundAmount) || 0;
                                                const finalAmount = Number(returnSlip.finalAmount) || 0;
                                                
                                                // ✅ Use paymentVoucherIds/receiptVoucherIds (business IDs) if available
                                                // Otherwise fallback to finder lookup
                                                const paymentBusinessIds = (returnSlip as unknown as { paymentVoucherIds?: string[] }).paymentVoucherIds || [];
                                                const receiptBusinessIds = (returnSlip as unknown as { receiptVoucherIds?: string[] }).receiptVoucherIds || [];
                                                
                                                const payments = paymentBusinessIds.length > 0 
                                                    ? paymentBusinessIds.map((id, idx) => ({ systemId: paymentIds[idx] || id, id }))
                                                    : paymentIds.map(id => findPaymentById(id)).filter(Boolean);
                                                const receipts = receiptBusinessIds.length > 0
                                                    ? receiptBusinessIds.map((id, idx) => ({ systemId: receiptIds[idx] || id, id }))
                                                    : receiptIds.map(id => findReceiptById(id)).filter(Boolean);
                                                
                                                // Nếu có payments/receipts, hiển thị với link
                                                if (payments.length > 0 || receipts.length > 0) {
                                                    return (
                                                        <div className="flex flex-col gap-0.5 text-xs">
                                                            {payments.map((payment) => (
                                                                <Link 
                                                                    key={payment!.systemId}
                                                                    href={`/payments/${payment!.systemId}`}
                                                                    onClick={e => e.stopPropagation()}
                                                                    className="text-green-600 hover:underline"
                                                                >
                                                                    {payment!.id}
                                                                </Link>
                                                            ))}
                                                            {receipts.map((receipt) => (
                                                                <Link 
                                                                    key={receipt!.systemId}
                                                                    href={`/receipts/${receipt!.systemId}`}
                                                                    onClick={e => e.stopPropagation()}
                                                                    className="text-blue-600 hover:underline"
                                                                >
                                                                    {receipt!.id}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                                
                                                // ✅ Chỉ hiển thị khi có ACTUAL refund/payment
                                                // Nếu khách chưa thanh toán đơn gốc → không phát sinh tiền → hiện "-"
                                                if (refundAmount > 0) {
                                                    return (
                                                        <span className="text-green-600 text-xs">
                                                            Đã chi: {formatCurrency(refundAmount)}
                                                        </span>
                                                    );
                                                }
                                                
                                                // Không hiện "Cần hoàn/thu" vì nếu khách chưa trả tiền thì không phát sinh
                                                return <span className="text-muted-foreground">-</span>;
                                            })()}
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8"
                                                onClick={(e) => handlePrintReturn(e, returnSlip)}
                                                title="In phiếu trả hàng"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {isExpanded && (
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableCell colSpan={12} className="p-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Chi tiết hàng trả</h4>
                                                        <div className="border border-border rounded-md bg-background overflow-x-auto">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead className="w-12">STT</TableHead>
                                                                        <TableHead className="w-16 text-center">Ảnh</TableHead>
                                                                        <TableHead>Tên sản phẩm</TableHead>
                                                                        <TableHead className="text-center">Số lượng</TableHead>
                                                                        <TableHead className="text-right">Đơn giá trả</TableHead>
                                                                        <TableHead className="text-right">Thành tiền</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {returnSlip.items.map((item: { productSystemId: string; returnQuantity: number; unitPrice: number; totalValue: number; productName?: string; productId?: string; note?: string; thumbnailImage?: string; productType?: string }, index: number) => {
                                                                        const product = findProductById(item.productSystemId);
                                                                        const productType = item.productType || getProductTypeLabel?.(item.productSystemId) || '---';
                                                                        const isCombo = product?.type === 'combo';
                                                                        const comboKey = `return-${returnSlip.systemId}-${item.productSystemId}`;
                                                                        const isComboExpanded = expandedCombos[comboKey] ?? false;
                                                                        const comboChildren = isCombo && product?.comboItems ? product.comboItems : [];
                                                                        
                                                                        return (
                                                                            <React.Fragment key={`${returnSlip.systemId}-${item.productSystemId}-${index}`}>
                                                                                <TableRow>
                                                                                    <TableCell className="text-center text-muted-foreground">
                                                                                        <div className="flex items-center justify-center gap-1">
                                                                                            {isCombo && (
                                                                                                <Button
                                                                                                    type="button"
                                                                                                    variant="ghost"
                                                                                                    size="icon"
                                                                                                    className="h-6 w-6 p-0"
                                                                                                    onClick={(e) => {
                                                                                                        e.stopPropagation();
                                                                                                        toggleComboRow(comboKey);
                                                                                                    }}
                                                                                                >
                                                                                                    {isComboExpanded ? (
                                                                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                                                                    ) : (
                                                                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                                                                    )}
                                                                                                </Button>
                                                                                            )}
                                                                                            <span>{index + 1}</span>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <ProductThumbnailCell 
                                                                                            productSystemId={item.productSystemId} 
                                                                                            product={product}
                                                                                            productName={item.productName || ''} 
                                                                                            size="sm"
                                                                                            onPreview={onPreview}
                                                                                            itemThumbnailImage={(item as { thumbnailImage?: string }).thumbnailImage}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <div className="flex flex-col gap-0.5">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <Link href={`/products/${item.productSystemId}`}
                                                                                                    className="font-medium text-primary hover:underline"
                                                                                                >
                                                                                                    {item.productName || product?.name}
                                                                                                </Link>
                                                                                                {isCombo && (
                                                                                                    <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                                                                                        COMBO
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                                                                                                <span>{productType}</span>
                                                                                                <span>-</span>
                                                                                                <Link href={`/products/${item.productSystemId}`}
                                                                                                    className="text-primary hover:underline"
                                                                                                >
                                                                                                    {product?.id || item.productId}
                                                                                                </Link>
                                                                                                {item.note && (
                                                                                                    <>
                                                                                                        <StickyNote className="h-3 w-3 text-amber-600 ml-1" />
                                                                                                        <span className="text-amber-600 italic">{item.note}</span>
                                                                                                    </>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center">{item.returnQuantity}</TableCell>
                                                                                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                                                    <TableCell className="text-right font-medium">{formatCurrency(item.totalValue)}</TableCell>
                                                                                </TableRow>
                                                                                {isCombo && isComboExpanded && comboChildren.map((comboItem: { productSystemId: string; productName?: string; quantity?: number }, childIndex: number) => {
                                                                                    const childProduct = findProductById(comboItem.productSystemId);
                                                                                    return (
                                                                                        <TableRow key={`${comboKey}-child-${childIndex}`} className="bg-muted/40">
                                                                                            <TableCell className="text-center text-muted-foreground pl-8">
                                                                                                <span className="text-muted-foreground/60">└</span>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <ProductThumbnailCell 
                                                                                                    productSystemId={comboItem.productSystemId}
                                                                                                    product={childProduct}
                                                                                                    productName={childProduct?.name || comboItem.productName || 'Sản phẩm'}
                                                                                                    size="sm"
                                                                                                    onPreview={onPreview}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <div className="flex flex-col gap-0.5">
                                                                                                    <span className="font-medium text-foreground">
                                                                                                        {childProduct?.name || 'Sản phẩm không tồn tại'}
                                                                                                    </span>
                                                                                                    {childProduct && (
                                                                                                        <Link href={`/products/${childProduct.systemId}`}
                                                                                                            className="text-xs text-primary hover:underline"
                                                                                                        >
                                                                                                            {childProduct.id}
                                                                                                        </Link>
                                                                                                    )}
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell className="text-center text-muted-foreground">
                                                                                                x{(comboItem.quantity || 1) * item.returnQuantity}
                                                                                            </TableCell>
                                                                                            <TableCell className="text-right text-muted-foreground">-</TableCell>
                                                                                            <TableCell className="text-right text-muted-foreground">-</TableCell>
                                                                                        </TableRow>
                                                                                    );
                                                                                })}
                                                                            </React.Fragment>
                                                                        );
                                                                    })}
                                                                </TableBody>
                                                                <TableFooter>
                                                                    <TableRow>
                                                                        <TableCell colSpan={5} className="text-right font-semibold">Tổng cộng</TableCell>
                                                                        <TableCell className="text-right font-bold">{formatCurrency(returnSlip.totalReturnValue)}</TableCell>
                                                                    </TableRow>
                                                                </TableFooter>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                    
                                                    {returnSlip.exchangeItems && returnSlip.exchangeItems.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Chi tiết hàng đổi</h4>
                                                            <div className="border border-border rounded-md bg-background overflow-x-auto">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead className="w-12">STT</TableHead>
                                                                            <TableHead className="w-16 text-center">Ảnh</TableHead>
                                                                            <TableHead>Tên sản phẩm</TableHead>
                                                                            <TableHead className="text-center">Số lượng</TableHead>
                                                                            <TableHead className="text-right">Đơn giá</TableHead>
                                                                            <TableHead className="text-right">Thành tiền</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {returnSlip.exchangeItems.map((item: { productSystemId: string; quantity: number; unitPrice: number; discount: number; discountType?: 'percentage' | 'fixed'; productName?: string; productId?: string; note?: string; thumbnailImage?: string; productType?: string }, index: number) => {
                                                                            const lineTotal = item.quantity * item.unitPrice - (item.discountType === 'percentage' ? (item.quantity * item.unitPrice * item.discount / 100) : item.discount);
                                                                            const product = findProductById(item.productSystemId);
                                                                            const productType = item.productType || getProductTypeLabel?.(item.productSystemId) || '---';
                                                                            const isCombo = product?.type === 'combo';
                                                                            const comboKey = `exchange-${returnSlip.systemId}-${item.productSystemId}`;
                                                                            const isComboExpanded = expandedCombos[comboKey] ?? false;
                                                                            const comboChildren = isCombo && product?.comboItems ? product.comboItems : [];
                                                                            
                                                                            return (
                                                                                <React.Fragment key={item.productSystemId}>
                                                                                    <TableRow>
                                                                                        <TableCell className="text-center text-muted-foreground">
                                                                                            <div className="flex items-center justify-center gap-1">
                                                                                                {isCombo && (
                                                                                                    <Button
                                                                                                        type="button"
                                                                                                        variant="ghost"
                                                                                                        size="icon"
                                                                                                        className="h-6 w-6 p-0"
                                                                                                        onClick={(e) => {
                                                                                                            e.stopPropagation();
                                                                                                            toggleComboRow(comboKey);
                                                                                                        }}
                                                                                                    >
                                                                                                        {isComboExpanded ? (
                                                                                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                                                                        ) : (
                                                                                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                                                                        )}
                                                                                                    </Button>
                                                                                                )}
                                                                                                <span>{index + 1}</span>
                                                                                            </div>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <ProductThumbnailCell 
                                                                                                productSystemId={item.productSystemId} 
                                                                                                product={product}
                                                                                                productName={item.productName || ''} 
                                                                                                size="sm"
                                                                                                onPreview={onPreview}
                                                                                                itemThumbnailImage={item.thumbnailImage}
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <div className="flex flex-col gap-0.5">
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <Link href={`/products/${item.productSystemId}`}
                                                                                                        className="font-medium text-primary hover:underline"
                                                                                                    >
                                                                                                        {item.productName}
                                                                                                    </Link>
                                                                                                    {isCombo && (
                                                                                                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                                                                                            COMBO
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                                                                                                    <span>{productType}</span>
                                                                                                    <span>-</span>
                                                                                                    <Link href={`/products/${item.productSystemId}`}
                                                                                                        className="text-primary hover:underline"
                                                                                                    >
                                                                                                        {item.productId}
                                                                                                    </Link>
                                                                                                    {item.note && (
                                                                                                        <>
                                                                                                            <StickyNote className="h-3 w-3 text-amber-600 ml-1" />
                                                                                                            <span className="text-amber-600 italic">{item.note}</span>
                                                                                                        </>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </TableCell>
                                                                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                                                                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                                                        <TableCell className="text-right font-medium">{formatCurrency(lineTotal)}</TableCell>
                                                                                    </TableRow>
                                                                                    {isCombo && isComboExpanded && comboChildren.map((comboItem: { productSystemId: string; productName?: string; quantity?: number }, childIndex: number) => {
                                                                                        const childProduct = findProductById(comboItem.productSystemId);
                                                                                        return (
                                                                                            <TableRow key={`${comboKey}-child-${childIndex}`} className="bg-muted/40">
                                                                                                <TableCell className="text-center text-muted-foreground pl-8">
                                                                                                    <span className="text-muted-foreground/60">└</span>
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <ProductThumbnailCell 
                                                                                                        productSystemId={comboItem.productSystemId}
                                                                                                        product={childProduct}
                                                                                                        productName={childProduct?.name || comboItem.productName || 'Sản phẩm'}
                                                                                                        size="sm"
                                                                                                        onPreview={onPreview}
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <div className="flex flex-col gap-0.5">
                                                                                                        <span className="font-medium text-foreground">
                                                                                                            {childProduct?.name || 'Sản phẩm không tồn tại'}
                                                                                                        </span>
                                                                                                        {childProduct && (
                                                                                                            <Link href={`/products/${childProduct.systemId}`}
                                                                                                                className="text-xs text-primary hover:underline"
                                                                                                            >
                                                                                                                {childProduct.id}
                                                                                                            </Link>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </TableCell>
                                                                                                <TableCell className="text-center text-muted-foreground">
                                                                                                    x{(comboItem.quantity || 1) * item.quantity}
                                                                                                </TableCell>
                                                                                                <TableCell className="text-right text-muted-foreground">-</TableCell>
                                                                                                <TableCell className="text-right text-muted-foreground">-</TableCell>
                                                                                            </TableRow>
                                                                                        );
                                                                                    })}
                                                                                </React.Fragment>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                    <TableFooter>
                                                                        <TableRow>
                                                                            <TableCell colSpan={5} className="text-right font-semibold">Tổng cộng</TableCell>
                                                                            <TableCell className="text-right font-bold">{formatCurrency(returnSlip.grandTotalNew)}</TableCell>
                                                                        </TableRow>
                                                                    </TableFooter>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </TableBody>
                </Table>
                </div>

                {/* Mobile: card stack */}
                <div className="md:hidden space-y-3 p-3">
                    {salesReturnsForOrder.map(returnSlip => {
                        const isExpanded = expandedReturnId === returnSlip.systemId;
                        const totalReturnQty = (returnSlip.items || []).reduce((sum, item) => sum + (Number(item.returnQuantity) || 0), 0);
                        const totalExchangeQty = (returnSlip.exchangeItems || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
                        const exchangeTrackingCode = (returnSlip as Record<string, unknown>).exchangeTrackingCode as string | null;
                        const exchangeOrderBusinessId = (returnSlip as Record<string, unknown>).exchangeOrderId as string | null;
                        const exchangeOrder = returnSlip.exchangeOrderSystemId ? findOrderById(returnSlip.exchangeOrderSystemId) : null;
                        const difference = Number(returnSlip.finalAmount) || (Number(returnSlip.grandTotalNew) - Number(returnSlip.totalReturnValue));

                        const paymentIds = returnSlip.paymentVoucherSystemIds || (returnSlip.paymentVoucherSystemId ? [returnSlip.paymentVoucherSystemId] : []);
                        const receiptIds = returnSlip.receiptVoucherSystemIds || [];
                        const refundAmount = Number(returnSlip.refundAmount) || 0;
                        const paymentBusinessIds = (returnSlip as unknown as { paymentVoucherIds?: string[] }).paymentVoucherIds || [];
                        const receiptBusinessIds = (returnSlip as unknown as { receiptVoucherIds?: string[] }).receiptVoucherIds || [];
                        const payments = paymentBusinessIds.length > 0
                            ? paymentBusinessIds.map((id, idx) => ({ systemId: paymentIds[idx] || id, id }))
                            : paymentIds.map(id => findPaymentById(id)).filter(Boolean);
                        const receipts = receiptBusinessIds.length > 0
                            ? receiptBusinessIds.map((id, idx) => ({ systemId: receiptIds[idx] || id, id }))
                            : receiptIds.map(id => findReceiptById(id)).filter(Boolean);

                        return (
                            <MobileCard
                                key={returnSlip.systemId}
                                inert
                                emphasis={returnSlip.isReceived ? 'success' : 'warning'}
                            >
                                <MobileCardHeader className="items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs uppercase tracking-wide text-muted-foreground">Mã đơn trả</div>
                                        <Link
                                            href={`/returns/${returnSlip.systemId}`}
                                            className="mt-0.5 block text-sm font-semibold text-primary hover:underline truncate"
                                        >
                                            {returnSlip.id}
                                        </Link>
                                        <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-[10px] font-medium ${
                                            returnSlip.isReceived ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {returnSlip.isReceived ? 'Đã nhận' : 'Chưa nhận'}
                                        </span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-lg font-bold leading-none">{formatCurrency(returnSlip.totalReturnValue)}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">Giá trị trả</div>
                                    </div>
                                </MobileCardHeader>
                                <MobileCardBody>
                                    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Ngày trả</dt>
                                            <dd className="font-medium">
                                                {returnSlip.returnDate
                                                    ? formatDate(returnSlip.returnDate)
                                                    : returnSlip.createdAt
                                                        ? formatDate(returnSlip.createdAt)
                                                        : '—'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">SL hàng trả</dt>
                                            <dd className="font-medium">{totalReturnQty}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">SL hàng đổi</dt>
                                            <dd className="font-medium">{totalExchangeQty > 0 ? totalExchangeQty : '—'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">Giá trị hàng đổi</dt>
                                            <dd className="font-medium">
                                                {returnSlip.grandTotalNew > 0 ? formatCurrency(returnSlip.grandTotalNew) : '—'}
                                            </dd>
                                        </div>
                                        <div className="col-span-2">
                                            <dt className="text-xs text-muted-foreground">Mã vận đơn</dt>
                                            <dd className="font-medium break-all">
                                                {exchangeTrackingCode ? (
                                                    <Link href={`/orders/${returnSlip.exchangeOrderSystemId || order.systemId}`} className="text-primary hover:underline font-mono text-xs">
                                                        {exchangeTrackingCode}
                                                    </Link>
                                                ) : (exchangeOrderBusinessId || exchangeOrder) ? (
                                                    <Link href={`/orders/${returnSlip.exchangeOrderSystemId}`} className="text-primary hover:underline">
                                                        {exchangeOrderBusinessId || exchangeOrder?.id}
                                                    </Link>
                                                ) : totalExchangeQty > 0 ? (
                                                    <span className="text-muted-foreground text-xs">Chờ xử lý</span>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">—</span>
                                                )}
                                            </dd>
                                        </div>
                                        <div className="col-span-2">
                                            <dt className="text-xs text-muted-foreground">Chênh lệch</dt>
                                            <dd className="font-semibold">
                                                {difference === 0 ? (
                                                    <span className="text-muted-foreground">0</span>
                                                ) : difference > 0 ? (
                                                    <span className="text-amber-600">+{formatCurrency(difference)}</span>
                                                ) : (
                                                    <span className="text-green-600">{formatCurrency(difference)}</span>
                                                )}
                                            </dd>
                                        </div>
                                        <div className="col-span-2">
                                            <dt className="text-xs text-muted-foreground">Phiếu thu/chi</dt>
                                            <dd className="font-medium">
                                                {(payments.length > 0 || receipts.length > 0) ? (
                                                    <div className="flex flex-col gap-0.5 text-xs">
                                                        {payments.map((payment) => (
                                                            <Link key={payment!.systemId} href={`/payments/${payment!.systemId}`} className="text-green-600 hover:underline">
                                                                {payment!.id}
                                                            </Link>
                                                        ))}
                                                        {receipts.map((receipt) => (
                                                            <Link key={receipt!.systemId} href={`/receipts/${receipt!.systemId}`} className="text-blue-600 hover:underline">
                                                                {receipt!.id}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : refundAmount > 0 ? (
                                                    <span className="text-green-600 text-xs">Đã chi: {formatCurrency(refundAmount)}</span>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </MobileCardBody>
                                <MobileCardFooter>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setExpandedReturnId(isExpanded ? null : returnSlip.systemId)}
                                    >
                                        {isExpanded ? (<><ChevronDown className="h-4 w-4 mr-1" />Thu gọn</>) : (<><ChevronRight className="h-4 w-4 mr-1" />Chi tiết</>)}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => handlePrintReturn(e, returnSlip)}
                                        title="In phiếu trả hàng"
                                    >
                                        <Printer className="h-4 w-4 mr-1" />
                                        In
                                    </Button>
                                </MobileCardFooter>
                                {isExpanded && (
                                    <div className="mt-3 pt-3 border-t border-border/50 space-y-4">
                                        <div>
                                            <h4 className="font-semibold mb-2 text-sm">Chi tiết hàng trả</h4>
                                            <div className="space-y-2">
                                                {returnSlip.items.map((item: { productSystemId: string; returnQuantity: number; unitPrice: number; totalValue: number; productName?: string; productId?: string; note?: string; thumbnailImage?: string; productType?: string }, index: number) => {
                                                    const product = findProductById(item.productSystemId);
                                                    return (
                                                        <div key={`m-return-${returnSlip.systemId}-${item.productSystemId}-${index}`} className="flex gap-3 rounded-lg border border-border/50 p-2">
                                                            <ProductThumbnailCell
                                                                productSystemId={item.productSystemId}
                                                                product={product}
                                                                productName={item.productName || ''}
                                                                size="sm"
                                                                onPreview={onPreview}
                                                                itemThumbnailImage={item.thumbnailImage}
                                                            />
                                                            <div className="min-w-0 flex-1 text-sm">
                                                                <Link href={`/products/${item.productSystemId}`} className="font-medium text-primary hover:underline line-clamp-2">
                                                                    {item.productName || product?.name}
                                                                </Link>
                                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                                    SL: {item.returnQuantity} × {formatCurrency(item.unitPrice)}
                                                                </div>
                                                                {item.note && (
                                                                    <div className="text-xs text-amber-600 italic mt-0.5 flex items-center gap-1">
                                                                        <StickyNote className="h-3 w-3" />
                                                                        <span>{item.note}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-right shrink-0 text-sm font-semibold">
                                                                {formatCurrency(item.totalValue)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div className="flex items-center justify-between text-sm pt-1 border-t border-border/50">
                                                    <span className="font-semibold">Tổng cộng</span>
                                                    <span className="font-bold">{formatCurrency(returnSlip.totalReturnValue)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {returnSlip.exchangeItems && returnSlip.exchangeItems.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-2 text-sm">Chi tiết hàng đổi</h4>
                                                <div className="space-y-2">
                                                    {returnSlip.exchangeItems.map((item: { productSystemId: string; quantity: number; unitPrice: number; discount: number; discountType?: 'percentage' | 'fixed'; productName?: string; productId?: string; note?: string; thumbnailImage?: string; productType?: string }) => {
                                                        const lineTotal = item.quantity * item.unitPrice - (item.discountType === 'percentage' ? (item.quantity * item.unitPrice * item.discount / 100) : item.discount);
                                                        const product = findProductById(item.productSystemId);
                                                        return (
                                                            <div key={`m-ex-${returnSlip.systemId}-${item.productSystemId}`} className="flex gap-3 rounded-lg border border-border/50 p-2">
                                                                <ProductThumbnailCell
                                                                    productSystemId={item.productSystemId}
                                                                    product={product}
                                                                    productName={item.productName || ''}
                                                                    size="sm"
                                                                    onPreview={onPreview}
                                                                    itemThumbnailImage={item.thumbnailImage}
                                                                />
                                                                <div className="min-w-0 flex-1 text-sm">
                                                                    <Link href={`/products/${item.productSystemId}`} className="font-medium text-primary hover:underline line-clamp-2">
                                                                        {item.productName}
                                                                    </Link>
                                                                    <div className="text-xs text-muted-foreground mt-0.5">
                                                                        SL: {item.quantity} × {formatCurrency(item.unitPrice)}
                                                                    </div>
                                                                    {item.note && (
                                                                        <div className="text-xs text-amber-600 italic mt-0.5 flex items-center gap-1">
                                                                            <StickyNote className="h-3 w-3" />
                                                                            <span>{item.note}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="text-right shrink-0 text-sm font-semibold">
                                                                    {formatCurrency(lineTotal)}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    <div className="flex items-center justify-between text-sm pt-1 border-t border-border/50">
                                                        <span className="font-semibold">Tổng cộng</span>
                                                        <span className="font-bold">{formatCurrency(returnSlip.grandTotalNew)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </MobileCard>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
