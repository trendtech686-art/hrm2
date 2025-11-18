import * as React from 'react';
import { useForm } from 'react-hook-form';
import type { Branch } from './types.ts';
import { useBranchStore } from './store.ts';
import { useEmployeeStore } from '../../employees/store.ts';
import { useProvinceStore } from '../provinces/store.ts';
import { Button } from '../../../components/ui/button.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Combobox } from '../../../components/ui/combobox.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { DialogFooter } from '../../../components/ui/dialog.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group.tsx';
import { Label } from '../../../components/ui/label.tsx';

export type BranchFormValues = Omit<Branch, 'systemId'>;

interface BranchFormProps {
  initialData: Branch | null;
  onSubmit: (values: BranchFormValues) => void;
  onCancel: () => void;
}

export function BranchForm({ initialData, onSubmit, onCancel }: BranchFormProps) {
  const branchStore = useBranchStore();
  const branches = branchStore.getState().data;
  const { searchEmployees, data: allEmployees } = useEmployeeStore();
  const { 
    data: provinces, 
    getDistricts3LevelByProvinceId,
    getWards2LevelByProvinceId,
    getWards3LevelByDistrictId
  } = useProvinceStore();

  const form = useForm<BranchFormValues>({
    defaultValues:
      initialData || {
        id: '',
        name: '',
        address: '',
        phone: '',
        managerId: undefined,
        isDefault: false,
        addressLevel: '3-level', // Mặc định 3-cấp
        province: undefined,
        provinceId: undefined,
        district: undefined,
        districtId: undefined,
        ward: undefined,
        wardCode: undefined,
      },
  });

  // Watch address fields
  const addressLevel = form.watch('addressLevel');
  const selectedProvinceId = form.watch('provinceId');
  const selectedDistrictId = form.watch('districtId');

  // Get districts for 3-level
  const districts = React.useMemo(() => {
    if (addressLevel === '3-level' && selectedProvinceId) {
      return getDistricts3LevelByProvinceId(selectedProvinceId);
    }
    return [];
  }, [addressLevel, selectedProvinceId, getDistricts3LevelByProvinceId]);

  // Get wards based on level
  const wards = React.useMemo(() => {
    if (addressLevel === '2-level' && selectedProvinceId) {
      return getWards2LevelByProvinceId(selectedProvinceId);
    } else if (addressLevel === '3-level' && selectedDistrictId) {
      return getWards3LevelByDistrictId(selectedDistrictId);
    }
    return [];
  }, [addressLevel, selectedProvinceId, selectedDistrictId, getWards2LevelByProvinceId, getWards3LevelByDistrictId]);

  const handleFormSubmit = (values: BranchFormValues) => {
    onSubmit(values);
  };
  
  const managerId = form.watch('managerId');
  const selectedManager = React.useMemo(() => {
    if (!managerId) return null;
    const employee = allEmployees.find(e => e.systemId === managerId);
    return employee ? { value: employee.systemId, label: employee.fullName } : null;
  }, [managerId, allEmployees]);

  return (
    <Form {...form}>
      <form id="branch-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Section 1: Thông tin cơ bản */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold border-b pb-2">Thông tin cơ bản</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã chi nhánh *</FormLabel>
                  <FormControl><Input {...field} placeholder="VD: HCM, HN" value={field.value as string} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chi nhánh *</FormLabel>
                  <FormControl><Input {...field} placeholder="VD: Chi nhánh Hồ Chí Minh" value={field.value as string} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section 2: Địa chỉ chi tiết */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold border-b pb-2">Địa chỉ chi tiết</h3>
          
          {/* Address Level Radio */}
          <FormField
            control={form.control}
            name="addressLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại địa chỉ *</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset address fields when changing level
                      form.setValue('provinceId', undefined);
                      form.setValue('province', undefined);
                      form.setValue('districtId', undefined);
                      form.setValue('district', undefined);
                      form.setValue('wardCode', undefined);
                      form.setValue('ward', undefined);
                    }}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2-level" id="2-level" />
                      <Label htmlFor="2-level" className="font-normal cursor-pointer text-sm">
                        2 cấp <span className="text-muted-foreground">(Tỉnh → Phường/Xã)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-level" id="3-level" />
                      <Label htmlFor="3-level" className="font-normal cursor-pointer text-sm">
                        3 cấp <span className="text-muted-foreground">(Tỉnh → Quận → Phường)</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Province / District / Ward in one row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Province */}
            <FormField
              control={form.control}
              name="provinceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tỉnh/TP *</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value ? { value: field.value, label: form.getValues('province') || '' } : null}
                      onChange={(option) => {
                        const province = provinces.find(p => p.id === option?.value);
                        field.onChange(option?.value);
                        form.setValue('province', province?.name);
                        // Reset district and ward when province changes
                        form.setValue('districtId', undefined);
                        form.setValue('district', undefined);
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
              )}
            />

            {/* District (only for 3-level) */}
            {addressLevel === '3-level' ? (
              <FormField
                control={form.control}
                name="districtId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/Huyện *</FormLabel>
                    <FormControl>
                      <Combobox
                        value={field.value ? { value: field.value.toString(), label: form.getValues('district') || '' } : null}
                        onChange={(option) => {
                          const districtId = option?.value ? parseInt(option.value) : undefined;
                          const district = districts.find(d => d.id === districtId);
                          field.onChange(districtId);
                          form.setValue('district', district?.name);
                          // Reset ward when district changes
                          form.setValue('wardCode', undefined);
                          form.setValue('ward', undefined);
                        }}
                        onSearch={(query) => {
                          if (!query) {
                            return Promise.resolve({
                              items: districts.map(d => ({ value: d.id.toString(), label: d.name })),
                              hasNextPage: false
                            });
                          }
                          const filtered = districts.filter(d => 
                            d.name.toLowerCase().includes(query.toLowerCase())
                          );
                          return Promise.resolve({
                            items: filtered.map(d => ({ value: d.id.toString(), label: d.name })),
                            hasNextPage: false
                          });
                        }}
                        placeholder={!selectedProvinceId ? "Chọn tỉnh trước" : "Chọn quận/huyện"}
                        searchPlaceholder="Tìm quận/huyện..."
                        emptyPlaceholder="Không tìm thấy"
                        disabled={!selectedProvinceId}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="opacity-50">
                <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Quận/Huyện</Label>
                <Select disabled>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Chọn tỉnh trước" />
                  </SelectTrigger>
                </Select>
              </div>
            )}

            {/* Ward */}
            <FormField
              control={form.control}
              name="wardCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phường/Xã *</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value ? { value: field.value, label: form.getValues('ward') || '' } : null}
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
                      placeholder={
                        addressLevel === '2-level' 
                          ? (!selectedProvinceId ? "Chọn tỉnh trước" : "Chọn phường/xã")
                          : (!selectedDistrictId ? "Chọn quận trước" : "Chọn phường/xã")
                      }
                      searchPlaceholder="Tìm phường/xã..."
                      emptyPlaceholder="Không tìm thấy"
                      disabled={
                        addressLevel === '2-level' 
                          ? !selectedProvinceId 
                          : !selectedDistrictId
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Street Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ (Số nhà, tên đường) *</FormLabel>
                <FormControl><Input {...field} value={field.value as string} placeholder="VD: 123 Đường ABC, Tòa nhà XYZ" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section 3: Liên hệ */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold border-b pb-2">Thông tin liên hệ</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại *</FormLabel>
                  <FormControl><Input {...field} value={field.value as string} placeholder="VD: 0123456789" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="managerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người quản lý</FormLabel>
                  <FormControl>
                    <Combobox
                      value={selectedManager}
                      onChange={(option) => field.onChange(option ? option.value : '')}
                      onSearch={searchEmployees}
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
          <h3 className="text-sm font-semibold border-b pb-2">Tùy chọn</h3>
          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">
                    Đặt làm chi nhánh mặc định
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Chi nhánh này sẽ được chọn mặc định khi tạo đơn hàng mới
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit">Lưu</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
