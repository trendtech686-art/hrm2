'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePaymentStore } from './store';
import { PaymentForm, type PaymentFormValues } from './payment-form';
import type { Payment } from '@/lib/types/prisma-extended';
import { useCashbookStore } from '../cashbook/store';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth-context';
import { asBusinessId, asSystemId } from '../../lib/id-types';

import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function PaymentFormPage() {
  const { systemId, id } = useParams<{ systemId?: string; id?: string }>();
  const router = useRouter();
  const paymentStore = usePaymentStore();
  const { findById, add, update } = paymentStore;
  const payments: Payment[] = paymentStore.data ?? [];
  const { accounts } = useCashbookStore();
  const { employee: currentEmployee } = useAuth();

  const paymentSystemId = systemId ? asSystemId(systemId) : undefined;
  const paymentBusinessId = id ? asBusinessId(id) : undefined;
  const payment = React.useMemo(() => {
    if (paymentSystemId) {
      return findById(paymentSystemId);
    }
    if (paymentBusinessId) {
      return payments.find(p => p.id === paymentBusinessId) ?? null;
    }
    return null;
  }, [findById, paymentBusinessId, paymentSystemId, payments]);
  const isEditing = Boolean(paymentSystemId || paymentBusinessId);
  
  // ✅ Header Actions
  const headerActions = React.useMemo(() => [
    <Button key="cancel" type="button" variant="outline" size="sm" className="h-9" onClick={() => router.push(ROUTES.FINANCE.PAYMENTS)}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Hủy
    </Button>,
    <Button key="save" type="submit" form="payment-form" size="sm" className="h-9">
      Lưu
    </Button>
  ], [router]);
  
  const fallbackBreadcrumb = React.useMemo(() => ([
    { label: 'Trang chủ', href: '/', isCurrent: false },
    { label: 'Phiếu chi', href: ROUTES.FINANCE.PAYMENTS, isCurrent: false },
    { label: isEditing ? 'Chỉnh sửa' : 'Thêm mới', href: ROUTES.FINANCE.PAYMENTS, isCurrent: true }
  ]), [isEditing]);

  usePageHeader({
    title: isEditing ? `Chỉnh sửa Phiếu Chi ${payment?.id || ''}` : 'Thêm mới Phiếu Chi',
    subtitle: isEditing ? 'Cập nhật thông tin chi phí, tài khoản nguồn và đối tượng nhận tiền' : 'Tạo phiếu chi mới và ghi nhận dòng tiền ra',
    actions: headerActions,
    breadcrumb: fallbackBreadcrumb,
    showBackButton: true,
    backPath: ROUTES.FINANCE.PAYMENTS
  });

  const handleFormSubmit = (values: PaymentFormValues) => {
    try {
      if (payment) {
        update(payment.systemId, { ...payment, ...values });
        toast.success("Cập nhật phiếu chi thành công");
        router.push(`${ROUTES.FINANCE.PAYMENTS}/${payment.systemId}`);
      } else {
        const newPayment = add({
          ...values,
          createdBy: currentEmployee?.systemId ?? asSystemId('SYSTEM'),
          createdAt: new Date().toISOString(),
        } as any);
        toast.success("Tạo phiếu chi thành công");
        if (newPayment) {
          router.push(`${ROUTES.FINANCE.PAYMENTS}/${newPayment.systemId}`);
        } else {
          router.push(ROUTES.FINANCE.PAYMENTS);
        }
      }
    } catch (error) {
      toast.error(isEditing ? "Cập nhật phiếu chi thất bại" : "Tạo phiếu chi thất bại");
      console.error("Error saving payment:", error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <PaymentForm initialData={payment ?? null} onSubmit={handleFormSubmit} isEditing={isEditing} />
      </CardContent>
    </Card>
  );
}
