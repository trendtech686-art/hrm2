'use client';

/**
 * Product row component for warranty products table
 * ✅ Updated: Hiển thị ảnh sản phẩm, tên, SKU với link clickable
 */
import * as React from 'react';
import Link from 'next/link';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { Trash2, Package, Eye } from 'lucide-react';

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
import { LazyImage } from '@/components/ui/lazy-image';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';
import type { StagingFile } from '@/lib/file-upload-api';
import { useProductImage } from '@/features/products/components/product-image';
import {
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

// ✅ Memoized component để tránh re-render không cần thiết
export const WarrantyProductRow = React.memo(function WarrantyProductRow({
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
  // Image preview state
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = React.useState<string>('');

  // Find product by productSystemId hoặc SKU
  const product = React.useMemo(() => {
    // Ưu tiên tìm bằng productSystemId (systemId của sản phẩm gốc)
    if (field.productSystemId) {
      return availableProducts.find((p) => p.systemId === field.productSystemId);
    }
    if (field.sku) {
      return availableProducts.find((p) => p.id === field.sku);
    }
    return availableProducts.find((p) => p.name === field.productName);
  }, [field.productSystemId, field.sku, field.productName, availableProducts]);
  
  // ✅ Get product image URL - ưu tiên thumbnailImage đã lưu, sau đó mới fetch
  const fetchedImageUrl = useProductImage(
    field.productSystemId || '', 
    product as unknown as import('@/features/products/types').Product | undefined
  );
  
  // ✅ Ưu tiên: thumbnailImage từ field > fetchedImageUrl từ server
  const productImageUrl = field.thumbnailImage || fetchedImageUrl;
  
  // ✅ Watch quantity and unitPrice for reactive total calculation using useWatch
  const watchedQuantity = useWatch({ control, name: `products.${index}.quantity`, defaultValue: field.quantity ?? 1 });
  const watchedUnitPrice = useWatch({ control, name: `products.${index}.unitPrice`, defaultValue: field.unitPrice ?? 0 });
  const total = (watchedQuantity ?? 1) * (watchedUnitPrice ?? 0);

  const handlePreviewImage = React.useCallback((image: string, title: string) => {
    setPreviewImage(image);
    setPreviewTitle(title);
  }, []);

  return (
    <>
      <TableRow className="group">
        <TableCell className="text-center text-muted-foreground align-top pt-4">{index + 1}</TableCell>

        {/* Tên sản phẩm - Hiển thị ảnh, tên, SKU */}
        <TableCell className="align-top pt-3">
          <div className="flex items-start gap-3">
            {/* Ảnh sản phẩm */}
            {productImageUrl ? (
              <div
                className="group/img relative w-12 h-12 shrink-0 rounded-md overflow-hidden border border-muted cursor-pointer"
                onClick={() => handlePreviewImage(productImageUrl, field.productName)}
              >
                <LazyImage
                  src={productImageUrl}
                  alt={field.productName}
                  className="w-full h-full object-cover transition-all group-hover/img:brightness-75"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover/img:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4 text-white drop-shadow-md" />
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 shrink-0 bg-muted rounded-md flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            
            {/* Thông tin sản phẩm */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <Link
                href={`/products/${field.systemId || ''}`}
                target="_blank" rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {field.productName}
              </Link>
              <span className="text-xs text-muted-foreground">
                SKU: {field.sku || product?.id || 'N/A'}
              </span>
            </div>
          </div>
        </TableCell>

      {/* Số lượng */}
      <TableCell className="align-top pt-3">
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
      <TableCell className="align-top pt-3">
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

      {/* Hình ảnh bảo hành - Compact UI for max 3 images */}
      <TableCell className="align-top pt-3">
        <div className="flex flex-col gap-2" style={{ minWidth: '200px', maxWidth: '240px' }}>
          {/* Permanent files section - horizontal row */}
          {permanentFiles.length > 0 && (
            <ExistingDocumentsViewer
              files={permanentFiles as unknown as StagingFile[]}
              disabled={disabled}
              onMarkForDeletion={onMarkForDeletion}
              markedForDeletion={filesToDelete}
              hideFileInfo={true}
              gridTemplateClass="grid-cols-3"
            />
          )}
          
          {/* Staging files section - compact */}
          <NewDocumentsUpload
            value={stagingFiles}
            onChange={onStagingFilesChange}
            sessionId={sessionId}
            onSessionChange={onSessionChange}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
            maxFiles={3}
            existingFileCount={permanentFiles.length}
            disabled={disabled}
            gridTemplateClass="grid-cols-3"
            compact={true}
          />
        </div>
      </TableCell>

      {/* Kết quả */}
      <TableCell className="align-top pt-3">
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
      <TableCell className="align-top pt-3">
        <Controller
          control={control}
          name={`products.${index}.issueDescription`}
          render={({ field: formField }) => (
            <Input
              {...formField}
              placeholder="Mô tả tình trạng..."
              disabled={disabled}
              className="w-full text-sm"
            />
          )}
        />
      </TableCell>

      {/* Thành tiền */}
      <TableCell className="text-right font-medium align-top pt-4">
        {new Intl.NumberFormat('vi-VN').format(total)} đ
      </TableCell>

      {/* Delete button */}
      <TableCell className="align-top pt-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={disabled}
          className="md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </TableCell>
      </TableRow>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        images={previewImage ? [previewImage] : []}
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
        title={previewTitle}
      />
    </>
  );
});

WarrantyProductRow.displayName = 'WarrantyProductRow';
