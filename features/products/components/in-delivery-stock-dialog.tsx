import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { formatDateForDisplay } from '@/lib/date-utils';
import { Badge } from '../../../components/ui/badge';
import { useAllOrders } from '../../orders/hooks/use-all-orders';
import { useProductFinder } from '../hooks/use-all-products';
import { SystemId } from '../../../lib/id-types';

interface InDeliveryStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productSystemId: SystemId;
  branchSystemId: string;
  branchName: string;
  productName: string;
}

/**
 * Dialog hiển thị các đơn hàng đang giao (đã xuất kho nhưng chưa giao xong)
 */
export function InDeliveryStockDialog({
  open,
  onOpenChange,
  productSystemId,
  branchSystemId,
  branchName,
  productName,
}: InDeliveryStockDialogProps) {
  const { data: allOrders } = useAllOrders();
  const { findById: findProductById } = useProductFinder();
  const router = useRouter();

  // Get product to find SKU (business ID)
  const product = React.useMemo(() => findProductById(productSystemId), [productSystemId, findProductById]);

  // DEBUG: Log data for troubleshooting
  React.useEffect(() => {
    if (open) {
      console.log('[InDeliveryStockDialog] productSystemId:', productSystemId);
      console.log('[InDeliveryStockDialog] branchSystemId:', branchSystemId);
      console.log('[InDeliveryStockDialog] product:', product);
      console.log('[InDeliveryStockDialog] allOrders count:', allOrders.length);
      
      // Find orders with FULLY_STOCKED_OUT
      const dispatchedOrders = allOrders.filter(o => 
        o.stockOutStatus === 'Xuất kho toàn bộ' || o.stockOutStatus === 'FULLY_STOCKED_OUT'
      );
      console.log('[InDeliveryStockDialog] dispatched orders:', dispatchedOrders.map(o => ({
        id: o.id,
        status: o.status,
        stockOutStatus: o.stockOutStatus,
        branchSystemId: o.branchSystemId,
        lineItems: o.lineItems?.map(li => ({ productId: li.productId, productSystemId: li.productSystemId }))
      })));
    }
  }, [open, productSystemId, branchSystemId, product, allOrders]);

  // Find all orders in delivery for this product and branch
  // inDelivery = đã xuất kho (stockOutStatus = FULLY_STOCKED_OUT) nhưng chưa giao xong (deliveryStatus != DELIVERED)
  const inDeliveryOrders = React.useMemo(() => {
    const _productSku = product?.id;
    return allOrders
      .filter(order => {
        // Check branch first
        const orderBranchId = order.branchSystemId;
        if (orderBranchId !== branchSystemId) return false;

        // Check if order contains this product (by systemId only)
        const hasProduct = order.lineItems?.some(item => 
          item.productSystemId === productSystemId
        );
        if (!hasProduct) return false;

        // Order must be dispatched but not yet delivered
        // stockOutStatus = "Xuất kho toàn bộ" AND status not completed/delivered
        const isDispatched = order.stockOutStatus === 'Xuất kho toàn bộ' || order.stockOutStatus === 'FULLY_STOCKED_OUT';
        const isNotDelivered = order.status !== 'DELIVERED' && 
                               order.status !== 'COMPLETED' && 
                               order.status !== 'Hoàn thành' &&
                               order.deliveryStatus !== 'Đã giao hàng' &&
                               order.deliveryStatus !== 'DELIVERED' &&
                               order.status !== 'CANCELLED' &&
                               order.status !== 'Đã hủy';
        
        return isDispatched && isNotDelivered;
      })
      .map(order => {
        const lineItem = order.lineItems.find(item => 
          item.productSystemId === productSystemId
        );
        if (!lineItem) {
          return null;
        }
        return {
          id: order.id,
          systemId: order.systemId,
          date: order.orderDate,
          customerName: order.customerName,
          quantity: lineItem.quantity,
          status: order.status,
          deliveryStatus: order.deliveryStatus,
          shippingCarrier: order.shippingInfo?.carrier,
          trackingCode: order.shippingInfo?.trackingCode,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [allOrders, productSystemId, branchSystemId, product]);

  const totalInDelivery = inDeliveryOrders.reduce((sum, item) => sum + item.quantity, 0);

  const handleRowClick = (systemId: string) => {
    router.push(`/orders/${systemId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đang giao hàng: {productName}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Chi nhánh: {branchName} • Tổng đang giao: <span className="text-primary font-semibold">{totalInDelivery}</span> sản phẩm
          </p>
        </DialogHeader>

        {inDeliveryOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Không có đơn hàng nào đang giao
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Ngày xuất kho</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Đơn vị vận chuyển</TableHead>
                <TableHead className="text-right">Số lượng</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inDeliveryOrders.map((item) => (
                <TableRow 
                  key={item.systemId} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(item.systemId)}
                >
                  <TableCell>
                    <Badge variant="secondary">Đơn hàng</Badge>
                    <span className="ml-2 font-medium">{item.id}</span>
                  </TableCell>
                  <TableCell>{item.date ? formatDateForDisplay(item.date) : '-'}</TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{item.shippingCarrier || '-'}</TableCell>
                  <TableCell className="text-right text-primary font-semibold">{item.quantity}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {item.deliveryStatus || item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
