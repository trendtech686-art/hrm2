
import * as React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Package } from 'lucide-react';
import type { Product } from '../../products/types.ts';
import type { ProductFormValues } from '../../products/form.tsx';
import { useProductStore } from '../../products/store.ts';
import { useUnitStore } from '../../settings/units/store.ts';
import { usePricingPolicyStore } from '../../settings/pricing/store.ts';
import { Button } from '../../../components/ui/button.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog.tsx';
import { NumberInput } from '../../../components/ui/number-input.tsx';
import { Combobox } from '../../../components/ui/combobox.tsx';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox.tsx';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const SimplifiedProductForm = ({ onSubmit }: { onSubmit: (values: ProductFormValues) => void; }) => {
    const { data: products } = useProductStore();
    const { data: units } = useUnitStore();
    const { data: pricingPolicies } = usePricingPolicyStore();

    const unitOptions = React.useMemo(() => units.map(u => ({ value: u.name, label: u.name })), [units]);
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


export const ProductSearch = ({ onSelectProduct, onAddProduct, disabled, defaultPolicyId }: { 
    onSelectProduct: (product: Product) => void;
    onAddProduct: (values: ProductFormValues) => void;
    disabled: boolean;
    defaultPolicyId?: string;
}) => {
    const { data: allProducts, getActive } = useProductStore();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState<ComboboxOption | null>(null);

    // Only show active products
    const availableProducts = React.useMemo(() => {
        return getActive();
    }, [allProducts, getActive]);

    // Calculate total inventory (on-hand stock)
    const getTotalInventory = (product: Product): number => {
        const inventoryByBranch = product.inventoryByBranch || {};
        return Object.values(inventoryByBranch).reduce((sum, qty) => sum + qty, 0);
    };

    // Calculate available stock (on-hand - committed)
    const getAvailableStock = (product: Product): number => {
        const onHand = getTotalInventory(product);
        const committedByBranch = product.committedByBranch || {};
        const committed = Object.values(committedByBranch).reduce((sum, qty) => sum + qty, 0);
        return onHand - committed;
    };

    // ✅ Convert to ComboboxOption format (no "Add new" in options anymore)
    const options: ComboboxOption[] = React.useMemo(() => {
        return availableProducts.map((p) => {
            const totalStock = getTotalInventory(p);
            const availableStock = getAvailableStock(p);
            const price = defaultPolicyId ? p.prices[defaultPolicyId] : (Object.values(p.prices || {})[0] || 0);
            return {
                value: p.systemId,
                label: p.name,
                subtitle: p.id,
                metadata: {
                    price: price,
                    stock: totalStock,
                    availableStock: availableStock,
                }
            } as ComboboxOption;
        });
    }, [availableProducts, defaultPolicyId]);

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

    const renderOption = (option: ComboboxOption) => {
        // Regular product option
        return (
            <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-9 flex-shrink-0 bg-muted rounded flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                        {option.subtitle} | Tồn: {option.metadata?.stock || 0} | Có thể bán: {option.metadata?.availableStock || 0}
                    </p>
                </div>
                <div className="text-sm font-semibold text-right flex-shrink-0">
                    {formatCurrency(option.metadata?.price)}
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
