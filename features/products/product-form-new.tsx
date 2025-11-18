import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Product } from "./types.ts";
import { useProductStore } from "./store.ts";
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
import { useSupplierStore } from "../suppliers/store.ts";
import { useUnitStore } from "../settings/units/store.ts";
import { useProductTypeStore } from "../settings/inventory/product-type-store.ts";
import { useProductCategoryStore } from "../settings/inventory/product-category-store.ts";
import { useStorageLocationStore } from "../settings/inventory/storage-location-store.ts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";
import { CurrencyInput } from "../../components/ui/currency-input.tsx";
import { Textarea } from "../../components/ui/textarea.tsx";
import { TagInput } from "../../components/ui/tag-input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Combobox } from "../../components/ui/combobox.tsx";
import { Calendar } from "../../components/ui/calendar.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover.tsx";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "../../lib/utils.ts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog.tsx";
import { PricingPolicyForm, type PricingPolicyFormValues } from "../settings/pricing/form.tsx";

// Validation Schema
const productFormSchema = z.object({
  id: z.string().min(1, "Mã sản phẩm là bắt buộc"),
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  title: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  type: z.enum(['physical', 'service', 'digital']).optional(),
  productTypeSystemId: z.string().optional(),
  categorySystemId: z.string().optional(),
  storageLocationSystemId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'discontinued']).optional(),
  unit: z.string().min(1, "Đơn vị tính là bắt buộc"),
  costPrice: z.number().min(0, "Giá vốn phải >= 0"),
  prices: z.record(z.string(), z.number()),
  inventory: z.number().min(0, "Tồn kho phải >= 0"),
  suggestedRetailPrice: z.number().optional(),
  minPrice: z.number().optional(),
  weight: z.number().optional(),
  weightUnit: z.enum(['g', 'kg']).optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  primarySupplierSystemId: z.string().optional(),
  reorderLevel: z.number().optional(),
  safetyStock: z.number().optional(),
  maxStock: z.number().optional(),
  launchedDate: z.date().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

type ProductFormProps = {
  initialData: Product | null;
  onSubmit: (values: ProductFormValues) => void;
};

