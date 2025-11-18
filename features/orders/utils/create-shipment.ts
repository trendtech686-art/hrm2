/**
 * Utility to create shipment order via shipping partner API
 */

import { GHTKService, type GHTKCreateOrderParams } from '../../settings/shipping/integrations/ghtk-service';
import type { ShippingPartner } from '../../settings/shipping-partners/types';
import type { Branch } from '../../branches/types';
import type { Product } from '../../products/types';

export interface CreateShipmentParams {
  // Order info
  orderId: string;
  
  // Shipping service
  shippingPartnerSystemId: string; // Link to ShippingPartner.systemId from settings
  shippingServiceSystemId: string; // Link to ShippingService.systemId from settings
  
  // Addresses
  pickupBranch: Branch;
  customerName: string;
  customerPhone: string;
  customerAddress: string; // Full address string
  customerProvince: string;
  customerDistrict: string;
  customerWard: string;
  
  // Products
  lineItems: Array<{
    productSystemId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  
  // Package info
  codAmount: number;
  totalValue: number;
  weight: number; // in grams
  length?: number;
  width?: number;
  height?: number;
  
  // Configuration
  configuration?: Record<string, any>;
  note?: string;
  
  // Partner credentials
  partner: ShippingPartner;
  
  // For weight calculation
  findProductById: (systemId: string) => Product | undefined;
}

export interface CreateShipmentResult {
  success: boolean;
  trackingCode?: string;
  partnerId?: string;
  partnerLabel?: string;
  estimatedPickTime?: string;
  estimatedDeliverTime?: string;
  error?: string;
}

/**
 * Create shipment order via GHTK API
 */
export async function createShipmentOrder(
  params: CreateShipmentParams
): Promise<CreateShipmentResult> {
  try {
    // Currently only support GHTK
    if (params.shippingPartnerSystemId === 'GHTK' || params.partner.id === 'GHTK') {
      if (!params.partner.credentials?.apiToken) {
        return {
          success: false,
          error: 'Chưa cấu hình API Token cho GHTK',
        };
      }

      const ghtkService = new GHTKService(
        params.partner.credentials.apiToken as string,
        (params.partner.credentials.partnerCode as string) || ''
      );

      // Prepare products list
      const products = params.lineItems.map((item) => {
        const product = params.findProductById(item.productSystemId);
        const weightInKg = product?.weight
          ? product.weightUnit === 'kg'
            ? product.weight
            : product.weight / 1000
          : 0.5; // Default 0.5kg

        return {
          name: item.productName,
          weight: weightInKg,
          quantity: item.quantity,
          price: item.unitPrice,
          productCode: item.productId,
        };
      });

      // Get pickup address components
      const pickupProvince = params.pickupBranch.province || '';
      const pickupDistrict = params.pickupBranch.district || '';
      const pickupWard = params.pickupBranch.ward || '';
      const pickupAddress = params.pickupBranch.address || '';

      const ghtkParams: GHTKCreateOrderParams = {
        orderId: params.orderId,

        // Pickup address
        pickName: params.pickupBranch.name,
        pickAddress: `${pickupAddress}, ${pickupWard}, ${pickupDistrict}, ${pickupProvince}`,
        pickProvince: pickupProvince,
        pickDistrict: pickupDistrict,
        pickWard: pickupWard,
        pickTel: params.pickupBranch.phone || '',

        // Customer address
        customerName: params.customerName,
        customerAddress: params.customerAddress,
        customerProvince: params.customerProvince,
        customerDistrict: params.customerDistrict,
        customerWard: params.customerWard,
        customerTel: params.customerPhone,

        // Products
        products: products,

        // Payment
        pickMoney: params.codAmount,
        value: params.totalValue,
        isFreeship: params.configuration?.payer === 'SHOP',

        // Package info
        weightOption: 'gram',
        totalWeight: params.weight,

        // Additional
        note: params.note,
        transport: (params.configuration?.transport as 'road' | 'fly') || 'fly',
        tags: (params.configuration?.ghtkTags as number[]) || [],
      };

      const result = await ghtkService.createOrder(ghtkParams);

      if (result.success && result.order) {
        return {
          success: true,
          trackingCode: result.order.label,
          partnerId: result.order.partner_id,
          partnerLabel: result.order.label,
          estimatedPickTime: result.order.estimated_pick_time,
          estimatedDeliverTime: result.order.estimated_deliver_time,
        };
      } else {
        return {
          success: false,
          error: result.message || 'Không thể tạo đơn vận chuyển',
        };
      }
    }

    // Other partners not supported yet
    return {
      success: false,
      error: 'Chưa hỗ trợ đối tác vận chuyển này',
    };
  } catch (error) {
    console.error('Create shipment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi không xác định',
    };
  }
}
