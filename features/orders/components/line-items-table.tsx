import * as React from 'react';
import { useFormContext, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AlertTriangle, X, Package, Eye, ChevronDown, ChevronRight, StickyNote, Pencil } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table.tsx';
import { NumberInput } from '../../../components/ui/number-input.tsx';
import { CurrencyInput } from '../../../components/ui/currency-input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { useProductStore } from '../../products/store.ts';
import { usePricingPolicyStore } from '../../settings/pricing/store.ts';
import { Separator } from '../../../components/ui/separator.tsx';
import { ProductTableBottomToolbar } from './product-table-bottom-toolbar.tsx';
import { useImageStore } from '../../products/image-store.ts';
import { useProductImage } from '../../products/components/product-image.tsx';
import { FileUploadAPI } from '@/lib/file-upload-api.ts';
import { ImagePreviewDialog } from '../../../components/ui/image-preview-dialog.tsx';
import { isComboProduct, calculateComboStock } from '../../products/combo-utils.ts';
import { TaxSelector } from './tax-selector.tsx';
import type { Product } from '../../products/types.ts';
import type { SystemId } from '@/lib/id-types';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// Helper component để hiển thị ảnh combo child với server priority
const ComboChildImage = ({ 
    product, 
    productName, 
    onPreview 
}: { 
    product?: Product | null; 
    productName: string;
    onPreview: (image: string, title: string) => void;
}) => {
    const imageUrl = useProductImage(product?.systemId || '', product);
    
    if (imageUrl) {
        return (
            <div
                className="group relative w-8 h-7 rounded overflow-hidden border border-muted cursor-pointer"
                onClick={() => onPreview(imageUrl, product?.name || productName)}
            >
                <img
                    src={imageUrl}
                    alt={product?.name || productName}
                    className="w-full h-full object-cover transition-all group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-white drop-shadow-md" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-8 h-7 bg-muted rounded flex items-center justify-center">
            <Package className="h-4 w-4 text-muted-foreground" />
        </div>
    );
};

// ✅ Memoized row component để tránh re-render không cần thiết
const LineItemRow = React.memo(({
    item,
    index,
    branchSystemId,
    disabled,
    onRemove,
    control,
    onPreview,
    pricingPolicyId,
    onEditNote,
    allowNoteEdit,
    fieldName = 'lineItems',
    onTaxChange,
}: {
    item: any;
    index: number;
    branchSystemId?: string;
    disabled: boolean;
    onRemove: (index: number) => void;
    control: any;
    onPreview: (image: string, title: string) => void;
    pricingPolicyId?: string;
    onEditNote: (index: number) => void;
    allowNoteEdit?: boolean;
    fieldName?: string;
    onTaxChange: (index: number, taxId: string, rate: number) => void;
}) => {
    const { findById: findProductById, data: allProducts } = useProductStore();
    const { data: pricingPolicies } = usePricingPolicyStore();
    const effectivePolicyId = React.useMemo(() => {
        if (pricingPolicyId) {
            return pricingPolicyId;
        }
        const defaultPolicy = pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault);
        return defaultPolicy?.systemId;
    }, [pricingPolicyId, pricingPolicies]);
    const [isComboExpanded, setIsComboExpanded] = React.useState(false);
    
    // ✅ Watch quantity và discountType để tính toán
    const quantity = useWatch({ control, name: `${fieldName}.${index}.quantity`, defaultValue: 1 });
    const discountType = useWatch({ control, name: `${fieldName}.${index}.discountType`, defaultValue: 'fixed' });
    const note = useWatch({ control, name: `${fieldName}.${index}.note`, defaultValue: '' });
    
    const product = React.useMemo(() => findProductById(item.productSystemId), [item.productSystemId, findProductById]);
    
    // Check if product is a combo and get combo items
    const isCombo = product?.type === 'combo';
    const comboItems = React.useMemo(() => {
        if (!isCombo || !product?.comboItems) return [];
        return product.comboItems.map(ci => {
            const childProduct = allProducts.find(p => p.systemId === ci.productSystemId);
            let price = 0;
            if (childProduct) {
                if (effectivePolicyId && childProduct.prices?.[effectivePolicyId]) {
                    price = childProduct.prices[effectivePolicyId] || 0;
                } else if (childProduct.prices && Object.keys(childProduct.prices).length > 0) {
                    const firstPolicy = Object.keys(childProduct.prices)[0];
                    price = childProduct.prices[firstPolicy] || 0;
                } else if (typeof childProduct.costPrice === 'number') {
                    price = childProduct.costPrice || 0;
                }
            }
            return {
                ...ci,
                product: childProduct,
                price,
            };
        });
    }, [isCombo, product?.comboItems, allProducts, effectivePolicyId]);

    // ✅ Get image from store
    const permanentImages = useImageStore(state => state.permanentImages[item.productSystemId]);
    const lastFetched = useImageStore(state => state.permanentMeta[item.productSystemId]?.lastFetched);
    const updatePermanentImages = useImageStore(state => state.updatePermanentImages);

    const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
    const storeGallery = permanentImages?.gallery?.[0]?.url;
    
    // ✅ Ưu tiên ảnh từ server trước, sau đó mới đến product data
    const displayImage = React.useMemo(() => {
        // 1. Ảnh từ server (ưu tiên cao nhất)
        if (storeThumbnail) return storeThumbnail;
        if (storeGallery) return storeGallery;
        // 2. Ảnh từ product data (mock/seed)
        if (!product) return undefined;
        return product.thumbnailImage || product.galleryImages?.[0] || product.images?.[0];
    }, [storeThumbnail, storeGallery, product]);

    // ✅ Fetch image if missing
    React.useEffect(() => {
        if (!displayImage && !lastFetched && item.productSystemId) {
            FileUploadAPI.getProductFiles(item.productSystemId)
                .then(files => {
                    const mapToServerFile = (f: any) => ({
                        id: f.id,
                        sessionId: '',
                        name: f.name,
                        originalName: f.originalName,
                        slug: f.slug,
                        filename: f.filename,
                        size: f.size,
                        type: f.type,
                        url: f.url,
                        status: 'permanent' as const,
                        uploadedAt: f.uploadedAt,
                        metadata: f.metadata
                    });

                    const thumbnailFiles = files.filter(f => f.documentName === 'thumbnail').map(mapToServerFile);
                    const galleryFiles = files.filter(f => f.documentName === 'gallery').map(mapToServerFile);
                    
                    // Update store (this will also set lastFetched)
                    updatePermanentImages(item.productSystemId, 'thumbnail', thumbnailFiles);
                    updatePermanentImages(item.productSystemId, 'gallery', galleryFiles);
                })
                .catch(err => console.error("Failed to load product image", err));
        }
    }, [item.productSystemId, displayImage, lastFetched, updatePermanentImages]);

    // ✅ Memoize stock calculation
    const stockInfo = React.useMemo(() => {
        if (!branchSystemId || !product) {
            return { stock: 0, isValid: false };
        }

        if (isComboProduct(product) && product.comboItems?.length) {
            const available = calculateComboStock(product.comboItems, allProducts, branchSystemId as SystemId);
            return { stock: available, isValid: true };
        }
        
        if (!product.inventoryByBranch) {
            return { stock: 0, isValid: true };
        }
        
        const stock = product.inventoryByBranch[branchSystemId] || 0;
        return { stock, isValid: true };
    }, [branchSystemId, product, allProducts]);

    const productTypeLabel = React.useMemo(() => {
        if (!product) return '';
        switch (product.type) {
            case 'combo':
                return 'Combo';
            case 'service':
                return 'Dịch vụ';
            case 'digital':
                return 'Sản phẩm số';
            default:
                return 'Hàng hóa';
        }
    }, [product]);
    
    const isOutOfStock = stockInfo.isValid && quantity > stockInfo.stock;
    const isService = item.productId === 'DỊCH-VỤ';
    const isPercentage = discountType === 'percentage';
    
    return (
        <>
            <TableRow className={isCombo ? 'bg-muted/30' : ''}>
                <TableCell className="text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-1">
                        {isCombo && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0"
                                onClick={() => setIsComboExpanded(!isComboExpanded)}
                            >
                                {isComboExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        )}
                        <span>{index + 1}</span>
                    </div>
                </TableCell>
                <TableCell>
                    {displayImage ? (
                        <div
                            className="group relative w-10 h-9 rounded overflow-hidden border border-muted cursor-pointer"
                            onClick={() => onPreview(displayImage, item.productName)}
                        >
                            <img
                                src={displayImage}
                                alt={item.productName}
                                className="w-full h-full object-cover transition-all group-hover:brightness-75"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-4 h-4 text-white drop-shadow-md" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-10 h-9 bg-muted rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Link
                                to={`/products/${item.productSystemId}`}
                                className="font-medium text-primary hover:underline"
                            >
                                {item.productName}
                            </Link>
                            {isCombo && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
                                    COMBO
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground group/info">
                                <span>{productTypeLabel}</span>
                                <span>-</span>
                                <Link
                                    to={`/products/${item.productSystemId}`}
                                    className="text-primary hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {item.productId}
                                </Link>
                                {note ? (
                                    <>
                                        <span className="text-amber-600">
                                            <StickyNote className="h-3 w-3 inline mr-0.5" />
                                            <span className="italic">{note}</span>
                                        </span>
                                        {(!disabled || allowNoteEdit) && (
                                            <button
                                                type="button"
                                                onClick={() => onEditNote(index)}
                                                className="opacity-0 group-hover/info:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded"
                                            >
                                                <Pencil className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    (!disabled || allowNoteEdit) && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEditNote(index)}
                                            className="h-5 px-1.5 text-xs text-muted-foreground hover:text-foreground ml-1 opacity-0 group-hover/info:opacity-100 transition-opacity"
                                        >
                                            Thêm ghi chú
                                        </Button>
                                    )
                                )}
                            </div>
                            {!isService && isOutOfStock && (
                                <div className="flex items-center gap-1 text-destructive">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span>Không đủ</span>
                                </div>
                            )}
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Controller
                        control={control}
                        name={`${fieldName}.${index}.quantity`}
                        render={({ field }) => (
                            <NumberInput
                                value={field.value}
                                onChange={field.onChange}
                                min={1}
                                className="h-9"
                                format={false}
                                disabled={disabled}
                            />
                        )}
                    />
                </TableCell>
                <TableCell>
                    <Controller
                        control={control}
                        name={`${fieldName}.${index}.unitPrice`}
                        render={({ field }) => (
                            <CurrencyInput
                                value={field.value}
                                onChange={field.onChange}
                                className="h-9"
                                disabled={disabled}
                            />
                        )}
                    />
                </TableCell>
                <TableCell>
                    <TaxSelector
                        value={item.taxId || ''}
                        onChange={(taxId, rate) => onTaxChange(index, taxId, rate)}
                        disabled={disabled}
                    />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-1">
                        <Controller
                            control={control}
                            name={`${fieldName}.${index}.discountType`}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                                    <SelectTrigger className="h-9 w-[70px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">đ</SelectItem>
                                        <SelectItem value="percentage">%</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {isPercentage ? (
                            <div className="relative w-full">
                                <Controller
                                    control={control}
                                    name={`${fieldName}.${index}.discount`}
                                    render={({ field }) => (
                                        <NumberInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            min={0}
                                            max={100}
                                            className="h-9"
                                            disabled={disabled}
                                            format={false}
                                        />
                                    )}
                                />
                                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none z-10">
                                    %
                                </span>
                            </div>
                        ) : (
                            <Controller
                                control={control}
                                name={`${fieldName}.${index}.discount`}
                                render={({ field }) => (
                                    <CurrencyInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="h-9"
                                        disabled={disabled}
                                    />
                                )}
                            />
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(item.total)}</TableCell>
                <TableCell>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(index)}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4 text-destructive" />
                    </Button>
                </TableCell>
            </TableRow>

            {/* Combo items expanded view */}
            {isCombo && isComboExpanded && comboItems.length > 0 && (
                <>
                    {comboItems.map((comboItem, ciIndex) => {
                        return (
                        <TableRow key={`combo-${index}-${ciIndex}`} className="bg-muted/30">
                            <TableCell className="text-center text-muted-foreground pl-8">
                                <span className="text-muted-foreground/50">└</span>
                            </TableCell>
                            <TableCell>
                                <ComboChildImage 
                                    product={comboItem.product}
                                    productName={item.productName}
                                    onPreview={onPreview}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-sm text-muted-foreground">
                                        {comboItem.product?.name || 'Sản phẩm không tồn tại'}
                                    </p>
                                    {comboItem.product && (
                                        <Link
                                            to={`/products/${comboItem.product.systemId}`}
                                            className="text-xs text-primary hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {comboItem.product.id}
                                        </Link>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">{comboItem.quantity * quantity}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-muted-foreground">{formatCurrency(comboItem.price)}</span>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">
                                {formatCurrency(comboItem.price * comboItem.quantity * quantity)}
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    );
                    })}
                </>
            )}
        </>
    );
});

LineItemRow.displayName = 'LineItemRow';

export const LineItemsTable = ({ disabled, onAddService, onApplyPromotion, fields: parentFields, remove: parentRemove, pricingPolicyId, allowNoteEdit, fieldName = 'lineItems' }: { 
    disabled: boolean; 
    onAddService?: () => void;
    onApplyPromotion?: () => void;
    fields: any[];
    remove: (index: number) => void;
    pricingPolicyId?: string;
    allowNoteEdit?: boolean;
    fieldName?: string;
}) => {
    const { control, setValue, getValues } = useFormContext();
    
    const fields = parentFields;
    const remove = parentRemove;
    
    const { fields: serviceFeeFields, remove: removeServiceFee } = useFieldArray({
        control,
        name: "serviceFees",
    });
    
    // ✅ Đổi watch → useWatch để tối ưu performance
    const branchSystemId = useWatch({ control, name: 'branchSystemId' });

    const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
        open: false,
        image: '',
        title: ''
    });

    const handlePreview = React.useCallback((image: string, title: string) => {
        setPreviewState({ open: true, image, title });
    }, []);

    // State cho dialog ghi chú
    const [editingNoteIndex, setEditingNoteIndex] = React.useState<number | null>(null);
    const [tempNote, setTempNote] = React.useState('');

    const handleOpenNoteDialog = React.useCallback((index: number) => {
        const currentNote = getValues(`${fieldName}.${index}.note`) || '';
        setTempNote(currentNote);
        setEditingNoteIndex(index);
    }, [getValues, fieldName]);

    const handleSaveNote = React.useCallback(() => {
        if (editingNoteIndex !== null) {
            setValue(`${fieldName}.${editingNoteIndex}.note`, tempNote.trim(), { shouldDirty: true });
            setEditingNoteIndex(null);
            setTempNote('');
        }
    }, [editingNoteIndex, tempNote, setValue, fieldName]);

    // Handle tax change
    const handleTaxChange = React.useCallback((index: number, taxId: string, rate: number) => {
        setValue(`${fieldName}.${index}.taxId`, taxId, { shouldDirty: true });
        setValue(`${fieldName}.${index}.tax`, rate, { shouldDirty: true });
    }, [setValue, fieldName]);

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] text-center">STT</TableHead>
                        <TableHead className="w-[60px]">Ảnh</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead className="w-[140px]">Số lượng</TableHead>
                        <TableHead className="w-[200px]">Đơn giá</TableHead>
                        <TableHead className="w-[140px]">Thuế</TableHead>
                        <TableHead className="w-[200px]">Chiết khấu</TableHead>
                        <TableHead className="w-[120px] text-right">Thành tiền</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* ✅ Dùng LineItemRow component đã được memoized */}
                    {fields.map((item, index) => (
                        <LineItemRow
                            key={item.id}
                            item={item}
                            index={index}
                            {...(branchSystemId ? { branchSystemId } : {})}
                            disabled={disabled}
                            onRemove={remove}
                            control={control}
                            onPreview={handlePreview}
                            onEditNote={handleOpenNoteDialog}
                            onTaxChange={handleTaxChange}
                            {...(typeof pricingPolicyId === 'string' ? { pricingPolicyId } : {})}
                            allowNoteEdit={allowNoteEdit}
                            fieldName={fieldName}
                        />
                    ))}
                    
                    {serviceFeeFields.length > 0 && (
                        <>
                            <TableRow>
                                <TableCell colSpan={8} className="p-0">
                                    <Separator />
                                </TableCell>
                            </TableRow>
                            {serviceFeeFields.map((fee, index) => (
                                <TableRow key={fee.id} className="bg-orange-50/50">
                                    <TableCell className="text-center text-muted-foreground">{fields.length + index + 1}</TableCell>
                                    <TableCell colSpan={5}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-orange-700">[Phí dịch vụ]</span>
                                            <span className="font-medium">{(fee as any).name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-orange-700">
                                        {formatCurrency((fee as any).amount)}
                                    </TableCell>
                                    <TableCell>
                                        {!disabled && (
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => removeServiceFee(index)}
                                            >
                                                <X className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    )}
                </TableBody>
            </Table>
            <ProductTableBottomToolbar disabled={disabled} onAddService={onAddService} onApplyPromotion={onApplyPromotion} />
            
            <ImagePreviewDialog 
                open={previewState.open} 
                onOpenChange={(open) => setPreviewState(prev => ({ ...prev, open }))} 
                images={[previewState.image]} 
                title={previewState.title}
            />

            {/* Dialog ghi chú cho sản phẩm */}
            <Dialog open={editingNoteIndex !== null} onOpenChange={(open) => !open && setEditingNoteIndex(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ghi chú sản phẩm</DialogTitle>
                        <DialogDescription>
                            {editingNoteIndex !== null && fields[editingNoteIndex] && (
                                <span>Ghi chú cho: {fields[editingNoteIndex].productName}</span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Nhập ghi chú cho sản phẩm..."
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingNoteIndex(null)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSaveNote}>
                            Lưu ghi chú
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
