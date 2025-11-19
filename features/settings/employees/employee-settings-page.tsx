
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Changed the import of 'FieldArray as useFieldArray' to 'useFieldArray' to resolve an export error.
import { useForm, useFieldArray } from 'react-hook-form';
import { useEmployeeSettingsStore } from './employee-settings-store.ts';
import type { EmployeeSettings, LeaveType, SalaryComponent } from './types.ts';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { Switch } from '../../../components/ui/switch.tsx';
import { Separator } from '../../../components/ui/separator.tsx';
import { TimePicker } from '../../../components/ui/time-picker.tsx';
import { NumberInput } from '../../../components/ui/number-input.tsx';
import { PlusCircle, Trash2, Edit, CheckCircle2, XCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog.tsx';
import { LeaveTypeForm, type LeaveTypeFormValues } from './leave-type-form.tsx';
import { SalaryComponentForm, type SalaryComponentFormValues } from './salary-component-form.tsx';
import { asBusinessId, asSystemId } from '@/lib/id-types';

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
  
  usePageHeader({
    title: 'Cài đặt nhân viên',
    subtitle: 'Quy định về giờ làm việc, nghỉ phép và lương thưởng',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Cài đặt nhân viên', href: '/settings/employees', isCurrent: true }
    ]
  });

  const form = useForm<EmployeeSettings>({
    defaultValues: settings,
  });

  const { control, handleSubmit, watch } = form;
  
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

  const onSubmit = (data: EmployeeSettings) => {
    setSettings(data);
    navigate('/settings');
  };
  
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
        applicableDepartmentSystemIds: existing?.applicableDepartmentSystemIds ?? [],
      };
       if (editingSalaryComponentIndex !== null) {
          updateSalaryComponent(editingSalaryComponentIndex, fullValue);
      } else {
          appendSalaryComponent(fullValue);
      }
      setIsSalaryComponentFormOpen(false);
  };

  const currentLeaveTypeData = editingLeaveTypeIndex !== null ? leaveTypeFields[editingLeaveTypeIndex] : undefined;
  const currentSalaryComponentData = editingSalaryComponentIndex !== null ? salaryComponentFields[editingSalaryComponentIndex] : undefined;
  
  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-end gap-2 mb-4">
            <Button type="button" variant="outline" onClick={() => navigate('/settings')}>Hủy</Button>
            <Button type="submit">Lưu thay đổi</Button>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chấm công & Thời gian làm việc</CardTitle>
                <CardDescription>Quy định về giờ làm, ca làm việc, OT và các chính sách liên quan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={control} name="workStartTime" render={({ field }) => ( <FormItem><FormLabel>Giờ vào làm</FormLabel><TimePicker value={field.value as string} onChange={field.onChange} /></FormItem> )} />
                  <FormField control={control} name="workEndTime" render={({ field }) => ( <FormItem><FormLabel>Giờ tan làm</FormLabel><TimePicker value={field.value as string} onChange={field.onChange} /></FormItem> )} />
                  <FormField control={control} name="lunchBreakDuration" render={({ field }) => ( <FormItem><FormLabel>Nghỉ trưa (phút)</FormLabel><FormControl><NumberInput {...field} value={field.value as number} /></FormControl></FormItem> )} />
                </div>
                <FormField control={control} name="workingDays" render={() => ( <FormItem> <FormLabel>Ngày làm việc trong tuần</FormLabel> <div className="flex flex-wrap gap-4 pt-2"> {weekDays.map((day) => ( <FormField key={day.id} control={control} name="workingDays" render={({ field }) => ( <FormItem className="flex flex-row items-start space-x-3 space-y-0"> <FormControl> <Checkbox checked={(field.value as number[])?.includes(day.id)} onCheckedChange={(checked) => { return checked ? field.onChange([...(field.value as number[]), day.id]) : field.onChange((field.value as number[])?.filter((value) => value !== day.id)); }} /> </FormControl> <FormLabel className="font-normal">{day.label}</FormLabel> </FormItem> )} /> ))} </div> </FormItem> )} />
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={control} name="allowedLateMinutes" render={({ field }) => ( <FormItem><FormLabel>Số phút đi trễ cho phép</FormLabel><FormControl><NumberInput {...field} value={field.value as number} /></FormControl></FormItem> )} />
                  <FormField control={control} name="latePolicyAction" render={({ field }) => ( <FormItem><FormLabel>Quy tắc xử lý đi trễ</FormLabel><Select onValueChange={field.onChange} value={field.value as string}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent> <SelectItem value="log_violation">Ghi nhận vi phạm</SelectItem> <SelectItem value="deduct_salary">Trừ lương theo phút</SelectItem> <SelectItem value="notify_manager">Gửi thông báo cho quản lý</SelectItem> <SelectItem value="require_explanation">Yêu cầu giải trình</SelectItem> </SelectContent></Select></FormItem> )} />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={control} name="otRateWeekday" render={({ field }) => ( <FormItem><FormLabel>Hệ số OT ngày thường</FormLabel><FormControl><NumberInput step={0.1} {...field} value={field.value as number} /></FormControl></FormItem> )} />
                  <FormField control={control} name="otRateWeekend" render={({ field }) => ( <FormItem><FormLabel>Hệ số OT cuối tuần</FormLabel><FormControl><NumberInput step={0.1} {...field} value={field.value as number} /></FormControl></FormItem> )} />
                  <FormField control={control} name="otRateHoliday" render={({ field }) => ( <FormItem><FormLabel>Hệ số OT ngày lễ</FormLabel><FormControl><NumberInput step={0.1} {...field} value={field.value as number} /></FormControl></FormItem> )} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quản lý Nghỉ phép</CardTitle>
                <CardDescription>Thiết lập các loại phép, quỹ phép năm và các quy định liên quan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField control={control} name="baseAnnualLeaveDays" render={({ field }) => ( <FormItem><FormLabel>Số ngày phép cơ bản/năm</FormLabel><FormControl><NumberInput {...field} value={field.value as number} /></FormControl></FormItem> )} />
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
                              <TableCell className="text-center">{field.isPaid ? <CheckCircle2 className="h-5 w-5 text-green-500 inline-block" /> : <XCircle className="h-5 w-5 text-muted-foreground inline-block" />}</TableCell>
                              <TableCell className="text-center">{field.requiresAttachment ? <CheckCircle2 className="h-5 w-5 text-green-500 inline-block" /> : <XCircle className="h-5 w-5 text-muted-foreground inline-block" />}</TableCell>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Lương & Phúc lợi</CardTitle>
                <CardDescription>Cài đặt các thành phần lương, công thức tính và chu kỳ trả lương.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField control={control} name="payrollCycle" render={({ field }) => ( <FormItem><FormLabel>Chu kỳ trả lương</FormLabel><Select onValueChange={field.onChange} value={field.value as string}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent> <SelectItem value="monthly">Hàng tháng</SelectItem> <SelectItem value="weekly">Hàng tuần</SelectItem> <SelectItem value="bi-weekly">Nửa tháng một lần</SelectItem> </SelectContent></Select></FormItem> )} />
                      <FormField control={control} name="payday" render={({ field }) => ( <FormItem><FormLabel>Ngày trả lương</FormLabel><FormControl><NumberInput placeholder="VD: 5" {...field} value={field.value as number} /></FormControl></FormItem> )} />
                      <FormField control={control} name="payrollLockDate" render={({ field }) => ( <FormItem><FormLabel>Ngày khóa sổ lương</FormLabel><FormControl><NumberInput placeholder="VD: 5" {...field} value={field.value as number} /></FormControl></FormItem> )} />
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
                            <TableHead>Tên thành phần</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead className="text-center">Tính thuế TNCN</TableHead>
                            <TableHead className="text-center">Tính vào lương BHXH</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {salaryComponentFields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell className="font-medium">{field.name}</TableCell>
                              <TableCell>{field.type === 'fixed' ? 'Cố định' : 'Công thức'}</TableCell>
                              <TableCell className="text-center">{field.taxable ? <CheckCircle2 className="h-5 w-5 text-green-500 inline-block" /> : <XCircle className="h-5 w-5 text-muted-foreground inline-block" />}</TableCell>
                              <TableCell className="text-center">{field.partOfSocialInsurance ? <CheckCircle2 className="h-5 w-5 text-green-500 inline-block" /> : <XCircle className="h-5 w-5 text-muted-foreground inline-block" />}</TableCell>
                              <TableCell className="text-right">
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditSalaryComponent(index)}><Edit className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSalaryComponent(index)}><Trash2 className="h-4 w-4" /></Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {salaryComponentFields.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Chưa có thành phần lương nào.</TableCell></TableRow>}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
              </CardContent>
            </Card>
          </div>
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
        <DialogContent>
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
