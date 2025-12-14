/**
 * Order Print Helper
 * Helpers để chuẩn bị dữ liệu in cho đơn hàng
 */

import type { Order, LineItem, Packaging } from '../../features/orders/types';
import type { Customer } from '../../features/customers/types';
import type { Branch } from '../../features/settings/branches/types';
import type { Employee } from '../../features/employees/types';
import { 
  OrderForPrint, 
  DeliveryForPrint, 
  ShippingLabelForPrint,
  PackingForPrint,
  mapOrderToPrintData, 
  mapOrderLineItems,
  mapDeliveryToPrintData,
  mapDeliveryLineItems,
  mapShippingLabelToPrintData,
  mapPackingToPrintData,
  mapPackingLineItems,
} from '../print-data-mappers';
import { StoreSettings, getStoreLogo } from '../print-service';
import { formatOrderAddress } from '../../features/orders/address-utils';

/**
 * Chuyển đổi Order entity sang OrderForPrint
 */
export function convertOrderForPrint(
  order: Order,
  options: {
    customer?: Customer | null;
    createdByEmployee?: Employee | null;
  } = {}
): OrderForPrint {
  const { customer, createdByEmployee } = options;

  // Tính tổng số lượng
  const totalQuantity = order.lineItems.reduce((sum, item) => sum + item.quantity, 0);

  // Tính tổng giảm giá dòng
  const lineDiscounts = order.lineItems.reduce((sum, item) => {
    if (item.discountType === 'percentage') {
      return sum + (item.unitPrice * item.quantity * item.discount / 100);
    }
    return sum + (item.discount * item.quantity);
  }, 0);

  // Tổng giảm giá (dòng + đơn)
  const totalDiscount = lineDiscounts + (order.orderDiscount || 0) + (order.voucherAmount || 0);

  // Format địa chỉ
  const shippingAddr = typeof order.shippingAddress === 'string' 
    ? order.shippingAddress 
    : formatOrderAddress(order.shippingAddress);
  
  const billingAddr = typeof order.billingAddress === 'string'
    ? order.billingAddress
    : formatOrderAddress(order.billingAddress);

  // Get customer first address for fallback
  const customerFirstAddress = customer?.addresses?.[0];
  const customerAddressString = customerFirstAddress 
    ? [customerFirstAddress.street, customerFirstAddress.ward, customerFirstAddress.district, customerFirstAddress.province].filter(Boolean).join(', ')
    : '';

  return {
    code: order.id,
    createdAt: order.orderDate,
    createdBy: createdByEmployee?.fullName || order.salesperson,
    // Trạng thái
    status: order.status,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.deliveryStatus,
    // Customer
    customer: customer ? {
      name: customer.name,
      code: customer.id, // Customer business ID
      phone: customer.phone,
      email: customer.email,
      group: customer.customerGroup || '',
      address: customerAddressString,
    } : {
      name: order.customerName,
    },
    billingAddress: billingAddr,
    shippingAddress: shippingAddr,
    items: order.lineItems.map(item => {
      const lineDiscount = item.discountType === 'percentage'
        ? item.unitPrice * item.quantity * item.discount / 100
        : item.discount * item.quantity;
      const lineAmountBeforeTax = item.unitPrice * item.quantity - lineDiscount;
      
      // Tính thuế cho từng dòng
      const taxRate = item.tax || 0; // % thuế (ví dụ: 10)
      const lineTaxAmount = lineAmountBeforeTax * taxRate / 100;
      const lineAmount = lineAmountBeforeTax + lineTaxAmount;
      
      return {
        productName: item.productName,
        variantName: '', // Could be extracted from productName if formatted as "Product - Variant"
        variantCode: item.productId,
        unit: 'Cái',
        quantity: item.quantity,
        price: item.unitPrice,
        discountAmount: lineDiscount,
        taxAmount: lineTaxAmount,
        taxRate: taxRate,
        amount: lineAmount,
        note: item.note || '', // Ghi chú sản phẩm
      };
    }),
    totalQuantity,
    subtotal: order.subtotal,
    totalDiscount,
    totalTax: order.tax,
    deliveryFee: order.shippingFee,
    total: order.grandTotal,
    paymentMethod: order.expectedPaymentMethod || (order.payments[0]?.method),
    paidAmount: order.paidAmount,
    changeAmount: order.paidAmount > order.grandTotal ? order.paidAmount - order.grandTotal : 0,
    note: order.notes,
  };
}

/**
 * Chuyển đổi Order + Packaging sang DeliveryForPrint
 */
export function convertPackagingToDeliveryForPrint(
  order: Order,
  packaging: Packaging,
  options: {
    customer?: Customer | null;
  } = {}
): DeliveryForPrint {
  const { customer } = options;

  // Format địa chỉ
  const shippingAddr = typeof order.shippingAddress === 'string' 
    ? order.shippingAddress 
    : formatOrderAddress(order.shippingAddress);

  // Lấy contact info từ shipping address nếu là object
  let recipientName = customer?.name || order.customerName;
  let recipientPhone = customer?.phone;

  if (typeof order.shippingAddress === 'object' && order.shippingAddress) {
    recipientName = order.shippingAddress.contactName || recipientName;
    recipientPhone = order.shippingAddress.phone || order.shippingAddress.contactPhone || recipientPhone;
  }

  return {
    code: packaging.id,
    orderCode: order.id,
    createdAt: packaging.requestDate,
    createdBy: packaging.requestingEmployeeName,
    trackingCode: packaging.trackingCode,
    carrierName: packaging.carrier,
    // Thông tin khách hàng
    customerName: customer?.name || order.customerName,
    customerCode: customer?.id,
    customerPhone: customer?.phone,
    customerEmail: customer?.email,
    // Thông tin người nhận
    receiverName: recipientName,
    receiverPhone: recipientPhone,
    shippingAddress: shippingAddr,
    // Danh sách sản phẩm
    items: order.lineItems.map(item => ({
      variantCode: item.productId,
      productName: item.productName,
      variantName: '',
      quantity: item.quantity,
      price: item.unitPrice,
      amount: item.unitPrice * item.quantity,
      note: item.note,
    })),
    // Tổng giá trị
    totalQuantity: order.lineItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: order.subtotal,
    deliveryFee: order.shippingFee,
    codAmount: packaging.codAmount || order.codAmount,
    totalAmount: order.grandTotal,
    note: packaging.noteToShipper,
  };
}

