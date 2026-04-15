/**
 * ComboProductSearch - Component tìm kiếm và chọn sản phẩm cho Combo
 * Giống như ProductSearch trong đơn hàng, nhưng:
 * - Loại trừ sản phẩm combo (không cho phép lồng combo)
 * - Loại trừ sản phẩm đã chọn trong combo
 * - Hiển thị tồn kho "Có thể bán"
 */

import * as React from 'react';
import { Package } from 'lucide-react';
import type { Product } from '../types';
import { useProduct } from '../../../hooks/api/use-products';
import { useInfiniteMeiliProductSearch } from '../../../hooks/use-meilisearch';
import { useImageStore } from '../image-store';
import { LazyImage } from '../../../components/ui/lazy-image';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox';

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
    const [selectedValue, setSelectedValue] = React.useState<ComboboxOption | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [pendingProductId, setPendingProductId] = React.useState<string | null>(null);
    
    // ✅ Use Meilisearch for fast product search
    // ✅ Infinite scroll support - load more on scroll
    const {
        data: searchResult,
        isLoading: isLoadingProducts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteMeiliProductSearch({ 
        query: searchQuery,
        debounceMs: 150,
    });
    
    // ✅ Fetch full product data when selected from Meilisearch
    const { data: selectedProduct } = useProduct(pendingProductId ?? undefined);
    
    // When full product is loaded, call onSelectProduct
    React.useEffect(() => {
        if (selectedProduct && pendingProductId) {
            onSelectProduct(selectedProduct);
            setPendingProductId(null);
        }
    }, [selectedProduct, pendingProductId, onSelectProduct]);
    
    // ✅ Filter Meilisearch results (exclude combo products and already selected) - flatten pages
    const searchProducts = React.useMemo(() => {
        const products = searchResult?.pages.flatMap(page => page.data) || [];
        return products.filter(p => 
            p.status !== 'combo' && !excludeProductIds.has(p.systemId)
        );
    }, [searchResult, excludeProductIds]);

    // Convert Meilisearch results to ComboboxOption format
    const options: ComboboxOption[] = React.useMemo(() => {
        return searchProducts.map((p) => {
            return {
                value: p.systemId,
                label: p.name,
                subtitle: p.id, // SKU
                metadata: {
                    costPrice: p.costPrice || 0,
                    thumbnailImage: p.thumbnailImage,
                }
            } as ComboboxOption;
        });
    }, [searchProducts]);

    const handleChange = (option: ComboboxOption | null) => {
        if (option) {
            // Set pending product ID to trigger full product fetch
            setPendingProductId(option.value);
        }
        
        // Reset selection after selecting
        setSelectedValue(null);
    };

    // Product Thumbnail component for combobox options
    const ProductOptionThumbnail = React.memo(({ productSystemId }: { productSystemId: string }) => {
        const searchProduct = searchProducts.find(p => p.systemId === productSystemId);
        const permanentImages = useImageStore(state => state.permanentImages[productSystemId]);
        const lastFetched = useImageStore(state => state.permanentMeta[productSystemId]?.lastFetched);

        const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
        const storeGallery = permanentImages?.gallery?.[0]?.url;
        
        const displayImage = storeThumbnail
            || storeGallery
            || searchProduct?.thumbnailImage;

        // ✅ Batch fetch image if missing
        React.useEffect(() => {
            if (!lastFetched && productSystemId) {
                import('@/features/products/image-store').then(({ queueProductImageFetch }) => {
                    queueProductImageFetch(productSystemId);
                });
            }
        }, [productSystemId, lastFetched]);

        if (displayImage) {
            return (
                <div className="w-10 h-10 shrink-0 rounded overflow-hidden bg-muted">
                    <LazyImage src={displayImage} alt="" className="w-full h-full object-cover" />
                </div>
            );
        }
        return (
            <div className="w-10 h-10 shrink-0 bg-muted rounded flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
            </div>
        );
    });

    const renderOption = (option: ComboboxOption) => {
        const metadata = option.metadata as { costPrice?: number } | undefined;
        
        return (
            <div className="flex items-center gap-3 w-full py-1">
                <ProductOptionThumbnail productSystemId={option.value} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.subtitle}</p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-sm font-medium">{formatCurrency(metadata?.costPrice)}</p>
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
                onSearchChange={setSearchQuery}
                isLoading={isLoadingProducts || !!pendingProductId}
                placeholder="Thêm sản phẩm (F3)"
                searchPlaceholder="Tìm kiếm theo tên, mã SKU..."
                emptyPlaceholder="Không tìm thấy sản phẩm phù hợp"
                disabled={disabled}
                onLoadMore={() => fetchNextPage()}
                hasMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                renderOption={renderOption}
            />
        </div>
    );
}
