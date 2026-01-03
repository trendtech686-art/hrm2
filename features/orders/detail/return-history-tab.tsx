'use client'

import * as React from 'react';
import Link from 'next/link';
import { Printer, ChevronDown, ChevronRight, StickyNote } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import type { Order } from '@/lib/types/prisma-extended';
import type { SalesReturn } from '@/features/sales-returns/types';
import { useOrderStore } from '@/features/orders/store';
import { useAllProducts } from '@/features/products/hooks/use-all-products';
import { useBranchFinder } from '@/features/settings/branches/hooks/use-all-branches';
import { useStoreInfoStore } from '@/features/settings/store-info/store-info-store';
import { useCustomerFinder } from '@/features/customers/hooks/use-all-customers';
import { usePrint } from '@/lib/use-print';
import { mapSalesReturnToPrintData, type SalesReturnForPrint } from '@/lib/print-mappers/sales-return.mapper';
import type { StoreSettings } from '@/lib/print-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { formatCurrency } from './types';
import { ProductThumbnailCell } from './product-thumbnail-cell';

interface ReturnHistoryTabProps {
  order: Order;
  salesReturnsForOrder: SalesReturn[];
  getProductTypeLabel?: (productSystemId: string) => string;
  onPreview?: (image: string, title: string) => void;
}

export function ReturnHistoryTab({ order, salesReturnsForOrder, getProductTypeLabel, onPreview }: ReturnHistoryTabProps) {
    const [expandedReturnId, setExpandedReturnId] = React.useState<string | null>(null);
    const [expandedCombos, setExpandedCombos] = React.useState<Record<string, boolean>>({});
    const { data: orders } = useOrderStore();
    const { data: allProducts } = useAllProducts();
    const { findById: findBranchById } = useBranchFinder();
    const { info: storeInfo } = useStoreInfoStore();
    const { print } = usePrint(order.branchSystemId);
    const { findById: findCustomerById } = useCustomerFinder();

    const toggleComboRow = React.useCallback((key: string) => {
        setExpandedCombos(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const handlePrintReturn = React.useCallback((e: React.MouseEvent, salesReturn: SalesReturn) => {
        e.stopPropagation();
        if (!salesReturn) return;

        const branch = findBranchById(salesReturn.branchSystemId);
        const customer = findCustomerById(salesReturn.customerSystemId);
        const storeSettings: StoreSettings = {
            name: storeInfo.brandName || storeInfo.companyName,
            address: storeInfo.headquartersAddress,
            phone: storeInfo.hotline,
            email: storeInfo.email,
            province: storeInfo.province,
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
        const totalRefunded = (salesReturn.refunds || []).reduce((sum, r) => sum + (r.amount || 0), 0) || salesReturn.refundAmount || 0;
        const totalPaid = (salesReturn.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        
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
    }, [findBranchById, storeInfo, print, findCustomerById]);

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Mã đơn trả hàng</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày trả hàng</TableHead>
                            <TableHead className="text-center">Số lượng hàng trả</TableHead>
                            <TableHead className="text-right">Giá trị hàng trả</TableHead>
                            <TableHead>Mã đơn đổi</TableHead>
                            <TableHead className="text-center">Số lượng hàng đổi</TableHead>
                            <TableHead className="text-right">Giá trị hàng đổi</TableHead>
                            <TableHead className="text-right">Chênh lệch</TableHead>
                            <TableHead className="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salesReturnsForOrder.map(returnSlip => {
                            const isExpanded = expandedReturnId === returnSlip.systemId;
                            const totalReturnQty = returnSlip.items.reduce((sum, item) => sum + item.returnQuantity, 0);
                            const totalExchangeQty = returnSlip.exchangeItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                            const exchangeOrder = returnSlip.exchangeOrderSystemId ? orders.find(o => o.systemId === returnSlip.exchangeOrderSystemId) : null;

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
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-body-xs font-medium ${
                                                returnSlip.isReceived 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {returnSlip.isReceived ? 'Đã nhận' : 'Chưa nhận'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{formatDate(returnSlip.returnDate)}</TableCell>
                                        <TableCell className="text-center">{totalReturnQty}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(returnSlip.totalReturnValue)}</TableCell>
                                        <TableCell>
                                            {exchangeOrder ? (
                                                <Link href={`/orders/${exchangeOrder.systemId}`} 
                                                    onClick={e => e.stopPropagation()} 
                                                    className="text-primary hover:underline"
                                                >
                                                    {exchangeOrder.id}
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
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
                                                const totalRefunded = (returnSlip.refunds || []).reduce((sum, r) => sum + (r.amount || 0), 0) || returnSlip.refundAmount || 0;
                                                const totalPaid = (returnSlip.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
                                                
                                                if (totalRefunded === 0 && totalPaid === 0) {
                                                    return <span className="text-muted-foreground">-</span>;
                                                }
                                                
                                                if (totalRefunded > 0) {
                                                    return <span className="text-green-600">-{formatCurrency(totalRefunded)}</span>;
                                                }
                                                
                                                if (totalPaid > 0) {
                                                    return <span className="text-amber-600">{formatCurrency(totalPaid)}</span>;
                                                }
                                                
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
                                            <TableCell colSpan={11} className="p-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Chi tiết hàng trả</h4>
                                                        <div className="border rounded-md bg-background">
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
                                                                    {returnSlip.items.map((item: { productSystemId: string; returnQuantity: number; unitPrice: number; totalValue: number; productName?: string; productId?: string; note?: string }, index: number) => {
                                                                        const product = allProducts.find((p) => p.systemId === item.productSystemId);
                                                                        const productType = getProductTypeLabel?.(item.productSystemId) || '---';
                                                                        const isCombo = product?.type === 'combo';
                                                                        const comboKey = `return-${returnSlip.systemId}-${item.productSystemId}`;
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
                                                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                                                                                        COMBO
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                            <div className="flex items-center gap-1 text-body-xs text-muted-foreground flex-wrap">
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
                                                                                    <TableCell className="text-center">{item.returnQuantity}</TableCell>
                                                                                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                                                    <TableCell className="text-right font-medium">{formatCurrency(item.totalValue)}</TableCell>
                                                                                </TableRow>
                                                                                {isCombo && isComboExpanded && comboChildren.map((comboItem: { productSystemId: string; productName?: string; quantity?: number }, childIndex: number) => {
                                                                                    const childProduct = allProducts.find((p) => p.systemId === comboItem.productSystemId);
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
                                                                                                            className="text-body-xs text-primary hover:underline"
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
                                                            <div className="border rounded-md bg-background">
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
                                                                        {returnSlip.exchangeItems.map((item: { productSystemId: string; quantity: number; unitPrice: number; discount: number; discountType?: 'percentage' | 'fixed'; productName?: string; productId?: string; note?: string }, index: number) => {
                                                                            const lineTotal = item.quantity * item.unitPrice - (item.discountType === 'percentage' ? (item.quantity * item.unitPrice * item.discount / 100) : item.discount);
                                                                            const product = allProducts.find((p) => p.systemId === item.productSystemId);
                                                                            const productType = getProductTypeLabel?.(item.productSystemId) || '---';
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
                                                                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                                                                                            COMBO
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="flex items-center gap-1 text-body-xs text-muted-foreground flex-wrap">
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
                                                                                        const childProduct = allProducts.find((p) => p.systemId === comboItem.productSystemId);
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
                                                                                                                className="text-body-xs text-primary hover:underline"
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
            </CardContent>
        </Card>
    )
}
