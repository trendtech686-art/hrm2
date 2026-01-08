'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { asSystemId } from '@/lib/id-types';
import type { WarrantyTicket } from '../types';
import { useWarrantyStore } from '../store';
import { ROUTES, generatePath } from '@/lib/router';

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

export function useWarrantyHandlers(
  tickets: WarrantyTicket[],
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) {
  const router = useRouter();
  
  // Cancel workflow state
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelQueue, setCancelQueue] = React.useState<WarrantyTicket[]>([]);
  const bulkCancelRef = React.useRef(false);
  const bulkCancelTicketIdsRef = React.useRef<Set<string>>(new Set());
  const bulkCancelPendingRef = React.useRef(0);
  const bulkCancelCompletedRef = React.useRef(0);
  const currentCancelTicket = cancelQueue[0] ?? null;

  // Edit handler
  const handleEdit = React.useCallback(
    (ticket: WarrantyTicket) => {
      router.push(`/warranty/${ticket.systemId}/edit`);
    },
    [router]
  );

  // Cancel workflow
  const startCancelWorkflow = React.useCallback((ticketsToCancel: WarrantyTicket[], options?: { bulk?: boolean }) => {
    if (!ticketsToCancel || ticketsToCancel.length === 0) {
      toast.error('Không có phiếu hợp lệ để hủy');
      return;
    }

    const normalized = ticketsToCancel
      .filter((ticket): ticket is WarrantyTicket => Boolean(ticket))
      .filter((ticket, index, self) => self.findIndex((item) => item.systemId === ticket.systemId) === index)
      .filter((ticket) => ticket.status !== 'cancelled' && !ticket.cancelledAt);

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
  }, []);

  // Context menu handlers
  const handleGetLink = React.useCallback((systemId: string) => {
    const ticket = tickets.find(t => t.systemId === asSystemId(systemId));
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }
    const trackingPath = generatePath(ROUTES.INTERNAL.WARRANTY_TRACKING, {
      trackingCode: ticket.publicTrackingCode || ticket.id,
    });
    const trackingUrl = `${window.location.origin}${trackingPath}`;
    navigator.clipboard.writeText(trackingUrl);
    toast.success('Đã copy link tracking vào clipboard');
  }, [tickets]);

  const handleStartProcessing = React.useCallback((systemId: string) => {
    const normalizedId = asSystemId(systemId);
    const ticket = tickets.find(t => t.systemId === normalizedId);
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }

    useWarrantyStore.getState().updateStatus(normalizedId, 'pending', 'Bắt đầu xử lý từ danh sách');
    toast.success('Đã chuyển sang trạng thái Chưa xử lý');
  }, [tickets]);

  const handleMarkProcessed = React.useCallback((systemId: string) => {
    const normalizedId = asSystemId(systemId);
    const ticket = tickets.find(t => t.systemId === normalizedId);
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }

    useWarrantyStore.getState().updateStatus(normalizedId, 'processed', 'Hoàn thành xử lý từ danh sách');
    toast.success('Đã hoàn thành xử lý');
  }, [tickets]);

  const handleMarkReturned = React.useCallback((systemId: string) => {
    router.push(`/warranty/${systemId}`);
  }, [router]);

  const handleCancel = React.useCallback((systemId: string) => {
    const normalizedId = asSystemId(systemId);
    const ticket = tickets.find((t) => t.systemId === normalizedId);
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }
    startCancelWorkflow([ticket]);
  }, [tickets, startCancelWorkflow]);

  const handleCancelSuccess = React.useCallback((ticket: WarrantyTicket) => {
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
  }, [setRowSelection]);

  const handleCancelDialogOpenChange = React.useCallback((open: boolean) => {
    setCancelDialogOpen(open);
    if (!open) {
      setCancelQueue([]);
      bulkCancelTicketIdsRef.current.clear();
      bulkCancelPendingRef.current = 0;
      bulkCancelCompletedRef.current = 0;
      bulkCancelRef.current = false;
    }
  }, []);

  const cancelWorkflowState: CancelWorkflowState = {
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

  return {
    // Edit handler
    handleEdit,
    // Cancel workflow
    startCancelWorkflow,
    cancelWorkflowState,
    handleCancel,
    handleCancelSuccess,
    handleCancelDialogOpenChange,
    // Context menu handlers
    handleGetLink,
    handleStartProcessing,
    handleMarkProcessed,
    handleMarkReturned,
  };
}

export type { CancelWorkflowState };
