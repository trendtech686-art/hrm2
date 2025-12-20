import * as React from 'react';
import Fuse from 'fuse.js';
import { Plus, CheckCircle2, RotateCcw, Trash2, Search, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter';
import { usePageHeader } from '../../contexts/page-header-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { usePayrollTemplateStore } from './payroll-template-store';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store';
import { getTemplateColumns } from './template-columns';
import { TemplateCard } from './template-card';
import { toast } from 'sonner';
import { asSystemId, type SystemId } from '../../lib/id-types';
import type { PayrollTemplate } from '../../lib/payroll-types';

export function PayrollTemplatePage() {
  const templateStore = usePayrollTemplateStore();
  const salaryComponents = useEmployeeSettingsStore((state) => state.getSalaryComponents());
  const { isMobile } = useBreakpoint();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDefaultFilter, setIsDefaultFilter] = React.useState<Set<string>>(new Set());

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);
  const [editingTemplateId, setEditingTemplateId] = React.useState<SystemId | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<SystemId | null>(null);

  // Form state
  const [formState, setFormState] = React.useState({
    name: '',
    description: '',
    componentSystemIds: salaryComponents.map((component) => asSystemId(component.systemId)),
    isDefault: false,
  });

  // Table states
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });

  // Mobile infinite scroll
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  // Raw data
  const templates = templateStore.templates;

  // Fuse.js for search
  const fuse = React.useMemo(
    () =>
      new Fuse(templates, {
        keys: ['id', 'name', 'description'],
        threshold: 0.3,
        includeScore: true,
      }),
    [templates]
  );

  // Filtered data
  const filteredData = React.useMemo(() => {
    let result = templates;

    // Search filter
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery.trim());
      result = searchResults.map((r) => r.item);
    }

    // Default filter
    if (isDefaultFilter.size > 0) {
      result = result.filter((t) => {
        if (isDefaultFilter.has('default') && t.isDefault) return true;
        if (isDefaultFilter.has('normal') && !t.isDefault) return true;
        return false;
      });
    }

    return result;
  }, [templates, searchQuery, isDefaultFilter, fuse]);

  // Reset mobile count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchQuery, isDefaultFilter.size]);

  // Handlers
  const handleOpenCreateDialog = React.useCallback(() => {
    setEditingTemplateId(null);
    setFormState({
      name: '',
      description: '',
      componentSystemIds: salaryComponents.map((component) => asSystemId(component.systemId)),
      isDefault: false,
    });
    setIsDialogOpen(true);
  }, [salaryComponents]);

  const handleEdit = React.useCallback((systemId: SystemId) => {
    const template = templateStore.getTemplateBySystemId(systemId);
    if (!template) return;
    setEditingTemplateId(systemId);
    setFormState({
      name: template.name,
      description: template.description ?? '',
      componentSystemIds: template.componentSystemIds,
      isDefault: template.isDefault,
    });
    setIsDialogOpen(true);
  }, [templateStore]);

  const handleDelete = React.useCallback((systemId: SystemId) => {
    setDeleteConfirmId(systemId);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    if (deleteConfirmId) {
      templateStore.deleteTemplate(deleteConfirmId);
      toast.success('Đã xóa mẫu', { description: 'Mẫu bảng lương đã được gỡ bỏ.' });
      setDeleteConfirmId(null);
    }
  }, [templateStore, deleteConfirmId]);

  const handleSetDefault = React.useCallback((systemId: SystemId) => {
    templateStore.setDefaultTemplate(systemId);
    toast.success('Đã đặt mặc định', { description: 'Mẫu này sẽ được chọn sẵn khi chạy lương.' });
  }, [templateStore]);

  const handleToggleDefault = React.useCallback((template: PayrollTemplate, isDefault: boolean) => {
    if (isDefault) {
      // Đặt làm mặc định
      templateStore.setDefaultTemplate(template.systemId);
      toast.success('Đã đặt mặc định', { description: `"${template.name}" sẽ được chọn sẵn khi chạy lương.` });
    } else {
      // Bỏ mặc định - hệ thống tự động chọn mẫu khác
      templateStore.updateTemplate(template.systemId, { isDefault: false });
      const newDefault = templateStore.getDefaultTemplate();
      if (newDefault && newDefault.systemId !== template.systemId) {
        toast.success('Đã bỏ mặc định', { description: `"${newDefault.name}" đã được đặt làm mặc định.` });
      }
    }
  }, [templateStore]);

  const handleResetToDefault = React.useCallback(() => {
    templateStore.resetToDefaultTemplates();
    toast.success('Đã khôi phục', { description: 'Đã khôi phục về danh sách mẫu mặc định.' });
    setIsResetDialogOpen(false);
    setRowSelection({});
  }, [templateStore]);

  const resetDialog = () => {
    setIsDialogOpen(false);
    setEditingTemplateId(null);
    setFormState({
      name: '',
      description: '',
      componentSystemIds: salaryComponents.map((component) => asSystemId(component.systemId)),
      isDefault: false,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      toast.error('Vui lòng nhập tên mẫu', { description: 'Tên mẫu bảng lương là bắt buộc.' });
      return;
    }

    if (editingTemplateId) {
      templateStore.updateTemplate(editingTemplateId, {
        name: formState.name.trim(),
        description: formState.description.trim(),
        componentSystemIds: formState.componentSystemIds,
        isDefault: formState.isDefault,
      });
      toast.success('Đã cập nhật mẫu', { description: 'Thông tin mẫu bảng lương đã được lưu.' });
    } else {
      templateStore.createTemplate({
        name: formState.name.trim(),
        description: formState.description.trim(),
        componentSystemIds: formState.componentSystemIds,
        isDefault: formState.isDefault,
      });
      toast.success('Đã tạo mẫu mới', { description: 'Bạn có thể dùng mẫu này trong wizard chạy lương.' });
    }

    resetDialog();
  };

  const toggleComponentSelection = (componentId: SystemId) => {
    setFormState((prev) => {
      const exists = prev.componentSystemIds.includes(componentId);
      return {
        ...prev,
        componentSystemIds: exists
          ? prev.componentSystemIds.filter((id) => id !== componentId)
          : [...prev.componentSystemIds, componentId],
      };
    });
  };

  // Columns
  const columns = React.useMemo(
    () => getTemplateColumns(handleEdit, handleDelete, handleToggleDefault),
    [handleEdit, handleDelete, handleToggleDefault]
  );

  // Set default column visibility
  React.useEffect(() => {
    const defaultVisibleColumns = ['select', 'id', 'name', 'componentCount', 'isDefault', 'createdAt', 'actions'];
    setColumnVisibility(
      Object.fromEntries(columns.map((col) => [col.id, defaultVisibleColumns.includes(col.id!)]))
    );
    setColumnOrder(columns.map((c) => c.id).filter(Boolean) as string[]);
  }, [columns]);

  // Mobile scroll listener
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight * 0.8;
      if (scrollPosition >= threshold && mobileLoadedCount < filteredData.length) {
        setMobileLoadedCount((prev) => Math.min(prev + 20, filteredData.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, filteredData.length]);

  // Pagination
  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

  const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;

  // Selected rows count
  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  // Header actions
  const headerActions = React.useMemo(
    () => [
      <Button
        key="reset"
        variant="outline"
        className="h-9"
        size="sm"
        onClick={() => setIsResetDialogOpen(true)}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Khôi phục mặc định
      </Button>,
      <Button
        key="new"
        className="h-9"
        size="sm"
        onClick={handleOpenCreateDialog}
      >
        <Plus className="mr-2 h-4 w-4" />
        Thêm mẫu
      </Button>,
    ],
    [handleOpenCreateDialog]
  );

  usePageHeader({
    actions: headerActions,
  });

  // Render mobile card
  const renderMobileCard = React.useCallback(
    (template: PayrollTemplate) => (
      <TemplateCard
        key={template.systemId}
        template={template}
        isSelected={rowSelection[template.systemId] ?? false}
        onSelect={(selected) =>
          setRowSelection((prev) => ({ ...prev, [template.systemId]: selected }))
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSetDefault={handleSetDefault}
      />
    ),
    [rowSelection, handleEdit, handleDelete, handleSetDefault]
  );

  // Bulk actions
  const bulkActions = React.useMemo(
    () => [
      {
        label: 'Xóa đã chọn',
        icon: Trash2,
        onSelect: (selectedRows: PayrollTemplate[]) => {
          selectedRows.forEach((row) => templateStore.deleteTemplate(row.systemId));
          toast.success(`Đã xóa ${selectedRows.length} mẫu`);
          setRowSelection({});
        },
      },
    ],
    [templateStore]
  );

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, mã mẫu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DataTableFacetedFilter
            title="Loại mẫu"
            selectedValues={isDefaultFilter}
            onSelectedValuesChange={setIsDefaultFilter}
            options={[
              { label: 'Mẫu mặc định', value: 'default' },
              { label: 'Mẫu thường', value: 'normal' },
            ]}
          />
          {(searchQuery || isDefaultFilter.size > 0) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-2"
              onClick={() => {
                setSearchQuery('');
                setIsDefaultFilter(new Set());
              }}
            >
              <X className="mr-1 h-4 w-4" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Results summary */}
      {(searchQuery || isDefaultFilter.size > 0) && (
        <p className="text-body-sm text-muted-foreground">
          Tìm thấy {filteredData.length} / {templates.length} mẫu
        </p>
      )}

      <ResponsiveDataTable<PayrollTemplate>
        columns={columns}
        data={displayData}
        renderMobileCard={renderMobileCard}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        pageCount={pageCount}
        rowCount={filteredData.length}
        bulkActions={bulkActions}
        showBulkDeleteButton={selectedCount > 0}
        emptyTitle={searchQuery || isDefaultFilter.size > 0 ? 'Không tìm thấy mẫu' : 'Chưa có mẫu bảng lương'}
        emptyDescription={searchQuery || isDefaultFilter.size > 0 ? 'Thử thay đổi từ khóa hoặc bộ lọc.' : "Nhấn 'Thêm mẫu' để tạo cấu hình đầu tiên."}
      />

      {/* Mobile loading indicator */}
      {isMobile && (
        <div className="py-6 text-center">
          {mobileLoadedCount < filteredData.length ? (
            <p className="text-body-sm text-muted-foreground">Đang tải thêm...</p>
          ) : filteredData.length > 0 ? (
            <p className="text-body-sm text-muted-foreground">
              Đã hiển thị tất cả {filteredData.length} mẫu
            </p>
          ) : null}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTemplateId ? 'Chỉnh sửa mẫu' : 'Tạo mẫu bảng lương'}</DialogTitle>
            <DialogDescription>
              Lựa chọn thành phần lương mặc định để tái sử dụng khi chạy bảng lương.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="template-name">Tên mẫu</Label>
              <Input
                id="template-name"
                className="h-9"
                required
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="template-description">Mô tả</Label>
              <Textarea
                id="template-description"
                placeholder="Mục đích sử dụng, phòng ban áp dụng..."
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Thành phần lương</Label>
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border p-3">
                {salaryComponents
                  .filter((c) => c.isActive !== false)
                  .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                  .map((component) => {
                    const componentSystemId = asSystemId(component.systemId);
                    const checked = formState.componentSystemIds.includes(componentSystemId);
                    return (
                      <label
                        key={component.systemId}
                        className="flex cursor-pointer items-center gap-3 text-body-sm"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleComponentSelection(componentSystemId)}
                          className="h-4 w-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{component.name}</p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                component.category === 'earning'
                                  ? 'border-green-200 bg-green-50 text-green-700'
                                  : component.category === 'deduction'
                                    ? 'border-red-200 bg-red-50 text-red-700'
                                    : 'border-blue-200 bg-blue-50 text-blue-700'
                              }`}
                            >
                              {component.category === 'earning'
                                ? 'Thu nhập'
                                : component.category === 'deduction'
                                  ? 'Khấu trừ'
                                  : 'Đóng góp'}
                            </Badge>
                          </div>
                          <p className="text-body-xs text-muted-foreground">
                            {component.type === 'fixed' ? 'Cố định' : component.formula ?? 'Theo công thức'}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                {salaryComponents.filter((c) => c.isActive !== false).length === 0 && (
                  <p className="text-body-sm text-muted-foreground">
                    Chưa có thành phần lương trong Cài đặt &gt; Nhân viên.
                  </p>
                )}
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-body-sm font-medium">
              <Checkbox
                checked={formState.isDefault}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, isDefault: Boolean(checked) }))
                }
                className="h-4 w-4"
              />
              Đặt làm mẫu mặc định
            </label>

            <DialogFooter className="flex flex-row items-center justify-between gap-2">
              <Button type="button" variant="outline" className="h-9" onClick={resetDialog}>
                Hủy
              </Button>
              <Button type="submit" className="h-9">
                {editingTemplateId ? 'Lưu thay đổi' : 'Tạo mẫu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Khôi phục mẫu mặc định?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này sẽ xóa tất cả các mẫu hiện tại và thay thế bằng 5 mẫu mặc định theo chuẩn
              Việt Nam:
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Mẫu lương cơ bản</li>
                <li>Mẫu lương nhân viên văn phòng</li>
                <li>Mẫu lương quản lý</li>
                <li>Mẫu lương kinh doanh</li>
                <li>Mẫu lương toàn bộ</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetToDefault}>Khôi phục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa mẫu?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mẫu bảng lương này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa mẫu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Implementation Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4">Ghi chú triển khai</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-body-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Mỗi mẫu sẽ đồng bộ với wizard chạy lương trong các bước tiếp theo.
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Thuế TNCN và bảo hiểm (BHXH, BHYT, BHTN) được tính tự động theo cài đặt trong{' '}
            <strong>Cài đặt → Nhân viên</strong>.
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Khi backend sẵn sàng, các mẫu này sẽ được map sang API `/payroll/templates` mà không cần
            thay đổi UI.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
