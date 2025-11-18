import * as React from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  pointerWithin,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, GripVertical, Pencil, Trash2, Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import type { ProductCategory } from './types';

type DropPosition = 'before' | 'inside' | 'after' | null;

interface CategoryTreeProps {
  categories: ProductCategory[];
  onEdit: (category: ProductCategory) => void;
  onDelete: (systemId: string) => void;
  onAddChild: (parentId: string) => void;
  onMove: (systemId: string, newParentId: string | undefined, newSortOrder: number) => void;
}

interface TreeNodeProps {
  category: ProductCategory;
  allCategories: ProductCategory[];
  onEdit: (category: ProductCategory) => void;
  onDelete: (systemId: string) => void;
  onAddChild: (parentId: string) => void;
  level: number;
  overId: string | null;
  dropPosition: DropPosition;
}

function TreeNode({ category, allCategories, onEdit, onDelete, onAddChild, level, overId, dropPosition }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const children = allCategories.filter(c => c.parentId === category.systemId).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const hasChildren = children.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.systemId });

  const isOver = overId === category.systemId;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const childrenCount = children.length;

  return (
    <>
      <div className="relative">
        {/* Drop indicator - BEFORE (vạch ngang phía trên) */}
        {isOver && dropPosition === 'before' && (
          <div className="absolute -top-1 left-0 right-0 h-0.5 bg-primary z-10">
            <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-primary" />
          </div>
        )}

        <div
          ref={setNodeRef}
          style={style}
          className={cn(
            'flex items-center gap-2 p-3 border rounded-lg bg-background transition-all relative',
            isDragging && 'opacity-40 scale-[0.98] cursor-grabbing',
            isOver && dropPosition === 'inside' && 'ring-2 ring-primary bg-primary/10 border-primary shadow-lg',
            !isDragging && !isOver && 'hover:border-gray-300 hover:shadow-sm'
          )}
        >
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 hover:bg-gray-100 rounded"
            title="Kéo để di chuyển: Phía trên/Vào trong/Phía dưới"
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>

          {/* Expand/Collapse */}
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 flex-shrink-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  !isExpanded && '-rotate-90'
                )}
              />
            </Button>
          ) : (
            <div className="w-6" />
          )}

          {/* Color indicator */}
          {category.color && (
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
          )}

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-base">{category.name}</span>
              {childrenCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {childrenCount} con
                </Badge>
              )}
              {!category.isActive && <Badge variant="secondary">Không kích hoạt</Badge>}
            </div>
            {category.description && (
              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                {category.description}
              </div>
            )}
          </div>

          {/* Drop indicator label - INSIDE */}
          {isOver && dropPosition === 'inside' && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium shadow-lg z-20 animate-pulse">
              <Plus className="h-3 w-3" />
              Thả vào trong
            </div>
          )}

          {/* Actions */}
          <div className={cn(
            "flex items-center gap-1 flex-shrink-0 transition-opacity",
            isOver && "opacity-0"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddChild(category.systemId)}
              className="h-8 w-8 p-0"
              title="Thêm danh mục con"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              className="h-8 w-8 p-0"
              title="Sửa"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(category.systemId)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Drop indicator - AFTER (vạch ngang phía dưới) */}
        {isOver && dropPosition === 'after' && (
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary z-10">
            <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-primary" />
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-8 mt-2 space-y-2 pl-4 border-l-2 border-gray-200">
          {children.map(child => (
            <TreeNode
              key={child.systemId}
              category={child}
              allCategories={allCategories}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              level={level + 1}
              overId={overId}
              dropPosition={dropPosition}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function CategoryTree({ categories, onEdit, onDelete, onAddChild, onMove }: CategoryTreeProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [overId, setOverId] = React.useState<string | null>(null);
  const [dropPosition, setDropPosition] = React.useState<DropPosition>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const rootCategories = React.useMemo(
    () => categories.filter(c => !c.parentId).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [categories]
  );

  const allCategoryIds = React.useMemo(
    () => categories.map(c => c.systemId),
    [categories]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const overId = event.over?.id as string || null;
    setOverId(overId);

    if (!overId || !event.over) {
      setDropPosition(null);
      return;
    }

    // Tính toán vị trí drop dựa trên vị trí chuột
    const overRect = event.over.rect;
    
    if (!overRect) {
      setDropPosition('inside');
      return;
    }

    // Lấy vị trí Y của chuột (từ activatorEvent)
    const clientY = (event.activatorEvent as PointerEvent)?.clientY;
    if (!clientY) {
      setDropPosition('inside');
      return;
    }

    const height = overRect.height;
    const relativeY = clientY - overRect.top;

    // Chia thành 3 vùng: 25% trên, 50% giữa, 25% dưới
    if (relativeY < height * 0.25) {
      setDropPosition('before');
    } else if (relativeY > height * 0.75) {
      setDropPosition('after');
    } else {
      setDropPosition('inside');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeCategory = categories.find(c => c.systemId === active.id);
      const overCategory = categories.find(c => c.systemId === over.id);

      if (activeCategory && overCategory) {
        // Check circular reference
        const isMovingIntoOwnDescendant = (parentId: string, targetId: string): boolean => {
          const target = categories.find(c => c.systemId === targetId);
          if (!target) return false;
          if (target.systemId === parentId) return true;
          if (target.parentId) return isMovingIntoOwnDescendant(parentId, target.parentId);
          return false;
        };

        if (dropPosition === 'inside' && isMovingIntoOwnDescendant(activeCategory.systemId, overCategory.systemId)) {
          setActiveId(null);
          setOverId(null);
          setDropPosition(null);
          return;
        }

        let newParentId: string | undefined;
        let newSortOrder: number;

        if (dropPosition === 'before') {
          // Thả phía trên: cùng parent với overCategory, sortOrder = overCategory.sortOrder
          newParentId = overCategory.parentId;
          newSortOrder = overCategory.sortOrder || 0;
        } else if (dropPosition === 'after') {
          // Thả phía dưới: cùng parent với overCategory, sortOrder = overCategory.sortOrder + 1
          newParentId = overCategory.parentId;
          newSortOrder = (overCategory.sortOrder || 0) + 1;
        } else {
          // Thả vào trong: trở thành con của overCategory
          newParentId = overCategory.systemId;
          newSortOrder = categories.filter(c => c.parentId === overCategory.systemId).length;
        }

        onMove(activeCategory.systemId, newParentId, newSortOrder);
      }
    }

    setActiveId(null);
    setOverId(null);
    setDropPosition(null);
  };

  const activeCategory = activeId ? categories.find(c => c.systemId === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={allCategoryIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {rootCategories.map(category => (
            <TreeNode
              key={category.systemId}
              category={category}
              allCategories={categories}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              level={0}
              overId={overId}
              dropPosition={dropPosition}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeCategory && (
          <div className="flex items-center gap-2 p-3 border-2 border-primary rounded-lg bg-background shadow-2xl opacity-90">
            <GripVertical className="h-5 w-5 text-gray-400" />
            {activeCategory.color && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeCategory.color }}
              />
            )}
            <div>
              <div className="font-medium">{activeCategory.name}</div>
              {activeCategory.description && (
                <div className="text-xs text-muted-foreground">{activeCategory.description}</div>
              )}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
