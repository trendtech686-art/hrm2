'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import { MoreVertical, Phone, Mail, Building2 } from "lucide-react";

import type { Customer } from "@/lib/types/prisma-extended";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TouchButton } from "@/components/mobile/touch-button";

interface MobileCustomerCardProps {
  customer: Customer;
  onRowClick: (customer: Customer) => void;
  onDelete: (systemId: string) => void;
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Đang giao dịch":
      return "default";
    case "Ngừng giao dịch":
    case "Ngừng Giao Dịch":
      return "secondary";
    case "Nợ xấu":
      return "destructive";
    default:
      return "default";
  }
}

export function MobileCustomerCard({ customer, onRowClick, onDelete }: MobileCustomerCardProps) {
  const router = useRouter();

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onRowClick(customer)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src="" alt={customer.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <h3 className="font-semibold text-body-sm truncate">{customer.name}</h3>
                <p className="text-body-xs text-muted-foreground">{customer.id}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <TouchButton variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(event) => event.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                  </TouchButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/customers/${customer.systemId}/edit`);
                    }}
                  >
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(customer.systemId);
                    }}
                  >
                    Chuyển vào thùng rác
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-1.5 mt-2">
              {customer.company && (
                <div className="flex items-center text-body-xs text-muted-foreground">
                  <Building2 className="h-3 w-3 mr-1.5" />
                  <span className="truncate">{customer.company}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center text-body-xs text-muted-foreground">
                  <Mail className="h-3 w-3 mr-1.5" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center text-body-xs text-muted-foreground">
                  <Phone className="h-3 w-3 mr-1.5" />
                  <span>{customer.phone}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t">
              <Badge variant={getStatusVariant(customer.status)} className="text-body-xs">
                {customer.status}
              </Badge>
              {customer.accountManagerName && (
                <span className="text-body-xs text-muted-foreground">NV: {customer.accountManagerName}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
