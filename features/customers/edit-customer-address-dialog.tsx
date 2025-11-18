import * as React from "react";
import { useForm } from "react-hook-form";
import type { Customer } from "./types.ts";
import { useCustomerStore } from './store.ts';
import { useProvinceStore } from "../settings/provinces/store.ts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";
import { VirtualizedCombobox } from "../../components/ui/virtualized-combobox.tsx";
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { Separator } from "../../components/ui/separator.tsx";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group.tsx";
import { Label } from "../../components/ui/label.tsx";

type AddressFormValues = Pick<Customer, 
    'shippingAddress_street' | 'shippingAddress_ward' | 'shippingAddress_province' | 'shippingAddress_district' |
    'billingAddress_street' | 'billingAddress_ward' | 'billingAddress_province' | 'billingAddress_district'
>;

interface EditCustomerAddressDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    customerSystemId: string | null;
}

export function EditCustomerAddressDialog({ isOpen, onOpenChange, customerSystemId }: EditCustomerAddressDialogProps) {
    const { findById, update } = useCustomerStore();
    const customer = React.useMemo(() => customerSystemId ? findById(customerSystemId) : null, [customerSystemId, findById]);

    const { data: provinces, getDistrictsByProvinceId, getWardsByProvinceId } = useProvinceStore();
    const [billingSameAsShipping, setBillingSameAsShipping] = React.useState(true);
    const [addressLevel, setAddressLevel] = React.useState<'2-level' | '3-level'>('3-level');

    const form = useForm<AddressFormValues>();

    React.useEffect(() => {
        if (customer && isOpen) {
            // Detect if customer has district (3-level) or not (2-level)
            const hasDistrict = !!customer.shippingAddress_district;
            setAddressLevel(hasDistrict ? '3-level' : '2-level');
            
            form.reset({
                shippingAddress_street: customer.shippingAddress_street ?? "",
                shippingAddress_province: customer.shippingAddress_province ?? "",
                shippingAddress_district: customer.shippingAddress_district ?? "",
                shippingAddress_ward: customer.shippingAddress_ward ?? "",
                billingAddress_street: customer.billingAddress_street ?? "",
                billingAddress_province: customer.billingAddress_province ?? "",
                billingAddress_district: customer.billingAddress_district ?? "",
                billingAddress_ward: customer.billingAddress_ward ?? "",
            });
            const same = customer.shippingAddress_street === customer.billingAddress_street &&
                         customer.shippingAddress_ward === customer.billingAddress_ward &&
                         customer.shippingAddress_district === customer.billingAddress_district &&
                         customer.shippingAddress_province === customer.billingAddress_province;
            setBillingSameAsShipping(same || !customer.billingAddress_street);
        }
    }, [customer, isOpen, form]);

    const shippingAddress = form.watch(['shippingAddress_street', 'shippingAddress_ward', 'shippingAddress_district', 'shippingAddress_province']);
    React.useEffect(() => {
        if (billingSameAsShipping) {
            const currentBillingStreet = form.getValues('billingAddress_street');
            const currentBillingWard = form.getValues('billingAddress_ward');
            const currentBillingDistrict = form.getValues('billingAddress_district');
            const currentBillingProvince = form.getValues('billingAddress_province');
            
            // Only update if values are actually different to prevent infinite loop
            if (currentBillingStreet !== shippingAddress[0]) {
                form.setValue('billingAddress_street', shippingAddress[0], { shouldValidate: false, shouldDirty: false });
            }
            if (currentBillingWard !== shippingAddress[1]) {
                form.setValue('billingAddress_ward', shippingAddress[1], { shouldValidate: false, shouldDirty: false });
            }
            if (currentBillingDistrict !== shippingAddress[2]) {
                form.setValue('billingAddress_district', shippingAddress[2], { shouldValidate: false, shouldDirty: false });
            }
            if (currentBillingProvince !== shippingAddress[3]) {
                form.setValue('billingAddress_province', shippingAddress[3], { shouldValidate: false, shouldDirty: false });
            }
        }
    }, [billingSameAsShipping, shippingAddress, form]);

    const shippingProvinceName = form.watch('shippingAddress_province');
    const shippingProvince = React.useMemo(() => provinces.find(p => p.name === shippingProvinceName), [shippingProvinceName, provinces]);
    
    const shippingDistrictName = form.watch('shippingAddress_district');
    const shippingDistricts = React.useMemo(() => 
        shippingProvince ? getDistrictsByProvinceId(shippingProvince.id) : [], 
        [shippingProvince, getDistrictsByProvinceId]
    );
    const shippingDistrict = React.useMemo(() => 
        shippingDistricts.find(d => d.name === shippingDistrictName), 
        [shippingDistricts, shippingDistrictName]
    );
    
    const shippingWards = React.useMemo(() => {
        if (!shippingProvince) return [];
        const allWards = getWardsByProvinceId(shippingProvince.id);
        if (addressLevel === '3-level' && shippingDistrict) {
            // 3-level: filter by districtId
            return allWards.filter(w => w.districtId === shippingDistrict.id);
        }
        // 2-level: all wards without districtId
        return allWards.filter(w => !w.districtId);
    }, [shippingProvince, shippingDistrict, addressLevel, getWardsByProvinceId]);

    const billingProvinceName = form.watch('billingAddress_province');
    const billingProvince = React.useMemo(() => provinces.find(p => p.name === billingProvinceName), [billingProvinceName, provinces]);
    
    const billingDistrictName = form.watch('billingAddress_district');
    const billingDistricts = React.useMemo(() => 
        billingProvince ? getDistrictsByProvinceId(billingProvince.id) : [], 
        [billingProvince, getDistrictsByProvinceId]
    );
    const billingDistrict = React.useMemo(() => 
        billingDistricts.find(d => d.name === billingDistrictName), 
        [billingDistricts, billingDistrictName]
    );
    
    const billingWards = React.useMemo(() => {
        if (!billingProvince) return [];
        const allWards = getWardsByProvinceId(billingProvince.id);
        if (addressLevel === '3-level' && billingDistrict) {
            // 3-level: filter by districtId
            return allWards.filter(w => w.districtId === billingDistrict.id);
        }
        // 2-level: all wards without districtId
        return allWards.filter(w => !w.districtId);
    }, [billingProvince, billingDistrict, addressLevel, getWardsByProvinceId]);

    const provinceOptions = React.useMemo(() => provinces.map(p => ({ value: p.name, label: p.name })), [provinces]);
    const shippingDistrictOptions = React.useMemo(() => shippingDistricts.map(d => ({ value: d.name, label: d.name })), [shippingDistricts]);
    const shippingWardOptions = React.useMemo(() => shippingWards.map(w => ({ value: w.name, label: w.name })), [shippingWards]);
    const billingDistrictOptions = React.useMemo(() => billingDistricts.map(d => ({ value: d.name, label: d.name })), [billingDistricts]);
    const billingWardOptions = React.useMemo(() => billingWards.map(w => ({ value: w.name, label: w.name })), [billingWards]);

    const onSubmit = (values: AddressFormValues) => {
        if (customer) {
            update(customer.systemId, { ...customer, ...values });
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa địa chỉ khách hàng</DialogTitle>
                    <DialogDescription>{customer?.name}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="customer-address-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        {/* Address Level Selector */}
                        <div className="space-y-3 pb-2">
                            <Label className="text-sm font-medium">Loại địa chỉ</Label>
                            <RadioGroup
                                value={addressLevel}
                                onValueChange={(value: '2-level' | '3-level') => {
                                    setAddressLevel(value);
                                    // Clear district and ward when switching
                                    form.setValue('shippingAddress_district', '');
                                    form.setValue('shippingAddress_ward', '');
                                    form.setValue('billingAddress_district', '');
                                    form.setValue('billingAddress_ward', '');
                                }}
                                className="flex gap-3"
                            >
                                <div className="flex items-center space-x-2 border rounded-md px-3 py-2 flex-1 cursor-pointer hover:bg-accent transition-colors">
                                    <RadioGroupItem value="2-level" id="level-2" />
                                    <Label htmlFor="level-2" className="cursor-pointer text-sm flex-1">
                                        <span className="font-medium">2 cấp</span>
                                        <span className="text-xs text-muted-foreground block">Tỉnh → Phường/Xã</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md px-3 py-2 flex-1 cursor-pointer hover:bg-accent transition-colors">
                                    <RadioGroupItem value="3-level" id="level-3" />
                                    <Label htmlFor="level-3" className="cursor-pointer text-sm flex-1">
                                        <span className="font-medium">3 cấp</span>
                                        <span className="text-xs text-muted-foreground block">Tỉnh → Quận → Phường</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="font-medium">Địa chỉ giao hàng</h3>
                            <FormField control={form.control} name="shippingAddress_street" render={({ field }) => ( 
                                <FormItem>
                                    <FormLabel>Địa chỉ (Số nhà, đường)</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem> 
                            )} />
                            
                            {addressLevel === '3-level' ? (
                                <div className="grid grid-cols-3 gap-3">
                                    <FormField control={form.control} name="shippingAddress_province" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                                            <FormControl>
                                                <VirtualizedCombobox 
                                                    options={provinceOptions} 
                                                    value={provinceOptions.find(opt => opt.value === field.value) || null} 
                                                    onChange={(option) => { 
                                                        field.onChange(option ? option.value : ''); 
                                                        form.setValue('shippingAddress_district', '');
                                                        form.setValue('shippingAddress_ward', ''); 
                                                    }} 
                                                    placeholder="Chọn tỉnh/TP" 
                                                    searchPlaceholder="Tìm tỉnh..." 
                                                    emptyPlaceholder="Không tìm thấy." 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="shippingAddress_district" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quận/Huyện</FormLabel>
                                            <FormControl>
                                                <VirtualizedCombobox 
                                                    options={shippingDistrictOptions} 
                                                    value={shippingDistrictOptions.find(opt => opt.value === field.value) || null} 
                                                    onChange={(option) => { 
                                                        field.onChange(option ? option.value : ''); 
                                                        form.setValue('shippingAddress_ward', ''); 
                                                    }} 
                                                    placeholder={shippingProvince ? "Chọn quận/huyện" : "Chọn tỉnh trước"} 
                                                    searchPlaceholder="Tìm quận..." 
                                                    emptyPlaceholder="Không tìm thấy." 
                                                    disabled={!shippingProvince}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="shippingAddress_ward" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phường/Xã</FormLabel>
                                            <FormControl>
                                                <VirtualizedCombobox 
                                                    options={shippingWardOptions} 
                                                    value={shippingWardOptions.find(opt => opt.value === field.value) || null} 
                                                    onChange={option => field.onChange(option ? option.value : '')} 
                                                    placeholder={shippingDistrict ? "Chọn phường/xã" : "Chọn quận trước"} 
                                                    searchPlaceholder="Tìm phường/xã..." 
                                                    emptyPlaceholder="Không tìm thấy." 
                                                    disabled={!shippingDistrict}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField control={form.control} name="shippingAddress_province" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                                            <FormControl>
                                                <VirtualizedCombobox 
                                                    options={provinceOptions} 
                                                    value={provinceOptions.find(opt => opt.value === field.value) || null} 
                                                    onChange={(option) => { 
                                                        field.onChange(option ? option.value : ''); 
                                                        form.setValue('shippingAddress_ward', ''); 
                                                    }} 
                                                    placeholder="Chọn tỉnh/TP" 
                                                    searchPlaceholder="Tìm tỉnh..." 
                                                    emptyPlaceholder="Không tìm thấy." 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="shippingAddress_ward" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phường/Xã</FormLabel>
                                            <FormControl>
                                                <VirtualizedCombobox 
                                                    options={shippingWardOptions} 
                                                    value={shippingWardOptions.find(opt => opt.value === field.value) || null} 
                                                    onChange={option => field.onChange(option ? option.value : '')} 
                                                    placeholder={shippingProvince ? "Chọn phường/xã" : "Chọn tỉnh trước"} 
                                                    searchPlaceholder="Tìm phường/xã..." 
                                                    emptyPlaceholder="Không tìm thấy." 
                                                    disabled={!shippingProvince}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            )}
                        </div>

                        <Separator />
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="same-address-dialog" checked={billingSameAsShipping} onCheckedChange={(checked) => setBillingSameAsShipping(Boolean(checked))} />
                                <label htmlFor="same-address-dialog" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Địa chỉ nhận hóa đơn giống địa chỉ giao hàng</label>
                            </div>
                            
                            {!billingSameAsShipping && (
                                <div className="space-y-4 pt-2">
                                    <h3 className="font-medium">Địa chỉ nhận hóa đơn</h3>
                                    <FormField control={form.control} name="billingAddress_street" render={({ field }) => ( 
                                        <FormItem>
                                            <FormLabel>Địa chỉ (Số nhà, đường)</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem> 
                                    )} />
                                    
                                    {addressLevel === '3-level' ? (
                                        <div className="grid grid-cols-3 gap-3">
                                            <FormField control={form.control} name="billingAddress_province" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                                                    <FormControl>
                                                        <VirtualizedCombobox 
                                                            options={provinceOptions} 
                                                            value={provinceOptions.find(opt => opt.value === field.value) || null} 
                                                            onChange={(option) => { 
                                                                field.onChange(option ? option.value : ''); 
                                                                form.setValue('billingAddress_district', '');
                                                                form.setValue('billingAddress_ward', ''); 
                                                            }} 
                                                            placeholder="Chọn tỉnh/TP" 
                                                            searchPlaceholder="Tìm tỉnh..." 
                                                            emptyPlaceholder="Không tìm thấy." 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="billingAddress_district" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quận/Huyện</FormLabel>
                                                    <FormControl>
                                                        <VirtualizedCombobox 
                                                            options={billingDistrictOptions} 
                                                            value={billingDistrictOptions.find(opt => opt.value === field.value) || null} 
                                                            onChange={(option) => { 
                                                                field.onChange(option ? option.value : ''); 
                                                                form.setValue('billingAddress_ward', ''); 
                                                            }} 
                                                            placeholder={billingProvince ? "Chọn quận/huyện" : "Chọn tỉnh trước"} 
                                                            searchPlaceholder="Tìm quận..." 
                                                            emptyPlaceholder="Không tìm thấy." 
                                                            disabled={!billingProvince}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="billingAddress_ward" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phường/Xã</FormLabel>
                                                    <FormControl>
                                                        <VirtualizedCombobox 
                                                            options={billingWardOptions} 
                                                            value={billingWardOptions.find(opt => opt.value === field.value) || null} 
                                                            onChange={option => field.onChange(option ? option.value : '')} 
                                                            placeholder={billingDistrict ? "Chọn phường/xã" : "Chọn quận trước"} 
                                                            searchPlaceholder="Tìm phường/xã..." 
                                                            emptyPlaceholder="Không tìm thấy." 
                                                            disabled={!billingDistrict}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <FormField control={form.control} name="billingAddress_province" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                                                    <FormControl>
                                                        <VirtualizedCombobox 
                                                            options={provinceOptions} 
                                                            value={provinceOptions.find(opt => opt.value === field.value) || null} 
                                                            onChange={(option) => { 
                                                                field.onChange(option ? option.value : ''); 
                                                                form.setValue('billingAddress_ward', ''); 
                                                            }} 
                                                            placeholder="Chọn tỉnh/TP" 
                                                            searchPlaceholder="Tìm tỉnh..." 
                                                            emptyPlaceholder="Không tìm thấy." 
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="billingAddress_ward" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phường/Xã</FormLabel>
                                                    <FormControl>
                                                        <VirtualizedCombobox 
                                                            options={billingWardOptions} 
                                                            value={billingWardOptions.find(opt => opt.value === field.value) || null} 
                                                            onChange={option => field.onChange(option ? option.value : '')} 
                                                            placeholder={billingProvince ? "Chọn phường/xã" : "Chọn tỉnh trước"} 
                                                            searchPlaceholder="Tìm phường/xã..." 
                                                            emptyPlaceholder="Không tìm thấy." 
                                                            disabled={!billingProvince}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button form="customer-address-form" type="submit">Lưu</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
