import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReceiptStore } from './store.ts';
import { ReceiptForm, type ReceiptFormValues } from './receipt-form.tsx';
import { useCashbookStore } from '../cashbook/store';
import { useEmployeeStore } from '../employees/store';
import type { Receipt } from './types.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useRouteMeta } from '../../hooks/use-route-meta.ts';
import { ROUTES } from '../../lib/router.ts';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth-context.tsx';

import { Card, CardContent } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft } from 'lucide-react';

export function ReceiptFormPage() {
  const { systemId, id } = useParams<{ systemId?: string; id?: string }>();
  const navigate = useNavigate();
  const routeMeta = useRouteMeta();
  const { findById, add, update } = useReceiptStore();
  const { accounts } = useCashbookStore();
  const { data: employees } = useEmployeeStore();
  const { employee: currentEmployee } = useAuth();
  
  const receiptId = systemId || id;
  const isEditing = !!receiptId;
  const receipt = React.useMemo(() => (receiptId ? findById(receiptId) : null), [receiptId, findById]);
  
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

  const handleFormSubmit = (values: ReceiptFormValues) => {
    try {
      if (receipt) {
        update(receipt.systemId, { ...receipt, ...values });
        toast.success("Cập nhật phiếu thu thành công");
        navigate(`${ROUTES.FINANCE.RECEIPTS}/${receipt.systemId}`);
      } else {
        const newReceipt = add({
          ...values,
          createdBy: currentEmployee?.fullName || employees[0]?.fullName || 'System',
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
