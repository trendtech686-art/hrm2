import * as React from 'react';
import { useFormContext, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AlertTriangle, X, Package } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table.tsx';
import { NumberInput } from '../../../components/ui/number-input.tsx';
import { CurrencyInput } from '../../../components/ui/currency-input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { useProductStore } from '../../products/store.ts';
import { Separator } from '../../../components/ui/separator.tsx';
import { ProductTableBottomToolbar } from './product-table-bottom-toolbar.tsx';
import { useDebounce } from '../../../hooks/use-debounce.ts';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// ✅ Memoized row component để tránh re-render không cần thiết
const LineItemRow = React.memo(({ 
    item, 
    index, 
    branchSystemId, 
    disabled, 
    onRemove,
    control 
}: { 
    item: any; 
    index: number; 
    branchSystemId: string; 
    disabled: boolean;
    onRemove: (index: number) => void;
    control: any;
}) => {
    const { findById: findProductById } = useProductStore();
    const { setValue } = useFormContext();
    
    // ✅ Watch quantity và discountType để tính toán
    const quantity = useWatch({ control, name: `lineItems.${index}.quantity`, defaultValue: 1 });
    const discountType = useWatch({ control, name: `lineItems.${index}.discountType`, defaultValue: 'fixed' });
    
    // ✅ Memoize stock calculation
    const stockInfo = React.useMemo(() => {
        if (!branchSystemId) {
            return { stock: 0, isValid: false };
        }
        
        const product = findProductById(item.productSystemId);
        if (!product || !product.inventoryByBranch) {
            return { stock: 0, isValid: true };
        }
        
        const stock = product.inventoryByBranch[branchSystemId] || 0;
        return { stock, isValid: true };
    }, [branchSystemId, item.productSystemId, findProductById]);
    
    const isOutOfStock = stockInfo.isValid && quantity > stockInfo.stock;
    const isService = item.productId === 'DỊCH-VỤ';
    const isPercentage = discountType === 'percentage';
    
    return (
        <TableRow>
            <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
            <TableCell>
                <div className="w-10 h-9 bg-muted rounded flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-1">
                    <p className="font-medium">{item.productName}</p>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Mặc định</span>
                        <span className="text-primary">
                            <Link to={`/products/${item.productSystemId}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                                {item.productId}
                            </Link>
                        </span>
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
                    name={`lineItems.${index}.quantity`}
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
                    name={`lineItems.${index}.unitPrice`}
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
                <div className="flex items-center gap-1">
                    <Controller 
                        control={control} 
                        name={`lineItems.${index}.discountType`} 
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
                                name={`lineItems.${index}.discount`}
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
                            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none z-10">%</span>
                        </div>
                    ) : (
                        <Controller 
                            control={control}
                            name={`lineItems.${index}.discount`}
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
                    <X className="h-4 w-4 text-destructive"/>
                </Button>
            </TableCell>
        </TableRow>
    );
});

LineItemRow.displayName = 'LineItemRow';

export const LineItemsTable = ({ disabled, onAddService, onApplyPromotion, fields: parentFields, remove: parentRemove }: { 
    disabled: boolean; 
    onAddService?: () => void;
    onApplyPromotion?: () => void;
    fields: any[];
    remove: (index: number) => void;
}) => {
    const { control } = useFormContext();
    
    const fields = parentFields;
    const remove = parentRemove;
    
    const { fields: serviceFeeFields, remove: removeServiceFee } = useFieldArray({
        control,
        name: "serviceFees",
    });
    
    const { findById: findProductById } = useProductStore();
    // ✅ Đổi watch → useWatch để tối ưu performance
    const branchSystemId = useWatch({ control, name: 'branchSystemId' });

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
                            branchSystemId={branchSystemId}
                            disabled={disabled}
                            onRemove={remove}
                            control={control}
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
        </div>
    );
};
