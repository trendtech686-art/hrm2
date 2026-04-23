'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DepartmentForm, DepartmentFormValues } from './department-form';
import { useDepartment, useDepartmentMutations } from './hooks/use-departments';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { FormPageShell, mobileBleedCardClass } from '../../../components/layout/page-section';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { ROUTES, generatePath } from '../../../lib/router';
import { toast } from 'sonner';

export function DepartmentFormPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: department } = useDepartment(id);
  const { create, update } = useDepartmentMutations({
    onCreateSuccess: () => {
      toast.success('Tạo mới thành công');
      router.push(backPath);
    },
    onUpdateSuccess: () => {
      toast.success('Cập nhật thành công');
      router.push(backPath);
    },
    onError: (err) => toast.error(err.message)
  });
  
  const isEditMode = !!id;

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
      update.mutate({
        systemId: department.systemId,
        data: {
          id: values.id,
          name: values.name,
        }
      });
    } else {
      create.mutate({
        id: values.id,
        name: values.name,
        jobTitleIds: [],
      });
    }
  };

  return (
    <FormPageShell className="max-w-2xl mx-auto py-6">
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle>
            {isEditMode ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentForm
            initialData={department ?? null}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </FormPageShell>
  );
}
