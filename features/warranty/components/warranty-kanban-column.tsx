'use client'

import * as React from 'react';
import { AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { WarrantyTicket, WarrantyStatus } from '../types';
import { WARRANTY_STATUS_LABELS } from '../types';
import { Input } from '@/components/ui/input';
import { WarrantyCard } from '../warranty-card';
import { WarrantyCardContextMenu } from '../warranty-card-context-menu';
import type { CardColorSettings } from '@/features/settings/warranty/hooks/use-warranty-settings';

interface KanbanColumnProps {
  status: WarrantyStatus;
  tickets: WarrantyTicket[];
  onTicketClick: (ticket: WarrantyTicket) => void;
  cardColors: CardColorSettings;
  onEdit: (systemId: string) => void;
  onGetLink: (systemId: string) => void;
  onStartProcessing: (systemId: string) => void;
  onMarkProcessed: (systemId: string) => void;
  onMarkReturned: (systemId: string) => void;
  onCancel: (systemId: string) => void;
  canEdit?: boolean;
  canCancel?: boolean;
}

const statusIcons: Record<WarrantyStatus, React.ElementType> = {
  RECEIVED: AlertCircle,
  PROCESSING: Clock,
  WAITING_PARTS: Clock,
  COMPLETED: CheckCircle2,
  RETURNED: XCircle,
  CANCELLED: XCircle,
};

/**
 * KanbanColumn Component - Display warranties by status
 */
export function KanbanColumn({
  status,
  tickets,
  onTicketClick,
  cardColors: _cardColors,
  onEdit,
  onGetLink,
  onStartProcessing,
  onMarkProcessed,
  onMarkReturned,
  onCancel,
  canEdit = true,
  canCancel = true,
}: KanbanColumnProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const StatusIcon = statusIcons[status];

  // Filter tickets based on local search
  const filteredTickets = React.useMemo(() => {
    if (!searchQuery.trim()) return tickets;

    const query = searchQuery.toLowerCase();
    return tickets.filter(t =>
      t.id.toLowerCase().includes(query) ||
      t.customerName.toLowerCase().includes(query) ||
      t.customerPhone.includes(query) ||
      t.trackingCode.toLowerCase().includes(query)
    );
  }, [tickets, searchQuery]);

  return (
    <div className="flex-1 min-w-75 flex flex-col max-h-[calc(100vh-320px)]">
      {/* Header - Neutral bg-muted with icon */}
      <div className="text-sm font-semibold px-4 py-3 mb-2 rounded-lg border bg-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4" />
          {WARRANTY_STATUS_LABELS[status]}
        </div>
        <span className="text-sm font-normal bg-background h-6 w-6 flex items-center justify-center rounded-full">
          {filteredTickets.length}
        </span>
      </div>

      {/* Local Search Input */}
      <div className="mb-2">
        <Input
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Scrollable Cards Area */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-2">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {searchQuery ? 'Không tìm thấy kết quả' : 'Không có bảo hành nào'}
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <WarrantyCardContextMenu
              key={ticket.systemId}
              ticket={ticket}
              onEdit={onEdit}
              onGetLink={onGetLink}
              onStartProcessing={onStartProcessing}
              onMarkProcessed={onMarkProcessed}
              onMarkReturned={onMarkReturned}
              onCancel={onCancel}
              canEdit={canEdit}
              canCancel={canCancel}
            >
              <div>
                <WarrantyCard
                  ticket={ticket}
                  onClick={() => onTicketClick(ticket)}
                />
              </div>
            </WarrantyCardContextMenu>
          ))
        )}
      </div>
    </div>
  );
}
