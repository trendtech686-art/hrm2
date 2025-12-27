'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DepartmentForm, DepartmentFormValues } from './department-form';
import { useDepartmentStore } from './store';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { ROUTES, generatePath } from '../../../lib/router';

export function DepartmentFormPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { findById, update, add } = useDepartmentStore();
  
  const isEditMode = !!id;
  const department = (isEditMode ? findById(id as any) : null) ?? null;

  const backPath = ROUTES.HRM.DEPARTMENTS;
  const headerActions = React.useMemo(() => [
    <SettingsActionButton
      key="cancel"
      variant="outline"
      onClick={() => router.push(backPath)}
    >
      Hủy
    </SettingsActionButton>,
    <SettingsActionButton
      key="save"
      type="submit"
      form="department-form"
    >
      {isEditMode ? 'Cập nhật' : 'Tạo mới'}
    </SettingsActionButton>,
  ], [backPath, router, isEditMode]);

  useSettingsPageHeader({
    title: isEditMode ? `Chỉnh sửa phòng ban${department?.name ? ` • ${department.name}` : ''}` : 'Thêm phòng ban mới',
    breadcrumb: [
      { label: 'Phòng ban', href: ROUTES.HRM.DEPARTMENTS, isCurrent: false },
      {
        label: isEditMode ? 'Chỉnh sửa' : 'Thêm mới',
        href: isEditMode && id
          ? generatePath(ROUTES.HRM.DEPARTMENT_EDIT, { systemId: id })
          : ROUTES.HRM.DEPARTMENT_NEW,
        isCurrent: true,
      },
    ],
    showBackButton: true,
    backPath,
    actions: headerActions,
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
      });
    }
    router.push(backPath);
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
        </CardContent>
      </Card>
    </div>
  );
}
