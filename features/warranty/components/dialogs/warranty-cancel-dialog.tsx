/**
 * Cancel Warranty Dialog
 * Dialog để hủy phiếu bảo hành với lý do
 * 
 * ✅ Uses Server Action for atomic operations
 */

import * as React from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog';
import { Textarea } from '../../../../components/ui/textarea';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Label } from '../../../../components/ui/label';
import { Loader2 } from 'lucide-react';
import type { WarrantyTicket } from '../../types';
import { cancelWarrantyAction } from '../../../../app/actions/warranty';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import { logError } from '@/lib/logger'

interface WarrantyCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: WarrantyTicket | null;
  onCancelled?: (ticket: WarrantyTicket) => void;
}

export function WarrantyCancelDialog({ open, onOpenChange, ticket, onCancelled }: WarrantyCancelDialogProps) {
  const [cancelReason, setCancelReason] = React.useState('');
  const [cancelVouchers, setCancelVouchers] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const handleCancel = React.useCallback(async () => {
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }

    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy phiếu');
      return;
    }

    setIsLoading(true);

    try {
      const result = await cancelWarrantyAction({
        systemId: ticket.systemId,
        reason: cancelReason.trim(),
        cancelVouchers,
      });

      if (!result.success) {
        toast.error(result.error || 'Không thể hủy phiếu bảo hành');
        return;
      }

      // Invalidate queries to refresh data
      invalidateRelated(queryClient, 'warranties');

      // Show success message with details
      const data = result.data as { cancelledPayments?: number; cancelledReceipts?: number };
      if (data?.cancelledPayments || data?.cancelledReceipts) {
        toast.success('Đã hủy phiếu bảo hành', {
          description: `Đã hủy ${data.cancelledPayments || 0} phiếu chi và ${data.cancelledReceipts || 0} phiếu thu`,
        });
      } else {
        toast.success('Đã hủy phiếu bảo hành');
      }

      // Callback with updated ticket
      if (onCancelled && result.data) {
        onCancelled(result.data as unknown as WarrantyTicket);
      }

      // Close dialog and reset
      onOpenChange(false);
      setCancelReason('');
    } catch (error) {
      logError('Failed to cancel warranty', error);
      toast.error('Không thể hủy phiếu bảo hành');
    } finally {
      setIsLoading(false);
    }
  }, [ticket, cancelReason, cancelVouchers, queryClient, onCancelled, onOpenChange]);

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setCancelReason('');
      setCancelVouchers(true);
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hủy phiếu bảo hành</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy phiếu bảo hành <strong>{ticket?.id}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="cancel-reason">Lý do hủy <span className="text-destructive">*</span></Label>
            <Textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy phiếu (bắt buộc)..."
              className="min-h-25"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cancel-vouchers"
              checked={cancelVouchers}
              onCheckedChange={(checked) => setCancelVouchers(checked === true)}
              disabled={isLoading}
            />
            <Label htmlFor="cancel-vouchers" className="text-sm font-normal cursor-pointer">
              Hủy các phiếu thu/chi liên quan
            </Label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Đóng</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            className="bg-destructive hover:bg-destructive/90"
            disabled={isLoading || !cancelReason.trim()}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hủy phiếu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
