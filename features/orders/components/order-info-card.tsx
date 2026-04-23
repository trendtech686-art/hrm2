import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { useEmployeeComboboxSearch } from '../../employees/hooks/use-employee-search';
import { useAllBranches, type Branch } from '../../settings/branches/hooks/use-all-branches';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Combobox } from '../../../components/ui/combobox';
import { DatePicker } from '../../../components/ui/date-picker';
import { Input } from '../../../components/ui/input';
import { Separator } from '../../../components/ui/separator';
// ⚡ OPTIMIZED: Import hooks only for fallback (when prefetched data not provided)
import { useSalesChannels } from '../../settings/sales-channels/hooks/use-sales-channels';
import { usePaymentMethods } from '../../settings/payments/methods/hooks/use-payment-methods';

// ✅ Type for pre-fetched data from parent
interface OrderInfoCardProps {
  disabled: boolean;
  isBranchLocked?: boolean;
  isMetadataOnlyMode?: boolean;
  salespersonName?: string;
  packerName?: string;
  // ✅ FIX: Pass systemId directly to avoid async issues with getValues()
  onEmployeeChange?: (field: 'salesperson' | 'packer', systemId: string, name: string) => void;
  // ⚡ OPTIMIZED: Optional pre-fetched data to avoid duplicate API calls
  prefetchedBranches?: Branch[];
  prefetchedPaymentMethods?: Array<{ systemId: string; name: string; isActive?: boolean; isDefault?: boolean | null }>;
  prefetchedSalesChannels?: Array<{ systemId: string; name: string; isApplied?: boolean; isDefault?: boolean | null }>;
}

export function OrderInfoCard({ 
  disabled, 
  isBranchLocked = false, 
  isMetadataOnlyMode = false, 
  salespersonName, 
  packerName, 
  onEmployeeChange,
  prefetchedBranches,
  prefetchedPaymentMethods,
  prefetchedSalesChannels,
}: OrderInfoCardProps) {
    const { control } = useFormContext();
    // ⚡ OPTIMIZED: Lazy-load employees on search/scroll (30 per page) instead of loading all
    const { onSearch: searchEmployees, resolveValue: resolveEmployee } = useEmployeeComboboxSearch();
    
    // ⚡ OPTIMIZED: Use prefetched data if available, otherwise fallback to hooks (for standalone usage)
    const { data: fetchedBranches } = useAllBranches({ enabled: !prefetchedBranches });
    const branches = prefetchedBranches ?? fetchedBranches;
    
    // ⚡ OPTIMIZED: Only call hooks if prefetched data not provided
    const { data: pmData } = usePaymentMethods({ isActive: true }, { enabled: !prefetchedPaymentMethods });
    const paymentMethods = React.useMemo(() => 
      prefetchedPaymentMethods ?? pmData?.data ?? [], 
      [prefetchedPaymentMethods, pmData?.data]
    );
    const { data: scData } = useSalesChannels({}, { enabled: !prefetchedSalesChannels });
    const salesChannels = React.useMemo(() => 
      prefetchedSalesChannels ?? scData?.data ?? [], 
      [prefetchedSalesChannels, scData?.data]
    );
    
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
        <Card className={cn(mobileBleedCardClass, "flex flex-col md:h-96.25")}>
            <CardHeader className="shrink-0"><CardTitle>Thông tin bổ sung</CardTitle></CardHeader>
            <CardContent className="flex-1 md:overflow-y-auto space-y-4">
                <FormField control={control} name="branchSystemId" render={({ field }) => (
                  <FormItem><FormLabel>Bán tại</FormLabel><Select key={`branch-${field.value || 'empty'}`} onValueChange={field.onChange} value={field.value || undefined} disabled={disabled || isBranchLocked || isMetadataOnlyMode}><FormControl><SelectTrigger><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger></FormControl><SelectContent>{branchOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select>
                  {isBranchLocked && <p className="text-xs text-muted-foreground mt-1">🔒 Chi nhánh bị khóa sau khi duyệt đơn</p>}
                  </FormItem>
                )}/>
                <FormField control={control} name="salespersonSystemId" render={({ field }) => (
                  <FormItem><FormLabel>Bán bởi</FormLabel><Combobox onSearch={searchEmployees} value={resolveEmployee(field.value, salespersonName)} onChange={option => { field.onChange(option ? option.value : ''); onEmployeeChange?.('salesperson', option?.value || '', option?.label || ''); }} placeholder="Chọn nhân viên" disabled={disabled || isMetadataOnlyMode} /></FormItem>
                )}/>
                <FormField control={control} name="packerId" render={({ field }) => (
                  <FormItem><FormLabel>Nhân viên đóng gói</FormLabel><Combobox onSearch={searchEmployees} value={resolveEmployee(field.value, packerName)} onChange={option => { field.onChange(option ? option.value : ''); onEmployeeChange?.('packer', option?.value || '', option?.label || ''); }} placeholder="Chọn nhân viên đóng gói" disabled={disabled || isMetadataOnlyMode} /><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="orderDate" render={({ field }) => (
                  <FormItem><FormLabel>Ngày bán</FormLabel><FormControl><DatePicker value={field.value} onChange={field.onChange} disabled={disabled} /></FormControl></FormItem>
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
                        disabled={disabled}
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
                        value={field.value ?? ''}
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
                        value={field.value ?? ''}
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
