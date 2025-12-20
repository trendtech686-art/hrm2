import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Banknote, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { PayrollBatch, Payslip } from '../../../lib/payroll-types';
import type { SystemId } from '../../../lib/id-types';
import type { Employee } from '../../employees/types';
import { usePaymentStore } from '../../payments/store';
import { useCashbookStore } from '../../cashbook/store';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';
import { asSystemId } from '../../../lib/id-types';

// =============================================
// TYPES
// =============================================

type CreatePaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: PayrollBatch | null;
  payslips: Payslip[];
  employeeLookup: Record<SystemId, Employee | undefined>;
  onSuccess?: () => void;
};

// =============================================
// HELPERS
// =============================================

const formatCurrency = (value: number) =>
  value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

// =============================================
// COMPONENT
// =============================================

export function CreatePaymentDialog({
  open,
  onOpenChange,
  batch,
  payslips,
  employeeLookup,
  onSuccess,
}: CreatePaymentDialogProps) {
  // State
  const [selectedAccountId, setSelectedAccountId] = React.useState<SystemId | ''>('');
  const [isCreating, setIsCreating] = React.useState(false);

  // Stores
  const paymentStore = usePaymentStore();
  const { accounts: cashAccounts } = useCashbookStore();

  // Computed
  const totalNet = React.useMemo(() => {
    return payslips.reduce((sum, p) => sum + p.totals.netPay, 0);
  }, [payslips]);

  const activeCashAccounts = React.useMemo(() => {
    return cashAccounts.filter((acc) => acc.isActive);
  }, [cashAccounts]);

  const selectedAccount = React.useMemo(() => {
    return activeCashAccounts.find((acc) => acc.systemId === selectedAccountId);
  }, [activeCashAccounts, selectedAccountId]);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedAccountId(activeCashAccounts[0]?.systemId ?? '');
      setIsCreating(false);
    }
  }, [open, activeCashAccounts]);

  // Validation
  const canCreate = React.useMemo(() => {
    if (!batch) return false;
    if (batch.status !== 'locked') return false;
    if (!selectedAccountId) return false;
    if (payslips.length === 0) return false;
    return true;
  }, [batch, selectedAccountId, payslips]);

  const validationError = React.useMemo(() => {
    if (!batch) return 'Không có dữ liệu bảng lương.';
    if (batch.status !== 'locked') return 'Bảng lương chưa được khóa. Vui lòng khóa trước khi tạo phiếu chi.';
    if (!selectedAccountId) return 'Vui lòng chọn tài khoản chi.';
    if (payslips.length === 0) return 'Không có phiếu lương nào trong batch.';
    return null;
  }, [batch, selectedAccountId, payslips]);

  // Handlers
  const handleCreate = async () => {
    if (!batch || !selectedAccount || !canCreate) return;

    setIsCreating(true);
    const rawUserId = getCurrentUserSystemId();
    const currentUserId = rawUserId ? asSystemId(rawUserId) : asSystemId('SYSTEM');
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    try {
      // Lọc bỏ các payslips có netPay = 0 (không tạo phiếu chi cho người không có lương)
      const payslipsWithPay = payslips.filter(p => p.totals.netPay > 0);
      
      if (payslipsWithPay.length === 0) {
        toast.warning('Không có nhân viên nào có lương thực lĩnh > 0', {
          description: 'Không tạo phiếu chi nào.',
        });
        setIsCreating(false);
        return;
      }
      
      // Create individual payment for each payslip
      let createdCount = 0;
      for (const payslip of payslipsWithPay) {
        const employee = employeeLookup[payslip.employeeSystemId];
        const employeeName = employee?.fullName ?? `Nhân viên ${payslip.employeeId}`;

        paymentStore.add({
          date: today,
          amount: payslip.totals.netPay,
          recipientTypeSystemId: 'NHANVIEN' as SystemId,
          recipientTypeName: 'Nhân viên',
          recipientName: employeeName,
          recipientSystemId: payslip.employeeSystemId,
          description: `Chi lương tháng ${batch.payPeriod?.monthKey ?? ''} - ${employeeName}`,
          paymentMethodSystemId: 'CHUYENKHOAN' as SystemId,
          paymentMethodName: 'Chuyển khoản',
          accountSystemId: selectedAccount.systemId,
          paymentReceiptTypeSystemId: 'CHILUONG' as SystemId,
          paymentReceiptTypeName: 'Chi lương',
          branchSystemId: 'BRANCH-001' as SystemId,
          branchName: 'Chi nhánh chính',
          createdBy: currentUserId,
          createdAt: now,
          status: 'completed',
          category: 'salary',
          affectsDebt: false,
          linkedPayrollBatchSystemId: batch.systemId,
          linkedPayslipSystemId: payslip.systemId,
        });
        createdCount++;
      }

      const skippedCount = payslips.length - payslipsWithPay.length;
      const actualTotal = payslipsWithPay.reduce((sum, p) => sum + p.totals.netPay, 0);
      
      toast.success(`Đã tạo ${createdCount} phiếu chi lương`, {
        description: skippedCount > 0 
          ? `Tổng: ${formatCurrency(actualTotal)} (Bỏ qua ${skippedCount} NV có lương 0đ)`
          : `Tổng số tiền: ${formatCurrency(actualTotal)}`,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error('Không thể tạo phiếu chi', {
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!batch) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Tạo phiếu chi lương
          </DialogTitle>
          <DialogDescription>
            Tạo {payslips.length} phiếu chi riêng lẻ cho từng nhân viên từ bảng lương <strong>{batch.id}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Summary */}
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Số nhân viên</p>
                <p className="text-lg font-semibold">{payslips.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tổng thực lĩnh</p>
                <p className="text-lg font-semibold text-primary">{formatCurrency(totalNet)}</p>
              </div>
            </div>
          </div>

          {/* Account Selection */}
          <div className="space-y-2">
            <Label htmlFor="account" className="text-sm font-medium">Tài khoản chi</Label>
            <Select value={selectedAccountId as string} onValueChange={(v) => setSelectedAccountId(v as SystemId)}>
              <SelectTrigger id="account">
                <SelectValue placeholder="Chọn tài khoản chi" />
              </SelectTrigger>
              <SelectContent>
                {activeCashAccounts.map((account) => (
                  <SelectItem key={account.systemId} value={account.systemId}>
                    {account.name} {account.bankAccountNumber ? `(${account.bankAccountNumber})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAccount && (
              <p className="text-xs text-muted-foreground">
                Số dư ban đầu: {formatCurrency(selectedAccount.initialBalance ?? 0)}
              </p>
            )}
          </div>

          {/* Validation Error */}
          {validationError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Hủy
          </Button>
          <Button onClick={handleCreate} disabled={!canCreate || isCreating}>
            {isCreating ? 'Đang tạo...' : `Tạo ${payslips.length} phiếu chi`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
