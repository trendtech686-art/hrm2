# Implementation Plan: Cập Nhật Hệ Thống Vận Chuyển Theo Sapo

> **Ngày bắt đầu**: 29/10/2025  
> **Dựa trên**: Phân tích Sapo Production System  
> **Mục tiêu**: 100% feature parity với Sapo shipping configuration

---

## 🎯 Overview

**Hiện trạng:**
- ✅ Đã có: Partner connections grid, API token config, show/hide token
- ❌ Thiếu: Multi-account, services config, pickup addresses, global config

**Target:**
- 🎯 Phase 1 (Sprint 1): Core features - Multi-account + Services + Pickup addresses
- 🎯 Phase 2 (Sprint 2): Global shipping config tab
- 🎯 Phase 3 (Sprint 3): Advanced features - No-delivery zones, auto-sync

---

## 📦 Phase 1: Core Features (Week 1-2)

### Task 1.1: Data Structure Migration ⏱️ 2 hours

**File**: `lib/types/shipping-config.ts` (NEW)

```typescript
// ==================== TYPES ====================

export type PaymentBy = 'SHOP' | 'CUSTOMER';
export type TransportType = 'ROAD' | 'AIR';
export type PickupMethod = 'AT_WAREHOUSE' | 'AT_POST_OFFICE';

// GHN Services
export interface GHNServices {
  insurance: boolean;
  partialDelivery: boolean;
  collectFeedback: boolean;
  collectOnFailure: boolean;
}

// GHTK Services
export interface GHTKServices {
  expectedDelivery: string;
  schedulePickup: string;
  transportType: TransportType;
  pickupAtPostOffice: boolean;
  inspection: boolean;
  intactPackage: boolean;
  partialReturn: boolean;
  cancelFee: boolean;
  freshFood: boolean;
  highValueRequirement: boolean;
  fragileItem: boolean;
  bulkyItem: boolean;
  callOnIssue: boolean;
  noXRay: boolean;
}

// VTP Services
export interface VTPServices {
  insurance: boolean;
  inspection: boolean;
  deliverAtBranch: boolean;
  pickupAtPostOffice: boolean;
  highValue: boolean;
  coldChain: boolean;
  returnOutbound: boolean;
  returnInbound: boolean;
  returnBothWays: boolean;
  deliverInPerson: boolean;
  tryBeforeBuy: boolean;
}

// J&T Services
export interface JNTServices {
  insurance: boolean;
  partialDelivery: boolean;
  pickupAtPostOffice: boolean;
}

// SPX Services
export interface SPXServices {
  rejectFee: boolean;
  pickupAtPostOffice: boolean;
}

// Pickup Address
export interface PickupAddress {
  id: string;
  sapoBranchId: string;
  sapoBranchName: string;
  sapoPhone: string;
  sapoAddress: string;
  sapoProvince?: string;
  sapoDistrict?: string;
  sapoWard?: string;
  partnerWarehouseId?: string;
  partnerWarehouseName?: string;
}

// Partner Account (Generic)
export interface PartnerAccount<TServices = any> {
  id: string;
  name: string;
  active: boolean;
  isDefault: boolean;
  
  // Auth credentials (partner-specific)
  credentials: {
    [key: string]: string; // apiToken, email, customerId, etc.
  };
  
  // Payment config
  paymentBy?: PaymentBy;
  paymentMethod?: string; // For J&T dropdown
  
  // Services (partner-specific)
  services?: TServices;
  
  // Pickup method (GHN)
  pickupMethod?: PickupMethod;
  
  // Referral email (optional)
  referralEmail?: string;
  
  // Pickup addresses mapping
  pickupAddresses: PickupAddress[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Config for each partner
export interface GHNAccount extends PartnerAccount<GHNServices> {
  credentials: {
    apiToken: string;
    shopId?: string;
  };
}

export interface GHTKAccount extends PartnerAccount<GHTKServices> {
  credentials: {
    email: string;
  };
}

export interface VTPAccount extends PartnerAccount<VTPServices> {
  credentials: {
    accountName: string;
    email: string;
    phone: string;
  };
}

export interface JNTAccount extends PartnerAccount<JNTServices> {
  credentials: {
    customerId: string;
  };
}

export interface SPXAccount extends PartnerAccount<SPXServices> {
  credentials: {
    userId: string;
    secretKey: string;
  };
}

// Full shipping config
export interface ShippingPartnersConfig {
  GHN: {
    accounts: GHNAccount[];
  };
  GHTK: {
    accounts: GHTKAccount[];
  };
  VTP: {
    accounts: VTPAccount[];
  };
  'J&T': {
    accounts: JNTAccount[];
  };
  SPX: {
    accounts: SPXAccount[];
  };
  VNPOST: {
    accounts: PartnerAccount[];
  };
  NINJA_VAN: {
    accounts: PartnerAccount[];
  };
  AHAMOVE: {
    accounts: PartnerAccount[];
  };
}

// Global shipping config
export interface GlobalShippingConfig {
  weight: {
    mode: 'FROM_PRODUCTS' | 'CUSTOM';
    customValue?: number; // gram
  };
  dimensions: {
    length?: number; // cm
    width?: number;
    height?: number;
  };
  requirement: string; // dropdown value
  note?: string;
  
  autoSyncCancelStatus: boolean;
  autoSyncCODCollection: boolean;
  latePickupWarningDays?: number;
  lateDeliveryWarningDays?: number;
  
  noDeliveryZones: NoDeliveryZone[];
}

export interface NoDeliveryZone {
  id: string;
  province: string;
  district?: string;
  ward?: string;
  enabled: boolean;
}

// Full config structure
export interface ShippingConfig {
  version: 2;
  partners: ShippingPartnersConfig;
  global: GlobalShippingConfig;
  lastUpdated: string;
}
```

