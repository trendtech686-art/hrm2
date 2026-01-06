'use client';

/**
 * Product row component for warranty products table
 */
import * as React from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Trash2 } from 'lucide-react';

import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NumberInput } from '@/components/ui/number-input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { ExistingDocumentsViewer } from '@/components/ui/existing-documents-viewer';
import { NewDocumentsUpload } from '@/components/ui/new-documents-upload';
import type { StagingFile } from '@/lib/file-upload-api';
import {
  PRODUCT_IMAGES_GRID_STYLES,
  COMPACT_UPLOAD_STYLES,
  type WarrantyProductField,
  type ProductForSelection,
  type SimpleImageFile,
} from '../utils/warranty-products-helpers';

interface WarrantyProductRowProps {
  index: number;
  field: WarrantyProductField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  availableProducts: ProductForSelection[];
  disabled?: boolean;
  permanentFiles: SimpleImageFile[];
  stagingFiles: StagingFile[];
  sessionId?: string;
  filesToDelete: string[];
  onMarkForDeletion: (fileId: string) => void;
  onStagingFilesChange: (files: StagingFile[]) => void;
  onSessionChange: (sessionId: string) => void;
  onRemove: () => void;
}

export function WarrantyProductRow({
  index,
  field,
  control,
  availableProducts,
  disabled,
  permanentFiles,
  stagingFiles,
  sessionId,
  filesToDelete,
  onMarkForDeletion,
  onStagingFilesChange,
  onSessionChange,
  onRemove,
}: WarrantyProductRowProps) {
  // Find product by SKU or name
  const product = field.sku 
    ? availableProducts.find((p) => p.id === field.sku)
    : availableProducts.find((p) => p.name === field.productName);
  
  const quantity = field.quantity || 1;
  const unitPrice = field.unitPrice || 0;
  const total = quantity * unitPrice;

  return (
    <TableRow>
      <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>

      {/* Tên sản phẩm */}
      <TableCell>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{field.productName}</p>
          {product && (
            <a
              href={`/products/${product.systemId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-xs text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {product.id}
            </a>
          )}
        </div>
      </TableCell>

      {/* Số lượng */}
      <TableCell>
        <Controller
          control={control}
          name={`products.${index}.quantity`}
          render={({ field: formField }) => (
            <NumberInput
              value={formField.value || 1}
              onChange={formField.onChange}
              min={1}
              format={false}
              disabled={disabled}
            />
          )}
        />
      </TableCell>

      {/* Đơn giá */}
      <TableCell>
        <Controller
          control={control}
          name={`products.${index}.unitPrice`}
          render={({ field: formField }) => (
            <CurrencyInput
              value={formField.value || 0}
              onChange={formField.onChange}
              disabled={disabled}
            />
          )}
        />
      </TableCell>

      {/* Hình ảnh */}
      <TableCell>
        <div className="flex flex-col gap-1">
          {/* Permanent files section */}
          {permanentFiles.length > 0 && (
            <div>
              <style dangerouslySetInnerHTML={{ __html: PRODUCT_IMAGES_GRID_STYLES }} />
              <div className="product-images-grid">
                <ExistingDocumentsViewer
                  files={permanentFiles as unknown as StagingFile[]}
                  disabled={disabled}
                  onMarkForDeletion={onMarkForDeletion}
                  markedForDeletion={filesToDelete}
                />
              </div>
            </div>
          )}
          
          {/* Staging files section */}
          <div>
            <style dangerouslySetInnerHTML={{ __html: COMPACT_UPLOAD_STYLES }} />
            <div className="compact-upload">
              <NewDocumentsUpload
                value={stagingFiles}
                onChange={onStagingFilesChange}
                sessionId={sessionId}
                onSessionChange={onSessionChange}
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
                maxFiles={3}
                existingFileCount={permanentFiles.length}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </TableCell>

      {/* Kết quả */}
      <TableCell>
        <Controller
          control={control}
          name={`products.${index}.resolution`}
          render={({ field: formField }) => (
            <Select value={formField.value} onValueChange={formField.onChange} disabled={disabled}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="return">Trả lại</SelectItem>
                <SelectItem value="replace">Đổi mới</SelectItem>
                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </TableCell>

      {/* Ghi chú */}
      <TableCell>
        <Controller
          control={control}
          name={`products.${index}.issueDescription`}
          render={({ field: formField }) => (
            <Input
              {...formField}
              placeholder="Mô tả tình trạng..."
              disabled={disabled}
              className="w-full text-body-sm"
            />
          )}
        />
      </TableCell>

      {/* Thành tiền */}
      <TableCell className="text-right font-medium">
        {new Intl.NumberFormat('vi-VN').format(total)} đ
      </TableCell>

      {/* Delete button */}
      <TableCell>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
