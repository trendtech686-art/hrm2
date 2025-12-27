'use client'

import * as React from "react";
import { useRouter, useParams } from 'next/navigation';
import { toast } from "sonner";
import { asSystemId } from '@/lib/id-types';
import type { BusinessId, SystemId } from '@/lib/id-types';
import { cn } from "../../lib/utils";
import { FileUploadAPI } from "../../lib/file-upload-api";
import { showNotification, complaintNotifications } from "./notification-utils";
import { useAuth } from "../../contexts/auth-context";
import { useComplaintPermissions } from "./hooks/use-complaint-permissions";
import { useComplaintTimeTracking } from "./hooks/use-complaint-time-tracking";
import { useComplaintStatistics } from "./hooks/use-complaint-statistics";
import { useComplaintReminders } from "./hooks/use-complaint-reminders";
import { cancelPaymentsReceiptsAndInventoryChecks } from './utils/payment-receipt-reversal';
import { COMPLAINT_TOAST_MESSAGES as MSG } from './constants/toast-messages';
import { handleCancelComplaint as cancelComplaintHandler } from './handlers/cancel-handler';
import { handleReopenComplaint as reopenComplaintHandler } from './handlers/reopen-handler';
import { complaintResolutionLabels } from './types';
import type { Payment } from '../payments/types';
import type { Receipt } from '../receipts/types';

// Response template interface
interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  order: number;
}

// Load templates from localStorage
function loadTemplates(): ResponseTemplate[] {
  try {
    const stored = localStorage.getItem('complaints-templates');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load templates:', e);
  }
  // Default templates
  return [
    {
      id: '1',
      name: 'Xin lỗi - Lỗi sản phẩm',
      content: 'Kính chào Anh/Chị,\n\nChúng tôi xin chân thành xin lỗi về sản phẩm bị lỗi mà Anh/Chị đã nhận được. Đây là sự cố đáng tiếc và chúng tôi hiểu sự bất tiện mà điều này gây ra.\n\nChúng tôi đang xử lý khiếu nại của Anh/Chị và sẽ sớm có phương án giải quyết hợp lý nhất.\n\nTrân trọng,',
      category: 'product-defect',
      order: 1,
    },
    {
      id: '2',
      name: 'Xin lỗi - Giao hàng chậm',
      content: 'Kính chào Anh/Chị,\n\nChúng tôi xin lỗi vì đơn hàng của Anh/Chị đã bị giao chậm hơn so với dự kiến. Chúng tôi đã liên hệ với đơn vị vận chuyển để làm rõ nguyên nhân.\n\nChúng tôi sẽ có phương án bù trừ hợp lý cho sự chậm trễ này.\n\nTrân trọng,',
      category: 'shipping-delay',
      order: 2,
    },
    {
      id: '3',
      name: 'Xác nhận đang xử lý',
      content: 'Kính chào Anh/Chị,\n\nChúng tôi đã nhận được khiếu nại của Anh/Chị và đang tiến hành xác minh thông tin.\n\nChúng tôi sẽ phản hồi lại trong thời gian sớm nhất. Xin Anh/Chị vui lòng theo dõi.\n\nTrân trọng,',
      category: 'general',
      order: 3,
    },
  ];
}

// Types & Store
import type { Complaint, ComplaintAction } from "./types";
import { useComplaintStore } from "./store";
import type { StagingFile } from "../../lib/file-upload-api";
import { useProductStore } from "../products/store";

// UI Components
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ImagePreviewDialog } from "../../components/ui/image-preview-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { ConfirmCorrectDialog } from "./confirm-correct-dialog";
import { CompensationPaymentReceiptWizard, type CompensationResult } from "./compensation-payment-receipt-wizard";
import { InventoryDialog } from "./inventory-dialog";
import { VerificationDialog } from "./verification-dialog";
import { ComplaintHeaderSection } from "./components/complaint-header-section";
import { ComplaintTimelineSection } from "./components/complaint-timeline-section";
import { ComplaintAffectedProducts } from "./components/complaint-affected-products";
import { ComplaintOrderInfo } from "./components/complaint-order-info";
import { ComplaintImagesSection } from "./components/complaint-images-section";
import { ComplaintDetailsCard } from "./components/complaint-details-card";
import { ComplaintWorkflowSection } from "./components/complaint-workflow-section";
import { ComplaintProcessingCard } from "./components/complaint-processing-card";
import { TemplateDialog } from "./components/template-dialog";
import { Comments } from '../../components/Comments';
import type { WarrantyComment } from '../warranty/types';
import { ConfirmDialog } from "../../components/ui/confirm-dialog";
import { Printer } from 'lucide-react';
import { usePrint } from '../../lib/use-print';
import { 
  convertComplaintForPrint,
  mapComplaintToPrintData, 
  mapComplaintLineItems,
  createStoreSettings,
} from '../../lib/print/complaint-print-helper';
import { useBranchStore } from '../settings/branches/store';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';

