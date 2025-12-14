import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { useDebounce } from '../../../hooks/use-debounce.ts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../../components/ui/form.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { NumberInput } from '../../../components/ui/number-input.tsx';
import { useShippingPartnerStore } from '../../settings/shipping/store.ts';
import { useShippingSettingsStore } from '../../settings/shipping/shipping-settings-store.ts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { ScrollArea } from '../../../components/ui/scroll-area.tsx';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group.tsx';
import { Spinner } from '../../../components/ui/spinner.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Info } from 'lucide-react';
import { useProductStore } from '../../products/store.ts';
import { Button } from '../../../components/ui/button.tsx';
import { cn } from '../../../lib/utils.ts';
import { getApiUrl } from '../../../lib/api-config.ts';
import { DatePicker } from '../../../components/ui/date-picker.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip.tsx';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// A simple deterministic hash function to generate stable mock prices
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

const PartnerAvatar = ({ name }: { name: string }) => {
    const nameMap: { [key: string]: string } = {
        'Giao Hàng Nhanh': 'GHN',
        'Giao Hàng Tiết Kiệm': 'GHTK',
        'SPX Express': 'SPX',
        'J&T Express': 'J&T',
        'Viettel Post': 'VTP',
    };
    const initials = nameMap[name] || name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const colors: { [key: string]: string } = {
        'GHN': 'bg-orange-500 text-white',
        'GHTK': 'bg-green-500 text-white',
        'SPX': 'bg-red-500 text-white',
        'J&T': 'bg-red-600 text-white',
        'VTP': 'bg-orange-400 text-white',
    };
    const colorClass = colors[initials] || 'bg-gray-400 text-white';

    return (
        <div className={cn("h-9 w-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0", colorClass)}>
            {initials}
        </div>
    )
}


