import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DepartmentForm, DepartmentFormValues } from './department-form';
import { useDepartmentStore } from './store';
import { usePageHeader } from '../../../contexts/page-header-context';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

export function DepartmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { findById, update, add } = useDepartmentStore();
  
  const isEditMode = !!id;
  const department = isEditMode ? findById(id as any) : null;

  usePageHeader({
    title: isEditMode ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới',
    breadcrumb: [
      { label: 'Phòng ban', href: '/departments' },
      { label: isEditMode ? 'Chỉnh sửa' : 'Thêm mới', href: '' }
    ]
  });

  const handleSubmit = (values: DepartmentFormValues) => {
    if (isEditMode && department) {
      update(department.systemId, {
        ...department,
        id: values.id,
        name: values.name,
      });
    } else {
      add({
        id: values.id,
        name: values.name,
        jobTitleIds: [],
        managerId: null,
      });
    }
    navigate('/departments');
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentForm
            initialData={department}
            onSubmit={handleSubmit}
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/departments')}
            >
              Hủy
            </Button>
            <Button type="submit" form="department-form">
              {isEditMode ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
