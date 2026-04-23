/**
 * Employee Payroll Tab Component
 * Extracted from employee-form.tsx for better maintainability
 * 
 * Contains:
 * - Work shift configuration
 * - Salary components selection
 * - Payment method & bank account
 */

import * as React from 'react';
import type { Control } from 'react-hook-form';
import type { SystemId } from '@/lib/id-types';
import { asSystemId } from '@/lib/id-types';
import { mobileBleedCardClass } from '@/components/layout/page-section';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import type { EmployeeFormValues } from './employee-form';

// Types for work shifts and salary components
interface WorkShift {
  systemId: SystemId;
  name: string;
  startTime: string;
  endTime: string;
}

interface SalaryComponent {
  systemId: SystemId;
  name: string;
  type: 'fixed' | 'formula';
  amount?: number;
  formula?: string;
  taxable: boolean;
  partOfSocialInsurance: boolean;
}

interface EmployeePayrollTabProps {
  control: Control<EmployeeFormValues>;
  isEditMode: boolean;
  workShifts: WorkShift[];
  salaryComponents: SalaryComponent[];
  onResetPayrollComponents: () => void;
  onCopyPayrollBank: () => void;
}

const formatCurrencyDisplay = (value?: number) => {
  if (typeof value !== 'number') return 'Theo công thức';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export function EmployeePayrollTab({
  control,
  isEditMode,
  workShifts,
  salaryComponents,
  onResetPayrollComponents,
  onCopyPayrollBank,
}: EmployeePayrollTabProps) {
  return (
    <div className="space-y-6">
      {!isEditMode && (
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle>Thiết lập ca làm việc</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              name="payrollWorkShiftSystemId"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ca làm việc mặc định</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value ? asSystemId(value) : undefined)}
                    value={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ca áp dụng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workShifts.length === 0 && (
                        <SelectItem value="__empty" disabled>
                          Chưa có ca làm việc trong cài đặt
                        </SelectItem>
                      )}
                      {workShifts.map((shift) => (
                        <SelectItem key={shift.systemId} value={shift.systemId}>
                          {shift.name} ({shift.startTime} - {shift.endTime})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Bỏ trống để dùng lịch mặc định trong phần Cài đặt &gt; Nhân viên.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Ghi chú</p>
              <p>
                Ca mặc định giúp đồng bộ chấm công và tính công chuẩn. Bạn vẫn có thể đổi ca cho từng ngày
                trực tiếp tại module Chấm công.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isEditMode && (
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle>Thành phần lương</CardTitle>
            <p className="text-sm text-muted-foreground">
              Chọn các khoản thu nhập/phụ cấp sẽ gắn với nhân viên này. Danh sách được lấy trực tiếp từ phần Cài đặt
              &gt; Thành phần lương.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              name="payrollSalaryComponentSystemIds"
              control={control}
              rules={{
                validate: (value) => (value?.length ?? 0) > 0 || 'Cần ít nhất 1 thành phần lương',
              }}
              render={({ field }) => {
                const selectedValues = new Set<SystemId>(field.value ?? []);
                return (
                  <FormItem>
                    <FormLabel className="sr-only">Thành phần lương</FormLabel>
                    <div className="space-y-3">
                      {salaryComponents.length === 0 && (
                        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                          Chưa có thành phần lương nào. Vào phần Cài đặt để tạo mới.
                        </div>
                      )}
                      {salaryComponents.map((component) => {
                        const checked = selectedValues.has(component.systemId);
                        return (
                          <label
                            key={component.systemId}
                            className="flex items-start justify-between gap-4 rounded-lg border p-3"
                          >
                            <div>
                              <p className="font-medium text-foreground">{component.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {component.type === 'fixed'
                                  ? formatCurrencyDisplay(component.amount)
                                  : component.formula || 'Tự nhập công thức'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {component.taxable ? 'Tính thuế TNCN' : 'Không tính thuế'} ·{' '}
                                {component.partOfSocialInsurance ? 'Tính BHXH' : 'Không tính BHXH'}
                              </p>
                            </div>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                const next = new Set(selectedValues);
                                if (isChecked) {
                                  next.add(component.systemId);
                                } else {
                                  next.delete(component.systemId);
                                }
                                field.onChange(Array.from(next));
                              }}
                              className="mt-1"
                            />
                          </label>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                      <span>
                        Đang chọn {selectedValues.size}/{salaryComponents.length} thành phần
                      </span>
                      <Button type="button" variant="outline" size="sm" onClick={onResetPayrollComponents}>
                        Dùng cấu hình mặc định
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle>Trả lương & tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            name="payrollPaymentMethod"
            control={control}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Hình thức chi trả</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={(field.value as 'bank_transfer' | 'cash') ?? 'bank_transfer'}
                  className="grid gap-3 md:grid-cols-2"
                >
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
                    <RadioGroupItem value="bank_transfer" />
                    <div className="space-y-1">
                      <p className="font-medium">Chuyển khoản</p>
                      <p className="text-sm text-muted-foreground">
                        Sử dụng tài khoản ngân hàng để chuyển lương hàng tháng.
                      </p>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
                    <RadioGroupItem value="cash" />
                    <div className="space-y-1">
                      <p className="font-medium">Tiền mặt</p>
                      <p className="text-sm text-muted-foreground">
                        Áp dụng khi trả lương trực tiếp hoặc qua phong bì.
                      </p>
                    </div>
                  </label>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              name="payrollPayoutAccountNumber"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tài khoản trả lương</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 0123456789" {...field} value={field.value as string || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="payrollPayoutBankName"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngân hàng</FormLabel>
                  <FormControl>
                    <Input placeholder="Vietcombank, MB, ..." {...field} value={field.value as string || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="payrollPayoutBankBranch"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chi nhánh</FormLabel>
                  <FormControl>
                    <Input placeholder="Chi nhánh giao dịch" {...field} value={field.value as string || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onCopyPayrollBank}>
              Sao chép từ tab Thông tin cá nhân
            </Button>
            <p className="text-xs text-muted-foreground">
              Để trống nếu nhân viên dùng cùng tài khoản với phần Thông tin cá nhân.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
