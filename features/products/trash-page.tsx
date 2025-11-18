import * as React from "react"
import { useNavigate } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate } from '@/lib/date-utils'
import { toast } from "sonner"
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { useProductStore } from "./store.ts"
import { getColumns } from "./trash-columns.tsx"
import { GenericTrashPage } from "../../components/shared/generic-trash-page.tsx"
import { Card, CardContent } from "../../components/ui/card.tsx"
import { Badge } from "../../components/ui/badge.tsx"
import type { Product } from "./types.ts"

export function ProductsTrashPage() {
  const store = useProductStore();
  const { data, getDeleted, restore, remove } = store;
  const navigate = useNavigate();
  
  usePageHeader();
  
  // Call getDeleted() directly - don't memoize to ensure we always get fresh data
  const deletedProducts = getDeleted();

  // Handlers for column actions (these will be called from column buttons)
  const handleRestoreFromColumn = React.useCallback((id: string) => {
    restore(id);
    toast.success("Đã khôi phục sản phẩm");
  }, [restore]);

  const handleDeleteFromColumn = React.useCallback(async (id: string) => {
    try {
      remove(id);
      toast.success("Đã xóa vĩnh viễn sản phẩm");
    } catch (error) {
      toast.error("Có lỗi khi xóa sản phẩm");
      console.error(error);
    }
  }, [remove]);

  const columns = React.useMemo(
    () => {
      // Pass real handlers to columns for button clicks
      return getColumns(navigate, handleRestoreFromColumn, handleDeleteFromColumn);
    },
    [navigate, handleRestoreFromColumn, handleDeleteFromColumn, data] // Add data to re-create columns on store update
  );

  // Custom mobile card for products
  const renderMobileCard = (product: Product) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.id}</p>
              {product.shortDescription && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
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
          
          <div className="grid grid-cols-2 gap-2 text-sm">
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
            <div className="text-xs text-muted-foreground">
              Xóa: {formatDateTime(product.deletedAt)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <GenericTrashPage
      deletedItems={deletedProducts}
      onRestore={(id: string) => {
        restore(id);
        toast.success("Đã khôi phục sản phẩm");
      }}
      onPermanentDelete={async (id: string) => {
        remove(id);
        toast.success("Đã xóa vĩnh viễn sản phẩm");
      }}
      title="Thùng rác sản phẩm"
      entityName="sản phẩm"
      backUrl="/products"
      columns={columns}
      renderMobileCard={renderMobileCard}
      getItemDisplayName={(product) => product.name}
    />
  );
}
