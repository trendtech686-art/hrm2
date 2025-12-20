import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { formatDateForDisplay } from '@/lib/date-utils';
import { Badge } from '../../../components/ui/badge';
import { useOrderStore } from '../../orders/store';
import { useProductStore } from '../store';
import type { SystemId } from '../../../lib/id-types';
import * as ReactRouterDOM from '@/lib/next-compat';

interface InTransitStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productSystemId: SystemId;
  branchSystemId: string;
  branchName: string;
  productName: string;
}

export function InTransitStockDialog({
  open,
  onOpenChange,
  productSystemId,
  branchSystemId,
  branchName,
  productName,
}: InTransitStockDialogProps) {
  const { data: allOrders } = useOrderStore();
  const { findById: findProductById } = useProductStore();
  const navigate = ReactRouterDOM.useNavigate();

  const product = React.useMemo(() => findProductById(productSystemId), [findProductById, productSystemId]);
  const productSku = product?.id;

  const inTransitOrders = React.useMemo(() => {
    const isInTransitStatus = (deliveryStatus?: string, stockOutStatus?: string) => {
      if (!deliveryStatus && !stockOutStatus) return false;
      if (deliveryStatus === 'Đang giao hàng' || deliveryStatus === 'Chờ lấy hàng') return true;
      if (stockOutStatus === 'Xuất kho toàn bộ' && deliveryStatus !== 'Đã giao hàng') return true;
      return false;
    };

    return allOrders
      .filter(order => order.branchSystemId === branchSystemId && isInTransitStatus(order.deliveryStatus, order.stockOutStatus))
      .map(order => {
        const matchingItems = order.lineItems?.filter(item =>
          item.productSystemId === productSystemId || (productSku && item.productId === productSku)
        ) || [];

        if (matchingItems.length === 0) {
          return null;
        }

        const quantity = matchingItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const latestPackaging = order.packagings?.[order.packagings.length - 1];

        return {
          id: order.id,
          systemId: order.systemId,
          date: order.orderDate,
          customerName: order.customerName,
          quantity,
          deliveryStatus: order.deliveryStatus,
          carrier: latestPackaging?.carrier || order.shippingInfo?.carrier,
          trackingCode: latestPackaging?.trackingCode || order.shippingInfo?.trackingCode,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allOrders, branchSystemId, productSystemId, productSku]);

  const totalInTransit = inTransitOrders.reduce((sum, order) => sum + order.quantity, 0);

  const handleRowClick = (order: typeof inTransitOrders[number]) => {
    navigate(`/orders/${order.systemId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Hàng đang giao: {productName}
          </DialogTitle>
          <div className="text-body-sm text-muted-foreground">
            Chi nhánh: {branchName} • Tổng đang giao: <span className="text-body-sm font-medium text-blue-600">{totalInTransit}</span> sản phẩm
          </div>
        </DialogHeader>

        {inTransitOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Không có đơn hàng nào đang giao sản phẩm này tại chi nhánh {branchName}
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Mã đơn</TableHead>
                  <TableHead className="w-[120px]">Ngày tạo</TableHead>
                  <TableHead className="min-w-[220px]">Khách hàng</TableHead>
                  <TableHead>Hãng vận chuyển</TableHead>
                  <TableHead>Mã vận đơn</TableHead>
                  <TableHead className="text-right w-[120px]">Số lượng</TableHead>
                  <TableHead className="w-[150px]">Trạng thái giao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inTransitOrders.map(order => (
                  <TableRow key={order.systemId} className="cursor-pointer hover:bg-muted/60" onClick={() => handleRowClick(order)}>
                    <TableCell className="text-body-sm font-medium">{order.id}</TableCell>
                    <TableCell>{order.date ? formatDateForDisplay(order.date) : '-'}</TableCell>
                    <TableCell className="truncate" title={order.customerName}>{order.customerName}</TableCell>
                    <TableCell>{order.carrier || '—'}</TableCell>
                    <TableCell>{order.trackingCode || '—'}</TableCell>
                    <TableCell className="text-right text-body-sm font-medium text-blue-600">{order.quantity}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{order.deliveryStatus || 'Đang giao'}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
