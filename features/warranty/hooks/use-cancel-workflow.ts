import * as React from 'react';
import { toast } from 'sonner';
import type { WarrantyTicket } from '../types';

interface CancelWorkflowState {
  cancelDialogOpen: boolean;
  setCancelDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cancelQueue: WarrantyTicket[];
  setCancelQueue: React.Dispatch<React.SetStateAction<WarrantyTicket[]>>;
  currentCancelTicket: WarrantyTicket | null;
  bulkCancelRef: React.MutableRefObject<boolean>;
  bulkCancelTicketIdsRef: React.MutableRefObject<Set<string>>;
  bulkCancelPendingRef: React.MutableRefObject<number>;
  bulkCancelCompletedRef: React.MutableRefObject<number>;
}

/**
 * Hook quản lý state cho cancel workflow
 */
export function useCancelWorkflowState(): CancelWorkflowState {
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelQueue, setCancelQueue] = React.useState<WarrantyTicket[]>([]);
  const bulkCancelRef = React.useRef(false);
  const bulkCancelTicketIdsRef = React.useRef<Set<string>>(new Set());
  const bulkCancelPendingRef = React.useRef(0);
  const bulkCancelCompletedRef = React.useRef(0);
  
  const currentCancelTicket = cancelQueue[0] ?? null;

  return {
    cancelDialogOpen,
    setCancelDialogOpen,
    cancelQueue,
    setCancelQueue,
    currentCancelTicket,
    bulkCancelRef,
    bulkCancelTicketIdsRef,
    bulkCancelPendingRef,
    bulkCancelCompletedRef,
  };
}

/**
 * Hook tạo cancel workflow handlers
 */
export function useCancelWorkflowHandlers(state: CancelWorkflowState) {
  const {
    setCancelDialogOpen,
    setCancelQueue,
    bulkCancelRef,
    bulkCancelTicketIdsRef,
    bulkCancelPendingRef,
    bulkCancelCompletedRef,
  } = state;

  const startCancelWorkflow = React.useCallback((ticketsToCancel: WarrantyTicket[], options?: { bulk?: boolean }) => {
    if (!ticketsToCancel || ticketsToCancel.length === 0) {
      toast.error('Không có phiếu hợp lệ để hủy');
      return;
    }

    const normalized = ticketsToCancel
      .filter((ticket): ticket is WarrantyTicket => Boolean(ticket))
      .filter((ticket, index, self) => self.findIndex((item) => item.systemId === ticket.systemId) === index)
      .filter((ticket) => ticket.status !== 'CANCELLED' && !ticket.cancelledAt);

    const skipped = ticketsToCancel.length - normalized.length;

    if (normalized.length === 0) {
      toast.info('Các phiếu đã chọn đều đã bị hủy trước đó');
      return;
    }

    if (skipped > 0) {
      toast.info(`${skipped} phiếu đã được bỏ qua vì đã hủy trước đó.`);
    }

    const isBulk = Boolean(options?.bulk);
    if (isBulk && bulkCancelPendingRef.current === 0) {
      bulkCancelCompletedRef.current = 0;
    }

    setCancelQueue(prevQueue => {
      if (prevQueue.length === 0) {
        if (isBulk) {
          normalized.forEach(ticket => bulkCancelTicketIdsRef.current.add(ticket.systemId));
          bulkCancelPendingRef.current += normalized.length;
          bulkCancelRef.current = true;
        }
        return normalized;
      }

      const existingIds = new Set(prevQueue.map(ticket => ticket.systemId));
      const additionalTickets = normalized.filter(ticket => !existingIds.has(ticket.systemId));

      if (additionalTickets.length === 0) {
        toast.info('Các phiếu đã nằm trong hàng chờ hủy');
        return prevQueue;
      }

      if (isBulk) {
        additionalTickets.forEach(ticket => bulkCancelTicketIdsRef.current.add(ticket.systemId));
        bulkCancelPendingRef.current += additionalTickets.length;
        bulkCancelRef.current = true;
      }

      return [...prevQueue, ...additionalTickets];
    });
    setCancelDialogOpen(true);
  }, [setCancelQueue, setCancelDialogOpen, bulkCancelRef, bulkCancelTicketIdsRef, bulkCancelPendingRef, bulkCancelCompletedRef]);

  const handleCancelSuccess = React.useCallback((
    ticket: WarrantyTicket,
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) => {
    let queueBecameEmpty = false;

    setCancelQueue(prevQueue => {
      const [, ...rest] = prevQueue;
      queueBecameEmpty = rest.length === 0;
      return rest;
    });

    if (queueBecameEmpty) {
      setCancelDialogOpen(false);
    }

    if (bulkCancelTicketIdsRef.current.has(ticket.systemId)) {
      bulkCancelTicketIdsRef.current.delete(ticket.systemId);
      bulkCancelPendingRef.current = Math.max(0, bulkCancelPendingRef.current - 1);
      bulkCancelCompletedRef.current += 1;
    }

    if (bulkCancelRef.current && bulkCancelPendingRef.current === 0) {
      const completed = bulkCancelCompletedRef.current || 0;
      toast.success(`Đã hủy ${completed} phiếu bảo hành`);
      setRowSelection({});
      bulkCancelRef.current = false;
      bulkCancelPendingRef.current = 0;
      bulkCancelCompletedRef.current = 0;
      bulkCancelTicketIdsRef.current.clear();
    }

    if (queueBecameEmpty && !bulkCancelRef.current) {
      bulkCancelTicketIdsRef.current.clear();
    }
  }, [setCancelQueue, setCancelDialogOpen, bulkCancelRef, bulkCancelTicketIdsRef, bulkCancelPendingRef, bulkCancelCompletedRef]);

  const handleCancelDialogOpenChange = React.useCallback((open: boolean) => {
    setCancelDialogOpen(open);
    if (!open) {
      setCancelQueue([]);
      bulkCancelTicketIdsRef.current.clear();
      bulkCancelPendingRef.current = 0;
      bulkCancelCompletedRef.current = 0;
      bulkCancelRef.current = false;
    }
  }, [setCancelDialogOpen, setCancelQueue, bulkCancelTicketIdsRef, bulkCancelPendingRef, bulkCancelCompletedRef, bulkCancelRef]);

  return {
    startCancelWorkflow,
    handleCancelSuccess,
    handleCancelDialogOpenChange,
  };
}
