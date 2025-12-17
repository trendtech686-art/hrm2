import * as React from 'react';
import { Link2 } from 'lucide-react';
import { toast } from 'sonner';
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
import { usePkgxSettingsStore } from '@/features/settings/pkgx/store';
import { useProductStore } from '../store';
import type { Product } from '../types';
import type { PkgxProduct } from '@/features/settings/pkgx/types';
import { getProducts as fetchPkgxProducts } from '@/lib/pkgx/api-service';

interface PkgxLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess?: (pkgxId: number) => void;
}

export function PkgxLinkDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: PkgxLinkDialogProps) {
  const { update } = useProductStore();
  const pkgxSettingsStore = usePkgxSettingsStore();
  const cachedPkgxProducts = pkgxSettingsStore.settings.pkgxProducts;
  const setPkgxProducts = pkgxSettingsStore.setPkgxProducts;
  
  const [selectedPkgxProduct, setSelectedPkgxProduct] = React.useState<ComboboxOption | null>(null);
  const [pkgxProducts, setPkgxProductsLocal] = React.useState<PkgxProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [hasFetched, setHasFetched] = React.useState(false);

  // Load PKGX products khi mở dialog - chỉ chạy 1 lần
  React.useEffect(() => {
    if (open && !hasFetched) {
      if (cachedPkgxProducts && cachedPkgxProducts.length > 0) {
        setPkgxProductsLocal(cachedPkgxProducts);
        setHasFetched(true);
      } else {
        loadPkgxProducts();
      }
    }
  }, [open, hasFetched, cachedPkgxProducts]);

  // Reset state khi đóng dialog
  React.useEffect(() => {
    if (!open) {
      setSelectedPkgxProduct(null);
    }
  }, [open]);

  const loadPkgxProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetchPkgxProducts(1, 1000);
      if (response.success && response.data && response.data.data) {
        // API trả về { data: PkgxProduct[], pagination: {...} }
        const productsArray = Array.isArray(response.data.data) ? response.data.data : [];
        setPkgxProductsLocal(productsArray);
        setPkgxProducts(productsArray); // Lưu vào store để dùng chung
        setHasFetched(true);
      }
    } catch (error) {
      console.error('Failed to load PKGX products:', error);
      toast.error('Không thể tải danh sách sản phẩm PKGX');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out products that are already linked
  const { data: hrmProducts } = useProductStore();
  const linkedPkgxIds = React.useMemo(() => {
    return new Set(hrmProducts.filter(p => p.pkgxId).map(p => p.pkgxId));
  }, [hrmProducts]);

  // Convert PKGX products to combobox options
  const pkgxOptions: ComboboxOption[] = React.useMemo(() => {
    return pkgxProducts
      .filter(p => !linkedPkgxIds.has(p.goods_id)) // Exclude already linked
      .map(p => ({
        value: String(p.goods_id),
        label: p.goods_name,
        subtitle: `ID: ${p.goods_id} | Mã: ${p.goods_sn || '-'}`,
        metadata: p,
      }));
  }, [pkgxProducts, linkedPkgxIds]);

  const handleConfirmLink = async () => {
    if (!product || !selectedPkgxProduct) {
      toast.error('Vui lòng chọn sản phẩm PKGX để liên kết');
      return;
    }

    setIsSyncing(true);
    try {
      const pkgxId = Number(selectedPkgxProduct.value);
      
      // Update HRM product with pkgxId
      update(product.systemId as any, { pkgxId });
      
      // Log to console
      console.log('[PKGX Link]', {
        action: 'link_product',
        status: 'success',
        productId: product.systemId,
        pkgxId,
        pkgxProductName: selectedPkgxProduct.label,
      });

      toast.success(`Đã liên kết với sản phẩm PKGX: ${selectedPkgxProduct.label}`);
      onSuccess?.(pkgxId);
      onOpenChange(false);
    } catch (error) {
      console.error('[PKGX Link Error]', error);
      toast.error('Lỗi khi liên kết sản phẩm');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
            <label className="text-sm font-medium">Chọn sản phẩm PKGX</label>
            <VirtualizedCombobox
              value={selectedPkgxProduct}
              onChange={setSelectedPkgxProduct}
              options={pkgxOptions}
              placeholder="Tìm và chọn sản phẩm PKGX..."
              searchPlaceholder="Tìm theo tên hoặc mã..."
              emptyPlaceholder={isLoading ? 'Đang tải...' : 'Không tìm thấy sản phẩm PKGX'}
              isLoading={isLoading}
              disabled={isLoading}
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
