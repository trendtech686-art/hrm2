
import * as React from "react";
import { flushSync } from 'react-dom';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeFormSchema, validateUniqueId } from "./validation.ts";
import type { Employee } from "./types.ts";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { Upload, PlusCircle, Search, Eye, EyeOff, RefreshCw, Copy } from "lucide-react";
import { toast } from 'sonner';
import { useJobTitleStore } from '../settings/job-titles/store.ts';
import { useEmployeeStore } from './store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
// FIX: Changed import from useAdministrativeUnitStore to useProvinceStore.
import { useProvinceStore } from "../settings/provinces/store.ts";
import { useDocumentStore } from './document-store.ts';
import { FileUploadStaging } from '../../components/ui/file-upload-staging.tsx';
import { NewDocumentsUpload } from '../../components/ui/new-documents-upload.tsx';
import { ExistingDocumentsViewer } from '../../components/ui/existing-documents-viewer.tsx';
import { FileUploadAPI } from '../../lib/file-upload-api.ts';
import type { StagingFile } from '../../lib/file-upload-api.ts';
import type { UploadedFile } from '../../components/ui/file-upload.tsx';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Label } from "../../components/ui/label.tsx";
import { CurrencyInput } from "../../components/ui/currency-input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { VirtualizedCombobox, type ComboboxOption } from "../../components/ui/virtualized-combobox.tsx";
import { DatePicker } from "../../components/ui/date-picker.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Button } from "../../components/ui/button.tsx";
// Helper type for local form state for addresses
type AddressParts = { province: string, ward: string, street: string };

export type EmployeeFormValues = Omit<Employee, 'systemId' | 'dob' | 'nationalIdIssueDate' | 'hireDate' | 'terminationDate'> & {
  dob?: Date;
  nationalIdIssueDate?: Date;
  hireDate?: Date;
  terminationDate?: Date;
};


type EmployeeFormProps = {
  initialData: Employee | null;
  onSubmit: (values: Partial<Employee> & { _documentFiles?: Record<string, (UploadedFile & { sessionId?: string })[]> }) => Promise<void> | void;
  onCancel: () => void;
  isEditMode?: boolean; // Thêm prop để biết có phải edit mode không
};



const parseAddress = (fullAddress?: string): AddressParts => {
    if (!fullAddress) return { street: '', ward: '', province: '' };
    const parts = fullAddress.split(',').map(p => p.trim());
    return {
        street: parts[0] || '',
        ward: parts[1] || '',
        province: parts[2] || '',
    };
};

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


