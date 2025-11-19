import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { FormField, FormItem, FormLabel, FormControl } from '../../../../components/ui/form.tsx';
import { Input } from '../../../../components/ui/input.tsx';
import { CurrencyInput } from '../../../../components/ui/currency-input.tsx';
import { Combobox } from '../../../../components/ui/combobox.tsx';
import { useBranchStore } from '../../../settings/branches/store.ts';
import { useEmployeeStore } from '../../../employees/store.ts';

/**
 * Thông tin bổ sung - Adapted from OrderInfoCard
 * 
 * Fields:
 * - Bán tại (chi nhánh) *
 * - Làm bởi (nhân viên) *
 * - Mã vận đơn *
 * - Phí cước
 * - Đường dẫn (URL)
 * - Mã tham chiếu
 */
export function WarrantyFormInfoCard({ disabled }: { disabled?: boolean }) {
  const { control, setValue } = useFormContext();
  const { data: branches } = useBranchStore();
  const { data: employees } = useEmployeeStore();

  const branchOptions = React.useMemo(() => 
    branches.map(b => ({ value: b.systemId, label: b.name })), 
    [branches]
  );

  const employeeOptions = React.useMemo(() => 
    employees.map(e => ({ value: e.systemId, label: e.fullName })), 
    [employees]
  );

  // Tự động chọn chi nhánh mặc định khi tạo mới (chỉ chạy 1 lần)
  const [defaultSet, setDefaultSet] = React.useState(false);
  React.useEffect(() => {
    if (defaultSet) return;
    
    const defaultBranch = branches.find(b => b.isDefault === true);
    if (defaultBranch) {
      setValue('branchSystemId', defaultBranch.systemId, { shouldDirty: false });
      setDefaultSet(true);
    }
  }, [branches, setValue, defaultSet]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-base font-semibold">Thông tin bổ sung</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Mã phiếu bảo hành */}
        <FormField 
          control={control} 
          name="id" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã phiếu <span className="text-muted-foreground text-xs">(tùy chọn)</span></FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Để trống để tự động tạo (BH000001, BH000002...)" 
                  disabled={disabled}
                  className="font-mono"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Bán tại (Chi nhánh) */}
        <FormField 
          control={control} 
          name="branchSystemId" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trụ sở <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Combobox
                  options={branchOptions}
                  value={branchOptions.find(opt => opt.value === field.value) || null}
                  onChange={option => field.onChange(option?.value)}
                  placeholder="Chọn chi nhánh"
                  searchPlaceholder="Tìm chi nhánh..."
                  emptyPlaceholder="Không tìm thấy."
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Làm bởi (Nhân viên) */}
        <FormField 
          control={control} 
          name="employeeSystemId" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Làm bởi <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Combobox
                  options={employeeOptions}
                  value={employeeOptions.find(opt => opt.value === field.value) || null}
                  onChange={option => field.onChange(option?.value)}
                  placeholder="Chọn nhân viên"
                  searchPlaceholder="Tìm nhân viên..."
                  emptyPlaceholder="Không tìm thấy."
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Mã vận đơn */}
        <FormField 
          control={control} 
          name="trackingCode" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã vận đơn <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Nhập mã vận đơn" 
                  disabled={disabled} 
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Phí cước */}
        <FormField 
          control={control} 
          name="shippingFee" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phí cước (khách chịu)</FormLabel>
              <FormControl>
                <CurrencyInput
                  value={field.value || 0}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder="Nhập phí cước..."
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
