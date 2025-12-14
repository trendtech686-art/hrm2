
import * as React from 'react';
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useRouteMeta } from '../../hooks/use-route-meta';
import { useEmployeeStore } from './store.ts';
import { useDocumentStore } from './document-store.ts';
import { EmployeeForm, type EmployeeFormSubmitPayload } from './employee-form.tsx';
import { FileUploadAPI } from '../../lib/file-upload-api.ts';
import type { UploadedFile } from '../../lib/file-upload-api.ts';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import type { Employee } from './types.ts';
import { toast } from 'sonner';
import { useEmployeeCompStore } from './employee-comp-store.ts';
import { useShallow } from 'zustand/react/shallow';

export function EmployeeFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const routeMeta = useRouteMeta();
  const { findById, persistence } = useEmployeeStore();
  const { updateDocumentFiles, clearStagingDocuments } = useDocumentStore();
  const { assignComponents, removeProfile } = useEmployeeCompStore(
    useShallow((state) => ({
      assignComponents: state.assignComponents,
      removeProfile: state.removeProfile,
    }))
  );

  const employee = React.useMemo(() => (systemId ? (findById(asSystemId(systemId)) ?? null) : null), [systemId, findById]);

  // Handle cancel navigation
  const handleCancel = React.useCallback(() => {
    navigate('/employees');
  }, [navigate]);

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
    console.log('Employee form page - handling submit with documents:', _documentFiles ? Object.keys(_documentFiles).length : 0, 'document types');
    
    try {
      let targetEmployeeSystemId: string;
      
      if (employee) {
        // Update existing employee
        await persistence.update(employee.systemId, { ...employee, ...employeeData } as Employee);
        targetEmployeeSystemId = employee.systemId;
        
        toast.success("Cập nhật thành công", {
          description: `Đã cập nhật thông tin nhân viên ${employeeData.fullName || employee.fullName}.`,
        });
      } else {
        // Add new employee
        console.log('📋 About to create new employee with data:', {
          fullName: employeeData.fullName,
          currentEmployeesCount: useEmployeeStore.getState().data.length
        });
        
        const newEmployee = await persistence.create(employeeData as Omit<Employee, 'systemId'>);
        targetEmployeeSystemId = newEmployee.systemId;
        
        console.log('✅ New employee created:', {
          systemId: newEmployee.systemId,
          id: newEmployee.id,
          fullName: newEmployee.fullName,
          totalEmployeesAfter: useEmployeeStore.getState().data.length
        });
        
        toast.success("Thêm mới thành công", {
          description: `Đã thêm nhân viên ${employeeData.fullName} vào hệ thống.`,
        });
      }
      
      if (_payrollProfile === null) {
        removeProfile(asSystemId(targetEmployeeSystemId));
      } else if (_payrollProfile) {
        assignComponents(asSystemId(targetEmployeeSystemId), _payrollProfile);
      }

      // Confirm all staging documents nếu có files
      if (_documentFiles && Object.keys(_documentFiles).length > 0) {
        console.log('Employee form page - confirming staging documents for:', targetEmployeeSystemId);
        
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
              
              console.log('Confirming document:', { documentType, documentName, filesCount: files.length });
              
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
                
                // Update document store với confirmed files
                updateDocumentFiles(
                  targetEmployeeSystemId,
                  documentType,
                  documentName,
                  confirmedFiles
                );
                
                // Cleanup staging files after successful confirmation
                try {
                  await FileUploadAPI.deleteStagingFiles(sessionId);
                  console.log('Staging files cleaned up:', sessionId);
                } catch (cleanupError) {
                  console.warn('Failed to cleanup staging files (non-critical):', cleanupError);
                }
                
                console.log('Document confirmed successfully:', { documentType, documentName, confirmedCount: confirmedFiles.length });
              } else {
                console.warn('No sessionId found for document:', { documentType, documentName });
              }
            }
          }
          
          // Clear staging after successful confirmation
          clearStagingDocuments();
          
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
      console.log('🔗 Navigating to:', `/employees/${targetEmployeeSystemId}`);
      navigate(`/employees/${targetEmployeeSystemId}`);
    } catch (error) {
      console.error('Employee form submission failed:', error);
      toast.error("Lỗi khi lưu thông tin", {
        description: error instanceof Error ? error.message : "Lỗi không xác định"
      });
    }
  };

  return (
    <div className="w-full h-full">
        <Card className="border-0 shadow-none">
          <CardContent className="min-w-0 overflow-x-hidden p-0">
            <EmployeeForm initialData={employee} onSubmit={handleSubmit} onCancel={handleCancel} isEditMode={!!employee} />
          </CardContent>
        </Card>
    </div>
  );
}
