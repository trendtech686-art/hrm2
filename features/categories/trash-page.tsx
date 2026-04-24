'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/date-utils'
import { toast } from "sonner"
import { usePageHeader } from "@/contexts/page-header-context";
import { useDeletedCategories, useCategoryTrashMutations } from "./hooks/use-categories"
import { getColumns, type TrashCategory } from "./trash-columns"
import { GenericTrashPage } from "@/components/shared/generic-trash-page"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { SystemId } from "@/lib/id-types";

// TrashCategory is re-exported from trash-columns

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
      onClick={handleNavigateBack}
    >
      Danh sách danh mục
    </Button>,
    <Button
      key="create"
      size="sm"
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
      toast.success('Đã lưu trữ vĩnh viễn danh mục');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu trữ danh mục');
    }
  }, [permanentDelete]);

  const columns = React.useMemo(
    () => getColumns(handleRestoreFromColumn, handlePermanentDeleteFromColumn),
    [handleRestoreFromColumn, handlePermanentDeleteFromColumn]
  );

  // Mobile card renderer
  const renderMobileCard = React.useCallback((category: TrashCategory) => (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{category.name}</span>
            <Badge variant="destructive" className="text-xs">Đã xóa</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Mã: {category.id}</p>
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
        <div className="flex flex-col gap-1 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRestoreFromColumn(category.systemId)}
            className="text-green-600"
          >
            Khôi phục
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePermanentDeleteFromColumn(category.systemId)}
            className="text-destructive"
          >
            Lưu trữ vĩnh viễn
          </Button>
        </div>
      </div>
    </div>
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
      columns={columns}
      renderMobileCard={renderMobileCard}
      getItemDisplayName={(category) => category.name}
    />
  );
}
