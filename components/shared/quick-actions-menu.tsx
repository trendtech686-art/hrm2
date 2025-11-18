import * as React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../ui/context-menu.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.tsx';
import { Button } from '../ui/button.tsx';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils.ts';

/**
 * Quick action configuration
 */
export interface QuickAction<T = any> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string; // e.g., "⌘C", "Ctrl+D"
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  submenu?: QuickAction<T>[];
  onAction?: (item: T, event?: React.MouseEvent | KeyboardEvent) => void | Promise<void>; // Optional if submenu exists
}

export interface QuickActionsMenuProps<T = any> {
  /** Item to perform actions on */
  item: T;
  
  /** Available quick actions */
  actions: QuickAction<T>[];
  
  /** Children to wrap (for context menu) */
  children?: React.ReactNode;
  
  /** Render as dropdown button instead of context menu */
  asDropdown?: boolean;
  
  /** Dropdown button variant */
  dropdownVariant?: 'default' | 'ghost' | 'outline' | 'secondary';
  
  /** Dropdown button size */
  dropdownSize?: 'default' | 'sm' | 'lg' | 'icon';
  
  /** Custom dropdown button label */
  dropdownLabel?: string;
  
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts?: boolean;
  
  /** Optional className */
  className?: string;
}

/**
 * QuickActionsMenu - Context menu & keyboard shortcuts for quick actions
 * 
 * @example Context Menu
 * ```tsx
 * const actions: QuickAction<Task>[] = [
 *   {
 *     id: 'edit',
 *     label: 'Chỉnh sửa',
 *     icon: <Edit className="h-4 w-4" />,
 *     shortcut: 'E',
 *     onAction: (task) => navigate(`/tasks/${task.id}/edit`)
 *   },
 *   {
 *     id: 'delete',
 *     label: 'Xóa',
 *     icon: <Trash2 className="h-4 w-4" />,
 *     shortcut: 'Del',
 *     variant: 'destructive',
 *     onAction: (task) => deleteTask(task.id)
 *   },
 *   {
 *     id: 'status',
 *     label: 'Đổi trạng thái',
 *     icon: <CheckCircle className="h-4 w-4" />,
 *     submenu: [
 *       { id: 'pending', label: 'Chờ xử lý', onAction: (task) => updateStatus(task.id, 'pending') },
 *       { id: 'done', label: 'Hoàn thành', onAction: (task) => updateStatus(task.id, 'done') }
 *     ]
 *   }
 * ];
 * 
 * // Context Menu (right-click)
 * <QuickActionsMenu item={task} actions={actions}>
 *   <TaskCard task={task} />
 * </QuickActionsMenu>
 * 
 * // Dropdown Button
 * <QuickActionsMenu
 *   item={task}
 *   actions={actions}
 *   asDropdown
 *   dropdownVariant="ghost"
 *   dropdownSize="icon"
 * />
 * ```
 */
