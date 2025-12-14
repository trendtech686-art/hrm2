/**
 * ShippingPartnerSelected
 * Display selected shipping partner with edit button
 */

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Package, Clock, Banknote, Code2 } from 'lucide-react';
import type { ShippingService } from './types';

interface ShippingPartnerSelectedProps {
  service: ShippingService;
  onEdit: () => void;
  onTogglePreview?: (() => void) | undefined; // ✅ NEW: Callback to toggle preview
  disabled?: boolean | undefined;
}

export function ShippingPartnerSelected({
  service,
  onEdit,
  onTogglePreview,
  disabled,
}: ShippingPartnerSelectedProps) {
  return (
    <div className="flex items-center justify-between p-4 border-2 border-green-500 bg-green-50/30 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center h-9 w-16 rounded text-white text-xs font-bold
          ${service.partnerCode === 'GHTK' ? 'bg-green-600' : 
            service.partnerCode === 'GHN' ? 'bg-orange-500' : 
            service.partnerCode === 'VTP' ? 'bg-orange-500' :
            service.partnerCode === 'J&T' ? 'bg-red-600' :
            service.partnerCode === 'SPX' ? 'bg-red-500' : 'bg-gray-500'}`}>
          {service.partnerCode}
        </div>
        <div>
          <div className="font-semibold">{service.serviceName}</div>
          <div className="text-sm text-muted-foreground">{service.partnerName}</div>
        </div>
      </div>
      
      <div className="flex gap-2">
        {onTogglePreview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTogglePreview();
            }}
            disabled={disabled}
            className="gap-2"
          >
            <Code2 className="h-4 w-4" />
            Xem API Data
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
          disabled={disabled}
        >
          Chọn lại đơn vị vận chuyển
        </Button>
      </div>
    </div>
  );
}
