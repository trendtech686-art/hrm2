(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/settings/shipping/integrations/ghtk-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GHTKService",
    ()=>GHTKService,
    "GHTK_STATUS_MAP",
    ()=>GHTK_STATUS_MAP,
    "GHTK_TAGS",
    ()=>GHTK_TAGS
]);
/**
 * GHTK (Giao Hàng Tiết Kiệm) API Integration Service
 * Documentation: https://api.ghtk.vn/
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-client] (ecmascript)");
;
// ✅ Use local proxy server to avoid CORS
const GHTK_BASE_URL = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBaseUrl"])()}/api/shipping/ghtk`;
class GHTKService {
    apiToken;
    partnerCode;
    constructor(apiToken, partnerCode = ''){
        this.apiToken = apiToken;
        this.partnerCode = partnerCode;
    }
    /**
   * Tính phí vận chuyển
   */ async calculateShippingFee(params) {
        // ✅ Call through proxy server
        const payload = {
            apiToken: this.apiToken,
            partnerCode: this.partnerCode,
            pick_province: params.pickProvince,
            pick_district: params.pickDistrict,
            pick_ward: params.pickWard,
            province: params.province,
            district: params.district,
            ward: params.ward,
            address: params.address,
            weight: params.weight * 1000,
            value: params.value,
            transport: params.transport,
            tags: params.tags
        };
        const response = await fetch(`${GHTK_BASE_URL}/calculate-fee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.error || `GHTK API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    /**
   * Tạo đơn hàng mới
   */ async createOrder(params) {
        // ⚠️ GHTK limitation: Cannot create orders >= 20,000 gram (20kg)
        const totalWeightGram = params.totalWeight || params.products.reduce((sum, p)=>sum + p.weight * p.quantity, 0);
        if (totalWeightGram >= 20000) {
            throw new Error(`GHTK không hỗ trợ đơn hàng ≥20kg (${totalWeightGram}g). Vui lòng liên hệ GHTK để được hỗ trợ dịch vụ BBS cho hàng nặng.`);
        }
        // ✅ Call through proxy server
        console.log('[GHTKService.createOrder] pickAddressId:', params.pickAddressId, 'type:', typeof params.pickAddressId);
        const payload = {
            apiToken: this.apiToken,
            partnerCode: this.partnerCode,
            // ⚠️ CRITICAL GHTK API STRUCTURE - UPDATED:
            // According to GHTK API behavior (error 30207 testing):
            // 
            // pick_address_id = ID của KHO GHTK (từ API /services/shipment/list_pick_address_id)
            // 
            // ⚠️ IMPORTANT: Ngay cả khi có pick_address_id, GHTK VẪN YÊU CẦU đầy đủ thông tin địa chỉ!
            //    - Phải gửi: pick_name, pick_address, pick_province, pick_district, pick_tel
            //    - pick_address_id CHỈ dùng để xác định kho ưu tiên, KHÔNG thay thế địa chỉ chi tiết
            //    - Nếu thiếu pick_address → Error 30207 "Vui lòng nhập địa chỉ lấy hàng hóa"
            // ✅ Pickup info - ALWAYS send full address details
            pick_name: params.pickName || 'Người gửi',
            pick_address: params.pickAddress || '',
            pick_province: params.pickProvince || '',
            pick_district: params.pickDistrict || '',
            pick_ward: params.pickWard || '',
            pick_tel: params.pickTel || '',
            // ✅ pick_address_id is OPTIONAL, only add if available
            ...params.pickAddressId ? {
                pick_address_id: params.pickAddressId
            } : {},
            // ✅ Customer/Recipient info (always use generic field names)
            name: params.customerName,
            address: params.customerAddress,
            province: params.customerProvince,
            district: params.customerDistrict,
            ward: params.customerWard,
            street: params.customerStreet,
            hamlet: params.customerHamlet || 'Khác',
            tel: params.customerTel,
            // Order info
            id: params.orderId,
            products: params.products.map((p)=>({
                    name: p.name,
                    weight: p.weight,
                    quantity: p.quantity,
                    product_code: p.productCode || 'DEFAULT',
                    price: p.price || 0
                })),
            total_weight: params.totalWeight,
            weight_option: 'gram',
            total_box: params.totalBox,
            value: params.value,
            transport: params.transport || 'road',
            pick_option: 'cod',
            note: params.note,
            // Payment
            is_freeship: params.isFreeship === 1 || params.isFreeship === true ? 1 : 0,
            pick_money: params.pickMoney || 0,
            // ✅ NEW: not_delivered_fee field for tag 19 (Không giao được thu phí)
            // According to GHTK docs: Must pass not_delivered_fee when using tag 19
            // Range: 0 < not_delivered_fee <= 20,000,000
            ...params.tags?.includes(19) && params.failedDeliveryFee ? {
                not_delivered_fee: params.failedDeliveryFee
            } : {},
            // ✅ Dates & shifts
            pick_date: params.pickDate,
            deliver_date: params.deliverDate,
            pick_work_shift: params.pickWorkShift,
            deliver_work_shift: params.deliverWorkShift,
            // Tags
            tags: params.tags
        };
        console.log('📤 [GHTKService] FINAL payload before sending to GHTK:', JSON.stringify(payload, null, 2));
        const response = await fetch(`${GHTK_BASE_URL}/submit-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        console.log('📡 [GHTKService] Response status:', response.status);
        console.log('📡 [GHTKService] Response ok:', response.ok);
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            console.error('📡 [GHTKService] Error data:', errorData);
            throw new Error(errorData.error || errorData.message || `GHTK API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('📡 [GHTKService] Response data:', data);
        // ✅ Handle GHTK error response (success: false)
        if (!data.success) {
            console.error('📡 [GHTKService] API returned error:', data.message);
            throw new Error(data.message || 'GHTK API returned error');
        }
        return data;
    }
    /**
   * Kiểm tra trạng thái đơn hàng
   */ async getOrderStatus(trackingCode) {
        const url = `${GHTK_BASE_URL}/services/shipment/v2/${trackingCode}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Token': this.apiToken,
                'X-Client-Source': this.partnerCode
            }
        });
        if (!response.ok) {
            throw new Error(`GHTK API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    /**
   * In nhãn đơn hàng (shipping label)
   */ async printLabel(trackingCode) {
        const url = `${GHTK_BASE_URL}/services/label/${trackingCode}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Token': this.apiToken,
                'X-Client-Source': this.partnerCode
            }
        });
        if (!response.ok) {
            throw new Error(`GHTK API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    /**
   * Hủy đơn hàng
   */ async cancelOrder(trackingCode) {
        const url = `${GHTK_BASE_URL}/services/shipment/cancel/${trackingCode}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Token': this.apiToken,
                'X-Client-Source': this.partnerCode
            }
        });
        if (!response.ok) {
            throw new Error(`GHTK API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
}
const GHTK_STATUS_MAP = {
    '-1': {
        text: 'Hủy đơn hàng',
        color: 'destructive'
    },
    '1': {
        text: 'Chưa tiếp nhận',
        color: 'secondary'
    },
    '2': {
        text: 'Đã tiếp nhận',
        color: 'info'
    },
    '3': {
        text: 'Đã lấy hàng/Đã nhập kho',
        color: 'warning'
    },
    '4': {
        text: 'Đã điều phối giao hàng/Đang giao hàng',
        color: 'warning'
    },
    '5': {
        text: 'Đã giao hàng/Chưa đối soát',
        color: 'success'
    },
    '6': {
        text: 'Đã đối soát',
        color: 'success'
    },
    '7': {
        text: 'Không lấy được hàng',
        color: 'destructive'
    },
    '8': {
        text: 'Hoãn lấy hàng',
        color: 'warning'
    },
    '9': {
        text: 'Không giao được hàng',
        color: 'destructive'
    },
    '10': {
        text: 'Delay giao hàng',
        color: 'warning'
    },
    '11': {
        text: 'Đã đối soát công nợ trả hàng',
        color: 'secondary'
    },
    '12': {
        text: 'Đã điều phối lấy hàng/Đang lấy hàng',
        color: 'warning'
    },
    '13': {
        text: 'Đơn hàng bồi hoàn',
        color: 'destructive'
    },
    '20': {
        text: 'Đang trả hàng (COD cầm hàng đi trả)',
        color: 'warning'
    },
    '21': {
        text: 'Đã trả hàng',
        color: 'secondary'
    },
    '123': {
        text: 'Shipper báo đã lấy hàng',
        color: 'info'
    },
    '127': {
        text: 'Shipper (nhân viên lấy/giao hàng) báo không lấy được hàng',
        color: 'destructive'
    },
    '128': {
        text: 'Shipper báo delay lấy hàng',
        color: 'warning'
    },
    '45': {
        text: 'Shipper báo đã giao hàng',
        color: 'success'
    },
    '49': {
        text: 'Shipper báo không giao được giao hàng',
        color: 'destructive'
    },
    '410': {
        text: 'Shipper báo delay giao hàng',
        color: 'warning'
    }
};
const GHTK_TAGS = {
    FRAGILE: 1,
    HIGH_VALUE: 2,
    BULKY: 3,
    DOCUMENT: 4,
    FOOD: 5,
    TRY_BEFORE_BUY: 10,
    CALL_SHOP: 13,
    PARTIAL_DELIVERY_SELECT: 17,
    PARTIAL_DELIVERY_EXCHANGE: 18,
    NO_DELIVERY_FEE: 19
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_settings_shipping_integrations_ghtk-service_ts_5fc0a8f7._.js.map