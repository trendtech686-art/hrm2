import * as React from 'react';
import { Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VirtualizedCombobox, type ComboboxOption } from '@/components/ui/virtualized-combobox';
import { useProductMutations } from '../hooks/use-products';
import type { Product } from '../types';
import { logError } from '@/lib/logger'
import { useDebouncedValue } from '@/hooks/use-server-filters'

const PKGX_PAGE_SIZE = 30;

interface PkgxLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess?: (pkgxId: number) => void;
}

function useInfinitePkgxProducts({ search, enabled }: { search: string; enabled: boolean }) {
  const debouncedSearch = useDebouncedValue(search, 300);
  return useInfiniteQuery({
    queryKey: ['meili-pkgx-products-infinite', debouncedSearch],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        q: debouncedSearch,
        limit: String(PKGX_PAGE_SIZE),
        offset: String(pageParam),
        mapped: 'false',
      });
      const res = await fetch(`/api/search/pkgx-products?${params}`);
      if (!res.ok) throw new Error('Failed to search PKGX products');
      const json = await res.json();
      return { data: json.data || [], total: json.meta?.total || 0 };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
      if (totalLoaded >= lastPage.total) return undefined;
      return totalLoaded;
    },
    enabled,
    staleTime: 30 * 1000,
  });
}

export function PkgxLinkDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: PkgxLinkDialogProps) {
  const { update: updateMutation } = useProductMutations();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPkgxProduct, setSelectedPkgxProduct] = React.useState<ComboboxOption | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePkgxProducts({
    search: searchQuery,
    enabled: open,
  });

  // Reset state khi đóng dialog
  React.useEffect(() => {
    if (!open) {
      setSelectedPkgxProduct(null);
      setSearchQuery('');
    }
  }, [open]);

  // Convert PKGX products to combobox options
  const pkgxOptions: ComboboxOption[] = React.useMemo(() => {
    const products = data?.pages.flatMap(page => page.data) || [];
    return products.map((p: Record<string, unknown>) => ({
      value: String(p.id || p.goods_id),
      label: (p.name || p.goods_name || '') as string,
      subtitle: `ID: ${p.id || p.goods_id} | Mã: ${(p.goodsSn || p.goods_sn || '-') as string}`,
      metadata: p,
    }));
  }, [data]);

  const handleConfirmLink = async () => {
    if (!product || !selectedPkgxProduct) {
      toast.error('Vui lòng chọn sản phẩm PKGX để liên kết');
      return;
    }

    setIsSyncing(true);
    try {
      const pkgxId = Number(selectedPkgxProduct.value);
      
      // Update HRM product with pkgxId
      updateMutation.mutate({ systemId: product.systemId, pkgxId });
      
      // Log to console

      toast.success(`Đã liên kết với sản phẩm PKGX: ${selectedPkgxProduct.label}`);
      onSuccess?.(pkgxId);
      onOpenChange(false);
    } catch (error) {
      logError('[PKGX Link Error]', error);
      toast.error('Lỗi khi liên kết sản phẩm');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent mobileFullScreen className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Liên kết với sản phẩm PKGX</DialogTitle>
          <DialogDescription>
            Chọn sản phẩm PKGX để liên kết với sản phẩm HRM này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* HRM Product Info */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Sản phẩm HRM:</p>
            <p className="text-sm">{product.name}</p>
            <p className="text-xs text-muted-foreground">
              Mã: {product.id} | SystemID: {product.systemId}
            </p>
          </div>

          {/* PKGX Product Selector */}
          <div className="space-y-2">
            <label htmlFor="pkgx-product-select" className="text-sm font-medium">Chọn sản phẩm PKGX</label>
            <VirtualizedCombobox
              id="pkgx-product-select"
              value={selectedPkgxProduct}
              onChange={setSelectedPkgxProduct}
              options={pkgxOptions}
              placeholder="Tìm và chọn sản phẩm PKGX..."
              searchPlaceholder="Tìm theo tên hoặc mã..."
              emptyPlaceholder={isLoading ? 'Đang tải...' : 'Không tìm thấy sản phẩm PKGX'}
              isLoading={isLoading}
              disabled={isLoading}
              onSearchChange={setSearchQuery}
              onLoadMore={() => fetchNextPage()}
              hasMore={!!hasNextPage}
              isLoadingMore={isFetchingNextPage}
            />
            {pkgxOptions.length === 0 && !isLoading && (
              <p className="text-xs text-muted-foreground">
                Tất cả sản phẩm PKGX đã được liên kết. Hãy đồng bộ danh sách mới từ PKGX.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSyncing}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmLink}
            disabled={!selectedPkgxProduct || isSyncing}
          >
            <Link2 className="h-4 w-4 mr-2" />
            {isSyncing ? 'Đang liên kết...' : 'Liên kết'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