/**
 * Chuyển đổi Order + Packaging sang ShippingLabelForPrint
 */
export function convertToShippingLabelForPrint(
  order: Order,
  packaging: Packaging,
  options: {
    customer?: Customer | null;
  } = {}
): ShippingLabelForPrint {
  const { customer } = options;

  const shippingAddr = typeof order.shippingAddress === 'string' 
    ? order.shippingAddress 
    : formatOrderAddress(order.shippingAddress);

  let recipientName = customer?.name || order.customerName;
  let recipientPhone = customer?.phone;

  if (typeof order.shippingAddress === 'object' && order.shippingAddress) {
    recipientName = order.shippingAddress.contactName || recipientName;
    recipientPhone = order.shippingAddress.phone || order.shippingAddress.contactPhone || recipientPhone;
  }

  const totalItems = order.lineItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    orderCode: order.id,
    trackingCode: packaging.trackingCode,
    carrierName: packaging.carrier,
    // Thông tin khách hàng
    customerName: customer?.name || order.customerName,
    customerPhone: customer?.phone,
    shippingAddress: shippingAddr,
    // Thông tin người nhận (nếu khác)
    receiverName: recipientName,
    receiverPhone: recipientPhone,
    totalItems,
    packingWeight: packaging.weight ? packaging.weight / 1000 : undefined, // Convert grams to kg
    codAmount: packaging.codAmount || order.codAmount,
    note: packaging.noteToShipper,
  };
}

/**
 * Chuyển đổi Order + Packaging sang PackingForPrint (phiếu đóng gói)
 */
export function convertToPackingForPrint(
  order: Order,
  packaging: Packaging,
  options: {
    customer?: Customer | null;
    productBinLocations?: Record<string, string>; // productSystemId -> bin location
    assignedEmployee?: Employee | null;
  } = {}
): PackingForPrint {
  const { customer, productBinLocations = {}, assignedEmployee } = options;

  const shippingAddr = typeof order.shippingAddress === 'string' 
    ? order.shippingAddress 
    : formatOrderAddress(order.shippingAddress);

  let recipientName = customer?.name || order.customerName;
  let recipientPhone = customer?.phone;

  if (typeof order.shippingAddress === 'object' && order.shippingAddress) {
    recipientName = order.shippingAddress.contactName || recipientName;
    recipientPhone = order.shippingAddress.phone || order.shippingAddress.contactPhone || recipientPhone;
  }

  // Extract ward/district from shippingAddress if it's an object
  const shippingWard = typeof order.shippingAddress === 'object' && order.shippingAddress
    ? order.shippingAddress.ward
    : undefined;
  const shippingDistrict = typeof order.shippingAddress === 'object' && order.shippingAddress
    ? order.shippingAddress.district
    : undefined;

  return {
    code: packaging.id,
    createdAt: packaging.requestDate,
    packedAt: packaging.confirmDate,
    createdBy: packaging.requestingEmployeeName,
    orderCode: order.id,
    fulfillmentStatus: packaging.status,
    assignedEmployee: assignedEmployee?.fullName || packaging.assignedEmployeeName,
    customerName: recipientName,
    customerCode: customer?.id,
    customerPhone: recipientPhone,
    customerEmail: customer?.email,
    shippingAddress: shippingAddr,
    shippingWard,
    shippingDistrict,
    items: order.lineItems.map(item => ({
      variantCode: item.productId,
      productName: item.productName,
      variantName: '',
      quantity: item.quantity,
      binLocation: productBinLocations[item.productSystemId] || '',
    })),
    totalQuantity: order.lineItems.reduce((sum, item) => sum + item.quantity, 0),
    codAmount: packaging.codAmount || order.codAmount,
    note: packaging.notes,
    orderNote: order.notes,
  };
}

/**
 * Tạo StoreSettings từ Branch và branding info
 */
export function createStoreSettings(
  branch?: Branch | null,
  options?: { logo?: string | null }
): StoreSettings {
  if (!branch) {
    return {
      name: '',
      address: '',
      phone: '',
      email: '',
      logo: options?.logo || undefined,
    };
  }

  return {
    name: branch.name,
    address: branch.address || '',
    phone: branch.phone || '',
    email: '', // Branch không có email, có thể lấy từ company settings sau
    logo: options?.logo || undefined,
  };
}

// Re-export mappers để dùng trực tiếp
export {
  mapOrderToPrintData,
  mapOrderLineItems,
  mapDeliveryToPrintData,
  mapDeliveryLineItems,
  mapShippingLabelToPrintData,
  mapPackingToPrintData,
  mapPackingLineItems,
};
