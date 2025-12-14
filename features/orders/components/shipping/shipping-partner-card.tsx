/**
 * ShippingPartnerCard
 * Display a partner with multiple service options (radio group)
 */

import * as React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Package, Zap, DollarSign } from 'lucide-react';
import type { ShippingService } from './types';

interface ShippingPartnerCardProps {
  partnerCode: string;
  partnerName: string;
  services: ShippingService[];
  selectedServiceId?: string | undefined;
  onServiceSelect: (service: ShippingService) => void;
  disabled?: boolean | undefined;
}

// Partner logos/colors
const partnerStyles: Record<string, { bg: string; logo: string }> = {
  'GHTK': { bg: 'bg-green-500', logo: 'GHTK' },
  'GHN': { bg: 'bg-orange-500', logo: 'GHN' },
  'VTP': { bg: 'bg-orange-500', logo: 'VTP' },
  'J&T': { bg: 'bg-red-600', logo: 'J&T' },
  'SPX': { bg: 'bg-red-500', logo: 'SPX' },
};

export function ShippingPartnerCard({
  partnerCode,
  partnerName,
  services,
  selectedServiceId,
  onServiceSelect,
  disabled = false,
}: ShippingPartnerCardProps) {
  const style = partnerStyles[partnerCode] || { bg: 'bg-gray-500', logo: partnerCode };
  
  // Find cheapest service
  const cheapestService = services.reduce((prev, curr) => 
    curr.fee < prev.fee ? curr : prev
  );

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
      {/* Partner header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`${style.bg} text-white font-bold text-sm px-3 py-2 rounded`}>
          {style.logo}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-base">{partnerName}</h4>
          <p className="text-sm text-muted-foreground">
            {services.length} lựa chọn
          </p>
        </div>
        {cheapestService && (
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <DollarSign className="h-3 w-3 mr-1" />
            Rẻ nhất
          </Badge>
        )}
      </div>

      {/* Service options - No RadioGroup, parent already has it */}
      <div className="space-y-2">
        {services.map((service) => {
          const serviceKey = `service-${service.partnerId}-${service.serviceId}`;
          const isSelected = selectedServiceId === serviceKey;
          const isCheapest = service.serviceId === cheapestService.serviceId;

          return (
            <label
              key={serviceKey}
              htmlFor={serviceKey}
              className={`
                flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all
                ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <RadioGroupItem
                id={serviceKey}
                value={serviceKey}
                disabled={disabled}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{service.serviceName}</span>
                  {service.serviceId === 'express' && (
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      <Zap className="h-3 w-3 mr-1" />
                      Nhanh nhất
                    </Badge>
                  )}
                  {isCheapest && services.length > 1 && (
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Rẻ nhất
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Package className="h-3 w-3" />
                  <span>{service.estimatedDays}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{formatCurrency(service.fee)} ₫</div>
                <div className="text-xs text-muted-foreground">Phí vận chuyển</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
