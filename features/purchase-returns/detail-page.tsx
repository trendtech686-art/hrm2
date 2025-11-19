import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../lib/router.ts';
import { formatDateCustom, parseDate } from '@/lib/date-utils';
import { usePurchaseReturnStore } from './store.ts';
import { usePurchaseOrderStore } from '../purchase-orders/store.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Printer, PackageX } from 'lucide-react';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog.tsx';
import { ScrollArea } from '../../components/ui/scroll-area.tsx';
import { useToast } from '../../hooks/use-toast.ts';
import { asSystemId } from '@/lib/id-types';

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
  const { toast } = useToast();
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = React.useState(false);

  const systemId = React.useMemo(() => (systemIdParam ? asSystemId(systemIdParam) : undefined), [systemIdParam]);

  const purchaseReturn = React.useMemo(() => (systemId ? findById(systemId) : null), [systemId, findById]);
  const purchaseOrder = React.useMemo(() => {
    if (!purchaseReturn) return null;
    return findPurchaseOrder(purchaseReturn.purchaseOrderSystemId);
  }, [purchaseReturn, findPurchaseOrder]);
  
  const supplier = React.useMemo(() => {
    if (!purchaseReturn) return null;
    return findSupplier(purchaseReturn.supplierSystemId);
  }, [purchaseReturn, findSupplier]);

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
      onClick={() => setIsPrintPreviewOpen(true)}
    >
      <Printer className="mr-2 h-4 w-4" />
      In phiếu
    </Button>
  ], [navigate]);

  usePageHeader({
    title: purchaseReturn ? `Chi tiết phiếu trả ${purchaseReturn.id}` : 'Chi tiết phiếu trả NCC',
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Trả hàng nhập', href: ROUTES.PROCUREMENT.PURCHASE_RETURNS, isCurrent: false },
      { label: purchaseReturn?.id || 'Chi tiết', href: '', isCurrent: true }
    ]
  });

  const totalQuantity = React.useMemo(() => {
    return purchaseReturn?.items.reduce((sum, item) => sum + item.returnQuantity, 0) || 0;
  }, [purchaseReturn]);

  const handleConfirmPrint = React.useCallback(() => {
    if (!purchaseReturn) return;
    toast({
      title: 'Đã gửi lệnh in',
      description: `Phiếu trả ${purchaseReturn.id} đang được chuẩn bị để in.`
    });
    setIsPrintPreviewOpen(false);
  }, [purchaseReturn, toast]);

  if (!purchaseReturn) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Không tìm thấy phiếu trả hàng</h2>
        <Button onClick={() => navigate(-1)} className="mt-4 h-9">
          <ArrowLeft className="mr-2 h-4 w-4" />Quay lại
        </Button>
      </div>
    );
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <PackageX className="h-6 w-6 text-orange-600" />
              <CardTitle className="text-2xl">Phiếu trả hàng {purchaseReturn.id}</CardTitle>
            </div>
            <CardDescription>
              Ngày trả: {formatDateCustom(parseDate(purchaseReturn.returnDate)!, 'dd/MM/yyyy')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
              <Button variant="outline" className="h-9" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
            </Button>
              <Button variant="outline" className="h-9" onClick={() => setIsPrintPreviewOpen(true)}>
                <Printer className="mr-2 h-4 w-4" /> In phiếu
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Thông tin chung */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailField label="Nhà cung cấp">
            {supplier ? (
              <Link to={`/suppliers/${supplier.systemId}`} className="text-primary hover:underline font-medium">
                {purchaseReturn.supplierName}
              </Link>
            ) : (
              purchaseReturn.supplierName
            )}
          </DetailField>
          <DetailField label="Đơn nhập hàng gốc">
            {purchaseOrder ? (
              <Link to={`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder.systemId}`} className="text-primary hover:underline font-medium">
                {purchaseReturn.purchaseOrderId}
              </Link>
            ) : (
              purchaseReturn.purchaseOrderId
            )}
          </DetailField>
          <DetailField label="Chi nhánh" value={purchaseReturn.branchName} />
          <DetailField label="Người tạo phiếu" value={purchaseReturn.creatorName} />
          <DetailField label="Hình thức hoàn tiền" value={purchaseReturn.refundMethod} />
          <DetailField label="Số tiền hoàn lại">
            <span className="font-semibold text-green-600">
              {formatCurrency(purchaseReturn.refundAmount)}
            </span>
          </DetailField>
        </div>

        {/* Lý do trả hàng */}
        {purchaseReturn.reason && (
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Lý do hoàn trả</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{purchaseReturn.reason}</p>
            </CardContent>
          </Card>
        )}

        {/* Danh sách sản phẩm */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm hoàn trả</h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead className="w-[120px]">Mã SKU</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="w-[120px] text-center">SL đặt</TableHead>
                  <TableHead className="w-[120px] text-center">SL trả</TableHead>
                  <TableHead className="w-[150px] text-right">Đơn giá</TableHead>
                  <TableHead className="w-[180px] text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseReturn.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-mono text-sm">{item.productId}</TableCell>
                    <TableCell>
                      <div>{item.productName}</div>
                      {item.note && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Ghi chú: {item.note}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{item.orderedQuantity}</TableCell>
                    <TableCell className="text-center font-semibold text-orange-600">
                      {item.returnQuantity}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(item.returnQuantity * item.unitPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-semibold">
                    Tổng cộng ({totalQuantity} sản phẩm)
                  </TableCell>
                  <TableCell className="text-center font-bold text-orange-600">
                    {totalQuantity}
                  </TableCell>
                  <TableCell />
                  <TableCell className="text-right font-bold text-lg">
                    {formatCurrency(purchaseReturn.totalReturnValue)}
                  </TableCell>
                </TableRow>
                {purchaseReturn.refundAmount > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-right text-muted-foreground">
                      Số tiền nhận lại từ NCC ({purchaseReturn.refundMethod})
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatCurrency(purchaseReturn.refundAmount)}
                    </TableCell>
                  </TableRow>
                )}
              </TableFooter>
            </Table>
          </div>
        </div>

        {/* Tóm tắt giá trị */}
        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Tổng giá trị hàng trả</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(purchaseReturn.totalReturnValue)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Số tiền hoàn lại</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(purchaseReturn.refundAmount)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Tổng sản phẩm trả</p>
                <p className="text-2xl font-bold">
                  {totalQuantity}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                    <p className="font-semibold text-base">{purchaseReturn.id}</p>
                    <p className="text-xs text-muted-foreground">
                      Ngày trả: {formatDateCustom(parseDate(purchaseReturn.returnDate)!, 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Tổng giá trị</p>
                    <p className="font-semibold text-orange-600">{formatCurrency(purchaseReturn.totalReturnValue)}</p>
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
                        <TableHead className="w-[60px]">STT</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="w-[120px] text-center">SL trả</TableHead>
                        <TableHead className="w-[150px] text-right">Đơn giá</TableHead>
                        <TableHead className="w-[150px] text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseReturn.items.map((item, index) => (
                        <TableRow key={`${item.productSystemId}-${index}`}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">SKU: {item.productId}</p>
                          </TableCell>
                          <TableCell className="text-center font-semibold text-orange-600">{item.returnQuantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(item.unitPrice * item.returnQuantity)}</TableCell>
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
    </>
  );
}
