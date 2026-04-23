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
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatDateForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';

// Separate component for metadata to avoid TS2322 with unknown types
function MetadataDisplay({ showMetadata, metadata }: { showMetadata: boolean; metadata?: HistoryEntry['metadata'] }) {
  if (!showMetadata || !metadata) return null;
  
  const hasOldNew = metadata.oldValue != null || metadata.newValue != null;
  
  return (
    <>
      {metadata.note != null && (
        <div className="text-sm text-muted-foreground italic border-l-2 border-muted pl-3 mt-1">
          {String(metadata.note)}
        </div>
      )}
      {hasOldNew && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {metadata.oldValue != null && (
            <span className="px-2 py-0.5 bg-destructive/10 text-destructive rounded">
              {String(metadata.oldValue)}
            </span>
          )}
          {metadata.oldValue != null && metadata.newValue != null && (
            <ArrowRight className="h-3 w-3" />
          )}
          {metadata.newValue != null && (
            <span className="px-2 py-0.5 bg-success/10 text-success-foreground rounded">
              {String(metadata.newValue)}
            </span>
          )}
        </div>
      )}
    </>
  );
}

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
    oldValue?: unknown;
    newValue?: unknown;
    field?: string | undefined;
    [key: string]: unknown;
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
  // Pagination options
  total?: number;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
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
  // Pagination
  total,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
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
    const styles: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
      created: { icon: Plus, color: 'text-success', bgColor: 'bg-success/15' },
      updated: { icon: Edit, color: 'text-info', bgColor: 'bg-info/15' },
      deleted: { icon: Trash2, color: 'text-destructive', bgColor: 'bg-destructive/15' },
      status_changed: { icon: CheckCircle2, color: 'text-purple-600', bgColor: 'bg-purple-100' },
      assigned: { icon: User, color: 'text-warning', bgColor: 'bg-warning/25' },
      product_added: { icon: Package, color: 'text-teal-600', bgColor: 'bg-teal-100' },
      product_updated: { icon: Package, color: 'text-info', bgColor: 'bg-info/15' },
      product_removed: { icon: Package, color: 'text-destructive', bgColor: 'bg-destructive/15' },
      payment_made: { icon: DollarSign, color: 'text-success', bgColor: 'bg-success/15' },
      comment_added: { icon: FileText, color: 'text-muted-foreground', bgColor: 'bg-muted' },
      attachment_added: { icon: FileText, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
      
      // Complaint-specific actions
      verified: { icon: CheckCircle2, color: 'text-info', bgColor: 'bg-info/15' },
      'verified-correct': { icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/15' },
      'verified-incorrect': { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/15' },
      investigated: { icon: AlertCircle, color: 'text-info', bgColor: 'bg-info/15' },
      resolved: { icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/15' },
      rejected: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/15' },
      cancelled: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/15' },
      ended: { icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/15' },
      reopened: { icon: History, color: 'text-purple-600', bgColor: 'bg-purple-100' },
      commented: { icon: FileText, color: 'text-muted-foreground', bgColor: 'bg-muted' },
      
      custom: { icon: AlertCircle, color: 'text-muted-foreground', bgColor: 'bg-muted' },
    };

    return styles[action] || styles.custom;
  };

  const renderHistoryEntry = (entry: HistoryEntry, showDate: boolean = false) => {
    const style = getActionStyle(entry.action);
    const Icon = style.icon;
    const _hasNote = Boolean(entry.metadata?.note != null);

    return (
      <div className="flex gap-3 pb-4 last:pb-0">
        {/* Icon */}
        <div className={cn('shrink-0 w-8 h-8 rounded-full flex items-center justify-center', style.bgColor)}>
          <Icon className={cn('h-4 w-4', style.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Description */}
          <div className="text-sm">
            {entry.content != null ? entry.content : (entry.description ?? '')}
          </div>

          {/* Metadata section - temporarily extracted to separate component */}
          <MetadataDisplay 
            showMetadata={showMetadata}
            metadata={entry.metadata}
          />

          {/* User & Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {showUser && (
              <>
                <Avatar className="h-5 w-5">
                  <AvatarImage src={entry.user.avatar} />
                  <AvatarFallback className="text-xs">
                    {entry.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{entry.user.name}</span>
              </>
            )}

            {showTimestamp && entry.timestamp && (
              <>
                <Clock className="h-3 w-3" />
                <span>
                  {(() => {
                    try {
                      const date = entry.timestamp instanceof Date 
                        ? entry.timestamp 
                        : new Date(entry.timestamp);
                      if (isNaN(date.getTime())) return '---';
                      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
                    } catch {
                      return '---';
                    }
                  })()}
                </span>
                {showDate && (
                  <span className="text-xs">
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
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {title}
          </CardTitle>
          <Badge variant="secondary">
            {total !== undefined ? `${filteredHistory.length}/${total}` : filteredHistory.length}
          </Badge>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            {/* Search */}
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Filter by action */}
            {filterableActions && (
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
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
                <SelectTrigger>
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
                    {entries.map((entry, idx) => (
                      <div key={entry.id || `entry-${date}-${idx}`}>
                        {renderHistoryEntry(entry, true)}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Flat list with timeline
              <div className="relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-border">
                {filteredHistory.map((entry, idx) => (
                  <div key={entry.id || `entry-${idx}`}>
                    {renderHistoryEntry(entry, true)}
                  </div>
                ))}
              </div>
            )}
            
            {/* Load More Button */}
            {hasMore && onLoadMore && (
              <div className="flex justify-center pt-4 border-t mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className="gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Xem thêm ({total !== undefined ? total - filteredHistory.length : '...'} còn lại)
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
