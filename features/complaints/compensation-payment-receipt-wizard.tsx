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
import { VirtualizedCombobox, type ComboboxOption } from "@/components/ui/virtualized-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import type { Payment } from "../payments/types";
import type { Receipt } from "../receipts/types";
import type { CashAccount } from "../cashbook/types";
import type { Employee } from "../employees/types";
import type { Complaint } from "./types";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { usePaymentStore } from "../payments/store";
import { usePaymentTypeStore } from "../settings/payments/types/store";
import { useTargetGroupStore } from "../settings/target-groups/store";
import { useBranchStore } from "../settings/branches/store";
import { usePaymentMethodStore } from "../settings/payments/methods/store";
import { usePenaltyStore, usePenaltyTypeStore } from "../settings/penalties/store";
import type { Penalty, PenaltyType } from "../settings/penalties/types";

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
  const [resolutionMethod, setResolutionMethod] = React.useState<"refund" | "replace">("refund");
  const [compensationCost, setCompensationCost] = React.useState<number>(0);
  const [incurredCost, setIncurredCost] = React.useState<number>(0);
  const [resolutionReason, setResolutionReason] = React.useState("");
  const [responsibleEmployeeId, setResponsibleEmployeeId] = React.useState<string>("");
  const [accounts, setAccounts] = React.useState<CashAccount[]>(accountsProp);
  const [paymentMethods, setPaymentMethods] = React.useState<Array<{systemId: string; name: string; isDefault: boolean}>>([]);
  
  // NEW: Cost bearer & penalty type fields
  const [costBearer, setCostBearer] = React.useState<CostBearer>('company');
  const [selectedPenaltyTypeId, setSelectedPenaltyTypeId] = React.useState<string>("");
  const [complaintPenaltyTypes, setComplaintPenaltyTypes] = React.useState<PenaltyType[]>([]);
  
  // NEW: Additional fields
  const [recognitionDate, setRecognitionDate] = React.useState<Date>(new Date());
  const [paymentMethodId, setPaymentMethodId] = React.useState<string>(""); // Changed from paymentMethod string to ID
  const [selectedAccountId, setSelectedAccountId] = React.useState<string>("");

  // Lazy-load accounts if not provided
  React.useEffect(() => {
    if (open && accounts.length === 0) {
      import('../cashbook/store').then(({ useCashbookStore }) => {
        setAccounts(useCashbookStore.getState().accounts);
      });
    }
  }, [open, accounts.length]);
  
  // Lazy-load payment methods
  React.useEffect(() => {
    if (open && paymentMethods.length === 0) {
      import('../settings/payments/methods/store').then(({ usePaymentMethodStore }) => {
        const methods = usePaymentMethodStore.getState().data;
        setPaymentMethods(methods);
        // Set default method
        const defaultMethod = methods.find(m => m.isDefault) || methods[0];
        if (defaultMethod && !paymentMethodId) {
          setPaymentMethodId(defaultMethod.systemId);
        }
      });
    }
  }, [open, paymentMethods.length, paymentMethodId]);
  
  // Lazy-load penalty types (category = complaint)
  React.useEffect(() => {
    if (open && complaintPenaltyTypes.length === 0) {
      const penaltyTypes = usePenaltyTypeStore.getState().data;
      const complaintTypes = penaltyTypes
        .filter(pt => pt.category === 'complaint' && pt.isActive)
        .sort((a, b) => a.order - b.order);
      setComplaintPenaltyTypes(complaintTypes);
    }
  }, [open, complaintPenaltyTypes.length]);
  
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
  const filteredAccounts = React.useMemo(() => {
    if (!paymentMethodId || paymentMethods.length === 0) return accounts;
    
    const selectedMethod = paymentMethods.find(m => m.systemId === paymentMethodId);
    if (!selectedMethod) return accounts;
    
    // Nếu là "Tiền mặt" -> chỉ hiển thị type='cash'
    if (selectedMethod.name.toLowerCase().includes('tiền mặt') || 
        selectedMethod.name.toLowerCase() === 'cash') {
      return accounts.filter(acc => acc.type === 'cash');
    }
    
    // Các phương thức khác (Chuyển khoản, Quẹt thẻ, COD, etc.) -> hiển thị type='bank'
    return accounts.filter(acc => acc.type === 'bank');
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
      console.error('Error creating payments/receipts:', error);
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
      // Use static imports instead of lazy-loading to ensure same store instance
      const addPayment = usePaymentStore.getState().add;
      const addPenalty = usePenaltyStore.getState().add;
      const paymentTypes = usePaymentTypeStore.getState().data;
      const targetGroups = useTargetGroupStore.getState().data;
      const branches = useBranchStore.getState().data;
      const paymentMethods = usePaymentMethodStore.getState().data;
      const orders = await import('../orders/store').then(m => m.useOrderStore.getState().data);
      
      // Lấy đơn hàng gốc
      const relatedOrder = orders.find(o => o.systemId === complaint.orderSystemId);
      if (!relatedOrder) {
        toast.error('Không tìm thấy đơn hàng gốc');
        return;
      }

      const selectedAccount = accounts.find(acc => acc.systemId === selectedAccountId);

      let createdPayment: Payment | null = null;
      const createdPenalties: Penalty[] = [];

      // Lấy nhân viên được giao xử lý
      const assignedEmployee = employees.find(e => e.systemId === complaint.assignedTo);
      const targetEmployee = employees.find(e => e.systemId === responsibleEmployeeId) || assignedEmployee;

      // 1. TẠO PHIẾU CHI KHI HOÀN TIỀN
      if (resolutionMethod === 'refund' && compensationCost > 0) {
        if (!selectedAccount) {
          toast.error("Vui lòng chọn tài khoản quỹ");
          return;
        }
        
        const complaintPaymentType = paymentTypes.find(pt => 
          pt.name.toLowerCase().includes('bù trừ') || 
          pt.name.toLowerCase().includes('khiếu nại')
        );
        
        if (!complaintPaymentType) {
          toast.error("Không tìm thấy loại phiếu chi 'Bù trừ khiếu nại'");
          return;
        }

        // Lấy thông tin chi nhánh TỪ ĐƠN HÀNG GỐC
        const orderBranch = branches.find(b => b.systemId === relatedOrder.branchSystemId);
        
        // Lấy loại người nhận (Khách hàng)
        const customerTargetGroup = targetGroups.find(tg => 
          tg.name.toLowerCase().includes('khách hàng') || tg.systemId === 'KHACHHANG'
        );
        
        // Lấy phương thức thanh toán
        const selectedPaymentMethod = paymentMethods.find(pm => pm.systemId === paymentMethodId);
        if (!selectedPaymentMethod) {
          toast.error('Vui lòng chọn hình thức thanh toán');
          return;
        }
        
        const paymentData: Omit<Payment, 'systemId'> = {
          id: "",
          date: recognitionDate.toISOString(),
          amount: compensationCost,
          recipientTypeSystemId: customerTargetGroup?.systemId || 'KHACHHANG',
          recipientTypeName: customerTargetGroup?.name || 'Khách hàng',
          recipientName: complaint.customerName,
          recipientSystemId: complaint.customerSystemId,
          description: resolutionReason,
          paymentReceiptTypeSystemId: complaintPaymentType.systemId,
          paymentReceiptTypeName: complaintPaymentType.name,
          paymentMethodSystemId: selectedPaymentMethod.systemId,
          paymentMethodName: selectedPaymentMethod.name,
          accountSystemId: selectedAccount.systemId,
          branchSystemId: orderBranch?.systemId || relatedOrder.branchSystemId,
          branchName: orderBranch?.name || relatedOrder.branchName,
          status: 'completed' as const,
          createdBy: assignedEmployee?.fullName || 'Admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          affectsDebt: false,
          originalDocumentId: complaint.id,
          customerSystemId: complaint.customerSystemId,
          customerName: complaint.customerName,
          recognitionDate: recognitionDate.toISOString(),
        } as any;

        createdPayment = addPayment(paymentData);
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
          
          const incurredCostPaymentType = paymentTypes.find(pt => 
            pt.name.toLowerCase().includes('chi phí phát sinh') ||
            pt.name.toLowerCase().includes('chi phí khác')
          ) || paymentTypes[0];
          
          const orderBranch = branches.find(b => b.systemId === relatedOrder.branchSystemId);
          const selectedPaymentMethod = paymentMethods.find(pm => pm.systemId === paymentMethodId);
          
          const paymentData: Omit<Payment, 'systemId'> = {
            id: "",
            date: recognitionDate.toISOString(),
            amount: incurredCost,
            recipientTypeSystemId: 'KHAC',
            recipientTypeName: 'Khác',
            recipientName: 'Chi phí phát sinh khiếu nại',
            description: `Chi phí phát sinh - ${resolutionReason}`,
            paymentReceiptTypeSystemId: incurredCostPaymentType?.systemId || '',
            paymentReceiptTypeName: incurredCostPaymentType?.name || 'Chi phí phát sinh',
            paymentMethodSystemId: selectedPaymentMethod?.systemId || '',
            paymentMethodName: selectedPaymentMethod?.name || '',
            accountSystemId: selectedAccount.systemId,
            branchSystemId: orderBranch?.systemId || relatedOrder.branchSystemId,
            branchName: orderBranch?.name || relatedOrder.branchName,
            status: 'completed' as const,
            createdBy: assignedEmployee?.fullName || 'Admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            affectsDebt: false,
            originalDocumentId: complaint.id,
            recognitionDate: recognitionDate.toISOString(),
          } as any;

          const incurredPayment = addPayment(paymentData);
          toast.success(`Đã tạo phiếu chi chi phí phát sinh ${incurredPayment.id}`);
          
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
          
          const penaltyData: Omit<Penalty, 'systemId'> = {
            id: asBusinessId(""),
            employeeSystemId: targetEmployee.systemId,
            employeeName: targetEmployee.fullName,
            reason: `Thu hồi chi phí phát sinh từ khiếu nại ${complaint.id}: ${resolutionReason}`,
            amount: incurredCost,
            issueDate: recognitionDate.toISOString().split('T')[0],
            status: 'Chưa thanh toán',
            issuerName: assignedEmployee?.fullName || 'Admin',
            issuerSystemId: assignedEmployee?.systemId,
            linkedComplaintSystemId: complaint.systemId,
            linkedOrderSystemId: complaint.orderSystemId,
            penaltyTypeSystemId: recoveryPenaltyType?.systemId,
            penaltyTypeName: recoveryPenaltyType?.name || 'Thu hồi chi phí phát sinh',
            category: 'complaint',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const createdPenalty = addPenalty(penaltyData);
          createdPenalties.push(createdPenalty);
          toast.success(`Đã tạo phiếu phạt thu hồi chi phí ${createdPenalty.id}`);
        }
        // costBearer === 'customer' -> Không tạo gì (ĐVVC thu từ khách)
      }

      // 3. TẠO PHIẾU PHẠT LỖI NHÂN VIÊN (nếu có)
      if (selectedPenaltyTypeId && targetEmployee) {
        const selectedPenaltyType = complaintPenaltyTypes.find(pt => pt.systemId === selectedPenaltyTypeId);
        
        if (selectedPenaltyType) {
          const penaltyData: Omit<Penalty, 'systemId'> = {
            id: asBusinessId(""),
            employeeSystemId: targetEmployee.systemId,
            employeeName: targetEmployee.fullName,
            reason: `Phạt lỗi từ khiếu nại ${complaint.id}: ${selectedPenaltyType.name} - ${resolutionReason}`,
            amount: selectedPenaltyType.defaultAmount,
            issueDate: recognitionDate.toISOString().split('T')[0],
            status: 'Chưa thanh toán',
            issuerName: assignedEmployee?.fullName || 'Admin',
            issuerSystemId: assignedEmployee?.systemId,
            linkedComplaintSystemId: complaint.systemId,
            linkedOrderSystemId: complaint.orderSystemId,
            penaltyTypeSystemId: selectedPenaltyType.systemId,
            penaltyTypeName: selectedPenaltyType.name,
            category: 'complaint',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const createdPenalty = addPenalty(penaltyData);
          createdPenalties.push(createdPenalty);
          toast.success(`Đã tạo phiếu phạt ${createdPenalty.id}`);
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
      } as any;
      
      // Complete immediately without showing success dialog
      onComplete(result);
      onOpenChange(false);

    } catch (error) {
      console.error('Error creating payments/receipts:', error);
      toast.error('Có lỗi khi tạo phiếu');
      throw error;
    }
  }, [compensationCost, incurredCost, resolutionReason, resolutionMethod, costBearer, selectedPenaltyTypeId, complaintPenaltyTypes, complaint, responsibleEmployeeId, employees, accounts, recognitionDate, paymentMethodId, paymentMethods, selectedAccountId, onComplete, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <SelectTrigger className="h-9">
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
                  <SelectTrigger className="h-9">
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
                  <SelectTrigger className="h-9">
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
                <VirtualizedCombobox
                  value={
                    (responsibleEmployeeId || complaint.assignedTo)
                      ? (() => {
                          const emp = employees.find(e => e.systemId === (responsibleEmployeeId || complaint.assignedTo));
                          return emp ? {
                            value: emp.systemId,
                            label: emp.fullName,
                            subtitle: emp.id,
                          } : null;
                        })()
                      : null
                  }
                  onChange={(option) => setResponsibleEmployeeId(option?.value || "")}
                  options={employees.map(emp => ({
                    value: emp.systemId,
                    label: emp.fullName,
                    subtitle: emp.id,
                  }))}
                  placeholder="Chọn nhân viên"
                  searchPlaceholder="Tìm nhân viên..."
                />
              </div>
            )}
            
            {/* Row 4: Loại lỗi phạt nhân viên (optional) */}
            <div className="space-y-1.5">
              <Label>Loại lỗi phạt nhân viên (nếu có)</Label>
              <Select 
                value={selectedPenaltyTypeId || "none"} 
                onValueChange={(val) => setSelectedPenaltyTypeId(val === "none" ? "" : val)}
              >
                <SelectTrigger className="h-9">
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
                        <span className="font-semibold text-gray-600 dark:text-gray-400">
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
          <Button variant="outline" className="h-9" onClick={handleClose}>
            Hủy
          </Button>
          <Button className="h-9" onClick={handleConfirmStep}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
