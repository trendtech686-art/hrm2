'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCustomer, useCustomerMutations } from './hooks/use-customers';
import { useCustomerStats } from './hooks/use-customer-stats';
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
import { mobileBleedCardClass, FormPageFooter } from '@/components/layout/page-section';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Customer } from '@/lib/types/prisma-extended';
import { logError } from '@/lib/logger'

export function CustomerFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  
  // React Query hooks
  const { data: customer, isLoading } = useCustomer(systemId);
  const { data: customerStats } = useCustomerStats(systemId);
  const { create, update, isCreating, isUpdating } = useCustomerMutations();

  const isEditMode = !!customer;
  const [isSaving, setIsSaving] = React.useState(false);
  const isBusy = isSaving || isCreating || isUpdating;

  const handleSubmit = async (values: CustomerFormSubmitPayload) => {
    setIsSaving(true);
    try {
      if (customer) {
        await update.mutateAsync({
          systemId: customer.systemId,
          ...values,
          phone: values.phone ?? customer.phone ?? "",
        });
      } else {
        const createdAt = new Date().toISOString().split('T')[0];
        await create.mutateAsync({
          ...values,
          id: values.id,
          status: 'ACTIVE' as Customer['status'],
          createdAt,
          totalOrders: 0,
          totalSpent: 0,
          totalQuantityPurchased: 0,
          totalQuantityReturned: 0,
        } as Omit<Customer, 'systemId'>);
      }
    } catch (error) {
      logError('[CustomerFormPage] Error in handleSubmit', error);
      throw error; // Re-throw to let customer-form.tsx handle it
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccess = () => {
    if (customer) {
      router.push(`/customers/${customer.systemId}`);
    } else {
      router.push('/customers');
    }
  };

  const handleCancel = React.useCallback(() => {
    router.push('/customers');
  }, [router]);

  const handleSaveClick = React.useCallback(() => {
    const form = document.getElementById('customer-form') as HTMLFormElement | null;
    if (form) {
      form.requestSubmit();
    }
  }, []);

  const headerActions = React.useMemo(() => [
    <Button key="cancel" type="button" variant="outline" size="sm" className="hidden md:inline-flex" onClick={handleCancel} disabled={isBusy}>Hủy</Button>,
    <Button key="save" type="button" size="sm" className="hidden md:inline-flex" onClick={handleSaveClick} disabled={isBusy}>
      {isBusy ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang lưu...
        </>
      ) : 'Lưu'}
    </Button>
  ], [handleCancel, handleSaveClick, isBusy]);

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
      <Card className={mobileBleedCardClass}>
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
    <>
      <Card className={cn(mobileBleedCardClass, 'pb-[calc(env(safe-area-inset-bottom)+72px)] md:pb-0')}>
        <CardContent className="pt-6">
          <CustomerForm 
              initialData={customer ? {
                ...customer,
                currentDebt: customerStats?.financial?.currentDebt ?? customer.currentDebt,
              } : null} 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onSuccess={handleSuccess}
              isEditMode={isEditMode}
          />
        </CardContent>
      </Card>
      {/* Mobile-only sticky action bar */}
      <FormPageFooter className="md:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={isBusy}
          className="h-10 flex-1"
        >
          Hủy
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSaveClick}
          disabled={isBusy}
          className="h-10 flex-1"
        >
          {isBusy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : 'Lưu'}
        </Button>
      </FormPageFooter>
    </>
  );
}
