import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useSupplierStore } from './store.ts';
import { SupplierForm, type SupplierFormValues } from './supplier-form.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import type { Supplier } from './types.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useToast } from '../../hooks/use-toast.ts';
import { asBusinessId, asSystemId } from '@/lib/id-types';

export function SupplierFormPage() {
  const { systemId: systemIdParam } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById, add, update } = useSupplierStore();
  const { toast } = useToast();

  const supplierSystemId = React.useMemo(() => (systemIdParam ? asSystemId(systemIdParam) : null), [systemIdParam]);
  const supplier = React.useMemo(() => (supplierSystemId ? findById(supplierSystemId) : null), [supplierSystemId, findById]);
  
  const handleSubmit = (values: SupplierFormValues) => {
    const payload = {
      ...values,
      id: asBusinessId(values.id),
    } as SupplierFormValues;

    if (supplier) {
      update(supplier.systemId, { ...supplier, ...payload });
      toast({
        title: 'Thành công',
        description: `Đã cập nhật nhà cung cấp "${values.name}"`,
      });
    } else {
      add(payload);
      toast({
        title: 'Thành công',
        description: `Đã thêm nhà cung cấp "${values.name}"`,
      });
    }
    navigate('/suppliers');
  };

  const handleCancel = () => {
    navigate('/suppliers');
  };

  usePageHeader({
    actions: [
      <Button key="cancel" variant="outline" onClick={handleCancel}>
        Hủy
      </Button>,
      <Button key="save" type="submit" form="supplier-form">
        Lưu
      </Button>
    ]
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <SupplierForm initialData={supplier} onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
}
