import * as React from 'react';
import { useForm } from 'react-hook-form';
import { formatDate, formatDateCustom, toISODate, toISODateTime } from '../../../lib/date-utils.ts';
import type { Penalty, PenaltyStatus } from './types.ts';
import { useEmployeeStore } from '../../employees/store.ts';
import { usePenaltyStore } from './store.ts';
// ✅ REMOVED: import { generateNextId } - use id: '' instead
import { Button } from '../../../components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { CurrencyInput } from "../../../components/ui/currency-input.tsx";
import { Textarea } from '../../../components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { DatePicker } from '../../../components/ui/date-picker.tsx';
import { DialogFooter } from '../../../components/ui/dialog.tsx';
import { Trash2 } from 'lucide-react';

type PenaltyFormValues = Omit<Penalty, 'systemId' | 'employeeName' | 'issueDate'> & {
    issueDate?: Date;
};

interface PenaltyFormProps {
  initialData: Penalty | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  onDelete: (systemId: string) => void;
}

export function PenaltyForm({ initialData, onSubmit, onCancel, onDelete }: PenaltyFormProps) {
  const { data: employees } = useEmployeeStore();
  const { data: penalties } = usePenaltyStore();
  
  const form = useForm<PenaltyFormValues>({
    defaultValues: {
      id: initialData?.id || "", // ✅ Empty string = auto-generate
      employeeSystemId: initialData?.employeeSystemId || '',
      reason: initialData?.reason || '',
      amount: initialData?.amount || 0,
      issueDate: initialData?.issueDate ? new Date(initialData.issueDate) : new Date(),
      status: initialData?.status || 'Chưa thanh toán',
      issuerName: initialData?.issuerName || '',
    },
  });

  const { control, handleSubmit } = form;

  const handleFormSubmit = (values: PenaltyFormValues) => {
    const employee = employees.find(e => e.systemId === values.employeeSystemId);
    onSubmit({
      ...values,
      employeeName: employee?.fullName || '',
      issueDate: toISODate(values.issueDate),
    });
  };

  return (
    <Form {...form}>
      <form id="penalty-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField control={control} name="id" render={({ field }) => (
            <FormItem><FormLabel>Mã Phiếu phạt</FormLabel><FormControl><Input className="h-9" {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={control} name="employeeSystemId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Nhân viên bị phạt</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Chọn nhân viên" /></SelectTrigger></FormControl>
                        <SelectContent>{employees.map(e => <SelectItem key={e.systemId} value={e.systemId}>{e.fullName}</SelectItem>)}</SelectContent>
                    </Select>
                </FormItem>
            )} />
            <FormField control={control} name="issuerName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Người lập phiếu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Chọn người lập" /></SelectTrigger></FormControl>
                        <SelectContent>{employees.map(e => <SelectItem key={e.systemId} value={e.fullName}>{e.fullName}</SelectItem>)}</SelectContent>
                    </Select>
                </FormItem>
            )} />
        </div>
        
        <FormField control={control} name="reason" render={({ field }) => (
          <FormItem>
              <FormLabel>Lý do</FormLabel>
              <FormControl><Textarea className="min-h-[100px]" placeholder="Nêu rõ lý do phạt..." {...field} value={field.value as string} /></FormControl>
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <FormField control={control} name="amount" render={({ field }) => (
                <FormItem>
                    <FormLabel>Số tiền phạt (VND)</FormLabel>
                    <FormControl><CurrencyInput className="h-9" value={field.value as number} onChange={field.onChange} /></FormControl>
                </FormItem>
            )} />
            <FormField control={control} name="issueDate" render={({ field }) => (
                <FormItem><FormLabel>Ngày lập phiếu</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl></FormItem>
            )} />
             <FormField control={control} name="status" render={({ field }) => (
                <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                            <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                            <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            )} />
        </div>
      </form>
    </Form>
  );
}

