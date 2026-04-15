/**
 * VTP Create Order API Proxy
 * POST /api/shipping/vtp/create-order
 * 
 * VTP Create Order (NLP): POST /v2/order/createOrderNlp
 * Sử dụng NLP để tự động nhận diện và chuẩn hóa địa chỉ từ string
 * Auth: Token header
 */

import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const body = await request.json();
    const { token, environment, orderData } = body;

    if (!token) {
      return apiError('Token là bắt buộc', 400);
    }

    if (!orderData) {
      return apiError('Dữ liệu đơn hàng là bắt buộc', 400);
    }

    const baseUrl = environment === 'staging'
      ? 'https://partnerdev.viettelpost.vn/v2'
      : 'https://partner.viettelpost.vn/v2';

    const response = await fetchWithTimeout(`${baseUrl}/order/createOrderNlp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Token': token,
      },
      body: JSON.stringify(orderData),
      timeoutMs: 30_000,
    });

    const data = await response.json();

    if (data.status === 200 && !data.error) {
      return apiSuccess({
        success: true,
        message: 'Tạo đơn Viettel Post thành công',
        data: {
          orderNumber: data.data?.ORDER_NUMBER,
          moneyTotal: data.data?.MONEY_TOTAL,
          moneyTotalFee: data.data?.MONEY_TOTAL_FEE,
          moneyCollection: data.data?.MONEY_COLLECTION,
          kpiHt: data.data?.KPI_HT,
          exchangeWeight: data.data?.EXCHANGE_WEIGHT,
        },
      });
    } else {
      return apiError(
        data.message || 'Tạo đơn Viettel Post thất bại',
        400
      );
    }
  } catch (error) {
    logError('[VTP-CREATE] ❌ Error', error);
    return apiError(
      'Lỗi tạo đơn: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
}
