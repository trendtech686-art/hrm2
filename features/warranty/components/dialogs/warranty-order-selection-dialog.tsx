/**
 * WarrantyOrderSelectionDialog
 *
 * Dialog cho phép chọn hoặc thay đổi đơn hàng liên kết với phiếu bảo hành.
 * - Hiện đơn hàng hiện tại (nếu có)
 * - Tìm kiếm và chọn đơn hàng mới
 * - Xóa liên kết đơn hàng
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
import { VirtualizedCombobox, type ComboboxOption } from '../../../../components/ui/virtualized-combobox';
import { Unlink, Link2 } from 'lucide-react';
import type { WarrantyTicket } from '../../types';
import { searchOrdersPaginated, type OrderSearchResult } from '../../../orders/order-search-api';
import { logError } from '@/lib/logger';
import { Loader2 } from 'lucide-react';

interface WarrantyOrderSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: WarrantyTicket | null;
  currentOrderId?: string | null | undefined;
  onOrderLinked: (orderSystemId: string | null) => void;
}

const ORDER_PAGE_SIZE = 30;

export function WarrantyOrderSelectionDialog({
  open,
  onOpenChange,
  ticket,
  currentOrderId,
  onOrderLinked,
}: WarrantyOrderSelectionDialogProps) {
  const [selectedOrderValue, setSelectedOrderValue] = React.useState<ComboboxOption | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = React.useState('');
  const [orderSearchResults, setOrderSearchResults] = React.useState<OrderSearchResult[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = React.useState(false);
  const [_totalOrderCount, setTotalOrderCount] = React.useState(0);
  const [hasMoreOrders, setHasMoreOrders] = React.useState(false);
  const [isLoadingMoreOrders, setIsLoadingMoreOrders] = React.useState(false);
  const [orderPage, setOrderPage] = React.useState(1);
  const [isSaving, setIsSaving] = React.useState(false);

  // Initialize selected order when dialog opens
  React.useEffect(() => {
    if (open && currentOrderId) {
      setSelectedOrderValue({
        value: currentOrderId,
        label: currentOrderId,
      });
    } else {
      setSelectedOrderValue(null);
    }
    setOrderSearchQuery('');
    setOrderPage(1);
    setOrderSearchResults([]);
    setTotalOrderCount(0);
    setHasMoreOrders(false);
  }, [open, currentOrderId]);

  const searchOrders = React.useCallback(async (query: string, page: number) => {
    if (page === 1) {
      setIsSearchingOrders(true);
    } else {
      setIsLoadingMoreOrders(true);
    }
    try {
      const { results, total, hasMore } = await searchOrdersPaginated({
        query,
        limit: ORDER_PAGE_SIZE,
        page,
        branchSystemId: ticket?.branchSystemId,
        customerSystemId: ticket?.customerSystemId || undefined,
      });
      setOrderSearchResults(prev => page === 1 ? results : [...prev, ...results]);
      setTotalOrderCount(total);
      setHasMoreOrders(hasMore);
    } catch (error) {
      logError('Failed to search orders for warranty linking', error);
    } finally {
      setIsSearchingOrders(false);
      setIsLoadingMoreOrders(false);
    }
  }, [ticket?.branchSystemId, ticket?.customerSystemId]);

  const handleSearchChange = React.useCallback((query: string) => {
    setOrderSearchQuery(query);
    setOrderPage(1);
    if (query.length >= 0) {
      searchOrders(query, 1);
    }
  }, [searchOrders]);

  const handleLoadMore = React.useCallback(() => {
    if (!isLoadingMoreOrders && hasMoreOrders) {
      const nextPage = orderPage + 1;
      setOrderPage(nextPage);
      searchOrders(orderSearchQuery, nextPage);
    }
  }, [isLoadingMoreOrders, hasMoreOrders, orderPage, orderSearchQuery, searchOrders]);

  const handleOrderSelect = React.useCallback((option: ComboboxOption | null) => {
    setSelectedOrderValue(option);
  }, []);

  const handleConfirm = React.useCallback(async () => {
    setIsSaving(true);
    try {
      const newOrderSystemId = selectedOrderValue?.value ?? null;
      onOrderLinked(newOrderSystemId);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [selectedOrderValue, onOrderLinked, onOpenChange]);

  const handleRemoveLink = React.useCallback(() => {
    setSelectedOrderValue(null);
  }, []);

  const isChanged = (selectedOrderValue?.value ?? null) !== (currentOrderId ?? null);

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

          {/* Order search */}
          <div className="space-y-2">
            <Label>Tìm kiếm đơn hàng</Label>
            <VirtualizedCombobox
              value={selectedOrderValue}
              onChange={handleOrderSelect}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Tìm theo mã đơn, tên khách hàng..."
              emptyPlaceholder="Không tìm thấy đơn hàng"
              options={orderSearchResults.map(order => ({
                value: order.value,
                label: order.label,
              }))}
              isLoading={isSearchingOrders}
              hasMore={hasMoreOrders}
              onLoadMore={handleLoadMore}
              isLoadingMore={isLoadingMoreOrders}
            />
          </div>

          {/* Selected order preview */}
          {selectedOrderValue && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <Label className="text-xs text-green-700">Đơn hàng đã chọn</Label>
              <p className="font-mono font-medium text-green-800 mt-1">
                {selectedOrderValue.label}
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
