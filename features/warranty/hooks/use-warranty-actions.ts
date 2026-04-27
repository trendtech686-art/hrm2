import * as React from 'react';
import { toast } from 'sonner';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { WarrantyTicket, WarrantyStatus } from '../types';
import type { Order } from '../../orders/types';
import { fetchPayments } from '../../payments/api/payments-api';
import { fetchReceipts } from '../../receipts/api/receipts-api';
import { updateWarrantyStatusAction, completeWarrantyAction } from '../../../app/actions/warranty';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import { logError } from '@/lib/logger'

interface CurrentUser {
  name: string;
  systemId: string;
}

interface UseWarrantyActionsOptions {
  ticket: WarrantyTicket | null;
  currentUser: CurrentUser;
  linkedOrder?: Order;
  publicTrackingUrl: string;
  totalSettlementAmount: number;
  remainingSettlementAmount: number;
  update: (systemId: string, updates: Partial<WarrantyTicket>) => void;
  updateStatus: (systemId: string, status: WarrantyTicket['status'], reason?: string) => void;
  addHistory: (ticketSystemId: string, action: string, performedBy: string, note?: string) => void;
  navigate: AppRouterInstance;
}

export function useWarrantyActions({
  ticket,
  currentUser,
  linkedOrder,
  publicTrackingUrl,
  update,
  updateStatus: _updateStatus,
  addHistory,
  navigate,
}: UseWarrantyActionsOptions) {
  const [isCompletingTicket, setIsCompletingTicket] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const queryClient = useQueryClient();

  // Fetch payments & receipts linked to this warranty via React Query
  const { data: _warrantyPayments = [] } = useQuery({
    queryKey: ['payments', 'warranty-actions', ticket?.systemId],
    queryFn: async () => {
      const res = await fetchPayments({ linkedWarrantySystemId: ticket!.systemId });
      return res.data;
    },
    enabled: !!ticket?.systemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });
  const { data: _warrantyReceipts = [] } = useQuery({
    queryKey: ['receipts', 'warranty-actions', ticket?.systemId],
    queryFn: async () => {
      const res = await fetchReceipts({ linkedWarrantySystemId: ticket!.systemId });
      return res.data;
    },
    enabled: !!ticket?.systemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const requireTicket = React.useCallback((message?: string) => {
    if (ticket) return ticket;
    toast.error(message || 'Không tìm thấy phiếu bảo hành');
    return null;
  }, [ticket]);

  const recordHistory = React.useCallback((currentTicket: WarrantyTicket, action: string, note?: string) => {
    addHistory(currentTicket.systemId, action, currentUser.name, note);
  }, [addHistory, currentUser.name]);

  const validateProcessedStatusRequirements = React.useCallback((currentTicket: WarrantyTicket): true | 'needs-images' | false => {
    if (!currentTicket.processedImages || currentTicket.processedImages.length === 0) {
      return 'needs-images';
    }

    if (!currentTicket.products || currentTicket.products.length === 0) {
      toast.error('Chưa đầy đủ thông tin', {
        description: 'Vui lòng thêm sản phẩm vào danh sách bảo hành trước khi đánh dấu "Đã xử lý"',
        duration: 5000,
      });
      return false;
    }

    const incompleteProducts = currentTicket.products.filter((product) =>
      !product.productName || !product.resolution
    );

    if (incompleteProducts.length > 0) {
      toast.error('Chưa đầy đủ thông tin sản phẩm', {
        description: `Có ${incompleteProducts.length} sản phẩm chưa đầy đủ thông tin (tên, tình trạng, cách xử lý)`,
        duration: 5000,
      });
      return false;
    }

    return true;
  }, []);

  const handleStatusChange = React.useCallback(async (newStatus: WarrantyStatus, options?: { skipImageValidation?: boolean }): Promise<'needs-images' | void> => {
    const currentTicket = requireTicket();
    if (!currentTicket) return;

    if (newStatus === 'COMPLETED') {
      const validationResult = validateProcessedStatusRequirements(currentTicket);
      if (validationResult === 'needs-images' && !options?.skipImageValidation) return 'needs-images';
      if (validationResult === false) return;
    }

    setIsUpdatingStatus(true);
    try {
      // Use server action for atomic update
      const result = await updateWarrantyStatusAction({
        systemId: currentTicket.systemId,
        newStatus,
      });
      
      if (!result.success) {
        toast.error(result.error || 'Không thể cập nhật trạng thái');
        return;
      }
      
      // Invalidate queries to refresh data
      invalidateRelated(queryClient, 'warranties');
      // Direct await (not useMutation) → MutationCache doesn't fire → manual invalidate
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      
      toast.success('Đã cập nhật trạng thái');
    } catch (error) {
      logError('Failed to update status', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [requireTicket, validateProcessedStatusRequirements, queryClient]);

  const handleCompleteTicket = React.useCallback(async () => {
    if (isCompletingTicket) return;

    const currentTicket = requireTicket();
    if (!currentTicket) return;

    if (currentTicket.status !== 'RETURNED') {
      toast.error('Chỉ có thể hoàn tất phiếu đã trả hàng');
      return;
    }

    // Validate processed images
    const processedImages = currentTicket.processedImages || [];
    if (processedImages.length === 0) {
      toast.error('Chưa có hình ảnh đã xử lý', {
        description: 'Vui lòng thêm ít nhất 1 hình ảnh đã xử lý trước khi hoàn tất phiếu.',
        duration: 5000,
      });
      return;
    }

    // Refetch financial data to ensure we have the latest state
    await queryClient.refetchQueries({ queryKey: ['payments', 'warranty-actions', currentTicket.systemId] });
    await queryClient.refetchQueries({ queryKey: ['receipts', 'warranty-actions', currentTicket.systemId] });

    // Re-read from cache after refetch
    const latestPayments = queryClient.getQueryData<unknown[]>(['payments', 'warranty-actions', currentTicket.systemId]) ?? [];
    const latestReceipts = queryClient.getQueryData<unknown[]>(['receipts', 'warranty-actions', currentTicket.systemId]) ?? [];

    // Validate financial settlement: must have at least one payment or receipt
    const hasFinancialVoucher = latestPayments.length > 0 || latestReceipts.length > 0;
    if (!hasFinancialVoucher) {
      toast.error('Chưa thể hoàn tất', {
        description: 'Vui lòng tạo phiếu thu hoặc phiếu chi trước khi hoàn tất phiếu bảo hành.',
        duration: 5000,
      });
      return;
    }

    try {
      setIsCompletingTicket(true);
      
      const result = await completeWarrantyAction({
        systemId: currentTicket.systemId,
        note: 'Hoàn tất phiếu bảo hành',
      });
      
      if (!result.success) {
        toast.error(result.error || 'Không thể hoàn tất phiếu');
        return;
      }
      
      invalidateRelated(queryClient, 'warranties');
      // Direct await (not useMutation) → MutationCache doesn't fire → manual invalidate
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      
      toast.success('Đã hoàn tất phiếu bảo hành', {
        description: 'Phiếu đã được hoàn tất và lưu trữ.',
      });
    } catch (error) {
      logError('Failed to complete ticket', error);
      toast.error('Không thể hoàn tất phiếu');
    } finally {
      setTimeout(() => setIsCompletingTicket(false), 1000);
    }
  }, [isCompletingTicket, requireTicket, queryClient]);

  const handleCopyTrackingLink = React.useCallback(() => {
    const currentTicket = requireTicket('Không tìm thấy phiếu để copy link');
    if (!currentTicket) return;
    if (!currentTicket.publicTrackingCode || !publicTrackingUrl) {
      toast.error('Chưa có mã tra cứu');
      return;
    }

    navigator.clipboard.writeText(publicTrackingUrl);
    toast.success('Đã copy link tracking', {
      description: `Mã: ${currentTicket.publicTrackingCode}`,
      duration: 5000,
    });

    recordHistory(currentTicket, 'Copy link tracking công khai', `Mã: ${currentTicket.publicTrackingCode}`);
  }, [publicTrackingUrl, recordHistory, requireTicket]);

  const handleGenerateTrackingCode = React.useCallback(() => {
    const currentTicket = requireTicket('Không thể tạo mã tra cứu khi thiếu phiếu');
    if (!currentTicket) return;

    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += chars[crypto.getRandomValues(new Uint8Array(1))[0] % chars.length];
    }

    update(currentTicket.systemId, { publicTrackingCode: code });
    recordHistory(currentTicket, '🔗 Tạo mã tra cứu công khai', `Mã: ${code}`);
    toast.success('Đã tạo mã tra cứu', {
      description: `Mã: ${code}`,
      duration: 3000,
    });
  }, [recordHistory, requireTicket, update]);

  const handleNavigateEmployee = React.useCallback(() => {
    const currentTicket = requireTicket();
    if (!currentTicket) return;
    if (!currentTicket.employeeSystemId) {
      toast.error('Phiếu chưa gán nhân viên phụ trách');
      return;
    }
    navigate.push(`/employees/${currentTicket.employeeSystemId}`);
  }, [navigate, requireTicket]);

  const handleNavigateOrder = React.useCallback(() => {
    if (!linkedOrder) return;
    navigate.push(`/orders/${linkedOrder.systemId}`);
  }, [linkedOrder, navigate]);

  return {
    handleStatusChange,
    handleCompleteTicket,
    handleCopyTrackingLink,
    handleGenerateTrackingCode,
    handleNavigateEmployee,
    handleNavigateOrder,
    isCompletingTicket,
    isUpdatingStatus,
  };
}
