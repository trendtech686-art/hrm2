"use client";

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { useColumnLayout } from '../../../hooks/use-column-visibility';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Tabs, TabsContent } from '../../../components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger } from '../../../components/layout/page-section';
import { ResponsiveDataTable } from '../../../components/data-table/responsive-data-table';
import { PageFilters } from '../../../components/layout/page-filters';
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import type { ColumnDef } from '../../../components/data-table/types';
import { 
  Search, Plus, Pencil, Trash2, RefreshCw, History, User, 
  Package, Users, ShoppingCart, Truck, Receipt, CreditCard, 
  Warehouse, ClipboardList, RotateCcw, FileText, Settings, 
  ArrowRight, Calendar, Eye, Upload
} from 'lucide-react';

const ImportExportLogsContent = React.lazy(() => 
  import('./import-export-logs-page').then(mod => ({ default: mod.ImportExportLogsContent }))
);

// Activity Log type based on Prisma model
interface ActivityLog {
  systemId: string;
  entityType: string;
  entityId: string;
  action: string;
  actionType: string | null;
  changes: Record<string, { from: unknown; to: unknown }> | null;
  metadata: Record<string, unknown> | null;
  note: string | null;
  createdAt: string;
  createdBy: string | null;
}

// Fetch activity logs
async function fetchActivityLogs(params: {
  entityType?: string;
  actionType?: string;
  limit?: number;
  offset?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.entityType) searchParams.set('entityType', params.entityType);
  if (params.actionType) searchParams.set('actionType', params.actionType);
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.offset) searchParams.set('offset', String(params.offset));
  
  const url = searchParams.toString() ? `/api/activity-logs?${searchParams}` : '/api/activity-logs';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch activity logs');
  }
  
  return response.json() as Promise<{ data: ActivityLog[]; total: number; limit: number; offset: number }>;
}

