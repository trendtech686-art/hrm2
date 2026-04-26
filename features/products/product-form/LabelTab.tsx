'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { useActiveImporters } from '@/features/settings/inventory/hooks/use-inventory-settings';
import type { ProductFormCompleteValues } from './types';

export function LabelTab() {
  const form = useFormContext<ProductFormCompleteValues>();
  const { data: importers } = useActiveImporters();

  const importerOptions = React.useMemo<ComboboxOption[]>(
    () => importers.map(i => ({ value: i.systemId, label: i.name, subtitle: i.address || undefined })),
    [importers]
  );

  const selectedImporter = React.useMemo(
    () => importers.find(i => i.systemId === form.getValues('importerSystemId')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [importers, form.watch('importerSystemId')]
  );

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader>
        <CardTitle>Thông tin tem phụ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="nameVat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên hàng hóa (VAT)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="Tên hàng hóa trên hóa đơn VAT" />
              </FormControl>
              <FormDescription>
                Tên sản phẩm sẽ hiển thị trên hóa đơn VAT
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="printLabel"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>In tem phụ</FormLabel>
                <FormDescription>
                  Bật để in tem phụ khi xuất đơn hàng
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value ?? true}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="importerSystemId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Công ty xuất nhập khẩu</FormLabel>
              <FormControl>
                <Combobox
                  options={importerOptions}
                  value={importerOptions.find(opt => opt.value === field.value) || null}
                  onChange={option => {
                    field.onChange(option?.value || '');
                    const imp = importers.find(i => i.systemId === option?.value);
                    if (imp) {
                      form.setValue('importerName', imp.name, { shouldDirty: true });
                      form.setValue('importerAddress', imp.address || '', { shouldDirty: true });
                      form.setValue('origin', imp.origin || '', { shouldDirty: true });
                      // Auto-fill usageGuide from importer default if product doesn't have one
                      if (!form.getValues('usageGuide') && imp.usageGuide) {
                        form.setValue('usageGuide', imp.usageGuide, { shouldDirty: true });
                      }
                    }
                  }}
                  placeholder="Chọn công ty xuất nhập khẩu"
                  searchPlaceholder="Tìm kiếm..."
                  emptyPlaceholder="Không tìm thấy"
                />
              </FormControl>
              <FormDescription>
                Chọn công ty để tự động điền thông tin trên tem phụ. Quản lý tại Cài đặt kho hàng.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedImporter && (
          <div className="rounded-md border p-3 text-sm space-y-1 bg-muted/50">
            <p><span className="font-medium">Tên:</span> {selectedImporter.name}</p>
            {selectedImporter.taxCode && <p><span className="font-medium">MST:</span> {selectedImporter.taxCode}</p>}
            {selectedImporter.address && <p><span className="font-medium">Địa chỉ:</span> {selectedImporter.address}</p>}
            {selectedImporter.origin && <p><span className="font-medium">Xuất xứ:</span> {selectedImporter.origin}</p>}
            {selectedImporter.phone && <p><span className="font-medium">ĐT:</span> {selectedImporter.phone}</p>}
            {selectedImporter.email && <p><span className="font-medium">Email:</span> {selectedImporter.email}</p>}
            {selectedImporter.usageGuide && <p><span className="font-medium">HDSD:</span> {selectedImporter.usageGuide}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
