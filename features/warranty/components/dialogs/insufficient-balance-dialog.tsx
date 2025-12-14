import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog.tsx';
import { Alert, AlertDescription } from '../../../../components/ui/alert.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Badge } from '../../../../components/ui/badge.tsx';

interface InsufficientBalanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalAmount: number;
  orderAmount: number;
  shortageAmount: number;
  orderLabel?: string | undefined;
  onSelectMixed: () => void;
  onSelectCashOnly: () => void;
}

export function InsufficientBalanceDialog({
  open,
  onOpenChange,
  totalAmount,
  orderAmount,
  shortageAmount,
  orderLabel,
  onSelectMixed,
  onSelectCashOnly,
}: InsufficientBalanceDialogProps) {
  const formatCurrency = React.useCallback((value: number) => {
    return value.toLocaleString('vi-VN');
  }, []);

  const recommendedOrderAmount = Math.min(orderAmount, totalAmount);
  const recommendedCashAmount = Math.max(shortageAmount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Xử lý khi đơn không đủ để bù trừ</DialogTitle>
          <DialogDescription>
            Đơn {orderLabel ?? 'đã chọn'} không đủ để bù trừ toàn bộ số tiền bảo hành. Chọn phương án phù hợp bên dưới.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertDescription className="space-y-1 text-sm">
              <div>Số tiền cần hoàn: <strong>{formatCurrency(totalAmount)} đ</strong></div>
              <div>Đơn {orderLabel ?? ''} còn lại: <strong>{formatCurrency(orderAmount)} đ</strong></div>
              <div>Thiếu: <strong className="text-red-600">{formatCurrency(shortageAmount)} đ</strong></div>
            </AlertDescription>
          </Alert>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">Bù trừ đơn + Chi tiền mặt</p>
                  <p className="text-sm text-muted-foreground">Trừ tối đa vào đơn, phần thiếu chi trực tiếp.</p>
                </div>
                <Badge variant="secondary">Khuyến nghị</Badge>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                <li>Trừ vào đơn: <strong>{formatCurrency(recommendedOrderAmount)} đ</strong></li>
                <li>Chi trực tiếp: <strong>{formatCurrency(recommendedCashAmount)} đ</strong></li>
              </ul>
              <Button className="mt-4 w-full" onClick={onSelectMixed}>
                Áp dụng phương án này
              </Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">Chỉ chi tiền mặt</p>
                  <p className="text-sm text-muted-foreground">Không trừ vào đơn, chi toàn bộ cho khách.</p>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                <li>Trừ vào đơn: <strong>0 đ</strong></li>
                <li>Chi trực tiếp: <strong>{formatCurrency(totalAmount)} đ</strong></li>
              </ul>
              <Button variant="outline" className="mt-4 w-full" onClick={onSelectCashOnly}>
                Chuyển sang chi tiền trực tiếp
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
