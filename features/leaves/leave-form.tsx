import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseDate, getCurrentDate, getStartOfDay, addDays, isDateBefore, isDateSame, toISODate } from '../../lib/date-utils.ts';
import type { LeaveRequest } from "./types.ts";
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
import { ensureBusinessId, type BusinessId, type SystemId } from '../../lib/id-types.ts';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store.ts';

type LeaveFormProps = {
  initialData?: LeaveRequest | null;
  onSubmit: (values: Omit<LeaveRequest, 'systemId'>) => void;
  onCancel: () => void;
};

const FALLBACK_LEAVE_TYPES = [
	{ label: 'Phép năm', value: 'fallback-annual' },
	{ label: 'Nghỉ ốm', value: 'fallback-sick' },
	{ label: 'Nghỉ không lương', value: 'fallback-unpaid' },
];

// Function to calculate business days between two dates
const calculateBusinessDays = (start?: Date, end?: Date): number => {
    if (!start || !end) return 0;
    let curDate = getStartOfDay(start);
    const lastDate = getStartOfDay(end);
    
    if (!curDate || !lastDate) return 0;

    let count = 0;
    while (isDateBefore(curDate, lastDate) || isDateSame(curDate, lastDate)) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday and Saturday
            count++;
        }
        const nextDate = addDays(curDate, 1);
        if (!nextDate) break;
        curDate = nextDate;
    }
    return count;
}


export function LeaveForm({ initialData, onSubmit, onCancel }: LeaveFormProps) {
  const { data: employees } = useEmployeeStore();
  const { settings } = useEmployeeSettingsStore();
  
  const employeeOptions: ComboboxOption[] = React.useMemo(() => 
    employees.map(e => ({ 
      value: e.systemId, 
      label: e.fullName,
      subtitle: e.id
    })),
    [employees]
  );

  type LeaveTypeOption = {
  value: string;
  label: string;
  meta: {
    systemId?: SystemId;
    businessId?: BusinessId;
    isPaid?: boolean;
    requiresAttachment?: boolean;
    name?: string;
  };
  };

  const leaveTypeOptions: LeaveTypeOption[] = React.useMemo(() => {
  const configured = settings.leaveTypes.map((type) => ({
    value: type.systemId,
    label: type.name,
    meta: {
      systemId: type.systemId,
      businessId: type.id,
      isPaid: type.isPaid,
      requiresAttachment: type.requiresAttachment,
    },
  }));

  if (configured.length > 0) {
    return configured;
  }

  const fallbackSource = initialData?.leaveTypeName
    ? [{ label: initialData.leaveTypeName, value: initialData.leaveTypeSystemId ?? `legacy-${initialData.leaveTypeName}` }]
    : FALLBACK_LEAVE_TYPES;

  return fallbackSource.map((item) => ({
    value: item.value,
    label: item.label,
    meta: {
      name: item.label,
    },
  }));
  }, [settings.leaveTypes, initialData]);

  const resolveDefaultLeaveTypeId = React.useCallback(() => {
  if (!leaveTypeOptions.length) {
    return '';
  }
  if (initialData?.leaveTypeSystemId) {
    const exists = leaveTypeOptions.find((opt) => opt.value === initialData.leaveTypeSystemId);
    if (exists) {
      return exists.value;
    }
  }
  if (initialData?.leaveTypeName) {
    const fallback = leaveTypeOptions.find((opt) => opt.label.toLowerCase() === initialData.leaveTypeName.toLowerCase());
    if (fallback) {
      return fallback.value;
    }
  }
  return leaveTypeOptions[0]?.value ?? '';
  }, [initialData, leaveTypeOptions]);

  const form = useForm<LeaveFormSchemaType>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      id: initialData?.id || "", // ✅ Empty string = auto-generate
      employeeSystemId: initialData?.employeeSystemId || "",
      leaveTypeSystemId: resolveDefaultLeaveTypeId(),
      startDate: (initialData ? parseDate(initialData.startDate) : new Date()) ?? new Date(),
      endDate: (initialData ? parseDate(initialData.endDate) : new Date()) ?? new Date(),
      reason: initialData?.reason || '',
      status: initialData?.status || 'Chờ duyệt',
    },
  });

  const { control, handleSubmit, watch } = form;
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const numberOfDays = calculateBusinessDays(startDate, endDate);
  const leaveTypeSystemId = watch('leaveTypeSystemId');

  const selectedLeaveType = React.useMemo(() => leaveTypeOptions.find((opt) => opt.value === leaveTypeSystemId), [leaveTypeOptions, leaveTypeSystemId]);

  const handleFormSubmit = (values: LeaveFormSchemaType) => {
    const employee = employees.find(e => e.systemId === values.employeeSystemId);
    if (!employee || !values.startDate || !values.endDate) {
      toast.error("Lỗi", { description: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    const leaveTypeMeta = leaveTypeOptions.find((option) => option.value === values.leaveTypeSystemId)?.meta;

    const trimmedId = values.id.trim().toUpperCase();

    const resolvedLeaveTypeName = selectedLeaveType?.label || initialData?.leaveTypeName || 'Không xác định';
    const resolvedLeaveTypeSystemId = leaveTypeMeta?.systemId ?? initialData?.leaveTypeSystemId;
    const resolvedLeaveTypeId = leaveTypeMeta?.businessId ?? initialData?.leaveTypeId;

    const finalData: Omit<LeaveRequest, 'systemId'> = {
      id: ensureBusinessId(trimmedId || employee.id, 'LeaveForm'),
      employeeSystemId: employee.systemId,
      employeeId: employee.id, // ✅ Display ID
      employeeName: employee.fullName,
      leaveTypeName: resolvedLeaveTypeName,
      startDate: toISODate(values.startDate),
      endDate: toISODate(values.endDate),
      numberOfDays,
      reason: values.reason,
      status: values.status,
      requestDate: toISODate(getCurrentDate()),
    };

    if (resolvedLeaveTypeSystemId) {
      finalData.leaveTypeSystemId = resolvedLeaveTypeSystemId;
    }
    if (resolvedLeaveTypeId) {
      finalData.leaveTypeId = resolvedLeaveTypeId;
    }
    if (leaveTypeMeta?.isPaid !== undefined) {
      finalData.leaveTypeIsPaid = leaveTypeMeta.isPaid;
    } else if (initialData?.leaveTypeIsPaid !== undefined) {
      finalData.leaveTypeIsPaid = initialData.leaveTypeIsPaid;
    }
    if (leaveTypeMeta?.requiresAttachment !== undefined) {
      finalData.leaveTypeRequiresAttachment = leaveTypeMeta.requiresAttachment;
    } else if (initialData?.leaveTypeRequiresAttachment !== undefined) {
      finalData.leaveTypeRequiresAttachment = initialData.leaveTypeRequiresAttachment;
    }

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
         <FormField control={control} name="leaveTypeSystemId" render={({ field }) => (
          <FormItem>
            <FormLabel>Loại phép</FormLabel>
            <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Chọn loại phép" /></SelectTrigger></FormControl>
                <SelectContent>
                  {leaveTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        {selectedLeaveType?.meta && (
          <p className="text-body-xs text-muted-foreground">
            {selectedLeaveType.meta.isPaid === false ? 'Không tính lương' : 'Được tính lương'}
            {selectedLeaveType.meta.requiresAttachment ? ' · Yêu cầu đính kèm minh chứng' : ''}
          </p>
        )}
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
         <div className="text-body-sm font-medium text-muted-foreground">Tổng số ngày nghỉ (không tính T7, CN): <span className="text-foreground">{numberOfDays}</span></div>
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
