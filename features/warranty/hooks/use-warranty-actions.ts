import * as React from 'react';
import { toast } from 'sonner';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { calculateWarrantyProcessingState } from '../components/logic/processing';
import type { WarrantyTicket } from '../types';
import type { Order } from '../../orders/types';
import { usePaymentStore } from '../../payments/store';
import { useReceiptStore } from '../../receipts/store';

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
  updateStatus,
  addHistory,
  navigate,
}: UseWarrantyActionsOptions) {
  const [isCompletingTicket, setIsCompletingTicket] = React.useState(false);

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
        description: 'Vui lòng upload hình ảnh đã xử lý trước khi đánh dấu "Đã xử lý"',
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

  const handleStatusChange = React.useCallback(async (newStatus: WarrantyTicket['status']) => {
    const currentTicket = requireTicket();
    if (!currentTicket) return;

    if (newStatus === 'processed') {
      const isValid = validateProcessedStatusRequirements(currentTicket);
      if (!isValid) return;
    }

    try {
      updateStatus(currentTicket.systemId, newStatus, '');
      toast.success('Đã cập nhật trạng thái');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  }, [requireTicket, updateStatus, validateProcessedStatusRequirements]);

  const handleCompleteTicket = React.useCallback(() => {
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

    if (currentTicket.status !== 'returned') {
      toast.error('Chỉ có thể kết thúc phiếu đã trả hàng');
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
      const latestPayments = usePaymentStore.getState().data;
      const latestReceipts = useReceiptStore.getState().data;
      const state = calculateWarrantyProcessingState(currentTicket, latestPayments, latestReceipts, totalPayment);

      if (state.remainingAmount > 0) {
        toast.error(`Chưa thanh toán đủ cho khách. Còn thiếu: ${state.remainingAmount.toLocaleString('vi-VN')} đ`, {
          duration: 5000,
        });
        return;
      }
    }

    try {
      setIsCompletingTicket(true);
      updateStatus(currentTicket.systemId, 'completed', 'Kết thúc phiếu bảo hành');
      toast.success('Đã kết thúc phiếu bảo hành', {
        description: 'Phiếu đã được hoàn tất và lưu trữ',
      });
    } catch (error) {
      console.error('Failed to complete ticket:', error);
      toast.error('Không thể kết thúc phiếu');
    } finally {
      setTimeout(() => setIsCompletingTicket(false), 1000);
    }
  }, [isCompletingTicket, remainingSettlementAmount, requireTicket, totalSettlementAmount, updateStatus]);

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
  };
}
