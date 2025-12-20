'use client'

import * as React from 'react';
import { Link, useNavigate, useParams } from '@/lib/next-compat';
import { ArrowLeft, Printer } from 'lucide-react';
import { toast } from 'sonner';

import { useInventoryReceiptStore } from './store';
import { usePurchaseOrderStore } from '../purchase-orders/store';
import { useSupplierStore } from '../suppliers/store';
import { useEmployeeStore } from '../employees/store';
import { useProductStore } from '../products/store';
import { usePrint } from '../../lib/use-print';
import { 
  convertStockInForPrint,
  mapStockInToPrintData, 
  mapStockInLineItems,
  createStoreSettings,
} from '../../lib/print/stock-in-print-helper';
import { useBranchStore } from '../settings/branches/store';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { numberToWords } from '../../lib/print-mappers/types';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { formatDateCustom, parseDate } from '../../lib/date-utils';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory';
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
  const navigate = useNavigate();
  const { findById: findReceiptById } = useInventoryReceiptStore();
  const { findById: findPurchaseOrderById } = usePurchaseOrderStore();
  const { findById: findSupplierById } = useSupplierStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  const { findById: findProductById } = useProductStore();
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  const { employee: authEmployee } = useAuth();

  // Comments state with localStorage persistence
  type InventoryReceiptComment = CommentType<SystemId>;
  const [comments, setComments] = React.useState<InventoryReceiptComment[]>(() => {
    const saved = localStorage.getItem(`inventory-receipt-comments-${systemId}`);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    if (systemId) {
      localStorage.setItem(`inventory-receipt-comments-${systemId}`, JSON.stringify(comments));
    }
  }, [comments, systemId]);

  const handleAddComment = React.useCallback((content: string, parentId?: string) => {
    const newComment: InventoryReceiptComment = {
      id: asSystemId(`comment-${Date.now()}`),
      content,
      author: {
        systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
        name: authEmployee?.fullName || 'Hệ thống',
      },
      createdAt: new Date(),
      parentId: parentId as SystemId | undefined,
    };
    setComments(prev => [...prev, newComment]);
  }, [authEmployee]);

  const handleUpdateComment = React.useCallback((commentId: string, content: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, content, updatedAt: new Date() } : c
    ));
  }, []);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, []);

  const commentCurrentUser = React.useMemo(() => ({
    systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
    name: authEmployee?.fullName || 'Hệ thống',
  }), [authEmployee]);

  const receipt = React.useMemo(() => (systemId ? findReceiptById(asSystemId(systemId)) : undefined), [systemId, findReceiptById]);
  const purchaseOrder = React.useMemo(() => (
    receipt?.purchaseOrderSystemId ? findPurchaseOrderById(receipt.purchaseOrderSystemId) : undefined
  ), [receipt?.purchaseOrderSystemId, findPurchaseOrderById]);
  const supplier = React.useMemo(() => (
    receipt?.supplierSystemId ? findSupplierById(asSystemId(receipt.supplierSystemId)) : undefined
  ), [receipt?.supplierSystemId, findSupplierById]);
  const receiver = React.useMemo(() => (
    receipt?.receiverSystemId ? findEmployeeById(asSystemId(receipt.receiverSystemId)) : undefined
  ), [receipt?.receiverSystemId, findEmployeeById]);

  const totalQuantity = React.useMemo(() => (
    receipt?.items.reduce((sum, item) => sum + Number(item.receivedQuantity), 0) ?? 0
  ), [receipt]);

  const totalValue = React.useMemo(() => (
    receipt?.items.reduce((sum, item) => sum + Number(item.receivedQuantity) * Number(item.unitPrice), 0) ?? 0
  ), [receipt]);

  const { findById: findBranchById } = useBranchStore();
  const { info: storeInfo } = useStoreInfoStore();
  const { print } = usePrint(receipt?.branchSystemId);

  const handlePrint = React.useCallback(() => {
    if (!receipt) return;

    const branch = receipt.branchSystemId ? findBranchById(receipt.branchSystemId) : undefined;

    // Use helper to prepare print data
    const storeSettings = createStoreSettings(storeInfo);
    const stockInForPrint = convertStockInForPrint(receipt, { 
      branch, 
      supplier,
      purchaseOrder: purchaseOrder || undefined,
    });

    const printData = mapStockInToPrintData(stockInForPrint, storeSettings);
    const lineItems = mapStockInLineItems(stockInForPrint.items);

    // Inject extra fields
    printData['amount_text'] = numberToWords(totalValue);

    print('stock-in', {
      data: printData,
      lineItems: lineItems
    });
  }, [receipt, purchaseOrder, supplier, storeInfo, print, findBranchById, totalValue]);

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
    const label = receipt.branchName || 'Chưa gắn chi nhánh';
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
      { label: receipt?.id || 'Chi tiết', href: '', isCurrent: true },
    ],
    badge,
    showBackButton: true,
    actions: headerActions,
  });

  if (!receipt) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <p className="text-h3 font-semibold">Không tìm thấy phiếu nhập kho.</p>
          <Button className="h-9" onClick={() => navigate(ROUTES.PROCUREMENT.INVENTORY_RECEIPTS)}>
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
            <DetailField label="Chi nhánh">{receipt.branchName || 'Không xác định'}</DetailField>
            <DetailField label="Kho hàng">{receipt.warehouseName || 'Không xác định'}</DetailField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DetailField label="Nhà cung cấp">
              {supplier ? (
                <Link
                  to={ROUTES.PROCUREMENT.SUPPLIER_VIEW.replace(':systemId', supplier.systemId)}
                  className="text-primary hover:underline font-medium"
                >
                  {receipt.supplierName}
                </Link>
              ) : (
                receipt.supplierName
              )}
            </DetailField>
            <DetailField label="Đơn mua hàng">
              {purchaseOrder ? (
                <Link
                  to={ROUTES.PROCUREMENT.PURCHASE_ORDER_VIEW.replace(':systemId', purchaseOrder.systemId)}
                  className="text-primary hover:underline font-medium"
                >
                  {receipt.purchaseOrderId}
                </Link>
              ) : (
                receipt.purchaseOrderId
              )}
            </DetailField>
            <DetailField label="Người nhận hàng">
              {receiver ? (
                <Link
                  to={ROUTES.HRM.EMPLOYEE_VIEW.replace(':systemId', receiver.systemId)}
                  className="text-primary hover:underline font-medium"
                >
                  {receipt.receiverName}
                </Link>
              ) : (
                receipt.receiverName
              )}
            </DetailField>
          </div>
          {receipt.notes && (
            <DetailField label="Ghi chú">
              <span className="text-body-sm text-muted-foreground">{receipt.notes}</span>
            </DetailField>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="p-6">
            <h3 className="text-h3 font-semibold">Danh sách sản phẩm</h3>
            <p className="text-body-sm text-muted-foreground">
              Tổng {receipt.items.length} mặt hàng · {totalQuantity} đơn vị · {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">STT</TableHead>
                  <TableHead className="w-[60px]">Ảnh</TableHead>
                  <TableHead>Mã sản phẩm</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="text-center">SL đặt</TableHead>
                  <TableHead className="text-center">SL thực nhập</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.items.map((item, index) => {
                  const product = findProductById(item.productSystemId);
                  return (
                  <TableRow key={`${item.productSystemId}-${index}`}>
                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <ProductThumbnailCell
                        productSystemId={item.productSystemId}
                        product={product}
                        productName={item.productName}
                        onPreview={(url, title) => setPreviewImage({ url, title })}
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        to={ROUTES.SALES.PRODUCT_VIEW.replace(':systemId', item.productSystemId)}
                        className="text-primary hover:underline font-medium"
                      >
                        {item.productId}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={ROUTES.SALES.PRODUCT_VIEW.replace(':systemId', item.productSystemId)}
                        className="text-primary hover:underline"
                      >
                        {item.productName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">{item.orderedQuantity}</TableCell>
                    <TableCell className="text-center font-medium">{item.receivedQuantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(Number(item.receivedQuantity) * Number(item.unitPrice))}
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-semibold">Tổng cộng</TableCell>
                  <TableCell className="text-center font-semibold">{totalQuantity}</TableCell>
                  <TableCell />
                  <TableCell className="text-right font-semibold">{formatCurrency(totalValue)}</TableCell>
                </TableRow>
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
      <ActivityHistory
        history={[]}
        title="Lịch sử hoạt động"
        emptyMessage="Chưa có lịch sử hoạt động"
        groupByDate
        maxHeight="400px"
      />
    </div>
  );
}
