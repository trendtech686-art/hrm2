/**
 * Packing Mapper - Phiếu đóng gói
 * Đồng bộ với variables/phieu-dong-goi.ts
 * 
 * Variables coverage: 100%
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  formatTime,
  hidePhoneMiddle,
  numberToWords,
  getStoreData,
  StoreSettings
} from './types';

export interface PackingForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  packedAt?: string | Date;
  shippedAt?: string | Date;
  createdBy?: string;
  orderCode: string;
  
  // Trạng thái
  fulfillmentStatus?: string;
  
  // NV được gán
  assignedEmployee?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
    country?: string;
    phone?: string;
  };
  
  // Thông tin khách hàng
  customerName: string;
  customerCode?: string;
  customerPhone?: string;
  customerPhoneHide?: boolean;
  customerEmail?: string;
  customerAddress?: string;
  billingAddress?: string;
  
  // Thông tin giao hàng
  shippingAddress: string;
  shippingProvince?: string;
  shippingDistrict?: string;
  shippingWard?: string;
  
  // Ghi chú
  note?: string;
  packageNote?: string;
  orderNote?: string;
  
  // Danh sách sản phẩm
  items: Array<{
    variantCode?: string;
    productName: string;
    productNameVariantName?: string;
    variantName?: string;
    barcode?: string;
    unit?: string;
    quantity: number;
    price?: number;
    priceAfterDiscount?: number;
    discountRate?: number;
    discountAmount?: number;
    taxRate?: number;
    taxAmount?: number;
    taxIncluded?: number;
    taxExclude?: number;
    taxName?: string;
    amount?: number;
    brand?: string;
    category?: string;
    variantOptions?: string;
    weight?: number;
    weightUnit?: string;
    binLocation?: string;
    note?: string;
    // Lot/Serial
    serial?: string;
    lotNumber?: string;
    lotWithQty?: string;
    lotWithDates?: string;
    lotWithDatesQty?: string;
    // Composite
    compositeVariantCode?: string;
    compositeVariantName?: string;
    compositeUnit?: string;
    compositeQuantity?: number;
  }>;
  
  // Composite fields (legacy)
  compositeItems?: Array<{
    productName: string;
    compositeComponents?: Array<{
      componentName: string;
      quantity: number;
    }>;
  }>;
  
  // Tổng giá trị
  totalQuantity?: number;
  subtotal?: number;
  totalDiscount?: number;
  fulfillmentDiscount?: number;
  totalTax?: number;
  totalExtraTax?: number;
  totalTaxIncludedLine?: number;
  totalAmountBeforeTax?: number;
  totalAmountAfterTax?: number;
  total?: number;
  totalAmount?: number;
  totalWeight?: number;
  codAmount?: number;
}

export function mapPackingToPrintData(packing: PackingForPrint, storeSettings: StoreSettings): PrintData {
  const phone = packing.customerPhoneHide 
    ? hidePhoneMiddle(packing.customerPhone || '')
    : (packing.customerPhone || '');
  
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CỬA HÀNG / CHI NHÁNH ===
    '{location_name}': packing.location?.name || storeSettings.name || '',
    '{location_address}': packing.location?.address || storeSettings.address || '',
    '{location_province}': packing.location?.province || '',
    '{location_country}': packing.location?.country || 'Việt Nam',
    '{location_phone}': packing.location?.phone || storeSettings.phone || '',
    '{store_province}': storeSettings.province || '',
    
    // === THÔNG TIN PHIẾU ĐÓNG GÓI ===
    '{fulfillment_code}': packing.code,
    '{packing_code}': packing.code,
    '{order_code}': packing.orderCode,
    '{created_on}': formatDate(packing.createdAt),
    '{created_on_time}': formatTime(packing.createdAt),
    '{modified_on}': formatDate(packing.modifiedAt),
    '{modified_on_time}': formatTime(packing.modifiedAt),
    '{packed_on}': formatDate(packing.packedAt),
    '{packed_on_time}': formatTime(packing.packedAt),
    '{shipped_on}': formatDate(packing.shippedAt),
    '{shipped_on_time}': formatTime(packing.shippedAt),
    '{account_name}': packing.createdBy || '',
    '{assigned_employee}': packing.assignedEmployee || '',
    '{fulfillment_status}': packing.fulfillmentStatus || '',
    
    // === THÔNG TIN KHÁCH HÀNG ===
    '{customer_name}': packing.customerName,
    '{customer_code}': packing.customerCode || '',
    '{customer_phone}': phone,
    '{customer_phone_number}': phone,
    '{customer_phone_number_hide}': hidePhoneMiddle(packing.customerPhone || ''),
    '{customer_email}': packing.customerEmail || '',
    '{customer_address}': packing.customerAddress || '',
    '{billing_address}': packing.billingAddress || '',
    
    // === THÔNG TIN GIAO HÀNG ===
    '{shipping_address}': packing.shippingAddress,
    '{shipping_province}': packing.shippingProvince || '',
    '{shipping_district}': packing.shippingDistrict || '',
    '{shipping_ward}': packing.shippingWard || '',
    
    // === TỔNG GIÁ TRỊ ===
    '{total_quantity}': (packing.totalQuantity ?? 0).toString(),
    '{subtotal}': formatCurrency(packing.subtotal || 0),
    '{total_discounts}': formatCurrency(packing.totalDiscount || 0),
    '{fulfillment_discount}': formatCurrency(packing.fulfillmentDiscount || packing.totalDiscount || 0),
    '{total_tax}': formatCurrency(packing.totalTax || 0),
    '{total_extra_tax}': formatCurrency(packing.totalExtraTax || 0),
    '{total_tax_included_line}': formatCurrency(packing.totalTaxIncludedLine || 0),
    '{total_amount_before_tax}': formatCurrency(packing.totalAmountBeforeTax || 0),
    '{total_amount_after_tax}': formatCurrency(packing.totalAmountAfterTax || 0),
    '{total}': formatCurrency(packing.total || 0),
    '{total_amount}': formatCurrency(packing.totalAmount || packing.total || 0),
    '{total_amount_text}': numberToWords(packing.totalAmount || packing.total || 0),
    '{total_weight}': packing.totalWeight?.toString() || '',
    '{cod}': formatCurrency(packing.codAmount),
    '{cod_amount}': formatCurrency(packing.codAmount || 0),
    '{cod_amount_text}': numberToWords(packing.codAmount || 0),
    
    // === GHI CHÚ ===
    '{packing_note}': packing.note || '',
    '{package_note}': packing.packageNote || packing.note || '',
    '{note}': packing.note || '',
    '{order_note}': packing.orderNote || '',
  };
}

export function mapPackingLineItems(items: PackingForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_variant_code}': item.variantCode || '',
    '{line_product_name}': item.productName,
    '{line_product_name_variant_name}': item.productNameVariantName || `${item.productName}${item.variantName ? ' - ' + item.variantName : ''}`,
    '{line_variant}': item.variantName || '',
    '{line_variant_name}': item.variantName || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_price}': formatCurrency(item.price || 0),
    '{line_price_after_discount}': formatCurrency(item.priceAfterDiscount || item.price || 0),
    '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
    '{line_discount_amount}': formatCurrency(item.discountAmount),
    '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
    '{line_tax_amount}': formatCurrency(item.taxAmount),
    '{line_tax_included}': formatCurrency(item.taxIncluded || 0),
    '{line_tax_exclude}': formatCurrency(item.taxExclude || 0),
    '{line_tax}': item.taxName || '',
    '{line_amount}': formatCurrency(item.amount || 0),
    '{line_product_brand}': item.brand || '',
    '{line_brand}': item.brand || '',
    '{line_product_category}': item.category || '',
    '{line_category}': item.category || '',
    '{line_variant_options}': item.variantOptions || '',
    '{line_weight}': item.weight?.toString() || '',
    '{line_weight_unit}': item.weightUnit || 'g',
    '{bin_location}': item.binLocation || '',
    '{line_note}': item.note || '',
    // Serial/Lot
    '{serials}': item.serial || '',
    '{lots_number_code1}': item.lotNumber || '',
    '{lots_number_code2}': item.lotWithQty || '',
    '{lots_number_code3}': item.lotWithDates || '',
    '{lots_number_code4}': item.lotWithDatesQty || '',
    // Composite
    '{line_composite_variant_code}': item.compositeVariantCode || '',
    '{line_composite_variant_name}': item.compositeVariantName || '',
    '{line_composite_unit}': item.compositeUnit || '',
    '{line_composite_quantity}': item.compositeQuantity?.toString() || '',
  }));
}

export function mapPackingCompositeLineItems(compositeItems: PackingForPrint['compositeItems']): PrintLineItem[] {
  if (!compositeItems) return [];
  
  const results: PrintLineItem[] = [];
  let stt = 1;
  
  for (const item of compositeItems) {
    if (item.compositeComponents) {
      for (const component of item.compositeComponents) {
        results.push({
          '{line_stt}': stt.toString(),
          '{composite_product_name}': item.productName,
          '{composite_component_name}': component.componentName,
          '{composite_quantity}': component.quantity.toString(),
        });
        stt++;
      }
    }
  }
  
  return results;
}
