'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatDateTime as formatDateTimeUtil } from '../../lib/date-utils';
import { useSalesReturn } from './hooks/use-sales-returns';
import { usePageHeader } from '../../contexts/page-header-context';
import { useAuth } from '../../contexts/auth-context';
import { useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { usePrint } from '../../lib/use-print';
import { 
  convertSalesReturnForPrint,
  mapSalesReturnToPrintData, 
  mapSalesReturnReturnLineItems,
  createStoreSettingsFromBranch 
} from '../../lib/print/sales-return-print-helper';
// ✅ REMOVED: Receipt/Payment print helpers - không cần fetch full data
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import Link from 'next/link';
import { Printer, ArrowLeft } from 'lucide-react';
import { DetailField } from '../../components/ui/detail-field';
import { Separator } from '../../components/ui/separator';
// ✅ REMOVED: useReceiptFinder, usePaymentFinder, useCustomerFinder, useEmployeeFinder
// - Không cần fetch all data, API đã trả về customerSystemId, creatorSystemId
import { ROUTES, generatePath } from '../../lib/router';
import type { BreadcrumbItem } from '../../lib/breadcrumb-system';
import { SalesReturnWorkflowCard } from './components/sales-return-workflow-card';
import type { Subtask } from '../../components/shared/subtask-list';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { DetailPageShell, mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { asSystemId, type SystemId } from '../../lib/id-types';
import { ReadOnlyProductsTable } from '../../components/shared/read-only-products-table';
import { useComments } from '../../hooks/use-comments';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return formatDateTimeUtil(dateString);
};

export function SalesReturnDetailPage() {
    const { systemId } = useParams<{ systemId: string }>();
    const router = useRouter();
    const { data: salesReturn, isLoading: isLoadingSalesReturn } = useSalesReturn(systemId);
    // ✅ REMOVED: useReceiptFinder, usePaymentFinder - không cần fetch all, chỉ cần systemId từ salesReturn
    // ✅ REMOVED: useCustomerFinder, useEmployeeFinder - API đã trả về customerSystemId, creatorSystemId
    const { findById: findBranchById } = useBranchFinder();
    const { info: storeInfo } = useStoreInfoData();
    const { employee: authEmployee } = useAuth();
    const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);

    // ✅ Sử dụng useComments hook thay vì localStorage trực tiếp
    const { 
      comments: dbComments, 
      addComment: dbAddComment, 
      deleteComment: dbDeleteComment 
    } = useComments('sales_return', systemId || '');
    
    type ReturnComment = CommentType<SystemId>;
    const comments = React.useMemo<ReturnComment[]>(() => 
      dbComments.map(c => ({
        id: asSystemId(c.systemId),
        content: c.content,
        author: {
          systemId: asSystemId(c.createdBy || 'system'),
          name: c.createdByName || 'Hệ thống',
        },
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        attachments: c.attachments,
      })), 
      [dbComments]
    );

    const handleAddComment = React.useCallback((content: string, attachments?: string[], _parentId?: string) => {
        dbAddComment(content, attachments || []);
    }, [dbAddComment]);

    const handleUpdateComment = React.useCallback((_commentId: string, _content: string) => {
    }, []);

    const handleDeleteComment = React.useCallback((commentId: string) => {
        dbDeleteComment(commentId);
    }, [dbDeleteComment]);

    const commentCurrentUser = React.useMemo(() => ({
        systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
        name: authEmployee?.fullName || 'Hệ thống',
        avatar: authEmployee?.avatar,
    }), [authEmployee]);

    // ✅ Không cần fetch all customers/employees - dùng trực tiếp systemId từ API
    // customer/creator lookup removed - API đã trả về customerSystemId, creatorSystemId, customerName, creatorName

    // ✅ relatedTransaction - chỉ cần hiển thị link, không cần fetch full data
    // Helper: Convert systemId to business ID (PAYMENT000049 -> PC000049, RECEIPT000049 -> PT000049)
    const toBusinessId = (systemId: string, type: 'payment' | 'receipt'): string => {
        const prefix = type === 'payment' ? 'PC' : 'PT';
        const match = systemId.match(/\d+/);
        if (match) {
            return `${prefix}${match[0]}`;
        }
        return systemId;
    };
    
    const relatedTransactionInfo = React.useMemo(() => {
        if (!salesReturn) return null;
        // Check for payment voucher (refund to customer)
        if (salesReturn.paymentVoucherSystemIds && salesReturn.paymentVoucherSystemIds.length > 0) {
            const systemId = salesReturn.paymentVoucherSystemIds[0];
            const apiBusinessId = ((salesReturn as Record<string, unknown>).paymentVoucherIds as string[] | undefined)?.[0];
            return { 
                systemId, 
                // ✅ Use business ID from API, or convert from systemId
                businessId: apiBusinessId || toBusinessId(systemId, 'payment'),
                type: 'payment' as const,
            };
        }
        // Check for receipt voucher (customer pays difference)
        if (salesReturn.receiptVoucherSystemIds && salesReturn.receiptVoucherSystemIds.length > 0) {
            const systemId = salesReturn.receiptVoucherSystemIds[0];
            const apiBusinessId = ((salesReturn as Record<string, unknown>).receiptVoucherIds as string[] | undefined)?.[0];
            return { 
                systemId, 
                // ✅ Use business ID from API, or convert from systemId
                businessId: apiBusinessId || toBusinessId(systemId, 'receipt'),
                type: 'receipt' as const,
            };
        }
        return null;
    }, [salesReturn]);

    const { print } = usePrint(salesReturn?.branchSystemId);

    const handlePrint = React.useCallback(() => {
        if (!salesReturn) return;

        const branch = findBranchById(salesReturn.branchSystemId);
        const storeSettings = createStoreSettingsFromBranch(branch, storeInfo);

        const returnForPrint = convertSalesReturnForPrint(salesReturn, {
            branch,
            customer: undefined, // ✅ Customer lookup removed for performance
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

        // If exchange items exist, use sales-exchange template with both line item groups
        const hasExchangeItems = salesReturn.exchangeItems && salesReturn.exchangeItems.length > 0;
        if (hasExchangeItems) {
            const returnLineItems = mapSalesReturnReturnLineItems(returnForPrint.returnItems || []);
            const exchangeLineItems = salesReturn.exchangeItems!.map((item, index) => ({
                '{line_stt}': (index + 1).toString(),
                '{line_product_name}': item.productName,
                '{line_variant_code}': item.productId,
                '{line_variant}': '',
                '{line_unit}': 'Cái',
                '{line_quantity}': item.quantity.toString(),
                '{line_price}': formatCurrency(item.unitPrice),
                '{line_amount}': formatCurrency(item.quantity * item.unitPrice),
            }));
            print('sales-exchange', {
                data: mappedData,
                lineItems: exchangeLineItems,
                secondaryLineItems: returnLineItems,
            });
        } else {
            print('sales-return', {
                data: mappedData,
                lineItems: lineItems
            });
        }
    }, [salesReturn, findBranchById, storeInfo, print]);

    // ✅ Simplified: Chỉ navigate đến trang receipt/payment để in từ đó
    // Bỏ handlePrintTransaction phức tạp - không cần fetch full receipt/payment data

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
        subtitle: isLoadingSalesReturn ? 'Đang tải dữ liệu phiếu trả hàng' : undefined,
        breadcrumb,
        showBackButton: true,
        backPath: ROUTES.SALES.RETURNS,
        badge: salesReturn ? (
            <Badge variant={salesReturn.isReceived ? 'default' : 'secondary'}>
                {salesReturn.isReceived ? 'Đã nhận hàng' : 'Chưa nhận hàng'}
            </Badge>
        ) : undefined,
        actions: headerActions,
    }), [salesReturn, headerActions, breadcrumb, isLoadingSalesReturn]);

    usePageHeader(pageHeaderConfig);

    // Show loading state - shadcn Skeleton
    if (isLoadingSalesReturn) {
        return (
            <div className="space-y-4 md:space-y-6">
                {/* Status skeleton */}
                <div className="h-16 bg-muted animate-pulse rounded-lg" />
                
                {/* Main grid skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                    <div className="lg:col-span-4 h-48 bg-muted animate-pulse rounded-lg" />
                    <div className="lg:col-span-3 h-48 bg-muted animate-pulse rounded-lg" />
                    <div className="lg:col-span-3 h-48 bg-muted animate-pulse rounded-lg" />
                </div>
                
                {/* Products table skeleton */}
                <div className="h-64 bg-muted animate-pulse rounded-lg" />
            </div>
        );
    }

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
        <DetailPageShell gap="lg">
            {/* Status Card */}
            <Card className={mobileBleedCardClass}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-sm">Đã hoàn thành</Badge>
                        <Separator orientation="vertical" className="h-6" />
                        <span className="text-sm text-muted-foreground">
                            Ngày tạo: {formatDate(salesReturn.createdAt || salesReturn.returnDate)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                {/* Left Column - Customer & Order Info - 40% */}
                <Card className={cn("lg:col-span-4", mobileBleedCardClass)}>
                    <CardHeader>
                        <CardTitle>Thông tin trả hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailField label="Đơn hàng gốc">
                            <Link href={`/orders/${salesReturn.orderSystemId}`} 
                                className="text-primary hover:underline font-medium"
                            >
                                {salesReturn.orderId}
                            </Link>
                        </DetailField>
                        {salesReturn.exchangeOrderSystemId && (
                            <DetailField label="Đơn đổi hàng">
                                <Link href={`/orders/${salesReturn.exchangeOrderSystemId}`} 
                                    className="text-primary hover:underline font-medium"
                                >
                                    {salesReturn.exchangeOrderId || salesReturn.exchangeOrderSystemId}
                                </Link>
                            </DetailField>
                        )}
                        {salesReturn.exchangeTrackingCode && (
                            <DetailField label="Mã vận đơn" value={salesReturn.exchangeTrackingCode} />
                        )}
                        <DetailField label="Khách hàng">
                            {salesReturn.customerSystemId ? (
                                <Link href={`/customers/${salesReturn.customerSystemId}`}
                                    className="text-primary hover:underline font-medium cursor-pointer"
                                >
                                    {salesReturn.customerName}
                                </Link>
                            ) : (
                                <span>{salesReturn.customerName || '-'}</span>
                            )}
                        </DetailField>
                        <DetailField label="Chi nhánh" value={salesReturn.branchName} />
                        <DetailField label="Người tạo">
                            {salesReturn.creatorSystemId ? (
                                <Link href={`/employees/${salesReturn.creatorSystemId}`}
                                    className="text-primary hover:underline font-medium cursor-pointer"
                                >
                                    {salesReturn.creatorName}
                                </Link>
                            ) : (
                                <span>{salesReturn.creatorName || '-'}</span>
                            )}
                        </DetailField>
                        <DetailField label="Ngày trả hàng" value={formatDate(salesReturn.returnDate)} />
                        {salesReturn.deliveryMethod && (
                            <DetailField label="Hình thức giao" value={
                                salesReturn.deliveryMethod === 'pickup' ? 'Nhận tại cửa hàng' : 
                                salesReturn.deliveryMethod === 'ship' ? 'Giao hàng' : 
                                salesReturn.deliveryMethod === 'shipping-partner' ? 'Giao hàng qua đối tác' :
                                salesReturn.deliveryMethod === 'self-delivery' ? 'Tự giao hàng' :
                                salesReturn.deliveryMethod
                            } />
                        )}
                    </CardContent>
                </Card>

                {/* Middle Column - Financial Summary - 30% */}
                <Card className={cn("lg:col-span-3", mobileBleedCardClass)}>
                    <CardHeader>
                        <CardTitle>Tổng quan tài chính</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Tổng giá trị hàng trả</span>
                            <span className="font-medium">{formatCurrency(salesReturn.totalReturnValue || salesReturn.items?.reduce((sum, i) => sum + (i.totalValue || 0), 0) || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Tổng giá trị hàng đổi</span>
                            <span className="font-medium">{formatCurrency(salesReturn.grandTotalNew || salesReturn.exchangeItems?.reduce((sum, i) => sum + ((i.quantity || 0) * (i.unitPrice || 0)), 0) || 0)}</span>
                        </div>
                        {(salesReturn.shippingFeeNew ?? 0) > 0 && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Phí vận chuyển</span>
                                <span className="font-medium">{formatCurrency(salesReturn.shippingFeeNew)}</span>
                            </div>
                        )}
                        {salesReturn.finalAmount !== 0 && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Chênh lệch</span>
                                <span className={`font-medium ${salesReturn.finalAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {salesReturn.finalAmount > 0 ? '+' : ''}{formatCurrency(salesReturn.finalAmount)}
                                </span>
                            </div>
                        )}
                        <Separator />
                        {(() => {
                            // Tính số tiền thực tế đã hoàn/thu
                            const totalRefunded = (salesReturn.refunds || []).reduce((sum, r) => sum + (r.amount || 0), 0) || salesReturn.refundAmount || 0;
                            const totalPaid = (salesReturn.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
                            // ✅ Kiểm tra có phiếu thu/chi không (trường hợp payments/refunds array rỗng nhưng có voucher)
                            const hasReceiptVouchers = (salesReturn.receiptVoucherSystemIds || []).length > 0;
                            const hasPaymentVouchers = (salesReturn.paymentVoucherSystemIds || []).length > 0;
                            
                            // ✅ Tính chênh lệch từ giá trị hàng nếu finalAmount = 0
                            // Chênh lệch = Tổng giá trị hàng đổi - Tổng giá trị hàng trả
                            const totalReturnValue = salesReturn.totalReturnValue || salesReturn.items?.reduce((sum, i) => sum + (i.totalValue || 0), 0) || 0;
                            const totalExchangeValue = salesReturn.grandTotalNew || salesReturn.exchangeItems?.reduce((sum, i) => sum + ((i.quantity || 0) * (i.unitPrice || 0)), 0) || 0;
                            const calculatedDiff = totalExchangeValue - totalReturnValue;
                            
                            // ✅ Sử dụng finalAmount nếu có, nếu không thì tính từ chênh lệch
                            const finalAmount = salesReturn.finalAmount !== 0 ? salesReturn.finalAmount : calculatedDiff;
                            
                            // Nếu không có hoàn tiền và không có thanh toán VÀ không có phiếu thu/chi
                            if (totalRefunded === 0 && totalPaid === 0 && !hasReceiptVouchers && !hasPaymentVouchers && calculatedDiff === 0) {
                                return (
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-sm font-medium text-muted-foreground">Không phát sinh thanh toán</span>
                                        <span className="text-h3 text-muted-foreground">-</span>
                                    </div>
                                );
                            }
                            
                            // Có hoàn tiền hoặc có phiếu chi (finalAmount < 0 hoặc có refund)
                            if (totalRefunded > 0 || hasPaymentVouchers || finalAmount < 0) {
                                const refundAmount = totalRefunded > 0 ? totalRefunded : Math.abs(finalAmount);
                                return (
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-semibold">Đã hoàn lại khách</span>
                                        <span className="text-h3 text-green-600">{formatCurrency(refundAmount)}</span>
                                    </div>
                                );
                            }
                            
                            // Có thanh toán từ khách hoặc có phiếu thu (finalAmount > 0 hoặc có chênh lệch dương)
                            if (totalPaid > 0 || hasReceiptVouchers || finalAmount > 0) {
                                // ✅ Ưu tiên: totalPaid > calculatedDiff > finalAmount
                                const paidAmount = totalPaid > 0 ? totalPaid : (calculatedDiff > 0 ? calculatedDiff : finalAmount);
                                return (
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-semibold">Khách đã trả thêm</span>
                                        <span className="text-h3 text-red-600">{formatCurrency(paidAmount)}</span>
                                    </div>
                                );
                            }
                            
                            return null;
                        })()}
                        {relatedTransactionInfo && (
                            <>
                                <Separator />
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Chứng từ thanh toán</span>
                                    <Link href={`/${relatedTransactionInfo.type === 'receipt' ? 'receipts' : 'payments'}/${relatedTransactionInfo.systemId}`} 
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {relatedTransactionInfo.businessId}
                                    </Link>
                                </div>
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
                <Card className={mobileBleedCardClass}>
                    <CardHeader>
                        <CardTitle>Lý do trả hàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{salesReturn.reason}</p>
                    </CardContent>
                </Card>
            )}

            {salesReturn.items.length > 0 && (
                 <Card className={mobileBleedCardClass}>
                    <CardHeader>
                        <CardTitle>Sản phẩm trả lại</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReadOnlyProductsTable
                            lineItems={salesReturn.items.map(item => ({
                                // ✅ API đã transform sang ReturnLineItem type
                                productSystemId: item.productSystemId || '',
                                productId: item.productId || '', // business ID (ZP8)
                                productName: item.productName,
                                returnQuantity: item.returnQuantity || 0,
                                unitPrice: item.unitPrice || 0,
                                totalValue: item.totalValue || 0,
                                note: item.note,
                                thumbnailImage: item.thumbnailImage, // ✅ API trả về thumbnailImage
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
                <Card className={mobileBleedCardClass}>
                    <CardHeader>
                        <CardTitle>Sản phẩm đổi (lấy thêm)</CardTitle>
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
                <Card className={mobileBleedCardClass}>
                    <CardHeader>
                        <CardTitle>Ghi chú</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{salesReturn.note}</p>
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
            <EntityActivityTable entityType="sales_return" entityId={systemId} />
        </DetailPageShell>
    );
}