// Hooks & Context
import { usePageHeader } from "../../contexts/page-header-context";
import { useEmployeeStore } from "../employees/store";
import { useOrderStore } from "../orders/store";
import {
  useComplaintHandlers,
  useVerificationHandlers,
  useCompensationHandlers,
  useInventoryHandlers,
} from "./hooks/index";

/**
 * MAIN PAGE COMPONENT - Complaint Detail (VIEW ONLY)
 */
export function ComplaintDetailPage() {
  console.time('ComplaintDetailPage Mount');
  
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { setPageHeader } = usePageHeader();

  console.time('Store Hooks');
  const { getComplaintById, assignComplaint, updateComplaint } = useComplaintStore();
  const { data: employees } = useEmployeeStore();
  const { data: orders } = useOrderStore();
  // REMOVED: Payments/receipts loaded separately in components that need them
  console.timeEnd('Store Hooks');

  // Get all employees for @mention in comments
  const employeeMentions = React.useMemo(() => {
    return employees
      .filter(e => !e.isDeleted)
      .map(e => ({
        id: e.systemId,
        label: e.fullName,
        avatar: e.avatarUrl,
      }));
  }, [employees]);

  console.time('Data Access');
  const complaint = systemId ? (getComplaintById(asSystemId(systemId)) ?? null) : null;
  
  console.log('Data Size:', {
    employees: employees.length,
    orders: orders.length,
  });
  console.timeEnd('Data Access');
  
  // Memoize frequently accessed data to avoid repeated searches
  console.time('Memoization');
  const relatedOrder = React.useMemo(() => 
    complaint ? orders.find(o => o.systemId === complaint.orderSystemId) : null,
    [complaint, orders]
  );
  
  const assignedEmployee = React.useMemo(() => 
    complaint?.assignedTo ? employees.find(e => e.systemId === complaint.assignedTo) : null,
    [complaint, employees]
  );
  
  const responsibleEmployee = React.useMemo(() => 
    complaint?.responsibleUserId ? employees.find(e => e.systemId === complaint.responsibleUserId) : null,
    [complaint, employees]
  );
  console.timeEnd('Memoization');
  
  //  Auth & Permissions
  console.time('Auth & Permissions');
  const { employee } = useAuth();
  const permissions = useComplaintPermissions(complaint);
  const timeTracking = useComplaintTimeTracking(complaint);
  const reminderStatus = useComplaintReminders(complaint);
  console.timeEnd('Auth & Permissions');
  
  React.useEffect(() => {
    console.timeEnd('ComplaintDetailPage Mount');
  }, []);
  
  // Current user (from auth context)
  const currentUser = employee 
    ? { systemId: employee.systemId, name: employee.fullName }
    : { systemId: asSystemId('SYSTEM'), name: 'Guest User' };

  console.log('Current User:', {
    hasEmployee: !!employee,
    currentUser,
    employeeFromAuth: employee ? {
      systemId: employee.systemId,
      fullName: employee.fullName
    } : null
  });

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
  const [templates] = React.useState<ResponseTemplate[]>(() => loadTemplates());
  
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
  
  // Comments state (Temporary - will be moved to store later)
  const [comments, setComments] = React.useState<WarrantyComment[]>([]);

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
  
  const handleVerifyCorrect = React.useCallback(() => {
    if (!complaint) return;
    
    //  Permission check
    if (!permissions.canVerify) {
      toast.error(permissions.reason || "Bạn không có quyền xác minh khiếu nại");
      return;
    }
    
    // MỞ ConfirmCorrectDialog (form đơn giản đã có sẵn)
    setConfirmCorrectDialogOpen(true);
  }, [complaint, permissions, setConfirmCorrectDialogOpen]);

  // NEW: Handler for "Xac nhan dung" button - Open simple confirm dialog
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

  const { findById: findBranchById } = useBranchStore();
  const { info: storeInfo } = useStoreInfoStore();
  const { print } = usePrint(complaint?.branchSystemId);

  const handlePrint = React.useCallback(() => {
    if (!complaint) return;

    const branch = complaint.branchSystemId ? findBranchById(complaint.branchSystemId) : undefined;

    // Use helper to convert complaint to print format
    const complaintForPrint = convertComplaintForPrint(complaint, {
      branch,
      assignee: assignedEmployee,
    });

    const storeSettings = createStoreSettings(storeInfo);

    const printData = mapComplaintToPrintData(complaintForPrint, storeSettings);
    const lineItems = mapComplaintLineItems(complaintForPrint.items);

    print('complaint', {
      data: printData,
      lineItems: lineItems
    });
  }, [complaint, storeInfo, print, findBranchById, assignedEmployee]);

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
      // LAZY LOAD: Only import stores when actually creating payments/receipts
      const { useCashbookStore } = await import('../cashbook/store');
      const { usePaymentTypeStore } = await import('../settings/payments/types/store');
      const { useReceiptTypeStore } = await import('../settings/receipt-types/store');
      const { usePaymentStore } = await import('../payments/store');
      const { useReceiptStore } = await import('../receipts/store');
      const { useProductStore } = await import('../products/store');
      
      const accounts = useCashbookStore.getState().accounts;
      const paymentTypes = usePaymentTypeStore.getState().data;
      const receiptTypes = useReceiptTypeStore.getState().data;
      const addPayment = usePaymentStore.getState().add;
      const addReceipt = useReceiptStore.getState().add;
      const updateInventory = useProductStore.getState().updateInventory;
      
      // Tìm default cash account
      const defaultAccount = accounts.find(acc => acc.isDefault && acc.type === 'cash');
      if (!defaultAccount) {
        toast.error("Không tìm thấy tài khoản quỹ mặc định");
        return;
      }
      
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
        
        const paymentData: Omit<Payment, 'systemId'> = {
          id: "" as any, // Empty string = auto-generate
          date: new Date().toISOString(),
          amount: cost,
          recipientName: complaint.customerName,
          recipientTypeSystemId: asSystemId('KHACHHANG'), // TargetGroup systemId
          recipientTypeName: 'Khách hàng',
          recipientSystemId: complaint.customerId ? asSystemId(complaint.customerId) : undefined,
          description: `Hoàn tiền khiếu nại ${complaint.id}\n${reason}`,
          paymentReceiptTypeSystemId: complaintPaymentType.systemId,
          paymentReceiptTypeName: complaintPaymentType.name,
          accountSystemId: defaultAccount.systemId,
          paymentMethodSystemId: asSystemId('CHUYENKHOAN'), // PaymentMethod systemId
          paymentMethodName: 'Chuyển khoản',
          branchSystemId: employee?.branchSystemId || asSystemId('default_branch'),
          branchName: 'Chi nhánh',
          status: 'completed',
          createdBy: asSystemId(employee?.systemId || currentUser.systemId || 'SYSTEM'),
          createdAt: new Date().toISOString(),
          affectsDebt: false,
          originalDocumentId: complaint.id,
          linkedComplaintSystemId: complaint.systemId,
          category: 'complaint_refund',
        };
        
        console.log('Creating payment:', {
          createdBy: paymentData.createdBy,
          employee: employee ? { systemId: employee.systemId, fullName: employee.fullName } : null,
          currentUser
        });
        
        const addedPayment = addPayment(paymentData);
        paymentSystemId = addedPayment?.systemId;
        paymentId = addedPayment?.id;
        
        console.log('Payment created:', {
          systemId: addedPayment?.systemId,
          businessId: addedPayment?.id,
          paymentSystemId
        });
      } else {
        // Đổi hàng - KHÔNG tạo phiếu chi
        console.log('Đổi hàng - không tạo phiếu chi, chỉ ghi nhận bù trả hàng');
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
        
        const receiptData: Omit<Receipt, 'systemId'> = {
          id: "" as any, // Empty string = auto-generate
          date: new Date().toISOString(),
          amount: incurredCost,
          payerName: responsibleEmployee.fullName,
          payerTypeSystemId: asSystemId('NHANVIEN'), // TargetGroup systemId
          payerTypeName: 'Nhân viên',
          payerSystemId: responsibleEmployee.systemId,
          description: `Thu chi phí phát sinh từ lỗi khiếu nại ${complaint.id}\nNhân viên: ${responsibleEmployee.fullName}\n${reason}`,
          paymentReceiptTypeSystemId: incurredCostReceiptType.systemId,
          paymentReceiptTypeName: incurredCostReceiptType.name,
          accountSystemId: defaultAccount.systemId,
          paymentMethodSystemId: asSystemId('TIENMAT'), // PaymentMethod systemId
          paymentMethodName: 'Tiền mặt',
          branchSystemId: employee?.branchSystemId || asSystemId('default_branch'),
          branchName: 'Chi nhánh',
          status: 'completed',
          createdBy: asSystemId(employee?.systemId || currentUser.systemId || 'SYSTEM'),
          createdAt: new Date().toISOString(),
          affectsDebt: false,
          originalDocumentId: complaint.id,
          linkedComplaintSystemId: complaint.systemId,
          category: 'customer_payment',
        };
        
        console.log('Creating receipt:', {
          createdBy: receiptData.createdBy,
          payerName: receiptData.payerName,
          responsibleEmployee: { systemId: responsibleEmployee.systemId, fullName: responsibleEmployee.fullName }
        });
        
        const addedReceipt = addReceipt(receiptData);
        receiptSystemId = addedReceipt?.systemId;
        receiptId = addedReceipt?.id;
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
            
            // Điều chỉnh kho trực tiếp với số user nhập (không cần tính toán)
            updateInventory(p.productSystemId, branchSystemId, adjustQuantity);
            
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
          .filter(Boolean) as any[];
        
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
        id: asSystemId(`action_${Date.now()}`),
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
      console.log('Saving action metadata:', {
        paymentSystemId,
        receiptSystemId,
        paymentFound: !!paymentSystemId,
        receiptFound: !!receiptSystemId,
      });
      
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
        timeline: [...complaint.timeline, newAction],
      } as any);
      
      const successMessage = method === "refund" 
        ? "Đã xác nhận khiếu nại đúng và tạo phiếu hoàn tiền"
        : "Đã xác nhận khiếu nại đúng, ghi nhận bù trả hàng cho khách";
      complaintNotifications.onVerified(successMessage);
    } catch (error) {
      console.error("Error creating payment/receipt:", error);
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
        // Toast handled by handler itself
      }
    });
    setConfirmDialogOpen(true);
  }, [complaint, updateComplaint, currentUser]);

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
        // Toast handled by handler itself
      }
    });
    setConfirmDialogOpen(true);
  }, [complaint, updateComplaint, currentUser]);

  // Comments handlers
  const handleCommentImageUpload = React.useCallback(async (file: File): Promise<string> => {
    if (!complaint) {
      throw new Error('Không tìm thấy khiếu nại để upload ảnh');
    }

    try {
      const asset = await FileUploadAPI.uploadComplaintCommentImage(complaint.systemId, file);
      return asset.url;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Không thể upload ảnh', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại'
      });
      throw error;
    }
  }, [complaint]);

  // Image preview handler
  const handleImagePreview = React.useCallback((images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setShowImagePreview(true);
  }, []);

  const handleAddComment = (content: string, contentText: string, attachments: string[], mentions: string[]) => {
    const newComment: WarrantyComment = {
      systemId: asSystemId(`comment_${Date.now()}`),
      createdBy: currentUser.systemId,
      createdBySystemId: asSystemId(currentUser.systemId),
      content,
      contentText,
      attachments,
      mentions: mentions.map(m => asSystemId(m)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComments(prev => [newComment, ...prev]);
  };

  const handleEditComment = (commentId: string, content: string, contentText: string) => {
    setComments(prev => prev.map(c => 
      c.systemId === commentId ? { ...c, content, contentText, updatedAt: new Date().toISOString(), isEdited: true } : c
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.systemId !== commentId));
  };

  const handleReplyComment = (parentId: string, content: string, contentText: string, attachments: string[], mentions: string[]) => {
    // For simplicity, just add as normal comment
    handleAddComment(content, contentText, attachments, mentions);
  };

  // Memoize header actions
  const headerActions = React.useMemo(() => {
    if (!complaint) return [];
    
    const actions: React.ReactNode[] = [];

    actions.push(
      <Button
        key="print"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={handlePrint}
      >
        <Printer className="mr-2 h-4 w-4" />
        In phiếu
      </Button>
    );

    // Add Change Verification buttons (for verified complaints that are not resolved/cancelled)
    if (isVerified && complaint.status !== "resolved" && complaint.status !== "cancelled") {
      if (complaint.verification !== "verified-correct") {
        actions.push(
          <Button
            key="change-to-correct"
            variant="default"
            size="sm"
            onClick={handleVerifyCorrect}
            className="h-9 bg-green-600 hover:bg-green-700"
          >
            Đổi sang: Đúng
          </Button>
        );
      }
      if (complaint.verification !== "verified-incorrect") {
        actions.push(
          <Button
            key="change-to-incorrect"
            variant="outline"
            size="sm"
            onClick={handleVerifyIncorrect}
            className="h-9 border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            Đổi sang: Sai
          </Button>
        );
      }
    }

    // Add Cancel button (for unresolved complaints)
    if (complaint.status !== "resolved" && complaint.status !== "cancelled") {
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

    // Add Back button
    actions.push(
      <Button
        key="back"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => router.push("/complaints")}
      >
        Quay lại
      </Button>
    );

    // Add Template button
    actions.push(
      <Button
        key="templates"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => setTemplateDialogOpen(true)}
      >
        Mẫu phản hồi
      </Button>
    );

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
    isVerified,
    canEdit,
    canEnd,
    canReopen,
    systemId,
    router,
  ]);

  // Set page header: replaced by ComplaintHeaderSection component
  // (see ./components/complaint-header-section.tsx)

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
        <ComplaintHeaderSection complaint={complaint} timeTracking={timeTracking} headerActions={headerActions} />
        {/* Verification Card - Full Width at Top */}
        {!isVerified && complaint.status !== "cancelled" && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-h4">
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

      {/* Info Row - 2 columns: (Info + Order stacked 70%) | (Workflow 30%) */}
      <div className="grid gap-6 lg:grid-cols-[70%_1fr]">
        {/* Column 1: Info cards stacked */}
        <div className="space-y-6">
          {/* Complaint Details Card */}
          <ComplaintDetailsCard 
            complaint={complaint}
            currentUser={currentUser}
            employees={employees}
          />

        {/* Column 2: Order Information Card */}
        <ComplaintOrderInfo 
          complaint={complaint}
          relatedOrder={relatedOrder}
          employees={employees}
        />
        </div>

        {/* Column 2: Workflow Process */}
        <ComplaintWorkflowSection 
          complaint={complaint}
          currentUser={currentUser}
          updateComplaint={updateComplaint}
        />
      </div>

      {/* Full-width cards section */}

      {/* Processing Card - Only show if there's any processing info */}
      <ComplaintProcessingCard 
        complaint={complaint}
        onProcessCompensation={handleProcessCompensation}
        onProcessInventory={handleProcessInventory}
      />

          {/* Card: Sản phẩm bị ảnh hưởng */}
          <ComplaintAffectedProducts complaint={complaint} />

      {/* Images Row - 2 columns: Customer (50%) | Employee (50%) */}
      <ComplaintImagesSection 
        complaint={complaint}
        onImagePreview={handleImagePreview}
      />

      {/* Comments Section - Full Width */}
      <Comments
        entityType="complaint"
        entityId={complaint.systemId}
        comments={comments.map(c => ({
          id: c.systemId,
          content: c.contentText || c.content,
          author: {
            systemId: c.createdBySystemId,
            name: employees.find(e => e.systemId === c.createdBySystemId)?.fullName || 'Unknown',
          },
          createdAt: new Date(c.createdAt),
          updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
          attachments: (c.attachments || []).map((url, idx) => ({
            id: `${c.systemId}-${idx}`,
            url,
            type: 'image' as const,
            name: `Attachment ${idx + 1}`,
          })),
          isEdited: c.isEdited,
        }))}
        onAddComment={(content) => {
          handleAddComment(content, content, [], []);
        }}
        onUpdateComment={(commentId, content) => {
          handleEditComment(commentId, content, content);
        }}
        onDeleteComment={(commentId) => {
          handleDeleteComment(commentId);
        }}
        mentions={employeeMentions}
      />

      {/* Timeline - Full Width */}
      <ComplaintTimelineSection
        complaint={complaint}
        employees={employees}
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