**Checklist:**
- [ ] Create `lib/types/shipping-config.ts`
- [ ] Define all types
- [ ] Export from `lib/types/index.ts`

---

### Task 1.2: Migration Utility ⏱️ 3 hours

**File**: `lib/utils/shipping-config-migration.ts` (NEW)

```typescript
import { ShippingConfig, PartnerAccount } from '@/lib/types/shipping-config';

const STORAGE_KEY_V1 = 'shipping_partners_config';
const STORAGE_KEY_V2 = 'shipping_partners_config_v2';

/**
 * Migrate from V1 to V2 structure
 */
export function migrateShippingConfig(): ShippingConfig {
  const v1Data = localStorage.getItem(STORAGE_KEY_V1);
  
  if (!v1Data) {
    return getDefaultShippingConfig();
  }
  
  try {
    const v1Config = JSON.parse(v1Data);
    const v2Config: ShippingConfig = {
      version: 2,
      partners: {
        GHN: { accounts: [] },
        GHTK: { accounts: [] },
        VTP: { accounts: [] },
        'J&T': { accounts: [] },
        SPX: { accounts: [] },
        VNPOST: { accounts: [] },
        NINJA_VAN: { accounts: [] },
        AHAMOVE: { accounts: [] },
      },
      global: getDefaultGlobalConfig(),
      lastUpdated: new Date().toISOString(),
    };
    
    // Migrate each partner
    Object.keys(v1Config).forEach(partnerCode => {
      const v1Partner = v1Config[partnerCode];
      
      if (v1Partner && v1Partner.apiToken) {
        const account: PartnerAccount = {
          id: `acc_${Date.now()}`,
          name: 'Tài khoản 1',
          active: v1Partner.active ?? false,
          isDefault: true,
          credentials: {
            apiToken: v1Partner.apiToken,
            ...(v1Partner.partnerCode && { partnerCode: v1Partner.partnerCode }),
          },
          pickupAddresses: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        v2Config.partners[partnerCode]?.accounts.push(account);
      }
    });
    
    // Save V2 config
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(v2Config));
    
    return v2Config;
  } catch (error) {
    console.error('Migration failed:', error);
    return getDefaultShippingConfig();
  }
}

/**
 * Get default config
 */
function getDefaultShippingConfig(): ShippingConfig {
  return {
    version: 2,
    partners: {
      GHN: { accounts: [] },
      GHTK: { accounts: [] },
      VTP: { accounts: [] },
      'J&T': { accounts: [] },
      SPX: { accounts: [] },
      VNPOST: { accounts: [] },
      NINJA_VAN: { accounts: [] },
      AHAMOVE: { accounts: [] },
    },
    global: getDefaultGlobalConfig(),
    lastUpdated: new Date().toISOString(),
  };
}

function getDefaultGlobalConfig() {
  return {
    weight: {
      mode: 'FROM_PRODUCTS' as const,
      customValue: 500,
    },
    dimensions: {
      length: 30,
      width: 20,
      height: 10,
    },
    requirement: 'ALLOW_CHECK_NOT_TRY',
    note: '',
    autoSyncCancelStatus: false,
    autoSyncCODCollection: false,
    latePickupWarningDays: 2,
    lateDeliveryWarningDays: 7,
    noDeliveryZones: [],
  };
}

/**
 * Save shipping config
 */
export function saveShippingConfig(config: ShippingConfig) {
  config.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(config));
}

/**
 * Load shipping config
 */
export function loadShippingConfig(): ShippingConfig {
  const v2Data = localStorage.getItem(STORAGE_KEY_V2);
  
  if (v2Data) {
    try {
      return JSON.parse(v2Data);
    } catch {
      // Fall through to migration
    }
  }
  
  // Try migration from V1
  return migrateShippingConfig();
}
```

