/**
 * Compensation Payment/Receipt Wizard
 * 
 * Dialog for creating compensation payments/receipts from complaints:
 * - Create payment (refund to customer)
 * - Create receipt (charge to employee) - optional
 */

import * as React from "react";
import { formatDateForDisplay } from '@/lib/date-utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Payment } from "@/features/payments/types";
import type { Receipt } from "@/features/receipts/types";
import type { CashAccount } from "@/features/cashbook/types";
import type { Employee } from "@/features/employees/types";
import type { Complaint } from "../types";
import { type SystemId } from "@/lib/id-types";
import { useAuth } from "@/contexts/auth-context";
// ✅ All data now fetched from Server Actions (DB)
import type { Penalty, PenaltyType } from "@/features/settings/penalties/types";
import type { PenaltyTypeSetting } from "@/features/settings/penalty-types/api/penalty-types-api";
import { logError } from '@/lib/logger'

export interface CompensationResult {
  payment?: Payment;  // Optional - only for refund
  receipt?: Receipt;
  penalties?: Penalty[]; // NEW: Penalties created
  inventoryCheckSystemId?: SystemId; // NEW: Link to inventory check nếu tạo
  inventoryAdjustments?: Array<{
    productSystemId: SystemId;
    productId: string;
    productName: string;
    quantityAdjusted: number;
  }>;
  compensationDate: string;
  reason: string;
}

// Who bears the incurred cost
type CostBearer = 'customer' | 'company' | 'employee';

interface CompensationPaymentReceiptWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint;
  accounts: CashAccount[]; // Can be empty, will lazy-load if needed
  employees: Employee[];
  onComplete: (result: CompensationResult) => void;
}

