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
import { CurrencyInput } from '../../../components/ui/currency-input';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent } from '../../../components/ui/card';
import { AlertTriangle, Calculator, Save, X, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import type { Payslip, PayrollComponentEntry, PayrollTotals } from '../../../lib/payroll-types';
import type { SystemId } from '../../../lib/id-types';

// =============================================
// TYPES
// =============================================

type PayslipEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payslip: Payslip | undefined;
  employeeName: string;
  isLocked: boolean;
  onSave: (updates: PayslipUpdatePayload) => void;
  onRecalculate?: () => void;
};

export type PayslipUpdatePayload = {
  components: PayrollComponentEntry[];
  totals: PayrollTotals;
};

type ComponentEditState = {
  componentSystemId: SystemId;
  originalAmount: number;
  editedAmount: number;
  label: string;
  category: PayrollComponentEntry['category'];
};

// =============================================
// HELPERS
// =============================================

const formatCurrency = (value: number) =>
  value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

const formatNumber = (value: number) =>
  value.toLocaleString('vi-VN', { maximumFractionDigits: 0 });

const calculateTotals = (components: ComponentEditState[]): PayrollTotals => {
  const earnings = components
    .filter((c) => c.category === 'earning')
    .reduce((sum, c) => sum + c.editedAmount, 0);

  const deductions = components
    .filter((c) => c.category === 'deduction')
    .reduce((sum, c) => sum + c.editedAmount, 0);

  const contributions = components
    .filter((c) => c.category === 'contribution')
    .reduce((sum, c) => sum + c.editedAmount, 0);

  const totalDeductions = deductions;
  const netPay = Math.max(0, earnings - totalDeductions);
  
  // Simplified calculations for edit preview - actual values come from payroll engine
  return {
    // Attendance info (preserve from original or use defaults)
    workDays: 0,
    standardWorkDays: 26,
    leaveDays: 0,
    absentDays: 0,
    otHours: 0,
    otHoursWeekday: 0,
    otHoursWeekend: 0,
    otHoursHoliday: 0,
    lateArrivals: 0,
    earlyDepartures: 0,
    // Financial
    earnings,
    deductions: totalDeductions,
    contributions,
    grossEarnings: earnings,
    taxableIncome: 0,
    socialInsuranceBase: 0,
    employeeSocialInsurance: 0,
    employeeHealthInsurance: 0,
    employeeUnemploymentInsurance: 0,
    totalEmployeeInsurance: 0,
    employerSocialInsurance: 0,
    employerHealthInsurance: 0,
    employerUnemploymentInsurance: 0,
    totalEmployerInsurance: 0,
    personalIncomeTax: 0,
    personalDeduction: 0,
    dependentDeduction: 0,
    numberOfDependents: 0,
    penaltyDeductions: 0,
    otherDeductions: 0,
    netPay,
  };
};

// =============================================
// COMPONENT
// =============================================

