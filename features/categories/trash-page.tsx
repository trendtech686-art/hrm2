'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/date-utils'
import { toast } from "sonner"
import { usePageHeader } from "@/contexts/page-header-context";
import { useDeletedCategories, useCategoryTrashMutations } from "./hooks/use-categories"
import { getColumns } from "./trash-columns"
import { GenericTrashPage } from "@/components/shared/generic-trash-page"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Category } from './api/categories-api'
import type { SystemId } from "@/lib/id-types";

type TrashCategory = Omit<Category, 'systemId' | 'deletedAt'> & { 
  systemId: SystemId; 
  deletedAt?: string | null;
};

export function CategoriesTrashPage() {
  const { data: deletedCategories = [], isLoading } = useDeletedCategories();
  const { restore, permanentDelete } = useCategoryTrashMutations();
  const router = useRouter();

  const handleNavigateBack = React.useCallback(() => router.push('/categories'), [router]);
  const handleCreateCategory = React.useCallback(() => router.push('/categories/new'), [router]);

  const headerActions = React.useMemo(() => [
    <Button
      key="back"
      variant="outline"
      size="sm"
      className="h-9"
      onClick={handleNavigateBack}
    >
      Danh sách danh mục
    </Button>,
    <Button
      key="create"
      size="sm"
      className="h-9"
      onClick={handleCreateCategory}
    >
      Thêm danh mục
    </Button>
  ], [handleNavigateBack, handleCreateCategory]);

  usePageHeader({
    title: "Thùng rác danh mục",
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Danh mục', href: '/categories', isCurrent: false },
      { label: 'Thùng rác', href: '/categories/trash', isCurrent: true }
    ],
    actions: headerActions,
    showBackButton: true,
    backPath: '/categories'
  });

  // Handlers for column actions
  const handleRestoreFromColumn = React.useCallback((systemId: SystemId) => {
    restore.mutate(systemId as string, {
      onSuccess: () => {
        toast.success('Đã khôi phục danh mục');
      },
      onError: (error) => {
        toast.error(error.message || 'Không thể khôi phục danh mục');
      }
    });
  }, [restore]);

  const handlePermanentDeleteFromColumn = React.useCallback(async (systemId: SystemId) => {
    try {
      await permanentDelete.mutateAsync(systemId as string);
      toast.success('Đã xóa vĩnh viễn danh mục');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa danh mục');
    }
  }, [permanentDelete]);

  const columns = React.useMemo(
    () => getColumns(handleRestoreFromColumn, handlePermanentDeleteFromColumn),
    [handleRestoreFromColumn, handlePermanentDeleteFromColumn]
  );

  // Mobile card renderer
  const renderMobileCard = React.useCallback((category: Category) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{category.name}</span>
              <Badge variant="destructive" className="text-xs">Đã xóa</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Mã: {category.id}</p>
            {category.path && (
              <p className="text-xs text-muted-foreground truncate max-w-50">
                {category.path}
              </p>
            )}
            {category.deletedAt && (
              <p className="text-xs text-muted-foreground">
                Xóa lúc: {formatDateTime(category.deletedAt)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRestoreFromColumn(category.systemId as SystemId)}
              className="text-green-600"
            >
              Khôi phục
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePermanentDeleteFromColumn(category.systemId as SystemId)}
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
    <GenericTrashPage<TrashCategory>
      deletedItems={deletedCategories as TrashCategory[]}
      onRestore={handleRestoreFromColumn}
      onPermanentDelete={handlePermanentDeleteFromColumn}
      title="Thùng rác danh mục"
      entityName="danh mục"
      backUrl="/categories"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      columns={columns as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderMobileCard={renderMobileCard as any}
      getItemDisplayName={(category) => category.name}
    />
  );
}
