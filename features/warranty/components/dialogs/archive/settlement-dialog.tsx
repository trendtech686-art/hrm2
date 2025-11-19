/**
 * Settlement Dialog Component
 * 
 * Chọn phương thức xử lý thanh toán cho phiếu bảo hành
 * - Chỉ là UI chọn phương thức, không có logic tính toán
 * - Các phương thức: Trả tiền mặt / Trừ vào đơn / Chuyển khoản / Ghi nợ
 * - Nếu chọn "Trừ vào đơn" thì phải chọn đơn hàng
 */

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select';
import { Button } from '../../../../../components/ui/button';
import { Label } from '../../../../../components/ui/label';
import { Textarea } from '../../../../../components/ui/textarea';
import { toast } from 'sonner';
import { useOrderStore } from '../../../../orders/store';
import { VirtualizedCombobox } from '../../../../../components/ui/virtualized-combobox';
import type { SettlementType } from '../../../types';

interface SettlementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (settlement: {
    settlementType: SettlementType;
    linkedOrderId?: string;
    linkedOrderSystemId?: string;
    notes?: string;
  }) => void;
}

export function SettlementDialog({
  open,
  onOpenChange,
  onSubmit,
}: SettlementDialogProps) {
  const [settlementType, setSettlementType] = React.useState<SettlementType | ''>('');
  const [selectedOrder, setSelectedOrder] = React.useState<{ value: string; label: string } | null>(null);
  const [notes, setNotes] = React.useState('');
  
  const { data: orders } = useOrderStore();

  // Reset when dialog opens
  React.useEffect(() => {
    if (open) {
      setSettlementType('');
      setSelectedOrder(null);
      setNotes('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (settlementType === '') {
      toast.error('Vui lòng chọn phương thức xử lý');
      return;
    }

    // Nếu chọn "Trừ vào đơn" thì phải chọn đơn hàng
    if (settlementType === 'order_deduction' && !selectedOrder) {
      toast.error('Vui lòng chọn đơn hàng để trừ tiền');
      return;
    }

    const order = orders.find(o => o.systemId === selectedOrder?.value);

    onSubmit({
      settlementType: settlementType as SettlementType,
      linkedOrderId: order?.id,
      linkedOrderSystemId: selectedOrder?.value,
      notes: notes || undefined,
    });
    onOpenChange(false);
  };

  // Filter orders for combobox (chỉ lấy đơn chưa thanh toán hoặc thanh toán 1 phần, chưa xuất kho)
  const availableOrders = React.useMemo(() => {
    return orders
      .filter(o => {
        // ✅ Dùng includes thay vì !== để tránh lỗi dấu cách
        const stockOk = o.stockOutStatus?.includes('Chưa xuất kho') || false;
        const paymentOk = o.paymentStatus?.includes('Chưa thanh toán') || 
                          o.paymentStatus?.includes('Thanh toán một phần') || 
                          o.paymentStatus?.includes('Thanh toán 1 phần') || false;
        const amountOk = (o.grandTotal || 0) > 0; // ✅ Sửa từ totalAmount thành grandTotal
        
        return stockOk && paymentOk && amountOk;
      })
      .map(o => ({
        value: o.systemId,
        label: `${o.id} - ${o.customerName} (${(o.grandTotal || 0).toLocaleString('vi-VN')} đ)`,
      }));
  }, [orders]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chọn phương thức xử lý</DialogTitle>
          <DialogDescription>
            Chọn cách xử lý thanh toán cho phiếu bảo hành này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Settlement Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="settlement-type">Phương thức *</Label>
            <Select value={settlementType} onValueChange={(value) => setSettlementType(value as SettlementType)}>
              <SelectTrigger id="settlement-type">
                <SelectValue placeholder="-- Chọn phương thức --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">💵 Trả tiền mặt</SelectItem>
                <SelectItem value="order_deduction">💳 Trừ vào đơn</SelectItem>
                <SelectItem value="transfer">🏦 Chuyển khoản</SelectItem>
                <SelectItem value="debt">📝 Ghi nợ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Selection - Chỉ hiện khi chọn "Trừ vào đơn" */}
          {settlementType === 'order_deduction' && (
            <div className="space-y-2">
              <Label htmlFor="order-select">Chọn đơn hàng *</Label>
              <VirtualizedCombobox
                options={availableOrders}
                value={selectedOrder}
                onChange={setSelectedOrder}
                placeholder="Tìm đơn hàng..."
                emptyPlaceholder="Không tìm thấy đơn hàng"
              />
              <p className="text-xs text-muted-foreground">
                💡 Chỉ hiển thị đơn chưa thanh toán (hoặc thanh toán 1 phần) và chưa xuất kho
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Thêm ghi chú..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={settlementType === '' || (settlementType === 'order_deduction' && !selectedOrder)}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

