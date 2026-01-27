'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCustomer, useCustomerMutations } from './hooks/use-customers';
import { CustomerForm, type CustomerFormSubmitPayload } from './customer-form';
import { usePageHeader } from '../../contexts/page-header-context';
import {
  Card,
  CardContent,
  CardDescription as _CardDescription,
  CardHeader as _CardHeader,
  CardTitle as _CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import type { Customer } from '@/lib/types/prisma-extended';

export function CustomerFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  
  // React Query hooks
  const { data: customer, isLoading } = useCustomer(systemId);
  const { create, update } = useCustomerMutations({
    onCreateSuccess: () => router.push('/customers'),
    onUpdateSuccess: () => router.push('/customers'),
  });

  const isEditMode = !!customer;

  const handleSubmit = async (values: CustomerFormSubmitPayload) => {
    if (customer) {
      await update.mutateAsync({
        systemId: customer.systemId,
        ...values,
        email: values.email ?? customer.email,
        phone: customer.phone ?? "",
      });
    } else {
      const createdAt = new Date().toISOString().split('T')[0];
      await create.mutateAsync({
        ...values,
        id: values.id,
        status: 'Đang giao dịch',
        createdAt,
        totalOrders: 0,
        totalSpent: 0,
        totalQuantityPurchased: 0,
        totalQuantityReturned: 0,
      } as Omit<Customer, 'systemId'>);
    }
  };

  const handleSuccess = () => {
    router.push('/customers');
  };

  const handleCancel = React.useCallback(() => {
    router.push('/customers');
  }, [router]);

  const headerActions = React.useMemo(() => [
    <Button key="cancel" type="button" variant="outline" className="h-9" onClick={handleCancel}>Hủy</Button>,
    <Button key="save" type="submit" form="customer-form" className="h-9">Lưu</Button>
  ], [handleCancel]);

  usePageHeader({
    title: isEditMode ? `Chỉnh sửa ${customer?.name}` : 'Thêm khách hàng mới',
    breadcrumb: isEditMode
      ? [
          { label: 'Trang chủ', href: '/', isCurrent: false },
          { label: 'Khách hàng', href: '/customers', isCurrent: false },
          { label: customer?.name || 'Khách hàng', href: customer ? `/customers/${customer.systemId}` : '/customers', isCurrent: false },
          { label: 'Chỉnh sửa', href: '', isCurrent: true },
        ]
      : [
          { label: 'Trang chủ', href: '/', isCurrent: false },
          { label: 'Khách hàng', href: '/customers', isCurrent: false },
          { label: 'Thêm mới', href: '', isCurrent: true },
        ],
    actions: headerActions,
  });

  // Loading state
  if (systemId && isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <CustomerForm 
            initialData={customer ?? null} 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
            isEditMode={isEditMode}
        />
      </CardContent>
    </Card>
  );
}
