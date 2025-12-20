'use client'

import * as React from "react"
import { useNavigate } from '@/lib/next-compat';
import { toast } from "sonner"
import { usePageHeader } from "../../contexts/page-header-context";
import { useSupplierStore } from "./store"
import { getColumns } from "./trash-columns"
import { GenericTrashPage } from "../../components/shared/generic-trash-page"
import { Card, CardContent } from "../../components/ui/card"
import { formatDateTimeForDisplay } from '@/lib/date-utils';
import type { Supplier } from "./types"
import type { SystemId } from "@/lib/id-types";
import { ROUTES } from "../../lib/router";
import type { BreadcrumbItem } from "../../lib/breadcrumb-system";

export function SuppliersTrashPage() {
  const { data, getDeleted, restore, remove } = useSupplierStore();
  const navigate = useNavigate();
  
  const breadcrumb = React.useMemo<BreadcrumbItem[]>(() => ([
    { label: 'Trang chủ', href: ROUTES.ROOT },
    { label: 'Nhà cung cấp', href: ROUTES.PROCUREMENT.SUPPLIERS },
    { label: 'Thùng rác', href: `${ROUTES.PROCUREMENT.SUPPLIERS}/trash`, isCurrent: true },
  ]), []);

  usePageHeader({
    title: 'Thùng rác nhà cung cấp',
    backPath: ROUTES.PROCUREMENT.SUPPLIERS,
    breadcrumb,
  });
  
  const deletedSuppliers = React.useMemo(() => getDeleted(), [data]);

  const handleRestoreFromColumn = React.useCallback((systemId: SystemId) => {
    restore(systemId);
    toast.success("Đã khôi phục nhà cung cấp");
  }, [restore]);

  const handleDeleteFromColumn = React.useCallback(async (systemId: SystemId) => {
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
              Xóa: {formatDateTimeForDisplay(supplier.deletedAt)}
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
      onPermanentDelete={async (systemId) => {
        remove(systemId);
      }}
      title="Thùng rác nhà cung cấp"
      entityName="nhà cung cấp"
      backUrl={ROUTES.PROCUREMENT.SUPPLIERS}
      columns={columns}
      renderMobileCard={renderMobileCard}
      getItemDisplayName={(supplier) => supplier.name}
    />
  );
}
