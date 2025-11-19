import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, X, LayoutGrid, Table, AlertCircle, CheckCircle2, Clock, XCircle, AlertTriangle, Settings, Settings2, BarChart3, CheckCircle, FolderOpen, Ban, Link2, RefreshCw } from "lucide-react";
import Fuse from "fuse.js";
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from "../../lib/utils.ts";
import { toast } from "sonner";
import { asSystemId } from '@/lib/id-types';

// Types & Store
import type { Complaint, ComplaintStatus } from "./types.ts";
import { useComplaintStore } from "./store.ts";
import { useEmployeeStore } from "../employees/store.ts";
import {
  complaintStatusLabels,
  complaintStatusColors,
  complaintTypeLabels,
  complaintTypeColors,
} from "./types.ts";
import { checkOverdue, formatTimeLeft } from "./sla-utils.ts";

// UI Components
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Card } from "../../components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  } from "../../components/ui/dialog.tsx";
import { PageFilters } from "../../components/layout/page-filters.tsx";
import { DataTableFacetedFilter } from "../../components/data-table/data-table-faceted-filter.tsx";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";
import { DataTableToolbar } from "../../components/data-table/data-table-toolbar.tsx";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx";
import { SlaTimer } from "../../components/SlaTimer.tsx";
import { getColumns } from "./columns.tsx";
import { ComplaintCard } from "./complaint-card.tsx";
import { ComplaintCardContextMenu } from "./complaint-card-context-menu.tsx";// Hooks
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { useBreakpoint } from "../../contexts/breakpoint-context.tsx";
import { useRouteMeta } from "../../hooks/use-route-meta.ts";
import { loadCardColorSettings } from "../settings/complaints/complaints-settings-page.tsx";
import { useRealtimeUpdates, getDataVersion, triggerDataUpdate } from "./use-realtime-updates.ts";
import { generateTrackingUrl, getTrackingCode, isTrackingEnabled } from "./tracking-utils.ts";

/**
 * Kanban Column Component - Unified neutral header with search
 */
