'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
// FIX: Changed the import of 'FieldArray as useFieldArray' to 'useFieldArray' to resolve an export error.
import { useForm, useFieldArray } from 'react-hook-form';
import { useEmployeeSettings, useEmployeeSettingsMutation } from './hooks/use-employee-settings';
import { DEFAULT_EMPLOYEE_SETTINGS, updateSettingsCache } from './employee-settings-service';
import type { EmployeeSettings, LeaveType, SalaryComponent } from '@/lib/types/prisma-extended';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { Button } from '../../../components/ui/button';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { Switch } from '../../../components/ui/switch';
import { Separator } from '../../../components/ui/separator';
import { TimePicker } from '../../../components/ui/time-picker';
import { NumberInput } from '../../../components/ui/number-input';
import { CurrencyInput } from '../../../components/ui/currency-input';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { LeaveTypeForm, type LeaveTypeFormValues } from './leave-type-form';
import { SalaryComponentForm, type SalaryComponentFormValues } from './salary-component-form';
import { InsuranceTaxSettings } from './insurance-tax-settings';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import { TabsContent } from '../../../components/ui/tabs';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs';
import { SettingsHistoryContent } from '../../../components/settings/SettingsHistoryContent';
import { PenaltyTypesSettingsContent } from '../penalties/penalty-types-settings-content';
import { PayrollTemplatesSettingsContent } from './payroll-templates-settings-content';
import { JobTitlesPageContent } from '@/features/settings/job-titles/page-content';
import { DepartmentsSettingsContent } from '@/features/settings/departments/departments-settings-content';
import { EmployeeTypesSettingsContent } from '@/features/settings/employee-types/employee-types-settings-content';
import { LeaveTypesSettingsContent } from './leave-types-settings-content';
import { SalaryComponentsSettingsContent } from './salary-components-settings-content';
import { Skeleton } from '../../../components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';

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
  const router = useRouter();
  const { can, isLoading: authLoading } = useAuth();
  
  // Permission check - redirect if no access
  const canEditSettings = can('edit_settings');
  React.useEffect(() => {
    if (!authLoading && !canEditSettings) {
      toast.error('Bạn không có quyền truy cập cài đặt nhân viên');
      router.replace('/employees');
    }
  }, [authLoading, canEditSettings, router]);
  
  // React Query: fetch settings từ API (Prisma database)
  const { data: apiSettings, isLoading, isError } = useEmployeeSettings();
  const saveMutation = useEmployeeSettingsMutation({
    onSuccess: () => {
      toast.success('Đã lưu cài đặt nhân viên thành công');
    },
    onError: (error) => {
      toast.error('Lỗi khi lưu cài đặt', {
        description: error.message,
      });
    },
  });
  
  // Effective settings: API data hoặc fallback về default settings
  const effectiveSettings = React.useMemo(() => {
    return apiSettings ?? DEFAULT_EMPLOYEE_SETTINGS;
  }, [apiSettings]);
  
  // Check if redirected from template-page with specific tab
  const initialTab = React.useMemo(() => {
    if (typeof window === 'undefined') return 'attendance';
    const savedTab = sessionStorage.getItem('employee-settings-active-tab');
    if (savedTab) {
      sessionStorage.removeItem('employee-settings-active-tab');
      return savedTab;
    }
    return 'attendance';
  }, []);
  
  const [activeTab, setActiveTab] = React.useState(initialTab);

  const form = useForm<EmployeeSettings>({
    defaultValues: effectiveSettings,
  });
  
  // Reset form khi API data load xong
  React.useEffect(() => {
    if (apiSettings) {
      form.reset(apiSettings);
    }
  }, [apiSettings, form]);

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
    router.push('/settings');
  }, [router]);

  // Save to API (Prisma database) and update in-memory cache
  const onSubmit = React.useCallback((data: EmployeeSettings) => {
    // Save to database via API
    saveMutation.mutate(data);
    // Update in-memory cache for services that use sync access
    updateSettingsCache(data);
  }, [saveMutation]);

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

  // Header actions thay đổi theo tab - Chức vụ, Phòng ban và Loại nhân viên có UI riêng nên không cần Hủy/Lưu
  const isIndependentTab = activeTab === 'job-titles' || activeTab === 'departments' || activeTab === 'employee-types' || activeTab === 'history';
  const isSaving = saveMutation.isPending;
  
  const headerActions = React.useMemo(() => {
    // Tabs có CRUD độc lập không cần nút Hủy/Lưu
    if (isIndependentTab) {
      return [];
    }
    return [
      <SettingsActionButton key="cancel" variant="outline" onClick={handleCancel} disabled={isSaving}>
        Hủy
      </SettingsActionButton>,
      <SettingsActionButton key="save" onClick={handleSave} disabled={isSaving}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Lưu thay đổi
      </SettingsActionButton>,
    ];
  }, [handleCancel, handleSave, isIndependentTab, isSaving]);

  useSettingsPageHeader({
    title: 'Cài đặt nhân viên',
    subtitle: isIndependentTab 
      ? (activeTab === 'job-titles' 
          ? 'Quản lý các chức vụ trong công ty' 
          : activeTab === 'departments' 
            ? 'Quản lý các phòng ban trong công ty'
            : 'Thông tin các loại nhân viên trong hệ thống')
      : 'Quy định về giờ làm việc, nghỉ phép và lương thưởng',
    actions: headerActions,
  });

  const tabs = React.useMemo(() => [
    { value: 'attendance', label: 'Chấm công & Thời gian' },
    { value: 'leave', label: 'Quản lý Nghỉ phép' },
    { value: 'payroll', label: 'Lương & Phúc lợi' },
    { value: 'templates', label: 'Mẫu bảng lương' },
    { value: 'insurance-tax', label: 'Bảo hiểm & Thuế' },
    { value: 'penalties', label: 'Loại phạt' },
    { value: 'employee-types', label: 'Loại nhân viên' },
    { value: 'job-titles', label: 'Chức vụ' },
    { value: 'departments', label: 'Phòng ban' },
  ], []);
  
  // State for dialogs
  const [isLeaveTypeFormOpen, setIsLeaveTypeFormOpen] = React.useState(false);
  const [editingLeaveTypeIndex, setEditingLeaveTypeIndex] = React.useState<number | null>(null);
  const [isSalaryComponentFormOpen, setIsSalaryComponentFormOpen] = React.useState(false);
  const [editingSalaryComponentIndex, setEditingSalaryComponentIndex] = React.useState<number | null>(null);

  const { fields: leaveTypeFields, append: appendLeaveType, remove: _removeLeaveType, update: updateLeaveType } = useFieldArray({
      control,
      name: "leaveTypes"
  });

  const { fields: salaryComponentFields, append: appendSalaryComponent, remove: _removeSalaryComponent, update: updateSalaryComponent } = useFieldArray({
      control,
      name: "salaryComponents"
  });
  
  const allowRollover = watch('allowRollover');
  
  // --- Handlers for Leave Type Dialog ---
  const _handleAddLeaveType = () => {
    setEditingLeaveTypeIndex(null);
    setIsLeaveTypeFormOpen(true);
  };

  const _handleEditLeaveType = (index: number) => {
    setEditingLeaveTypeIndex(index);
    setIsLeaveTypeFormOpen(true);
  };
  
  const handleLeaveTypeFormSubmit = (values: LeaveTypeFormValues) => {
    const existing = editingLeaveTypeIndex !== null ? leaveTypeFields[editingLeaveTypeIndex] : undefined;
    const fullValue: LeaveType = {
      ...existing,
      ...values,
      systemId: existing?.systemId ?? asSystemId(generateSubEntityId('LEAVE')),
      id: existing?.id ?? asBusinessId(generateSubEntityId('TEMP')),
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
  const _handleAddSalaryComponent = () => {
    setEditingSalaryComponentIndex(null);
    setIsSalaryComponentFormOpen(true);
  };
  
  const _handleEditSalaryComponent = (index: number) => {
    setEditingSalaryComponentIndex(index);
    setIsSalaryComponentFormOpen(true);
  };

  const handleSalaryComponentFormSubmit = (values: SalaryComponentFormValues) => {
      const existing = editingSalaryComponentIndex !== null ? salaryComponentFields[editingSalaryComponentIndex] : undefined;
      const fullValue: SalaryComponent = {
        ...existing,
        ...values,
        systemId: existing?.systemId ?? asSystemId(generateSubEntityId('SAL')),
        id: existing?.id ?? asBusinessId(generateSubEntityId('TEMP')),
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
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Đang tải cài đặt...</span>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="p-4 border  border-border rounded-md bg-destructive/10">
        <p className="text-destructive">Không thể tải cài đặt. Vui lòng thử lại sau.</p>
      </div>
    );
  }
  
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
                    <div className="border border-border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-37.5">Từ (phút)</TableHead>
                            <TableHead className="w-37.5">Đến (phút)</TableHead>
                            <TableHead>Số tiền phạt (VNĐ)</TableHead>
                            <TableHead className="w-20"></TableHead>
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
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" aria-label="Xóa mức phạt" onClick={() => {
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
                    <div className="border border-border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-37.5">Từ (phút)</TableHead>
                            <TableHead className="w-37.5">Đến (phút)</TableHead>
                            <TableHead>Số tiền phạt (VNĐ)</TableHead>
                            <TableHead className="w-20"></TableHead>
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
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" aria-label="Xóa mức phạt" onClick={() => {
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
                  <LeaveTypesSettingsContent />
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
                  <SalaryComponentsSettingsContent />
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

            {/* Tab 7: Loại nhân viên */}
            <TabsContent value="employee-types" className="mt-0">
              <EmployeeTypesSettingsContent />
            </TabsContent>

            {/* Tab 8: Chức vụ */}
            <TabsContent value="job-titles" className="mt-0">
              <JobTitlesPageContent />
            </TabsContent>

            {/* Tab 9: Phòng ban */}
            <TabsContent value="departments" className="mt-0">
              <DepartmentsSettingsContent />
            </TabsContent>
          </SettingsVerticalTabs>

          <SettingsHistoryContent entityTypes={['department', 'job_title', 'employee_type', 'penalty_type', 'leave_type', 'salary_component', 'employee_settings', 'payroll_template']} />
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
