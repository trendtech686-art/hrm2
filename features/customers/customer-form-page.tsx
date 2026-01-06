'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatDate as _formatDate, formatDateTime as _formatDateTime, formatDateTimeSeconds as _formatDateTimeSeconds, formatDateCustom as _formatDateCustom, getCurrentDate as _getCurrentDate, toISODate as _toISODate } from '@/lib/date-utils';
import { useCustomerStore } from './store';
import { useCustomerFinder } from './hooks/use-all-customers';
import { asSystemId } from '@/lib/id-types';
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
import type { Customer } from '@/lib/types/prisma-extended';
export function CustomerFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { add, update } = useCustomerStore();
  const { findById } = useCustomerFinder();

  const customer = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById]);
  const isEditMode = !!customer;

  const handleSubmit = (values: CustomerFormSubmitPayload) => {
    if (customer) {
      // @ts-expect-error - CustomerFormSubmitPayload is compatible with Customer
      const updated: Customer = {
        ...customer,
        ...values,
        email: values.email ?? customer.email,
        phone: customer.phone ?? "",
        id: values.id ?? customer.id,
      };
      update(asSystemId(customer.systemId), updated);
    } else {
      const createdAt = new Date().toISOString().split('T')[0];
      add({
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
    // Navigation handled by onSuccess
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
