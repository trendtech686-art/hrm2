import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  History,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Package,
  DollarSign,
  FileText,
  AlertCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatDateForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';

export interface HistoryEntry {
  id: string;
  action:
    | 'created'
    | 'updated'
    | 'deleted'
    | 'status_changed'
    | 'assigned'
    | 'product_added'
    | 'product_updated'
    | 'product_removed'
    | 'payment_made'
    | 'comment_added'
    | 'attachment_added'
    // Complaint-specific actions
    | 'verified'
    | 'verified-correct'
    | 'verified-incorrect'
    | 'investigated'
    | 'resolved'
    | 'rejected'
    | 'cancelled'
    | 'ended'
    | 'reopened'
    | 'commented'
    | 'custom';
  timestamp: Date;
  user: {
    systemId: string;
    name: string;
    avatar?: string | undefined;
  };
  description: string;
  content?: React.ReactNode;
  metadata?: {
    oldValue?: any;
    newValue?: any;
    field?: string | undefined;
    [key: string]: any;
  } | undefined;
}

interface ActivityHistoryProps {
  history: HistoryEntry[];
  title?: string;
  emptyMessage?: string;
  className?: string;
  // Filter options
  showFilters?: boolean;
  filterableActions?: string[];
  filterableUsers?: { systemId: string; name: string }[];
  // Display options
  showUser?: boolean;
  showTimestamp?: boolean;
  showMetadata?: boolean;
  groupByDate?: boolean;
  maxHeight?: string;
}

/**
 * Generic Activity History Component
 * 
 * Dùng chung cho: Warranty, Orders, Complaints, Projects...
 * 
 * Features:
 * - Display timeline of actions
 * - Filter by action type, user, date range
 * - Group by date
 * - Show old/new values for updates
 * - User avatars
 * - Relative timestamps
 * - Scrollable with max height
 * 
 * Usage:
 * ```tsx
 * <ActivityHistory
 *   history={ticket.history}
 *   showFilters
 *   groupByDate
 *   filterableActions={['created', 'status_changed', 'updated']}
 *   title="Lịch sử thao tác"
 * />
 * ```
 */
