# 🚚 HƯỚNG DẪN TÍCH HỢP THÊM ĐƠN VỊ VẬN CHUYỂN MỚI

## 📋 TỔNG QUAN

Hệ thống đã được thiết kế để dễ dàng mở rộng cho nhiều đơn vị vận chuyển khác nhau.

**Hiện tại hỗ trợ:**
- ✅ **GHTK** - Giao Hàng Tiết Kiệm (Đã implement)
- 🚧 **GHN** - Giao Hàng Nhanh (Chưa implement)
- 🚧 **J&T** - J&T Express (Chưa implement)
- 🚧 **VTP** - ViettelPost (Chưa implement)
- 🚧 **SPX** - Shopee Express (Chưa implement)

---

## 🔧 BƯỚC THÊM ĐƠN VỊ VẬN CHUYỂN MỚI

### **Bước 1: Thêm vào danh sách hỗ trợ**

**File:** `features/orders/shipping-partners-config.ts`

```typescript
export const SUPPORTED_SHIPPING_PARTNERS = [
    'GHTK',
    'GHN',
    'JNT',
    'VTP',
    'SPX',
    'NINJA',  // ← Thêm đơn vị mới
] as const;

export const SHIPPING_PARTNER_NAMES: Record<ShippingPartnerId, string> = {
    GHTK: 'Giao Hàng Tiết Kiệm',
    GHN: 'Giao Hàng Nhanh',
    JNT: 'J&T Express',
    VTP: 'ViettelPost',
    SPX: 'Shopee Express',
    NINJA: 'Ninja Van',  // ← Thêm tên hiển thị
};
```

---

### **Bước 2: Tạo Service Class cho API**

**File:** `features/settings/shipping-partners/integrations/ninja-service.ts`

```typescript
import type { ShippingPartner } from '../types';

// API Base URL
const NINJA_BASE_URL = 'https://api.ninjavan.co';

// Types
export type NinjaCreateOrderParams = {
    orderId: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    recipientProvince: string;
    recipientDistrict: string;
    recipientWard: string;
    codAmount: number;
    weight: number;
    // ... thêm các fields cần thiết
};

export type NinjaCreateOrderResponse = {
    success: boolean;
    message: string;
    trackingId?: string;
    // ... thêm fields response
};

/**
 * Ninja Van Service Class
 */
export class NinjaService {
    private apiToken: string;
    private clientId: string;

    constructor(apiToken: string, clientId: string = '') {
        this.apiToken = apiToken;
        this.clientId = clientId;
    }

    /**
     * Tạo đơn hàng mới
     */
    async createOrder(params: NinjaCreateOrderParams): Promise<NinjaCreateOrderResponse> {
        const url = `${NINJA_BASE_URL}/v2/orders`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiToken}`,
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Ninja API Error: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Kiểm tra trạng thái đơn hàng
     */
    async getOrderStatus(trackingId: string): Promise<any> {
        const url = `${NINJA_BASE_URL}/v2/orders/${trackingId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ninja API Error: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Hủy đơn hàng
     */
    async cancelOrder(trackingId: string): Promise<any> {
        const url = `${NINJA_BASE_URL}/v2/orders/${trackingId}/cancel`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ninja API Error: ${response.status}`);
        }

        return await response.json();
    }
}
```

---

### **Bước 3: Thêm function tạo đơn**

**File:** `features/orders/order-form-page.tsx`

Thêm import:
```typescript
import { NinjaService, type NinjaCreateOrderParams } from '../settings/shipping-partners/integrations/ninja-service';
```

Thêm function helper (đặt cùng với `createGHTKOrder`):
```typescript
/**
 * Tạo đơn hàng trên Ninja Van và lấy mã vận đơn
 */
