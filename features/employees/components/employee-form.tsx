import * as React from "react";
import { flushSync } from 'react-dom';
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Employee, EmployeeAddress } from '@/lib/types/prisma-extended';
import { Eye, EyeOff } from 'lucide-react';
import { formatDate, parseDate } from '@/lib/date-utils';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { employeeFormValidationSchema } from '@/features/employees/validation';
import type { SystemId, BusinessId } from '@/lib/id-types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { useAllJobTitles } from '@/features/settings/job-titles/hooks/use-all-job-titles';
import { useAllDepartments } from '@/features/settings/departments/hooks/use-all-departments';
import { useCheckEmployeeId } from '../hooks/use-check-employee-id';
import { useAllBranches } from '@/hooks/use-branches';
import { useProvinces } from "@/features/settings/provinces/hooks/use-administrative-units";
import { useEmployeeDocuments } from '../hooks/use-employee-documents';
import { FileUploadAPI } from '@/lib/file-upload-api';
import type { StagingFile, UploadedFile } from '@/lib/file-upload-api';
import { AddressFormDialog } from '@/features/customers/components/address-form-dialog';
import type { CustomerAddress } from '@/features/customers/types';

// Extracted tab components
import { EmployeeDocumentsTab } from './employee-documents-tab';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VirtualizedCombobox, type ComboboxOption } from "@/components/ui/virtualized-combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEmployeeSettings } from "@/features/settings/employees/hooks/use-employee-settings";
import type { EmployeePayrollProfileInput } from "../types";
import { useResolvedPayrollProfile } from "../hooks/use-payroll-profiles";
// Helper type for local form state for addresses
type AddressParts = {
  label: string;
  street: string;
  province: string;
  provinceId: string;
  district: string;
  districtId: number;
  ward: string;
  wardId: string;
  contactName: string;
  contactPhone: string;
  notes: string;
  inputLevel: '2-level' | '3-level';
};

export type EmployeeFormValues = Omit<Employee, 'systemId' | 'dob' | 'nationalIdIssueDate' | 'hireDate' | 'terminationDate' | 'contractStartDate' | 'contractEndDate'> & {
  dob?: Date | undefined;
  nationalIdIssueDate?: Date | undefined;
  hireDate?: Date | undefined;
  terminationDate?: Date | undefined;
  contractStartDate?: Date | undefined;
  contractEndDate?: Date | undefined;
  payrollWorkShiftSystemId?: SystemId | undefined;
  payrollSalaryComponentSystemIds?: SystemId[] | undefined;
  payrollPaymentMethod?: 'bank_transfer' | 'cash' | undefined;
  payrollPayoutAccountNumber?: string | undefined;
  payrollPayoutBankName?: string | undefined;
  payrollPayoutBankBranch?: string | undefined;
};

export type EmployeeFormSubmitPayload = Partial<Employee> & {
  _documentFiles?: Record<string, (UploadedFile & { sessionId?: string })[]>;
  _payrollProfile?: EmployeePayrollProfileInput | null;
};

type EmployeeFormProps = {
  initialData: EmployeeInitialData | null;
  onSubmit: (values: EmployeeFormSubmitPayload) => Promise<void> | void;
  onCancel: () => void;
  isEditMode?: boolean; // Thêm prop để biết có phải edit mode không
};

// Extended Employee type to handle expanded API relations (jobTitle/department/branch as objects)
type EmployeeInitialData = Employee & {
  jobTitleId?: string;
  branchId?: string;
  branch?: { systemId: string } | string;
};



/**
 * Parse EmployeeAddress thành AddressParts cho form
 * - Giữ nguyên tất cả metadata (provinceId, districtId, wardId, inputLevel)
 * - Không mất data khi chuyển đổi 2-cấp ↔ 3-cấp
 */
const parseAddress = (addr: EmployeeAddress | null | undefined): AddressParts => {
  if (!addr) {
    return {
      label: '',
      street: '',
      province: '',
      provinceId: '',
      district: '',
      districtId: 0,
      ward: '',
      wardId: '',
      contactName: '',
      contactPhone: '',
      notes: '',
      inputLevel: '2-level',
    };
  }

  // ✅ Giữ nguyên structured data
  return {
    label: '',
    street: addr.street,
    province: addr.province,
    provinceId: addr.provinceId,
    district: addr.district,
    districtId: addr.districtId,
    ward: addr.ward,
    wardId: addr.wardId,
    contactName: '',
    contactPhone: '',
    notes: '',
    inputLevel: addr.inputLevel,
  };
};

const toEmployeeAddress = (parts: AddressParts): EmployeeAddress => ({
  street: parts.street,
  province: parts.province,
  provinceId: parts.provinceId,
  district: parts.district,
  districtId: parts.districtId,
  ward: parts.ward,
  wardId: parts.wardId,
  inputLevel: parts.inputLevel,
});

const _formatCurrencyDisplay = (value?: number) => {
  if (typeof value !== 'number') return 'Theo công thức';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const areArraysEqualIgnoringOrder = (first: SystemId[] = [], second: SystemId[] = []) => {
  if (first.length !== second.length) return false;
  const reference = new Set(second);
  return first.every((value) => reference.has(value));
};

const removeUndefined = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
};

