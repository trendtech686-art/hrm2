'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { usePageHeader } from "../../contexts/page-header-context";
import { useDeletedSuppliers, useTrashMutations } from "./hooks/use-suppliers"
import { getColumns } from "./trash-columns"
import { GenericTrashPage } from "../../components/shared/generic-trash-page"
import { formatDateTimeForDisplay } from '@/lib/date-utils';
import type { Supplier } from '@/lib/types/prisma-extended'
import type { SystemId } from "@/lib/id-types";
import { ROUTES } from "../../lib/router";
import type { BreadcrumbItem } from "../../lib/breadcrumb-system";

export function SuppliersTrashPage() {
  const { data: deletedSuppliers = [], isLoading } = useDeletedSuppliers();
  const { restore, permanentDelete } = useTrashMutations();
  const router = useRouter();
  
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

  const handleRestoreFromColumn = React.useCallback((systemId: SystemId) => {
    restore.mutate(systemId, {
      onSuccess: () => {
        toast.success("Đã khôi phục nhà cung cấp");
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi khi khôi phục nhà cung cấp");
      }
    });
  }, [restore]);

  const handleDeleteFromColumn = React.useCallback(async (systemId: SystemId) => {
    permanentDelete.mutate(systemId, {
      onSuccess: () => {
        toast.success("Đã lưu trữ vĩnh viễn nhà cung cấp");
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi khi lưu trữ nhà cung cấp");
      }
    });
  }, [permanentDelete]);

  const columns = React.useMemo(
    () => getColumns(router, handleRestoreFromColumn, handleDeleteFromColumn),
    [router, handleRestoreFromColumn, handleDeleteFromColumn]
  );

  const renderMobileCard = (supplier: Supplier) => (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{supplier.name}</h3>
        <p className="text-xs text-muted-foreground">{supplier.id}</p>
        {supplier.phone && (
          <div className="text-xs text-muted-foreground mt-1">
            {supplier.phone}
          </div>
        )}
      </div>
      {supplier.deletedAt && (
        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
          Xóa: {formatDateTimeForDisplay(supplier.deletedAt)}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Đang tải...</div>;
  }

  return (
    <GenericTrashPage
      deletedItems={deletedSuppliers}
      onRestore={(systemId) => handleRestoreFromColumn(systemId)}
      onPermanentDelete={(systemId) => handleDeleteFromColumn(systemId)}
      title="Thùng rác nhà cung cấp"
      entityName="nhà cung cấp"
      backUrl={ROUTES.PROCUREMENT.SUPPLIERS}
      columns={columns}
      renderMobileCard={renderMobileCard}
      getItemDisplayName={(supplier) => supplier.name}
    />
  );
}
