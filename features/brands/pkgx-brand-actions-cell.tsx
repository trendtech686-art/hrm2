/**
 * PkgxBrandActionsCell - Shared dropdown component for PKGX brand sync actions
 * 
 * Uses usePkgxEntitySync hook for consistent sync behavior
 */

import * as React from 'react';
import { MoreHorizontal, RefreshCw, Globe, Search, AlignLeft, Eye, Link2, Unlink, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import type { Brand } from '../settings/inventory/types';
import { usePkgxEntitySync } from '../settings/pkgx/hooks';
import type { HrmBrandData } from '../settings/pkgx/hooks';
import { PkgxSyncConfirmDialog } from '../settings/pkgx/components/pkgx-sync-confirm-dialog';
import { usePkgxSettingsStore } from '../settings/pkgx/store';

interface PkgxBrandActionsCellProps {
  brand: Brand;
  hasPkgxMapping: boolean;
  pkgxBrandId?: number;
  onPkgxLink?: (brand: Brand) => void;
  onPkgxUnlink?: (brand: Brand) => void;
  onPkgxViewDetail?: (brand: Brand, pkgxBrandId: number) => void;
}

export function PkgxBrandActionsCell({
  brand,
  hasPkgxMapping,
  pkgxBrandId,
  onPkgxLink,
  onPkgxUnlink,
  onPkgxViewDetail,
}: PkgxBrandActionsCellProps) {
  const { addLog } = usePkgxSettingsStore();
  
  // Use shared entity sync hook
  const entitySync = usePkgxEntitySync({
    entityType: 'brand',
    onLog: addLog,
  });
  
  // Build HRM brand data for sync
  const buildHrmData = (): HrmBrandData => ({
    systemId: brand.systemId,
    name: brand.name,
    website: brand.website,
    seoKeywords: brand.websiteSeo?.pkgx?.seoKeywords || brand.seoKeywords,
    seoTitle: brand.websiteSeo?.pkgx?.seoTitle || brand.seoTitle,
    metaDescription: brand.websiteSeo?.pkgx?.metaDescription || brand.metaDescription,
    shortDescription: brand.websiteSeo?.pkgx?.shortDescription || brand.shortDescription,
    longDescription: brand.websiteSeo?.pkgx?.longDescription || brand.longDescription || brand.description,
    websiteSeo: brand.websiteSeo,
  });
  
  // Helper to trigger sync
  const triggerSync = (actionKey: 'sync_all' | 'sync_basic' | 'sync_seo' | 'sync_description') => {
    if (!pkgxBrandId) return;
    const hrmData = buildHrmData();
    entitySync.triggerSyncAction(actionKey, pkgxBrandId, hrmData, brand.name);
  };
  
  return (
    <>
      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              className={`h-8 w-8 p-0 ${hasPkgxMapping ? "text-primary" : "text-muted-foreground"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">PKGX menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            {hasPkgxMapping ? (
              <>
                {/* Sync All */}
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_all')}
                  className="font-medium"
                  title="Đồng bộ: Tên, Website, Keywords, Meta Title, Meta Desc, Mô tả ngắn, Mô tả dài"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Đồng bộ tất cả
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* Individual sync actions */}
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_basic')}
                  title="Đồng bộ: Tên thương hiệu, Website URL"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Thông tin cơ bản
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_seo')}
                  title="Đồng bộ: Keywords, Meta Title, Meta Desc"
                >
                  <Search className="mr-2 h-4 w-4" />
                  SEO
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={() => triggerSync('sync_description')}
                  title="Đồng bộ: Mô tả ngắn (Short Desc), Mô tả dài (Long Desc)"
                >
                  <AlignLeft className="mr-2 h-4 w-4" />
                  Mô tả
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                {onPkgxViewDetail && pkgxBrandId && (
                  <DropdownMenuItem 
                    onSelect={() => onPkgxViewDetail(brand, pkgxBrandId)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Xem trên PKGX
                  </DropdownMenuItem>
                )}
                
                {/* Hủy liên kết */}
                {onPkgxUnlink && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onSelect={() => entitySync.handleConfirm(
                        'Hủy liên kết PKGX',
                        `Bạn có chắc muốn hủy liên kết thương hiệu "${brand.name}" với PKGX?`,
                        () => onPkgxUnlink(brand)
                      )}
                      className="text-destructive"
                    >
                      <Unlink className="mr-2 h-4 w-4" />
                      Hủy liên kết
                    </DropdownMenuItem>
                  </>
                )}
              </>
            ) : (
              /* Not linked - show link option */
              <>
                {onPkgxLink && (
                  <DropdownMenuItem onSelect={() => onPkgxLink(brand)}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Liên kết với PKGX
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Confirmation Dialog - using shared component */}
      <PkgxSyncConfirmDialog
        confirmAction={entitySync.confirmAction}
        isSyncing={entitySync.isSyncing}
        onConfirm={entitySync.executeAction}
        onCancel={entitySync.cancelConfirm}
      />
    </>
  );
}
