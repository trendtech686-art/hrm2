import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toISODate } from '../../../lib/date-utils';
import type { Penalty, PenaltyType } from './types';
import { penaltyCategoryLabels } from './types';
import { useAllEmployees } from '../../employees/hooks/use-all-employees';
import { useAllPenaltyTypes } from './hooks/use-all-penalties';
// ✅ REMOVED: import { generateNextId } - use id: '' instead
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { CurrencyInput } from "../../../components/ui/currency-input";
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { DatePicker } from '../../../components/ui/date-picker';

type PenaltyFormValues = Omit<Penalty, 'systemId' | 'employeeName' | 'issueDate'> & {
    issueDate?: Date;
    penaltyTypeSystemId?: string;
};

interface PenaltyFormProps {
  initialData: Penalty | null | undefined;
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel: () => void;
  onDelete: (systemId: string) => void;
}

export function PenaltyForm({ initialData, onSubmit, onCancel: _onCancel, onDelete: _onDelete }: PenaltyFormProps) {
  const { data: employees } = useAllEmployees();
  const { data: penaltyTypes } = useAllPenaltyTypes();
  
  // Filter active penalty types
  const activePenaltyTypes = React.useMemo(() => 
    penaltyTypes.filter(t => t.isActive),
    [penaltyTypes]
  );
  
  // Group penalty types by category
  const groupedPenaltyTypes = React.useMemo(() => {
    const groups: Record<string, PenaltyType[]> = {};
    activePenaltyTypes.forEach(type => {
      const category = type.category || 'other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(type);
    });
    return groups;
  }, [activePenaltyTypes]);
  
  const form = useForm<PenaltyFormValues>({
    defaultValues: {
      id: initialData?.id || "", // ✅ Empty string = auto-generate
      employeeSystemId: initialData?.employeeSystemId || '',
      penaltyTypeSystemId: initialData?.penaltyTypeSystemId || '',
      reason: initialData?.reason || '',
      amount: initialData?.amount || 0,
      issueDate: initialData?.issueDate ? new Date(initialData.issueDate) : new Date(),
      status: initialData?.status || 'Chưa thanh toán',
      issuerName: initialData?.issuerName || '',
    },
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    form.reset({
      id: initialData?.id || '',
      employeeSystemId: initialData?.employeeSystemId || '',
      penaltyTypeSystemId: initialData?.penaltyTypeSystemId || '',
      reason: initialData?.reason || '',
      amount: initialData?.amount || 0,
      issueDate: initialData?.issueDate ? new Date(initialData.issueDate) : new Date(),
      status: initialData?.status || 'Chưa thanh toán',
      issuerName: initialData?.issuerName || '',
    });
  }, [initialData, form]);

  const { control, handleSubmit, setValue, watch } = form;
  const selectedPenaltyTypeId = watch('penaltyTypeSystemId');
  
  // Auto-fill amount when penalty type changes
  React.useEffect(() => {
    if (selectedPenaltyTypeId && !initialData) {
      const selectedType = penaltyTypes.find(t => t.systemId === selectedPenaltyTypeId);
      if (selectedType) {
        setValue('amount', selectedType.defaultAmount);
      }
    }
  }, [selectedPenaltyTypeId, penaltyTypes, setValue, initialData]);

  const handleFormSubmit = (values: PenaltyFormValues) => {
    const employee = employees.find(e => e.systemId === values.employeeSystemId);
    const penaltyType = penaltyTypes.find(t => t.systemId === values.penaltyTypeSystemId);
    onSubmit({
      ...values,
      employeeName: employee?.fullName || '',
      penaltyTypeName: penaltyType?.name || '',
      category: penaltyType?.category || 'other',
      issueDate: toISODate(values.issueDate),
    });
  };

  return (
    <Form {...form}>
      <form id="penalty-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField control={control} name="id" render={({ field }) => (
            <FormItem><FormLabel>Mã Phiếu phạt</FormLabel><FormControl><Input className="uppercase" {...field} value={field.value ?? ''} placeholder="Để trống để tự động tạo" onChange={(e) => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={control} name="employeeSystemId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Nhân viên bị phạt</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Chọn nhân viên" /></SelectTrigger></FormControl>
                        <SelectContent>{employees.map(e => <SelectItem key={e.systemId} value={e.systemId}>{e.fullName}</SelectItem>)}</SelectContent>
                    </Select>
                </FormItem>
            )} />
            <FormField control={control} name="issuerName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Người lập phiếu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Chọn người lập" /></SelectTrigger></FormControl>
                        <SelectContent>{employees.map(e => <SelectItem key={e.systemId} value={e.fullName}>{e.fullName}</SelectItem>)}</SelectContent>
                    </Select>
                </FormItem>
            )} />
        </div>
        
        <FormField control={control} name="penaltyTypeSystemId" render={({ field }) => (
          <FormItem>
              <FormLabel>Loại phạt</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Chọn loại phạt" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {Object.entries(groupedPenaltyTypes).map(([category, types]) => (
                      <React.Fragment key={category}>
                        <SelectItem value={`__header_${category}`} disabled className="font-semibold text-xs text-muted-foreground uppercase">
                          {penaltyCategoryLabels[category as keyof typeof penaltyCategoryLabels] || category}
                        </SelectItem>
                        {types.map(type => (
                          <SelectItem key={type.systemId} value={type.systemId}>
                            {type.name} ({type.defaultAmount.toLocaleString('vi-VN')}đ)
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
              </Select>
          </FormItem>
        )} />
        
        <FormField control={control} name="reason" render={({ field }) => (
          <FormItem>
              <FormLabel>Lý do chi tiết</FormLabel>
              <FormControl><Textarea className="min-h-20" placeholder="Nêu rõ lý do phạt..." {...field} value={field.value ?? ''} /></FormControl>
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <FormField control={control} name="amount" render={({ field }) => (
                <FormItem>
                    <FormLabel>Số tiền phạt (VND)</FormLabel>
                    <FormControl><CurrencyInput className="h-9" value={field.value ?? 0} onChange={field.onChange} /></FormControl>
                </FormItem>
            )} />
            <FormField control={control} name="issueDate" render={({ field }) => (
                <FormItem><FormLabel>Ngày lập phiếu</FormLabel><FormControl><DatePicker value={field.value ?? null} onChange={field.onChange} /></FormControl></FormItem>
            )} />
             <FormField control={control} name="status" render={({ field }) => (
                <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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