export function ActivityHistory({
  history = [],
  title = 'Lịch sử thao tác',
  emptyMessage = 'Chưa có lịch sử nào',
  className,
  showFilters = true,
  filterableActions,
  filterableUsers,
  showUser = true,
  showTimestamp = true,
  showMetadata = true,
  groupByDate = false,
  maxHeight = '600px',
}: ActivityHistoryProps) {
  const [filterAction, setFilterAction] = React.useState<string>('all');
  const [filterUser, setFilterUser] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter history
  const filteredHistory = React.useMemo(() => {
    let filtered = [...history];

    // Filter by action
    if (filterAction !== 'all') {
      filtered = filtered.filter(h => h.action === filterAction);
    }

    // Filter by user
    if (filterUser !== 'all') {
      filtered = filtered.filter(h => h.user.systemId === filterUser);
    }

    // Search in description
    if (searchQuery) {
      filtered = filtered.filter(h =>
        h.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return filtered;
  }, [history, filterAction, filterUser, searchQuery]);

  // Group by date if enabled
  const groupedHistory = React.useMemo(() => {
    if (!groupByDate) return null;

    const groups = new Map<string, HistoryEntry[]>();
    
    filteredHistory.forEach(entry => {
      const date = formatDateForDisplay(entry.timestamp);
      const group = groups.get(date) || [];
      group.push(entry);
      groups.set(date, group);
    });

    return groups;
  }, [filteredHistory, groupByDate]);

  // Get action icon and color
  const getActionStyle = (action: string) => {
    const styles: Record<string, { icon: any; color: string; bgColor: string }> = {
      created: { icon: Plus, color: 'text-green-600', bgColor: 'bg-green-100' },
      updated: { icon: Edit, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      deleted: { icon: Trash2, color: 'text-red-600', bgColor: 'bg-red-100' },
      status_changed: { icon: CheckCircle2, color: 'text-purple-600', bgColor: 'bg-purple-100' },
      assigned: { icon: User, color: 'text-orange-600', bgColor: 'bg-orange-100' },
      product_added: { icon: Package, color: 'text-teal-600', bgColor: 'bg-teal-100' },
      product_updated: { icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      product_removed: { icon: Package, color: 'text-red-600', bgColor: 'bg-red-100' },
      payment_made: { icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
      comment_added: { icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100' },
      attachment_added: { icon: FileText, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
      
      // Complaint-specific actions
      verified: { icon: CheckCircle2, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'verified-correct': { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
      'verified-incorrect': { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
      investigated: { icon: AlertCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      resolved: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
      rejected: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
      cancelled: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
      ended: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
      reopened: { icon: History, color: 'text-purple-600', bgColor: 'bg-purple-100' },
      commented: { icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100' },
      
      custom: { icon: AlertCircle, color: 'text-gray-600', bgColor: 'bg-gray-100' },
    };

    return styles[action] || styles.custom;
  };

  const renderHistoryEntry = (entry: HistoryEntry, showDate: boolean = false) => {
    const style = getActionStyle(entry.action);
    const Icon = style.icon;

    return (
      <div key={entry.id} className="flex gap-3 pb-4 last:pb-0">
        {/* Icon */}
        <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', style.bgColor)}>
          <Icon className={cn('h-4 w-4', style.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Description */}
          <div className="text-sm">{entry.content ?? entry.description}</div>

          {/* Metadata - Note (e.g. reopen reason) */}
          {showMetadata && entry.metadata?.note && (
            <div className="text-sm text-muted-foreground italic border-l-2 border-muted pl-3 mt-1">
              {entry.metadata.note}
            </div>
          )}

          {/* Metadata - old/new values */}
          {showMetadata && entry.metadata && (entry.metadata.oldValue || entry.metadata.newValue) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {entry.metadata.oldValue && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">
                  {String(entry.metadata.oldValue)}
                </span>
              )}
              {entry.metadata.oldValue && entry.metadata.newValue && (
                <ArrowRight className="h-3 w-3" />
              )}
              {entry.metadata.newValue && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                  {String(entry.metadata.newValue)}
                </span>
              )}
            </div>
          )}

          {/* User & Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {showUser && (
              <>
                <Avatar className="h-5 w-5">
                  <AvatarImage src={entry.user.avatar} />
                  <AvatarFallback className="text-[10px]">
                    {entry.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{entry.user.name}</span>
              </>
            )}

            {showTimestamp && (
              <>
                <Clock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(entry.timestamp), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
                {showDate && (
                  <span className="text-[10px]">
                    ({formatDateTimeForDisplay(entry.timestamp)})
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-h5 flex items-center gap-2">
            <History className="h-4 w-4" />
            {title}
          </CardTitle>
          <Badge variant="secondary">{filteredHistory.length}</Badge>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            {/* Search */}
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />

            {/* Filter by action */}
            {filterableActions && (
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Loại hành động" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hành động</SelectItem>
                  {filterableActions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Filter by user */}
            {filterableUsers && (
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="h-9">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Người thực hiện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {filterableUsers.map(user => (
                    <SelectItem key={user.systemId} value={user.systemId}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredHistory.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            {emptyMessage}
          </div>
        ) : (
          <div
            className="space-y-0 overflow-y-auto pr-2"
            style={{ maxHeight }}
          >
            {groupByDate && groupedHistory ? (
              // Grouped by date
              Array.from(groupedHistory.entries()).map(([date, entries]) => (
                <div key={date} className="mb-6 last:mb-0">
                  <div className="sticky top-0 bg-background z-10 pb-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {date}
                    </Badge>
                  </div>
                  <div className="space-y-0 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-border">
                    {entries.map(entry => renderHistoryEntry(entry, true))}
                  </div>
                </div>
              ))
            ) : (
              // Flat list with timeline
              <div className="relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-border">
                {filteredHistory.map(entry => renderHistoryEntry(entry, true))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
