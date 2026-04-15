'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/date-utils'
import { ResponsiveDataTable } from "../data-table/responsive-data-table"
import { toast } from "sonner"
import { asSystemId, type SystemId } from "@/lib/id-types";
import { 
  Card, 
  CardContent,
} from "../ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react"
import { usePageHeader } from "../../contexts/page-header-context"
import type { ColumnDef } from '../data-table/types';
import { logError } from '@/lib/logger'

interface GenericTrashPageProps<T extends { systemId: SystemId; deletedAt?: string | null | undefined }> {
  // Data & Store
  deletedItems: T[];
  onRestore: (systemId: SystemId) => void;
  onPermanentDelete: (systemId: SystemId) => Promise<void>;
  
  // Display Configuration
  title: string;
  entityName: string; // e.g., "nhân viên", "khách hàng", "sản phẩm"
  backUrl: string;
  
  // Table Configuration
  columns: ColumnDef<T>[];
  renderMobileCard?: (row: T) => React.ReactNode;
  
  // Optional: Custom delete files handler
  deleteRelatedFiles?: (item: T) => Promise<void>;
  
  // Optional: Additional context for display
  getItemDisplayName?: (item: T) => string;
}

/**
 * Generic Trash Page Component
 * 
 * Reusable trash/recycle bin page for any entity type
 * Features:
 * - Restore single/multiple items
 * - Permanent delete with confirmation
 * - Auto delete related files
 * - Mobile responsive
 * - Bulk actions
 * 
 * @example
 * ```tsx
 * <GenericTrashPage
 *   deletedItems={getDeleted()}
 *   onRestore={restore}
 *   onPermanentDelete={permanentDelete}
 *   title="Thùng rác nhân viên"
 *   entityName="nhân viên"
 *   backUrl="/employees"
 *   columns={trashColumns}
 *   renderMobileCard={(row) => <EmployeeTrashCard employee={row} />}
 *   deleteRelatedFiles={deleteEmployeeFiles}
 * />
 * ```
 */
