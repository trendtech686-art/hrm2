import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from 'sonner';
import { asSystemId, type SystemId } from '@/lib/id-types';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Checkbox } from "../../../components/ui/checkbox.tsx";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import type { EmployeeFormValues } from "../employee-form.tsx";
import type { SalaryComponent, WorkShift } from "../../settings/employees/types.ts";

interface EmployeePayrollTabProps {
  form: UseFormReturn<EmployeeFormValues, any, EmployeeFormValues>;
  workShifts: WorkShift[];
  salaryComponents: SalaryComponent[];
  defaultSalaryComponentSystemIds: SystemId[];
  onCopyBankInfo: () => void;
  onResetComponents: () => void;
}

const formatCurrencyDisplay = (value?: number) => {
  if (typeof value !== 'number') return 'Theo công thức';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export function EmployeePayrollTab({
  form,
  workShifts,
  salaryComponents,
  defaultSalaryComponentSystemIds,
  onCopyBankInfo,
  onResetComponents,
}: EmployeePayrollTabProps) {
  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thiết lập ca làm việc</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <FormField
            name="payrollWorkShiftSystemId"
            control={form.control}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thành phần lương</CardTitle>
          <p className="text-sm text-muted-foreground">
            Chọn các khoản thu nhập/phụ cấp sẽ gắn với nhân viên này. Danh sách được lấy trực tiếp từ phần Cài đặt
            &gt; Thành phần lương.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            name="payrollSalaryComponentSystemIds"
            control={form.control}
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
                    <Button type="button" variant="outline" size="sm" onClick={onResetComponents}>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trả lương & tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            name="payrollPaymentMethod"
            control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
            <Button type="button" variant="outline" size="sm" onClick={onCopyBankInfo}>
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
