/**
 * J&T Express Configuration Form
 * 
 * Credentials cần:
 * - Username (từ dashboard J&T)
 * - API Key (từ dashboard J&T)
 * - Key (signing key cho signature MD5+Base64)
 * - EC Company ID (cho tracking)
 * - API URLs (Order, Tracking, Tariff - từ dashboard)
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { ShippingConfig, PartnerAccount } from '@/lib/types/shipping-config';
import { addPartnerAccount, updatePartnerAccount } from '@/lib/utils/shipping-config-migration';
import { getBaseUrl } from '@/lib/api-config';
import { toast } from 'sonner';

interface JNTConfigFormProps {
  config: ShippingConfig;
  account?: PartnerAccount | undefined;
  onAccountUpdate: (account: PartnerAccount) => void;
  onSave: (config: ShippingConfig) => void;
  onClose: () => void;
}

export function JNTConfigForm({
  config,
  account,
  onAccountUpdate: _onAccountUpdate,
  onSave,
  onClose,
}: JNTConfigFormProps) {
  const isEditMode = !!account;

  // Account fields
  const [accountName, setAccountName] = useState(account?.name || 'Tài khoản J&T 1');
  const [active, setActive] = useState(account?.active ?? true);

  // J&T credentials
  const [username, setUsername] = useState((account?.credentials?.username as string) || '');
  const [apiKey, setApiKey] = useState((account?.credentials?.apiKey as string) || '');
  const [signingKey, setSigningKey] = useState((account?.credentials?.signingKey as string) || '');
  const [eccompanyid, setEccompanyid] = useState((account?.credentials?.eccompanyid as string) || '');

  // J&T API URLs (from J&T dashboard - different per partner)
  const [orderUrl, setOrderUrl] = useState((account?.credentials?.orderUrl as string) || '');
  const [trackingUrl, setTrackingUrl] = useState((account?.credentials?.trackingUrl as string) || '');
  const [trackingPassword, setTrackingPassword] = useState((account?.credentials?.trackingPassword as string) || '');

  // UI state
  const [showKey, setShowKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (!accountName.trim()) newErrors.push('Vui lòng nhập tên tài khoản');
    if (!username.trim()) newErrors.push('Vui lòng nhập Username');
    if (!apiKey.trim()) newErrors.push('Vui lòng nhập API Key');
    if (!signingKey.trim()) newErrors.push('Vui lòng nhập Key (signing key)');
    if (!orderUrl.trim()) newErrors.push('Vui lòng nhập API URL (Order endpoint)');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const testConnection = async () => {
    if (!username.trim() || !apiKey.trim() || !signingKey.trim() || !orderUrl.trim()) {
      setErrors(['Vui lòng nhập đầy đủ Username, API Key, Key và API URL trước khi test kết nối']);
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/shipping/jnt/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          api_key: apiKey.trim(),
          key: signingKey.trim(),
          apiUrl: orderUrl.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setConnectionStatus('success');
        setErrors([]);
      } else {
        setConnectionStatus('error');
        setErrors([result.message || result.error || 'Không thể kết nối với J&T API']);
      }
    } catch (_error) {
      setConnectionStatus('error');
      setErrors(['Lỗi kết nối server']);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const credentials = {
      username: username.trim(),
      apiKey: apiKey.trim(),
      signingKey: signingKey.trim(),
      eccompanyid: eccompanyid.trim(),
      orderUrl: orderUrl.trim(),
      trackingUrl: trackingUrl.trim(),
      trackingPassword: trackingPassword.trim(),
    };

    let updatedConfig: ShippingConfig;

    if (isEditMode && account) {
      updatedConfig = updatePartnerAccount(config, 'J&T', account.id, {
        name: accountName.trim(),
        active,
        credentials,
      });
    } else {
      updatedConfig = addPartnerAccount(config, 'J&T', {
        name: accountName.trim(),
        active,
        isDefault: config.partners['J&T'].accounts.length === 0,
        credentials,
        pickupAddresses: [],
      });
    }

    onSave(updatedConfig);
    toast.success(isEditMode ? 'Cập nhật tài khoản J&T thành công' : 'Thêm tài khoản J&T thành công');
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {errors.length > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 pb-4 overflow-y-auto flex-1">
        {/* Account Name */}
        <div className="space-y-2">
          <Label htmlFor="jnt-accountName">Tên tài khoản *</Label>
          <Input
            id="jnt-accountName"
            value={accountName}
            onChange={e => setAccountName(e.target.value)}
            placeholder="Tài khoản J&T 1"
          />
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="jnt-username">Username *</Label>
          <Input
            id="jnt-username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username từ J&T dashboard"
          />
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <Label htmlFor="jnt-apiKey">API Key *</Label>
          <Input
            id="jnt-apiKey"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="API Key từ J&T dashboard"
          />
        </div>

        {/* Signing Key */}
        <div className="space-y-2">
          <Label htmlFor="jnt-key">Key (Signing Key) *</Label>
          <div className="relative">
            <Input
              id="jnt-key"
              type={showKey ? 'text' : 'password'}
              value={signingKey}
              onChange={e => setSigningKey(e.target.value)}
              placeholder="Key dùng để ký chữ ký MD5"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Key dùng để tạo chữ ký (signature) cho mỗi request API
          </p>
        </div>

        {/* EC Company ID */}
        <div className="space-y-2">
          <Label htmlFor="jnt-eccompanyid">EC Company ID</Label>
          <Input
            id="jnt-eccompanyid"
            value={eccompanyid}
            onChange={e => setEccompanyid(e.target.value)}
            placeholder="Company ID (dùng cho tracking)"
          />
          <p className="text-xs text-muted-foreground">
            Dùng cho API tracking. Xem trên J&T dashboard.
          </p>
        </div>

        {/* API URLs Section */}
        <div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            API Endpoints
          </h4>
          <p className="text-xs text-muted-foreground">
            URL endpoints được cung cấp trên J&T dashboard sau khi đăng ký. Mỗi đối tác có URL riêng.
          </p>

          {/* Order URL */}
          <div className="space-y-2">
            <Label htmlFor="jnt-orderUrl">Order API URL *</Label>
            <Input
              id="jnt-orderUrl"
              value={orderUrl}
              onChange={e => setOrderUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Tracking URL */}
          <div className="space-y-2">
            <Label htmlFor="jnt-trackingUrl">Tracking API URL</Label>
            <Input
              id="jnt-trackingUrl"
              value={trackingUrl}
              onChange={e => setTrackingUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Tracking Password (Basic Auth) */}
          <div className="space-y-2">
            <Label htmlFor="jnt-trackingPassword">Tracking Password</Label>
            <div className="relative">
              <Input
                id="jnt-trackingPassword"
                type={showPassword ? 'text' : 'password'}
                value={trackingPassword}
                onChange={e => setTrackingPassword(e.target.value)}
                placeholder="Password cho Basic Auth tracking"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Dùng cho Basic Authorization khi gọi Tracking API
            </p>
          </div>
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="jnt-active">Kích hoạt</Label>
          <Switch
            id="jnt-active"
            checked={active}
            onCheckedChange={setActive}
          />
        </div>

        {/* Test Connection */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={testConnection}
            disabled={isTestingConnection || !username.trim() || !apiKey.trim() || !signingKey.trim() || !orderUrl.trim()}
          >
            {isTestingConnection && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isTestingConnection ? 'Đang kiểm tra...' : 'Test kết nối'}
          </Button>

          {connectionStatus === 'success' && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Đã kết nối
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Kết nối thất bại
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t mt-4 shrink-0">
        <Button variant="outline" onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave}>Lưu</Button>
      </div>
    </div>
  );
}
