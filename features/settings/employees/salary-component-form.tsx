import * as React from "react";
import { useForm } from "react-hook-form";
import type { SalaryComponent, SalaryComponentCategory } from "./types.ts";
import { Button } from "../../../components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Switch } from "../../../components/ui/switch.tsx";
import { DialogFooter } from "../../../components/ui/dialog.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.tsx";
import { CurrencyInput } from "../../../components/ui/currency-input.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs.tsx";
import { Card, CardContent } from "../../../components/ui/card.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { Checkbox } from "../../../components/ui/checkbox.tsx";
import { ScrollArea } from "../../../components/ui/scroll-area.tsx";
import { useDepartmentStore } from "../departments/store.ts";
import { Info, Calculator, Building2, Banknote, Receipt, Coins } from "lucide-react";
import type { SystemId } from "@/lib/id-types";
import { useEmployeeSettingsStore } from "./employee-settings-store.ts";

export type SalaryComponentFormValues = Omit<SalaryComponent, 'systemId' | 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>;

type SalaryComponentFormProps = {
  initialData?: SalaryComponentFormValues | undefined;
  onSubmit: (values: SalaryComponentFormValues) => void;
  onCancel: () => void;
};

const categoryOptions: { value: SalaryComponentCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'earning', label: 'Thu nhập', icon: <Banknote className="h-4 w-4" />, color: 'bg-green-500/10 text-green-700 border-green-200' },
  { value: 'deduction', label: 'Khấu trừ', icon: <Receipt className="h-4 w-4" />, color: 'bg-red-500/10 text-red-700 border-red-200' },
  { value: 'contribution', label: 'Đóng góp', icon: <Coins className="h-4 w-4" />, color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
];

