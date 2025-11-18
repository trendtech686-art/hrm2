/**
 * Cancel Warranty Dialog
 * Dialog để hủy phiếu bảo hành với lý do
 */

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import type { WarrantyTicket } from '../types.ts';
import { useWarrantyCancellation } from '../hooks/use-warranty-cancellation.ts';

interface CancelWarrantyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: WarrantyTicket | null;
}

export function CancelWarrantyDialog({ open, onOpenChange, ticket }: CancelWarrantyDialogProps) {
  const [cancelReason, setCancelReason] = React.useState('');
  const { cancelWarranty, isCancelling } = useWarrantyCancellation();

  const handleCancel = React.useCallback(async () => {
    const success = await cancelWarranty({ ticket, reason: cancelReason });
    if (success) {
      onOpenChange(false);
      setCancelReason('');
    }
  }, [cancelReason, cancelWarranty, onOpenChange, ticket]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hủy phiếu bảo hành</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy phiếu bảo hành này? Vui lòng nhập lý do hủy.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Nhập lý do hủy phiếu (bắt buộc)..."
          className="min-h-[100px]"
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setCancelReason('')}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            className="bg-destructive hover:bg-destructive/90"
            disabled={isCancelling}
          >
            {isCancelling ? 'Đang hủy...' : 'Hủy phiếu'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
