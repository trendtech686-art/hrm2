import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Badge } from '../../../../components/ui/badge.tsx';
import { ScrollArea } from '../../../../components/ui/scroll-area.tsx';
import { Trash2, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useTrendtechSettingsStore } from '../store';
import type { TrendtechSyncLog } from '../../../../lib/trendtech/types';

export function LogTab() {
  const { settings, clearLogs } = useTrendtechSettingsStore();
  const logs = settings.logs;

  const handleClearLogs = () => {
    clearLogs();
    toast.success('Đã xóa tất cả logs');
  };

  const getStatusIcon = (status: TrendtechSyncLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: TrendtechSyncLog['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Thành công</Badge>;
      case 'error':
        return <Badge variant="destructive">Lỗi</Badge>;
      case 'partial':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Một phần</Badge>;
      case 'info':
        return <Badge variant="secondary">Thông tin</Badge>;
    }
  };

  const getActionLabel = (action: TrendtechSyncLog['action']) => {
    const labels: Record<TrendtechSyncLog['action'], string> = {
      'test_connection': 'Test kết nối',
      'ping': 'Ping server',
      'sync_all': 'Đồng bộ tất cả',
      'sync_price': 'Đồng bộ giá',
      'sync_inventory': 'Đồng bộ tồn kho',
      'sync_seo': 'Đồng bộ SEO',
      'create_product': 'Tạo sản phẩm',
      'update_product': 'Cập nhật SP',
      'delete_product': 'Xóa sản phẩm',
      'link_product': 'Liên kết SP',
      'unlink_product': 'Hủy liên kết',
      'sync_categories': 'Đồng bộ danh mục',
      'sync_brands': 'Đồng bộ thương hiệu',
      'get_products': 'Lấy danh sách SP',
      'upload_image': 'Upload ảnh',
      'save_config': 'Lưu cấu hình',
      'save_mapping': 'Lưu mapping',
    };
    return labels[action] || action;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Lịch sử hoạt động</CardTitle>
            <CardDescription>Log các thao tác đồng bộ với Trendtech</CardDescription>
          </div>
          {logs.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa logs
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có log nào
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className="font-medium">{getActionLabel(log.action)}</span>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{log.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                      {log.details?.responseTime && (
                        <span>{log.details.responseTime}ms</span>
                      )}
                      {log.details?.total !== undefined && (
                        <span>
                          {log.details.success}/{log.details.total} thành công
                        </span>
                      )}
                    </div>
                    {log.details && (
                      <div className="mt-2 text-xs space-y-1">
                        {log.details.productName && (
                          <div>Sản phẩm: {log.details.productName}</div>
                        )}
                        {log.details.trendtechId && (
                          <div>Trendtech ID: {log.details.trendtechId}</div>
                        )}
                        {log.details.error && (
                          <div className="text-red-500">Lỗi: {log.details.error}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
