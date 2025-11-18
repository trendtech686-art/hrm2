import * as React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../components/ui/context-menu.tsx';
import { WarrantyTicket } from './types.ts';
import { toast } from 'sonner';

interface WarrantyCardContextMenuProps {
  ticket: WarrantyTicket;
  onEdit: (systemId: string) => void;
  onGetLink: (systemId: string) => void;
  onStartProcessing: (systemId: string) => void;
  onMarkProcessed: (systemId: string) => void;
  onMarkReturned: (systemId: string) => void;
  onCancel: (systemId: string) => void;
  onRemind?: (systemId: string) => void;
  children: React.ReactNode;
}

/**
 * Context Menu for Warranty Card - Status-based actions (no icons)
 * 
 * Right-click menu với actions thay đổi theo status:
 * - new: Sửa, Bắt đầu xử lý, Copy link, Nhắc nhở, Hủy
 * - pending: Hoàn thành xử lý, Copy link, Nhắc nhở
 * - processed: Đã trả hàng, Copy link
 * - returned: Copy link
 */
export function WarrantyCardContextMenu({
  ticket,
  onEdit,
  onGetLink,
  onStartProcessing,
  onMarkProcessed,
  onMarkReturned,
  onCancel,
  onRemind,
  children,
}: WarrantyCardContextMenuProps) {
  const { status } = ticket;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {/* NEW: Mới tạo */}
        {status === 'incomplete' && (
          <>
            <ContextMenuItem onSelect={() => onEdit(ticket.systemId)}>
              Sửa thông tin
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onStartProcessing(ticket.systemId)}>
              Bắt đầu xử lý
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
              Copy link tracking
            </ContextMenuItem>
            {onRemind && (
              <ContextMenuItem onSelect={() => onRemind(ticket.systemId)}>
                Gửi thông báo nhắc nhở
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
            <ContextMenuItem
              onSelect={() => onCancel(ticket.systemId)}
              className="text-destructive focus:text-destructive"
            >
              Hủy phiếu
            </ContextMenuItem>
          </>
        )}

        {/* PENDING: Chưa xử lý */}
        {status === 'pending' && (
          <>
            <ContextMenuItem onSelect={() => onEdit(ticket.systemId)}>
              Sửa thông tin
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onMarkProcessed(ticket.systemId)}>
              Hoàn thành xử lý
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
              Copy link tracking
            </ContextMenuItem>
            {onRemind && (
              <ContextMenuItem onSelect={() => onRemind(ticket.systemId)}>
                Gửi thông báo nhắc nhở
              </ContextMenuItem>
            )}
          </>
        )}

        {/* PROCESSED: Đã xử lý */}
        {status === 'processed' && (
          <>
            <ContextMenuItem onSelect={() => onMarkReturned(ticket.systemId)}>
              Đã trả hàng cho khách
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
              Copy link tracking
            </ContextMenuItem>
          </>
        )}

        {/* RETURNED: Đã trả */}
        {status === 'returned' && (
          <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
            Copy link tracking
          </ContextMenuItem>
        )}

        {/* COMPLETED: Kết thúc */}
        {status === 'completed' && (
          <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
            Copy link tracking
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
