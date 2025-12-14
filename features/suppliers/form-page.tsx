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
import { toast } from 'sonner';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { ROUTES, generatePath } from '../../lib/router.ts';
import type { BreadcrumbItem } from '../../lib/breadcrumb-system.ts';

export function SupplierFormPage() {
  const { systemId: systemIdParam } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById, add, update } = useSupplierStore();

  const supplierSystemId = React.useMemo(() => (systemIdParam ? asSystemId(systemIdParam) : null), [systemIdParam]);
  const supplier = React.useMemo(() => (supplierSystemId ? (findById(supplierSystemId) ?? null) : null), [supplierSystemId, findById]);
  
  const handleSubmit = (values: SupplierFormValues) => {
    const normalizedId = values.id ? asBusinessId(values.id) : supplier?.id ?? asBusinessId('');
    const payload = {
      ...values,
      id: normalizedId,
      taxCode: values.taxCode ?? '',
      email: values.email ?? '',
      address: values.address ?? '',
      website: values.website ?? '',
      accountManager: values.accountManager ?? '',
      phone: values.phone ?? '',
      bankAccount: values.bankAccount ?? '',
      bankName: values.bankName ?? '',
      contactPerson: values.contactPerson ?? '',
      notes: values.notes ?? '',
    } satisfies Partial<Supplier>;

    if (supplier) {
      update(supplier.systemId, payload);
      toast.success(`Đã cập nhật nhà cung cấp "${values.name}"`);
    } else {
      add(payload as Omit<Supplier, 'systemId'>);
      toast.success(`Đã thêm nhà cung cấp "${values.name}"`);
    }
    navigate(ROUTES.PROCUREMENT.SUPPLIERS);
  };

  const handleCancel = () => {
    navigate(ROUTES.PROCUREMENT.SUPPLIERS);
  };

  const isEditing = Boolean(supplier);

  const breadcrumb = React.useMemo<BreadcrumbItem[]>(() => {
    const currentPath = isEditing && supplierSystemId
      ? generatePath(ROUTES.PROCUREMENT.SUPPLIER_EDIT, { systemId: supplierSystemId })
      : ROUTES.PROCUREMENT.SUPPLIER_NEW;
    return [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Nhà cung cấp', href: ROUTES.PROCUREMENT.SUPPLIERS },
      { label: isEditing ? 'Chỉnh sửa' : 'Thêm mới', href: currentPath, isCurrent: true },
    ];
  }, [isEditing, supplierSystemId]);

  usePageHeader({
    title: isEditing ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp',
    subtitle: isEditing ? `Cập nhật thông tin cho ${supplier?.name}` : 'Tạo mới nhà cung cấp và thiết lập công nợ đầu kỳ.',
    backPath: ROUTES.PROCUREMENT.SUPPLIERS,
    breadcrumb,
    actions: [
      <Button key="cancel" variant="outline" className="h-9 gap-2" onClick={handleCancel}>
        Hủy
      </Button>,
      <Button key="save" type="submit" form="supplier-form" className="h-9 gap-2">
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
