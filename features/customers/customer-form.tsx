import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerFormSchema, validateUniqueId, type CustomerFormData } from "./validation";
import type { Customer, CustomerAddress } from "@/lib/types/prisma-extended";
import { toast } from 'sonner';
import { useAllCustomers } from './hooks/use-all-customers';
import { useAllEmployees } from '../employees/hooks/use-all-employees';
import { useProvinces } from '../settings/provinces/hooks/use-administrative-units';
import { 
  useActiveCustomerTypes,
  useActiveCustomerGroups,
  useActiveCustomerSources,
  useActivePaymentTerms,
  useActiveCreditRatings,
  useActiveLifecycleStages,
} from '../settings/customers/hooks/use-all-customer-settings';
import { NewDocumentsUpload } from '../../components/ui/new-documents-upload';
import { ExistingDocumentsViewer } from '../../components/ui/existing-documents-viewer';
import { FileUploadAPI, type StagingFile } from '../../lib/file-upload-api';
import { TagInput } from "../../components/ui/tag-input";
import { DatePicker } from "../../components/ui/date-picker";
import { Checkbox } from "../../components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { CurrencyInput } from "../../components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Combobox, type ComboboxOption } from "../../components/ui/combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { CustomerAddresses } from './customer-addresses';
import { Button } from "../../components/ui/button";
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '@/lib/id-types';
import { useAllPricingPolicies } from '../settings/pricing/hooks/use-all-pricing-policies';

export type CustomerFormValues = CustomerFormData;

export type CustomerFormSubmitPayload = Omit<CustomerFormValues, 'id' | 'accountManagerId' | 'createdBy' | 'updatedBy'> & {
  id?: BusinessId;
  accountManagerId?: SystemId;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  // addresses is already in CustomerFormValues
};

type CustomerFormProps = {
  initialData: Customer | null;
  onSubmit: (values: CustomerFormSubmitPayload) => Promise<void> | void;
  onCancel?: () => void;
  onSuccess?: () => void;
  isEditMode?: boolean;
};

