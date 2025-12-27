'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDateTime as formatDateTimeUtil } from '../../lib/date-utils';
import { useSalesReturnStore } from './store';
import { usePageHeader } from '../../contexts/page-header-context';
import { useAuth } from '../../contexts/auth-context';
import { useBranchStore } from '../settings/branches/store';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { usePrint } from '../../lib/use-print';
import { StoreSettings, numberToWords, formatTime } from '../../lib/print-service';
import { 
  convertSalesReturnForPrint,
  mapSalesReturnToPrintData, 
  mapSalesReturnLineItems, 
  createStoreSettingsFromBranch 
} from '../../lib/print/sales-return-print-helper';
import { 
  convertReceiptForPrint,
  mapReceiptToPrintData,
  createStoreSettings as createReceiptStoreSettings,
} from '../../lib/print/receipt-print-helper';
import { 
  convertPaymentForPrint,
  mapPaymentToPrintData,
  createStoreSettings as createPaymentStoreSettings,
} from '../../lib/print/payment-print-helper';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Printer } from 'lucide-react';
import { DetailField } from '../../components/ui/detail-field';
import { Separator } from '../../components/ui/separator';
import type { SalesReturn } from '@/lib/types/prisma-extended';
import { useReceiptStore } from '../receipts/store';
import { usePaymentStore } from '../payments/store';
import type { Receipt } from '../receipts/types';
import type { Payment } from '../payments/types';
import { useCustomerStore } from '../customers/store';
import { useEmployeeStore } from '../employees/store';
import { ROUTES, generatePath } from '../../lib/router';
import type { BreadcrumbItem } from '../../lib/breadcrumb-system';
import { SalesReturnWorkflowCard } from './components/sales-return-workflow-card';
import type { Subtask } from '../../components/shared/subtask-list';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory';
import { asSystemId, type SystemId } from '../../lib/id-types';
import { ReadOnlyProductsTable } from '../../components/shared/read-only-products-table';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// Fallback labels for product types
const productTypeFallbackLabels: Record<string, string> = {
    physical: 'Hàng hóa',
    single: 'Hàng hóa',
    service: 'Dịch vụ',
    digital: 'Sản phẩm số',
    combo: 'Combo',
};

const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return formatDateTimeUtil(dateString);
};

