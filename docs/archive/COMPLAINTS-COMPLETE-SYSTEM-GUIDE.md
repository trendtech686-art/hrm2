# HỆ THỐNG QUẢN LÝ KHIẾU NẠI - HƯỚNG DẪN HOÀN CHỈNH

> **Mục đích**: Document này mô tả đầy đủ UI/UX và chức năng của hệ thống Complaints để có thể nhân bản sang các module khác (Orders, Warranty, Tasks, etc.)

## 📋 MỤC LỤC

1. [Tổng quan Architecture](#1-tổng-quan-architecture)
2. [UI Components & Layout](#2-ui-components--layout)
3. [Chức năng Core](#3-chức-năng-core)
4. [Hệ thống phụ trợ](#4-hệ-thống-phụ-trợ)
5. [Checklist nhân bản](#5-checklist-nhân-bản)

---

## 1. TỔNG QUAN ARCHITECTURE

### 1.1. Cấu trúc File

```
features/complaints/
├── page.tsx                          # Main page - Kanban + Table view
├── detail-page.tsx                   # Chi tiết khiếu nại
├── form-page.tsx                     # Form tạo/sửa
├── statistics-page.tsx               # Trang thống kê
├── columns.tsx                       # Table columns definition
├── types.ts                          # TypeScript types
├── store.ts                          # Zustand store
├── sample-data.ts                    # Sample data
│
├── complaint-card.tsx                # Mobile card component
├── complaint-card-context-menu.tsx   # Right-click menu
├── sla-timer.tsx                     # Live countdown timer
│
├── hooks/
│   ├── use-complaint-time-tracking.ts   # SLA monitoring
│   ├── use-complaint-reminders.ts       # Auto reminders
│   ├── use-complaint-statistics.ts      # Statistics
│   └── use-complaint-permissions.ts     # Role-based permissions
│
├── sla-utils.ts                      # SLA calculations
├── tracking-utils.ts                 # Public tracking links
├── notification-utils.ts             # Notification system
└── use-realtime-updates.ts          # Real-time polling
```

### 1.2. Tech Stack

- **UI**: React + TypeScript + Tailwind CSS + Shadcn/ui
- **State**: Zustand (local state management)
- **Search**: Fuse.js (fuzzy search)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Toast**: Sonner
- **Date**: date-fns

---

## 2. UI COMPONENTS & LAYOUT

### 2.1. Main Page Layout (page.tsx)

#### **A. Dual View Mode**

```tsx
// Toggle giữa Kanban và Table view
const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

// Header actions
<div key="view-toggle" className="flex items-center border rounded-lg">
  <Button variant={viewMode === "kanban" ? "secondary" : "ghost"} size="sm">
    <LayoutGrid className="h-4 w-4" />
  </Button>
  <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="sm">
    <Table className="h-4 w-4" />
  </Button>
</div>
```

**Lý do**: Người dùng khác nhau thích view khác nhau
- **Kanban**: Visual, dễ drag-drop, phù hợp với workflow
- **Table**: Chi tiết, dễ so sánh, export data

#### **B. Kanban View**

**Structure**:
```
┌─────────────────────────────────────────────────┐
│  [Realtime Toggle] [Settings]                   │
│  [Search] [Status Filter] [Type Filter] [Clear] │
├─────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ PENDING  │ │INVESTIG..│ │ RESOLVED │        │
│  │    (5)   │ │    (3)   │ │    (12)  │        │
│  ├──────────┤ ├──────────┤ ├──────────┤        │
│  │ [Search] │ │ [Search] │ │ [Search] │        │
│  ├──────────┤ ├──────────┤ ├──────────┤        │
│  │  Card 1  │ │  Card 1  │ │  Card 1  │        │
│  │  Card 2  │ │  Card 2  │ │  Card 2  │        │
│  │  Card 3  │ │  ...     │ │  ...     │        │
│  │  ...     │ │          │ │          │        │
│  └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────┘
```

**Features**:
1. **Column Header**: Icon + Label + Count badge
2. **Local Search**: Mỗi column có search riêng
3. **Context Menu**: Right-click trên card để show actions
4. **Card Color**: Theo priority/status/overdue (configurable)
5. **Scroll**: Vertical scroll trong mỗi column

**Card Component** (`complaint-card.tsx`):
```tsx
<Card className="p-4 cursor-pointer hover:bg-accent">
  {/* Header: ID + Badge */}
  <div className="flex items-start justify-between mb-2">
    <div className="text-sm font-semibold">{complaint.id}</div>
    <Badge>{complaintTypeLabels[complaint.type]}</Badge>
  </div>

  {/* Order Info */}
  <div className="mb-2">
    <div className="text-sm font-medium">Đơn hàng: #{orderCode}</div>
    <div className="text-xs text-muted-foreground">
      <span>{customerName}</span>
      <span>{customerPhone}</span>
    </div>
  </div>

  {/* Description Preview */}
  <div className="text-xs text-muted-foreground line-clamp-2">
    {description}
  </div>

  {/* SLA Timer - Live countdown */}
  <SlaTimer complaint={complaint} />

  {/* Footer: Assigned + Date */}
  <div className="flex items-center justify-between text-xs">
    <div className="flex items-center gap-2">
      <Avatar initials="NVA" />
      <span>{assignedEmployee.fullName}</span>
    </div>
    <div>{createdAt}</div>
  </div>
</Card>
```

#### **C. Table View**

**Structure**:
```
┌─────────────────────────────────────────────────┐
│  [Settings] [Column Customizer]                 │
│  [Search] [Status Filter] [Type Filter] [Clear] │
├─────────────────────────────────────────────────┤
│  ☑ │ ID     │ Order │ Customer │ Status │ ...  │
│  ☐ │ KN-001 │ DH123 │ Nguyen A │ Pending│ ...  │
│  ☐ │ KN-002 │ DH124 │ Tran B   │ Investig...│  │
│  ☑ │ KN-003 │ DH125 │ Le C     │ Resolved...│  │
│  ...                                            │
├─────────────────────────────────────────────────┤
│  Selected: 2 items [Bulk Actions ▼]            │
│  Showing 1-20 of 150   [< 1 2 3 ... 8 >]       │
└─────────────────────────────────────────────────┘
```

**Features**:
1. **Responsive Columns**: Auto-hide columns on mobile
2. **Column Customizer**: Show/hide, reorder, pin columns
3. **Row Selection**: Checkbox select + bulk actions
4. **Row Colors**: Same logic as Kanban cards
5. **Pagination**: Server-side style (20/50/100 per page)
6. **Mobile**: Infinite scroll + Card view

**Column Definition** (`columns.tsx`):
```tsx
export function getColumns(
  handleView: (id: string) => void,
  handleEdit: (id: string) => void,
  // ... other handlers
): ColumnDef<Complaint>[] {
  return [
    // Select column
    {
      id: 'select',
      header: ({ table }) => <Checkbox />,
      cell: ({ row }) => <Checkbox />,
    },
    // ID column
    {
      id: 'complaintId',
      accessorKey: 'id',
      header: 'Mã KN',
      cell: ({ row }) => (
        <Button variant="link" onClick={() => handleView(row.original.systemId)}>
          {row.original.id}
        </Button>
      ),
    },
    // Status with badge
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Badge className={complaintStatusColors[row.original.status]}>
          {complaintStatusLabels[row.original.status]}
        </Badge>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    // SLA Status with live timer
    {
      id: 'slaStatus',
      header: 'SLA',
      cell: ({ row }) => <SlaTimer complaint={row.original} />,
    },
    // Actions column (always visible)
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger><MoreHorizontal /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleView(row.original.systemId)}>
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original.systemId)}>
              Sửa
            </DropdownMenuItem>
            {/* Context-based actions */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
```

### 2.2. Context Menu System

**File**: `complaint-card-context-menu.tsx`

**Features**:
- Right-click trên card/row để show menu
- Menu thay đổi theo status (status-aware actions)
- No icons (clean design)

**Implementation**:
```tsx
export function ComplaintCardContextMenu({
  complaint,
  children,
  onEdit,
  onGetLink,
  onStartInvestigation,
  onFinish,
  onOpen,
  onReject,
  onRemind,
}: ComplaintCardContextMenuProps) {
  const renderMenuItems = () => {
    switch (complaint.status) {
      case 'pending':
        return (
          <>
            <ContextMenuItem onClick={() => onEdit(complaint.systemId)}>
              Sửa thông tin
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onStartInvestigation(complaint.systemId)}>
              Bắt đầu xử lý
            </ContextMenuItem>
            {isTrackingEnabled() && (
              <ContextMenuItem onClick={() => onGetLink(complaint.systemId)}>
                Copy link tracking
              </ContextMenuItem>
            )}
            <ContextMenuItem onClick={() => onRemind(complaint.systemId)}>
              Gửi thông báo nhắc nhở
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onClick={() => onReject(complaint.systemId)}
              className="text-red-600"
            >
              Từ chối khiếu nại
            </ContextMenuItem>
          </>
        );
      
      case 'investigating':
        return (
          <>
            <ContextMenuItem onClick={() => onEdit(complaint.systemId)}>
              Sửa thông tin
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onFinish(complaint.systemId)}>
              Hoàn thành
            </ContextMenuItem>
            {/* ... */}
          </>
        );
      
      case 'resolved':
      case 'rejected':
        return (
          <>
            {isTrackingEnabled() && (
              <ContextMenuItem onClick={() => onGetLink(complaint.systemId)}>
                Copy link tracking
              </ContextMenuItem>
            )}
            <ContextMenuItem onClick={() => onOpen(complaint.systemId)}>
              Mở lại
            </ContextMenuItem>
          </>
        );
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        {renderMenuItems()}
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

**Status-based Actions**:

| Status | Actions Available |
|--------|------------------|
| **PENDING** | • Sửa thông tin<br>• Bắt đầu xử lý<br>• Copy link tracking<br>• Gửi nhắc nhở<br>• Từ chối (red) |
| **INVESTIGATING** | • Sửa thông tin<br>• Hoàn thành<br>• Copy link tracking<br>• Gửi nhắc nhở<br>• Từ chối (red) |
| **RESOLVED** | • Copy link tracking<br>• Mở lại |
| **REJECTED** | • Copy link tracking<br>• Mở lại |

### 2.3. Detail Page Layout

**File**: `detail-page.tsx`

**Structure**:
```
┌─────────────────────────────────────────────────┐
│  ← Quay lại   [Từ chối] [Sửa] [Mẫu phản hồi]   │
├─────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐  │
│  │ [Xác minh khiếu nại]                      │  │
│  │ [Khiếu nại Đúng]  [Khiếu nại Sai]        │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────┐ ┌────────────────────┐   │
│  │ Thông tin KN     │ │ Trạng thái xử lý   │   │
│  │ ID: KN-001       │ │ Status: PENDING    │   │
│  │ Order: DH123     │ │ Assigned: NVA      │   │
│  │ Customer: ...    │ │ Priority: HIGH     │   │
│  └──────────────────┘ └────────────────────┘   │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │ Theo dõi SLA & Thời gian xử lý           │  │
│  │ ┌───────────┐ ┌───────────┐             │  │
│  │ │ Phản hồi  │ │ Giải quyết│             │  │
│  │ │ 2h / 4h   │ │ 12h / 48h │             │  │
│  │ │ [OK]      │ │ [WARNING] │             │  │
│  │ └───────────┘ └───────────┘             │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │ Bình luận (5)                             │  │
│  │ ┌─────────────────────────────────────┐   │  │
│  │ │ NVA - 2h ago                        │   │  │
│  │ │ Đã liên hệ khách hàng...            │   │  │
│  │ └─────────────────────────────────────┘   │  │
│  │ [Textarea + Upload]                       │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │ Timeline                                   │  │
│  │ ○ Tạo khiếu nại - 3h ago                  │  │
│  │ ○ Giao cho NVA - 2h ago                   │  │
│  │ ○ Bắt đầu xử lý - 1h ago                  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Key Sections**:

1. **Verification Card** (conditional - chỉ hiện khi chưa verify):
```tsx
{!isVerified && complaint.status !== "rejected" && (
  <Card className="border-2 border-primary/20">
    <CardHeader>
      <CardTitle>Xác minh khiếu nại</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex gap-3">
        <Button onClick={handleVerifyCorrect}>
          Khiếu nại Đúng
        </Button>
        <Button variant="outline" onClick={handleVerifyIncorrect}>
          Khiếu nại Sai
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

2. **Time Tracking Card** (clean, no colors):
```tsx
<Card>
  <CardHeader>
    <CardTitle>Theo dõi SLA & Thời gian xử lý</CardTitle>
    <CardDescription>
      Mục tiêu: Phản hồi trong 4h • Giải quyết trong 48h
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Current processing time - for ongoing */}
    {complaint.status !== 'resolved' && (
      <div className="p-3 rounded-lg border">
        <div className="text-xs text-muted-foreground">Đang xử lý</div>
        <div className="text-lg font-bold">
          {timeTracking.currentProcessingTimeFormatted}
        </div>
      </div>
    )}

    {/* Response & Resolution metrics */}
    <div className="grid grid-cols-1 gap-2">
      <div className="flex items-center justify-between p-3 rounded-lg border">
        <div>
          <div className="text-xs text-muted-foreground">Thời gian phản hồi</div>
          <div className="text-sm font-semibold">
            {timeTracking.responseTimeFormatted}
          </div>
        </div>
        <Badge className={getSLAStatusColor(timeTracking.responseStatus)}>
          {getSLAStatusLabel(timeTracking.responseStatus)}
        </Badge>
      </div>
      {/* Similar for resolution time */}
    </div>
  </CardContent>
</Card>
```

3. **Comments Section**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Bình luận ({comments.length})</CardTitle>
  </CardHeader>
  <CardContent>
    {/* List of comments */}
    {comments.map(comment => (
      <div key={comment.id} className="flex gap-3 mb-4">
        <Avatar initials={getInitials(comment.author)} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
          {comment.files && (
            <div className="flex gap-2 mt-2">
              {comment.files.map(file => (
                <ProgressiveImage key={file.url} src={file.url} />
              ))}
            </div>
          )}
        </div>
      </div>
    ))}

    {/* Add comment form */}
    <div className="mt-4">
      <Textarea placeholder="Thêm bình luận..." />
      <div className="flex justify-between items-center mt-2">
        <FileUploadButton onChange={handleFileUpload} />
        <Button onClick={handleAddComment}>Gửi</Button>
      </div>
    </div>
  </CardContent>
</Card>
```

4. **Timeline**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Lịch sử hoạt động</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="relative space-y-4">
      {complaint.timeline.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-3 h-3 rounded-full",
              index === 0 ? "bg-primary" : "bg-muted"
            )} />
            {index < complaint.timeline.length - 1 && (
              <div className="w-0.5 h-full bg-border" />
            )}
          </div>
          
          {/* Event content */}
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {getActionLabel(event.actionType)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(event.performedAt)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {event.note}
            </p>
            <span className="text-xs text-muted-foreground">
              Bởi: {event.performedBy}
            </span>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

---

## 3. CHỨC NĂNG CORE

### 3.1. Filter System

**Implementation**: Sử dụng `Set<string>` thay vì `string[]`

```tsx
// State
const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
const [typeFilter, setTypeFilter] = useState<Set<string>>(new Set());
const [assignedToFilter, setAssignedToFilter] = useState<Set<string>>(new Set());

// Filter options
const statusOptions = [
  { label: "Chờ xử lý", value: "pending" },
  { label: "Đang kiểm tra", value: "investigating" },
  { label: "Đã giải quyết", value: "resolved" },
  { label: "Từ chối", value: "rejected" },
];

// Apply filters
const filteredComplaints = useMemo(() => {
  let result = [...complaints];

  if (statusFilter.size > 0) {
    result = result.filter(c => statusFilter.has(c.status));
  }

  if (typeFilter.size > 0) {
    result = result.filter(c => typeFilter.has(c.type));
  }

  if (assignedToFilter.size > 0) {
    result = result.filter(c => c.assignedTo && assignedToFilter.has(c.assignedTo));
  }

  return result;
}, [complaints, statusFilter, typeFilter, assignedToFilter]);

// Clear filters
const handleClearFilters = () => {
  setStatusFilter(new Set());
  setTypeFilter(new Set());
  setAssignedToFilter(new Set());
  setSearchQuery("");
};

// Check if has active filters
const hasActiveFilters =
  statusFilter.size > 0 ||
  typeFilter.size > 0 ||
  assignedToFilter.size > 0 ||
  searchQuery !== "";
```

**UI Component**: `DataTableFacetedFilter`
```tsx
<DataTableFacetedFilter
  title="Trạng thái"
  options={statusOptions}
  selectedValues={statusFilter}
  onSelectedValuesChange={setStatusFilter}
/>
```

### 3.2. Search System

**Fuzzy Search** với Fuse.js:

```tsx
import Fuse from "fuse.js";

// Memoize Fuse instance
const fuseInstance = useMemo(() => {
  return new Fuse(complaints, {
    keys: ["orderCode", "customerName", "customerPhone", "description"],
    threshold: 0.3, // 0 = exact match, 1 = match anything
  });
}, [complaints]);

// Debounced search (300ms)
const [searchQuery, setSearchQuery] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 300);
  return () => clearTimeout(timer);
}, [searchQuery]);

// Apply search
const filteredComplaints = useMemo(() => {
  let result = [...complaints];
  
  // Apply filters first...
  
  // Then apply search
  if (debouncedSearch) {
    result = fuseInstance.search(debouncedSearch).map(item => item.item);
  }
  
  return result;
}, [complaints, debouncedSearch, fuseInstance]);
```

**Lý do dùng Fuse.js**:
- Fuzzy search (tìm gần đúng)
- Tìm nhiều trường cùng lúc
- Performance tốt với dataset lớn

### 3.3. SLA Monitoring

**File**: `hooks/use-complaint-time-tracking.ts`

**Features**:
- Tính toán thời gian response/resolution
- So sánh với SLA targets
- Live countdown timer
- Status colors: OK (green), Warning (yellow), Overdue (red)

**Implementation**:
```tsx
export interface TimeTrackingData {
  responseTime: number | null; // minutes
  responseTimeFormatted: string;
  responseStatus: 'not-started' | 'ok' | 'warning' | 'overdue';
  
  resolutionTime: number | null;
  resolutionTimeFormatted: string;
  resolutionStatus: 'not-started' | 'ok' | 'warning' | 'overdue';
  
  currentProcessingTime: number | null; // for ongoing complaints
  currentProcessingTimeFormatted: string;
  
  investigationTime: number | null;
  investigationTimeFormatted: string;
}

export function useComplaintTimeTracking(complaint: Complaint | null): TimeTrackingData | null {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  // Force re-render every minute for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
    }, 60000); // 60 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  if (!complaint) return null;
  
  // Calculate response time
  const responseTime = calculateResponseTime(complaint);
  const responseStatus = getSLAStatus(
    responseTime,
    SLA_TARGETS[complaint.priority || 'medium'].responseTime
  );
  
  // Calculate resolution time
  const resolutionTime = calculateResolutionTime(complaint);
  const resolutionStatus = getSLAStatus(
    resolutionTime,
    SLA_TARGETS[complaint.priority || 'medium'].resolveTime
  );
  
  // Calculate current processing time (for ongoing)
  const currentProcessingTime = complaint.status === 'investigating'
    ? calculateCurrentProcessingTime(complaint)
    : null;
  
  return {
    responseTime,
    responseTimeFormatted: formatMinutesToHoursAndMinutes(responseTime),
    responseStatus,
    resolutionTime,
    resolutionTimeFormatted: formatMinutesToHoursAndMinutes(resolutionTime),
    resolutionStatus,
    currentProcessingTime,
    currentProcessingTimeFormatted: formatMinutesToHoursAndMinutes(currentProcessingTime),
    // ...
  };
}

function getSLAStatus(
  actualMinutes: number | null,
  targetHours: number
): 'not-started' | 'ok' | 'warning' | 'overdue' {
  if (actualMinutes === null) return 'not-started';
  
  const targetMinutes = targetHours * 60;
  const warningThreshold = targetMinutes * 0.8; // 80%
  
  if (actualMinutes <= warningThreshold) return 'ok';
  if (actualMinutes <= targetMinutes) return 'warning';
  return 'overdue';
}
```

**SLA Timer Component** (`sla-timer.tsx`):
```tsx
export function SlaTimer({ complaint, className }: { complaint: Complaint; className?: string }) {
  const timeTracking = useComplaintTimeTracking(complaint);
  
  if (!timeTracking) return null;
  
  // Show different content based on status
  if (complaint.status === 'resolved' || complaint.status === 'rejected') {
    // Show final times
    return (
      <div className={cn("text-xs", className)}>
        <span>Phản hồi: {timeTracking.responseTimeFormatted}</span>
        <span className="mx-1">•</span>
        <span>Giải quyết: {timeTracking.resolutionTimeFormatted}</span>
      </div>
    );
  }
  
  // Show countdown for ongoing
  const overdueStatus = checkOverdue(complaint);
  
  return (
    <div className={cn("flex items-center gap-1 text-xs", className)}>
      <Clock className="h-3 w-3" />
      {overdueStatus.isOverdueResponse || overdueStatus.isOverdueResolve ? (
        <span className="text-red-600 font-semibold">
          Quá hạn {overdueStatus.overdueDuration}
        </span>
      ) : (
        <span className={cn(
          timeTracking.responseStatus === 'warning' && "text-yellow-600",
          timeTracking.responseStatus === 'ok' && "text-green-600"
        )}>
          {formatTimeLeft(complaint)}
        </span>
      )}
    </div>
  );
}
```

### 3.4. Auto Reminder System

**File**: `hooks/use-complaint-reminders.ts`

**Features**:
- Tự động check mỗi phút
- 3 levels: First (4h), Second (8h), Escalated (24h)
- Gửi notification vào Notification Center
- Gửi cho: assignedTo, createdBy, manager (khi escalate)

**Flow**:
```
Khiếu nại được tạo
  ↓
Hook useComplaintReminders() start monitoring
  ↓
Check mỗi phút: getHoursSinceLastAction()
  ↓
≥ 4h → First Reminder → Toast yellow + Send to assignedTo
  ↓
≥ 8h → Second Reminder → Toast orange + Send to assignedTo + createdBy
  ↓
≥ 24h → Escalation → Toast red + Send to manager
```

**Implementation**:
```tsx
export function useComplaintReminders(complaint: Complaint | null) {
  const { addNotification } = useNotificationStore();
  const [settings] = useState<ReminderSettings>(() => loadReminderSettings());
  const [reminderStatus, setReminderStatus] = useState<ReminderStatus>(() => 
    checkComplaintReminder(complaint, settings)
  );
  
  const lastReminderSent = useRef<{
    level: string;
    timestamp: number;
  } | null>(null);
  
  // Check every minute
  useEffect(() => {
    if (!complaint || !settings.enabled) return;
    
    const checkInterval = setInterval(() => {
      const status = checkComplaintReminder(complaint, settings);
      setReminderStatus(status);
      
      if (status.needsAction && status.reminderLevel !== 'none') {
        const now = Date.now();
        const lastSent = lastReminderSent.current;
        
        // Only send if no reminder before OR level changed OR > 1h since last
        const shouldSend = 
          !lastSent || 
          lastSent.level !== status.reminderLevel ||
          (now - lastSent.timestamp) > 60 * 60 * 1000;
        
        if (shouldSend) {
          sendReminder(complaint, status, settings, addNotification);
          lastReminderSent.current = {
            level: status.reminderLevel,
            timestamp: now,
          };
        }
      }
    }, 60 * 1000);
    
    return () => clearInterval(checkInterval);
  }, [complaint?.systemId, settings.enabled, addNotification]);
  
  return reminderStatus;
}

function sendReminder(
  complaint: Complaint,
  status: ReminderStatus,
  settings: ReminderSettings,
  addNotification: (notification: any) => void
) {
  const recipients: string[] = [];
  
  if (settings.notifyAssignee && complaint.assignedTo) {
    recipients.push(complaint.assignedTo);
  }
  
  if (settings.notifyCreator && complaint.createdBy) {
    recipients.push(complaint.createdBy);
  }
  
  if (status.reminderLevel === 'escalated' && settings.notifyManager) {
    recipients.push(complaint.createdBy); // Simplified: creator = manager
  }
  
  recipients.forEach(recipientId => {
    addNotification({
      type: status.reminderLevel === 'escalated' ? 'alert' : 'warning',
      title: `Nhắc nhở: ${complaint.id}`,
      message: status.message,
      link: `/complaints/${complaint.systemId}`,
      createdBy: 'SYSTEM',
      metadata: {
        recipientId,
        complaintId: complaint.systemId,
        reminderLevel: status.reminderLevel,
      },
    });
  });
  
  // Show toast
  if (status.reminderLevel === 'escalated') {
    toast.error(status.message, {
      description: `Khiếu nại ${complaint.id} cần xử lý ngay!`,
      duration: 10000,
    });
  }
}
```

**Settings** (trong `complaints-settings-page.tsx`):
```tsx
interface ReminderSettings {
  enabled: boolean;
  firstReminderHours: number;
  secondReminderHours: number;
  escalationHours: number;
}

const defaultReminders: ReminderSettings = {
  enabled: true,
  firstReminderHours: 4,
  secondReminderHours: 8,
  escalationHours: 24,
};
```

### 3.5. Real-time Updates

**File**: `use-realtime-updates.ts`

**Features**:
- Polling mỗi 30s (configurable)
- Toggle Live/Manual mode
- Data versioning để detect changes
- Không reload page, chỉ update data

**Implementation**:
```tsx
let dataVersion = Date.now();

export function getDataVersion() {
  return dataVersion;
}

export function triggerDataUpdate() {
  dataVersion = Date.now();
}

export function useRealtimeUpdates(
  currentVersion: number,
  onUpdate: () => void,
  intervalMs: number = 30000
) {
  const [hasUpdates, setHasUpdates] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  
  useEffect(() => {
    if (!isPolling) return;
    
    const interval = setInterval(() => {
      const latestVersion = getDataVersion();
      if (latestVersion > currentVersion) {
        setHasUpdates(true);
        onUpdate();
      }
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [isPolling, currentVersion, intervalMs, onUpdate]);
  
  const togglePolling = () => setIsPolling(prev => !prev);
  const refresh = () => {
    setHasUpdates(false);
    onUpdate();
  };
  
  return { hasUpdates, isPolling, refresh, togglePolling };
}
```

**Usage**:
```tsx
const [dataVersion, setDataVersion] = useState(() => getDataVersion());
const { hasUpdates, isPolling, togglePolling } = useRealtimeUpdates(
  dataVersion,
  () => {
    setDataVersion(getDataVersion());
  },
  30000
);

// UI
<Button
  variant={isPolling ? "default" : "outline"}
  onClick={togglePolling}
>
  <RefreshCw className={cn("h-4 w-4 mr-2", isPolling && "animate-spin")} />
  {isPolling ? "Live" : "Manual"}
</Button>

// Trigger update after mutation
const handleUpdateComplaint = () => {
  updateComplaint(id, data);
  triggerDataUpdate(); // ← Notify all listeners
};
```

### 3.6. Public Tracking

**File**: `tracking-utils.ts`

**Features**:
- Customer có thể track khiếu nại không cần đăng nhập
- Tracking code = Base64(systemId)
- URL: `/tracking/{code}`

**Implementation**:
```tsx
export function isTrackingEnabled(): boolean {
  try {
    const stored = localStorage.getItem('complaints-public-tracking-settings');
    if (!stored) return false;
    const settings = JSON.parse(stored);
    return settings.enabled === true;
  } catch {
    return false;
  }
}

export function getTrackingCode(systemId: string): string {
  return btoa(systemId); // Base64 encode
}

export function decodeTrackingCode(code: string): string | null {
  try {
    return atob(code); // Base64 decode
  } catch {
    return null;
  }
}

export function generateTrackingUrl(complaintId: string): string {
  const baseUrl = window.location.origin;
  const code = getTrackingCode(complaintId);
  return `${baseUrl}/tracking/${code}`;
}

// Usage
const handleGetLink = (systemId: string) => {
  if (!isTrackingEnabled()) {
    toast.error('Chức năng tracking chưa được bật.');
    return;
  }
  
  const trackingUrl = generateTrackingUrl(complaint.id);
  const trackingCode = getTrackingCode(systemId);
  
  navigator.clipboard.writeText(trackingUrl);
  toast.success(`Đã copy link tracking\nMã: ${trackingCode}`);
};
```

**Tracking Page** (public, no auth):
```tsx
export function TrackingPage() {
  const { code } = useParams();
  const systemId = decodeTrackingCode(code);
  const complaint = useComplaintStore(state => 
    state.complaints.find(c => c.systemId === systemId)
  );
  
  if (!complaint) return <NotFound />;
  
  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tra cứu khiếu nại {complaint.id}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Show limited info */}
          <div className="space-y-4">
            <div>
              <Label>Trạng thái</Label>
              <Badge>{complaintStatusLabels[complaint.status]}</Badge>
            </div>
            
            <div>
              <Label>Tiến độ xử lý</Label>
              <Progress value={getProgressPercentage(complaint.status)} />
            </div>
            
            {/* Timeline (filtered for public) */}
            <div>
              <Label>Lịch sử</Label>
              {complaint.timeline
                .filter(event => isPublicEvent(event.actionType))
                .map(event => (
                  <div key={event.id} className="flex gap-2">
                    <div className="text-sm">
                      {getActionLabel(event.actionType)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateTime(event.performedAt)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 3.7. Card Color System

**File**: `features/settings/complaints-settings-page.tsx`

**Features**:
- Configurable colors cho status/priority/overdue
- Priority order: overdue > priority > status
- Sử dụng Tailwind color classes
- Apply cho cả Kanban cards và Table rows

**Settings Interface**:
```tsx
export interface CardColorSettings {
  statusColors: {
    pending: string;
    investigating: string;
    resolved: string;
    rejected: string;
  };
  priorityColors: {
    low: string;
    medium: string;
    high: string;
    urgent: string;
  };
  overdueColor: string;
  enableStatusColors: boolean;
  enablePriorityColors: boolean;
  enableOverdueColor: boolean;
}

const defaultCardColors: CardColorSettings = {
  statusColors: {
    pending: 'bg-yellow-50 border-yellow-200',
    investigating: 'bg-blue-50 border-blue-200',
    resolved: 'bg-green-50 border-green-200',
    rejected: 'bg-gray-50 border-gray-200',
  },
  priorityColors: {
    low: 'bg-slate-50 border-slate-200',
    medium: 'bg-amber-50 border-amber-200',
    high: 'bg-orange-50 border-orange-300',
    urgent: 'bg-red-100 border-red-300',
  },
  overdueColor: 'bg-red-50 border-red-400',
  enableStatusColors: false,
  enablePriorityColors: true,
  enableOverdueColor: true,
};
```

**Apply Logic**:
```tsx
// In KanbanColumn component
const colorSettings = loadCardColorSettings();

let cardColorClass = "";
if (colorSettings.enableOverdueColor && isOverdue) {
  cardColorClass = colorSettings.overdueColor;
} else if (colorSettings.enablePriorityColors && complaint.priority) {
  cardColorClass = colorSettings.priorityColors[complaint.priority];
} else if (colorSettings.enableStatusColors) {
  cardColorClass = colorSettings.statusColors[complaint.status];
}

return (
  <Card className={cn("p-4", cardColorClass)}>
    {/* ... */}
  </Card>
);
```

**UI Config**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Màu sắc card khiếu nại</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Enable/Disable toggles */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Màu quá hạn</Label>
        <Switch
          checked={cardColors.enableOverdueColor}
          onCheckedChange={() => handleToggle('enableOverdueColor')}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Màu theo độ ưu tiên</Label>
        <Switch
          checked={cardColors.enablePriorityColors}
          onCheckedChange={() => handleToggle('enablePriorityColors')}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label>Màu theo trạng thái</Label>
        <Switch
          checked={cardColors.enableStatusColors}
          onCheckedChange={() => handleToggle('enableStatusColors')}
        />
      </div>
    </div>

    {/* Color pickers */}
    {cardColors.enableOverdueColor && (
      <TailwindColorPicker
        value={cardColors.overdueColor}
        onChange={handleOverdueColorChange}
        label="Màu quá hạn"
        placeholder="bg-red-50 border-red-400"
      />
    )}
    
    {/* ... similar for other colors */}
  </CardContent>
</Card>
```

---

## 4. HỆ THỐNG PHỤ TRỢ

### 4.1. Notification System

**File**: `notification-utils.ts` + `components/ui/notification-center.tsx`

**Architecture**:
```
complaintNotifications.onCreate()
  ↓
Check isNotificationEnabled('emailOnCreate')
  ↓
showNotification('success', message)
  ↓
useNotificationStore.addNotification()
  ↓
Display in Bell icon dropdown
```

**Usage**:
```tsx
import { complaintNotifications } from './notification-utils';

// On create
complaintNotifications.onCreate("Đã tạo khiếu nại mới");

// On assign
complaintNotifications.onAssign("Đã giao việc cho nhân viên");

// On verified
complaintNotifications.onVerified("Đã xác minh khiếu nại");

// On resolved
complaintNotifications.onResolved("Đã giải quyết khiếu nại");

// On overdue
complaintNotifications.onOverdue("Khiếu nại KN-001 đã quá hạn SLA");
```

**Settings**:
```tsx
interface NotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnVerified: boolean;
  emailOnResolved: boolean;
  emailOnOverdue: boolean;
  smsOnOverdue: boolean;
  inAppNotifications: boolean;
}
```

### 4.2. Statistics & Reporting

**File**: `statistics-page.tsx` + `hooks/use-complaint-statistics.ts`

**Metrics**:
- Total complaints by status
- Average response/resolution time
- SLA compliance rate
- By type, priority, assignee
- Trends over time

**Charts**:
- Bar chart: Complaints by type
- Line chart: Trend over time
- Pie chart: Status distribution
- Table: Top assignees

### 4.3. Permissions System

**File**: `hooks/use-complaint-permissions.ts`

**Role-based Actions**:
```tsx
export function useComplaintPermissions(complaint: Complaint | null) {
  const { user } = useAuth();
  
  if (!user || !complaint) {
    return {
      canEdit: false,
      canDelete: false,
      canVerify: false,
      canAssign: false,
      canComment: true,
    };
  }
  
  const isAdmin = user.role === 'admin';
  const isAssigned = complaint.assignedTo === user.systemId;
  const isCreator = complaint.createdBy === user.systemId;
  
  return {
    canEdit: isAdmin || isAssigned || isCreator,
    canDelete: isAdmin,
    canVerify: isAdmin || isAssigned,
    canAssign: isAdmin,
    canComment: true,
  };
}
```

### 4.4. Mobile Responsive

**Strategies**:

1. **Kanban**: Horizontal scroll
```tsx
<div className="flex gap-4 overflow-x-auto pb-4">
  <KanbanColumn />
  <KanbanColumn />
  <KanbanColumn />
  <KanbanColumn />
</div>
```

2. **Table**: Switch to Card view
```tsx
{isMobile ? (
  complaints.map(complaint => (
    <ComplaintCard key={complaint.systemId} complaint={complaint} />
  ))
) : (
  <Table>
    {/* ... */}
  </Table>
)}
```

3. **Infinite Scroll** on mobile:
```tsx
const [mobileLoadedCount, setMobileLoadedCount] = useState(20);

useEffect(() => {
  if (!isMobile) return;
  
  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollPosition >= documentHeight * 0.8) {
      setMobileLoadedCount(prev => Math.min(prev + 20, total));
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [isMobile, mobileLoadedCount, total]);

const displayData = isMobile 
  ? complaints.slice(0, mobileLoadedCount)
  : paginatedData;
```

4. **Responsive Headers**:
```tsx
useEffect(() => {
  setPageHeader({
    title: "Quản lý Khiếu nại",
    breadcrumb: [...],
    actions: isMobile ? [
      // Only essential actions on mobile
      <Button key="create">Tạo mới</Button>
    ] : [
      // Full actions on desktop
      <Button key="view-toggle">...</Button>,
      <Button key="stats">Thống kê</Button>,
      <Button key="create">Tạo mới</Button>,
    ],
  });
}, [isMobile]);
```

---

## 5. CHECKLIST NHÂN BẢN

### 5.1. Chuẩn bị

- [ ] Xác định entity mới (Orders, Warranty, Tasks, etc.)
- [ ] Define types (interface) cho entity
- [ ] Xác định workflow/status flow
- [ ] Xác định các trường dữ liệu cần thiết
- [ ] Xác định permissions/roles

### 5.2. Core Files (Copy & Customize)

- [ ] `types.ts` - Define types, status, labels, colors
- [ ] `store.ts` - Zustand store với CRUD operations
- [ ] `sample-data.ts` - Sample data để test
- [ ] `page.tsx` - Main page với Kanban + Table
- [ ] `detail-page.tsx` - Detail view
- [ ] `form-page.tsx` - Create/Edit form
- [ ] `columns.tsx` - Table columns definition

### 5.3. UI Components

- [ ] `{entity}-card.tsx` - Card component cho mobile
- [ ] `{entity}-card-context-menu.tsx` - Right-click menu
- [ ] Custom timer/tracker component (nếu cần)

### 5.4. Hooks & Utilities

- [ ] `hooks/use-{entity}-time-tracking.ts` - Time tracking (nếu cần)
- [ ] `hooks/use-{entity}-reminders.ts` - Auto reminders (nếu cần)
- [ ] `hooks/use-{entity}-statistics.ts` - Statistics
- [ ] `hooks/use-{entity}-permissions.ts` - Permissions
- [ ] `{entity}-utils.ts` - Utility functions
- [ ] `use-realtime-updates.ts` - Copy as-is

### 5.5. Settings Integration

- [ ] Tạo settings page: `features/settings/{entity}-settings-page.tsx`
- [ ] Card color settings (nếu cần)
- [ ] SLA settings (nếu cần)
- [ ] Notification settings
- [ ] Templates/responses (nếu cần)

### 5.6. Testing Checklist

**Kanban View**:
- [ ] Columns hiển thị đúng theo status
- [ ] Search trong column hoạt động
- [ ] Context menu hiển thị đúng actions theo status
- [ ] Card colors apply đúng
- [ ] Drag & drop (nếu implement)
- [ ] Scroll smooth

**Table View**:
- [ ] Columns hiển thị đủ thông tin
- [ ] Column customizer hoạt động
- [ ] Row selection + bulk actions
- [ ] Row colors apply đúng
- [ ] Pagination hoạt động
- [ ] Sort by column

**Filters & Search**:
- [ ] Status filter multi-select
- [ ] Type/Category filter
- [ ] Assignee filter
- [ ] Date range filter (nếu cần)
- [ ] Fuzzy search hoạt động
- [ ] Clear filters reset về mặc định
- [ ] Filter count badge hiển thị đúng

**Detail Page**:
- [ ] All sections hiển thị đúng
- [ ] Time tracking real-time
- [ ] Comments thêm/sửa/xóa
- [ ] File upload/preview
- [ ] Timeline hiển thị đầy đủ
- [ ] Actions buttons hoạt động
- [ ] Status transitions đúng workflow

**Mobile Responsive**:
- [ ] Kanban horizontal scroll
- [ ] Table switch to card view
- [ ] Infinite scroll hoạt động
- [ ] Touch gestures (nếu có)
- [ ] Bottom navigation (nếu cần)

**Permissions**:
- [ ] Admin thấy full actions
- [ ] User chỉ thấy actions được phép
- [ ] Guest không thấy sensitive info
- [ ] Role-based UI elements

**Performance**:
- [ ] Lazy load images
- [ ] Debounced search
- [ ] Memoized calculations
- [ ] Virtual scrolling (nếu dataset lớn)
- [ ] Code splitting (nếu cần)

### 5.7. Customization Points

**Dễ customize**:
- Status labels & colors
- Type/Category options
- Column visibility defaults
- Card layout
- Filter options
- Action button labels

**Cần customize logic**:
- Workflow transitions
- SLA targets
- Permission rules
- Notification triggers
- Business rules validation

**Advanced customization**:
- Timeline event types
- Statistics calculations
- Export formats
- Integration với external APIs
- Custom fields

---

## 6. BEST PRACTICES

### 6.1. Code Organization

```tsx
// ✅ GOOD: Nhóm imports theo category
// External libs
import * as React from "react";
import { useNavigate } from "react-router-dom";

// Types & Store
import type { Complaint } from "./types";
import { useComplaintStore } from "./store";

// UI Components
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

// Hooks
import { usePageHeader } from "../../contexts/page-header-context";

// Utils
import { cn } from "../../lib/utils";
```

### 6.2. State Management

```tsx
// ✅ GOOD: Separate concerns
const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
const [searchQuery, setSearchQuery] = useState("");

// ❌ BAD: Single giant state object
const [state, setState] = useState({
  viewMode: "kanban",
  statusFilter: [],
  searchQuery: "",
  // ... 20 more fields
});
```

### 6.3. Performance

```tsx
// ✅ GOOD: Memoize expensive calculations
const filteredComplaints = useMemo(() => {
  let result = [...complaints];
  
  if (statusFilter.size > 0) {
    result = result.filter(c => statusFilter.has(c.status));
  }
  
  if (debouncedSearch) {
    result = fuseInstance.search(debouncedSearch).map(item => item.item);
  }
  
  return result;
}, [complaints, statusFilter, debouncedSearch, fuseInstance]);

// ✅ GOOD: Debounce user input
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 300);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

### 6.4. TypeScript

```tsx
// ✅ GOOD: Strict types
interface Complaint {
  systemId: string;
  id: string;
  status: ComplaintStatus;
  type: ComplaintType;
  priority: Priority;
  // ...
}

type ComplaintStatus = 'pending' | 'investigating' | 'resolved' | 'rejected';

// ❌ BAD: Any types
const complaint: any = { ... };
```

### 6.5. Error Handling

```tsx
// ✅ GOOD: User-friendly error messages
const handleSubmit = async () => {
  try {
    await updateComplaint(id, data);
    toast.success('Đã cập nhật khiếu nại thành công');
  } catch (error) {
    console.error('Update failed:', error);
    toast.error('Không thể cập nhật khiếu nại. Vui lòng thử lại.');
  }
};

// ✅ GOOD: Validation before action
const handleDelete = () => {
  if (!canDelete) {
    toast.error('Bạn không có quyền xóa khiếu nại này');
    return;
  }
  
  // Show confirmation dialog
  setConfirmDialog({
    open: true,
    title: 'Xác nhận xóa',
    description: 'Bạn có chắc muốn xóa khiếu nại này?',
    onConfirm: () => {
      deleteComplaint(id);
      toast.success('Đã xóa khiếu nại');
    },
  });
};
```

---

## 7. KẾT LUẬN

Hệ thống Complaints đã implement đầy đủ các patterns và best practices để:

✅ **UI/UX Professional**:
- Dual view mode (Kanban + Table)
- Context menu status-aware
- Clean design, no unnecessary decorations
- Mobile responsive

✅ **Performance**:
- Memoized calculations
- Debounced search
- Lazy loading
- Efficient re-renders

✅ **Maintainability**:
- Clear file structure
- TypeScript strict
- Reusable components
- Well-documented

✅ **Scalability**:
- Easy to add new features
- Configurable settings
- Role-based permissions
- Plugin-friendly architecture

**Có thể nhân bản 100% sang module khác** bằng cách follow checklist trên và customize business logic cho phù hợp! 🚀

---

**Version**: 1.0  
**Last Updated**: November 8, 2025  
**Author**: AI Assistant  
**Status**: Ready for Replication ✅
