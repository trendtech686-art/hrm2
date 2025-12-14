import * as React from 'react';
import { Button } from '../../../../components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog.tsx';
import { VirtualizedCombobox, type ComboboxOption } from '../../../../components/ui/virtualized-combobox.tsx';
import type { WarrantyTicket } from '../../types.ts';
import type { OrderSearchResult } from '../../../orders/order-search-api.ts';

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

  const showCurrentMethod = ticket?.status === 'returned' && (currentMethodLabel || ticket);
  const orderCountLabel = totalOrderCount.toLocaleString('vi-VN');
  const isOrderDisabled = returnMethod === 'order' && !selectedOrderValue;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ticket?.status === 'returned' ? 'Cập nhật phương thức trả hàng' : 'Đã trả hàng cho khách'}
          </DialogTitle>
          <DialogDescription>
            {ticket?.status === 'returned'
              ? 'Thay đổi phương thức trả hàng cho khách. Phương thức hiện tại sẽ được cập nhật.'
              : 'Chọn phương thức trả hàng cho khách.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {showCurrentMethod && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-medium text-blue-900 mb-1">
                Phương thức hiện tại:
              </div>
              <div className="text-sm text-blue-700">
                {currentMethodLabel || 'Khách lấy trực tiếp tại cửa hàng'}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium">Phương thức trả hàng *</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={returnMethod === 'direct' ? 'default' : 'outline'}
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => onReturnMethodChange('direct')}
              >
                <div className="text-base font-semibold">Khách lấy trực tiếp</div>
                <div className="text-xs text-muted-foreground">Tại cửa hàng</div>
              </Button>
              <Button
                type="button"
                variant={returnMethod === 'order' ? 'default' : 'outline'}
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => onReturnMethodChange('order')}
              >
                <div className="text-base font-semibold">Giao qua đơn hàng</div>
                <div className="text-xs text-muted-foreground">Link với đơn hàng</div>
              </Button>
            </div>
          </div>

          {returnMethod === 'order' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Chọn đơn hàng</label>
              <div className="text-xs text-muted-foreground mb-2">
                💡 <strong>Tìm kiếm thông minh:</strong> Nhập mã đơn hàng hoặc tên khách để tìm nhanh.
                Hệ thống tự động lọc kết quả từ {orderCountLabel} đơn hàng.
              </div>
              <VirtualizedCombobox
                options={orderSearchResults}
                value={selectedOrderValue}
                onChange={onOrderSelect}
                onSearchChange={onOrderSearchChange}
                placeholder="Tìm kiếm đơn hàng..."
                searchPlaceholder="Nhập mã đơn hoặc tên khách hàng..."
                emptyPlaceholder={
                  orderSearchQuery
                    ? 'Không tìm thấy đơn hàng phù hợp'
                    : 'Nhập từ khóa để tìm kiếm đơn hàng'
                }
                isLoading={isSearchingOrders}
                minSearchLength={0}
                estimatedItemHeight={56}
                maxHeight={400}
              />
              <p className="text-xs text-muted-foreground">
                {isSearchingOrders ? (
                  <span className="text-blue-600">⏳ Đang tìm kiếm...</span>
                ) : orderSearchQuery ? (
                  <span>✓ Tìm thấy <strong>{orderSearchResults.length}</strong> đơn hàng</span>
                ) : (
                  <span>Hiển thị <strong>{orderSearchResults.length}</strong> đơn hàng gần nhất</span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={!returnMethod || isOrderDisabled}>
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
