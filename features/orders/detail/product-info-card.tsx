'use client'

import * as React from 'react';
import Link from 'next/link';
import type { Order, OrderPayment } from '@/lib/types/prisma-extended';
import type { SalesReturn } from '@/features/sales-returns/types';
import type { SystemId } from '@/lib/id-types';
import type { Payment } from '@/features/payments/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ReadOnlyProductsTable } from '@/components/shared/read-only-products-table';
import { formatCurrency } from './types';

interface ProductInfoCardProps {
  order: Order;
  costOfGoods: number;
  profit: number;
  totalDiscount: number;
  salesReturns: SalesReturn[];
  getProductTypeLabel: (productSystemId: SystemId) => string;
  canViewFinancials?: boolean; // Only ADMIN/MANAGER/accountant can see cost and profit
  paymentsFromLinkedSalesReturn?: Payment[]; // Payments linked to the sales return (for exchange orders)
}

export function ProductInfoCard({ order, costOfGoods, profit, totalDiscount, salesReturns, getProductTypeLabel: _getProductTypeLabel, canViewFinancials = false, paymentsFromLinkedSalesReturn = [] }: ProductInfoCardProps) {
    // Calculate warranty payments (negative amounts linked to warranty)
    const warrantyPayments = (order?.payments || []).filter(p => Number(p.amount) < 0 && (p as OrderPayment).linkedWarrantySystemId);
    const totalWarrantyDeduction = warrantyPayments.reduce((sum, p) => sum + Math.abs(Number(p.amount) || 0), 0);
    
    // Calculate total refund from linked sales return payments
    const totalRefundFromSalesReturn = paymentsFromLinkedSalesReturn.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    // Check if any line item has tax
    const hasTax = order.lineItems.some(item => item.tax && item.tax > 0);
    
    // Convert order lineItems to ReadOnlyProductsTable format
    const lineItems = order.lineItems.map(item => {
        // Calculate line total with tax
        const lineGross = item.unitPrice * item.quantity;
        const taxAmount = item.tax ? lineGross * (item.tax / 100) : 0;
        let discountValue = 0;
        if (item.discount && item.discount > 0) {
            discountValue = item.discountType === 'fixed' ? item.discount : (lineGross + taxAmount) * (item.discount / 100);
        }
        const lineTotal = lineGross + taxAmount - discountValue;
        
        return {
            productSystemId: item.productSystemId,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            discountType: item.discountType,
            tax: item.tax, // Tax rate (%)
            taxId: item.taxId, // Tax systemId
            total: lineTotal,
            note: item.note,
        };
    });
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
                <ReadOnlyProductsTable
                    lineItems={lineItems}
                    showStorageLocation={false}
                    showUnit={false}
                    showDiscount={true}
                    showTax={hasTax}
                />
                <div className="flex justify-end mt-4">
                    <div className="w-full max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Tổng tiền ({order.lineItems.length} sản phẩm)</span> <span>{formatCurrency(order.subtotal)}</span></div>
                        {/* Only show cost/profit for ADMIN, MANAGER, or accountant roles */}
                        {canViewFinancials && (
                            <>
                                <div className="flex justify-between"><span className="text-muted-foreground">Giá vốn</span> <span>{formatCurrency(costOfGoods)}</span></div>
                                <div className="flex justify-between font-semibold"><span>Lợi nhuận tạm tính</span> <span>{formatCurrency(profit)}</span></div>
                            </>
                        )}
                        <Separator className="my-2!" />
                        <div className="flex justify-between"><span className="text-muted-foreground">Chiết khấu</span> <span>{formatCurrency(-totalDiscount)}</span></div>
                        {hasTax && order.tax > 0 && (
                            <div className="flex justify-between"><span className="text-muted-foreground">Thuế (VAT)</span> <span>{formatCurrency(order.tax)}</span></div>
                        )}
                        <div className="flex justify-between"><span className="text-muted-foreground">Phí giao hàng</span> <span>{formatCurrency(order.shippingFee)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Mã giảm giá</span> <span>{formatCurrency(0)}</span></div>
                        {/* ✅ Show linked sales return value if this is an exchange order */}
                        {order.linkedSalesReturnValue && order.linkedSalesReturnValue > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Giá trị trả hàng {order.linkedSalesReturnSystemId && (
                                        <Link href={`/returns/${order.linkedSalesReturnSystemId}`} className="text-primary hover:underline">
                                            ({salesReturns.find(r => r.systemId === order.linkedSalesReturnSystemId)?.id || 'N/A'})
                                        </Link>
                                    )}
                                </span>
                                <span className="text-red-600">{formatCurrency(-(order.linkedSalesReturnValue ?? 0))}</span>
                            </div>
                        )}
                        {totalWarrantyDeduction > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Trừ tiền bảo hành
                                    {warrantyPayments.map((payment, idx) => (
                                        <React.Fragment key={payment.systemId}>
                                            {idx === 0 && ' ('}
                                            <Link href={`/payments/${payment.systemId}`} 
                                                className="text-primary hover:underline font-medium"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {payment.id}
                                            </Link>
                                            {idx < warrantyPayments.length - 1 ? ', ' : ')'}
                                        </React.Fragment>
                                    ))}:
                                </span>
                                <span className="text-red-600">{formatCurrency(-totalWarrantyDeduction)}</span>
                            </div>
                        )}
                        {/* ✅ Show refund payments from linked sales return BEFORE 'Khách phải trả' */}
                        {paymentsFromLinkedSalesReturn.length > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Phiếu chi từ phiếu trả hàng{' '}
                                    {paymentsFromLinkedSalesReturn.map((payment, idx) => (
                                        <React.Fragment key={payment.systemId}>
                                            {idx > 0 && ', '}
                                            <Link href={`/payments/${payment.systemId}`} 
                                                className="text-primary hover:underline font-medium"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                ({payment.id})
                                            </Link>
                                        </React.Fragment>
                                    ))}:
                                </span>
                                <span className="text-red-600">{formatCurrency(-totalRefundFromSalesReturn)}</span>
                            </div>
                        )}
                        <Separator className="my-2" />
                        {/* ✅ "Khách phải trả" = grandTotal - linkedSalesReturnValue - totalWarrantyDeduction + totalRefundFromSalesReturn */}
                        <div className="flex justify-between font-bold text-h4">
                            <span>Khách phải trả</span> 
                            <span>{formatCurrency(Math.max(0, order.grandTotal - (order.linkedSalesReturnValue || 0) - totalWarrantyDeduction + totalRefundFromSalesReturn))}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
