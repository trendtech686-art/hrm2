/**
 * DeliveryMethodCard
 * Card with tabs for different delivery methods
 * Matches Sapo's "Đóng gói và giao hàng" section
 */

import * as React from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger } from '@/components/layout/page-section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Truck, ExternalLink, Store, Clock, Package, Edit2, Info, ChevronDown, Check } from 'lucide-react';
import { ShippingPartnerSelector } from './shipping-partner-selector';
import { ServiceConfigForm } from './service-config-form';
import { cn } from '@/lib/utils'; // ✅ Import cn utility
import type {
  DeliveryMethod,
  ShippingCalculationRequest,
  ShippingService,
  ShippingAddress,
  PackageInfo,
  SelectedShippingConfig,
} from './types';

interface DeliveryMethodCardProps {
  selectedMethod: DeliveryMethod;
  onMethodChange: (method: DeliveryMethod) => void;
  
  // For shipping-partner tab
  shippingRequest?: ShippingCalculationRequest | null | undefined;
  customerAddress?: ShippingAddress | null | undefined;
  pickupAddress?: ShippingAddress | null | undefined; // ✅ NEW: Pickup address for showing error message
  packageInfo?: PackageInfo | undefined;
  selectedService?: ShippingService | null | undefined;
  onServiceSelect?: ((service: ShippingService | null) => void) | undefined;
  onPackageInfoChange?: ((info: Partial<PackageInfo>) => void) | undefined;
  onServiceConfigChange?: ((config: Partial<SelectedShippingConfig['options']>) => void) | undefined;
  onChangeDeliveryAddress?: (() => void) | undefined; // NEW: Callback to open address dialog
  onNoteChange?: ((note: string) => void) | undefined; // ✅ NEW: Callback for shipping note
  grandTotal?: number | undefined; // ✅ Order grand total for auto-filling orderValue
  
  // ✅ NEW: Props for API preview
  previewData?: Record<string, unknown> | undefined; // Data that will be sent to API
  
  // ✅ NEW: Hide tabs and only show shipping-partner content
  hideTabs?: boolean | undefined;
  
  disabled?: boolean | undefined;
}

