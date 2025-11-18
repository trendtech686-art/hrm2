/**
 * DeliveryAddressCard
 * Display customer shipping address information
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, User, Edit } from 'lucide-react';
import type { ShippingAddress } from './types';

interface DeliveryAddressCardProps {
  address: ShippingAddress;
  onEdit?: () => void;
  editable?: boolean;
}

export function DeliveryAddressCard({
  address,
  onEdit,
  editable = false,
}: DeliveryAddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Địa chỉ giao hàng
          </CardTitle>
          {editable && onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Sửa
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Customer name */}
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">{address.name}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-2">
          <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm">{address.phone}</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm">{address.address}</p>
            {address.ward && (
              <p className="text-sm text-muted-foreground">
                {address.ward}, {address.district}, {address.province}
              </p>
            )}
            {!address.ward && (
              <p className="text-sm text-muted-foreground">
                {address.district}, {address.province}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
