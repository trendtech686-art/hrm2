/**
 * WarrantyOrderSelectionDialog
 *
 * Dialog cho phép chọn hoặc thay đổi đơn hàng liên kết với phiếu bảo hành.
 * - Hiện đơn hàng hiện tại (nếu có)
 * - Tìm kiếm và chọn đơn hàng mới
 * - Xóa liên kết đơn hàng
 *
 * Sử dụng shared hook useOrderSelection để thống nhất nguồn dữ liệu với
 * WarrantyReturnMethodDialog (Trả hàng cho khách).
 */

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { VirtualizedCombobox } from '../../../../components/ui/virtualized-combobox';
import { Unlink, Link2 } from 'lucide-react';
import type { WarrantyTicket } from '../../types';
import { useOrderSelection } from '../../hooks/use-order-selection';
import { Loader2 } from 'lucide-react';

interface WarrantyOrderSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: WarrantyTicket | null;
  currentOrderId?: string | null | undefined;
  onOrderLinked: (orderSystemId: string | null) => void;
}

export function WarrantyOrderSelectionDialog({
  open,
  onOpenChange,
  ticket,
  currentOrderId,
  onOrderLinked,
}: WarrantyOrderSelectionDialogProps) {
  const branchSystemId = ticket?.branchSystemId;
  const customerSystemId = ticket?.customerSystemId;
  const [isSaving, setIsSaving] = React.useState(false);

  // Use shared hook for order selection
  const {
    selectedOrder,
    searchQuery,
    searchResults,
    isSearching,
    totalCount,
    hasMore,
    isLoadingMore,
    setSelectedOrder,
    setSearchQuery,
    loadMore,
    reset,
    triggerSearch,
    getSelectedOrderId,
  } = useOrderSelection({
    branchSystemId,
    customerSystemId,
    initialSelectedOrderId: currentOrderId,
    autoSearch: false, // We trigger search manually when dialog opens
  });

  // Track if we've triggered initial search for current open state
  const hasTriggeredSearchRef = React.useRef(false);

  // Trigger initial search when dialog opens
  React.useEffect(() => {
    if (open && !hasTriggeredSearchRef.current) {
      hasTriggeredSearchRef.current = true;
      triggerSearch();
    }
    if (!open) {
      hasTriggeredSearchRef.current = false;
      reset();
    }
  }, [open, triggerSearch, reset]);

  const handleConfirm = React.useCallback(async () => {
    setIsSaving(true);
    try {
      const newOrderSystemId = getSelectedOrderId();
      onOrderLinked(newOrderSystemId);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [getSelectedOrderId, onOrderLinked, onOpenChange]);

  const handleRemoveLink = React.useCallback(() => {
    setSelectedOrder(null);
  }, [setSelectedOrder]);

  const isChanged = getSelectedOrderId() !== (currentOrderId ?? null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Liên kết đơn hàng
          </DialogTitle>
          <DialogDescription>
            Liên kết phiếu bảo hành với đơn hàng để hỗ trợ hoàn tiền bù trừ.
            {ticket?.customerName && ` Khách hàng: ${ticket.customerName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-2">
          {/* Current linked order */}
          {currentOrderId && (
            <div className="bg-muted/50 rounded-lg p-3 border">
              <Label className="text-xs text-muted-foreground">Đơn hàng hiện tại</Label>
              <div className="flex items-center justify-between mt-1">
                <Badge variant="outline" className="font-mono text-sm">
                  {currentOrderId}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleRemoveLink}
                >
                  <Unlink className="h-4 w-4 mr-1" />
                  Xóa liên kết
                </Button>
              </div>
            </div>
          )}

          {/* Order search - using shared order selection */}
          <div className="space-y-2">
            <Label>Tìm kiếm đơn hàng</Label>
            <VirtualizedCombobox
              value={selectedOrder}
              onChange={setSelectedOrder}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Tìm theo mã đơn, tên khách hàng..."
              emptyPlaceholder="Không tìm thấy đơn hàng"
              options={searchResults.map((order) => ({
                value: order.value,
                label: order.label,
              }))}
              isLoading={isSearching}
              hasMore={hasMore}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
            />
            {totalCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {searchQuery ? `Tìm thấy ${totalCount} đơn hàng` : `${searchResults.length}/${totalCount} đơn hàng gần nhất`}
              </p>
            )}
          </div>

          {/* Selected order preview */}
          {selectedOrder && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <Label className="text-xs text-green-700">Đơn hàng đã chọn</Label>
              <p className="font-mono font-medium text-green-800 mt-1">
                {selectedOrder.label}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSaving || !isChanged}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              'Xác nhận'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