**Checklist:**
- [ ] Create migration utility
- [ ] Test V1 → V2 migration
- [ ] Add unit tests

---

### Task 1.3: Update Partner Dialog - Add Tabs ⏱️ 4 hours

**File**: `features/settings/shipping-partners/partner-config-dialog.tsx` (NEW)

```tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PartnerInfoTab } from './tabs/partner-info-tab';
import { PickupAddressesTab } from './tabs/pickup-addresses-tab';

interface PartnerConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerCode: string;
  partnerName: string;
  accountId?: string; // For editing existing account
}

export function PartnerConfigDialog({
  open,
  onOpenChange,
  partnerCode,
  partnerName,
  accountId,
}: PartnerConfigDialogProps) {
  const [activeTab, setActiveTab] = useState('info');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Cấu hình {partnerName}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">
              Cài đặt thông tin chung
            </TabsTrigger>
            <TabsTrigger value="addresses">
              Địa chỉ lấy hàng
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-6">
            <PartnerInfoTab
              partnerCode={partnerCode}
              accountId={accountId}
              onSuccess={() => {
                // Optionally switch to addresses tab
              }}
            />
          </TabsContent>
          
          <TabsContent value="addresses" className="mt-6">
            <PickupAddressesTab
              partnerCode={partnerCode}
              accountId={accountId}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
```

**Checklist:**
- [ ] Create dialog component with tabs
- [ ] Create tab components structure
- [ ] Add to partner-connections.tsx

---

### Task 1.4: Partner Info Tab - Dynamic Forms ⏱️ 8 hours

**File**: `features/settings/shipping-partners/tabs/partner-info-tab.tsx` (NEW)

```tsx
import { GHNConfigForm } from '../forms/ghn-config-form';
import { GHTKConfigForm } from '../forms/ghtk-config-form';
import { VTPConfigForm } from '../forms/vtp-config-form';
import { JNTConfigForm } from '../forms/jnt-config-form';
import { SPXConfigForm } from '../forms/spx-config-form';

export function PartnerInfoTab({ partnerCode, accountId }: Props) {
  const renderForm = () => {
    switch (partnerCode) {
      case 'GHN':
        return <GHNConfigForm accountId={accountId} />;
      case 'GHTK':
        return <GHTKConfigForm accountId={accountId} />;
      case 'VTP':
        return <VTPConfigForm accountId={accountId} />;
      case 'J&T':
        return <JNTConfigForm accountId={accountId} />;
      case 'SPX':
        return <SPXConfigForm accountId={accountId} />;
      default:
        return <GenericConfigForm partnerCode={partnerCode} accountId={accountId} />;
    }
  };
  
  return (
    <div className="space-y-6">
      {renderForm()}
    </div>
  );
}
```

