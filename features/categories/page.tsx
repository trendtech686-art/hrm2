import * as React from "react";
import { FolderTree } from "lucide-react";
import { asBusinessId, asSystemId, type SystemId } from "@/lib/id-types";
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { useProductCategoryStore } from "../settings/inventory/product-category-store.ts";
import { CategoryManager } from "../settings/inventory/category-manager.tsx";
import type { CategoryFormValues } from "../settings/inventory/category-manager.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { toast } from "sonner";

export function ProductCategoriesPage() {
  const productCategories = useProductCategoryStore();

  const activeCategories = React.useMemo(
    () => productCategories.data.filter(c => !c.isDeleted),
    [productCategories.data]
  );

  const existingIds = React.useMemo(
    () => activeCategories.map((c) => c.id),
    [activeCategories]
  );

  const handleAdd = React.useCallback((data: CategoryFormValues) => {
    try {
      const payload = {
        ...data,
        // Auto-generate id from slug or name
        id: asBusinessId(data.slug || data.name.toLowerCase().replace(/\s+/g, '-')),
        parentId: data.parentId ? asSystemId(data.parentId) : undefined,
      };
      productCategories.add(payload);
      toast.success('Đã thêm danh mục mới');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  }, [productCategories]);

  const handleUpdate = React.useCallback((systemId: SystemId, data: Partial<CategoryFormValues>) => {
    try {
      const payload = {
        ...data,
        parentId: data.parentId ? asSystemId(data.parentId) : undefined,
      };
      productCategories.update(systemId, payload);
      toast.success('Đã cập nhật danh mục');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  }, [productCategories]);

  const handleDelete = React.useCallback((systemId: SystemId) => {
    productCategories.remove(systemId);
    toast.success('Đã xóa danh mục');
  }, [productCategories]);

  const handleMove = React.useCallback(
    (systemId: SystemId, newParentId: SystemId | undefined, newSortOrder: number) => {
      productCategories.moveCategory(systemId, newParentId, newSortOrder);
      productCategories.recalculatePaths();
      toast.success('Đã di chuyển danh mục');
    },
    [productCategories]
  );

  usePageHeader({
    title: 'Danh mục sản phẩm',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Danh mục sản phẩm', href: '/categories', isCurrent: true },
    ],
  });

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Cây danh mục</CardTitle>
          <CardDescription>
            Chọn danh mục bên trái để xem và chỉnh sửa thông tin. Hỗ trợ SEO riêng cho từng website.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <CategoryManager
            categories={activeCategories}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onMove={handleMove}
            existingIds={existingIds}
          />
        </CardContent>
      </Card>
    </div>
  );
}
