'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/date-utils'
import { toast } from "sonner"
import { usePageHeader } from "@/contexts/page-header-context";
import { useDeletedBrands, useTrashMutations } from "./hooks/use-brands"
import { getColumns } from "./trash-columns"
import { GenericTrashPage } from "@/components/shared/generic-trash-page"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Brand } from './api/brands-api'
import type { SystemId } from "@/lib/id-types";

type TrashBrand = Omit<Brand, 'systemId' | 'deletedAt'> & { 
  systemId: SystemId; 
  deletedAt?: string | null;
};

export function BrandsTrashPage() {
  const { data: deletedBrands = [], isLoading } = useDeletedBrands();
  const { restore, permanentDelete } = useTrashMutations();
  const router = useRouter();

  const handleNavigateBack = React.useCallback(() => router.push('/brands'), [router]);
  const handleCreateBrand = React.useCallback(() => router.push('/brands/new'), [router]);

  const headerActions = React.useMemo(() => [
    <Button
      key="back"
      variant="outline"
      size="sm"
      className="h-9"
      onClick={handleNavigateBack}
    >
      Danh sách thương hiệu
    </Button>,
    <Button
      key="create"
      size="sm"
      className="h-9"
      onClick={handleCreateBrand}
    >
      Thêm thương hiệu
    </Button>
  ], [handleNavigateBack, handleCreateBrand]);

  usePageHeader({
    title: "Thùng rác thương hiệu",
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Thương hiệu', href: '/brands', isCurrent: false },
      { label: 'Thùng rác', href: '/brands/trash', isCurrent: true }
    ],
    actions: headerActions,
    showBackButton: true,
    backPath: '/brands'
  });

  // Handlers for column actions
  const handleRestoreFromColumn = React.useCallback((systemId: SystemId) => {
    restore.mutate(systemId as string, {
      onSuccess: () => {
        toast.success('Đã khôi phục thương hiệu');
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể khôi phục thương hiệu');
      }
    });
  }, [restore]);

  const handlePermanentDeleteFromColumn = React.useCallback(async (systemId: SystemId) => {
    try {
      await permanentDelete.mutateAsync(systemId as string);
      toast.success('Đã xóa vĩnh viễn thương hiệu');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa thương hiệu');
    }
  }, [permanentDelete]);

  const columns = React.useMemo(
    () => getColumns(handleRestoreFromColumn, handlePermanentDeleteFromColumn),
    [handleRestoreFromColumn, handlePermanentDeleteFromColumn]
  );

  // Mobile card renderer
  const renderMobileCard = React.useCallback((brand: Brand) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{brand.name}</span>
              <Badge variant="destructive" className="text-xs">Đã xóa</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Mã: {brand.id}</p>
            {brand.deletedAt && (
              <p className="text-xs text-muted-foreground">
                Xóa lúc: {formatDateTime(brand.deletedAt)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRestoreFromColumn(brand.systemId as SystemId)}
              className="text-green-600"
            >
              Khôi phục
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePermanentDeleteFromColumn(brand.systemId as SystemId)}
              className="text-destructive"
            >
              Xóa vĩnh viễn
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ), [handleRestoreFromColumn, handlePermanentDeleteFromColumn]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <GenericTrashPage<TrashBrand>
      deletedItems={deletedBrands as TrashBrand[]}
      onRestore={handleRestoreFromColumn}
      onPermanentDelete={handlePermanentDeleteFromColumn}
      title="Thùng rác thương hiệu"
      entityName="thương hiệu"
      backUrl="/brands"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      columns={columns as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderMobileCard={renderMobileCard as any}
      getItemDisplayName={(brand) => brand.name}
    />
  );
}
