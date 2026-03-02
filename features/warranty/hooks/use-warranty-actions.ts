import * as React from 'react';
import { toast } from 'sonner';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { calculateWarrantyProcessingState } from '../components/logic/processing';
import type { WarrantyTicket, WarrantyStatus } from '../types';
import type { Order } from '../../orders/types';
import { fetchPayments } from '../../payments/api/payments-api';
import { fetchReceipts } from '../../receipts/api/receipts-api';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { updateWarrantyStatusAction } from '../../../app/actions/warranty';
import { useQueryClient, useQuery } from '@tanstack/react-query';

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
  totalSettlementAmount,
  remainingSettlementAmount,
  update,
  updateStatus: _updateStatus,
  addHistory,
  navigate,
}: UseWarrantyActionsOptions) {
  const [isCompletingTicket, setIsCompletingTicket] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const queryClient = useQueryClient();

  // Fetch payments & receipts linked to this warranty via React Query
  const { data: warrantyPayments = [] } = useQuery({
    queryKey: ['payments', 'warranty-actions', ticket?.systemId],
    queryFn: () => fetchAllPages((p) => fetchPayments({ ...p, linkedWarrantySystemId: ticket!.systemId })),
    enabled: !!ticket?.systemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });
  const { data: warrantyReceipts = [] } = useQuery({
    queryKey: ['receipts', 'warranty-actions', ticket?.systemId],
    queryFn: () => fetchAllPages((p) => fetchReceipts({ ...p, linkedWarrantySystemId: ticket!.systemId })),
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

  const validateProcessedStatusRequirements = React.useCallback((currentTicket: WarrantyTicket) => {
    if (!currentTicket.processedImages || currentTicket.processedImages.length === 0) {
      toast.error('Chưa đầy đủ thông tin', {
        description: 'Vui lòng upload hình ảnh đã xử lý trước khi đánh dấu "Hoàn tất"',
        duration: 5000,
      });
      return false;
    }

    if (!currentTicket.products || currentTicket.products.length === 0) {
      toast.error('Chưa đầy đủ thông tin', {
        description: 'Vui lòng thêm sản phẩm vào danh sách bảo hành trước khi đánh dấu "Đã xử lý"',
        duration: 5000,
      });
      return false;
    }

    const incompleteProducts = currentTicket.products.filter((product) =>
      !product.productName || !product.issueDescription || !product.resolution
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

  const handleStatusChange = React.useCallback(async (newStatus: WarrantyStatus) => {
    const currentTicket = requireTicket();
    if (!currentTicket) return;

    if (newStatus === 'COMPLETED') {
      const isValid = validateProcessedStatusRequirements(currentTicket);
      if (!isValid) return;
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
      queryClient.invalidateQueries({ queryKey: ['warranties'] });
      queryClient.invalidateQueries({ queryKey: ['warranty', currentTicket.systemId] });
      
      toast.success('Đã cập nhật trạng thái');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [requireTicket, validateProcessedStatusRequirements, queryClient]);

  const handleCompleteTicket = React.useCallback(async () => {
    if (isCompletingTicket) {
      return;
    }

    const currentTicket = requireTicket();
    if (!currentTicket) {
      if (isCompletingTicket) {
        return;
      }
      return;
    }

    if (currentTicket.status !== 'COMPLETED') {
      toast.error('Chỉ có thể trả hàng khi phiếu đã hoàn tất');
      return;
    }

    const totalPayment = totalSettlementAmount;

    if (totalPayment > 0 && remainingSettlementAmount > 0) {
      toast.error(`Chưa thanh toán đủ cho khách. Còn thiếu: ${remainingSettlementAmount.toLocaleString('vi-VN')} đ`, {
        duration: 5000,
      });
      return;
    }

    if (totalPayment > 0) {
      const state = calculateWarrantyProcessingState(currentTicket, warrantyPayments, warrantyReceipts, totalPayment);

      if (state.remainingAmount > 0) {
        toast.error(`Chưa thanh toán đủ cho khách. Còn thiếu: ${state.remainingAmount.toLocaleString('vi-VN')} đ`, {
          duration: 5000,
        });
        return;
      }
    }

    try {
      setIsCompletingTicket(true);
      
      // Use server action for atomic update
      const result = await updateWarrantyStatusAction({
        systemId: currentTicket.systemId,
        newStatus: 'RETURNED',
        note: 'Trả hàng cho khách',
      });
      
      if (!result.success) {
        toast.error(result.error || 'Không thể trả hàng');
        return;
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['warranties'] });
      queryClient.invalidateQueries({ queryKey: ['warranty', currentTicket.systemId] });
      
      toast.success('Đã trả hàng cho khách', {
        description: 'Phiếu đã được hoàn tất và lưu trữ',
      });
    } catch (error) {
      console.error('Failed to complete ticket:', error);
      toast.error('Không thể kết thúc phiếu');
    } finally {
      setTimeout(() => setIsCompletingTicket(false), 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompletingTicket, remainingSettlementAmount, requireTicket, totalSettlementAmount, queryClient]);

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
      code += chars.charAt(Math.floor(Math.random() * chars.length));
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
