import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { useOrderStore } from '../orders/store.ts';
import type { Order, Packaging, PackagingStatus } from '../orders/types.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Printer, History } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table.tsx';
import { useCustomerStore } from '../customers/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useProductStore } from '../products/store.ts';
import { Badge } from '../../components/ui/badge.tsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { useAuth } from '../../contexts/auth-context.tsx';


const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const packagingStatusVariants: Record<PackagingStatus, "warning" | "success" | "destructive"> = {
    "Chờ đóng gói": "warning",
    "Đã đóng gói": "success",
    "Hủy đóng gói": "destructive",
};


function CancelPackagingDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = React.useState('');
  
  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hủy yêu cầu đóng gói</DialogTitle>
          <DialogDescription>
            Vui lòng nhập lý do hủy. Hành động này sẽ cập nhật trạng thái của phiếu đóng gói thành "Hủy đóng gói".
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <Label htmlFor="cancel-reason">Lý do hủy</Label>
          <Textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2"
            placeholder="Nhập lý do..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Thoát</Button>
          <Button variant="destructive" onClick={handleConfirm}>Xác nhận Hủy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function PackagingDetailPage() {
    const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
    const navigate = ReactRouterDOM.useNavigate();
    const { data: allOrders, confirmPackaging, cancelPackagingRequest } = useOrderStore();
    const { findById: findCustomerById } = useCustomerStore();
    const { findById: findEmployeeById } = useEmployeeStore();
    const { findById: findProductById } = useProductStore();
    const { employee: authEmployee } = useAuth();
    const currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM';

    const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);

    const { order, packaging } = React.useMemo(() => {
        if (!systemId) return { order: null, packaging: null };
        for (const o of allOrders) {
            const p = o.packagings.find(pkg => pkg.systemId === systemId);
            if (p) {
                return { order: o, packaging: p };
            }
        }
        return { order: null, packaging: null };
    }, [systemId, allOrders]);

    const customer = React.useMemo(() => {
        if (!order) return null;
        return findCustomerById(order.customerSystemId);
    }, [order, findCustomerById]);
    
    const requestingEmployee = React.useMemo(() => {
        if (!packaging?.requestingEmployeeSystemId) return null;
        return findEmployeeById(packaging.requestingEmployeeSystemId);
    }, [packaging?.requestingEmployeeSystemId, findEmployeeById]);
    
    const assignedEmployee = React.useMemo(() => {
        if (!packaging?.assignedEmployeeSystemId) return null;
        return findEmployeeById(packaging.assignedEmployeeSystemId);
    }, [packaging?.assignedEmployeeSystemId, findEmployeeById]);
    
    const confirmingEmployee = React.useMemo(() => {
        if (!packaging?.confirmingEmployeeSystemId) return null;
        return findEmployeeById(packaging.confirmingEmployeeSystemId);
    }, [packaging?.confirmingEmployeeSystemId, findEmployeeById]);

    const pageActions = React.useMemo(() => {
        if (!packaging) return null;
        
        return (
            <div className="flex items-center gap-2 flex-wrap">
                {packaging.status === 'Chờ đóng gói' && (
                    <>
                        <Button 
                            size="sm" 
                            onClick={() => {
                                if (order && packaging) {
                                    confirmPackaging(order.systemId, packaging.systemId, currentUserSystemId);
                                }
                            }}
                        >
                            Xác nhận đã đóng gói
                        </Button>
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => setIsCancelDialogOpen(true)}
                        >
                            Hủy yêu cầu đóng gói
                        </Button>
                    </>
                )}
                <Button variant="outline" size="sm" onClick={() => navigate('/packaging')}>
                    Quay lại
                </Button>
                <Button variant="outline" size="sm" onClick={() => alert('Chức năng đang phát triển')}>
                    In
                </Button>
            </div>
        );
    }, [packaging, order, currentUserSystemId, navigate]);

    usePageHeader({
        title: `Phiếu đóng gói ${packaging?.id || ''}`,
        actions: pageActions ? [pageActions] : []
    });

    if (!packaging || !order) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Không tìm thấy phiếu đóng gói</h2>
                    <Button onClick={() => navigate('/packaging')} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay về danh sách
                    </Button>
                </div>
            </div>
        );
    }
    
    const handleCancelSubmit = (reason: string) => {
        if (order && packaging) {
            cancelPackagingRequest(order.systemId, packaging.systemId, currentUserSystemId, reason);
        }
    };

    const totalQuantity = order.lineItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <div className="space-y-4 md:space-y-6">
                {/* Status Badge Card */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Badge variant={packagingStatusVariants[packaging.status]}>{packaging.status}</Badge>
                            <Separator orientation="vertical" className="h-6" />
                            <span className="text-sm text-muted-foreground">
                                Ngày yêu cầu: {formatDate(packaging.requestDate)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    {/* Left Column - 2/3 width */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Thông tin phiếu đóng gói</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailField label="Đơn hàng">
                                    <ReactRouterDOM.Link 
                                        to={`/orders/${order.systemId}`} 
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {order.id}
                                    </ReactRouterDOM.Link>
                                </DetailField>
                                <DetailField label="Chi nhánh" value={order.branchName} />
                                
                                <DetailField label="Khách hàng">
                                    {customer ? (
                                        <ReactRouterDOM.Link 
                                            to={`/customers/${customer.systemId}`}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {order.customerName}
                                        </ReactRouterDOM.Link>
                                    ) : (
                                        <span>{order.customerName}</span>
                                    )}
                                </DetailField>
                                
                                <DetailField label="Ngày hẹn giao" value="---" />
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailField label="Ngày yêu cầu đóng gói">
                                    {formatDate(packaging.requestDate)}
                                </DetailField>
                                
                                <DetailField label="Nhân viên yêu cầu">
                                    {requestingEmployee ? (
                                        <ReactRouterDOM.Link 
                                            to={`/employees/${requestingEmployee.systemId}`}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {packaging.requestingEmployeeName}
                                        </ReactRouterDOM.Link>
                                    ) : (
                                        <span>{packaging.requestingEmployeeName}</span>
                                    )}
                                </DetailField>
                                
                                <DetailField label="Nhân viên được gán">
                                    {assignedEmployee ? (
                                        <ReactRouterDOM.Link 
                                            to={`/employees/${assignedEmployee.systemId}`}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {packaging.assignedEmployeeName}
                                        </ReactRouterDOM.Link>
                                    ) : (
                                        <span>{packaging.assignedEmployeeName || '---'}</span>
                                    )}
                                </DetailField>
                                
                                <DetailField label="Ngày xác nhận">
                                    {formatDate(packaging.confirmDate)}
                                </DetailField>
                                
                                <DetailField label="Nhân viên đóng gói" className="md:col-span-2">
                                    {confirmingEmployee ? (
                                        <ReactRouterDOM.Link 
                                            to={`/employees/${confirmingEmployee.systemId}`}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {packaging.confirmingEmployeeName}
                                        </ReactRouterDOM.Link>
                                    ) : (
                                        <span>{packaging.confirmingEmployeeName || '---'}</span>
                                    )}
                                </DetailField>
                            </div>
                            
                            <Separator />
                            
                            <DetailField label="Địa chỉ giao">
                                {[customer?.shippingAddress_street, customer?.shippingAddress_ward, customer?.shippingAddress_province].filter(Boolean).join(', ') || '---'}
                            </DetailField>
                            
                            <Button 
                                variant="link" 
                                className="p-0 h-auto text-sm"
                                onClick={() => alert('Chức năng lịch sử đang phát triển')}
                            >
                                <History className="mr-1.5 h-4 w-4" />
                                Lịch sử thao tác phiếu đóng gói
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Right Column - 1/3 width */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Thông tin bổ sung</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            <div>
                                <p className="font-semibold mb-2">Ghi chú đơn hàng</p>
                                <p className="text-muted-foreground">{order.notes || 'Đơn hàng chưa có ghi chú nào'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Product Information Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Thông tin sản phẩm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12 text-center">STT</TableHead>
                                        <TableHead className="w-16">Ảnh</TableHead>
                                        <TableHead>Tên sản phẩm</TableHead>
                                        <TableHead>Đơn vị</TableHead>
                                        <TableHead className="text-center">Số lượng</TableHead>
                                        <TableHead className="text-right">Đơn giá</TableHead>
                                        <TableHead className="text-right">Chiết khấu</TableHead>
                                        <TableHead className="text-center">Thuế</TableHead>
                                        <TableHead className="text-right">Thành tiền</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.lineItems.map((item, index) => {
                                        const product = findProductById(item.productSystemId);
                                        const total = item.quantity * item.unitPrice;
                                        return (
                                            <TableRow key={item.productSystemId}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell><div className="w-12 h-12 bg-muted rounded-md" /></TableCell>
                                                <TableCell>
                                                    {product ? (
                                                        <>
                                                            <ReactRouterDOM.Link 
                                                                to={`/products/${product.systemId}`}
                                                                className="font-medium text-primary hover:underline"
                                                            >
                                                                {item.productName}
                                                            </ReactRouterDOM.Link>
                                                            <p className="text-xs text-muted-foreground">Mặc định</p>
                                                            <ReactRouterDOM.Link 
                                                                to={`/products/${product.systemId}`} 
                                                                className="text-xs text-muted-foreground hover:text-primary hover:underline"
                                                            >
                                                                {item.productId}
                                                            </ReactRouterDOM.Link>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="font-medium">{item.productName}</p>
                                                            <p className="text-xs text-muted-foreground">Mặc định</p>
                                                            <p className="text-xs text-muted-foreground">{item.productId}</p>
                                                        </>
                                                    )}
                                                </TableCell>
                                                <TableCell>sản phẩm</TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                                                <TableCell className="text-center">0%</TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(total)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-right font-bold">Tổng cộng</TableCell>
                                        <TableCell className="text-center font-bold">{totalQuantity}</TableCell>
                                        <TableCell colSpan={4} className="text-right font-bold">{formatCurrency(order.subtotal)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-right">Tổng tiền</TableCell>
                                        <TableCell className="text-right">{formatCurrency(order.subtotal)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-right">Chiết khấu</TableCell>
                                        <TableCell className="text-right">{formatCurrency(0)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-right">Phí giao hàng</TableCell>
                                        <TableCell className="text-right">{formatCurrency(order.shippingFee)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-right font-bold text-base">Khách phải trả</TableCell>
                                        <TableCell className="text-right font-bold text-base">{formatCurrency(order.grandTotal)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <CancelPackagingDialog
                isOpen={isCancelDialogOpen}
                onOpenChange={setIsCancelDialogOpen}
                onConfirm={handleCancelSubmit}
            />
        </>
    );
}
