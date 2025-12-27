import * as React from "react";
import { flushSync } from 'react-dom';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeFormSchema, validateUniqueId } from "./validation";
import type { Employee, EmployeeAddress } from '@/lib/types/prisma-extended';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { SystemId, BusinessId } from '@/lib/id-types';
import { Upload, Search, Eye, EyeOff, RefreshCw, Copy } from "lucide-react";
import { toast } from 'sonner';
import { useJobTitleStore } from '../settings/job-titles/store';
import { useEmployeeStore } from './store';
import { useBranchStore } from '../settings/branches/store';
import { useProvinceStore } from "../settings/provinces/store";
import { useDocumentStore } from './document-store';
import { useShallow } from 'zustand/react/shallow';
import { NewDocumentsUpload } from '../../components/ui/new-documents-upload';
import { ExistingDocumentsViewer } from '../../components/ui/existing-documents-viewer';
import { FileUploadAPI } from '../../lib/file-upload-api';
import type { StagingFile, UploadedFile } from '../../lib/file-upload-api';
import { AddressFormDialog } from '../customers/components/address-form-dialog';
import type { CustomerAddress } from '../customers/types';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { CurrencyInput } from "../../components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { DatePicker } from "../../components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { useEmployeeSettingsStore } from "../settings/employees/employee-settings-store";
import { useEmployeeCompStore, type EmployeePayrollProfileInput } from "./employee-comp-store";
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
  initialData: Employee | null;
  onSubmit: (values: EmployeeFormSubmitPayload) => Promise<void> | void;
  onCancel: () => void;
  isEditMode?: boolean; // Thêm prop để biết có phải edit mode không
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

const legalDocuments = [
  "Sơ yếu lý lịch",
  "Căn cước công dân (CCCD) / CMND",
  "Giấy khai sinh",
  "Sổ hộ khẩu / Giấy xác nhận thông tin cư trú",
  "Giấy khám sức khỏe",
  "Bằng cấp, chứng chỉ chuyên môn",
];

const workProcessDocuments = [
    "Hợp đồng lao động (và các phụ lục)",
    "Quyết định tuyển dụng / Bổ nhiệm",
    "Cam kết bảo mật thông tin (NDA)",
    "Hồ sơ Thuế thu nhập cá nhân (TNCN)",
    "Thông tin tài khoản ngân hàng",
    "Hồ sơ Bảo hiểm (BHXH, BHYT, BHTN)",
    "Bản mô tả công việc",
];

const terminationDocuments = [
    "Đơn xin thôi việc / Thông báo chấm dứt hợp đồng",
    "Quyết định thôi việc",
    "Biên bản bàn giao công việc & tài sản",
    "Thỏa thuận chấm dứt hợp đồng",
    "Hồ sơ thanh toán chế độ (lương, phép năm, trợ cấp)",
    "Hồ sơ chốt sổ Bảo hiểm xã hội",
];

const multiFileDocuments = [
    { id: "decisions", title: "Các quyết định (lương, thưởng, thăng chức, kỷ luật)", maxFiles: 25, description: "Tối đa 25 file, 80MB" },
    { id: "kpi", title: "Tài liệu đánh giá hiệu suất (KPI)", maxFiles: 15, description: "Tối đa 15 file, 60MB" },
    { id: "requests", title: "Đơn từ (nghỉ phép, nghỉ ốm,...)", maxFiles: 30, description: "Tối đa 30 file, 100MB" },
];

const formatCurrencyDisplay = (value?: number) => {
  if (typeof value !== 'number') return 'Theo công thức';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const areArraysEqualIgnoringOrder = (first: SystemId[] = [], second: SystemId[] = []) => {
  if (first.length !== second.length) return false;
  const reference = new Set(second);
  return first.every((value) => reference.has(value));
};

const removeUndefined = (obj: any) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
};

