/**
 * ShippingServiceCard
 * Radio card item for displaying a shipping service option
 * Memoized for performance optimization
 */

import * as React from 'react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ShippingService } from './types';

interface ShippingServiceCardProps {
  service: ShippingService;
  isSelected: boolean;
  onSelect: () => void;
  isLoading?: boolean;
  isFastest?: boolean; // Đánh dấu giao nhanh nhất
  isCheapest?: boolean; // Đánh dấu rẻ nhất
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

const PartnerLogo = React.memo(({ partnerCode, partnerName }: { partnerCode: string; partnerName: string }) => {
  const logos: { [key: string]: { bg: string; text: string } } = {
    'GHN': { bg: 'bg-orange-500', text: 'GHN' },
    'GHTK': { bg: 'bg-green-500', text: 'GHTK' },
    'VTP': { bg: 'bg-orange-400', text: 'VTP' },
    'J&T': { bg: 'bg-red-600', text: 'J&T' },
    'SPX': { bg: 'bg-red-500', text: 'SPX' },
  };

  const logo = logos[partnerCode] || { bg: 'bg-gray-400', text: partnerCode };

  return (
    <div className={cn('h-12 w-12 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0', logo.bg)}>
      {logo.text}
    </div>
  );
});

export const ShippingServiceCard = React.memo(({
  service,
  isSelected,
  onSelect,
  isLoading = false,
  isFastest = false,
  isCheapest = false,
}: ShippingServiceCardProps) => {
  const cardId = `service-${service.partnerId}-${service.serviceId}`;

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 p-4 cursor-pointer transition-all',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-accent/50',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
      onClick={!isLoading ? onSelect : undefined}
    >
      <div className="flex items-start gap-4">
        {/* Radio button */}
        <div className="pt-1">
          <RadioGroupItem value={cardId} id={cardId} disabled={isLoading} />
        </div>

        {/* Partner logo */}
        <PartnerLogo partnerCode={service.partnerCode} partnerName={service.partnerName} />

        {/* Service info */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor={cardId} className="text-base font-semibold cursor-pointer">
                {service.partnerName}
              </Label>
              {isFastest && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  ⚡ Nhanh nhất
                </Badge>
              )}
              {isCheapest && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                  💰 Rẻ nhất
                </Badge>
              )}
            </div>
            {isSelected && (
              <Badge variant="default" className="ml-2">
                Đã chọn
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {service.serviceName}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{service.estimatedDays}</span>
            </div>
            {service.expectedDeliveryDate && (
              <span>Dự kiến: {service.expectedDeliveryDate}</span>
            )}
          </div>

          {service.note && (
            <p className="text-xs text-muted-foreground italic mt-1">
              {service.note}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="text-right">
          {isLoading ? (
            <div className="flex items-center justify-end">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="text-lg font-bold text-primary">
                {formatCurrency(service.fee)}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Phí vận chuyển
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
