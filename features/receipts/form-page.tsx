import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReceiptStore, type ReceiptInput } from './store';
import { ReceiptForm, type ReceiptFormValues } from './receipt-form';
import { useCashbookStore } from '../cashbook/store';
import { usePageHeader } from '@/contexts/page-header-context';
import { useRouteMeta } from '@/hooks/use-route-meta';
import { ROUTES } from '@/lib/router';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function ReceiptFormPage() {
  const { systemId, id } = useParams<{ systemId?: string; id?: string }>();
  const navigate = useNavigate();
  const routeMeta = useRouteMeta();
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
    <Button key="cancel" type="button" variant="outline" className="h-9" onClick={() => navigate(ROUTES.FINANCE.RECEIPTS)}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Hủy
    </Button>,
    <Button key="save" type="submit" form="receipt-form" className="h-9">
      Lưu
    </Button>
  ], [navigate]);
  
  usePageHeader({
    title: isEditing ? `Chỉnh sửa Phiếu Thu ${receipt?.id || ''}` : 'Thêm mới Phiếu Thu',
    actions: headerActions,
    breadcrumb: routeMeta?.breadcrumb as any
  });

  const normalizeValues = (values: ReceiptFormValues, createdBy: string): ReceiptInput => ({
    ...values,
    id: values.id ? asBusinessId(values.id) : undefined,
    payerTypeSystemId: asSystemId(values.payerTypeSystemId),
    payerSystemId: values.payerSystemId ? asSystemId(values.payerSystemId) : undefined,
    paymentMethodSystemId: asSystemId(values.paymentMethodSystemId),
    accountSystemId: asSystemId(values.accountSystemId),
    paymentReceiptTypeSystemId: asSystemId(values.paymentReceiptTypeSystemId),
    branchSystemId: asSystemId(values.branchSystemId),
    createdBy: asSystemId(createdBy),
  } as ReceiptInput);

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
        <ReceiptForm initialData={receipt} onSubmit={handleFormSubmit} isEditing={isEditing} />
      </CardContent>
    </Card>
  );
}
