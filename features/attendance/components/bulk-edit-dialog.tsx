import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { DailyRecord } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { TimePicker } from '../../../components/ui/time-picker';
import { Separator } from '../../../components/ui/separator';
import { CheckCircle2, XCircle, Clock, Calendar, Users, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import type { SystemId } from '../../../lib/id-types';

interface BulkEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCells: Array<{ employeeSystemId: SystemId; employeeCode: string; employeeName: string; day: number }>;
  onSave: (updates: Array<{ employeeSystemId: SystemId; day: number; record: DailyRecord }>) => void;
}

// Validation schema
const formSchema = z.object({
  status: z.enum(['present', 'absent', 'leave', 'half-day', 'weekend', 'holiday', 'future']),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  overtimeCheckIn: z.string().optional(),
  overtimeCheckOut: z.string().optional(),
}).refine((data) => {
  if (data.checkIn && data.checkOut) {
    const [checkInHour, checkInMin] = data.checkIn.split(':').map(Number);
    const [checkOutHour, checkOutMin] = data.checkOut.split(':').map(Number);
    const checkInMinutes = checkInHour * 60 + checkInMin;
    const checkOutMinutes = checkOutHour * 60 + checkOutMin;
    return checkOutMinutes > checkInMinutes;
  }
  return true;
}, {
  message: "Giờ ra phải sau giờ vào",
  path: ["checkOut"],
}).refine((data) => {
  if (data.overtimeCheckIn && data.overtimeCheckOut) {
    const [otInHour, otInMin] = data.overtimeCheckIn.split(':').map(Number);
    const [otOutHour, otOutMin] = data.overtimeCheckOut.split(':').map(Number);
    const otInMinutes = otInHour * 60 + otInMin;
    const otOutMinutes = otOutHour * 60 + otOutMin;
    return otOutMinutes > otInMinutes;
  }
  return true;
}, {
  message: "Giờ làm thêm ra phải sau giờ làm thêm vào",
  path: ["overtimeCheckOut"],
});

type FormValues = z.infer<typeof formSchema>;

export function BulkEditDialog({ isOpen, onOpenChange, selectedCells, onSave }: BulkEditDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'present',
    }
  });
  const { handleSubmit, control, reset, watch } = form;

  const status = watch('status');

  React.useEffect(() => {
    if (isOpen) {
      reset({
        status: 'present',
        checkIn: undefined,
        checkOut: undefined,
        overtimeCheckIn: undefined,
        overtimeCheckOut: undefined,
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: FormValues) => {
    const updates = selectedCells.map(cell => ({
      employeeSystemId: cell.employeeSystemId,
      day: cell.day,
      record: data as DailyRecord,
    }));
    onSave(updates);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const groupedByEmployee = React.useMemo(() => {
    const groups: Record<string, { name: string; code: string; days: number[] }> = {};
    selectedCells.forEach(cell => {
      if (!groups[cell.employeeSystemId]) {
        groups[cell.employeeSystemId] = { name: cell.employeeName, code: cell.employeeCode, days: [] };
      }
      groups[cell.employeeSystemId].days.push(cell.day);
    });
    return groups;
  }, [selectedCells]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Chỉnh sửa hàng loạt
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Áp dụng cùng giá trị cho {selectedCells.length} ô đã chọn
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-muted/30">
          <div className="space-y-2 text-body-sm">
            {Object.entries(groupedByEmployee).map(([systemId, info]) => (
              <div key={systemId} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">{info.name}</span>
                  <span className="text-muted-foreground ml-1">({info.code})</span>
                  <span className="text-muted-foreground ml-2">
                    ({info.days.length} ngày: {info.days.sort((a, b) => a - b).join(', ')})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="present">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Đi làm đủ
                        </div>
                      </SelectItem>
                      <SelectItem value="half-day">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          Nửa ngày
                        </div>
                      </SelectItem>
                      <SelectItem value="leave">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          Nghỉ phép
                        </div>
                      </SelectItem>
                      <SelectItem value="absent">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Vắng
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(status === 'present' || status === 'half-day') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="checkIn" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giờ vào</FormLabel>
                      <FormControl><TimePicker {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={control} name="checkOut" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giờ ra</FormLabel>
                      <FormControl><TimePicker {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={control} name="overtimeCheckIn" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tăng ca (Vào)</FormLabel>
                      <FormControl><TimePicker {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={control} name="overtimeCheckOut" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tăng ca (Ra)</FormLabel>
                      <FormControl><TimePicker {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="h-9">
                Hủy
              </Button>
              <Button type="submit" className="h-9">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Áp dụng cho {selectedCells.length} ô
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
