'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { ReceiptInput } from './types';
import { useReceipt, useReceiptMutations } from './hooks/use-receipts';
import { ReceiptForm, type ReceiptFormValues } from './receipt-form';
import type { ReceiptFormOptions } from '@/lib/data/payment-form-options';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES, generatePath } from '@/lib/router';
import { asBusinessId, asSystemId, type SystemId } from '@/lib/id-types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

import { Card, CardContent } from '@/components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { logError } from '@/lib/logger'

type ReceiptUpsertPayload = Omit<ReceiptInput, 'createdAt'>;

interface ReceiptFormPageProps {
  systemId?: string;
  initialOptions?: ReceiptFormOptions;
}

export function ReceiptFormPage({ systemId, initialOptions }: ReceiptFormPageProps = {}) {
  const router = useRouter();
  const { create, update } = useReceiptMutations({
    onCreateSuccess: (newReceipt) => {
      toast.success("Tạo phiếu thu thành công");
      router.push(`${ROUTES.FINANCE.RECEIPTS}/${newReceipt.systemId}`);
    },
    onUpdateSuccess: (updatedReceipt) => {
      toast.success("Cập nhật phiếu thu thành công");
      router.push(`${ROUTES.FINANCE.RECEIPTS}/${updatedReceipt.systemId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Lưu phiếu thu thất bại");
      logError('Error saving receipt', error);
    }
  });
  // ✅ Phase 14: useReceipt(systemId) single-item API thay vì useAllReceipts + useReceiptFinder
  const { data: receipt } = useReceipt(systemId);
  const { employee: currentEmployee } = useAuth();
  const isEditing = Boolean(systemId);

  const currentUserSystemId = React.useMemo(
    () => currentEmployee?.systemId ?? asSystemId('SYSTEM'),
    [currentEmployee]
  );
  
  // ✅ Form ref for programmatic submission
  const formRef = React.useRef<HTMLFormElement>(null);
  
  const handleSaveClick = React.useCallback(() => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    } else {
      console.error('❌ Receipt Form ref not found!');
    }
  }, []);
  
  const isSaving = create.isPending || update.isPending;
  
  // ✅ Header Actions
  const headerActions = React.useMemo(() => [
    <Button
      key="cancel"
      type="button"
      variant="outline"
      size="sm"
      onClick={() => router.push(ROUTES.FINANCE.RECEIPTS)}
    >
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

  const headerTitle = isEditing
    ? `Chỉnh sửa phiếu thu ${receipt?.id ?? ''}`.trim()
    : 'Thêm phiếu thu mới';

  const fallbackBreadcrumb = React.useMemo(() => (
    receipt ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu thu', href: ROUTES.FINANCE.RECEIPTS, isCurrent: false },
      { label: 'Chỉnh sửa', href: generatePath(ROUTES.FINANCE.RECEIPT_EDIT, { systemId: receipt.systemId }), isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu thu', href: ROUTES.FINANCE.RECEIPTS, isCurrent: false },
      { label: 'Thêm mới', href: ROUTES.FINANCE.RECEIPT_NEW, isCurrent: true }
    ]
  ), [receipt]);
  
  usePageHeader({
    title: headerTitle,
    actions: headerActions,
    breadcrumb: fallbackBreadcrumb,
    showBackButton: true,
    backPath: ROUTES.FINANCE.RECEIPTS
  });

  const normalizeValues = (values: ReceiptFormValues, createdBy: SystemId): ReceiptUpsertPayload => {
    const {
      id,
      payerTypeSystemId,
      payerSystemId,
      paymentMethodSystemId,
      accountSystemId,
      paymentReceiptTypeSystemId,
      branchSystemId,
      orderAllocations,
      ...rest
    } = values;

    const base: ReceiptUpsertPayload = {
      ...rest,
      payerTypeSystemId: asSystemId(payerTypeSystemId),
      payerSystemId: payerSystemId ? asSystemId(payerSystemId) : undefined,
      paymentMethodSystemId: asSystemId(paymentMethodSystemId),
      accountSystemId: asSystemId(accountSystemId),
      paymentReceiptTypeSystemId: asSystemId(paymentReceiptTypeSystemId),
      branchSystemId: asSystemId(branchSystemId),
      createdBy,
      orderAllocations: orderAllocations?.map(a => ({
        orderSystemId: asSystemId(a.orderSystemId),
        orderId: asBusinessId(a.orderId),
        amount: a.amount,
      })),
    };

    if (id) {
      base.id = asBusinessId(id);
    }

    return base;
  };

  // Map targetGroup (payerType) to category enum for Zod validation
  // ServerReceiptCategory: 'SALES_REVENUE' | 'service_revenue' | 'complaint_penalty' | 'warranty_additional' | 'deposit_received' | 'other'
  const getCategoryFromPayerType = (payerTypeName?: string) => {
    const name = payerTypeName?.toLowerCase() || '';
    if (name.includes('khách hàng') || name.includes('customer')) return 'sale' as const;
    if (name.includes('dịch vụ') || name.includes('service')) return 'sale' as const;
    if (name.includes('bảo hành') || name.includes('warranty')) return 'warranty_additional' as const;
    if (name.includes('cọc') || name.includes('deposit')) return 'customer_payment' as const;
    if (name.includes('phạt') || name.includes('penalty')) return 'complaint_penalty' as const;
    return 'other' as const;
  };

  const handleFormSubmit = (values: ReceiptFormValues) => {
    // Determine category from payer type name
    const category = getCategoryFromPayerType(values.payerTypeName);
    
    if (receipt) {
      update.mutate({
        systemId: receipt.systemId,
        data: { ...receipt, ...normalizeValues(values, receipt.createdBy), category }
      });
    } else {
      const normalized = normalizeValues(values, currentUserSystemId);
      create.mutate({
        ...normalized,
        category,
        createdAt: new Date().toISOString(),
      } as ReceiptInput);
    }
  };

  return (
    <Card className={mobileBleedCardClass}>
      <CardContent className="pt-6">
        <ReceiptForm 
          ref={formRef}
          initialData={receipt ?? null} 
          onSubmit={handleFormSubmit} 
          isEditing={isEditing} 
          initialOptions={initialOptions} 
        />
      </CardContent>
    </Card>
  );
}
