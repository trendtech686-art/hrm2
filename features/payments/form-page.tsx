'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { usePaymentMutations, usePayment } from './hooks/use-payments';
import type { Payment } from './types';
import { PaymentForm, type PaymentFormValues } from './payment-form';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth-context';
import { asSystemId } from '../../lib/id-types';

import { Card, CardContent } from '../../components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { logError } from '@/lib/logger'
import type { PaymentFormOptions } from '@/lib/data/payment-form-options';

interface PaymentFormPageProps {
  systemId?: string;
  initialOptions?: PaymentFormOptions;
}

export function PaymentFormPage({ systemId, initialOptions }: PaymentFormPageProps = {}) {
  const router = useRouter();
  const { create, update } = usePaymentMutations({
    onCreateSuccess: (newPayment) => {
      toast.success("Tạo phiếu chi thành công");
      router.push(`${ROUTES.FINANCE.PAYMENTS}/${newPayment.systemId}`);
    },
    onUpdateSuccess: (updatedPayment) => {
      toast.success("Cập nhật phiếu chi thành công");
      router.push(`${ROUTES.FINANCE.PAYMENTS}/${updatedPayment.systemId}`);
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
  // ✅ Phase 13: Use single-item hook instead of loading ALL payments
  const { data: payment } = usePayment(systemId);
  const { employee: currentEmployee } = useAuth();

  const isEditing = Boolean(systemId);
  
  // ✅ Form ref for programmatic submission
  const formRef = React.useRef<HTMLFormElement>(null);
  
  const handleSaveClick = React.useCallback(() => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    } else {
      console.error('❌ Form ref not found!');
    }
  }, []);
  
  const isSaving = create.isPending || update.isPending;
  
  // ✅ Header Actions
  const headerActions = React.useMemo(() => [
    <Button key="cancel" type="button" variant="outline" size="sm" onClick={() => router.push(ROUTES.FINANCE.PAYMENTS)}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Hủy
    </Button>,
    <Button 
      key="save" 
      type="button"
      size="sm" 
      disabled={isSaving}
      onClick={handleSaveClick}
    >
      {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</> : 'Lưu'}
    </Button>
  ], [router, handleSaveClick, isSaving]);
  
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

  // Map targetGroup ID to category enum for Zod validation
  const getCategoryFromTargetGroup = (recipientTypeName?: string) => {
    const name = recipientTypeName?.toLowerCase() || '';
    if (name.includes('khách hàng') || name.includes('customer') || name.includes('hoàn tiền')) return 'customer_payment' as const;
    if (name.includes('nhà cung cấp') || name.includes('supplier')) return 'supplier_payment' as const;
    if (name.includes('nhân viên') || name.includes('employee') || name.includes('lương')) return 'salary' as const;
    if (name.includes('vận chuyển') || name.includes('shipping') || name.includes('chi phí')) return 'expense' as const;
    return 'other' as const;
  };

  const handleFormSubmit = (values: PaymentFormValues) => {
    try {
      // Determine category from target group name
      const category = getCategoryFromTargetGroup(values.recipientTypeName);
      
      if (payment) {
        update.mutate({ systemId: payment.systemId, data: { ...payment, ...values, category } });
      } else {
        create.mutate({
          ...values,
          category,
          branchId: values.branchSystemId, // Alternative field name
          createdBy: currentEmployee?.systemId ?? asSystemId('SYSTEM'),
          createdAt: new Date().toISOString(),
        } as Omit<Payment, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>);
      }
    } catch (error) {
      toast.error(isEditing ? "Cập nhật phiếu chi thất bại" : "Tạo phiếu chi thất bại");
      logError('Error saving payment', error);
    }
  };

  return (
    <Card className={mobileBleedCardClass}>
      <CardContent className="pt-6">
        <PaymentForm 
          ref={formRef}
          initialData={payment ?? null} 
          onSubmit={handleFormSubmit} 
          isEditing={isEditing} 
          initialOptions={initialOptions} 
        />
      </CardContent>
    </Card>
  );
}
