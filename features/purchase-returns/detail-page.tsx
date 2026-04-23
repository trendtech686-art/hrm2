'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ROUTES } from '../../lib/router';
import { formatDateCustom, parseDate } from '@/lib/date-utils';
import Link from 'next/link';
import { usePurchaseReturn } from './hooks/use-purchase-returns';
import { usePurchaseOrderFinder } from '../purchase-orders/hooks/use-all-purchase-orders';
import { useSupplierFinder } from '../suppliers/hooks/use-all-suppliers';
import { useSupplierStats } from '../suppliers/hooks/use-supplier-stats';
import { SupplierStatsSection } from '../suppliers/components/supplier-stats-section';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { useAuth } from '../../contexts/auth-context';
import { DetailField } from '../../components/ui/detail-field';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from 'sonner';
import { ProductThumbnailCell } from '../../components/shared/read-only-products-table';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import { useProductFinder } from '../products/hooks/use-all-products';
import { usePrint } from '../../lib/use-print';
import { numberToWords } from '../../lib/print-service';
import { 
  convertSupplierReturnForPrint,
  mapSupplierReturnToPrintData, 
  mapSupplierReturnLineItems,
  createStoreSettings,
} from '../../lib/print/supplier-return-print-helper';
import { useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { PurchaseReturnWorkflowCard } from './components/purchase-return-workflow-card';
import type { Subtask } from '../../components/shared/subtask-list';
import { useComments } from '../../hooks/use-comments';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};