export function QuickActionsMenu<T = any>({
  item,
  actions,
  children,
  asDropdown = false,
  dropdownVariant = 'ghost',
  dropdownSize = 'icon',
  dropdownLabel,
  enableKeyboardShortcuts = true,
  className,
}: QuickActionsMenuProps<T>) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if any input/textarea is focused
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const action = findActionByShortcut(actions, e);
      if (action) {
        e.preventDefault();
        action.onAction(item, e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, actions, enableKeyboardShortcuts]);

  const renderMenuItems = (menuActions: QuickAction<T>[], isContextMenu: boolean = false) => {
    return menuActions.map((action, index) => {
      if (action.submenu && asDropdown) {
        return (
          <React.Fragment key={action.id}>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={action.disabled}>
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {renderMenuItems(action.submenu, false)}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </React.Fragment>
        );
      }

      const MenuItemComponent = isContextMenu ? ContextMenuItem : DropdownMenuItem;
      const itemProps = isContextMenu 
        ? { onSelect: () => action.onAction?.(item) }
        : { onClick: (e: React.MouseEvent) => action.onAction?.(item, e as any) };
      
      return (
        <React.Fragment key={action.id}>
          <MenuItemComponent
            {...itemProps}
            disabled={action.disabled}
            className={action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
          >
            {action.icon}
            <span className="ml-2">{action.label}</span>
            {action.shortcut && asDropdown && (
              <DropdownMenuShortcut>{formatShortcut(action.shortcut)}</DropdownMenuShortcut>
            )}
          </MenuItemComponent>
          
          {/* Add separator before destructive actions */}
          {action.variant === 'destructive' && index < menuActions.length - 1 && (
            isContextMenu ? <ContextMenuSeparator /> : <DropdownMenuSeparator />
          )}
        </React.Fragment>
      );
    });
  };

  if (asDropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={dropdownVariant}
            size={dropdownSize}
            className={className}
          >
            {dropdownLabel || <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {renderMenuItems(actions)}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={className}>{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {renderMenuItems(actions, true)}
      </ContextMenuContent>
    </ContextMenu>
  );
}

/**
 * Find action by keyboard shortcut
 */
function findActionByShortcut<T>(
  actions: QuickAction<T>[],
  event: KeyboardEvent
): QuickAction<T> | null {
  for (const action of actions) {
    if (action.submenu) {
      const found = findActionByShortcut(action.submenu, event);
      if (found) return found;
    }

    if (action.shortcut && matchesShortcut(action.shortcut, event)) {
      return action;
    }
  }

  return null;
}

/**
 * Check if keyboard event matches shortcut
 */
function matchesShortcut(shortcut: string, event: KeyboardEvent): boolean {
  const normalized = shortcut.toLowerCase();
  
  // Handle special keys
  const keyMap: Record<string, string> = {
    del: 'delete',
    esc: 'escape',
    enter: 'enter',
    space: ' ',
  };

  const key = keyMap[normalized] || normalized;

  // Check modifiers
  const ctrl = normalized.includes('ctrl') || normalized.includes('⌘');
  const alt = normalized.includes('alt') || normalized.includes('⌥');
  const shift = normalized.includes('shift') || normalized.includes('⇧');

  // Extract the main key (last character/word)
  const mainKey = normalized
    .replace(/ctrl\+|⌘\+|alt\+|⌥\+|shift\+|⇧\+/gi, '')
    .trim();

  return (
    event.key.toLowerCase() === mainKey &&
    event.ctrlKey === ctrl &&
    event.altKey === alt &&
    event.shiftKey === shift
  );
}

/**
 * Format shortcut for display
 */
function formatShortcut(shortcut: string): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
  if (isMac) {
    return shortcut
      .replace(/Ctrl/g, '⌘')
      .replace(/Alt/g, '⌥')
      .replace(/Shift/g, '⇧')
      .replace(/Del/g, '⌫');
  }
  
  return shortcut;
}

/**
 * Predefined common quick actions
 */
export const commonQuickActions = {
  edit: <T extends { id: string }>(
    onEdit: (item: T) => void,
    icon?: React.ReactNode
  ): QuickAction<T> => ({
    id: 'edit',
    label: 'Chỉnh sửa',
    icon: icon,
    shortcut: 'E',
    onAction: onEdit,
  }),

  delete: <T extends { id: string }>(
    onDelete: (item: T) => void,
    icon?: React.ReactNode
  ): QuickAction<T> => ({
    id: 'delete',
    label: 'Xóa',
    icon: icon,
    shortcut: 'Del',
    variant: 'destructive',
    onAction: onDelete,
  }),

  duplicate: <T extends { id: string }>(
    onDuplicate: (item: T) => void,
    icon?: React.ReactNode
  ): QuickAction<T> => ({
    id: 'duplicate',
    label: 'Nhân bản',
    icon: icon,
    shortcut: 'Ctrl+D',
    onAction: onDuplicate,
  }),

  view: <T extends { id: string }>(
    onView: (item: T) => void,
    icon?: React.ReactNode
  ): QuickAction<T> => ({
    id: 'view',
    label: 'Xem chi tiết',
    icon: icon,
    shortcut: 'Enter',
    onAction: onView,
  }),

  archive: <T extends { id: string }>(
    onArchive: (item: T) => void,
    icon?: React.ReactNode
  ): QuickAction<T> => ({
    id: 'archive',
    label: 'Lưu trữ',
    icon: icon,
    shortcut: 'A',
    onAction: onArchive,
  }),

  copy: <T extends { id: string }>(
    onCopy: (item: T) => void,
    icon?: React.ReactNode,
    label: string = 'Sao chép'
  ): QuickAction<T> => ({
    id: 'copy',
    label,
    icon: icon,
    shortcut: 'Ctrl+C',
    onAction: onCopy,
  }),

  print: <T extends { id: string }>(
    onPrint: (item: T) => void,
    icon?: React.ReactNode
  ): QuickAction<T> => ({
    id: 'print',
    label: 'In',
    icon: icon,
    shortcut: 'Ctrl+P',
    onAction: onPrint,
  }),

  export: <T extends { id: string }>(
    onExport: (item: T) => void,
    icon?: React.ReactNode
  ): QuickAction<T> => ({
    id: 'export',
    label: 'Xuất file',
    icon: icon,
    shortcut: 'Ctrl+E',
    onAction: onExport,
  }),

  changeStatus: <T extends { id: string }>(
    statuses: Array<{ id: string; label: string; icon?: React.ReactNode }>,
    onChangeStatus: (item: T, statusId: string) => void,
    icon?: React.ReactNode
  ): QuickAction<T> => ({
    id: 'change-status',
    label: 'Đổi trạng thái',
    icon: icon,
    submenu: statuses.map((status, index) => ({
      id: status.id,
      label: status.label,
      icon: status.icon,
      shortcut: `${index + 1}`, // Number shortcuts 1-9
      onAction: (item) => onChangeStatus(item, status.id),
    })),
  }),

  assignTo: <T extends { id: string }>(
    users: Array<{ id: string; name: string; avatar?: string }>,
    onAssign: (item: T, userId: string) => void,
    icon?: React.ReactNode
  ): QuickAction<T> => ({
    id: 'assign-to',
    label: 'Giao cho',
    icon: icon,
    submenu: users.map((user) => ({
      id: user.id,
      label: user.name,
      onAction: (item) => onAssign(item, user.id),
    })),
  }),
};

/**
 * Hook for managing keyboard shortcuts globally
 */
export function useKeyboardShortcuts<T>(
  item: T | null,
  actions: QuickAction<T>[],
  enabled: boolean = true
) {
  React.useEffect(() => {
    if (!enabled || !item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const action = findActionByShortcut(actions, e);
      if (action) {
        e.preventDefault();
        action.onAction(item, e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, actions, enabled]);
}
