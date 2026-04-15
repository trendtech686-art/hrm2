import * as React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../components/ui/context-menu';
import type { WarrantyTicket } from './types';

interface WarrantyCardContextMenuProps {
  ticket: WarrantyTicket;
  onEdit: (systemId: string) => void;
  onGetLink: (systemId: string) => void;
  onStartProcessing: (systemId: string) => void;
  onMarkProcessed: (systemId: string) => void;
  onMarkReturned: (systemId: string) => void;
  onCancel: (systemId: string) => void;
  canEdit?: boolean;
  canCancel?: boolean;
  children: React.ReactNode;
}

/**
 * Context Menu for Warranty Card - Status-based actions (no icons)
 * 
 * Right-click menu với actions thay đổi theo status:
 * - new: Sửa, Bắt đầu xử lý, Copy link, Hủy
 * - pending: Hoàn thành xử lý, Copy link
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
  canEdit = true,
  canCancel = true,
  children,
}: WarrantyCardContextMenuProps) {
  const { status } = ticket;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {/* RECEIVED: Mới tạo */}
        {status === 'RECEIVED' && (
          <>
            {canEdit && (
              <ContextMenuItem onSelect={() => onEdit(ticket.systemId)}>
                Sửa thông tin
              </ContextMenuItem>
            )}
            {canEdit && (
              <ContextMenuItem onSelect={() => onStartProcessing(ticket.systemId)}>
                Bắt đầu xử lý
              </ContextMenuItem>
            )}
            <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
              Copy link tracking
            </ContextMenuItem>
            {canCancel && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onSelect={() => onCancel(ticket.systemId)}
                  className="text-destructive focus:text-destructive"
                >
                  Hủy phiếu
                </ContextMenuItem>
              </>
            )}
          </>
        )}

        {/* PROCESSING: Chưa xử lý */}
        {status === 'PROCESSING' && (
          <>
            {canEdit && (
              <ContextMenuItem onSelect={() => onEdit(ticket.systemId)}>
                Sửa thông tin
              </ContextMenuItem>
            )}
            {canEdit && (
              <ContextMenuItem onSelect={() => onMarkProcessed(ticket.systemId)}>
                Hoàn thành xử lý
              </ContextMenuItem>
            )}
            <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
              Copy link tracking
            </ContextMenuItem>
          </>
        )}

        {/* COMPLETED: Đã xử lý */}
        {status === 'COMPLETED' && (
          <>
            {canEdit && (
              <ContextMenuItem onSelect={() => onMarkReturned(ticket.systemId)}>
                Đã trả hàng cho khách
              </ContextMenuItem>
            )}
            <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
              Copy link tracking
            </ContextMenuItem>
          </>
        )}

        {/* RETURNED: Đã trả */}
        {status === 'RETURNED' && (
          <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
            Copy link tracking
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
