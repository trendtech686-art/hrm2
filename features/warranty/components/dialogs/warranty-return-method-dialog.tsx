import * as React from 'react';
import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { Store, Truck } from 'lucide-react';
import { VirtualizedCombobox, type ComboboxOption } from '../../../../components/ui/virtualized-combobox';
import type { WarrantyTicket } from '../../types';
import type { OrderSearchResult } from '../../../orders/order-search-api';

type ReturnMethod = 'direct' | 'order' | null;

interface WarrantyReturnMethodDialogProps {
  open: boolean;
  ticket: WarrantyTicket | null;
  currentMethodLabel?: string | null | undefined;
  returnMethod: ReturnMethod;
  onReturnMethodChange: (method: ReturnMethod) => void;
  selectedOrderValue: ComboboxOption | null;
  onOrderSelect: (option: ComboboxOption | null) => void;
  orderSearchResults: OrderSearchResult[];
  orderSearchQuery: string;
  onOrderSearchChange: (query: string) => void;
  isSearchingOrders: boolean;
  totalOrderCount: number;
  onConfirmDirect: () => void;
  onConfirmWithOrder: () => void;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
  hasMoreOrders?: boolean;
  isLoadingMoreOrders?: boolean;
  onLoadMoreOrders?: () => void;
}

export function WarrantyReturnMethodDialog({
  open,
  ticket,
  currentMethodLabel,
  returnMethod,
  onReturnMethodChange,
  selectedOrderValue,
  onOrderSelect,
  orderSearchResults,
  orderSearchQuery,
  onOrderSearchChange,
  isSearchingOrders,
  totalOrderCount,
  onConfirmDirect,
  onConfirmWithOrder,
  onOpenChange,
  onReset,
  hasMoreOrders = false,
  isLoadingMoreOrders = false,
  onLoadMoreOrders,
}: WarrantyReturnMethodDialogProps) {
  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      onReset();
    }
    onOpenChange(nextOpen);
  }, [onOpenChange, onReset]);

  const handleConfirm = React.useCallback(() => {
    if (returnMethod === 'direct') {
      onConfirmDirect();
    } else if (returnMethod === 'order') {
      onConfirmWithOrder();
    }
  }, [onConfirmDirect, onConfirmWithOrder, returnMethod]);

  const handleCancel = React.useCallback(() => {
    onReset();
    onOpenChange(false);
  }, [onOpenChange, onReset]);

  const showCurrentMethod = ticket?.status === 'RETURNED' && (currentMethodLabel || ticket);
  const isOrderDisabled = returnMethod === 'order' && !selectedOrderValue;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {ticket?.status === 'RETURNED' ? 'Cập nhật phương thức trả hàng' : 'Trả hàng cho khách'}
          </DialogTitle>
          <DialogDescription>
            {ticket?.status === 'RETURNED'
              ? 'Thay đổi phương thức trả hàng cho khách.'
              : 'Chọn phương thức trả hàng cho khách.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {showCurrentMethod && (
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Hiện tại:</span>
              <Badge variant="secondary">
                {currentMethodLabel || 'Khách lấy trực tiếp tại cửa hàng'}
              </Badge>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-medium">Phương thức trả hàng</Label>
            <RadioGroup
              value={returnMethod ?? ''}
              onValueChange={(v) => onReturnMethodChange(v as ReturnMethod)}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="method-direct"
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:bg-accent ${
                  returnMethod === 'direct' ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem value="direct" id="method-direct" className="sr-only" />
                <Store className={`h-6 w-6 ${returnMethod === 'direct' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-center">
                  <div className="text-sm font-medium">Lấy trực tiếp</div>
                  <div className="text-xs text-muted-foreground">Tại cửa hàng</div>
                </div>
              </Label>
              <Label
                htmlFor="method-order"
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:bg-accent ${
                  returnMethod === 'order' ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem value="order" id="method-order" className="sr-only" />
                <Truck className={`h-6 w-6 ${returnMethod === 'order' ? 'text-primary' : 'text-muted-foreground'}`} />
                <div className="text-center">
                  <div className="text-sm font-medium">Giao qua đơn hàng</div>
                  <div className="text-xs text-muted-foreground">Link với đơn hàng</div>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {returnMethod === 'order' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Chọn đơn hàng</Label>
              <VirtualizedCombobox
                options={orderSearchResults}
                value={selectedOrderValue}
                onChange={onOrderSelect}
                onSearchChange={onOrderSearchChange}
                placeholder="Tìm kiếm đơn hàng..."
                searchPlaceholder="Nhập mã đơn hoặc tên khách hàng..."
                emptyPlaceholder={
                  isSearchingOrders
                    ? 'Đang tải đơn hàng...'
                    : 'Không tìm thấy đơn hàng phù hợp'
                }
                isLoading={isSearchingOrders}
                minSearchLength={0}
                estimatedItemHeight={56}
                maxHeight={300}
                onLoadMore={onLoadMoreOrders}
                hasMore={hasMoreOrders}
                isLoadingMore={isLoadingMoreOrders}
              />
              <p className="text-xs text-muted-foreground">
                {isSearchingOrders ? (
                  'Đang tìm kiếm...'
                ) : orderSearchQuery ? (
                  `Tìm thấy ${totalOrderCount} đơn hàng${totalOrderCount > orderSearchResults.length ? ` (đang hiển thị ${orderSearchResults.length})` : ''}`
                ) : totalOrderCount > 0 ? (
                  `${orderSearchResults.length}/${totalOrderCount} đơn hàng gần nhất`
                ) : null}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={!returnMethod || isOrderDisabled}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
