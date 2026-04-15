'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, ArrowLeft } from 'lucide-react';

import { useInventoryReceipt } from './hooks/use-inventory-receipts';
import { usePurchaseOrder } from '../purchase-orders/hooks/use-purchase-orders';
import { usePrint } from '../../lib/use-print';
import { 
  convertStockInForPrint,
  mapStockInToPrintData, 
  mapStockInLineItems,
  createStoreSettings,
} from '../../lib/print/stock-in-print-helper';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { formatDateCustom, parseDate } from '../../lib/date-utils';
import { numberToWords } from '../../lib/print-service';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { Comments } from '../../components/Comments';
import { useComments } from '@/hooks/use-comments';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { useAuth } from '../../contexts/auth-context';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { DetailField } from '../../components/ui/detail-field';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ProductThumbnailCell } from '../../components/shared/read-only-products-table';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';

const formatCurrency = (value?: number) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
}).format(Number(value) || 0);



export function InventoryReceiptDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { data: receipt, isLoading } = useInventoryReceipt(systemId);
  const { data: purchaseOrder } = usePurchaseOrder(receipt?.purchaseOrderSystemId);
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  const { employee: authEmployee } = useAuth();

  // Comments from database
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('inventory_receipt', systemId || '');

  const comments = React.useMemo(() => 
    dbComments.map(c => ({
      id: c.systemId as unknown as SystemId,
      content: c.content,
      author: {
        systemId: (c.createdBy || 'system') as unknown as SystemId,
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
  }), [authEmployee]);

  // ✅ Phase A4: Use supplier data from API response instead of loading ALL suppliers
  const supplier = (receipt as Record<string, unknown> | undefined)?.supplier as { id?: string; name?: string; phone?: string; email?: string } | undefined;

  const totalQuantity = React.useMemo(() => (
    receipt?.items.reduce((sum, item) => sum + (Number(item.receivedQuantity) || 0), 0) ?? 0
  ), [receipt]);

  const totalValue = React.useMemo(() => (
    receipt?.items.reduce((sum, item) => {
      const qty = Number(item.receivedQuantity) || 0;
      const price = Number(item.unitPrice) || 0;
      return sum + qty * price;
    }, 0) ?? 0
  ), [receipt]);

  // ⚡ OPTIMIZED: Print uses lazy loading - no hooks needed at mount time
  const { print } = usePrint({ enabled: false });

  // ⚡ OPTIMIZED: Lazy load ALL print data only when print is clicked
  const handlePrint = React.useCallback(async () => {
    if (!receipt) return;

    // Fetch print data and branches in parallel (lazy loading)
    const [{ storeInfo }, branchesRes] = await Promise.all([
      fetchPrintData(),
      fetch('/api/branches?limit=100').then(r => r.ok ? r.json() : { data: [] })
    ]);
    
    // Find branch from fetched data
    const branch = receipt.branchSystemId 
      ? branchesRes.data?.find((b: { systemId: string }) => b.systemId === receipt.branchSystemId)
      : null;
    const storeSettings = createStoreSettings(storeInfo);
    const stockInForPrint = convertStockInForPrint(receipt, { 
      branch, 
      supplier,
    });

    const printData = mapStockInToPrintData(stockInForPrint, storeSettings);
    const lineItems = mapStockInLineItems(stockInForPrint.items);

    // Inject extra fields
    printData['amount_text'] = numberToWords(totalValue);

    print('stock-in', {
      data: printData,
      lineItems: lineItems
    });
  }, [receipt, supplier, print, totalValue]);

  const headerActions = React.useMemo(() => {
    if (!receipt) return [];
    return [
      <Button
        key="print"
        size="sm"
        className="h-9"
        onClick={handlePrint}
      >
        <Printer className="mr-2 h-4 w-4" />
        In phiếu
      </Button>,
    ];
  }, [receipt, handlePrint]);

  const badge = React.useMemo(() => {
    if (!receipt) return undefined;
    const label = receipt.branchName || 'Chưa gán chi nhánh';
    return (
      <Badge variant="outline" className="uppercase tracking-wide">
        {label}
      </Badge>
    );
  }, [receipt]);

  usePageHeader({
    title: receipt ? `Phiếu nhập kho ${receipt.id}` : 'Chi tiết phiếu nhập',
    subtitle: receipt?.supplierName ? `Nhà cung cấp: ${receipt.supplierName}` : undefined,
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD, isCurrent: false },
      { label: 'Phiếu nhập kho', href: ROUTES.PROCUREMENT.INVENTORY_RECEIPTS, isCurrent: false },
      { label: receipt?.id || 'Chi ti?t', href: '', isCurrent: true },
    ],
    badge,
    showBackButton: true,
    actions: headerActions,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Đang tải thông tin phiếu nhập kho...</p>
        </CardContent>
      </Card>
    );
  }

  if (!receipt) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <p className="text-h3 font-semibold">Không tìm thấy phiếu nhập kho.</p>
          <Button className="h-9" onClick={() => router.push(ROUTES.PROCUREMENT.INVENTORY_RECEIPTS)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </CardContent>
      </Card>
    );
  }

  const receivedDateLabel = receipt.receivedDate
    ? formatDateCustom(parseDate(receipt.receivedDate)!, 'dd/MM/yyyy HH:mm')
    : '-';

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DetailField label="Mã phiếu">{receipt.id}</DetailField>
            <DetailField label="Ngày nhập">{receivedDateLabel}</DetailField>
            <DetailField label="Chi nhánh">{receipt.branchName || 'Chi nhánh mặc định'}</DetailField>
            <DetailField label="Loại nhập">{receipt.purchaseOrderId ? 'Nhập từ đơn mua hàng' : 'Nhập kho trực tiếp'}</DetailField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DetailField label="Nhà cung cấp">
              {receipt.supplierSystemId ? (
                <Link href={ROUTES.PROCUREMENT.SUPPLIER_VIEW.replace(':systemId', receipt.supplierSystemId)}
                  className="text-primary hover:underline font-medium"
                >
                  {receipt.supplierName}
                </Link>
              ) : (
                receipt.supplierName || 'Không có NCC (nhập trực tiếp)'
              )}
            </DetailField>
            <DetailField label="Đơn mua hàng">
              {receipt.purchaseOrderSystemId ? (
                <Link href={ROUTES.PROCUREMENT.PURCHASE_ORDER_VIEW.replace(':systemId', receipt.purchaseOrderSystemId)}
                  className="text-primary hover:underline font-medium"
                >
                  {receipt.purchaseOrderId}
                </Link>
              ) : (
                receipt.purchaseOrderId || 'Không có (nhập trực tiếp)'
              )}
            </DetailField>
            <DetailField label="Người nhận hàng">
              {receipt.receiverSystemId ? (
                <Link href={ROUTES.HRM.EMPLOYEE_VIEW.replace(':systemId', receipt.receiverSystemId)}
                  className="text-primary hover:underline font-medium"
                >
                  {receipt.receiverName}
                </Link>
              ) : (
                receipt.receiverName || 'Hệ thống'
              )}
            </DetailField>
          </div>
          {receipt.notes && (
            <DetailField label="Ghi chú">
              <span className="text-sm text-muted-foreground">{receipt.notes}</span>
            </DetailField>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="p-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-h3 md:font-semibold md:text-foreground md:normal-case md:tracking-normal">Danh sách sản phẩm</h3>
            <p className="text-sm text-muted-foreground">
              Tổng {receipt.items.length} mặt hàng • {totalQuantity} đơn vị • {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="border-t overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-15 text-center">STT</TableHead>
                  <TableHead className="w-15">Ảnh</TableHead>
                  <TableHead>Mã sản phẩm</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="text-center">SL đặt</TableHead>
                  <TableHead className="text-center">SL thực nhập</TableHead>
                  <TableHead className="text-right">Đơn giá nhập</TableHead>
                  <TableHead className="text-right">Giá vốn</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.items.map((item, index) => {
                  const itemWithProduct = item as typeof item & { thumbnailImage?: string; costPrice?: number; productImages?: string[] };
                  return (
                  <TableRow key={`${item.productSystemId}-${index}`}>
                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <ProductThumbnailCell
                        productSystemId={item.productSystemId}
                        productName={item.productName}
                        itemThumbnailImage={itemWithProduct.thumbnailImage || itemWithProduct.productImages?.[0]}
                        onPreview={(url, title) => setPreviewImage({ url, title })}
                      />
                    </TableCell>
                    <TableCell>
                      <Link href={ROUTES.SALES.PRODUCT_VIEW.replace(':systemId', item.productSystemId)}
                        className="text-primary hover:underline font-medium"
                      >
                        {item.productId || '-'}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {item.productName || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{Number(item.orderedQuantity) || 0}</TableCell>
                    <TableCell className="text-center font-medium">{Number(item.receivedQuantity) || 0}</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number(item.unitPrice) || 0)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatCurrency(itemWithProduct.costPrice || 0)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency((Number(item.receivedQuantity) || 0) * (Number(item.unitPrice) || 0))}
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-semibold">Tổng cộng</TableCell>
                  <TableCell className="text-center font-semibold">{totalQuantity}</TableCell>
                  <TableCell colSpan={2} />
                  <TableCell className="text-right font-semibold">{formatCurrency(totalValue)}</TableCell>
                </TableRow>
                {/* Hiển thị phí vận chuyển và chi phí khác từ đơn nhập hàng */}
                {purchaseOrder && (Number(purchaseOrder.shippingFee) > 0 || Number(purchaseOrder.tax) > 0) && (
                  <>
                    {Number(purchaseOrder.shippingFee) > 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-right text-muted-foreground">Phí vận chuyển</TableCell>
                        <TableCell className="text-right">{formatCurrency(purchaseOrder.shippingFee)}</TableCell>
                      </TableRow>
                    )}
                    {Number(purchaseOrder.tax) > 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-right text-muted-foreground">Chi phí khác</TableCell>
                        <TableCell className="text-right">{formatCurrency(purchaseOrder.tax)}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={8} className="text-right font-bold">Tổng giá trị nhập kho</TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(totalValue + Number(purchaseOrder.shippingFee || 0) + Number(purchaseOrder.tax || 0))}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog 
        open={!!previewImage} 
        onOpenChange={(open) => !open && setPreviewImage(null)} 
        images={previewImage ? [previewImage.url] : []} 
        title={previewImage?.title}
      />

      {/* Comments */}
      <Comments
        entityType="inventory-receipt"
        entityId={receipt.systemId}
        comments={comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        currentUser={commentCurrentUser}
        title="Bình luận"
        placeholder="Thêm bình luận về phiếu nhập kho..."
      />

      {/* Activity History */}
      <EntityActivityTable entityType="inventory_receipt" entityId={systemId} />
    </div>
  );
}
