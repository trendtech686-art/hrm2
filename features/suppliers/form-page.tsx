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

export function SupplierFormPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById, add, update } = useSupplierStore();
  const { toast } = useToast();

  const isEditing = !!systemId;
  const supplier = React.useMemo(() => (systemId ? findById(systemId) : null), [systemId, findById]);
  
  const handleSubmit = (values: SupplierFormValues) => {
    if (supplier) {
      update(supplier.systemId, { ...supplier, ...values });
      toast({
        title: 'Thành công',
        description: `Đã cập nhật nhà cung cấp "${values.name}"`,
      });
    } else {
      add(values);
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
