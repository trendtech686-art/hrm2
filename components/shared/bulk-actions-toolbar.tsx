import * as React from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu';
import { 
  X, 
  Trash2, 
  Edit, 
  Copy, 
  Archive, 
  MoreHorizontal,
  CheckCircle,
  UserPlus,
  Tag,
  Move,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { cn } from '../../lib/utils';

/**
 * Generic action configuration
 */
export interface BulkAction<T = any> {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationDescription?: string;
  disabled?: (selectedIds: string[]) => boolean;
  submenu?: BulkAction<T>[]; // For nested actions
  onAction?: (selectedIds: string[], payload?: any) => void | Promise<void>; // Optional if submenu exists
}

export interface BulkActionsToolbarProps<T = any> {
  /** Selected item IDs */
  selectedIds: string[];
  
  /** Total available items count */
  totalCount: number;
  
  /** Whether all items are selected */
  isAllSelected: boolean;
  
  /** Callback when selection changes */
  onSelectionChange: (selectedIds: string[]) => void;
  
  /** Callback to select all items */
  onSelectAll: () => void;
  
  /** Callback to clear selection */
  onClearSelection: () => void;
  
  /** Available bulk actions */
  actions: BulkAction<T>[];
  
  /** Optional custom label for selected items */
  selectedLabel?: string;
  
  /** Optional className */
  className?: string;
  
  /** Show as compact toolbar (smaller) */
  compact?: boolean;
}

/**
 * BulkActionsToolbar - Generic component for bulk operations
 * 
 * @example
 * ```tsx
 * const actions: BulkAction[] = [
 *   {
 *     id: 'delete',
 *     label: 'Xóa',
 *     icon: <Trash2 className="h-4 w-4" />,
 *     variant: 'destructive',
 *     requiresConfirmation: true,
 *     confirmationTitle: 'Xóa các mục đã chọn?',
 *     confirmationDescription: 'Hành động này không thể hoàn tác.',
 *     onAction: async (ids) => {
 *       await deleteItems(ids);
 *       toast.success(`Đã xóa ${ids.length} mục`);
 *     }
 *   },
 *   {
 *     id: 'change-status',
 *     label: 'Đổi trạng thái',
 *     icon: <CheckCircle className="h-4 w-4" />,
 *     submenu: [
 *       { id: 'pending', label: 'Chờ xử lý', onAction: (ids) => updateStatus(ids, 'pending') },
 *       { id: 'done', label: 'Hoàn thành', onAction: (ids) => updateStatus(ids, 'done') }
 *     ]
 *   }
 * ];
 * 
 * <BulkActionsToolbar
 *   selectedIds={selectedIds}
 *   totalCount={100}
 *   isAllSelected={isAllSelected}
 *   onSelectionChange={setSelectedIds}
 *   onSelectAll={handleSelectAll}
 *   onClearSelection={() => setSelectedIds([])}
 *   actions={actions}
 * />
 * ```
 */
export function BulkActionsToolbar<T = any>({
  selectedIds,
  totalCount,
  isAllSelected,
  onSelectionChange,
  onSelectAll,
  onClearSelection,
  actions,
  selectedLabel = 'mục',
  className,
  compact = false,
}: BulkActionsToolbarProps<T>) {
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    action: BulkAction<T> | null;
  }>({ open: false, action: null });

  const hasSelection = selectedIds.length > 0;

  const handleActionClick = (action: BulkAction<T>) => {
    if (action.requiresConfirmation) {
      setConfirmDialog({ open: true, action });
    } else {
      action.onAction?.(selectedIds);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.action) {
      await confirmDialog.action.onAction?.(selectedIds);
      setConfirmDialog({ open: false, action: null });
    }
  };

  if (!hasSelection) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-2 border-b bg-muted/30 px-4 transition-all',
          compact ? 'h-12' : 'h-14',
          className
        )}
      >
        {/* Select All Checkbox */}
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={(checked) => {
            if (checked) {
              onSelectAll();
            } else {
              onClearSelection();
            }
          }}
          aria-label="Select all"
        />

        {/* Selection Count */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm font-medium">
            {selectedIds.length} {selectedLabel} đã chọn
          </span>
          {isAllSelected && totalCount > selectedIds.length && (
            <span className="text-xs text-muted-foreground">
              (Tất cả {totalCount} {selectedLabel})
            </span>
          )}
        </div>

        {/* Quick Actions (Primary actions shown as buttons) */}
        <div className="flex items-center gap-1">
          {actions
            .filter((action) => !action.submenu)
            .slice(0, compact ? 2 : 3)
            .map((action) => {
              const isDisabled = action.disabled?.(selectedIds) ?? false;
              
              return (
                <Button
                  key={action.id}
                  variant={action.variant || 'ghost'}
                  size={compact ? 'sm' : 'default'}
                  onClick={() => handleActionClick(action)}
                  disabled={isDisabled}
                  className={cn(compact && 'h-8')}
                >
                  {action.icon}
                  <span className="ml-2 hidden sm:inline">{action.label}</span>
                </Button>
              );
            })}

          {/* More Actions Dropdown */}
          {actions.length > (compact ? 2 : 3) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={compact ? 'sm' : 'default'} className={cn(compact && 'h-8')}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Thêm</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {actions
                  .filter((_, index) => index >= (compact ? 2 : 3) || actions[index].submenu)
                  .map((action) => {
                    const isDisabled = action.disabled?.(selectedIds) ?? false;

                    if (action.submenu) {
                      return (
                        <DropdownMenuSub key={action.id}>
                          <DropdownMenuSubTrigger disabled={isDisabled}>
                            {action.icon}
                            <span className="ml-2">{action.label}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="w-48">
                            {action.submenu.map((subAction) => (
                              <DropdownMenuItem
                                key={subAction.id}
                                onClick={() => handleActionClick(subAction)}
                                disabled={subAction.disabled?.(selectedIds) ?? false}
                              >
                                {subAction.icon}
                                <span className="ml-2">{subAction.label}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      );
                    }

                    return (
                      <DropdownMenuItem
                        key={action.id}
                        onClick={() => handleActionClick(action)}
                        disabled={isDisabled}
                        className={action.variant === 'destructive' ? 'text-destructive' : ''}
                      >
                        {action.icon}
                        <span className="ml-2">{action.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Clear Selection */}
          <Button
            variant="ghost"
            size={compact ? 'sm' : 'icon'}
            onClick={onClearSelection}
            className={cn(compact && 'h-8 w-8')}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear selection</span>
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ open, action: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action?.confirmationTitle || 'Xác nhận hành động'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action?.confirmationDescription ||
                `Bạn có chắc chắn muốn thực hiện hành động này với ${selectedIds.length} ${selectedLabel}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/**
 * Hook for managing bulk selection state
 * 
 * @example
 * ```tsx
 * const {
 *   selectedIds,
 *   isAllSelected,
 *   toggleSelection,
 *   toggleAll,
 *   clearSelection,
 * } = useBulkSelection(items.map(i => i.id));
 * ```
 */
export function useBulkSelection(allIds: string[]) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;
  const hasSelection = selectedIds.length > 0;

  const toggleSelection = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  }, []);

  const toggleAll = React.useCallback(() => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  }, [isAllSelected, allIds]);

  const clearSelection = React.useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectAll = React.useCallback(() => {
    setSelectedIds(allIds);
  }, [allIds]);

  return {
    selectedIds,
    setSelectedIds,
    isAllSelected,
    hasSelection,
    toggleSelection,
    toggleAll,
    clearSelection,
    selectAll,
  };
}

/**
 * Predefined common bulk actions
 */
export const commonBulkActions = {
  delete: (onAction: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: 'delete',
    label: 'Xóa',
    icon: <Trash2 className="h-4 w-4" />,
    variant: 'destructive',
    requiresConfirmation: true,
    confirmationTitle: 'Xóa các mục đã chọn?',
    confirmationDescription: 'Hành động này không thể hoàn tác.',
    onAction,
  }),

  archive: (onAction: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: 'archive',
    label: 'Lưu trữ',
    icon: <Archive className="h-4 w-4" />,
    onAction,
  }),

  duplicate: (onAction: (ids: string[]) => void | Promise<void>): BulkAction => ({
    id: 'duplicate',
    label: 'Nhân bản',
    icon: <Copy className="h-4 w-4" />,
    onAction,
  }),

  changeStatus: (
    statuses: Array<{ id: string; label: string; icon?: React.ReactNode }>,
    onAction: (ids: string[], statusId: string) => void | Promise<void>
  ): BulkAction => ({
    id: 'change-status',
    label: 'Đổi trạng thái',
    icon: <CheckCircle className="h-4 w-4" />,
    submenu: statuses.map((status) => ({
      id: status.id,
      label: status.label,
      icon: status.icon || <CheckCircle className="h-4 w-4" />,
      onAction: (ids) => onAction(ids, status.id),
    })),
  }),

  assignTo: (
    users: Array<{ id: string; name: string }>,
    onAction: (ids: string[], userId: string) => void | Promise<void>
  ): BulkAction => ({
    id: 'assign-to',
    label: 'Giao cho',
    icon: <UserPlus className="h-4 w-4" />,
    submenu: users.map((user) => ({
      id: user.id,
      label: user.name,
      icon: <UserPlus className="h-4 w-4" />,
      onAction: (ids) => onAction(ids, user.id),
    })),
  }),

  addTags: (
    tags: Array<{ id: string; label: string; color?: string }>,
    onAction: (ids: string[], tagId: string) => void | Promise<void>
  ): BulkAction => ({
    id: 'add-tags',
    label: 'Thêm thẻ',
    icon: <Tag className="h-4 w-4" />,
    submenu: tags.map((tag) => ({
      id: tag.id,
      label: tag.label,
      icon: <Tag className="h-4 w-4" style={{ color: tag.color }} />,
      onAction: (ids) => onAction(ids, tag.id),
    })),
  }),

  moveTo: (
    destinations: Array<{ id: string; label: string }>,
    onAction: (ids: string[], destinationId: string) => void | Promise<void>
  ): BulkAction => ({
    id: 'move-to',
    label: 'Di chuyển đến',
    icon: <Move className="h-4 w-4" />,
    submenu: destinations.map((dest) => ({
      id: dest.id,
      label: dest.label,
      icon: <Move className="h-4 w-4" />,
      onAction: (ids) => onAction(ids, dest.id),
    })),
  }),
};