export function SystemLogsPage() {
  useSettingsPageHeader({
    title: 'Nhật ký hệ thống',
  });

  const [searchTerm, setSearchTerm] = React.useState('');
  const [entityFilter, setEntityFilter] = React.useState<string>('all');
  const [actionTypeFilter, setActionTypeFilter] = React.useState<string>('all');
  
  // Pagination state
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('system-logs');
  
  // Detail sheet
  const [selectedLog, setSelectedLog] = React.useState<ActivityLog | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  
  // Fetch logs with React Query - server-side pagination
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['activity-logs', entityFilter, actionTypeFilter, pagination.pageSize, pagination.pageIndex],
    queryFn: () => fetchActivityLogs({
      entityType: entityFilter !== 'all' ? entityFilter : undefined,
      actionType: actionTypeFilter !== 'all' ? actionTypeFilter : undefined,
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
    }),
    staleTime: 30 * 1000,
  });
  
  const allLogs = React.useMemo(() => data?.data ?? [], [data?.data]);
  const serverTotal = data?.total ?? 0;
  
  // Filter logs client-side for search (within current page)
  const filteredLogs = React.useMemo(() => {
    if (!searchTerm) return allLogs;
    
    const term = searchTerm.toLowerCase();
    return allLogs.filter(
      (log) =>
        log.entityId.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        (log.note && log.note.toLowerCase().includes(term))
    );
  }, [allLogs, searchTerm]);
  
  // Sorted data (within current page)
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredLogs];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[sorting.id];
        const bVal = (b as unknown as Record<string, unknown>)[sorting.id];
        
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        const comparison = String(aVal).localeCompare(String(bVal));
        return sorting.desc ? -comparison : comparison;
      });
    }
    return sorted;
  }, [filteredLogs, sorting]);
  
  const pageCount = Math.ceil(serverTotal / pagination.pageSize);
  
  // Helper functions
  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'product':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'employee':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'customer':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'supplier':
        return <Truck className="h-4 w-4 text-orange-500" />;
      case 'order':
      case 'packaging':
        return <ShoppingCart className="h-4 w-4 text-indigo-500" />;
      case 'purchase_order':
        return <ClipboardList className="h-4 w-4 text-cyan-500" />;
      case 'purchase_return':
      case 'sales_return':
        return <RotateCcw className="h-4 w-4 text-teal-500" />;
      case 'stock_transfer':
        return <RotateCcw className="h-4 w-4 text-teal-500" />;
      case 'inventory_check':
        return <Warehouse className="h-4 w-4 text-amber-500" />;
      case 'inventory_receipt':
        return <Warehouse className="h-4 w-4 text-amber-500" />;
      case 'receipt':
        return <Receipt className="h-4 w-4 text-emerald-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-red-500" />;
      case 'payroll':
        return <CreditCard className="h-4 w-4 text-pink-500" />;
      case 'attendance':
        return <Calendar className="h-4 w-4 text-sky-500" />;
      case 'leave':
      case 'penalty':
        return <User className="h-4 w-4 text-rose-500" />;
      case 'task':
        return <ClipboardList className="h-4 w-4 text-violet-500" />;
      case 'shipment':
        return <Truck className="h-4 w-4 text-lime-500" />;
      case 'complaint':
      case 'warranty':
      case 'return_method':
        return <FileText className="h-4 w-4 text-yellow-500" />;
      case 'wiki':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'price_adjustment':
      case 'cost_adjustment':
        return <Settings className="h-4 w-4 text-orange-400" />;
      case 'status':
        return <RefreshCw className="h-4 w-4 text-purple-400" />;
      case 'settings':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getActionIcon = (action: string) => {
    if (action.includes('created') || action.includes('create')) {
      return <Plus className="h-3.5 w-3.5 text-green-500" />;
    }
    if (action.includes('updated') || action.includes('update') || action.includes('changed')) {
      return <Pencil className="h-3.5 w-3.5 text-blue-500" />;
    }
    if (action.includes('deleted') || action.includes('delete')) {
      return <Trash2 className="h-3.5 w-3.5 text-red-500" />;
    }
    return <RefreshCw className="h-3.5 w-3.5 text-gray-500" />;
  };
  
  const getActionBadgeColor = (actionType: string | null) => {
    switch (actionType) {
      case 'create':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'status':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  const getEntityLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      'product': 'Sản phẩm',
      'employee': 'Nhân viên',
      'customer': 'Khách hàng',
      'supplier': 'Nhà cung cấp',
      'order': 'Đơn hàng',
      'purchase_order': 'Đơn nhập',
      'purchase_return': 'Trả hàng nhập',
      'sales_return': 'Trả hàng bán',
      'stock_transfer': 'Chuyển kho',
      'inventory_check': 'Kiểm kê',
      'inventory_receipt': 'Phiếu nhập kho',
      'receipt': 'Phiếu thu',
      'payment': 'Phiếu chi',
      'payroll': 'Bảng lương',
      'attendance': 'Chấm công',
      'leave': 'Nghỉ phép',
      'penalty': 'Kỷ luật',
      'task': 'Công việc',
      'shipment': 'Vận chuyển',
      'packaging': 'Đóng gói',
      'complaint': 'Khiếu nại',
      'warranty': 'Bảo hành',
      'return_method': 'Phương thức trả',
      'wiki': 'Wiki',
      'price_adjustment': 'Điều chỉnh giá',
      'cost_adjustment': 'Điều chỉnh giá vốn',
      'status': 'Trạng thái',
      'settings': 'Cài đặt',
    };
    return labels[entityType] || entityType;
  };
  
  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'created': 'Tạo mới',
      'updated': 'Cập nhật',
      'deleted': 'Xóa',
      'restored': 'Khôi phục',
      'status_changed': 'Đổi trạng thái',
      'price_changed': 'Đổi giá',
      'stock_changed': 'Đổi tồn kho',
      'payment_added': 'Thêm thanh toán',
      'delivered': 'Giao hàng',
      'cancelled': 'Hủy',
      'completed': 'Hoàn thành',
      'document_uploaded': 'Tải lên tài liệu',
      'document_deleted': 'Xóa tài liệu',
    };
    return labels[action] || action.replace(/_/g, ' ');
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  
  const handleRowClick = (log: ActivityLog) => {
    setSelectedLog(log);
    setIsSheetOpen(true);
  };
  
  // Render changes in detail view with Vietnamese labels
  const getFieldLabel = (field: string): string => {
    const fieldLabels: Record<string, string> = {
      // Employee fields
      fullName: 'Họ tên', firstName: 'Tên', lastName: 'Họ',
      gender: 'Giới tính', dob: 'Ngày sinh', dateOfBirth: 'Ngày sinh',
      phone: 'Điện thoại', placeOfBirth: 'Nơi sinh',
      personalEmail: 'Email cá nhân', workEmail: 'Email công việc',
      nationalId: 'Số CCCD/CMND', nationalIdIssueDate: 'Ngày cấp CCCD',
      nationalIdIssuePlace: 'Nơi cấp CCCD', avatarUrl: 'Ảnh đại diện',
      permanentAddress: 'Địa chỉ thường trú', temporaryAddress: 'Địa chỉ tạm trú',
      departmentId: 'Phòng ban', jobTitleId: 'Chức danh', branchId: 'Chi nhánh',
      managerId: 'Quản lý trực tiếp', hireDate: 'Ngày vào làm', startDate: 'Ngày bắt đầu',
      employeeType: 'Loại nhân viên', role: 'Vai trò hệ thống',
      baseSalary: 'Lương cơ bản', socialInsuranceSalary: 'Lương đóng BHXH',
      positionAllowance: 'Phụ cấp chức vụ', mealAllowance: 'Phụ cấp ăn trưa',
      otherAllowances: 'Phụ cấp khác', numberOfDependents: 'Số người phụ thuộc',
      contractNumber: 'Số hợp đồng', contractStartDate: 'Ngày bắt đầu HĐ',
      contractEndDate: 'Ngày hết hạn HĐ', contractType: 'Loại hợp đồng',
      probationEndDate: 'Ngày kết thúc thử việc', terminationDate: 'Ngày nghỉ việc',
      bankAccountNumber: 'Số tài khoản', bankName: 'Ngân hàng', bankBranch: 'Chi nhánh NH',
      personalTaxId: 'Mã số thuế', socialInsuranceNumber: 'Số sổ BHXH',
      employmentStatus: 'Trạng thái làm việc', annualLeaveBalance: 'Số ngày phép',
      maritalStatus: 'Tình trạng hôn nhân', notes: 'Ghi chú',
      emergencyContactName: 'Liên hệ khẩn cấp', emergencyContactPhone: 'SĐT khẩn cấp',
      workingHoursPerDay: 'Giờ làm/ngày', workingDaysPerWeek: 'Ngày làm/tuần',
      shiftType: 'Ca làm việc', skills: 'Kỹ năng', certifications: 'Chứng chỉ',
      // Product fields
      name: 'Tên', sku: 'Mã SKU', barcode: 'Mã vạch', description: 'Mô tả',
      price: 'Giá bán', costPrice: 'Giá vốn', categoryId: 'Danh mục',
      brandId: 'Thương hiệu', stock: 'Tồn kho', unit: 'Đơn vị',
      // Order fields
      status: 'Trạng thái', totalAmount: 'Tổng tiền', paidAmount: 'Đã thanh toán',
      customerId: 'Khách hàng', shippingAddress: 'Địa chỉ giao hàng',
      // Customer fields
      email: 'Email', zaloPhone: 'Zalo', company: 'Công ty', companyName: 'Tên công ty',
      taxCode: 'Mã số thuế', representative: 'Người đại diện', position: 'Chức vụ',
      addresses: 'Danh sách địa chỉ', contacts: 'Người liên hệ',
      currentDebt: 'Công nợ hiện tại', maxDebt: 'Hạn mức công nợ',
      type: 'Loại khách hàng', customerGroup: 'Nhóm khách hàng',
      pricingLevel: 'Mức giá', pricingPolicyId: 'Chính sách giá',
      defaultDiscount: 'Giảm giá mặc định', source: 'Nguồn khách hàng',
      campaign: 'Chiến dịch', referredBy: 'Người giới thiệu',
      bankAccount: 'Số tài khoản', paymentTerms: 'Hạn thanh toán',
      creditRating: 'Xếp hạng tín dụng', allowCredit: 'Cho phép công nợ',
      lifecycleStage: 'Giai đoạn vòng đời', contract: 'Hợp đồng',
      businessProfiles: 'Thông tin doanh nghiệp', images: 'Hình ảnh',
      social: 'Mạng xã hội', lastContactDate: 'Ngày liên hệ cuối',
      nextFollowUpDate: 'Ngày theo dõi tiếp', followUpReason: 'Lý do theo dõi',
      followUpAssigneeId: 'Người phụ trách', tags: 'Thẻ', accountManagerId: 'NV phụ trách',
    };
    return fieldLabels[field] || field;
  };

  // Format value for display (dates, etc.)
  const formatValue = (value: unknown, field: string): string => {
    if (value === null || value === undefined) return '(trống)';
    
    // Check if it's a date field
    const dateFields = ['dob', 'dateOfBirth', 'hireDate', 'startDate', 'terminationDate', 
      'contractStartDate', 'contractEndDate', 'probationEndDate', 'nationalIdIssueDate',
      'lastReviewDate', 'nextReviewDate', 'createdAt', 'updatedAt',
      // Customer date fields
      'lastContactDate', 'nextFollowUpDate'];
    
    if (dateFields.includes(field) || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value))) {
      try {
        const date = new Date(value as string);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
          });
        }
      } catch {
        // fallback to string
      }
    }
    
    // Format boolean
    if (typeof value === 'boolean') {
      return value ? 'Có' : 'Không';
    }
    
    // Format array
    if (Array.isArray(value)) {
      return `${value.length} mục`;
    }
    
    return String(value);
  };

  const renderChanges = (changes: Record<string, { from: unknown; to: unknown }> | null) => {
    if (!changes || Object.keys(changes).length === 0) {
      return <p className="text-sm text-muted-foreground">Không có thay đổi chi tiết</p>;
    }
    
    return (
      <div className="space-y-2">
        {Object.entries(changes).map(([field, { from, to }]) => (
          <div key={field} className="flex items-start gap-2 text-sm p-2 rounded-md bg-muted/50">
            <span className="font-medium min-w-32">{getFieldLabel(field)}:</span>
            <span className="text-red-600 line-through">{formatValue(from, field)}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-green-600">{formatValue(to, field)}</span>
          </div>
        ))}
      </div>
    );
  };

  // Define columns
  const columns: ColumnDef<ActivityLog>[] = [
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Thời gian',
      size: 150,
      cell: ({ row }) => (
        <span className="text-xs font-mono">
          {formatTimestamp(row.createdAt)}
        </span>
      ),
    },
    {
      id: 'entityType',
      accessorKey: 'entityType',
      header: 'Module',
      size: 120,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getEntityIcon(row.entityType)}
          <span className="text-sm">{getEntityLabel(row.entityType)}</span>
        </div>
      ),
    },
    {
      id: 'action',
      accessorKey: 'action',
      header: 'Hành động',
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getActionIcon(row.action)}
          <Badge variant="outline" className={`text-xs ${getActionBadgeColor(row.actionType)}`}>
            {getActionLabel(row.action)}
          </Badge>
        </div>
      ),
    },
    {
      id: 'entityId',
      accessorKey: 'entityId',
      header: 'ID',
      size: 130,
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground truncate block max-w-28" title={row.entityId}>
          {row.entityId}
        </span>
      ),
    },
    {
      id: 'note',
      accessorKey: 'note',
      header: 'Ghi chú',
      size: 200,
      cell: ({ row }) => (
        <span className="text-sm truncate block max-w-45" title={row.note || undefined}>
          {row.note || '-'}
        </span>
      ),
    },
    {
      id: 'createdBy',
      accessorKey: 'createdBy',
      header: 'Người thực hiện',
      size: 130,
      cell: ({ row }) => {
        const userName = (row.metadata as Record<string, unknown> | null)?.userName as string | undefined;
        return (
          <div className="flex items-center gap-1.5 text-xs">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-25">
              {userName || row.createdBy || 'Hệ thống'}
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      accessorKey: 'systemId',
      header: '',
      size: 50,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Mobile card renderer
  const renderMobileCard = (log: ActivityLog) => (
    <div className="p-4 space-y-3" onClick={() => handleRowClick(log)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getEntityIcon(log.entityType)}
          <span className="font-medium">{getEntityLabel(log.entityType)}</span>
        </div>
        <Badge variant="outline" className={`text-xs ${getActionBadgeColor(log.actionType)}`}>
          {getActionLabel(log.action)}
        </Badge>
      </div>
      
      <div className="space-y-1.5">
        <p className="text-xs font-mono text-muted-foreground">ID: {log.entityId}</p>
        {log.note && <p className="text-sm">{log.note}</p>}
        <p className="text-xs text-muted-foreground">
          {formatTimestamp(log.createdAt)}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{(log.metadata as Record<string, unknown> | null)?.userName as string || log.createdBy || 'Hệ thống'}</span>
        </div>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="activity" className="w-full">
        <MobileTabsList className="mb-4">
          <MobileTabsTrigger value="activity" className="gap-2">
            <History className="h-4 w-4" />
            Hoạt động
          </MobileTabsTrigger>
          <MobileTabsTrigger value="import-export" className="gap-2">
            <Upload className="h-4 w-4" />
            Import / Export
          </MobileTabsTrigger>
        </MobileTabsList>
        
        <TabsContent value="activity">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle size="lg">Lịch sử hoạt động</CardTitle>
              <CardDescription>
                Theo dõi các thao tác trong hệ thống
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <PageFilters>
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả module</SelectItem>
                <SelectItem value="product">Sản phẩm</SelectItem>
                <SelectItem value="employee">Nhân viên</SelectItem>
                <SelectItem value="customer">Khách hàng</SelectItem>
                <SelectItem value="supplier">Nhà cung cấp</SelectItem>
                <SelectItem value="order">Đơn hàng</SelectItem>
                <SelectItem value="packaging">Đóng gói</SelectItem>
                <SelectItem value="purchase_order">Đơn nhập</SelectItem>
                <SelectItem value="purchase_return">Trả hàng nhập</SelectItem>
                <SelectItem value="sales_return">Trả hàng bán</SelectItem>
                <SelectItem value="stock_transfer">Chuyển kho</SelectItem>
                <SelectItem value="inventory_check">Kiểm kê</SelectItem>
                <SelectItem value="inventory_receipt">Phiếu nhập kho</SelectItem>
                <SelectItem value="receipt">Phiếu thu</SelectItem>
                <SelectItem value="payment">Phiếu chi</SelectItem>
                <SelectItem value="payroll">Bảng lương</SelectItem>
                <SelectItem value="attendance">Chấm công</SelectItem>
                <SelectItem value="leave">Nghỉ phép</SelectItem>
                <SelectItem value="penalty">Kỷ luật</SelectItem>
                <SelectItem value="task">Công việc</SelectItem>
                <SelectItem value="shipment">Vận chuyển</SelectItem>
                <SelectItem value="complaint">Khiếu nại</SelectItem>
                <SelectItem value="warranty">Bảo hành</SelectItem>
                <SelectItem value="wiki">Wiki</SelectItem>
                <SelectItem value="price_adjustment">Điều chỉnh giá</SelectItem>
                <SelectItem value="cost_adjustment">Điều chỉnh giá vốn</SelectItem>
                <SelectItem value="settings">Cài đặt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Loại thao tác" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="create">Tạo mới</SelectItem>
                <SelectItem value="update">Cập nhật</SelectItem>
                <SelectItem value="delete">Xóa</SelectItem>
                <SelectItem value="status">Đổi trạng thái</SelectItem>
              </SelectContent>
            </Select>
          </PageFilters>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{serverTotal} logs</span>
            {searchTerm && filteredLogs.length !== allLogs.length && (
              <span className="text-xs">(hiển thị: {filteredLogs.length})</span>
            )}
          </div>
          
          {/* ResponsiveDataTable */}
          <ResponsiveDataTable<ActivityLog>
            columns={columns}
            data={sortedData}
            isLoading={isLoading}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={serverTotal}
            sorting={sorting}
            setSorting={setSorting}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            renderMobileCard={renderMobileCard}
            onRowClick={handleRowClick}
            emptyTitle="Chưa có hoạt động"
            emptyDescription={
              searchTerm || entityFilter !== 'all' || actionTypeFilter !== 'all'
                ? 'Không tìm thấy log nào phù hợp với bộ lọc'
                : 'Chưa có hoạt động nào được ghi lại'
            }
            emptyAction={
              allLogs.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <History className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm">Các thao tác sẽ được ghi nhận tự động</p>
                </div>
              ) : undefined
            }
          />
        </CardContent>
      </Card>
      
      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-125 sm:max-w-125">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedLog && getEntityIcon(selectedLog.entityType)}
              Chi tiết hoạt động
            </SheetTitle>
            <SheetDescription>
              Thông tin chi tiết về thao tác trong hệ thống
            </SheetDescription>
          </SheetHeader>
          
          {selectedLog && (
            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
              <div className="space-y-6 pr-4">
                {/* Basic Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Thông tin chung
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Thời gian</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{formatTimestamp(selectedLog.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Module</span>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(selectedLog.entityType)}
                        <span className="text-sm font-medium">{getEntityLabel(selectedLog.entityType)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Hành động</span>
                      <Badge variant="outline" className={getActionBadgeColor(selectedLog.actionType)}>
                        {getActionIcon(selectedLog.action)}
                        <span className="ml-1">{getActionLabel(selectedLog.action)}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">ID đối tượng</span>
                      <span className="text-sm font-mono">{selectedLog.entityId}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Người thực hiện</span>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{(selectedLog.metadata as Record<string, unknown> | null)?.userName as string || selectedLog.createdBy || 'Hệ thống'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Note */}
                {selectedLog.note && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Ghi chú
                    </h4>
                    <p className="text-sm p-3 rounded-lg bg-muted/50">{selectedLog.note}</p>
                  </div>
                )}
                
                {/* Changes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Chi tiết thay đổi
                  </h4>
                  {renderChanges(selectedLog.changes)}
                </div>
                
                {/* Metadata */}
                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Metadata
                    </h4>
                    <pre className="text-xs p-3 rounded-lg bg-muted/50 overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
        </TabsContent>
        
        <TabsContent value="import-export">
          <React.Suspense fallback={<div className="flex items-center justify-center py-12 text-muted-foreground">Đang tải...</div>}>
            <ImportExportLogsContent />
          </React.Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
