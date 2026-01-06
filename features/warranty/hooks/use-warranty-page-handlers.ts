/**
 * Hook chứa các handlers sử dụng trong WarrantyListPage
 * Tách từ warranty-list-page.tsx để giảm kích thước file
 */
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { WarrantyTicket } from '../types';
import { useWarrantyStore } from '../store';
import { asSystemId } from '@/lib/id-types';
import { ROUTES, generatePath } from '@/lib/router';

type CancelWorkflowOptions = {
  bulk?: boolean;
};

export function useWarrantyListHandlers() {
  const router = useRouter();
  const { data: tickets } = useWarrantyStore();

  const handleEdit = React.useCallback(
    (ticket: WarrantyTicket) => {
      router.push(`/warranty/${ticket.systemId}/edit`);
    },
    [router]
  );

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
    router.push(`/warranty/${systemId}`); // Go to detail page to link order
  }, [router]);

  return {
    handleEdit,
    handleGetLink,
    handleStartProcessing,
    handleMarkProcessed,
    handleMarkReturned,
  };
}

export function useWarrantyCancelWorkflow(
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) {
  const { data: tickets } = useWarrantyStore();
  
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelQueue, setCancelQueue] = React.useState<WarrantyTicket[]>([]);
  const bulkCancelRef = React.useRef(false);
  const bulkCancelTicketIdsRef = React.useRef<Set<string>>(new Set());
  const bulkCancelPendingRef = React.useRef(0);
  const bulkCancelCompletedRef = React.useRef(0);
  const currentCancelTicket = cancelQueue[0] ?? null;

  const startCancelWorkflow = React.useCallback((ticketsToCancel: WarrantyTicket[], options?: CancelWorkflowOptions) => {
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

  return {
    cancelDialogOpen,
    currentCancelTicket,
    startCancelWorkflow,
    handleCancel,
    handleCancelSuccess,
    handleCancelDialogOpenChange,
  };
}

export function useWarrantyBulkActions(
  selectedTickets: WarrantyTicket[],
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  startCancelWorkflow: (tickets: WarrantyTicket[], options?: CancelWorkflowOptions) => void
) {
  const handleBulkGetTrackingLink = React.useCallback(() => {
    if (selectedTickets.length === 0) {
      toast.error('Vui lòng chọn ít nhất một phiếu');
      return;
    }

    try {
      const trackingLinks = selectedTickets.map(ticket => {
        const publicCode = ticket.publicTrackingCode || ticket.id;
        const trackingPath = generatePath(ROUTES.INTERNAL.WARRANTY_TRACKING, { trackingCode: publicCode });
        const trackingUrl = `${window.location.origin}${trackingPath}`;
        return `${publicCode}: ${trackingUrl}`;
      });
      
      navigator.clipboard.writeText(trackingLinks.join('\n'));
      toast.success(`Đã copy ${selectedTickets.length} link tracking vào clipboard`);
    } catch (_error) {
      toast.error('Không thể copy link tracking');
    }
  }, [selectedTickets]);

  const handleBulkCancel = React.useCallback(() => {
    if (selectedTickets.length === 0) {
      toast.error('Vui lòng chọn ít nhất một phiếu');
      return;
    }
    startCancelWorkflow([...selectedTickets], { bulk: true });
  }, [selectedTickets, startCancelWorkflow]);

  return {
    handleBulkGetTrackingLink,
    handleBulkCancel,
  };
}
