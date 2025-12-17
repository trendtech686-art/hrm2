import type { Product } from '@/features/products/types';
import {
  PrintData,
  StoreSettings,
  formatCurrency,
  formatDate,
  getStoreData,
} from './types';

const DEFAULT_QR_SIZE = 96;
const DEFAULT_BARCODE_HEIGHT = 48;

function generateBarcodeImage(value?: string, height: number = DEFAULT_BARCODE_HEIGHT): string {
  if (!value) return '';
  return `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(value)}" style="height:${height}px" alt="barcode"/>`;
}

function generateQRCodeImage(value?: string, size: number = DEFAULT_QR_SIZE): string {
  if (!value) return '';
  return `<img src="https://quickchart.io/qr?text=${encodeURIComponent(value)}&size=${size}" style="width:${size}px;height:${size}px" alt="qr"/>`;
}

function formatWeight(value?: number, unit?: string): string {
  if (value === undefined || value === null) return '';
  if (unit === 'g') return `${value} g`;
  if (unit === 'kg') return `${value} kg`;
  return `${value} ${unit || ''}`.trim();
}

export interface ProductLabelForPrint {
  sku: string;
  name: string;
  nameVat?: string; // Tên sản phẩm VAT đầy đủ
  unit?: string;
  price?: number;
  brand?: string;
  category?: string;
  weightText?: string;
  weightValue?: number;
  weightUnit?: string;
  origin?: string;
  ingredients?: string;
  manufactureDate?: string | Date;
  expiryDate?: string | Date;
  lotNumber?: string;
  storageInstructions?: string;
  description?: string;
  shortDescription?: string;
  barcode?: string;
  qrCodeValue?: string;
  // Tem phụ fields
  usageGuide?: string;
  importerName?: string;
  importerAddress?: string;
}

export function mapProductLabelToPrintData(
  product: ProductLabelForPrint,
  storeSettings: StoreSettings,
): PrintData {
  const barcodeValue = product.barcode || product.sku || product.name;
  const qrValue = product.qrCodeValue || barcodeValue || product.name;

  return {
    ...getStoreData(storeSettings),

    '{product_name}': product.name,
    '{product_name_vat}': product.nameVat || product.name,
    '{product_sku}': product.sku,
    '{product_unit}': product.unit || '',
    '{product_price}': product.price !== undefined ? formatCurrency(product.price) : '',
    '{product_brand}': product.brand || '',
    '{product_category}': product.category || '',
    '{product_weight}': product.weightText || formatWeight(product.weightValue, product.weightUnit),
    '{product_origin}': product.origin || '',
    '{product_ingredients}': product.ingredients || '',
    '{product_mfg_date}': formatDate(product.manufactureDate),
    '{product_expiry_date}': formatDate(product.expiryDate),
    '{product_lot_number}': product.lotNumber || '',
    '{product_description}': product.description || '',
    '{product_short_description}': product.shortDescription || product.description || '',
    '{product_storage_instructions}': product.storageInstructions || '',
    '{product_barcode}': barcodeValue || '',
    '{product_barcode_image}': generateBarcodeImage(barcodeValue),
    '{product_qr_code}': generateQRCodeImage(qrValue),
    // Tem phụ fields
    '{product_usage_guide}': product.usageGuide || '',
    '{product_importer_name}': product.importerName || '',
    '{product_importer_address}': product.importerAddress || '',
  };
}

export function mapProductToLabelPrintData(
  product: Product,
  storeSettings: StoreSettings,
  overrides: Partial<ProductLabelForPrint> = {},
): PrintData {
  const firstPrice = Object.values(product.prices || {})[0];
  const resolvedPrice = overrides.price ?? product.sellingPrice ?? firstPrice;

  return mapProductLabelToPrintData(
    {
      sku: overrides.sku || product.id || product.sku || '',
      name: overrides.name || product.name,
      nameVat: overrides.nameVat || product.nameVat || product.name,
      unit: overrides.unit || product.unit,
      price: resolvedPrice,
      brand: overrides.brand || '',
      category: overrides.category || product.category || '',
      weightText: overrides.weightText,
      weightValue: overrides.weightValue ?? product.weight,
      weightUnit: overrides.weightUnit ?? product.weightUnit,
      origin: overrides.origin || product.origin,
      ingredients: overrides.ingredients,
      manufactureDate: overrides.manufactureDate,
      expiryDate: overrides.expiryDate,
      lotNumber: overrides.lotNumber,
      storageInstructions: overrides.storageInstructions,
      description: overrides.description || product.description,
      shortDescription: overrides.shortDescription || product.shortDescription,
      barcode: overrides.barcode || product.barcode || product.id,
      qrCodeValue: overrides.qrCodeValue || product.id,
      // Tem phụ fields from product
      usageGuide: overrides.usageGuide || product.usageGuide,
      importerName: overrides.importerName || product.importerName,
      importerAddress: overrides.importerAddress || product.importerAddress,
    },
    storeSettings,
  );
}
