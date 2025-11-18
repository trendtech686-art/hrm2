import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { AttendanceDataRow, DailyRecord } from '../types.ts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { TimePicker } from '../../../components/ui/time-picker.tsx';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast.ts';

interface AttendanceEditDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    recordData: { employeeId: string; day: number; record: DailyRecord } | null;
    onSave: (updatedRecord: DailyRecord) => void;
}

// Validation schema
const formSchema = z.object({
    status: z.enum(['present', 'absent', 'leave', 'half-day', 'weekend', 'holiday', 'future']),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    overtimeCheckIn: z.string().optional(),
    overtimeCheckOut: z.string().optional(),
    notes: z.string().optional(),
}).refine((data) => {
    // Validate checkOut > checkIn
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
    // Validate OT checkOut > OT checkIn
    if (data.overtimeCheckIn && data.overtimeCheckOut) {
        const [otInHour, otInMin] = data.overtimeCheckIn.split(':').map(Number);
        const [otOutHour, otOutMin] = data.overtimeCheckOut.split(':').map(Number);
        const otInMinutes = otInHour * 60 + otInMin;
        const otOutMinutes = otOutHour * 60 + otOutMin;
        return otOutMinutes > otInMinutes;
    }
    return true;
}, {
    message: "Giờ OT ra phải sau giờ OT vào",
    path: ["overtimeCheckOut"],
});

type FormValues = z.infer<typeof formSchema>;

export function AttendanceEditDialog({ isOpen, onOpenChange, recordData, onSave }: AttendanceEditDialogProps) {
    const { toast } = useToast();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });
    const { handleSubmit, control, reset, watch, formState: { errors } } = form;

    const status = watch('status');

    React.useEffect(() => {
        if (isOpen && recordData) {
            reset(recordData.record);
        }
    }, [isOpen, recordData, reset]);

    const onSubmit = (data: FormValues) => {
        // Additional validation warnings
        if ((data.status === 'present' || data.status === 'half-day') && (!data.checkIn || !data.checkOut)) {
            toast({
                title: "Cảnh báo",
                description: "Nên điền đầy đủ giờ vào/ra cho ngày làm việc",
                variant: "destructive",
            });
        }
        
        onSave(data as DailyRecord);
        onOpenChange(false);
    };

    const handleClose = () => {
        onOpenChange(false);
    }
    
    if (!recordData) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Chỉnh sửa chấm công
                    </DialogTitle>
                    <DialogDescription>
                        Cập nhật chi tiết chấm công cho ngày {recordData.day}
                    </DialogDescription>
                </DialogHeader>
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
                                            <FormControl><TimePicker {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={control} name="checkOut" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Giờ ra</FormLabel>
                                            <FormControl><TimePicker {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <FormField control={control} name="overtimeCheckIn" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tăng ca (Vào)</FormLabel>
                                            <FormControl><TimePicker {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                     <FormField control={control} name="overtimeCheckOut" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tăng ca (Ra)</FormLabel>
                                            <FormControl><TimePicker {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>
                        )}
                       
                        <FormField
                            control={control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ghi chú</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Thêm ghi chú..." {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={handleClose} className="h-9">
                                Hủy
                            </Button>
                            <Button type="submit" className="h-9">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Lưu thay đổi
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
