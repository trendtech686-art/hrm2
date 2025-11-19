import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerFormSchema, validateUniqueId, type CustomerFormData } from "./validation.ts";
import type { Customer, CustomerAddress } from "./types.ts";
import { toast } from 'sonner';
import { useCustomerStore } from './store.ts';
import { useProvinceStore } from "../settings/provinces/store.ts";
import { useCustomerTypeStore } from '../settings/customers/customer-types-store';
import { useCustomerGroupStore } from '../settings/customers/customer-groups-store';
import { useCustomerSourceStore } from '../settings/customers/customer-sources-store';
import { usePaymentTermStore } from '../settings/customers/payment-terms-store';
import { useCreditRatingStore } from '../settings/customers/credit-ratings-store';
import { ImageUploadManager } from '../../components/ui/image-upload-manager.tsx';
import { useImageUpload } from '../../hooks/use-image-upload.ts';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";
import { CurrencyInput } from "../../components/ui/currency-input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { Combobox, type ComboboxOption } from "../../components/ui/combobox.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs.tsx";
import { Card } from "../../components/ui/card.tsx";
import { Textarea } from "../../components/ui/textarea.tsx";
import { CustomerAddresses } from './customer-addresses.tsx';
import { Button } from "../../components/ui/button.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '@/lib/id-types';

export type CustomerFormValues = CustomerFormData;

export type CustomerFormSubmitPayload = Omit<CustomerFormValues, 'id' | 'accountManagerId' | 'createdBy' | 'updatedBy'> & {
  id?: BusinessId;
  accountManagerId?: SystemId;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  addresses: CustomerAddress[];
};

type CustomerFormProps = {
  initialData: Customer | null;
  onSubmit: (values: CustomerFormSubmitPayload) => Promise<void> | void;
  onCancel: () => void;
  isEditMode?: boolean;
};

