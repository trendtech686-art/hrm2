'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
} from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreVertical, Package } from "lucide-react";
import type { Product } from "@/lib/types/prisma-extended"
import type { ProductCategory } from "@/features/settings/inventory/types"

// ═══════════════════════════════════════════════════════════════
// Helper functions
// ═══════════════════════════════════════════════════════════════

export const getStatusVariant = (status?: string) => {
  if (!status) return 'secondary';
  switch (status) {
    case 'active': return 'default';
    case 'inactive': return 'secondary';
    case 'discontinued': return 'destructive';
    default: return 'secondary';
  }
};

export const getStatusLabel = (status?: string) => {
  if (!status) return 'Không xác định';
  switch (status) {
    case 'active': return 'Hoạt động';
    case 'inactive': return 'Tạm ngừng';
    case 'discontinued': return 'Ngừng kinh doanh';
    default: return status;
  }
};

export const getTypeLabel = (type?: string) => {
  if (!type) return '';
  switch (type) {
    case 'physical': return 'Hàng hóa';
    case 'service': return 'Dịch vụ';
    case 'digital': return 'Sản phẩm số';
    default: return type;
  }
};

// ═══════════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════════

interface MobileProductCardProps {
  product: Product;
  categories: ProductCategory[];
  onRowClick: (product: Product) => void;
  onDelete: (systemId: string) => void;
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export function MobileProductCard({ 
  product, 
  categories, 
  onRowClick, 
  onDelete 
}: MobileProductCardProps) {
  const router = useRouter();

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onRowClick(product)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon/Avatar */}
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              <Package className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-body-sm font-medium truncate">{product.name}</h3>
                  {product.pkgxId && (
                    <Badge variant="outline" className="text-body-xs border-blue-500 text-blue-600 flex-shrink-0">
                      PKGX
                    </Badge>
                  )}
                </div>
                <p className="text-body-xs text-muted-foreground">{product.id}</p>
                {product.shortDescription && (
                  <p className="text-body-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {product.shortDescription}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/products/${product.systemId}/edit`); }}>
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(product.systemId); }}>
                    Chuyển vào thùng rác
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Details */}
            <div className="space-y-1.5 mt-2">
              {product.categorySystemId && (
                <div className="flex items-center text-body-xs text-muted-foreground">
                  <Package className="h-3 w-3 mr-1.5" />
                  <span className="truncate">
                    {categories.find(c => c.systemId === product.categorySystemId)?.name || product.categorySystemId}
                  </span>
                </div>
              )}
              {product.type && (
                <div className="flex items-center text-body-xs text-muted-foreground">
                  <span className="truncate">{getTypeLabel(product.type)}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t">
              <Badge variant={getStatusVariant(product.status) as 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'success'} className="text-body-xs">
                {getStatusLabel(product.status)}
              </Badge>
              {product.unit && (
                <span className="text-body-xs text-muted-foreground">
                  ĐVT: {product.unit}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
