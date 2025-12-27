import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { formatDateForDisplay } from '@/lib/date-utils';
import { Badge } from '../../../components/ui/badge';
import { useOrderStore } from '../../orders/store';
import { useWarrantyStore } from '../../warranty/store';
import { useProductStore } from '../store';
import { SystemId } from '../../../lib/id-types';

interface CommittedStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productSystemId: SystemId;
  branchSystemId: string;
  branchName: string;
  productName: string;
}

export function CommittedStockDialog({
  open,
  onOpenChange,
  productSystemId,
  branchSystemId,
  branchName,
  productName,
}: CommittedStockDialogProps) {
  const { data: allOrders } = useOrderStore();
  const { data: allWarranties } = useWarrantyStore();
  const { findById: findProductById } = useProductStore();
  const router = useRouter();

  // Get product to find SKU (business ID)
  const product = React.useMemo(() => findProductById(productSystemId), [productSystemId, findProductById]);

  // Find all orders with committed stock for this product and branch
  const committedOrders = React.useMemo(() => {
    const productSku = product?.id;
    return allOrders
      .filter(order => {
        // Check branch first
        if (order.branchSystemId !== branchSystemId) return false;

        // Check if order contains this product
        const hasProduct = order.lineItems?.some(item => 
          item.productSystemId === productSystemId ||
          (productSku && item.productId === productSku)
        );
        if (!hasProduct) return false;

        // Order must be in committed state (not yet dispatched/cancelled/completed)
        return (
          order.status !== 'Đã hủy' && 
          order.status !== 'Hoàn thành' &&
          order.stockOutStatus !== 'Xuất kho toàn bộ'
        );
      })
      .map(order => {
        const lineItem = order.lineItems.find(item => 
          item.productSystemId === productSystemId ||
          (productSku && item.productId === productSku)
        );
        if (!lineItem) {
          return null;
        }
        return {
          type: 'Đơn hàng' as const,
          id: order.id,
          systemId: order.systemId,
          date: order.orderDate,
          customerName: order.customerName,
          quantity: lineItem.quantity,
          status: order.status,
          deliveryStatus: order.deliveryStatus,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [allOrders, productSystemId, branchSystemId, product]);

  // Find all warranties with committed stock for this product and branch
  const committedWarranties = React.useMemo(() => {
    if (!product) return [];
    
    return allWarranties
      .filter(warranty => {
        // Skip if missing required fields (incomplete sample data)
        if (!warranty.products || !Array.isArray(warranty.products)) return false;
        if (!warranty.branchSystemId || !warranty.status) return false;

        // Warranty must be in pending/processed state (not completed)
        if (warranty.status === 'completed') return false;
        if (warranty.branchSystemId !== branchSystemId) return false;

        // Check if warranty contains this product (products with resolution='replace')
        // Match by SKU (business ID) since warranty stores sku, not systemId
        return warranty.products.some(item => 
          item.sku === product.id && 
          item.resolution === 'replace'
        );
      })
      .map(warranty => {
        const replacementItem = warranty.products.find(item => 
          item.sku === product.id && 
          item.resolution === 'replace'
        )!;
        return {
          type: 'Bảo hành' as const,
          id: warranty.id,
          systemId: warranty.systemId,
          date: warranty.createdAt,
          customerName: warranty.customerName,
          quantity: replacementItem.quantity || 1,
          status: warranty.status,
        };
      });
  }, [allWarranties, product, branchSystemId]);

  const allCommittedItems = [...committedOrders, ...committedWarranties].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalCommitted = allCommittedItems.reduce((sum, item) => sum + item.quantity, 0);

  const getStatusBadgeVariant = (type: 'Đơn hàng' | 'Bảo hành', status: string) => {
    if (type === 'Đơn hàng') {
      if (status === 'Hoàn thành') return 'success';
      if (status === 'Đã hủy') return 'destructive';
      return 'warning';
    } else {
      if (status === 'completed') return 'success';
      if (status === 'cancelled') return 'destructive';
      return 'warning';
    }
  };

  const getStatusLabel = (type: 'Đơn hàng' | 'Bảo hành', status: string) => {
    if (type === 'Đơn hàng') {
      return status;
    } else {
      switch (status) {
        case 'pending': return 'Chờ xử lý';
        case 'processing': return 'Đang xử lý';
        case 'completed': return 'Hoàn thành';
        case 'cancelled': return 'Đã hủy';
        default: return status;
      }
    }
  };

  const handleRowClick = (item: typeof allCommittedItems[0]) => {
    if (item.type === 'Đơn hàng') {
      router.push(`/orders/${item.systemId}`);
    } else {
      router.push(`/warranty/${item.systemId}`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>
            Phiếu đang giữ: {productName}
          </DialogTitle>
          <div className="text-body-sm text-muted-foreground">
            Chi nhánh: {branchName} • Tổng đang giữ: <span className="text-body-sm font-medium text-orange-600">{totalCommitted}</span> sản phẩm
          </div>
        </DialogHeader>

        {allCommittedItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Không có phiếu nào đang giữ sản phẩm này tại chi nhánh {branchName}
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Loại</TableHead>
                  <TableHead className="w-[120px]">Mã phiếu</TableHead>
                  <TableHead className="w-[120px]">Ngày tạo</TableHead>
                  <TableHead className="min-w-[250px]">Khách hàng</TableHead>
                  <TableHead className="text-right w-[100px]">Số lượng</TableHead>
                  <TableHead className="w-[150px]">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allCommittedItems.map((item) => (
                  <TableRow 
                    key={`${item.type}-${item.systemId}`}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(item)}
                  >
                    <TableCell>
                      <Badge variant={item.type === 'Đơn hàng' ? 'default' : 'secondary'}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-body-sm font-medium">{item.id}</TableCell>
                    <TableCell>{formatDateForDisplay(item.date)}</TableCell>
                    <TableCell className="truncate max-w-[250px]" title={item.customerName}>{item.customerName}</TableCell>
                    <TableCell className="text-right text-body-sm font-medium text-orange-600">{item.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.type, item.status) as any}>
                        {getStatusLabel(item.type, item.status)}
                      </Badge>
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
