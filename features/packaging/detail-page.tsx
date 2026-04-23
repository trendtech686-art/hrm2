'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/date-utils';
import { usePackagingById } from './hooks/use-packaging';
import { usePackagingActions } from '../orders/hooks/use-packaging-actions';
import type { PackagingStatus } from '../orders/types';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
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
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { DetailField } from '../../components/ui/detail-field';
import { useAuth } from '../../contexts/auth-context';
import { ReadOnlyProductsTable } from '../../components/shared/read-only-products-table';
import { Comments } from '../../components/Comments';
import { useComments } from '@/hooks/use-comments';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { asSystemId, type SystemId } from '../../lib/id-types';
import { Skeleton } from '../../components/ui/skeleton';

const packagingStatusVariants: Record<string, "warning" | "success" | "destructive"> = {
    "Chờ đóng gói": "warning",
    "Đã đóng gói": "success",
    "Hủy đóng gói": "destructive",
    "PENDING": "warning",
    "PACKED": "success",
    "CANCELLED": "destructive",
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

// Loading skeleton component
function PackagingDetailSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <Card className={cn(mobileBleedCardClass, 'lg:col-span-2')}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
      <Card className={mobileBleedCardClass}>
        <CardContent className="p-0">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function PackagingDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  
  // Fetch packaging detail directly from API with full order/customer/product info
  const { data: packagingData, isLoading, isError, error } = usePackagingById(systemId);
  
  const { confirmPackaging, cancelPackagingRequest, isConfirming, isCancelling } = usePackagingActions();
  const { findById: findBranchById } = useBranchFinder();
  const { employee: authEmployee } = useAuth();
  const currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM';

  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);

  // Extract data from API response
  const packaging = packagingData?.packaging;
  const order = packagingData?.order;
  const customer = packagingData?.customer;


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

  const { print } = usePrint(order?.branchSystemId);

  const handlePrint = React.useCallback(() => {
    if (!packaging || !order) return;

    const branch = order.branchSystemId ? findBranchById(order.branchSystemId) : undefined;

    // Use helper to prepare print data
    const storeSettings = createStoreSettings(branch || undefined);
    
    // Create minimal packaging object for print helper - cast as never to bypass strict type checks
    const packagingForPrint = {
      ...packaging,
      status: packaging.status as PackagingStatus,
    };
    
    const orderForPrint = {
      ...order,
      customerSystemId: order.customerSystemId,
      lineItems: order.lineItems,
    };

    // Cast as never to bypass strict type checking - print helper accepts flexible input
    const packingForPrint = convertToPackingForPrint(
      orderForPrint as never, 
      packagingForPrint as never, 
      { 
        customer: customer ? { fullName: customer.fullName, phone: customer.phone } as never : undefined,
        assignedEmployee: packaging.assignedEmployeeName ? { fullName: packaging.assignedEmployeeName } as never : undefined,
      }
    );

    const printData = mapPackingToPrintData(packingForPrint, storeSettings);
    const lineItems = mapPackingLineItems(packingForPrint.items);

    print('packing', {
      data: printData,
      lineItems: lineItems,
      entityType: 'packaging',
      entityId: packaging.systemId,
      createdBy: currentUserSystemId,
    });
  }, [packaging, order, customer, print, findBranchById, currentUserSystemId]);

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
    const status = packaging.status as PackagingStatus;
    return (
      <Badge variant={packagingStatusVariants[status] || 'warning'}>
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

  if (isLoading) {
    return <PackagingDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-h3 font-bold text-destructive">Lỗi tải phiếu đóng gói</h2>
          <p className="text-muted-foreground mt-2">{error?.message || 'Không thể tải dữ liệu'}</p>
          <p className="text-muted-foreground text-sm">Mã: {systemId}</p>
          <Button onClick={() => router.push('/packaging')} className="mt-4 h-9">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay về danh sách
          </Button>
        </div>
      </div>
    );
  }

  if (!packaging || !order) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-h3 font-bold">Không tìm thấy phiếu đóng gói</h2>
          <p className="text-muted-foreground mt-2">Mã: {systemId}</p>
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

  // Transform lineItems for ReadOnlyProductsTable
  const tableLineItems = order.lineItems.map(item => ({
    productSystemId: item.productSystemId,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discount: item.discount,
    discountType: item.discountType,
    total: item.total,
    note: item.note,
    thumbnailImage: item.thumbnailImage, // ✅ Direct from API
  }));

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {/* Main Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Left Column - 2/3 width */}
          <Card className={cn(mobileBleedCardClass, 'lg:col-span-2')}>
            <CardHeader>
              <CardTitle>Thông tin phiếu đóng gói</CardTitle>
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
                      {customer.fullName}
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
                  {packaging.requestingEmployeeId ? (
                    <Link 
                      href={`/employees/${packaging.requestingEmployeeId}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {packaging.requestingEmployeeName || '---'}
                    </Link>
                  ) : (
                    <span>{packaging.requestingEmployeeName || '---'}</span>
                  )}
                </DetailField>
                
                <DetailField label="Nhân viên được gán">
                  {packaging.assignedEmployeeId ? (
                    <Link 
                      href={`/employees/${packaging.assignedEmployeeId}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {packaging.assignedEmployeeName || '---'}
                    </Link>
                  ) : (
                    <span>{packaging.assignedEmployeeName || '---'}</span>
                  )}
                </DetailField>
                
                <DetailField label="Ngày xác nhận">
                  {formatDate(packaging.confirmDate)}
                </DetailField>
                
                <DetailField label="Nhân viên đóng gói" className="md:col-span-2">
                  {packaging.confirmingEmployeeId ? (
                    <Link 
                      href={`/employees/${packaging.confirmingEmployeeId}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {packaging.confirmingEmployeeName || '---'}
                    </Link>
                  ) : (
                    <span>{packaging.confirmingEmployeeName || '---'}</span>
                  )}
                </DetailField>
                
                <DetailField label="Ngày hủy">
                  {formatDate(packaging.cancelDate)}
                </DetailField>
                
                <DetailField label="Nhân viên hủy">
                  {packaging.cancelingEmployeeId ? (
                    <Link 
                      href={`/employees/${packaging.cancelingEmployeeId}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {packaging.cancelingEmployeeName || '---'}
                    </Link>
                  ) : (
                    <span>{packaging.cancelingEmployeeName || '---'}</span>
                  )}
                </DetailField>
                
                <DetailField label="Trạng thái in">
                  {packaging.printStatus || 'Chưa in'}
                </DetailField>
              </div>
              
              <Separator />
              
              <DetailField label="Địa chỉ giao">
                {customer?.shippingAddress || '---'}
              </DetailField>
            </CardContent>
          </Card>

          {/* Right Column - 1/3 width */}
          <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle>Thông tin bổ sung</CardTitle>
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
          lineItems={tableLineItems}
          showStorageLocation={false}
          showDiscount={true}
          showUnit={true}
          summary={{
            subtotal: order.subtotal,
            discount: order.discount,
            shippingFee: order.shippingFee,
            grandTotal: order.grandTotal,
          }}
          externalProductsMap={new Map()}
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
        <EntityActivityTable entityType="packaging" entityId={packaging.systemId} />
      </div>

      <CancelPackagingDialog
        isOpen={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={handleCancelSubmit}
      />
    </>
  );
}