const createNinjaOrder = async (ninjaParams: NinjaCreateOrderParams): Promise<string | null> => {
    try {
        console.log('[createNinjaOrder] Calling Ninja API with params:', ninjaParams);
        toast.info('Đang tạo đơn trên Ninja Van...', { duration: 2000 });
        
        const ninjaService = new NinjaService(
            ninjaParams.apiToken,
            ninjaParams.clientId
        );
        
        const result = await ninjaService.createOrder(ninjaParams);
        
        if (result.success && result.trackingId) {
            toast.success('Đã tạo đơn Ninja Van thành công', { 
                description: `Mã vận đơn: ${result.trackingId}` 
            });
            return result.trackingId;
        } else {
            toast.error('Tạo đơn Ninja Van thất bại', { 
                description: result.message || 'Vui lòng kiểm tra lại thông tin' 
            });
            return null;
        }
    } catch (error: any) {
        console.error('❌ Ninja create order error:', error);
        toast.error('Lỗi khi tạo đơn Ninja Van', {
            description: error?.message || 'Vui lòng thử lại sau'
        });
        return null;
    }
};
```

Thêm case trong switch statement (dòng ~730):
```typescript
switch (partnerId) {
    case 'GHTK':
        partnerTrackingCode = await createGHTKOrder(partnerParams);
        break;
    
    case 'NINJA':  // ← Thêm case mới
        partnerTrackingCode = await createNinjaOrder(partnerParams);
        break;
    
    // ... các case khác
}
```

---

### **Bước 4: Cập nhật ShippingIntegration component**

**File:** `features/orders/components/shipping-integration.tsx`

Thêm logic xử lý Ninja Van trong function `handleCreateShipment`:

```typescript
if (selectedService.partnerId === 'NINJA') {
    const { apiToken, clientId } = getNinjaCredentials(); // Tạo helper function này
    const ninjaService = new NinjaService(apiToken, clientId);
    
    const params: NinjaCreateOrderParams = {
        orderId: orderId,
        recipientName: formValues.recipientName,
        recipientPhone: formValues.recipientPhone,
        // ... map các fields
    };
    
    // Store params for order-form-page
    (window as any).__ninjaPreviewParams = params;
    
    const result = await ninjaService.createOrder(params);
    // ... xử lý result
}
```

---

### **Bước 5: Thêm server proxy (nếu cần)**

**File:** `server/server.js`

```javascript
/**
 * POST /api/shipping/ninja/create-order
 * Proxy to create Ninja Van order
 */
app.post('/api/shipping/ninja/create-order', async (req, res) => {
  try {
    const { apiToken, clientId, ...orderData } = req.body;

    if (!apiToken) {
      return res.status(400).json({ error: 'API Token is required' });
    }

    console.log('[Ninja Proxy] Create order:', orderData.orderId);

    const response = await fetch('https://api.ninjavan.co/v2/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    console.log('[Ninja Proxy] Response:', data);

    res.json(data);
  } catch (error) {
    console.error('[Ninja Proxy] Error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

---

## 📝 CHECKLIST THÊM ĐƠN VỊ MỚI

- [ ] Thêm ID vào `SUPPORTED_SHIPPING_PARTNERS`
- [ ] Thêm tên vào `SHIPPING_PARTNER_NAMES`
- [ ] Tạo Service Class (`ninja-service.ts`)
- [ ] Implement `createOrder()` method
- [ ] Implement `getOrderStatus()` method
- [ ] Implement `cancelOrder()` method
- [ ] Thêm helper function trong `order-form-page.tsx`
- [ ] Thêm case trong switch statement
- [ ] Cập nhật `shipping-integration.tsx`
- [ ] Thêm server proxy endpoint (nếu cần CORS)
- [ ] Test với API sandbox/test environment
- [ ] Test với API production
- [ ] Viết unit tests
- [ ] Cập nhật documentation

---

## 🔍 DEBUG & TROUBLESHOOTING

### **1. Kiểm tra preview params**

```typescript
// Trong console browser
console.log(window.__ghtkPreviewParams);
console.log(window.__ninjaPreviewParams);
```

### **2. Kiểm tra API call**

```typescript
// Thêm log trong switch statement
console.log(`Calling ${partnerId} API with params:`, partnerParams);
```

### **3. Test API trực tiếp**

```javascript
// Trong console browser
const ninjaService = new NinjaService('YOUR_API_TOKEN');
const result = await ninjaService.createOrder({
    orderId: 'TEST001',
    // ... test params
});
console.log(result);
```

---

## 📚 TÀI LIỆU THAM KHẢO

- **GHTK API**: https://docs.giaohangtietkiem.vn/
- **GHN API**: https://api.ghn.vn/home/docs/
- **J&T API**: https://jtexpress.vn/developers
- **ViettelPost API**: https://viettelpost.vn/api-docs
- **Shopee Express API**: https://open.shopee.com/documents/v1/logistics
- **Ninja Van API**: https://api-docs.ninjavan.co/

---

## 💡 LƯU Ý

1. **API Credentials**: Mỗi đơn vị vận chuyển cần config API Token/Key riêng trong Cài đặt
2. **Rate Limiting**: Chú ý giới hạn số lần gọi API của từng đơn vị
3. **Error Handling**: Luôn có fallback khi API lỗi
4. **Webhook**: Một số đơn vị hỗ trợ webhook để update trạng thái tự động
5. **Testing**: Test kỹ trên sandbox trước khi dùng production API

---

## ✅ KẾT LUẬN

Với kiến trúc hiện tại, việc thêm đơn vị vận chuyển mới chỉ cần:
1. Thêm vào config (5 phút)
2. Tạo Service Class (30 phút)
3. Thêm case trong switch (5 phút)
4. Test và deploy (15 phút)

**Tổng thời gian: ~1 giờ/đơn vị** (đã có API docs)
