import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Switch } from '../../../../components/ui/switch';
import { Badge } from '../../../../components/ui/badge';
import { Eye, EyeOff, RefreshCw, CheckCircle2, XCircle, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useTrendtechSettings, useTrendtechConfigMutations, useTrendtechSyncSettingsMutations, useTrendtechLogMutations } from '../hooks/use-trendtech-settings';
import { ping, testConnection } from '../../../../lib/trendtech/api-service';

export function GeneralConfigTab() {
  const { data: settings } = useTrendtechSettings();
  const { setApiUrl, setApiKey, setEnabled, setConnectionStatus } = useTrendtechConfigMutations({ onSuccess: () => {} });
  const { updateSyncSetting } = useTrendtechSyncSettingsMutations({ onSuccess: () => {} });
  const { addLog } = useTrendtechLogMutations();
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [localApiUrl, setLocalApiUrl] = React.useState(settings?.apiUrl ?? '');
  const [localApiKey, setLocalApiKey] = React.useState(settings?.apiKey ?? '');
  
  // Update local state when settings change
  React.useEffect(() => {
    if (settings) {
      setLocalApiUrl(settings.apiUrl);
      setLocalApiKey(settings.apiKey);
    }
  }, [settings]);
  
  const handleSaveConfig = () => {
    setApiUrl.mutate(localApiUrl, {
      onSuccess: () => toast.success('Đã lưu cấu hình API'),
      onError: () => toast.error('Lỗi khi lưu cấu hình'),
    });
    setApiKey.mutate(localApiKey);
    addLog.mutate({
      action: 'save_config',
      status: 'success',
      message: 'Đã lưu cấu hình API',
      details: { url: localApiUrl },
    });
  };
  
  const handleTestConnection = async () => {
    if (!localApiKey) {
      toast.error('Vui lòng nhập API Key trước khi test');
      return;
    }
    
    if (!localApiUrl) {
      toast.error('Vui lòng nhập API URL trước khi test');
      return;
    }
    
    setIsTesting(true);
    const startTime = Date.now();
    
    try {
      // Save config first so API service can use it
      setApiUrl.mutate(localApiUrl);
      setApiKey.mutate(localApiKey);
      
      // Step 1: Ping server
      const pingResult = await ping({ apiUrl: localApiUrl, apiKey: localApiKey, enabled: true } as Parameters<typeof ping>[0]);
      
      if (!pingResult.success) {
        addLog.mutate({
          action: 'ping',
          status: 'error',
          message: `Server không phản hồi: ${pingResult.error}`,
          details: { url: localApiUrl, error: pingResult.error },
        });
        throw new Error(pingResult.error || 'Server không phản hồi');
      }
      
      addLog.mutate({
        action: 'ping',
        status: 'success',
        message: 'Server hoạt động',
        details: { url: localApiUrl, responseTime: Date.now() - startTime },
      });
      
      // Step 2: Test với API key
      const testStartTime = Date.now();
      const testResult = await testConnection({ apiUrl: localApiUrl, apiKey: localApiKey, enabled: true } as Parameters<typeof testConnection>[0]);
      
      if (testResult.success && testResult.data) {
        setConnectionStatus.mutate({ status: 'connected' });
        const stats = testResult.data.stats;
        addLog.mutate({
          action: 'test_connection',
          status: 'success',
          message: `Kết nối thành công! SP: ${stats?.totalProducts || 0}, DM: ${stats?.totalCategories || 0}, TH: ${stats?.totalBrands || 0}`,
          details: { 
            url: localApiUrl, 
            responseTime: Date.now() - testStartTime,
            total: stats?.totalProducts || 0,
          },
        });
        toast.success(`Kết nối thành công! Sản phẩm: ${stats?.totalProducts || 0}, Danh mục: ${stats?.totalCategories || 0}`);
      } else {
        setConnectionStatus.mutate({ status: 'error', error: testResult.error });
        addLog.mutate({
          action: 'test_connection',
          status: 'error',
          message: `Lỗi xác thực: ${testResult.error}`,
          details: { url: localApiUrl, error: testResult.error },
        });
        toast.error(`Lỗi: ${testResult.error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể kết nối';
      setConnectionStatus.mutate({ status: 'error', error: errorMessage });
      addLog.mutate({
        action: 'test_connection',
        status: 'error',
        message: `Lỗi kết nối: ${errorMessage}`,
        details: { error: errorMessage, responseTime: Date.now() - startTime },
      });
      toast.error(`Không thể kết nối đến server Trendtech: ${errorMessage}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  const getStatusBadge = () => {
    switch (settings?.connectionStatus) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Đã kết nối</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Lỗi kết nối</Badge>;
      default:
        return <Badge variant="secondary">Chưa kết nối</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* API Connection Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Thông tin kết nối API</CardTitle>
          <CardDescription>Cấu hình kết nối với website Trendtech (Next.js)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">API URL</Label>
            <Input
              id="apiUrl"
              value={localApiUrl}
              onChange={(e) => setLocalApiUrl(e.target.value)}
              placeholder="https://trendtech.vn/api/hrm"
            />
            <p className="text-sm text-muted-foreground">
              URL API endpoint của Trendtech (VD: https://trendtech.vn/api/hrm)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  placeholder="Nhập API Key..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <Button onClick={handleSaveConfig} variant="default">
              <Save className="h-4 w-4 mr-2" />
              Lưu cấu hình
            </Button>
            <Button onClick={handleTestConnection} variant="outline" disabled={isTesting}>
              {isTesting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Trạng thái:</span>
            {getStatusBadge()}
          </div>
        </CardContent>
      </Card>

      {/* Integration Status Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Trạng thái tích hợp</CardTitle>
          <CardDescription>Bật/tắt đồng bộ với Trendtech</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Bật tích hợp Trendtech</Label>
              <p className="text-sm text-muted-foreground">Cho phép đồng bộ sản phẩm với website</p>
            </div>
            <Switch
              checked={settings?.enabled ?? false}
              onCheckedChange={(checked) => {
                setEnabled.mutate(checked);
                addLog.mutate({
                  action: 'save_config',
                  status: 'info',
                  message: checked ? 'Đã bật tích hợp Trendtech' : 'Đã tắt tích hợp Trendtech',
                  details: {},
                });
                toast.success(checked ? 'Đã bật tích hợp Trendtech' : 'Đã tắt tích hợp Trendtech');
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Bật Auto Sync</Label>
              <p className="text-sm text-muted-foreground">Tự động đồng bộ dữ liệu theo lịch</p>
            </div>
            <Switch
              checked={settings?.syncSettings?.autoSyncEnabled ?? false}
              onCheckedChange={(checked) => {
                updateSyncSetting.mutate({ key: 'autoSyncEnabled', value: checked });
                addLog.mutate({
                  action: 'save_config',
                  status: 'info',
                  message: checked ? 'Đã bật Auto Sync' : 'Đã tắt Auto Sync',
                  details: {},
                });
              }}
              disabled={!settings?.enabled}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Hướng dẫn cài đặt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>1.</strong> Trendtech cần có các API endpoints tại <code>/api/hrm/*</code>
          </p>
          <p>
            <strong>2.</strong> API endpoints cần thiết:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><code>GET /api/hrm/ping</code> - Kiểm tra server</li>
            <li><code>GET /api/hrm/test</code> - Test với API Key</li>
            <li><code>GET /api/hrm/products</code> - Lấy danh sách sản phẩm</li>
            <li><code>POST /api/hrm/products</code> - Tạo sản phẩm</li>
            <li><code>PUT /api/hrm/products/[id]</code> - Cập nhật sản phẩm</li>
            <li><code>GET /api/hrm/categories</code> - Lấy danh mục</li>
            <li><code>GET /api/hrm/brands</code> - Lấy thương hiệu</li>
          </ul>
          <p>
            <strong>3.</strong> Authentication: Header <code>Authorization: Bearer YOUR_API_KEY</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
