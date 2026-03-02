import * as React from 'react';
import { toast } from 'sonner';
import type { WarrantyTicket } from '../types';
import { updateWarrantyAction } from '@/app/actions/warranty';
import { asSystemId } from '@/lib/id-types';
import { ROUTES, generatePath } from '@/lib/router';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Hook quản lý các handler cho warranty list page
 */
export function useWarrantyListHandlers(
  router: AppRouterInstance,
  tickets: WarrantyTicket[],
  startCancelWorkflow: (tickets: WarrantyTicket[], options?: { bulk?: boolean }) => void
) {
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

  const handleStartProcessing = React.useCallback(async (systemId: string) => {
    const normalizedId = asSystemId(systemId);
    const ticket = tickets.find(t => t.systemId === normalizedId);
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }

    const result = await updateWarrantyAction({ systemId: normalizedId, status: 'PROCESSING' });
    if (!result.success) {
      toast.error(result.error || 'Không thể cập nhật trạng thái');
      return;
    }
    toast.success('Đã chuyển sang trạng thái Đang xử lý');
  }, [tickets]);

  const handleMarkProcessed = React.useCallback(async (systemId: string) => {
    const normalizedId = asSystemId(systemId);
    const ticket = tickets.find(t => t.systemId === normalizedId);
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }

    const result = await updateWarrantyAction({ systemId: normalizedId, status: 'COMPLETED' });
    if (!result.success) {
      toast.error(result.error || 'Không thể cập nhật trạng thái');
      return;
    }
    toast.success('Đã hoàn thành xử lý');
  }, [tickets]);

  const handleMarkReturned = React.useCallback((systemId: string) => {
    router.push(`/warranty/${systemId}`); // Go to detail page to link order
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

  return {
    handleEdit,
    handleGetLink,
    handleStartProcessing,
    handleMarkProcessed,
    handleMarkReturned,
    handleCancel,
  };
}
