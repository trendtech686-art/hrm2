# SO SÁNH UI & NÂNG CẤP WARRANTY TỪ COMPLAINTS

> **Mục đích**: So sánh chi tiết UI/UX giữa Complaints (đã hoàn thiện) và Warranty (hiện tại), đưa ra đề xuất nâng cấp cụ thể từng component.

**Ngày tạo**: November 8, 2025  
**Trạng thái**: Ready for Implementation ✅

---

## 📋 MỤC LỤC

1. [Tổng quan so sánh](#1-tổng-quan-so-sánh)
2. [So sánh List Page (Kanban + Table)](#2-so-sánh-list-page)
3. [So sánh Card Component](#3-so-sánh-card-component)
4. [So sánh Detail Page](#4-so-sánh-detail-page)
5. [So sánh Table Columns](#5-so-sánh-table-columns)
6. [Missing Features](#6-missing-features)
7. [Implementation Plan](#7-implementation-plan)

---

## 1. TỔNG QUAN SO SÁNH

### 1.1. Điểm Tương Đồng ✅

| Feature | Complaints | Warranty | Status |
|---------|-----------|----------|--------|
| **Dual View Mode** | Kanban + Table | Kanban + Table | ✅ Có |
| **Fuzzy Search** | Fuse.js (threshold 0.3) | Fuse.js (threshold 0.3) | ✅ Có |
| **Status Filter** | Set\<string\> multi-select | Set\<string\> multi-select | ✅ Có |
| **Card Colors** | Configurable from settings | Configurable from settings | ✅ Có |
| **Column Customizer** | Show/hide/reorder | Show/hide/reorder | ✅ Có |
| **Mobile Responsive** | Card view + Horizontal scroll | Card view + Horizontal scroll | ✅ Có |
| **Comments System** | TipTap editor + mentions | TipTap editor + mentions | ✅ Có |
| **Timeline/History** | Full audit log | Full audit log | ✅ Có |
| **Subtasks** | Workflow tasks | Workflow tasks | ✅ Có |
| **Image Upload** | Multiple + Preview | Multiple + Preview | ✅ Có |

### 1.2. Điểm Khác Biệt ⚠️

| Feature | Complaints | Warranty | Gap |
|---------|-----------|----------|-----|
| **Context Menu** | ✅ Status-aware right-click | ❌ Chưa có | 🔴 Critical |
| **SLA Timer** | ✅ Live countdown with colors | ❌ Chưa có | 🔴 Critical |
| **Auto Reminders** | ✅ Background monitoring 3 levels | ❌ Chưa có | 🟡 Important |
| **Public Tracking** | ✅ Base64 URL tracking | ❌ Chưa có | 🟡 Important |
| **Real-time Updates** | ✅ Polling 30s + Live/Manual toggle | ❌ Chưa có | 🟢 Nice-to-have |
| **Statistics Page** | ✅ Charts + Metrics | ❌ Chưa có | 🟢 Nice-to-have |
| **Kanban Column Search** | ✅ Local search per column | ❌ Chưa có | 🟢 Nice-to-have |
| **Card Design** | Clean với border-l-4 accent | Simple với border | 🟡 UI Polish |
| **Notification Integration** | ✅ Settings-aware notifications | ⚠️ Chỉ có toast | 🟡 Important |

---

## 2. SO SÁNH LIST PAGE

### 2.1. Header Actions

#### **Complaints** (page.tsx line 521-574):
```tsx
const actions = React.useMemo(() => [
  // Real-time toggle (LEFT)
  <Button
    key="realtime"
    variant={isPolling ? "default" : "outline"}
    onClick={togglePolling}
  >
    <RefreshCw className={cn("h-4 w-4 mr-2", isPolling && "animate-spin")} />
    {isPolling ? "Live" : "Manual"}
  </Button>,
  
  // Settings (LEFT)
  <Button key="settings" onClick={() => navigate('/settings/complaints')} variant="outline">
    <Settings className="h-4 w-4 mr-2" />
    Cài đặt
  </Button>,
  
  // Statistics (LEFT)
  <Button key="statistics" onClick={() => navigate('/complaints/statistics')} variant="outline">
    <BarChart3 className="h-4 w-4 mr-2" />
    Thống kê
  </Button>,
  
  // View toggle (RIGHT)
  <div key="view-toggle" className="flex items-center border rounded-lg">
    <Button variant={viewMode === "kanban" ? "secondary" : "ghost"}>
      <LayoutGrid className="h-4 w-4" />
    </Button>
    <Button variant={viewMode === "table" ? "secondary" : "ghost"}>
      <Table className="h-4 w-4" />
    </Button>
  </div>,
  
  // Create button (RIGHT)
  <Button key="new" onClick={() => navigate('/complaints/new')}>
    <Plus className="h-4 w-4 mr-2" />
    Tạo khiếu nại
  </Button>,
], [isPolling, viewMode, navigate, togglePolling]);
```

#### **Warranty** (warranty-list-page.tsx line 421-467):
```tsx
const actions = React.useMemo(() => [
  // Settings - chỉ hiện khi Kanban mode
  ...(viewMode === 'kanban' ? [
    <Button key="settings" onClick={() => navigate('/settings/warranty')} variant="outline">
      <Settings className="h-4 w-4 mr-2" />
      Cài đặt
    </Button>
  ] : []),
  
  // View toggle
  <Button key="view-toggle" onClick={() => setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')} variant="outline">
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
  
  // Create button
  <Button key="new" onClick={() => navigate('/warranty/new')}>
    <Plus className="h-4 w-4 mr-2" />
    Tạo phiếu mới
  </Button>,
], [navigate, viewMode]);
```

**Khác biệt**:
- ❌ Warranty thiếu **Real-time toggle** (Live/Manual mode)
- ❌ Warranty thiếu **Statistics button**
- ⚠️ Warranty settings button chỉ hiện ở Kanban mode (không consistent)
- ⚠️ Warranty view toggle là full button text thay vì icon toggle group

**Đề xuất**:
```tsx
// ✅ Nâng cấp Warranty header actions
const actions = React.useMemo(() => [
  // Real-time toggle (NEW)
  <Button
    key="realtime"
    variant={isPolling ? "default" : "outline"}
    onClick={togglePolling}
    size="sm"
    className="h-9"
  >
    <RefreshCw className={cn("h-4 w-4 mr-2", isPolling && "animate-spin")} />
    {isPolling ? "Live" : "Manual"}
  </Button>,
  
  // Settings (ALWAYS VISIBLE)
  <Button 
    key="settings" 
    onClick={() => navigate('/settings/warranty')} 
    variant="outline"
    size="sm"
    className="h-9"
  >
    <Settings className="h-4 w-4 mr-2" />
    Cài đặt
  </Button>,
  
  // Statistics (NEW)
  <Button 
    key="statistics" 
    onClick={() => navigate('/warranty/statistics')} 
    variant="outline"
    size="sm"
    className="h-9"
  >
    <BarChart3 className="h-4 w-4 mr-2" />
    Thống kê
  </Button>,
  
  // View toggle as toggle group (IMPROVED)
  <div key="view-toggle" className="flex items-center border rounded-lg">
    <Button 
      variant={viewMode === "kanban" ? "secondary" : "ghost"} 
      size="sm"
      onClick={() => setViewMode("kanban")}
      className="h-9"
    >
      <LayoutGrid className="h-4 w-4" />
    </Button>
    <Button 
      variant={viewMode === "table" ? "secondary" : "ghost"} 
      size="sm"
      onClick={() => setViewMode("table")}
      className="h-9"
    >
      <Table className="h-4 w-4" />
    </Button>
  </div>,
  
  // Create button
  <Button key="new" onClick={() => navigate('/warranty/new')} size="sm" className="h-9">
    <Plus className="h-4 w-4 mr-2" />
    Tạo phiếu mới
  </Button>,
], [isPolling, viewMode, navigate, togglePolling]);
```

### 2.2. Kanban Column Header

#### **Complaints** (page.tsx line 67-95):
```tsx
<div className="text-sm font-semibold px-4 py-3 mb-2 rounded-lg border bg-muted flex items-center justify-between">
  <div className="flex items-center gap-2">
    <StatusIcon className="h-4 w-4" />
    {complaintStatusLabels[status]}
  </div>
  <span className="text-sm font-normal bg-background h-6 w-6 flex items-center justify-center rounded-full">
    {filteredComplaints.length}
  </span>
</div>

{/* Search Input - h-10 */}
<div className="mb-2">
  <Input
    placeholder="Tìm kiếm..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="h-10"
  />
</div>
```

**Features**:
- ✅ Icon động theo status (Clock, AlertCircle, CheckCircle2, XCircle)
- ✅ Badge count với bg-background tròn
- ✅ Local search per column
- ✅ Clean bg-muted background

#### **Warranty** (warranty-list-page.tsx line 62-78):
```tsx
<h3 className={cn(
  "font-semibold px-3 py-2 mb-3 rounded-lg border flex items-center justify-between",
  statusColors[status]
)}>
  {WARRANTY_STATUS_LABELS[status]}
  <span className="text-sm font-normal bg-background h-6 w-6 flex items-center justify-center rounded-full">
    {tickets.length}
  </span>
</h3>
```

**Features**:
- ❌ Không có icon
- ❌ Không có local search
- ⚠️ Sử dụng hard-coded statusColors thay vì bg-muted neutral

**Đề xuất**:
```tsx
// ✅ Nâng cấp Warranty Kanban Column
function KanbanColumn({ status, tickets, ... }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const statusIcons: Record<WarrantyStatus, React.ElementType> = {
    new: AlertCircle,
    pending: Clock,
    processed: CheckCircle2,
    returned: XCircle,
  };
  
  const StatusIcon = statusIcons[status];
  
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
    <div className="flex-1 min-w-[300px] flex flex-col max-h-[calc(100vh-320px)]">
      {/* Header - Neutral bg-muted */}
      <div className="text-sm font-semibold px-4 py-3 mb-2 rounded-lg border bg-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4" />
          {WARRANTY_STATUS_LABELS[status]}
        </div>
        <span className="text-sm font-normal bg-background h-6 w-6 flex items-center justify-center rounded-full">
          {filteredTickets.length}
        </span>
      </div>
      
      {/* Local Search */}
      <div className="mb-2">
        <Input
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10"
        />
      </div>
      
      {/* Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-2">
        {filteredTickets.map(ticket => (
          <WarrantyCardContextMenu key={ticket.systemId} ticket={ticket} {...handlers}>
            <Card className={cn("p-4 cursor-pointer", cardColorClass)}>
              {/* ... */}
            </Card>
          </WarrantyCardContextMenu>
        ))}
      </div>
    </div>
  );
}
```

---

## 3. SO SÁNH CARD COMPONENT

### 3.1. Card Visual Design

#### **Complaints Card** (complaint-card.tsx):
```
┌────────────────────────────────────┐
│ 🟦 [Border-left-4 accent color]   │
│                                    │
│  KN-001           [Badge: Type]    │
│  📦 DH12345                        │
│                                    │
│  [Status Badge]  [Priority Badge]  │
│  [⚠️ Overdue Badge if applicable]  │
│                                    │
│  👤 Nguyễn Văn A                   │
│  📞 0901234567                     │
│                                    │
│  Description text preview...       │
│  (line-clamp-2)                    │
│                                    │
│  🕐 Live SLA Timer (colored)       │
│  ─────────────────────────────     │
│  📅 8/11/2025  |  👤 Assigned      │
└────────────────────────────────────┘
```

**Features**:
- ✅ Border-left-4 với màu động (overdue > priority > status)
- ✅ Background tint (bg-red-50, bg-orange-50, etc.)
- ✅ Multiple badges: Type, Status, Priority, Overdue
- ✅ Icons cho mọi thông tin (Package, User, Phone, Calendar, Clock)
- ✅ Live SLA Timer với màu cảnh báo
- ✅ Clean footer với border-top
- ✅ Hover shadow-md transition

#### **Warranty Card** (warranty-card.tsx):
```
┌────────────────────────────────────┐
│  WR-001  [Badge: Status]    [...]  │
│                                    │
│  👤 Nguyễn Văn A                   │
│  ──────────────────────────────    │
│  📞 0901234567                     │
│  🚚 GHTK123456                     │
│  📦 3 sản phẩm • 2 đã đổi          │
│                                    │
│  📅 8/11/2025      Admin           │
└────────────────────────────────────┘
```

**Features**:
- ⚠️ Chỉ có border thường, không có accent color
- ⚠️ Chỉ có 1 badge (Status)
- ✅ Icons cho thông tin
- ❌ Không có SLA timer
- ❌ Không có priority indicator
- ⚠️ DropdownMenu thay vì Context Menu

**Đề xuất**:
```tsx
// ✅ Nâng cấp Warranty Card
export function WarrantyCard({ ticket, onClick, ... }: WarrantyCardProps) {
  // Calculate card color (priority: overdue > status)
  const isOverdue = checkWarrantyOverdue(ticket); // NEW hook
  const cardColors = loadCardColorSettings();
  
  let cardColorClass = "";
  let borderClass = "border-l-4";
  
  if (cardColors.enableOverdueColor && isOverdue) {
    cardColorClass = cardColors.overdueColor; // bg-red-50 border-red-400
    borderClass += " border-l-red-500";
  } else if (cardColors.enableStatusColors) {
    cardColorClass = cardColors.statusColors[ticket.status];
    const statusBorderColors = {
      new: "border-l-blue-500",
      pending: "border-l-yellow-500",
      processed: "border-l-green-500",
      returned: "border-l-gray-500",
    };
    borderClass += " " + statusBorderColors[ticket.status];
  }
  
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md",
        borderClass,
        cardColorClass
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-primary">{ticket.id}</span>
            <Badge variant="outline" className={WARRANTY_STATUS_COLORS[ticket.status]}>
              {WARRANTY_STATUS_LABELS[ticket.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-3.5 w-3.5 shrink-0" />
            <span className="font-mono truncate">{ticket.trackingCode}</span>
          </div>
        </div>
        
        {/* Overdue badge if applicable */}
        {isOverdue && (
          <Badge variant="outline" className="text-xs bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Quá hạn
          </Badge>
        )}
      </div>
      
      {/* Customer Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium truncate">{ticket.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          <span>{ticket.customerPhone}</span>
        </div>
      </div>
      
      {/* Products Summary */}
      <div className="text-sm text-muted-foreground mb-3">
        <Package className="h-3.5 w-3.5 inline mr-1" />
        {ticket.summary.totalProducts} sản phẩm
        {ticket.summary.totalReplaced > 0 && (
          <span className="text-green-600"> • {ticket.summary.totalReplaced} đã đổi</span>
        )}
        {ticket.summary.totalDeduction > 0 && (
          <span className="text-red-600"> • {formatCurrency(ticket.summary.totalDeduction)} trừ</span>
        )}
      </div>
      
      {/* SLA Timer (NEW) */}
      <WarrantySlaTimer ticket={ticket} className="mb-3" />
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
        <span>{ticket.employeeName}</span>
      </div>
    </Card>
  );
}
```

---

## 4. SO SÁNH DETAIL PAGE

### 4.1. Header Actions

#### **Complaints** (detail-page.tsx line 401-501):
```tsx
const actions = React.useMemo(() => {
  const buttons: React.ReactNode[] = [];
  
  // LEFT SIDE: View actions
  buttons.push(
    <Button key="print" variant="outline" onClick={handlePrint}>
      <Printer className="h-4 w-4 mr-2" />
      In phiếu
    </Button>
  );
  
  if (isTrackingEnabled()) {
    buttons.push(
      <Button key="tracking" variant="outline" onClick={handleCopyTrackingLink}>
        <Link2 className="h-4 w-4 mr-2" />
        Copy link tracking
      </Button>
    );
  }
  
  // RIGHT SIDE: Status transition buttons
  if (status === 'pending') {
    buttons.push(
      <Button key="investigate" onClick={handleStartInvestigation}>
        Bắt đầu xử lý
      </Button>
    );
  }
  
  if (status === 'investigating') {
    buttons.push(
      <Button key="resolve" onClick={handleResolve}>
        Hoàn thành
      </Button>
    );
  }
  
  if (status === 'resolved' || status === 'rejected') {
    buttons.push(
      <Button key="reopen" variant="outline" onClick={handleReopen}>
        Mở lại
      </Button>
    );
  }
  
  // Edit button
  buttons.push(
    <Button key="edit" variant="outline" onClick={() => navigate(`/complaints/${systemId}/edit`)}>
      <Edit2 className="h-4 w-4 mr-2" />
      Sửa
    </Button>
  );
  
  // Delete button (admin only)
  if (permissions.canDelete) {
    buttons.push(
      <Button key="delete" variant="destructive" onClick={handleDelete}>
        <Trash2 className="h-4 w-4 mr-2" />
        Xóa
      </Button>
    );
  }
  
  return buttons;
}, [status, permissions, ...]);
```

#### **Warranty** (warranty-detail-page.tsx line 295-346):
```tsx
const actions = React.useMemo(() => {
  const actionButtons = [];
  
  // Print (LEFT)
  actionButtons.push(
    <Button key="print" variant="outline" onClick={() => window.print()}>
      <Printer className="h-4 w-4 mr-2" />
      In
    </Button>
  );
  
  // Get Link (LEFT)
  actionButtons.push(
    <Button key="get-link" variant="outline" onClick={() => {
      const url = `${window.location.origin}/warranty/${systemId}`;
      navigator.clipboard.writeText(url);
      toast.success('Đã sao chép link vào clipboard');
    }}>
      <LinkIcon className="h-4 w-4 mr-2" />
      Get Link
    </Button>
  );
  
  // Status transitions (RIGHT)
  if (ticket?.status === 'new') {
    actionButtons.push(
      <Button key="to-pending" variant="outline" onClick={() => handleStatusChange('pending')}>
        Chuyển sang Chưa xử lý
      </Button>
    );
  }
  if (ticket?.status === 'pending') {
    actionButtons.push(
      <Button key="to-processed" variant="outline" onClick={() => handleStatusChange('processed')}>
        Đánh dấu Đã xử lý
      </Button>
    );
  }
  if (ticket?.status === 'processed') {
    actionButtons.push(
      <Button key="to-returned" variant="outline" onClick={() => setShowReturnDialog(true)}>
        Đã trả hàng cho khách
      </Button>
    );
  }
  
  // Edit button
  if (!isReturned) {
    actionButtons.push(
      <Button key="edit" variant="outline" onClick={() => navigate(`/warranty/${systemId}/edit`)}>
        <Edit2 className="h-4 w-4 mr-2" />
        Sửa
      </Button>
    );
  }
  
  return actionButtons;
}, [ticket?.status, isReturned, ...]);
```

**Khác biệt**:
- ❌ Warranty không có **public tracking link** (chỉ có internal link)
- ❌ Warranty không có **delete button**
- ⚠️ Warranty status buttons text khác nhau ("Chuyển sang..." vs "Bắt đầu xử lý")

### 4.2. Detail Page Layout

#### **Complaints** (detail-page.tsx line 699-1482):
```
┌─────────────────────────────────────────────────────┐
│  [Verification Card] - Conditional (chỉ khi chưa xác minh)
│  ┌──────────────────────────────────────────────┐   │
│  │ 🔍 Xác minh khiếu nại                        │   │
│  │ [Khiếu nại Đúng]  [Khiếu nại Sai]           │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [Row 1: Info Cards]                                │
│  ┌──────────────────┐ ┌────────────────────────┐   │
│  │ Thông tin KN     │ │ Trạng thái xử lý       │   │
│  │ 📋 ID, Type      │ │ Status badge           │   │
│  │ 📦 Order         │ │ Priority badge         │   │
│  │ 👤 Customer      │ │ 👤 Assigned            │   │
│  │ 📞 Phone         │ │ 📅 Dates               │   │
│  │ 🔢 Verification  │ │ 🏷️ Resolution          │   │
│  └──────────────────┘ └────────────────────────┘   │
│                                                      │
│  [Row 2: Time Tracking Card]                        │
│  ┌──────────────────────────────────────────────┐   │
│  │ ⏱️ Theo dõi SLA & Thời gian xử lý           │   │
│  │ Mục tiêu: Phản hồi 4h • Giải quyết 48h     │   │
│  │                                              │   │
│  │ [Đang xử lý]                                │   │
│  │   2h 15m                                    │   │
│  │                                              │   │
│  │ ⚡ Phản hồi: 1h 20m [OK ✓]                  │   │
│  │ ✅ Giải quyết: 12h 45m [Warning ⚠️]         │   │
│  │ 🔍 Điều tra: 45m                            │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [Row 3: Images]                                    │
│  ┌────────────────┐ ┌──────────────────────────┐   │
│  │ 🖼️ Hình ảnh    │ │ 📎 File đính kèm         │   │
│  │ [Img] [Img]    │ │ [File 1] [File 2]       │   │
│  └────────────────┘ └──────────────────────────┘   │
│                                                      │
│  [Row 4: Comments]                                  │
│  ┌──────────────────────────────────────────────┐   │
│  │ 💬 Bình luận (5)                            │   │
│  │ [TipTap Editor với mentions]               │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [Row 5: Timeline]                                  │
│  ┌──────────────────────────────────────────────┐   │
│  │ 📜 Lịch sử xử lý                            │   │
│  │ ○ Tạo khiếu nại - 3h ago                   │   │
│  │ ○ Giao cho NVA - 2h ago                    │   │
│  │ ○ Bắt đầu xử lý - 1h ago                   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Key Features**:
- ✅ **Verification Card** - Đặc thù của Complaints (xác minh đúng/sai)
- ✅ **Time Tracking Card** - Chi tiết SLA với live countdown
- ✅ Layout rõ ràng với multiple cards
- ✅ Icons cho mọi section

#### **Warranty** (warranty-detail-page.tsx line 356-778):
```
┌─────────────────────────────────────────────────────┐
│  [Row 1: Customer + Info]                           │
│  ┌────────────────────┐ ┌──────────────────────┐   │
│  │ 👤 Thông tin KH    │ │ 📋 Thông tin phiếu   │   │
│  │ Name, Phone        │ │ Status, Branch       │   │
│  │ Address            │ │ Employee, Tracking   │   │
│  └────────────────────┘ └──────────────────────┘   │
│                                                      │
│  [Row 2: Images 50-50]                              │
│  ┌─────────────────┐ ┌────────────────────────┐   │
│  │ Hình lúc nhận   │ │ Hình đã xử lý          │   │
│  │ [Img] [Img]     │ │ [Img] [Img]            │   │
│  └─────────────────┘ └────────────────────────┘   │
│                                                      │
│  [Row 3: Products Table]                            │
│  ┌──────────────────────────────────────────────┐   │
│  │ 📦 Danh sách sản phẩm bảo hành              │   │
│  │ [Expandable table with products]            │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [Row 4: History + Comments]                        │
│  ┌──────────────────┐ ┌──────────────────────┐   │
│  │ 📜 Lịch sử       │ │ 💬 Bình luận         │   │
│  │ Timeline         │ │ TipTap Editor        │   │
│  └──────────────────┘ └──────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Key Features**:
- ✅ Layout 2 columns cho History + Comments (tiết kiệm space)
- ✅ Products table expandable
- ❌ **Không có Time Tracking Card**
- ❌ Không có verification card (không cần cho Warranty)
- ⚠️ Thiếu status badges với colors

**Đề xuất**: Thêm Time Tracking Card cho Warranty

---

## 5. SO SÁNH TABLE COLUMNS

### 5.1. Column Features

#### **Complaints Columns** (columns.tsx):
- ✅ **Select** column (sticky left)
- ✅ **ID** column clickable (sticky left)
- ✅ Order Code với Package icon
- ✅ Customer Name + Phone (2 lines)
- ✅ **Type** column với badge
- ✅ **Priority** column với badge
- ✅ **Status** column với badge + icon
- ✅ **SLA Status** với live timer component
- ✅ **Assigned To** với avatar
- ✅ **Created At** với Calendar icon
- ✅ **Updated At** (optional)
- ✅ **Actions** column (sticky right) với DropdownMenu:
  - Xem chi tiết
  - Sửa
  - Copy tracking link
  - Gửi nhắc nhở
  - Xóa (red)

#### **Warranty Columns** (columns.tsx):
- ✅ **Select** column (sticky left)
- ✅ **ID** column clickable
- ✅ Customer Name
- ✅ Customer Phone
- ✅ Customer Address
- ✅ **Tracking Code** với font-mono
- ✅ **Shipping Fee** với currency format
- ✅ **Status** column với badge
- ✅ Products Count
- ✅ Total Products
- ✅ Total Replaced
- ✅ Total Deduction
- ✅ Received Images Count
- ✅ Processed Images Count
- ✅ History Count
- ✅ Created By
- ✅ Created At
- ✅ Updated At (hidden by default)
- ✅ **Actions** column (sticky right) với DropdownMenu:
  - Chỉnh sửa
  - Xóa

**Khác biệt**:
- ❌ Warranty không có **SLA Status column với live timer**
- ❌ Warranty không có **Priority column**
- ❌ Warranty actions thiếu **Copy tracking link**, **Gửi nhắc nhở**
- ✅ Warranty có nhiều metric columns hơn (Total Replaced, Deduction, Images count)

**Đề xuất**: Thêm SLA Status column cho Warranty

---

## 6. MISSING FEATURES

### 6.1. Context Menu System ⭐⭐⭐ CRITICAL

**Complaints có** (complaint-card-context-menu.tsx):
```tsx
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
  <Card>...</Card>
</ComplaintCardContextMenu>
```

**Status-aware menu**:
- **pending**: Sửa, Bắt đầu xử lý, Copy link, Nhắc nhở, Từ chối
- **investigating**: Sửa, Hoàn thành, Copy link, Nhắc nhở, Từ chối
- **resolved**: Copy link, Mở lại
- **rejected**: Copy link, Mở lại

**Warranty cần tạo**:
```tsx
// Tạo file: features/warranty/warranty-card-context-menu.tsx
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
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {ticket.status === 'new' && (
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
            <ContextMenuItem onSelect={() => onRemind(ticket.systemId)}>
              Gửi thông báo nhắc nhở
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onSelect={() => onCancel(ticket.systemId)}
              className="text-destructive"
            >
              Hủy phiếu
            </ContextMenuItem>
          </>
        )}
        
        {ticket.status === 'pending' && (
          <>
            <ContextMenuItem onSelect={() => onMarkProcessed(ticket.systemId)}>
              Hoàn thành xử lý
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
              Copy link tracking
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onRemind(ticket.systemId)}>
              Gửi nhắc nhở
            </ContextMenuItem>
          </>
        )}
        
        {ticket.status === 'processed' && (
          <>
            <ContextMenuItem onSelect={() => onMarkReturned(ticket.systemId)}>
              Đã trả hàng cho khách
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
              Copy link tracking
            </ContextMenuItem>
          </>
        )}
        
        {ticket.status === 'returned' && (
          <ContextMenuItem onSelect={() => onGetLink(ticket.systemId)}>
            Copy link tracking
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

### 6.2. SLA Timer Component ⭐⭐⭐ CRITICAL

**Complaints có** (sla-timer.tsx):
```tsx
export function SlaTimer({ complaint, className }: SlaTimerProps) {
  const [overdueStatus, setOverdueStatus] = React.useState(() => checkOverdue(complaint));
  
  // Update every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setOverdueStatus(checkOverdue(complaint));
    }, 60000);
    return () => clearInterval(timer);
  }, [complaint]);
  
  // Color based on urgency
  const getUrgencyClass = (minutesLeft: number) => {
    const hoursLeft = minutesLeft / 60;
    if (minutesLeft < 0) return 'text-destructive font-semibold';
    if (hoursLeft < 1) return 'text-destructive animate-pulse';
    if (hoursLeft < 3) return 'text-orange-500 font-medium';
    return 'text-muted-foreground';
  };
  
  return (
    <div className={cn('flex items-center gap-1 text-xs', getUrgencyClass(timeLeft))}>
      <Clock className="h-3 w-3" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
}
```

**Warranty cần tạo**:
```tsx
// Tạo file: features/warranty/warranty-sla-timer.tsx
// Tạo file: features/warranty/hooks/use-warranty-time-tracking.ts

// SLA Targets for Warranty
const WARRANTY_SLA_TARGETS = {
  response: 2 * 60, // 2 hours (minutes)
  processing: 24 * 60, // 24 hours
  return: 48 * 60, // 48 hours
};

export function WarrantySlaTimer({ ticket, className }: WarrantySlaTimerProps) {
  const timeTracking = useWarrantyTimeTracking(ticket);
  
  if (!timeTracking) return null;
  
  // Show different content based on status
  if (ticket.status === 'returned') {
    return (
      <div className={cn("text-xs text-muted-foreground", className)}>
        <Clock className="h-3 w-3 inline mr-1" />
        <span>Hoàn thành: {timeTracking.totalDuration}</span>
      </div>
    );
  }
  
  const { isOverdue, timeLeft, urgencyLevel } = timeTracking;
  
  const urgencyColors = {
    normal: 'text-muted-foreground',
    warning: 'text-orange-500 font-medium',
    critical: 'text-destructive animate-pulse',
    overdue: 'text-destructive font-semibold',
  };
  
  return (
    <div className={cn(
      'flex items-center gap-1 text-xs',
      urgencyColors[urgencyLevel],
      className
    )}>
      <Clock className="h-3 w-3" />
      <span>{isOverdue ? 'Quá hạn: ' : 'Còn '}{formatTime(timeLeft)}</span>
    </div>
  );
}
```

### 6.3. Auto Reminders ⭐⭐ IMPORTANT

**Complaints có** (hooks/use-complaint-reminders.ts):
- Background monitoring mỗi 60s
- 3 levels: First (4h), Second (8h), Escalated (24h)
- Gửi notification vào bell icon
- Settings configurable

**Warranty cần tạo**:
```tsx
// Tạo file: features/warranty/hooks/use-warranty-reminders.ts

interface WarrantyReminderSettings {
  enabled: boolean;
  firstReminderHours: number; // 2h
  secondReminderHours: number; // 6h
  escalationHours: number; // 12h
  notifyAssignee: boolean;
  notifyCreator: boolean;
  notifyManager: boolean;
}

export function useWarrantyReminders(ticket: WarrantyTicket | null) {
  const { addNotification } = useNotificationStore();
  const settings = loadWarrantyReminderSettings();
  
  React.useEffect(() => {
    if (!ticket || !settings.enabled || ticket.status === 'returned') return;
    
    const interval = setInterval(() => {
      const hoursSinceCreated = getHoursSince(ticket.createdAt);
      const hoursSinceLastUpdate = getHoursSince(ticket.updatedAt);
      const idleHours = Math.min(hoursSinceCreated, hoursSinceLastUpdate);
      
      if (idleHours >= settings.escalationHours) {
        sendReminder('escalated', ticket, settings, addNotification);
      } else if (idleHours >= settings.secondReminderHours) {
        sendReminder('second', ticket, settings, addNotification);
      } else if (idleHours >= settings.firstReminderHours) {
        sendReminder('first', ticket, settings, addNotification);
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [ticket?.systemId, settings.enabled]);
}
```

### 6.4. Public Tracking ⭐⭐ IMPORTANT

**Complaints có** (tracking-utils.ts):
```tsx
export function generateTrackingUrl(complaintId: string): string {
  const code = btoa(complaintId); // Base64 encode
  return `${window.location.origin}/tracking/complaints/${code}`;
}

export function isTrackingEnabled(): boolean {
  const settings = loadTrackingSettings();
  return settings.enabled;
}
```

**Warranty cần tạo**:
```tsx
// Tạo file: features/warranty/warranty-tracking-utils.ts
// Tạo file: features/warranty/warranty-public-tracking-page.tsx

export function generateWarrantyTrackingUrl(systemId: string): string {
  const code = btoa(systemId);
  return `${window.location.origin}/tracking/warranty/${code}`;
}

// Public tracking page for customers
export function PublicWarrantyTrackingPage() {
  const { code } = useParams();
  const systemId = atob(code);
  const ticket = useWarrantyStore(state => 
    state.data.find(t => t.systemId === systemId)
  );
  
  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tra cứu phiếu bảo hành {ticket.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Trạng thái</Label>
              <Badge>{WARRANTY_STATUS_LABELS[ticket.status]}</Badge>
            </div>
            
            <div>
              <Label>Tiến độ</Label>
              <Progress value={getProgressPercentage(ticket.status)} />
            </div>
            
            <div>
              <Label>Thông tin</Label>
              <div className="text-sm space-y-1">
                <div>Mã vận đơn: {ticket.trackingCode}</div>
                <div>Số sản phẩm: {ticket.summary.totalProducts}</div>
                <div>Đã xử lý: {ticket.summary.totalReplaced}</div>
              </div>
            </div>
            
            {/* Timeline (public events only) */}
            <div>
              <Label>Lịch sử</Label>
              {ticket.history
                .filter(h => isPublicEvent(h.action))
                .map(h => (
                  <div key={h.systemId} className="text-sm">
                    {h.actionLabel} - {formatDateTime(h.performedAt)}
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

### 6.5. Real-time Updates ⭐ NICE-TO-HAVE

**Complaints có** (use-realtime-updates.ts):
```tsx
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
  }, [isPolling, currentVersion]);
  
  return { hasUpdates, isPolling, togglePolling };
}
```

**Warranty có thể copy as-is** - Không cần thay đổi gì, chỉ cần import và dùng

### 6.6. Statistics Page ⭐ NICE-TO-HAVE

**Complaints có** (statistics-page.tsx):
- Total by status (Bar chart)
- Average times (Line chart)
- SLA compliance (Pie chart)
- Top assignees (Table)
- Date range filter

**Warranty cần tạo tương tự**

---

## 7. IMPLEMENTATION PLAN

### Phase 1: Critical UI Improvements (1-2 days) 🔴

#### **Task 1.1: Context Menu System**
- [ ] Tạo `features/warranty/warranty-card-context-menu.tsx`
- [ ] Implement status-aware menu items
- [ ] Wrap WarrantyCard trong KanbanColumn với ContextMenu
- [ ] Wrap table rows trong ResponsiveDataTable với ContextMenu
- [ ] Test all status transitions

**Files to create/modify**:
- `features/warranty/warranty-card-context-menu.tsx` (NEW)
- `features/warranty/warranty-list-page.tsx` (UPDATE)

**Estimated effort**: 3-4 hours

#### **Task 1.2: SLA Timer Component**
- [ ] Tạo `features/warranty/warranty-sla-timer.tsx`
- [ ] Tạo `features/warranty/hooks/use-warranty-time-tracking.ts`
- [ ] Tạo `features/warranty/warranty-sla-utils.ts`
- [ ] Define WARRANTY_SLA_TARGETS
- [ ] Implement live countdown with colors
- [ ] Add to WarrantyCard component
- [ ] Add SLA Status column to table

**Files to create/modify**:
- `features/warranty/warranty-sla-timer.tsx` (NEW)
- `features/warranty/hooks/use-warranty-time-tracking.ts` (NEW)
- `features/warranty/warranty-sla-utils.ts` (NEW)
- `features/warranty/warranty-card.tsx` (UPDATE - add timer)
- `features/warranty/columns.tsx` (UPDATE - add SLA column)

**Estimated effort**: 4-5 hours

#### **Task 1.3: Card Visual Improvements**
- [ ] Add border-left-4 accent color
- [ ] Add background tint (bg-red-50, etc.)
- [ ] Add overdue badge
- [ ] Improve layout with better spacing
- [ ] Add more icons

**Files to modify**:
- `features/warranty/warranty-card.tsx` (UPDATE)

**Estimated effort**: 2-3 hours

#### **Task 1.4: List Page Header Actions**
- [ ] Add Real-time toggle button
- [ ] Add Statistics button
- [ ] Fix Settings button visibility
- [ ] Convert view toggle to toggle group
- [ ] Consistent sizing (h-9)

**Files to modify**:
- `features/warranty/warranty-list-page.tsx` (UPDATE)

**Estimated effort**: 1-2 hours

#### **Task 1.5: Kanban Column Improvements**
- [ ] Add status icons
- [ ] Change header to bg-muted neutral
- [ ] Add local search per column
- [ ] Improve spacing

**Files to modify**:
- `features/warranty/warranty-list-page.tsx` (UPDATE KanbanColumn)

**Estimated effort**: 2 hours

**Phase 1 Total**: 12-16 hours (1.5-2 days)

---

### Phase 2: Important Features (2-3 days) 🟡

#### **Task 2.1: Auto Reminders System**
- [ ] Tạo `features/warranty/hooks/use-warranty-reminders.ts`
- [ ] Define WarrantyReminderSettings
- [ ] Implement background monitoring (60s interval)
- [ ] 3 reminder levels: 2h, 6h, 12h
- [ ] Send notifications to bell icon
- [ ] Add settings to warranty-settings-page.tsx

**Files to create/modify**:
- `features/warranty/hooks/use-warranty-reminders.ts` (NEW)
- `features/settings/warranty-settings-page.tsx` (UPDATE)
- `features/warranty/warranty-list-page.tsx` (UPDATE - use hook)
- `features/warranty/warranty-detail-page.tsx` (UPDATE - use hook)

**Estimated effort**: 4-5 hours

#### **Task 2.2: Public Tracking System**
- [ ] Tạo `features/warranty/warranty-tracking-utils.ts`
- [ ] Tạo `features/warranty/warranty-public-tracking-page.tsx`
- [ ] Add route `/tracking/warranty/:code`
- [ ] Implement Base64 encoding/decoding
- [ ] Design public tracking page (customer view)
- [ ] Add tracking settings to warranty-settings-page.tsx
- [ ] Add "Copy tracking link" to context menu & actions

**Files to create/modify**:
- `features/warranty/warranty-tracking-utils.ts` (NEW)
- `features/warranty/warranty-public-tracking-page.tsx` (NEW)
- `features/settings/warranty-settings-page.tsx` (UPDATE)
- `features/warranty/warranty-card-context-menu.tsx` (UPDATE)
- `features/warranty/warranty-detail-page.tsx` (UPDATE)
- Router config (UPDATE)

**Estimated effort**: 5-6 hours

#### **Task 2.3: Notification Integration**
- [ ] Tạo `features/warranty/warranty-notification-utils.ts`
- [ ] Implement warrantyNotifications wrapper
- [ ] Settings-aware notifications
- [ ] Events: onCreate, onAssign, onProcessed, onReturned, onOverdue
- [ ] Integrate with existing notification center

**Files to create/modify**:
- `features/warranty/warranty-notification-utils.ts` (NEW)
- `features/settings/warranty-settings-page.tsx` (UPDATE)
- `features/warranty/store.ts` (UPDATE - add notification calls)

**Estimated effort**: 3-4 hours

#### **Task 2.4: Settings Page Enhancements**
- [ ] Add SLA Configuration section
- [ ] Add Reminder Configuration section
- [ ] Add Notification Rules section
- [ ] Add Public Tracking toggle
- [ ] Improve layout & UX

**Files to modify**:
- `features/settings/warranty-settings-page.tsx` (UPDATE)

**Estimated effort**: 3-4 hours

**Phase 2 Total**: 15-19 hours (2-2.5 days)

---

### Phase 3: Nice-to-have Features (1-2 days) 🟢

#### **Task 3.1: Real-time Updates**
- [ ] Copy `use-realtime-updates.ts` from Complaints
- [ ] Integrate polling system
- [ ] Add Live/Manual toggle to header
- [ ] Test data versioning

**Files to create/modify**:
- `features/warranty/use-realtime-updates.ts` (COPY from complaints)
- `features/warranty/warranty-list-page.tsx` (UPDATE)

**Estimated effort**: 2-3 hours

#### **Task 3.2: Statistics Page**
- [ ] Tạo `features/warranty/warranty-statistics-page.tsx`
- [ ] Tạo `features/warranty/hooks/use-warranty-statistics.ts`
- [ ] Implement charts: Bar, Line, Pie
- [ ] Metrics: Total by status, Avg times, Top employees
- [ ] Date range filter

**Files to create/modify**:
- `features/warranty/warranty-statistics-page.tsx` (NEW)
- `features/warranty/hooks/use-warranty-statistics.ts` (NEW)
- Router config (UPDATE)

**Estimated effort**: 6-8 hours

**Phase 3 Total**: 8-11 hours (1-1.5 days)

---

### TỔNG KẾT IMPLEMENTATION

#### **Total Estimated Effort**:
- **Phase 1** (Critical): 12-16 hours
- **Phase 2** (Important): 15-19 hours
- **Phase 3** (Nice-to-have): 8-11 hours
- **TOTAL**: 35-46 hours (4.5-6 days)

#### **Priority Order**:
1. 🔴 **Context Menu** - Immediate UX improvement
2. 🔴 **SLA Timer** - Core business requirement
3. 🔴 **Card Visual** - Professional appearance
4. 🟡 **List Page Header** - Better navigation
5. 🟡 **Kanban Column** - Improved usability
6. 🟡 **Auto Reminders** - Prevent missed deadlines
7. 🟡 **Public Tracking** - Customer-facing feature
8. 🟡 **Notifications** - Better communication
9. 🟢 **Real-time** - Collaboration improvement
10. 🟢 **Statistics** - Management insights

#### **Testing Checklist**:
- [ ] Context menu hiển thị đúng cho mỗi status
- [ ] SLA timer countdown chính xác, colors đúng urgency
- [ ] Card colors apply theo settings
- [ ] Kanban column search hoạt động
- [ ] Auto reminders gửi đúng recipients
- [ ] Public tracking không cần authentication
- [ ] Notifications respect settings
- [ ] Real-time polling không lag
- [ ] Statistics tính toán chính xác
- [ ] Mobile responsive tất cả features

---

## 🎯 KẾT LUẬN

Warranty đã có **foundation tốt** với dual view, filters, comments, timeline. Tuy nhiên cần bổ sung:

### Critical (Must-have):
1. **Context Menu** - UX improvement lớn nhất
2. **SLA Timer** - Core feature thiếu
3. **Card Visual** - Professional look

### Important (Should-have):
4. **Auto Reminders** - Business-critical
5. **Public Tracking** - Customer satisfaction
6. **Notification Integration** - Communication

### Nice-to-have:
7. **Real-time Updates** - Team collaboration
8. **Statistics Page** - Management reporting

Sau khi hoàn thành **Phase 1 + 2** (3.5-4.5 days), Warranty sẽ ngang tầm với Complaints về UI/UX và business features! 🚀

---

**Version**: 1.0  
**Last Updated**: November 8, 2025  
**Author**: AI Assistant  
**Status**: Ready for Review & Implementation ✅
