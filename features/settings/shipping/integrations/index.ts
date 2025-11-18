/**
 * Shipping Partners Integration Services
 * Export all shipping partner API services
 */

export * from './ghtk-service';
export * from './ghn-service';
export * from './jnt-service';
export * from './vtp-service';
export * from './spx-service';

// Services are already exported via export * above

import { GHTKService } from './ghtk-service';
import { GHNService } from './ghn-service';
import { JNTService } from './jnt-service';
import { VTPService } from './vtp-service';
import { SPXService } from './spx-service';

/**
 * Shipping Partner Codes
 */
export enum ShippingPartnerCode {
  GHTK = 'GHTK',
  GHN = 'GHN',
  JNT = 'JNT',
  VTP = 'VTP',
  SPX = 'SPX',
  VNPOST = 'VNPOST',
  NINJA_VAN = 'NINJA_VAN',
  AHAMOVE = 'AHAMOVE',
}

/**
 * Get shipping service instance by partner code
 * 
 * @param partnerCode - Shipping partner code (GHTK, GHN, J&T, VTP, SPX)
 * @param apiToken - API Token/Key
 * @param additionalParams - Additional parameters specific to each partner
 * @returns Service instance or null if partner not supported
 * 
 * @example
 * ```typescript
 * // GHTK
 * const ghtkService = getShippingService('GHTK', 'your-api-token', { partnerCode: 'SHOP123' });
 * 
 * // GHN
 * const ghnService = getShippingService('GHN', 'your-api-token', { shopId: '123456' });
 * 
 * // VTP
 * const vtpService = getShippingService('VTP', 'your-api-token', { username: 'user', password: 'pass' });
 * 
 * // J&T
 * const jntService = getShippingService('JNT', 'your-api-key', { apiSecret: 'secret', customerCode: 'CUST123' });
 * 
 * // SPX
 * const spxService = getShippingService('SPX', 'your-api-key', { merchantId: 'MERCHANT123' });
 * ```
 */
export function getShippingService(
  partnerCode: string,
  apiToken: string,
  additionalParams?: {
    // GHTK
    partnerCode?: string;
    // GHN
    shopId?: string;
    // VTP
    username?: string;
    password?: string;
    // J&T
    apiSecret?: string;
    customerCode?: string;
    testMode?: boolean;
    // SPX
    merchantId?: string;
  }
): GHTKService | GHNService | JNTService | VTPService | SPXService | null {
  const normalizedCode = partnerCode.toUpperCase();
  
  switch (normalizedCode) {
    case ShippingPartnerCode.GHTK:
      return new GHTKService(apiToken, additionalParams?.partnerCode);
    
    case ShippingPartnerCode.GHN:
      return new GHNService(apiToken, additionalParams?.shopId);
    
    case ShippingPartnerCode.JNT:
    case 'J&T':
      return new JNTService(
        apiToken,
        additionalParams?.apiSecret,
        additionalParams?.customerCode,
        additionalParams?.testMode
      );
    
    case ShippingPartnerCode.VTP:
    case 'VIETTELPOST':
      return new VTPService(
        apiToken,
        additionalParams?.username,
        additionalParams?.password
      );
    
    case ShippingPartnerCode.SPX:
      return new SPXService(
        apiToken,
        additionalParams?.apiSecret,
        additionalParams?.merchantId,
        additionalParams?.testMode
      );
    
    default:
      console.warn(`Shipping partner ${partnerCode} is not supported yet`);
      return null;
  }
}

/**
 * Get all available shipping partners with their service status
 */
export function getAvailableShippingPartners() {
  return [
    {
      code: ShippingPartnerCode.GHTK,
      name: 'Giao Hàng Tiết Kiệm',
      shortName: 'GHTK',
      status: 'active',
      hasService: true,
      requiresApproval: false,
    },
    {
      code: ShippingPartnerCode.GHN,
      name: 'Giao Hàng Nhanh',
      shortName: 'GHN',
      status: 'active',
      hasService: true,
      requiresApproval: false,
    },
    {
      code: ShippingPartnerCode.VTP,
      name: 'Viettel Post',
      shortName: 'VTP',
      status: 'active',
      hasService: true,
      requiresApproval: true, // Requires VTP approval
    },
    {
      code: ShippingPartnerCode.JNT,
      name: 'J&T Express',
      shortName: 'J&T',
      status: 'active',
      hasService: true,
      requiresApproval: true, // Requires partnership agreement
    },
    {
      code: ShippingPartnerCode.SPX,
      name: 'SPX Express',
      shortName: 'SPX',
      status: 'beta',
      hasService: true,
      requiresApproval: true, // API documentation pending
      note: 'Service template - requires official API documentation',
    },
    {
      code: ShippingPartnerCode.VNPOST,
      name: 'Bưu điện Việt Nam',
      shortName: 'VNPOST',
      status: 'pending',
      hasService: false,
      requiresApproval: true,
    },
    {
      code: ShippingPartnerCode.NINJA_VAN,
      name: 'Ninja Van',
      shortName: 'Ninja Van',
      status: 'pending',
      hasService: false,
      requiresApproval: false,
    },
    {
      code: ShippingPartnerCode.AHAMOVE,
      name: 'Ahamove',
      shortName: 'Ahamove',
      status: 'pending',
      hasService: false,
      requiresApproval: false,
    },
  ];
}

/**
 * Check if a partner has active service implementation
 */
export function hasActiveService(partnerCode: string): boolean {
  const partners = getAvailableShippingPartners();
  const partner = partners.find(
    p => p.code.toUpperCase() === partnerCode.toUpperCase()
  );
  return partner?.hasService ?? false;
}

/**
 * Check if a partner requires approval before use
 */
export function requiresPartnerApproval(partnerCode: string): boolean {
  const partners = getAvailableShippingPartners();
  const partner = partners.find(
    p => p.code.toUpperCase() === partnerCode.toUpperCase()
  );
  return partner?.requiresApproval ?? false;
}
