'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSupplierMutations, useSupplier } from './hooks/use-suppliers';
import { SupplierForm, type SupplierFormValues } from './supplier-form';
import {
  Card,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import type { Supplier } from '@/lib/types/prisma-extended';
import { usePageHeader } from '../../contexts/page-header-context';
import { toast } from 'sonner';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { ROUTES, generatePath } from '../../lib/router';
import type { BreadcrumbItem } from '../../lib/breadcrumb-system';
import { Skeleton } from '../../components/ui/skeleton';

export function SupplierFormPage() {
  const { systemId: systemIdParam } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { create, update: updateSupplier } = useSupplierMutations({
    onCreateSuccess: (data) => {
      toast.success(`Đã thêm nhà cung cấp "${(data as { name?: string })?.name || 'mới'}"`);
      router.push(ROUTES.PROCUREMENT.SUPPLIERS);
    },
    onUpdateSuccess: (data) => {
      toast.success(`Đã cập nhật nhà cung cấp "${(data as { name?: string })?.name || ''}"`);
      router.push(ROUTES.PROCUREMENT.SUPPLIERS);
    },
    onError: (err) => {
      console.error('Supplier mutation error:', err);
      toast.error(err.message || 'Có lỗi xảy ra khi lưu nhà cung cấp');
    }
  });
  
  // Fetch supplier data directly when editing
  const supplierSystemId = React.useMemo(() => (systemIdParam ? asSystemId(systemIdParam) : null), [systemIdParam]);
  const { data: supplier, isLoading: isLoadingSupplier } = useSupplier(supplierSystemId);
  
  const handleSubmit = (values: SupplierFormValues) => {
    const normalizedId = values.id ? asBusinessId(values.id) : supplier?.id ?? asBusinessId('');
    const payload = {
      ...values,
      id: normalizedId,
      taxCode: values.taxCode ?? '',
      email: values.email ?? '',
      address: values.address ?? '',
      website: values.website ?? '',
      accountManager: values.accountManager ?? '',
      phone: values.phone ?? '',
      bankAccount: values.bankAccount ?? '',
      bankName: values.bankName ?? '',
      contactPerson: values.contactPerson ?? '',
      notes: values.notes ?? '',
    } satisfies Partial<Supplier>;


    if (supplier) {
      updateSupplier.mutate({ systemId: supplier.systemId, ...payload });
    } else {
      create.mutate(payload as Omit<Supplier, 'systemId'>);
    }
  };

  const handleCancel = React.useCallback(() => {
    router.push(ROUTES.PROCUREMENT.SUPPLIERS);
  }, [router]);

  const isEditing = Boolean(supplier);

  const breadcrumb = React.useMemo<BreadcrumbItem[]>(() => {
    const currentPath = isEditing && supplierSystemId
      ? generatePath(ROUTES.PROCUREMENT.SUPPLIER_EDIT, { systemId: supplierSystemId })
      : ROUTES.PROCUREMENT.SUPPLIER_NEW;
    return [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Nhà cung cấp', href: ROUTES.PROCUREMENT.SUPPLIERS },
      { label: isEditing ? 'Chỉnh sửa' : 'Thêm mới', href: currentPath, isCurrent: true },
    ];
  }, [isEditing, supplierSystemId]);

  const handleSaveClick = React.useCallback(() => {
    const form = document.getElementById('supplier-form') as HTMLFormElement | null;
    if (form) {
      form.requestSubmit();
    } else {
      console.error('Form not found by ID');
      toast.error('Không tìm thấy form');
    }
  }, []);

  usePageHeader({
    title: isEditing ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp',
    subtitle: isEditing ? `Cập nhật thông tin cho ${supplier?.name}` : 'Tạo mới nhà cung cấp và thiết lập công nợ đầu kỳ.',
    backPath: ROUTES.PROCUREMENT.SUPPLIERS,
    breadcrumb,
    actions: [
      <Button key="cancel" variant="outline" className="h-9 gap-2" onClick={handleCancel}>
        Hủy
      </Button>,
      <Button key="save" type="button" className="h-9 gap-2" onClick={handleSaveClick} disabled={isLoadingSupplier}>
        Lưu
      </Button>
    ]
  });

  // Show loading state when fetching supplier for edit
  if (supplierSystemId && isLoadingSupplier) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <SupplierForm initialData={supplier ?? null} onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
}
