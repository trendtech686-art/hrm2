'use client'

import * as React from "react";
import { useRouter, useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import { toast } from "sonner";
import { asSystemId } from '@/lib/id-types';
import type { BusinessId, SystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import { complaintNotifications } from "../notification-utils";
import { useAuth } from "@/contexts/auth-context";
import { useComplaintPermissions } from "../hooks/use-complaint-permissions";
import { useComplaintTimeTracking } from "../hooks/use-complaint-time-tracking";
import { useComplaintReminders } from "../hooks/use-complaint-reminders";
import { useComplaintsSettingSection } from '@/features/settings/complaints/hooks/use-complaints-settings';
import type { PublicTrackingSettings } from '@/hooks/use-public-tracking-settings';
// tracking-utils now used inside ComplaintDetailsCard
import { COMPLAINT_TOAST_MESSAGES as MSG } from '../constants/toast-messages';
import { handleCancelComplaint as cancelComplaintHandler } from '../handlers/cancel-handler';
import { handleReopenComplaint as reopenComplaintHandler } from '../handlers/reopen-handler';
import { useComplaintTemplates } from '../hooks/use-complaint-templates';

// Types & Store
import type { Complaint, ComplaintAction } from "../types";
import { useComplaintMutations, useComplaint } from "../hooks/use-complaints";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";
import { ConfirmCorrectDialog } from "./confirm-correct-dialog";
import { CompensationPaymentReceiptWizard } from "./compensation-payment-receipt-wizard";
import { InventoryDialog } from "./inventory-dialog";
import { VerificationDialog } from "./verification-dialog";
import { ComplaintHeaderSection } from "./complaint-header-section";
import { ComplaintTimelineSection } from "./complaint-timeline-section";
import { ComplaintAffectedProducts } from "./complaint-affected-products";
import { ComplaintOrderInfo } from "./complaint-order-info";
import { ComplaintImagesSection } from "./complaint-images-section";
import { ComplaintDetailsCard } from "./complaint-details-card";
import { ComplaintCustomerInfoCard } from "./complaint-customer-info-card";
import { ComplaintWorkflowSection } from "./complaint-workflow-section";
import { ComplaintProcessingCard } from "./complaint-processing-card";
import { TemplateDialog } from "./template-dialog";
import { ComplaintCommentsSection } from "./complaint-comments-section";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Copy } from 'lucide-react';

// Hooks & Context
import { useAllEmployees } from "@/features/employees/hooks/use-all-employees";
import { useOrder } from "@/features/orders/hooks/use-orders";
import { useComplaintHandlers } from "../hooks/use-complaint-handlers";
import { useVerificationHandlers } from "../hooks/use-verification-handlers";
import { useCompensationHandlers } from "../hooks/use-compensation-handlers";
import { useInventoryHandlers } from "../hooks/use-inventory-handlers";
import { logError } from '@/lib/logger'

/**
 * MAIN PAGE COMPONENT - Complaint Detail (VIEW ONLY)
 */
export function ComplaintDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { update: updateMutation } = useComplaintMutations({
    // Toast messages are already shown in verification handlers
    onError: (err) => toast.error(err.message)
  });
  const { data: employees } = useAllEmployees();
  // REMOVED: Payments/receipts loaded separately in components that need them

  // ✅ Use dedicated query for single complaint - auto-refreshes after mutation
  const { data: complaint, isLoading: isLoadingComplaint } = useComplaint(systemId);

  // ⚡ OPTIMIZED: Use inline order data from complaint API, only fetch separately if missing
  const inlineOrder = (complaint as unknown as { relatedOrder?: Record<string, unknown> } | null)?.relatedOrder;
  const orderIdToFind = complaint?.orderSystemId || (complaint as unknown as { orderId?: string } | null)?.orderId;
  // Only fetch order when inline data is not available (e.g. after mutation transition)
  const { data: fetchedOrder } = useOrder(!inlineOrder ? orderIdToFind : undefined);
  const relatedOrder = React.useMemo(
    () => (inlineOrder as typeof fetchedOrder) || fetchedOrder,
    [inlineOrder, fetchedOrder]
  );

  // Memoize frequently accessed data to avoid repeated searches
  const assignedEmployee = React.useMemo(() => 
    complaint?.assignedTo ? employees.find(e => e.systemId === complaint.assignedTo) : null,
    [complaint, employees]
  );
  
  //  Auth & Permissions
  const { employee } = useAuth();
  const permissions = useComplaintPermissions(complaint);
  const timeTracking = useComplaintTimeTracking(complaint);
  useComplaintReminders(complaint ?? null);
  const { data: trackingSettings } = useComplaintsSettingSection<PublicTrackingSettings>('tracking');
  const trackingEnabled = (trackingSettings as PublicTrackingSettings | undefined)?.enabled ?? false;
  
  // Create wrapper function for updateComplaint - returns Promise for async handlers
  const updateComplaint = React.useCallback(async (systemId: string, data: Partial<Complaint>) => {
    await updateMutation.mutateAsync({ systemId, data });
  }, [updateMutation]);
  
  // Create wrapper for assignComplaint with different signature
  const assignComplaint = React.useCallback(async (systemId: SystemId, userId: SystemId, _userName?: string) => {
    await updateMutation.mutateAsync({ 
      systemId, 
      data: { 
        assignedTo: userId,
      } as Partial<Complaint>
    });
  }, [updateMutation]);
  
  // Current user (from auth context) - memoized to prevent deps change on every render
  const currentUser = React.useMemo(() => employee 
    ? { systemId: employee.systemId, name: employee.fullName }
    : { systemId: asSystemId('SYSTEM'), name: 'Guest User' }, [employee]);


  // ==========================================
  // State for Verification & Resolution
  // ==========================================
  const [confirmCorrectDialogOpen, setConfirmCorrectDialogOpen] = React.useState(false);
  const [compensationDialogOpen, setCompensationDialogOpen] = React.useState(false);
  const [inventoryDialogOpen, setInventoryDialogOpen] = React.useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = React.useState(false);
  const [verificationMode, setVerificationMode] = React.useState<"correct" | "incorrect" | null>(null);
  
  // Template dialog state
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false);
  const [templatesLoaded, setTemplatesLoaded] = React.useState(false);
  const [templates] = useComplaintTemplates({ enabled: templatesLoaded });
  
  // Confirm dialogs state
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = React.useState<{
    title: string;
    description: string;
    confirmText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void;
  }>({
    title: "",
    description: "",
    onConfirm: () => {},
  });
  


  // ==========================================
  // State for Image Preview
  // ==========================================
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [showImagePreview, setShowImagePreview] = React.useState(false);

  // Check button visibility using permissions
  const isVerified = complaint ? complaint.verification !== "pending-verification" : false;
  const canEnd = permissions.canClose;
  const canEdit = permissions.canEdit;
  const canReopen = permissions.canReopen;
  const canCancel = permissions.canReject; // creator/admin + not closed

  // ==========================================
  // USE NEW EXTRACTED HOOKS
  // ==========================================
  const complaintHandlers = useComplaintHandlers({
    complaint: complaint ?? null,
    currentUser,
    permissions,
    assignComplaint,
    updateComplaint,
  });

  const verificationHandlers = useVerificationHandlers({
    complaint: complaint ?? null,
    currentUser,
    permissions,
    updateComplaint,
  });

  const compensationHandlers = useCompensationHandlers({
    complaint: complaint ?? null,
    updateComplaint,
    currentUser,
  });

  // Destructure handlers with aliases to avoid conflicts
  const { 
    handleProcessCompensation: openCompensationDialog, 
    handleCompensationComplete 
  } = compensationHandlers;

  const inventoryHandlers = useInventoryHandlers({
    complaint: complaint ?? null,
    currentUser,
    updateComplaint,
    relatedOrder,
    employee,
  });

  // ==========================================
  // Event Handlers (Legacy - will be replaced)
  // ==========================================
  // REPLACED: handleAssign → complaintHandlers.handleAssign
  // REPLACED: handleStatusChange → complaintHandlers.handleStatusChange
  // REPLACED: handleEndComplaint → complaintHandlers.handleEndComplaint
  
  // Wrapper for compensation - opens dialog
  const handleProcessCompensation = React.useCallback(() => {
    if (!complaint) return;
    
    const canProcess = openCompensationDialog();
    if (canProcess) {
      setCompensationDialogOpen(true);
    }
  }, [complaint, openCompensationDialog]);
  
  // Handler for "Xác nhận đúng" button - Open simple confirm dialog
  const handleVerifyCorrectClick = React.useCallback(() => {
    if (!complaint) return;
    
    if (!permissions.canVerify) {
      toast.error(permissions.reason || "Bạn không có quyền xác minh khiếu nại");
      return;
    }
    
    setConfirmCorrectDialogOpen(true);
  }, [complaint, permissions]);

  // Handler when user confirms in ConfirmCorrectDialog
  // REPLACED: handleConfirmCorrect → verificationHandlers.handleConfirmCorrect
  const handleConfirmCorrect = verificationHandlers.handleConfirmCorrect;

  // NEW: Handler for "Xử lý tồn kho" button  
  const handleProcessInventory = React.useCallback(() => {
    if (!complaint) return;
    
    const canProcess = inventoryHandlers.handleProcessInventory();
    if (canProcess) {
      setInventoryDialogOpen(true);
    }
  }, [complaint, inventoryHandlers]);

  // NEW: Handler for inventory adjustment submission
  // REPLACED: handleInventoryAdjustment → inventoryHandlers.handleInventoryAdjustment
  const handleInventoryAdjustment = inventoryHandlers.handleInventoryAdjustment;



  const handleVerifyIncorrect = React.useCallback(() => {
    if (!complaint) return;
    
    //  Permission check
    if (!permissions.canVerify) {
      toast.error(permissions.reason || "Bạn không có quyền xác minh khiếu nại");
      return;
    }
    
    setVerificationMode("incorrect");
    setVerificationDialogOpen(true);
  }, [complaint, permissions, setVerificationMode, setVerificationDialogOpen]);

  const handleSubmitCorrectResolution = React.useCallback(async (
    method: "refund" | "replace", 
    cost: number, 
    incurredCost: number, 
    reason: string,
    confirmedQuantities?: Record<SystemId, number>, //  NEW: Số lượng thiếu thực tế đã xác minh
    inventoryAdjustments?: Record<SystemId, number> //  NEW: Số lượng muốn điều chỉnh kho (nhập tay)
  ) => {
    if (!complaint) return;
    if (cost <= 0) {
      toast.error("Vui lòng nhập số tiền bù trừ");
      return;
    }
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do bù trừ");
      return;
    }
    
    // Lấy thông tin nhân viên phụ trách (nếu có chi phí phát sinh)
    // ⚡ OPTIMIZE: Use pre-memoized assignedEmployee instead of searching
    let responsibleEmployee;
    if (incurredCost > 0) {
      if (!complaint.assignedTo) {
        toast.error("Không tìm thấy nhân viên phụ trách để tạo phiếu thu chi phí phát sinh");
        return;
      }
      responsibleEmployee = assignedEmployee;
      if (!responsibleEmployee) {
        toast.error(`Không tìm thấy thông tin nhân viên phụ trách (ID: ${complaint.assignedTo})`);
        return;
      }
    }
    
    // TAO 2 PHIEU: CHI (bu tru khach - CHI KHI HOAN TIEN) + THU (phat nhan vien)
    try {
      // LAZY LOAD: Import Server Actions for all operations
      const { fetchCashAccounts } = await import('@/features/settings/cash-accounts/api/cash-accounts-api');
      const { fetchPaymentTypes } = await import('@/features/settings/payments/types/api/payment-types-api');
      const { fetchReceiptTypes } = await import('@/features/settings/receipt-types/api/receipt-types-api');
      const { fetchPaymentMethods } = await import('@/features/settings/payments/methods/api/payment-methods-api');
      const { createPaymentAction } = await import('@/app/actions/payments');
      const { createReceiptAction } = await import('@/app/actions/receipts');
      const { updateProductInventoryAction } = await import('@/app/actions/products');
      
      // Fetch settings data from DB
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
      
      // ✅ Find default accounts by type
      const defaultCashAccount = accounts.find(acc => acc.isDefault && acc.type === 'CASH') || accounts.find(acc => acc.type === 'CASH');
      const defaultBankAccount = accounts.find(acc => acc.isDefault && acc.type === 'BANK') || accounts.find(acc => acc.type === 'BANK');
      
      if (!defaultCashAccount && !defaultBankAccount) {
        toast.error("Không tìm thấy tài khoản quỹ mặc định");
        return;
      }
      
      // ✅ Find payment methods by name (support both Vietnamese and English)
      const cashMethod = paymentMethodsFromApi.find(m => (m.name.toLowerCase().includes('tiền mặt') || m.name.toLowerCase().includes('cash')) && m.isActive);
      const bankMethod = paymentMethodsFromApi.find(m => (m.name.toLowerCase().includes('chuyển khoản') || m.name.toLowerCase().includes('bank') || m.name.toLowerCase().includes('transfer')) && m.isActive);
      
      // 1. TAO PHIEU CHI - CHI KHI HOAN TIEN
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
          // ✅ Use bank account for bank transfer, cash account for cash
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
        
        // ✅ Use Server Action to persist to database
        const paymentResult = await createPaymentAction(paymentData);
        if (!paymentResult.success) {
          toast.error(paymentResult.error || 'Lỗi tạo phiếu chi');
          return;
        }
        const addedPayment = paymentResult.data as { systemId: string; id: string } | undefined;
        paymentSystemId = addedPayment?.systemId as SystemId | undefined;
        paymentId = addedPayment?.id as BusinessId | undefined;
        
      } else {
        // Đổi hàng - KHÔNG tạo phiếu chi
      }
      
      // 2. TAO PHIEU THU - CHI PHI PHAT SINH TU NHAN VIEN
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
          // ✅ Use cash account with cash method for penalty collection
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
        
        // ✅ Use Server Action to persist to database
        const receiptResult = await createReceiptAction(receiptData);
        if (!receiptResult.success) {
          toast.error(receiptResult.error || 'Lỗi tạo phiếu thu');
          return;
        }
        const addedReceipt = receiptResult.data as { systemId: string; id: string } | undefined;
        receiptSystemId = addedReceipt?.systemId as SystemId | undefined;
        receiptId = addedReceipt?.id as BusinessId | undefined;
      }
      
      // ĐIỀU CHỈNH KHO THEO SỐ LƯỢNG NHẬP TỪ NGƯỜI XÁC MINH
      let inventoryAdjustment;
      if (complaint.affectedProducts && complaint.affectedProducts.length > 0) {
        // ⚡ OPTIMIZE: Use pre-memoized relatedOrder instead of searching
        const branchSystemId = relatedOrder?.branchSystemId || employee?.branchSystemId || asSystemId('default_branch');
        
        // Dung inventoryAdjustments - so luong nhap tay tu user (+ hoac -)
        const adjustedItems = complaint.affectedProducts
          .map(p => {
            // Lấy số lượng điều chỉnh kho (user nhập, có thể âm hoặc dương)
            const adjustQuantity = inventoryAdjustments?.[p.productSystemId] ?? 0;
            if (adjustQuantity === 0) return null; // Bỏ qua nếu không điều chỉnh
            
            const issueLabel = p.issueType === 'missing' ? 'Thiếu' : p.issueType === 'excess' ? 'Thừa' : p.issueType === 'defective' ? 'Hỏng' : 'Khác';
            const adjustLabel = adjustQuantity > 0 ? `+${adjustQuantity}` : adjustQuantity;
            return {
              productSystemId: p.productSystemId,
              productId: p.productId,
              productName: p.productName,
              quantityAdjusted: adjustQuantity,
              reason: `Điều chỉnh kho khiếu nại ${complaint.id} (${issueLabel}: ${adjustLabel})`,
              branchSystemId: branchSystemId,
            };
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item));
        
        // ✅ Use Server Action to update inventory in database (parallel)
        await Promise.all(adjustedItems.map(item =>
          updateProductInventoryAction(
            item.productSystemId,
            item.branchSystemId,
            Math.abs(item.quantityAdjusted),
            item.quantityAdjusted > 0 ? 'add' : 'subtract'
          )
        ));
        
        if (adjustedItems.length > 0) {
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
      
      const penaltyEmployeeName = responsibleEmployee?.fullName;

      const newAction: ComplaintAction = {
        id: asSystemId(generateSubEntityId('ACTION')),
        actionType: "verified-correct",
        performedBy: currentUser.systemId,
        performedAt: new Date(),
        note: `Phương án: ${method === "refund" ? "Hoàn tiền" : "Bù trả hàng"}${method === "refund" ? `\nSố tiền hoàn trả: ${cost.toLocaleString("vi-VN")} đ` : ''}\nChi phí phát sinh: ${incurredCost.toLocaleString("vi-VN")} đ\nLý do: ${reason}${paymentId ? `\nĐã tạo phiếu chi: ${paymentId}` : ''}${incurredCost > 0 && receiptId ? `\nĐã tạo phiếu thu: ${receiptId}${penaltyEmployeeName ? ` (Thu từ ${penaltyEmployeeName})` : ''}` : ''}${inventoryAdjustment ? `\nĐã điều chỉnh kho: ${inventoryAdjustment.items.length} sản phẩm` : ''}`,
        metadata: {
          method,
          cost,
          incurredCost,
          reason,
          paymentSystemId,
          receiptSystemId,
        },
      };
      
      // DEBUG: Log metadata duoc luu
      
      // Update affectedProducts voi so luong da xac minh
      const updatedAffectedProducts = complaint.affectedProducts?.map(p => ({
        ...p,
        quantityMissing: confirmedQuantities?.[p.productSystemId] ?? p.quantityMissing, // Update voi so luong xac minh
      }));
      
      updateComplaint(complaint.systemId, {
        isVerifiedCorrect: true,
        verification: "verified-correct",
        resolution: method === "refund" ? "refund" : "replacement",
        resolutionNote: method === "refund" 
          ? `Hoàn tiền: ${cost.toLocaleString("vi-VN")} đ\nChi phí phát sinh: ${incurredCost.toLocaleString("vi-VN")} đ\nLý do: ${reason}`
          : `Bù trả hàng cho khách\nChi phí phát sinh: ${incurredCost.toLocaleString("vi-VN")} đ\nLý do: ${reason}`,
        compensationAmount: cost,
        incurredCost: incurredCost,
        compensationReason: reason,
        affectedProducts: updatedAffectedProducts, // Luu so luong da xac minh
        inventoryAdjustment: inventoryAdjustment, // Luu thong tin dieu chinh kho
        timeline: [...(complaint.timeline || []), newAction],
      } as Partial<Complaint>);
      
      const successMessage = method === "refund" 
        ? "Đã xác nhận khiếu nại đúng và tạo phiếu hoàn tiền"
        : "Đã xác nhận khiếu nại đúng, ghi nhận bù trả hàng cho khách";
      complaintNotifications.onVerified(successMessage);
    } catch (error) {
      logError('Error creating payment/receipt', error);
      toast.error("Có lỗi khi tạo phiếu chi");
    }
  }, [complaint, updateComplaint, employee, currentUser, assignedEmployee, relatedOrder]);
  // ⚡ OPTIMIZED: Removed employees, orders arrays from deps - use memoized assignedEmployee, relatedOrder instead

  // REPLACED: handleSubmitIncorrectEvidence → verificationHandlers.handleSubmitIncorrectEvidence
  const handleSubmitIncorrectEvidence = verificationHandlers.handleSubmitIncorrectEvidence;

  // REPLACED: handleEndComplaint → complaintHandlers.handleEndComplaint
  const handleEndComplaint = complaintHandlers.handleEndComplaint;

  const handleCancelComplaint = React.useCallback(async () => {
    if (!complaint) return;
    
    setConfirmDialogConfig({
      title: "Xác nhận hủy khiếu nại",
      description: "Bạn có chắc muốn hủy khiếu nại này? Các phiếu chi/thu sẽ được đánh dấu 'cancelled' (giữ audit trail).",
      confirmText: "Hủy khiếu nại",
      variant: "destructive",
      onConfirm: async () => {
        await cancelComplaintHandler(complaint, currentUser, updateComplaint);
        // Invalidate all related entity caches so UI refreshes
        invalidateRelated(queryClient, 'complaints');
        // Toast handled by handler itself
      }
    });
    setConfirmDialogOpen(true);
  }, [complaint, updateComplaint, currentUser, queryClient]);

  const handleReopenComplaint = React.useCallback(async () => {
    if (!complaint) return;
    
    // Build description based on current status
    let description = "Bạn có chắc muốn mở lại khiếu nại này?";
    
    if (complaint.status === 'cancelled') {
      // Case 1: Mở lại từ "Đã hủy"
      description = "Bạn có chắc muốn mở lại khiếu nại đã hủy? Các phiếu đã hủy sẽ được giữ nguyên để audit.";
    } else if (complaint.status === 'resolved') {
      // Case 2: Mở lại từ "Đã kết thúc"
      description = "Bạn có chắc muốn mở lại khiếu nại đã kết thúc? Tất cả dữ liệu xử lý sẽ được giữ nguyên.";
    }
    
    setConfirmDialogConfig({
      title: "Xác nhận mở lại khiếu nại",
      description,
      confirmText: "Mở lại",
      variant: "default",
      onConfirm: async () => {
        await reopenComplaintHandler(complaint, currentUser, updateComplaint);
        // Invalidate related entity caches
        invalidateRelated(queryClient, 'complaints');
        // Toast handled by handler itself
      }
    });
    setConfirmDialogOpen(true);
  }, [complaint, updateComplaint, currentUser, queryClient]);

  // Image preview handler
  const handleImagePreview = React.useCallback((images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setShowImagePreview(true);
  }, []);

  // Left-side utility buttons (near title)
  const leftHeaderActions = React.useMemo(() => {
    if (!complaint) return [];
    return [
      <Button
        key="templates"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => { setTemplatesLoaded(true); setTemplateDialogOpen(true); }}
      >
        Mẫu phản hồi
      </Button>,
      <Button
        key="copy"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => router.push(`/complaints/new?copyFrom=${complaint.systemId}`)}
      >
        <Copy className="mr-2 h-4 w-4" />
        Sao chép
      </Button>,
    ];
  }, [complaint, router]);

  // Right-side action buttons
  const headerActions = React.useMemo(() => {
    if (!complaint) return [];
    
    const actions: React.ReactNode[] = [];

    // Add Cancel button (for active complaints only - requires creator/admin permission)
    if (canCancel) {
      actions.push(
        <Button
          key="cancel"
          variant="outline"
          size="sm"
          className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleCancelComplaint}
        >
          Hủy khiếu nại
        </Button>
      );
    }

    // Add Edit button if allowed
    if (canEdit) {
      actions.push(
        <Button
          key="edit"
          variant="default"
          size="sm"
          className="h-9"
          onClick={() => router.push(`/complaints/${systemId}/edit`)}
        >
          Sửa
        </Button>
      );
    }

    // Add End button if allowed
    if (canEnd) {
      actions.push(
        <Button
          key="end"
          variant="default"
          size="sm"
          className="h-9"
          onClick={handleEndComplaint}
        >
          Kết thúc
        </Button>
      );
    }

    // Add Reopen button for resolved/rejected complaints
    if (canReopen) {
      actions.push(
        <Button
          key="reopen"
          variant="default"
          size="sm"
          className="h-9"
          onClick={handleReopenComplaint}
        >
          Mở lại
        </Button>
      );
    }

    return actions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    complaint,
    canEdit,
    canEnd,
    canReopen,
    canCancel,
    systemId,
    router,
  ]);

  // Set page header: replaced by ComplaintHeaderSection component
  // (see ./components/complaint-header-section.tsx)

  // Show loading state while fetching data
  if (isLoadingComplaint) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-h4 font-semibold mb-2">Không tìm thấy khiếu nại</h3>
          <Button className="h-9" onClick={() => router.push("/complaints")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // relatedOrder already memoized above (line 170)

  return (
    <div className="w-full h-full">
      <div className="space-y-6">
        <ComplaintHeaderSection complaint={complaint} timeTracking={timeTracking} headerActions={headerActions} leftActions={leftHeaderActions} />
        {/* Verification Card - Full Width at Top */}
        {!isVerified && complaint.status !== "cancelled" && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>
              Xác minh khiếu nại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                className="flex-1 h-9"
                variant="default"
                onClick={handleVerifyCorrectClick}
              >
                Khiếu nại Đúng
              </Button>
              <Button
                className="flex-1 h-9"
                variant="outline"
                onClick={handleVerifyIncorrect}
              >
                Khiếu nại Sai
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Card - Full Width at Top */}
      <ComplaintProcessingCard 
        complaint={complaint}
        onProcessCompensation={handleProcessCompensation}
        onProcessInventory={handleProcessInventory}
      />

      {/* Info Row - 2 columns: (Info + Customer + Order stacked 70%) | (Workflow 30%) */}
      <div className="grid gap-6 lg:grid-cols-[70%_1fr]">
        {/* Column 1: Info cards stacked */}
        <div className="space-y-6">
          {/* Complaint Details Card - includes badges + tracking link */}
          <ComplaintDetailsCard 
            complaint={complaint}
            currentUser={currentUser}
            employees={employees}
            trackingEnabled={trackingEnabled}
            timeTracking={timeTracking}
            onGenerateTrackingCode={async () => {
              const code = Math.random().toString(36).substring(2, 12);
              await updateComplaint(complaint.systemId, { publicTrackingCode: code } as Partial<Complaint>);
              toast.success('Đã tạo mã tracking công khai');
            }}
          />

        {/* Customer Info Card - below complaint details */}
        <ComplaintCustomerInfoCard
          complaint={complaint}
          orderCustomerSystemId={(relatedOrder as Record<string, unknown> | null)?.customerSystemId as string | undefined}
        />

        {/* Order Information Card */}
        <ComplaintOrderInfo 
          complaint={complaint}
          relatedOrder={relatedOrder ?? undefined}
          employees={employees}
        />
        </div>

        {/* Column 2: Workflow */}
        <div className="space-y-6">
          <ComplaintWorkflowSection 
            complaint={complaint}
            currentUser={currentUser}
            updateComplaint={updateComplaint}
          />
        </div>
      </div>

          {/* Card: Sản phẩm bị ảnh hưởng */}
          <ComplaintAffectedProducts complaint={complaint} />

      {/* Images Row - 2 columns: Customer (50%) | Employee (50%) */}
      <ComplaintImagesSection 
        complaint={complaint}
        onImagePreview={handleImagePreview}
      />

      {/* Comments Section - Full Width (persisted via /api/comments) */}
      <ComplaintCommentsSection
        complaint={complaint}
        employees={employees}
      />

      {/* Timeline - Full Width */}
      <ComplaintTimelineSection
        complaintId={complaint.systemId}
      />

      {/* Template Dialog */}
      <TemplateDialog 
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        templates={templates}
      />

      {/* Confirm Correct Dialog - Simple confirmation */}
      <ConfirmCorrectDialog
        open={confirmCorrectDialogOpen}
        onOpenChange={setConfirmCorrectDialogOpen}
        complaint={complaint}
        onConfirm={handleConfirmCorrect}
      />

      {/* Compensation Payment/Receipt Wizard */}
                <CompensationPaymentReceiptWizard
        open={compensationDialogOpen}
        onOpenChange={setCompensationDialogOpen}
        complaint={complaint}
        accounts={[]} // Will be lazy-loaded in wizard
        employees={employees}
        onComplete={handleCompensationComplete}
      />

      {/* Inventory Dialog - Handle stock adjustment */}
      <InventoryDialog
        open={inventoryDialogOpen}
        onOpenChange={setInventoryDialogOpen}
        complaint={complaint}
        onSubmit={handleInventoryAdjustment}
      />

      {/* Verification Dialog - For incorrect verification only */}
      <VerificationDialog
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
        mode={verificationMode}
        complaint={complaint} //  Pass complaint to show affected products
        onSubmitCorrect={handleSubmitCorrectResolution}
        onSubmitIncorrect={handleSubmitIncorrectEvidence}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={confirmDialogConfig.title}
        description={confirmDialogConfig.description}
        confirmText={confirmDialogConfig.confirmText ?? "Xác nhận"}
        variant={confirmDialogConfig.variant ?? "default"}
        onConfirm={confirmDialogConfig.onConfirm}
      />

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        images={previewImages}
        initialIndex={previewIndex}
        open={showImagePreview}
        onOpenChange={setShowImagePreview}
        title="Hình ảnh khiếu nại"
      />
      </div>
    </div>
  );
}
