'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { Customer } from '@/lib/types/prisma-extended';
import { formatCurrency } from './types';

// Simple detail item component
const DetailItem = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="space-y-1">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm font-medium">
      {value !== null && value !== undefined && value !== '' ? value : '—'}
    </dd>
  </div>
);

export interface PaymentTabProps {
  customer: Customer;
  currentDebt: number;
  getPaymentTermName: (id?: string) => string | undefined;
  getCreditRatingName: (id?: string) => string | undefined;
}

export function PaymentTab({ 
  customer, 
  currentDebt,
  getPaymentTermName,
  getCreditRatingName,
}: PaymentTabProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Thanh toán & Tín dụng</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
          <DetailItem label="Hạn thanh toán" value={getPaymentTermName(customer.paymentTerms)} />
          <DetailItem label="Xếp hạng tín dụng" value={getCreditRatingName(customer.creditRating)} />
          <DetailItem label="Cho phép công nợ" value={customer.allowCredit ? 'Có' : 'Không'} />
          <DetailItem label="Công nợ hiện tại" value={formatCurrency(currentDebt)} />
          <DetailItem label="Hạn mức công nợ" value={formatCurrency(customer.maxDebt)} />
        </dl>
      </CardContent>
    </Card>
  );
}
