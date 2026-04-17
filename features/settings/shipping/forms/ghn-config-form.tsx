/**
 * GHN (Giao Hàng Nhanh) Configuration Form
 * 
 * Credentials cần:
 * - Token (từ dashboard GHN)
 * - Shop ID (từ dashboard GHN)
 * - Environment: Staging (dev) / Production
 *
 * GHN auth đơn giản: Token header + ShopId header
 * Staging: 5sao.ghn.dev | Production: khachhang.ghn.vn
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { ShippingConfig, PartnerAccount } from '@/lib/types/shipping-config';
import { addPartnerAccount, updatePartnerAccount } from '@/lib/utils/shipping-config-migration';
import { getBaseUrl } from '@/lib/api-config';
import { toast } from 'sonner';

interface GHNConfigFormProps {
  config: ShippingConfig;
  account?: PartnerAccount | undefined;
  onAccountUpdate: (account: PartnerAccount) => void;
  onSave: (config: ShippingConfig) => void;
  onClose: () => void;
}

export function GHNConfigForm({
  config,
  account,
  onAccountUpdate: _onAccountUpdate,
  onSave,
  onClose,
}: GHNConfigFormProps) {
  const isEditMode = !!account;

  // Account fields
  const [accountName, setAccountName] = useState(account?.name || 'Tài khoản GHN 1');
  const [active, setActive] = useState(account?.active ?? true);

  // GHN credentials
  const [token, setToken] = useState((account?.credentials?.token as string) || '');
  const [shopId, setShopId] = useState((account?.credentials?.shopId as string) || '');
  const [environment, setEnvironment] = useState<'staging' | 'production'>(
    (account?.credentials?.environment as 'staging' | 'production') || 'production'
  );

  // UI state
  const [showToken, setShowToken] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (!accountName.trim()) newErrors.push('Vui lòng nhập tên tài khoản');
    if (!token.trim()) newErrors.push('Vui lòng nhập Token');
    if (!shopId.trim()) newErrors.push('Vui lòng nhập Shop ID');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const testConnection = async () => {
    if (!token.trim()) {
      setErrors(['Vui lòng nhập Token trước khi test kết nối']);
      return;
    }
    if (!shopId.trim()) {
      setErrors(['Vui lòng nhập Shop ID trước khi test kết nối']);
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/shipping/ghn/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          shopId: shopId.trim() || undefined,
          environment,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setConnectionStatus('success');
        setErrors([]);
      } else {
        setConnectionStatus('error');
        setErrors([result.message || result.error || 'Không thể kết nối với GHN API']);
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
      token: token.trim(),
      shopId: shopId.trim(),
      environment,
    };

    let updatedConfig: ShippingConfig;

    if (isEditMode && account) {
      updatedConfig = updatePartnerAccount(config, 'GHN', account.id, {
        name: accountName.trim(),
        active,
        credentials,
      });
    } else {
      updatedConfig = addPartnerAccount(config, 'GHN', {
        name: accountName.trim(),
        active,
        isDefault: config.partners['GHN'].accounts.length === 0,
        credentials,
        pickupAddresses: [],
      });
    }

    onSave(updatedConfig);
    toast.success(isEditMode ? 'Cập nhật tài khoản GHN thành công' : 'Thêm tài khoản GHN thành công');
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
          <Label htmlFor="ghn-accountName">Tên tài khoản *</Label>
          <Input
            id="ghn-accountName"
            value={accountName}
            onChange={e => setAccountName(e.target.value)}
            placeholder="Tài khoản GHN 1"
          />
        </div>

        {/* Environment */}
        <div className="space-y-2">
          <Label htmlFor="ghn-environment">Môi trường</Label>
          <Select value={environment} onValueChange={(v) => setEnvironment(v as 'staging' | 'production')}>
            <SelectTrigger id="ghn-environment" className="focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production (khachhang.ghn.vn)</SelectItem>
              <SelectItem value="staging">Staging / Test (5sao.ghn.dev)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Dùng Staging để test trước khi chuyển sang Production
          </p>
        </div>

        {/* Token */}
        <div className="space-y-2">
          <Label htmlFor="ghn-token">Token *</Label>
          <div className="relative">
            <Input
              id="ghn-token"
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Token từ GHN dashboard"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Lấy Token tại: Dashboard GHN → Tab &quot;Chủ cửa hàng&quot; → Nút &quot;Xem&quot;
          </p>
        </div>

        {/* Shop ID */}
        <div className="space-y-2">
          <Label htmlFor="ghn-shopId">Shop ID *</Label>
          <Input
            id="ghn-shopId"
            value={shopId}
            onChange={e => setShopId(e.target.value)}
            placeholder="Shop ID từ GHN dashboard"
          />
          <p className="text-xs text-muted-foreground">
            Mã cửa hàng trên hệ thống GHN. Xem tại Dashboard → Quản lý cửa hàng.
          </p>
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="ghn-active">Kích hoạt</Label>
          <Switch
            id="ghn-active"
            checked={active}
            onCheckedChange={setActive}
          />
        </div>

        {/* Test Connection */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={testConnection}
            disabled={isTestingConnection || !token.trim()}
          >
            {isTestingConnection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test kết nối
          </Button>
          {connectionStatus === 'success' && (
            <span className="text-sm text-green-600 dark:text-green-400">
              ✓ Kết nối thành công
            </span>
          )}
          {connectionStatus === 'error' && (
            <span className="text-sm text-red-600 dark:text-red-400">
              ✗ Kết nối thất bại
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={handleSave}>
          {isEditMode ? 'Cập nhật' : 'Thêm tài khoản'}
        </Button>
      </div>
    </div>
  );
}
