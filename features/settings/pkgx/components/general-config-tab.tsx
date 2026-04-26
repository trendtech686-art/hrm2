import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Switch } from '../../../../components/ui/switch';
import { Badge } from '../../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { SettingsActionButton } from '../../../../components/settings/SettingsActionButton';
import { Eye, EyeOff, RefreshCw, CheckCircle2, XCircle, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { usePkgxSettings, usePkgxConfigMutations, usePkgxSyncSettingsMutations, usePkgxLogMutations } from '../hooks/use-pkgx-settings';
import { useAllBranches } from '../../branches/hooks/use-all-branches';
import { PKGX_API_CONFIG } from '../constants';
import { logError } from '@/lib/logger'

export function GeneralConfigTab() {
  const { data: settings } = usePkgxSettings();
  const { setApiUrl, setApiKey, setEnabled, setConnectionStatus, setDefaultBranchId } = usePkgxConfigMutations({ onSuccess: () => {} });
  const { updateSyncSetting } = usePkgxSyncSettingsMutations({ onSuccess: () => {} });
  const { addLog } = usePkgxLogMutations();
  const { data: branches } = useAllBranches();
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

  const isConfigDirty = React.useMemo(
    () => localApiUrl !== (settings?.apiUrl ?? '') || localApiKey !== (settings?.apiKey ?? ''),
    [localApiUrl, localApiKey, settings?.apiUrl, settings?.apiKey],
  );
  
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
    
    setIsTesting(true);
    const startTime = Date.now();
    
    try {
      // Step 1: Ping server (không cần API key) để kiểm tra server hoạt động
      const pingUrl = `${localApiUrl}?action=ping`;
      const pingResponse = await fetch(`/api/pkgx/proxy?url=${encodeURIComponent(pingUrl)}`, {
        method: 'GET',
      });
      
      if (!pingResponse.ok) {
        addLog.mutate({
          action: 'ping',
          status: 'error',
          message: `Server không phản hồi`,
          details: { url: pingUrl, httpStatus: pingResponse.status },
        });
        throw new Error(`Server không phản hồi (HTTP ${pingResponse.status})`);
      }
      
      // Verify ping response is valid JSON
      const pingText = await pingResponse.text();
      try {
        JSON.parse(pingText);
      } catch {
        // Lấy tên file từ URL người dùng nhập
        const apiFileName = localApiUrl.split('/').pop() || 'api_product_hrm.php';
        addLog.mutate({
          action: 'ping',
          status: 'error',
          message: 'Server trả về lỗi PHP thay vì JSON',
          details: { url: pingUrl, error: pingText.substring(0, 100) },
        });
        throw new Error(`Server có lỗi PHP. Vui lòng upload lại file ${apiFileName}`);
      }
      
      addLog.mutate({
        action: 'ping',
        status: 'success',
        message: 'Server hoạt động',
        details: { url: pingUrl, responseTime: Date.now() - startTime },
      });
      
      // Step 2: Test với API key
      const testUrl = `${localApiUrl}?action=test`;
      const testStartTime = Date.now();
      const response = await fetch(`/api/pkgx/proxy?url=${encodeURIComponent(testUrl)}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': localApiKey,
        },
      });
      
      // Check if response is JSON
      const _contentType = response.headers.get('content-type');
      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (_parseError) {
        // PHP trả về HTML error thay vì JSON
        const errorPreview = responseText.substring(0, 200);
        logError('Invalid JSON response', errorPreview);
        throw new Error(`Server trả về lỗi PHP. Kiểm tra file API trên server.`);
      }
      
      if (!data.error) {
        setConnectionStatus.mutate({ status: 'connected' });
        const stats = data.stats || {};
        addLog.mutate({
          action: 'test_connection',
          status: 'success',
          message: `Kết nối thành công! SP: ${stats.total_products}, DM: ${stats.total_categories}, TH: ${stats.total_brands}`,
          details: { 
            url: testUrl, 
            responseTime: Date.now() - testStartTime,
            total: stats.total_products,
          },
        });
        toast.success(`Kết nối thành công! Sản phẩm: ${stats.total_products || 0}, Danh mục: ${stats.total_categories || 0}, Thương hiệu: ${stats.total_brands || 0}`);
      } else {
        setConnectionStatus.mutate({ status: 'error', error: data.message });
        addLog.mutate({
          action: 'test_connection',
          status: 'error',
          message: `Lỗi xác thực: ${data.message}`,
          details: { url: testUrl, error: data.message },
        });
        toast.error(`Lỗi: ${data.message}`);
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
      toast.error(`Không thể kết nối đến server PKGX: ${errorMessage}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  const getStatusBadge = () => {
    switch (settings?.connectionStatus) {
      case 'connected':
        return <Badge variant="default" className="bg-success/15 text-success-foreground border-success/30"><CheckCircle2 className="h-3 w-3 mr-1" />Đã kết nối</Badge>;
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
          <CardDescription>Cấu hình kết nối với website phukiengiaxuong.com.vn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">API URL</Label>
            <Input
              id="apiUrl"
              value={localApiUrl}
              onChange={(e) => setLocalApiUrl(e.target.value)}
              placeholder={PKGX_API_CONFIG.baseUrl}
            />
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
            <SettingsActionButton
              onClick={handleSaveConfig}
              variant="default"
              disabled={!isConfigDirty || setApiUrl.isPending || setApiKey.isPending}
            >
              {setApiUrl.isPending || setApiKey.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Lưu cấu hình
            </SettingsActionButton>
            <SettingsActionButton onClick={handleTestConnection} disabled={isTesting} variant="outline">
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Test Connection
            </SettingsActionButton>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Trạng thái:</span>
            {getStatusBadge()}
          </div>
          
          {settings?.connectionError && settings?.connectionStatus !== 'connected' && (
            <p className="text-sm text-destructive">{settings.connectionError}</p>
          )}
        </CardContent>
      </Card>
      
      {/* Enable/Disable Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Trạng thái tích hợp</CardTitle>
          <CardDescription>Bật/tắt đồng bộ với PKGX</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Bật tích hợp PKGX</p>
              <p className="text-sm text-muted-foreground">Cho phép đồng bộ sản phẩm với website</p>
            </div>
            <Switch checked={settings?.enabled ?? false} onCheckedChange={(checked) => setEnabled.mutate(checked)} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Bật Auto Sync</p>
              <p className="text-sm text-muted-foreground">Tự động đồng bộ dữ liệu theo lịch</p>
            </div>
            <Switch 
              checked={settings?.syncSettings.autoSyncEnabled ?? false} 
              onCheckedChange={(checked) => updateSyncSetting.mutate({ key: 'autoSyncEnabled', value: checked })} 
            />
          </div>
          
          {/* Default Branch for PKGX Inventory Sync */}
          <div className="space-y-2 pt-2 border-t">
            <div>
              <p className="font-medium">Kho đồng bộ tồn kho PKGX</p>
              <p className="text-sm text-muted-foreground">Chọn kho để lấy số lượng tồn kho khi đồng bộ lên PKGX</p>
            </div>
            <Select
              value={settings?.defaultBranchId || 'all'}
              onValueChange={(value) => setDefaultBranchId.mutate(value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-full sm:w-70">
                <SelectValue placeholder="Chọn kho..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tổng tất cả chi nhánh</SelectItem>
                {branches?.map((branch) => (
                  <SelectItem key={branch.systemId} value={branch.systemId}>
                    {branch.name} {branch.isDefault ? '(Mặc định)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{settings?.categories.length ?? 0}</p>
              <p className="text-sm text-muted-foreground">Danh mục PKGX</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{settings?.brands.length ?? 0}</p>
              <p className="text-sm text-muted-foreground">Thương hiệu PKGX</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{settings?.categoryMappings.length ?? 0}</p>
              <p className="text-sm text-muted-foreground">Mapping danh mục</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{settings?.brandMappings.length ?? 0}</p>
              <p className="text-sm text-muted-foreground">Mapping thương hiệu</p>
            </div>
          </div>
          {settings?.lastSyncAt && (
            <p className="text-sm text-muted-foreground mt-4">
              Lần sync cuối: {new Date(settings.lastSyncAt).toLocaleString('vi-VN')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
