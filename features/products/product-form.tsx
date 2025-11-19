import * as React from "react";
// FIX: Add Controller to imports
import { useForm, Controller } from "react-hook-form"
import { asBusinessId } from "@/lib/id-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, validateUniqueId, validateUniqueBarcode, type ProductFormData } from "./validation.ts";
import type { Product } from "./types.ts"
import { useProductStore } from "./store.ts";
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
import { useUnitStore } from "../settings/units/store.ts";
// ✅ REMOVED: import { generateNextId } - use id: '' instead
import { toast } from 'sonner';
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
  title?: string;
  description?: string;
  shortDescription?: string;
  type?: 'physical' | 'service' | 'digital';
  category?: string;
  subCategory?: string;
  tags?: string[];
  status?: 'active' | 'inactive' | 'discontinued';
  unit: string;
  costPrice: number;
  prices: Record<string, number>;
  inventory: number;
  suggestedRetailPrice?: number;
  minPrice?: number;
  weight?: number;
  weightUnit?: 'g' | 'kg';
  dimensions?: { length: number; width: number; height: number };
  barcode?: string;
  primarySupplierSystemId?: string;
  reorderLevel?: number;
  safetyStock?: number;
  maxStock?: number;
  launchedDate?: string;
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
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData 
    ? {
        id: initialData.id,
        name: initialData.name,
        title: initialData.title,
        description: initialData.description,
        shortDescription: initialData.shortDescription,
        type: initialData.type,
        tags: initialData.tags,
        status: initialData.status,
        unit: initialData.unit,
        costPrice: initialData.costPrice,
        prices: initialData.prices,
        inventory: Object.values(initialData.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0),
        suggestedRetailPrice: initialData.suggestedRetailPrice,
        minPrice: initialData.minPrice,
        weight: initialData.weight,
        weightUnit: initialData.weightUnit,
        dimensions: initialData.dimensions,
        barcode: initialData.barcode,
        primarySupplierSystemId: initialData.primarySupplierSystemId,
        reorderLevel: initialData.reorderLevel,
        safetyStock: initialData.safetyStock,
        maxStock: initialData.maxStock,
        launchedDate: initialData.launchedDate
    }
    : {
      id: "", // ✅ Empty string = auto-generate by store
      name: "",
      title: "",
      description: "",
      shortDescription: "",
      type: 'physical',
      tags: [],
      status: 'active',
      unit: "Cái",
      costPrice: 0,
      inventory: 0,
      weight: 0,
      weightUnit: 'g',
      barcode: "",
      prices: {},
      primarySupplierSystemId: undefined,
      suggestedRetailPrice: 0,
      minPrice: 0,
      dimensions: undefined,
      reorderLevel: 0,
      safetyStock: 0,
      maxStock: 0,
      launchedDate: undefined
    },
    mode: 'onChange', // Validate on every change for realtime feedback
    reValidateMode: 'onChange',
  });

  // Debounced unique ID validation
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'id' && value.id) {
        const existingIds = products.map(p => p.id);
        const isUnique = validateUniqueId(value.id, existingIds, initialData?.id);
        
        if (!isUnique) {
          form.setError('id', {
            type: 'manual',
            message: 'Mã sản phẩm đã tồn tại'
          });
        } else {
          form.clearErrors('id');
        }
      }
      
      // Validate barcode uniqueness
      if (name === 'barcode' && value.barcode) {
        const existingBarcodes = products.map(p => p.barcode).filter(Boolean) as string[];
        const isUnique = validateUniqueBarcode(value.barcode, existingBarcodes, initialData?.barcode);
        
        if (!isUnique) {
          form.setError('barcode', {
            type: 'manual',
            message: 'Mã vạch đã tồn tại'
          });
        } else {
          form.clearErrors('barcode');
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, products, initialData]);
  
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
            
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Tiêu đề SEO</FormLabel>
                <FormControl><Input placeholder="VD: Tư vấn chiến lược Marketing - Giải pháp toàn diện" {...field} value={field.value as string || ''} /></FormControl>
                <FormDescription>Tiêu đề tối ưu cho SEO, thân thiện với công cụ tìm kiếm</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="shortDescription" render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Mô tả ngắn</FormLabel>
                <FormControl><Input placeholder="Mô tả ngắn gọn trong 1-2 câu" {...field} value={field.value as string || ''} /></FormControl>
                <FormDescription>Mô tả tóm tắt hiển thị trong danh sách sản phẩm</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Mô tả chi tiết</FormLabel>
                <FormControl>
                  <textarea 
                    placeholder="Mô tả chi tiết về sản phẩm, tính năng, thông số kỹ thuật..." 
                    {...field} 
                    value={field.value as string || ''} 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={6}
                  />
                </FormControl>
                <FormDescription>Hỗ trợ HTML cho định dạng văn bản</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Loại sản phẩm</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="physical">Hàng hóa</SelectItem>
                    <SelectItem value="service">Dịch vụ</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <FormControl><Input placeholder="VD: Phần cứng" {...field} value={field.value as string || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Đang bán</SelectItem>
                    <SelectItem value="inactive">Ngừng bán</SelectItem>
                    <SelectItem value="discontinued">Ngừng sản xuất</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
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
            
            <FormField control={form.control} name="barcode" render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Mã vạch (Barcode)</FormLabel>
                <FormControl><Input placeholder="VD: 8934990000000" {...field} value={field.value as string || ''} /></FormControl>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField control={form.control} name="costPrice" render={({ field }) => (
              <FormItem><FormLabel>Giá vốn</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="suggestedRetailPrice" render={({ field }) => (
              <FormItem><FormLabel>Giá bán lẻ đề xuất</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="minPrice" render={({ field }) => (
              <FormItem><FormLabel>Giá tối thiểu</FormLabel><FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" /></FormControl><FormDescription>Giá thấp nhất cho phép bán</FormDescription><FormMessage /></FormItem>
            )} />
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

        {/* Section 3: Inventory & Warehouse */}
        <section>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Kho & Tồn kho</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField control={form.control} name="inventory" render={({ field }) => (
              <FormItem><FormLabel>Tồn kho ban đầu</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as number} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="reorderLevel" render={({ field }) => (
              <FormItem><FormLabel>Mức đặt hàng lại</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as number || 0} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="safetyStock" render={({ field }) => (
              <FormItem><FormLabel>Tồn kho an toàn</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as number || 0} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="maxStock" render={({ field }) => (
              <FormItem><FormLabel>Tồn kho tối đa</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as number || 0} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </section>

        {/* Section 4: Logistics */}
        <section>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Vận đơn & Kích thước</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem><FormLabel>Khối lượng</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as number || 0} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="weightUnit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn vị</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value as string}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dimensions.length" render={({ field }) => (
                <FormItem><FormLabel>Dài (cm)</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as number || 0} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dimensions.width" render={({ field }) => (
                <FormItem><FormLabel>Rộng (cm)</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as number || 0} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dimensions.height" render={({ field }) => (
                <FormItem><FormLabel>Cao (cm)</FormLabel><FormControl><Input type="number" min="0" {...field} value={field.value as number || 0} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} /></FormControl><FormMessage /></FormItem>
              )} />
          </div>
        </section>

        {/* Section 5: Inventory Management */}
        <section>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Quản lý tồn kho</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="reorderLevel" render={({ field }) => (
                <FormItem><FormLabel>Mức đặt hàng lại</FormLabel><FormControl><Input type="number" placeholder="0" {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="safetyStock" render={({ field }) => (
                <FormItem><FormLabel>Tồn kho an toàn</FormLabel><FormControl><Input type="number" placeholder="0" {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="maxStock" render={({ field }) => (
                <FormItem><FormLabel>Tồn kho tối đa</FormLabel><FormControl><Input type="number" placeholder="0" {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>
              )} />
          </div>
        </section>

        {/* Section 6: Additional Info */}
        <section>
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Thông tin bổ sung</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="subCategory" render={({ field }) => (
                <FormItem><FormLabel>Danh mục con</FormLabel><FormControl><Input placeholder="VD: Camera ngoài trời" {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="launchedDate" render={({ field }) => (
                <FormItem><FormLabel>Ngày ra mắt</FormLabel><FormControl><Input type="date" {...field} value={field.value as string || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem className="md:col-span-2"><FormLabel>Tags</FormLabel><FormControl><Input placeholder="Nhập tags, phân cách bằng dấu phẩy" {...field} value={Array.isArray(field.value) ? field.value.join(', ') : ''} onChange={(e) => field.onChange(e.target.value.split(',').map(t => t.trim()).filter(Boolean))} /></FormControl><FormMessage /></FormItem>
              )} />
          </div>
        </section>
      </form>
    </Form>
  )
}

