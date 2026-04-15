/**
 * J&T Express Cancel Order API
 * POST /api/shipping/jnt/cancel-order
 * 
 * Proxy to J&T Cancel Order API
 * Uses data_param + data_sign signature (same as create-order)
 */

import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const startTime = Date.now();

  try {
    const body = await request.json();
    const { username, api_key, key, apiUrl, orderid, remark } = body;

    if (!username || !api_key || !key) {
      return apiError('Username, API Key và Key đều bắt buộc', 400);
    }

    if (!apiUrl) {
      return apiError('API URL là bắt buộc', 400);
    }

    if (!orderid) {
      return apiError('Mã đơn hàng (orderid) là bắt buộc', 400);
    }

    // Build cancel data
    const cancelData = {
      username,
      api_key,
      orderid,
      remark: remark || 'Hủy đơn hàng',
    };

    // Build data_param: {"detail":[{...cancelData}]}
    const dataParam = JSON.stringify({ detail: [cancelData] });

    // Generate signature: base64(md5(data_param + key))
    const dataSign = Buffer.from(
      crypto.createHash('md5').update(dataParam + key).digest('hex')
    ).toString('base64');

    // Derive cancel URL from order URL
    const cancelUrl = apiUrl.replace(/\/order\/?$/, '/cancel');

    const formData = new URLSearchParams();
    formData.append('data_param', dataParam);
    formData.append('data_sign', dataSign);

    const response = await fetchWithTimeout(cancelUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      logError('[JNT-CANCEL] JSON parse error', null, {
        responsePreview: responseText.substring(0, 500),
      });
      return apiError('J&T API trả về phản hồi không hợp lệ', 500);
    }

    const duration = Date.now() - startTime;

    // Check detail status
    const detail = data.detail?.[0];
    if (detail?.status === 'Error') {
      logError(`[JNT-CANCEL] Cancel error (${duration}ms)`, null, {
        reason: detail.reason,
      });
      return apiError(detail.reason || 'Không thể hủy đơn hàng', 400);
    }

    return apiSuccess(data);
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`[JNT-CANCEL] ❌ Cancel order error (${duration}ms)`, error);
    return apiError(
      error instanceof Error ? error.message : 'Lỗi không xác định',
      500
    );
  }
}
