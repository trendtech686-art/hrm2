'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/date-utils';
import { useAllOrders } from '../orders/hooks/use-all-orders';
import { usePackagingActions } from '../orders/hooks/use-packaging-actions';
import type { PackagingStatus } from '../orders/types';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { usePrint } from '../../lib/use-print';
import { 
  convertToPackingForPrint,
  mapPackingToPrintData, 
  mapPackingLineItems,
  createStoreSettings,
} from '../../lib/print/order-print-helper';
import { useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { useCustomerFinder } from '../customers/hooks/use-all-customers';
import { useEmployeeFinder } from '../employees/hooks/use-all-employees';
import { useStorageLocationFinder } from '../settings/inventory/hooks/use-storage-locations';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { DetailField } from '../../components/ui/detail-field';
import { useAuth } from '../../contexts/auth-context';
import { ReadOnlyProductsTable } from '../../components/shared/read-only-products-table';
import type { Product } from '../products/types';
import { Comments } from '../../components/Comments';
import { useComments } from '@/hooks/use-comments';
import { ActivityHistory } from '../../components/ActivityHistory';
import { asSystemId, type SystemId } from '../../lib/id-types';

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
                    <Button variant="outline" className="h-9" onClick={() => onOpenChange(false)}>Thoát</Button>
                    <Button variant="destructive" className="h-9" onClick={handleConfirm}>Xác nhận Hủy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function PackagingDetailPage() {
    const { systemId } = useParams<{ systemId: string }>();
    const router = useRouter();
    const { data: allOrders } = useAllOrders();
    const { confirmPackaging, cancelPackagingRequest, isConfirming, isCancelling } = usePackagingActions();
    const { findById: findCustomerById } = useCustomerFinder();
    const { findById: findEmployeeById } = useEmployeeFinder();
    const { findBySystemId: findStorageLocationBySystemId } = useStorageLocationFinder();
    const { employee: authEmployee } = useAuth();
    const currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM';

    const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);

    // Comments from database
    const { 
        comments: dbComments, 
        addComment: dbAddComment, 
        deleteComment: dbDeleteComment 
    } = useComments('packaging', systemId || '');

    const comments = React.useMemo(() => 
        dbComments.map(c => ({
            id: c.systemId as unknown as SystemId,
            content: c.content,
            author: {
                systemId: (c.createdBy || 'system') as unknown as SystemId,
                name: c.createdByName || 'Hệ thống',
                avatar: undefined,
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
        if (!packaging?.requestingEmployeeId) return null;
        return findEmployeeById(packaging.requestingEmployeeId);
    }, [packaging?.requestingEmployeeId, findEmployeeById]);
    
    const assignedEmployee = React.useMemo(() => {
        if (!packaging?.assignedEmployeeId) return null;
        return findEmployeeById(packaging.assignedEmployeeId);
    }, [packaging?.assignedEmployeeId, findEmployeeById]);
    
    const confirmingEmployee = React.useMemo(() => {
        if (!packaging?.confirmingEmployeeId) return null;
        return findEmployeeById(packaging.confirmingEmployeeId);
    }, [packaging?.confirmingEmployeeId, findEmployeeById]);

    const { findById: findBranchById } = useBranchFinder();
    const { info: _storeInfo } = useStoreInfoData();
    const { print } = usePrint(order?.branchSystemId);

    const handlePrint = React.useCallback(() => {
        if (!packaging || !order) return;

        const branch = order.branchSystemId ? findBranchById(order.branchSystemId) : undefined;
        const customer = findCustomerById(order.customerSystemId);

        // Use helper to prepare print data
        const storeSettings = createStoreSettings(branch || undefined);
        const packingForPrint = convertToPackingForPrint(order, packaging, { 
            customer: customer || undefined,
            assignedEmployee: assignedEmployee || undefined,
        });

        const printData = mapPackingToPrintData(packingForPrint, storeSettings);
        const lineItems = mapPackingLineItems(packingForPrint.items);

        print('packing', {
            data: printData,
            lineItems: lineItems
        });
    }, [packaging, order, print, findCustomerById, findBranchById, assignedEmployee]);

        const headerActions = React.useMemo(() => {
            const actions: React.ReactNode[] = [];

            if (packaging && order) {
                if (packaging.status === 'Chờ đóng gói') {
                    actions.push(
                        <Button
                            key="confirm"
                            size="sm"
                            className="h-9"
                            disabled={isConfirming}
                            onClick={() => confirmPackaging(order.systemId, packaging.systemId, currentUserSystemId)}
                        >
                            {isConfirming ? 'Đang xử lý...' : 'Xác nhận đã đóng gói'}
                        </Button>
                    );
                    actions.push(
                        <Button
                            key="cancel"
                            variant="destructive"
                            size="sm"
                            className="h-9"
                            disabled={isCancelling}
                            onClick={() => setIsCancelDialogOpen(true)}
                        >
                            {isCancelling ? 'Đang xử lý...' : 'Hủy yêu cầu đóng gói'}
                        </Button>
                    );
                }

                actions.push(
                    <Button
                        key="print"
                        variant="outline"
                        size="sm"
                        className="h-9"
                        onClick={handlePrint}
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        In phiếu
                    </Button>
                );
            }

            actions.push(
                <Button
                    key="back"
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => router.push('/packaging')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Danh sách đóng gói
                </Button>
            );

            return actions;
        }, [packaging, order, confirmPackaging, isConfirming, isCancelling, currentUserSystemId, setIsCancelDialogOpen, router, handlePrint]);

        const headerBadge = React.useMemo(() => {
            if (!packaging) return undefined;
            return (
                <Badge variant={packagingStatusVariants[packaging.status]}>
                    {packaging.status}
                </Badge>
            );
        }, [packaging]);

        usePageHeader({
            title: packaging ? `Phiếu đóng gói ${packaging.id}` : 'Phiếu đóng gói',
            breadcrumb: [
                { label: 'Trang chủ', href: '/', isCurrent: false },
                { label: 'Đóng gói', href: '/packaging', isCurrent: false },
                { label: packaging ? packaging.id : 'Chi tiết', href: systemId ? `/packaging/${systemId}` : '/packaging', isCurrent: true }
            ],
            showBackButton: true,
            backPath: '/packaging',
            badge: headerBadge,
            actions: headerActions
        });

    // Helper function for storage location name - must be called before any early returns (React hooks rules)
    const getStorageLocationName = React.useCallback((product: Product | undefined) => {
        if (!product?.storageLocationSystemId) return '---';
        const location = findStorageLocationBySystemId(product.storageLocationSystemId);
        return location?.name || '---';
    }, [findStorageLocationBySystemId]);

    if (!packaging || !order) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-h3 font-bold">Không tìm thấy phiếu đóng gói</h2>
                    <Button onClick={() => router.push('/packaging')} className="mt-4 h-9">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay về danh sách
                    </Button>
                </div>
            </div>
        );
    }
    
    const handleCancelSubmit = async (reason: string) => {
        if (order && packaging) {
            await cancelPackagingRequest(order.systemId, packaging.systemId, currentUserSystemId, reason);
        }
    };

    return (
        <>
            <div className="space-y-4 md:space-y-6">
                {/* Main Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    {/* Left Column - 2/3 width */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-h6 font-semibold">Thông tin phiếu đóng gói</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailField label="Đơn hàng">
                                    <Link 
                                        href={`/orders/${order.systemId}`} 
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {order.id}
                                    </Link>
                                </DetailField>
                                <DetailField label="Chi nhánh" value={order.branchName} />
                                
                                <DetailField label="Khách hàng">
                                    {customer ? (
                                        <Link 
                                            href={`/customers/${customer.systemId}`}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {order.customerName}
                                        </Link>
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
                                        <Link 
                                            href={`/employees/${requestingEmployee.systemId}`}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {packaging.requestingEmployeeName}
                                        </Link>
                                    ) : (
                                        <span>{packaging.requestingEmployeeName}</span>
                                    )}
                                </DetailField>
                                
                                <DetailField label="Nhân viên được gán">
                                    {assignedEmployee ? (
                                        <Link 
                                            href={`/employees/${assignedEmployee.systemId}`}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {packaging.assignedEmployeeName}
                                        </Link>
                                    ) : (
                                        <span>{packaging.assignedEmployeeName || '---'}</span>
                                    )}
                                </DetailField>
                                
                                <DetailField label="Ngày xác nhận">
                                    {formatDate(packaging.confirmDate)}
                                </DetailField>
                                
                                <DetailField label="Nhân viên đóng gói" className="md:col-span-2">
                                    {confirmingEmployee ? (
                                        <Link 
                                            href={`/employees/${confirmingEmployee.systemId}`}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {packaging.confirmingEmployeeName}
                                        </Link>
                                    ) : (
                                        <span>{packaging.confirmingEmployeeName || '---'}</span>
                                    )}
                                </DetailField>
                            </div>
                            
                            <Separator />
                            
                            <DetailField label="Địa chỉ giao">
                                {[customer?.shippingAddress_street, customer?.shippingAddress_ward, customer?.shippingAddress_province].filter(Boolean).join(', ') || '---'}
                            </DetailField>
                        </CardContent>
                    </Card>

                    {/* Right Column - 1/3 width */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-h6 font-semibold">Thông tin bổ sung</CardTitle>
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
                <ReadOnlyProductsTable 
                    lineItems={order.lineItems}
                    showStorageLocation={true}
                    showDiscount={true}
                    showUnit={true}
                    getStorageLocationName={getStorageLocationName}
                    summary={{
                        subtotal: order.subtotal,
                        discount: 0,
                        shippingFee: order.shippingFee,
                        grandTotal: order.grandTotal,
                    }}
                />

                {/* Comments */}
                <Comments
                    entityType="packaging"
                    entityId={packaging.systemId}
                    comments={comments}
                    onAddComment={handleAddComment}
                    onUpdateComment={handleUpdateComment}
                    onDeleteComment={handleDeleteComment}
                    currentUser={commentCurrentUser}
                    title="Bình luận"
                    placeholder="Thêm bình luận về yêu cầu đóng gói..."
                />

                {/* Activity History */}
                <ActivityHistory
                    history={[]}
                    title="Lịch sử hoạt động"
                    emptyMessage="Chưa có lịch sử hoạt động"
                    groupByDate
                    maxHeight="400px"
                />
            </div>

            <CancelPackagingDialog
                isOpen={isCancelDialogOpen}
                onOpenChange={setIsCancelDialogOpen}
                onConfirm={handleCancelSubmit}
            />
        </>
    );
}
