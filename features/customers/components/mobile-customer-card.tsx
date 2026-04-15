'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import { MoreVertical, Phone, Building2 } from "lucide-react";

import type { Customer } from "@/lib/types/prisma-extended";

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
    case "ACTIVE":
      return "default";
    case "Ngừng giao dịch":
    case "Ngừng Giao Dịch":
    case "INACTIVE":
      return "secondary";
    case "Nợ xấu":
      return "destructive";
    default:
      return "default";
  }
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    'ACTIVE': 'Đang giao dịch',
    'INACTIVE': 'Ngừng giao dịch',
  };
  return map[status] || status;
}

export function MobileCustomerCard({ customer, onRowClick, onDelete }: MobileCustomerCardProps) {
  const router = useRouter();

  return (
    <div 
      className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.98] transition-transform touch-manipulation cursor-pointer"
      onClick={() => onRowClick(customer)}
    >
      {/* Header: Avatar + Info + Menu */}
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11 shrink-0">
          <AvatarImage src="" alt={customer.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm truncate">{customer.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchButton variant="ghost" size="icon-sm" className="h-8 w-8 p-0 -mr-2 -mt-1 shrink-0" onClick={(event) => event.stopPropagation()}>
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
          <span className="text-xs text-muted-foreground font-mono">{customer.id}</span>
          {customer.company && (
            <div className="text-xs text-muted-foreground mt-0.5 flex items-center">
              <Building2 className="h-3 w-3 mr-1 shrink-0" />
              <span className="truncate">{customer.company}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Phone + Status + Account Manager */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <Badge variant={getStatusVariant(customer.status)} className="text-xs">
          {getStatusLabel(customer.status)}
        </Badge>
        <div className="flex items-center gap-2">
          {customer.accountManagerName && (
            <span className="text-xs text-muted-foreground">NV: {customer.accountManagerName}</span>
          )}
          {customer.phone && (
            <TouchButton 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${customer.phone}`;
              }}
            >
              <Phone className="h-3.5 w-3.5" />
            </TouchButton>
          )}
        </div>
      </div>
    </div>
  );
}
