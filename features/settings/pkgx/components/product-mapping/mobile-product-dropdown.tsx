'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '../../../../../components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../../../../../components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  RefreshCw, 
  FileText, 
  DollarSign, 
  Package, 
  Search, 
  AlignLeft, 
  Tag, 
  ExternalLink, 
  Unlink, 
  Link2 
} from 'lucide-react';
import type { PkgxProduct } from '../../types';
import type { PkgxProductRow } from './types';
import type { usePkgxEntitySync, HrmProductData } from '../../hooks';

// ========================================
// Mobile Product Dropdown Component
// ========================================

export interface MobileProductDropdownProps {
  row: PkgxProductRow;
  entitySync: ReturnType<typeof usePkgxEntitySync>;
  onViewOnPkgx: (goodsId: number) => void;
  onOpenLinkDialog: (row: PkgxProduct) => void;
  onOpenUnlinkDialog: (row: PkgxProduct) => void;
}

export function MobileProductDropdown({ 
  row, 
  entitySync, 
  onViewOnPkgx, 
  onOpenLinkDialog, 
  onOpenUnlinkDialog 
}: MobileProductDropdownProps) {
  // Helper to build HRM product data for sync
  const buildHrmData = React.useCallback((): HrmProductData | null => {
    if (!row.linkedHrmProduct) return null;
    return {
      systemId: row.linkedHrmProduct.systemId,
      name: row.linkedHrmProduct.name,
      sku: row.linkedHrmProduct.sku,
      sellingPrice: row.linkedHrmProduct.sellingPrice,
      costPrice: row.linkedHrmProduct.costPrice,
      dealPrice: row.linkedHrmProduct.dealPrice,
      quantity: row.linkedHrmProduct.quantity,
      seoKeywords: row.linkedHrmProduct.seoKeywords,
      ktitle: row.linkedHrmProduct.ktitle,
      seoDescription: row.linkedHrmProduct.seoDescription,
      shortDescription: row.linkedHrmProduct.shortDescription,
      description: row.linkedHrmProduct.description,
      isBest: row.linkedHrmProduct.isBest,
      isNew: row.linkedHrmProduct.isNew,
      isHot: row.linkedHrmProduct.isHot,
      isHome: row.linkedHrmProduct.isHome,
      categorySystemId: row.linkedHrmProduct.categorySystemId,
      brandSystemId: row.linkedHrmProduct.brandSystemId,
    };
  }, [row.linkedHrmProduct]);
  
  // Helper to trigger sync with proper HRM data
  const triggerSync = React.useCallback((
    actionKey: 'sync_all' | 'sync_basic' | 'sync_seo' | 'sync_description' | 'sync_price' | 'sync_inventory' | 'sync_flags'
  ) => {
    const hrmData = buildHrmData();
    if (!hrmData) {
      toast.error('Sản phẩm chưa được liên kết với HRM');
      return;
    }
    entitySync.triggerSyncAction(actionKey, row.goods_id, hrmData, row.goods_name);
  }, [buildHrmData, entitySync, row.goods_id, row.goods_name]);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Tùy chọn">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {row.linkedHrmProduct ? (
          <>
            {/* Sync All */}
            <DropdownMenuItem 
              onClick={() => triggerSync('sync_all')}
              className="font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Đồng bộ tất cả
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => triggerSync('sync_basic')}>
              <FileText className="h-4 w-4 mr-2" />
              Thông tin cơ bản
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerSync('sync_price')}>
              <DollarSign className="h-4 w-4 mr-2" />
              Giá
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerSync('sync_inventory')}>
              <Package className="h-4 w-4 mr-2" />
              Tồn kho
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerSync('sync_seo')}>
              <Search className="h-4 w-4 mr-2" />
              SEO
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerSync('sync_description')}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Mô tả
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerSync('sync_flags')}>
              <Tag className="h-4 w-4 mr-2" />
              Flags
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewOnPkgx(row.goods_id)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem trên PKGX
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onOpenUnlinkDialog(row)}
              className="text-destructive focus:text-destructive"
            >
              <Unlink className="h-4 w-4 mr-2" />
              Hủy liên kết
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => onOpenLinkDialog(row)}>
              <Link2 className="h-4 w-4 mr-2" />
              Liên kết với HRM
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
