import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Printer, Pencil, User, Building2, Briefcase, Calendar, Clock } from 'lucide-react';
import type { PayslipRow } from './payslip-columns';

// =============================================
// TYPES
// =============================================

type PayslipDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payslip: PayslipRow | null;
  isLocked?: boolean;
  onEdit?: () => void;
  onPrint?: () => void;
};

// =============================================
// HELPERS
// =============================================

const formatCurrency = (value?: number) =>
  typeof value === 'number'
    ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
    : '0 ₫';

const formatPercent = (value?: number) =>
  typeof value === 'number' ? `${value}%` : '0%';

// =============================================
// SUB COMPONENTS
// =============================================

function InfoItem({ icon: Icon, label, value }: { icon?: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
      <span className="text-muted-foreground text-sm">{label}:</span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}

function AmountRow({ label, amount, type = 'neutral', indent = false }: { 
  label: string; 
  amount: number; 
  type?: 'positive' | 'negative' | 'neutral' | 'total';
  indent?: boolean;
}) {
  const colorClass = {
    positive: 'text-emerald-600 dark:text-emerald-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: '',
    total: 'font-bold text-primary',
  }[type];

  // Only show prefix when amount > 0
  const prefix = amount > 0 ? (type === 'negative' ? '-' : type === 'positive' ? '+' : '') : '';

  return (
    <div className={`flex justify-between items-center py-1.5 ${indent ? 'pl-4' : ''}`}>
      <span className={`text-sm ${indent ? 'text-muted-foreground' : ''}`}>{label}</span>
      <span className={`text-sm tabular-nums ${colorClass}`}>
        {prefix}{formatCurrency(Math.abs(amount))}
      </span>
    </div>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================

export function PayslipDetailDialog({
  open,
  onOpenChange,
  payslip,
  isLocked = false,
  onEdit,
  onPrint,
}: PayslipDetailDialogProps) {
  if (!payslip) return null;

  const { totals } = payslip;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Chi tiết phiếu lương</DialogTitle>
          <DialogDescription>{payslip.employeeName}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="space-y-6 pr-4">
            {/* Thông tin nhân viên */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wide">
                Thông tin nhân viên
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 p-4 rounded-lg border">
                <InfoItem icon={User} label="Mã NV" value={payslip.employeeId} />
                <InfoItem icon={User} label="Họ tên" value={payslip.employeeName} />
                <InfoItem icon={Building2} label="Phòng ban" value={payslip.departmentName || '—'} />
                <InfoItem icon={Briefcase} label="Chức vụ" value={payslip.positionName || '—'} />
              </div>
            </div>

            <Separator />

            {/* Thông tin chấm công */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wide">
                Thông tin chấm công
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-lg border">
                {/* Ngày công */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    Ngày công
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-6 text-sm">
                    <span className="text-muted-foreground">Ngày làm việc:</span>
                    <span className={`font-medium ${(totals.workDays ?? 0) === 0 ? 'text-red-500' : ''}`}>
                      {totals.workDays ?? 0}/{totals.standardWorkDays ?? 26} ngày
                    </span>
                    <span className="text-muted-foreground">Ngày nghỉ phép:</span>
                    <span className="font-medium">{totals.leaveDays ?? 0} ngày</span>
                    <span className="text-muted-foreground">Vắng mặt:</span>
                    <span className={`font-medium ${(totals.absentDays ?? 0) > 0 ? 'text-red-500' : ''}`}>
                      {totals.absentDays ?? 0} ngày
                    </span>
                  </div>
                </div>
                
                {/* Làm thêm giờ */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Làm thêm giờ
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-6 text-sm">
                    <span className="text-muted-foreground">Làm thêm ngày thường:</span>
                    <span className={`font-medium ${(totals.otHoursWeekday ?? 0) > 0 ? 'text-blue-600' : ''}`}>
                      {totals.otHoursWeekday ?? 0}h
                    </span>
                    <span className="text-muted-foreground">Làm thêm cuối tuần:</span>
                    <span className={`font-medium ${(totals.otHoursWeekend ?? 0) > 0 ? 'text-orange-600' : ''}`}>
                      {totals.otHoursWeekend ?? 0}h
                    </span>
                    <span className="text-muted-foreground">Làm thêm ngày lễ:</span>
                    <span className={`font-medium ${(totals.otHoursHoliday ?? 0) > 0 ? 'text-red-600' : ''}`}>
                      {totals.otHoursHoliday ?? 0}h
                    </span>
                    <span className="text-muted-foreground font-medium">Tổng giờ làm thêm:</span>
                    <span className="font-bold text-primary">{totals.otHours ?? 0}h</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Chi tiết thu nhập & khấu trừ */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wide">
                Chi tiết lương
              </h3>
              
              <div className="rounded-lg border overflow-hidden">
                {/* Thu nhập - Chi tiết theo component */}
                <div className="p-4">
                  <div className="font-medium text-sm mb-2">Thu nhập</div>
                  {(payslip.components || [])
                    .filter(c => c.category === 'earning' && c.amount > 0)
                    .map((component) => (
                      <AmountRow 
                        key={component.componentSystemId}
                        label={component.label} 
                        amount={component.amount} 
                        type="positive" 
                        indent 
                      />
                    ))
                  }
                  <Separator className="my-2" />
                  <AmountRow label="Tổng thu nhập (Gross)" amount={totals.earnings} type="positive" />
                </div>

                {/* Bảo hiểm */}
                <div className="p-4 border-t">
                  <div className="font-medium text-sm mb-2">Bảo hiểm bắt buộc (NV đóng)</div>
                  <AmountRow label="BHXH (8%)" amount={totals.employeeSocialInsurance || 0} type="negative" indent />
                  <AmountRow label="BHYT (1.5%)" amount={totals.employeeHealthInsurance || 0} type="negative" indent />
                  <AmountRow label="BHTN (1%)" amount={totals.employeeUnemploymentInsurance || 0} type="negative" indent />
                  <Separator className="my-2" />
                  <AmountRow label="Tổng bảo hiểm (10.5%)" amount={totals.totalEmployeeInsurance || 0} type="negative" />
                </div>

                {/* Giảm trừ gia cảnh */}
                <div className="p-4 border-t">
                  <div className="font-medium text-sm mb-2">Giảm trừ gia cảnh</div>
                  <AmountRow label="Giảm trừ bản thân" amount={totals.personalDeduction || 0} indent />
                  <AmountRow 
                    label={`Giảm trừ người phụ thuộc (${totals.numberOfDependents || 0} người)`} 
                    amount={totals.dependentDeduction || 0} 
                    indent 
                  />
                </div>

                {/* Thu nhập chịu thuế */}
                <div className="p-4 border-t">
                  <AmountRow label="Thu nhập chịu thuế" amount={totals.taxableIncome || 0} />
                </div>

                {/* Thuế TNCN */}
                <div className="p-4 border-t">
                  <AmountRow label="Thuế TNCN" amount={totals.personalIncomeTax || 0} type="negative" />
                </div>

                {/* Khấu trừ khác - Chi tiết theo component */}
                <div className="p-4 border-t">
                  <div className="font-medium text-sm mb-2">Khấu trừ khác</div>
                  {(payslip.components || [])
                    .filter(c => c.category === 'deduction' && c.amount > 0)
                    .map((component) => (
                      <AmountRow 
                        key={component.componentSystemId}
                        label={component.label} 
                        amount={component.amount} 
                        type="negative" 
                        indent 
                      />
                    ))
                  }
                  {(payslip.components || []).filter(c => c.category === 'deduction' && c.amount > 0).length === 0 && (
                    <span className="text-sm text-muted-foreground pl-4">Không có khấu trừ</span>
                  )}
                </div>

                {/* Thực lĩnh */}
                <div className="p-4 border-t">
                  <AmountRow label="THỰC LĨNH" amount={totals.netPay} type="total" />
                </div>
              </div>
            </div>

            {/* Bảo hiểm doanh nghiệp đóng (thông tin) */}
            {(totals.totalEmployerInsurance > 0) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wide">
                    Bảo hiểm doanh nghiệp đóng (tham khảo)
                  </h3>
                  <div className="rounded-lg border p-4">
                    <AmountRow label="BHXH DN (17.5%)" amount={totals.employerSocialInsurance || 0} indent />
                    <AmountRow label="BHYT DN (3%)" amount={totals.employerHealthInsurance || 0} indent />
                    <AmountRow label="BHTN DN (1%)" amount={totals.employerUnemploymentInsurance || 0} indent />
                    <Separator className="my-2" />
                    <AmountRow label="Tổng DN đóng (21.5%)" amount={totals.totalEmployerInsurance || 0} />
                  </div>
                </div>
              </>
            )}

            {/* Locked notice */}
            {isLocked && (
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">
                  Bảng lương đã khóa. Không thể chỉnh sửa phiếu lương này.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          {onEdit && !isLocked && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Sửa
            </Button>
          )}
          {onPrint && (
            <Button variant="outline" size="sm" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              In phiếu lương
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
