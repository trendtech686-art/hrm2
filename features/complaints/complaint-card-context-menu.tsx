import * as React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../components/ui/context-menu';
import { Complaint } from './types';
import { isTrackingEnabled } from './tracking-utils';
import { toast } from 'sonner';

interface ComplaintCardContextMenuProps {
  complaint: Complaint;
  onEdit: (systemId: string) => void;
  onGetLink: (systemId: string) => void;
  onStartInvestigation: (systemId: string) => void;
  onFinish: (systemId: string) => void;
  onOpen: (systemId: string) => void;
  onReject: (systemId: string) => void;
  onRemind: (systemId: string) => void;
  children: React.ReactNode;
}

/**
 * Context Menu for Complaint Card - Status-based actions (no icons)
 */
export function ComplaintCardContextMenu({
  complaint,
  onEdit,
  onGetLink,
  onStartInvestigation,
  onFinish,
  onOpen,
  onReject,
  onRemind,
  children,
}: ComplaintCardContextMenuProps) {
  const { status } = complaint;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {/* PENDING: Chờ xử lý */}
        {status === 'pending' && (
          <>
            <ContextMenuItem onSelect={() => onEdit(complaint.systemId)}>
              Sửa thông tin
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onStartInvestigation(complaint.systemId)}>
              Bắt đầu xử lý
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => {
                if (!isTrackingEnabled()) {
                  toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                  return;
                }
                onGetLink(complaint.systemId);
              }}
            >
              Copy link tracking
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onRemind(complaint.systemId)}>
              Gửi thông báo nhắc nhở
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => onFinish(complaint.systemId)}>
              Kết thúc
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => onReject(complaint.systemId)}
              className="text-destructive focus:text-destructive"
            >
              Hủy khiếu nại
            </ContextMenuItem>
          </>
        )}

        {/* INVESTIGATING: Đang điều tra */}
        {status === 'investigating' && (
          <>
            <ContextMenuItem onSelect={() => onEdit(complaint.systemId)}>
              Sửa thông tin
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onFinish(complaint.systemId)}>
              Hoàn thành
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => {
                if (!isTrackingEnabled()) {
                  toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                  return;
                }
                onGetLink(complaint.systemId);
              }}
            >
              Copy link tracking
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onRemind(complaint.systemId)}>
              Gửi thông báo nhắc nhở
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onSelect={() => onReject(complaint.systemId)}
              className="text-destructive focus:text-destructive"
            >
              Từ chối khiếu nại
            </ContextMenuItem>
          </>
        )}

        {/* RESOLVED: Đã giải quyết */}
        {status === 'resolved' && (
          <>
            <ContextMenuItem
              onSelect={() => {
                if (!isTrackingEnabled()) {
                  toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                  return;
                }
                onGetLink(complaint.systemId);
              }}
            >
              Copy link tracking
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onOpen(complaint.systemId)}>
              Mở lại
            </ContextMenuItem>
          </>
        )}

        {/* CANCELLED: Đã hủy */}
        {status === 'cancelled' && (
          <>
            <ContextMenuItem
              onSelect={() => {
                if (!isTrackingEnabled()) {
                  toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                  return;
                }
                onGetLink(complaint.systemId);
              }}
            >
              Copy link tracking
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onOpen(complaint.systemId)}>
              Mở lại
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
