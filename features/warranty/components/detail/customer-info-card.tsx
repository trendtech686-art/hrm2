import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import type { WarrantyTicket } from '../../types';

interface CustomerInfoCardProps {
  ticket: WarrantyTicket;
}

export function CustomerInfoCard({ ticket }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Thông tin khách hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Tên khách hàng</p>
            <p className="font-medium">{ticket.customerName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Số điện thoại</p>
            <p className="font-medium">{ticket.customerPhone}</p>
          </div>
          {ticket.customerAddress && (
            <div className="col-span-3">
              <p className="text-xs text-muted-foreground">Địa chỉ</p>
              <p className="text-sm">{ticket.customerAddress}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
