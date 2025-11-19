import * as React from 'react';
import type { Supplier } from './types.ts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Button } from '../../components/ui/button.tsx';
import { MoreHorizontal, Phone, Mail, MapPin, User, Building2, CreditCard, RotateCcw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import type { SystemId } from '@/lib/id-types';

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (systemId: SystemId) => void;
  onRestore: (systemId: SystemId) => void;
  navigate: (path: string) => void;
}

export function SupplierCard({ supplier, onEdit, onDelete, onRestore, navigate }: SupplierCardProps) {
  const statusVariant = supplier.status === "Đang Giao Dịch" ? "success" : "secondary";
  const isDeleted = !!supplier.deletedAt;

  const handleCardClick = () => {
    if (!isDeleted) {
      navigate(`/suppliers/${supplier.systemId}`);
    }
  };

  return (
    <Card 
      className={isDeleted ? "opacity-60 bg-muted/50" : "hover:shadow-md transition-shadow cursor-pointer"}
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base truncate">{supplier.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground font-mono">{supplier.id}</span>
              <Badge variant={statusVariant as any}>{supplier.status}</Badge>
              {isDeleted && <Badge variant="destructive">Đã xóa</Badge>}
            </div>
          </div>
          
          {/* Actions */}
          {isDeleted ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRestore(supplier.systemId);
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Khôi phục
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={(e) => {
                  e.preventDefault();
                  navigate(`/suppliers/${supplier.systemId}`);
                }}>
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => {
                  e.preventDefault();
                  onEdit(supplier);
                }}>
                  Sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    onDelete(supplier.systemId);
                  }}
                >
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Contact Info */}
        <div className="space-y-2">
          {supplier.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{supplier.phone}</span>
            </div>
          )}
          {supplier.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{supplier.email}</span>
            </div>
          )}
          {supplier.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{supplier.address}</span>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          {supplier.taxCode && (
            <div className="text-sm">
              <span className="text-muted-foreground">MST:</span>
              <div className="font-medium">{supplier.taxCode}</div>
            </div>
          )}
          {supplier.accountManager && (
            <div className="text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> Phụ trách:
              </span>
              <div className="font-medium truncate">{supplier.accountManager}</div>
            </div>
          )}
        </div>

        {/* Debt & Bank Info */}
        {(supplier.currentDebt !== undefined || supplier.bankAccount) && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            {supplier.currentDebt !== undefined && (
              <div className="text-sm">
                <span className="text-muted-foreground">Công nợ:</span>
                <div className={`font-medium ${supplier.currentDebt > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(supplier.currentDebt)}
                </div>
              </div>
            )}
            {supplier.bankAccount && (
              <div className="text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> TK:
                </span>
                <div className="font-medium font-mono text-xs">{supplier.bankAccount}</div>
                {supplier.bankName && (
                  <div className="text-xs text-muted-foreground truncate">{supplier.bankName}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Contact Person */}
        {supplier.contactPerson && (
          <div className="text-sm pt-2 border-t">
            <span className="text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" /> Người liên hệ:
            </span>
            <div className="font-medium">{supplier.contactPerson}</div>
          </div>
        )}

        {/* Notes */}
        {supplier.notes && (
          <div className="text-sm pt-2 border-t">
            <span className="text-muted-foreground">Ghi chú:</span>
            <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{supplier.notes}</div>
          </div>
        )}

        {/* Audit Info */}
        {supplier.createdAt && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Tạo: {new Date(supplier.createdAt).toLocaleDateString('vi-VN')}
            {supplier.updatedAt && supplier.updatedAt !== supplier.createdAt && (
              <> • Cập nhật: {new Date(supplier.updatedAt).toLocaleDateString('vi-VN')}</>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