**Individual forms** (create 5 files):

1. `ghn-config-form.tsx` - GHN specific form
2. `ghtk-config-form.tsx` - GHTK with 11 checkboxes
3. `vtp-config-form.tsx` - VTP with 12 services
4. `jnt-config-form.tsx` - J&T with payment dropdown
5. `spx-config-form.tsx` - SPX with User ID + Secret Key

**Checklist:**
- [ ] Create forms folder structure
- [ ] Implement GHN form (4 services)
- [ ] Implement GHTK form (11 services + transport)
- [ ] Implement VTP form (12 services)
- [ ] Implement J&T form (3 services + dropdown)
- [ ] Implement SPX form (2 services)
- [ ] Add form validation with zod
- [ ] Connect to save/load functions

---

### Task 1.5: Pickup Addresses Tab ⏱️ 6 hours

**File**: `features/settings/shipping-partners/tabs/pickup-addresses-tab.tsx` (NEW)

```tsx
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function PickupAddressesTab({ partnerCode, accountId }: Props) {
  const [addresses, setAddresses] = useState<PickupAddress[]>([]);
  
  return (
    <div className="space-y-6">
      {/* Warning box */}
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertDescription>
          <strong>Lưu ý</strong>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>
              Nếu bạn có nhiều cửa hàng (Địa điểm lấy hàng), bạn cần tạo thêm 
              địa chỉ người gửi tương ứng trên tài khoản {partnerName} để liên kết với Sapo.
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Thêm mới địa chỉ người gửi trên {partnerName} tại đây
              </a>
            </li>
          </ul>
        </AlertDescription>
      </Alert>
      
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chi nhánh Sapo</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Địa chỉ lấy hàng</TableHead>
            <TableHead>Kho {partnerName}</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((addr) => (
            <TableRow key={addr.id}>
              <TableCell>{addr.sapoBranchName}</TableCell>
              <TableCell>{addr.sapoPhone}</TableCell>
              <TableCell className="max-w-xs truncate">
                {addr.sapoAddress}
              </TableCell>
              <TableCell>
                <Select
                  value={addr.partnerWarehouseId}
                  onValueChange={(value) => updateWarehouse(addr.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Chọn kho</SelectItem>
                    {/* Load from partner API */}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editAddress(addr.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAddress(addr.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Button onClick={addNewAddress}>
        + Thêm địa chỉ lấy hàng
      </Button>
    </div>
  );
}
```

**Checklist:**
- [ ] Create pickup addresses table
- [ ] Implement CRUD operations
- [ ] Add warehouse selector (dropdown)
- [ ] Add warning box with links
- [ ] Test with multi-branch scenario

---

## 📦 Phase 2: Global Shipping Config (Week 3)

### Task 2.1: Add Global Config Tab ⏱️ 6 hours

**File**: Update `features/settings/shipping-partners/page.tsx`

Add new tab "Cấu hình chung" between "Kết nối đối tác" and "Phí vận chuyển"

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="connections">Kết nối đối tác</TabsTrigger>
    <TabsTrigger value="config">Cấu hình chung</TabsTrigger>
    <TabsTrigger value="fees">Phí vận chuyển</TabsTrigger>
  </TabsList>
  
  <TabsContent value="config">
    <GlobalShippingConfig />
  </TabsContent>
