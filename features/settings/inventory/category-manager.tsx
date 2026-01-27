import * as React from 'react';
import { 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  Plus, 
  Search,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
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
import type { ProductCategory } from './types';
import { type SystemId } from '@/lib/id-types';
import { CategoryDetailForm, type CategoryFormValues } from './category-detail-form';

// Re-export CategoryFormValues for backward compatibility
export type { CategoryFormValues } from './category-detail-form';

// =============================================================================
// TYPES
// =============================================================================

interface CategoryManagerProps {
  categories: ProductCategory[];
  onAdd: (data: CategoryFormValues) => void;
  onUpdate: (systemId: SystemId, data: Partial<CategoryFormValues>) => void;
  onDelete: (systemId: SystemId) => void;
  onMove: (systemId: SystemId, newParentId: SystemId | undefined, newSortOrder: number) => void;
  existingIds: string[];
  /** Ref để expose hàm addNew từ PageHeader */
  addNewRef?: React.RefObject<{ addNew: () => void } | null>;
}

// =============================================================================
// TREE NODE COMPONENT (Simplified - no drag and drop)
// =============================================================================

interface TreeNodeProps {
  category: ProductCategory;
  allCategories: ProductCategory[];
  selectedId: SystemId | null;
  onSelect: (category: ProductCategory) => void;
  onAddChild: (parentId: SystemId) => void;
  level: number;
  expandedIds: Set<SystemId>;
  onToggleExpand: (id: SystemId) => void;
  searchTerm: string;
}

function TreeNode({ 
  category, 
  allCategories, 
  selectedId, 
  onSelect, 
  onAddChild,
  level, 
  expandedIds,
  onToggleExpand,
  searchTerm,
}: TreeNodeProps) {
  const children = allCategories
    .filter(c => c.parentId === category.systemId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(category.systemId);
  const isSelected = selectedId === category.systemId;

  // Count products (mock - sau này sẽ tính thực)
  const productCount = 0;

  // Highlight search match
  const matchesSearch = searchTerm && category.name.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <>
      <div className="relative">
        <div
          className={cn(
            'group flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer transition-all',
            'hover:bg-accent',
            isSelected && 'bg-primary/10 text-primary font-medium',
            matchesSearch && !isSelected && 'bg-yellow-50 dark:bg-yellow-900/20',
          )}
          onClick={() => onSelect(category)}
        >
          {/* Expand/Collapse */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(category.systemId);
            }}
            className={cn(
              'p-0.5 rounded hover:bg-muted transition-transform',
              !hasChildren && 'invisible'
            )}
          >
            <ChevronRight 
              className={cn(
                'h-3.5 w-3.5 text-muted-foreground transition-transform',
                isExpanded && 'rotate-90'
              )} 
            />
          </button>

          {/* Folder Icon */}
          {isExpanded && hasChildren ? (
            <FolderOpen className="h-4 w-4 text-amber-500 flex-shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-amber-500 flex-shrink-0" />
          )}

          {/* Name */}
          <span className="flex-1 truncate text-sm">
            {category.name}
          </span>

          {/* Product Count */}
          {productCount > 0 && (
            <span className="text-xs text-muted-foreground">
              ({productCount})
            </span>
          )}

          {/* Level Badge */}
          {level > 0 && (
            <Badge variant="outline" className="h-4 text-[10px] px-1">
              L{level + 1}
            </Badge>
          )}

          {/* Status */}
          {!category.isActive && (
            <Badge variant="secondary" className="h-4 text-[10px] px-1">
              Ẩn
            </Badge>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
            {/* Add Child Button - allow up to 5 levels (0-4) */}
            {level < 4 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChild(category.systemId);
                }}
                title="Thêm danh mục con"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-4 pl-2 border-l border">
          {children.map((child) => (
            <TreeNode
              key={child.systemId}
              category={child}
              allCategories={allCategories}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              level={level + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CategoryManager({
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onMove: _onMove,
  existingIds,
  addNewRef,
}: CategoryManagerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<ProductCategory | null>(null);
  const [isNewMode, setIsNewMode] = React.useState(false);
  const [newParentId, setNewParentId] = React.useState<SystemId | undefined>(undefined);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedIds, setExpandedIds] = React.useState<Set<SystemId>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Expose addNew function via ref for PageHeader
  React.useImperativeHandle(addNewRef, () => ({
    addNew: () => {
      setSelectedCategory(null);
      setNewParentId(undefined);
      setIsNewMode(true);
    }
  }), []);

  const rootCategories = React.useMemo(
    () => categories.filter(c => !c.parentId).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [categories]
  );

  // Expand all on mount
  React.useEffect(() => {
    setExpandedIds(new Set(categories.map(c => c.systemId)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only run on mount to expand all initially
  }, []);

  const handleToggleExpand = (id: SystemId) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(categories.map(c => c.systemId)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const handleSelectCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setIsNewMode(false);
    setNewParentId(undefined);
  };

  const handleAddRoot = () => {
    setSelectedCategory(null);
    setIsNewMode(true);
    setNewParentId(undefined);
  };

  const handleAddChild = (parentId: SystemId) => {
    setSelectedCategory(null);
    setIsNewMode(true);
    setNewParentId(parentId);
    // Expand parent
    setExpandedIds(prev => new Set([...prev, parentId]));
  };

  const handleSave = (data: CategoryFormValues) => {
    if (isNewMode) {
      onAdd({
        ...data,
        parentId: newParentId,
      });
      setIsNewMode(false);
      setNewParentId(undefined);
    } else if (selectedCategory) {
      onUpdate(selectedCategory.systemId, data);
    }
  };

  const handleCancel = () => {
    setIsNewMode(false);
    setNewParentId(undefined);
    if (!selectedCategory && categories.length > 0) {
      // Select first category if none selected
      setSelectedCategory(rootCategories[0] || null);
    }
  };

  const handleDeleteRequest = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      onDelete(selectedCategory.systemId);
      setSelectedCategory(null);
    }
    setDeleteDialogOpen(false);
  };

  const newParentCategory = newParentId ? categories.find(c => c.systemId === newParentId) : undefined;

  // Count categories
  const totalCount = categories.length;

  return (
    <>
      <div className="h-[calc(100vh-140px)] flex border rounded-lg overflow-hidden bg-background">
        {/* Left Panel - Tree */}
        <div className="w-80 border-r flex flex-col bg-muted/30">
          {/* Tree Header */}
          <div className="p-3 border-b space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                Danh mục ({totalCount})
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleExpandAll}>
                  Mở
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCollapseAll}>
                  Đóng
                </Button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          </div>

          {/* Tree Content */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {rootCategories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Chưa có danh mục nào
                </div>
              ) : (
                rootCategories.map((category) => (
                  <TreeNode
                    key={category.systemId}
                    category={category}
                    allCategories={categories}
                    selectedId={selectedCategory?.systemId || null}
                    onSelect={handleSelectCategory}
                    onAddChild={handleAddChild}
                    level={0}
                    expandedIds={expandedIds}
                    onToggleExpand={handleToggleExpand}
                    searchTerm={searchTerm}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Tree Footer */}
          <div className="p-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleAddRoot}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm danh mục gốc
            </Button>
          </div>
        </div>

        {/* Right Panel - Detail Form */}
        <div className="flex-1 flex flex-col">
          {selectedCategory || isNewMode ? (
            <CategoryDetailForm
              category={isNewMode ? null : selectedCategory}
              isNew={isNewMode}
              {...(newParentCategory ? { parentCategory: newParentCategory } : {})}
              allCategories={categories}
              existingIds={existingIds}
              onSave={handleSave}
              onCancel={handleCancel}
              {...(!isNewMode ? { onDelete: handleDeleteRequest } : {})}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Folder className="h-12 w-12 mx-auto opacity-30" />
                <p>Chọn danh mục để xem chi tiết</p>
                <p className="text-sm">hoặc</p>
                <Button variant="outline" size="sm" onClick={handleAddRoot}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm danh mục mới
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
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"?
              {categories.filter(c => c.parentId === selectedCategory?.systemId).length > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  Danh mục này có danh mục con. Các danh mục con cũng sẽ bị xóa.
                </span>
              )}
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
