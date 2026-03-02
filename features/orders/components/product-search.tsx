
import * as React from 'react';
import { PlusCircle, Package, Info } from 'lucide-react';
import type { Product } from '../../products/types';
import type { ProductFormValues } from '../../products/validation';
import { useProduct } from '../../../hooks/api/use-products';
import { useInfiniteMeiliProductSearch } from '../../../hooks/use-meilisearch';
import { useActiveUnits } from '../../settings/units/hooks/use-all-units';
import { useAllPricingPolicies } from '../../settings/pricing/hooks/use-all-pricing-policies';
import { LazyImage } from '../../../components/ui/lazy-image';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { NumberInput } from '../../../components/ui/number-input';
import { Combobox } from '../../../components/ui/combobox';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const SimplifiedProductForm = ({ onSubmit }: { onSubmit: (values: ProductFormValues) => void; }) => {
    const { data: activeUnits } = useActiveUnits();
    const { data: pricingPolicies } = useAllPricingPolicies();

    const unitOptions = React.useMemo(() => activeUnits.map(u => ({ value: u.name, label: u.name })), [activeUnits]);
    const defaultSellingPolicy = React.useMemo(() => pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault), [pricingPolicies]);

    const [formData, setFormData] = React.useState({
        id: '',
        name: "",
        unit: "Cái",
        costPrice: 0,
        defaultPrice: 0
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalValues: ProductFormValues = { 
            ...formData, 
            prices: defaultSellingPolicy ? { [defaultSellingPolicy.systemId]: formData.defaultPrice } : {}, 
            primarySupplierSystemId: undefined,
            inventory: 0,
            weight: 0,
            weightUnit: 'g'
        };
        onSubmit(finalValues);
    };

    return (
        <form id="simplified-product-form" onSubmit={handleFormSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Mã SKU</label>
                    <Input 
                        value={formData.id} 
                        onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tên sản phẩm</label>
                    <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">ĐVT</label>
                    <Combobox
                        options={unitOptions}
                        value={unitOptions.find(opt => opt.value === formData.unit) || null}
                        onChange={option => setFormData(prev => ({ ...prev, unit: option ? option.value : 'Cái' }))}
                        placeholder="Chọn đơn vị tính"
                        searchPlaceholder="Tìm đơn vị..."
                        emptyPlaceholder="Không tìm thấy."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Giá vốn</label>
                    <NumberInput 
                        value={formData.costPrice} 
                        onChange={(value) => setFormData(prev => ({ ...prev, costPrice: value }))}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Giá bán</label>
                    <NumberInput 
                        value={formData.defaultPrice} 
                        onChange={(value) => setFormData(prev => ({ ...prev, defaultPrice: value }))}
                    />
                </div>
            </div>
        </form>
    );
};


export const ProductSearch = ({ onSelectProduct, onAddProduct, disabled }: { 
    onSelectProduct: (product: Product) => void;
    onAddProduct: (values: ProductFormValues) => void;
    disabled: boolean;
    defaultPolicyId?: string | undefined;
    branchSystemId?: string | undefined;
}) => {
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState<ComboboxOption | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [pendingProductId, setPendingProductId] = React.useState<string | null>(null);
    
    // ✅ Use Meilisearch for fast product search - shows 30 default results when empty
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
    
    // ✅ Map Meilisearch results to options - flatten all pages
    const searchProducts = React.useMemo(() => {
        return searchResult?.pages.flatMap(page => page.data) || [];
    }, [searchResult]);

    // ✅ Convert Meilisearch results to ComboboxOption format
    const options: ComboboxOption[] = React.useMemo(() => {
        // Map from Meilisearch search results (minimal data)
        return searchProducts.map((p) => {
            // For search results, we show basic info from Meilisearch
            // Full data will be fetched on select
            return {
                value: p.systemId,
                label: p.name,
                subtitle: p.id ?? '',
                acText: [p.name, p.id, p.barcode].filter(Boolean).join(' | '),
                metadata: {
                    price: p.price || 0, // Meilisearch has price (selling price)
                    costPrice: p.costPrice || 0,
                    totalStock: p.totalStock || 0, // ✅ Total stock from Meilisearch
                    branchStocks: p.branchStocks || [], // ✅ Stock per branch
                    unit: p.unit || 'Cái',
                    thumbnailImage: p.thumbnailImage, // ✅ Use directly from Meilisearch
                }
            } satisfies ComboboxOption;
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

    // ✅ Simple ProductOptionThumbnail - use thumbnailImage directly from Meilisearch
    const ProductOptionThumbnail = React.memo(({ thumbnailImage }: { thumbnailImage?: string | null }) => {
        if (thumbnailImage) {
            return (
                <div className="w-10 h-10 shrink-0 rounded overflow-hidden bg-muted">
                    <LazyImage src={thumbnailImage} alt="" className="w-full h-full object-cover" />
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
        const metadata = option.metadata as { 
            unit?: string; 
            price?: number; 
            totalStock?: number; 
            branchStocks?: { branchId: string; branchName: string; onHand: number }[];
            thumbnailImage?: string | null 
        } | undefined;
        return (
            <div className="flex items-center gap-3 w-full py-1">
                <ProductOptionThumbnail thumbnailImage={metadata?.thumbnailImage} />
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                        {option.subtitle} | ĐVT: {metadata?.unit || 'Cái'}
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <p className="font-semibold">{formatCurrency(metadata?.price)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        Tồn: {metadata?.totalStock || 0}
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-xs">
                                    <div className="text-xs space-y-1">
                                        <p className="font-medium border-b pb-1 mb-1">Tồn kho theo chi nhánh:</p>
                                        {metadata?.branchStocks && metadata.branchStocks.length > 0 ? (
                                            metadata.branchStocks.map((bs) => (
                                                <div key={bs.branchId} className="flex justify-between gap-4">
                                                    <span className="truncate">{bs.branchName}</span>
                                                    <span className="font-medium">{bs.onHand}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground italic">Chưa có dữ liệu tồn kho</p>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </p>
                </div>
            </div>
        );
    };

    return (
        <>
            <VirtualizedCombobox
                options={options}
                value={selectedValue}
                onChange={handleChange}
                onSearchChange={setSearchQuery}
                isLoading={isLoadingProducts || !!pendingProductId}
                placeholder="Thêm sản phẩm (F3)"
                searchPlaceholder="Tìm kiếm theo tên, mã SKU, barcode..."
                emptyPlaceholder="Không tìm thấy sản phẩm"
                disabled={disabled}
                onLoadMore={() => fetchNextPage()}
                hasMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                renderHeader={() => (
                    <div className="p-1 border-b border-border">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-start text-primary"
                            onClick={() => setIsFormOpen(true)}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Thêm mới sản phẩm
                        </Button>
                    </div>
                )}
                renderOption={renderOption}
            />
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                    </DialogHeader>
                    <SimplifiedProductForm onSubmit={(v) => { onAddProduct(v as ProductFormValues); setIsFormOpen(false); }} />
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Hủy</Button>
                        <Button type="submit" form="simplified-product-form">Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
