/**
 * J&T Express Create Order API
 * POST /api/shipping/jnt/create-order
 * 
 * Proxy to J&T Order API
 * Handles signature generation server-side (key never exposed to client)
 * 
 * J&T API spec:
 * - Content-Type: application/x-www-form-urlencoded
 * - Body: data_param (JSON) + data_sign (base64(md5(data_param + key)))
 */

import { NextRequest } from 'next/server';
import { randomUUID, createHash } from 'crypto';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'

export const POST = apiHandler(async (req) => {
  const startTime = Date.now();
  const requestId = randomUUID();

  try {
    const body = await req.json();
    const { username, api_key, key, apiUrl, ...orderParams } = body;

    if (!username || !api_key || !key) {
      return apiError('Username, API Key và Key đều bắt buộc', 400);
    }

    if (!apiUrl) {
      return apiError('API URL (endpoint) là bắt buộc', 400);
    }

    // Format phone: ensure +84 prefix for Vietnam
    const formatPhone = (phone: string): string => {
      if (!phone) return '';
      const cleaned = phone.replace(/\s/g, '');
      if (cleaned.startsWith('+84')) return cleaned;
      if (cleaned.startsWith('84')) return '+' + cleaned;
      if (cleaned.startsWith('0')) return '+84' + cleaned.substring(1);
      return cleaned;
    };

    // Build J&T order data
    const orderData = {
      username,
      api_key,
      orderid: orderParams.orderId,
      shipper_name: (orderParams.shipperName || '').substring(0, 30),
      shipper_contact: (orderParams.shipperContact || orderParams.shipperName || '').substring(0, 30),
      shipper_phone: formatPhone(orderParams.shipperPhone),
      shipper_addr: (orderParams.shipperAddr || '').substring(0, 200),
      origin_code: (orderParams.originCode || '').toUpperCase(),
      receiver_name: (orderParams.receiverName || '').substring(0, 30),
      receiver_phone: formatPhone(orderParams.receiverPhone),
      receiver_addr: (orderParams.receiverAddr || '').substring(0, 200),
      receiver_zip: orderParams.receiverZip || '00000',
      destination_code: (orderParams.destinationCode || '').toUpperCase(),
      receiver_area: (orderParams.receiverArea || '').toUpperCase(),
      qty: String(orderParams.qty || 1),
      weight: String(orderParams.weight || 1),
      goodsdesc: (orderParams.goodsdesc || 'Hang hoa').replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 40),
      servicetype: String(orderParams.serviceType || 1),
      insurance: orderParams.insurance ? String(orderParams.insurance) : '',
      orderdate: orderParams.orderDate || new Date().toISOString().replace('T', ' ').substring(0, 19),
      item_name: (orderParams.itemName || 'Hang hoa').replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 50),
      cod: orderParams.cod ? String(orderParams.cod) : '',
      sendstarttime: orderParams.sendStartTime || '',
      sendendtime: orderParams.sendEndTime || '',
      expresstype: orderParams.expressType || '1',
      goodsvalue: String(orderParams.goodsvalue || 0),
    };

    // Build data_param: {"detail":[{...orderData}]}
    const dataParam = JSON.stringify({ detail: [orderData] });

    // Generate signature: base64(md5(data_param + key))
    const dataSign = Buffer.from(
      createHash('md5').update(dataParam + key).digest('hex')
    ).toString('base64');

    // J&T uses x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('data_param', dataParam);
    formData.append('data_sign', dataSign);

    const response = await fetchWithTimeout(apiUrl, {
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
      logError(`[JNT-ORDER-${requestId}] JSON parse error`, null, {
        responsePreview: responseText.substring(0, 500),
      });
      return apiError('J&T API trả về phản hồi không hợp lệ', 500);
    }

    const duration = Date.now() - startTime;

    // Check detail status
    const detail = data.detail?.[0];
    if (detail?.status === 'Error') {
      logError(`[JNT-ORDER-${requestId}] Order error (${duration}ms)`, null, {
        reason: detail.reason,
      });
      return apiError(detail.reason || 'J&T trả về lỗi không xác định', 400);
    }

    return apiSuccess(data);
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`[JNT-ORDER-${requestId}] ❌ Create order error (${duration}ms)`, error);
    return apiError(
      error instanceof Error ? error.message : 'Lỗi không xác định',
      500
    );
  }
}, {
  rateLimit: { max: 30, windowMs: 60_000 }
});
