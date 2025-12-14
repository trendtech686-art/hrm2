import * as React from "react";
import { Plus, Save } from "lucide-react";
import { asBusinessId, asSystemId, type SystemId } from "@/lib/id-types";
import { useSettingsPageHeader } from "../use-settings-page-header.tsx";
import { useUnitStore } from "../units/store.ts";
import { useProductTypeStore } from "./product-type-store.ts";
import { useProductCategoryStore } from "./product-category-store.ts";
import { useStorageLocationStore } from "./storage-location-store.ts";
import { useSlaSettingsStore } from "./sla-settings-store.ts";
import { useProductLogisticsSettingsStore } from "./logistics-settings-store.ts";
import { useWarrantySettingsStore, type WarrantySettings } from "./warranty-settings-store.ts";
import type { Unit } from "../units/types.ts";
import type { ProductType, ProductCategory, ProductSlaSettings, ProductLogisticsSettings } from "./types.ts";
import type { StorageLocation } from "./storage-location-types.ts";
import { UnitForm, type UnitFormValues } from "../units/form.tsx";
import {
  ProductTypeFormDialog,
  ProductCategoryFormDialog,
  type ProductTypeFormValues,
  type ProductCategoryFormValues,
} from "./setting-form-dialogs.tsx";
import { StorageLocationFormDialog, type StorageLocationFormValues } from "./storage-location-form-dialog.tsx";
import { CategoryManager } from "./category-manager.tsx";
import { CategoryTree } from "./category-tree.tsx";
import { getUnitColumns } from "../units/columns.tsx";
import { getProductTypeColumns } from "./product-type-columns.tsx";
import { TabsContent } from "../../../components/ui/tabs.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Switch } from "../../../components/ui/switch.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx";
import { SettingsTable } from "./settings-table.tsx";
import { toast } from "sonner";
import { SimpleSettingsTable } from "../../../components/settings/SimpleSettingsTable.tsx";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton.tsx";
import { SettingsVerticalTabs } from "../../../components/settings/SettingsVerticalTabs.tsx";
import { useTabActionRegistry, type RegisterTabActions } from "../use-tab-action-registry.ts";

type TabContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

import { useBrandStore } from "./brand-store.ts";
import type { Brand, Importer } from "./types.ts";
import { BrandFormDialog, type BrandFormValues } from "./brand-form-dialog.tsx";
import { getBrandColumns } from "./brand-columns.tsx";

// Importer imports
import { useImporterStore } from "./importer-store.ts";
import { ImporterFormDialog, type ImporterFormValues } from "./importer-form-dialog.tsx";
import { getImporterColumns } from "./importer-columns.tsx";

function BrandsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { data, add, update, remove } = useBrandStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Brand | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

  const activeBrands = React.useMemo(() => data.filter(b => !b.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeBrands.map(b => b.id), [activeBrands]);

  const handleAdd = React.useCallback(() => {
    setEditingItem(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = React.useCallback((item: Brand) => {
    setEditingItem(item);
    setDialogOpen(true);
  }, []);

  const handleDeleteRequest = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);

  const handleToggleActive = React.useCallback((item: Brand) => {
    const newActive = !item.isActive;
    update(item.systemId, { ...item, isActive: newActive });
    toast.success(newActive ? 'Đã kích hoạt' : 'Đã tắt');
  }, [update]);

  const confirmDelete = () => {
    if (idToDelete) {
      remove(idToDelete);
      toast.success('Đã xóa thương hiệu');
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  const handleSubmit = (values: BrandFormValues) => {
    const payload = { ...values, id: asBusinessId(values.id) };
    if (editingItem) {
      update(editingItem.systemId, payload);
      toast.success('Đã cập nhật thương hiệu');
    } else {
      add(payload);
      toast.success('Đã thêm thương hiệu mới');
    }
    setDialogOpen(false);
  };

  const columns = React.useMemo(
    () => getBrandColumns({ 
      onEdit: handleEdit, 
      onDelete: handleDeleteRequest,
      onToggleActive: handleToggleActive,
    }),
    [handleDeleteRequest, handleEdit, handleToggleActive],
  );

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActions([
      <SettingsActionButton key="add-brand" onClick={handleAdd}>
        <Plus className="mr-2 h-4 w-4" /> Thêm thương hiệu
      </SettingsActionButton>,
    ]);
  }, [handleAdd, isActive, onRegisterActions]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Thương hiệu sản phẩm</CardTitle>
              <CardDescription>
                Quản lý các thương hiệu sản phẩm
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleSettingsTable
            data={activeBrands}
            columns={columns}
            emptyTitle="Chưa có thương hiệu"
            emptyDescription="Thêm thương hiệu đầu tiên để quản lý sản phẩm"
            emptyAction={
              <Button size="sm" onClick={handleAdd}>
                Thêm thương hiệu
              </Button>
            }
          />
        </CardContent>
      </Card>

      <BrandFormDialog
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

function ImportersTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { data, add, update, remove, setDefault } = useImporterStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Importer | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

  const activeImporters = React.useMemo(() => data.filter(b => !b.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeImporters.map(b => b.id), [activeImporters]);

  const handleAdd = React.useCallback(() => {
    setEditingItem(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = React.useCallback((item: Importer) => {
    setEditingItem(item);
    setDialogOpen(true);
  }, []);

  const handleDeleteRequest = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);

  const handleToggleActive = React.useCallback((item: Importer) => {
    const newActive = !item.isActive;
    update(item.systemId, { ...item, isActive: newActive });
    toast.success(newActive ? 'Đã kích hoạt' : 'Đã tắt');
  }, [update]);

  const handleToggleDefault = React.useCallback((item: Importer) => {
    if (!item.isDefault) {
      setDefault(item.systemId);
      toast.success('Đã đặt làm mặc định');
    }
  }, [setDefault]);

  const confirmDelete = () => {
    if (idToDelete) {
      remove(idToDelete);
      toast.success('Đã xóa đơn vị nhập khẩu');
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  const handleSubmit = (values: ImporterFormValues) => {
    const payload = { ...values, id: asBusinessId(values.id) };
    if (editingItem) {
      update(editingItem.systemId, payload);
      toast.success('Đã cập nhật đơn vị nhập khẩu');
    } else {
      add(payload);
      toast.success('Đã thêm đơn vị nhập khẩu mới');
    }
    setDialogOpen(false);
  };

  const columns = React.useMemo(
    () => getImporterColumns({ 
      onEdit: handleEdit, 
      onDelete: handleDeleteRequest,
      onToggleActive: handleToggleActive,
      onToggleDefault: handleToggleDefault,
    }),
    [handleDeleteRequest, handleEdit, handleToggleActive, handleToggleDefault],
  );

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActions([
      <SettingsActionButton key="add-importer" onClick={handleAdd}>
        <Plus className="mr-2 h-4 w-4" /> Thêm đơn vị nhập khẩu
      </SettingsActionButton>,
    ]);
  }, [handleAdd, isActive, onRegisterActions]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Đơn vị nhập khẩu</CardTitle>
              <CardDescription>
                Quản lý các đơn vị nhập khẩu để in tem phụ sản phẩm
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleSettingsTable
            data={activeImporters}
            columns={columns}
            emptyTitle="Chưa có đơn vị nhập khẩu"
            emptyDescription="Thêm đơn vị nhập khẩu đầu tiên để in tem phụ sản phẩm"
            emptyAction={
              <Button size="sm" onClick={handleAdd}>
                Thêm đơn vị nhập khẩu
              </Button>
            }
          />
        </CardContent>
      </Card>

      <ImporterFormDialog
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

function UnitsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { data, add, update, remove } = useUnitStore();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState<Unit | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

  const handleAddNew = React.useCallback(() => {
    setEditingUnit(null);
    setIsFormOpen(true);
  }, []);
  const handleEdit = React.useCallback((unit: Unit) => {
    setEditingUnit(unit);
    setIsFormOpen(true);
  }, []);
  const handleDeleteRequest = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);
  
  const handleToggleDefault = React.useCallback((unit: Unit, checked: boolean) => {
    if (checked) {
      // Clear default from all others, then set this one
      data.forEach(u => {
        if (u.isDefault && u.systemId !== unit.systemId) {
          update(u.systemId, { ...u, isDefault: false });
        }
      });
      update(unit.systemId, { ...unit, isDefault: true });
      toast.success(`Đã đặt "${unit.name}" làm mặc định`);
    } else {
      // Find another unit to set as default
      const otherUnits = data.filter(u => u.systemId !== unit.systemId && u.isActive !== false);
      if (otherUnits.length > 0) {
        const newDefault = otherUnits[0];
        update(unit.systemId, { ...unit, isDefault: false });
        update(newDefault.systemId, { ...newDefault, isDefault: true });
        toast.success(`Đã chuyển mặc định sang "${newDefault.name}"`);
      } else {
        toast.error('Phải có ít nhất một đơn vị tính mặc định');
      }
    }
  }, [data, update]);

  const handleToggleActive = React.useCallback((unit: Unit) => {
    const newActive = unit.isActive === false ? true : false;
    update(unit.systemId, { ...unit, isActive: newActive });
    toast.success(newActive ? 'Đã kích hoạt' : 'Đã tắt');
  }, [update]);
  
  const confirmDelete = () => { 
    if (idToDelete) {
      remove(idToDelete);
      toast.success('Đã xóa đơn vị tính');
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };
  
  const handleFormSubmit = (values: UnitFormValues) => {
    const payload: UnitFormValues = { ...values, id: asBusinessId(values.id) };
    if (editingUnit) {
      update(editingUnit.systemId, { ...editingUnit, ...payload });
      toast.success('Đã cập nhật đơn vị tính');
    } else {
      add(payload);
      toast.success('Đã thêm đơn vị tính mới');
    }
    setIsFormOpen(false);
  };

  const columns = React.useMemo(() => getUnitColumns({
    onEdit: handleEdit, 
    onDelete: handleDeleteRequest,
    onToggleDefault: handleToggleDefault,
    onToggleActive: handleToggleActive,
  }), [handleDeleteRequest, handleEdit, handleToggleDefault, handleToggleActive]);
  
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);
  
  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActions([
      <SettingsActionButton key="add-unit" onClick={handleAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Thêm đơn vị tính
      </SettingsActionButton>,
    ]);
  }, [handleAddNew, isActive, onRegisterActions]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách Đơn vị tính</CardTitle>
              <CardDescription>Quản lý các đơn vị tính được sử dụng cho sản phẩm.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleSettingsTable
            data={sortedData}
            columns={columns}
            emptyTitle="Chưa có đơn vị tính"
            emptyDescription="Thêm đơn vị đầu tiên để chuẩn hóa quy đổi sản phẩm"
            emptyAction={
              <Button size="sm" onClick={handleAddNew}>
                Thêm đơn vị tính
              </Button>
            }
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

function ProductTypesTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { data, add, update, remove } = useProductTypeStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ProductType | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

  const activeProductTypes = React.useMemo(() => data.filter(t => !t.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeProductTypes.map(t => t.id), [activeProductTypes]);

  const handleAdd = React.useCallback(() => {
    setEditingItem(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = React.useCallback((item: ProductType) => {
    setEditingItem(item);
    setDialogOpen(true);
  }, []);

  const handleDeleteRequest = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);

  const handleToggleDefault = React.useCallback((item: ProductType) => {
    // Clear default from all others, then set this one
    data.forEach(t => {
      if (t.isDefault && t.systemId !== item.systemId && !t.isDeleted) {
        update(t.systemId, { ...t, isDefault: false });
      }
    });
    update(item.systemId, { ...item, isDefault: !item.isDefault });
    toast.success(item.isDefault ? 'Đã bỏ mặc định' : 'Đã đặt làm mặc định');
  }, [data, update]);

  const handleToggleActive = React.useCallback((item: ProductType) => {
    const newActive = item.isActive === false ? true : false;
    update(item.systemId, { ...item, isActive: newActive });
    toast.success(newActive ? 'Đã kích hoạt' : 'Đã tắt');
  }, [update]);

  const confirmDelete = () => {
    if (idToDelete) {
      remove(idToDelete);
      toast.success('Đã xóa loại sản phẩm');
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  const handleSubmit = (values: ProductTypeFormValues) => {
    const payload = { ...values, id: asBusinessId(values.id) };
    if (editingItem) {
      update(editingItem.systemId, payload);
      toast.success('Đã cập nhật loại sản phẩm');
    } else {
      add(payload);
      toast.success('Đã thêm loại sản phẩm mới');
    }
    setDialogOpen(false);
  };

  const columns = React.useMemo(
    () => getProductTypeColumns({ 
      onEdit: handleEdit, 
      onDelete: handleDeleteRequest,
      onToggleDefault: handleToggleDefault,
      onToggleActive: handleToggleActive,
    }),
    [handleDeleteRequest, handleEdit, handleToggleDefault, handleToggleActive],
  );

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActions([
      <SettingsActionButton key="add-product-type" onClick={handleAdd}>
        <Plus className="mr-2 h-4 w-4" /> Thêm loại sản phẩm
      </SettingsActionButton>,
    ]);
  }, [handleAdd, isActive, onRegisterActions]);

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
          </div>
        </CardHeader>
        <CardContent>
          <SimpleSettingsTable
            data={activeProductTypes}
            columns={columns}
            emptyTitle="Chưa có loại sản phẩm"
            emptyDescription="Thêm loại sản phẩm đầu tiên để cấu hình tồn kho"
            emptyAction={
              <Button size="sm" onClick={handleAdd}>
                Thêm loại sản phẩm
              </Button>
            }
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

function ProductCategoriesTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const productCategories = useProductCategoryStore();

  const activeCategories = React.useMemo(
    () => productCategories.data.filter(c => !c.isDeleted),
    [productCategories.data]
  );

  const existingIds = React.useMemo(
    () => activeCategories.map(c => c.id),
    [activeCategories]
  );

  const handleAdd = React.useCallback((data: any) => {
    try {
      const payload = {
        ...data,
        // Auto-generate id from slug or name
        id: asBusinessId(data.slug || data.name.toLowerCase().replace(/\s+/g, '-')),
        parentId: data.parentId ? asSystemId(data.parentId) : undefined,
      };
      productCategories.add(payload);
      toast.success('Đã thêm danh mục mới');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  }, [productCategories]);

  const handleUpdate = React.useCallback((systemId: SystemId, data: any) => {
    try {
      const payload = {
        ...data,
        parentId: data.parentId ? asSystemId(data.parentId) : undefined,
      };
      productCategories.update(systemId, payload);
      toast.success('Đã cập nhật danh mục');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  }, [productCategories]);

  const handleDelete = React.useCallback((systemId: SystemId) => {
    productCategories.remove(systemId);
    toast.success('Đã xóa danh mục sản phẩm');
  }, [productCategories]);

  const handleMove = React.useCallback((systemId: SystemId, newParentId: SystemId | undefined, newSortOrder: number) => {
    const movedCategory = activeCategories.find(c => c.systemId === systemId);
    const newParent = newParentId ? activeCategories.find(c => c.systemId === newParentId) : null;
    
    // Count how many descendants will be moved
    const countDescendants = (parentId: SystemId): number => {
      const children = activeCategories.filter(c => c.parentId === parentId);
      return children.length + children.reduce((sum, child) => sum + countDescendants(child.systemId), 0);
    };
    
    const descendantsCount = countDescendants(systemId);
    
    // Update the moved category
    productCategories.moveCategory(systemId, newParentId, newSortOrder);
    
    // Update sortOrder of siblings that are affected
    const siblings = activeCategories.filter(c => c.parentId === newParentId && c.systemId !== systemId);
    siblings.forEach((sibling, index) => {
      if ((sibling.sortOrder ?? 0) >= newSortOrder) {
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
  }, [activeCategories, productCategories]);

  // No header actions for this tab - actions are built into the component
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([]);
  }, [isActive, onRegisterActions]);

  return (
    <CategoryManager
      categories={activeCategories}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onMove={handleMove}
      existingIds={existingIds}
    />
  );
}

function StorageLocationsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { data, add, update, remove } = useStorageLocationStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingLocation, setEditingLocation] = React.useState<StorageLocation | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

  const activeLocations = React.useMemo(() => data.filter(loc => !loc.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeLocations.map(loc => loc.id), [activeLocations]);

  const handleAddNew = React.useCallback(() => {
    setEditingLocation(null);
    setIsFormOpen(true);
  }, []);
  const handleEdit = React.useCallback((location: StorageLocation) => {
    setEditingLocation(location);
    setIsFormOpen(true);
  }, []);
  const handleDeleteRequest = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);

  const handleToggleDefault = React.useCallback((location: StorageLocation) => {
    // Clear default from all others, then set this one
    data.forEach(loc => {
      if (loc.isDefault && loc.systemId !== location.systemId && !loc.isDeleted) {
        update(loc.systemId, { ...loc, isDefault: false });
      }
    });
    update(location.systemId, { ...location, isDefault: !location.isDefault });
    toast.success(location.isDefault ? 'Đã bỏ mặc định' : 'Đã đặt làm mặc định');
  }, [data, update]);

  const handleToggleActive = React.useCallback((location: StorageLocation) => {
    const newActive = !location.isActive;
    update(location.systemId, { ...location, isActive: newActive });
    toast.success(newActive ? 'Đã kích hoạt' : 'Đã tắt');
  }, [update]);

  const confirmDelete = () => {
    if (idToDelete) {
      remove(idToDelete);
      toast.success('Đã xóa điểm lưu kho');
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  const handleFormSubmit = (values: StorageLocationFormValues) => {
    const payload = {
      ...values,
      id: asBusinessId(values.id),
      isActive: values.isActive ?? true,
    };
    if (editingLocation) {
      update(editingLocation.systemId, payload);
      toast.success('Đã cập nhật điểm lưu kho');
    } else {
      add({
        ...payload,
        isActive: values.isActive ?? true,
        isDeleted: false,
      });
      toast.success('Đã thêm điểm lưu kho mới');
    }
    setIsFormOpen(false);
  };

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActions([
      <SettingsActionButton key="add-storage-location" onClick={handleAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Thêm điểm lưu kho
      </SettingsActionButton>,
    ]);
  }, [handleAddNew, isActive, onRegisterActions]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Điểm lưu kho</CardTitle>
            <CardDescription>Quản lý các điểm lưu kho trong kho hàng</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <SettingsTable
            data={activeLocations}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
            onToggleDefault={handleToggleDefault}
            onToggleActive={handleToggleActive}
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

function LogisticsSettingsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { settings, save } = useProductLogisticsSettingsStore();
  const [localSettings, setLocalSettings] = React.useState<ProductLogisticsSettings>(settings);
  const [isSaving, setIsSaving] = React.useState(false);

  // Use ref to keep handleSave stable while accessing latest state
  const localSettingsRef = React.useRef(localSettings);
  React.useEffect(() => {
    localSettingsRef.current = localSettings;
  }, [localSettings]);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const hasChanges = React.useMemo(() => {
    return JSON.stringify(localSettings) !== JSON.stringify(settings);
  }, [localSettings, settings]);

  const updatePreset = (presetKey: keyof ProductLogisticsSettings, field: 'weight' | 'weightUnit' | 'length' | 'width' | 'height', value: number | string | undefined) => {
    setLocalSettings((prev) => ({
      ...prev,
      [presetKey]: {
        ...prev[presetKey],
        [field]: value,
      },
    }));
  };

  const handleSave = React.useCallback(() => {
    setIsSaving(true);
    try {
      save(localSettingsRef.current);
      toast.success('Đã lưu cài đặt khối lượng & kích thước');
    } catch (error) {
      toast.error('Không thể lưu cài đặt khối lượng');
    } finally {
      setIsSaving(false);
    }
  }, [save]);

  React.useEffect(() => {
    if (!isActive) return;

    onRegisterActions([
      <SettingsActionButton 
        key="save-logistics"
        onClick={handleSave}
        disabled={!hasChanges || isSaving}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  const renderPreset = (title: string, presetKey: keyof ProductLogisticsSettings, description: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Khối lượng mặc định</Label>
            <Input
              type="number"
              value={localSettings[presetKey]?.weight ?? ''}
              onChange={(e) => updatePreset(presetKey, 'weight', e.target.value === '' ? undefined : Number(e.target.value))}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">Áp dụng khi tạo sản phẩm mới</p>
          </div>
          <div className="space-y-2">
            <Label>Đơn vị khối lượng</Label>
            <Select
              value={localSettings[presetKey]?.weightUnit ?? 'g'}
              onValueChange={(value) => updatePreset(presetKey, 'weightUnit', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">g (gram)</SelectItem>
                <SelectItem value="kg">kg (kilogram)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Kích thước (cm)</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Input
                type="number"
                value={localSettings[presetKey]?.length ?? ''}
                onChange={(e) => updatePreset(presetKey, 'length', e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="Dài"
              />
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                value={localSettings[presetKey]?.width ?? ''}
                onChange={(e) => updatePreset(presetKey, 'width', e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="Rộng"
              />
            </div>
            <div className="space-y-1">
              <Input
                type="number"
                value={localSettings[presetKey]?.height ?? ''}
                onChange={(e) => updatePreset(presetKey, 'height', e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="Cao"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Dùng để ước tính phí vận chuyển</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderPreset('Sản phẩm thông thường', 'physicalDefaults', 'Áp dụng cho hàng hóa vật lý, dịch vụ đóng gói sẵn')}
      {renderPreset('Combo sản phẩm', 'comboDefaults', 'Áp dụng khi tạo sản phẩm combo mới')}
    </div>
  );
}

function SlaSettingsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { settings, update } = useSlaSettingsStore();
  const [localSettings, setLocalSettings] = React.useState<ProductSlaSettings>(settings);
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Use ref to keep handleSave stable while accessing latest state
  const localSettingsRef = React.useRef(localSettings);
  React.useEffect(() => {
    localSettingsRef.current = localSettings;
  }, [localSettings]);

  // Check if there are unsaved changes by comparing with store
  const hasChanges = React.useMemo(() => {
    return JSON.stringify(localSettings) !== JSON.stringify(settings);
  }, [localSettings, settings]);

  // Sync local state when store changes (e.g., from reset or external update)
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = <K extends keyof ProductSlaSettings>(key: K, value: ProductSlaSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = React.useCallback(() => {
    setIsSaving(true);
    try {
      update(localSettingsRef.current);
      toast.success('Đã lưu cài đặt cảnh báo tồn kho');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  }, [update]);

  // Register header actions
  React.useEffect(() => {
    if (!isActive) return;

    onRegisterActions([
      <SettingsActionButton 
        key="save-sla"
        onClick={handleSave} 
        disabled={!hasChanges || isSaving}
      >
        <Save className="mr-2 h-4 w-4" /> 
        {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  const alertTypeOptions = [
    { value: 'out_of_stock', label: 'Hết hàng' },
    { value: 'low_stock', label: 'Sắp hết hàng' },
    { value: 'below_safety', label: 'Dưới tồn kho an toàn' },
    { value: 'over_stock', label: 'Vượt tồn kho tối đa' },
    { value: 'dead_stock', label: 'Hàng tồn lâu' },
  ];

  return (
    <div className="space-y-6">
      {/* Ngưỡng cảnh báo mặc định */}
      <Card>
        <CardHeader>
          <CardTitle>Ngưỡng cảnh báo mặc định</CardTitle>
          <CardDescription>
            Áp dụng cho các sản phẩm không có cấu hình riêng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultReorderLevel">Mức đặt hàng lại</Label>
              <Input
                id="defaultReorderLevel"
                type="number"
                min={0}
                value={localSettings.defaultReorderLevel ?? 10}
                onChange={(e) => handleChange('defaultReorderLevel', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Cảnh báo khi tồn kho ≤ giá trị này
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultSafetyStock">Tồn kho an toàn</Label>
              <Input
                id="defaultSafetyStock"
                type="number"
                min={0}
                value={localSettings.defaultSafetyStock ?? 5}
                onChange={(e) => handleChange('defaultSafetyStock', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Mức tối thiểu để tránh hết hàng
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultMaxStock">Tồn kho tối đa</Label>
              <Input
                id="defaultMaxStock"
                type="number"
                min={0}
                value={localSettings.defaultMaxStock ?? 100}
                onChange={(e) => handleChange('defaultMaxStock', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Cảnh báo tồn kho vượt quá
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cảnh báo hàng tồn lâu */}
      <Card>
        <CardHeader>
          <CardTitle>Cảnh báo hàng tồn kho lâu</CardTitle>
          <CardDescription>
            Phát hiện hàng chậm bán hoặc hàng chết
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slowMovingDays">Hàng chậm bán (ngày)</Label>
              <Input
                id="slowMovingDays"
                type="number"
                min={1}
                value={localSettings.slowMovingDays ?? 30}
                onChange={(e) => handleChange('slowMovingDays', parseInt(e.target.value) || 30)}
              />
              <p className="text-xs text-muted-foreground">
                Không bán trong X ngày → Hàng chậm
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadStockDays">Hàng chết (ngày)</Label>
              <Input
                id="deadStockDays"
                type="number"
                min={1}
                value={localSettings.deadStockDays ?? 90}
                onChange={(e) => handleChange('deadStockDays', parseInt(e.target.value) || 90)}
              />
              <p className="text-xs text-muted-foreground">
                Không bán trong X ngày → Hàng chết
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông báo email */}
      <Card>
        <CardHeader>
          <CardTitle>Thông báo email</CardTitle>
          <CardDescription>
            Gửi cảnh báo tự động qua email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Bật thông báo email</Label>
              <p className="text-xs text-muted-foreground">
                Gửi email khi có cảnh báo tồn kho
              </p>
            </div>
            <Switch
              checked={localSettings.enableEmailAlerts ?? false}
              onCheckedChange={(checked) => handleChange('enableEmailAlerts', checked)}
            />
          </div>
          
          {localSettings.enableEmailAlerts && (
            <>
              <div className="space-y-2">
                <Label>Tần suất gửi</Label>
                <Select
                  value={localSettings.alertFrequency ?? 'daily'}
                  onValueChange={(value) => handleChange('alertFrequency', value as ProductSlaSettings['alertFrequency'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Thời gian thực</SelectItem>
                    <SelectItem value="daily">Hàng ngày</SelectItem>
                    <SelectItem value="weekly">Hàng tuần</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Email nhận thông báo</Label>
                <Input
                  placeholder="email1@example.com, email2@example.com"
                  value={(localSettings.alertEmailRecipients ?? []).join(', ')}
                  onChange={(e) => handleChange('alertEmailRecipients', 
                    e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Phân cách nhiều email bằng dấu phẩy
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Hiển thị Dashboard</CardTitle>
          <CardDescription>
            Cấu hình widget cảnh báo tồn kho trên Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Hiện trên Dashboard</Label>
              <p className="text-xs text-muted-foreground">
                Hiển thị widget cảnh báo trên trang chủ
              </p>
            </div>
            <Switch
              checked={localSettings.showOnDashboard ?? true}
              onCheckedChange={(checked) => handleChange('showOnDashboard', checked)}
            />
          </div>
          
          {localSettings.showOnDashboard && (
            <div className="space-y-2">
              <Label>Loại cảnh báo hiển thị</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {alertTypeOptions.map((option) => {
                  const isSelected = (localSettings.dashboardAlertTypes ?? []).includes(option.value as any);
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const current = localSettings.dashboardAlertTypes ?? [];
                        const newValue = isSelected
                          ? current.filter(t => t !== option.value)
                          : [...current, option.value as any];
                        handleChange('dashboardAlertTypes', newValue);
                      }}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WarrantySettingsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { settings, update } = useWarrantySettingsStore();
  const [localSettings, setLocalSettings] = React.useState<WarrantySettings>(settings);
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Use ref to keep handleSave stable while accessing latest state
  const localSettingsRef = React.useRef(localSettings);
  React.useEffect(() => {
    localSettingsRef.current = localSettings;
  }, [localSettings]);

  // Check if there are unsaved changes by comparing with store
  const hasChanges = React.useMemo(() => {
    return JSON.stringify(localSettings) !== JSON.stringify(settings);
  }, [localSettings, settings]);

  // Sync local state when store changes
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = <K extends keyof WarrantySettings>(key: K, value: WarrantySettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = React.useCallback(() => {
    setIsSaving(true);
    try {
      update(localSettingsRef.current);
      toast.success('Đã lưu cài đặt bảo hành');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  }, [update]);

  // Register header actions
  React.useEffect(() => {
    if (!isActive) return;

    onRegisterActions([
      <SettingsActionButton 
        key="save-warranty"
        onClick={handleSave} 
        disabled={!hasChanges || isSaving}
      >
        <Save className="mr-2 h-4 w-4" /> 
        {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt bảo hành mặc định</CardTitle>
          <CardDescription>
            Thời hạn bảo hành sẽ được áp dụng khi sản phẩm không có cấu hình riêng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="defaultWarrantyMonths">Thời hạn bảo hành mặc định (tháng)</Label>
            <Input
              id="defaultWarrantyMonths"
              type="number"
              min={0}
              max={120}
              value={localSettings.defaultWarrantyMonths ?? 12}
              onChange={(e) => handleChange('defaultWarrantyMonths', parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Áp dụng cho các sản phẩm không được cài đặt thời hạn bảo hành riêng
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InventorySettingsPage() {
  const [activeTab, setActiveTab] = React.useState('units');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);
  const registerUnitActions = React.useMemo(() => registerActions('units'), [registerActions]);
  const registerTypeActions = React.useMemo(() => registerActions('types'), [registerActions]);
  const registerCategoryActions = React.useMemo(() => registerActions('categories'), [registerActions]);
  const registerBrandActions = React.useMemo(() => registerActions('brands'), [registerActions]);
  const registerImporterActions = React.useMemo(() => registerActions('importers'), [registerActions]);
  const registerStorageActions = React.useMemo(() => registerActions('storage-locations'), [registerActions]);
  const registerSlaActions = React.useMemo(() => registerActions('sla-settings'), [registerActions]);
  const registerLogisticsActions = React.useMemo(() => registerActions('logistics-settings'), [registerActions]);
  const registerWarrantyActions = React.useMemo(() => registerActions('warranty-settings'), [registerActions]);

  useSettingsPageHeader({
    title: 'Cài đặt kho hàng',
    actions: headerActions,
  });
  
  const tabs = React.useMemo(
    () => [
      { value: 'units', label: 'Đơn vị tính' },
      { value: 'types', label: 'Loại sản phẩm' },
      { value: 'categories', label: 'Danh mục sản phẩm' },
      { value: 'brands', label: 'Thương hiệu' },
      { value: 'importers', label: 'Đơn vị nhập khẩu' },
      { value: 'storage-locations', label: 'Điểm lưu kho' },
      { value: 'logistics-settings', label: 'Khối lượng & kích thước' },
      { value: 'warranty-settings', label: 'Bảo hành' },
      { value: 'sla-settings', label: 'Cảnh báo tồn kho' },
    ],
    [],
  );

  return (
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      <TabsContent value="units" className="mt-0">
        <UnitsTabContent isActive={activeTab === 'units'} onRegisterActions={registerUnitActions} />
      </TabsContent>

      <TabsContent value="types" className="mt-0">
        <ProductTypesTabContent isActive={activeTab === 'types'} onRegisterActions={registerTypeActions} />
      </TabsContent>

      <TabsContent value="categories" className="mt-0">
        <ProductCategoriesTabContent isActive={activeTab === 'categories'} onRegisterActions={registerCategoryActions} />
      </TabsContent>

      <TabsContent value="brands" className="mt-0">
        <BrandsTabContent isActive={activeTab === 'brands'} onRegisterActions={registerBrandActions} />
      </TabsContent>

      <TabsContent value="importers" className="mt-0">
        <ImportersTabContent isActive={activeTab === 'importers'} onRegisterActions={registerImporterActions} />
      </TabsContent>

      <TabsContent value="storage-locations" className="mt-0">
        <StorageLocationsTabContent
          isActive={activeTab === 'storage-locations'}
          onRegisterActions={registerStorageActions}
        />
      </TabsContent>

      <TabsContent value="logistics-settings" className="mt-0">
        <LogisticsSettingsTabContent
          isActive={activeTab === 'logistics-settings'}
          onRegisterActions={registerLogisticsActions}
        />
      </TabsContent>

      <TabsContent value="warranty-settings" className="mt-0">
        <WarrantySettingsTabContent
          isActive={activeTab === 'warranty-settings'}
          onRegisterActions={registerWarrantyActions}
        />
      </TabsContent>

      <TabsContent value="sla-settings" className="mt-0">
        <SlaSettingsTabContent
          isActive={activeTab === 'sla-settings'}
          onRegisterActions={registerSlaActions}
        />
      </TabsContent>
    </SettingsVerticalTabs>
  );
}
