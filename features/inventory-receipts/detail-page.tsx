import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { useInventoryReceiptStore } from './store.ts';
import { usePurchaseOrderStore } from '../purchase-orders/store.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Printer } from 'lucide-react';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table.tsx';
import { useSupplierStore } from '../suppliers/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};



export function InventoryReceiptDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const { findById: findReceiptById } = useInventoryReceiptStore();
  const { data: allPurchaseOrders } = usePurchaseOrderStore();
  const { findById: findSupplierById } = useSupplierStore();
  const { findById: findEmployeeById } = useEmployeeStore();

  const receipt = React.useMemo(() => (systemId ? findReceiptById(systemId) : null), [systemId, findReceiptById]);
  const purchaseOrder = React.useMemo(() => {
    if (!receipt) return null;
    return allPurchaseOrders.find(po => po.systemId === receipt.purchaseOrderId); // ✅ Fixed: Match by systemId
  }, [receipt, allPurchaseOrders]);
  
  const supplier = React.useMemo(() => (receipt ? findSupplierById(receipt.supplierId) : null), [receipt, findSupplierById]);
  const receiver = React.useMemo(() => (receipt ? findEmployeeById(receipt.receiverId) : null), [receipt, findEmployeeById]);

  usePageHeader();

  const totalQuantity = React.useMemo(() => {
    return receipt?.items.reduce((sum, item) => sum + Number(item.receivedQuantity), 0) || 0;
  }, [receipt]);
  
  const totalValue = React.useMemo(() => {
    return receipt?.items.reduce((sum, item) => sum + (Number(item.receivedQuantity) * Number(item.unitPrice)), 0) || 0;
  }, [receipt]);


  if (!receipt) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Không tìm thấy phiếu nhập kho</h2>
        <Button onClick={() => navigate(-1)} className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Quay lại</Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardDescription className="mt-1">
              Ngày nhập: {formatDate(receipt.receivedDate)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Button>
            <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> In phiếu</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DetailField label="Nhà cung cấp">
              {supplier ? (
                <Link to={`/suppliers/${supplier.systemId}`} className="text-primary hover:underline font-medium">
                  {receipt.supplierName}
                </Link>
              ) : (
                receipt.supplierName
              )}
            </DetailField>
            <DetailField label="Đơn nhập hàng">
                {purchaseOrder ? (
                    <Link to={`/purchase-orders/${purchaseOrder.systemId}`} className="text-primary hover:underline font-medium">
                        {receipt.purchaseOrderId}
                    </Link>
                ) : (
                    receipt.purchaseOrderId
                )}
            </DetailField>
            <DetailField label="Người nhập kho">
              {receiver ? (
                <Link to={`/employees/${receiver.systemId}`} className="text-primary hover:underline font-medium">
                  {receipt.receiverName}
                </Link>
              ) : (
                receipt.receiverName
              )}
            </DetailField>
        </div>

        <div className="space-y-2">
            <h4 className="font-semibold">Sản phẩm đã nhập</h4>
            <div className="border rounded-md">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">STT</TableHead>
                            <TableHead>Mã SP</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead className="text-center">SL đặt</TableHead>
                            <TableHead className="text-center">SL thực nhập</TableHead>
                            <TableHead className="text-right">Đơn giá</TableHead>
                            <TableHead className="text-right">Thành tiền</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {receipt.items.map((item, index) => (
                            <TableRow key={item.productSystemId}>
                                <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                                <TableCell>
                                  <Link to={`/products/${item.productSystemId}`} className="text-primary hover:underline font-medium">
                                    {item.productId}
                                  </Link>
                                </TableCell>
                                <TableCell className="font-medium">
                                  <Link to={`/products/${item.productSystemId}`} className="text-primary hover:underline">
                                    {item.productName}
                                  </Link>
                                </TableCell>
                                <TableCell className="text-center">{item.orderedQuantity}</TableCell>
                                <TableCell className="text-center font-semibold">{item.receivedQuantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(item.receivedQuantity * item.unitPrice)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} className="text-right font-bold">Tổng cộng</TableCell>
                            <TableCell className="text-center font-bold">{totalQuantity}</TableCell>
                            <TableCell />
                            <TableCell className="text-right font-bold">{formatCurrency(totalValue)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
        {receipt.notes && (
            <div>
                 <h4 className="font-semibold mb-1">Ghi chú</h4>
                 <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">{receipt.notes}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
