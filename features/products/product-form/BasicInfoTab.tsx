'use client';

import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { PlusCircle, X, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Combobox } from '@/components/ui/combobox';
import { CurrencyInput } from '@/components/ui/currency-input';
import { ComboSection } from '../components/combo-section';
import type { ProductFormCompleteValues, ComboboxOption } from './types';
import type { PricingPolicy } from '@/lib/types/prisma-extended';

interface BasicInfoTabProps {
  unitOptions: ComboboxOption[];
  brandOptions: ComboboxOption[];
  productTypeOptions: ComboboxOption[];
  categoryOptions: ComboboxOption[];
  supplierOptions: ComboboxOption[];
  salesPolicies: PricingPolicy[];
  isComboProduct: boolean;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagInput: string;
  setTagInput: React.Dispatch<React.SetStateAction<string>>;
}

export function BasicInfoTab({
  unitOptions,
  brandOptions,
  productTypeOptions,
  categoryOptions,
  supplierOptions,
  salesPolicies,
  isComboProduct,
  tags,
  setTags,
  tagInput,
  setTagInput,
}: BasicInfoTabProps) {
  const form = useFormContext<ProductFormCompleteValues>();
  
  const comboItems = useWatch({
    control: form.control,
    name: 'comboItems',
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

  return (
    <>
      {/* Card 1: Thông tin cơ bản */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-h3">Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mobile: Stack, Desktop: 3 columns */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã SKU *</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      {...field}
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
                <FormItem className="sm:col-span-1 md:col-span-2">
                  <FormLabel>Tên sản phẩm *</FormLabel>
                  <FormControl>
                    <Input className="h-9" {...field} placeholder="Nhập tên sản phẩm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
                    <Input className="h-9" {...field} placeholder="Nhập mã vạch" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9">
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

            <FormField
              control={form.control}
              name="warrantyPeriodMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời hạn bảo hành (tháng)</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      type="number"
                      min={0}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? undefined : parseInt(val, 10));
                      }}
                      placeholder="VD: 12"
                    />
                  </FormControl>
                  <FormDescription>
                    Để trống sẽ dùng giá trị mặc định từ cài đặt
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandSystemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thương hiệu</FormLabel>
                  <FormControl>
                    <Combobox
                      options={brandOptions}
                      value={brandOptions.find(opt => opt.value === field.value) || null}
                      onChange={option => field.onChange(option?.value)}
                      placeholder="Chọn thương hiệu"
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
              name="productTypeSystemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại sản phẩm</FormLabel>
                  <FormControl>
                    <Combobox
                      options={productTypeOptions}
                      value={productTypeOptions.find(opt => opt.value === field.value) || null}
                      onChange={option => field.onChange(option?.value)}
                      placeholder="Chọn loại sản phẩm"
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
              name="categorySystemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <FormControl>
                    <Combobox
                      options={categoryOptions}
                      value={categoryOptions.find(opt => opt.value === field.value) || null}
                      onChange={option => field.onChange(option?.value)}
                      placeholder="Chọn danh mục"
                      searchPlaceholder="Tìm kiếm..."
                      emptyPlaceholder="Không tìm thấy"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thuế suất (%)</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === '' ? undefined : parseFloat(val));
                      }}
                      placeholder="VD: 10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="launchedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày ra mắt</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      type="date"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discontinuedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày ngừng KD</FormLabel>
                  <FormControl>
                    <Input
                      className="h-9"
                      type="date"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-body-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Tags
            </label>
            <div className="flex gap-2">
              <Input
                className="h-9"
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
              <Button type="button" variant="outline" className="h-9" onClick={handleAddTag}>
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

          <FormField
            control={form.control}
            name="sellerNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú nội bộ</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[80px]"
                    {...field}
                    value={field.value || ''}
                    placeholder="Ghi chú riêng cho người bán (không hiển thị cho khách hàng)..."
                  />
                </FormControl>
                <FormDescription>
                  Ghi chú nội bộ - chỉ nhân viên xem được, không hiển thị trên website
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Card: Cài đặt hiển thị website */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-h3">Cài đặt hiển thị website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Đăng web</FormLabel>
                    <FormDescription className="text-xs">
                      Hiển thị trên website
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Nổi bật</FormLabel>
                    <FormDescription className="text-xs">
                      Sản phẩm nổi bật
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isNewArrival"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Mới về</FormLabel>
                    <FormDescription className="text-xs">
                      Hàng mới về
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isBestSeller"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Bán chạy</FormLabel>
                    <FormDescription className="text-xs">
                      Sản phẩm bán chạy
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isOnSale"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Đang giảm giá</FormLabel>
                    <FormDescription className="text-xs">
                      Hiện badge Sale
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thứ tự hiển thị</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="publishedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày đăng web</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Ngày sản phẩm được đăng lên website
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Card 2: Thành phần Combo - CHỈ hiện khi là combo product */}
      {isComboProduct && (
        <ComboSection />
      )}

      {/* Card 3: Giá mua & Giá vốn */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-h3">Giá mua &amp; Giá vốn</CardTitle>
            {isComboProduct && comboItems && comboItems.length > 0 && (
              <Badge variant="secondary" className="text-body-xs">
                <Info className="h-3 w-3 mr-1" />
                Tự động tính từ combo
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  {isComboProduct && comboItems && comboItems.length > 0 && (
                    <FormDescription>
                      Tự động tính từ combo (có thể sửa)
                    </FormDescription>
                  )}
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
                      disabled={isComboProduct}
                    />
                  </FormControl>
                  {isComboProduct && (
                    <FormDescription>
                      Combo không có nhà cung cấp riêng
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isComboProduct && (
              <>
                <FormField
                  control={form.control}
                  name="lastPurchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá nhập gần nhất</FormLabel>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Bảng giá bán theo chính sách */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-h3">Bảng giá bán theo chính sách</CardTitle>
            {isComboProduct && comboItems && comboItems.length > 0 && (
              <Badge variant="secondary" className="text-body-xs">
                <Info className="h-3 w-3 mr-1" />
                Tự động từ giá combo
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isComboProduct && comboItems && comboItems.length > 0 && (
            <p className="text-body-sm text-muted-foreground mb-4">
              Giá bán được tự động tính từ giá combo. Bạn có thể điều chỉnh thủ công nếu cần.
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                        <span className="text-body-xs text-muted-foreground ml-2">
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
            <p className="text-body-sm text-muted-foreground">
              Chưa có chính sách giá bán. Vui lòng thêm trong Cài đặt.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
