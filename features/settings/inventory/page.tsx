import * as React from "react";
import { Plus } from "lucide-react";
import { usePageHeader } from "../../../contexts/page-header-context.tsx";
import { useUnitStore } from "../units/store.ts";
import { useProductTypeStore } from "./product-type-store.ts";
import { useProductCategoryStore } from "./product-category-store.ts";
import { useStorageLocationStore } from "./storage-location-store.ts";
import type { Unit } from "../units/types.ts";
import type { ProductType, ProductCategory } from "./types.ts";
import type { StorageLocation } from "./storage-location-types.ts";
import { UnitForm, type UnitFormValues } from "../units/form.tsx";
import { ProductTypeFormDialog, ProductCategoryFormDialog } from "./setting-form-dialogs.tsx";
import { StorageLocationFormDialog } from "./storage-location-form-dialog.tsx";
import { SettingsTable } from "./settings-table.tsx";
import { CategoryTree } from "./category-tree.tsx";
import { getUnitColumns } from "../units/columns.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx";
import { DataTable } from "../../../components/data-table/data-table.tsx";
import { toast } from "sonner";

function UnitsTabContent() {
  const { data, add, update, remove } = useUnitStore();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState<Unit | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);

  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'name', desc: false });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'inventory-settings-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getUnitColumns(() => {}, () => {});
    const allColumnIds = cols.map((c: any) => c.id).filter(Boolean);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (allColumnIds.every((id: string) => id in parsed)) return parsed;
      } catch (e) {}
    }
    const initial: Record<string, boolean> = {};
    cols.forEach((c: any) => { if (c.id) initial[c.id] = true; });
    return initial;
  });
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    localStorage.setItem('inventory-settings-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const handleAddNew = () => { setEditingUnit(null); setIsFormOpen(true); };
  const handleEdit = (unit: Unit) => { setEditingUnit(unit); setIsFormOpen(true); };
  const handleDeleteRequest = (systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); };
  
  const confirmDelete = () => { 
    if (idToDelete) {
      remove(idToDelete);
      toast.success('Đã xóa đơn vị tính');
    }
    setIsAlertOpen(false);
  };
  
  const handleFormSubmit = (values: UnitFormValues) => {
    if (editingUnit) {
      update(editingUnit.systemId, { ...editingUnit, ...values });
      toast.success('Đã cập nhật đơn vị tính');
    } else {
      add(values);
      toast.success('Đã thêm đơn vị tính mới');
    }
    setIsFormOpen(false);
  };

  const columns = React.useMemo(() => getUnitColumns(handleEdit, handleDeleteRequest), []);
  
  React.useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
        initialVisibility[c.id!] = true;
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, [columns]);
  
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
        const aVal = (a as any)[sorting.id];
        const bVal = (b as any)[sorting.id];
        if (aVal < bVal) return sorting.desc ? 1 : -1;
        if (aVal > bVal) return sorting.desc ? -1 : 1;
        return 0;
    });
  }, [data, sorting]);
  
  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách Đơn vị tính</CardTitle>
              <CardDescription>Quản lý các đơn vị tính được sử dụng cho sản phẩm.</CardDescription>
            </div>
            <Button size="sm" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" /> Thêm đơn vị tính
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
              columns={columns} data={paginatedData} pageCount={pageCount}
              pagination={pagination} setPagination={setPagination} rowCount={data.length}
              rowSelection={rowSelection} setRowSelection={setRowSelection}
              sorting={sorting} setSorting={setSorting}
              columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder} setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns}
              allSelectedRows={[]} expanded={{}} setExpanded={() => {}} 
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUnit ? 'Chỉnh sửa Đơn vị tính' : 'Thêm Đơn vị tính'}</DialogTitle>
          </DialogHeader>
          <UnitForm initialData={editingUnit} onSubmit={handleFormSubmit} />
          <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Hủy</Button>
              <Button type="submit" form="unit-form">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProductTypesTabContent() {
  const productTypes = useProductTypeStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ProductType | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);

  const handleAdd = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: ProductType) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (systemId: string) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (idToDelete) {
      productTypes.remove(idToDelete);
      toast.success('Đã xóa loại sản phẩm');
    }
    setIsAlertOpen(false);
  };

  const handleSubmit = (data: any) => {
    try {
      if (editingItem) {
        productTypes.update(editingItem.systemId, { ...editingItem, ...data });
        toast.success('Đã cập nhật loại sản phẩm');
      } else {
        productTypes.add(data);
        toast.success('Đã thêm loại sản phẩm mới');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const existingIds = productTypes.getActive().map((t) => t.id);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Loại sản phẩm</CardTitle>
              <CardDescription>
                Quản lý các loại sản phẩm: Hàng hóa, Dịch vụ, Digital
              </CardDescription>
            </div>
            <Button size="sm" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Thêm loại sản phẩm
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SettingsTable<ProductType>
            data={productTypes.getActive()}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            renderExtraColumns={(item) => (
              <div className="flex items-center gap-2">
                {item.isDefault && <Badge>Mặc định</Badge>}
              </div>
            )}
          />
        </CardContent>
      </Card>

      <ProductTypeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingItem}
        onSubmit={handleSubmit}
        existingIds={existingIds}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProductCategoriesTabContent() {
  const productCategories = useProductCategoryStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ProductCategory | null>(null);
  const [parentIdForNew, setParentIdForNew] = React.useState<string | undefined>(undefined);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);

  const activeCategories = React.useMemo(
    () => productCategories.data.filter(c => !c.isDeleted),
    [productCategories.data]
  );

  const existingIds = React.useMemo(
    () => activeCategories.map(c => c.id),
    [activeCategories]
  );

  const handleAdd = () => {
    setEditingItem(null);
    setParentIdForNew(undefined);
    setDialogOpen(true);
  };

  const handleAddChild = (parentId: string) => {
    setEditingItem(null);
    setParentIdForNew(parentId);
    setDialogOpen(true);
  };

  const handleEdit = (item: ProductCategory) => {
    setEditingItem(item);
    setParentIdForNew(undefined);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (systemId: string) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (idToDelete) {
      productCategories.remove(idToDelete);
      toast.success('Đã xóa danh mục sản phẩm');
    }
    setIsAlertOpen(false);
  };

  const handleSubmit = (data: any) => {
    try {
      if (editingItem) {
        productCategories.update(editingItem.systemId, { ...editingItem, ...data });
        toast.success('Đã cập nhật danh mục');
      } else {
        productCategories.add(data);
        toast.success('Đã thêm danh mục mới');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleMove = (systemId: string, newParentId: string | undefined, newSortOrder: number) => {
    const movedCategory = activeCategories.find(c => c.systemId === systemId);
    const newParent = newParentId ? activeCategories.find(c => c.systemId === newParentId) : null;
    
    // Count how many descendants will be moved
    const countDescendants = (parentId: string): number => {
      const children = activeCategories.filter(c => c.parentId === parentId);
      return children.length + children.reduce((sum, child) => sum + countDescendants(child.systemId), 0);
    };
    
    const descendantsCount = countDescendants(systemId);
    
    // Update the moved category
    productCategories.moveCategory(systemId, newParentId, newSortOrder);
    
    // Update sortOrder of siblings that are affected
    const siblings = activeCategories.filter(c => c.parentId === newParentId && c.systemId !== systemId);
    siblings.forEach((sibling, index) => {
      if (sibling.sortOrder >= newSortOrder) {
        productCategories.updateSortOrder(sibling.systemId, newSortOrder + index + 1);
      }
    });
    
    // Recalculate paths
    productCategories.recalculatePaths();
    
    if (movedCategory) {
      if (newParent) {
        if (descendantsCount > 0) {
          toast.success(`Đã di chuyển "${movedCategory.name}" và ${descendantsCount} danh mục con vào "${newParent.name}"`);
        } else {
          toast.success(`Đã di chuyển "${movedCategory.name}" vào "${newParent.name}"`);
        }
      } else {
        if (descendantsCount > 0) {
          toast.success(`Đã di chuyển "${movedCategory.name}" và ${descendantsCount} danh mục con thành danh mục gốc`);
        } else {
          toast.success(`Đã di chuyển "${movedCategory.name}" thành danh mục gốc`);
        }
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh mục sản phẩm</CardTitle>
              <CardDescription>
                Quản lý phân cấp danh mục sản phẩm (kéo thả để sắp xếp)
              </CardDescription>
            </div>
            <Button size="sm" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Thêm danh mục gốc
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CategoryTree
            categories={activeCategories}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            onAddChild={handleAddChild}
            onMove={handleMove}
          />
        </CardContent>
      </Card>

      <ProductCategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingItem}
        parentId={parentIdForNew}
        categories={activeCategories}
        onSubmit={handleSubmit}
        existingIds={existingIds}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StorageLocationsTabContent() {
  const { data, add, update, remove } = useStorageLocationStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingLocation, setEditingLocation] = React.useState<StorageLocation | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);

  const activeLocations = React.useMemo(() => data.filter(loc => !loc.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeLocations.map(loc => loc.id), [activeLocations]);

  const handleAddNew = () => { setEditingLocation(null); setIsFormOpen(true); };
  const handleEdit = (location: StorageLocation) => { setEditingLocation(location); setIsFormOpen(true); };
  const handleDeleteRequest = (systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); };

  const confirmDelete = () => {
    if (idToDelete) {
      remove(idToDelete);
      toast.success('Đã xóa điểm lưu kho');
    }
    setIsAlertOpen(false);
  };

  const handleFormSubmit = (values: { id: string; name: string; description?: string; isActive?: boolean }) => {
    if (editingLocation) {
      update(editingLocation.systemId, values);
      toast.success('Đã cập nhật điểm lưu kho');
    } else {
      add({ ...values, isActive: values.isActive ?? true, isDeleted: false });
      toast.success('Đã thêm điểm lưu kho mới');
    }
    setIsFormOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Điểm lưu kho</CardTitle>
            <CardDescription>Quản lý các điểm lưu kho trong kho hàng</CardDescription>
          </div>
          <Button onClick={handleAddNew} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Thêm mới
          </Button>
        </CardHeader>
        <CardContent>
          <SettingsTable
            data={activeLocations}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            renderExtraColumns={(location) => (
              <div className="flex items-center gap-2">
                {!location.isActive && <Badge variant="secondary">Không kích hoạt</Badge>}
              </div>
            )}
          />
        </CardContent>
      </Card>

      <StorageLocationFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingLocation}
        onSubmit={handleFormSubmit}
        existingIds={existingIds}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa điểm lưu kho này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function InventorySettingsPage() {
  const [activeTab, setActiveTab] = React.useState('units');

  const headerActions = React.useMemo(() => [], []);

  usePageHeader({
    title: 'Cài đặt kho hàng',
    breadcrumb: [
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Cài đặt kho hàng', href: '/settings/inventory' },
    ],
    actions: headerActions,
  });
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-full overflow-x-auto overflow-y-hidden mb-4 pb-1">
          <TabsList className="inline-flex w-auto gap-1 p-1 h-auto justify-start">
            <TabsTrigger value="units" className="flex-shrink-0">
              Đơn vị tính
            </TabsTrigger>
            <TabsTrigger value="types" className="flex-shrink-0">
              Loại sản phẩm
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex-shrink-0">
              Danh mục sản phẩm
            </TabsTrigger>
            <TabsTrigger value="storage-locations" className="flex-shrink-0">
              Điểm lưu kho
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="units">
          <UnitsTabContent />
        </TabsContent>

        <TabsContent value="types">
          <ProductTypesTabContent />
        </TabsContent>

        <TabsContent value="categories">
          <ProductCategoriesTabContent />
        </TabsContent>

        <TabsContent value="storage-locations">
          <StorageLocationsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