export function ProductFormNew({ initialData, onSubmit }: ProductFormProps) {
  const { data: products } = useProductStore();
  const { data: pricingPolicies, add: addPricingPolicy } = usePricingPolicyStore();
  const { data: suppliers } = useSupplierStore();
  const { data: units } = useUnitStore();
  const { getActive: getActiveProductTypes } = useProductTypeStore();
  const { getActive: getActiveCategories } = useProductCategoryStore();

  const [isPolicyFormOpen, setIsPolicyFormOpen] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const salesPolicies = React.useMemo(() => pricingPolicies.filter(p => p.type === 'Bán hàng'), [pricingPolicies]);
  const unitOptions = React.useMemo(() => units.map(u => ({ value: u.name, label: u.name })), [units]);
  const supplierOptions = React.useMemo(() => suppliers.map(s => ({ value: s.systemId, label: s.name })), [suppliers]);
  const productTypeOptions = React.useMemo(() => 
    getActiveProductTypes().map(pt => ({ value: pt.systemId, label: pt.name })), 
    [getActiveProductTypes]
  );
  const categoryOptions = React.useMemo(() => 
    getActiveCategories().map(cat => ({ value: cat.systemId, label: cat.name })), 
    [getActiveCategories]
  );

  const { getActive: getActiveStorageLocations } = useStorageLocationStore();
  const storageLocationOptions = React.useMemo(() => 
    getActiveStorageLocations().map(loc => ({ value: loc.systemId, label: loc.name })), 
    [getActiveStorageLocations]
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData 
    ? {
        id: initialData.id,
        name: initialData.name,
        title: initialData.title,
        description: initialData.description,
        shortDescription: initialData.shortDescription,
        type: initialData.type || 'physical',
        productTypeSystemId: initialData.productTypeSystemId,
        categorySystemId: initialData.categorySystemId,
        storageLocationSystemId: initialData.storageLocationSystemId,
        tags: initialData.tags || [],
        status: initialData.status || 'active',
        unit: initialData.unit,
        costPrice: initialData.costPrice,
        prices: initialData.prices || {},
        inventory: Object.values(initialData.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0),
        suggestedRetailPrice: initialData.suggestedRetailPrice,
        minPrice: initialData.minPrice,
        weight: initialData.weight,
        weightUnit: initialData.weightUnit || 'g',
        dimensions: initialData.dimensions,
        primarySupplierSystemId: initialData.primarySupplierSystemId,
        reorderLevel: initialData.reorderLevel,
        safetyStock: initialData.safetyStock,
        maxStock: initialData.maxStock,
        launchedDate: initialData.launchedDate ? new Date(initialData.launchedDate) : undefined,
    }
    : {
      id: "", // ✅ Empty string = auto-generate
      name: "",
      title: "",
      description: "",
      shortDescription: "",
      type: 'physical',
      productTypeSystemId: undefined,
      categorySystemId: undefined,
      storageLocationSystemId: undefined,
      tags: [],
      status: 'active',
      unit: "Cái",
      costPrice: 0,
      inventory: 0,
      weight: 0,
      weightUnit: 'g',
      prices: {},
      primarySupplierSystemId: undefined,
      suggestedRetailPrice: 0,
      minPrice: 0,
      dimensions: undefined,
      reorderLevel: 0,
      safetyStock: 0,
      maxStock: 0,
      launchedDate: undefined,
    },
    mode: 'onChange',
  });

  // Validate unique ID
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'id' && value.id) {
        const isDuplicate = products.some(p => p.id === value.id && p.id !== initialData?.id);
        if (isDuplicate) {
          form.setError('id', { type: 'manual', message: 'Mã sản phẩm đã tồn tại' });
        } else {
          form.clearErrors('id');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, products, initialData]);
  
  const handlePolicyFormSubmit = (values: PricingPolicyFormValues) => {
    addPricingPolicy(values);
    setIsPolicyFormOpen(false);
  };

  return (
    <Form {...form}>
      <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Section 1: Thông tin cơ bản */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Thông tin cơ bản</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="id" render={({ field }) => (
              <FormItem>
                <FormLabel>Mã sản phẩm (SKU) <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="VD: SP000001" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Tên sản phẩm <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="VD: Laptop Dell XPS 13" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField control={form.control} name="productTypeSystemId" render={({ field }) => (
              <FormItem>
                <FormLabel>Phân loại</FormLabel>
                <FormControl>
                  <Combobox
                    options={productTypeOptions}
                    value={productTypeOptions.find(opt => opt.value === field.value) || null}
                    onChange={option => field.onChange(option ? option.value : undefined)}
                    placeholder="Chọn phân loại"
                    searchPlaceholder="Tìm phân loại..."
                    emptyPlaceholder="Không tìm thấy."
                  />
                </FormControl>
                <FormDescription>Loại sản phẩm từ cài đặt</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Đang giao dịch</SelectItem>
                    <SelectItem value="inactive">Ngừng giao dịch</SelectItem>
                    <SelectItem value="discontinued">Ngừng sản xuất</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField control={form.control} name="categorySystemId" render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <FormControl>
                  <Combobox
                    options={categoryOptions}
                    value={categoryOptions.find(opt => opt.value === field.value) || null}
                    onChange={option => field.onChange(option ? option.value : undefined)}
                    placeholder="Chọn danh mục"
                    searchPlaceholder="Tìm danh mục..."
                    emptyPlaceholder="Không tìm thấy."
                  />
                </FormControl>
                <FormDescription>Danh mục từ cài đặt</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="unit" render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn vị tính <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Combobox
                    options={unitOptions}
                    value={unitOptions.find(opt => opt.value === field.value) || null}
                    onChange={option => field.onChange(option ? option.value : '')}
                    placeholder="Chọn đơn vị"
                    searchPlaceholder="Tìm đơn vị..."
                    emptyPlaceholder="Không tìm thấy."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="storageLocationSystemId" render={({ field }) => (
            <FormItem>
              <FormLabel>Điểm lưu kho</FormLabel>
              <FormControl>
                <Combobox
                  options={storageLocationOptions}
                  value={storageLocationOptions.find(opt => opt.value === field.value) || null}
                  onChange={option => field.onChange(option ? option.value : undefined)}
                  placeholder="Chọn điểm lưu kho"
                  searchPlaceholder="Tìm điểm lưu kho..."
                  emptyPlaceholder="Không tìm thấy."
                />
              </FormControl>
              <FormDescription>Vị trí lưu trữ sản phẩm trong kho</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="shortDescription" render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả ngắn</FormLabel>
              <FormControl>
                <Input placeholder="Mô tả ngắn gọn trong 1-2 câu" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>Hiển thị trong danh sách sản phẩm</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả chi tiết</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Mô tả chi tiết về sản phẩm, tính năng, thông số kỹ thuật..." 
                  {...field} 
                  value={field.value || ''} 
                  rows={5}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </section>

        {/* Section 2: Giá bán */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-2">
            <h3 className="text-lg font-semibold">Giá bán</h3>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="costPrice" render={({ field }) => (
              <FormItem>
                <FormLabel>Giá vốn <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <CurrencyInput value={field.value} onChange={field.onChange} placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="suggestedRetailPrice" render={({ field }) => (
              <FormItem>
                <FormLabel>Giá bán lẻ đề xuất</FormLabel>
                <FormControl>
                  <CurrencyInput value={field.value || 0} onChange={field.onChange} placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="minPrice" render={({ field }) => (
              <FormItem>
                <FormLabel>Giá tối thiểu</FormLabel>
                <FormControl>
                  <CurrencyInput value={field.value || 0} onChange={field.onChange} placeholder="0" />
                </FormControl>
                <FormDescription>Giá thấp nhất cho phép bán</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {salesPolicies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {salesPolicies.map(policy => (
                <div key={policy.systemId} className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {policy.name} 
                    {policy.isDefault && <span className="text-xs text-muted-foreground ml-1">(Mặc định)</span>}
                  </label>
                  <CurrencyInput 
                    value={form.watch('prices')?.[policy.systemId] || 0}
                    onChange={(val) => {
                      const currentPrices = form.getValues('prices') || {};
                      form.setValue('prices', { ...currentPrices, [policy.systemId]: val });
                    }}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          )}
          
          {salesPolicies.length === 0 && (
            <p className="text-sm text-muted-foreground">Chưa có chính sách giá bán. Vui lòng thêm chính sách giá.</p>
          )}
        </section>

        {/* Section 3: Kho & Tồn kho */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Kho & Tồn kho</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FormField control={form.control} name="inventory" render={({ field }) => (
              <FormItem>
                <FormLabel>Tồn kho ban đầu</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    onChange={e => field.onChange(Math.max(0, parseInt(e.target.value) || 0))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="reorderLevel" render={({ field }) => (
              <FormItem>
                <FormLabel>Mức đặt hàng lại</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="safetyStock" render={({ field }) => (
              <FormItem>
                <FormLabel>Tồn kho an toàn</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="maxStock" render={({ field }) => (
              <FormItem>
                <FormLabel>Tồn kho tối đa</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </section>

        {/* Section 4: Vận đơn & Kích thước */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Vận đơn & Kích thước</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <FormField control={form.control} name="weight" render={({ field }) => (
              <FormItem>
                <FormLabel>Khối lượng</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    {...field} 
                    value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="weightUnit" render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn vị</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="dimensions.length" render={({ field }) => (
              <FormItem>
                <FormLabel>Dài (cm)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="dimensions.width" render={({ field }) => (
              <FormItem>
                <FormLabel>Rộng (cm)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="dimensions.height" render={({ field }) => (
              <FormItem>
                <FormLabel>Cao (cm)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </section>

        {/* Section 5: Thông tin bổ sung */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Thông tin bổ sung</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="primarySupplierSystemId" render={({ field }) => (
              <FormItem>
                <FormLabel>Nhà cung cấp chính</FormLabel>
                <FormControl>
                  <Combobox
                    options={supplierOptions}
                    value={supplierOptions.find(opt => opt.value === field.value) || null}
                    onChange={option => field.onChange(option ? option.value : undefined)}
                    placeholder="Chọn nhà cung cấp"
                    searchPlaceholder="Tìm nhà cung cấp..."
                    emptyPlaceholder="Không tìm thấy."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="launchedDate" render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày ra mắt</FormLabel>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-9",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setPopoverOpen(false);
                      }}
                      locale={vi}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="tags" render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput 
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Nhập tag và nhấn Enter hoặc dấu phẩy" 
                />
              </FormControl>
              <FormDescription>Nhấn Enter hoặc dấu phẩy để thêm tag mới</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        </section>
      </form>
    </Form>
  );
}
