'use client';

import * as React from 'react';
import Link from 'next/link';
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';
import {
  ChevronDown,
  ChevronRight,
  StickyNote,
  Pencil,
  Package,
  Eye,
} from 'lucide-react';

import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useProductImage } from '@/features/products/components/product-image';

import type { Product } from '@/lib/types/prisma-extended';
import { formatCurrency, type FormLineItem, type FormValues } from './types';

// ============================================================================
// ProductThumbnailCell
// ============================================================================

interface ProductThumbnailCellProps {
  productSystemId: string;
  product?: {
    thumbnailImage?: string;
    galleryImages?: string[];
    images?: string[];
    name?: string;
  } | null;
  productName: string;
  size?: 'sm' | 'md';
  onPreview?: (image: string, title: string) => void;
}

export const ProductThumbnailCell = ({
  productSystemId,
  product,
  productName,
  size = 'md',
  onPreview,
}: ProductThumbnailCellProps) => {
  const imageUrl = useProductImage(productSystemId, product);

  const sizeClasses = size === 'sm' ? 'w-10 h-9' : 'w-12 h-10';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-4 w-4';

  if (imageUrl) {
    return (
      <div
        className={`group/thumbnail relative ${sizeClasses} rounded border overflow-hidden bg-muted ${onPreview ? 'cursor-pointer' : ''}`}
        onClick={() => onPreview?.(imageUrl, productName)}
      >
        <OptimizedImage
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75"
          width={48}
          height={40}
        />
        {onPreview && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity">
            <Eye className="w-4 h-4 text-white drop-shadow-md" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-muted rounded flex items-center justify-center`}
    >
      <Package className={`${iconSize} text-muted-foreground`} />
    </div>
  );
};

// ============================================================================
// ReturnItemRow
// ============================================================================

interface ReturnItemRowProps {
  index: number;
  field: FormLineItem & { id: string };
  control: UseFormReturn<FormValues>['control'];
  setValue: UseFormReturn<FormValues>['setValue'];
  products: Product[];
  expandedCombos: Record<string, boolean>;
  toggleComboRow: (id: string) => void;
  handlePreview: (img: string, title: string) => void;
  handleOpenReturnNoteDialog: (index: number) => void;
  getProductTypeLabel: (p: Product | null) => string;
}

export const ReturnItemRow = React.memo(function ReturnItemRow({
  index,
  field,
  control,
  setValue,
  products,
  expandedCombos,
  toggleComboRow,
  handlePreview,
  handleOpenReturnNoteDialog,
  getProductTypeLabel,
}: ReturnItemRowProps) {
  const returnQuantity = useWatch({
    control,
    name: `items.${index}.returnQuantity`,
  });
  const unitPrice = useWatch({ control, name: `items.${index}.unitPrice` });
  const note = useWatch({ control, name: `items.${index}.note` });

  const product = products.find((p) => p.systemId === field.productSystemId);
  const isCombo =
    product?.type === 'combo' && (product?.comboItems?.length ?? 0) > 0;
  const isExpanded = expandedCombos[field.productSystemId] ?? false;
  const comboItems =
    isCombo && product?.comboItems
      ? product.comboItems.map(
          (ci: { productSystemId: string; quantity: number }) => {
            const childProduct = products.find(
              (p) => p.systemId === ci.productSystemId
            );
            return { ...ci, product: childProduct };
          }
        )
      : [];

  const totalValue = (returnQuantity || 0) * (unitPrice || 0);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell className="text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            {isCombo && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={() => toggleComboRow(field.productSystemId)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            )}
            <span>{index + 1}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <ProductThumbnailCell
              productSystemId={field.productSystemId}
              product={product}
              productName={field.productName}
              onPreview={handlePreview}
            />
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${field.productSystemId}`}
                  className="font-medium text-primary hover:underline"
                >
                  {field.productName}
                </Link>
                {isCombo && (
                  <span className="text-body-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                    COMBO
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-body-xs text-muted-foreground group/info flex-wrap">
                <span>{getProductTypeLabel(product ?? null)}</span>
                <span>-</span>
                <Link
                  href={`/products/${field.productSystemId}`}
                  className="hover:text-primary hover:underline"
                >
                  {field.productId}
                </Link>
                {note ? (
                  <>
                    <span className="text-amber-600">
                      <StickyNote className="h-3 w-3 inline mr-0.5" />
                      <span className="italic">{note}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenReturnNoteDialog(index)}
                      className="opacity-0 group-hover/info:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => handleOpenReturnNoteDialog(index)}
                    className="opacity-0 group-hover/info:opacity-100 transition-opacity h-auto p-0 text-body-xs text-muted-foreground hover:text-foreground"
                  >
                    Thêm ghi chú
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name={`items.${index}.returnQuantity`}
              render={({ field: qtyField }) => (
                <NumberInput
                  {...qtyField}
                  className="h-8 text-center"
                  format={false}
                  min={0}
                  max={field.returnableQuantity}
                  onChange={(val) => {
                    qtyField.onChange(val);
                    setValue('returnAll', false);
                  }}
                />
              )}
            />
            <span>/ {field.returnableQuantity}</span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          {formatCurrency(field.originalUnitPrice)}
        </TableCell>
        <TableCell>
          <Controller
            control={control}
            name={`items.${index}.unitPrice`}
            render={({ field: priceField }) => (
              <CurrencyInput
                value={priceField.value as number}
                onChange={priceField.onChange}
                className="h-8 text-right"
              />
            )}
          />
        </TableCell>
        <TableCell className="text-right font-semibold">
          {formatCurrency(totalValue)}
        </TableCell>
      </TableRow>
      {/* Combo child rows */}
      {isCombo &&
        isExpanded &&
        comboItems.map(
          (
            ci: {
              productSystemId: string;
              quantity: number;
              product?: Product;
            },
            ciIndex: number
          ) => (
            <TableRow
              key={`${field.id}-combo-${ciIndex}`}
              className="bg-muted/40"
            >
              <TableCell className="text-center text-muted-foreground pl-8">
                <span className="text-muted-foreground/60">└</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <ProductThumbnailCell
                    productSystemId={ci.productSystemId}
                    product={ci.product}
                    productName={ci.product?.name || 'N/A'}
                    size="sm"
                    onPreview={handlePreview}
                  />
                  <div>
                    <p className="text-body-sm font-medium">
                      {ci.product?.name || 'Sản phẩm không tồn tại'}
                    </p>
                    <p className="text-body-xs text-muted-foreground">
                      {ci.product?.id} × {ci.quantity}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell colSpan={5}></TableCell>
            </TableRow>
          )
        )}
    </React.Fragment>
  );
});