export function SalaryComponentForm({ initialData, onSubmit, onCancel }: SalaryComponentFormProps) {
  const { data: departments } = useDepartmentStore();
  const { settings } = useEmployeeSettingsStore();
  
  // Format số để hiển thị
  const formatNumber = (n: number) => n.toLocaleString('vi-VN');
  
  const form = useForm<SalaryComponentFormValues>({
    defaultValues: initialData || {
      name: '',
      description: '',
      category: 'earning',
      type: 'fixed',
      amount: 0,
      formula: '',
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 0,
      applicableDepartmentSystemIds: [],
    },
  });

  const componentType = form.watch('type');
  const selectedCategory = form.watch('category');
  const selectedDepartments = form.watch('applicableDepartmentSystemIds') || [];

  const handleDepartmentToggle = (departmentSystemId: SystemId) => {
    const current = form.getValues('applicableDepartmentSystemIds') || [];
    if (current.includes(departmentSystemId)) {
      form.setValue('applicableDepartmentSystemIds', current.filter(id => id !== departmentSystemId));
    } else {
      form.setValue('applicableDepartmentSystemIds', [...current, departmentSystemId]);
    }
  };

  const handleSelectAllDepartments = () => {
    const allIds = departments.map(d => d.systemId);
    form.setValue('applicableDepartmentSystemIds', allIds);
  };

  const handleClearAllDepartments = () => {
    form.setValue('applicableDepartmentSystemIds', []);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger value="calculation" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Tính toán
            </TabsTrigger>
            <TabsTrigger value="scope" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Phạm vi áp dụng
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Thông tin cơ bản */}
          <TabsContent value="basic" className="space-y-4 mt-0">
            <FormField control={form.control} name="name" rules={{ required: 'Tên thành phần là bắt buộc' }} render={({ field }) => (
              <FormItem>
                <FormLabel>Tên thành phần <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="VD: Phụ cấp ăn trưa, Thưởng KPI..." {...field} value={field.value ?? ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Mô tả chi tiết về thành phần lương này..." 
                    className="resize-none" 
                    rows={3}
                    {...field} 
                    value={field.value ?? ''} 
                  />
                </FormControl>
                <FormDescription>Ghi chú về cách tính hoặc điều kiện áp dụng</FormDescription>
              </FormItem>
            )} />

            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Phân loại <span className="text-destructive">*</span></FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  {categoryOptions.map(option => (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-all ${
                        field.value === option.value 
                          ? `ring-2 ring-primary ${option.color}` 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => field.onChange(option.value)}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-3 gap-1">
                        {option.icon}
                        <span className="text-sm font-medium">{option.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="sortOrder" render={({ field }) => (
                <FormItem>
                  <FormLabel>Thứ tự hiển thị</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field} 
                      value={field.value ?? 0}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Số nhỏ hơn hiển thị trước</FormDescription>
                </FormItem>
              )} />

              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-fit mt-6">
                  <div className="space-y-0.5">
                    <FormLabel>Kích hoạt</FormLabel>
                    <FormDescription>Bật/tắt thành phần này</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>

          {/* Tab 2: Tính toán */}
          <TabsContent value="calculation" className="space-y-4 mt-0">
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Loại giá trị</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? 'fixed'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Khoản cố định
                      </div>
                    </SelectItem>
                    <SelectItem value="formula">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Theo công thức
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {componentType === 'fixed' 
                    ? 'Số tiền cố định cho mỗi kỳ lương'
                    : 'Tính dựa trên công thức với các biến'}
                </FormDescription>
              </FormItem>
            )} />

            {componentType === 'fixed' ? (
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền</FormLabel>
                  <FormControl>
                    <CurrencyInput 
                      value={field.value ?? 0} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            ) : (
              <>
                <FormField control={form.control} name="formula" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Công thức</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="VD: baseSalary * 0.1 hoặc otPayTotal" 
                        className="font-mono text-sm resize-none"
                        rows={3}
                        {...field} 
                        value={field.value ?? ''} 
                      />
                    </FormControl>
                    <FormDescription>
                      <span className="font-medium">Biến cơ bản:</span> baseSalary, workDays, standardWorkDays, leaveDays, absentDays<br />
                      <span className="font-medium">Biến OT:</span> otHours, otHoursWeekday, otHoursWeekend, otHoursHoliday<br />
                      <span className="font-medium">Tiền OT (đã nhân hệ số):</span> otPayWeekday, otPayWeekend, otPayHoliday, otPayTotal<br />
                      <span className="font-medium">Phụ cấp:</span> mealAllowancePerDay
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                
                {/* Hiển thị ô nhập mealAllowancePerDay khi công thức chứa biến này */}
                {form.watch('formula')?.includes('mealAllowancePerDay') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mức phụ cấp ăn trưa/ngày (VNĐ)</label>
                    <CurrencyInput 
                      value={settings.mealAllowancePerDay || 30000} 
                      onChange={(value) => {
                        // Cập nhật vào settings store
                        useEmployeeSettingsStore.getState().setSettings({
                          ...settings,
                          mealAllowancePerDay: value,
                        });
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Giá trị này áp dụng cho tất cả nhân viên. VD: 30,000đ × 20 ngày = 600,000đ
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="space-y-3 pt-2">
              <FormField control={form.control} name="taxable" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Tính thuế TNCN</FormLabel>
                    <FormDescription>Thành phần này có chịu thuế thu nhập cá nhân không?</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value ?? false} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              
              <FormField control={form.control} name="partOfSocialInsurance" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Tính vào lương đóng BHXH</FormLabel>
                    <FormDescription>Thành phần này có tính vào cơ sở đóng bảo hiểm xã hội không?</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value ?? false} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>

          {/* Tab 3: Phạm vi áp dụng */}
          <TabsContent value="scope" className="space-y-4 mt-0">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phòng ban áp dụng</label>
              <p className="text-sm text-muted-foreground">
                Chọn các phòng ban sẽ được áp dụng thành phần lương này. Để trống = áp dụng tất cả.
              </p>
              
              <div className="flex items-center gap-2 py-2">
                <Button type="button" variant="outline" size="sm" onClick={handleSelectAllDepartments}>
                  Chọn tất cả
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleClearAllDepartments}>
                  Bỏ chọn tất cả
                </Button>
                {selectedDepartments.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    Đã chọn: {selectedDepartments.length}/{departments.length}
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-[200px] rounded-md border p-3">
                <div className="space-y-2">
                  {departments.map(department => (
                    <div 
                      key={department.systemId}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleDepartmentToggle(department.systemId)}
                    >
                      <Checkbox 
                        checked={selectedDepartments.includes(department.systemId)}
                        onCheckedChange={() => handleDepartmentToggle(department.systemId)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{department.name}</p>
                        <p className="text-xs text-muted-foreground">Mã: {department.id}</p>
                      </div>
                    </div>
                  ))}
                  {departments.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Chưa có phòng ban nào trong hệ thống
                    </p>
                  )}
                </div>
              </ScrollArea>

              {selectedDepartments.length === 0 && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Không chọn phòng ban = áp dụng cho tất cả nhân viên
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-6 border-t mt-4">
          <div className="flex items-center gap-2 mr-auto">
            <Badge variant={selectedCategory === 'earning' ? 'default' : selectedCategory === 'deduction' ? 'destructive' : 'secondary'}>
              {categoryOptions.find(c => c.value === selectedCategory)?.label}
            </Badge>
            <Badge variant="outline">
              {componentType === 'fixed' ? 'Cố định' : 'Công thức'}
            </Badge>
          </div>
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit">Lưu</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