export function SalesReturnDetailPage() {
    const { systemId } = useParams<{ systemId: string }>();
    const router = useRouter();
    const { findById } = useSalesReturnStore();
    const { findById: findReceiptById } = useReceiptStore();
    const { findById: findPaymentById } = usePaymentStore();
    const { findById: findCustomerById } = useCustomerStore();
    const { findById: findEmployeeById } = useEmployeeStore();
    const { findById: findBranchById } = useBranchStore();
    const { info: storeInfo } = useStoreInfoStore();
    const { employee: authEmployee } = useAuth();
    const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);

    // Comments state with localStorage persistence
    type ReturnComment = CommentType<SystemId>;
    const [comments, setComments] = React.useState<ReturnComment[]>(() => {
        const saved = localStorage.getItem(`sales-return-comments-${systemId}`);
        return saved ? JSON.parse(saved) : [];
    });

    React.useEffect(() => {
        if (systemId) {
            localStorage.setItem(`sales-return-comments-${systemId}`, JSON.stringify(comments));
        }
    }, [comments, systemId]);

    const handleAddComment = React.useCallback((content: string, attachments?: string[], parentId?: string) => {
        const newComment: ReturnComment = {
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

    const salesReturn = React.useMemo(() => (systemId ? findById(systemId) : null), [systemId, findById]);
    
    const customer = React.useMemo(() => {
        if (!salesReturn?.customerSystemId) return null;
        return findCustomerById(salesReturn.customerSystemId);
    }, [salesReturn?.customerSystemId, findCustomerById]);

    const creator = React.useMemo(() => {
        if (!salesReturn?.creatorSystemId) return null;
        return findEmployeeById(salesReturn.creatorSystemId);
    }, [salesReturn?.creatorSystemId, findEmployeeById]);

    const relatedTransaction = React.useMemo((): (Receipt | Payment | null) => {
        if (!salesReturn) return null;
        // Check for payment voucher (refund to customer)
        if (salesReturn.paymentVoucherSystemIds && salesReturn.paymentVoucherSystemIds.length > 0) {
            return findPaymentById(salesReturn.paymentVoucherSystemIds[0]) ?? null;
        }
        // Check for receipt voucher (customer pays difference)
        if (salesReturn.receiptVoucherSystemIds && salesReturn.receiptVoucherSystemIds.length > 0) {
            return findReceiptById(salesReturn.receiptVoucherSystemIds[0]) ?? null;
        }
        return null;
    }, [salesReturn, findPaymentById, findReceiptById]);

    const { print } = usePrint(salesReturn?.branchSystemId);

    const handlePrint = React.useCallback(() => {
        if (!salesReturn) return;

        const branch = findBranchById(salesReturn.branchSystemId);
        const storeSettings = createStoreSettingsFromBranch(branch, storeInfo);

        const returnForPrint = convertSalesReturnForPrint(salesReturn, {
            branch,
            customer,
        });

        const mappedData = mapSalesReturnToPrintData(returnForPrint, storeSettings);
        
        // Inject additional fields
        mappedData['reason_return'] = salesReturn.reason || '';
        mappedData['note'] = salesReturn.note || '';
        
        // Calculate refund status
        let refundStatus = 'Chưa hoàn tiền';
        const totalRefunded = (salesReturn.refunds || []).reduce((sum, r) => sum + (r.amount || 0), 0) || salesReturn.refundAmount || 0;
        const totalPaid = (salesReturn.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        
        if (salesReturn.finalAmount < 0) { // Company needs to refund
             if (totalRefunded >= Math.abs(salesReturn.finalAmount)) {
                 refundStatus = 'Đã hoàn tiền';
             } else if (totalRefunded > 0) {
                 refundStatus = 'Hoàn tiền một phần';
             }
        } else if (salesReturn.finalAmount > 0) { // Customer needs to pay
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

        // Map return items for the main table (since template shows "SL Trả")
        // We map specifically to match the template variables shown in screenshot
        const lineItems = salesReturn.items.map((item, index) => ({
            '{line_stt}': (index + 1).toString(),
            '{line_product_name}': item.productName,
            '{line_variant_code}': item.productId, // Map SKU/ID to variant code
            '{line_variant}': '', // Variant name not available in return items, leave empty to remove placeholder
            '{line_unit}': 'Cái',
            '{line_quantity}': item.returnQuantity.toString(),
            '{line_price}': formatCurrency(item.unitPrice),
            '{line_total}': formatCurrency(item.totalValue), // Matches {line_total} in screenshot
            '{line_amount}': formatCurrency(item.totalValue), // Standard fallback
        }));

        print('sales-return', {
            data: mappedData,
            lineItems: lineItems
        });
    }, [salesReturn, customer, findBranchById, storeInfo, print]);

    const handlePrintTransaction = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!relatedTransaction || !salesReturn) return;

        const branch = findBranchById(salesReturn.branchSystemId);
        const storeSettings = createReceiptStoreSettings(storeInfo);

        const isReceipt = salesReturn.receiptVoucherSystemIds?.includes(relatedTransaction.systemId);
        const type = isReceipt ? 'receipt' : 'payment';
        const amount = relatedTransaction.amount;

        let printData;
        
        if (isReceipt) {
            // Use helper to convert receipt
            const receiptForPrint = convertReceiptForPrint(relatedTransaction as Receipt, {
                branch: branch || undefined,
            });
            // Override with customer info from sales return
            receiptForPrint.payerName = salesReturn.customerName;
            receiptForPrint.payerPhone = customer?.phone;
            receiptForPrint.payerAddress = customer?.addresses?.[0] ? 
                [customer.addresses[0].street, customer.addresses[0].ward, customer.addresses[0].district, customer.addresses[0].province].filter(Boolean).join(', ') 
                : undefined;
            receiptForPrint.payerType = 'Khách hàng';
            receiptForPrint.documentRootCode = salesReturn.id;
            
            printData = mapReceiptToPrintData(receiptForPrint, storeSettings);
        } else {
            // Use helper to convert payment
            const paymentForPrint = convertPaymentForPrint(relatedTransaction as Payment, {
                branch: branch || undefined,
            });
            // Override with customer info from sales return
            paymentForPrint.recipientName = salesReturn.customerName;
            paymentForPrint.recipientPhone = customer?.phone;
            paymentForPrint.recipientAddress = customer?.addresses?.[0] ? 
                [customer.addresses[0].street, customer.addresses[0].ward, customer.addresses[0].district, customer.addresses[0].province].filter(Boolean).join(', ') 
                : undefined;
            paymentForPrint.recipientType = 'Khách hàng';
            paymentForPrint.documentRootCode = salesReturn.id;
            
            printData = mapPaymentToPrintData(paymentForPrint, storeSettings);
        }

        // Add extra fields
        printData['amount_text'] = numberToWords(amount);
        printData['print_date'] = formatDateTimeUtil(new Date());
        printData['print_time'] = formatTime(new Date());
        printData['receipt_barcode'] = relatedTransaction.id;
        printData['description'] = relatedTransaction.description;
        printData['payment_method'] = relatedTransaction.paymentMethodName;

        print(type, { data: printData });

    }, [relatedTransaction, salesReturn, customer, findBranchById, storeInfo, print]);

    const headerActions = React.useMemo(() => [
        <Button
            key="print"
            variant="outline"
            size="sm"
            className="h-9 px-4"
            onClick={handlePrint}
        >
            <Printer className="mr-2 h-4 w-4" />
            In phiếu
        </Button>
    ], [handlePrint]);

    const breadcrumb = React.useMemo<BreadcrumbItem[]>(() => {
        const base: BreadcrumbItem[] = [
            { label: 'Trang chủ', href: ROUTES.ROOT },
            { label: 'Trả hàng', href: ROUTES.SALES.RETURNS },
        ];
        if (salesReturn) {
            return [
                ...base,
                {
                    label: salesReturn.id,
                    href: generatePath(ROUTES.SALES.RETURN_VIEW, { systemId: salesReturn.systemId }),
                    isCurrent: true,
                },
            ];
        }
        return [
            ...base,
            { label: 'Chi tiết', href: ROUTES.SALES.RETURNS, isCurrent: true },
        ];
    }, [salesReturn]);

    const pageHeaderConfig = React.useMemo(() => ({
        title: salesReturn ? `Phiếu trả hàng ${salesReturn.id}` : 'Phiếu trả hàng',
        subtitle: salesReturn
            ? `${salesReturn.customerName} | ${salesReturn.branchName} | Giá trị ${formatCurrency(salesReturn.totalReturnValue)} VND`
            : 'Đang tải dữ liệu phiếu trả hàng',
        breadcrumb,
        showBackButton: true,
        backPath: ROUTES.SALES.RETURNS,
        badge: salesReturn ? (
            <Badge variant={salesReturn.isReceived ? 'default' : 'secondary'}>
                {salesReturn.isReceived ? 'Đã nhận hàng' : 'Chưa nhận hàng'}
            </Badge>
        ) : undefined,
        actions: headerActions,
    }), [salesReturn, headerActions, breadcrumb]);

    usePageHeader(pageHeaderConfig);

    if (!salesReturn) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-h2">Không tìm thấy phiếu trả hàng</h2>
                    <Button onClick={() => router.push(ROUTES.SALES.RETURNS)} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay về danh sách
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Status Card */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-body-sm">Đã hoàn thành</Badge>
                        <Separator orientation="vertical" className="h-6" />
                        <span className="text-body-sm text-muted-foreground">
                            Ngày tạo: {formatDate(salesReturn.returnDate)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                {/* Left Column - Customer & Order Info - 40% */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="text-h4">Thông tin trả hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailField label="Đơn hàng gốc">
                            <Link href={`/orders/${salesReturn.orderSystemId}`} 
                                className="text-primary hover:underline font-medium"
                            >
                                {salesReturn.orderId}
                            </Link>
                        </DetailField>
                        <DetailField label="Khách hàng">
                            {customer ? (
                                <Link href={`/customers/${customer.systemId}`}
                                    className="text-primary hover:underline font-medium cursor-pointer"
                                >
                                    {salesReturn.customerName}
                                </Link>
                            ) : (
                                <span>{salesReturn.customerName}</span>
                            )}
                        </DetailField>
                        <DetailField label="Chi nhánh" value={salesReturn.branchName} />
                        <DetailField label="Người tạo">
                            {creator ? (
                                <Link href={`/employees/${creator.systemId}`}
                                    className="text-primary hover:underline font-medium cursor-pointer"
                                >
                                    {salesReturn.creatorName}
                                </Link>
                            ) : (
                                <span>{salesReturn.creatorName}</span>
                            )}
                        </DetailField>
                    </CardContent>
                </Card>

                {/* Middle Column - Financial Summary - 30% */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-h4">Tổng quan tài chính</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center text-body-sm">
                            <span className="text-muted-foreground">Tổng giá trị hàng trả</span>
                            <span className="font-medium">{formatCurrency(salesReturn.totalReturnValue)}</span>
                        </div>
                        <div className="flex justify-between items-center text-body-sm">
                            <span className="text-muted-foreground">Tổng giá trị hàng đổi</span>
                            <span className="font-medium">{formatCurrency(salesReturn.grandTotalNew)}</span>
                        </div>
                        <Separator />
                        {(() => {
                            // Tính số tiền thực tế đã hoàn/thu
                            const totalRefunded = (salesReturn.refunds || []).reduce((sum, r) => sum + (r.amount || 0), 0) || salesReturn.refundAmount || 0;
                            const totalPaid = (salesReturn.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
                            
                            // Nếu không có hoàn tiền và không có thanh toán
                            if (totalRefunded === 0 && totalPaid === 0) {
                                return (
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-body-sm font-medium text-muted-foreground">Không phát sinh thanh toán</span>
                                        <span className="text-h3 text-muted-foreground">-</span>
                                    </div>
                                );
                            }
                            
                            // Có hoàn tiền
                            if (totalRefunded > 0) {
                                return (
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-semibold">Đã hoàn lại khách</span>
                                        <span className="text-h3 text-green-600">{formatCurrency(totalRefunded)}</span>
                                    </div>
                                );
                            }
                            
                            // Có thanh toán từ khách
                            if (totalPaid > 0) {
                                return (
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-semibold">Khách đã trả thêm</span>
                                        <span className="text-h3 text-red-600">{formatCurrency(totalPaid)}</span>
                                    </div>
                                );
                            }
                            
                            return null;
                        })()}
                        {relatedTransaction && (
                            <>
                                <Separator />
                                <DetailField label="Chứng từ thanh toán">
                                    <div className="flex items-center gap-2">
                                        <Link href={`/${'id' in relatedTransaction && relatedTransaction.id.startsWith('PT-') ? 'receipts' : 'payments'}/${relatedTransaction.systemId}`} 
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {relatedTransaction.id}
                                        </Link>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handlePrintTransaction} title="In phiếu">
                                            <Printer className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </DetailField>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Right Column - Workflow - 30% */}
                <div className="lg:col-span-3">
                    <SalesReturnWorkflowCard
                        subtasks={subtasks}
                        onSubtasksChange={setSubtasks}
                        readonly={true}
                    />
                </div>
            </div>

            {/* Reason Card */}
            {salesReturn.reason && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-h4">Lý do trả hàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-body-sm text-muted-foreground">{salesReturn.reason}</p>
                    </CardContent>
                </Card>
            )}

            {salesReturn.items.length > 0 && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-h4">Sản phẩm trả lại</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReadOnlyProductsTable
                            lineItems={salesReturn.items.map(item => ({
                                productSystemId: item.productSystemId,
                                productId: item.productId,
                                productName: item.productName,
                                returnQuantity: item.returnQuantity,
                                unitPrice: item.unitPrice,
                                totalValue: item.totalValue,
                                note: item.note,
                            }))}
                            showStorageLocation={false}
                            showDiscount={false}
                            showUnit={false}
                            unitPriceHeader="Đơn giá trả"
                            footerTotalLabel="Tổng giá trị hàng trả"
                        />
                    </CardContent>
                </Card>
            )}

            {salesReturn.exchangeItems.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-h4">Sản phẩm đổi (lấy thêm)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReadOnlyProductsTable
                            lineItems={salesReturn.exchangeItems.map(item => ({
                                productSystemId: item.productSystemId,
                                productId: item.productId,
                                productName: item.productName,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                total: item.quantity * item.unitPrice,
                                note: item.note,
                            }))}
                            showStorageLocation={false}
                            showDiscount={false}
                            showUnit={false}
                            footerTotalLabel="Tổng giá trị hàng đổi"
                        />
                    </CardContent>
                </Card>
            )}

            {/* Notes if any */}
            {salesReturn.note && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-h4">Ghi chú</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-body-sm text-muted-foreground">{salesReturn.note}</p>
                    </CardContent>
                </Card>
            )}

            {/* Comments */}
            <Comments
                entityType="sales-return"
                entityId={salesReturn.systemId}
                comments={comments}
                onAddComment={handleAddComment}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
                currentUser={commentCurrentUser}
                title="Bình luận"
                placeholder="Thêm bình luận về phiếu trả hàng..."
            />

            {/* Activity History */}
            <ActivityHistory
                history={salesReturn.activityHistory || []}
                title="Lịch sử hoạt động"
                emptyMessage="Chưa có lịch sử hoạt động"
                groupByDate
                maxHeight="400px"
            />
        </div>
    );
}
