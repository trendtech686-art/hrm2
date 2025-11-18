/**
 * GHTK Configuration Form - V2 Multi-Account
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { ShippingConfig, PartnerAccount, PickupAddress } from '@/lib/types/shipping-config';
import { addPartnerAccount, updatePartnerAccount } from '@/lib/utils/shipping-config-migration';
import { PickupAddressesTab } from '../components/pickup-addresses-tab';
import { GHTKDefaultSettingsTab, GHTKDefaultSettingsTabRef } from '../components/ghtk-default-settings-tab';
import { getBaseUrl } from '@/lib/api-config';
import { toast } from 'sonner';

interface BranchMapping {
  branchId: string;
  warehouseId: string;
}

interface GHTKConfigFormProps {
  config: ShippingConfig;
  account?: PartnerAccount;
  onAccountUpdate: (account: PartnerAccount) => void;
  onSave: (config: ShippingConfig) => void;
  onClose: () => void;
}

export function GHTKConfigForm({
  config,
  account,
  onAccountUpdate,
  onSave,
  onClose,
}: GHTKConfigFormProps) {
  const isEditMode = !!account;
  
  const [accountName, setAccountName] = useState(account?.name || 'Tài khoản GHTK 1');
  const [apiToken, setApiToken] = useState(account?.credentials?.apiToken || '');
  const [partnerCode, setPartnerCode] = useState(account?.credentials?.partnerCode || 'GHTK');
  const [showToken, setShowToken] = useState(false);
  const [active, setActive] = useState(account?.active ?? true);
  
  const [errors, setErrors] = useState<string[]>([]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Store pickup addresses mappings from tab 2
  const pickupAddressesRef = useRef<{
    getMappings: () => BranchMapping[];
    getPickupAddresses: () => PickupAddress[];
  } | null>(null);

  // Store default settings from tab 3
  const defaultSettingsRef = useRef<GHTKDefaultSettingsTabRef | null>(null);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (!accountName.trim()) newErrors.push('Vui lòng nhập tên tài khoản');
    if (!apiToken.trim()) newErrors.push('Vui lòng nhập API Token');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const testConnection = async () => {
    if (!apiToken.trim()) {
      setErrors(['Vui lòng nhập API Token trước khi test kết nối']);
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');
    
    try {
      const token = apiToken.trim();
      const baseUrl = getBaseUrl();
      const serverUrl = `${baseUrl}/api/shipping/ghtk/test-connection?apiToken=${encodeURIComponent(token)}&partnerCode=${encodeURIComponent(partnerCode)}`;
      
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setConnectionStatus('success');
        setErrors([]);
      } else {
        setConnectionStatus('error');
        setErrors([result.message || 'Không thể kết nối với GHTK API']);
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrors(['Lỗi kết nối server']);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    console.log('[GHTKConfigForm] handleSave called');
    const isValid = validateForm();
    console.log('[GHTKConfigForm] Validation result:', isValid, 'Errors:', errors);
    if (!isValid) {
      console.log('[GHTKConfigForm] Validation failed, stopping...');
      return;
    }

    let updatedConfig: ShippingConfig;
    
    // Get pickup addresses from tab 2 (if in edit mode)
    const pickupAddresses = 
      isEditMode && pickupAddressesRef.current 
        ? pickupAddressesRef.current.getPickupAddresses()
        : [];
    
    // Get default settings from tab 3 (if in edit mode)
    const defaultSettings = 
      isEditMode && defaultSettingsRef.current
        ? defaultSettingsRef.current.getSettings()
        : undefined;
    
    if (isEditMode && account) {
      // Update existing account
      updatedConfig = updatePartnerAccount(config, 'GHTK', account.id, {
        name: accountName.trim(),
        active,
        credentials: {
          apiToken: apiToken.trim(),
          partnerCode: partnerCode.trim(),
        },
        pickupAddresses, // Use pickup addresses from tab 2
        defaultSettings, // Use default settings from tab 3
      });
    } else {
      // Add new account
      updatedConfig = addPartnerAccount(config, 'GHTK', {
        name: accountName.trim(),
        active,
        isDefault: config.partners.GHTK.accounts.length === 0, // First account is default
        credentials: {
          apiToken: apiToken.trim(),
          partnerCode: partnerCode.trim(),
        },
        pickupAddresses: [],
        defaultSettings: undefined,
      });
    }

    console.log('[GHTKConfigForm] Calling onSave with config...');
    onSave(updatedConfig);
    toast.success(isEditMode ? 'Cập nhật tài khoản thành công' : 'Thêm tài khoản mới thành công');
    console.log('[GHTKConfigForm] Calling onClose...');
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

      <Tabs defaultValue="account" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
          <TabsTrigger value="pickup-addresses" disabled={!isEditMode}>
            Địa chỉ lấy hàng
          </TabsTrigger>
          <TabsTrigger value="default-settings" disabled={!isEditMode}>
            Cài đặt mặc định
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Account Info */}
        <TabsContent value="account" className="space-y-6 pb-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Tên tài khoản *</Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                placeholder="Tài khoản GHTK 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiToken">API Token *</Label>
              <div className="relative">
                <Input
                  id="apiToken"
                  type={showToken ? 'text' : 'password'}
                  value={apiToken}
                  onChange={e => setApiToken(e.target.value)}
                  placeholder="Nhập API Token từ GHTK"
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
                Lấy từ: <a href="https://khachhang.giaohangtietkiem.vn/web/api-token" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  khachhang.giaohangtietkiem.vn
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerCode">Partner Code</Label>
              <Input
                id="partnerCode"
                value={partnerCode}
                onChange={e => setPartnerCode(e.target.value)}
                placeholder="GHTK"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Kích hoạt</Label>
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={testConnection}
              disabled={isTestingConnection || !apiToken.trim()}
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
        </TabsContent>

        {/* Tab 2: Pickup Addresses */}
        <TabsContent value="pickup-addresses" className="mt-0 flex-1 overflow-y-auto">
          {isEditMode && account ? (
            <PickupAddressesTab
              partnerCode="GHTK"
              account={account}
              onAccountUpdate={onAccountUpdate}
              getMappingsRef={(ref) => {
                pickupAddressesRef.current = ref;
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Vui lòng lưu tài khoản trước khi cấu hình địa chỉ lấy hàng
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Default Settings */}
        <TabsContent value="default-settings" className="mt-0 flex-1 overflow-y-auto">
          {isEditMode && account ? (
            <GHTKDefaultSettingsTab
              ref={defaultSettingsRef}
              initialSettings={account.defaultSettings}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Vui lòng lưu tài khoản trước khi cấu hình cài đặt mặc định
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action buttons - visible in both tabs */}
      <div className="flex justify-end gap-2 pt-4 border-t mt-4 flex-shrink-0">
        <Button variant="outline" onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave}>Lưu</Button>
      </div>
    </div>
  );
}