export function CustomerForm({ initialData, onSubmit, onCancel, isEditMode = false }: CustomerFormProps) {
  const { data: customers } = useCustomerStore();
  const { data: provinces, getWardsByProvinceId } = useProvinceStore();
  
  // Settings stores
  const customerTypes = useCustomerTypeStore();
  const customerGroups = useCustomerGroupStore();
  const customerSources = useCustomerSourceStore();
  const paymentTerms = usePaymentTermStore();
  const creditRatings = useCreditRatingStore();

  // Debug log
  console.log('CustomerForm - isEditMode:', isEditMode, 'initialData:', initialData?.id);

  // State for multiple addresses
  const [addresses, setAddresses] = React.useState<CustomerAddress[]>(initialData?.addresses ?? []);
  
  // Image upload management
  const {
    stagingFiles: imageStagingFiles,
    sessionId: imageSessionId,
    setStagingFiles: setImageStagingFiles,
    setSessionId: setImageSessionId,
    confirmImages,
    hasImages,
  } = useImageUpload({ 
    entityType: 'customer',
    initialImages: initialData?.images 
  });

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      ...initialData,
      id: initialData?.id ?? '',
    },
    mode: 'onChange', // Validate on every change for realtime feedback
    reValidateMode: 'onChange',
  });

  // Debounced unique ID validation
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'id' && value.id) {
        const existingIds = customers.map(c => c.id);
        const normalized = value.id.trim().toUpperCase();
        const isUnique = validateUniqueId(normalized, existingIds, initialData?.id);
        
        if (!isUnique) {
          form.setError('id', {
            type: 'manual',
            message: `Mã khách hàng ${normalized} đã tồn tại`
          });
        } else {
          form.clearErrors('id');
        }
        if (normalized !== value.id) {
          form.setValue('id', normalized, { shouldDirty: true, shouldValidate: false });
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, customers, initialData?.id]);

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      // Validate unique ID
      const normalizedInputId = values.id?.trim().toUpperCase() ?? '';
      const existingIds = customers.map(c => c.id);
      const isUnique = validateUniqueId(normalizedInputId, existingIds, initialData?.id);
      
      if (!isUnique) {
        form.setError('id', {
          type: 'manual',
          message: `Mã khách hàng ${normalizedInputId} đã tồn tại. Vui lòng sử dụng mã khác.`
        });
        toast.error("Lỗi validation", {
          description: `Mã khách hàng ${normalizedInputId} đã tồn tại.`
        });
        return;
      }

      const { id: _rawId, accountManagerId, createdBy, updatedBy, ...restValues } = values;
      const normalizeSystemId = (value?: string | SystemId | null) => {
        if (!value) return undefined;
        const trimmed = String(value).trim();
        if (!trimmed) return undefined;
        return asSystemId(trimmed);
      };
      const payload: CustomerFormSubmitPayload = {
        ...restValues,
        id: normalizedInputId ? asBusinessId(normalizedInputId) : undefined,
        accountManagerId: normalizeSystemId(accountManagerId),
        createdBy: normalizeSystemId(createdBy),
        updatedBy: normalizeSystemId(updatedBy),
        addresses,
      };

      // Call parent onSubmit first to save customer
      await onSubmit(payload);
      
      // After customer is saved, confirm images if any
      if (hasImages) {
        const customerId = payload.id ? String(payload.id) : normalizedInputId;
        if (customerId) {
          await confirmImages(customerId, payload);
        }
      }
    } catch (error) {
      toast.error('Lỗi khi lưu thông tin', {
        description: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  };

  // Convert to Combobox options
  const provinceOptions: ComboboxOption[] = React.useMemo(() => 
    provinces.map(p => ({ value: p.name, label: p.name })), 
    [provinces]
  );
  return (
    <Form {...form}>
      <form id="customer-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 min-w-0 overflow-x-hidden">
        <Tabs defaultValue="info" className="w-full">
          <div className="w-full overflow-x-auto overflow-y-hidden mb-4 pb-1" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
            <TabsList className="inline-flex w-auto gap-1 p-1 h-auto justify-start">
              <TabsTrigger value="info" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Thông tin khách hàng
              </TabsTrigger>
              <TabsTrigger value="images" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Hình ảnh
              </TabsTrigger>
              <TabsTrigger value="business" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Thông tin doanh nghiệp
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Địa chỉ
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Thanh toán & Giá
              </TabsTrigger>
              {!isEditMode && (
                <TabsTrigger value="history" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                  Lịch sử giao dịch
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="info" className="mt-6">
            <h3 className="text-lg font-medium mb-4">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField 
                name="id" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Mã khách hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="CUS000001" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <FormField 
                name="name" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Tên khách hàng <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="phone" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="09xxxxxxxx" 
                        {...field} 
                        value={field.value as string || ''} 
                        maxLength={11}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="email" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="type" 
                control={form.control}
                render={({ field }) => {
                  const typeOptions = customerTypes.getActive().map(type => ({
                    value: type.id,
                    label: type.name,
                  }));
                  const selectedOption = typeOptions.find(opt => opt.value === field.value) || null;
                  
                  return (
                    <FormItem>
                      <FormLabel>Loại khách hàng</FormLabel>
                      <FormControl>
                        <Combobox
                          options={typeOptions}
                          value={selectedOption}
                          onChange={(opt) => field.onChange(opt?.value || '')}
                          placeholder="Chọn loại khách hàng"
                          emptyPlaceholder="Không tìm thấy loại khách hàng"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }} 
              />

              <FormField 
                name="customerGroup" 
                control={form.control}
                render={({ field }) => {
                  const groupOptions = customerGroups.getActive().map(group => ({
                    value: group.id,
                    label: group.name,
                  }));
                  const selectedOption = groupOptions.find(opt => opt.value === field.value) || null;
                  
                  return (
                    <FormItem>
                      <FormLabel>Nhóm khách hàng</FormLabel>
                      <FormControl>
                        <Combobox
                          options={groupOptions}
                          value={selectedOption}
                          onChange={(opt) => field.onChange(opt?.value || '')}
                          placeholder="Chọn nhóm khách hàng"
                          emptyPlaceholder="Không tìm thấy nhóm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }} 
              />

              {/* Thêm fields mới */}
              <FormField 
                name="source" 
                control={form.control}
                render={({ field }) => {
                  const sourceOptions = customerSources.getActive().map(source => ({
                    value: source.id,
                    label: source.name,
                  }));
                  const selectedOption = sourceOptions.find(opt => opt.value === field.value) || null;
                  
                  return (
                    <FormItem>
                      <FormLabel>Nguồn khách hàng</FormLabel>
                      <FormControl>
                        <Combobox
                          options={sourceOptions}
                          value={selectedOption}
                          onChange={(opt) => field.onChange(opt?.value || '')}
                          placeholder="Chọn nguồn khách hàng"
                          emptyPlaceholder="Không tìm thấy nguồn"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }} 
              />

              <FormField 
                name="social.website" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="social.facebook" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="fb.com/username" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="zaloPhone" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Zalo</FormLabel>
                    <FormControl>
                      <Input placeholder="Số Zalo" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="social.linkedin" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              {/* Công nợ */}
              <FormField 
                name="currentDebt" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Công nợ hiện tại</FormLabel>
                    <FormControl>
                      <CurrencyInput 
                        value={field.value as number} 
                        onChange={field.onChange} 
                        placeholder="0" 
                        disabled={isEditMode}
                      />
                    </FormControl>
                    <FormMessage />
                    {isEditMode && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Công nợ được tự động cập nhật khi thanh toán
                      </p>
                    )}
                  </FormItem>
                )} 
              />

              <FormField 
                name="maxDebt" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Hạn mức công nợ</FormLabel>
                    <FormControl>
                      <CurrencyInput 
                        value={field.value as number} 
                        onChange={field.onChange} 
                        placeholder="0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <div className="md:col-span-2 lg:col-span-3">
                <FormField 
                  name="notes" 
                  control={form.control}
                  render={({ field }) => ( 
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Thông tin bổ sung về khách hàng..." 
                          {...field} 
                          value={field.value as string || ''} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            <h3 className="text-lg font-medium mb-4">Hình ảnh khách hàng</h3>
            <ImageUploadManager
              value={imageStagingFiles}
              onChange={setImageStagingFiles}
              sessionId={imageSessionId || undefined}
              onSessionChange={setImageSessionId}
              maxFiles={10}
              maxSize={5 * 1024 * 1024}
              maxTotalSize={20 * 1024 * 1024}
              description="Tải lên hình ảnh khách hàng (avatar, logo công ty, v.v.). Ảnh đầu tiên sẽ được dùng làm ảnh đại diện."
            />
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <h3 className="text-lg font-medium mb-4">Quản lý địa chỉ</h3>
            <CustomerAddresses 
              addresses={addresses} 
              onUpdate={setAddresses}
            />
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <h3 className="text-lg font-medium mb-4">Thông tin doanh nghiệp</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField 
                name="company" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Tên công ty / HKD</FormLabel>
                    <FormControl>
                      <Input placeholder="Công ty TNHH ABC" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="taxCode" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Mã số thuế</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} value={field.value as string || ''} maxLength={13} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="representative" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Người đại diện</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="position" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Chức vụ</FormLabel>
                    <FormControl>
                      <Input placeholder="Giám đốc" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="bankName" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Ngân hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Vietcombank" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="bankAccount" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Số tài khoản</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <h3 className="text-lg font-medium mb-4">Thanh toán & Định giá</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField 
                name="paymentTerms" 
                control={form.control}
                render={({ field }) => {
                  const termOptions = paymentTerms.getActive().map(term => ({
                    value: term.id,
                    label: term.name,
                  }));
                  const selectedOption = termOptions.find(opt => opt.value === field.value) || null;
                  
                  return (
                    <FormItem>
                      <FormLabel>Hạn thanh toán</FormLabel>
                      <FormControl>
                        <Combobox
                          options={termOptions}
                          value={selectedOption}
                          onChange={(opt) => field.onChange(opt?.value || '')}
                          placeholder="Chọn hạn thanh toán"
                          emptyPlaceholder="Không tìm thấy"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }} 
              />

              <FormField 
                name="creditRating" 
                control={form.control}
                render={({ field }) => {
                  const ratingOptions = creditRatings.getActive().map(rating => ({
                    value: rating.id,
                    label: rating.name,
                  }));
                  const selectedOption = ratingOptions.find(opt => opt.value === field.value) || null;
                  
                  return (
                    <FormItem>
                      <FormLabel>Xếp hạng tín dụng</FormLabel>
                      <FormControl>
                        <Combobox
                          options={ratingOptions}
                          value={selectedOption}
                          onChange={(opt) => field.onChange(opt?.value || '')}
                          placeholder="Chọn xếp hạng"
                          emptyPlaceholder="Không tìm thấy"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }} 
              />

              <FormField 
                name="allowCredit" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Cho phép công nợ</FormLabel>
                    <Select onValueChange={(val) => field.onChange(val === 'true')} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Có</SelectItem>
                        <SelectItem value="false">Không</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="pricingLevel" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Bảng giá áp dụng</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn bảng giá" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Retail">Bán lẻ</SelectItem>
                        <SelectItem value="Wholesale">Bán sỉ</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Partner">Đối tác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
          </TabsContent>

          {!isEditMode && (
            <TabsContent value="history" className="mt-6">
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed shadow-sm">
                  <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
                      <h3 className="text-lg font-semibold tracking-tight">Lịch sử giao dịch</h3>
                      <p className="text-sm">Chức năng đang được phát triển.</p>
                  </div>
              </div>
            </TabsContent>
          )}

        </Tabs>
      </form>
    </Form>
  );
}
