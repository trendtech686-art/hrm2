import * as React from "react"
import { useNavigate } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, getDaysDiff, isValidDate } from '@/lib/date-utils'
import { ResponsiveDataTable } from "../data-table/responsive-data-table.tsx"
import { toast } from "sonner"
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card.tsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog.tsx"
import { Button } from "../ui/button.tsx"
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react"
import { usePageHeader } from "../../contexts/page-header-context.tsx"
import type { ColumnDef } from '../data-table/types.ts';

interface GenericTrashPageProps<T extends { systemId: string; deletedAt?: string }> {
  // Data & Store
  deletedItems: T[];
  onRestore: (systemId: string) => void;
  onPermanentDelete: (systemId: string) => Promise<void>;
  
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
export function GenericTrashPage<T extends { systemId: string; deletedAt?: string }>({
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
  const navigate = useNavigate();
  
  const headerActions = React.useMemo(() => [
    <Button key="back" variant="outline" onClick={() => navigate(backUrl)}>
      Quay lại danh sách
    </Button>
  ], [navigate, backUrl]);
  
  usePageHeader({
    title,
    actions: headerActions
  });
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [targetId, setTargetId] = React.useState<string | null>(null)
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
  const handleRestore = (id: string) => {
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

  const handlePermanentDelete = async (id: string) => {
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
        
        toast.success(`Đã xóa vĩnh viễn ${entityName} và tất cả dữ liệu liên quan`);
        setIsDeleteDialogOpen(false);
        setTargetId(null);
      } catch (error) {
        toast.error(`Có lỗi khi xóa ${entityName}`);
        console.error(error);
      }
    }
  }

  // Bulk Actions
  const handleBulkRestore = () => {
    setIsBulkRestoreDialogOpen(true);
  }

  const confirmBulkRestore = () => {
    const selectedIds = Object.keys(rowSelection);
    selectedIds.forEach(id => onRestore(id));
    toast.success(`Đã khôi phục ${selectedIds.length} ${entityName}`);
    setRowSelection({});
    setIsBulkRestoreDialogOpen(false);
  }

  const handleBulkDelete = () => {
    setIsBulkDeleteDialogOpen(true);
  }

  const confirmBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection);
    
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
      
      toast.success(`Đã xóa vĩnh viễn ${selectedIds.length} ${entityName} và tất cả dữ liệu liên quan`);
      setRowSelection({});
      setIsBulkDeleteDialogOpen(false);
    } catch (error) {
      toast.error(`Có lỗi khi xóa ${entityName}`);
      console.error(error);
    }
  }

  const bulkActions = [
    {
      label: "Khôi phục đã chọn",
      onSelect: () => handleBulkRestore(),
      icon: RotateCcw
    },
    {
      label: "Xóa vĩnh viễn đã chọn",
      onSelect: () => handleBulkDelete(),
      icon: Trash2,
      variant: "destructive" as const
    }
  ];

  // Paginated and sorted data
  const sortedData = React.useMemo(() => {
    let sorted = [...deletedItems];
    
    if (sorting.id) {
      sorted.sort((a: any, b: any) => {
        const aVal = a[sorting.id];
        const bVal = b[sorting.id];
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
                Cảnh báo: Xóa vĩnh viễn
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                {entityName.charAt(0).toUpperCase() + entityName.slice(1)} trong thùng rác có thể được khôi phục. 
                Tuy nhiên, khi <strong>xóa vĩnh viễn</strong>, tất cả dữ liệu liên quan 
                (files, tài liệu, ảnh) sẽ bị xóa không thể khôi phục.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table - No Card wrapper, direct like list pages */}
      <div className="w-full py-4">
        <ResponsiveDataTable
            columns={columns as any}
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

      {/* Permanent Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              <AlertTriangle className="inline h-5 w-5 mr-2" />
              Xóa vĩnh viễn {entityName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong className="text-destructive">Hành động này không thể hoàn tác!</strong>
              <br /><br />
              Toàn bộ dữ liệu sau sẽ bị xóa vĩnh viễn:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Thông tin {entityName}</li>
                <li>Tất cả files và tài liệu đã upload</li>
                <li>Thư mục lưu trữ trên server</li>
                <li>Ảnh đại diện và các file đính kèm</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPermanentDelete} className="bg-destructive hover:bg-destructive/90">
              Xóa vĩnh viễn
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

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              <AlertTriangle className="inline h-5 w-5 mr-2" />
              Xóa vĩnh viễn {Object.keys(rowSelection).length} {entityName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong className="text-destructive">CẢNH BÁO: Hành động này không thể hoàn tác!</strong>
              <br /><br />
              Toàn bộ dữ liệu của {Object.keys(rowSelection).length} {entityName} sẽ bị xóa vĩnh viễn:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Thông tin {entityName}</li>
                <li>Tất cả files và tài liệu</li>
                <li>Thư mục lưu trữ trên server</li>
                <li>Ảnh đại diện và file đính kèm</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive hover:bg-destructive/90">
              Xóa vĩnh viễn tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