export function EmployeeForm({ initialData, onSubmit, onCancel, isEditMode = false }: EmployeeFormProps) {
  const [documentSearch, setDocumentSearch] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState(initialData?.password || '');
  const [confirmPassword, setConfirmPassword] = React.useState(initialData?.password || '');
  const [permanentAddress, setPermanentAddress] = React.useState<AddressParts>(parseAddress(initialData?.permanentAddress));
  const [temporaryAddress, setTemporaryAddress] = React.useState<AddressParts>(parseAddress(initialData?.temporaryAddress));
  const [isAddressDialogOpen, setIsAddressDialogOpen] = React.useState(false);
  const [addressDialogTarget, setAddressDialogTarget] = React.useState<'permanent' | 'temporary'>('permanent');
  const [addressDialogEditingAddress, setAddressDialogEditingAddress] = React.useState<CustomerAddress | null>(null);
  
  const { data: jobTitles } = useJobTitleStore();
  const { data: employees } = useEmployeeStore();
  const { data: branches } = useBranchStore();
  const { data: provinces, wards } = useProvinceStore(
    useShallow((state) => ({
      data: state.data,
      wards: state.wards,
    }))
  );
  // FIX: Use useShallow to prevent infinite loops caused by new object references
  const { workShifts, salaryComponents } = useEmployeeSettingsStore(
    useShallow((state) => ({
      workShifts: state.settings.workShifts,
      salaryComponents: state.getSalaryComponents(),
    }))
  );
  const getPayrollProfile = useEmployeeCompStore((state) => state.getPayrollProfile);
  const { 
    updateStagingDocument,
    getDocuments,
    refreshDocuments
  } = useDocumentStore(
    useShallow((state) => ({
      updateStagingDocument: state.updateStagingDocument,
      getDocuments: state.getDocuments,
      refreshDocuments: state.refreshDocuments,
    }))
  );

  const payrollProfile = React.useMemo(
    () => (initialData?.systemId ? getPayrollProfile(initialData.systemId) : null),
    [initialData?.systemId, getPayrollProfile]
  );

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

  const form = useForm<EmployeeFormValues, any, EmployeeFormValues>({
    // resolver: zodResolver(employeeFormSchema), // TODO: Fix type mismatch
    defaultValues: {
      ...(initialData ?? {}),
      id: initialData?.id ?? asBusinessId(''),
      dob: parseDate(initialData?.dob ?? '') ?? undefined,
      nationalIdIssueDate: parseDate(initialData?.nationalIdIssueDate ?? '') ?? undefined,
      hireDate: parseDate(initialData?.hireDate ?? '') ?? undefined,
      terminationDate: parseDate(initialData?.terminationDate ?? '') ?? undefined,
      contractStartDate: parseDate(initialData?.contractStartDate ?? '') ?? undefined,
      contractEndDate: parseDate(initialData?.contractEndDate ?? '') ?? undefined,
      ...payrollDefaultValues,
    },
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
    } catch (err) {
      toast.error('Không thể copy mật khẩu');
    }
  };

  const handleCopyPayrollBank = React.useCallback(() => {
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

  const handleResetPayrollComponents = React.useCallback(() => {
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

  const findWardRecord = React.useCallback(
    (provinceName: string, wardName: string) => {
      // First try exact match
      let found = wards.find((ward) => ward.name === wardName && ward.provinceName === provinceName);
      if (found) return found;
      
      // Try with normalized province name matching
      const normalizedProvince = provinceName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
      found = wards.find((ward) => {
        if (ward.name !== wardName) return false;
        const wardProvince = (ward.provinceName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
        return wardProvince === normalizedProvince ||
               wardProvince.includes(normalizedProvince) ||
               normalizedProvince.includes(wardProvince);
      });
      
      return found;
    },
    [wards]
  );

  const buildEditingAddressPayload = React.useCallback(
    (source: AddressParts | null, target: 'permanent' | 'temporary'): CustomerAddress | null => {
      console.log('[buildEditingAddressPayload] source:', source, 'target:', target);
      
      if (!source || (!source.street && !source.province && !source.ward)) {
        console.log('[buildEditingAddressPayload] No source data, returning null');
        return null;
      }

      const wardRecord = source.ward ? findWardRecord(source.province, source.ward) : undefined;
      console.log('[buildEditingAddressPayload] wardRecord:', wardRecord);
      
      const resolvedProvinceId = source.provinceId || findProvinceIdByName(source.province);
      console.log('[buildEditingAddressPayload] resolvedProvinceId:', resolvedProvinceId, 'from provinceId:', source.provinceId, 'or from name:', source.province);

      const result = {
        id: '',
        label: source.label || (target === 'permanent' ? 'Địa chỉ thường trú' : 'Địa chỉ tạm trú'),
        street: source.street,
        province: source.province,
        provinceId: resolvedProvinceId,
        district: source.district || wardRecord?.districtName || '',
        districtId: source.districtId || wardRecord?.districtId || 0,
        ward: source.ward,
        wardId: source.wardId || wardRecord?.id || '',
        contactName: source.contactName || '',
        contactPhone: source.contactPhone || '',
        notes: source.notes || '',
        isDefaultShipping: false,
        isDefaultBilling: false,
        inputLevel: source.inputLevel || '2-level',
        autoFilled: source.inputLevel === '2-level',
      };
      
      console.log('[buildEditingAddressPayload] result:', result);
      return result;
    },
    [findProvinceIdByName, findWardRecord]
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

      const formattedFullAddress = [addressData.street, addressData.ward || addressData.district, addressData.province]
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

    const existingIds = employees.map(e => e.id);
    const isUnique = validateUniqueId(sanitizedId, existingIds, initialData?.id);

    if (!isUnique) {
      form.setError('id', {
        type: 'manual',
        message: `Mã nhân viên "${sanitizedId}" đã tồn tại`
      });
    } else {
      form.clearErrors('id');
    }
  }, [watchedId, employees, form, initialData?.id]);

  // Unified document state - staging và permanent
  const [documentFiles, setDocumentFiles] = React.useState<Record<string, any[]>>({});
  const [documentSessions, setDocumentSessions] = React.useState<Record<string, string>>({});
  // Track files marked for deletion (safe mode)
  const [filesToDelete, setFilesToDelete] = React.useState<string[]>([]);
  // Loading state for documents
  const [isLoadingDocuments, setIsLoadingDocuments] = React.useState(false);

  // Initialize document files - load existing cho edit mode, reset cho new
  React.useEffect(() => {
    if (initialData?.systemId) {
      setIsLoadingDocuments(true);
      
      // IMPORTANT: ALWAYS force refresh từ server để đảm bảo data mới nhất
      // Đặc biệt sau khi xóa file, phải reload để UI cập nhật
      refreshDocuments(initialData.systemId, true) // force = true
        .then(() => {
          // Sau đó load vào local state
          loadExistingDocuments(initialData.systemId);
        })
        .catch((error) => {
          // Vẫn cố load local nếu có
          loadExistingDocuments(initialData.systemId);
        })
        .finally(() => {
          setIsLoadingDocuments(false);
        });
    } else {
      setDocumentFiles({});
      setDocumentSessions({});
      setIsLoadingDocuments(false);
    }
  }, [initialData?.systemId]); // Remove refreshDocuments from deps to always create new function

  // Load existing documents for edit mode
  const loadExistingDocuments = React.useCallback(async (employeeSystemId: string) => {
    try {
      const existingDocs = getDocuments(employeeSystemId);
      
      const loadedFiles: Record<string, any[]> = {};
      
      existingDocs.forEach(doc => {
        const key = `${doc.documentType}-${doc.documentName}`;
        
        // Convert ServerFile[] to StagingFile[] format for display
        loadedFiles[key] = doc.files.map(file => ({
          id: file.id,
          sessionId: '', // No session for existing files
          name: file.name,
          originalName: file.originalName,
          slug: file.slug,
          filename: file.filename,
          size: file.size,
          type: file.type,
          url: file.url, // This will have /uploads/permanent/ path
          status: 'staging' as const, // Keep as 'staging' but URL indicates permanent
          uploadedAt: file.uploadedAt,
          metadata: file.metadata
        }));
      });
      
      setDocumentFiles(loadedFiles);
    } catch (error) {
      // Silent error
    }
  }, [getDocuments]);

  // Document upload handler - LUÔN staging trước, kể cả nhân viên cũ
  const handleDocumentUpload = React.useCallback((documentType: string, documentName: string, newStagingFiles: StagingFile[], sessionId?: string) => {
    const key = `${documentType}-${documentName}`;
    
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
      
      // Cập nhật staging store
      updateStagingDocument(documentType, documentName, newStagingFiles, sessionId);
    }
  }, [updateStagingDocument]);

  // Handle session change for staging documents
  const handleSessionChange = React.useCallback((documentType: string, documentName: string, sessionId: string) => {
    const key = `${documentType}-${documentName}`;
    setDocumentSessions(prev => ({
      ...prev,
      [key]: sessionId
    }));
  }, []);

  // Memoized getter cho document files
  const getDocumentFiles = React.useCallback((documentType: string, documentName: string): any[] => {
    const key = `${documentType}-${documentName}`;
    return documentFiles[key] || [];
  }, [documentFiles]);

  // Stable callback generators using useMemo instead of ref cache
  const getDocumentCallbacks = React.useMemo(() => {
    const callbacksMap = new Map<string, {
      onChange: (files: StagingFile[]) => void;
      onSessionChange: (sessionId: string) => void;
    }>();

    return (documentType: string, documentName: string) => {
      const key = `${documentType}-${documentName}`;
      
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
    // Permanent files: không có sessionId và URL bắt đầu với /api/files/
    return allFiles.filter(file => 
      !file.sessionId && file.url && file.url.startsWith('/api/files/')
    );
  }, [getDocumentFiles]);

  // Get STAGING files only (for NewDocumentsUpload)
  const getStagingFiles = React.useCallback((documentType: string, documentName: string): StagingFile[] => {
    const allFiles = getDocumentFiles(documentType, documentName);
    // Staging files have sessionId and URL starting with /api/staging/
    const stagingFiles = allFiles.filter(file => 
      file.sessionId && (file.url?.includes('/api/staging/') || file.url?.includes('/staging/'))
    );
    
    return stagingFiles;
  }, [getDocumentFiles]);

  // Get session ID for document
  const getDocumentSessionId = React.useCallback((documentType: string, documentName: string): string | undefined => {
    const key = `${documentType}-${documentName}`;
    return documentSessions[key];
  }, [documentSessions]);

  // Refresh handler for ExistingDocumentsViewer
  const handleRefreshDocuments = React.useCallback(async () => {
    if (initialData?.systemId) {
      setIsLoadingDocuments(true);
      await refreshDocuments(initialData.systemId, true); // force = true
      loadExistingDocuments(initialData.systemId);
      setIsLoadingDocuments(false);
    }
  }, [initialData?.systemId, refreshDocuments, loadExistingDocuments]);

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
      
      // ✅ Step 0: Validate unique ID (with sanitization)
      const existingIds = employees.map(emp => emp.id);
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

      const isUnique = validateUniqueId(sanitizedId, existingIds, initialData?.id);
      
      if (sanitizedId && !isUnique) {
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
        
        try {
          await Promise.all(
            filesToDelete.map(fileId => FileUploadAPI.deleteFile(fileId))
          );
          
          toast.success('✓ Đã xóa các file cũ', {
            description: `${filesToDelete.length} file`,
            id: deleteToastId
          });
          
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
      const cleanedDocumentFiles: Record<string, any[]> = {};
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
        branchSystemId: normalizeSystemId(formattedValues.branchSystemId),
        managerId: normalizeSystemId(formattedValues.managerId),
        createdBy: normalizeSystemId(formattedValues.createdBy),
        updatedBy: normalizeSystemId(formattedValues.updatedBy),
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
  };  const lowercasedSearch = documentSearch.toLowerCase();
  const filteredLegalDocuments = legalDocuments.filter(doc => doc.toLowerCase().includes(lowercasedSearch));
  const filteredWorkProcessDocuments = workProcessDocuments.filter(doc => doc.toLowerCase().includes(lowercasedSearch));
  const filteredMultiFileDocuments = multiFileDocuments.filter(doc => doc.title.toLowerCase().includes(lowercasedSearch));
  const filteredTerminationDocuments = terminationDocuments.filter(doc => doc.toLowerCase().includes(lowercasedSearch));
  
  // Check if search has results - only show "no results" message when actively searching
  const hasSearchResults = filteredLegalDocuments.length > 0 || filteredWorkProcessDocuments.length > 0 || filteredMultiFileDocuments.length > 0 || filteredTerminationDocuments.length > 0;
  const isSearching = documentSearch.trim().length > 0;
  const showNoResultsMessage = isSearching && !hasSearchResults;

  const dialogTitle = `${addressDialogEditingAddress ? 'Chỉnh sửa' : 'Thêm'} ${
    addressDialogTarget === 'permanent' ? 'địa chỉ thường trú' : 'địa chỉ tạm trú'
  }`;

  const dialogDescription = addressDialogEditingAddress
    ? 'Cập nhật thông tin địa chỉ chuẩn 2 hoặc 3 cấp. Hệ thống tự áp dụng sau khi lưu.'
    : 'Chọn địa chỉ 2 hoặc 3 cấp chuẩn quốc gia. Hệ thống sẽ tự áp dụng cho nhân viên sau khi lưu.';

  return (
    <Form {...form}>
      <form id="employee-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 min-w-0 overflow-x-hidden">
        <Tabs defaultValue="personal" className="w-full">
          <div className="w-full overflow-x-auto overflow-y-hidden mb-4 pb-1" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
            <TabsList className="inline-flex w-auto gap-1 p-1 h-auto justify-start">
              <TabsTrigger value="personal" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Thông tin cá nhân
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Địa chỉ
              </TabsTrigger>
              <TabsTrigger value="employment" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Thông tin công việc
              </TabsTrigger>
              <TabsTrigger value="account" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Tài liệu
              </TabsTrigger>
              {!isEditMode && (
                <TabsTrigger value="kpi" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                  KPI
                </TabsTrigger>
              )}
              {!isEditMode && (
                <TabsTrigger value="penalties" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                  Phạt
                </TabsTrigger>
              )}
              <TabsTrigger value="payroll" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Lương & chấm công
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="personal" className="mt-6">
            <h3 className="text-h5 font-medium mb-4">Thông tin cá nhân</h3>
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
              {/* FIX: Explicitly cast `field.value` to `any` to resolve type incompatibility with the Select component. */}
              <FormField name="gender" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Giới tính</FormLabel><Select onValueChange={field.onChange} value={field.value as any}><FormControl><SelectTrigger><SelectValue placeholder="Chọn giới tính" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Nam">Nam</SelectItem><SelectItem value="Nữ">Nữ</SelectItem><SelectItem value="Khác">Khác</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="placeOfBirth" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Nơi sinh</FormLabel><FormControl><Input placeholder="VD: TP.HCM" {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              <FormField 
                name="phone" 
                control={form.control}
                rules={{
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Số điện thoại phải có 10-11 chữ số"
                  }
                }}
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
              {/* FIX: Explicitly cast `field.value` to `any` to resolve type incompatibility with the Select component. */}
              <FormField name="maritalStatus" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Tình trạng hôn nhân</FormLabel><Select onValueChange={field.onChange} value={field.value as any}><FormControl><SelectTrigger><SelectValue placeholder="Chọn tình trạng" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Độc thân">Độc thân</SelectItem><SelectItem value="Đã kết hôn">Đã kết hôn</SelectItem><SelectItem value="Khác">Khác</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              
              
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="nationalId" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số CCCD/Passport</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly pass value prop to DatePicker to avoid type conflicts. */}
              <FormField name="nationalIdIssueDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày cấp</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="nationalIdIssuePlace" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Nơi cấp</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />

              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="personalTaxId" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Mã số thuế cá nhân</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="socialInsuranceNumber" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số sổ BHXH</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              
              <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-h6 font-medium border-b pb-2 mb-4">Thông tin liên hệ khẩn cấp</h4>
              </div>
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="emergencyContactName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Họ và tên người thân</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="emergencyContactPhone" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số điện thoại người thân</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              
              <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-h6 font-medium border-b pb-2 mb-4">Thông tin ngân hàng</h4>
              </div>
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="bankAccountNumber" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số tài khoản</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="bankName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Tên ngân hàng</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="bankBranch" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Chi nhánh</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <div className="mb-6">
              <h3 className="text-h5 font-medium mb-2">Địa chỉ nhân viên</h3>
              <p className="text-sm text-muted-foreground">
                Tách riêng phần địa chỉ để dễ so sánh giữa nơi thường trú và tạm trú, tương tự trải nghiệm quản lý khách hàng.
              </p>
            </div>
            <div className="space-y-6">
              <section className="border rounded-lg p-4 space-y-4">
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
                  <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    Chưa có địa chỉ. Nhấn "Chỉnh sửa địa chỉ" để nhập nhanh bằng form chuẩn 2 cấp / 3 cấp.
                  </div>
                )}
              </section>

              <section className="border rounded-lg p-4 space-y-4">
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
                  <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                    Chưa có địa chỉ. Nhấn "Chỉnh sửa địa chỉ" để nhập nhanh bằng form chuẩn 2 cấp / 3 cấp.
                  </div>
                )}
              </section>
            </div>
          </TabsContent>

          <TabsContent value="employment" className="mt-6">
             <h3 className="text-h5 font-medium mb-4">Thông tin công việc, Lương & Nghỉ phép</h3>
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
                {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
                <FormField name="workEmail" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Email công việc</FormLabel><FormControl><Input type="email" placeholder="username@company.com" {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly cast `field.value` to `any` to resolve type incompatibility with the Select component. */}
                <FormField name="branchSystemId" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Chi nhánh</FormLabel><Select onValueChange={field.onChange} value={field.value as any}><FormControl><SelectTrigger><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger></FormControl><SelectContent>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly cast `field.value` to `any` to resolve type incompatibility with the Select component. */}
                <FormField name="department" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phòng ban</FormLabel><Select onValueChange={field.onChange} value={field.value as any}><FormControl><SelectTrigger><SelectValue placeholder="Chọn phòng ban" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem><SelectItem value="Nhân sự">Nhân sự</SelectItem><SelectItem value="Kinh doanh">Kinh doanh</SelectItem><SelectItem value="Marketing">Marketing</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly cast `field.value` to `any` to resolve type incompatibility with the Select component. */}
                <FormField name="jobTitle" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Chức danh</FormLabel><Select onValueChange={field.onChange} value={field.value as any}><FormControl><SelectTrigger><SelectValue placeholder="Chọn chức danh" /></SelectTrigger></FormControl><SelectContent>{jobTitles.map(jt => (<SelectItem key={jt.systemId} value={jt.name}>{jt.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly pass value prop to DatePicker to avoid type conflicts. */}
                <FormField name="hireDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày vào làm</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly cast `field.value` to `any` to resolve type incompatibility with the Select component. */}
                <FormField name="employeeType" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Loại nhân viên</FormLabel><Select onValueChange={field.onChange} value={field.value as any}><FormControl><SelectTrigger><SelectValue placeholder="Chọn loại NV" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Chính thức">Chính thức</SelectItem><SelectItem value="Thử việc">Thử việc</SelectItem><SelectItem value="Thực tập sinh">Thực tập sinh</SelectItem><SelectItem value="Bán thời gian">Bán thời gian</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly cast `field.value` to `any` to resolve type incompatibility with the Select component. */}
                <FormField name="employmentStatus" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Trạng thái làm việc</FormLabel><Select onValueChange={field.onChange} value={field.value as any}><FormControl><SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Đang làm việc">Đang làm việc</SelectItem><SelectItem value="Tạm nghỉ">Tạm nghỉ</SelectItem><SelectItem value="Đã nghỉ việc">Đã nghỉ việc</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly pass value prop to DatePicker to avoid type conflicts. */}
                <FormField name="terminationDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày nghỉ việc</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
                
                {/* FIX: Explicitly cast `field.value` to `any` to resolve type incompatibility with the Select component. */}
                <FormField name="contractType" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Loại hợp đồng</FormLabel><Select onValueChange={field.onChange} value={field.value as any}><FormControl><SelectTrigger><SelectValue placeholder="Chọn loại hợp đồng" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Không xác định">Không xác định</SelectItem><SelectItem value="Thử việc">Thử việc</SelectItem><SelectItem value="1 năm">1 năm</SelectItem><SelectItem value="2 năm">2 năm</SelectItem><SelectItem value="3 năm">3 năm</SelectItem><SelectItem value="Vô thời hạn">Vô thời hạn</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                <FormField name="contractNumber" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số hợp đồng</FormLabel><FormControl><Input placeholder="Số hợp đồng" {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly pass value prop to DatePicker to avoid type conflicts. */}
                <FormField name="contractStartDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày bắt đầu HĐ</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
                {/* FIX: Explicitly pass value prop to DatePicker to avoid type conflicts. */}
                <FormField name="contractEndDate" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Ngày kết thúc HĐ</FormLabel><FormControl><DatePicker value={field.value as Date} onChange={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
                
                <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-h6 font-medium border-b pb-2 mb-4">Lương & Phụ cấp</h4>
                </div>
                 <FormField name="baseSalary" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Lương cơ bản</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="socialInsuranceSalary" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Lương đóng BHXH</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="positionAllowance" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phụ cấp chức vụ</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="mealAllowance" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phụ cấp ăn trưa</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="otherAllowances" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phụ cấp khác</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />

                <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-h6 font-medium border-b pb-2 mb-4">Nghỉ phép</h4>
                </div>
                {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
                <FormField name="leaveTaken" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số phép đã sử dụng</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as any} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem> )} />
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="mt-6">
            <h3 className="text-h5 font-medium mb-4">Thông tin đăng nhập</h3>
            
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

                {password && isEditMode && (
                  <div className="rounded-lg border p-3 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Mật khẩu đã được thiết lập. Để thay đổi, nhập mật khẩu mới bên dưới.
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-h5 font-medium">Tài liệu & Hồ sơ nhân viên</h3>
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm tài liệu..."
                        className="w-full pl-8 h-9"
                        value={documentSearch}
                        onChange={(e) => setDocumentSearch(e.target.value)}
                    />
                </div>
            </div>
            
            {/* 3-Row Layout */}
            <div className="space-y-6">
                {/* Row 1: Legal Documents */}
                {(!isSearching || filteredLegalDocuments.length > 0) && (
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-h6 text-primary">1. Tài liệu pháp lý</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(isSearching ? filteredLegalDocuments : legalDocuments).map(doc => {
                                    const permanentFiles = getPermanentFiles('legal', doc);
                                    const stagingFiles = getStagingFiles('legal', doc);
                                    const hasExistingFiles = permanentFiles.length > 0;
                                    const callbacks = getDocumentCallbacks('legal', doc);

                                    return (
                                        <div key={doc} className="space-y-3 p-3 border rounded-lg bg-muted/30">
                                            <h5 className="text-sm font-medium text-foreground">{doc}</h5>
                                            
                                            {/* Option A: Separate Components */}
                                            {isEditMode && hasExistingFiles && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                                                        <span>✓</span>
                                                        <span>File đã lưu vĩnh viễn</span>
                                                    </div>
                                                    <ExistingDocumentsViewer
                                                        files={permanentFiles}
                                                        onChange={(updatedFiles) => {
                                                            // Chỉ update permanent files, staging sẽ được merge trong handleDocumentUpload
                                                            handleDocumentUpload('legal', doc, updatedFiles);
                                                        }}
                                                        onRefresh={handleRefreshDocuments}
                                                        onMarkForDeletion={handleMarkForDeletion}
                                                        markedForDeletion={filesToDelete}
                                                    />
                                                </div>
                                            )}

                                            {/* New files upload section */}
                                            <div className="space-y-2">
                                                {isEditMode && hasExistingFiles && (
                                                    <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                                        <span>📤</span>
                                                        <span>Thêm file mới (tạm thời)</span>
                                                    </div>
                                                )}
                                                <NewDocumentsUpload
                                                    maxFiles={3}
                                                    maxTotalSize={30 * 1024 * 1024} // 30MB for legal docs
                                                    value={stagingFiles}
                                                    onChange={callbacks.onChange}
                                                    sessionId={getDocumentSessionId('legal', doc)}
                                                    onSessionChange={callbacks.onSessionChange}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Row 2: Work Process Documents */}
                {(!isSearching || filteredWorkProcessDocuments.length > 0 || filteredMultiFileDocuments.length > 0) && (
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-h6 text-primary">2. Tài liệu trong quá trình làm việc</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(isSearching ? filteredWorkProcessDocuments : workProcessDocuments).map(doc => {
                                    const permanentFiles = getPermanentFiles('work-process', doc);
                                    const stagingFiles = getStagingFiles('work-process', doc);
                                    const hasExistingFiles = permanentFiles.length > 0;
                                    const callbacks = getDocumentCallbacks('work-process', doc);

                                    return (
                                        <div key={doc} className="space-y-3 p-3 border rounded-lg bg-muted/30">
                                            <h5 className="text-sm font-medium text-foreground">{doc}</h5>
                                            
                                            {isEditMode && hasExistingFiles && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                                                        <span>✓</span>
                                                        <span>File đã lưu vĩnh viễn</span>
                                                    </div>
                                                    <ExistingDocumentsViewer
                                                        files={permanentFiles}
                                                        onChange={(updatedFiles) => {
                                                            const allFiles = [...updatedFiles, ...stagingFiles];
                                                            handleDocumentUpload('work-process', doc, allFiles);
                                                        }}
                                                        onRefresh={handleRefreshDocuments}
                                                        onMarkForDeletion={handleMarkForDeletion}
                                                        markedForDeletion={filesToDelete}
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                {isEditMode && hasExistingFiles && (
                                                    <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                                        <span>📤</span>
                                                        <span>Thêm file mới (tạm thời)</span>
                                                    </div>
                                                )}
                                                <NewDocumentsUpload
                                                    maxFiles={5}
                                                    maxTotalSize={40 * 1024 * 1024} // 40MB for work process docs
                                                    value={stagingFiles}
                                                    onChange={callbacks.onChange}
                                                    sessionId={getDocumentSessionId('work-process', doc)}
                                                    onSessionChange={callbacks.onSessionChange}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                {(isSearching ? filteredMultiFileDocuments : multiFileDocuments).map(doc => {
                                    const permanentFiles = getPermanentFiles(doc.id, doc.title);
                                    const stagingFiles = getStagingFiles(doc.id, doc.title);
                                    const hasExistingFiles = permanentFiles.length > 0;
                                    const callbacks = getDocumentCallbacks(doc.id, doc.title);

                                    return (
                                        <div key={doc.id} className="space-y-3 p-3 border rounded-lg bg-muted/30">
                                            <div className="flex items-start justify-between">
                                                <h5 className="text-sm font-medium text-foreground">{doc.title}</h5>
                                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full whitespace-nowrap">
                                                    {doc.description}
                                                </span>
                                            </div>
                                            
                                            {isEditMode && hasExistingFiles && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                                                        <span>✓</span>
                                                        <span>File đã lưu vĩnh viễn</span>
                                                    </div>
                                                    <ExistingDocumentsViewer
                                                        files={permanentFiles}
                                                        onChange={(updatedFiles) => {
                                                            const allFiles = [...updatedFiles, ...stagingFiles];
                                                            handleDocumentUpload(doc.id, doc.title, allFiles);
                                                        }}
                                                        onRefresh={handleRefreshDocuments}
                                                        onMarkForDeletion={handleMarkForDeletion}
                                                        markedForDeletion={filesToDelete}
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                {isEditMode && hasExistingFiles && (
                                                    <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                                        <span>📤</span>
                                                        <span>Thêm file mới (tạm thời)</span>
                                                    </div>
                                                )}
                                                <NewDocumentsUpload
                                                    maxFiles={doc.id === 'requests' ? 30 : doc.id === 'decisions' ? 25 : 15}
                                                    maxTotalSize={doc.id === 'requests' ? 100 * 1024 * 1024 : doc.id === 'decisions' ? 80 * 1024 * 1024 : 60 * 1024 * 1024}
                                                    value={stagingFiles}
                                                    onChange={callbacks.onChange}
                                                    sessionId={getDocumentSessionId(doc.id, doc.title)}
                                                    onSessionChange={callbacks.onSessionChange}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Row 3: Termination Documents */}
                {(!isSearching || filteredTerminationDocuments.length > 0) && (
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-h6 text-primary">3. Tài liệu khi nghỉ việc</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(isSearching ? filteredTerminationDocuments : terminationDocuments).map(doc => {
                                    const permanentFiles = getPermanentFiles('termination', doc);
                                    const stagingFiles = getStagingFiles('termination', doc);
                                    const hasExistingFiles = permanentFiles.length > 0;
                                    const callbacks = getDocumentCallbacks('termination', doc);

                                    return (
                                        <div key={doc} className="space-y-3 p-3 border rounded-lg bg-muted/30">
                                            <h5 className="text-sm font-medium text-foreground">{doc}</h5>
                                            
                                            {isEditMode && hasExistingFiles && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                                                        <span>✓</span>
                                                        <span>File đã lưu vĩnh viễn</span>
                                                    </div>
                                                    <ExistingDocumentsViewer
                                                        files={permanentFiles}
                                                        onChange={(updatedFiles) => {
                                                            const allFiles = [...updatedFiles, ...stagingFiles];
                                                            handleDocumentUpload('termination', doc, allFiles);
                                                        }}
                                                        onRefresh={handleRefreshDocuments}
                                                        onMarkForDeletion={handleMarkForDeletion}
                                                        markedForDeletion={filesToDelete}
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                {isEditMode && hasExistingFiles && (
                                                    <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                                        <span>📤</span>
                                                        <span>Thêm file mới (tạm thời)</span>
                                                    </div>
                                                )}
                                                <NewDocumentsUpload
                                                    maxFiles={5}
                                                    maxTotalSize={35 * 1024 * 1024} // 35MB for termination docs
                                                    value={stagingFiles}
                                                    onChange={callbacks.onChange}
                                                    sessionId={getDocumentSessionId('termination', doc)}
                                                    onSessionChange={callbacks.onSessionChange}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            
            {showNoResultsMessage && (
                <div className="text-center text-muted-foreground py-8">
                    Không tìm thấy tài liệu nào khớp với "{documentSearch}".
                </div>
            )}
          </TabsContent>

          {!isEditMode && (
            <TabsContent value="kpi" className="mt-6">
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed shadow-sm">
                  <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
                      <h3 className="text-h5 font-semibold tracking-tight">Quản lý KPI</h3>
                      <p className="text-sm">Chức năng đang được phát triển.</p>
                  </div>
              </div>
            </TabsContent>
          )}
          {!isEditMode && (
            <TabsContent value="penalties" className="mt-6">
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed shadow-sm">
                  <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
                      <h3 className="text-h5 font-semibold tracking-tight">Quản lý Phiếu phạt</h3>
                      <p className="text-sm">Chức năng đang được phát triển.</p>
                  </div>
              </div>
            </TabsContent>
          )}
          <TabsContent value="payroll" className="mt-6 space-y-6">
            {!isEditMode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-h6">Thiết lập ca làm việc</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <FormField
                    name="payrollWorkShiftSystemId"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ca làm việc mặc định</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value ? asSystemId(value) : undefined)}
                          value={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn ca áp dụng" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {workShifts.length === 0 && (
                              <SelectItem value="__empty" disabled>
                                Chưa có ca làm việc trong cài đặt
                              </SelectItem>
                            )}
                            {workShifts.map((shift) => (
                              <SelectItem key={shift.systemId} value={shift.systemId}>
                                {shift.name} ({shift.startTime} - {shift.endTime})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            Bỏ trống để dùng lịch mặc định trong phần Cài đặt &gt; Nhân viên.
                          </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Ghi chú</p>
                    <p>
                      Ca mặc định giúp đồng bộ chấm công và tính công chuẩn. Bạn vẫn có thể đổi ca cho từng ngày
                      trực tiếp tại module Chấm công.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isEditMode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-h6">Thành phần lương</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Chọn các khoản thu nhập/phụ cấp sẽ gắn với nhân viên này. Danh sách được lấy trực tiếp từ phần Cài đặt
                    &gt; Thành phần lương.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    name="payrollSalaryComponentSystemIds"
                    control={form.control}
                    rules={{
                      validate: (value) => (value?.length ?? 0) > 0 || 'Cần ít nhất 1 thành phần lương',
                    }}
                    render={({ field }) => {
                      const selectedValues = new Set<SystemId>(field.value ?? []);
                      return (
                        <FormItem>
                          <FormLabel className="sr-only">Thành phần lương</FormLabel>
                          <div className="space-y-3">
                            {salaryComponents.length === 0 && (
                              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                Chưa có thành phần lương nào. Vào phần Cài đặt để tạo mới.
                              </div>
                            )}
                            {salaryComponents.map((component) => {
                              const checked = selectedValues.has(component.systemId);
                              return (
                                <label
                                  key={component.systemId}
                                  className="flex items-start justify-between gap-4 rounded-lg border p-3"
                                >
                                  <div>
                                    <p className="font-medium text-foreground">{component.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {component.type === 'fixed'
                                        ? formatCurrencyDisplay(component.amount)
                                        : component.formula || 'Tự nhập công thức'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {component.taxable ? 'Tính thuế TNCN' : 'Không tính thuế'} ·{' '}
                                      {component.partOfSocialInsurance ? 'Tính BHXH' : 'Không tính BHXH'}
                                    </p>
                                  </div>
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(isChecked) => {
                                      const next = new Set(selectedValues);
                                      if (isChecked) {
                                        next.add(component.systemId);
                                      } else {
                                        next.delete(component.systemId);
                                      }
                                      field.onChange(Array.from(next));
                                    }}
                                    className="mt-1"
                                  />
                                </label>
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                            <span>
                              Đang chọn {selectedValues.size}/{salaryComponents.length} thành phần
                            </span>
                            <Button type="button" variant="outline" size="sm" onClick={handleResetPayrollComponents}>
                              Dùng cấu hình mặc định
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-h6">Trả lương & tài khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  name="payrollPaymentMethod"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Hình thức chi trả</FormLabel>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={(field.value as 'bank_transfer' | 'cash') ?? 'bank_transfer'}
                        className="grid gap-3 md:grid-cols-2"
                      >
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
                          <RadioGroupItem value="bank_transfer" />
                          <div className="space-y-1">
                            <p className="font-medium">Chuyển khoản</p>
                            <p className="text-sm text-muted-foreground">
                              Sử dụng tài khoản ngân hàng để chuyển lương hàng tháng.
                            </p>
                          </div>
                        </label>
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
                          <RadioGroupItem value="cash" />
                          <div className="space-y-1">
                            <p className="font-medium">Tiền mặt</p>
                            <p className="text-sm text-muted-foreground">
                              Áp dụng khi trả lương trực tiếp hoặc qua phong bì.
                            </p>
                          </div>
                        </label>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    name="payrollPayoutAccountNumber"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số tài khoản trả lương</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: 0123456789" {...field} value={field.value as string || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="payrollPayoutBankName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngân hàng</FormLabel>
                        <FormControl>
                          <Input placeholder="Vietcombank, MB, ..." {...field} value={field.value as string || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="payrollPayoutBankBranch"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chi nhánh</FormLabel>
                        <FormControl>
                          <Input placeholder="Chi nhánh giao dịch" {...field} value={field.value as string || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleCopyPayrollBank}>
                    Sao chép từ tab Thông tin cá nhân
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Để trống nếu nhân viên dùng cùng tài khoản với phần Thông tin cá nhân.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </form>
      <AddressFormDialog
        isOpen={isAddressDialogOpen}
        onOpenChange={handleAddressDialogOpenChange}
        onSave={handleAddressDialogSave}
        editingAddress={addressDialogEditingAddress}
        hideDefaultSwitches
        title={dialogTitle}
        description={dialogDescription}
      />
    </Form>
  );
}