export function PayslipEditDialog({
  open,
  onOpenChange,
  payslip,
  employeeName,
  isLocked,
  onSave,
  onRecalculate,
}: PayslipEditDialogProps) {
  // Initialize edit state from payslip
  const [editState, setEditState] = React.useState<ComponentEditState[]>([]);
  const [activeTab, setActiveTab] = React.useState('earning');

  // Reset state when payslip changes
  React.useEffect(() => {
    if (payslip) {
      setEditState(
        payslip.components.map((c) => ({
          componentSystemId: c.componentSystemId,
          originalAmount: c.amount,
          editedAmount: c.amount,
          label: c.label,
          category: c.category,
        }))
      );
    }
  }, [payslip]);

  // Calculate preview totals
  const previewTotals = React.useMemo(() => calculateTotals(editState), [editState]);

  // Check if any values changed
  const hasChanges = React.useMemo(
    () => editState.some((c) => c.editedAmount !== c.originalAmount),
    [editState]
  );

  // Handle amount change
  const handleAmountChange = (componentSystemId: SystemId, value: number) => {
    setEditState((prev) =>
      prev.map((c) =>
        c.componentSystemId === componentSystemId
          ? { ...c, editedAmount: value }
          : c
      )
    );
  };

  // Handle save
  const handleSave = () => {
    if (!payslip || isLocked) return;

    const updatedComponents: PayrollComponentEntry[] = payslip.components.map((original) => {
      const edited = editState.find((e) => e.componentSystemId === original.componentSystemId);
      return {
        ...original,
        amount: edited?.editedAmount ?? original.amount,
        metadata: {
          ...original.metadata,
          manuallyEdited: edited?.editedAmount !== edited?.originalAmount,
          originalAmount: edited?.originalAmount,
        },
      };
    });

    onSave({
      components: updatedComponents,
      totals: previewTotals,
    });

    onOpenChange(false);
  };

  // Handle recalculate
  const handleRecalculate = () => {
    if (!payslip || isLocked || !onRecalculate) return;
    onRecalculate();
    onOpenChange(false);
  };

  // Group components by category
  const groupedComponents = React.useMemo(() => {
    const groups: Record<PayrollComponentEntry['category'], ComponentEditState[]> = {
      earning: [],
      deduction: [],
      contribution: [],
    };
    editState.forEach((c) => {
      groups[c.category].push(c);
    });
    return groups;
  }, [editState]);

  // Count changes per category
  const changeCountPerCategory = React.useMemo(() => {
    const counts: Record<PayrollComponentEntry['category'], number> = {
      earning: 0,
      deduction: 0,
      contribution: 0,
    };
    editState.forEach((c) => {
      if (c.editedAmount !== c.originalAmount) {
        counts[c.category]++;
      }
    });
    return counts;
  }, [editState]);

  if (!payslip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa phiếu lương</DialogTitle>
          <DialogDescription>
            {employeeName} • {payslip.employeeId} • Kỳ {payslip.periodMonthKey}
          </DialogDescription>
        </DialogHeader>

        {isLocked && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Bảng lương đã khóa. Không thể chỉnh sửa phiếu lương này.
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-xs text-muted-foreground">Thu nhập</span>
              </div>
              <p className="text-sm font-semibold text-emerald-600 mt-1">
                {formatNumber(previewTotals.earnings)} đ
              </p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-xs text-muted-foreground">Khấu trừ</span>
              </div>
              <p className="text-sm font-semibold text-red-600 mt-1">
                {formatNumber(previewTotals.deductions)} đ
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">Đóng góp</span>
              </div>
              <p className="text-sm font-semibold text-blue-600 mt-1">
                {formatNumber(previewTotals.contributions)} đ
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground">Thực lĩnh</div>
              <p className="text-sm font-bold text-primary mt-1">
                {formatNumber(previewTotals.netPay)} đ
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for component categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="earning" className="gap-1">
              Thu nhập
              {changeCountPerCategory.earning > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-amber-100 text-amber-700 rounded-full">
                  {changeCountPerCategory.earning}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="deduction" className="gap-1">
              Khấu trừ
              {changeCountPerCategory.deduction > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-amber-100 text-amber-700 rounded-full">
                  {changeCountPerCategory.deduction}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="contribution" className="gap-1">
              Đóng góp
              {changeCountPerCategory.contribution > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-amber-100 text-amber-700 rounded-full">
                  {changeCountPerCategory.contribution}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="earning" className="mt-0 space-y-3">
              {groupedComponents.earning.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Không có khoản thu nhập nào
                </p>
              ) : (
                groupedComponents.earning.map((component) => (
                  <ComponentRow
                    key={component.componentSystemId}
                    component={component}
                    disabled={isLocked}
                    onChange={handleAmountChange}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="deduction" className="mt-0 space-y-3">
              {groupedComponents.deduction.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Không có khoản khấu trừ nào
                </p>
              ) : (
                groupedComponents.deduction.map((component) => (
                  <ComponentRow
                    key={component.componentSystemId}
                    component={component}
                    disabled={isLocked}
                    onChange={handleAmountChange}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="contribution" className="mt-0 space-y-3">
              {groupedComponents.contribution.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Không có khoản đóng góp nào
                </p>
              ) : (
                groupedComponents.contribution.map((component) => (
                  <ComponentRow
                    key={component.componentSystemId}
                    component={component}
                    disabled={isLocked}
                    onChange={handleAmountChange}
                  />
                ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <Separator />

        {/* Change notice */}
        {hasChanges && (
          <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              ⚠️ Có thay đổi chưa lưu. Thực lĩnh thay đổi từ{' '}
              <strong>{formatCurrency(payslip.totals.netPay)}</strong> → <strong>{formatCurrency(previewTotals.netPay)}</strong>
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {onRecalculate && !isLocked && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRecalculate}
              className="gap-2"
            >
              <Calculator className="h-4 w-4" />
              Tính lại
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-2 h-4 w-4" />
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLocked || !hasChanges}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =============================================
// COMPONENT ROW
// =============================================

type ComponentRowProps = {
  component: ComponentEditState;
  disabled: boolean;
  onChange: (componentSystemId: SystemId, value: number) => void;
};

function ComponentRow({ component, disabled, onChange }: ComponentRowProps) {
  const hasChanged = component.editedAmount !== component.originalAmount;

  return (
    <div className={`flex items-center gap-4 rounded-lg border p-4 ${hasChanged ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-950/20' : 'bg-card'}`}>
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium">{component.label}</Label>
        {hasChanged && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Gốc: {formatNumber(component.originalAmount)} đ
          </p>
        )}
      </div>
      <div className="w-44">
        <CurrencyInput
          value={component.editedAmount}
          onChange={(val) => onChange(component.componentSystemId, val)}
          disabled={disabled}
          className="text-right h-9"
        />
      </div>
    </div>
  );
}

export default PayslipEditDialog;
