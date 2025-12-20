/**
 * GHTK Cancel Order API
 * POST /api/shipping/ghtk/cancel-order
 * 
 * Proxy to cancel GHTK shipment order
 * ⚠️ Chỉ hủy được khi đơn ở trạng thái: 1, 2, 12 (Chưa tiếp nhận, Đã tiếp nhận, Đang lấy hàng)
 */

import { NextRequest, NextResponse } from 'next/server';

const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 11);

  try {
    const body = await request.json();
    const { trackingCode, apiToken, partnerCode } = body;

    // ✅ Client sẽ gửi token lên (lấy từ shipping_partners_config trong localStorage)
    if (!apiToken) {
      return NextResponse.json({ 
        success: false,
        message: 'Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.' 
      }, { status: 400 });
    }

    if (!trackingCode) {
      return NextResponse.json({ 
        success: false,
        message: 'Mã vận đơn không được để trống' 
      }, { status: 400 });
    }

    console.log(`[GHTK-CANCEL-${requestId}] Cancel order:`, trackingCode);

    const response = await fetch(`${GHTK_API_BASE}/services/shipment/cancel/${trackingCode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
      },
    });

    const data = await response.json();
    
    console.log(`[GHTK-CANCEL-${requestId}] Cancel order response:`, {
      status: response.status,
      success: data.success,
      message: data.message
    });

    // ✅ Trả về response từ GHTK (bao gồm cả success: false)
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[GHTK-CANCEL-${requestId}] Cancel order error:`, error);
    return NextResponse.json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
