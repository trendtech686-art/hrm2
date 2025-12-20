/**
 * Dialog hiển thị chi tiết thương hiệu từ PKGX
 */
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Loader2, Globe, Search, AlignLeft } from 'lucide-react';
import { getBrandById } from '@/lib/pkgx/api-service';
import type { Brand } from '@/features/settings/inventory/types';

type PkgxBrandData = {
  brand_id: number;
  brand_name: string;
  brand_logo?: string;
  brand_desc?: string;
  short_desc?: string;
  long_desc?: string;
  keywords?: string;
  meta_title?: string;
  meta_desc?: string;
  site_url?: string;
  sort_order?: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand | null;
  pkgxBrandId: number | null;
};

export function PkgxBrandDetailDialog({ open, onOpenChange, brand, pkgxBrandId }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [pkgxData, setPkgxData] = React.useState<PkgxBrandData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch PKGX brand data
  const fetchPkgxData = React.useCallback(async () => {
    if (!pkgxBrandId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getBrandById(pkgxBrandId);
      if (response.success && response.data) {
        setPkgxData(response.data);
      } else {
        setError(response.error || 'Không thể tải thông tin từ PKGX');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  }, [pkgxBrandId]);

  // Fetch when dialog opens
  React.useEffect(() => {
    if (open && pkgxBrandId) {
      fetchPkgxData();
    }
  }, [open, pkgxBrandId, fetchPkgxData]);

  // Reset when dialog closes
  React.useEffect(() => {
    if (!open) {
      setPkgxData(null);
      setError(null);
    }
  }, [open]);

  const handleOpenAdmin = () => {
    if (pkgxBrandId) {
      window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&id=${pkgxBrandId}`, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Thông tin trên PKGX</span>
            {brand && <Badge variant="outline">{brand.name}</Badge>}
          </DialogTitle>
          <DialogDescription>
            Dữ liệu hiện tại của thương hiệu trên website PKGX
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Đang tải...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <p>{error}</p>
            </div>
          ) : pkgxData ? (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">ID PKGX</p>
                    <p className="font-medium">{pkgxData.brand_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tên thương hiệu</p>
                    <p className="font-medium">{pkgxData.brand_name || '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Website URL</p>
                    <p className="font-medium">{pkgxData.site_url || '—'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* SEO Info */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground">
                  <Search className="h-4 w-4" />
                  SEO
                </h4>
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Keywords</p>
                    <p className="text-sm">{pkgxData.keywords || <span className="text-muted-foreground italic">Chưa có</span>}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Meta Title</p>
                    <p className="text-sm">{pkgxData.meta_title || <span className="text-muted-foreground italic">Chưa có</span>}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Meta Description</p>
                    <p className="text-sm">{pkgxData.meta_desc || <span className="text-muted-foreground italic">Chưa có</span>}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Descriptions */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2 text-sm text-muted-foreground">
                  <AlignLeft className="h-4 w-4" />
                  Mô tả
                </h4>
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Mô tả ngắn (Short Desc)</p>
                    <div 
                      className="text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: pkgxData.short_desc || '<span class="text-muted-foreground italic">Chưa có</span>' }}
                    />
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Mô tả dài (Long Desc)</p>
                    <div 
                      className="text-sm prose prose-sm max-w-none max-h-40 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: pkgxData.long_desc || '<span class="text-muted-foreground italic">Chưa có</span>' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={handleOpenAdmin}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Mở trang Admin PKGX
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
