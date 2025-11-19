import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { toast } from 'sonner';

import { useInventoryReceiptStore } from './store.ts';
import { usePurchaseOrderStore } from '../purchase-orders/store.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { ROUTES } from '../../lib/router.ts';
import { formatDateCustom, parseDate } from '../../lib/date-utils.ts';
import { asSystemId } from '@/lib/id-types';
import { Card, CardContent } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../../components/ui/table.tsx';

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

  const handlePrint = React.useCallback(() => {
    if (!receipt) return;
    toast.info('Đang gửi lệnh in', {
      description: `Phiếu nhập ${receipt.id}`,
    });
  }, [receipt]);

  const headerActions = React.useMemo(() => {
    if (!receipt) return [];
    return [
      <Button
        key="back"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => navigate(ROUTES.PROCUREMENT.INVENTORY_RECEIPTS)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>,
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
  }, [receipt, navigate, handlePrint]);

  usePageHeader({
    title: receipt ? `Chi tiết phiếu nhập ${receipt.id}` : 'Chi tiết phiếu nhập',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD, isCurrent: false },
      { label: 'Phiếu nhập kho', href: ROUTES.PROCUREMENT.INVENTORY_RECEIPTS, isCurrent: false },
      { label: receipt?.id || 'Chi tiết', href: '', isCurrent: true },
    ],
    actions: headerActions,
  });

  if (!receipt) {
    return (
      <Card>
        <CardContent className="py-10 text-center space-y-4">
          <p className="text-lg font-semibold">Không tìm thấy phiếu nhập kho.</p>
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
              <span className="text-sm text-muted-foreground">{receipt.notes}</span>
            </DetailField>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
            <p className="text-sm text-muted-foreground">
              Tổng {receipt.items.length} mặt hàng · {totalQuantity} đơn vị · {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">STT</TableHead>
                  <TableHead>Mã sản phẩm</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="text-center">SL đặt</TableHead>
                  <TableHead className="text-center">SL thực nhập</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.items.map((item, index) => (
                  <TableRow key={`${item.productSystemId}-${index}`}>
                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
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
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-semibold">Tổng cộng</TableCell>
                  <TableCell className="text-center font-semibold">{totalQuantity}</TableCell>
                  <TableCell />
                  <TableCell className="text-right font-semibold">{formatCurrency(totalValue)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
