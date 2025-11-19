import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePaymentStore } from './store.ts';
import { PaymentForm, type PaymentFormValues } from './payment-form.tsx';
import type { Payment } from './types.ts';
import { useCashbookStore } from '../cashbook/store';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useRouteMeta } from '../../hooks/use-route-meta.ts';
import { ROUTES } from '../../lib/router.ts';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth-context.tsx';
import { asBusinessId, asSystemId } from '../../lib/id-types.ts';

import { Card, CardContent } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft } from 'lucide-react';

export function PaymentFormPage() {
  const { systemId, id } = useParams<{ systemId?: string; id?: string }>();
  const navigate = useNavigate();
  const routeMeta = useRouteMeta();
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
    <Button key="cancel" type="button" variant="outline" className="h-9" onClick={() => navigate(ROUTES.FINANCE.PAYMENTS)}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Hủy
    </Button>,
    <Button key="save" type="submit" form="payment-form" className="h-9">
      Lưu
    </Button>
  ], [navigate]);
  
  usePageHeader({
    title: isEditing ? `Chỉnh sửa Phiếu Chi ${payment?.id || ''}` : 'Thêm mới Phiếu Chi',
    actions: headerActions,
    breadcrumb: routeMeta?.breadcrumb as any
  });

  const handleFormSubmit = (values: PaymentFormValues) => {
    try {
      if (payment) {
        update(payment.systemId, { ...payment, ...values });
        toast.success("Cập nhật phiếu chi thành công");
        navigate(`${ROUTES.FINANCE.PAYMENTS}/${payment.systemId}`);
      } else {
        const newPayment = add({
          ...values,
          createdBy: currentEmployee?.systemId ?? asSystemId('SYSTEM'),
          createdAt: new Date().toISOString(),
        } as any);
        toast.success("Tạo phiếu chi thành công");
        if (newPayment) {
          navigate(`${ROUTES.FINANCE.PAYMENTS}/${newPayment.systemId}`);
        } else {
          navigate(ROUTES.FINANCE.PAYMENTS);
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
        <PaymentForm initialData={payment} onSubmit={handleFormSubmit} isEditing={isEditing} />
      </CardContent>
    </Card>
  );
}