export function PurchaseReturnDetailPage() {
  const { systemId: systemIdParam } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { data: purchaseReturn, isLoading: isLoadingReturn } = usePurchaseReturn(systemIdParam);
  const { findById: findPurchaseOrder } = usePurchaseOrderFinder();
  const { findById: findSupplier } = useSupplierFinder();
  const { findById: findProductById } = useProductFinder();
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  const { employee: authEmployee } = useAuth();
  const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);

  const systemId = React.useMemo(() => (systemIdParam ? asSystemId(systemIdParam) : undefined), [systemIdParam]);

  // purchaseReturn comes directly from usePurchaseReturn hook (API call)

  // ✅ Sử dụng useComments hook thay vì localStorage trực tiếp
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('purchase_return', systemIdParam || '');
  
  type PurchaseReturnComment = CommentType<SystemId>;
  const comments = React.useMemo<PurchaseReturnComment[]>(() => 
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

  const purchaseOrder = React.useMemo(() => {
    if (!purchaseReturn) return null;
    return findPurchaseOrder(purchaseReturn.purchaseOrderSystemId);
  }, [purchaseReturn, findPurchaseOrder]);
  
  const supplier = React.useMemo(() => {
    if (!purchaseReturn) return null;
    return findSupplier(purchaseReturn.supplierSystemId);
  }, [purchaseReturn, findSupplier]);

  const { data: supplierStats } = useSupplierStats(purchaseReturn?.supplierSystemId);

  const totalQuantity = React.useMemo(() => {
    return purchaseReturn?.items.reduce((sum, item) => sum + item.returnQuantity, 0) || 0;
  }, [purchaseReturn]);

  const { findById: findBranchById } = useBranchFinder();
  const { info: storeInfo } = useStoreInfoData();
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
      onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_RETURNS)}
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
  ], [router, handlePrint]);

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

  if (isLoadingReturn) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!purchaseReturn) {
    return (
      <div className="text-center p-8">
        <h2 className="text-h2 font-bold">Không tìm thấy phiếu trả hàng</h2>
        <Button onClick={() => router.back()} className="mt-4 h-9">
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
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle>Thông tin phiếu trả</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailField label="Mã phiếu" value={purchaseReturn.id} />
          <DetailField label="Ngày trả" value={formatDateCustom(parseDate(purchaseReturn.returnDate)!, 'dd/MM/yyyy')} />
          <DetailField label="Chi nhánh" value={purchaseReturn.branchName} />
          <DetailField label="Nhà cung cấp">
            {supplier ? (
              <Link href={`/suppliers/${supplier.systemId}`} className="text-sm text-primary hover:underline font-medium">
                {purchaseReturn.supplierName}
              </Link>
            ) : (
              purchaseReturn.supplierName
            )}
          </DetailField>
          {supplierStats && <SupplierStatsSection stats={supplierStats} />}
          <DetailField label="Đơn nhập hàng gốc">
            {purchaseOrder ? (
              <Link href={`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder.systemId}`} className="text-sm text-primary hover:underline font-medium">
                {purchaseReturn.purchaseOrderId}
              </Link>
            ) : (
              purchaseReturn.purchaseOrderId
            )}
          </DetailField>
        </CardContent>
      </Card>

      {/* Column 2: Thông tin thanh toán */}
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle>Thông tin thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DetailField label="Người tạo phiếu" value={purchaseReturn.creatorName} />
          <DetailField label="Hình thức hoàn tiền" value={purchaseReturn.refundMethod || 'Chưa cập nhật'} />
          <DetailField label="Tổng giá trị hàng trả">
            <span className="text-sm font-semibold text-orange-600">
              {formatCurrency(purchaseReturn.totalReturnValue)}
            </span>
          </DetailField>
          <DetailField label="Số tiền hoàn lại">
            <span className={`text-sm font-semibold ${purchaseReturn.refundAmount > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
              {formatCurrency(purchaseReturn.refundAmount)}
            </span>
          </DetailField>
          {purchaseReturn.reason && (
            <DetailField label="Lý do hoàn trả">
              <span className="text-sm">{purchaseReturn.reason}</span>
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
    <Card className={mobileBleedCardClass}>
      <CardHeader>
        <CardTitle>Danh sách sản phẩm hoàn trả ({purchaseReturn.items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12.5 text-xs">STT</TableHead>
                <TableHead className="text-xs">Sản phẩm</TableHead>
                <TableHead className="w-30 text-center text-xs">SL đặt</TableHead>
                <TableHead className="w-30 text-center text-xs">SL trả</TableHead>
                <TableHead className="w-37.5 text-right text-xs">Đơn giá</TableHead>
                <TableHead className="w-37.5 text-right text-xs">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseReturn.items.map((item, index) => {
                const product = findProductById(item.productSystemId);
                return (
                <TableRow key={index}>
                  <TableCell className="text-center text-sm">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ProductThumbnailCell
                        productSystemId={item.productSystemId}
                        product={product}
                        productName={item.productName}
                        itemThumbnailImage={item.imageUrl || (item as any).thumbnailImage}
                        onPreview={(url, title) => setPreviewImage({ url, title })}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{item.productName}</div>
                        {item.productId && (
                          <Link
                            href={`/products/${item.productSystemId}`}
                            className="text-xs text-muted-foreground hover:text-primary hover:underline"
                          >
                            {item.productId}
                          </Link>
                        )}
                        {item.note && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Ghi chú: {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm">{item.orderedQuantity}</TableCell>
                  <TableCell className="text-center text-sm font-semibold text-orange-600">
                    {item.returnQuantity}
                  </TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-right text-sm font-semibold">
                    {formatCurrency(item.returnQuantity * item.unitPrice)}
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right text-sm font-semibold">
                    Tổng cộng ({totalQuantity} sản phẩm)
                  </TableCell>
                  <TableCell className="text-center text-sm font-bold text-orange-600">
                    {totalQuantity}
                  </TableCell>
                  <TableCell />
                  <TableCell className="text-right font-bold text-h3">
                    {formatCurrency(purchaseReturn.totalReturnValue)}
                  </TableCell>
                </TableRow>
                {purchaseReturn.refundAmount > 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-right text-sm text-muted-foreground">
                      Số tiền nhận lại từ NCC ({purchaseReturn.refundMethod})
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold text-green-600">
                      {formatCurrency(purchaseReturn.refundAmount)}
                    </TableCell>
                  </TableRow>
                )}
              </TableFooter>
          </Table>
        </div>

        {/* Mobile: card stack */}
        <div className="md:hidden space-y-3">
          {purchaseReturn.items.map((item, index) => {
            const product = findProductById(item.productSystemId);
            const lineTotal = item.returnQuantity * item.unitPrice;
            return (
              <MobileCard key={`${item.productSystemId}-${index}-mobile`} inert>
                <MobileCardHeader className="items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <ProductThumbnailCell
                      productSystemId={item.productSystemId}
                      product={product}
                      productName={item.productName}
                      itemThumbnailImage={item.imageUrl || (item as any).thumbnailImage}
                      onPreview={(url, title) => setPreviewImage({ url, title })}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">#{index + 1}</div>
                      <div className="mt-0.5 text-sm font-semibold line-clamp-2">{item.productName}</div>
                      {item.productId && (
                        <Link
                          href={`/products/${item.productSystemId}`}
                          className="mt-0.5 block text-xs text-muted-foreground hover:text-primary hover:underline"
                        >
                          {item.productId}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Thành tiền</div>
                    <div className="mt-0.5 text-sm font-semibold">{formatCurrency(lineTotal)}</div>
                  </div>
                </MobileCardHeader>
                <MobileCardBody>
                  <dl className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">SL đặt</dt>
                      <dd className="font-medium">{item.orderedQuantity}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">SL trả</dt>
                      <dd className="font-semibold text-orange-600">{item.returnQuantity}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Đơn giá</dt>
                      <dd className="font-medium">{formatCurrency(item.unitPrice)}</dd>
                    </div>
                  </dl>
                  {item.note && (
                    <p className="mt-3 text-xs italic text-muted-foreground">• {item.note}</p>
                  )}
                </MobileCardBody>
              </MobileCard>
            );
          })}

          {/* Mobile totals */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tổng SL trả ({totalQuantity} sản phẩm)</span>
              <span className="font-bold text-orange-600">{totalQuantity}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border/50 pt-2">
              <span className="font-bold">Tổng giá trị</span>
              <span className="font-bold text-h3">{formatCurrency(purchaseReturn.totalReturnValue)}</span>
            </div>
            {purchaseReturn.refundAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Nhận lại từ NCC ({purchaseReturn.refundMethod})
                </span>
                <span className="font-semibold text-green-600">{formatCurrency(purchaseReturn.refundAmount)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

    <Dialog open={isPrintPreviewOpen} onOpenChange={setIsPrintPreviewOpen}>
      <DialogContent mobileFullScreen className="sm:max-w-3xl">
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
                    <p className="font-semibold text-base">{purchaseReturn.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Ngày trả: {formatDateCustom(parseDate(purchaseReturn.returnDate)!, 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Tổng giá trị</p>
                    <p className="font-semibold text-orange-600 text-sm">{formatCurrency(purchaseReturn.totalReturnValue)}</p>
                    {purchaseReturn.refundAmount > 0 && (
                      <p className="text-xs text-green-600">Hoàn: {formatCurrency(purchaseReturn.refundAmount)}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <p>Nhà cung cấp: <span className="text-foreground font-medium">{purchaseReturn.supplierName}</span></p>
                  <p>Chi nhánh: <span className="text-foreground font-medium">{purchaseReturn.branchName}</span></p>
                  <p>Đơn nhập: <span className="text-foreground font-medium">{purchaseReturn.purchaseOrderId}</span></p>
                  <p>Người tạo: <span className="text-foreground font-medium">{purchaseReturn.creatorName}</span></p>
                </div>
                {purchaseReturn.reason && (
                  <div className="rounded-md bg-muted/50 p-3 text-xs">
                    <p className="font-medium mb-1">Lý do hoàn trả</p>
                    <p className="text-muted-foreground">{purchaseReturn.reason}</p>
                  </div>
                )}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-15 text-xs">STT</TableHead>
                        <TableHead className="text-xs">Sản phẩm</TableHead>
                        <TableHead className="w-30 text-center text-xs">SL trả</TableHead>
                        <TableHead className="w-37.5 text-right text-xs">Đơn giá</TableHead>
                        <TableHead className="w-37.5 text-right text-xs">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseReturn.items.map((item, index) => (
                        <TableRow key={`${item.productSystemId}-${index}`}>
                          <TableCell className="text-sm">{index + 1}</TableCell>
                          <TableCell>
                            <p className="font-medium text-sm">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">SKU: {item.productId}</p>
                          </TableCell>
                          <TableCell className="text-center font-semibold text-orange-600 text-sm">{item.returnQuantity}</TableCell>
                          <TableCell className="text-right text-sm">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right font-semibold text-sm">{formatCurrency(item.unitPrice * item.returnQuantity)}</TableCell>
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
    <EntityActivityTable entityType="purchase_return" entityId={systemIdParam} />
    </>
  );
}
