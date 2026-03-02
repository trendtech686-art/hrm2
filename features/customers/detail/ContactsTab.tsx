'use client';

import * as React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { Customer } from '@/lib/types/prisma-extended';

export interface ContactsTabProps {
  customer: Customer;
}

export function ContactsTab({ customer }: ContactsTabProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Danh sách liên hệ</CardTitle>
      </CardHeader>
      <CardContent>
        {!customer.contacts || customer.contacts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Chưa có thông tin liên hệ nào</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customer.contacts.map((contact, index) => (
              <Card key={index} className="relative overflow-hidden">
                {contact.isPrimary && (
                  <Badge className="absolute top-2 right-2 text-body-xs" variant="success">
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
                      <div className="text-body-sm text-muted-foreground truncate">{contact.role}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-body-sm">
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
