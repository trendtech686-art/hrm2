import * as React from "react";
// FIX: Add Controller to imports
import { useForm, Controller } from "react-hook-form"
import { asBusinessId } from "@/lib/id-types";
import type { Product } from "./types.ts"
import { useProductStore } from "./store.ts";
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
import { useUnitStore } from "../settings/units/store.ts";
// ✅ REMOVED: import { generateNextId } - use id: '' instead
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form.tsx"
import { Input } from "../../components/ui/input.tsx"
import { CurrencyInput } from "../../components/ui/currency-input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog.tsx";
import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button.tsx";
import { PricingPolicyForm, type PricingPolicyFormValues } from "../settings/pricing/form.tsx";
import type { PricingPolicy } from "../settings/pricing/types.ts";
import { Combobox } from "../../components/ui/combobox.tsx";

// FIX: Redefined ProductFormValues to be specific to the form's needs, separating it from the main Product data model.
export type ProductFormValues = {
  id: string;
  name: string;
  unit: string;
  costPrice: number;
  prices: Record<string, number>;
  inventory: number;
  weight?: number;
  weightUnit?: 'g' | 'kg';
  primarySupplierSystemId?: string;
  reorderLevel?: number;
  safetyStock?: number;
};


type ProductFormProps = {
  initialData: Product | null;
  onSubmit: (values: ProductFormValues) => void;
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const { data: products } = useProductStore();
  const { data: pricingPolicies, add: addPricingPolicy } = usePricingPolicyStore();
  const { data: units } = useUnitStore();

  const [isPolicyFormOpen, setIsPolicyFormOpen] = React.useState(false);

  const salesPolicies = React.useMemo(() => pricingPolicies.filter(p => p.type === 'Bán hàng'), [pricingPolicies]);
  const unitOptions = React.useMemo(() => units.map(u => ({ value: u.name, label: u.name })), [units]);

  // FIX: Correctly structure defaultValues and map initialData to match the new ProductFormValues type, resolving type conflicts.
  const form = useForm<ProductFormValues>({
    defaultValues: initialData 
    ? {
        id: initialData.id,
        name: initialData.name,
        unit: initialData.unit,
        costPrice: initialData.costPrice,
        prices: initialData.prices,
        inventory: Object.values(initialData.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0),
        weight: initialData.weight,
        weightUnit: initialData.weightUnit,
        primarySupplierSystemId: initialData.primarySupplierSystemId,
        reorderLevel: initialData.reorderLevel,
        safetyStock: initialData.safetyStock
    }
    : {
      id: "", // ✅ Empty string = auto-generate
      name: "",
      unit: "Cái",
      costPrice: 0,
      inventory: 0,
      weight: 0,
      weightUnit: 'g',
      prices: {},
      primarySupplierSystemId: undefined,
    },
  });
  
  const handlePolicyFormSubmit = (values: PricingPolicyFormValues) => {
    const normalizedPolicy = {
      id: asBusinessId(values.id.trim().toUpperCase()),
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      type: values.type,
      isActive: values.isActive,
      isDefault: values.isDefault,
    } satisfies Omit<PricingPolicy, 'systemId'>;

    addPricingPolicy(normalizedPolicy);
    setIsPolicyFormOpen(false);
  };

  return (
    <Form {...form}>
      {/* FIX: Corrected form submission to pass ProductFormValues */}
      <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Section 1: Basic Info */}
        <section>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Thông tin cơ bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* FIX: Corrected form field definitions to align with the new ProductFormValues type. */}
            <FormField control={form.control} name="id" render={({ field }) => (
              // FIX: Explicitly cast field.value to string to resolve type incompatibility with InputProps.
              <FormItem><FormLabel>Mã sản phẩm (SKU)</FormLabel><FormControl><Input placeholder="VD: SP000001" {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="name" render={({ field }) => (
              // FIX: Explicitly cast field.value to string to resolve type incompatibility with InputProps.
              <FormItem className="md:col-span-2"><FormLabel>Tên sản phẩm/dịch vụ</FormLabel><FormControl><Input placeholder="VD: Tư vấn chiến lược Marketing" {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
            )} />
            {/* FIX: Handle type mismatch between RHF (string) and Combobox (object) */}
            <FormField control={form.control} name="unit" render={({ field }) => (
                <FormItem>
                    <FormLabel>Đơn vị tính</FormLabel>
                    <FormControl>
                        <Combobox
                          options={unitOptions}
                          value={unitOptions.find(opt => opt.value === (field.value as string)) || null}
                          onChange={option => field.onChange(option ? option.value : '')}
                          placeholder="Chọn đơn vị tính"
                          searchPlaceholder="Tìm đơn vị..."
                          emptyPlaceholder="Không tìm thấy."
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
          </div>
        </section>

        {/* Section 2: Pricing */}
        <section>
           <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h3 className="text-lg font-medium">Giá bán</h3>
                <Dialog open={isPolicyFormOpen} onOpenChange={setIsPolicyFormOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Thêm chính sách giá
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thêm chính sách giá mới</DialogTitle>
                        </DialogHeader>
                        <PricingPolicyForm onSubmit={handlePolicyFormSubmit} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsPolicyFormOpen(false)}>Thoát</Button>
                            <Button type="submit" form="pricing-policy-form">Xác nhận</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {salesPolicies.map(policy => (
              <FormField
                key={policy.systemId}
                control={form.control}
                name={`prices.${policy.systemId}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{policy.name} {policy.isDefault && <span className="text-xs text-muted-foreground">(Mặc định)</span>}</FormLabel>
                    <FormControl>
                      <CurrencyInput 
                        value={field.value as number}
                        onChange={field.onChange}
                        placeholder="Nhập giá bán"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
           {salesPolicies.length === 0 && (
             <p className="text-sm text-muted-foreground">Chưa có chính sách giá bán nào. Vui lòng vào Cài đặt để thêm.</p>
           )}
        </section>

        {/* Section 3: Inventory & Cost */}
        <section>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Mua hàng & Kho</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="costPrice" render={({ field }) => (
              <FormItem><FormLabel>Giá vốn</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="inventory" render={({ field }) => (
              <FormItem><FormLabel>Tồn kho</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as number} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </section>

        {/* Section 4: Logistics */}
        <section>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Vận đơn</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="weight" render={({ field }) => (
                // FIX: Explicitly cast field.value to number to resolve type incompatibility with NumberInput.
                <FormItem><FormLabel>Khối lượng</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as number} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="weightUnit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn vị khối lượng</FormLabel>
                  {/* FIX: Explicitly cast field.value to string to resolve type incompatibility with Select. */}
                  <Select onValueChange={field.onChange} value={field.value as string}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="g">g (gram)</SelectItem>
                      <SelectItem value="kg">kg (kilogram)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
          </div>
        </section>
      </form>
    </Form>
  )
}