export function EmployeeForm({ initialData, onSubmit, onCancel: _onCancel, isEditMode = false }: EmployeeFormProps) {
  const { employee: authEmployee } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [permanentAddress, setPermanentAddress] = React.useState<AddressParts>(parseAddress(initialData?.permanentAddress));
  const [temporaryAddress, setTemporaryAddress] = React.useState<AddressParts>(parseAddress(initialData?.temporaryAddress));
  const [isAddressDialogOpen, setIsAddressDialogOpen] = React.useState(false);
  const [addressDialogTarget, setAddressDialogTarget] = React.useState<'permanent' | 'temporary'>('permanent');
  const [addressDialogEditingAddress, setAddressDialogEditingAddress] = React.useState<CustomerAddress | null>(null);
  
  const { data: jobTitles } = useAllJobTitles();
  const { data: departments } = useAllDepartments();
  const { data: branches } = useAllBranches();
  const { data: provinces = [] } = useProvinces();
  
  // Convert to Combobox options format
  const branchOptions: ComboboxOption[] = React.useMemo(() => 
    (branches ?? []).map(b => ({ value: b.systemId, label: b.name })),
    [branches]
  );
  const departmentOptions: ComboboxOption[] = React.useMemo(() => 
    (departments ?? []).map(d => ({ value: d.systemId, label: d.name })),
    [departments]
  );
  const jobTitleOptions: ComboboxOption[] = React.useMemo(() => 
    (jobTitles ?? []).map(jt => ({ value: jt.systemId, label: jt.name })),
    [jobTitles]
  );
  
  // Get settings from React Query (Prisma)
  const { data: employeeSettings } = useEmployeeSettings();
  const _workShifts = employeeSettings?.workShifts ?? [];
  const salaryComponents = React.useMemo(
    () => employeeSettings?.salaryComponents ?? [],
    [employeeSettings?.salaryComponents]
  );
  
  // Use React Query for payroll profile
  const { profile: payrollProfile } = useResolvedPayrollProfile(initialData?.systemId);
  
  // React Query: fetch existing documents for edit mode
  const { data: existingDocuments = [], refetch: refetchDocuments } = useEmployeeDocuments(initialData?.systemId);

  const defaultSalaryComponentSystemIds = React.useMemo(
    () => salaryComponents.map((component) => component.systemId),
    [salaryComponents]
  );

  const payrollDefaultValues = React.useMemo(
    () => ({
      payrollWorkShiftSystemId: payrollProfile?.workShiftSystemId ?? undefined,
      payrollSalaryComponentSystemIds:
        payrollProfile?.salaryComponentSystemIds ?? defaultSalaryComponentSystemIds,
      payrollPaymentMethod: payrollProfile?.paymentMethod ?? 'bank_transfer',
      payrollPayoutAccountNumber:
        payrollProfile?.payrollBankAccount?.accountNumber ?? initialData?.bankAccountNumber ?? '',
      payrollPayoutBankName:
        payrollProfile?.payrollBankAccount?.bankName ?? initialData?.bankName ?? '',
      payrollPayoutBankBranch:
        payrollProfile?.payrollBankAccount?.bankBranch ?? initialData?.bankBranch ?? '',
    }),
    [
      payrollProfile,
      defaultSalaryComponentSystemIds,
      initialData?.bankAccountNumber,
      initialData?.bankName,
      initialData?.bankBranch,
    ]
  );

  const hadCustomPayrollProfile = payrollProfile?.usesDefaultComponents === false;

  const form = useForm<EmployeeFormValues, unknown, EmployeeFormValues>({
    resolver: zodResolver(employeeFormValidationSchema) as unknown as Resolver<EmployeeFormValues>,
    defaultValues: {
      ...(initialData ?? {}),
      id: initialData?.id ?? asBusinessId(''),
      dob: parseDate(initialData?.dob ?? '') ?? undefined,
      nationalIdIssueDate: parseDate(initialData?.nationalIdIssueDate ?? '') ?? undefined,
      hireDate: parseDate(initialData?.hireDate ?? '') ?? undefined,
      terminationDate: parseDate(initialData?.terminationDate ?? '') ?? undefined,
      contractStartDate: parseDate(initialData?.contractStartDate ?? '') ?? undefined,
      contractEndDate: parseDate(initialData?.contractEndDate ?? '') ?? undefined,
      // Map relation objects to systemId for Select components
      jobTitle: initialData?.jobTitleId ?? (typeof initialData?.jobTitle === 'object' ? (initialData?.jobTitle as unknown as { systemId: string })?.systemId : initialData?.jobTitle) ?? undefined,
      department: initialData?.departmentId ?? (typeof initialData?.department === 'object' ? (initialData?.department as unknown as { systemId: string })?.systemId : initialData?.department) ?? undefined,
      branchSystemId: initialData?.branchId ?? initialData?.branchSystemId ?? (typeof initialData?.branch === 'object' ? initialData?.branch?.systemId : undefined) ?? undefined,
      // Gender is stored as enum (MALE, FEMALE, OTHER) in DB
      gender: initialData?.gender ?? undefined,
      ...payrollDefaultValues,
    } as EmployeeFormValues,
    mode: 'onChange', // Validate on every change for realtime feedback
    reValidateMode: 'onChange',
  });

  // Hàm tạo mật khẩu ngẫu nhiên
  const generatePassword = (length: number = 12): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + symbols;
    
    let pass = '';
    pass += uppercase[Math.floor(Math.random() * uppercase.length)];
    pass += lowercase[Math.floor(Math.random() * lowercase.length)];
    pass += numbers[Math.floor(Math.random() * numbers.length)];
    pass += symbols[Math.floor(Math.random() * symbols.length)];
    
    for (let i = pass.length; i < length; i++) {
      pass += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    return pass.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(12);
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    setShowPassword(true);
    toast.success('Đã tạo mật khẩu ngẫu nhiên');
  };

  const handleCopyPassword = async () => {
    if (!password) {
      toast.error('Chưa có mật khẩu để copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Đã copy mật khẩu vào clipboard');
    } catch (_err) {
      toast.error('Không thể copy mật khẩu');
    }
  };

  const _handleCopyPayrollBank = React.useCallback(() => {
    const accountNumber = form.getValues('bankAccountNumber') as string | undefined;
    const bankName = form.getValues('bankName') as string | undefined;
    const bankBranch = form.getValues('bankBranch') as string | undefined;

    if (!accountNumber && !bankName && !bankBranch) {
      toast.warning('Chưa có thông tin ngân hàng ở tab Thông tin cá nhân');
      return;
    }

    form.setValue('payrollPayoutAccountNumber', accountNumber || '');
    form.setValue('payrollPayoutBankName', bankName || '');
    form.setValue('payrollPayoutBankBranch', bankBranch || '');
    toast.success('Đã sao chép thông tin ngân hàng cho mục trả lương');
  }, [form]);

  const _handleResetPayrollComponents = React.useCallback(() => {
    form.setValue('payrollSalaryComponentSystemIds', defaultSalaryComponentSystemIds);
    toast.success('Đã khôi phục thành phần lương mặc định từ cài đặt');
  }, [defaultSalaryComponentSystemIds, form]);

  const findProvinceIdByName = React.useCallback(
    (provinceName: string) => {
      if (!provinceName) return '';
      
      // First try exact match
      let found = provinces.find((p) => p.name === provinceName);
      if (found) return found.id;
      
      // Try normalized match
      const normalizedInput = provinceName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
      found = provinces.find((p) => {
        const normalizedName = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
        return normalizedName === normalizedInput || 
               normalizedName.includes(normalizedInput) || 
               normalizedInput.includes(normalizedName);
      });
      if (found) return found.id;
      
      // Try common alias patterns
      // "Thành phố Hồ Chí Minh" -> "TP HCM"
      // "Thành phố Hà Nội" -> "Hà Nội"
      const aliasMap: Record<string, string[]> = {
        'TP HCM': ['thanh pho ho chi minh', 'tp ho chi minh', 'ho chi minh', 'hcm', 'tphcm', 'sai gon'],
        'Hà Nội': ['thanh pho ha noi', 'tp ha noi', 'ha noi', 'hanoi'],
        'Đà Nẵng': ['thanh pho da nang', 'tp da nang', 'da nang', 'danang'],
        'Hải Phòng': ['thanh pho hai phong', 'tp hai phong', 'hai phong', 'haiphong'],
        'Cần Thơ': ['thanh pho can tho', 'tp can tho', 'can tho', 'cantho'],
      };
      
      for (const [standardName, aliases] of Object.entries(aliasMap)) {
        if (aliases.some(a => normalizedInput.includes(a) || a.includes(normalizedInput))) {
          found = provinces.find(p => p.name === standardName);
          if (found) return found.id;
        }
      }
      
      return '';
    },
    [provinces]
  );

  const buildEditingAddressPayload = React.useCallback(
    (source: AddressParts | null, target: 'permanent' | 'temporary'): CustomerAddress | null => {
      
      if (!source || (!source.street && !source.province && !source.ward)) {
        return null;
      }
      
      const resolvedProvinceId = source.provinceId || findProvinceIdByName(source.province);

      const result = {
        id: '',
        label: source.label || (target === 'permanent' ? 'Địa chỉ thường trú' : 'Địa chỉ tạm trú'),
        street: source.street,
        province: source.province,
        provinceId: resolvedProvinceId,
        district: source.district || '',
        districtId: source.districtId || 0,
        ward: source.ward,
        wardId: source.wardId || '',
        contactName: source.contactName || '',
        contactPhone: source.contactPhone || '',
        notes: source.notes || '',
        isDefaultShipping: false,
        isDefaultBilling: false,
        inputLevel: source.inputLevel || '2-level',
        autoFilled: source.inputLevel === '2-level',
      };
      
      return result;
    },
    [findProvinceIdByName]
  );

  const openAddressDialog = React.useCallback(
    (target: 'permanent' | 'temporary') => {
      setAddressDialogTarget(target);
      const source = target === 'permanent' ? permanentAddress : temporaryAddress;
      setAddressDialogEditingAddress(buildEditingAddressPayload(source, target));
      setIsAddressDialogOpen(true);
    },
    [buildEditingAddressPayload, permanentAddress, temporaryAddress]
  );

  const handleAddressDialogSave = React.useCallback(
    (addressData: Omit<CustomerAddress, 'id'>) => {
      const nextParts: AddressParts = {
        label: addressData.label,
        street: addressData.street,
        ward: addressData.ward || '',
        wardId: addressData.wardId || '',
        province: addressData.province,
        provinceId: addressData.provinceId || '',
        district: addressData.district || '',
        districtId: addressData.districtId || 0,
        contactName: addressData.contactName || '',
        contactPhone: addressData.contactPhone || '',
        notes: addressData.notes || '',
        inputLevel: addressData.inputLevel,
      };

      const _formattedFullAddress = [addressData.street, addressData.ward || addressData.district, addressData.province]
        .filter(Boolean)
        .join(', ');

      if (addressDialogTarget === 'permanent') {
        setPermanentAddress(nextParts);
        form.setValue('permanentAddress', toEmployeeAddress(nextParts), { shouldDirty: true });
        toast.success('Đã áp dụng địa chỉ cho phần Thường trú');
      } else {
        setTemporaryAddress(nextParts);
        form.setValue('temporaryAddress', toEmployeeAddress(nextParts), { shouldDirty: true });
        toast.success('Đã áp dụng địa chỉ cho phần Tạm trú');
      }
    },
    [addressDialogTarget, form]
  );

  const handleAddressDialogOpenChange = React.useCallback((open: boolean) => {
    setIsAddressDialogOpen(open);
    if (!open) {
      setAddressDialogEditingAddress(null);
    }
  }, []);

  const watchedId = form.watch('id');

  // ✅ Phase A6: Server-side ID uniqueness check (replaces loading ALL employees)
  const sanitizedWatchedId = React.useMemo(() => {
    const rawId = (watchedId as unknown as string) ?? '';
    return rawId.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }, [watchedId]);
  
  const { exists: idExists, isChecking: _isCheckingId } = useCheckEmployeeId(
    sanitizedWatchedId || undefined,
    initialData?.id as unknown as string
  );

  React.useEffect(() => {
    const rawId = (watchedId as unknown as string) ?? '';
    if (!rawId) {
      form.clearErrors('id');
      return;
    }

    const sanitizedId = rawId.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (sanitizedId !== rawId) {
      form.setValue('id', asBusinessId(sanitizedId), { shouldValidate: false });
    }

    if (idExists) {
      form.setError('id', {
        type: 'manual',
        message: `Mã nhân viên "${sanitizedId}" đã tồn tại`
      });
    } else {
      form.clearErrors('id');
    }
  }, [watchedId, idExists, form, initialData?.id]);

  // Unified document state - staging và permanent
  const [documentFiles, setDocumentFiles] = React.useState<Record<string, StagingFile[]>>({});
  const [documentSessions, setDocumentSessions] = React.useState<Record<string, string>>({});
  // Track files marked for deletion (safe mode)
  const [filesToDelete, setFilesToDelete] = React.useState<string[]>([]);
  // Loading state for documents
  const [_isLoadingDocuments, setIsLoadingDocuments] = React.useState(false);

  // Initialize document files - load existing cho edit mode, reset cho new
  React.useEffect(() => {
    if (initialData?.systemId) {
      // React Query handles fetching — just sync to local state when data arrives
      setIsLoadingDocuments(true);
    } else {
      setDocumentFiles({});
      setDocumentSessions({});
      setIsLoadingDocuments(false);
    }
  }, [initialData?.systemId]);

  // Sync React Query data → local document state (for edit mode)
  React.useEffect(() => {
    if (!initialData?.systemId || existingDocuments.length === 0) return;
    const loadedFiles: Record<string, StagingFile[]> = {};
    existingDocuments.forEach(doc => {
      const key = `${doc.documentType}::${doc.documentName}`;
      loadedFiles[key] = doc.files.map(file => ({
        id: file.id,
        sessionId: '',
        name: file.name,
        originalName: file.originalName || file.name,
        slug: file.slug || '',
        filename: file.filename,
        size: file.size,
        type: file.type,
        url: file.url,
        status: 'permanent' as const,
        uploadedAt: file.uploadedAt || '',
        metadata: typeof file.metadata === 'string' ? file.metadata : (file.metadata || {})
      }));
    });
    setDocumentFiles(loadedFiles);
    setIsLoadingDocuments(false);
  }, [existingDocuments, initialData?.systemId]);

  // Load existing documents for edit mode — reads from React Query cache
  const _loadExistingDocuments = React.useCallback((_employeeSystemId: string) => {
    // No-op: React Query data is synced via the effect above
  }, []);

  // Document upload handler - LUÔN staging trước, kể cả nhân viên cũ
  const handleDocumentUpload = React.useCallback((documentType: string, documentName: string, newStagingFiles: StagingFile[], sessionId?: string) => {
    const key = `${documentType}::${documentName}`;
    
    // Cập nhật local state - REPLACE TOÀN BỘ với files mới từ NewDocumentsUpload
    // Use flushSync to force immediate state update and prevent race conditions
    flushSync(() => {
      setDocumentFiles(prev => {
        return {
          ...prev,
          [key]: newStagingFiles
        };
      });
    });
    
    // Cập nhật session ID cho document này
    if (sessionId) {
      setDocumentSessions(prev => ({
        ...prev,
        [key]: sessionId
      }));
      
    }
  }, []);

  // Handle session change for staging documents
  const handleSessionChange = React.useCallback((documentType: string, documentName: string, sessionId: string) => {
    const key = `${documentType}::${documentName}`;
    setDocumentSessions(prev => ({
      ...prev,
      [key]: sessionId
    }));
  }, []);

  // Memoized getter cho document files
  const getDocumentFiles = React.useCallback((documentType: string, documentName: string): StagingFile[] => {
    const key = `${documentType}::${documentName}`;
    return documentFiles[key] || [];
  }, [documentFiles]);

  // Stable callback generators using useMemo instead of ref cache
  const getDocumentCallbacks = React.useMemo(() => {
    const callbacksMap = new Map<string, {
      onChange: (files: StagingFile[]) => void;
      onSessionChange: (sessionId: string) => void;
    }>();

    return (documentType: string, documentName: string) => {
      const key = `${documentType}::${documentName}`;
      
      if (!callbacksMap.has(key)) {
        callbacksMap.set(key, {
          onChange: (files: StagingFile[]) => {
            handleDocumentUpload(documentType, documentName, files);
          },
          onSessionChange: (sessionId: string) => {
            handleSessionChange(documentType, documentName, sessionId);
          }
        });
      }
      
      return callbacksMap.get(key)!;
    };
  }, [handleDocumentUpload, handleSessionChange]);



  // Get PERMANENT files only (for ExistingDocumentsViewer)
  const getPermanentFiles = React.useCallback((documentType: string, documentName: string): StagingFile[] => {
    const allFiles = getDocumentFiles(documentType, documentName);
    // Permanent files: không có sessionId
    return allFiles.filter(file => !file.sessionId);
  }, [getDocumentFiles]);

  // Get STAGING files only (for NewDocumentsUpload)
  const getStagingFiles = React.useCallback((documentType: string, documentName: string): StagingFile[] => {
    const allFiles = getDocumentFiles(documentType, documentName);
    // Staging files have sessionId - that's the key indicator
    // URL can be /api/files/ or /api/staging/ depending on implementation
    const stagingFiles = allFiles.filter(file => !!file.sessionId);
    
    return stagingFiles;
  }, [getDocumentFiles]);

  // Get session ID for document
  const getDocumentSessionId = React.useCallback((documentType: string, documentName: string): string | undefined => {
    const key = `${documentType}::${documentName}`;
    return documentSessions[key];
  }, [documentSessions]);

  // Refresh handler for ExistingDocumentsViewer
  const handleRefreshDocuments = React.useCallback(async () => {
    if (initialData?.systemId) {
      setIsLoadingDocuments(true);
      await refetchDocuments();
      setIsLoadingDocuments(false);
    }
  }, [initialData?.systemId, refetchDocuments]);

  // Mark/unmark file for deletion (safe mode)
  const handleMarkForDeletion = React.useCallback((fileId: string) => {
    setFilesToDelete(prev => {
      if (prev.includes(fileId)) {
        // Unmark - restore file
        return prev.filter(id => id !== fileId);
      } else {
        // Mark for deletion
        return [...prev, fileId];
      }
    });
  }, []);

  const handleSubmit = async (values: EmployeeFormValues) => {
    try {
      // Validate password if changed
      if (password || confirmPassword) {
        if (password.length < 6) {
          toast.error('Mật khẩu phải có ít nhất 6 ký tự');
          return;
        }
        if (password !== confirmPassword) {
          toast.error('Mật khẩu xác nhận không khớp');
          return;
        }
      }
      
      // ✅ Step 0: Validate unique ID (with sanitization) — uses server-side check
      const existingBusinessId = values.id as BusinessId | undefined;
      const existingIdString = (existingBusinessId as unknown as string) ?? '';
      const sanitizedId = existingIdString
        ? existingIdString.toUpperCase().replace(/[^A-Z0-9]/g, '')
        : '';
      
      const normalizedBusinessId = sanitizedId
        ? asBusinessId(sanitizedId)
        : existingIdString.trim().length > 0
          ? existingBusinessId
          : undefined;

      // Use cached result from useCheckEmployeeId (already queried via real-time watcher)
      if (sanitizedId && idExists) {
        form.setError('id', {
          type: 'manual',
          message: `Mã nhân viên "${sanitizedId}" đã tồn tại. Vui lòng sử dụng mã khác.`
        });
        toast.error("Lỗi validation", {
          description: `Mã nhân viên "${sanitizedId}" đã tồn tại.`
        });
        return; // Stop submission
      }
      
      // Step 1: Delete marked files before saving
      if (filesToDelete.length > 0 && isEditMode) {
        const deleteToastId = toast.loading(`Đang xóa ${filesToDelete.length} file đã đánh dấu...`);
        const deletedCount = filesToDelete.length;
        
        // Get document names before deleting for logging
        // Key format: "documentType::documentName" where documentName is the Vietnamese label
        const deletedDocNames: string[] = [];
        Object.entries(documentFiles).forEach(([key, files]) => {
          files.forEach(file => {
            if (filesToDelete.includes(file.id)) {
              // Parse key to get document label: "legal::Hợp đồng lao động" -> "Hợp đồng lao động"
              const parts = key.split('::');
              const docLabel = parts.length > 1 ? parts[1] : key;
              deletedDocNames.push(`${docLabel}: ${file.name}`);
            }
          });
        });
        
        try {
          await Promise.all(
            filesToDelete.map(fileId => FileUploadAPI.deleteFile(fileId))
          );
          
          toast.success('✓ Đã xóa các file cũ', {
            description: `${deletedCount} file`,
            id: deleteToastId
          });
          
          // Log file deletion activity with document names
          if (initialData?.systemId) {
            try {
              await fetch('/api/activity-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  entityType: 'employee',
                  entityId: initialData.systemId,
                  action: 'document_deleted',
                  actionType: 'delete',
                  note: `Xóa ${deletedCount} tài liệu: ${deletedDocNames.join(', ')}`,
                  metadata: { 
                    deletedCount,
                    deletedDocuments: deletedDocNames,
                    userName: authEmployee?.fullName || undefined,
                  },
                }),
              });
            } catch {
              // Don't fail if logging fails
            }
          }
          
          // Clear deletion marks
          setFilesToDelete([]);
          
          // IMPORTANT: Refresh documents from server after deletion
          if (initialData?.systemId) {
            await handleRefreshDocuments();
          }
        } catch (error) {
          toast.error('❌ Lỗi khi xóa file cũ', {
            description: 'Vui lòng thử lại',
            id: deleteToastId
          });
          throw error; // Stop submission if deletion fails
        } finally {
          toast.dismiss(deleteToastId);
        }
      }

      // Step 2: Filter out deleted files from documentFiles
      const cleanedDocumentFiles: Record<string, Array<{ id: string; sessionId: string; name: string; filename: string; size: number; type: string; url: string }>> = {};
      Object.entries(documentFiles).forEach(([key, files]) => {
        cleanedDocumentFiles[key] = files.filter(file => !filesToDelete.includes(file.id));
      });

      // Step 3: Convert to upload format
      const uploadedDocumentFiles: Record<string, (UploadedFile & { sessionId?: string })[]> = {};
      Object.entries(cleanedDocumentFiles).forEach(([key, stagingFiles]) => {
        uploadedDocumentFiles[key] = stagingFiles.map(file => ({
          id: file.id,
          name: file.name,
          filename: file.filename,
          size: file.size,
          type: file.type,
          url: file.url,
          uploadedAt: new Date().toISOString(),
          sessionId: file.sessionId // Giữ sessionId để confirm
        }));
      });

      const {
        payrollWorkShiftSystemId,
        payrollSalaryComponentSystemIds,
        payrollPaymentMethod,
        payrollPayoutAccountNumber,
        payrollPayoutBankName,
        payrollPayoutBankBranch,
        ...employeeCoreValues
      } = values;

      const payrollBankAccount =
        payrollPayoutAccountNumber || payrollPayoutBankName || payrollPayoutBankBranch
          ? {
              accountNumber: payrollPayoutAccountNumber || undefined,
              bankName: payrollPayoutBankName || undefined,
              bankBranch: payrollPayoutBankBranch || undefined,
            }
          : undefined;

      const isDefaultComponentSelection = areArraysEqualIgnoringOrder(
        payrollSalaryComponentSystemIds ?? [],
        defaultSalaryComponentSystemIds
      );

      const shouldPersistPayrollProfile =
        Boolean(payrollWorkShiftSystemId) ||
        Boolean(payrollBankAccount) ||
        (payrollPaymentMethod && payrollPaymentMethod !== 'bank_transfer') ||
        !isDefaultComponentSelection;

      let normalizedPayrollProfile: EmployeePayrollProfileInput | null | undefined;
      if (shouldPersistPayrollProfile) {
        normalizedPayrollProfile = {
          workShiftSystemId: payrollWorkShiftSystemId,
          salaryComponentSystemIds: payrollSalaryComponentSystemIds,
          paymentMethod: payrollPaymentMethod,
          payrollBankAccount,
        };
      } else if (hadCustomPayrollProfile) {
        normalizedPayrollProfile = null;
      }

        const formattedValues = {
          ...employeeCoreValues,
          id: normalizedBusinessId,
          password: password || initialData?.password, // Include password
          dob: formatDate(employeeCoreValues.dob),
          nationalIdIssueDate: formatDate(employeeCoreValues.nationalIdIssueDate),
          hireDate: formatDate(employeeCoreValues.hireDate),
          terminationDate: formatDate(employeeCoreValues.terminationDate),
          contractStartDate: formatDate(employeeCoreValues.contractStartDate),
          contractEndDate: formatDate(employeeCoreValues.contractEndDate),
          // ✅ Convert AddressParts → EmployeeAddress (structured data)
          permanentAddress: permanentAddress.street || permanentAddress.province
            ? {
                street: permanentAddress.street,
                province: permanentAddress.province,
                provinceId: permanentAddress.provinceId,
                district: permanentAddress.district,
                districtId: permanentAddress.districtId,
                ward: permanentAddress.ward,
                wardId: permanentAddress.wardId,
                inputLevel: permanentAddress.inputLevel,
              }
            : null,
          temporaryAddress: temporaryAddress.street || temporaryAddress.province
            ? {
                street: temporaryAddress.street,
                province: temporaryAddress.province,
                provinceId: temporaryAddress.provinceId,
                district: temporaryAddress.district,
                districtId: temporaryAddress.districtId,
                ward: temporaryAddress.ward,
                wardId: temporaryAddress.wardId,
                inputLevel: temporaryAddress.inputLevel,
              }
            : null,
          _documentFiles: uploadedDocumentFiles,
          _payrollProfile: normalizedPayrollProfile,
      };

      const normalizeSystemId = (value?: string | SystemId | null) => {
        if (!value) return undefined;
        return asSystemId(value as string);
      };

      const { id: _id, ...valuesWithoutId } = formattedValues;

      const payload: EmployeeFormSubmitPayload = removeUndefined({
        ...valuesWithoutId,
        ...(normalizedBusinessId ? { id: normalizedBusinessId } : {}),
        // Map form field names → server action field names (keep originals for server-side validation)
        departmentId: normalizeSystemId(formattedValues.department as string),
        jobTitleId: normalizeSystemId(formattedValues.jobTitle as string),
        branchId: normalizeSystemId(formattedValues.branchSystemId),
        managerId: normalizeSystemId(formattedValues.managerId),
        createdBy: !isEditMode && authEmployee?.systemId ? asSystemId(authEmployee.systemId) : undefined,
        updatedBy: isEditMode && authEmployee?.systemId ? asSystemId(authEmployee.systemId) : undefined,
        ...(formattedValues.dob ? { dob: formattedValues.dob } : {}),
        ...(formattedValues.nationalIdIssueDate ? { nationalIdIssueDate: formattedValues.nationalIdIssueDate } : {}),
        ...(formattedValues.hireDate ? { hireDate: formattedValues.hireDate } : {}),
        ...(formattedValues.terminationDate ? { terminationDate: formattedValues.terminationDate } : {}),
        ...(formattedValues.contractStartDate ? { contractStartDate: formattedValues.contractStartDate } : {}),
        ...(formattedValues.contractEndDate ? { contractEndDate: formattedValues.contractEndDate } : {}),
      });

      // Step 4: Submit form với documents
      await onSubmit(payload);
    } catch (error) {
      toast.error('Lỗi khi lưu thông tin', {
        description: error instanceof Error ? error.message : 'Lỗi không xác định'
      });
    }
  };

  const dialogTitle = `${addressDialogEditingAddress ? 'Chỉnh sửa' : 'Thêm'} ${
    addressDialogTarget === 'permanent' ? 'địa chỉ thường trú' : 'địa chỉ tạm trú'
  }`;

  const dialogDescription = addressDialogEditingAddress
    ? 'Cập nhật thông tin địa chỉ chuẩn 2 hoặc 3 cấp. Hệ thống tự áp dụng sau khi lưu.'
    : 'Chọn địa chỉ 2 hoặc 3 cấp chuẩn quốc gia. Hệ thống sẽ tự áp dụng cho nhân viên sau khi lưu.';

  return (
    <Form {...form}>
      <form id="employee-form" onSubmit={form.handleSubmit(handleSubmit, (errors) => {
        const fieldLabels: Record<string, string> = {
          fullName: 'Họ tên', gender: 'Giới tính', phone: 'Số điện thoại',
          workEmail: 'Email công việc', branchSystemId: 'Chi nhánh',
          jobTitle: 'Chức danh', employmentStatus: 'Trạng thái làm việc',
        };
        const messages = Object.entries(errors).slice(0, 5).map(
          ([key, err]) => `${fieldLabels[key] || key}: ${err?.message || 'Không hợp lệ'}`
        );
        toast.error('Vui lòng kiểm tra lại thông tin', {
          description: messages.join('\n'),
          duration: 6000,
        });
      })} className="space-y-6 min-w-0 overflow-x-hidden">
        <Tabs defaultValue="personal" className="w-full">
          <div className="w-full overflow-x-auto overflow-y-hidden mb-4 pb-1" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
            <TabsList className="inline-flex w-auto gap-1 p-1 h-auto justify-start">
              <TabsTrigger value="personal" className="shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Thông tin cá nhân
              </TabsTrigger>
              <TabsTrigger value="addresses" className="shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Địa chỉ
              </TabsTrigger>
              <TabsTrigger value="employment" className="shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Thông tin công việc
              </TabsTrigger>
              <TabsTrigger value="account" className="shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger value="documents" className="shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Tài liệu
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="personal" className="mt-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-h5 md:font-medium md:text-foreground md:normal-case md:tracking-normal mb-4">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField 
                name="fullName" 
                control={form.control} 
                rules={{ 
                  required: "Họ và tên là bắt buộc",
                  minLength: { value: 2, message: "Họ và tên phải có ít nhất 2 ký tự" }
                }}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Họ và tên <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField name="dob" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày sinh</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly cast `field.value` to string to resolve type incompatibility with the Select component. */}
              <FormField name="gender" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Giới tính</FormLabel><Select onValueChange={field.onChange} value={field.value as string | undefined}><FormControl><SelectTrigger><SelectValue placeholder="Chọn giới tính" /></SelectTrigger></FormControl><SelectContent><SelectItem value="MALE">Nam</SelectItem><SelectItem value="FEMALE">Nữ</SelectItem><SelectItem value="OTHER">Khác</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="placeOfBirth" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Nơi sinh</FormLabel><FormControl><Input placeholder="VD: TP.HCM" {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              <FormField 
                name="phone" 
                control={form.control}
                rules={{
                  required: "Vui lòng nhập số điện thoại",
                  pattern: {
                    value: /^(0|\+84)[3-9][0-9]{8}$/,
                    message: "Số điện thoại không hợp lệ (VD: 0912345678)"
                  }
                }}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Số điện thoại <span className="text-destructive">*</span></FormLabel>
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
                name="personalEmail" 
                control={form.control}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ"
                  }
                }}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Email cá nhân</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} value={field.value as string || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              {/* FIX: Explicitly cast `field.value` to string to resolve type incompatibility with the Select component. */}
              <FormField name="maritalStatus" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Tình trạng hôn nhân</FormLabel><Select onValueChange={field.onChange} value={field.value as string | undefined}><FormControl><SelectTrigger><SelectValue placeholder="Chọn tình trạng" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Độc thân">Độc thân</SelectItem><SelectItem value="Đã kết hôn">Đã kết hôn</SelectItem><SelectItem value="Khác">Khác</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              
              
              <FormField 
                name="nationalId" 
                control={form.control}
                rules={{
                  pattern: {
                    value: /^(\d{9}|\d{12})$/,
                    message: "CCCD/CMND phải có 9 hoặc 12 chữ số"
                  }
                }}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Số CCCD/Passport</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value as string || ''} maxLength={12} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              {/* FIX: Explicitly pass value prop to DatePicker to avoid type conflicts. */}
              <FormField name="nationalIdIssueDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày cấp</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="nationalIdIssuePlace" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Nơi cấp</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />

              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="personalTaxId" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Mã số thuế cá nhân</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="socialInsuranceNumber" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số sổ BHXH</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              
              <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-h6 font-medium border-b border-border pb-2 mb-4">Thông tin liên hệ khẩn cấp</h4>
              </div>
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="emergencyContactName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Họ và tên người thân</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              <FormField 
                name="emergencyContactPhone" 
                control={form.control}
                rules={{
                  pattern: {
                    value: /^(0|\+84)[3-9][0-9]{8}$/,
                    message: "Số điện thoại không hợp lệ (VD: 0912345678)"
                  }
                }}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Số điện thoại người thân</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value as string || ''} maxLength={11} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-h6 font-medium border-b border-border pb-2 mb-4">Thông tin ngân hàng</h4>
              </div>
              <FormField 
                name="bankAccountNumber" 
                control={form.control}
                rules={{
                  pattern: {
                    value: /^\d{9,20}$/,
                    message: "Số tài khoản phải có 9-20 chữ số"
                  }
                }}
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Số tài khoản</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value as string || ''} maxLength={20} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="bankName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Tên ngân hàng</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="bankBranch" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Chi nhánh</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <div className="mb-6">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-h5 md:font-medium md:text-foreground md:normal-case md:tracking-normal mb-2">Địa chỉ nhân viên</h3>
              <p className="text-sm text-muted-foreground">
                Tách riêng phần địa chỉ để dễ so sánh giữa nơi thường trú và tạm trú, tương tự trải nghiệm quản lý khách hàng.
              </p>
            </div>
            <div className="space-y-6">
              <section className="border border-border rounded-lg p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-h6 font-medium">Địa chỉ thường trú</h4>
                    <p className="text-sm text-muted-foreground">Thông tin trên sổ hộ khẩu hoặc cư trú lâu dài.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => openAddressDialog('permanent')}>
                    Chỉnh sửa địa chỉ
                  </Button>
                </div>
                {permanentAddress.street || permanentAddress.ward || permanentAddress.province ? (
                  <dl className="grid gap-2 text-sm">
                    {permanentAddress.province && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Tỉnh/Thành phố</span>
                        <span className="font-medium">{permanentAddress.province}</span>
                      </div>
                    )}
                    {permanentAddress.inputLevel === '3-level' ? (
                      <>
                        {permanentAddress.district && (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Quận/Huyện</span>
                            <span className="font-medium">{permanentAddress.district}</span>
                          </div>
                        )}
                        {permanentAddress.ward && (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Phường/Xã</span>
                            <span className="font-medium">{permanentAddress.ward}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      permanentAddress.ward && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Phường/Xã</span>
                          <span className="font-medium">{permanentAddress.ward}</span>
                        </div>
                      )
                    )}
                    {permanentAddress.street && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Số nhà, đường</span>
                        <span className="font-medium">{permanentAddress.street}</span>
                      </div>
                    )}
                  </dl>
                ) : (
                  <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Chưa có địa chỉ. Nhấn "Chỉnh sửa địa chỉ" để nhập nhanh bằng form chuẩn 2 cấp / 3 cấp.
                  </div>
                )}
              </section>

              <section className="border border-border rounded-lg p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-h6 font-medium">Địa chỉ tạm trú</h4>
                    <p className="text-sm text-muted-foreground">Nơi nhân viên đang sinh sống hiện tại (có thể khác thường trú).</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => openAddressDialog('temporary')}>
                    Chỉnh sửa địa chỉ
                  </Button>
                </div>
                {temporaryAddress.street || temporaryAddress.ward || temporaryAddress.province ? (
                  <dl className="grid gap-2 text-sm">
                    {temporaryAddress.province && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Tỉnh/Thành phố</span>
                        <span className="font-medium">{temporaryAddress.province}</span>
                      </div>
                    )}
                    {temporaryAddress.inputLevel === '3-level' ? (
                      <>
                        {temporaryAddress.district && (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Quận/Huyện</span>
                            <span className="font-medium">{temporaryAddress.district}</span>
                          </div>
                        )}
                        {temporaryAddress.ward && (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Phường/Xã</span>
                            <span className="font-medium">{temporaryAddress.ward}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      temporaryAddress.ward && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Phường/Xã</span>
                          <span className="font-medium">{temporaryAddress.ward}</span>
                        </div>
                      )
                    )}
                    {temporaryAddress.street && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Số nhà, đường</span>
                        <span className="font-medium">{temporaryAddress.street}</span>
                      </div>
                    )}
                  </dl>
                ) : (
                  <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Chưa có địa chỉ. Nhấn "Chỉnh sửa địa chỉ" để nhập nhanh bằng form chuẩn 2 cấp / 3 cấp.
                  </div>
                )}
              </section>
            </div>
          </TabsContent>

          <TabsContent value="employment" className="mt-6">
             <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-h5 md:font-medium md:text-foreground md:normal-case md:tracking-normal mb-4">Thông tin công việc, Lương & Nghỉ phép</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* ID field - User can input custom ID or leave blank for auto-generation */}
                <FormField name="id" control={form.control} render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Mã nhân viên</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Bỏ trống để tự động sinh mã (6 số)" 
                        {...field} 
                        value={field.value as string || ''} 
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      {isEditMode ? 'Có thể sửa mã. Chỉ cho phép chữ và số.' : 'Ví dụ: NV000001, NVKT01, NV2024...'}
                    </p>
                  </FormItem> 
                )} />
                <FormField 
                  name="workEmail" 
                  control={form.control}
                  rules={{
                    required: "Vui lòng nhập email công việc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ"
                    }
                  }}
                  render={({ field }) => ( 
                    <FormItem>
                      <FormLabel>Email công việc <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="username@company.com" {...field} value={field.value as string || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem> 
                  )} 
                />
                <FormField 
                  name="branchSystemId" 
                  control={form.control}
                  rules={{
                    required: "Vui lòng chọn chi nhánh"
                  }}
                  render={({ field }) => ( 
                    <FormItem>
                      <FormLabel>Chi nhánh <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <VirtualizedCombobox
                          value={branchOptions.find(o => o.value === field.value) ?? null}
                          onChange={(option) => field.onChange(option?.value ?? '')}
                          options={branchOptions}
                          placeholder="Chọn chi nhánh"
                          searchPlaceholder="Tìm chi nhánh..."
                          emptyPlaceholder="Không tìm thấy chi nhánh"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem> 
                  )} 
                />
                <FormField name="department" control={form.control} render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Phòng ban</FormLabel>
                    <FormControl>
                      <VirtualizedCombobox
                        value={departmentOptions.find(o => o.value === field.value) ?? null}
                        onChange={(option) => field.onChange(option?.value ?? '')}
                        options={departmentOptions}
                        placeholder="Chọn phòng ban"
                        searchPlaceholder="Tìm phòng ban..."
                        emptyPlaceholder="Không tìm thấy phòng ban"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem> 
                )} />
                <FormField 
                  name="jobTitle" 
                  control={form.control}
                  rules={{
                    required: "Vui lòng chọn chức danh"
                  }}
                  render={({ field }) => ( 
                    <FormItem>
                      <FormLabel>Chức danh <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <VirtualizedCombobox
                          value={jobTitleOptions.find(o => o.value === field.value) ?? null}
                          onChange={(option) => field.onChange(option?.value ?? '')}
                          options={jobTitleOptions}
                          placeholder="Chọn chức danh"
                          searchPlaceholder="Tìm chức danh..."
                          emptyPlaceholder="Không tìm thấy chức danh"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem> 
                  )} 
                />
                {/* FIX: Explicitly pass value prop to DatePicker to avoid type conflicts. */}
                <FormField name="hireDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày vào làm</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly cast `field.value` to string to resolve type incompatibility with the Select component. */}
                <FormField name="employeeType" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Loại nhân viên</FormLabel><Select onValueChange={field.onChange} value={field.value as string | undefined}><FormControl><SelectTrigger><SelectValue placeholder="Chọn loại NV" /></SelectTrigger></FormControl><SelectContent><SelectItem value="FULLTIME">Toàn thời gian</SelectItem><SelectItem value="PARTTIME">Bán thời gian</SelectItem><SelectItem value="INTERN">Thực tập</SelectItem><SelectItem value="PROBATION">Thử việc</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                <FormField 
                  name="employmentStatus" 
                  control={form.control}
                  rules={{
                    required: "Vui lòng chọn trạng thái làm việc"
                  }}
                  render={({ field }) => ( 
                    <FormItem>
                      <FormLabel>Trạng thái làm việc <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value as string | undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Đang làm việc</SelectItem>
                          <SelectItem value="ON_LEAVE">Tạm nghỉ</SelectItem>
                          <SelectItem value="TERMINATED">Đã nghỉ việc</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem> 
                  )} 
                />
                {/* FIX: Explicitly pass value prop to DatePicker to avoid type conflicts. */}
                <FormField name="terminationDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày nghỉ việc</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
                
                {/* FIX: Explicitly cast `field.value` to string to resolve type incompatibility with the Select component. */}
                <FormField name="contractType" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Loại hợp đồng</FormLabel><Select onValueChange={field.onChange} value={field.value as string | undefined}><FormControl><SelectTrigger><SelectValue placeholder="Chọn loại hợp đồng" /></SelectTrigger></FormControl><SelectContent><SelectItem value="PROBATION">Thử việc</SelectItem><SelectItem value="ONE_YEAR">1 năm</SelectItem><SelectItem value="TWO_YEARS">2 năm</SelectItem><SelectItem value="THREE_YEARS">3 năm</SelectItem><SelectItem value="INDEFINITE">Vô thời hạn</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                <FormField name="contractNumber" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số hợp đồng</FormLabel><FormControl><Input placeholder="Số hợp đồng" {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly pass value prop to DatePicker to avoid type conflicts. */}
                <FormField name="contractStartDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày bắt đầu HĐ</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly pass value prop to DatePicker to avoid type conflicts. */}
                <FormField name="contractEndDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày kết thúc HĐ</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
                
                <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-h6 font-medium border-b border-border pb-2 mb-4">Lương & Phụ cấp</h4>
                </div>
                 <FormField name="baseSalary" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Lương cơ bản</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="socialInsuranceSalary" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Lương đóng BHXH</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="positionAllowance" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phụ cấp chức vụ</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="mealAllowance" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phụ cấp ăn trưa</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="otherAllowances" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phụ cấp khác</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />

                <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-h6 font-medium border-b border-border pb-2 mb-4">Nghỉ phép</h4>
                </div>
                {/* annualLeaveBalance - số phép còn lại */}
                <FormField name="annualLeaveBalance" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số phép còn lại</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value ?? ''} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem> )} />
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="mt-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider md:text-h5 md:font-medium md:text-foreground md:normal-case md:tracking-normal mb-4">Thông tin đăng nhập</h3>
            
            <Card className="mb-6">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Email đăng nhập</Label>
                  <Input 
                    value={form.watch('workEmail') || ''} 
                    disabled 
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email công việc được sử dụng làm tên đăng nhập
                  </p>
                </div>

                {!password && !isEditMode && (
                  <div className="rounded-lg border border-orange-200 p-3 bg-orange-50 dark:bg-orange-950/20">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      Chưa có mật khẩu. Nhân viên chưa thể đăng nhập hệ thống.
                    </p>
                  </div>
                )}

                {isEditMode && (initialData as { hasPassword?: boolean })?.hasPassword && (
                  <div className="rounded-lg border p-3 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Mật khẩu đã được thiết lập. Để thay đổi, nhập mật khẩu mới bên dưới.
                    </p>
                  </div>
                )}

                {isEditMode && !(initialData as { hasPassword?: boolean })?.hasPassword && (
                  <div className="rounded-lg border border-orange-200 p-3 bg-orange-50 dark:bg-orange-950/20">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      Chưa có mật khẩu. Nhân viên chưa thể đăng nhập hệ thống.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu mới</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGeneratePassword}
                      >
                        Tạo tự động
                      </Button>
                      {password && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCopyPassword}
                        >
                          Copy
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Lưu ý quan trọng:
                  </p>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>Email công việc được dùng làm tên đăng nhập</li>
                    <li>Mật khẩu phải có tối thiểu 6 ký tự</li>
                    <li>Sử dụng nút "Tạo tự động" để tạo mật khẩu mạnh</li>
                    <li>Nhớ copy và gửi mật khẩu cho nhân viên</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <EmployeeDocumentsTab
              isEditMode={isEditMode}
              getPermanentFiles={getPermanentFiles}
              getStagingFiles={getStagingFiles}
              getDocumentCallbacks={getDocumentCallbacks}
              getDocumentSessionId={getDocumentSessionId}
              handleDocumentUpload={handleDocumentUpload}
              handleRefreshDocuments={handleRefreshDocuments}
              handleMarkForDeletion={handleMarkForDeletion}
              filesToDelete={filesToDelete}
            />
          </TabsContent>

        </Tabs>
      </form>
      <AddressFormDialog
        isOpen={isAddressDialogOpen}
        onOpenChange={handleAddressDialogOpenChange}
        onSave={handleAddressDialogSave}
        editingAddress={addressDialogEditingAddress}
        hideDefaultSwitches
        hideContactFields
        forcedAddressLevel="2-level"
        title={dialogTitle}
        description={dialogDescription}
      />
    </Form>
  );
}

