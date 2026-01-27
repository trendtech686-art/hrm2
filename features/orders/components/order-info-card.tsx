import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { useAllEmployees } from '../../employees/hooks/use-all-employees';
import { useAllBranches } from '../../settings/branches/hooks/use-all-branches';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Combobox } from '../../../components/ui/combobox';
import { DatePicker } from '../../../components/ui/date-picker';
import { Input } from '../../../components/ui/input';
import { Separator } from '../../../components/ui/separator';
import { useSalesChannels } from '../../settings/sales-channels/hooks/use-sales-channels';
import { usePaymentMethods } from '../../settings/payments/hooks/use-payment-methods';

export function OrderInfoCard({ disabled, isBranchLocked = false, isMetadataOnlyMode = false }: { disabled: boolean; isBranchLocked?: boolean; isMetadataOnlyMode?: boolean }) {
    const { control } = useFormContext();
    const { data: employees } = useAllEmployees();
    const { data: branches } = useAllBranches();
    
    // React Query for payment methods and sales channels
    const { data: pmData } = usePaymentMethods({ limit: 1000 });
    const paymentMethods = React.useMemo(() => pmData?.data ?? [], [pmData?.data]);
    const { data: scData } = useSalesChannels({ limit: 1000 });
    const salesChannels = React.useMemo(() => scData?.data ?? [], [scData?.data]);
    
    const employeeOptions = React.useMemo(() => employees.map(e => ({ value: e.systemId, label: e.fullName })), [employees]);
    const branchOptions = React.useMemo(() => branches.map(b => ({ value: b.systemId, label: b.name })), [branches]);
    const channelOptions = React.useMemo(() => {
      return salesChannels
        .filter(channel => channel.isApplied)
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
    }, [salesChannels]);
    const hasChannelOptions = channelOptions.length > 0;
    const paymentMethodOptions = React.useMemo(() => {
      return paymentMethods
        .filter(method => method.isActive)
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
    }, [paymentMethods]);
    const hasPaymentMethodOptions = paymentMethodOptions.length > 0;

    return (
        <Card className="flex flex-col h-96.25">
            <CardHeader className="shrink-0"><CardTitle className="text-base font-semibold">Thông tin bổ sung</CardTitle></CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
                <FormField control={control} name="branchSystemId" render={({ field }) => (
                  <FormItem><FormLabel>Bán tại</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={disabled || isBranchLocked || isMetadataOnlyMode}><FormControl><SelectTrigger><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger></FormControl><SelectContent>{branchOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select>
                  {isBranchLocked && <p className="text-xs text-muted-foreground mt-1">🔒 Chi nhánh bị khóa sau khi duyệt đơn</p>}
                  </FormItem>
                )}/>
                <FormField control={control} name="salespersonSystemId" render={({ field }) => (
                  <FormItem><FormLabel>Bán bởi</FormLabel><Combobox options={employeeOptions} value={employeeOptions.find(opt => opt.value === field.value) || null} onChange={option => field.onChange(option ? option.value : '')} placeholder="Chọn nhân viên" disabled={disabled || isMetadataOnlyMode} /></FormItem>
                )}/>
                <FormField control={control} name="packerId" render={({ field }) => (
                  <FormItem><FormLabel>Nhân viên đóng gói</FormLabel><Combobox options={employeeOptions} value={employeeOptions.find(opt => opt.value === field.value) || null} onChange={option => field.onChange(option ? option.value : '')} placeholder="Chọn nhân viên đóng gói" disabled={disabled || isMetadataOnlyMode} /><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="orderDate" render={({ field }) => (
                  <FormItem><FormLabel>Ngày bán</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} disabled={disabled || isMetadataOnlyMode} /></FormControl></FormItem>
                )}/>
                <FormField control={control} name="source" render={({ field }) => {
                  const showLegacyValue = Boolean(field.value) && !channelOptions.some(option => option.name === field.value);
                  return (
                    <FormItem>
                      <FormLabel>Nguồn</FormLabel>
                      <FormControl>
                        {hasChannelOptions ? (
                          <Select
                            key={field.value || 'empty-source'}
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                            disabled={disabled || isMetadataOnlyMode}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nguồn" />
                            </SelectTrigger>
                            <SelectContent>
                              {showLegacyValue && (
                                <SelectItem value={field.value!}>{field.value}</SelectItem>
                              )}
                              {channelOptions.map(option => (
                                <SelectItem key={option.systemId} value={option.name}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            {...field}
                            placeholder="Nhập nguồn bán hàng"
                            disabled={disabled || isMetadataOnlyMode}
                          />
                        )}
                      </FormControl>
                      {!hasChannelOptions && (
                        <p className="text-xs text-muted-foreground">
                          Chưa có nguồn bán hàng nào được bật. Vào Cấu hình bán hàng → Nguồn bán hàng để thêm mới.
                        </p>
                      )}
                    </FormItem>
                  );
                }}/>
                
                <FormField control={control} name="expectedDeliveryDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hẹn giao</FormLabel>
                    <FormControl>
                      <DatePicker 
                        value={field.value} 
                        onChange={field.onChange} 
                        disabled={disabled || isMetadataOnlyMode}
                        placeholder="Chọn ngày hẹn giao"
                      />
                    </FormControl>
                  </FormItem>
                )}/>
                
                <FormField control={control} name="expectedPaymentMethod" render={({ field }) => {
                  const showLegacyPaymentValue = Boolean(field.value) && !paymentMethodOptions.some(option => option.name === field.value);
                  return (
                    <FormItem>
                      <FormLabel>Thanh toán dự kiến</FormLabel>
                      <FormControl>
                        {hasPaymentMethodOptions ? (
                          <Select
                            key={field.value || 'empty-payment'}
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                            disabled={disabled || isMetadataOnlyMode}
                          >
                            <SelectTrigger><SelectValue placeholder="Chọn phương thức" /></SelectTrigger>
                            <SelectContent>
                              {showLegacyPaymentValue && (
                                <SelectItem value={field.value!}>{field.value}</SelectItem>
                              )}
                              {paymentMethodOptions.map(option => (
                                <SelectItem key={option.systemId} value={option.name}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            {...field}
                            placeholder="Nhập hình thức thanh toán"
                            disabled={disabled || isMetadataOnlyMode}
                          />
                        )}
                      </FormControl>
                      {!hasPaymentMethodOptions && (
                        <p className="text-xs text-muted-foreground">
                          Chưa có hình thức thanh toán nào được bật. Vào Cấu hình thanh toán để thêm mới.
                        </p>
                      )}
                    </FormItem>
                  );
                }}/>
                
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
