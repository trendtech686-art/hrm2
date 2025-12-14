/**
 * ShippingPartnerSelector
 * Main component for selecting shipping partner and service
 * Calculates fees from multiple partners in parallel
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioGroup } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Truck, Loader2 } from 'lucide-react';
import { useShippingCalculator } from '../../hooks/use-shipping-calculator';
import { ShippingPartnerCard } from './shipping-partner-card';
import { ShippingPartnerSelected } from './shipping-partner-selected';
import type {
  ShippingCalculationRequest,
  ShippingService,
  ShippingCalculationResult,
} from './types';

interface ShippingPartnerSelectorProps {
  request: ShippingCalculationRequest;
  selectedService?: ShippingService | null | undefined;
  onServiceSelect: (service: ShippingService | null) => void;
  onServiceUpdate?: ((service: ShippingService) => void) | undefined; // ✅ NEW: Callback when service fee updates
  onTogglePreview?: (() => void) | undefined; // ✅ NEW: Callback to toggle API data preview
  disabled?: boolean | undefined;
  collapsed?: boolean | undefined;
}

export function ShippingPartnerSelector({
  request,
  selectedService,
  onServiceSelect,
  onServiceUpdate,
  onTogglePreview,
  disabled,
  collapsed,
}: ShippingPartnerSelectorProps) {
  const navigate = useNavigate();
  const { results, isCalculating, calculateFees } = useShippingCalculator();
  const prevWeightRef = React.useRef<number>(0);
  const prevOrderValueRef = React.useRef<number>(0); // ✅ Track orderValue
  const prevTransportRef = React.useRef<string>(''); // ✅ Track transport
  const prevToProvinceRef = React.useRef<string>('');
  const prevFromProvinceRef = React.useRef<string>('');
  const [isExpanded, setIsExpanded] = React.useState(!collapsed);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null); // ✅ Debounce timer

  // Auto-calculate whenever weight, orderValue, or transport changes (with debounce)
  React.useEffect(() => {
    // Calculate if have basic info (loosen requirement for 2-level address)
    if (
      request.weight > 0 &&
      request.toProvince &&
      request.fromProvince
    ) {
      // Check if any relevant field actually changed
      const weightChanged = prevWeightRef.current !== request.weight;
      const orderValueChanged = prevOrderValueRef.current !== (request.options?.orderValue || 0);
      const transportChanged = prevTransportRef.current !== (request.options?.transport || 'road');
      const toProvinceChanged = prevToProvinceRef.current !== request.toProvince;
      const fromProvinceChanged = prevFromProvinceRef.current !== request.fromProvince;
      const isFirstRun = prevWeightRef.current === 0;
      
      if (weightChanged || orderValueChanged || transportChanged || toProvinceChanged || fromProvinceChanged || isFirstRun) {
        // ✅ Clear previous debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        
        // ✅ Debounce 500ms để tránh spam request khi đổi nhanh
        debounceTimerRef.current = setTimeout(() => {
          calculateFees(request);
        }, 500);
        
        // Update refs
        prevWeightRef.current = request.weight;
        prevOrderValueRef.current = request.options?.orderValue || 0;
        prevTransportRef.current = request.options?.transport || 'road';
        prevToProvinceRef.current = request.toProvince;
        prevFromProvinceRef.current = request.fromProvince;
      }
    }
    
    // ✅ Cleanup debounce timer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [request.weight, request.options?.orderValue, request.options?.transport, request.toProvince, request.fromProvince, request.toDistrict, request.fromDistrict, calculateFees]); // ✅ Track all fields directly

  // ✅ NEW: Auto-update selected service when results change
  React.useEffect(() => {
    if (!selectedService || !onServiceUpdate) return;
    
    // Find updated service with same ID
    const allServices: ShippingService[] = [];
    results.forEach(result => {
      if (result.status === 'success') {
        allServices.push(...result.services);
      }
    });
    
    const updatedService = allServices.find(
      s => s.partnerId === selectedService.partnerId && 
           s.serviceId === selectedService.serviceId
    );
    
    if (updatedService && updatedService.fee !== selectedService.fee) {
      onServiceUpdate(updatedService);
    }
  }, [results, selectedService, onServiceUpdate]);

  // Flatten all services from all partners
  const allServices = React.useMemo(() => {
    const services: ShippingService[] = [];
    results.forEach((result) => {
      if (result.status === 'success') {
        services.push(...result.services);
      }
    });
    return services;
  }, [results]);

  // Group services by partner
  const groupedByPartner = React.useMemo(() => {
    const groups: Record<string, ShippingService[]> = {};
    allServices.forEach(service => {
      if (!groups[service.partnerCode]) {
        groups[service.partnerCode] = [];
      }
      groups[service.partnerCode].push(service);
    });
    return groups;
  }, [allServices]);

  // Get not-configured partners
  const notConfiguredPartners = React.useMemo(() => {
    return results.filter(r => r.status === 'error' && r.error === 'NOT_CONFIGURED');
  }, [results]);

  // Find fastest and cheapest
  const { fastestService, cheapestService } = React.useMemo(() => {
    if (allServices.length === 0) {
      return { fastestService: null, cheapestService: null };
    }

    // Find cheapest
    const cheapest = allServices.reduce((prev, curr) => 
      curr.fee < prev.fee ? curr : prev
    );

    // Find fastest by parsing estimated days
    const fastest = allServices.reduce((prev, curr) => {
      // Extract number from estimatedDays (e.g., "1-2 ngày" -> 1, "3-5 ngày" -> 3)
      const prevDays = parseInt(prev.estimatedDays.match(/\d+/)?.[0] || '999');
      const currDays = parseInt(curr.estimatedDays.match(/\d+/)?.[0] || '999');
      return currDays < prevDays ? curr : prev;
    });

    return { 
      fastestService: fastest, 
      cheapestService: cheapest 
    };
  }, [allServices]);

  // Check if any partners are loading
  const isLoading = isCalculating || results.some(r => r.status === 'loading');

  // Check if all partners failed
  const allFailed = results.length > 0 && results.every(r => r.status === 'error');

  // Selected service ID
  const selectedServiceId = selectedService
    ? `service-${selectedService.partnerId}-${selectedService.serviceId}`
    : '';

  const handleServiceSelect = (service: ShippingService) => {
    if (disabled) return;
    onServiceSelect(service);
  };

  // Loading spinner - simple and clean
  if (isCalculating) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Đang tính phí vận chuyển...</span>
      </div>
    );
  }

  // No services available
  if (!isCalculating && allServices.length === 0 && notConfiguredPartners.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {allFailed ? (
            <>
              Không thể kết nối với các đối tác vận chuyển. Vui lòng kiểm tra:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Cấu hình tài khoản đối tác tại Cài đặt → Đối tác vận chuyển</li>
                <li>Địa chỉ giao hàng có đầy đủ thông tin</li>
                <li>Trọng lượng đơn hàng hợp lệ (tối thiểu 100g)</li>
              </ul>
            </>
          ) : (
            <>
              {/* ✅ PHASE 3: Chi tiết lý do không tìm thấy dịch vụ */}
              Không tìm thấy dịch vụ vận chuyển phù hợp. Vui lòng kiểm tra:
              <ul className="list-disc list-inside mt-2 space-y-1">
                {(!request.toProvince || !request.toDistrict) && (
                  <li className="text-destructive font-medium">❌ Thiếu địa chỉ giao hàng (tỉnh/huyện)</li>
                )}
                {(!request.weight || request.weight <= 0) && (
                  <li className="text-destructive font-medium">❌ Thiếu khối lượng đơn hàng (chưa chọn sản phẩm?)</li>
                )}
                {!request.fromProvince && (
                  <li className="text-destructive font-medium">❌ Thiếu địa chỉ lấy hàng (chưa chọn chi nhánh?)</li>
                )}
                {request.weight > 0 && request.toProvince && request.fromProvince && (
                  <li>✅ Thông tin đầy đủ nhưng không có dịch vụ khả dụng - Vui lòng thử đổi địa chỉ hoặc giảm trọng lượng</li>
                )}
                <li className="text-muted-foreground text-xs mt-2">
                  💡 Tip: Đảm bảo đã cấu hình tài khoản GHTK tại Cài đặt → Đối tác vận chuyển
                </li>
              </ul>
            </>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // ✅ If collapsed and has selected service, show compact view
  if (collapsed && selectedService) {
    return (
      <ShippingPartnerSelected
        service={selectedService}
        onEdit={() => {
          setIsExpanded(true);
          // Clear selection to force reselect
          onServiceSelect(null);
        }}
        onTogglePreview={onTogglePreview}
        disabled={disabled}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with info */}
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold">
            Chọn đơn vị vận chuyển
          </h3>
          {Object.keys(groupedByPartner).length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({Object.keys(groupedByPartner).length} đối tác)
            </span>
          )}
        </div>

      {/* Show other errors (API errors) */}
      {results.some(r => r.status === 'error' && r.error && r.error !== 'NOT_CONFIGURED') && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-1">Một số đối tác gặp lỗi:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {results
                .filter(r => r.status === 'error' && r.error && r.error !== 'NOT_CONFIGURED')
                .map((r, index) => (
                  <li key={`${r.partnerId}-error-${index}`}>
                    {r.partnerName}: {r.error}
                  </li>
                ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Partner cards with services */}
      <RadioGroup
        value={selectedServiceId}
        onValueChange={(value) => {
          if (disabled) return;
          // Find service by value
          const service = allServices.find(
            s => `service-${s.partnerId}-${s.serviceId}` === value
          );
          if (service) {
            handleServiceSelect(service);
          }
        }}
        className="space-y-4"
      >
        {Object.entries(groupedByPartner).map(([partnerCode, services]) => (
          <ShippingPartnerCard
            key={partnerCode}
            partnerCode={partnerCode}
            partnerName={services[0].partnerName}
            services={services}
            selectedServiceId={selectedServiceId}
            onServiceSelect={handleServiceSelect}
            disabled={disabled}
          />
        ))}
      </RadioGroup>

      {/* Not-configured partners */}
      {notConfiguredPartners.length > 0 && (
        <div className="border rounded-lg p-4 bg-orange-50/50">
          <p className="text-sm font-medium text-orange-900 mb-2">
            Dịch vụ vận chuyển hiện không khả dụng
          </p>
          <div className="space-y-2 mb-3">
            {notConfiguredPartners.map((partner, index) => (
              <div key={`${partner.partnerId}-notconfig-${index}`} className="flex items-center gap-2 text-sm text-orange-800">
                <div className={`w-12 h-8 flex items-center justify-center rounded text-white text-xs font-bold
                  ${partner.partnerCode === 'GHN' ? 'bg-orange-500' : 
                    partner.partnerCode === 'VTP' ? 'bg-orange-500' :
                    partner.partnerCode === 'J&T' ? 'bg-red-600' :
                    partner.partnerCode === 'SPX' ? 'bg-red-500' : 'bg-gray-500'}`}>
                  {partner.partnerCode}
                </div>
                <span>{partner.partnerName}</span>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings/shipping')}
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            Kết nối ngay
          </Button>
        </div>
      )}

      {/* Info message */}
      {allServices.length > 0 && (
        <p className="text-xs text-muted-foreground">
          💡 Giá được tính theo thời gian thực từ các đối tác vận chuyển.
          Phí cuối cùng có thể thay đổi khi tạo đơn.
        </p>
      )}
    </div>
  );
}
