'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Warehouse, Package } from 'lucide-react';
import type { ProductFormCompleteValues, ComboboxOption } from './types';

interface BranchOption {
  systemId: string;
  name: string;
  isDefault?: boolean;
}

interface InventoryTabProps {
  storageLocationOptions: ComboboxOption[];
  /** Branches for initial inventory input (only used when creating new product) */
  branches?: BranchOption[];
  /** Whether editing existing product (hides initial inventory input) */
  isEditMode?: boolean;
}

export function InventoryTab({ storageLocationOptions, branches = [], isEditMode = false }: InventoryTabProps) {
  const form = useFormContext<ProductFormCompleteValues>();
  const productType = form.watch('type');
  const isComboProduct = productType === 'combo';

  return (
    <>
      {/* Card 1: Initial Inventory - Only show when creating NEW product (not combo) */}
      {!isEditMode && !isComboProduct && branches.length > 0 && (
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              <CardTitle>Số lượng tồn kho ban đầu</CardTitle>
            </div>
            <CardDescription>
              Nhập số lượng tồn kho khởi tạo cho từng chi nhánh. Để trống hoặc nhập 0 nếu chưa có hàng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((branch) => (
                <FormField
                  key={branch.systemId}
                  control={form.control}
                  name={`inventoryByBranch.${branch.systemId}` as keyof ProductFormCompleteValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Warehouse className="h-4 w-4" />
                        {branch.name}
                        {branch.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Mặc định
                          </Badge>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          value={typeof field.value === 'number' ? field.value : ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? 0 : Number(e.target.value);
                            field.onChange(value);
                          }}
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card 2: Inventory Settings */}
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle>Quản lý kho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="isStockTracked"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value !== false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer">
                  Theo dõi tồn kho
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storageLocationSystemId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Điểm lưu kho</FormLabel>
              <FormControl>
                <Combobox
                  options={storageLocationOptions}
                  value={storageLocationOptions.find(opt => opt.value === field.value) || null}
                  onChange={option => field.onChange(option?.value)}
                  placeholder="Chọn điểm lưu kho"
                  searchPlaceholder="Tìm kiếm..."
                  emptyPlaceholder="Không tìm thấy"
                />
              </FormControl>
              <FormDescription>
                Vị trí lưu trữ sản phẩm trong kho
              </FormDescription>
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
    </>
  );
}
