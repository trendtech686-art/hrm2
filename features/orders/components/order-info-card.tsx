import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { useEmployeeStore } from '../../employees/store.ts';
import { useBranchStore } from '../../settings/branches/store.ts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../../components/ui/form.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Combobox } from '../../../components/ui/combobox.tsx';
import { DatePicker } from '../../../components/ui/date-picker.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Separator } from '../../../components/ui/separator.tsx';

export function OrderInfoCard({ disabled, isBranchLocked = false, isMetadataOnlyMode = false }: { disabled: boolean; isBranchLocked?: boolean; isMetadataOnlyMode?: boolean }) {
    const { control } = useFormContext();
    const { data: employees } = useEmployeeStore();
    const { data: branches } = useBranchStore();
    
    const employeeOptions = React.useMemo(() => employees.map(e => ({ value: e.systemId, label: e.fullName })), [employees]);
    const branchOptions = React.useMemo(() => branches.map(b => ({ value: b.systemId, label: b.name })), [branches]);

    return (
        <Card className="flex flex-col h-[385px]">
            <CardHeader className="flex-shrink-0"><CardTitle className="text-base font-semibold">Thông tin bổ sung</CardTitle></CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
                <FormField control={control} name="branchSystemId" render={({ field }) => (
                  <FormItem><FormLabel>Bán tại</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={disabled || isBranchLocked || isMetadataOnlyMode}><FormControl><SelectTrigger><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger></FormControl><SelectContent>{branchOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select>
                  {isBranchLocked && <p className="text-xs text-muted-foreground mt-1">🔒 Chi nhánh bị khóa sau khi duyệt đơn</p>}
                  </FormItem>
                )}/>
                <FormField control={control} name="salespersonId" render={({ field }) => (
                  <FormItem><FormLabel>Bán bởi</FormLabel><Combobox options={employeeOptions} value={employeeOptions.find(opt => opt.value === field.value) || null} onChange={option => field.onChange(option ? option.value : '')} placeholder="Chọn nhân viên" disabled={disabled || isMetadataOnlyMode} /></FormItem>
                )}/>
                <FormField control={control} name="packerId" render={({ field }) => (
                  <FormItem><FormLabel>Nhân viên đóng gói</FormLabel><Combobox options={employeeOptions} value={employeeOptions.find(opt => opt.value === field.value) || null} onChange={option => field.onChange(option ? option.value : '')} placeholder="Chọn nhân viên đóng gói" disabled={disabled || isMetadataOnlyMode} /><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="orderDate" render={({ field }) => (
                  <FormItem><FormLabel>Ngày bán</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} disabled={disabled} /></FormControl></FormItem>
                )}/>
                <FormField control={control} name="source" render={({ field }) => (
                  <FormItem><FormLabel>Nguồn</FormLabel><FormControl><Select onValueChange={field.onChange} value={field.value} disabled={disabled || isMetadataOnlyMode}><SelectTrigger><SelectValue placeholder="Chọn nguồn" /></SelectTrigger><SelectContent>
                    <SelectItem value="Cửa hàng">Cửa hàng</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Zalo">Zalo</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent></Select></FormControl></FormItem>
                )}/>
                
                <FormField control={control} name="expectedDeliveryDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hẹn giao</FormLabel>
                    <FormControl>
                      <DatePicker 
                        value={field.value} 
                        onChange={field.onChange} 
                        disabled={disabled}
                        placeholder="Chọn ngày hẹn giao"
                      />
                    </FormControl>
                  </FormItem>
                )}/>
                
                <FormField control={control} name="expectedPaymentMethod" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thanh toán dự kiến</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} disabled={disabled || isMetadataOnlyMode}>
                        <SelectTrigger><SelectValue placeholder="Chọn phương thức" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                          <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                          <SelectItem value="Quẹt thẻ">Quẹt thẻ</SelectItem>
                          <SelectItem value="COD">COD</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}/>
                
                <Separator className="my-2" />
                
                <FormField control={control} name="referenceUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đường dẫn (URL)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="https://example.com/order/123" 
                        disabled={disabled}
                      />
                    </FormControl>
                  </FormItem>
                )}/>
                
                <FormField control={control} name="externalReference" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã tham chiếu</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Mã đơn hàng bên ngoài" 
                        disabled={disabled}
                      />
                    </FormControl>
                  </FormItem>
                )}/>
            </CardContent>
        </Card>
    );
}
