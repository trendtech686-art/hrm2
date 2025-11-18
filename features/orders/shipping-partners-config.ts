/**
 * Cấu hình các đơn vị vận chuyển hỗ trợ API
 * 
 * Khi thêm đơn vị mới:
 * 1. Thêm ID vào SUPPORTED_SHIPPING_PARTNERS
 * 2. Thêm mapping name trong SHIPPING_PARTNER_NAMES
 * 3. Implement function create order tương ứng
 * 4. Thêm case trong switch statement ở order-form-page.tsx
 */

export const SUPPORTED_SHIPPING_PARTNERS = [
    'GHTK',   // Giao Hàng Tiết Kiệm
    'GHN',    // Giao Hàng Nhanh
    'JNT',    // J&T Express
    'VTP',    // ViettelPost
    'SPX',    // Shopee Express
] as const;

export type ShippingPartnerId = typeof SUPPORTED_SHIPPING_PARTNERS[number];

export const SHIPPING_PARTNER_NAMES: Record<ShippingPartnerId, string> = {
    GHTK: 'Giao Hàng Tiết Kiệm',
    GHN: 'Giao Hàng Nhanh',
    JNT: 'J&T Express',
    VTP: 'ViettelPost',
    SPX: 'Shopee Express',
};

/**
 * Check if a partner ID is supported for API integration
 */
export function isSupportedShippingPartner(partnerId: string): partnerId is ShippingPartnerId {
    return SUPPORTED_SHIPPING_PARTNERS.includes(partnerId as ShippingPartnerId);
}

/**
 * Get preview params key for a specific partner
 * Example: GHTK → __ghtkPreviewParams
 */
export function getPreviewParamsKey(partnerId: ShippingPartnerId): string {
    return `__${partnerId.toLowerCase()}PreviewParams`;
}

/**
 * Get configuration key for preview params stored in form data
 * Example: GHTK → _ghtkPreviewParams
 */
export function getConfigParamsKey(partnerId: ShippingPartnerId): string {
    return `_${partnerId.toLowerCase()}PreviewParams`;
}
