import * as React from 'react';
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, toISODate } from '@/lib/date-utils';
import { useCustomerStore } from './store.ts';
import { asSystemId } from '@/lib/id-types';
import { CustomerForm, type CustomerFormSubmitPayload } from './customer-form.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import type { Customer } from './types.ts';
export function CustomerFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const { findById, add, update } = useCustomerStore();

  const customer = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById]);
  const isEditMode = !!customer;

  const handleSubmit = (values: CustomerFormSubmitPayload) => {
    if (customer) {
      const updated: Customer = {
        ...customer,
        ...values,
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
    navigate('/customers');
  };

  const handleCancel = () => {
    navigate('/customers');
  }

  // Setup page header actions
  usePageHeader({
    actions: [
      <Button key="cancel" type="button" variant="outline" onClick={handleCancel}>Hủy</Button>,
      <Button key="save" type="submit" form="customer-form">Lưu</Button>
    ]
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <CustomerForm 
            initialData={customer} 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditMode={isEditMode}
        />
      </CardContent>
    </Card>
  );
}
