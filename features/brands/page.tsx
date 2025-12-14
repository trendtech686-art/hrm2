import * as React from "react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { useBrandStore } from "../settings/inventory/brand-store.ts";
import { BrandManager, type BrandFormValues } from "../settings/inventory/brand-manager.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { toast } from "sonner";

export function BrandsPage() {
  const { data, add, update, remove } = useBrandStore();

  const activeBrands = React.useMemo(() => data.filter(b => !b.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeBrands.map(b => b.id), [activeBrands]);

  const handleAdd = React.useCallback((formData: BrandFormValues) => {
    try {
      add({
        ...formData,
        id: asBusinessId(formData.id),
      });
      toast.success('Đã thêm thương hiệu mới');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  }, [add]);

  const handleUpdate = React.useCallback((systemId: SystemId, formData: Partial<BrandFormValues>) => {
    try {
      const payload = { ...formData };
      if (formData.id) {
        (payload as any).id = asBusinessId(formData.id);
      }
      update(systemId, payload as any);
      toast.success('Đã cập nhật thương hiệu');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  }, [update]);

  const handleDelete = React.useCallback((systemId: SystemId) => {
    remove(systemId);
    toast.success('Đã xóa thương hiệu');
  }, [remove]);

  const handleToggleActive = React.useCallback((systemId: SystemId, isActive: boolean) => {
    update(systemId, { isActive });
    toast.success(isActive ? 'Đã kích hoạt' : 'Đã tắt');
  }, [update]);

  usePageHeader({
    title: 'Thương hiệu',
    subtitle: `${activeBrands.length} thương hiệu`,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Thương hiệu', href: '/brands', isCurrent: true },
    ],
  });

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thương hiệu</CardTitle>
          <CardDescription>
            Chọn thương hiệu bên trái để xem và chỉnh sửa thông tin. Hỗ trợ SEO riêng cho từng website.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <BrandManager
            brands={activeBrands}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            existingIds={existingIds}
          />
        </CardContent>
      </Card>
    </div>
  );
}
