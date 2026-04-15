/**
 * VTP Calculate Fee API Proxy
 * POST /api/shipping/vtp/calculate-fee
 * 
 * VTP Fee (NLP): POST /v2/order/getPriceNlp
 * Sử dụng NLP để tính cước từ địa chỉ string
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
    const { token, environment, feeData } = body;

    if (!token) {
      return apiError('Token là bắt buộc', 400);
    }

    if (!feeData) {
      return apiError('Dữ liệu tính phí là bắt buộc', 400);
    }

    const baseUrl = environment === 'staging'
      ? 'https://partnerdev.viettelpost.vn/v2'
      : 'https://partner.viettelpost.vn/v2';

    const response = await fetchWithTimeout(`${baseUrl}/order/getPriceNlp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Token': token,
      },
      body: JSON.stringify(feeData),
    });

    const data = await response.json();

    if (data.status === 200 && !data.error) {
      return apiSuccess({
        success: true,
        data: {
          moneyTotal: data.data?.MONEY_TOTAL,
          moneyTotalFee: data.data?.MONEY_TOTAL_FEE,
          moneyFee: data.data?.MONEY_FEE,
          moneyCollectionFee: data.data?.MONEY_COLLECTION_FEE,
          moneyOtherFee: data.data?.MONEY_OTHER_FEE,
          moneyVas: data.data?.MONEY_VAS,
          moneyVat: data.data?.MONEY_VAT,
          kpiHt: data.data?.KPI_HT,
          exchangeWeight: data.data?.EXCHANGE_WEIGHT,
        },
      });
    } else {
      return apiError(
        data.message || 'Tính phí Viettel Post thất bại',
        400
      );
    }
  } catch (error) {
    logError('[VTP-FEE] ❌ Error', error);
    return apiError(
      'Lỗi tính phí: ' + (error instanceof Error ? error.message : 'Unknown error'),
      500
    );
  }
}
