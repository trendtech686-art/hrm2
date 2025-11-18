import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDate as formatDateUtil, formatDateTime as formatDateTimeUtil, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '../../lib/date-utils.ts';
import { useSalesReturnStore } from './store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { ArrowLeft, Printer } from 'lucide-react';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import type { SalesReturn } from './types.ts';
import { useReceiptStore } from '../receipts/store.ts';
import { usePaymentStore } from '../payments/store.ts';
import type { Receipt } from '../receipts/types.ts';
import type { Payment } from '../payments/types.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useProductStore } from '../products/store.ts';

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
    const navigate = useNavigate();
    const { findById } = useSalesReturnStore();
    const { findById: findReceiptById } = useReceiptStore();
    const { findById: findPaymentById } = usePaymentStore();
    const { findById: findCustomerById } = useCustomerStore();
    const { findById: findEmployeeById } = useEmployeeStore();
    const { findById: findProductById } = useProductStore();

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
            return findPaymentById(salesReturn.paymentVoucherSystemIds[0]);
        }
        // Check for receipt voucher (customer pays difference)
        if (salesReturn.receiptVoucherSystemIds && salesReturn.receiptVoucherSystemIds.length > 0) {
            return findReceiptById(salesReturn.receiptVoucherSystemIds[0]);
        }
        return null;
    }, [salesReturn, findPaymentById, findReceiptById]);

    const pageActions = React.useMemo(() => (
        <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => navigate('/returns')}>
                Quay lại
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert('Chức năng đang phát triển')}>
                In
            </Button>
        </div>
    ), [navigate]);

    usePageHeader({
        title: `Phiếu trả hàng ${salesReturn?.id || ''}`,
        actions: [pageActions]
    });

    if (!salesReturn) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Không tìm thấy phiếu trả hàng</h2>
                    <Button onClick={() => navigate('/returns')} className="mt-4">
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
                        <Badge variant="secondary" className="text-sm">Đã hoàn thành</Badge>
                        <Separator orientation="vertical" className="h-6" />
                        <span className="text-sm text-muted-foreground">
                            Ngày tạo: {formatDate(salesReturn.returnDate)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column - Customer & Order Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Thông tin trả hàng</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <DetailField label="Đơn hàng gốc">
                            <Link 
                                to={`/orders/${salesReturn.orderSystemId}`} 
                                className="text-primary hover:underline font-medium"
                            >
                                {salesReturn.orderId}
                            </Link>
                        </DetailField>
                        <DetailField label="Khách hàng">
                            {customer ? (
                                <Link 
                                    to={`/customers/${customer.systemId}`}
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
                                <Link 
                                    to={`/employees/${creator.systemId}`}
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

                {/* Right Column - Financial Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Tổng quan tài chính</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Tổng giá trị hàng trả</span>
                            <span className="font-medium">{formatCurrency(salesReturn.totalReturnValue)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Tổng giá trị hàng đổi</span>
                            <span className="font-medium">{formatCurrency(salesReturn.grandTotalNew)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-semibold">
                                {salesReturn.finalAmount >= 0 ? 'Khách trả thêm' : 'Hoàn lại khách'}
                            </span>
                            <span className={`text-lg font-bold ${salesReturn.finalAmount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(Math.abs(salesReturn.finalAmount))}
                            </span>
                        </div>
                        {relatedTransaction && (
                            <>
                                <Separator />
                                <DetailField label="Chứng từ thanh toán">
                                    <Link 
                                        to={`/${'id' in relatedTransaction && relatedTransaction.id.startsWith('PT-') ? 'receipts' : 'payments'}/${relatedTransaction.systemId}`} 
                                        className="text-primary hover:underline font-medium"
                                    >
                                        {relatedTransaction.id}
                                    </Link>
                                </DetailField>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Reason Card */}
            {salesReturn.reason && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Lý do trả hàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{salesReturn.reason}</p>
                    </CardContent>
                </Card>
            )}

            {salesReturn.items.length > 0 && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Sản phẩm trả lại</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead className="text-center">Số lượng</TableHead>
                                        <TableHead className="text-right">Đơn giá trả</TableHead>
                                        <TableHead className="text-right">Thành tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesReturn.items.map(item => {
                                        const product = findProductById(item.productSystemId);
                                        return (
                                            <TableRow key={item.productSystemId}>
                                                <TableCell>
                                                    {product ? (
                                                        <>
                                                            <Link 
                                                                to={`/products/${product.systemId}`}
                                                                className="font-medium text-primary hover:underline cursor-pointer"
                                                            >
                                                                {item.productName}
                                                            </Link>
                                                            <p className="text-xs text-muted-foreground">
                                                                <Link 
                                                                    to={`/products/${product.systemId}`}
                                                                    className="text-muted-foreground hover:text-primary hover:underline"
                                                                >
                                                                    {item.productId}
                                                                </Link>
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="font-medium">{item.productName}</p>
                                                            <p className="text-xs text-muted-foreground">{item.productId}</p>
                                                        </>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">{item.returnQuantity}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                <TableCell className="text-right font-semibold">{formatCurrency(item.totalValue)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right font-semibold">Tổng giá trị hàng trả</TableCell>
                                        <TableCell className="text-right font-bold">{formatCurrency(salesReturn.totalReturnValue)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {salesReturn.exchangeItems.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Sản phẩm đổi (lấy thêm)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead className="text-center">Số lượng</TableHead>
                                        <TableHead className="text-right">Đơn giá</TableHead>
                                        <TableHead className="text-right">Thành tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {salesReturn.exchangeItems.map(item => {
                                        const product = findProductById(item.productSystemId);
                                        return (
                                            <TableRow key={item.productSystemId}>
                                                <TableCell>
                                                    {product ? (
                                                        <>
                                                            <Link 
                                                                to={`/products/${product.systemId}`}
                                                                className="font-medium text-primary hover:underline cursor-pointer"
                                                            >
                                                                {item.productName}
                                                            </Link>
                                                            <p className="text-xs text-muted-foreground">
                                                                <Link 
                                                                    to={`/products/${product.systemId}`}
                                                                    className="text-muted-foreground hover:text-primary hover:underline"
                                                                >
                                                                    {item.productId}
                                                                </Link>
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="font-medium">{item.productName}</p>
                                                            <p className="text-xs text-muted-foreground">{item.productId}</p>
                                                        </>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                <TableCell className="text-right font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right font-semibold">Tổng giá trị hàng đổi</TableCell>
                                        <TableCell className="text-right font-bold">{formatCurrency(salesReturn.grandTotalNew)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Notes if any */}
            {salesReturn.note && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Ghi chú</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{salesReturn.note}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
