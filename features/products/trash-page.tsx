'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/date-utils'
import { toast } from "sonner"
import { usePageHeader } from "../../contexts/page-header-context";
import { useDeletedProducts, useTrashMutations } from "./hooks/use-products"
import { getColumns } from "./trash-columns"
import { GenericTrashPage } from "../../components/shared/generic-trash-page"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import type { Product } from "@/lib/types/prisma-extended"
import type { SystemId } from "@/lib/id-types";

export function ProductsTrashPage() {
  const { data: deletedProducts = [], isLoading } = useDeletedProducts();
  const { restore, permanentDelete } = useTrashMutations();
  const router = useRouter();
  
  const handleNavigateBack = React.useCallback(() => router.push('/products'), [router]);
  const handleCreateProduct = React.useCallback(() => router.push('/products/new'), [router]);

  const headerActions = React.useMemo(() => [
    <Button
      key="back"
      variant="outline"
      size="sm"
      className="h-9"
      onClick={handleNavigateBack}
    >
      Danh sách sản phẩm
    </Button>,
    <Button
      key="create"
      size="sm"
      className="h-9"
      onClick={handleCreateProduct}
    >
      Thêm sản phẩm
    </Button>
  ], [handleNavigateBack, handleCreateProduct]);

  usePageHeader({
    title: "Thùng rác sản phẩm",
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Sản phẩm', href: '/products', isCurrent: false },
      { label: 'Thùng rác', href: '/products/trash', isCurrent: true }
    ],
    actions: headerActions,
    showBackButton: true,
    backPath: '/products'
  });

  // Handlers for column actions
  const handleRestoreFromColumn = React.useCallback((systemId: SystemId) => {
    restore.mutate(systemId, {
      onSuccess: () => {
        toast.success("Đã khôi phục sản phẩm");
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi khi khôi phục sản phẩm");
      }
    });
  }, [restore]);

  const handleDeleteFromColumn = React.useCallback(async (systemId: SystemId) => {
    permanentDelete.mutate(systemId, {
      onSuccess: () => {
        toast.success("Đã xóa vĩnh viễn sản phẩm");
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi khi xóa sản phẩm");
      }
    });
  }, [permanentDelete]);

  const columns = React.useMemo(
    () => getColumns(router, handleRestoreFromColumn, handleDeleteFromColumn),
    [router, handleRestoreFromColumn, handleDeleteFromColumn]
  );

  // Custom mobile card for products
  const renderMobileCard = (product: Product) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-body-sm font-medium truncate">{product.name}</h3>
              <p className="text-body-xs text-muted-foreground">{product.id}</p>
              {product.shortDescription && (
                <p className="text-body-xs text-muted-foreground mt-1 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}
            </div>
            {product.status && (
              <Badge variant={
                product.status === 'active' ? 'success' : 
                product.status === 'discontinued' ? 'destructive' : 
                'secondary'
              }>
                {product.status === 'active' ? 'Hoạt động' : 
                 product.status === 'discontinued' ? 'Ngừng kinh doanh' : 
                 'Tạm ngừng'}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-body-xs">
            {product.categorySystemId && (
              <div>
                <span className="text-muted-foreground">Danh mục:</span>
                <span className="ml-1 font-medium">{product.categorySystemId}</span>
              </div>
            )}
            {product.type && (
              <div>
                <span className="text-muted-foreground">Loại:</span>
                <span className="ml-1 font-medium capitalize">{product.type}</span>
              </div>
            )}
          </div>

          {product.deletedAt && (
            <div className="text-body-xs text-muted-foreground">
              Xóa: {formatDateTime(product.deletedAt)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Đang tải...</div>;
  }

  return (
    <GenericTrashPage
      deletedItems={deletedProducts}
      onRestore={(systemId) => handleRestoreFromColumn(systemId)}
      onPermanentDelete={(systemId) => handleDeleteFromColumn(systemId)}
      title="Thùng rác sản phẩm"
      entityName="sản phẩm"
      backUrl="/products"
      columns={columns}
      renderMobileCard={renderMobileCard}
      getItemDisplayName={(product) => product.name}
    />
  );
}