export function PartnerShipmentForm({ disabled }: { disabled?: boolean }) {
    const navigate = useNavigate();
    const { control, getValues, setValue } = useFormContext();
    const { data: allPartners } = useShippingPartnerStore();
    const { settings: shippingSettings } = useShippingSettingsStore();
    const { findById: findProductById } = useProductStore();
    
    // ✅ PHASE 3: Use centralized config loading
    const [shippingConfig, setShippingConfig] = React.useState<any>(null);

    React.useEffect(() => {
        // ✅ Load from correct source using helper
        import('../../../lib/utils/shipping-config-migration').then(({ loadShippingConfig }) => {
            const config = loadShippingConfig();
            setShippingConfig(config);
        });
    }, []);

    // Filter partners that have active accounts
    const partners = React.useMemo(() => {
        if (!shippingConfig) return [];
        
        return allPartners.filter(partner => {
            const partnerKey = partner.name.includes('GHTK') ? 'GHTK' : 
                             partner.name.includes('GHN') ? 'GHN' :
                             partner.name.includes('ViettelPost') ? 'VTP' :
                             partner.name.includes('J&T') ? 'J&T' :
                             partner.name.includes('SPX') ? 'SPX' : null;
            
            if (!partnerKey) return false;
            
            const accounts = shippingConfig.partners?.[partnerKey]?.accounts || [];
            return accounts.some((acc: any) => acc.active === true);
        });
    }, [allPartners, shippingConfig]);

    // Partners that don't have active accounts (for linking)
    const inactivePartners = React.useMemo(() => {
        if (!shippingConfig) return allPartners;
        
        return allPartners.filter(partner => {
            const partnerKey = partner.name.includes('GHTK') ? 'GHTK' : 
                             partner.name.includes('GHN') ? 'GHN' :
                             partner.name.includes('ViettelPost') ? 'VTP' :
                             partner.name.includes('J&T') ? 'J&T' :
                             partner.name.includes('SPX') ? 'SPX' : null;
            
            if (!partnerKey) return true;
            
            const accounts = shippingConfig.partners?.[partnerKey]?.accounts || [];
            return !accounts.some((acc: any) => acc.active === true);
        });
    }, [allPartners, shippingConfig]);
    
    const [tab, setTab] = React.useState('fill-info');
    const [isLoading, setIsLoading] = React.useState(false);
    const [estimatedFees, setEstimatedFees] = React.useState<Record<string, any[]>>({});
    const [selectedService, setSelectedService] = React.useState<any | null>(null);

    const selectedPartnerId = useWatch({ control, name: 'shippingPartnerId' });
    const selectedServiceId = useWatch({ control, name: 'shippingServiceId' });
    const selectedPartner = React.useMemo(() => partners.find(p => p.systemId === selectedPartnerId), [partners, selectedPartnerId]);
    
    // ✅ PHASE 2: Convert watch to useWatch for better performance
    const customer = useWatch({ control, name: 'customer' });
    const lineItems = useWatch({ control, name: 'lineItems' });
    const grandTotal = useWatch({ control, name: 'grandTotal' });
    const payments = useWatch({ control, name: 'payments' }) || [];
    const totalPaid = payments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
    
    // Watch weight changes for auto-calculation
    const weight = useWatch({ control, name: 'weight' });
    const codAmount = useWatch({ control, name: 'codAmount' });
    const debouncedWeight = useDebounce(weight, 500); // 500ms delay

    React.useEffect(() => {
        if (deliveryMethod === 'shipping-partner') {
            const codAmount = Math.max(0, grandTotal - totalPaid);
            // ✅ Only auto-fill if user hasn't entered a value yet
            const currentCod = getValues('codAmount');
            if (currentCod === undefined || currentCod === 0) {
                setValue('codAmount', codAmount);
            }

            let totalWeightInGrams = 0;
            if (shippingSettings.weightSource === 'product' && lineItems) {
                totalWeightInGrams = lineItems.reduce((sum: number, item: any) => {
                    const product = findProductById(item.productSystemId);
                    if (!product || !product.weight) {
                        console.warn('⚠️ Product missing weight:', item.productSystemId);
                        return sum;
                    }
                    const weightInGrams = product.weightUnit === 'kg' ? product.weight * 1000 : product.weight;
                    return sum + (weightInGrams * item.quantity);
                }, 0);
                console.log('📦 Auto-calculated weight from products:', totalWeightInGrams, 'grams');
            } else {
                totalWeightInGrams = shippingSettings.customWeight || 1000; // Fallback to 1kg
                console.log('⚖️ Using custom weight:', totalWeightInGrams, 'grams');
            }
            
            // Ensure minimum weight of 100g for API
            if (totalWeightInGrams < 100) {
                console.warn('⚠️ Weight too low, setting to minimum 100g');
                totalWeightInGrams = 100;
            }
            
            if (getValues('weight') !== Math.round(totalWeightInGrams)) {
                setValue('weight', Math.round(totalWeightInGrams));
                console.log('🔄 Updated weight field to:', Math.round(totalWeightInGrams), 'grams');
            }

            setValue('length', shippingSettings.length);
            setValue('width', shippingSettings.width);
            setValue('height', shippingSettings.height);
            setValue('shippingNote', shippingSettings.shippingNote);
            // Do not set this here as it is partner-specific now.
            // setValue('deliveryRequirement', shippingSettings.deliveryRequirement);
        }
    }, [grandTotal, totalPaid, shippingSettings, lineItems, findProductById, setValue, getValues]);


    React.useEffect(() => {
        if (selectedService) {
            setValue('shippingFee', selectedService.fee.total, { shouldDirty: true });
            setValue('shippingPartnerId', selectedService.partner.systemId);
            setValue('shippingServiceId', selectedService.fee.service_id);
    
            const partnerConfig = selectedService.partner.configuration || {};
    
            // Set payer if it's defined in the partner's configuration and is a valid option
            if (partnerConfig.payer && selectedService.partner.config.payerOptions.includes(partnerConfig.payer)) {
                setValue('payer', partnerConfig.payer);
            }
    
            // Set other additional services from the configuration
            (selectedService.partner.config.additionalServices || []).forEach(service => {
                const configValue = partnerConfig[service.id];
                if (configValue !== undefined) {
                    setValue(`configuration.${service.id}`, configValue);
                }
            });
    
        } else if (tab === 'select-partner') { 
            setValue('shippingFee', 0, { shouldDirty: true });
            setValue('shippingPartnerId', undefined);
            setValue('shippingServiceId', undefined);
        }
    }, [selectedService, setValue, tab]);

    // ✅ Watch multiple fields for delivery info changes
    const shippingAddress = useWatch({ control, name: 'shippingAddress' });
    const deliveryInfo = React.useMemo(() => 
        [customer?.shippingAddress_province, customer?.shippingAddress_ward, weight, codAmount, shippingAddress],
        [customer?.shippingAddress_province, customer?.shippingAddress_ward, weight, codAmount, shippingAddress]
    );
    const debouncedDeliveryInfoString = useDebounce(JSON.stringify(deliveryInfo), 500);
    
    const connectedPartners = React.useMemo(() => {
        return partners.filter(p => {
            // Check if partner has active accounts in shipping config
            if (!shippingConfig[p.systemId] || !shippingConfig[p.systemId].accounts) {
                return false;
            }
            const accounts = shippingConfig[p.systemId].accounts;
            return Object.values(accounts).some((account: any) => account.isActive);
        });
    }, [partners, shippingConfig]);

    // Real GHTK API fee calculation
    React.useEffect(() => {
        if (tab !== 'select-partner' || selectedService) return;
        
        const [province, ward, weight, cod, shippingAddress] = JSON.parse(debouncedDeliveryInfoString || '[null,null,null,null,null]');

        // For address validation, check both shippingAddress and legacy customer fields
        const hasValidAddress = (shippingAddress && shippingAddress.province) || 
                               (customer && customer.shippingAddress_province);
        
        if (!hasValidAddress || !weight) {
            console.log('⚠️ Missing required info:', { 
                hasValidAddress, 
                weight,
                shippingAddress: !!shippingAddress,
                customerProvince: !!customer?.shippingAddress_province 
            });
            setEstimatedFees({});
            return;
        }

        const calculate = async () => {
            console.log('🚚 Starting fee calculation for', connectedPartners.length, 'partners');
            console.log('📍 Delivery info:', { province, ward, weight, cod });
            
            setIsLoading(true);
            setEstimatedFees({}); // Clear old fees for a clean loading state

            const feePromises = connectedPartners.map(async (partner) => {
                try {
                    // Get partner configuration from shippingConfig
                    const partnerKey = partner.name.includes('GHTK') ? 'GHTK' : 
                                     partner.name.includes('GHN') ? 'GHN' :
                                     partner.name.includes('ViettelPost') ? 'VTP' :
                                     partner.name.includes('J&T') ? 'J&T' :
                                     partner.name.includes('SPX') ? 'SPX' : null;
                    
                    if (!partnerKey || !shippingConfig?.partners?.[partnerKey]?.accounts) {
                        throw new Error(`No active accounts for ${partner.name}`);
                    }

                    const accounts = shippingConfig.partners[partnerKey].accounts;
                    const activeAccount = accounts.find((acc: any) => acc.active === true);
                    
                    if (!activeAccount) {
                        throw new Error(`No active account for ${partner.name}`);
                    }

                    // For GHTK - call real API
                    if (partnerKey === 'GHTK') {
                        // Get pick address info from GHTK settings
                        const pickupAddresses = activeAccount.pickupAddresses || [];
                        const selectedPickupAddress = pickupAddresses.find(addr => 
                            addr.pick_address_id === activeAccount.selectedPickAddressId
                        ) || pickupAddresses[0]; // fallback to first address
                        
                        console.log('📍 Pick address info:', {
                            total: pickupAddresses.length,
                            selected: selectedPickupAddress,
                            selectedId: activeAccount.selectedPickAddressId
                        });
                        
                        // Auto-detect address level and format for API
                        let ghtk_province = province;
                        let ghtk_district = '';
                        let ghtk_ward = ward || '';
                        
                        // Use shippingAddress from form if available
                        if (shippingAddress && typeof shippingAddress === 'object') {
                            console.log('📍 Using selected shipping address:', {
                                inputLevel: shippingAddress.inputLevel,
                                autoFilled: shippingAddress.autoFilled,
                                hasDistrict: !!shippingAddress.district,
                                address: shippingAddress
                            });
                            
                            ghtk_province = shippingAddress.province;
                            
                            if (shippingAddress.inputLevel === '3-level' && shippingAddress.district) {
                                // 3-level address: có sẵn district
                                ghtk_district = shippingAddress.district;
                                ghtk_ward = shippingAddress.ward || '';
                                console.log('🏢 Using 3-level address format:', { ghtk_province, ghtk_district, ghtk_ward });
                            } else if (shippingAddress.inputLevel === '2-level') {
                                // 2-level address: dùng ward làm district
                                ghtk_district = shippingAddress.ward;
                                ghtk_ward = ''; // Để trống cho 2-level
                                console.log('🏠 Using 2-level address format:', { ghtk_province, ghtk_district, ghtk_ward });
                            } else {
                                // Fallback: cố gắng suy đoán
                                ghtk_district = shippingAddress.district || shippingAddress.ward || 'Quận 1';
                                console.log('🔄 Using fallback address format:', { ghtk_province, ghtk_district, ghtk_ward });
                            }
                        } else {
                            // Legacy format từ customer fields
                            ghtk_district = customer?.shippingAddress_district || 
                                           customer?.shippingAddress_ward || 
                                           'Quận 1';
                            console.log('📝 Using legacy customer fields:', { ghtk_province, ghtk_district, ghtk_ward });
                        }
                        
                        const requestData = {
                            apiToken: activeAccount.apiToken,
                            partnerCode: activeAccount.partnerCode,
                            pick_address_id: selectedPickupAddress?.pick_address_id || '18706397',
                            // KHÔNG GỬI pick_province, pick_district khi có pick_address_id
                            // GHTK sẽ tự động lấy từ pick_address_id
                            province: ghtk_province,
                            district: ghtk_district,
                            ward: ghtk_ward,
                            weight: weight,
                            value: cod || 0,
                            transport: 'road',
                            deliver_option: 'none'
                        };
                        
                        console.log('🌐 Calling GHTK API with:', {
                            ...requestData,
                            apiToken: requestData.apiToken ? `${requestData.apiToken.substring(0, 8)}...` : 'missing'
                        });

                        const response = await fetch(getApiUrl('/shipping/ghtk/calculate-fee'), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requestData)
                        });

                        const data = await response.json();
                        
                        console.log('📦 GHTK API response:', {
                            success: data.success,
                            status: response.status,
                            fee: data.data?.fee?.fee,
                            message: data.message
                        });
                        
                        if (data.success && data.data?.fee) {
                            const fee = data.data.fee;
                            const result = {
                                partnerId: partner.id,
                                fees: [{
                                    service_id: 'standard',
                                    short_name: fee.name || 'Giao hàng tiêu chuẩn',
                                    total: fee.fee + (fee.insurance_fee || 0),
                                    service_type_id: fee.delivery_type || 'standard',
                                    rawData: fee
                                }]
                            };
                            console.log('✅ GHTK calculation success:', result);
                            return result;
                        } else {
                            const errorMsg = data.message || 'GHTK API failed';
                            console.error('❌ GHTK calculation failed:', errorMsg);
                            throw new Error(errorMsg);
                        }
                    }

                    // For other partners - keep mock for now
                    await new Promise(res => setTimeout(res, 300 + Math.random() * 400));
                    
                    const weightFee = (weight / 1000) * 2000;
                    const codFee = (cod || 0) * 0.01;
                    
                    const servicesWithFees = partner.services.map(s => {
                        const hashInput = `${partner.id}-${s.id}-${weight}-${province}-${ward}`;
                        const hash = simpleHash(hashInput);
                        const baseFee = 20000 + (hash % 15000); // Stable fee
                        
                        const total = Math.round((baseFee + weightFee + codFee) / 1000) * 1000;

                        return {
                            ...s,
                            total,
                            service_id: s.id,
                            short_name: s.name,
                            service_type_id: s.id 
                        };
                    });

                    return { partnerId: partner.id, fees: servicesWithFees };
                } catch (error) {
                    console.error(`Error calculating fee for ${partner.name}:`, error);
                    return { partnerId: partner.id, fees: [], error: error.message };
                }
            });

            const results = await Promise.all(feePromises);
            
            const newFees = results.reduce((acc, result) => {
                acc[result.partnerId] = result.fees;
                return acc;
            }, {} as Record<string, any[]>);
            
            setEstimatedFees(newFees);
            setIsLoading(false);
        };
        calculate();

    }, [debouncedDeliveryInfoString, tab, connectedPartners, selectedService]);

    const bestFees = React.useMemo(() => {
        const allFees = Object.values(estimatedFees).flat();
        if (allFees.length === 0) return { cheapest: null, fastest: null };
        
        const cheapest = [...allFees].sort((a: any, b: any) => a.total - b.total)[0];
        const fastest = [...allFees].sort((a: any, b: any) => (a.name.includes('Nhanh') ? -1 : 1) - (b.name.includes('Nhanh') ? -1 : 1))[0];
        
        return { cheapest, fastest };
    }, [estimatedFees]);

    const ghnOptionLabels: Record<string, string> = {
        'CHOXEMHANGKHONGTHU': 'Cho xem hàng, không cho thử',
        'KHONGCHOXEMHANG': 'Không cho xem hàng',
        'CHOXEMHANG': 'Cho xem hàng và thử'
    };
    
    const renderDetailedForm = () => {
        if (!selectedService) return null;
        const { partner, fee } = selectedService;
        const additionalServices = partner.config.additionalServices || [];

        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <PartnerAvatar name={partner.name} />
                            <div><h3 className="font-semibold text-lg">{partner.name}</h3></div>
                        </div>
                        <Button variant="link" size="sm" type="button" onClick={() => setSelectedService(null)}>Chọn đối tác khác</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Standard Fields rendered first */}
                        <FormItem>
                            <FormLabel>Gói dịch vụ</FormLabel>
                            <Input value={fee.short_name} disabled />
                        </FormItem>
                        
                        {/* Render additionalServices */}
                        {additionalServices.map(service => (
                            <FormField
                                key={service.id}
                                control={control}
                                name={`configuration.${service.id}` as any}
                                render={({ field }) => {
                                    const itemClass = service.gridSpan === 2 ? 'md:col-span-2' : '';
                                    
                                    const renderControl = () => {
                                        switch (service.type) {
                                            case 'select':
                                                return <Select onValueChange={field.onChange} value={field.value} disabled={service.disabled}><FormControl><SelectTrigger><SelectValue placeholder={service.placeholder} /></SelectTrigger></FormControl><SelectContent>{(service.options as string[])?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent></Select>;
                                            case 'number':
                                                return <NumberInput {...field} placeholder={service.placeholder} disabled={service.disabled} />;
                                            case 'date':
                                                return <DatePicker value={field.value} onChange={field.onChange} disabled={service.disabled} />;
                                            case 'text':
                                                return (
                                                    <div className="flex items-center gap-2">
                                                        <Input {...field} placeholder={service.placeholder} disabled={service.disabled} />
                                                        {service.buttonLabel && <Button type="button" variant="secondary">{service.buttonLabel}</Button>}
                                                    </div>
                                                );
                                            case 'radio':
                                                 return (
                                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="mt-2 space-y-2">
                                                        {(service.options as string[])?.map(opt => (
                                                            <FormItem key={opt} className="flex items-center space-x-2 space-y-0">
                                                                <FormControl><RadioGroupItem value={opt} /></FormControl>
                                                                <Label className="font-normal">{ghnOptionLabels[opt] || opt}</Label>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                );
                                            case 'checkbox':
                                            default:
                                                return (
                                                    <div className="flex items-center space-x-2 pt-2">
                                                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={service.disabled} /></FormControl>
                                                        <Label className="font-normal">{service.label}</Label>
                                                        {service.tooltip && (<TooltipProvider><Tooltip><TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>{service.tooltip}</p></TooltipContent></Tooltip></TooltipProvider>)}
                                                    </div>
                                                );
                                        }
                                    };
                                    
                                    if(service.type === 'checkbox') {
                                        return <FormItem className={cn("flex items-center space-x-2 space-y-0 pt-6", itemClass)}>{renderControl()}</FormItem>
                                    }

                                    return (
                                        <FormItem className={itemClass}>
                                            <FormLabel>{service.label}</FormLabel>
                                            <FormControl>{renderControl()}</FormControl>
                                        </FormItem>
                                    );
                                }}
                            />
                        ))}
                         {partner.config.payerOptions.length > 0 && (
                            <FormField control={control} name="payer" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Người trả phí</FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4 pt-2">
                                            {partner.config.payerOptions.includes('shop') && <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="shop" /></FormControl><FormLabel className="font-normal">Shop trả</FormLabel></FormItem>}
                                            {partner.config.payerOptions.includes('customer') && <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="customer" /></FormControl><FormLabel className="font-normal">Khách trả</FormLabel></FormItem>}
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )} />
                        )}
                    </div>
                    <div className="mt-6 pt-4 border-t flex justify-between items-end">
                        <div>
                            <p className="text-sm text-muted-foreground">Phí trả đối tác vận chuyển</p>
                            <p className="font-bold text-lg">{formatCurrency(fee.total)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const deliveryMethod = useWatch({ control, name: 'deliveryMethod' });

    return (
        <Tabs value={tab} onValueChange={setTab} className="mt-4">
            <TabsList>
                <TabsTrigger value="fill-info" disabled={disabled}>Điền thông tin</TabsTrigger>
                <TabsTrigger value="select-partner" disabled={disabled}>Chọn đơn vị vận chuyển</TabsTrigger>
            </TabsList>
            <TabsContent value="fill-info">
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField control={control} name="shippingPartnerId" render={({ field }) => (
                        <FormItem><FormLabel>Đối tác vận chuyển</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={disabled ?? false}><FormControl><SelectTrigger><SelectValue placeholder="Chọn đối tác" /></SelectTrigger></FormControl><SelectContent>{partners.map(p => <SelectItem key={p.systemId} value={p.systemId}>{p.name}</SelectItem>)}</SelectContent></Select></FormItem>
                    )} />
                    {selectedPartner && selectedPartner.services.length > 0 && (
                        <FormField control={control} name="shippingServiceId" render={({ field }) => (
                            <FormItem><FormLabel>Dịch vụ</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={disabled ?? false}><FormControl><SelectTrigger><SelectValue placeholder="Chọn dịch vụ" /></SelectTrigger></FormControl><SelectContent>{selectedPartner.services.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></FormItem>
                        )} />
                    )}
                     <FormField control={control} name="trackingCode" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Mã vận đơn (Tùy chọn)</FormLabel><FormControl><Input {...field} placeholder="Nhập mã vận đơn nếu có" disabled={disabled ?? false} /></FormControl></FormItem>)} />
                </div>
            </TabsContent>
            <TabsContent value="select-partner">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-4 min-w-0">
                        <FormItem><FormLabel>Địa chỉ giao hàng</FormLabel><FormControl><Input value={customer ? [customer.shippingAddress_street, customer.shippingAddress_ward, customer.shippingAddress_province].filter(Boolean).join(', ') : ''} disabled /></FormControl></FormItem>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={control} name="codAmount" render={({ field }) => (<FormItem><FormLabel>Tiền thu hộ (COD)</FormLabel><FormControl><NumberInput {...field} onChange={field.onChange} disabled={disabled} /></FormControl></FormItem>)} />
                            <FormField control={control} name="weight" render={({ field }) => (<FormItem><FormLabel>Khối lượng (g)</FormLabel><FormControl><NumberInput {...field} onChange={field.onChange} disabled={disabled} /></FormControl></FormItem>)} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                             <FormField control={control} name="length" render={({ field }) => (<FormItem><FormLabel>Dài (cm)</FormLabel><FormControl><NumberInput {...field} onChange={field.onChange} disabled={disabled} /></FormControl></FormItem>)} />
                             <FormField control={control} name="width" render={({ field }) => (<FormItem><FormLabel>Rộng (cm)</FormLabel><FormControl><NumberInput {...field} onChange={field.onChange} disabled={disabled} /></FormControl></FormItem>)} />
                             <FormField control={control} name="height" render={({ field }) => (<FormItem><FormLabel>Cao (cm)</FormLabel><FormControl><NumberInput {...field} onChange={field.onChange} disabled={disabled} /></FormControl></FormItem>)} />
                        </div>
                         <FormField control={control} name="deliveryRequirement" render={({ field }) => (<FormItem><FormLabel>Yêu cầu giao hàng</FormLabel><Select onValueChange={field.onChange} value={field.value as string} disabled={disabled ?? false}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="CHOXEMHANGKHONGTHU">Cho xem hàng, không cho thử</SelectItem><SelectItem value="KHONGCHOXEMHANG">Không cho xem hàng</SelectItem></SelectContent></Select></FormItem>)} />
                        <FormField control={control} name="shippingNote" render={({ field }) => (<FormItem><FormLabel>Ghi chú</FormLabel><FormControl><Textarea {...field} disabled={disabled ?? false} /></FormControl></FormItem>)} />
                    </div>
                    <div className="space-y-4 min-w-0">
                        {selectedService ? (
                            renderDetailedForm()
                        ) : (
                            <>
                                <Label>Chi phí vận chuyển ước tính của các gói cước</Label>
                                <ScrollArea className="h-96 rounded-md border">
                                    <div className="p-4 space-y-4">
                                        {isLoading && Object.keys(estimatedFees).length === 0 && <div className="flex items-center justify-center p-4"><Spinner /></div>}
                                        {!customer || !customer.shippingAddress_province ? (
                                            <p className="text-sm text-destructive p-2 bg-destructive/10 rounded-md">Vui lòng cập nhật địa chỉ giao hàng (Tỉnh/Thành phố) để sử dụng dịch vụ vận chuyển</p>
                                        ) : connectedPartners.length > 0 ? (
                                            connectedPartners.map(partner => (
                                                <div key={partner.systemId}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <PartnerAvatar name={partner.name} />
                                                        <h4 className="font-semibold">{partner.name}</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {isLoading && !estimatedFees[partner.id] && <div className="flex items-center justify-center p-2"><Spinner className="h-4 w-4" /></div>}
                                                        {estimatedFees[partner.id] && estimatedFees[partner.id].map(fee => {
                                                            const isSelected = selectedPartnerId === partner.systemId && selectedServiceId === fee.service_id;
                                                            return (
                                                            <div key={fee.service_id} className={cn("flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer", isSelected && 'bg-primary/10 border border-primary')} onClick={() => !disabled && setSelectedService({ partner, fee })}>
                                                                <div>
                                                                    <Label htmlFor={`${partner.id}-${fee.service_id}`} className="font-medium cursor-pointer">{fee.short_name}</Label>
                                                                    <p className="text-xs text-muted-foreground">Thời gian dự kiến: {fee.service_type_id.includes('Nhanh') ? 'Giao 24h' : 'Giao 2-3 ngày'}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-sm">{formatCurrency(fee.total)}</p>
                                                                    {bestFees.cheapest?.service_id === fee.service_id && <Badge variant="outline" className="text-green-600 border-green-500">Rẻ nhất</Badge>}
                                                                    {bestFees.fastest?.service_id === fee.service_id && <Badge variant="outline" className="text-amber-600 border-amber-500">Nhanh nhất</Badge>}
                                                                </div>
                                                            </div>
                                                        )})
                                                    }
                                                        {!isLoading && estimatedFees[partner.id] && estimatedFees[partner.id].length === 0 && (
                                                            <p className="text-sm text-muted-foreground p-2">Không có gói cước phù hợp.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : null}
                                        
                                        {/* Inactive Partners Section */}
                                        {inactivePartners.length > 0 && (
                                            <div className="mt-6 pt-4 border-t">
                                                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                                                    Đối tác chưa cấu hình
                                                </h4>
                                                <div className="space-y-2">
                                                    {inactivePartners.map(partner => (
                                                        <div key={partner.systemId} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                                                            <div className="flex items-center gap-2">
                                                                <PartnerAvatar name={partner.name} />
                                                                <span className="text-sm font-medium">{partner.name}</span>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => navigate('/settings/shipping-partners')}
                                                            >
                                                                Cấu hình
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {connectedPartners.length === 0 && inactivePartners.length === 0 && (
                                            <p className="text-sm text-muted-foreground text-center p-4">Không có đối tác vận chuyển nào khả dụng.</p>
                                        )}
                                    </div>
                                </ScrollArea>
                            </>
                        )}
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}
