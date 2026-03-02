'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { usePageHeader } from '@/contexts/page-header-context';
import { useEmployee, useEmployeeMutations } from '../hooks/use-employees';
import { useDocumentMutations } from '../hooks/use-employee-documents';
import { EmployeeForm, type EmployeeFormSubmitPayload } from './employee-form';
import { FileUploadAPI } from '@/lib/file-upload-api';
import { asSystemId } from '@/lib/id-types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Employee } from '@/lib/types/prisma-extended';
import { toast } from 'sonner';
import { usePayrollProfileMutations } from '../hooks/use-payroll-profiles';

export function EmployeeFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  
  // Use React Query for fetching employee data
  const { data: employee, isLoading: isLoadingEmployee } = useEmployee(systemId);
  const { create: createMutation, update: updateMutation } = useEmployeeMutations();
  
  const { updateDocumentFiles } = useDocumentMutations(systemId);
  const { upsert: upsertPayrollProfile, remove: removePayrollProfile } = usePayrollProfileMutations();

  // Handle cancel navigation
  const handleCancel = React.useCallback(() => {
    router.push('/employees');
  }, [router]);

  const actions = React.useMemo(() => [
    <Button key="cancel" type="button" variant="outline" onClick={handleCancel} size="sm" className="h-9">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Hủy
    </Button>,
    <Button key="save" type="submit" form="employee-form" size="sm" className="h-9">
      <Edit className="mr-2 h-4 w-4" />
      Lưu
    </Button>
  ], [handleCancel]);

  usePageHeader({ 
    title: employee ? `Chỉnh sửa ${employee.fullName}` : 'Thêm nhân viên mới',
    actions,
    breadcrumb: employee ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
      { label: employee.fullName, href: `/employees/${systemId}`, isCurrent: false },
      { label: 'Chỉnh sửa', href: '', isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
      { label: 'Thêm mới', href: '', isCurrent: true }
    ]
  });

  // Handle form submission with staging document confirmation
  const handleSubmit = async (values: EmployeeFormSubmitPayload) => {
    const { _documentFiles, _payrollProfile, ...employeeData } = values;
    
    try {
      let targetEmployeeSystemId: string;
      
      if (employee) {
        // Update existing employee
        await updateMutation.mutateAsync({ systemId: employee.systemId, ...(employeeData as Partial<Employee>) });
        targetEmployeeSystemId = employee.systemId;
        
        toast.success("Cập nhật thành công", {
          description: `Đã cập nhật thông tin nhân viên ${employeeData.fullName || employee.fullName}.`,
        });
      } else {
        // Add new employee
        const newEmployee = await createMutation.mutateAsync(employeeData as Omit<Employee, 'systemId'>);
        targetEmployeeSystemId = newEmployee!.systemId;
        
        toast.success("Thêm mới thành công", {
          description: `Đã thêm nhân viên ${employeeData.fullName} vào hệ thống.`,
        });
      }
      
      if (_payrollProfile === null) {
        await removePayrollProfile.mutateAsync(asSystemId(targetEmployeeSystemId));
      } else if (_payrollProfile) {
        await upsertPayrollProfile.mutateAsync({ 
          employeeSystemId: asSystemId(targetEmployeeSystemId), 
          input: _payrollProfile 
        });
      }

      // Confirm all staging documents nếu có files
      if (_documentFiles && Object.keys(_documentFiles).length > 0) {
        
        try {
          // Chuẩn bị employee data để tạo smart filename
          const employeeInfo = {
            name: employeeData.fullName || employee?.fullName || '',
            department: employeeData.department || employee?.department || '',
            employeeId: employeeData.systemId || employee?.systemId || '', // ✅ Fixed: Use systemId
            position: employeeData.jobTitle || employee?.jobTitle || ''
          };
          
          // Confirm each document type directly từ _documentFiles
          for (const [key, files] of Object.entries(_documentFiles)) {
            if (files.length > 0) {
              const [documentType, ...documentNameParts] = key.split('-');
              const documentName = documentNameParts.join('-');
              
              
              // Lấy sessionId từ file đầu tiên (tất cả file trong cùng upload session có cùng sessionId)
              const firstFile = files[0];
              const sessionId = firstFile?.sessionId;
              
              if (sessionId) {
                // Confirm staging files → permanent
                const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
                  sessionId,
                  targetEmployeeSystemId,
                  documentType,
                  documentName,
                  employeeInfo
                );
                
                // Update React Query cache with confirmed files
                updateDocumentFiles(
                  documentType,
                  documentName,
                  confirmedFiles
                );
                
                // Cleanup staging files after successful confirmation
                try {
                  await FileUploadAPI.deleteStagingFiles(sessionId);
                } catch (_cleanupError) {
                  // Ignore cleanup errors
                }
                
              }
              // else: no confirmed files, skip
            }
          }
          
          // Staging is managed in component state — no global cleanup needed
          
          toast.success("Đã lưu tài liệu thành công!", {
            description: `Tài liệu đã được lưu với tên thông minh.`
          });
        } catch (error) {
          console.error('Failed to confirm staging documents:', error);
          toast.warning("Lưu tài liệu thất bại", {
            description: "Vui lòng thử upload lại tài liệu sau."
          });
        }
      }
      
      // Navigate to employee detail page after save
      router.push(`/employees/${targetEmployeeSystemId}`);
    } catch (error) {
      console.error('Employee form submission failed:', error);
      
      // Parse validation errors for better user feedback
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      
      // Map field names to Vietnamese labels and tabs
      const fieldToTabMap: Record<string, { label: string; tab: string }> = {
        fullName: { label: 'Họ tên', tab: 'Thông tin cá nhân' },
        dob: { label: 'Ngày sinh', tab: 'Thông tin cá nhân' },
        gender: { label: 'Giới tính', tab: 'Thông tin cá nhân' },
        phone: { label: 'Số điện thoại', tab: 'Thông tin cá nhân' },
        personalEmail: { label: 'Email cá nhân', tab: 'Thông tin cá nhân' },
        nationalId: { label: 'CCCD/CMND', tab: 'Thông tin cá nhân' },
        permanentAddress: { label: 'Địa chỉ thường trú', tab: 'Địa chỉ' },
        temporaryAddress: { label: 'Địa chỉ tạm trú', tab: 'Địa chỉ' },
        departmentId: { label: 'Phòng ban', tab: 'Thông tin công việc' },
        branchId: { label: 'Chi nhánh', tab: 'Thông tin công việc' },
        jobTitleId: { label: 'Chức danh', tab: 'Thông tin công việc' },
        hireDate: { label: 'Ngày vào làm', tab: 'Thông tin công việc' },
        workEmail: { label: 'Email công việc', tab: 'Đăng nhập' },
        password: { label: 'Mật khẩu', tab: 'Đăng nhập' },
      };
      
      // Try to extract field errors from the message
      const fieldErrors: string[] = [];
      const affectedTabs = new Set<string>();
      
      // Parse error format: "field1: message1, field2: message2"
      const errorParts = errorMessage.split(', ');
      for (const part of errorParts) {
        const colonIdx = part.indexOf(':');
        if (colonIdx > 0) {
          const fieldName = part.substring(0, colonIdx).trim();
          const fieldInfo = fieldToTabMap[fieldName];
          if (fieldInfo) {
            fieldErrors.push(`${fieldInfo.label}: ${part.substring(colonIdx + 1).trim()}`);
            affectedTabs.add(fieldInfo.tab);
          } else {
            fieldErrors.push(part);
          }
        }
      }
      
      const description = fieldErrors.length > 0
        ? `${fieldErrors.slice(0, 3).join('\n')}${fieldErrors.length > 3 ? `\n...và ${fieldErrors.length - 3} lỗi khác` : ''}`
        : errorMessage;
        
      const tabHint = affectedTabs.size > 0 
        ? ` (Kiểm tra tab: ${Array.from(affectedTabs).join(', ')})`
        : '';
      
      toast.error(`Lỗi khi lưu thông tin${tabHint}`, {
        description,
        duration: 8000, // Show longer for user to read
      });
    }
  };

  // Show loading state while fetching employee data
  if (systemId && isLoadingEmployee) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Đang tải thông tin nhân viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
        <Card className="border-0 shadow-none">
          <CardContent className="min-w-0 overflow-x-hidden p-0">
            <EmployeeForm initialData={employee ?? null} onSubmit={handleSubmit} onCancel={handleCancel} isEditMode={!!employee} />
          </CardContent>
        </Card>
    </div>
  );
}