export function CompensationPaymentReceiptWizard({
  open,
  onOpenChange,
  complaint,
  accounts: accountsProp,
  employees,
  onComplete,
}: CompensationPaymentReceiptWizardProps) {
  const { user, employee: currentEmployee } = useAuth();
  const [resolutionMethod, setResolutionMethod] = React.useState<"refund" | "replace">("refund");
  const [compensationCost, setCompensationCost] = React.useState<number>(0);
  const [incurredCost, setIncurredCost] = React.useState<number>(0);
  const [resolutionReason, setResolutionReason] = React.useState("");
  const [responsibleEmployeeId, setResponsibleEmployeeId] = React.useState<string>("");
  const [accounts, setAccounts] = React.useState<CashAccount[]>(accountsProp);
  const [paymentMethods, setPaymentMethods] = React.useState<Array<{systemId: string; name: string; type?: string | null; isDefault: boolean}>>([]);
  
  // NEW: Cost bearer & penalty type fields
  const [costBearer, setCostBearer] = React.useState<CostBearer>('company');
  const [selectedPenaltyTypeId, setSelectedPenaltyTypeId] = React.useState<string>("");
  const [complaintPenaltyTypes, setComplaintPenaltyTypes] = React.useState<PenaltyType[]>([]);
  
  // NEW: Additional fields
  const [recognitionDate, setRecognitionDate] = React.useState<Date | undefined>(undefined);
  const [paymentMethodId, setPaymentMethodId] = React.useState<string>("");
  const [selectedAccountId, setSelectedAccountId] = React.useState<string>("");

  // Hydration-safe initialization
  React.useEffect(() => {
    setRecognitionDate(new Date());
  }, []);

  // Lazy-load accounts from API if not provided
  // OPTIMIZED: Load all required data in parallel when dialog opens
  React.useEffect(() => {
    if (!open) return;
    
    const loadData = async () => {
      try {
        const [
          { fetchActiveCashAccounts },
          { fetchPaymentMethods },
          { fetchAllPenaltyTypes }
        ] = await Promise.all([
          import('@/features/cashbook/api/cashbook-api'),
          import('@/features/settings/payments/methods/api/payment-methods-api'),
          import('@/features/settings/penalty-types/api/penalty-types-api'),
        ]);
        
        // Fetch all data in parallel
        const [accountsData, paymentMethodsResult, penaltyTypesResult] = await Promise.all([
          accounts.length === 0 ? fetchActiveCashAccounts().catch(() => []) : Promise.resolve(null),
          paymentMethods.length === 0 ? fetchPaymentMethods({ isActive: true }).catch(() => ({ data: [] })) : Promise.resolve(null),
          complaintPenaltyTypes.length === 0 ? fetchAllPenaltyTypes().catch(() => ({ data: [] })) : Promise.resolve(null),
        ]);
        
        // Update state
        if (accountsData && accountsData.length > 0) {
          setAccounts(accountsData);
        }
        
        if (paymentMethodsResult?.data && paymentMethodsResult.data.length > 0) {
          const methods = paymentMethodsResult.data;
          setPaymentMethods(methods);
          const defaultMethod = methods.find((m: { isDefault: boolean }) => m.isDefault) || methods[0];
          if (defaultMethod && !paymentMethodId) {
            setPaymentMethodId(defaultMethod.systemId);
          }
        }
        
        if (penaltyTypesResult?.data && penaltyTypesResult.data.length > 0) {
          const complaintTypes = penaltyTypesResult.data
            .filter((pt: PenaltyTypeSetting) => pt.category === 'complaint' && pt.isActive !== false)
            .sort((a: PenaltyTypeSetting, b: PenaltyTypeSetting) => ((a as unknown as { order?: number }).order || 0) - ((b as unknown as { order?: number }).order || 0));
          setComplaintPenaltyTypes(complaintTypes as unknown as PenaltyType[]);
        }
      } catch (error) {
        logError('Error loading dialog data', error);
      }
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // Only depend on open - avoid re-fetching
  
  // Set default account when accounts loaded
  React.useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      const defaultAcc = accounts.find(acc => acc.isDefault && acc.type === 'cash') || accounts[0];
      if (defaultAcc) {
        setSelectedAccountId(defaultAcc.systemId);
      }
    }
  }, [accounts, selectedAccountId]);
  
  // Filter accounts based on selected payment method
  // Filter accounts - so sánh trực tiếp type từ DB
  const filteredAccounts = React.useMemo(() => {
    if (!paymentMethodId || paymentMethods.length === 0) return accounts;
    
    const selectedMethod = paymentMethods.find(m => m.systemId === paymentMethodId);
    if (!selectedMethod?.type) return accounts;
    
    const matched = accounts.filter(acc => acc.type === selectedMethod.type);
    return matched.length > 0 ? matched : accounts;
  }, [accounts, paymentMethodId, paymentMethods]);
  
  // Auto-update selected account when filter changes
  React.useEffect(() => {
    if (filteredAccounts.length > 0 && !filteredAccounts.find(acc => acc.systemId === selectedAccountId)) {
      // Nếu account hiện tại không còn trong danh sách -> chọn mặc định
      const defaultAcc = filteredAccounts.find(acc => acc.isDefault) || filteredAccounts[0];
      if (defaultAcc) {
        setSelectedAccountId(defaultAcc.systemId);
      }
    }
  }, [filteredAccounts, selectedAccountId]);

  // Auto-fill compensation cost from affected products total value
  React.useEffect(() => {
    if (open && complaint?.affectedProducts && complaint.affectedProducts.length > 0 && compensationCost === 0) {
      const total = complaint.affectedProducts.reduce((sum, p) => {
        // Tính giá trị dựa trên số lượng thiếu/hỏng
        const issueQty = p.issueType === 'missing' ? (p.quantityMissing || 0)
          : p.issueType === 'defective' ? (p.quantityDefective || 0)
          : p.issueType === 'excess' ? (p.quantityExcess || 0)
          : 0;
        return sum + (issueQty * (p.unitPrice || 0));
      }, 0);
      if (total > 0) {
        setCompensationCost(total);
      }
    }
  }, [open, complaint, compensationCost]);

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setResolutionMethod("refund");
      setCompensationCost(0);
      setIncurredCost(0);
      setResolutionReason("");
      setResponsibleEmployeeId("");
      setRecognitionDate(new Date());
      setCostBearer('company');
      setSelectedPenaltyTypeId("");
      // Don't reset paymentMethodId and selectedAccountId - keep defaults
    }
  }, [open]);

  // ✅ Validation for button disabled state
  const isValid = React.useMemo(() => {
    // Must have reason
    if (!resolutionReason.trim()) return false;
    
    // Refund requires compensation amount
    if (resolutionMethod === 'refund' && compensationCost <= 0) return false;
    
    // Need account for company payments
    if ((resolutionMethod === 'refund' || (incurredCost > 0 && costBearer === 'company')) && !selectedAccountId) return false;
    
    // Need payment method for refund
    if (resolutionMethod === 'refund' && !paymentMethodId) return false;
    
    // Need employee for employee-borne costs
    if (incurredCost > 0 && costBearer === 'employee' && !responsibleEmployeeId && !complaint.assignedTo) return false;
    
    // Need employee for penalty
    if (selectedPenaltyTypeId && !responsibleEmployeeId && !complaint.assignedTo) return false;
    
    return true;
  }, [resolutionMethod, compensationCost, resolutionReason, selectedAccountId, paymentMethodId, incurredCost, costBearer, responsibleEmployeeId, complaint.assignedTo, selectedPenaltyTypeId]);

  const handleConfirmStep = async () => {
    // Validation dựa trên phương thức
    if (resolutionMethod === 'refund') {
      if (compensationCost <= 0) {
        toast.error("Vui lòng nhập số tiền hoàn trả cho khách");
        return;
      }
    }
    
    if (!resolutionReason.trim()) {
      toast.error("Vui lòng nhập lý do xử lý");
      return;
    }
    
    // Only require account if company pays for incurred cost OR refund
    if ((resolutionMethod === 'refund' || (incurredCost > 0 && costBearer === 'company')) && !selectedAccountId) {
      toast.error("Vui lòng chọn tài khoản quỹ");
      return;
    }
    
    // Validate employee for employee-related costs
    if (incurredCost > 0 && costBearer === 'employee') {
      if (!responsibleEmployeeId && !complaint.assignedTo) {
        toast.error("Vui lòng chọn nhân viên chịu chi phí phát sinh");
        return;
      }
    }
    
    // Validate penalty type if employee has fault
    if (selectedPenaltyTypeId && !responsibleEmployeeId && !complaint.assignedTo) {
      toast.error("Vui lòng chọn nhân viên bị phạt");
      return;
    }

    // Create payments/receipts immediately
    try {
      await createVouchers();
    } catch (error) {
      logError('Error creating payments/receipts', error);
      toast.error('Có lỗi khi tạo phiếu');
    }
  };

  const handleClose = () => {
    // Remove alert - just close directly
    onOpenChange(false);
  };

  // Create payments/receipts function
  const createVouchers = React.useCallback(async () => {
    try {
      // ✅ Use Server Actions and APIs for all persistence and data fetching
      const { createPaymentAction } = await import('@/app/actions/payments');
      const { createPenalty } = await import('@/features/settings/penalties/api/penalties-api');
      const { fetchPaymentTypes } = await import('@/features/settings/payments/types/api/payment-types-api');
      const { fetchBranches } = await import('@/features/settings/branches/api/branches-api');
      const { fetchOrder } = await import('@/features/orders/api/orders-api');
      
      // Get order ID - check both orderId and orderSystemId for compatibility
      const orderIdToFind = (complaint as unknown as { orderId?: string }).orderId || complaint.orderSystemId;
      
      // Fetch settings data from DB - OPTIMIZED: fetch single order instead of all
      // Order is optional - complaint might not have linked order
      const [paymentTypesResult, branchesResult, relatedOrder] = await Promise.all([
        fetchPaymentTypes({ isActive: true }),
        fetchBranches(),
        orderIdToFind ? fetchOrder(orderIdToFind).catch(() => null) : Promise.resolve(null),
      ]);
      
      const dbPaymentTypes = paymentTypesResult.data ?? [];
      const dbBranches = branchesResult.data || [];
      
      // Get branch info: prefer from order, fallback to complaint
      const branchSystemId = relatedOrder?.branchSystemId || complaint.branchSystemId;
      const branchFromDB = dbBranches.find((b: { systemId: string }) => b.systemId === branchSystemId);
      const branchName = branchFromDB?.name || relatedOrder?.branchName || complaint.branchName || 'Chi nhánh mặc định';
      
      if (!branchSystemId) {
        toast.error('Không xác định được chi nhánh. Vui lòng kiểm tra thông tin khiếu nại.');
        return;
      }

      const selectedAccount = accounts.find(acc => acc.systemId === selectedAccountId);

      let createdPayment: Payment | null = null;
      const createdPenalties: Penalty[] = [];

      // Lấy nhân viên được giao xử lý
      const assignedEmployee = employees.find(e => e.systemId === complaint.assignedTo);
      const targetEmployee = employees.find(e => e.systemId === responsibleEmployeeId) || assignedEmployee;
      // Lấy thông tin người đang đăng nhập (người lập phiếu phạt)
      const currentIssuerName = currentEmployee?.fullName || user?.name || user?.email || assignedEmployee?.fullName || 'Hệ thống';
      const currentIssuerSystemId = user?.systemId || currentEmployee?.systemId || assignedEmployee?.systemId;

      // 1. TẠO PHIẾU CHI KHI HOÀN TIỀN
      if (resolutionMethod === 'refund' && compensationCost > 0) {
        if (!selectedAccount) {
          toast.error("Vui lòng chọn tài khoản quỹ");
          return;
        }
        
        // Tìm loại phiếu chi phù hợp - fallback nếu không có loại chuyên dụng
        const complaintPaymentType = dbPaymentTypes.find((pt: { name: string }) => 
          pt.name.toLowerCase().includes('bù trừ') || 
          pt.name.toLowerCase().includes('khiếu nại') ||
          pt.name.toLowerCase().includes('hoàn tiền')
        ) || dbPaymentTypes.find((pt: { name: string }) => 
          pt.name.toLowerCase().includes('chi khác') ||
          pt.name.toLowerCase().includes('chi phí')
        ) || dbPaymentTypes[0]; // Fallback to first payment type
        
        if (!complaintPaymentType) {
          toast.error("Không có loại phiếu chi nào trong hệ thống. Vui lòng tạo loại phiếu chi trước.");
          return;
        }

        // Lấy phương thức thanh toán từ state (đã load trước đó)
        const selectedPaymentMethod = paymentMethods.find(pm => pm.systemId === paymentMethodId);
        if (!selectedPaymentMethod) {
          toast.error('Vui lòng chọn hình thức thanh toán');
          return;
        }
        
        const paymentData = {
          date: new Date().toISOString().split('T')[0],
          amount: compensationCost,
          description: `Bù trừ từ khiếu nại ${complaint.id}: ${resolutionReason}`,
          category: 'complaint_refund' as const,
          branchId: branchSystemId as string,
          branchSystemId: branchSystemId,
          branchName: branchName,
          accountSystemId: selectedAccount.systemId,
          paymentMethodSystemId: selectedPaymentMethod.systemId,
          paymentMethodName: selectedPaymentMethod.name,
          recipientTypeSystemId: 'KHACHHANG',
          recipientTypeName: 'Khách hàng',
          recipientName: complaint.customerName || 'Khách hàng',
          recipientSystemId: complaint.customerSystemId,
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
        createdPayment = paymentResult.data as Payment;
        toast.success(`Đã tạo phiếu chi ${createdPayment.id}`);
      } else if (resolutionMethod === 'replace') {
        // Đổi hàng - KHÔNG tạo phiếu chi
        toast.success('Đã ghi nhận bù trả hàng cho khách');
      }

      // 2. XỬ LÝ CHI PHÍ PHÁT SINH
      if (incurredCost > 0) {
        if (costBearer === 'company') {
          // Công ty chịu chi phí -> Tạo Phiếu chi
          if (!selectedAccount) {
            toast.error("Vui lòng chọn tài khoản quỹ");
            return;
          }
          
          const incurredCostPaymentType = dbPaymentTypes.find((pt: { name: string }) => 
            pt.name.toLowerCase().includes('chi phí phát sinh') ||
            pt.name.toLowerCase().includes('chi phí khác')
          ) || dbPaymentTypes[0];
          
          const selectedPaymentMethod = paymentMethods.find(pm => pm.systemId === paymentMethodId);
          
          const paymentData = {
            date: new Date().toISOString().split('T')[0],
            amount: incurredCost,
            description: `Chi phí phát sinh - ${resolutionReason}`,
            category: 'operational_expense' as const,
            branchId: branchSystemId as string,
            branchSystemId: branchSystemId,
            branchName: branchName,
            accountSystemId: selectedAccount.systemId,
            paymentMethodSystemId: selectedPaymentMethod?.systemId,
            paymentMethodName: selectedPaymentMethod?.name,
            recipientTypeSystemId: 'KHAC',
            recipientTypeName: 'Khác',
            recipientName: 'Chi phí phát sinh khiếu nại',
            paymentReceiptTypeSystemId: incurredCostPaymentType?.systemId,
            paymentReceiptTypeName: incurredCostPaymentType?.name || 'Chi phí phát sinh',
            linkedComplaintSystemId: complaint.systemId,
          };

          // ✅ Use Server Action to persist to database
          const incurredPaymentResult = await createPaymentAction(paymentData);
          if (!incurredPaymentResult.success) {
            toast.error(incurredPaymentResult.error || 'Lỗi tạo phiếu chi chi phí phát sinh');
            return;
          }
          const incurredPayment = incurredPaymentResult.data as { systemId: string; id: string } | undefined;
          toast.success(`Đã tạo phiếu chi chi phí phát sinh ${incurredPayment?.id}`);
          
        } else if (costBearer === 'employee') {
          // Nhân viên chịu chi phí -> Tạo Phiếu phạt "Thu hồi chi phí phát sinh"
          if (!targetEmployee) {
            toast.error("Không tìm thấy nhân viên chịu chi phí");
            return;
          }
          
          // Find penalty type "Thu hồi chi phí phát sinh"
          const recoveryPenaltyType = complaintPenaltyTypes.find(pt => 
            pt.name.toLowerCase().includes('thu hồi chi phí')
          );
          
          const penaltyData = {
            employeeSystemId: targetEmployee.systemId,
            employeeName: targetEmployee.fullName,
            reason: `Thu hồi chi phí phát sinh từ khiếu nại ${complaint.id}: ${resolutionReason}`,
            amount: incurredCost,
            date: (recognitionDate ?? new Date()).toISOString().split('T')[0],
            status: 'pending',
            issuerName: currentIssuerName,
            issuerSystemId: currentIssuerSystemId,
            linkedComplaintSystemId: complaint.systemId,
            linkedOrderSystemId: complaint.orderSystemId,
            penaltyTypeSystemId: recoveryPenaltyType?.systemId,
            penaltyTypeName: recoveryPenaltyType?.name || 'Thu hồi chi phí phát sinh',
            category: 'complaint',
          };

          // ✅ Use API to persist to database
          const penalty = await createPenalty(penaltyData as Partial<Penalty>);
          createdPenalties.push(penalty);
          toast.success(`Đã tạo phiếu phạt thu hồi chi phí ${penalty.id}`);
        }
        // costBearer === 'customer' -> Không tạo gì (ĐVVC thu từ khách)
      }

      // 3. TẠO PHIẾU PHẠT LỖI NHÂN VIÊN (nếu có)
      if (selectedPenaltyTypeId && targetEmployee) {
        const selectedPenaltyType = complaintPenaltyTypes.find(pt => pt.systemId === selectedPenaltyTypeId);
        
        if (selectedPenaltyType) {
          const penaltyData = {
            employeeSystemId: targetEmployee.systemId,
            employeeName: targetEmployee.fullName,
            reason: `Phạt lỗi từ khiếu nại ${complaint.id}: ${selectedPenaltyType.name} - ${resolutionReason}`,
            amount: selectedPenaltyType.defaultAmount,
            date: (recognitionDate ?? new Date()).toISOString().split('T')[0],
            status: 'pending',
            issuerName: currentIssuerName,
            issuerSystemId: currentIssuerSystemId,
            linkedComplaintSystemId: complaint.systemId,
            linkedOrderSystemId: complaint.orderSystemId,
            penaltyTypeSystemId: selectedPenaltyType.systemId,
            penaltyTypeName: selectedPenaltyType.name,
            category: 'complaint',
          };

          // ✅ Use API to persist to database
          const penalty = await createPenalty(penaltyData as Partial<Penalty>);
          createdPenalties.push(penalty);
          toast.success(`Đã tạo phiếu phạt ${penalty.id}`);
        }
      }

      // 4. Complete and callback
      if (!createdPayment && createdPenalties.length === 0 && resolutionMethod !== 'replace') {
        toast.error('Không tạo được phiếu nào');
        return;
      }

      const result: CompensationResult = {
        payment: createdPayment || undefined,
        penalties: createdPenalties.length > 0 ? createdPenalties : undefined,
        inventoryCheckSystemId: complaint.inventoryAdjustment?.inventoryCheckSystemId,
        inventoryAdjustments: complaint.inventoryAdjustment?.items.map(item => ({
          productSystemId: item.productSystemId,
          productId: item.productId,
          productName: item.productName,
          quantityAdjusted: item.quantityAdjusted,
        })),
        compensationDate: formatDateForDisplay(new Date()),
        reason: resolutionReason,
      } as CompensationResult;
      
      // Complete immediately without showing success dialog
      onComplete(result);
      onOpenChange(false);

    } catch (error) {
      logError('Error creating payments/receipts', error);
      toast.error('Có lỗi khi tạo phiếu');
      throw error;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compensationCost, incurredCost, resolutionReason, resolutionMethod, costBearer, selectedPenaltyTypeId, complaintPenaltyTypes, complaint, responsibleEmployeeId, employees, accounts, recognitionDate, paymentMethodId, paymentMethods, selectedAccountId, onComplete, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent mobileFullScreen className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xử lý bù trừ - Xác nhận thông tin</DialogTitle>
          <DialogDescription>
            {resolutionMethod === 'refund' 
              ? 'Hoàn tiền: Chuyển khoản trả tiền cho khách hàng'
              : 'Bù trả hàng: Gửi hàng bù trừ cho khách (không hoàn tiền)'}
          </DialogDescription>
        </DialogHeader>

        {/* Confirm Details */}
        <div className="space-y-4 py-3">
            {/* Resolution Method */}
            <div className="space-y-1.5">
              <Label>Phương thức xử lý</Label>
              <RadioGroup
                value={resolutionMethod}
                onValueChange={(value) => setResolutionMethod(value as "refund" | "replace")}
                className="grid grid-cols-2 gap-2"
              >
                <Label htmlFor="refund" className="flex items-center space-x-2 border rounded-lg p-2.5 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="refund" id="refund" />
                  <span className="flex-1">Hoàn tiền</span>
                </Label>
                <Label htmlFor="replace" className="flex items-center space-x-2 border rounded-lg p-2.5 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="replace" id="replace" />
                  <span className="flex-1">Bù trả hàng</span>
                </Label>
              </RadioGroup>
            </div>

            {/* Row 1: Số tiền hoàn trả + Chi phí phát sinh */}
            <div className="grid grid-cols-2 gap-3">
              {/* Compensation Cost - CHỈ HIỆN KHI HOÀN TIỀN */}
              {resolutionMethod === 'refund' && (
                <div className="space-y-1.5">
                   <Label htmlFor="incurred-cost">Số tiền hoàn trả cho khách</Label>
                  <CurrencyInput
                    id="compensation-cost"
                    value={compensationCost}
                    onChange={setCompensationCost}
                    placeholder="0"
                    className="h-9"
                  />
                </div>
              )}

              {/* Incurred Cost */}
              <div className="space-y-1.5">
                <Label htmlFor="incurred-cost">Chi phí phát sinh (nếu có)</Label>
                <CurrencyInput
                  id="incurred-cost"
                  value={incurredCost}
                  onChange={setIncurredCost}
                  placeholder="0"
                  className="h-9"
                />
              </div>
              
              {/* Người chịu chi phí phát sinh - hiển thị khi có chi phí */}
              {incurredCost > 0 && (
                <div className="space-y-1.5">
                  <Label>Người chịu chi phí phát sinh</Label>
                  <Select value={costBearer} onValueChange={(value) => setCostBearer(value as CostBearer)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn người chịu chi phí" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Khách hàng (ĐVVC thu)</SelectItem>
                      <SelectItem value="company">Công ty chịu</SelectItem>
                      <SelectItem value="employee">Nhân viên chịu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Row 2: Hình thức thanh toán + Tài khoản quỹ */}
            <div className="grid grid-cols-2 gap-3">
              {/* Hình thức thanh toán */}
              <div className="space-y-1.5">
                <Label htmlFor="payment-method">Hình thức thanh toán</Label>
                <Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hình thức" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.systemId} value={method.systemId}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tài khoản quỹ */}
              <div className="space-y-1.5">
                <Label htmlFor="account">Tài khoản quỹ</Label>
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tài khoản" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAccounts.map(account => (
                      <SelectItem key={account.systemId} value={account.systemId}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Nhân viên chịu trách nhiệm (nếu có) - Full width */}
            {((incurredCost > 0 && costBearer === 'employee') || selectedPenaltyTypeId) && (
              <div className="space-y-1.5">
                <Label htmlFor="responsible-employee" className="flex items-center gap-1">
                  Nhân viên chịu trách nhiệm <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={responsibleEmployeeId || complaint.assignedTo || ""} 
                  onValueChange={setResponsibleEmployeeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.systemId} value={emp.systemId}>
                        {emp.fullName} ({emp.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Row 4: Loại lỗi phạt nhân viên (optional) */}
            <div className="space-y-1.5">
              <Label>Loại lỗi phạt nhân viên (nếu có)</Label>
              <Select 
                value={selectedPenaltyTypeId || "none"} 
                onValueChange={(val) => setSelectedPenaltyTypeId(val === "none" ? "" : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại lỗi phạt (không bắt buộc)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Không phạt --</SelectItem>
                  {complaintPenaltyTypes
                    .filter(pt => !pt.name.toLowerCase().includes('thu hồi chi phí')) // Exclude recovery type
                    .map(penaltyType => (
                      <SelectItem key={penaltyType.systemId} value={penaltyType.systemId}>
                        {penaltyType.name} ({penaltyType.defaultAmount.toLocaleString('vi-VN')}đ)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lý do xử lý - Full width */}
            <div className="space-y-1.5">
              <Label htmlFor="reason" className="flex items-center gap-1">
                Lý do xử lý <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                value={resolutionReason}
                onChange={(e) => setResolutionReason(e.target.value)}
                placeholder={resolutionMethod === 'refund' 
                  ? "Nhập lý do hoàn tiền..." 
                  : "Nhập lý do bù trả hàng..."}
                rows={3}
                className="resize-none text-sm"
              />
            </div>

            {/* Summary */}
            {(compensationCost > 0 || incurredCost > 0 || selectedPenaltyTypeId) && (
              <div className="p-2.5 rounded-lg border bg-muted/50 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Tóm tắt các phiếu sẽ được tạo:</p>
                
                {/* Phiếu chi hoàn tiền khách */}
                {resolutionMethod === 'refund' && compensationCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phiếu chi (PC - hoàn tiền khách):</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      -{compensationCost.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                )}
                
                {/* Bù trả hàng */}
                {resolutionMethod === 'replace' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bù trả hàng:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Gửi hàng cho khách (không hoàn tiền)
                    </span>
                  </div>
                )}
                
                {/* Chi phí phát sinh */}
                {incurredCost > 0 && (
                  <>
                    {costBearer === 'customer' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Chi phí phát sinh (Khách chịu):</span>
                        <span className="font-semibold text-muted-foreground">
                          ĐVVC thu {incurredCost.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    )}
                    {costBearer === 'company' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phiếu chi (PC - chi phí phát sinh):</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          -{incurredCost.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    )}
                    {costBearer === 'employee' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phiếu phạt (PP - thu hồi chi phí):</span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          {incurredCost.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                    )}
                  </>
                )}
                
                {/* Phiếu phạt lỗi nhân viên */}
                {selectedPenaltyTypeId && (() => {
                  const selectedType = complaintPenaltyTypes.find(pt => pt.systemId === selectedPenaltyTypeId);
                  return selectedType ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phiếu phạt (PP - {selectedType.name}):</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {selectedType.defaultAmount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  ) : null;
                })()}
                
                {/* Tổng tác động quỹ */}
                {(compensationCost > 0 || (incurredCost > 0 && costBearer === 'company')) && (
                  <div className="flex justify-between text-sm pt-1 border-t">
                    <span className="font-medium">Tác động quỹ (tiền ra):</span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      -{((resolutionMethod === 'refund' ? compensationCost : 0) + 
                         (costBearer === 'company' ? incurredCost : 0)).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                )}
                
                {/* Tổng phạt nhân viên */}
                {(costBearer === 'employee' && incurredCost > 0 || selectedPenaltyTypeId) && (
                  <div className="flex justify-between text-sm pt-1 border-t">
                    <span className="font-medium">Tổng phạt nhân viên:</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      {((costBearer === 'employee' ? incurredCost : 0) + 
                        (selectedPenaltyTypeId ? (complaintPenaltyTypes.find(pt => pt.systemId === selectedPenaltyTypeId)?.defaultAmount || 0) : 0)
                      ).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleConfirmStep} disabled={!isValid}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
