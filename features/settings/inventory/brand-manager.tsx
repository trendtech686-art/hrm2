import * as React from 'react';
import { 
  Plus, 
  Trash2, 
  Search,
  Tags,
  MoreVertical,
  Power,
  Pencil,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { OptimizedImage } from '../../../components/ui/optimized-image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import type { Brand } from './types';
import { type SystemId } from '@/lib/id-types';
import { toast } from 'sonner';
import { BrandDetailForm, type BrandFormValues } from './brand-detail-form';

// Re-export BrandFormValues for backward compatibility
export type { BrandFormValues } from './brand-detail-form';

// =============================================================================
// TYPES
// =============================================================================

interface BrandManagerProps {
  brands: Brand[];
  onAdd: (data: BrandFormValues) => void;
  onUpdate: (systemId: SystemId, data: Partial<BrandFormValues>) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleActive: (systemId: SystemId, isActive: boolean) => void;
  existingIds: string[];
  /** Ref để expose hàm addNew từ PageHeader */
  addNewRef?: React.RefObject<{ addNew: () => void } | null>;
}

// =============================================================================
// BRAND LIST ITEM
// =============================================================================

interface BrandListItemProps {
  brand: Brand;
  isSelected: boolean;
  onSelect: (brand: Brand) => void;
  onToggleActive: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
  searchTerm: string;
}

function BrandListItem({
  brand,
  isSelected,
  onSelect,
  onToggleActive,
  onDelete,
  searchTerm,
}: BrandListItemProps) {
  const matchesSearch = searchTerm && brand.name.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all',
        'hover:bg-accent border border-transparent',
        isSelected && 'bg-primary/10 border-primary/20',
        matchesSearch && !isSelected && 'bg-yellow-50 dark:bg-yellow-900/20',
      )}
      onClick={() => onSelect(brand)}
    >
      {/* Logo or Icon */}
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
        brand.logo ? 'bg-background border' : 'bg-primary/10'
      )}>
        {brand.logo ? (
          <OptimizedImage src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain" width={32} height={32} />
        ) : (
          <Tags className="h-5 w-5 text-primary" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-medium truncate',
            !brand.isActive && 'text-muted-foreground'
          )}>
            {brand.name}
          </span>
          {!brand.isActive && (
            <Badge variant="secondary" className="h-5 text-xs">
              Ẩn
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {brand.id}
          {brand.website && (
            <>
              <span className="mx-1">•</span>
              <span className="truncate">{brand.website}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:opacity-0 md:group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onSelect(brand);
          }}>
            <Pencil className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onToggleActive(brand);
          }}>
            <Power className="h-4 w-4 mr-2" />
            {brand.isActive ? 'Tắt' : 'Bật'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(brand);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function BrandManager({
  brands,
  onAdd,
  onUpdate,
  onDelete,
  onToggleActive,
  existingIds,
  addNewRef,
}: BrandManagerProps) {
  const [selectedBrand, setSelectedBrand] = React.useState<Brand | null>(null);
  const [isNewMode, setIsNewMode] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [brandToDelete, setBrandToDelete] = React.useState<Brand | null>(null);

  // Expose addNew function via ref for PageHeader
  React.useImperativeHandle(addNewRef, () => ({
    addNew: () => {
      setSelectedBrand(null);
      setIsNewMode(true);
    }
  }), []);

  // Sort brands by name
  const sortedBrands = React.useMemo(
    () => [...brands].sort((a, b) => a.name.localeCompare(b.name)),
    [brands]
  );

  // Filter by search
  const filteredBrands = React.useMemo(() => {
    if (!searchTerm) return sortedBrands;
    const term = searchTerm.toLowerCase();
    return sortedBrands.filter(
      b => b.name.toLowerCase().includes(term) || b.id.toLowerCase().includes(term)
    );
  }, [sortedBrands, searchTerm]);

  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsNewMode(false);
  };

  const handleAddNew = () => {
    setSelectedBrand(null);
    setIsNewMode(true);
  };

  const handleSave = (data: BrandFormValues) => {
    if (isNewMode) {
      onAdd(data);
      setIsNewMode(false);
      toast.success('Đã thêm thương hiệu mới');
    } else if (selectedBrand) {
      onUpdate(selectedBrand.systemId, data);
      toast.success('Đã cập nhật thương hiệu');
    }
  };

  const handleCancel = () => {
    setIsNewMode(false);
    if (!selectedBrand && brands.length > 0) {
      setSelectedBrand(sortedBrands[0] || null);
    }
  };

  const handleToggleActive = (brand: Brand) => {
    onToggleActive(brand.systemId, !brand.isActive);
    toast.success(brand.isActive ? 'Đã tắt thương hiệu' : 'Đã bật thương hiệu');
  };

  const handleDeleteRequest = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (brandToDelete) {
      onDelete(brandToDelete.systemId);
      if (selectedBrand?.systemId === brandToDelete.systemId) {
        setSelectedBrand(null);
      }
      toast.success('Đã xóa thương hiệu');
    }
    setDeleteDialogOpen(false);
    setBrandToDelete(null);
  };

  const totalCount = brands.length;
  const activeCount = brands.filter(b => b.isActive).length;

  return (
    <>
      <div className="h-[calc(100vh-140px)] flex border rounded-lg overflow-hidden bg-background">
        {/* Left Panel - Brand List */}
        <div className="w-80 border-r flex flex-col bg-muted/30">
          {/* Header */}
          <div className="p-3 border-b space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">
                  Thương hiệu ({totalCount})
                </div>
                <div className="text-xs text-muted-foreground">
                  {activeCount} đang hoạt động
                </div>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          {/* Brand List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredBrands.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {searchTerm ? 'Không tìm thấy thương hiệu' : 'Chưa có thương hiệu nào'}
                </div>
              ) : (
                filteredBrands.map((brand) => (
                  <BrandListItem
                    key={brand.systemId}
                    brand={brand}
                    isSelected={selectedBrand?.systemId === brand.systemId}
                    onSelect={handleSelectBrand}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDeleteRequest}
                    searchTerm={searchTerm}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleAddNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm thương hiệu
            </Button>
          </div>
        </div>

        {/* Right Panel - Detail Form */}
        <div className="flex-1 flex flex-col">
          {selectedBrand || isNewMode ? (
            <BrandDetailForm
              brand={isNewMode ? null : selectedBrand}
              isNew={isNewMode}
              existingIds={existingIds}
              onSave={handleSave}
              onCancel={handleCancel}
              {...(!isNewMode && selectedBrand ? { onDelete: () => handleDeleteRequest(selectedBrand) } : {})}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Tags className="h-12 w-12 mx-auto opacity-30" />
                <p>Chọn thương hiệu để xem chi tiết</p>
                <p className="text-sm">hoặc</p>
                <Button variant="outline" size="sm" onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thương hiệu mới
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thương hiệu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thương hiệu "{brandToDelete?.name}"?
              <span className="block mt-2 text-muted-foreground">
                Hành động này không thể hoàn tác.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
