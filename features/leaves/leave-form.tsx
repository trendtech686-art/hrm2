import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getStartOfDay, addDays, isDateBefore, isDateSame, toISODate } from '../../lib/date-utils.ts';
import type { LeaveRequest, LeaveTypeName } from "./types.ts";
import { leaveTypes } from "./data.ts";
import { useEmployeeStore } from "../employees/store.ts";
// ✅ REMOVED: import { generateNextId } - use id: '' instead
import { Button } from "../../components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";
import { DatePicker } from "../../components/ui/date-picker.tsx";
import { Textarea } from "../../components/ui/textarea.tsx";
import { leaveFormSchema, type LeaveFormSchemaType } from "./leave-form-schema.ts";
import { toast } from "sonner";
import { VirtualizedCombobox, type ComboboxOption } from "../../components/ui/virtualized-combobox.tsx";
import { ensureBusinessId } from '../../lib/id-types.ts';

type LeaveFormProps = {
  initialData?: LeaveRequest | null;
  onSubmit: (values: Omit<LeaveRequest, 'systemId'>) => void;
  onCancel: () => void;
};

// Function to calculate business days between two dates
const calculateBusinessDays = (start?: Date, end?: Date): number => {
    if (!start || !end) return 0;
    let count = 0;
    let curDate = getStartOfDay(start);
    const lastDate = getStartOfDay(end);
    while (isDateBefore(curDate, lastDate) || isDateSame(curDate, lastDate)) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday and Saturday
            count++;
        }
        curDate = addDays(curDate, 1);
    }
    return count;
}


export function LeaveForm({ initialData, onSubmit, onCancel }: LeaveFormProps) {
  const { data: employees } = useEmployeeStore();
  const defaultLeaveType: LeaveTypeName = initialData?.leaveTypeName ?? leaveTypes[0] ?? 'Phép năm';
  
  const employeeOptions: ComboboxOption[] = React.useMemo(() => 
    employees.map(e => ({ 
      value: e.systemId, 
      label: e.fullName,
      subtitle: e.id
    })),
    [employees]
  );

  const form = useForm<LeaveFormSchemaType>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      id: initialData?.id || "", // ✅ Empty string = auto-generate
      employeeSystemId: initialData?.employeeSystemId || "",
      leaveTypeName: defaultLeaveType,
      startDate: initialData ? parseDate(initialData.startDate) : new Date(),
      endDate: initialData ? parseDate(initialData.endDate) : new Date(),
      reason: initialData?.reason || '',
      status: initialData?.status || 'Chờ duyệt',
    },
  });

  const { control, handleSubmit, watch, setValue } = form;
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const numberOfDays = calculateBusinessDays(startDate, endDate);

  const handleFormSubmit = (values: LeaveFormSchemaType) => {
    const employee = employees.find(e => e.systemId === values.employeeSystemId);
    if (!employee || !values.startDate || !values.endDate) {
      toast.error("Lỗi", { description: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    const trimmedId = values.id.trim().toUpperCase();

    const finalData: Omit<LeaveRequest, 'systemId'> = {
      ...values,
      id: ensureBusinessId(trimmedId || employee.id, 'LeaveForm'),
      employeeSystemId: employee.systemId,
      employeeId: employee.id, // ✅ Display ID
      employeeName: employee.fullName,
      startDate: toISODate(values.startDate),
      endDate: toISODate(values.endDate),
      numberOfDays,
      requestDate: toISODate(getCurrentDate()),
    };
    onSubmit(finalData);
  };
  

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField control={control} name="id" render={({ field }) => (
            <FormItem>
                <FormLabel>Mã đơn</FormLabel>
                <FormControl><Input {...field} className="h-9" /></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={control} name="employeeSystemId" render={({ field }) => (
          <FormItem>
            <FormLabel>Nhân viên</FormLabel>
            <FormControl>
              <VirtualizedCombobox
                value={employeeOptions.find(opt => opt.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value || '')}
                options={employeeOptions}
                placeholder="Chọn nhân viên"
                searchPlaceholder="Tìm nhân viên..."
                emptyPlaceholder="Không tìm thấy nhân viên"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
         <FormField control={control} name="leaveTypeName" render={({ field }) => (
          <FormItem>
            <FormLabel>Loại phép</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Chọn loại phép" /></SelectTrigger></FormControl>
                <SelectContent>{leaveTypes.map(lt => <SelectItem key={lt} value={lt}>{lt}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="startDate" render={({ field }) => (
                <FormItem>
                    <FormLabel>Từ ngày</FormLabel>
                    <FormControl><DatePicker value={field.value} onChange={field.onChange} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="endDate" render={({ field }) => (
                <FormItem>
                    <FormLabel>Đến ngày</FormLabel>
                    <FormControl><DatePicker value={field.value} onChange={field.onChange} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
         <div className="text-sm font-medium text-muted-foreground">Tổng số ngày nghỉ (không tính T7, CN): <span className="text-foreground">{numberOfDays}</span></div>
         <FormField control={control} name="reason" render={({ field }) => (
            <FormItem>
                <FormLabel>Lý do</FormLabel>
                <FormControl><Textarea placeholder="Nêu rõ lý do xin nghỉ..." {...field} /></FormControl>
                <FormMessage />
            </FormItem>
         )} />

        <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="h-9">Hủy</Button>
            <Button type="submit" className="h-9">Lưu</Button>
        </div>
      </form>
    </Form>
  );
}
