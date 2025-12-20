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
import type { Brand } from '@/features/settings/inventory/types';
import type { PkgxBrand } from '@/features/settings/pkgx/types';
import { getBrands as fetchPkgxBrands } from '@/lib/pkgx/api-service';

interface PkgxBrandLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand | null;
  onSuccess?: (pkgxBrandId: number) => void;
}

export function PkgxBrandLinkDialog({
  open,
  onOpenChange,
  brand,
  onSuccess,
}: PkgxBrandLinkDialogProps) {
  const pkgxSettingsStore = usePkgxSettingsStore();
  const cachedPkgxBrands = pkgxSettingsStore.settings.brands;
  const brandMappings = pkgxSettingsStore.settings.brandMappings;
  const addBrandMapping = pkgxSettingsStore.addBrandMapping;
  const setBrands = pkgxSettingsStore.setBrands;
  
  const [selectedPkgxBrand, setSelectedPkgxBrand] = React.useState<ComboboxOption | null>(null);
  const [pkgxBrands, setPkgxBrandsLocal] = React.useState<PkgxBrand[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [hasFetched, setHasFetched] = React.useState(false);

  // Load PKGX brands khi mở dialog - chỉ chạy 1 lần
  React.useEffect(() => {
    if (open && !hasFetched) {
      if (cachedPkgxBrands && cachedPkgxBrands.length > 0) {
        setPkgxBrandsLocal(cachedPkgxBrands);
        setHasFetched(true);
      } else {
        loadPkgxBrands();
      }
    }
  }, [open, hasFetched, cachedPkgxBrands]);

  // Reset state khi đóng dialog
  React.useEffect(() => {
    if (!open) {
      setSelectedPkgxBrand(null);
    }
  }, [open]);

  const loadPkgxBrands = async () => {
    setIsLoading(true);
    try {
      const response = await fetchPkgxBrands();
      if (response.success && response.data && response.data.data) {
        // API trả về { error, message, total, data: PkgxBrandFromApi[] }
        // Cần map từ PkgxBrandFromApi -> PkgxBrand
        const brandsArray = response.data.data.map(b => ({
          id: b.brand_id,
          name: b.brand_name,
          brand_logo: b.brand_logo,
          brand_desc: b.brand_desc,
          site_url: b.site_url,
          sort_order: b.sort_order,
        }));
        setPkgxBrandsLocal(brandsArray);
        setBrands(brandsArray); // Lưu vào store để dùng chung
        setHasFetched(true);
      }
    } catch (error) {
      console.error('Failed to load PKGX brands:', error);
      toast.error('Không thể tải danh sách thương hiệu PKGX');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out brands that are already linked
  const linkedPkgxBrandIds = React.useMemo(() => {
    return new Set(brandMappings.map(m => m.pkgxBrandId));
  }, [brandMappings]);

  // Convert PKGX brands to combobox options
  const pkgxOptions: ComboboxOption[] = React.useMemo(() => {
    return pkgxBrands
      .filter(b => !linkedPkgxBrandIds.has(b.id)) // Exclude already linked
      .map(b => ({
        value: String(b.id),
        label: b.name,
        subtitle: `ID: ${b.id}`,
        metadata: b,
      }));
  }, [pkgxBrands, linkedPkgxBrandIds]);

  const handleConfirmLink = async () => {
    if (!brand || !selectedPkgxBrand) {
      toast.error('Vui lòng chọn thương hiệu PKGX để liên kết');
      return;
    }

    setIsSyncing(true);
    try {
      const pkgxBrandId = Number(selectedPkgxBrand.value);
      
      // Add mapping to store
      addBrandMapping({
        id: `brand-mapping-${brand.systemId}-${pkgxBrandId}`,
        hrmBrandSystemId: brand.systemId,
        hrmBrandName: brand.name,
        pkgxBrandId: pkgxBrandId,
        pkgxBrandName: selectedPkgxBrand.label,
      });
      
      // Log to console
      console.log('[PKGX Brand Link]', {
        action: 'link_brand',
        status: 'success',
        brandId: brand.systemId,
        pkgxBrandId,
        pkgxBrandName: selectedPkgxBrand.label,
      });

      toast.success(`Đã liên kết với thương hiệu PKGX: ${selectedPkgxBrand.label}`);
      onSuccess?.(pkgxBrandId);
      onOpenChange(false);
    } catch (error) {
      console.error('[PKGX Brand Link Error]', error);
      toast.error('Lỗi khi liên kết thương hiệu');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!brand) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Liên kết với thương hiệu PKGX</DialogTitle>
          <DialogDescription>
            Chọn thương hiệu PKGX để liên kết với thương hiệu HRM này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* HRM Brand Info */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Thương hiệu HRM:</p>
            <p className="text-sm">{brand.name}</p>
            <p className="text-xs text-muted-foreground">
              Mã: {brand.id} | SystemID: {brand.systemId}
            </p>
          </div>

          {/* PKGX Brand Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Chọn thương hiệu PKGX</label>
            <VirtualizedCombobox
              value={selectedPkgxBrand}
              onChange={setSelectedPkgxBrand}
              options={pkgxOptions}
              placeholder="Tìm và chọn thương hiệu PKGX..."
              searchPlaceholder="Tìm theo tên..."
              emptyPlaceholder={isLoading ? 'Đang tải...' : 'Không tìm thấy thương hiệu PKGX'}
              isLoading={isLoading}
              disabled={isLoading}
            />
            {pkgxOptions.length === 0 && !isLoading && (
              <p className="text-xs text-muted-foreground">
                Tất cả thương hiệu PKGX đã được liên kết. Hãy đồng bộ danh sách mới từ PKGX.
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
            disabled={!selectedPkgxBrand || isSyncing}
          >
            <Link2 className="h-4 w-4 mr-2" />
            {isSyncing ? 'Đang liên kết...' : 'Liên kết'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