export function DeliveryMethodCard({
  selectedMethod,
  onMethodChange,
  shippingRequest,
  customerAddress,
  pickupAddress,
  packageInfo,
  selectedService,
  onServiceSelect,
  onPackageInfoChange,
  onServiceConfigChange,
  onChangeDeliveryAddress,
  onNoteChange,
  grandTotal,
  previewData,
  hideTabs = false,
  disabled,
}: DeliveryMethodCardProps) {
  
  // ✅ Debug logging
  React.useEffect(() => {
  }, [customerAddress, selectedService]);
  
  // Local state for editable fields
  const [codAmount, setCodAmount] = React.useState(packageInfo?.codAmount || 0);
  const [weight, setWeight] = React.useState(packageInfo?.weight || 0);
  const [length, setLength] = React.useState(packageInfo?.length || 10);
  const [width, setWidth] = React.useState(packageInfo?.width || 10);
  const [height, setHeight] = React.useState(packageInfo?.height || 10);
  const [deliveryNote, setDeliveryNote] = React.useState('');
  const [deliveryRequirement, setDeliveryRequirement] = React.useState('view-only');

  // ✅ NEW: State for preview dialog
  const [showPreview, setShowPreview] = React.useState(false);
  
  // ✅ Track available services for selected partner
  const [availableServices, setAvailableServices] = React.useState<ShippingService[]>([]);
  
  // ✅ Track if user manually edited COD amount
  const [isUserEditedCod, setIsUserEditedCod] = React.useState(false);

  // Validation errors
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Update local state when packageInfo changes
  React.useEffect(() => {
    if (packageInfo) {
      // Only update codAmount if user hasn't manually edited it
      if (!isUserEditedCod) {
        setCodAmount(packageInfo.codAmount || 0);
      }
      setWeight(packageInfo.weight || 0);
      setLength(packageInfo.length || 10);
      setWidth(packageInfo.width || 10);
      setHeight(packageInfo.height || 10);
    }
  }, [packageInfo, isUserEditedCod]);

  // Validate and update packageInfo
  const handleFieldChange = (field: string, value: number) => {
    const newErrors = { ...errors };
    
    // Validation
    if (field === 'weight' && value <= 0) {
      newErrors.weight = 'Khối lượng phải lớn hơn 0';
    } else if (field === 'weight' && selectedService?.partnerCode === 'GHTK' && value < 100) {
      // ✅ GHTK minimum weight requirement
      newErrors.weight = 'GHTK yêu cầu khối lượng tối thiểu 100g';
    } else if (field === 'weight') {
      delete newErrors.weight;
    }

    if ((field === 'length' || field === 'width' || field === 'height') && value <= 0) {
      newErrors[field] = 'Kích thước phải lớn hơn 0';
    } else if (field === 'length' || field === 'width' || field === 'height') {
      delete newErrors[field];
    }

    if (field === 'codAmount' && value < 0) {
      newErrors.codAmount = 'Tiền COD không được âm';
    } else if (field === 'codAmount') {
      delete newErrors.codAmount;
    }

    setErrors(newErrors);

    // Update local state
    switch (field) {
      case 'codAmount': 
        setCodAmount(value);
        setIsUserEditedCod(true); // Mark as user-edited
        break;
      case 'weight': setWeight(value); break;
      case 'length': setLength(value); break;
      case 'width': setWidth(value); break;
      case 'height': setHeight(value); break;
    }

    // Notify parent if valid
    if (Object.keys(newErrors).length === 0 && onPackageInfoChange) {
      onPackageInfoChange({ [field]: value });
    }
  };

  // Format currency (match product table: 8.000.000 VND)
  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('vi-VN').format(value);
    return formatted;
  };

  // Format number with thousand separator (for weight)
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  // Format address string
  const formatAddress = (addr: ShippingAddress | null | undefined) => {
    if (!addr) return 'Chưa có thông tin địa chỉ';
    const parts = [addr.address, addr.ward, addr.district, addr.province].filter(Boolean);
    return parts.join(', ') || 'Chưa có thông tin địa chỉ';
  };

  const handleChangeAddress = () => {
    if (onChangeDeliveryAddress) {
      onChangeDeliveryAddress();
    } else {
      toast.info('Vui lòng cập nhật địa chỉ khách hàng ở mục "Thông tin khách hàng" bên trên');
    }
  };

  // Delivery-method picker config for both desktop tabs & mobile bottom-sheet.
  const methodOptions: Array<{
    value: DeliveryMethod;
    Icon: React.ComponentType<{ className?: string }>;
    short: string;
    full: string;
    disabled?: boolean;
  }> = [
    { value: 'shipping-partner', Icon: Truck, short: 'Hãng VC', full: 'Đẩy qua hãng vận chuyển' },
    { value: 'external', Icon: ExternalLink, short: 'VC ngoài', full: 'Đẩy vận chuyển ngoài', disabled: true },
    { value: 'pickup', Icon: Store, short: 'Tại cửa', full: 'Khách nhận tại cửa hàng' },
    { value: 'deliver-later', Icon: Clock, short: 'Giao sau', full: 'Giao hàng sau' },
  ];
  const [mobilePickerOpen, setMobilePickerOpen] = React.useState(false);
  const activeMethod = methodOptions.find((m) => m.value === selectedMethod) ?? methodOptions[0];
  const ActiveIcon = activeMethod.Icon;

  return (
    <Tabs
      value={selectedMethod}
      onValueChange={(value) => onMethodChange(value as DeliveryMethod)}
      className="w-full"
    >
      {/* Conditionally hide tabs if hideTabs is true */}
      {!hideTabs && (
        <>
          {/* Desktop: 4 tabs inline */}
          <div className="hidden md:block">
            <MobileTabsList>
              {methodOptions.map(({ value, Icon, full, disabled }) => (
                <MobileTabsTrigger key={value} value={value} disabled={disabled}>
                  <Icon className="h-4 w-4" />
                  <span>{full}</span>
                </MobileTabsTrigger>
              ))}
            </MobileTabsList>
          </div>

          {/* Mobile: single picker button opens a bottom sheet */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobilePickerOpen(true)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-left shadow-sm transition-colors hover:bg-accent/40"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                  <ActiveIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex flex-col">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Phương thức giao hàng</span>
                  <span className="text-sm font-medium truncate">{activeMethod.full}</span>
                </span>
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>

            <Sheet open={mobilePickerOpen} onOpenChange={setMobilePickerOpen}>
              <SheetContent side="bottom" className="rounded-t-2xl p-0 pb-4">
                <SheetHeader className="px-4 py-3 border-b">
                  <SheetTitle className="text-base">Chọn phương thức giao hàng</SheetTitle>
                  <SheetDescription className="sr-only">
                    Chọn cách giao hàng cho đơn này
                  </SheetDescription>
                </SheetHeader>
                <div className="px-2 py-2">
                  {methodOptions.map(({ value, Icon, full, disabled }) => {
                    const isActive = value === selectedMethod;
                    return (
                      <button
                        key={value}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          onMethodChange(value);
                          setMobilePickerOpen(false);
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                          'hover:bg-accent/60 active:bg-accent',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          isActive && 'bg-primary/5'
                        )}
                      >
                        <span className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-md shrink-0',
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                        )}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium">{full}</span>
                          {disabled && (
                            <span className="block text-xs text-muted-foreground">(Sắp ra mắt)</span>
                          )}
                        </span>
                        {isActive && <Check className="h-4 w-4 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </>
      )}

      {/* Tab 1: Shipping Partner */}
      <TabsContent value="shipping-partner" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 mt-4">
          {/* LEFT: Shipping Info Summary - Always visible */}
          <div className="rounded-xl border border-border/50 bg-card p-4 space-y-4">
            {/* Địa chỉ giao hàng */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-primary">Địa chỉ giao hàng</Label>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleChangeAddress}
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Thay đổi
                </Button>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {formatAddress(customerAddress)}
              </div>
            </div>

            {/* Thông tin giao hàng */}
            <div className="border-t pt-4 space-y-3">
              <Label className="text-sm font-semibold">Thông tin giao hàng</Label>
              
              {/* COD */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="codAmount" className="text-sm text-muted-foreground">
                    Tiền thu hộ (COD)
                  </Label>
                </div>
                <Input 
                  id="codAmount"
                  type="text" 
                  value={formatCurrency(codAmount)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const numValue = Number(value);
                    handleFieldChange('codAmount', numValue);
                    
                    // ✅ GHTK validation: COD must be 0 or between 10,000 - 20,000,000
                    // Validation is handled by the error display below
                  }}
                  className={cn(
                    "text-right font-medium",
                    selectedService?.partnerCode === 'GHTK' && codAmount > 0 && (codAmount < 10000 || codAmount > 20000000) && "border-red-300"
                  )}
                  placeholder="0"
                />
                {errors.codAmount && (
                  <p className="text-xs text-destructive">{errors.codAmount}</p>
                )}
                {/* ✅ GHTK COD validation warning */}
                {selectedService?.partnerCode === 'GHTK' && codAmount > 0 && codAmount < 10000 && (
                  <p className="text-xs text-amber-600">
                    ⚠️ GHTK yêu cầu COD tối thiểu 10.000đ
                  </p>
                )}
                {selectedService?.partnerCode === 'GHTK' && codAmount > 20000000 && (
                  <p className="text-xs text-red-600">
                    ❌ GHTK giới hạn COD tối đa 20.000.000đ
                  </p>
                )}
              </div>

              {/* Khối lượng */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="weight" className="text-sm text-muted-foreground">
                    Khối lượng (g)
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Tự động tính từ tổng khối lượng sản phẩm.</p>
                        <p className="text-xs">Bạn có thể sửa lại theo khối lượng thực tế.</p>
                        {selectedService?.partnerCode === 'GHTK' && (
                          <p className="text-xs text-amber-500 mt-1">⚠️ GHTK yêu cầu tối thiểu 100g</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input 
                  id="weight"
                  type="text" 
                  value={formatNumber(weight)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    handleFieldChange('weight', Number(value));
                  }}
                  className="text-right font-medium"
                  placeholder="0"
                />
                {errors.weight && (
                  <p className="text-xs text-destructive">{errors.weight}</p>
                )}
              </div>

              {/* Kích thước (1 hàng) */}
              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">Kích thước (cm)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Input 
                      id="length"
                      type="number" 
                      value={length}
                      onChange={(e) => handleFieldChange('length', Number(e.target.value))}
                      className="text-center text-sm"
                      placeholder="Dài"
                      min="1"
                    />
                    <Label htmlFor="length" className="text-xs text-center block text-muted-foreground">Dài</Label>
                  </div>
                  <div className="space-y-1">
                    <Input 
                      id="width"
                      type="number" 
                      value={width}
                      onChange={(e) => handleFieldChange('width', Number(e.target.value))}
                      className="text-center text-sm"
                      placeholder="Rộng"
                      min="1"
                    />
                    <Label htmlFor="width" className="text-xs text-center block text-muted-foreground">Rộng</Label>
                  </div>
                  <div className="space-y-1">
                    <Input 
                      id="height"
                      type="number" 
                      value={height}
                      onChange={(e) => handleFieldChange('height', Number(e.target.value))}
                      className="text-center text-sm"
                      placeholder="Cao"
                      min="1"
                    />
                    <Label htmlFor="height" className="text-xs text-center block text-muted-foreground">Cao</Label>
                  </div>
                </div>
                {(errors.length || errors.width || errors.height) && (
                  <p className="text-xs text-destructive">Kích thước phải lớn hơn 0</p>
                )}
              </div>
            </div>

            {/* Yêu cầu giao hàng */}
            <div className="space-y-2">
              <Label htmlFor="deliveryReq" className="text-sm font-medium">
                Yêu cầu giao hàng
              </Label>
              <Select 
                value={deliveryRequirement} 
                onValueChange={(value) => {
                  setDeliveryRequirement(value);
                  
                  // ✅ Map to GHTK tags when service selected
                  if (selectedService?.partnerCode === 'GHTK') {
                    // Tag 10: Cho xem hàng
                    // Note: GHTK only has "Cho xem hàng" tag, other options don't have specific tags
                    const currentTags = (selectedService as { tags?: number[] }).tags || [];
                    const newTags = currentTags.filter((t: number) => t !== 10); // Remove tag 10 first
                    
                    if (value === 'view-only') {
                      newTags.push(10); // Add tag 10 for "Cho xem hàng"
                    }
                    // 'try-on' and 'no-check' don't have specific GHTK tags
                    
                    onServiceConfigChange?.({ tags: newTags });
                  }
                }}
              >
                <SelectTrigger id="deliveryReq">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view-only">Cho xem hàng, không cho thử</SelectItem>
                  <SelectItem value="try-on">Cho thử hàng</SelectItem>
                  <SelectItem value="no-check">Không cho kiểm tra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ghi chú */}
            <div className="space-y-2">
              <Label htmlFor="deliveryNote" className="text-sm font-medium">
                Ghi chú
              </Label>
              <Textarea 
                id="deliveryNote"
                value={deliveryNote}
                onChange={(e) => {
                  const note = e.target.value;
                  setDeliveryNote(note);
                  // ✅ Update form shippingNote
                  onNoteChange?.(note);
                }}
                className="resize-none" 
                rows={3}
                placeholder="Nhập ghi chú..."
              />
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t">
              Số tiền khách cần thanh toán khi nhận hàng
            </div>
          </div>

          {/* RIGHT: Service Selector AND Config Form */}
          <div className="space-y-4">
            {/* Service Selector - Always show if has shipping request */}
            {shippingRequest && onServiceSelect && (
              <ShippingPartnerSelector
                request={shippingRequest}
                selectedService={selectedService}
                onServiceSelect={onServiceSelect}
                disabled={disabled}
                collapsed={!!selectedService}
                onAvailableServicesChange={setAvailableServices}
                onServiceUpdate={(updatedService) => {
                  // ✅ Update selected service when recalculation happens
                  if (selectedService && 
                      updatedService.partnerId === selectedService.partnerId &&
                      updatedService.serviceId === selectedService.serviceId) {
                    onServiceSelect(updatedService);
                  }
                }}
                onTogglePreview={() => setShowPreview(!showPreview)}
              />
            )}
            
            {/* Config Form - Show when service selected */}
            {selectedService && (
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <h4 className="font-semibold mb-4">Gói dịch vụ</h4>
                <ServiceConfigForm
                  service={selectedService}
                  availableServices={availableServices}
                  onServiceChange={(newService) => {
                    if (onServiceSelect) onServiceSelect(newService);
                  }}
                  grandTotal={grandTotal}
                  customerAddress={customerAddress}
                  onConfigChange={(config) => {
                    if (onServiceConfigChange) {
                      onServiceConfigChange(config);
                    }
                  }}
                />
              </div>
            )}
            
            {/* Show placeholder if no shipping request */}
            {!shippingRequest && (
              <div className="rounded-lg border bg-muted/30 p-8 text-center space-y-3">
                <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Chưa đủ thông tin để tính phí vận chuyển</p>
                  <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                    {!pickupAddress && <p>• Chưa cấu hình địa chỉ lấy hàng cho chi nhánh</p>}
                    {!customerAddress && <p>• Chưa có địa chỉ khách hàng</p>}
                    {customerAddress && pickupAddress && weight <= 0 && <p>• Khối lượng phải lớn hơn 0</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      {/* Tab 2: External (Disabled) */}
      <TabsContent value="external" className="mt-4">
        <div className="rounded-lg border bg-muted/30 p-6 text-center space-y-2">
          <ExternalLink className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm font-medium">Tính năng đang phát triển</p>
        </div>
      </TabsContent>

      {/* Tab 3: Store Pickup */}
      <TabsContent value="pickup" className="mt-4">
        <div className="rounded-lg border bg-muted/30 p-6 text-center space-y-2">
          <Store className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm font-medium">Khách nhận tại cửa hàng</p>
          <p className="text-xs text-muted-foreground">
            Không phát sinh phí vận chuyển
          </p>
        </div>
      </TabsContent>

      {/* Tab 4: Deliver Later */}
      <TabsContent value="deliver-later" className="mt-4">
        <div className="rounded-lg border bg-muted/30 p-6 text-center space-y-2">
          <Clock className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm font-medium">Giao hàng sau</p>
          <p className="text-xs text-muted-foreground">
            Tự sắp xếp giao hàng sau khi tạo đơn
          </p>
        </div>
      </TabsContent>

      {/* ✅ Preview API Data Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent mobileFullScreen className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>📤 Dữ liệu sẽ gửi lên Server API</DialogTitle>
            <DialogDescription>
              Đây là params thực tế sẽ được gửi đến GHTK API khi nhấn "Chọn lại đơn vị vận chuyển"
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] w-full rounded-md border p-4 bg-slate-50">
            {previewData ? (
              <>
                <div className="space-y-2 mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <h3 className="font-semibold text-blue-900">📦 Thông tin chính:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Mã đơn:</span>{' '}
                      <span className="font-mono text-green-700">{String(previewData?.orderId ?? 'N/A')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Kho lấy hàng:</span>{' '}
                      <span className="font-mono text-orange-700">{String(previewData?.pickAddressId ?? 'Chưa chọn')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Khách hàng:</span>{' '}
                      <span className="text-gray-800">{String(previewData?.customerName ?? 'N/A')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Tổng cân nặng:</span>{' '}
                      <span className="text-gray-800">{String(previewData?.totalWeight ?? 0)}g</span>
                    </div>
                    <div>
                      <span className="font-medium">COD:</span>{' '}
                      <span className="text-gray-800">{new Intl.NumberFormat('vi-VN').format(Number(previewData?.pickMoney) || 0)}đ</span>
                    </div>
                    <div>
                      <span className="font-medium">Vận chuyển:</span>{' '}
                      <span className="text-gray-800">{previewData?.transport === 'fly' ? '✈️ Đường bay' : '🚚 Đường bộ'}</span>
                    </div>
                  </div>
                </div>
                <pre className="text-xs font-mono leading-relaxed bg-white p-3 rounded border">
                  {JSON.stringify(previewData, null, 2)}
                </pre>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="font-medium text-base">Chưa có dữ liệu API</p>
                <p className="text-sm mt-2">Nhấn nút <strong>"Chọn lại đơn vị vận chuyển"</strong> bên dưới</p>
                <p className="text-xs mt-1 text-muted-foreground/70">để xem params sẽ được gửi đến GHTK API</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