export function EmployeeForm({ initialData, onSubmit, onCancel, isEditMode = false }: EmployeeFormProps) {
  const [documentSearch, setDocumentSearch] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState(initialData?.password || '');
  const [confirmPassword, setConfirmPassword] = React.useState(initialData?.password || '');
  
  const { data: jobTitles } = useJobTitleStore();
  const { data: employees } = useEmployeeStore();
  const { data: branches } = useBranchStore();
  // FIX: Destructure 'data' as 'provinces' from useProvinceStore.
  const { data: provinces, getWardsByProvinceId } = useProvinceStore();
  const { 
    updateStagingDocument,
    getDocuments,
    refreshDocuments
  } = useDocumentStore();

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

  // Local state for structured addresses
  const [permanentAddress, setPermanentAddress] = React.useState<AddressParts>(parseAddress(initialData?.permanentAddress));
  const [temporaryAddress, setTemporaryAddress] = React.useState<AddressParts>(parseAddress(initialData?.temporaryAddress));

  const form = useForm<EmployeeFormValues>({
    // resolver: zodResolver(employeeFormSchema), // TODO: Fix type mismatch
    defaultValues: {
      ...initialData,
      id: initialData?.id ?? '',
      dob: parseDate(initialData?.dob),
      nationalIdIssueDate: parseDate(initialData?.nationalIdIssueDate),
      hireDate: parseDate(initialData?.hireDate),
      terminationDate: parseDate(initialData?.terminationDate),
    },
    mode: 'onChange', // Validate on every change for realtime feedback
    reValidateMode: 'onChange',
  });

  // Debounced unique ID validation
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'id' && value.id) {
        const existingIds = employees.map(e => e.id);
        // Use validateUniqueId with current value (will be sanitized/uppercased)
        const sanitizedId = value.id.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        // ✅ CRITICAL FIX: Update form value with sanitized ID in real-time
        // This ensures the user sees the sanitized version as they type
        if (sanitizedId !== value.id) {
          form.setValue('id', sanitizedId, { shouldValidate: false });
        }
        
        const isUnique = validateUniqueId(sanitizedId, existingIds, initialData?.id);
        
        if (!isUnique) {
          form.setError('id', {
            type: 'manual',
            message: `Mã nhân viên "${sanitizedId}" đã tồn tại`
          });
        } else {
          form.clearErrors('id');
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, employees, initialData?.id]);

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
      const sanitizedId = values.id ? values.id.toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
      
      // ✅ CRITICAL FIX: Update values with sanitized ID before validation
      if (sanitizedId) {
        values.id = sanitizedId;
      }
      
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

      const formattedValues = {
          ...values,
          password: password || initialData?.password, // Include password
          dob: formatDate(values.dob),
          nationalIdIssueDate: formatDate(values.nationalIdIssueDate),
          hireDate: formatDate(values.hireDate),
          terminationDate: formatDate(values.terminationDate),
          permanentAddress: [permanentAddress.street, permanentAddress.ward, permanentAddress.province].filter(Boolean).join(', '),
          temporaryAddress: [temporaryAddress.street, temporaryAddress.ward, temporaryAddress.province].filter(Boolean).join(', '),
          _documentFiles: uploadedDocumentFiles
      };

      // Step 4: Submit form với documents
      await onSubmit(formattedValues);
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

  // Convert to Combobox options
  const provinceOptions: ComboboxOption[] = React.useMemo(() => 
    provinces.map(p => ({ value: p.name, label: p.name })), 
    [provinces]
  );

  // Wards for dependent dropdowns
  const permanentProvince = React.useMemo(() => provinces.find(p => p.name === permanentAddress.province), [provinces, permanentAddress.province]);
  const permanentWards = React.useMemo(() => permanentProvince ? getWardsByProvinceId(permanentProvince.id) : [], [permanentProvince, getWardsByProvinceId]);
  const permanentWardOptions: ComboboxOption[] = React.useMemo(() =>
    permanentWards.map(w => ({ value: w.name, label: w.name })),
    [permanentWards]
  );
  
  const temporaryProvince = React.useMemo(() => provinces.find(p => p.name === temporaryAddress.province), [provinces, temporaryAddress.province]);
  const temporaryWards = React.useMemo(() => temporaryProvince ? getWardsByProvinceId(temporaryProvince.id) : [], [temporaryProvince, getWardsByProvinceId]);
  const temporaryWardOptions: ComboboxOption[] = React.useMemo(() =>
    temporaryWards.map(w => ({ value: w.name, label: w.name })),
    [temporaryWards]
  );

  return (
    <Form {...form}>
      <form id="employee-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 min-w-0 overflow-x-hidden">
        <Tabs defaultValue="personal" className="w-full">
          <div className="w-full overflow-x-auto overflow-y-hidden mb-4 pb-1" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
            <TabsList className="inline-flex w-auto gap-1 p-1 h-auto justify-start">
              <TabsTrigger value="personal" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Thông tin cá nhân
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
              <TabsTrigger value="kpi" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                KPI
              </TabsTrigger>
              <TabsTrigger value="penalties" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Phạt
              </TabsTrigger>
              <TabsTrigger value="payroll" className="flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap">
                Bảng lương
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="personal" className="mt-6">
            <h3 className="text-lg font-medium mb-4">Thông tin cá nhân</h3>
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
              
              <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-md font-medium border-b pb-2 mb-4">Địa chỉ thường trú</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm">Tỉnh/Thành phố</label>
                      <VirtualizedCombobox
                        options={provinceOptions}
                        value={permanentAddress.province ? { value: permanentAddress.province, label: permanentAddress.province } : null}
                        onChange={(option) => setPermanentAddress(s => ({ ...s, province: option?.value || '', ward: '' }))}
                        placeholder="Chọn tỉnh/thành"
                        searchPlaceholder="Tìm kiếm tỉnh/thành..."
                        emptyPlaceholder="Không tìm thấy tỉnh/thành phố"
                        estimatedItemHeight={36}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm">Phường/Xã</label>
                      <VirtualizedCombobox
                        options={permanentWardOptions}
                        value={permanentAddress.ward ? { value: permanentAddress.ward, label: permanentAddress.ward } : null}
                        onChange={(option) => setPermanentAddress(s => ({ ...s, ward: option?.value || '' }))}
                        placeholder={permanentProvince ? "Chọn phường/xã" : "Chọn tỉnh/thành trước"}
                        searchPlaceholder="Tìm kiếm phường/xã..."
                        emptyPlaceholder="Không tìm thấy phường/xã"
                        disabled={!permanentProvince}
                        estimatedItemHeight={36}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm">Số nhà, đường</label>
                      <Input value={permanentAddress.street} onChange={e => setPermanentAddress(s => ({...s, street: e.target.value}))} />
                    </div>
                  </div>
              </div>
              <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-md font-medium border-b pb-2 mb-4">Địa chỉ tạm trú</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm">Tỉnh/Thành phố</label>
                      <VirtualizedCombobox
                        options={provinceOptions}
                        value={temporaryAddress.province ? { value: temporaryAddress.province, label: temporaryAddress.province } : null}
                        onChange={(option) => setTemporaryAddress(s => ({ ...s, province: option?.value || '', ward: '' }))}
                        placeholder="Chọn tỉnh/thành"
                        searchPlaceholder="Tìm kiếm tỉnh/thành..."
                        emptyPlaceholder="Không tìm thấy tỉnh/thành phố"
                        estimatedItemHeight={36}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm">Phường/Xã</label>
                      <VirtualizedCombobox
                        options={temporaryWardOptions}
                        value={temporaryAddress.ward ? { value: temporaryAddress.ward, label: temporaryAddress.ward } : null}
                        onChange={(option) => setTemporaryAddress(s => ({ ...s, ward: option?.value || '' }))}
                        placeholder={temporaryProvince ? "Chọn phường/xã" : "Chọn tỉnh/thành trước"}
                        searchPlaceholder="Tìm kiếm phường/xã..."
                        emptyPlaceholder="Không tìm thấy phường/xã"
                        disabled={!temporaryProvince}
                        estimatedItemHeight={36}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm">Số nhà, đường</label>
                      <Input value={temporaryAddress.street} onChange={e => setTemporaryAddress(s => ({...s, street: e.target.value}))} />
                    </div>
                  </div>
              </div>
              
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
                  <h4 className="text-md font-medium border-b pb-2 mb-4">Thông tin liên hệ khẩn cấp</h4>
              </div>
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="emergencyContactName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Họ và tên người thân</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="emergencyContactPhone" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số điện thoại người thân</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              
              <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-md font-medium border-b pb-2 mb-4">Thông tin ngân hàng</h4>
              </div>
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="bankAccountNumber" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số tài khoản</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="bankName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Tên ngân hàng</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
              {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
              <FormField name="bankBranch" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Chi nhánh</FormLabel><FormControl><Input {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          </TabsContent>

          <TabsContent value="employment" className="mt-6">
             <h3 className="text-lg font-medium mb-4">Thông tin công việc, Lương & Nghỉ phép</h3>
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
                
                <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-md font-medium border-b pb-2 mb-4">Lương & Phụ cấp</h4>
                </div>
                 <FormField name="baseSalary" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Lương cơ bản</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="socialInsuranceSalary" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Lương đóng BHXH</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="positionAllowance" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phụ cấp chức vụ</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="mealAllowance" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phụ cấp ăn trưa</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />
                 <FormField name="otherAllowances" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Phụ cấp khác</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem> )} />

                <div className="md:col-span-2 lg:col-span-3 pt-4">
                  <h4 className="text-md font-medium border-b pb-2 mb-4">Nghỉ phép</h4>
                </div>
                {/* FIX: Explicitly set value to handle type conflicts with react-hook-form's generic field state. */}
                <FormField name="leaveTaken" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Số phép đã sử dụng</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as any} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem> )} />
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="mt-6">
            <h3 className="text-lg font-medium mb-4">Thông tin đăng nhập</h3>
            
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
                <h3 className="text-lg font-medium">Tài liệu & Hồ sơ nhân viên</h3>
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
                            <CardTitle className="text-base text-primary">1. Tài liệu pháp lý</CardTitle>
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
                            <CardTitle className="text-base text-primary">2. Tài liệu trong quá trình làm việc</CardTitle>
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
                            <CardTitle className="text-base text-primary">3. Tài liệu khi nghỉ việc</CardTitle>
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

          <TabsContent value="kpi" className="mt-6">
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
                    <h3 className="text-lg font-semibold tracking-tight">Quản lý KPI</h3>
                    <p className="text-sm">Chức năng đang được phát triển.</p>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="penalties" className="mt-6">
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
                    <h3 className="text-lg font-semibold tracking-tight">Quản lý Phiếu phạt</h3>
                    <p className="text-sm">Chức năng đang được phát triển.</p>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="payroll" className="mt-6">
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
                    <h3 className="text-lg font-semibold tracking-tight">Quản lý Bảng lương</h3>
                    <p className="text-sm">Chức năng đang được phát triển.</p>
                </div>
            </div>
          </TabsContent>

        </Tabs>
      </form>
    </Form>
  );
}

