import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import type { Product } from "./types.ts";
import { useProductStore } from "./store.ts";
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
import { useUnitStore } from "../settings/units/store.ts";
import { useSupplierStore } from "../suppliers/store.ts";
import { useBranchStore } from "../settings/branches/store.ts";
import { ImageUploadManager } from '../../components/ui/image-upload-manager.tsx';
import { useImageUpload } from '../../hooks/use-image-upload.ts';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Textarea } from "../../components/ui/textarea.tsx";
import { CurrencyInput } from "../../components/ui/currency-input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Combobox } from "../../components/ui/combobox.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Separator } from "../../components/ui/separator.tsx";
import { PlusCircle, X } from "lucide-react";
import { cn } from "../../lib/utils.ts";

// Form Values Type
export type ProductFormCompleteValues = Partial<Product> & {
  id: string;
  name: string;
  unit: string;
  costPrice: number;
  prices: Record<string, number>;
};

type ProductFormCompleteProps = {
  initialData: Product | null;
  onSubmit: (values: ProductFormCompleteValues) => void;
  onCancel: () => void;
  isEditMode?: boolean;
};

export function ProductFormComplete({ 
  initialData, 
  onSubmit, 
  onCancel,
  isEditMode = false 
}: ProductFormCompleteProps) {
  const { data: products } = useProductStore();
  const { data: pricingPolicies } = usePricingPolicyStore();
  const { data: units } = useUnitStore();
  const { data: suppliers } = useSupplierStore();
  const { data: branches } = useBranchStore();

  // Image upload management
  const {
    stagingFiles: imageStagingFiles,
    sessionId: imageSessionId,
    setStagingFiles: setImageStagingFiles,
    setSessionId: setImageSessionId,
    confirmImages,
    hasImages,
  } = useImageUpload({ 
    entityType: 'product',
    initialImages: initialData?.images 
  });
  
  const [tags, setTags] = React.useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = React.useState('');

  const salesPolicies = React.useMemo(
    () => pricingPolicies.filter(p => p.type === 'Bán hàng'),
    [pricingPolicies]
  );

  const unitOptions = React.useMemo(
    () => units.map(u => ({ value: u.name, label: u.name })),
    [units]
  );

  const supplierOptions = React.useMemo(
    () => suppliers.map(s => ({ value: s.systemId, label: s.name })),
    [suppliers]
  );

  const form = useForm<ProductFormCompleteValues>({
    defaultValues: initialData || {
      id: "", // ✅ Empty string = auto-generate
      name: "",
      title: "",
      description: "",
      shortDescription: "",
      unit: "Cái",
      type: "physical",
      status: "active",
      costPrice: 0,
      prices: {},
      inventoryByBranch: {},
      committedByBranch: {},
      inTransitByBranch: {},
      isStockTracked: true,
      weightUnit: 'g',
    },
  });

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFormSubmit = async (values: ProductFormCompleteValues) => {
    // First submit the form data
    onSubmit({
      ...values,
      tags,
    });
    
    // Then confirm images if any
    if (hasImages) {
      const productId = values.id;
      await confirmImages(productId, values);
    }
  };

  return (
    <Form {...form}>
      <form 
        id="product-form-complete"
        onSubmit={form.handleSubmit(handleFormSubmit)} 
        className="space-y-6"
      >
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Cơ bản</TabsTrigger>
            <TabsTrigger value="images">Hình ảnh</TabsTrigger>
            <TabsTrigger value="pricing">Giá bán</TabsTrigger>
            <TabsTrigger value="inventory">Kho</TabsTrigger>
            <TabsTrigger value="logistics">Vận chuyển</TabsTrigger>
            <TabsTrigger value="seo">SEO & Mô tả</TabsTrigger>
          </TabsList>

          {/* Tab 1: Basic Info */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã SKU *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isEditMode}
                            placeholder="SP000001"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Tên sản phẩm *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập tên sản phẩm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="physical">Hàng hóa</SelectItem>
                            <SelectItem value="service">Dịch vụ</SelectItem>
                            <SelectItem value="digital">Sản phẩm số</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đơn vị tính *</FormLabel>
                        <FormControl>
                          <Combobox
                            options={unitOptions}
                            value={unitOptions.find(opt => opt.value === field.value) || null}
                            onChange={option => field.onChange(option?.value)}
                            placeholder="Chọn đơn vị"
                            searchPlaceholder="Tìm kiếm..."
                            emptyPlaceholder="Không tìm thấy"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã vạch</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nhập mã vạch" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Đang kinh doanh</SelectItem>
                          <SelectItem value="inactive">Ngừng kinh doanh</SelectItem>
                          <SelectItem value="discontinued">Ngừng sản xuất</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Nhập tag và Enter"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Images */}
          <TabsContent value="images" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadManager
                  value={imageStagingFiles}
                  onChange={setImageStagingFiles}
                  sessionId={imageSessionId || undefined}
                  onSessionChange={setImageSessionId}
                  maxFiles={20}
                  maxSize={5 * 1024 * 1024}
                  maxTotalSize={50 * 1024 * 1024}
                  description="Tải lên hình ảnh sản phẩm. Ảnh đầu tiên sẽ được dùng làm ảnh đại diện."
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Pricing */}
          <TabsContent value="pricing" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Giá mua & Giá vốn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá vốn *</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primarySupplierSystemId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhà cung cấp chính</FormLabel>
                        <FormControl>
                          <Combobox
                            options={supplierOptions}
                            value={supplierOptions.find(opt => opt.value === field.value) || null}
                            onChange={option => field.onChange(option?.value)}
                            placeholder="Chọn nhà cung cấp"
                            searchPlaceholder="Tìm kiếm..."
                            emptyPlaceholder="Không tìm thấy"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="suggestedRetailPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá bán lẻ đề xuất</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá tối thiểu</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormDescription>
                          Giá thấp nhất cho phép bán
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bảng giá bán theo chính sách</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {salesPolicies.map(policy => (
                    <FormField
                      key={policy.systemId}
                      control={form.control}
                      name={`prices.${policy.systemId}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {policy.name}
                            {policy.isDefault && (
                              <span className="text-xs text-muted-foreground ml-2">
                                (Mặc định)
                              </span>
                            )}
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                {salesPolicies.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Chưa có chính sách giá bán. Vui lòng thêm trong Cài đặt.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Inventory */}
          <TabsContent value="inventory" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý kho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isStockTracked"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value !== false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Theo dõi tồn kho</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="reorderLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mức đặt hàng lại</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormDescription>
                          Cảnh báo khi tồn kho xuống dưới mức này
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="safetyStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tồn kho an toàn</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormDescription>
                          Mức tồn dự phòng tối thiểu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mức tồn tối đa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormDescription>
                          Giới hạn tồn kho tối đa
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: Logistics */}
          <TabsContent value="logistics" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin vận chuyển</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Khối lượng</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weightUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đơn vị khối lượng</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn đơn vị" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="g">g (gram)</SelectItem>
                            <SelectItem value="kg">kg (kilogram)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Kích thước (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dimensions.length"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              placeholder="Dài"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dimensions.width"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              placeholder="Rộng"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dimensions.height"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              placeholder="Cao"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 6: SEO & Description */}
          <TabsContent value="seo" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Mô tả sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề SEO</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Tiêu đề tối ưu cho SEO" />
                      </FormControl>
                      <FormDescription>
                        Tiêu đề này sẽ hiển thị trên kết quả tìm kiếm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả ngắn</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Mô tả ngắn gọn 1-2 câu"
                          rows={2}
                        />
                      </FormControl>
                      <FormDescription>
                        Mô tả ngắn gọn để hiển thị trên danh sách sản phẩm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả chi tiết</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Mô tả đầy đủ về sản phẩm..."
                          rows={8}
                          className="font-mono text-sm"
                        />
                      </FormControl>
                      <FormDescription>
                        Hỗ trợ HTML. Mô tả chi tiết sẽ hiển thị trên trang sản phẩm.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
