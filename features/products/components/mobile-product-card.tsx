'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ProductImage } from "./product-image";
import {
  MobileCard,
  MobileCardFooter,
  MobileCardHeader,
} from "@/components/mobile/mobile-card";
import type { Product } from "@/lib/types/prisma-extended"
import type { ProductCategory } from "@/features/settings/inventory/types"
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════
// Helper functions
// ═══════════════════════════════════════════════════════════════

export const getStatusVariant = (status?: string) => {
  if (!status) return 'secondary';
  switch (status.toLowerCase()) {
    case 'active': return 'default';
    case 'inactive': return 'secondary';
    case 'discontinued': return 'destructive';
    default: return 'secondary';
  }
};

export const getStatusLabel = (status?: string) => {
  if (!status) return 'Không xác định';
  switch (status.toLowerCase()) {
    case 'active': return 'Đang bán';
    case 'inactive': return 'Tạm ngừng';
    case 'discontinued': return 'Ngừng KD';
    default: return status;
  }
};

export const getTypeLabel = (type?: string) => {
  if (!type) return '';
  switch (type.toLowerCase()) {
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
  canEdit?: boolean;
  canDelete?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export function MobileProductCard({ 
  product, 
  categories: _categories, 
  onRowClick, 
  onDelete,
  canEdit = true,
  canDelete = true,
}: MobileProductCardProps) {
  const router = useRouter();
  const hasActions = canEdit || canDelete;
  const totalStock = (product as Record<string, unknown>).totalInventory as number ?? 0;
  const isOutOfStock = totalStock <= 0;

  return (
    <MobileCard onClick={() => onRowClick(product)}>
      <MobileCardHeader className="items-center">
        <ProductImage
          productSystemId={product.systemId}
          productData={product}
          size="lg"
          className="rounded-md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium leading-snug line-clamp-2 pr-1">
              {product.name}
            </h3>
            {hasActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 -mr-2 -mt-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/products/${product.systemId}/edit`); }}>
                      Chỉnh sửa
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(product.systemId); }}>
                      Chuyển vào thùng rác
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{product.id}</p>
        </div>
      </MobileCardHeader>

      <MobileCardFooter>
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "text-xs font-semibold",
            isOutOfStock ? "text-red-600" : "text-emerald-600"
          )}>
            Tồn: {totalStock}
          </span>
          {product.unit && (
            <span className="text-xs text-muted-foreground">{product.unit}</span>
          )}
        </div>
        {product.status && (
          <Badge variant={getStatusVariant(product.status)} className="text-xs">
            {getStatusLabel(product.status)}
          </Badge>
        )}
      </MobileCardFooter>
    </MobileCard>
  );
}