</Tabs>
```

**Checklist:**
- [ ] Add new tab to page
- [ ] Create GlobalShippingConfig component
- [ ] Update routing if needed

---

### Task 2.2: Shipping Info Section ⏱️ 4 hours

**File**: `features/settings/shipping-partners/global-shipping-config.tsx` (NEW)

```tsx
export function GlobalShippingConfig() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin giao hàng</CardTitle>
          <CardDescription>
            Thiết lập mặc định thông tin giao hàng khi gửi hàng sang ĐVVC tích hợp 
            và shipper tự tạo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weight */}
          <div className="space-y-3">
            <Label>Khối lượng *</Label>
            <RadioGroup value={weightMode} onValueChange={setWeightMode}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FROM_PRODUCTS" id="weight-products" />
                <Label htmlFor="weight-products">
                  Theo sản phẩm trong đơn hàng
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="CUSTOM" id="weight-custom" />
                <Label htmlFor="weight-custom">Tùy chỉnh</Label>
                <Input
                  type="number"
                  placeholder="gram"
                  disabled={weightMode !== 'CUSTOM'}
                  className="w-32"
                />
              </div>
            </RadioGroup>
          </div>
          
          {/* Dimensions */}
          <div className="space-y-3">
            <Label>Kích thước *</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length">Dài *</Label>
                <Input id="length" type="number" placeholder="cm" />
              </div>
              <div>
                <Label htmlFor="width">Rộng *</Label>
                <Input id="width" type="number" placeholder="cm" />
              </div>
              <div>
                <Label htmlFor="height">Cao *</Label>
                <Input id="height" type="number" placeholder="cm" />
              </div>
            </div>
          </div>
          
          {/* Requirement */}
          <div className="space-y-2">
            <Label htmlFor="requirement">Yêu cầu</Label>
            <Select>
              <SelectTrigger id="requirement">
                <SelectValue placeholder="Chọn yêu cầu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALLOW_CHECK_NOT_TRY">
                  Cho xem hàng, không cho thử
                </SelectItem>
                <SelectItem value="ALLOW_TRY">
                  Cho thử hàng
                </SelectItem>
                <SelectItem value="NO_CHECK">
                  Không cho xem hàng
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              placeholder="Nhập ghi chú vận chuyển"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Thiết lập giao nhận hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Content for task 2.3 */}
        </CardContent>
      </Card>
    </div>
  );
}
```

**Checklist:**
- [ ] Weight configuration (radio + input)
- [ ] Dimensions (3 inputs)
- [ ] Requirement dropdown
- [ ] Note textarea
- [ ] Form validation
- [ ] Save to localStorage

---

### Task 2.3: Shipping Setup Section ⏱️ 3 hours

Add to `GlobalShippingConfig` component:

```tsx
<CardContent className="space-y-6">
  <p className="text-sm text-muted-foreground">
    Kết nối các đối tác vận chuyển để tự động gửi yêu cầu giao hàng cho các 
    đối tác vận chuyển và nhận cập nhật trạng thái vận đơn ngay trên Sapo.
  </p>
  
  {/* Auto sync toggles */}
  <div className="space-y-4">
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <Label>Tự động đồng bộ trạng thái "Hủy giao - đã nhận" với đơn vị vận chuyển</Label>
      </div>
      <Switch checked={autoSyncCancel} onCheckedChange={setAutoSyncCancel} />
    </div>
    
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <Label>Tự động đồng bộ tiền thu hộ từ đối tác vận chuyển</Label>
      </div>
      <Switch checked={autoSyncCOD} onCheckedChange={setAutoSyncCOD} />
    </div>
  </div>
  
  {/* Warning days */}
  <div className="space-y-4">
    <div>
      <Label htmlFor="late-pickup">Cấu hình số ngày cảnh báo lấy trễ</Label>
      <Input
        id="late-pickup"
        type="number"
        placeholder="Nhập số ngày"
        className="mt-2"
      />
    </div>
    
    <div>
      <Label htmlFor="late-delivery">Cấu hình số ngày cảnh báo giao trễ</Label>
      <Input
        id="late-delivery"
        type="number"
        placeholder="Nhập số ngày"
        className="mt-2"
      />
    </div>
  </div>
  
  {/* Links */}
  <div className="space-y-2">
    <a href="/settings/shipping/no-delivery-zones" className="text-blue-600 hover:underline block">
      Cấu hình khu vực không giao hàng
    </a>
    <a href="/settings/shipping/pickup-addresses" className="text-blue-600 hover:underline block">
      Cấu hình địa chỉ lấy hàng
    </a>
  </div>
