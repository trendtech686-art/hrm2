'use client';

import * as React from 'react';
import { useForm, type ControllerProps, type FieldPath } from 'react-hook-form';
import type { Branch } from '@/lib/types/prisma-extended';
import { useMeiliEmployeeSearch } from '@/hooks/use-meilisearch';
import { useProvinces, useWards2Level } from '../provinces/hooks/use-administrative-units';
import { Button } from '../../../components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Combobox } from '../../../components/ui/combobox';
import { Switch } from '../../../components/ui/switch';
import { DialogFooter } from '../../../components/ui/dialog';

export type BranchFormValues = Omit<Branch, 'systemId'>;

const BranchFormField = <TName extends FieldPath<BranchFormValues>>(props: ControllerProps<BranchFormValues, TName>) => (
  <FormField<BranchFormValues, TName> {...props} />
);

interface BranchFormProps {
  initialData: Branch | null;
  onSubmit: (values: BranchFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function BranchForm({ initialData, onSubmit, onCancel, isPending }: BranchFormProps) {
  const [managerSearchQuery, setManagerSearchQuery] = React.useState('');
  const { data: allEmployeesData } = useMeiliEmployeeSearch({
    query: '',
    limit: 100,
    debounceMs: 0,
  });
  const allEmployees = allEmployeesData?.data || [];
  const { data: employeesData } = useMeiliEmployeeSearch({
    query: managerSearchQuery,
    limit: 20,
    debounceMs: 0, // Combobox handles debouncing internally
  });
  const employees = employeesData?.data || [];
  const { data: provinces = [] } = useProvinces();

  const form = useForm<BranchFormValues>({
    defaultValues:
      initialData ? {
        ...initialData,
      } : {
        id: '',
        name: '',
        address: '',
        phone: '',
        managerId: undefined,
        isDefault: false,
        province: undefined,
        provinceId: undefined,
        ward: undefined,
        wardCode: undefined,
      },
  });

  // Auto-fill address fields when editing
  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData?.systemId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Watch address fields
  const selectedProvinceId = form.watch('provinceId');

  // Get wards based on selected province (2-level: Tỉnh → Phường/Xã) via React Query
  const { data: wards = [] } = useWards2Level(selectedProvinceId || undefined);

  const handleFormSubmit = (values: BranchFormValues) => {
    onSubmit(values);
  };
  
  const managerId = form.watch('managerId');
  const selectedManager = React.useMemo(() => {
    if (!managerId) return null;
    const employee = allEmployees.find(e => e.systemId === managerId);
    return employee ? { value: employee.systemId, label: employee.fullName } : null;
  }, [managerId, allEmployees]);

  const handleManagerSearch = React.useCallback((query: string) => {
    setManagerSearchQuery(query);
  }, []);

  return (
    <Form {...form}>
      <form id="branch-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Section 1: Thông tin cơ bản */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-sm md:font-semibold md:text-foreground md:normal-case md:tracking-normal border-b pb-2">Thông tin cơ bản</h3>
          <div className="grid grid-cols-2 gap-4">
            <BranchFormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã chi nhánh *</FormLabel>
                  <FormControl><Input {...field} placeholder="VD: HCM, HN" value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <BranchFormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chi nhánh *</FormLabel>
                  <FormControl><Input {...field} placeholder="VD: Chi nhánh Hồ Chí Minh" value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section 2: Địa chỉ chi tiết */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-sm md:font-semibold md:text-foreground md:normal-case md:tracking-normal border-b pb-2">Địa chỉ chi tiết</h3>

          {/* Province / District in one row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Province */}
            <BranchFormField
              control={form.control}
              name="provinceId"
              render={({ field }) => {
                const selectedProvince = provinces.find(p => p.id === field.value);
                return (
                <FormItem>
                  <FormLabel>Tỉnh/TP *</FormLabel>
                  <FormControl>
                    <Combobox
                      value={selectedProvince ? { value: selectedProvince.id, label: selectedProvince.name } : null}
                      onChange={(option) => {
                        const province = provinces.find(p => p.id === option?.value);
                        field.onChange(option?.value);
                        form.setValue('province', province?.name);
                        // Reset ward when province changes
                        form.setValue('wardCode', undefined);
                        form.setValue('ward', undefined);
                      }}
                      onSearch={(query) => {
                        if (!query) {
                          return Promise.resolve({
                            items: provinces.map(p => ({ value: p.id, label: p.name })),
                            hasNextPage: false
                          });
                        }
                        const filtered = provinces.filter(p => 
                          p.name.toLowerCase().includes(query.toLowerCase()) ||
                          p.id.includes(query)
                        );
                        return Promise.resolve({
                          items: filtered.map(p => ({ value: p.id, label: p.name })),
                          hasNextPage: false
                        });
                      }}
                      placeholder="Chọn tỉnh/TP"
                      searchPlaceholder="Tìm tỉnh/TP..."
                      emptyPlaceholder="Không tìm thấy"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                );
              }}
            />

            {/* Phường/Xã */}
            <BranchFormField
              control={form.control}
              name="wardCode"
              render={({ field }) => {
                const selectedWard = wards.find(w => w.id === field.value);
                return (
                <FormItem>
                  <FormLabel>Phường/Xã *</FormLabel>
                  <FormControl>
                    <Combobox
                      value={selectedWard ? { value: selectedWard.id, label: selectedWard.name } : null}
                      onChange={(option) => {
                        const ward = wards.find(w => w.id === option?.value);
                        field.onChange(option?.value);
                        form.setValue('ward', ward?.name);
                      }}
                      onSearch={(query) => {
                        if (!query) {
                          return Promise.resolve({
                            items: wards.map(w => ({ value: w.id, label: w.name })),
                            hasNextPage: false
                          });
                        }
                        const filtered = wards.filter(w => 
                          w.name.toLowerCase().includes(query.toLowerCase())
                        );
                        return Promise.resolve({
                          items: filtered.map(w => ({ value: w.id, label: w.name })),
                          hasNextPage: false
                        });
                      }}
                      placeholder={!selectedProvinceId ? "Chọn tỉnh trước" : "Chọn phường/xã"}
                      searchPlaceholder="Tìm phường/xã..."
                      emptyPlaceholder="Không tìm thấy"
                      disabled={!selectedProvinceId}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                );
              }}
            />
          </div>

          {/* Street Address */}
          <BranchFormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ (Số nhà, tên đường) *</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ''} placeholder="VD: 123 Đường ABC, Tòa nhà XYZ" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 3: Liên hệ */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-sm md:font-semibold md:text-foreground md:normal-case md:tracking-normal border-b pb-2">Thông tin liên hệ</h3>
          <div className="grid grid-cols-2 gap-4">
            <BranchFormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại *</FormLabel>
                  <FormControl><Input {...field} value={field.value ?? ''} placeholder="VD: 0123456789" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <BranchFormField
              control={form.control}
              name="managerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người quản lý</FormLabel>
                  <FormControl>
                    <Combobox
                      value={selectedManager}
                      onChange={(option) => field.onChange(option ? option.value : undefined)}
                      onSearch={handleManagerSearch}
                      placeholder="Chọn quản lý"
                      searchPlaceholder="Tìm nhân viên..."
                      emptyPlaceholder="Không tìm thấy nhân viên."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section 4: Tùy chọn */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-sm md:font-semibold md:text-foreground md:normal-case md:tracking-normal border-b pb-2">Tùy chọn</h3>
          <BranchFormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">
                    Đặt làm chi nhánh mặc định
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Chi nhánh này sẽ được chọn mặc định khi tạo đơn hàng mới
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
