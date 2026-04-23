'use client';

/**
 * Mobile-first card cho 1 dòng sản phẩm bảo hành.
 *
 * Tương đương `WarrantyProductRow` trên desktop, nhưng stack vertical, dùng
 * `MobileCard` primitive và đảm bảo mọi input có touch-target ≥ 40px.
 *
 * Giữ nguyên form logic: `Controller` bind cùng `react-hook-form`, uploader
 * vẫn dùng `ExistingDocumentsViewer` + `NewDocumentsUpload` như desktop.
 */
import * as React from 'react';
import Link from 'next/link';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { Trash2, Package, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  MobileCard,
  MobileCardBody,
  MobileCardHeader,
} from '@/components/mobile/mobile-card';
import type { StagingFile } from '@/lib/file-upload-api';
import { useProductImage } from '@/features/products/components/product-image';
import {
  type WarrantyProductField,
  type ProductForSelection,
  type SimpleImageFile,
} from '../utils/warranty-products-helpers';

interface WarrantyProductMobileCardProps {
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

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

export const WarrantyProductMobileCard = React.memo(function WarrantyProductMobileCard({
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
}: WarrantyProductMobileCardProps) {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = React.useState<string>('');

  const product = React.useMemo(() => {
    if (field.productSystemId) {
      return availableProducts.find((p) => p.systemId === field.productSystemId);
    }
    if (field.sku) {
      return availableProducts.find((p) => p.id === field.sku);
    }
    return availableProducts.find((p) => p.name === field.productName);
  }, [field.productSystemId, field.sku, field.productName, availableProducts]);

  const fetchedImageUrl = useProductImage(
    field.productSystemId || '',
    product as unknown as import('@/features/products/types').Product | undefined,
  );
  const productImageUrl = field.thumbnailImage || fetchedImageUrl;

  const watchedQuantity = useWatch({
    control,
    name: `products.${index}.quantity`,
    defaultValue: field.quantity ?? 1,
  });
  const watchedUnitPrice = useWatch({
    control,
    name: `products.${index}.unitPrice`,
    defaultValue: field.unitPrice ?? 0,
  });
  const watchedIssue = useWatch({
    control,
    name: `products.${index}.issueDescription`,
    defaultValue: field.issueDescription ?? '',
  });
  const total = (watchedQuantity ?? 1) * (watchedUnitPrice ?? 0);

  const handlePreviewImage = React.useCallback((image: string, title: string) => {
    setPreviewImage(image);
    setPreviewTitle(title);
  }, []);

  return (
    <MobileCard inert>
      <MobileCardHeader className="items-start justify-between gap-3">
        {productImageUrl ? (
          <div
            className="group relative h-12 w-12 shrink-0 rounded-md overflow-hidden border border-muted cursor-pointer"
            onClick={() => handlePreviewImage(productImageUrl, field.productName)}
          >
            <LazyImage
              src={productImageUrl}
              alt={field.productName}
              className="w-full h-full object-cover transition-all group-hover:brightness-75"
              loading="lazy"
            />
            <div className="absolute inset-0 items-center justify-center transition-opacity hidden md:flex md:opacity-0 md:group-hover:opacity-100">
              <Eye className="w-4 h-4 text-white drop-shadow-md" />
            </div>
          </div>
        ) : (
          <div className="h-12 w-12 shrink-0 bg-muted rounded-md flex items-center justify-center">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground shrink-0">#{index + 1}</span>
            <Link
              href={`/products/${field.systemId || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-tight line-clamp-2 text-foreground hover:text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {field.productName}
            </Link>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground truncate">
            SKU: {field.sku || product?.id || 'N/A'}
          </div>
          {watchedIssue && (
            <div className="mt-1 text-xs text-muted-foreground line-clamp-2 italic">
              {watchedIssue}
            </div>
          )}
        </div>

        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={onRemove}
            aria-label="Xoá sản phẩm"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </MobileCardHeader>

      <MobileCardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Số lượng</Label>
            <Controller
              control={control}
              name={`products.${index}.quantity`}
              render={({ field: formField }) => (
                <NumberInput
                  value={formField.value || 1}
                  onChange={formField.onChange}
                  min={1}
                  format={false}
                  className="h-10 mt-1"
                  disabled={disabled}
                />
              )}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Đơn giá</Label>
            <Controller
              control={control}
              name={`products.${index}.unitPrice`}
              render={({ field: formField }) => (
                <CurrencyInput
                  value={formField.value || 0}
                  onChange={formField.onChange}
                  className="h-10 mt-1"
                  disabled={disabled}
                />
              )}
            />
          </div>

          <div className="col-span-2 flex items-center justify-between border-t border-border/50 pt-2 mt-1">
            <span className="text-sm text-muted-foreground">Thành tiền</span>
            <span className="text-base font-bold text-primary tabular-nums">
              {formatCurrency(total)} đ
            </span>
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Kết quả xử lý</Label>
          <Controller
            control={control}
            name={`products.${index}.resolution`}
            render={({ field: formField }) => (
              <Select
                value={formField.value}
                onValueChange={formField.onChange}
                disabled={disabled}
              >
                <SelectTrigger className="h-10 mt-1">
                  <SelectValue placeholder="Chọn kết quả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="return">Trả lại</SelectItem>
                  <SelectItem value="replace">Đổi mới</SelectItem>
                  <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Mô tả tình trạng</Label>
          <Controller
            control={control}
            name={`products.${index}.issueDescription`}
            render={({ field: formField }) => (
              <Input
                {...formField}
                placeholder="Mô tả tình trạng..."
                disabled={disabled}
                className="h-10 mt-1"
              />
            )}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Hình ảnh bảo hành</Label>
          <div className="mt-1.5 space-y-2">
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
        </div>
      </MobileCardBody>

      <ImagePreviewDialog
        images={previewImage ? [previewImage] : []}
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
        title={previewTitle}
      />
    </MobileCard>
  );
});

WarrantyProductMobileCard.displayName = 'WarrantyProductMobileCard';
