/**
 * GHTK Submit Order API
 * POST /api/shipping/ghtk/submit-order
 * 
 * Alternative endpoint for submit order with weight conversion (g → kg)
 * and full order payload formatting per GHTK API spec
 */

import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { submitOrderSchema } from './validation';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { GHTK_API_BASE } from '@/lib/ghtk-sync'

interface Product {
  name: string;
  weight: number;
  quantity: number;
  product_code?: string;
  height?: number;
  width?: number;
  length?: number;
}

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, submitOrderSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }

  const startTime = Date.now();
  const requestId = randomUUID();

  try {
    const { apiToken, partnerCode, ...orderParams } = validation.data;


    if (!apiToken) {
      return apiError('API Token is required', 400);
    }

    // ⚠️ IMPORTANT: GHTK Submit Order API uses KG, not GRAM!
    // Frontend sends weight in GRAM, we must convert to KG
    const productsInKg = (orderParams.products || []).map((p: Product) => ({
      ...p,
      weight: p.weight / 1000 // Convert gram to KG
    }));
    
    // Calculate total weight in KG from user input (if provided)
    const totalWeightKg = orderParams.total_weight ? (orderParams.total_weight / 1000) : null;
    
    // Build order payload according to GHTK API spec
    const orderPayload = {
      products: productsInKg,
      order: {
        id: orderParams.id,
        
        // ✅ CONDITIONAL PICKUP INFO - Only include fields with values
        ...(orderParams.pick_address_id ? { pick_address_id: orderParams.pick_address_id } : {}),
        ...(orderParams.pick_name ? { pick_name: orderParams.pick_name } : {}),
        ...(orderParams.pick_address ? { pick_address: orderParams.pick_address } : {}),
        ...(orderParams.pick_province ? { pick_province: orderParams.pick_province } : {}),
        ...(orderParams.pick_district ? { pick_district: orderParams.pick_district } : {}),
        ...(orderParams.pick_ward ? { pick_ward: orderParams.pick_ward } : {}),
        ...(orderParams.pick_street ? { pick_street: orderParams.pick_street } : {}),
        ...(orderParams.pick_tel ? { pick_tel: orderParams.pick_tel } : {}),
        
        // Customer delivery info
        tel: orderParams.tel,
        name: orderParams.name,
        address: orderParams.address,
        province: orderParams.province,
        district: orderParams.district,
        ward: orderParams.ward,
        street: orderParams.street,
        hamlet: orderParams.hamlet || 'Khác',
        
        // Payment & Value
        is_freeship: orderParams.is_freeship !== undefined ? orderParams.is_freeship : 1,
        pick_money: orderParams.pick_money || 0,
        value: orderParams.value || 0,
        
        // ✅ Tag 19: not_delivered_fee (0 < value <= 20,000,000)
        ...(orderParams.tags?.includes(19) && orderParams.not_delivered_fee ? {
          not_delivered_fee: orderParams.not_delivered_fee
        } : {}),
        
        // Shipping options
        note: orderParams.note || '',
        total_weight: totalWeightKg,
        total_box: orderParams.total_box,
        ...(orderParams.height ? { height: orderParams.height } : {}),
        ...(orderParams.width ? { width: orderParams.width } : {}),
        ...(orderParams.length ? { length: orderParams.length } : {}),
        transport: orderParams.transport || 'road',
        pick_option: orderParams.pick_option || 'post',
        pick_session: orderParams.pick_session || 0,
        
        // ✅ Dates & shifts
        pick_date: orderParams.pick_date,
        deliver_date: orderParams.deliver_date,
        pick_work_shift: orderParams.pick_work_shift,
        deliver_work_shift: orderParams.deliver_work_shift,
        
        // Tags
        tags: orderParams.tags || [],
        
        // ✅ CONDITIONAL RETURN ADDRESS
        ...(orderParams.return_name || orderParams.pick_name ? { 
          return_name: orderParams.return_name || orderParams.pick_name 
        } : {}),
        ...(orderParams.return_address || orderParams.pick_address ? { 
          return_address: orderParams.return_address || orderParams.pick_address 
        } : {}),
        ...(orderParams.return_province || orderParams.pick_province ? { 
          return_province: orderParams.return_province || orderParams.pick_province 
        } : {}),
        ...(orderParams.return_district || orderParams.pick_district ? { 
          return_district: orderParams.return_district || orderParams.pick_district 
        } : {}),
        ...(orderParams.return_ward || orderParams.pick_ward ? { 
          return_ward: orderParams.return_ward || orderParams.pick_ward 
        } : {}),
        ...(orderParams.return_tel || orderParams.pick_tel ? { 
          return_tel: orderParams.return_tel || orderParams.pick_tel 
        } : {}),
      }
    };


    const response = await fetchWithTimeout(`${GHTK_API_BASE}/services/shipment/order/?ver=1.5`, {
      method: 'POST',
      headers: {
        'Token': apiToken,
        'X-Client-Source': partnerCode || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    // Get response as text first
    const responseText = await response.text();
    
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      logError(`[GHTK-SUBMIT-${requestId}] JSON parse error`, null, {
        responsePreview: responseText.substring(0, 500)
      });
      
      return apiError('GHTK API returned invalid response', 500);
    }
    
    // ✅ If GHTK returns success: false, return error with message
    if (data.success === false) {
      logError(`[GHTK-SUBMIT-${requestId}] GHTK API error`, null, { message: data.message });
      return apiError(data.message || 'GHTK API error', 400);
    }
    
    const _duration = Date.now() - startTime;
    

    return apiSuccess(data);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`[GHTK-SUBMIT-${requestId}] ❌ Submit order error (${duration}ms)`, error);
    
    return apiError(error instanceof Error ? error.message : 'Unknown error', 500);
  }
}
