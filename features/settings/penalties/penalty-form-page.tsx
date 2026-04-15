'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePenaltyById, usePenaltyMutations } from './hooks/use-penalties';
import type { Penalty } from './types';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { PenaltyForm } from './form';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { asSystemId } from '@/lib/id-types';

export function PenaltyFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { data: penalty } = usePenaltyById(systemId ? asSystemId(systemId) : undefined);
  const { create, update, remove } = usePenaltyMutations({
    onSuccess: () => router.push('/penalties')
  });

  const isEdit = !!systemId;

  const handleCancel = React.useCallback(() => {
    router.push('/penalties');
  }, [router]);

  const actions = React.useMemo(() => [
    <Button 
      key="cancel" 
      type="button"
      variant="outline" 
      size="sm"
      className="h-9"
      onClick={handleCancel}
    >
      Hủy
    </Button>,
    <Button 
      key="save" 
      type="submit"
      size="sm"
      className="h-9"
      form="penalty-form"
    >
      Lưu
    </Button>
  ], [handleCancel]);

  useSettingsPageHeader({
    title: isEdit ? 'Chỉnh sửa phiếu phạt' : 'Tạo phiếu phạt',
    actions,
    breadcrumb: isEdit ? [
      { label: 'Phiếu phạt', href: '/penalties', isCurrent: false },
      penalty ? {
        label: penalty.id,
        href: `/penalties/${penalty.systemId}`,
        isCurrent: false,
      } : {
        label: 'Chi tiết',
        href: systemId ? `/penalties/${systemId}` : '/penalties',
        isCurrent: false,
      },
      { label: 'Chỉnh sửa', href: systemId ? `/penalties/${systemId}/edit` : '/penalties', isCurrent: true }
    ] : [
      { label: 'Phiếu phạt', href: '/penalties', isCurrent: false },
      { label: 'Thêm mới', href: '/penalties/new', isCurrent: true }
    ]
  });

  const handleSubmit = (values: Record<string, unknown>) => {
    if (isEdit && penalty) {
      update.mutate({ systemId: penalty.systemId, data: { ...penalty, ...values } }, {
        onSuccess: () => toast.success('Đã cập nhật phiếu phạt'),
      });
    } else {
      create.mutate(values as Omit<Penalty, 'systemId'>, {
        onSuccess: () => toast.success('Đã tạo phiếu phạt mới'),
      });
    }
  };

  const handleDelete = (systemIdToRemove: string) => {
    remove.mutate(systemIdToRemove, {
      onSuccess: () => toast.success('Đã xóa phiếu phạt'),
    });
  };

  if (isEdit && !penalty) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Không tìm thấy phiếu phạt</h2>
        <Button onClick={() => router.push('/penalties')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay về danh sách
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <PenaltyForm
          initialData={penalty}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
}