export function CustomerForm({ initialData, onSubmit, onCancel: _onCancel, onSuccess, isEditMode = false }: CustomerFormProps) {
  const { data: customers } = useAllCustomers();
  const customerIds = React.useMemo(() => customers.map(c => c.id), [customers]);
  const { data: provinces = [] } = useProvinces();
  const { data: employees } = useAllEmployees();
  
  // Settings - using React Query hooks
  const { data: customerTypesData } = useActiveCustomerTypes();
  const { data: customerGroupsData } = useActiveCustomerGroups();
  const { data: customerSourcesData } = useActiveCustomerSources();
  const { data: paymentTermsData } = useActivePaymentTerms();
  const { data: creditRatingsData } = useActiveCreditRatings();
  const { data: lifecycleStagesData } = useActiveLifecycleStages();
  const { data: pricingPolicies = [] } = useAllPricingPolicies();

  // Debug log

  // ============================================
  // IMAGE UPLOAD STATE (like Employee module)
  // ============================================
  
  // Permanent files (existing files loaded from server)
  const [imagePermanentFiles, setImagePermanentFiles] = React.useState<StagingFile[]>([]);
  // Staging files (new uploads not yet confirmed)
  const [imageStagingFiles, setImageStagingFiles] = React.useState<StagingFile[]>([]);
  // Session ID for staging uploads
  const [imageSessionId, setImageSessionId] = React.useState<string | null>(null);
  // Files marked for deletion (safe delete)
  const [imageFilesToDelete, setImageFilesToDelete] = React.useState<string[]>([]);
  // Loading state
  const [_isLoadingImages, setIsLoadingImages] = React.useState(false);

  // ============================================
  // CONTRACT FILE UPLOAD STATE
  // ============================================
  
  const [contractPermanentFiles, setContractPermanentFiles] = React.useState<StagingFile[]>([]);
  const [contractStagingFiles, setContractStagingFiles] = React.useState<StagingFile[]>([]);
  const [contractSessionId, setContractSessionId] = React.useState<string | null>(null);
  const [contractFilesToDelete, setContractFilesToDelete] = React.useState<string[]>([]);

  // ============================================
  // LOAD EXISTING FILES ON EDIT
  // ============================================
  
  const loadExistingFiles = React.useCallback(async (customerId: string) => {
    if (!customerId) return;
    
    setIsLoadingImages(true);
    try {
      // Load customer images
      const imageFiles = await FileUploadAPI.getCustomerFiles(customerId);
      const mappedImages: StagingFile[] = imageFiles.map(file => ({
        id: file.id,
        sessionId: '', // No session for permanent files
        name: file.name,
        originalName: file.originalName,
        slug: file.slug,
        filename: file.filename,
        size: file.size,
        type: file.type,
        url: file.url,
        status: 'permanent' as const,
        uploadedAt: file.uploadedAt,
        metadata: ''
      }));
      setImagePermanentFiles(mappedImages);
      
      // Load contract files
      const contractFiles = await FileUploadAPI.getCustomerContractFiles(customerId);
      const mappedContracts: StagingFile[] = contractFiles.map(file => ({
        id: file.id,
        sessionId: '',
        name: file.name,
        originalName: file.originalName,
        slug: file.slug,
        filename: file.filename,
        size: file.size,
        type: file.type,
        url: file.url,
        status: 'permanent' as const,
        uploadedAt: file.uploadedAt,
        metadata: ''
      }));
      setContractPermanentFiles(mappedContracts);
      
    } catch (error) {
      console.error('Failed to load customer files:', error);
    } finally {
      setIsLoadingImages(false);
    }
  }, []);

  // Load files when editing existing customer
  React.useEffect(() => {
    if (isEditMode && initialData?.systemId) {
      loadExistingFiles(initialData.systemId);
    }
  }, [isEditMode, initialData?.systemId, loadExistingFiles]);

  // ============================================
  // SAFE DELETE HANDLERS
  // ============================================
  
  const handleMarkImageForDeletion = React.useCallback((fileId: string) => {
    setImageFilesToDelete(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      }
      return [...prev, fileId];
    });
  }, []);

  const handleMarkContractForDeletion = React.useCallback((fileId: string) => {
    setContractFilesToDelete(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      }
      return [...prev, fileId];
    });
  }, []);

  // Refresh handler
  const handleRefreshFiles = React.useCallback(async () => {
    if (initialData?.systemId) {
      await loadExistingFiles(initialData.systemId);
      setImageFilesToDelete([]);
      setContractFilesToDelete([]);
      toast.success('Đã tải lại danh sách file');
    }
  }, [initialData?.systemId, loadExistingFiles]);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      id: initialData?.id ?? '',
      name: initialData?.name ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
      status: initialData?.status ?? 'active',
      type: initialData?.type ?? '',
      customerGroup: initialData?.customerGroup ?? '',
      lifecycleStage: initialData?.lifecycleStage ?? '',
      company: initialData?.company ?? '',
      taxCode: initialData?.taxCode ?? '',
      representative: initialData?.representative ?? '',
      position: initialData?.position ?? '',
      addresses: (Array.isArray(initialData?.addresses) ? initialData.addresses : []).map(addr => {
        console.log('[CustomerForm] Processing address:', addr);
        return {
          ...addr,
          id: addr.id ?? '',
          label: addr.label ?? '',
          street: addr.street ?? '',
          province: addr.province ?? '',
          provinceId: addr.provinceId ?? '',
          ward: addr.ward ?? '',
          wardId: addr.wardId ?? '',
          district: addr.district ?? '',
          districtId: typeof addr.districtId === 'string' 
            ? parseInt(addr.districtId, 10) || 0 
            : addr.districtId ?? 0,
          contactName: addr.contactName ?? '',
          contactPhone: addr.contactPhone ?? '',
          isDefaultShipping: addr.isDefaultShipping ?? false,
          isDefaultBilling: addr.isDefaultBilling ?? false,
          notes: addr.notes ?? '',
        };
      }),
      shippingAddress_street: initialData?.shippingAddress_street ?? '',
      shippingAddress_ward: initialData?.shippingAddress_ward ?? '',
      shippingAddress_province: initialData?.shippingAddress_province ?? '',
      billingAddress_street: initialData?.billingAddress_street ?? '',
      billingAddress_ward: initialData?.billingAddress_ward ?? '',
      billingAddress_province: initialData?.billingAddress_province ?? '',
      zaloPhone: initialData?.zaloPhone ?? '',
      bankName: initialData?.bankName ?? '',
      bankAccount: initialData?.bankAccount ?? '',
      currentDebt: initialData?.currentDebt ?? 0,
      maxDebt: initialData?.maxDebt ?? 0,
      paymentTerms: initialData?.paymentTerms ?? '',
      creditRating: initialData?.creditRating ?? '',
      allowCredit: initialData?.allowCredit ?? false,
      defaultDiscount: initialData?.defaultDiscount ?? 0,
      pricingLevel: initialData?.pricingLevel ?? '',
      source: initialData?.source ?? '',
      campaign: initialData?.campaign ?? '',
      referredBy: initialData?.referredBy ?? '',
      social: {
        facebook: initialData?.social?.facebook ?? '',
        linkedin: initialData?.social?.linkedin ?? '',
        website: initialData?.social?.website ?? '',
      },
      tags: initialData?.tags ?? [],
      images: initialData?.images ?? [],
      contacts: (initialData?.contacts ?? []).map(contact => ({
        id: contact.id ?? '',
        name: contact.name ?? '',
        role: contact.role ?? '',
        phone: contact.phone ?? '',
        email: contact.email ?? '',
        isPrimary: contact.isPrimary ?? false,
      })),
      contract: {
        number: initialData?.contract?.number ?? '',
        startDate: initialData?.contract?.startDate ?? '',
        endDate: initialData?.contract?.endDate ?? '',
        value: initialData?.contract?.value ?? 0,
        status: initialData?.contract?.status ?? 'Pending',
        fileUrl: initialData?.contract?.fileUrl ?? '',
        details: initialData?.contract?.details ?? '',
      },
      notes: initialData?.notes ?? '',
      accountManagerId: initialData?.accountManagerId ?? '',
      accountManagerName: initialData?.accountManagerName ?? '',
    },
    mode: 'onChange', // Validate on every change for realtime feedback
    reValidateMode: 'onChange',
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  // ============================================
  // AUTO-FILL DEFAULTS WHEN CREATING NEW CUSTOMER
  // ============================================
  React.useEffect(() => {
    // Only apply defaults when creating new customer (not editing)
    if (!isEditMode && !initialData) {
      // Find default values from settings (data already filtered to active only)
      const defaultType = customerTypesData.find(t => t.isDefault);
      const defaultGroup = customerGroupsData.find(g => g.isDefault);
      const defaultSource = customerSourcesData.find(s => s.isDefault);
      const defaultStage = lifecycleStagesData.find(l => l.isDefault);
      const defaultPaymentTerm = paymentTermsData.find(p => p.isDefault);
      const defaultCreditRating = creditRatingsData.find(c => c.isDefault);

      // Apply defaults
      if (defaultType) {
        form.setValue('type', defaultType.id);
      }
      if (defaultGroup) {
        form.setValue('customerGroup', defaultGroup.id);
        // Also apply group's default credit limit
        if (defaultGroup.defaultCreditLimit) {
          form.setValue('maxDebt', defaultGroup.defaultCreditLimit);
        }
        // Apply group's default price list
        if (defaultGroup.defaultPriceListId) {
          form.setValue('pricingLevel', defaultGroup.defaultPriceListId);
        }
      }
      if (defaultSource) {
        form.setValue('source', defaultSource.id);
      }
      if (defaultStage) {
        form.setValue('lifecycleStage', defaultStage.id);
      }
      if (defaultPaymentTerm) {
        form.setValue('paymentTerms', defaultPaymentTerm.id);
      }
      if (defaultCreditRating) {
        form.setValue('creditRating', defaultCreditRating.id);
        // Also apply credit rating's max credit limit if customer doesn't have maxDebt yet
        const currentMaxDebt = form.getValues('maxDebt');
        if (defaultCreditRating.maxCreditLimit && (!currentMaxDebt || currentMaxDebt === 0)) {
          form.setValue('maxDebt', defaultCreditRating.maxCreditLimit);
        }
      }

      // Auto-fill default pricing policy (only "Bán hàng" type for customers)
      const defaultPricingPolicy = pricingPolicies.find(p => p.isActive && p.isDefault && p.type === 'Bán hàng');
      if (defaultPricingPolicy) {
        form.setValue('pricingLevel', defaultPricingPolicy.id);
      }

      // Default allowCredit to true (Có)
      form.setValue('allowCredit', true);

      // Default contract status to Active (Đang hiệu lực)
      form.setValue('contract.status', 'Active');

      // Default contract startDate to today
      form.setValue('contract.startDate', new Date().toISOString());
    }
  }, [isEditMode, initialData, customerTypesData, customerGroupsData, customerSourcesData, lifecycleStagesData, paymentTermsData, creditRatingsData, pricingPolicies, form]);

  // Debounced unique ID validation
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'id' && value.id) {
        const existingIds = customerIds;
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
  }, [form, customerIds, initialData?.id]);

  // Watch customer group changes to apply defaults
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'customerGroup' && value.customerGroup) {
        const group = customerGroupsData.find(g => g.id === value.customerGroup);
        if (group) {
          // Apply default credit limit if current value is 0
          if (group.defaultCreditLimit && group.defaultCreditLimit > 0) {
            const currentLimit = form.getValues('maxDebt');
            if (!currentLimit || currentLimit === 0) {
              form.setValue('maxDebt', group.defaultCreditLimit);
              toast.info(`Đã áp dụng hạn mức tín dụng mặc định: ${(group.defaultCreditLimit / 1000000).toLocaleString('vi-VN')}tr`);
            }
          }

          // Apply default price list
          if (group.defaultPriceListId) {
             // Check if price list exists and is active
             const priceList = pricingPolicies.find(p => p.id === group.defaultPriceListId && p.isActive);
             if (priceList) {
               form.setValue('pricingLevel', priceList.id); // Assuming pricingLevel stores the ID
               toast.info(`Đã áp dụng bảng giá mặc định: ${priceList.name}`);
             }
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, customerGroupsData, pricingPolicies]);

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      // Validate unique ID
      const normalizedInputId = values.id?.trim().toUpperCase() ?? '';
      const existingIds = customerIds;
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
        // addresses is already in restValues
      };
      if (normalizedInputId) {
        payload.id = asBusinessId(normalizedInputId);
      }
      if (accountManagerId) {
        const normalized = normalizeSystemId(accountManagerId);
        if (normalized) payload.accountManagerId = normalized;
      }
      if (createdBy) {
        const normalized = normalizeSystemId(createdBy);
        if (normalized) payload.createdBy = normalized;
      }
      if (updatedBy) {
        const normalized = normalizeSystemId(updatedBy);
        if (normalized) payload.updatedBy = normalized;
      }

      // Call parent onSubmit first to save customer
      await onSubmit(payload);
      
      // Get customer ID for file operations
      const customerId = initialData?.systemId || payload.id ? String(payload.id) : normalizedInputId;
      
      // ============================================
      // DELETE MARKED FILES (Safe Delete)
      // ============================================
      
      if (imageFilesToDelete.length > 0) {
        for (const fileId of imageFilesToDelete) {
          try {
            await FileUploadAPI.deleteFile(fileId);
          } catch (error) {
            console.error('Failed to delete image:', fileId, error);
          }
        }
        toast.success(`Đã xóa ${imageFilesToDelete.length} ảnh`);
      }
      
      if (contractFilesToDelete.length > 0) {
        for (const fileId of contractFilesToDelete) {
          try {
            await FileUploadAPI.deleteFile(fileId);
          } catch (error) {
            console.error('Failed to delete contract:', fileId, error);
          }
        }
        toast.success(`Đã xóa ${contractFilesToDelete.length} file hợp đồng`);
      }

      // ============================================
      // CONFIRM STAGING FILES
      // ============================================
      
      // Confirm new images if any
      if (imageSessionId && imageStagingFiles.length > 0 && customerId) {
        try {
          await FileUploadAPI.confirmCustomerImages(imageSessionId, customerId, {
            name: values.name
          });
          toast.success(`Đã lưu ${imageStagingFiles.length} ảnh khách hàng`);
        } catch (error) {
          console.error('Failed to confirm images:', error);
          toast.error('Lỗi khi lưu ảnh');
        }
      }

      // Confirm new contract files if any
      if (contractSessionId && contractStagingFiles.length > 0 && customerId) {
        try {
          await FileUploadAPI.confirmCustomerContractFiles(contractSessionId, customerId, {
            name: values.name
          });
          toast.success(`Đã lưu ${contractStagingFiles.length} file hợp đồng`);
        } catch (error) {
          console.error('Failed to confirm contracts:', error);
          toast.error('Lỗi khi lưu file hợp đồng');
        }
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Lỗi khi lưu thông tin', {
        description: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  };

  // Convert to Combobox options
  const _provinceOptions: ComboboxOption[] = React.useMemo(() => 
    provinces.map(p => ({ value: p.name, label: p.name })), 
    [provinces]
  );
  return (
    <Form {...form}>
      <form id="customer-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 min-w-0 overflow-x-hidden">
        <Tabs defaultValue="info" className="w-full">
          <div className="w-full overflow-x-auto overflow-y-hidden mb-4 pb-1" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
            <TabsList className="inline-flex w-auto gap-1 p-1 h-auto justify-start">
              <TabsTrigger value="info" className="flex-shrink-0 px-3 py-2 text-body-sm font-normal whitespace-nowrap">
                Thông tin khách hàng
              </TabsTrigger>
              <TabsTrigger value="images" className="flex-shrink-0 px-3 py-2 text-body-sm font-normal whitespace-nowrap">
                Hình ảnh
              </TabsTrigger>
              <TabsTrigger value="business" className="flex-shrink-0 px-3 py-2 text-body-sm font-normal whitespace-nowrap">
                Thông tin doanh nghiệp
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex-shrink-0 px-3 py-2 text-body-sm font-normal whitespace-nowrap">
                Liên hệ
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex-shrink-0 px-3 py-2 text-body-sm font-normal whitespace-nowrap">
                Địa chỉ
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex-shrink-0 px-3 py-2 text-body-sm font-normal whitespace-nowrap">
                Thanh toán & Giá
              </TabsTrigger>
              <TabsTrigger value="classification" className="flex-shrink-0 px-3 py-2 text-body-sm font-normal whitespace-nowrap">
                Phân loại & Quản lý
              </TabsTrigger>
              <TabsTrigger value="contract" className="flex-shrink-0 px-3 py-2 text-body-sm font-normal whitespace-nowrap">
                Hợp đồng
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="mt-6">
            <h3 className="text-h4 font-medium mb-4">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField 
                name="id" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Mã khách hàng</FormLabel>
                    <FormControl>
                      <Input className="h-9" placeholder="Để trống sẽ tự động sinh mã" {...field} value={field.value as string || ''} />
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
                      <Input className="h-9" placeholder="Nguyễn Văn A" {...field} value={field.value as string || ''} />
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
                        className="h-9"
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
                      <Input className="h-9" type="email" placeholder="email@example.com" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="type" 
                control={form.control}
                render={({ field }) => {
                  const typeOptions = customerTypesData.map(type => ({
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
                  const groupOptions = customerGroupsData.map(group => ({
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

              <FormField 
                name="lifecycleStage" 
                control={form.control}
                render={({ field }) => {
                  const stageOptions = lifecycleStagesData.map(stage => ({
                    value: stage.id,
                    label: stage.name,
                  }));
                  const selectedOption = stageOptions.find(opt => opt.value === field.value) || null;
                  
                  return (
                    <FormItem>
                      <FormLabel>Giai đoạn vòng đời</FormLabel>
                      <FormControl>
                        <Combobox
                          options={stageOptions}
                          value={selectedOption}
                          onChange={(opt) => field.onChange(opt?.value || '')}
                          placeholder="Chọn giai đoạn"
                          emptyPlaceholder="Không tìm thấy giai đoạn"
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
                  const sourceOptions = customerSourcesData.map(source => ({
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
                      <Input className="h-9" placeholder="https://example.com" {...field} value={field.value as string || ''} />
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
                      <Input className="h-9" placeholder="fb.com/username" {...field} value={field.value as string || ''} />
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
                      <Input className="h-9" placeholder="Số Zalo" {...field} value={field.value as string || ''} />
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
                      <Input className="h-9" placeholder="@username" {...field} value={field.value as string || ''} />
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
            <h3 className="text-h4 font-medium mb-4">Hình ảnh khách hàng</h3>
            
            {/* Existing Images (Permanent) */}
            {isEditMode && imagePermanentFiles.length > 0 && (
              <div className="mb-6">
                <h4 className="text-body-sm font-medium text-muted-foreground mb-2">
                  Ảnh đã lưu ({imagePermanentFiles.length - imageFilesToDelete.length} ảnh)
                  {imageFilesToDelete.length > 0 && (
                    <span className="text-red-500 ml-2">
                      - {imageFilesToDelete.length} ảnh sẽ bị xóa khi Lưu
                    </span>
                  )}
                </h4>
                <ExistingDocumentsViewer
                  files={imagePermanentFiles}
                  onMarkForDeletion={handleMarkImageForDeletion}
                  markedForDeletion={imageFilesToDelete}
                  onRefresh={handleRefreshFiles}
                  gridTemplateClass="grid-cols-5"
                />
              </div>
            )}

            {/* New Image Upload (Staging) */}
            <div>
              {isEditMode && <h4 className="text-body-sm font-medium text-muted-foreground mb-2">Thêm ảnh mới</h4>}
              <NewDocumentsUpload
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }}
                value={imageStagingFiles}
                onChange={setImageStagingFiles}
                sessionId={imageSessionId ?? undefined}
                onSessionChange={setImageSessionId}
                maxFiles={10}
                maxSize={5 * 1024 * 1024}
                maxTotalSize={20 * 1024 * 1024}
                existingFileCount={imagePermanentFiles.length - imageFilesToDelete.length}
                gridTemplateClass="grid-cols-5"
              />
              <p className="text-body-xs text-muted-foreground mt-2">
                Tải lên hình ảnh khách hàng (avatar, logo công ty, v.v.). Ảnh đầu tiên sẽ được dùng làm ảnh đại diện.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <h3 className="text-h4 font-medium mb-4">Quản lý địa chỉ</h3>
            <FormField
              name="addresses"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomerAddresses 
                      addresses={(field.value || []) as CustomerAddress[]} 
                      onUpdate={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="business" className="mt-6">
            <h3 className="text-h4 font-medium mb-4">Thông tin doanh nghiệp</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField 
                name="company" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Tên công ty / HKD</FormLabel>
                    <FormControl>
                      <Input className="h-9" placeholder="Công ty TNHH ABC" {...field} value={field.value as string || ''} />
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
                      <Input className="h-9" placeholder="0123456789" {...field} value={field.value as string || ''} maxLength={13} />
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
                      <Input className="h-9" placeholder="Nguyễn Văn A" {...field} value={field.value as string || ''} />
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
                      <Input className="h-9" placeholder="Giám đốc" {...field} value={field.value as string || ''} />
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
                      <Input className="h-9" placeholder="Vietcombank" {...field} value={field.value as string || ''} />
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
                      <Input className="h-9" placeholder="1234567890" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <h3 className="text-h4 font-medium mb-4">Thanh toán & Định giá</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField 
                name="paymentTerms" 
                control={form.control}
                render={({ field }) => {
                  const termOptions = paymentTermsData.map(term => ({
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
                  const ratingOptions = creditRatingsData.map(rating => ({
                    value: rating.id,
                    label: rating.name,
                  }));
                  const selectedOption = ratingOptions.find(opt => opt.value === field.value) || null;
                  
                  // Handler to auto-fill maxDebt when creditRating changes
                  const handleCreditRatingChange = (opt: { value: string; label: string } | null) => {
                    field.onChange(opt?.value || '');
                    
                    // Auto-fill maxDebt from selected rating's maxCreditLimit
                    if (opt?.value) {
                      const selectedRating = creditRatingsData.find(r => r.id === opt.value);
                      if (selectedRating?.maxCreditLimit) {
                        form.setValue('maxDebt', selectedRating.maxCreditLimit);
                      }
                    }
                  };
                  
                  return (
                    <FormItem>
                      <FormLabel>Xếp hạng tín dụng</FormLabel>
                      <FormControl>
                        <Combobox
                          options={ratingOptions}
                          value={selectedOption}
                          onChange={handleCreditRatingChange}
                          placeholder="Chọn xếp hạng"
                          emptyPlaceholder="Không tìm thấy"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }} 
              />

              {/* Công nợ - Có thể edit cả khi tạo mới và chỉnh sửa */}
              <FormField 
                name="currentDebt" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Công nợ hiện tại</FormLabel>
                    <FormControl>
                      <CurrencyInput 
                        className="h-9"
                        value={field.value as number} 
                        onChange={field.onChange} 
                        placeholder="0"
                        disabled={false}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      {isEditMode ? 'Có thể điều chỉnh công nợ trực tiếp' : 'Nhập công nợ ban đầu nếu có'}
                    </p>
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
                        className="h-9"
                        value={field.value as number} 
                        onChange={field.onChange} 
                        placeholder="0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="allowCredit" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Cho phép công nợ</FormLabel>
                    <Select onValueChange={(val) => field.onChange(val === 'true')} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="h-9">
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
                render={({ field }) => {
                  const pricingOptions = pricingPolicies
                    .filter(p => p.isActive)
                    .map(p => ({
                      value: p.id,
                      label: p.name,
                    }));
                  const selectedOption = pricingOptions.find(opt => opt.value === field.value) || null;

                  return (
                    <FormItem>
                      <FormLabel>Bảng giá áp dụng</FormLabel>
                      <FormControl>
                        <Combobox
                          options={pricingOptions}
                          value={selectedOption}
                          onChange={(opt) => field.onChange(opt?.value || '')}
                          placeholder="Chọn bảng giá"
                          emptyPlaceholder="Không tìm thấy bảng giá"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }} 
              />

              <FormField 
                name="defaultDiscount" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Chiết khấu mặc định (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        className="h-9" 
                        placeholder="0" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        value={field.value as number || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h4 font-medium">Danh sách liên hệ</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => appendContact({ id: crypto.randomUUID(), name: '', role: '', isPrimary: false })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm liên hệ
              </Button>
            </div>
            
            <div className="space-y-4">
              {contactFields.map((field, index) => (
                <Card key={field.id} className="p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive hover:text-destructive/90"
                    onClick={() => removeContact(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                    <FormField
                      name={`contacts.${index}.name`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nguyễn Văn A" className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name={`contacts.${index}.role`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chức vụ / Vai trò</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Kế toán, Mua hàng..." className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name={`contacts.${index}.phone`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="09xxxxxxxx" className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name={`contacts.${index}.email`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="email@example.com" className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      name={`contacts.${index}.isPrimary`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Người liên hệ chính
                            </FormLabel>
                            <FormDescription>
                              Sử dụng thông tin này làm liên hệ mặc định
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
              
              {contactFields.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg text-muted-foreground">
                  Chưa có thông tin liên hệ nào
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contract" className="mt-6">
            <h3 className="text-h4 font-medium mb-4">Thông tin hợp đồng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                name="contract.number" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Số hợp đồng</FormLabel>
                    <FormControl>
                      <Input className="h-9" placeholder="HD-001" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="contract.status" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Đang hiệu lực</SelectItem>
                        <SelectItem value="Pending">Chờ duyệt</SelectItem>
                        <SelectItem value="Expired">Hết hạn</SelectItem>
                        <SelectItem value="Cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="contract.startDate" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <DatePicker 
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date ? date.toISOString() : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="contract.endDate" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <FormControl>
                      <DatePicker 
                        value={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date ? date.toISOString() : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="contract.value" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Giá trị hợp đồng</FormLabel>
                    <FormControl>
                      <CurrencyInput 
                        className="h-9"
                        value={field.value as number} 
                        onChange={field.onChange} 
                        placeholder="0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                name="contract.fileUrl" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem className="md:col-span-2">
                    <FormLabel>File hợp đồng</FormLabel>
                    
                    {/* Existing Contract Files (Permanent) */}
                    {isEditMode && contractPermanentFiles.length > 0 && (
                      <div className="mb-4">
                        <p className="text-body-sm text-muted-foreground mb-2">
                          File hợp đồng đã lưu ({contractPermanentFiles.length - contractFilesToDelete.length} file)
                          {contractFilesToDelete.length > 0 && (
                            <span className="text-red-500 ml-2">
                              - {contractFilesToDelete.length} file sẽ bị xóa khi Lưu
                            </span>
                          )}
                        </p>
                        <ExistingDocumentsViewer
                          files={contractPermanentFiles}
                          onMarkForDeletion={handleMarkContractForDeletion}
                          markedForDeletion={contractFilesToDelete}
                          gridTemplateClass="grid-cols-3"
                        />
                      </div>
                    )}
                    
                    {/* New Contract Upload (Staging) */}
                    <FormControl>
                      <NewDocumentsUpload
                        value={contractStagingFiles}
                        onChange={(files) => {
                          setContractStagingFiles(files);
                          if (files.length > 0) {
                            if (!field.value) field.onChange('pending-upload');
                          } else {
                            field.onChange('');
                          }
                        }}
                        sessionId={contractSessionId ?? undefined}
                        onSessionChange={setContractSessionId}
                        maxFiles={5}
                        maxSize={10 * 1024 * 1024}
                        existingFileCount={contractPermanentFiles.length - contractFilesToDelete.length}
                        accept={{ 
                          'application/pdf': ['.pdf'], 
                          'image/*': ['.png', '.jpg', '.jpeg'],
                          'application/msword': ['.doc'],
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                        }}
                        gridTemplateClass="grid-cols-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <div className="md:col-span-2">
                <FormField 
                  name="contract.details" 
                  control={form.control}
                  render={({ field }) => ( 
                    <FormItem>
                      <FormLabel>Chi tiết điều khoản</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nội dung chi tiết..." 
                          {...field} 
                          value={field.value as string || ''} 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="classification" className="mt-6">
            <h3 className="text-h4 font-medium mb-4">Phân loại & Quản lý</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField 
                name="accountManagerId" 
                control={form.control}
                render={({ field }) => {
                  const employeeOptions = (employees || []).map(emp => ({
                    value: emp.systemId,
                    label: emp.fullName,
                  }));
                  const selectedOption = employeeOptions.find(opt => opt.value === field.value) || null;
                  
                  return (
                    <FormItem>
                      <FormLabel>Nhân viên phụ trách</FormLabel>
                      <FormControl>
                        <Combobox
                          options={employeeOptions}
                          value={selectedOption}
                          onChange={(opt) => field.onChange(opt?.value || '')}
                          placeholder="Chọn nhân viên"
                          emptyPlaceholder="Không tìm thấy nhân viên"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }} 
              />

              <FormField 
                name="referredBy" 
                control={form.control}
                render={({ field }) => {
                  const customerOptions = (customers || [])
                    .filter(c => c.id !== initialData?.id) // Exclude self
                    .map(c => ({
                      value: c.systemId,
                      label: `${c.name} (${c.id})`,
                    }));
                  const selectedOption = customerOptions.find(opt => opt.value === field.value) || null;
                  
                  return (
                    <FormItem>
                      <FormLabel>Người giới thiệu</FormLabel>
                      <FormControl>
                        <Combobox
                          options={customerOptions}
                          value={selectedOption}
                          onChange={(opt) => field.onChange(opt?.value || '')}
                          placeholder="Chọn người giới thiệu"
                          emptyPlaceholder="Không tìm thấy khách hàng"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }} 
              />

              <FormField 
                name="campaign" 
                control={form.control}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Chiến dịch</FormLabel>
                    <FormControl>
                      <Input className="h-9" placeholder="Tên chiến dịch" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <div className="md:col-span-2 lg:col-span-3">
                <FormField 
                  name="tags" 
                  control={form.control}
                  render={({ field }) => ( 
                    <FormItem>
                      <FormLabel>Thẻ (Tags)</FormLabel>
                      <FormControl>
                        <TagInput
                          placeholder="Nhập thẻ và nhấn Enter..."
                          value={field.value || []}
                          onChange={(newTags) => field.onChange(newTags)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </form>
    </Form>
  );
}
