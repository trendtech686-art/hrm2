import * as React from 'react';
import { Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VirtualizedCombobox, type ComboboxOption } from '@/components/ui/virtualized-combobox';
import { usePkgxSettingsStore } from '@/features/settings/pkgx/store';
import type { ProductCategory } from '@/features/settings/inventory/types';
import type { PkgxCategory } from '@/features/settings/pkgx/types';
import { getCategories as fetchPkgxCategories } from '@/lib/pkgx/api-service';

interface PkgxCategoryLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ProductCategory | null;
  onSuccess?: (pkgxCatId: number) => void;
}

export function PkgxCategoryLinkDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: PkgxCategoryLinkDialogProps) {
  const pkgxSettingsStore = usePkgxSettingsStore();
  const cachedPkgxCategories = pkgxSettingsStore.settings.categories;
  const categoryMappings = pkgxSettingsStore.settings.categoryMappings;
  const addCategoryMapping = pkgxSettingsStore.addCategoryMapping;
  const setCategories = pkgxSettingsStore.setCategories;
  
  const [selectedPkgxCategory, setSelectedPkgxCategory] = React.useState<ComboboxOption | null>(null);
  const [pkgxCategories, setPkgxCategoriesLocal] = React.useState<PkgxCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [hasFetched, setHasFetched] = React.useState(false);

  // Load PKGX categories khi mở dialog - chỉ chạy 1 lần
  React.useEffect(() => {
    if (open && !hasFetched) {
      if (cachedPkgxCategories && cachedPkgxCategories.length > 0) {
        setPkgxCategoriesLocal(cachedPkgxCategories);
        setHasFetched(true);
      } else {
        loadPkgxCategories();
      }
    }
  }, [open, hasFetched, cachedPkgxCategories]);

  // Reset state khi đóng dialog
  React.useEffect(() => {
    if (!open) {
      setSelectedPkgxCategory(null);
    }
  }, [open]);

  const loadPkgxCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetchPkgxCategories();
      if (response.success && response.data && response.data.data) {
        // API trả về { error, message, total, data: PkgxCategoryFromApi[] }
        // Cần map từ PkgxCategoryFromApi -> PkgxCategory
        const categoriesArray = response.data.data.map(c => ({
          id: c.cat_id,
          name: c.cat_name,
          parentId: c.parent_id || undefined,
          cat_desc: c.cat_desc,
          keywords: c.keywords,
          cat_alias: c.cat_alias,
          grade: c.grade,
        }));
        setPkgxCategoriesLocal(categoriesArray);
        setCategories(categoriesArray); // Lưu vào store để dùng chung
        setHasFetched(true);
      }
    } catch (error) {
      console.error('Failed to load PKGX categories:', error);
      toast.error('Không thể tải danh sách danh mục PKGX');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out categories that are already linked
  const linkedPkgxCatIds = React.useMemo(() => {
    return new Set(categoryMappings.map(m => m.pkgxCatId));
  }, [categoryMappings]);

  // Convert PKGX categories to combobox options
  const pkgxOptions: ComboboxOption[] = React.useMemo(() => {
    return pkgxCategories
      .filter(c => !linkedPkgxCatIds.has(c.id)) // Exclude already linked
      .map(c => ({
        value: String(c.id),
        label: c.name,
        subtitle: `ID: ${c.id}${c.parentId ? ` | Parent: ${c.parentId}` : ''}`,
        metadata: c,
      }));
  }, [pkgxCategories, linkedPkgxCatIds]);

  const handleConfirmLink = async () => {
    if (!category || !selectedPkgxCategory) {
      toast.error('Vui lòng chọn danh mục PKGX để liên kết');
      return;
    }

    setIsSyncing(true);
    try {
      const pkgxCatId = Number(selectedPkgxCategory.value);
      
      // Add mapping to store
      addCategoryMapping({
        id: `category-mapping-${category.systemId}-${pkgxCatId}`,
        hrmCategorySystemId: category.systemId,
        hrmCategoryName: category.name,
        pkgxCatId: pkgxCatId,
        pkgxCatName: selectedPkgxCategory.label,
      });
      
      // Log to console
      console.log('[PKGX Category Link]', {
        action: 'link_category',
        status: 'success',
        categoryId: category.systemId,
        pkgxCatId,
        pkgxCatName: selectedPkgxCategory.label,
      });

      toast.success(`Đã liên kết với danh mục PKGX: ${selectedPkgxCategory.label}`);
      onSuccess?.(pkgxCatId);
      onOpenChange(false);
    } catch (error) {
      console.error('[PKGX Category Link Error]', error);
      toast.error('Lỗi khi liên kết danh mục');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Liên kết với danh mục PKGX</DialogTitle>
          <DialogDescription>
            Chọn danh mục PKGX để liên kết với danh mục HRM này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* HRM Category Info */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Danh mục HRM:</p>
            <p className="text-sm">{category.name}</p>
            <p className="text-xs text-muted-foreground">
              Mã: {category.id} | SystemID: {category.systemId}
            </p>
          </div>

          {/* PKGX Category Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Chọn danh mục PKGX</label>
            <VirtualizedCombobox
              value={selectedPkgxCategory}
              onChange={setSelectedPkgxCategory}
              options={pkgxOptions}
              placeholder="Tìm và chọn danh mục PKGX..."
              searchPlaceholder="Tìm theo tên..."
              emptyPlaceholder={isLoading ? 'Đang tải...' : 'Không tìm thấy danh mục PKGX'}
              isLoading={isLoading}
              disabled={isLoading}
            />
            {pkgxOptions.length === 0 && !isLoading && (
              <p className="text-xs text-muted-foreground">
                Tất cả danh mục PKGX đã được liên kết. Hãy đồng bộ danh sách mới từ PKGX.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSyncing}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmLink}
            disabled={!selectedPkgxCategory || isSyncing}
          >
            <Link2 className="h-4 w-4 mr-2" />
            {isSyncing ? 'Đang liên kết...' : 'Liên kết'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
