'use client'

import * as React from 'react';
import Link from 'next/link';
import type { Order } from '@/lib/types/prisma-extended';
import type { SalesReturn } from '@/features/sales-returns/types';
// ⚡ PERFORMANCE: Use order-specific hooks instead of loading ALL data
import { useOrderReceipts, useOrderPayments, useOrderWarranties } from '../hooks/use-order-financial-data';
import { useEmployeeFinder } from '@/features/employees/hooks/use-all-employees';
import { ActivityHistory, type HistoryEntry } from '@/components/ActivityHistory';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { formatCurrency, type OrderComment } from './types';

interface OrderHistoryTabProps {
  order: Order;
  salesReturnsForOrder: SalesReturn[];
  orderComments: OrderComment[];
}

export function OrderHistoryTab({ order, salesReturnsForOrder, orderComments: _orderComments }: OrderHistoryTabProps) {
    // ⚡ OPTIMIZED: Fetch only data for this order, not ALL receipts/payments/warranties
    const { data: receipts } = useOrderReceipts(order?.systemId);
    const { data: payments } = useOrderPayments(order?.systemId);
    const { data: warranties } = useOrderWarranties(order?.systemId);
    const { findById: findEmployeeById } = useEmployeeFinder();
    const allTransactions = React.useMemo(() => [...receipts, ...payments], [receipts, payments]);

    const parseTimestamp = React.useCallback((value?: string | Date | number) => {
        if (!value) return undefined;
        // Handle Date objects
        if (value instanceof Date) return value;
        // Handle numbers (timestamps)
        if (typeof value === 'number') return new Date(value);
        // Handle strings
        if (typeof value === 'string') {
            return new Date(value.includes('T') ? value : value.replace(' ', 'T'));
        }
        return undefined;
    }, []);

    const buildUser = React.useCallback((systemId?: SystemId | string, fallbackName?: string) => {
        if (systemId && typeof systemId === 'string') {
            const employee = findEmployeeById(asSystemId(systemId));
            if (employee) {
                return { systemId: employee.systemId, name: employee.fullName };
            }
        }

        if (fallbackName) {
            return { systemId: typeof systemId === 'string' ? systemId : 'SYSTEM', name: fallbackName };
        }

        return { systemId: typeof systemId === 'string' ? systemId : 'SYSTEM', name: 'Hệ thống' };
    }, [findEmployeeById]);

    const historyEntries = React.useMemo<HistoryEntry[]>(() => {
        if (!order) return [];
        const entries: HistoryEntry[] = [];

        const pushEntry = (entry: HistoryEntry | null | undefined) => {
            if (entry && entry.timestamp) {
                entries.push(entry);
            }
        };

        const createdAt = parseTimestamp(order.orderDate);
        if (createdAt) {
            pushEntry({
                id: `${order.systemId}-created`,
                action: 'created',
                timestamp: createdAt,
                user: buildUser(order.salespersonSystemId, order.salesperson),
                description: `Tạo đơn hàng ${order.id}`,
            });
        }

        const approvedAt = parseTimestamp(order.approvedDate);
        if (approvedAt) {
            pushEntry({
                id: `${order.systemId}-approved`,
                action: 'status_changed',
                timestamp: approvedAt,
                user: buildUser(undefined, 'Hệ thống'),
                description: 'Đã duyệt đơn hàng',
            });
        }

        const dispatchedAt = parseTimestamp(order.dispatchedDate);
        if (dispatchedAt) {
            pushEntry({
                id: `${order.systemId}-dispatched`,
                action: 'status_changed',
                timestamp: dispatchedAt,
                user: buildUser(order.dispatchedByEmployeeId, order.dispatchedByEmployeeName),
                description: 'Xuất kho cho đơn hàng',
            });
        }

        const completedAt = parseTimestamp(order.completedDate);
        if (completedAt) {
            pushEntry({
                id: `${order.systemId}-completed`,
                action: 'status_changed',
                timestamp: completedAt,
                user: buildUser(undefined, 'Hệ thống'),
                description: 'Hoàn thành đơn hàng',
            });
        }

        const cancelledAt = parseTimestamp(order.cancelledDate);
        if (cancelledAt) {
            pushEntry({
                id: `${order.systemId}-cancelled`,
                action: 'cancelled',
                timestamp: cancelledAt,
                user: buildUser(undefined, 'Hệ thống'),
                description: 'Hủy đơn hàng',
                content: (
                    <div className="text-body-sm">
                        <span>Lý do: </span>
                        <span className="font-medium">{order.cancellationReason || 'Không rõ'}</span>
                        {order.cancellationMetadata && (
                            <p className="mt-1 text-body-xs text-muted-foreground">
                                {order.cancellationMetadata.restockItems ? 'Đã hoàn kho' : 'Không hoàn kho'} ·{' '}
                                {order.cancellationMetadata.notifyCustomer ? 'Đã gửi email cho khách' : 'Không gửi email cho khách'}
                            </p>
                        )}
                    </div>
                ),
            });
        }

        order.payments.forEach(payment => {
            const timestamp = parseTimestamp(payment.date);
            if (!timestamp) return;
            const isRefund = payment.amount < 0;
            const absAmount = formatCurrency(Math.abs(payment.amount));
            const voucherPath = isRefund ? 'payments' : 'receipts';
            const paymentLink = (
                <Link href={`/${voucherPath}/${payment.systemId}`} className="font-semibold text-primary hover:underline">
                    {payment.id}
                </Link>
            );
            const warrantyLink = payment.linkedWarrantySystemId ? (
                <>
                    {' '}từ bảo hành{' '}
                    <Link href={`/warranty/${payment.linkedWarrantySystemId}`}
                        className="font-semibold text-primary hover:underline"
                    >
                        {warranties.find(w => w.systemId === payment.linkedWarrantySystemId)?.id || 'N/A'}
                    </Link>
                </>
            ) : null;

            pushEntry({
                id: `${order.systemId}-payment-${payment.systemId}`,
                action: 'payment_made',
                timestamp,
                user: buildUser(payment.createdBy),
                description: `${isRefund ? 'Hoàn tiền' : 'Thanh toán'} ${absAmount} qua ${payment.method}`,
                content: (
                    <>
                        {isRefund ? 'Hoàn tiền' : 'Thanh toán'}{' '}
                        <span className="font-semibold">{absAmount}</span> qua {payment.method} ({paymentLink}){warrantyLink}.
                    </>
                ),
            });
        });

        order.packagings.forEach(pkg => {
            const requestDate = parseTimestamp(pkg.requestDate);
            if (requestDate) {
                pushEntry({
                    id: `${pkg.systemId}-request`,
                    action: 'product_added',
                    timestamp: requestDate,
                    user: buildUser(pkg.requestingEmployeeId, pkg.requestingEmployeeName),
                    description: 'Yêu cầu đóng gói',
                    content: (
                        <>
                            Yêu cầu đóng gói{' '}
                            <Link href={`/packaging/${pkg.systemId}`} className="text-primary hover:underline">
                                {pkg.id}
                            </Link>
                            .
                        </>
                    ),
                });
            }

            const confirmDate = parseTimestamp(pkg.confirmDate);
            if (confirmDate) {
                pushEntry({
                    id: `${pkg.systemId}-confirm`,
                    action: 'status_changed',
                    timestamp: confirmDate,
                    user: buildUser(pkg.confirmingEmployeeId, pkg.confirmingEmployeeName),
                    description: 'Xác nhận đóng gói',
                    content: (
                        <>
                            Xác nhận đóng gói{' '}
                            <Link href={`/packaging/${pkg.systemId}`} className="text-primary hover:underline">
                                {pkg.id}
                            </Link>
                            .
                        </>
                    ),
                });
            }

            const cancelDate = parseTimestamp(pkg.cancelDate);
            if (cancelDate) {
                pushEntry({
                    id: `${pkg.systemId}-cancel`,
                    action: 'cancelled',
                    timestamp: cancelDate,
                    user: buildUser(pkg.cancelingEmployeeId, pkg.cancelingEmployeeName),
                    description: 'Hủy yêu cầu đóng gói',
                    content: (
                        <>
                            Hủy đóng gói{' '}
                            <Link href={`/packaging/${pkg.systemId}`} className="text-primary hover:underline">
                                {pkg.id}
                            </Link>
                            . Lý do: <span className="italic">{pkg.cancelReason || 'Không rõ'}</span>
                        </>
                    ),
                });
            }
        });

        salesReturnsForOrder.forEach(returnSlip => {
            const timestamp = parseTimestamp(returnSlip.returnDate);
            if (!timestamp) return;
            const transactionSystemId = returnSlip.paymentVoucherSystemId || returnSlip.receiptVoucherSystemIds?.[0];
            const transaction = transactionSystemId ? allTransactions.find(t => t.systemId === transactionSystemId) : null;
            const transactionLink = transaction ? (
                <>
                    {' '}và chứng từ{' '}
                    <Link href={`/${returnSlip.paymentVoucherSystemId ? 'payments' : 'receipts'}/${transaction.systemId}`}
                        className="font-semibold text-primary hover:underline"
                    >
                        {transaction.id}
                    </Link>
                </>
            ) : null;
            const exchangeOrderLink = returnSlip.exchangeOrderSystemId ? (
                <>
                    {' '}và tạo đơn đổi{' '}
                    <Link href={`/orders/${returnSlip.exchangeOrderSystemId}`} className="font-semibold text-primary hover:underline">
                        Xem đơn đổi
                    </Link>
                </>
            ) : null;

            pushEntry({
                id: `${order.systemId}-return-${returnSlip.systemId}`,
                action: 'custom',
                timestamp,
                user: buildUser(returnSlip.creatorSystemId, returnSlip.creatorName),
                description: `Tạo phiếu trả hàng ${returnSlip.id}`,
                content: (
                    <>
                        Tạo phiếu trả hàng{' '}
                        <Link href={`/returns/${returnSlip.systemId}`} className="font-semibold text-primary hover:underline">
                            {returnSlip.id}
                        </Link>
                        {transactionLink}
                        {exchangeOrderLink}.
                    </>
                ),
            });
        });

        if (order.notes && createdAt) {
            pushEntry({
                id: `${order.systemId}-note`,
                action: 'comment_added',
                timestamp: createdAt,
                user: buildUser(order.salespersonSystemId, order.salesperson),
                description: 'Thêm ghi chú đơn hàng',
                content: (
                    <>
                        Ghi chú: <span className="italic">{order.notes}</span>
                    </>
                ),
            });
        }

        // NOTE: Comments are displayed in separate Comments section, not in history
        
        return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [order, salesReturnsForOrder, allTransactions, warranties, buildUser, parseTimestamp]);

    return (
        <ActivityHistory
            history={historyEntries}
            title="Lịch sử & Ghi chú"
            showFilters={false}
            showMetadata={false}
        />
    );
}
