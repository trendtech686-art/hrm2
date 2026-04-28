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
import { DetailPageShell, mobileBleedCardClass } from "@/components/layout/page-section";
import { cn } from "@/lib/utils";
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
import { useMeiliEmployeeSearch } from '@/hooks/use-meilisearch';
import { useOrder } from "@/features/orders/hooks/use-orders";
import { useComplaintHandlers } from "../hooks/use-complaint-handlers";
import { useVerificationHandlers } from "../hooks/use-verification-handlers";
import { useCompensationHandlers } from "../hooks/use-compensation-handlers";
import { useInventoryHandlers } from "../hooks/use-inventory-handlers";
import { useCorrectVerificationHandler } from "../hooks/use-correct-verification-handler";
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
  // Load employees for selectors - bật enabled để fetch khi cần
  const { data: employeesData } = useMeiliEmployeeSearch({
    query: '',
    limit: 100,
    debounceMs: 0,
  });
  const employees = employeesData?.data || [];
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

  // ✅ NEW: Extract correct verification handler
  const { handleCorrectVerification } = useCorrectVerificationHandler({
    complaint: complaint ?? null,
    currentUser,
    assignedEmployee,
    relatedOrder,
    employee,
    updateComplaint,
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

  // ✅ REPLACED: handleSubmitCorrectResolution → useCorrectVerificationHandler
  const handleSubmitCorrectResolution = React.useCallback(async (
    method: "refund" | "replace", 
    cost: number, 
    incurredCost: number, 
    reason: string,
    confirmedQuantities?: Record<SystemId, number>,
    inventoryAdjustments?: Record<SystemId, number>
  ) => {
    await handleCorrectVerification({
      method,
      cost,
      incurredCost,
      reason,
      confirmedQuantities,
      inventoryAdjustments,
    });
  }, [handleCorrectVerification]);

  // NEW: Handler for "Xử lý tồn kho" button
  const handleProcessInventory = React.useCallback(() => {
    if (!complaint) return;
    
    const canProcess = inventoryHandlers.handleProcessInventory();
    if (canProcess) {
      setInventoryDialogOpen(true);
    }
  }, [complaint, inventoryHandlers]);

  // NEW: Handler for inventory adjustment submission
  const handleInventoryAdjustment = inventoryHandlers.handleInventoryAdjustment;

  // NEW: Handler for "Xác nhận sai" button
  const handleVerifyIncorrect = React.useCallback(() => {
    if (!complaint) return;
    
    if (!permissions.canVerify) {
      toast.error(permissions.reason || "Bạn không có quyền xác minh khiếu nại");
      return;
    }
    
    setVerificationMode("incorrect");
    setVerificationDialogOpen(true);
  }, [complaint, permissions, setVerificationMode, setVerificationDialogOpen]);

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
        onClick={() => { setTemplatesLoaded(true); setTemplateDialogOpen(true); }}
      >
        Mẫu phản hồi
      </Button>,
      <Button
        key="copy"
        variant="outline"
        size="sm"
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
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
          <Button onClick={() => router.push("/complaints")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // relatedOrder already memoized above (line 170)

  return (
    <DetailPageShell gap="lg" className="h-full overflow-hidden max-w-full">
      {/* Page Header - renders via context, returns null */}
      <ComplaintHeaderSection complaint={complaint} timeTracking={timeTracking} headerActions={headerActions} leftActions={leftHeaderActions} />
      {/* Verification Card - Full Width at Top */}
      {!isVerified && complaint.status !== "cancelled" && (
        <Card className={cn("border-2 border-primary/20", mobileBleedCardClass)}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Xác minh khiếu nại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="default"
                size="lg"
                onClick={handleVerifyCorrectClick}
                className="h-12"
              >
                Đúng
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleVerifyIncorrect}
                className="h-12"
              >
                Sai
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

      {/* Info Row - Mobile: stacked, Desktop: 2 cols - Left: 70% Info cards, Right: 30% Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 lg:gap-6 overflow-x-hidden">
        {/* Column 1: Info cards stacked (Left side - 70%) */}
        <div className="space-y-4 min-w-0 overflow-x-hidden">
          {/* Complaint Details Card - includes badges + tracking link */}
          <ComplaintDetailsCard
            complaint={complaint}
            currentUser={currentUser}
            employees={employees}
            trackingEnabled={trackingEnabled}
            timeTracking={timeTracking}
            onGenerateTrackingCode={async () => {
              const code = crypto.randomUUID().replace(/-/g, '').slice(0, 10);
              await updateComplaint(complaint.systemId, { publicTrackingCode: code } as Partial<Complaint>);
              toast.success('Đã tạo mã tracking công khai');
            }}
          />

          {/* Order Information Card */}
          <ComplaintOrderInfo
            complaint={complaint}
            relatedOrder={relatedOrder ?? undefined}
            employees={employees}
          />
        </div>

        {/* Column 2: Customer Info + Workflow (Right side - 30%, sticky) */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Customer Info Card - above Workflow */}
          <ComplaintCustomerInfoCard
            complaint={complaint}
            orderCustomerSystemId={(relatedOrder as Record<string, unknown> | null)?.customerSystemId as string | undefined}
          />

          {/* Workflow Section */}
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
    </DetailPageShell>
  );
}
