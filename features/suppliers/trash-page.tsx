import * as React from "react"
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner"
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { useSupplierStore } from "./store.ts"
import { getColumns } from "./trash-columns.tsx"
import { GenericTrashPage } from "../../components/shared/generic-trash-page.tsx"
import { Card, CardContent } from "../../components/ui/card.tsx"
import type { Supplier } from "./types.ts"

export function SuppliersTrashPage() {
  const { data, getDeleted, restore, remove } = useSupplierStore();
  const navigate = useNavigate();
  
  usePageHeader();
  
  const deletedSuppliers = React.useMemo(() => getDeleted(), [data]);

  const handleRestoreFromColumn = React.useCallback((systemId: string) => {
    restore(systemId);
    toast.success("Đã khôi phục nhà cung cấp");
  }, [restore]);

  const handleDeleteFromColumn = React.useCallback(async (systemId: string) => {
    try {
      remove(systemId);
      toast.success("Đã xóa vĩnh viễn nhà cung cấp");
    } catch (error) {
      toast.error("Có lỗi khi xóa nhà cung cấp");
      console.error(error);
    }
  }, [remove]);

  const columns = React.useMemo(
    () => getColumns(navigate, handleRestoreFromColumn, handleDeleteFromColumn),
    [navigate, handleRestoreFromColumn, handleDeleteFromColumn, data]
  );

  const renderMobileCard = (supplier: Supplier) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{supplier.name}</h3>
              <p className="text-sm text-muted-foreground">{supplier.id}</p>
              {supplier.phone && (
                <div className="text-sm text-muted-foreground mt-1">
                  {supplier.phone}
                </div>
              )}
            </div>
          </div>
          {supplier.deletedAt && (
            <div className="text-xs text-muted-foreground">
              Xóa: {new Date(supplier.deletedAt).toLocaleString('vi-VN')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <GenericTrashPage
      deletedItems={deletedSuppliers}
      onRestore={restore}
      onPermanentDelete={async (systemId: string) => {
        remove(systemId);
      }}
      title="Thùng rác nhà cung cấp"
      entityName="nhà cung cấp"
      backUrl="/suppliers"
      columns={columns}
      renderMobileCard={renderMobileCard}
      getItemDisplayName={(supplier) => supplier.name}
    />
  );
}
