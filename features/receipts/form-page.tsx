'use client'

import * as React from 'react';
import { useParams, useNavigate } from '@/lib/next-compat';
import { useReceiptStore, type ReceiptInput } from './store';
import { ReceiptForm, type ReceiptFormValues } from './receipt-form';
import { useCashbookStore } from '../cashbook/store';
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
  const navigate = useNavigate();
  const { data, findById, add, update } = useReceiptStore();
  const { accounts } = useCashbookStore();
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
      onClick={() => navigate(ROUTES.FINANCE.RECEIPTS)}
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
  ], [navigate]);

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
    try {
      if (receipt) {
        update(receipt.systemId, { ...receipt, ...normalizeValues(values, receipt.createdBy) });
        toast.success("Cập nhật phiếu thu thành công");
        navigate(`${ROUTES.FINANCE.RECEIPTS}/${receipt.systemId}`);
      } else {
        const normalized = normalizeValues(values, currentUserSystemId);
        const newReceipt = add({
          ...normalized,
          createdAt: new Date().toISOString(),
        });
        toast.success("Tạo phiếu thu thành công");
        if (newReceipt) {
          navigate(`${ROUTES.FINANCE.RECEIPTS}/${newReceipt.systemId}`);
        } else {
          navigate(ROUTES.FINANCE.RECEIPTS);
        }
      }
    } catch (error) {
      toast.error(isEditing ? "Cập nhật phiếu thu thất bại" : "Tạo phiếu thu thất bại");
      console.error("Error saving receipt:", error);
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
