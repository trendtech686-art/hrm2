/**
 * Correct Verification Handler Hook
 * Handles complaint verification - confirming correct (valid) complaint
 * Extracted from detail-page.tsx to reduce complexity
 */

import * as React from 'react';
import { toast } from 'sonner';
import { asSystemId, type SystemId, type BusinessId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import type { Complaint, ComplaintAction } from '../types';
import { complaintNotifications } from '../notification-utils';
import { COMPLAINT_TOAST_MESSAGES as MSG } from '../constants/toast-messages';
import { logError } from '@/lib/logger'
import type { Order } from '@/features/orders/types';
import type { Employee } from '@/features/employees/types';
import type { EmployeeSearchResult } from '@/hooks/use-meilisearch';

interface UseCorrectVerificationHandlerProps {
  complaint: Complaint | null;
  currentUser: { systemId: SystemId; name: string };
  assignedEmployee: EmployeeSearchResult | null | undefined;
  relatedOrder: Order | null | undefined;
  employee: Employee | null | undefined;
  updateComplaint: (systemId: string, data: Partial<Complaint>) => Promise<void> | void;
}

interface CorrectVerificationParams {
  method: "refund" | "replace";
  cost: number;
  incurredCost: number;
  reason: string;
  confirmedQuantities?: Record<SystemId, number>;
  inventoryAdjustments?: Record<SystemId, number>;
}

interface InventoryAdjustmentItem {
  productSystemId: SystemId;
  productId: BusinessId;
  productName: string;
  quantityAdjusted: number;
  reason: string;
  branchSystemId: SystemId;
}

interface CreatedPayment {
  systemId: string;
  id: string;
}

interface CreatedReceipt {
  systemId: string;
  id: string;
}

interface InventoryAdjustmentResult {
  adjusted: boolean;
  adjustedBy: SystemId;
  adjustedAt: Date;
  adjustmentNote: string;
  items: InventoryAdjustmentItem[];
}

/**
 * Hook for handling correct verification flow
 */
export function useCorrectVerificationHandler({
  complaint,
  currentUser,
  assignedEmployee,
  relatedOrder,
  employee,
  updateComplaint,
}: UseCorrectVerificationHandlerProps) {

  const handleCorrectVerification = React.useCallback(async ({
    method,
    cost,
    incurredCost,
    reason,
    confirmedQuantities,
    inventoryAdjustments,
  }: CorrectVerificationParams) => {
    if (!complaint) return;

    // Validation
    if (cost <= 0) {
      toast.error("Vui lòng nhập số tiền bù trừ");
      return;
    }
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do bù trừ");
      return;
    }

    // Get responsible employee for incurred cost
    let responsibleEmployee = assignedEmployee;
    if (incurredCost > 0) {
      if (!complaint.assignedTo) {
        toast.error("Không tìm thấy nhân viên phụ trách để tạo phiếu thu chi phí phát sinh");
        return;
      }
      if (!responsibleEmployee) {
        toast.error(`Không tìm thấy thông tin nhân viên phụ trách (ID: ${complaint.assignedTo})`);
        return;
      }
    }

    try {
      // ==========================================
      // LAZY LOAD: Import Server Actions
      // ==========================================
      const [cashAccountsModule, paymentTypesModule, receiptTypesModule, paymentMethodsModule] = await Promise.all([
        import('@/features/settings/cash-accounts/api/cash-accounts-api'),
        import('@/features/settings/payments/types/api/payment-types-api'),
        import('@/features/settings/receipt-types/api/receipt-types-api'),
        import('@/features/settings/payments/methods/api/payment-methods-api'),
      ]);

      const [paymentsAction, receiptsAction, productsAction] = await Promise.all([
        import('@/app/actions/payments'),
        import('@/app/actions/receipts'),
        import('@/app/actions/products'),
      ]);

      const { fetchCashAccounts } = cashAccountsModule;
      const { fetchPaymentTypes } = paymentTypesModule;
      const { fetchReceiptTypes } = receiptTypesModule;
      const { fetchPaymentMethods } = paymentMethodsModule;
      const { createPaymentAction } = paymentsAction;
      const { createReceiptAction } = receiptsAction;
      const { updateProductInventoryAction } = productsAction;

      // ==========================================
      // FETCH SETTINGS DATA
      // ==========================================
      const [cashAccountsResult, paymentTypesResult, receiptTypesResult, paymentMethodsResult] = await Promise.all([
        fetchCashAccounts({ isActive: true }),
        fetchPaymentTypes({ isActive: true }),
        fetchReceiptTypes({ isActive: true }),
        fetchPaymentMethods({ isActive: true }),
      ]);

      const accounts = cashAccountsResult.data ?? [];
      const paymentTypes = paymentTypesResult.data ?? [];
      const receiptTypes = receiptTypesResult.data ?? [];
      const paymentMethodsFromApi = paymentMethodsResult.data ?? [];

      // ==========================================
      // FIND DEFAULT ACCOUNTS & METHODS
      // ==========================================
      const defaultCashAccount = accounts.find(acc => acc.isDefault && acc.type === 'CASH') || accounts.find(acc => acc.type === 'CASH');
      const defaultBankAccount = accounts.find(acc => acc.isDefault && acc.type === 'BANK') || accounts.find(acc => acc.type === 'BANK');

      if (!defaultCashAccount && !defaultBankAccount) {
        toast.error("Không tìm thấy tài khoản quỹ mặc định");
        return;
      }

      const cashMethod = paymentMethodsFromApi.find(m => (m.name.toLowerCase().includes('tiền mặt') || m.name.toLowerCase().includes('cash')) && m.isActive);
      const bankMethod = paymentMethodsFromApi.find(m => (m.name.toLowerCase().includes('chuyển khoản') || m.name.toLowerCase().includes('bank') || m.name.toLowerCase().includes('transfer')) && m.isActive);

      // ==========================================
      // 1. CREATE PAYMENT (if refund)
      // ==========================================
      let paymentSystemId: SystemId | undefined;
      let paymentId: BusinessId | undefined;

      if (method === 'refund') {
        const complaintPaymentType = paymentTypes.find(pt =>
          pt.name.toLowerCase().includes('bù trừ') ||
          pt.name.toLowerCase().includes('khiếu nại')
        );

        if (!complaintPaymentType) {
          toast.error(MSG.ERROR.PAYMENT_TYPE_NOT_FOUND);
          return;
        }

        const paymentData = {
          amount: cost,
          description: `Hoàn tiền khiếu nại ${complaint.id}\n${reason}`,
          category: 'complaint_refund' as const,
          branchId: (employee?.branchSystemId || 'default_branch') as string,
          branchSystemId: employee?.branchSystemId || asSystemId('default_branch'),
          branchName: 'Chi nhánh',
          accountSystemId: defaultBankAccount?.systemId || defaultCashAccount?.systemId || asSystemId(''),
          paymentMethodSystemId: bankMethod?.systemId || cashMethod?.systemId || asSystemId(''),
          paymentMethodName: bankMethod?.name || cashMethod?.name || 'Chuyển khoản',
          recipientTypeSystemId: asSystemId('KHACHHANG'),
          recipientTypeName: 'Khách hàng',
          recipientName: complaint.customerName,
          recipientSystemId: complaint.customerId ? asSystemId(complaint.customerId) : undefined,
          paymentReceiptTypeSystemId: complaintPaymentType.systemId,
          paymentReceiptTypeName: complaintPaymentType.name,
          linkedComplaintSystemId: complaint.systemId,
        };

        const paymentResult = await createPaymentAction(paymentData);
        if (!paymentResult.success) {
          toast.error(paymentResult.error || 'Lỗi tạo phiếu chi');
          return;
        }
        const addedPayment = paymentResult.data as CreatedPayment | undefined;
        paymentSystemId = addedPayment?.systemId as SystemId | undefined;
        paymentId = addedPayment?.id as BusinessId | undefined;
      }

      // ==========================================
      // 2. CREATE RECEIPT (if incurred cost)
      // ==========================================
      let receiptSystemId: SystemId | undefined;
      let receiptId: BusinessId | undefined;

      if (incurredCost > 0 && responsibleEmployee) {
        const incurredCostReceiptType = receiptTypes.find(pt =>
          pt.name.toLowerCase().includes('chi phí phát sinh') ||
          pt.name.toLowerCase().includes('phạt')
        );

        if (!incurredCostReceiptType) {
          toast.error(MSG.ERROR.RECEIPT_TYPE_NOT_FOUND);
          return;
        }

        const receiptData = {
          amount: incurredCost,
          description: `Thu chi phí phát sinh từ lỗi khiếu nại ${complaint.id}\nNhân viên: ${responsibleEmployee.fullName}\n${reason}`,
          category: 'complaint_penalty' as const,
          branchId: (employee?.branchSystemId || 'default_branch') as string,
          branchSystemId: employee?.branchSystemId || asSystemId('default_branch'),
          branchName: 'Chi nhánh',
          accountSystemId: defaultCashAccount?.systemId || defaultBankAccount?.systemId || asSystemId(''),
          paymentMethodSystemId: cashMethod?.systemId || bankMethod?.systemId || asSystemId(''),
          paymentMethodName: cashMethod?.name || bankMethod?.name || 'Tiền mặt',
          payerTypeSystemId: asSystemId('NHANVIEN'),
          payerTypeName: 'Nhân viên',
          payerName: responsibleEmployee.fullName,
          payerSystemId: responsibleEmployee.systemId,
          paymentReceiptTypeSystemId: incurredCostReceiptType.systemId,
          paymentReceiptTypeName: incurredCostReceiptType.name,
          linkedComplaintSystemId: complaint.systemId,
        };

        const receiptResult = await createReceiptAction(receiptData);
        if (!receiptResult.success) {
          toast.error(receiptResult.error || 'Lỗi tạo phiếu thu');
          return;
        }
        const addedReceipt = receiptResult.data as CreatedReceipt | undefined;
        receiptSystemId = addedReceipt?.systemId as SystemId | undefined;
        receiptId = addedReceipt?.id as BusinessId | undefined;
      }

      // ==========================================
      // 3. ADJUST INVENTORY
      // ==========================================
      let inventoryAdjustment: InventoryAdjustmentResult | undefined;

      if (complaint.affectedProducts && complaint.affectedProducts.length > 0) {
        const branchSystemId = relatedOrder?.branchSystemId || employee?.branchSystemId || asSystemId('default_branch');

        const adjustedItems = complaint.affectedProducts
          .map(p => {
            const adjustQuantity = inventoryAdjustments?.[p.productSystemId] ?? 0;
            if (adjustQuantity === 0) return null;

            const issueLabel = p.issueType === 'missing' ? 'Thiếu' : p.issueType === 'excess' ? 'Thừa' : p.issueType === 'defective' ? 'Hỏng' : 'Khác';
            const adjustLabel = adjustQuantity > 0 ? `+${adjustQuantity}` : adjustQuantity;

            return {
              productSystemId: asSystemId(p.productSystemId),
              productId: asBusinessId(p.productId as string),
              productName: p.productName,
              quantityAdjusted: adjustQuantity,
              reason: `Điều chỉnh kho khiếu nại ${complaint.id} (${issueLabel}: ${adjustLabel})`,
              branchSystemId: branchSystemId,
            };
          })
          .filter((item): item is InventoryAdjustmentItem => Boolean(item));

        if (adjustedItems.length > 0) {
          // Update inventory in parallel
          await Promise.all(adjustedItems.map(item =>
            updateProductInventoryAction(
              item.productSystemId,
              item.branchSystemId,
              Math.abs(item.quantityAdjusted),
              item.quantityAdjusted > 0 ? 'add' : 'subtract'
            )
          ));

          inventoryAdjustment = {
            adjusted: true,
            adjustedBy: currentUser.systemId,
            adjustedAt: new Date(),
            adjustmentNote: `Điều chỉnh kho theo xác minh khiếu nại - ${adjustedItems.length} sản phẩm`,
            items: adjustedItems,
          };

          toast.success(MSG.SUCCESS.INVENTORY_ADJUSTED(adjustedItems.length));
        }
      }

      // ==========================================
      // 4. CREATE TIMELINE ACTION
      // ==========================================
      const penaltyEmployeeName = responsibleEmployee?.fullName;

      const newAction: ComplaintAction = {
        id: asSystemId(generateSubEntityId('ACTION')),
        actionType: "verified-correct",
        performedBy: currentUser.systemId,
        performedAt: new Date(),
        note: buildTimelineNote({
          method,
          cost,
          incurredCost,
          reason,
          paymentId,
          receiptId,
          penaltyEmployeeName,
          inventoryAdjustment,
          complaintId: complaint.id,
        }),
        metadata: {
          method,
          cost,
          incurredCost,
          reason,
          paymentSystemId,
          receiptSystemId,
        },
      };

      // Update affectedProducts with confirmed quantities
      const updatedAffectedProducts = complaint.affectedProducts?.map(p => ({
        ...p,
        quantityMissing: confirmedQuantities?.[p.productSystemId] ?? p.quantityMissing,
      }));

      // ==========================================
      // 5. UPDATE COMPLAINT
      // ==========================================
      await updateComplaint(complaint.systemId, {
        isVerifiedCorrect: true,
        verification: "verified-correct",
        resolution: method === "refund" ? "refund" : "replacement",
        resolutionNote: buildResolutionNote({ method, cost, incurredCost, reason }),
        compensationAmount: cost,
        incurredCost: incurredCost,
        compensationReason: reason,
        affectedProducts: updatedAffectedProducts,
        inventoryAdjustment: inventoryAdjustment,
        timeline: [...(complaint.timeline || []), newAction],
      } as Partial<Complaint>);

      // ==========================================
      // 6. SHOW SUCCESS NOTIFICATION
      // ==========================================
      const successMessage = method === "refund"
        ? "Đã xác nhận khiếu nại đúng và tạo phiếu hoàn tiền"
        : "Đã xác nhận khiếu nại đúng, ghi nhận bù trả hàng cho khách";
      complaintNotifications.onVerified(successMessage);

    } catch (error) {
      logError('Error in correct verification', error);
      toast.error("Có lỗi khi xác nhận khiếu nại đúng");
    }
  }, [
    complaint,
    currentUser,
    assignedEmployee,
    relatedOrder,
    employee,
    updateComplaint,
  ]);

  return { handleCorrectVerification };
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function asBusinessId(id: string): BusinessId {
  return id as BusinessId;
}

function buildTimelineNote(params: {
  method: "refund" | "replace";
  cost: number;
  incurredCost: number;
  reason: string;
  paymentId?: BusinessId;
  receiptId?: BusinessId;
  penaltyEmployeeName?: string;
  inventoryAdjustment?: { items: unknown[] };
  complaintId: string;
}): string {
  const { method, cost, incurredCost, reason, paymentId, receiptId, penaltyEmployeeName, inventoryAdjustment, complaintId } = params;

  let note = `Phương án: ${method === "refund" ? "Hoàn tiền" : "Bù trả hàng"}`;

  if (method === "refund") {
    note += `\nSố tiền hoàn trả: ${cost.toLocaleString("vi-VN")} đ`;
  }

  note += `\nChi phí phát sinh: ${incurredCost.toLocaleString("vi-VN")} đ`;
  note += `\nLý do: ${reason}`;

  if (paymentId) {
    note += `\nĐã tạo phiếu chi: ${paymentId}`;
  }

  if (incurredCost > 0 && receiptId) {
    note += `\nĐã tạo phiếu thu: ${receiptId}`;
    if (penaltyEmployeeName) {
      note += ` (Thu từ ${penaltyEmployeeName})`;
    }
  }

  if (inventoryAdjustment) {
    note += `\nĐã điều chỉnh kho: ${inventoryAdjustment.items.length} sản phẩm`;
  }

  return note;
}

function buildResolutionNote(params: {
  method: "refund" | "replace";
  cost: number;
  incurredCost: number;
  reason: string;
}): string {
  const { method, cost, incurredCost, reason } = params;

  if (method === "refund") {
    return `Hoàn tiền: ${cost.toLocaleString("vi-VN")} đ\nChi phí phát sinh: ${incurredCost.toLocaleString("vi-VN")} đ\nLý do: ${reason}`;
  }

  return `Bù trả hàng cho khách\nChi phí phát sinh: ${incurredCost.toLocaleString("vi-VN")} đ\nLý do: ${reason}`;
}
