import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, X, CheckCheck } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { formatDateTime } from '../../lib/date-utils';
import { cn } from '../../lib/utils';

/**
 * Notification Center - Trung tâm thông báo toàn hệ thống
 * 
 * Chức năng:
 * - Hiển thị danh sách notifications
 * - Real-time updates
 * - Mark as read/unread
 * - Navigate đến trang liên quan
 * - Dùng chung cho tất cả modules (warranty, order, employee, product...)
 * 
 * Sử dụng:
 * import { NotificationCenter, useNotificationStore } from '@/components/ui/notification-center';
 * 
 * // Trong component
 * <NotificationCenter />
 * 
 * // Trigger notification
 * const { addNotification } = useNotificationStore();
 * addNotification({
 *   type: 'warranty',
 *   title: 'Phiếu bảo hành mới',
 *   message: 'Phiếu BH000001 đã được tạo',
 *   link: '/warranty/BH000001',
 * });
 */

export interface Notification {
  id: string;
  type: 'warranty' | 'order' | 'employee' | 'product' | 'system' | 'comment' | 'mention';
  title: string;
  message: string;
  link?: string; // URL để navigate khi click
  isRead: boolean;
  createdAt: string;
  createdBy?: string;
  metadata?: Record<string, unknown>; // Data liên quan
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// Simple store (có thể thay bằng Zustand nếu cần persist)
const notificationListeners = new Set<() => void>();
let notificationsState: Notification[] = [];

function getNotifications(): Notification[] {
  return notificationsState;
}

function setNotifications(notifications: Notification[]) {
  notificationsState = notifications;
  notificationListeners.forEach(listener => listener());
}

export function useNotificationStore(): NotificationStore {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    notificationListeners.add(forceUpdate);
    return () => {
      notificationListeners.delete(forceUpdate);
    };
  }, []);

  const notifications = getNotifications();
  const unreadCount = React.useMemo(
    () => notifications.filter(n => !n.isRead).length,
    [notifications]
  );

  const addNotification = React.useCallback((notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications([newNotification, ...getNotifications()]);
  }, []);

  const markAsRead = React.useCallback((id: string) => {
    setNotifications(
      getNotifications().map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications(
      getNotifications().map(n => ({ ...n, isRead: true }))
    );
  }, []);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications(getNotifications().filter(n => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
}

// Icon mapping
const notificationIcons: Record<Notification['type'], React.ReactNode> = {
  warranty: <span className="text-blue-600">🔧</span>,
  order: <span className="text-green-600">📦</span>,
  employee: <span className="text-purple-600">👤</span>,
  product: <span className="text-orange-600">📦</span>,
  system: <span className="text-gray-600">⚙️</span>,
  comment: <span className="text-indigo-600">💬</span>,
  mention: <span className="text-pink-600">@</span>,
};

export function NotificationCenter() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotificationStore();
  const [open, setOpen] = React.useState(false);

  const handleNotificationClick = React.useCallback((notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Navigate if has link
    if (notification.link) {
      router.push(notification.link);
      setOpen(false);
    }
  }, [markAsRead, router]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 text-[10px]"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Thông báo</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} mới
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Đánh dấu đọc hết
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Không có thông báo</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[400px]">
              <div className="p-2">
                {notifications.map((notification) => (
                  <div key={notification.id}>
                    <div
                      className={cn(
                        "group relative flex gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        notification.isRead 
                          ? "hover:bg-accent/50" 
                          : "bg-blue-50 hover:bg-blue-100 border-l-2 border-blue-500"
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {notificationIcons[notification.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm font-medium",
                            !notification.isRead && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          
                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(notification.createdAt)}
                          </span>
                          
                          {notification.createdBy && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {notification.createdBy}
                              </span>
                            </>
                          )}
                          
                          {!notification.isRead && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-blue-600 font-medium">Mới</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  clearAll();
                  setOpen(false);
                }}
              >
                Xóa tất cả thông báo
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Helper functions để trigger notifications
 * These functions directly manipulate the store state without using hooks
 */

function addNotificationDirect(notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  setNotifications([newNotification, ...getNotifications()]);
}

// Warranty notifications
export function notifyWarrantyCreated(warrantyId: string, createdBy: string) {
  addNotificationDirect({
    type: 'warranty',
    title: 'Phiếu bảo hành mới',
    message: `Phiếu ${warrantyId} đã được tạo`,
    link: `/warranty/${warrantyId}`,
    createdBy,
  });
}

export function notifyWarrantyStatusChanged(warrantyId: string, newStatus: string, changedBy: string) {
  addNotificationDirect({
    type: 'warranty',
    title: 'Cập nhật trạng thái',
    message: `Phiếu ${warrantyId} đã chuyển sang ${newStatus}`,
    link: `/warranty/${warrantyId}`,
    createdBy: changedBy,
  });
}

export function notifyMention(mentionedBy: string, context: string, link: string) {
  addNotificationDirect({
    type: 'mention',
    title: 'Bạn được nhắc đến',
    message: `${mentionedBy} đã nhắc bạn trong ${context}`,
    link,
    createdBy: mentionedBy,
  });
}

export function notifyComment(commentBy: string, context: string, link: string) {
  addNotificationDirect({
    type: 'comment',
    title: 'Bình luận mới',
    message: `${commentBy} đã bình luận trong ${context}`,
    link,
    createdBy: commentBy,
  });
}

// Order notifications
export function notifyOrderCreated(orderId: string, createdBy: string) {
  addNotificationDirect({
    type: 'order',
    title: 'Đơn hàng mới',
    message: `Đơn ${orderId} đã được tạo`,
    link: `/orders/${orderId}`,
    createdBy,
  });
}

// System notifications
export function notifySystem(title: string, message: string) {
  addNotificationDirect({
    type: 'system',
    title,
    message,
  });
}
