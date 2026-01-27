'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { ReceiptInput } from './store';
import { useAllReceipts, useReceiptFinder } from './hooks/use-all-receipts';
import { useReceiptMutations } from './hooks/use-receipts';
import { ReceiptForm, type ReceiptFormValues } from './receipt-form';
import { useAllCashAccounts } from '../cashbook/hooks/use-all-cash-accounts';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES, generatePath } from '@/lib/router';
import { asBusinessId, asSystemId, type SystemId } from '@/lib/id-types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type ReceiptUpsertPayload = Omit<ReceiptInput, 'createdAt'>;

export function ReceiptFormPage() {
  const { systemId, id } = useParams<{ systemId?: string; id?: string }>();
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
      console.error("Error saving receipt:", error);
    }
  });
  const { data } = useAllReceipts();
  const { findById } = useReceiptFinder();
  const { accounts: _accounts } = useAllCashAccounts();
  const { employee: currentEmployee } = useAuth();

  const resolvedSystemId = React.useMemo(() => {
    if (systemId) {
      return asSystemId(systemId);
    }
    if (id) {
      const businessId = asBusinessId(id);
      const target = data.find((item) => item.id === businessId);
      return target?.systemId;
    }
    return undefined;
  }, [systemId, id, data]);

  const isEditing = Boolean(resolvedSystemId);
  const receipt = React.useMemo(
    () => (resolvedSystemId ? findById(resolvedSystemId) : null),
    [resolvedSystemId, findById]
  );

  const currentUserSystemId = React.useMemo(
    () => currentEmployee?.systemId ?? asSystemId('SYSTEM'),
    [currentEmployee]
  );
  
  // ✅ Header Actions
  const headerActions = React.useMemo(() => [
    <Button
      key="cancel"
      type="button"
      variant="outline"
      size="sm"
      className="h-9"
      onClick={() => router.push(ROUTES.FINANCE.RECEIPTS)}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Hủy
    </Button>,
    <Button
      key="save"
      type="submit"
      form="receipt-form"
      size="sm"
      className="h-9"
    >
      Lưu
    </Button>
  ], [router]);

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
    };

    if (id) {
      base.id = asBusinessId(id);
    }

    return base;
  };

  const handleFormSubmit = (values: ReceiptFormValues) => {
    if (receipt) {
      update.mutate({
        systemId: receipt.systemId,
        data: { ...receipt, ...normalizeValues(values, receipt.createdBy) }
      });
    } else {
      const normalized = normalizeValues(values, currentUserSystemId);
      create.mutate({
        ...normalized,
        createdAt: new Date().toISOString(),
      } as ReceiptInput);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <ReceiptForm initialData={receipt ?? null} onSubmit={handleFormSubmit} isEditing={isEditing} />
      </CardContent>
    </Card>
  );
}
