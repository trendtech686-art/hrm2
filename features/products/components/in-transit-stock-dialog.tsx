import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { formatDateForDisplay } from '@/lib/date-utils';
import { Badge } from '../../../components/ui/badge';
import { useProductStockTransfers } from '../hooks/use-product-related-data';
import type { SystemId } from '../../../lib/id-types';

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
  // ✅ OPTIMIZED: Server-side filtered by product instead of loading ALL
  const { data: allStockTransfers = [] } = useProductStockTransfers(productSystemId);
  const router = useRouter();

  // ✅ Find stock transfers where this branch is receiving (inTransit means goods coming TO this branch)
  const inTransitTransfers = React.useMemo(() => {
    return allStockTransfers
      .filter(transfer => {
        // Must be transferring status and destination is this branch
        if (transfer.status !== 'transferring') return false;
        if (transfer.toBranchSystemId !== branchSystemId) return false;

        // Check if transfer contains this product
        return transfer.items?.some(item => 
          (item.productId as string) === (productSystemId as string)
        );
      })
      .map(transfer => {
        const matchingItems = transfer.items?.filter(item =>
          (item.productId as string) === (productSystemId as string)
        ) || [];

        const quantity = matchingItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

        return {
          id: transfer.id,
          systemId: transfer.systemId,
          date: transfer.transferredDate || transfer.createdAt,
          fromBranchName: transfer.fromBranchName,
          toBranchName: transfer.toBranchName,
          quantity,
          status: transfer.status,
          transferredByName: transfer.transferredByName,
        };
      })
      .filter(entry => entry.quantity > 0)
      .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
  }, [allStockTransfers, branchSystemId, productSystemId]);

  const totalInTransit = inTransitTransfers.reduce((sum, t) => sum + t.quantity, 0);

  const handleRowClick = (transfer: typeof inTransitTransfers[number]) => {
    router.push(`/stock-transfers/${transfer.systemId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Hàng đang về: {productName}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Chi nhánh: {branchName} • Tổng đang về: <span className="text-sm font-medium text-orange-600">{totalInTransit}</span> sản phẩm
          </div>
        </DialogHeader>

        {inTransitTransfers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Không có phiếu chuyển kho nào đang vận chuyển sản phẩm này đến chi nhánh {branchName}
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-30">Mã phiếu</TableHead>
                  <TableHead className="w-30">Ngày chuyển</TableHead>
                  <TableHead className="min-w-45">Từ chi nhánh</TableHead>
                  <TableHead className="min-w-45">Đến chi nhánh</TableHead>
                  <TableHead>Người chuyển</TableHead>
                  <TableHead className="text-right w-30">Số lượng</TableHead>
                  <TableHead className="w-30">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inTransitTransfers.map(transfer => (
                  <TableRow key={transfer.systemId} className="cursor-pointer hover:bg-muted/60" onClick={() => handleRowClick(transfer)}>
                    <TableCell className="text-sm font-medium text-primary">{transfer.id}</TableCell>
                    <TableCell>{transfer.date ? formatDateForDisplay(transfer.date) : '-'}</TableCell>
                    <TableCell>{transfer.fromBranchName || '—'}</TableCell>
                    <TableCell>{transfer.toBranchName || '—'}</TableCell>
                    <TableCell>{transfer.transferredByName || '—'}</TableCell>
                    <TableCell className="text-right text-sm font-medium text-orange-600">{transfer.quantity}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Đang vận chuyển</Badge>
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
