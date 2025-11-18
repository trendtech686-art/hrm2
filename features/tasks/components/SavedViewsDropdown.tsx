/**
 * Saved Views Dropdown Component
 * Quick access to saved filter configurations
 */

import * as React from 'react';
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  Share2,
  Copy,
  MoreHorizontal,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SavedView } from '../types-filter';
import { cn } from '@/lib/utils';

interface SavedViewsDropdownProps {
  views: SavedView[];
  currentViewId?: string;
  onSelectView: (view: SavedView) => void;
  onCreateView: () => void;
  onEditView: (view: SavedView) => void;
  onDeleteView: (view: SavedView) => void;
  onDuplicateView: (view: SavedView) => void;
  onSetDefault: (view: SavedView) => void;
}

export function SavedViewsDropdown({
  views,
  currentViewId,
  onSelectView,
  onCreateView,
  onEditView,
  onDeleteView,
  onDuplicateView,
  onSetDefault,
}: SavedViewsDropdownProps) {
  const currentView = views.find(v => v.id === currentViewId);
  const defaultView = views.find(v => v.isDefault);
  const myViews = views.filter(v => !v.isShared);
  const sharedViews = views.filter(v => v.isShared);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          {currentView ? (
            <>
              {currentView.icon && (
                <span className={cn('text-lg', `text-${currentView.color}-500`)}>
                  {currentView.icon}
                </span>
              )}
              <span className="font-medium">{currentView.name}</span>
              {currentView.isDefault && (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              )}
            </>
          ) : (
            <>
              <Star className="h-4 w-4" />
              <span>Chọn view</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80">
        {/* Create New View */}
        <DropdownMenuItem onClick={onCreateView}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="font-medium">Tạo view mới</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Default View */}
        {defaultView && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              View mặc định
            </DropdownMenuLabel>
            <ViewMenuItem
              view={defaultView}
              isActive={currentViewId === defaultView.id}
              onSelect={onSelectView}
              onEdit={onEditView}
              onDelete={onDeleteView}
              onDuplicate={onDuplicateView}
              onSetDefault={onSetDefault}
            />
            <DropdownMenuSeparator />
          </>
        )}

        {/* My Views */}
        {myViews.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              View của tôi ({myViews.length})
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {myViews.map(view => (
                <ViewMenuItem
                  key={view.id}
                  view={view}
                  isActive={currentViewId === view.id}
                  onSelect={onSelectView}
                  onEdit={onEditView}
                  onDelete={onDeleteView}
                  onDuplicate={onDuplicateView}
                  onSetDefault={onSetDefault}
                />
              ))}
            </DropdownMenuGroup>
          </>
        )}

        {/* Shared Views */}
        {sharedViews.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              View chung ({sharedViews.length})
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {sharedViews.map(view => (
                <ViewMenuItem
                  key={view.id}
                  view={view}
                  isActive={currentViewId === view.id}
                  onSelect={onSelectView}
                  onEdit={onEditView}
                  onDelete={onDeleteView}
                  onDuplicate={onDuplicateView}
                  onSetDefault={onSetDefault}
                  showActions={false}
                />
              ))}
            </DropdownMenuGroup>
          </>
        )}

        {/* Empty State */}
        {views.length === 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Chưa có view nào.
            <br />
            Tạo view đầu tiên để bắt đầu!
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Single View Menu Item with actions
 */
interface ViewMenuItemProps {
  view: SavedView;
  isActive: boolean;
  onSelect: (view: SavedView) => void;
  onEdit: (view: SavedView) => void;
  onDelete: (view: SavedView) => void;
  onDuplicate: (view: SavedView) => void;
  onSetDefault: (view: SavedView) => void;
  showActions?: boolean;
}

function ViewMenuItem({
  view,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onSetDefault,
  showActions = true,
}: ViewMenuItemProps) {
  return (
    <div className="group flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-sm">
      {/* View Info - Click to Select */}
      <button
        onClick={() => onSelect(view)}
        className="flex-1 flex items-center gap-2 text-left min-w-0"
      >
        {isActive && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
        {!isActive && <div className="w-4 flex-shrink-0" />}
        
        {view.icon && (
          <span className={cn('text-base flex-shrink-0', `text-${view.color}-500`)}>
            {view.icon}
          </span>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn('text-sm truncate', isActive && 'font-medium')}>
              {view.name}
            </span>
            {view.isShared && (
              <Share2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            )}
          </div>
          {view.description && (
            <p className="text-xs text-muted-foreground truncate">
              {view.description}
            </p>
          )}
        </div>
      </button>

      {/* Actions Dropdown */}
      {showActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(view)}>
              <Edit2 className="mr-2 h-4 w-4" />
              <span>Chỉnh sửa</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(view)}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Nhân bản</span>
            </DropdownMenuItem>
            {!view.isDefault && (
              <DropdownMenuItem onClick={() => onSetDefault(view)}>
                <Star className="mr-2 h-4 w-4" />
                <span>Đặt làm mặc định</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(view)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Xóa</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