</CardContent>
```

**Checklist:**
- [ ] Auto sync toggles (2)
- [ ] Warning days inputs (2)
- [ ] Links to other pages
- [ ] Save functionality

---

## 📦 Phase 3: Advanced Features (Week 4)

### Task 3.1: Multi-Account Support ⏱️ 8 hours

Update partner cards to show account selector:

```tsx
// In partner-connections.tsx

{partner.accounts.length > 1 && (
  <Select value={selectedAccountId}>
    <SelectTrigger className="mb-3">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {partner.accounts.map(acc => (
        <SelectItem key={acc.id} value={acc.id}>
          {acc.name}
          {acc.isDefault && ' (Mặc định)'}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)}

<Button onClick={addNewAccount}>
  + Thêm tài khoản
</Button>
```

**Checklist:**
- [ ] Account selector dropdown
- [ ] "Thêm tài khoản" button
- [ ] Default account badge
- [ ] Switch between accounts
- [ ] Delete account (if not default)

---

### Task 3.2: No-Delivery Zones Page ⏱️ 6 hours

**File**: `features/settings/shipping-partners/no-delivery-zones/page.tsx` (NEW)

```tsx
export default function NoDeliveryZonesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Khu vực không giao hàng</h2>
        <p className="text-muted-foreground">
          Cấu hình các khu vực không hỗ trợ giao hàng
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {/* Province/District/Ward selector */}
          {/* Enable/Disable toggle */}
          {/* List of configured zones */}
        </CardContent>
      </Card>
    </div>
  );
}
```

**Checklist:**
- [ ] Create page
- [ ] Province/District/Ward cascade selector
- [ ] Add/Remove zones
- [ ] Enable/Disable toggle per zone
- [ ] Save to global config

---

## ✅ Testing Checklist

### Unit Tests
- [ ] Migration utility tests
- [ ] Form validation tests
- [ ] Save/Load config tests

### Integration Tests
- [ ] V1 → V2 migration flow
- [ ] Create new account
- [ ] Edit existing account
- [ ] Switch between accounts
- [ ] Pickup address CRUD
- [ ] Global config save/load

### E2E Tests
- [ ] Full partner setup flow (GHN)
- [ ] Multi-account scenario (GHTK)
- [ ] Pickup address mapping
- [ ] Global config update

---

## 📊 Progress Tracking

### Week 1-2: Core Features
- [ ] Task 1.1: Data structure (2h)
- [ ] Task 1.2: Migration (3h)
- [ ] Task 1.3: Dialog tabs (4h)
- [ ] Task 1.4: Dynamic forms (8h)
- [ ] Task 1.5: Pickup addresses (6h)

**Total:** 23 hours

### Week 3: Global Config
- [ ] Task 2.1: Add tab (6h)
- [ ] Task 2.2: Shipping info (4h)
- [ ] Task 2.3: Shipping setup (3h)

**Total:** 13 hours

### Week 4: Advanced
- [ ] Task 3.1: Multi-account (8h)
- [ ] Task 3.2: No-delivery zones (6h)

**Total:** 14 hours

### **Grand Total: 50 hours (≈ 1.5 months với 1 dev)**

---

## 🚀 Deployment Plan

### Phase 1 Release (After Week 2)
- New dialog with tabs
- Partner-specific services
- Pickup addresses management
- V1 → V2 migration

### Phase 2 Release (After Week 3)
- Global shipping config tab
- Auto-sync toggles
- Warning days configuration

### Phase 3 Release (After Week 4)
- Multi-account per partner
- No-delivery zones
- Full Sapo parity

---

## 📝 Notes

- **Backward compatibility:** Keep V1 config in localStorage until confirmed migration success
- **Testing:** Test with real API tokens for GHN, GHTK, VTP
- **Documentation:** Update all docs after each phase
- **Performance:** Lazy load partner warehouses from APIs
- **UX:** Add loading states, error handling, success toasts

---

*Implementation plan created by AI Assistant - 29/10/2025*
