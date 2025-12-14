
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Changed the import of 'FieldArray as useFieldArray' to 'useFieldArray' to resolve an export error.
import { useForm, useFieldArray } from 'react-hook-form';
import { useEmployeeSettingsStore } from './employee-settings-store.ts';
import type { EmployeeSettings, LeaveType, SalaryComponent, LatePenaltyTier } from './types.ts';
import { useSettingsPageHeader } from '../use-settings-page-header.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../../../components/ui/form.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { Switch } from '../../../components/ui/switch.tsx';
import { Separator } from '../../../components/ui/separator.tsx';
import { TimePicker } from '../../../components/ui/time-picker.tsx';
import { NumberInput } from '../../../components/ui/number-input.tsx';
import { CurrencyInput } from '../../../components/ui/currency-input.tsx';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog.tsx';
import { LeaveTypeForm, type LeaveTypeFormValues } from './leave-type-form.tsx';
import { SalaryComponentForm, type SalaryComponentFormValues } from './salary-component-form.tsx';
import { InsuranceTaxSettings } from './insurance-tax-settings.tsx';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { TabsContent } from '../../../components/ui/tabs.tsx';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs.tsx';
import { PenaltyTypesSettingsContent } from '../penalties/penalty-types-settings-content.tsx';
import { PayrollTemplatesSettingsContent } from './payroll-templates-settings-content.tsx';

const weekDays = [
  { id: 1, label: 'Thứ 2' },
  { id: 2, label: 'Thứ 3' },
  { id: 3, label: 'Thứ 4' },
  { id: 4, label: 'Thứ 5' },
  { id: 5, label: 'Thứ 6' },
  { id: 6, label: 'Thứ 7' },
  { id: 0, label: 'Chủ Nhật' },
];