export function GenericTrashPage<T extends { systemId: SystemId; deletedAt?: string | null | undefined }>({
  deletedItems,
  onRestore,
  onPermanentDelete,
  title,
  entityName,
  backUrl,
  columns,
  renderMobileCard,
  deleteRelatedFiles,
  getItemDisplayName,
}: GenericTrashPageProps<T>) {
  const router = useRouter();
  
  const headerActions = React.useMemo(() => [
    <Button key="back" variant="outline" onClick={() => router.push(backUrl)}>
      Quay lại danh sách
    </Button>
  ], [router, backUrl]);
  
  usePageHeader({
    title,
    actions: headerActions
  });
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [targetId, setTargetId] = React.useState<SystemId | null>(null)
  const [isBulkRestoreDialogOpen, setIsBulkRestoreDialogOpen] = React.useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = React.useState(false)

  // Table state
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'deletedAt', desc: true });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  // Set default column visibility
  React.useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      initialVisibility[c.id!] = true;
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, [columns]);

  // Actions
  const handleRestore = (id: SystemId) => {
    setTargetId(id);
    setIsRestoreDialogOpen(true);
  }

  const confirmRestore = () => {
    if (targetId) {
      onRestore(targetId);
      toast.success(`Đã khôi phục ${entityName}`);
      setIsRestoreDialogOpen(false);
      setTargetId(null);
    }
  }

  const handlePermanentDelete = async (id: SystemId) => {
    setTargetId(id);
    setIsDeleteDialogOpen(true);
  }

  const confirmPermanentDelete = async () => {
    if (targetId) {
      try {
        const item = deletedItems.find(i => i.systemId === targetId);
        
        // Delete related files if handler provided
        if (item && deleteRelatedFiles) {
          await deleteRelatedFiles(item);
        }
        
        // Permanent delete from store
        await onPermanentDelete(targetId);
        
        toast.success(`Đã lưu trữ vĩnh viễn ${entityName}. Dữ liệu liên quan vẫn được bảo toàn.`);
        setIsDeleteDialogOpen(false);
        setTargetId(null);
      } catch (error) {
        toast.error(`Có lỗi khi lưu trữ ${entityName}`);
        logError(`Error permanently deleting ${entityName}`, error);
      }
    }
  }

  // Bulk Actions
  const handleBulkRestore = () => {
    setIsBulkRestoreDialogOpen(true);
  }

  const confirmBulkRestore = () => {
    const selectedIds = Object.keys(rowSelection).map((id) => asSystemId(id));
    selectedIds.forEach((id) => onRestore(id));
    toast.success(`Đã khôi phục ${selectedIds.length} ${entityName}`);
    setRowSelection({});
    setIsBulkRestoreDialogOpen(false);
  }

  const handleBulkDelete = () => {
    setIsBulkDeleteDialogOpen(true);
  }

  const confirmBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection).map((id) => asSystemId(id));
    
    try {
      // Delete related files for all selected items
      if (deleteRelatedFiles) {
        for (const id of selectedIds) {
          const item = deletedItems.find(i => i.systemId === id);
          if (item) {
            await deleteRelatedFiles(item);
          }
        }
      }
      
      // Permanent delete all
      for (const id of selectedIds) {
        await onPermanentDelete(id);
      }
      
      toast.success(`Đã lưu trữ vĩnh viễn ${selectedIds.length} ${entityName}. Dữ liệu liên quan vẫn được bảo toàn.`);
      setRowSelection({});
      setIsBulkDeleteDialogOpen(false);
    } catch (error) {
      toast.error(`Có lỗi khi lưu trữ ${entityName}`);
      logError(`Error bulk deleting ${entityName}`, error);
    }
  }

  const bulkActions = [
    {
      label: "Khôi phục đã chọn",
      onSelect: () => handleBulkRestore(),
      icon: RotateCcw
    },
    {
      label: "Lưu trữ vĩnh viễn đã chọn",
      onSelect: () => handleBulkDelete(),
      icon: Trash2,
      variant: "destructive" as const
    }
  ];

  // Paginated and sorted data
  const sortedData = React.useMemo(() => {
    const sorted = [...deletedItems];
    
    if (sorting.id) {
      sorted.sort((a: T, b: T) => {
        const aVal = a[sorting.id as keyof T];
        const bVal = b[sorting.id as keyof T];
        if (aVal < bVal) return sorting.desc ? 1 : -1;
        if (aVal > bVal) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    
    return sorted;
  }, [deletedItems, sorting]);

  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const allSelectedRows = React.useMemo(
    () => paginatedData.filter(row => rowSelection[row.systemId]),
    [paginatedData, rowSelection]
  );

  // Default mobile card if not provided
  const defaultMobileCard = (row: T) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">
                {getItemDisplayName ? getItemDisplayName(row) : row.systemId}
              </h3>
              {row.deletedAt && (
                <p className="text-xs text-muted-foreground">
                  Xóa: {formatDateTime(row.deletedAt)}
                </p>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestore(row.systemId);
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePermanentDelete(row.systemId);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col w-full h-full">
      {/* Warning Banner */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 mb-4">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Lưu ý về lưu trữ vĩnh viễn
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                {entityName.charAt(0).toUpperCase() + entityName.slice(1)} trong thùng rác có thể được <strong>khôi phục</strong>.{' '}
                Khi <strong>lưu trữ vĩnh viễn</strong>, thông tin cá nhân nhạy cảm (SĐT, email, CCCD, ngân hàng) sẽ bị xóa,
                nhưng <strong>tên và mã {entityName}</strong> vẫn được giữ lại để đơn hàng, công việc
                và các dữ liệu liên quan hiển thị đúng.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table - No Card wrapper, direct like list pages */}
      <div className="w-full py-4">
        <ResponsiveDataTable
            columns={columns}
            data={paginatedData}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={sortedData.length}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            sorting={sorting}
            setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            bulkActions={bulkActions}
            allSelectedRows={allSelectedRows}
            renderMobileCard={renderMobileCard || defaultMobileCard}
          />
      </div>

      {/* Restore Dialog */}
      <AlertDialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Khôi phục {entityName}?</AlertDialogTitle>
            <AlertDialogDescription>
              {entityName.charAt(0).toUpperCase() + entityName.slice(1)} sẽ được khôi phục về danh sách chính.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestore}>Khôi phục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Archive Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              <AlertTriangle className="inline h-5 w-5 mr-2" />
              Lưu trữ vĩnh viễn {entityName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong className="text-destructive">Hành động này không thể hoàn tác!</strong>
              <br /><br />
              Thông tin cá nhân nhạy cảm sẽ bị xóa:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>SĐT, email, CCCD, địa chỉ</li>
                <li>Tài khoản ngân hàng, mã số thuế, BHXH</li>
                <li>Files, ảnh đại diện và tài liệu</li>
              </ul>
              <br />
              <strong>Tên và mã {entityName} được giữ lại</strong> để đơn hàng, công việc và
              dữ liệu liên quan vẫn hiển thị đúng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPermanentDelete} className="bg-destructive hover:bg-destructive/90">
              Lưu trữ vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Restore Dialog */}
      <AlertDialog open={isBulkRestoreDialogOpen} onOpenChange={setIsBulkRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Khôi phục {Object.keys(rowSelection).length} {entityName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Các {entityName} đã chọn sẽ được khôi phục về danh sách chính.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkRestore}>Khôi phục tất cả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Archive Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              <AlertTriangle className="inline h-5 w-5 mr-2" />
              Lưu trữ vĩnh viễn {Object.keys(rowSelection).length} {entityName}?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-sm text-muted-foreground">
                <strong className="text-destructive">Hành động này không thể hoàn tác!</strong>
                <br /><br />
                Thông tin cá nhân nhạy cảm của {Object.keys(rowSelection).length} {entityName} sẽ bị xóa.
                Tên và mã được giữ lại để đơn hàng, công việc hiển thị đúng.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive hover:bg-destructive/90">
              Lưu trữ vĩnh viễn tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
