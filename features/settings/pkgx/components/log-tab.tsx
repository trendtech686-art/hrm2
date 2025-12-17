import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Input } from '../../../../components/ui/input.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table.tsx';
import { Badge } from '../../../../components/ui/badge.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select.tsx';
import { Trash2, Search, CheckCircle2, XCircle, AlertCircle, RefreshCw, Globe, Link, Unlink, Save, Settings, DollarSign, Package, FileText, Info, User } from 'lucide-react';
import { toast } from 'sonner';
import { usePkgxSettingsStore } from '../store';
import type { PkgxSyncLog } from '../types';

export function LogTab() {
  const { settings, clearLogs } = usePkgxSettingsStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'success' | 'error' | 'partial' | 'info'>('all');
  const [actionFilter, setActionFilter] = React.useState<string>('all');
  
  const filteredLogs = React.useMemo(() => {
    let logs = settings.logs;
    
    // Filter by status
    if (statusFilter !== 'all') {
      logs = logs.filter((log) => log.status === statusFilter);
    }
    
    // Filter by action
    if (actionFilter !== 'all') {
      logs = logs.filter((log) => log.action === actionFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.message.toLowerCase().includes(term) ||
          log.action.toLowerCase().includes(term)
      );
    }
    
    return logs;
  }, [settings.logs, statusFilter, actionFilter, searchTerm]);
  
  const handleClearLogs = () => {
    clearLogs();
    toast.success('Đã xóa tất cả logs');
  };
  
  const getStatusBadge = (status: PkgxSyncLog['status']) => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Thành công
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Lỗi
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="default" className="bg-yellow-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            Một phần
          </Badge>
        );
      case 'info':
        return (
          <Badge variant="secondary">
            <Info className="h-3 w-3 mr-1" />
            Thông tin
          </Badge>
        );
    }
  };
  
  const getActionIcon = (action: PkgxSyncLog['action']) => {
    switch (action) {
      case 'test_connection':
      case 'ping':
        return <Globe className="h-4 w-4 text-blue-500" />;
      case 'sync_price':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'sync_inventory':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'sync_seo':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'create_product':
      case 'update_product':
        return <RefreshCw className="h-4 w-4 text-cyan-500" />;
      case 'link_product':
        return <Link className="h-4 w-4 text-blue-500" />;
      case 'unlink_product':
        return <Unlink className="h-4 w-4 text-gray-500" />;
      case 'save_config':
      case 'save_mapping':
        return <Save className="h-4 w-4 text-emerald-500" />;
      case 'sync_categories':
      case 'sync_brands':
      case 'get_products':
        return <RefreshCw className="h-4 w-4 text-indigo-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getActionLabel = (action: PkgxSyncLog['action']) => {
    const labels: Record<PkgxSyncLog['action'], string> = {
      test_connection: 'Test kết nối',
      ping: 'Ping server',
      sync_all: 'Đồng bộ tất cả',
      sync_price: 'Đồng bộ giá',
      sync_inventory: 'Đồng bộ tồn kho',
      sync_seo: 'Đồng bộ SEO',
      create_product: 'Tạo sản phẩm',
      update_product: 'Cập nhật SP',
      link_product: 'Liên kết SP',
      unlink_product: 'Hủy liên kết SP',
      unlink_mapping: 'Hủy mapping',
      sync_categories: 'Đồng bộ danh mục',
      sync_brands: 'Đồng bộ thương hiệu',
      get_products: 'Lấy danh sách SP',
      upload_image: 'Upload ảnh',
      save_config: 'Lưu cấu hình',
      save_mapping: 'Lưu mapping',
    };
    return labels[action] || action;
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
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Lịch sử đồng bộ</CardTitle>
              <CardDescription>
                Theo dõi hoạt động đồng bộ với PKGX
              </CardDescription>
            </div>
            <Button onClick={handleClearLogs} variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa tất cả logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="success">Thành công</SelectItem>
                  <SelectItem value="error">Lỗi</SelectItem>
                  <SelectItem value="partial">Một phần</SelectItem>
                  <SelectItem value="info">Thông tin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Hành động" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hành động</SelectItem>
                  <SelectItem value="test_connection">Test kết nối</SelectItem>
                  <SelectItem value="ping">Ping server</SelectItem>
                  <SelectItem value="save_config">Lưu cấu hình</SelectItem>
                  <SelectItem value="save_mapping">Lưu mapping</SelectItem>
                  <SelectItem value="create_product">Tạo sản phẩm</SelectItem>
                  <SelectItem value="update_product">Cập nhật SP</SelectItem>
                  <SelectItem value="link_product">Liên kết SP</SelectItem>
                  <SelectItem value="unlink_product">Hủy liên kết</SelectItem>
                  <SelectItem value="sync_all">Đồng bộ tất cả</SelectItem>
                  <SelectItem value="sync_price">Đồng bộ giá</SelectItem>
                  <SelectItem value="sync_inventory">Đồng bộ tồn kho</SelectItem>
                  <SelectItem value="sync_seo">Đồng bộ SEO</SelectItem>
                  <SelectItem value="sync_categories">Đồng bộ danh mục</SelectItem>
                  <SelectItem value="sync_brands">Đồng bộ thương hiệu</SelectItem>
                  <SelectItem value="get_products">Lấy danh sách SP</SelectItem>
                  <SelectItem value="upload_image">Upload ảnh</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {filteredLogs.length} logs
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Thời gian</TableHead>
                    <TableHead className="w-[140px]">Hành động</TableHead>
                    <TableHead className="w-[100px]">Trạng thái</TableHead>
                    <TableHead>Thông báo</TableHead>
                    <TableHead className="w-[120px]">Người thực hiện</TableHead>
                    <TableHead className="w-[200px]">Chi tiết</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        {searchTerm || statusFilter !== 'all' || actionFilter !== 'all'
                          ? 'Không tìm thấy log nào'
                          : 'Chưa có hoạt động đồng bộ nào'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs font-mono">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <Badge variant="outline" className="text-xs">{getActionLabel(log.action)}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell className="text-sm max-w-[300px] truncate" title={log.message}>
                          {log.message}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[100px]" title={log.userName || 'Hệ thống'}>
                              {log.userName || 'Hệ thống'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {log.details && (
                            <div className="space-y-0.5">
                              {/* API details */}
                              {log.details.method && log.details.url && (
                                <div className="font-mono text-blue-600">
                                  {log.details.method} {log.details.url.length > 30 ? '...' + log.details.url.slice(-30) : log.details.url}
                                </div>
                              )}
                              {log.details.httpStatus && (
                                <div className={log.details.httpStatus >= 400 ? 'text-red-600' : 'text-green-600'}>
                                  HTTP: {log.details.httpStatus}
                                </div>
                              )}
                              {log.details.responseTime !== undefined && (
                                <div className="text-gray-500">{log.details.responseTime}ms</div>
                              )}
                              {/* Sync stats */}
                              {log.details.total !== undefined && (
                                <div>Tổng: {log.details.total}</div>
                              )}
                              {log.details.success !== undefined && log.details.success > 0 && (
                                <div className="text-green-600">OK: {log.details.success}</div>
                              )}
                              {log.details.failed !== undefined && log.details.failed > 0 && (
                                <div className="text-red-600">Lỗi: {log.details.failed}</div>
                              )}
                              {/* Product details */}
                              {log.details.productId && (
                                <div>SP: {log.details.productId}</div>
                              )}
                              {log.details.pkgxId && (
                                <div>PKGX: {log.details.pkgxId}</div>
                              )}
                              {/* Mapping details */}
                              {log.details.categoryId && (
                                <div>DM: {log.details.categoryId}</div>
                              )}
                              {log.details.brandId && (
                                <div>TH: {log.details.brandId}</div>
                              )}
                              {/* Error details */}
                              {log.details.errorCode && (
                                <div className="text-red-600">Mã lỗi: {log.details.errorCode}</div>
                              )}
                              {log.details.error && (
                                <div className="text-red-600 truncate max-w-[180px]" title={log.details.error}>
                                  {log.details.error}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
