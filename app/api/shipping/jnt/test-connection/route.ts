/**
 * J&T Express Test Connection API
 * POST /api/shipping/jnt/test-connection
 * 
 * Test J&T API connection bằng cách gọi Tariff Check API
 * J&T không có endpoint "test" riêng nên dùng tariff check đơn giản
 */

import { NextRequest } from 'next/server';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import crypto from 'crypto';

export const POST = apiHandler(async (req) => {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { username, api_key, key, apiUrl } = body;

    if (!username || !api_key || !key) {
      return apiError('Username, API Key và Key đều bắt buộc', 400);
    }

    if (!apiUrl) {
      return apiError('API URL (endpoint) là bắt buộc', 400);
    }

    // Test bằng cách tạo 1 request tariff check đơn giản
    // Dùng dummy data để kiểm tra credentials
    const testData = JSON.stringify({
      weight: '1',
      sendSiteCode: 'HOCHIMINH',
      destAreaCode: 'HOCHIMINH',
      cusName: username,
      productType: 'EZ',
    });

    // J&T signature: base64(md5(data + key))
    const dataSign = Buffer.from(
      crypto.createHash('md5').update(testData + key).digest('hex')
    ).toString('base64');

    // J&T uses x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('data', testData);
    formData.append('sign', dataSign);

    // Lấy tariff URL từ apiUrl (thay /order thành /tariff hoặc append)
    const tariffUrl = apiUrl.replace(/\/order\/?$/, '/tariff');

    const response = await fetchWithTimeout(tariffUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    // J&T tariff check: is_success='true' means OK
    if (data.is_success === 'true' || data.is_success === true) {
      return apiSuccess({
        success: true,
        message: 'Kết nối J&T Express thành công',
        duration,
        data: {
          tariffResult: data.content,
        },
      });
    } else {
      return apiError(
        data.message || 'Kết nối J&T thất bại. Kiểm tra lại thông tin đăng nhập.',
        400
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`[JNT-TEST] ❌ Connection test error (${duration}ms)`, error);
    return apiError(
      'Lỗi kết nối: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
}, {
  rateLimit: { max: 10, windowMs: 60_000 }
});
