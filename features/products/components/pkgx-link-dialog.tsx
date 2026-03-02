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
import { useAllProducts } from '../hooks/use-all-products';
import { useProductMutations } from '../hooks/use-products';
import type { Product } from '../types';
import { usePkgxProductsCache } from '@/features/settings/pkgx/hooks/use-pkgx-settings';

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
  const { update: updateMutation } = useProductMutations();
  
  // Use products cache - loads from /api/pkgx/products-cache on demand
  const { data: pkgxProductsData, isLoading, refetch } = usePkgxProductsCache();
  const pkgxProducts = React.useMemo(() => pkgxProductsData?.products ?? [], [pkgxProductsData?.products]);
  
  const [selectedPkgxProduct, setSelectedPkgxProduct] = React.useState<ComboboxOption | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);

  // Load PKGX products khi mở dialog lần đầu
  React.useEffect(() => {
    if (open && pkgxProducts.length === 0 && !isLoading) {
      refetch();
    }
  }, [open, pkgxProducts.length, isLoading, refetch]);

  // Reset state khi đóng dialog
  React.useEffect(() => {
    if (!open) {
      setSelectedPkgxProduct(null);
    }
  }, [open]);

  // Filter out products that are already linked
  const { data: hrmProducts } = useAllProducts();
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
      updateMutation.mutate({ systemId: product.systemId, pkgxId });
      
      // Log to console

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
      <DialogContent className="sm:max-w-125">
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