function KanbanColumn({
  status,
  complaints,
  onComplaintClick,
  employees,
  onEdit,
  onGetLink,
  onStartInvestigation,
  onFinish,
  onOpen,
  onCancel,
  onRemind,
}: {
  status: ComplaintStatus;
  complaints: Complaint[];
  onComplaintClick: (complaint: Complaint) => void;
  employees: Array<{ systemId: string; fullName: string }>;
  onEdit: (systemId: string) => void;
  onGetLink: (systemId: string) => void;
  onStartInvestigation: (systemId: string) => void;
  onFinish: (systemId: string) => void;
  onOpen: (systemId: string) => void;
  onCancel: (systemId: string) => void;
  onRemind: (systemId: string) => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // ⚡ VIRTUAL SCROLLING: Ref cho container
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const statusIcons: Record<ComplaintStatus, React.ElementType> = {
    pending: Clock,
    investigating: AlertCircle,
    resolved: CheckCircle2,
    cancelled: XCircle,
    ended: CheckCircle2, // ✅ FIXED: Thêm icon cho status "ended"
  };

  const StatusIcon = statusIcons[status];
  
  // Filter complaints based on local search
  const filteredComplaints = React.useMemo(() => {
    if (!searchQuery.trim()) return complaints;
    
    const query = searchQuery.toLowerCase();
    return complaints.filter(c => 
      (c.orderCode || c.orderSystemId).toLowerCase().includes(query) || // ⭐ Fallback to systemId
      c.customerName.toLowerCase().includes(query) ||
      c.customerPhone.includes(query) ||
      c.description.toLowerCase().includes(query)
    );
  }, [complaints, searchQuery]);
  
  // ⚡ VIRTUAL SCROLLING: Setup virtualizer
  const virtualizer = useVirtualizer({
    count: filteredComplaints.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated card height in pixels
    overscan: 5, // Render 5 extra items above/below viewport
  });

  return (
    <div className="flex-1 min-w-[300px] flex flex-col max-h-[calc(100vh-320px)]">
      {/* Header - Shadcn style with darker background */}
      <div className="text-sm font-semibold px-4 py-3 mb-2 rounded-lg border bg-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4" />
          {complaintStatusLabels[status]}
        </div>
        <span className="text-sm font-normal bg-background h-6 w-6 flex items-center justify-center rounded-full">
          {filteredComplaints.length}
        </span>
      </div>
      
      {/* Search Input - h-9 */}
      <div className="mb-2">
        <Input
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Scrollable Cards Area - Virtual Scrolling */}
      <div 
        ref={parentRef}
        className="flex-1 overflow-y-auto pb-2"
        style={{ 
          height: '100%',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const complaint = filteredComplaints[virtualItem.index];
            const overdueStatus = checkOverdue(complaint);
            const isOverdue = overdueStatus.isOverdueResponse || overdueStatus.isOverdueResolve;
            
            // Load card color settings
            const colorSettings = loadCardColorSettings();
            
            // Determine card color (priority order: overdue > priority > status)
            let cardColorClass = "";
            if (colorSettings.enableOverdueColor && isOverdue) {
              cardColorClass = colorSettings.overdueColor;
            } else if (colorSettings.enablePriorityColors && (complaint as any).priority) {
              const priority = (complaint as any).priority as 'low' | 'medium' | 'high' | 'urgent';
              cardColorClass = colorSettings.priorityColors[priority] || "";
            } else if (colorSettings.enableStatusColors) {
              cardColorClass = colorSettings.statusColors[complaint.status] || "";
            }
            
            return (
              <div
                key={complaint.systemId}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="pb-3">
                  <ComplaintCardContextMenu
                    complaint={complaint}
                    onEdit={onEdit}
                    onGetLink={onGetLink}
                    onStartInvestigation={onStartInvestigation}
                    onFinish={onFinish}
                    onOpen={onOpen}
                    onReject={onCancel}
                    onRemind={onRemind}
                  >
                    <Card
                      onClick={() => onComplaintClick(complaint)}
                      className={cn(
                        "p-4 cursor-pointer transition-colors hover:bg-accent",
                        cardColorClass
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm font-semibold">
                          {complaint.id}
                        </div>
                        <div className="flex items-center gap-1 flex-wrap justify-end">
                          <Badge
                            variant="outline"
                            className={cn("text-xs", complaintTypeColors[complaint.type])}
                          >
                            {complaintTypeLabels[complaint.type]}
                          </Badge>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="mb-2">
                        <div className="text-sm font-medium text-foreground mb-1">
                          Đơn hàng: #{complaint.orderCode || complaint.orderSystemId}
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span className="truncate">{complaint.customerName}</span>
                          <span className="flex-shrink-0">{complaint.customerPhone}</span>
                        </div>
                      </div>

                      {/* Description Preview */}
                      <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {complaint.description}
                      </div>

                      {/* SLA Timer - Live Countdown */}
                      <SlaTimer
                        startTime={complaint.createdAt}
                        targetMinutes={120} // 2 hours default for complaints
                        isCompleted={complaint.status === 'resolved' || complaint.status === 'cancelled'}
                        completedLabel="Đã giải quyết"
                        className="mb-2"
                      />

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {complaint.assignedTo && (() => {
                            const assignedEmployee = employees.find(e => e.systemId === complaint.assignedTo);
                            if (!assignedEmployee) return <span className="text-muted-foreground">Chưa giao</span>;
                            
                            // Get initials from full name (e.g. "Nguyễn Văn A" -> "NVA")
                            const initials = assignedEmployee.fullName
                              .split(' ')
                              .map(word => word[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 3);
                            
                            return (
                              <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-semibold">
                                  {initials}
                                </div>
                                <span className="text-muted-foreground max-w-[80px] truncate">
                                  {assignedEmployee.fullName}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(complaint.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </Card>
                  </ComplaintCardContextMenu>
                </div>
              </div>
            );
          })}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            Không có khiếu nại nào
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * =============================================
 * MAIN PAGE COMPONENT - Complaints Kanban View
 * =============================================
 */
export function ComplaintsPage() {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { setPageHeader } = usePageHeader();
  const routeMeta = useRouteMeta();

  // Store
  const {
    complaints,
    searchQuery,
    setSearchQuery,
    getComplaintsByStatus,
    getStats,
    updateComplaint,
  } = useComplaintStore();
  
  const { data: employees } = useEmployeeStore();

  // ==========================================
  // State Management
  // ==========================================
  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  
  // Filter states - giống Employees (dùng Set)
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = React.useState<Set<string>>(new Set());
  const [assignedToFilter, setAssignedToFilter] = React.useState<Set<string>>(new Set());

  // Table view states
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  // Column visibility - Initialize with all columns visible (like Employees)
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const defaultVisibleColumns = [
      'complaintId', 'orderCode', 'customerName', 'type', 'priority', 'status',
      'verification', 'slaStatus', 'assignedTo', 'affectedProducts',
      'createdAt', 'resolvedAt'
    ];
    const initial: Record<string, boolean> = {};
    const cols = getColumns(
      () => {}, () => {}, () => {}, () => {}, () => {}, () => {}, employees, navigate
    );
    cols.forEach((col) => {
      const colId = col.id || '';
      // select and actions are ALWAYS visible
      if (colId === 'select' || colId === 'actions') {
        initial[colId] = true;
      } else {
        initial[colId] = defaultVisibleColumns.includes(colId);
      }
    });
    return initial;
  });
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean } | null>(null);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'complaintId']);

  // Mobile infinite scroll
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  // Realtime updates
  const [dataVersion, setDataVersion] = React.useState(() => getDataVersion());
  const { hasUpdates, isPolling, refresh, togglePolling } = useRealtimeUpdates(
    dataVersion,
    () => {
      // Refresh data when updates available
      setDataVersion(getDataVersion());
      // Force re-render by updating state
      const newVersion = Date.now();
      setDataVersion(newVersion);
    },
    30000 // Check every 30 seconds
  );

  // Load card color settings
  const cardColors = React.useMemo(() => loadCardColorSettings(), []);

  // Get row style based on priority/status/overdue (same logic as card)
  const getRowStyle = React.useCallback((complaint: Complaint): React.CSSProperties => {
    // Check if overdue and overdue color is enabled
    const overdueStatus = checkOverdue(complaint);
    if (cardColors.enableOverdueColor && (overdueStatus.isOverdueResponse || overdueStatus.isOverdueResolve)) {
      const colorClass = cardColors.overdueColor;
      return parseColorClass(colorClass);
    }
    
    // Check priority color if enabled
    if (cardColors.enablePriorityColors && complaint.priority) {
      const colorClass = cardColors.priorityColors[complaint.priority];
      if (colorClass) {
        return parseColorClass(colorClass);
      }
    }
    
    // Check status color if enabled
    if (cardColors.enableStatusColors) {
      const colorClass = cardColors.statusColors[complaint.status];
      if (colorClass) {
        return parseColorClass(colorClass);
      }
    }
    
    return {};
  }, [cardColors]);

  // Helper function to parse Tailwind color classes to CSS
  function parseColorClass(colorClass: string): React.CSSProperties {
    if (!colorClass || typeof colorClass !== 'string') {
      return {};
    }
    
    // Extract Tailwind color from class (e.g., 'bg-yellow-50 border-yellow-200')
    const colorMap: Record<string, string> = {
      'bg-yellow-50': '#fefce8',
      'bg-blue-50': '#eff6ff',
      'bg-green-50': '#f0fdf4',
      'bg-gray-50': '#f9fafb',
      'bg-amber-50': '#fffbeb',
      'bg-orange-50': '#fff7ed',
      'bg-red-50': '#fef2f2',
      'bg-red-100': '#fee2e2',
      'bg-slate-50': '#f8fafc',
    };
    
    // Find the bg color class
    const bgClass = colorClass.split(' ').find(c => c.startsWith('bg-'));
    const hexColor = bgClass ? colorMap[bgClass] : null;
    
    if (!hexColor) return {};
    
    return {
      backgroundColor: hexColor,
    };
  }

  // Dialog confirm states
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Debounced search (300ms)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Filter options - giống Employees
  const statusOptions = React.useMemo(() => [
    { label: "Chờ xử lý", value: "pending" },
    { label: "Đang kiểm tra", value: "investigating" },
    { label: "Đã giải quyết", value: "resolved" },
    { label: "Đã hủy", value: "cancelled" },
  ], []);

  const typeOptions = React.useMemo(() => [
    { label: "Sai hàng", value: "wrong-product" },
    { label: "Thiếu hàng", value: "missing-items" },
    { label: "Đóng gói sai", value: "wrong-packaging" },
    { label: "Lỗi do kho", value: "warehouse-defect" },
    { label: "Tình trạng hàng", value: "product-condition" },
  ], []);

  const employeeOptions = React.useMemo(() => {
    return employees.map((emp) => ({
      label: emp.fullName,
      value: emp.systemId,
    }));
  }, [employees]);

  // ==========================================
  // Data Processing
  // ==========================================
  const stats = React.useMemo(() => getStats(), [getStats]);

  // Memoize Fuse instance
  const fuseInstance = React.useMemo(() => {
    return new Fuse(complaints, {
      keys: ["orderCode", "customerName", "customerPhone", "description"],
      threshold: 0.3,
    });
  }, [complaints]);

  const filteredComplaints = React.useMemo(() => {
    let result = [...complaints];

    // Apply status filter
    if (statusFilter.size > 0) {
      result = result.filter((c) => statusFilter.has(c.status));
    }

    // Apply type filter
    if (typeFilter.size > 0) {
      result = result.filter((c) => typeFilter.has(c.type));
    }

    // Apply employee filter
    if (assignedToFilter.size > 0) {
      result = result.filter((c) => c.assignedTo && assignedToFilter.has(c.assignedTo));
    }

    // Apply search with Fuse.js
    if (debouncedSearch) {
      result = fuseInstance.search(debouncedSearch).map((item) => item.item);
    }

    return result;
  }, [complaints, statusFilter, typeFilter, assignedToFilter, debouncedSearch, fuseInstance]);

  const complaintsByStatus = React.useMemo(() => {
    return {
      pending: filteredComplaints.filter((c) => c.status === "pending"),
      investigating: filteredComplaints.filter((c) => c.status === "investigating"),
      resolved: filteredComplaints.filter((c) => c.status === "resolved"),
      cancelled: filteredComplaints.filter((c) => c.status === "cancelled"),
    };
  }, [filteredComplaints]);

  // ==========================================
  // Event Handlers
  // ==========================================
  const handleComplaintClick = (complaint: Complaint) => {
    navigate(`/complaints/${complaint.systemId}`);
  };

  const handleCreateComplaint = () => {
    navigate("/complaints/new");
  };

  // Table view handlers
  const handleView = React.useCallback((systemId: string) => {
    navigate(`/complaints/${systemId}`);
  }, [navigate]);

  const handleEdit = React.useCallback((systemId: string) => {
    navigate(`/complaints/${systemId}/edit`);
  }, [navigate]);

  const handleFinish = React.useCallback((systemId: string) => {
    const complaint = complaints.find(c => c.systemId === systemId);
    if (!complaint) {
      toast.error('Không tìm thấy khiếu nại');
      return;
    }
    
    setConfirmDialog({
      open: true,
      title: 'Kết thúc khiếu nại',
      description: 'Bạn có chắc muốn kết thúc khiếu nại này?',
      onConfirm: () => {
        try {
          updateComplaint(asSystemId(systemId), {
            status: 'resolved',
            updatedAt: new Date(),
            resolvedAt: new Date(),
            timeline: [
              ...complaint.timeline,
              {
                id: asSystemId(`action_${Date.now()}`),
                actionType: 'resolved',
                performedBy: asSystemId('Admin'), // TODO: Get from auth
                performedAt: new Date(),
                note: 'Kết thúc khiếu nại từ Kanban view',
              },
            ],
          } as any);
          toast.success('Đã kết thúc khiếu nại thành công');
          triggerDataUpdate();
        } catch (error) {
          toast.error('Không thể kết thúc khiếu nại');
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  }, [complaints, updateComplaint]);

  const handleOpen = React.useCallback((systemId: string) => {
    const complaint = complaints.find(c => c.systemId === systemId);
    if (!complaint) {
      toast.error('Không tìm thấy khiếu nại');
      return;
    }
    
    setConfirmDialog({
      open: true,
      title: 'Mở lại khiếu nại',
      description: 'Bạn có chắc muốn mở lại khiếu nại này?',
      onConfirm: () => {
        try {
          updateComplaint(asSystemId(systemId), {
            status: 'investigating',
            // ⭐ Xóa các trường ended/resolved để về trạng thái mở
            endedBy: undefined,
            endedAt: undefined,
            resolvedBy: undefined,
            resolvedAt: undefined,
            cancelledBy: undefined,
            cancelledAt: undefined,
            updatedAt: new Date(),
            timeline: [
              ...complaint.timeline,
              {
                id: asSystemId(`action_${Date.now()}`),
                actionType: 'reopened',
                performedBy: asSystemId('Admin'), // TODO: Get from auth
                performedAt: new Date(),
                note: 'Mở lại khiếu nại từ Kanban view',
              },
            ],
          } as any);
          toast.success('Đã mở lại khiếu nại thành công');
          triggerDataUpdate();
        } catch (error) {
          toast.error('Không thể mở lại khiếu nại');
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  }, [complaints, updateComplaint]);

  const handleCancel = React.useCallback((systemId: string) => {
    const complaint = complaints.find(c => c.systemId === systemId);
    if (!complaint) {
      toast.error('Không tìm thấy khiếu nại');
      return;
    }
    
    setConfirmDialog({
      open: true,
      title: 'Hủy khiếu nại',
      description: 'Bạn có chắc muốn hủy khiếu nại này?',
      onConfirm: () => {
        try {
          updateComplaint(asSystemId(systemId), {
            status: 'cancelled',
            updatedAt: new Date(),
            cancelledAt: new Date(),
            timeline: [
              ...complaint.timeline,
              {
                id: asSystemId(`action_${Date.now()}`),
                actionType: 'cancelled',
                performedBy: asSystemId('Admin'), // TODO: Get from auth
                performedAt: new Date(),
                note: 'Hủy khiếu nại từ Kanban view',
              },
            ],
          } as any);
          toast.success('Đã hủy khiếu nại thành công');
          triggerDataUpdate();
        } catch (error) {
          toast.error('Không thể hủy khiếu nại');
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  }, [complaints, updateComplaint]);

  const handleStartInvestigation = React.useCallback((systemId: string) => {
    const complaint = complaints.find(c => c.systemId === systemId);
    if (!complaint) {
      toast.error('Không tìm thấy khiếu nại');
      return;
    }
    
    setConfirmDialog({
      open: true,
      title: 'Bắt đầu xử lý',
      description: 'Bạn có chắc muốn bắt đầu xử lý khiếu nại này?',
      onConfirm: () => {
        try {
          updateComplaint(asSystemId(systemId), {
            status: 'investigating',
            updatedAt: new Date(),
            timeline: [
              ...complaint.timeline,
              {
                id: asSystemId(`action_${Date.now()}`),
                actionType: 'investigating',
                performedBy: asSystemId('Admin'), // TODO: Get from auth
                performedAt: new Date(),
                note: 'Bắt đầu xử lý khiếu nại từ Kanban view',
              },
            ],
          } as any);
          toast.success('Đã bắt đầu xử lý khiếu nại');
          triggerDataUpdate();
        } catch (error) {
          toast.error('Không thể bắt đầu xử lý khiếu nại');
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  }, [complaints, updateComplaint]);

  const handleGetLink = React.useCallback((systemId: string) => {
    try {
      const complaint = complaints.find(c => c.systemId === systemId);
      if (!complaint) {
        toast.error('Không tìm thấy khiếu nại');
        return;
      }

      // Check if tracking is enabled
      if (!isTrackingEnabled()) {
        toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
        return;
      }

      // Generate tracking URL and code
      const trackingUrl = generateTrackingUrl(complaint);
      const trackingCode = getTrackingCode(complaint.id);
      
      // Copy to clipboard
      navigator.clipboard.writeText(trackingUrl);
      
      // Show success with tracking code
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-semibold">Đã copy link tracking</div>
          <div className="text-sm text-muted-foreground">Mã theo dõi: {trackingCode}</div>
        </div>,
        { duration: 5000 }
      );
    } catch (error) {
      toast.error('Không thể copy link tracking');
    }
  }, [complaints]);

  const handleRemind = React.useCallback((systemId: string) => {
    const complaint = complaints.find(c => c.systemId === systemId);
    if (!complaint) {
      toast.error('Không tìm thấy khiếu nại');
      return;
    }
    
    toast.success(
      <div className="flex flex-col gap-1">
        <div className="font-semibold">Đã gửi thông báo nhắc nhở</div>
        <div className="text-sm text-muted-foreground">
          Khiếu nại: {complaint.id}
        </div>
      </div>,
      { duration: 3000 }
    );
  }, [complaints]);

  const handleRowClick = React.useCallback((complaint: Complaint) => {
    navigate(`/complaints/${complaint.systemId}`);
  }, [navigate]);

  // Get columns
  const columns = React.useMemo(
    () => getColumns(
      handleView, 
      handleEdit, 
      handleFinish, 
      handleOpen, 
      handleCancel, 
      handleGetLink, 
      employees,
      navigate
    ),
    [handleView, handleEdit, handleFinish, handleOpen, handleCancel, handleGetLink, employees, navigate]
  );

  // Set page header - CHỈ truyền actions (title & breadcrumb tự động generate)
  const actions = React.useMemo(() => [
    <Button
      key="live-toggle"
      variant={isPolling ? "default" : "outline"}
      size="sm"
      className="h-9"
      onClick={togglePolling}
      title={isPolling ? "Tắt cập nhật tự động" : "Bật cập nhật tự động"}
    >
      <RefreshCw className={cn("h-4 w-4 mr-2", isPolling && "animate-spin")} />
      {isPolling ? "Live" : "Cài đặt"}
    </Button>,
    <Button
      key="view-toggle"
      onClick={() => setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')}
      variant="outline"
      size="sm"
      className="h-9"
    >
      {viewMode === 'kanban' ? (
        <>
          <Table className="h-4 w-4 mr-2" />
          Chế độ bảng
        </>
      ) : (
        <>
          <LayoutGrid className="h-4 w-4 mr-2" />
          Chế độ Kanban
        </>
      )}
    </Button>,
    <Button
      key="statistics"
      variant="outline"
      onClick={() => navigate("/complaints/statistics")}
      className="h-9"
    >
      <BarChart3 className="h-4 w-4 mr-2" />
      Thống kê
    </Button>,
    <Button
      key="create"
      onClick={() => navigate("/complaints/new")}
      className="h-9"
    >
      <Plus className="h-4 w-4 mr-2" />
      Tạo khiếu nại
    </Button>,
  ], [navigate, viewMode, isPolling, togglePolling]);

  usePageHeader({ actions });

  // Set column order on mount
  React.useEffect(() => {
    if (columnOrder.length === 0) {
      setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    }
  }, []);  // Empty deps - run once

  // Calculate pagination
  const pageCount = Math.ceil(filteredComplaints.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredComplaints.slice(start, end);
  }, [filteredComplaints, pagination.pageIndex, pagination.pageSize]);

  // Mobile display data
  const displayData = isMobile 
    ? filteredComplaints.slice(0, mobileLoadedCount)
    : paginatedData;

  // Selected rows
  const allSelectedRows = React.useMemo(() => 
    Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(systemId => filteredComplaints.find(c => c.systemId === systemId))
      .filter(Boolean) as Complaint[],
    [rowSelection, filteredComplaints]
  );

  // Bulk actions
  const handleBulkFinish = React.useCallback(() => {
    if (allSelectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khiếu nại');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Kết thúc khiếu nại',
      description: `Bạn có chắc muốn kết thúc ${allSelectedRows.length} khiếu nại đã chọn?`,
      onConfirm: () => {
        try {
          allSelectedRows.forEach(complaint => {
            // TODO: Implement bulk finish logic
            console.log('Kết thúc khiếu nại:', complaint.systemId);
          });
          toast.success(`Đã kết thúc ${allSelectedRows.length} khiếu nại`);
          setRowSelection({});
        } catch (error) {
          toast.error('Không thể kết thúc khiếu nại');
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  }, [allSelectedRows]);

  const handleBulkOpen = React.useCallback(() => {
    if (allSelectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khiếu nại');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Mở lại khiếu nại',
      description: `Bạn có chắc muốn mở ${allSelectedRows.length} khiếu nại đã chọn?`,
      onConfirm: () => {
        try {
          allSelectedRows.forEach(complaint => {
            // TODO: Implement bulk open logic
            console.log('Mở khiếu nại:', complaint.systemId);
          });
          toast.success(`Đã mở lại ${allSelectedRows.length} khiếu nại`);
          setRowSelection({});
        } catch (error) {
          toast.error('Không thể mở lại khiếu nại');
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  }, [allSelectedRows]);

  const handleBulkCancel = React.useCallback(() => {
    if (allSelectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khiếu nại');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Hủy khiếu nại',
      description: `Bạn có chắc muốn hủy ${allSelectedRows.length} khiếu nại đã chọn?`,
      onConfirm: () => {
        try {
          allSelectedRows.forEach(complaint => {
            // TODO: Implement bulk cancel logic
            console.log('Hủy khiếu nại:', complaint.systemId);
          });
          toast.success(`Đã hủy ${allSelectedRows.length} khiếu nại`);
          setRowSelection({});
        } catch (error) {
          toast.error('Không thể hủy khiếu nại');
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  }, [allSelectedRows]);

  const handleBulkGetLink = React.useCallback(() => {
    if (allSelectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khiếu nại');
      return;
    }

    // Check if tracking is enabled
    if (!isTrackingEnabled()) {
      toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
      return;
    }

    try {
      const trackingLinks = allSelectedRows.map(c => {
        const trackingUrl = generateTrackingUrl(c);
        const trackingCode = getTrackingCode(c.id);
        return `${trackingCode}: ${trackingUrl}`;
      });
      
      navigator.clipboard.writeText(trackingLinks.join('\n'));
      toast.success(`Đã copy ${allSelectedRows.length} link tracking vào clipboard`);
    } catch (error) {
      toast.error('Không thể copy link tracking');
    }
  }, [allSelectedRows]);

  const bulkActions = React.useMemo(() => [
    {
      label: 'Kết thúc',
      onSelect: handleBulkFinish
    },
    {
      label: 'Mở',
      onSelect: handleBulkOpen
    },
    {
      label: 'Get Link',
      onSelect: handleBulkGetLink
    },
    {
      label: 'Hủy',
      onSelect: handleBulkCancel
    }
  ], [handleBulkFinish, handleBulkOpen, handleBulkGetLink, handleBulkCancel]);

  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [searchQuery, statusFilter, typeFilter, assignedToFilter]);

  // Mobile infinite scroll
  React.useEffect(() => {
    if (!isMobile || viewMode !== 'table') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition >= documentHeight * 0.8) {
        setMobileLoadedCount(prev => Math.min(prev + 20, filteredComplaints.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, filteredComplaints.length, viewMode]);

  const handleClearFilters = () => {
    setStatusFilter(new Set());
    setTypeFilter(new Set());
    setAssignedToFilter(new Set());
    setSearchQuery("");
  };

  const hasActiveFilters =
    statusFilter.size > 0 ||
    typeFilter.size > 0 ||
    assignedToFilter.size > 0 ||
    searchQuery !== "";

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="flex flex-col w-full h-full">
      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="space-y-4">
          {/* Kanban Toolbar - Filters */}
          <div className="space-y-2">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Tìm theo mã, đơn hàng, khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 max-w-xs"
              />
              
              <DataTableFacetedFilter
                title="Trạng thái"
                options={statusOptions}
                selectedValues={statusFilter}
                onSelectedValuesChange={setStatusFilter}
              />
              
              <DataTableFacetedFilter
                title="Loại khiếu nại"
                options={typeOptions}
                selectedValues={typeFilter}
                onSelectedValuesChange={setTypeFilter}
              />
              
              <DataTableFacetedFilter
                title="Người xử lý"
                options={employeeOptions}
                selectedValues={assignedToFilter}
                onSelectedValuesChange={setAssignedToFilter}
              />
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-9 px-2 lg:px-3"
                >
                  Xóa lọc
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            <KanbanColumn
              status="pending"
              complaints={complaintsByStatus.pending}
              onComplaintClick={handleComplaintClick}
              employees={employees}
              onEdit={handleEdit}
              onGetLink={handleGetLink}
              onStartInvestigation={handleStartInvestigation}
              onFinish={handleFinish}
              onOpen={handleOpen}
              onCancel={handleCancel}
              onRemind={handleRemind}
            />
            <KanbanColumn
              status="investigating"
              complaints={complaintsByStatus.investigating}
              onComplaintClick={handleComplaintClick}
              employees={employees}
              onEdit={handleEdit}
              onGetLink={handleGetLink}
              onStartInvestigation={handleStartInvestigation}
              onFinish={handleFinish}
              onOpen={handleOpen}
              onCancel={handleCancel}
              onRemind={handleRemind}
            />
            <KanbanColumn
              status="resolved"
              complaints={complaintsByStatus.resolved}
              onComplaintClick={handleComplaintClick}
              employees={employees}
              onEdit={handleEdit}
              onGetLink={handleGetLink}
              onStartInvestigation={handleStartInvestigation}
              onFinish={handleFinish}
              onOpen={handleOpen}
              onCancel={handleCancel}
              onRemind={handleRemind}
            />
            <KanbanColumn
              status="cancelled"
              complaints={complaintsByStatus.cancelled}
              onComplaintClick={handleComplaintClick}
              employees={employees}
              onEdit={handleEdit}
              onGetLink={handleGetLink}
              onStartInvestigation={handleStartInvestigation}
              onFinish={handleFinish}
              onOpen={handleOpen}
              onCancel={handleCancel}
              onRemind={handleRemind}
            />
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <>
          {/* Toolbar - Hàng 1: Cài đặt + Điều chỉnh cột */}
          <div className="flex items-center justify-end gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => navigate("/settings/complaints")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </Button>
            <DataTableColumnCustomizer<Complaint>
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
            />
          </div>

          {/* Filters - Hàng 2: Search + Filters */}
          <PageFilters
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm theo đơn hàng, khách hàng, SĐT..."
          >
            <DataTableFacetedFilter
              title="Trạng thái"
              options={statusOptions}
              selectedValues={statusFilter}
              onSelectedValuesChange={setStatusFilter}
            />
            <DataTableFacetedFilter
              title="Loại khiếu nại"
              options={typeOptions}
              selectedValues={typeFilter}
              onSelectedValuesChange={setTypeFilter}
            />
            {employeeOptions.length > 0 && (
              <DataTableFacetedFilter
                title="Nhân viên xử lý"
                options={employeeOptions}
                selectedValues={assignedToFilter}
                onSelectedValuesChange={setAssignedToFilter}
              />
            )}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-9">
                <X className="h-4 w-4 mr-1" />
                Xóa lọc
              </Button>
            )}
          </PageFilters>

          {/* Data Table */}
          <ResponsiveDataTable
            data={displayData}
            columns={columns}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            allSelectedRows={allSelectedRows}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            sorting={sorting}
            setSorting={setSorting}
            pagination={pagination}
            setPagination={setPagination}
            pageCount={pageCount}
            rowCount={filteredComplaints.length}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            onRowClick={handleRowClick}
            getRowStyle={getRowStyle}
            bulkActions={bulkActions}
            renderMobileCard={(complaint) => (
              <ComplaintCard
                key={complaint.systemId}
                complaint={complaint}
                onClick={() => handleComplaintClick(complaint)}
                employees={employees}
              />
            )}
          />
        </>
      )}

      {/* Mobile loading indicator */}
      {isMobile && viewMode === 'table' && (
        <div className="py-6 text-center">
          {mobileLoadedCount < filteredComplaints.length ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">Đang tải thêm...</span>
            </div>
          ) : filteredComplaints.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              Đã hiển thị tất cả {filteredComplaints.length} khiếu nại
            </p>
          ) : null}
        </div>
      )}

      {/* Empty State */}
      {filteredComplaints.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chưa có khiếu nại nào</h3>
          <p className="text-muted-foreground mb-4">
            {hasActiveFilters
              ? "Không tìm thấy khiếu nại phù hợp với bộ lọc"
              : "Bắt đầu bằng cách tạo khiếu nại mới"}
          </p>
          {!hasActiveFilters && (
            <Button onClick={handleCreateComplaint} className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              Tạo khiếu nại đầu tiên
            </Button>
          )}
        </div>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="h-9"
              onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            >
              Hủy
            </Button>
            <Button className="h-9" onClick={confirmDialog.onConfirm}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
