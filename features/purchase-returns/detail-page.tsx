'use client'

import * as React from 'react';
import { useParams, useNavigate, Link } from '@/lib/next-compat';
import { ROUTES } from '../../lib/router';
import { formatDateCustom, parseDate } from '@/lib/date-utils';
import { usePurchaseReturnStore } from './store';
import { usePurchaseOrderStore } from '../purchase-orders/store';
import { useSupplierStore } from '../suppliers/store';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Printer, PackageX } from 'lucide-react';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { useAuth } from '../../contexts/auth-context';
import { DetailField } from '../../components/ui/detail-field';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from 'sonner';
import { ProductThumbnailCell } from '../../components/shared/read-only-products-table';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import { useProductStore } from '../products/store';
import { usePrint } from '../../lib/use-print';
import { 
  convertSupplierReturnForPrint,
  mapSupplierReturnToPrintData, 
  mapSupplierReturnLineItems,
  createStoreSettings,
} from '../../lib/print/supplier-return-print-helper';
import { useBranchStore } from '../settings/branches/store';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { numberToWords } from '../../lib/print-mappers/types';
import { PurchaseReturnWorkflowCard } from './components/purchase-return-workflow-card';
import type { Subtask } from '../../components/shared/subtask-list';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};



export function PurchaseReturnDetailPage() {
  const { systemId: systemIdParam } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const { findById } = usePurchaseReturnStore();
  const { findById: findPurchaseOrder } = usePurchaseOrderStore();
  const { findById: findSupplier } = useSupplierStore();
  const { findById: findProductById } = useProductStore();
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  const { employee: authEmployee } = useAuth();
  const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);

  const systemId = React.useMemo(() => (systemIdParam ? asSystemId(systemIdParam) : undefined), [systemIdParam]);

  // Comments state with localStorage persistence
  type PurchaseReturnComment = CommentType<SystemId>;
  const [comments, setComments] = React.useState<PurchaseReturnComment[]>(() => {
    const saved = localStorage.getItem(`purchase-return-comments-${systemIdParam}`);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    if (systemIdParam) {
      localStorage.setItem(`purchase-return-comments-${systemIdParam}`, JSON.stringify(comments));
    }
  }, [comments, systemIdParam]);

  const handleAddComment = React.useCallback((content: string, attachments?: string[], parentId?: string) => {
    const newComment: PurchaseReturnComment = {
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

  const purchaseReturn = React.useMemo(() => (systemId ? findById(systemId) : null), [systemId, findById]);
  const purchaseOrder = React.useMemo(() => {
    if (!purchaseReturn) return null;
    return findPurchaseOrder(purchaseReturn.purchaseOrderSystemId);
  }, [purchaseReturn, findPurchaseOrder]);
  
  const supplier = React.useMemo(() => {
    if (!purchaseReturn) return null;
    return findSupplier(purchaseReturn.supplierSystemId);
  }, [purchaseReturn, findSupplier]);

  const totalQuantity = React.useMemo(() => {
    return purchaseReturn?.items.reduce((sum, item) => sum + item.returnQuantity, 0) || 0;
  }, [purchaseReturn]);

  const { findById: findBranchById } = useBranchStore();
  const { info: storeInfo } = useStoreInfoStore();
  const { print } = usePrint(purchaseReturn?.branchSystemId);

  const handlePrint = React.useCallback(() => {
    if (!purchaseReturn) return;

    const branch = purchaseReturn.branchSystemId ? findBranchById(purchaseReturn.branchSystemId) : undefined;

    // Use helper to prepare print data
    const storeSettings = createStoreSettings(storeInfo);
    const returnForPrint = convertSupplierReturnForPrint(purchaseReturn, { 
      branch: branch || undefined, 
      supplier: supplier || undefined,
      purchaseOrder: purchaseOrder || undefined,
    });

    const printData = mapSupplierReturnToPrintData(returnForPrint, storeSettings);
    const lineItems = mapSupplierReturnLineItems(returnForPrint.items);

    // Inject extra fields
    printData['amount_text'] = numberToWords(purchaseReturn.totalReturnValue);

    print('supplier-return', {
      data: printData,
      lineItems: lineItems
    });
  }, [purchaseReturn, purchaseOrder, supplier, storeInfo, print, findBranchById]);

  const headerActions = React.useMemo(() => [
    <Button
      key="back"
      variant="outline"
      size="sm"
      className="h-9"
      onClick={() => navigate(ROUTES.PROCUREMENT.PURCHASE_RETURNS)}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Danh sách phiếu trả
    </Button>,
    <Button
      key="print"
      size="sm"
      className="h-9"
      onClick={handlePrint}
    >
      <Printer className="mr-2 h-4 w-4" />
      In phiếu
    </Button>
  ], [navigate, handlePrint]);

  usePageHeader({
    title: purchaseReturn ? `Phiếu trả hàng ${purchaseReturn.id}` : 'Chi tiết phiếu trả NCC',
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Trả hàng nhập', href: ROUTES.PROCUREMENT.PURCHASE_RETURNS, isCurrent: false },
      { label: purchaseReturn?.id || 'Chi tiết', href: purchaseReturn ? `${ROUTES.PROCUREMENT.PURCHASE_RETURNS}/${purchaseReturn.systemId}` : '', isCurrent: true }
    ],
    showBackButton: true,
    backPath: ROUTES.PROCUREMENT.PURCHASE_RETURNS
  });

  const handleConfirmPrint = React.useCallback(() => {
    if (!purchaseReturn) return;
    toast.success('Đã gửi lệnh in', {
      description: `Phiếu trả ${purchaseReturn.id} đang được chuẩn bị để in.`
    });
    setIsPrintPreviewOpen(false);
  }, [purchaseReturn]);

  if (!purchaseReturn) {
    return (
      <div className="text-center p-8">
        <h2 className="text-h2 font-bold">Không tìm thấy phiếu trả hàng</h2>
        <Button onClick={() => navigate(-1)} className="mt-4 h-9">
          <ArrowLeft className="mr-2 h-4 w-4" />Quay lại
        </Button>
      </div>
    );
  }

  return (
    <>
    {/* Row 1: 3 columns - Thông tin phiếu + Thông tin bổ sung + Quy trình */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Column 1: Thông tin phiếu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-body-base">Thông tin phiếu trả</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailField label="Mã phiếu" value={purchaseReturn.id} />
          <DetailField label="Ngày trả" value={formatDateCustom(parseDate(purchaseReturn.returnDate)!, 'dd/MM/yyyy')} />
          <DetailField label="Chi nhánh" value={purchaseReturn.branchName} />
          <DetailField label="Nhà cung cấp">
            {supplier ? (
              <Link to={`/suppliers/${supplier.systemId}`} className="text-body-sm text-primary hover:underline font-medium">
                {purchaseReturn.supplierName}
              </Link>
            ) : (
              purchaseReturn.supplierName
            )}
          </DetailField>
          <DetailField label="Đơn nhập hàng gốc">
            {purchaseOrder ? (
              <Link to={`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder.systemId}`} className="text-body-sm text-primary hover:underline font-medium">
                {purchaseReturn.purchaseOrderId}
              </Link>
            ) : (
              purchaseReturn.purchaseOrderId
            )}
          </DetailField>
        </CardContent>
      </Card>

      {/* Column 2: Thông tin thanh toán */}
      <Card>
        <CardHeader>
          <CardTitle className="text-body-base">Thông tin thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailField label="Người tạo phiếu" value={purchaseReturn.creatorName} />
          <DetailField label="Hình thức hoàn tiền" value={purchaseReturn.refundMethod} />
          <DetailField label="Tổng giá trị hàng trả">
            <span className="text-body-sm font-semibold text-orange-600">
              {formatCurrency(purchaseReturn.totalReturnValue)}
            </span>
          </DetailField>
          <DetailField label="Số tiền hoàn lại">
            <span className="text-body-sm font-semibold text-green-600">
              {formatCurrency(purchaseReturn.refundAmount)}
            </span>
          </DetailField>
          {purchaseReturn.reason && (
            <DetailField label="Lý do hoàn trả">
              <span className="text-body-sm">{purchaseReturn.reason}</span>
            </DetailField>
          )}
        </CardContent>
      </Card>

      {/* Column 3: Quy trình xử lý */}
      <PurchaseReturnWorkflowCard
        subtasks={subtasks}
        onSubtasksChange={setSubtasks}
        readonly={false}
      />
    </div>

    {/* Danh sách sản phẩm */}
    <Card>
      <CardHeader>
        <CardTitle className="text-body-base">Danh sách sản phẩm hoàn trả ({purchaseReturn.items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-body-xs">STT</TableHead>
                <TableHead className="w-[60px] text-body-xs">Ảnh</TableHead>
                <TableHead className="w-[120px] text-body-xs">Mã SKU</TableHead>
                <TableHead className="text-body-xs">Tên sản phẩm</TableHead>
                <TableHead className="w-[120px] text-center text-body-xs">SL đặt</TableHead>
                <TableHead className="w-[120px] text-center text-body-xs">SL trả</TableHead>
                <TableHead className="w-[150px] text-right text-body-xs">Đơn giá</TableHead>
                <TableHead className="w-[180px] text-right text-body-xs">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseReturn.items.map((item, index) => {
                const product = findProductById(item.productSystemId);
                return (
                <TableRow key={index}>
                  <TableCell className="text-center text-body-sm">{index + 1}</TableCell>
                  <TableCell>
                    <ProductThumbnailCell
                      productSystemId={item.productSystemId}
                      product={product}
                      productName={item.productName}
                      onPreview={(url, title) => setPreviewImage({ url, title })}
                    />
                  </TableCell>
                  <TableCell className="text-body-sm font-mono">{item.productId}</TableCell>
                  <TableCell>
                    <div className="text-body-sm">{item.productName}</div>
                    {item.note && (
                      <div className="text-body-xs text-muted-foreground mt-1">
                        Ghi chú: {item.note}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-body-sm">{item.orderedQuantity}</TableCell>
                  <TableCell className="text-center text-body-sm font-semibold text-orange-600">
                    {item.returnQuantity}
                  </TableCell>
                  <TableCell className="text-right text-body-sm">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-right text-body-sm font-semibold">
                    {formatCurrency(item.returnQuantity * item.unitPrice)}
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-right text-body-sm font-semibold">
                    Tổng cộng ({totalQuantity} sản phẩm)
                  </TableCell>
                  <TableCell className="text-center text-body-sm font-bold text-orange-600">
                    {totalQuantity}
                  </TableCell>
                  <TableCell />
                  <TableCell className="text-right font-bold text-h3">
                    {formatCurrency(purchaseReturn.totalReturnValue)}
                  </TableCell>
                </TableRow>
                {purchaseReturn.refundAmount > 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-right text-body-sm text-muted-foreground">
                      Số tiền nhận lại từ NCC ({purchaseReturn.refundMethod})
                    </TableCell>
                    <TableCell className="text-right text-body-sm font-semibold text-green-600">
                      {formatCurrency(purchaseReturn.refundAmount)}
                    </TableCell>
                  </TableRow>
                )}
              </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Dialog open={isPrintPreviewOpen} onOpenChange={setIsPrintPreviewOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>In phiếu trả {purchaseReturn?.id}</DialogTitle>
          <DialogDescription>
            Nội dung hiển thị giúp bạn rà soát lại trước khi bật hộp thoại in của trình duyệt.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-1">
          <div className="space-y-4">
            {purchaseReturn && (
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-body-base">{purchaseReturn.id}</p>
                    <p className="text-body-xs text-muted-foreground">
                      Ngày trả: {formatDateCustom(parseDate(purchaseReturn.returnDate)!, 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm text-muted-foreground">Tổng giá trị</p>
                    <p className="font-semibold text-orange-600 text-body-sm">{formatCurrency(purchaseReturn.totalReturnValue)}</p>
                    {purchaseReturn.refundAmount > 0 && (
                      <p className="text-body-xs text-green-600">Hoàn: {formatCurrency(purchaseReturn.refundAmount)}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-body-xs text-muted-foreground">
                  <p>Nhà cung cấp: <span className="text-foreground font-medium">{purchaseReturn.supplierName}</span></p>
                  <p>Chi nhánh: <span className="text-foreground font-medium">{purchaseReturn.branchName}</span></p>
                  <p>Đơn nhập: <span className="text-foreground font-medium">{purchaseReturn.purchaseOrderId}</span></p>
                  <p>Người tạo: <span className="text-foreground font-medium">{purchaseReturn.creatorName}</span></p>
                </div>
                {purchaseReturn.reason && (
                  <div className="rounded-md bg-muted/50 p-3 text-body-xs">
                    <p className="font-medium mb-1">Lý do hoàn trả</p>
                    <p className="text-muted-foreground">{purchaseReturn.reason}</p>
                  </div>
                )}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px] text-body-xs">STT</TableHead>
                        <TableHead className="text-body-xs">Sản phẩm</TableHead>
                        <TableHead className="w-[120px] text-center text-body-xs">SL trả</TableHead>
                        <TableHead className="w-[150px] text-right text-body-xs">Đơn giá</TableHead>
                        <TableHead className="w-[150px] text-right text-body-xs">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseReturn.items.map((item, index) => (
                        <TableRow key={`${item.productSystemId}-${index}`}>
                          <TableCell className="text-body-sm">{index + 1}</TableCell>
                          <TableCell>
                            <p className="font-medium text-body-sm">{item.productName}</p>
                            <p className="text-body-xs text-muted-foreground">SKU: {item.productId}</p>
                          </TableCell>
                          <TableCell className="text-center font-semibold text-orange-600 text-body-sm">{item.returnQuantity}</TableCell>
                          <TableCell className="text-right text-body-sm">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right font-semibold text-body-sm">{formatCurrency(item.unitPrice * item.returnQuantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" className="h-9" onClick={() => setIsPrintPreviewOpen(false)}>Đóng</Button>
          <Button className="h-9" onClick={handleConfirmPrint} disabled={!purchaseReturn}>In ngay</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Image Preview Dialog */}
    <ImagePreviewDialog 
      open={!!previewImage} 
      onOpenChange={(open) => !open && setPreviewImage(null)} 
      images={previewImage ? [previewImage.url] : []} 
      title={previewImage?.title}
    />

    {/* Comments */}
    <Comments
      entityType="purchase-return"
      entityId={purchaseReturn.systemId}
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
      history={purchaseReturn.activityHistory || []}
      title="Lịch sử hoạt động"
      emptyMessage="Chưa có lịch sử hoạt động"
      groupByDate
      maxHeight="400px"
    />
    </>
  );
}
