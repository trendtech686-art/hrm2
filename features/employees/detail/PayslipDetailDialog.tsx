'use client';

import * as React from 'react';
import { DollarSign, FileText, Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PayrollStatusBadge } from '@/features/payroll/components/status-badge';
import { PayslipPrintButton } from '@/features/payroll/components/payslip-print-button';
import { formatDate } from '@/lib/date-utils';
import { formatCurrency, formatMonthLabel, type PayslipLike, type PayrollBatchLike } from './types';

// Use flexible types for payslip/batch data (works with both store and server API)
interface SelectedPayslipType {
  slip: PayslipLike;
  batch?: PayrollBatchLike;
}

interface PayslipDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPayslip: SelectedPayslipType | null;
  onViewPayroll: (batchSystemId?: string) => void;
}

export function PayslipDetailDialog({
  open,
  onOpenChange,
  selectedPayslip,
  onViewPayroll,
}: PayslipDetailDialogProps) {
  if (!selectedPayslip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết phiếu lương</DialogTitle>
          <DialogDescription>
            {selectedPayslip?.batch?.id ?? 'Phiếu lương'} -{' '}
            {formatMonthLabel(
              selectedPayslip?.batch?.payPeriod?.monthKey ??
                selectedPayslip?.slip.periodMonthKey
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thông tin chung */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm border rounded-lg p-4 bg-muted/30">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã bảng lương:</span>
              <span className="font-medium">{selectedPayslip.batch?.id ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              {selectedPayslip.batch ? (
                <PayrollStatusBadge status={selectedPayslip.batch.status} />
              ) : (
                <Badge variant="outline">Chưa xác định</Badge>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kỳ lương:</span>
              <span className="font-medium">
                {formatMonthLabel(
                  selectedPayslip.batch?.payPeriod?.monthKey ??
                    selectedPayslip.slip.periodMonthKey
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày trả lương:</span>
              <span className="font-medium">
                {formatDate(
                  selectedPayslip.batch?.payrollDate || selectedPayslip.slip.createdAt
                ) || '—'}
              </span>
            </div>
          </div>

          {/* Chi tiết các thành phần lương */}
          <div className="space-y-3">
            {/* Các khoản thu nhập */}
            <div className="rounded-lg border p-4">
              <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Các khoản thu nhập
              </h4>
              <div className="space-y-2 text-sm">
                {selectedPayslip.slip.components &&
                  selectedPayslip.slip.components
                    .filter((c) => c.category === 'earning')
                    .map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between py-1 border-b border-dashed last:border-0"
                      >
                        <span className="text-muted-foreground">{comp.label}</span>
                        <span className="font-medium tabular-nums text-green-600">
                          {formatCurrency(comp.amount)}
                        </span>
                      </div>
                    ))}
                {(!selectedPayslip.slip.components ||
                  selectedPayslip.slip.components.filter((c) => c.category === 'earning')
                    .length === 0) && (
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <span className="text-muted-foreground">Thu nhập gộp</span>
                    <span className="font-medium tabular-nums text-green-600">
                      {formatCurrency(selectedPayslip.slip.totals.grossEarnings)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 font-semibold border-t">
                  <span>Tổng thu nhập</span>
                  <span className="tabular-nums text-green-600">
                    {formatCurrency(selectedPayslip.slip.totals.grossEarnings)}
                  </span>
                </div>
              </div>
            </div>

            {/* Các khoản khấu trừ */}
            <div className="rounded-lg border p-4">
              <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Các khoản khấu trừ
              </h4>
              <div className="space-y-2 text-sm">
                {selectedPayslip.slip.components &&
                  selectedPayslip.slip.components
                    .filter((c) => c.category === 'deduction')
                    .map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between py-1 border-b border-dashed last:border-0"
                      >
                        <span className="text-muted-foreground">{comp.label}</span>
                        <span className="font-medium tabular-nums text-red-600">
                          -{formatCurrency(comp.amount)}
                        </span>
                      </div>
                    ))}
                {/* Bảo hiểm chi tiết */}
                {selectedPayslip.slip.totals.employeeSocialInsurance > 0 && (
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <span className="text-muted-foreground">BHXH (8%)</span>
                    <span className="font-medium tabular-nums text-red-600">
                      -{formatCurrency(selectedPayslip.slip.totals.employeeSocialInsurance)}
                    </span>
                  </div>
                )}
                {selectedPayslip.slip.totals.employeeHealthInsurance > 0 && (
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <span className="text-muted-foreground">BHYT (1.5%)</span>
                    <span className="font-medium tabular-nums text-red-600">
                      -{formatCurrency(selectedPayslip.slip.totals.employeeHealthInsurance)}
                    </span>
                  </div>
                )}
                {selectedPayslip.slip.totals.employeeUnemploymentInsurance > 0 && (
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <span className="text-muted-foreground">BHTN (1%)</span>
                    <span className="font-medium tabular-nums text-red-600">
                      -
                      {formatCurrency(
                        selectedPayslip.slip.totals.employeeUnemploymentInsurance
                      )}
                    </span>
                  </div>
                )}
                {/* Thuế TNCN */}
                {selectedPayslip.slip.totals.personalIncomeTax > 0 && (
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <span className="text-muted-foreground">Thuế TNCN</span>
                    <span className="font-medium tabular-nums text-red-600">
                      -{formatCurrency(selectedPayslip.slip.totals.personalIncomeTax)}
                    </span>
                  </div>
                )}
                {/* Khấu trừ phạt */}
                {selectedPayslip.slip.totals.penaltyDeductions > 0 && (
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <span className="text-muted-foreground">Khấu trừ phạt</span>
                    <span className="font-medium tabular-nums text-red-600">
                      -{formatCurrency(selectedPayslip.slip.totals.penaltyDeductions)}
                    </span>
                  </div>
                )}
                {/* Khấu trừ khác */}
                {selectedPayslip.slip.totals.otherDeductions > 0 && (
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <span className="text-muted-foreground">Khấu trừ khác</span>
                    <span className="font-medium tabular-nums text-red-600">
                      -{formatCurrency(selectedPayslip.slip.totals.otherDeductions)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 font-semibold border-t">
                  <span>Tổng khấu trừ</span>
                  <span className="tabular-nums text-red-600">
                    -{formatCurrency(selectedPayslip.slip.totals.deductions)}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin bổ sung */}
            <div className="rounded-lg border p-4 bg-muted/20">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Thông tin chi tiết
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mức đóng BHXH:</span>
                  <span className="tabular-nums">
                    {formatCurrency(selectedPayslip.slip.totals.socialInsuranceBase)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thu nhập chịu thuế:</span>
                  <span className="tabular-nums">
                    {formatCurrency(selectedPayslip.slip.totals.taxableIncome)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giảm trừ bản thân:</span>
                  <span className="tabular-nums">
                    {formatCurrency(selectedPayslip.slip.totals.personalDeduction)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Giảm trừ NPT ({selectedPayslip.slip.totals.numberOfDependents}):
                  </span>
                  <span className="tabular-nums">
                    {formatCurrency(selectedPayslip.slip.totals.dependentDeduction)}
                  </span>
                </div>
              </div>
            </div>

            {/* Đóng góp (nếu có) */}
            {selectedPayslip.slip.components &&
              selectedPayslip.slip.components.filter((c) => c.category === 'contribution')
                .length > 0 && (
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Các khoản đóng góp
                  </h4>
                  <div className="space-y-2 text-sm">
                    {selectedPayslip.slip.components
                      .filter((c) => c.category === 'contribution')
                      .map((comp, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between py-1 border-b border-dashed last:border-0"
                        >
                          <span className="text-muted-foreground">{comp.label}</span>
                          <span className="font-medium tabular-nums">
                            {formatCurrency(comp.amount)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>

          {/* Tổng kết */}
          <div className="rounded-lg border-2 border-primary/30 p-4 bg-primary/5">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">THỰC LĨNH</span>
              <span className="text-2xl font-bold text-primary tabular-nums">
                {formatCurrency(selectedPayslip.slip.totals.netPay)}
              </span>
            </div>
          </div>

          <div className="flex justify-between gap-2 pt-2">
            <PayslipPrintButton
              payslipData={selectedPayslip.slip as never}
              batchData={selectedPayslip.batch as never}
              variant="outline"
              className="flex-1"
            />
            <Button
              variant="default"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                if (selectedPayslip.batch?.systemId) {
                  onViewPayroll(selectedPayslip.batch.systemId);
                }
              }}
            >
              Xem bảng lương
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
