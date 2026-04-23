'use client';

import * as React from 'react';
import { Phone, Mail, Users } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { Customer } from '@/lib/types/prisma-extended';
import { mobileBleedCardClass } from '@/components/layout/page-section';

export interface ContactsTabProps {
  customer: Customer;
}

export function ContactsTab({ customer }: ContactsTabProps) {
  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader className="pb-3">
        <CardTitle>Danh sách liên hệ</CardTitle>
      </CardHeader>
      <CardContent>
        {!customer.contacts || customer.contacts.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/60" strokeWidth={1.5} />
            <p className="text-sm">Chưa có thông tin liên hệ nào</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customer.contacts.map((contact, index) => (
              <Card key={index} className="relative overflow-hidden">
                {contact.isPrimary && (
                  <Badge className="absolute top-2 right-2 text-xs" variant="success">
                    Chính
                  </Badge>
                )}
                <CardContent className="p-4 pt-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg font-semibold text-muted-foreground shrink-0">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{contact.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{contact.role}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <a href={`tel:${contact.phone}`} className="hover:underline truncate">{contact.phone}</a>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <a href={`mailto:${contact.email}`} className="hover:underline truncate">{contact.email}</a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
