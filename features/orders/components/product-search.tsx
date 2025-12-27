
import * as React from 'react';
import Link from 'next/link';
import { PlusCircle, Package } from 'lucide-react';
import type { Product } from '../../products/types';
import type { ProductFormValues } from '../../products/validation';
import { useProductStore } from '../../products/store';
import { useUnitStore } from '../../settings/units/store';
import { usePricingPolicyStore } from '../../settings/pricing/store';
import { useBranchStore } from '../../settings/branches/store';
import { useImageStore } from '../../products/image-store';
import { FileUploadAPI } from '../../../lib/file-upload-api';
import { LazyImage } from '../../../components/ui/lazy-image';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { NumberInput } from '../../../components/ui/number-input';
import { Combobox } from '../../../components/ui/combobox';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox';
import { isComboProduct, calculateComboStockAllBranches, calculateComboCostPrice } from '../../products/combo-utils';
import type { SystemId } from '@/lib/id-types';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const SimplifiedProductForm = ({ onSubmit }: { onSubmit: (values: ProductFormValues) => void; }) => {
    const { data: products } = useProductStore();
    const unitData = useUnitStore(state => state.data);
    const { data: pricingPolicies } = usePricingPolicyStore();

    const activeUnits = React.useMemo(
        () => unitData.filter(unit => {
            const isDeleted = 'isDeleted' in unit && Boolean((unit as { isDeleted?: boolean }).isDeleted);
            return !isDeleted && unit.isActive !== false;
        }),
        [unitData]
    );
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


export const ProductSearch = ({ onSelectProduct, onAddProduct, disabled, defaultPolicyId, branchSystemId }: { 
    onSelectProduct: (product: Product) => void;
    onAddProduct: (values: ProductFormValues) => void;
    disabled: boolean;
    defaultPolicyId?: string | undefined;
    branchSystemId?: string | undefined;
}) => {
    const { data: allProducts, getActive } = useProductStore();
    const { data: branches } = useBranchStore();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState<ComboboxOption | null>(null);

    // Only show active products
    const availableProducts = React.useMemo(() => {
        return getActive();
    }, [allProducts, getActive]);

    const getComboStockRecord = (product: Product): Record<SystemId, number> => {
        if (!isComboProduct(product) || !product.comboItems?.length) {
            return {};
        }
        return calculateComboStockAllBranches(product.comboItems, allProducts);
    };

    // Calculate total inventory (on-hand stock) aggregated across branches
    const getTotalInventory = (product: Product): number => {
        if (isComboProduct(product) && product.comboItems?.length) {
            const comboStock = getComboStockRecord(product);
            return Object.values(comboStock).reduce((sum, qty) => sum + qty, 0);
        }
        const inventoryByBranch = product.inventoryByBranch || {};
        return Object.values(inventoryByBranch).reduce((sum, qty) => sum + qty, 0);
    };

    // Calculate available stock (on-hand - committed) aggregated across branches
    const getAvailableStock = (product: Product): number => {
        if (isComboProduct(product) && product.comboItems?.length) {
            const comboStock = getComboStockRecord(product);
            return Object.values(comboStock).reduce((sum, qty) => sum + qty, 0);
        }
        const inventoryByBranch = product.inventoryByBranch || {};
        const committedByBranch = product.committedByBranch || {};
        return Object.entries(inventoryByBranch).reduce((sum, [branchId, stock]) => {
            const committed = committedByBranch[branchId as SystemId] || 0;
            return sum + Math.max(0, (stock as number) - committed);
        }, 0);
    };

    const getBranchStockLines = (product: Product) => {
        if (isComboProduct(product) && product.comboItems?.length) {
            const comboStock = getComboStockRecord(product);
            return branches
                .map(branch => ({
                    branchSystemId: branch.systemId,
                    branchName: branch.name,
                    stock: comboStock[branch.systemId] || 0,
                    available: comboStock[branch.systemId] || 0,
                }))
                .filter(detail => detail.stock > 0 || detail.available > 0);
        }

        const inventoryByBranch = product.inventoryByBranch || {};
        const committedByBranch = product.committedByBranch || {};
        return branches
            .map(branch => {
                const stock = inventoryByBranch[branch.systemId] || 0;
                const committed = committedByBranch[branch.systemId] || 0;
                const available = Math.max(0, stock - committed);
                return {
                    branchSystemId: branch.systemId,
                    branchName: branch.name,
                    stock,
                    available,
                };
            })
            .filter(detail => detail.stock > 0 || detail.available > 0);
    };

    const getCostPrice = (product: Product): number => {
        if (isComboProduct(product) && product.comboItems?.length) {
            return calculateComboCostPrice(product.comboItems, allProducts);
        }
        return product.costPrice || 0;
    };

    // ✅ Convert to ComboboxOption format (no "Add new" in options anymore)
    const options: ComboboxOption[] = React.useMemo(() => {
        return availableProducts.map((p) => {
            const totalStock = getTotalInventory(p);
            const availableStock = getAvailableStock(p);
            const price = defaultPolicyId ? p.prices[defaultPolicyId] : (Object.values(p.prices || {})[0] || 0);
            const branchStocks = getBranchStockLines(p);
            const subtitle = p.id ?? '';
            const searchTokens: string[] = [p.name, subtitle];
            if (p.barcode) {
                searchTokens.push(p.barcode);
            }
            branchStocks.forEach(detail => {
                searchTokens.push(detail.branchName);
            });

            return {
                value: p.systemId,
                label: p.name,
                subtitle,
                acText: searchTokens
                    .filter((token): token is string => Boolean(token))
                    .join(' | '),
                metadata: {
                    price,
                    stock: totalStock,
                    availableStock,
                    branchStocks,
                    costPrice: getCostPrice(p),
                    unit: p.unit || 'Chiếc',
                }
            } satisfies ComboboxOption;
        });
    }, [availableProducts, defaultPolicyId, branches]);

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

    // Product Thumbnail for combobox options
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
                        const mapToServerFile = (f: any) => ({
                            id: f.id, sessionId: '', name: f.name, originalName: f.originalName,
                            slug: f.slug, filename: f.filename, size: f.size, type: f.type, url: f.url,
                            status: 'permanent' as const, uploadedAt: f.uploadedAt, metadata: f.metadata
                        });
                        updatePermanentImages(productSystemId, 'thumbnail', files.filter(f => f.documentName === 'thumbnail').map(mapToServerFile));
                        updatePermanentImages(productSystemId, 'gallery', files.filter(f => f.documentName === 'gallery').map(mapToServerFile));
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
        return (
            <div className="flex items-center gap-3 w-full py-1">
                <ProductOptionThumbnail productSystemId={option.value} />
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                        {option.subtitle} | ĐVT: {option.metadata?.unit || 'Chiếc'}
                    </p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="font-semibold">{formatCurrency(option.metadata?.price)}</p>
                    <p className="text-xs text-muted-foreground">
                        Tồn: {option.metadata?.stock || 0} | Bán: {option.metadata?.availableStock || 0}
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
                placeholder="Thêm sản phẩm (F3)"
                searchPlaceholder="Tìm kiếm theo tên, mã SKU, barcode..."
                emptyPlaceholder="Không tìm thấy sản phẩm"
                disabled={disabled}
                renderHeader={() => (
                    <div className="p-1 border-b">
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
