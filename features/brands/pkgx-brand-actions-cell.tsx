/**
 * PkgxBrandActionsCell - Shared dropdown component for PKGX brand sync actions
 * 
 * Uses usePkgxBrandSync hook for consistent sync behavior (same as detail page)
 */

import * as React from 'react';
import { MoreHorizontal, RefreshCw, Globe, Search, AlignLeft, Eye, Link2, Unlink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import type { Brand } from '../settings/inventory/types';
import { usePkgxBrandSync } from './hooks/use-pkgx-brand-sync';
import { PkgxSyncConfirmDialog } from '../settings/pkgx/components/pkgx-sync-confirm-dialog';
import type { ConfirmActionState } from '../settings/pkgx/hooks/use-pkgx-entity-sync';

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
  // Use the same sync hook as detail page
  const pkgxSync = usePkgxBrandSync();
  
  // State for confirmation dialog
  const [confirmAction, setConfirmAction] = React.useState<ConfirmActionState>({
    open: false,
    title: '',
    description: '',
    action: null,
  });
  const [isSyncing, setIsSyncing] = React.useState(false);
  
  // Helper to handle confirm dialog
  const handleConfirm = (title: string, description: string, action: () => void | Promise<void>) => {
    setConfirmAction({
      open: true,
      title,
      description,
      action: async () => {
        setIsSyncing(true);
        try {
          await action();
        } finally {
          setIsSyncing(false);
          setConfirmAction({ open: false, title: '', description: '', action: null });
        }
      },
    });
  };
  
  // Helper to trigger sync with confirmation
  const triggerSync = (actionType: string) => {
    if (!pkgxBrandId) return;
    
    const actionMap: Record<string, { title: string; handler: () => Promise<void> | void }> = {
      sync_all: {
        title: 'Đồng bộ tất cả',
        handler: () => pkgxSync.handleSyncAll(brand),
      },
      sync_basic: {
        title: 'Đồng bộ thông tin cơ bản',
        handler: () => pkgxSync.handleSyncBasicInfo(brand),
      },
      sync_seo: {
        title: 'Đồng bộ SEO',
        handler: () => pkgxSync.handleSyncSeo(brand),
      },
      sync_description: {
        title: 'Đồng bộ mô tả',
        handler: () => pkgxSync.handleSyncDescription(brand),
      },
    };
    
    const action = actionMap[actionType];
    if (action) {
      handleConfirm(
        action.title,
        `Bạn có chắc muốn ${action.title.toLowerCase()} cho "${brand.name}" lên PKGX?`,
        action.handler
      );
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} role="presentation">
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
          <DropdownMenuContent 
            align="end" 
            onClick={(e) => e.stopPropagation()}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
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
                      onSelect={() => handleConfirm(
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
      
      {/* Confirmation Dialog */}
      <PkgxSyncConfirmDialog
        confirmAction={confirmAction}
        isSyncing={isSyncing}
        onConfirm={() => confirmAction.action?.()}
        onCancel={() => setConfirmAction({ open: false, title: '', description: '', action: null })}
      />
    </>
  );
}
