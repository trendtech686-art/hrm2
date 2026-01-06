/**
 * ComboProductSearch - Component tìm kiếm và chọn sản phẩm cho Combo
 * Giống như ProductSearch trong đơn hàng, nhưng:
 * - Loại trừ sản phẩm combo (không cho phép lồng combo)
 * - Loại trừ sản phẩm đã chọn trong combo
 * - Hiển thị tồn kho "Có thể bán"
 */

import * as React from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import type { Product } from '../types';
import { useActiveProducts } from '../hooks/use-all-products';
import { useAllPricingPolicies } from '../../settings/pricing/hooks/use-all-pricing-policies';
import { useAllBranches } from '../../settings/branches/hooks/use-all-branches';
import { useImageStore } from '../image-store';
import { FileUploadAPI } from '../../../lib/file-upload-api';
import { LazyImage } from '../../../components/ui/lazy-image';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox';
import { canAddToCombo } from '../combo-utils';
import type { SystemId } from '@/lib/id-types';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

interface ComboProductSearchProps {
    onSelectProduct: (product: Product) => void;
    excludeProductIds: Set<string>; // Products already in combo
    disabled?: boolean;
}

export function ComboProductSearch({ 
    onSelectProduct, 
    excludeProductIds,
    disabled = false 
}: ComboProductSearchProps) {
    const { data: activeProducts } = useActiveProducts();
    const { data: pricingPolicies } = useAllPricingPolicies();
    const { data: branches = [] } = useAllBranches();
    const [selectedValue, setSelectedValue] = React.useState<ComboboxOption | null>(null);

    // Get default selling policy
    const defaultPricingPolicy = React.useMemo(() => {
        return pricingPolicies.find(p => p.isDefault && p.type === 'Bán hàng');
    }, [pricingPolicies]);

    // Only show products that can be added to combo (exclude combos, discontinued, deleted)
    // Also exclude products already in the combo
    const availableProducts = React.useMemo(() => {
        return activeProducts.filter(p => 
            canAddToCombo(p) && !excludeProductIds.has(p.systemId)
        );
    }, [activeProducts, excludeProductIds]);

    // Calculate total available stock (on-hand - committed) across all branches
    const getAvailableStock = (product: Product): number => {
        let totalAvailable = 0;
        const inventoryByBranch = product.inventoryByBranch || {};
        const committedByBranch = product.committedByBranch || {};
        
        for (const branchId of Object.keys(inventoryByBranch)) {
            const onHand = inventoryByBranch[branchId as SystemId] || 0;
            const committed = committedByBranch[branchId as SystemId] || 0;
            totalAvailable += Math.max(0, onHand - committed);
        }
        
        return totalAvailable;
    };

    // Convert to ComboboxOption format
    const options: ComboboxOption[] = React.useMemo(() => {
        return availableProducts.map((p) => {
            const availableStock = getAvailableStock(p);
            const price = defaultPricingPolicy 
                ? p.prices[defaultPricingPolicy.systemId] 
                : (Object.values(p.prices || {})[0] || 0);
            const totalOnHand = Object.values(p.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0);
            const branchDetails = branches.map(branch => {
                const onHand = p.inventoryByBranch?.[branch.systemId as SystemId] || 0;
                const committed = p.committedByBranch?.[branch.systemId as SystemId] || 0;
                return {
                    name: branch.name,
                    onHand,
                    sellable: Math.max(0, onHand - committed),
                };
            });
            
            return {
                value: p.systemId,
                label: p.name,
                subtitle: p.id, // SKU
                metadata: {
                    price: price,
                    availableStock: availableStock,
                    isLowStock: availableStock <= 0,
                    totalOnHand,
                    costPrice: p.costPrice,
                    branchDetails,
                }
            } as ComboboxOption;
        });
    }, [availableProducts, defaultPricingPolicy, branches]);

    const handleChange = (option: ComboboxOption | null) => {
        if (option) {
            const product = availableProducts.find(p => p.systemId === option.value);
            if (product) {
                onSelectProduct(product);
            }
        }
        
        // Reset selection after selecting
        setSelectedValue(null);
    };

    // Product Thumbnail component for combobox options
    const ProductOptionThumbnail = React.memo(({ productSystemId }: { productSystemId: string }) => {
        const product = availableProducts.find(p => p.systemId === productSystemId);
        const permanentImages = useImageStore(state => state.permanentImages[productSystemId]);
        const lastFetched = useImageStore(state => state.permanentMeta[productSystemId]?.lastFetched);
        const updatePermanentImages = useImageStore(state => state.updatePermanentImages);

        const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
        const storeGallery = permanentImages?.gallery?.[0]?.url;
        
        const displayImage = storeThumbnail
            || storeGallery
            || product?.thumbnailImage
            || product?.galleryImages?.[0]
            || product?.images?.[0];

        React.useEffect(() => {
            if (!lastFetched && productSystemId) {
                FileUploadAPI.getProductFiles(productSystemId)
                    .then(files => {
                        const mapFile = (f: { id: string; name: string; originalName: string; slug: string; filename: string; size: number; type: string; url: string; uploadedAt: string; metadata: string | Record<string, unknown> }) => ({
                            id: f.id, sessionId: '', name: f.name, originalName: f.originalName,
                            slug: f.slug, filename: f.filename, size: f.size, type: f.type, url: f.url,
                            status: 'permanent' as const, uploadedAt: f.uploadedAt, metadata: typeof f.metadata === 'string' ? f.metadata : JSON.stringify(f.metadata)
                        });
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        updatePermanentImages(productSystemId, 'thumbnail', (files.filter(f => f.documentName === 'thumbnail') as any[]).map(mapFile));
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        updatePermanentImages(productSystemId, 'gallery', (files.filter(f => f.documentName === 'gallery') as any[]).map(mapFile));
                    })
                    .catch(() => {});
            }
        }, [productSystemId, lastFetched, updatePermanentImages]);

        if (displayImage) {
            return (
                <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-muted">
                    <LazyImage src={displayImage} alt="" className="w-full h-full object-cover" />
                </div>
            );
        }
        return (
            <div className="w-10 h-10 flex-shrink-0 bg-muted rounded flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
            </div>
        );
    });

    const renderOption = (option: ComboboxOption) => {
        const metadata = option.metadata as { isLowStock?: boolean; costPrice?: number; totalOnHand?: number; availableStock?: number } | undefined;
        const isLowStock = metadata?.isLowStock;
        
        return (
            <div className="flex items-center gap-3 w-full py-1">
                <ProductOptionThumbnail productSystemId={option.value} />
                <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium truncate">{option.label}</p>
                    <p className="text-body-xs text-muted-foreground">{option.subtitle}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-body-sm font-medium">{formatCurrency(metadata?.costPrice)}</p>
                    <p className={`text-body-xs ${isLowStock ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {isLowStock && <AlertTriangle className="h-3 w-3 inline mr-0.5" />}
                        Tồn: {metadata?.totalOnHand || 0} | Bán: {metadata?.availableStock || 0}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1">
            <VirtualizedCombobox
                options={options}
                value={selectedValue}
                onChange={handleChange}
                placeholder="Thêm sản phẩm (F3)"
                searchPlaceholder="Tìm kiếm theo tên, mã SKU..."
                emptyPlaceholder="Không tìm thấy sản phẩm phù hợp"
                disabled={disabled}
                renderOption={renderOption}
            />
        </div>
    );
}