export function EmployeeSettingsPage() {
  const navigate = useNavigate();
  const { settings, setSettings } = useEmployeeSettingsStore();
  
  // Check if redirected from template-page with specific tab
  const initialTab = React.useMemo(() => {
    const savedTab = sessionStorage.getItem('employee-settings-active-tab');
    if (savedTab) {
      sessionStorage.removeItem('employee-settings-active-tab');
      return savedTab;
    }
    return 'attendance';
  }, []);
  
  const [activeTab, setActiveTab] = React.useState(initialTab);

  const form = useForm<EmployeeSettings>({
    defaultValues: settings,
  });

  // Manual validation function
  const validateSettings = React.useCallback((data: EmployeeSettings): string[] => {
    const errors: string[] = [];
    
    if (!data.workStartTime) errors.push('Vui lòng chọn giờ vào làm');
    if (!data.workEndTime) errors.push('Vui lòng chọn giờ tan làm');
    if (!data.lunchBreakStart) errors.push('Vui lòng chọn giờ bắt đầu nghỉ trưa');
    if (!data.lunchBreakEnd) errors.push('Vui lòng chọn giờ kết thúc nghỉ trưa');
    if (data.lunchBreakDuration < 0) errors.push('Thời gian nghỉ trưa không được âm');
    if (!data.workingDays || data.workingDays.length === 0) errors.push('Chọn ít nhất 1 ngày làm việc');
    if (data.standardWorkDays < 1 || data.standardWorkDays > 31) errors.push('Số công chuẩn phải từ 1-31');
    if (data.allowedLateMinutes < 0) errors.push('Số phút đi trễ không được âm');
    if (data.otHourlyRate < 0) errors.push('Tiền làm thêm/giờ không được âm');
    if (data.otRateWeekend < 1) errors.push('Hệ số làm thêm cuối tuần phải >= 1');
    if (data.otRateHoliday < 1) errors.push('Hệ số làm thêm ngày lễ phải >= 1');
    if (data.baseAnnualLeaveDays < 0) errors.push('Số ngày phép không được âm');
    if (data.payday < 1 || data.payday > 31) errors.push('Ngày trả lương phải từ 1-31');
    if (data.payrollLockDate < 1 || data.payrollLockDate > 31) errors.push('Ngày khóa sổ phải từ 1-31');
    
    return errors;
  }, []);

  const { control, handleSubmit, watch } = form;
  const handleCancel = React.useCallback(() => {
    navigate('/settings');
  }, [navigate]);

  const onSubmit = React.useCallback((data: EmployeeSettings) => {
    setSettings(data);
    toast.success('Đã lưu cài đặt nhân viên thành công');
  }, [setSettings]);

  const handleSave = React.useCallback(() => {
    void handleSubmit((data: EmployeeSettings) => {
      const validationErrors = validateSettings(data);
      
      if (validationErrors.length > 0) {
        toast.error('Vui lòng kiểm tra lại thông tin', {
          description: validationErrors.slice(0, 3).join('. '),
        });
        return;
      }
      
      onSubmit(data);
    })();
  }, [handleSubmit, onSubmit, validateSettings]);

  const headerActions = React.useMemo(() => [
    <SettingsActionButton key="cancel" variant="outline" onClick={handleCancel}>
      Hủy
    </SettingsActionButton>,
    <SettingsActionButton key="save" onClick={handleSave}>
      Lưu thay đổi
    </SettingsActionButton>,
  ], [handleCancel, handleSave]);

  useSettingsPageHeader({
    title: 'Cài đặt nhân viên',
    subtitle: 'Quy định về giờ làm việc, nghỉ phép và lương thưởng',
    actions: headerActions,
  });

  const tabs = React.useMemo(() => [
    { value: 'attendance', label: 'Chấm công & Thời gian' },
    { value: 'leave', label: 'Quản lý Nghỉ phép' },
    { value: 'payroll', label: 'Lương & Phúc lợi' },
    { value: 'templates', label: 'Mẫu bảng lương' },
    { value: 'insurance-tax', label: 'Bảo hiểm & Thuế' },
    { value: 'penalties', label: 'Loại phạt' },
  ], []);
  
  // State for dialogs
  const [isLeaveTypeFormOpen, setIsLeaveTypeFormOpen] = React.useState(false);
  const [editingLeaveTypeIndex, setEditingLeaveTypeIndex] = React.useState<number | null>(null);
  const [isSalaryComponentFormOpen, setIsSalaryComponentFormOpen] = React.useState(false);
  const [editingSalaryComponentIndex, setEditingSalaryComponentIndex] = React.useState<number | null>(null);

  const { fields: leaveTypeFields, append: appendLeaveType, remove: removeLeaveType, update: updateLeaveType } = useFieldArray({
      control,
      name: "leaveTypes"
  });

  const { fields: salaryComponentFields, append: appendSalaryComponent, remove: removeSalaryComponent, update: updateSalaryComponent } = useFieldArray({
      control,
      name: "salaryComponents"
  });
  
  const allowRollover = watch('allowRollover');
  
  // --- Handlers for Leave Type Dialog ---
  const handleAddLeaveType = () => {
    setEditingLeaveTypeIndex(null);
    setIsLeaveTypeFormOpen(true);
  };

  const handleEditLeaveType = (index: number) => {
    setEditingLeaveTypeIndex(index);
    setIsLeaveTypeFormOpen(true);
  };
  
  const handleLeaveTypeFormSubmit = (values: LeaveTypeFormValues) => {
    const existing = editingLeaveTypeIndex !== null ? leaveTypeFields[editingLeaveTypeIndex] : undefined;
    const fullValue: LeaveType = {
      ...existing,
      ...values,
      systemId: existing?.systemId ?? asSystemId(`temp-leave-${Date.now()}`),
      id: existing?.id ?? asBusinessId(`TEMP${Date.now()}`),
      applicableGender: existing?.applicableGender ?? 'All',
      applicableDepartmentSystemIds: existing?.applicableDepartmentSystemIds ?? [],
    };
    if (editingLeaveTypeIndex !== null) {
        updateLeaveType(editingLeaveTypeIndex, fullValue);
    } else {
        appendLeaveType(fullValue);
    }
    setIsLeaveTypeFormOpen(false);
  };
  
  // --- Handlers for Salary Component Dialog ---
  const handleAddSalaryComponent = () => {
    setEditingSalaryComponentIndex(null);
    setIsSalaryComponentFormOpen(true);
  };
  
  const handleEditSalaryComponent = (index: number) => {
    setEditingSalaryComponentIndex(index);
    setIsSalaryComponentFormOpen(true);
  };

  const handleSalaryComponentFormSubmit = (values: SalaryComponentFormValues) => {
      const existing = editingSalaryComponentIndex !== null ? salaryComponentFields[editingSalaryComponentIndex] : undefined;
      const fullValue: SalaryComponent = {
        ...existing,
        ...values,
        systemId: existing?.systemId ?? asSystemId(`temp-sal-${Date.now()}`),
        id: existing?.id ?? asBusinessId(`TEMP${Date.now()}`),
      };
       if (editingSalaryComponentIndex !== null) {
          updateSalaryComponent(editingSalaryComponentIndex, fullValue);
      } else {
          appendSalaryComponent(fullValue);
      }
      setIsSalaryComponentFormOpen(false);
  };

  const currentLeaveTypeData = editingLeaveTypeIndex !== null ? (leaveTypeFields[editingLeaveTypeIndex] as unknown as LeaveTypeFormValues) : undefined;
  const currentSalaryComponentData = editingSalaryComponentIndex !== null ? (salaryComponentFields[editingSalaryComponentIndex] as unknown as SalaryComponentFormValues) : undefined;
  
  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
            {/* Tab 1: Chấm công & Thời gian làm việc */}
            <TabsContent value="attendance" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Chấm công & Thời gian làm việc</CardTitle>
                  <CardDescription>Quy định về giờ làm, ca làm việc, OT và các chính sách liên quan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={control} name="workStartTime" render={({ field }) => ( <FormItem><FormLabel>Giờ vào làm</FormLabel><TimePicker value={field.value as string} onChange={field.onChange} /><FormMessage /></FormItem> )} />
                    <FormField control={control} name="workEndTime" render={({ field }) => ( <FormItem><FormLabel>Giờ tan làm</FormLabel><TimePicker value={field.value as string} onChange={field.onChange} /><FormMessage /></FormItem> )} />
                    <FormField control={control} name="standardWorkDays" render={({ field }) => ( <FormItem><FormLabel>Số công chuẩn/tháng</FormLabel><FormControl><NumberInput {...field} value={field.value as number} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={control} name="lunchBreakStart" render={({ field }) => ( <FormItem><FormLabel>Giờ bắt đầu nghỉ trưa</FormLabel><TimePicker value={field.value as string} onChange={field.onChange} /><FormMessage /></FormItem> )} />
                    <FormField control={control} name="lunchBreakEnd" render={({ field }) => ( <FormItem><FormLabel>Giờ kết thúc nghỉ trưa</FormLabel><TimePicker value={field.value as string} onChange={field.onChange} /><FormMessage /></FormItem> )} />
                    <FormField control={control} name="lunchBreakDuration" render={({ field }) => ( <FormItem><FormLabel>Thời gian nghỉ trưa (phút)</FormLabel><FormControl><NumberInput {...field} value={field.value as number} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <FormField control={control} name="workingDays" render={() => ( <FormItem> <FormLabel>Ngày làm việc trong tuần</FormLabel> <div className="flex flex-wrap gap-4 pt-2"> {weekDays.map((day) => ( <FormField key={day.id} control={control} name="workingDays" render={({ field }) => ( <FormItem className="flex flex-row items-start space-x-3 space-y-0"> <FormControl> <Checkbox checked={(field.value as number[])?.includes(day.id)} onCheckedChange={(checked) => { return checked ? field.onChange([...(field.value as number[]), day.id]) : field.onChange((field.value as number[])?.filter((value) => value !== day.id)); }} /> </FormControl> <FormLabel className="font-normal">{day.label}</FormLabel> </FormItem> )} /> ))} </div> <FormMessage /> </FormItem> )} />
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={control} name="allowedLateMinutes" render={({ field }) => ( <FormItem><FormLabel>Số phút đi trễ cho phép (trước khi bắt đầu tính phạt)</FormLabel><FormControl><NumberInput {...field} value={field.value as number} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  
                  {/* Bảng mức phạt đi trễ */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-base">Các mức phạt đi trễ</h4>
                      <Button type="button" size="sm" onClick={() => {
                        const current = form.getValues('latePenaltyTiers') || [];
                        const lastTier = current[current.length - 1];
                        const newFrom = lastTier ? (lastTier.toMinutes || lastTier.fromMinutes + 30) : 0;
                        form.setValue('latePenaltyTiers', [...current, { fromMinutes: newFrom, toMinutes: null, amount: 0 }]);
                      }}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Thêm mức
                      </Button>
                    </div>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Từ (phút)</TableHead>
                            <TableHead className="w-[150px]">Đến (phút)</TableHead>
                            <TableHead>Số tiền phạt (VNĐ)</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(watch('latePenaltyTiers') || []).map((tier, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <NumberInput 
                                  value={tier.fromMinutes} 
                                  onChange={(val) => {
                                    const tiers = [...(form.getValues('latePenaltyTiers') || [])];
                                    tiers[index] = { ...tiers[index], fromMinutes: val };
                                    form.setValue('latePenaltyTiers', tiers);
                                  }} 
                                />
                              </TableCell>
                              <TableCell>
                                <NumberInput 
                                  value={tier.toMinutes ?? undefined} 
                                  placeholder="Không giới hạn"
                                  onChange={(val) => {
                                    const tiers = [...(form.getValues('latePenaltyTiers') || [])];
                                    tiers[index] = { ...tiers[index], toMinutes: typeof val === 'number' ? val : null };
                                    form.setValue('latePenaltyTiers', tiers);
                                  }} 
                                />
                              </TableCell>
                              <TableCell>
                                <CurrencyInput 
                                  value={tier.amount} 
                                  onChange={(val) => {
                                    const tiers = [...(form.getValues('latePenaltyTiers') || [])];
                                    tiers[index] = { ...tiers[index], amount: val ?? 0 };
                                    form.setValue('latePenaltyTiers', tiers);
                                  }} 
                                />
                              </TableCell>
                              <TableCell>
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                                  const tiers = form.getValues('latePenaltyTiers')?.filter((_, i) => i !== index) || [];
                                  form.setValue('latePenaltyTiers', tiers);
                                }}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {(!watch('latePenaltyTiers') || watch('latePenaltyTiers').length === 0) && (
                            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Chưa có mức phạt nào. Thêm mức phạt để tự động tạo phiếu phạt khi đi trễ.</TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Bảng mức phạt về sớm */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-base">Các mức phạt về sớm</h4>
                      <Button type="button" size="sm" onClick={() => {
                        const current = form.getValues('earlyLeavePenaltyTiers') || [];
                        const lastTier = current[current.length - 1];
                        const newFrom = lastTier ? (lastTier.toMinutes || lastTier.fromMinutes + 30) : 0;
                        form.setValue('earlyLeavePenaltyTiers', [...current, { fromMinutes: newFrom, toMinutes: null, amount: 0 }]);
                      }}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Thêm mức
                      </Button>
                    </div>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Từ (phút)</TableHead>
                            <TableHead className="w-[150px]">Đến (phút)</TableHead>
                            <TableHead>Số tiền phạt (VNĐ)</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(watch('earlyLeavePenaltyTiers') || []).map((tier, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <NumberInput 
                                  value={tier.fromMinutes} 
                                  onChange={(val) => {
                                    const tiers = [...(form.getValues('earlyLeavePenaltyTiers') || [])];
                                    tiers[index] = { ...tiers[index], fromMinutes: val };
                                    form.setValue('earlyLeavePenaltyTiers', tiers);
                                  }} 
                                />
                              </TableCell>
                              <TableCell>
                                <NumberInput 
                                  value={tier.toMinutes ?? undefined} 
                                  placeholder="Không giới hạn"
                                  onChange={(val) => {
                                    const tiers = [...(form.getValues('earlyLeavePenaltyTiers') || [])];
                                    tiers[index] = { ...tiers[index], toMinutes: typeof val === 'number' ? val : null };
                                    form.setValue('earlyLeavePenaltyTiers', tiers);
                                  }} 
                                />
                              </TableCell>
                              <TableCell>
                                <CurrencyInput 
                                  value={tier.amount} 
                                  onChange={(val) => {
                                    const tiers = [...(form.getValues('earlyLeavePenaltyTiers') || [])];
                                    tiers[index] = { ...tiers[index], amount: val ?? 0 };
                                    form.setValue('earlyLeavePenaltyTiers', tiers);
                                  }} 
                                />
                              </TableCell>
                              <TableCell>
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                                  const tiers = form.getValues('earlyLeavePenaltyTiers')?.filter((_, i) => i !== index) || [];
                                  form.setValue('earlyLeavePenaltyTiers', tiers);
                                }}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {(!watch('earlyLeavePenaltyTiers') || watch('earlyLeavePenaltyTiers').length === 0) && (
                            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Chưa có mức phạt nào.</TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <FormField control={control} name="otHourlyRate" render={({ field }) => ( 
                      <FormItem>
                        <FormLabel>Tiền làm thêm/giờ ngày thường (VNĐ)</FormLabel>
                        <FormControl>
                          <CurrencyInput value={field.value as number} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem> 
                    )} />
                    <FormField control={control} name="otRateWeekend" render={({ field }) => ( 
                      <FormItem>
                        <FormLabel>Hệ số làm thêm cuối tuần</FormLabel>
                        <FormControl>
                          <NumberInput step={0.1} {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem> 
                    )} />
                    <FormField control={control} name="otRateHoliday" render={({ field }) => ( 
                      <FormItem>
                        <FormLabel>Hệ số làm thêm ngày lễ</FormLabel>
                        <FormControl>
                          <NumberInput step={0.1} {...field} value={field.value as number} />
                        </FormControl>
                        <FormMessage />
                      </FormItem> 
                    )} />
                    <FormField control={control} name="mealAllowancePerDay" render={({ field }) => ( 
                      <FormItem>
                        <FormLabel>Phụ cấp ăn trưa/ngày (VNĐ)</FormLabel>
                        <FormControl>
                          <CurrencyInput value={field.value as number} onChange={field.onChange} />
                        </FormControl>
                        <FormDescription>Tính theo ngày công thực tế</FormDescription>
                        <FormMessage />
                      </FormItem> 
                    )} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Quản lý Nghỉ phép */}
            <TabsContent value="leave" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Quản lý Nghỉ phép</CardTitle>
                  <CardDescription>Thiết lập các loại phép, quỹ phép năm và các quy định liên quan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={control} name="baseAnnualLeaveDays" render={({ field }) => ( <FormItem><FormLabel>Số ngày phép cơ bản/năm</FormLabel><FormControl><NumberInput {...field} value={field.value as number} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <FormField control={control} name="annualLeaveSeniorityBonus" render={() => ( <div className="flex items-center gap-2 flex-wrap"> <span className="text-sm">Sau mỗi</span> <FormField control={control} name="annualLeaveSeniorityBonus.years" render={({ field }) => (<FormItem><FormControl><NumberInput className="w-20" {...field} value={field.value as number} /></FormControl></FormItem>)} /> <span className="text-sm">năm làm việc, cộng thêm</span> <FormField control={control} name="annualLeaveSeniorityBonus.additionalDays" render={({ field }) => (<FormItem><FormControl><NumberInput className="w-20" {...field} value={field.value as number} /></FormControl></FormItem>)} /> <span className="text-sm">ngày phép.</span> </div> )} />
                  <div className="flex items-center gap-4 flex-wrap">
                    <FormField control={control} name="allowRollover" render={({ field }) => ( <FormItem className="flex flex-row items-center space-y-0 space-x-2"> <FormControl> <Switch checked={field.value as boolean} onCheckedChange={field.onChange} /> </FormControl> <FormLabel className="font-normal">Cho phép mang phép tồn sang năm sau</FormLabel> </FormItem> )} />
                    {allowRollover && ( <FormField control={control} name="rolloverExpirationDate" render={({ field }) => ( <FormItem className="flex items-center gap-2"> <FormLabel className="text-sm font-normal">Sử dụng đến hết ngày</FormLabel> <FormControl><Input className="w-28" placeholder="VD: 31/03" {...field} value={field.value as string} /></FormControl> </FormItem> )} /> )}
                  </div>
                  <Separator />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-base">Danh sách các loại nghỉ phép</h4>
                      <Button type="button" size="sm" onClick={handleAddLeaveType}><PlusCircle className="mr-2 h-4 w-4" /> Thêm loại phép</Button>
                    </div>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tên loại phép</TableHead>
                            <TableHead className="text-center">Số ngày</TableHead>
                            <TableHead className="text-center">Hưởng lương</TableHead>
                            <TableHead className="text-center">Y/C File</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leaveTypeFields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell className="font-medium">{field.name}</TableCell>
                              <TableCell className="text-center">{field.numberOfDays}</TableCell>
                              <TableCell className="text-center"><Switch checked={field.isPaid} onCheckedChange={(checked) => updateLeaveType(index, { ...field, isPaid: checked })} /></TableCell>
                              <TableCell className="text-center"><Switch checked={field.requiresAttachment} onCheckedChange={(checked) => updateLeaveType(index, { ...field, requiresAttachment: checked })} /></TableCell>
                              <TableCell className="text-right">
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditLeaveType(index)}><Edit className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeLeaveType(index)}><Trash2 className="h-4 w-4" /></Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {leaveTypeFields.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Chưa có loại nghỉ phép nào.</TableCell></TableRow>}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab 3: Lương & Phúc lợi */}
            <TabsContent value="payroll" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Lương & Phúc lợi</CardTitle>
                  <CardDescription>Cài đặt các thành phần lương, công thức tính và chu kỳ trả lương.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={control} name="payrollCycle" render={({ field }) => ( <FormItem><FormLabel>Chu kỳ trả lương</FormLabel><Select onValueChange={field.onChange} value={field.value as string}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent> <SelectItem value="monthly">Hàng tháng</SelectItem> <SelectItem value="weekly">Hàng tuần</SelectItem> <SelectItem value="bi-weekly">Nửa tháng một lần</SelectItem> </SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormField control={control} name="payday" render={({ field }) => ( <FormItem><FormLabel>Ngày trả lương</FormLabel><FormControl><NumberInput placeholder="VD: 5" {...field} value={field.value as number} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="payrollLockDate" render={({ field }) => ( <FormItem><FormLabel>Ngày khóa sổ lương</FormLabel><FormControl><NumberInput placeholder="VD: 5" {...field} value={field.value as number} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                  <Separator />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-base">Danh sách các thành phần lương & phụ cấp</h4>
                      <Button type="button" size="sm" onClick={handleAddSalaryComponent}><PlusCircle className="mr-2 h-4 w-4" /> Thêm thành phần</Button>
                    </div>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>Tên thành phần</TableHead>
                            <TableHead>Phân loại</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead className="text-center">Tính thuế</TableHead>
                            <TableHead className="text-center">Tính BHXH</TableHead>
                            <TableHead className="text-center">Kích hoạt</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {salaryComponentFields
                            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                            .map((field, index) => (
                            <TableRow key={field.id} className={!field.isActive ? 'opacity-50' : ''}>
                              <TableCell className="text-muted-foreground">{field.sortOrder ?? index + 1}</TableCell>
                              <TableCell className="font-medium">
                                <div>{field.name}</div>
                                {field.description && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{field.description}</div>}
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  field.category === 'earning' ? 'bg-green-100 text-green-700' :
                                  field.category === 'deduction' ? 'bg-red-100 text-red-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {field.category === 'earning' ? 'Thu nhập' : field.category === 'deduction' ? 'Khấu trừ' : 'Đóng góp'}
                                </span>
                              </TableCell>
                              <TableCell>{field.type === 'fixed' ? 'Cố định' : 'Công thức'}</TableCell>
                              <TableCell className="text-center"><Switch checked={field.taxable} onCheckedChange={(checked) => updateSalaryComponent(index, { ...field, taxable: checked })} /></TableCell>
                              <TableCell className="text-center"><Switch checked={field.partOfSocialInsurance} onCheckedChange={(checked) => updateSalaryComponent(index, { ...field, partOfSocialInsurance: checked })} /></TableCell>
                              <TableCell className="text-center"><Switch checked={field.isActive ?? true} onCheckedChange={(checked) => updateSalaryComponent(index, { ...field, isActive: checked })} /></TableCell>
                              <TableCell className="text-right">
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditSalaryComponent(index)}><Edit className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSalaryComponent(index)}><Trash2 className="h-4 w-4" /></Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {salaryComponentFields.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Chưa có thành phần lương nào.</TableCell></TableRow>}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Bảo hiểm & Thuế */}
            <TabsContent value="insurance-tax" className="mt-0">
              <InsuranceTaxSettings />
            </TabsContent>

            {/* Tab 5: Mẫu bảng lương */}
            <TabsContent value="templates" className="mt-0">
              <PayrollTemplatesSettingsContent />
            </TabsContent>

            {/* Tab 6: Loại phạt */}
            <TabsContent value="penalties" className="mt-0">
              <PenaltyTypesSettingsContent />
            </TabsContent>
          </SettingsVerticalTabs>
        </form>
      </Form>

      <Dialog open={isLeaveTypeFormOpen} onOpenChange={setIsLeaveTypeFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLeaveTypeIndex !== null ? 'Chỉnh sửa loại nghỉ phép' : 'Thêm loại nghỉ phép mới'}</DialogTitle>
            <DialogDescription>Điền thông tin chi tiết cho loại nghỉ phép.</DialogDescription>
          </DialogHeader>
          <LeaveTypeForm 
            initialData={currentLeaveTypeData}
            onSubmit={handleLeaveTypeFormSubmit}
            onCancel={() => setIsLeaveTypeFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSalaryComponentFormOpen} onOpenChange={setIsSalaryComponentFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSalaryComponentIndex !== null ? 'Chỉnh sửa thành phần lương' : 'Thêm thành phần lương mới'}</DialogTitle>
            <DialogDescription>Điền thông tin chi tiết cho thành phần lương.</DialogDescription>
          </DialogHeader>
          <SalaryComponentForm
            initialData={currentSalaryComponentData}
            onSubmit={handleSalaryComponentFormSubmit}
            onCancel={() => setIsSalaryComponentFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
