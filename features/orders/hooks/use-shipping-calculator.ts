/**
 * useShippingCalculator Hook
 * Calculate shipping fees from multiple partners in parallel
 */

import * as React from 'react';
import { loadShippingConfig } from '@/lib/utils/shipping-config-migration';
import { getBaseUrl } from '@/lib/api-config';
import type {
  ShippingCalculationRequest,
  ShippingCalculationResult,
  ShippingService,
} from '../components/shipping/types';

// Cache for shipping calculations (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
const calculationCache = new Map<string, { result: ShippingCalculationResult[]; timestamp: number }>();

function getCacheKey(request: ShippingCalculationRequest): string {
  return JSON.stringify({
    from: `${request.fromDistrictId}`,
    to: `${request.toDistrictId}`,
    // ✅ CRITICAL: Include province and ward for 2-level address support
    // Without these, 2-level addresses with districtId=0 would have same cache key
    toProvince: request.toProvince || '',
    toWard: request.toWard || request.toWardCode || '',
    weight: request.weight,
    cod: request.codAmount || 0,
    // ✅ CRITICAL: Include transport and orderValue in cache key
    // Different transport (road/fly) = different fees
    // Different orderValue = different insurance fees
    transport: request.options?.transport || 'road',
    orderValue: request.options?.orderValue || 0,
  });
}

export function useShippingCalculator() {
  const [results, setResults] = React.useState<ShippingCalculationResult[]>([]);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const requestIdRef = React.useRef<number>(0); // ✅ Track request ID

  const calculateFees = React.useCallback(async (request: ShippingCalculationRequest) => {
    // ✅ Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // ✅ Create new request ID
    const currentRequestId = ++requestIdRef.current;
    
    // ✅ Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    // ✅ Helper to check if this request should continue
    const shouldContinue = () => {
      if (currentRequestId !== requestIdRef.current) {
        return false;
      }
      if (abortController.signal.aborted) {
        return false;
      }
      return true;
    };
    
    const cacheKey = getCacheKey(request);
    
    // Check cache
    const cached = calculationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      // Check if request still valid before using cache
      if (!shouldContinue()) {
        throw new Error('REQUEST_CANCELLED');
      }
      
      setResults(cached.result);
      return cached.result;
    }

    setIsCalculating(true);

    // Load shipping config
    const config = loadShippingConfig();
    
    // Initialize results with loading state
    const partnerCodes = ['GHN', 'GHTK', 'VTP', 'J&T', 'SPX'] as const;
    const partnerNames = {
      'GHN': 'Giao Hàng Nhanh',
      'GHTK': 'Giao Hàng Tiết Kiệm',
      'VTP': 'Viettel Post',
      'J&T': 'J&T Express',
      'SPX': 'SPX Express',
    };

    const initialResults: ShippingCalculationResult[] = partnerCodes.map(code => ({
      partnerId: code,
      partnerCode: code,
      partnerName: partnerNames[code],
      accountSystemId: '',
      status: 'loading',
      services: [],
    }));

    setResults(initialResults);

    // Calculate fees in parallel
    const promises = partnerCodes.map(async (partnerCode) => {
      try {
        // ✅ V2: Get default account for partner
        const partnerData = config.partners[partnerCode];
        
        if (!partnerData || !partnerData.accounts || partnerData.accounts.length === 0) {
          // Return "not-configured" status
          return {
            partnerId: partnerCode,
            partnerCode,
            partnerName: partnerNames[partnerCode],
            accountSystemId: '',
            status: 'error' as const,
            services: [],
            error: 'NOT_CONFIGURED',
          };
        }

        // ✅ V2: Get default account (or first active account)
        const defaultAccount = partnerData.accounts.find(a => a.isDefault && a.active) 
          || partnerData.accounts.find(a => a.active)
          || partnerData.accounts[0];

        if (!defaultAccount || !defaultAccount.active) {
          return {
            partnerId: partnerCode,
            partnerCode,
            partnerName: partnerNames[partnerCode],
            accountSystemId: defaultAccount?.id || '',
            status: 'error' as const,
            services: [],
            error: 'NOT_CONFIGURED',
          };
        }

        // Call partner API based on type
        let services: ShippingService[] = [];

        switch (partnerCode) {
          case 'GHN': {
            // TEMPORARY: Mock data to avoid CORS error
            // TODO: Call via backend proxy server
            services = [{
              partnerId: partnerCode,
              partnerCode,
              partnerName: partnerNames[partnerCode],
              accountSystemId: 'default',
              serviceId: 'standard',
              serviceName: 'Giao hàng tiêu chuẩn',
              fee: 28000,
              estimatedDays: '2-3 ngày',
            }, {
              partnerId: partnerCode,
              partnerCode,
              partnerName: partnerNames[partnerCode],
              accountSystemId: 'default',
              serviceId: 'express',
              serviceName: 'Hỏa tốc',
              fee: 40000,
              estimatedDays: '1 ngày',
            }];
            break;
          }

          case 'GHTK': {
            // Call via backend proxy server
            try {
              const proxyUrl = getBaseUrl();
              const pickAddressId = request.fromWardCode || '';
              
              // ✅ FIX: Get API token from correct field (apiToken, not token)
              const apiToken = (defaultAccount.credentials as { apiToken?: string; partnerCode?: string }).apiToken || '';
              const partnerCodeStr = (defaultAccount.credentials as { apiToken?: string; partnerCode?: string }).partnerCode || 'GHTK';
              
              console.log('[ShippingCalculator] GHTK Request:', {
                hasApiToken: !!apiToken,
                partnerCode: partnerCodeStr,
                weight: request.weight,
                toProvince: request.toProvince,
                toDistrict: request.toDistrict,
                toWard: request.toWard || request.toWardCode,
                fromProvince: request.fromProvince,
                fromDistrict: request.fromDistrict,
              });
              
              if (!apiToken) {
                throw new Error('❌ Missing GHTK API Token. Vui lòng cấu hình token trong Settings > Shipping Partners > GHTK');
              }
              
              // ✅ GHTK minimum weight: 100g
              if (request.weight < 100) {
                throw new Error(`Khối lượng tối thiểu của GHTK là 100g. Hiện tại: ${request.weight}g`);
              }
              
              const requestBody: Record<string, unknown> = {
                apiToken: apiToken,
                partnerCode: partnerCodeStr,
                province: request.toProvince || '',
                district: request.toDistrict || '',
                ward: request.toWard || request.toWardCode || '', // ✅ Use ward name (2-level) or wardCode (3-level)
                address: request.toAddress,
                weight: request.weight, // ✅ Send as GRAMS (GHTK API expects grams, not kg)
                value: request.options?.orderValue || 0, // ✅ IMPORTANT: Giá trị hàng hóa (để tính phí bảo hiểm), KHÔNG phải COD
              };
              
              
              // Include service options for accurate pricing
              if (request.options) {
                // ✅ GHTK API accepts 'transport' parameter directly
                // - 'road' = Đường bộ
                // - 'fly' = Đường bay
                if (request.options.transport) {
                  requestBody.transport = request.options.transport;
                }
                // ❌ TAGS NOT SUPPORTED in calculate fee API (only for order creation)
                // if (request.options.tags && request.options.tags.length > 0) {
                //   requestBody.tags = request.options.tags;
                // }
                if (request.options.deliverWorkShift) {
                  requestBody.deliver_work_shift = request.options.deliverWorkShift;
                }
                if (request.options.pickAddressId) {
                  requestBody.pick_address_id = request.options.pickAddressId;
                }
              }
              
              // Always send pick_province and pick_district
              if (pickAddressId) {
                requestBody.pick_address_id = pickAddressId;
                requestBody.pick_province = request.fromProvince || '';
                requestBody.pick_district = request.fromDistrict || '';
              } else {
                requestBody.pick_province = request.fromProvince || '';
                requestBody.pick_district = request.fromDistrict || '';
              }
              
              const response = await fetch(`${proxyUrl}/api/shipping/ghtk/calculate-fee`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                signal: abortController.signal,
              });
              
              // ✅ Check if request is still valid before processing response
              if (!shouldContinue()) {
                throw new Error('REQUEST_CANCELLED');
              }

              const fees = await response.json();
              
              console.log('[ShippingCalculator] GHTK API Response:', {
                success: fees.success,
                hasFee: !!fees.fee,
                message: fees.message,
                fee: fees.fee,
              });
              
              // ✅ Check again after async operation
              if (!shouldContinue()) {
                throw new Error('REQUEST_CANCELLED');
              }
              
              if (fees.success && fees.fee) {
                const feeData = fees.fee;
                const standardFee = feeData.fee || 0;
                const _insuranceFee = feeData.insurance_fee || 0;
                const deliveryType = feeData.delivery_type || '';
                
                // Xác định tên gói cước dựa trên delivery_type
                let standardServiceName = 'Giao hàng tiêu chuẩn';
                let expressServiceName = 'Giao hàng nhanh';
                
                const deliveryTypeLower = deliveryType.toLowerCase();
                
                if (deliveryTypeLower.includes('bbs') || deliveryTypeLower.includes('hangnang') || deliveryTypeLower.includes('(10-20kg)') || deliveryTypeLower.includes('(20-')) {
                  standardServiceName = 'Hàng nặng BBS';
                  expressServiceName = 'BBS Nhanh';
                } else if (deliveryTypeLower.includes('tietkiem') || deliveryTypeLower.includes('pd-')) {
                  standardServiceName = 'Gói tiết kiệm';
                  expressServiceName = 'Tiết kiệm nhanh';
                }
                
                // Express fee = standard + 40%
                const expressFee = Math.round(standardFee * 1.4);
                
                services = [{
                  partnerId: partnerCode,
                  partnerCode,
                  partnerName: partnerNames[partnerCode],
                  accountSystemId: defaultAccount.id,
                  serviceId: 'standard',
                  serviceName: standardServiceName,
                  fee: standardFee,
                  estimatedDays: '1-2 ngày',
                }, {
                  partnerId: partnerCode,
                  partnerCode,
                  partnerName: partnerNames[partnerCode],
                  accountSystemId: defaultAccount.id,
                  serviceId: 'express',
                  serviceName: expressServiceName,
                  fee: expressFee,
                  estimatedDays: '0-1 ngày',
                }];
              } else {
                const errorMsg = fees.message || 'GHTK API Error';
                console.error('[ShippingCalculator] GHTK API Error:', errorMsg, fees);
                throw new Error(errorMsg);
              }
            } catch (error) {
              // ✅ Ignore AbortError - request was cancelled
              if (error instanceof Error && error.name === 'AbortError') {
                // Return empty result instead of throwing
                services = [];
                break;
              }
              
              console.error('[ShippingCalculator] GHTK Error caught:', error);
              
              // Fallback to mock data
              services = [{
                partnerId: partnerCode,
                partnerCode,
                partnerName: partnerNames[partnerCode],
                accountSystemId: defaultAccount.id,
                serviceId: 'standard',
                serviceName: 'Giao hàng tiêu chuẩn',
                fee: 25000,
                estimatedDays: '1-2 ngày',
              }];
            }
            
            break;
          }

          case 'VTP': {
            // Mock VTP for now
            services = [{
              partnerId: partnerCode,
              partnerCode,
              partnerName: partnerNames[partnerCode],
              accountSystemId: defaultAccount.id,
              serviceId: 'standard',
              serviceName: 'Tiêu chuẩn',
              fee: 30000,
              estimatedDays: '2-3 ngày',
            }];
            break;
          }

          case 'J&T': {
            // Mock J&T for now
            services = [{
              partnerId: partnerCode,
              partnerCode,
              partnerName: partnerNames[partnerCode],
              accountSystemId: defaultAccount.id,
              serviceId: 'standard',
              serviceName: 'Tiêu chuẩn',
              fee: 26000,
              estimatedDays: '2-4 ngày',
            }];
            break;
          }

          case 'SPX': {
            // Mock SPX for now
            services = [{
              partnerId: partnerCode,
              partnerCode,
              partnerName: partnerNames[partnerCode],
              accountSystemId: defaultAccount.id,
              serviceId: 'standard',
              serviceName: 'Tiêu chuẩn',
              fee: 28000,
              estimatedDays: '2-3 ngày',
            }];
            break;
          }

          default:
            return {
              partnerId: partnerCode,
              partnerCode,
              partnerName: partnerNames[partnerCode],
              accountSystemId: '',
              status: 'error' as const,
              services: [],
              error: 'Partner không được hỗ trợ',
            };
        }

        return {
          partnerId: partnerCode,
          partnerCode,
          partnerName: partnerNames[partnerCode],
          accountSystemId: defaultAccount.id,
          status: 'success' as const,
          services,
        };
      } catch (error) {
        return {
          partnerId: partnerCode,
          partnerCode,
          partnerName: partnerNames[partnerCode],
          accountSystemId: '',
          status: 'error' as const,
          services: [],
          error: error instanceof Error ? error.message : 'Không thể tính phí',
        };
      }
    });

    const calculatedResults = await Promise.allSettled(promises);
    
    // ✅ Final check: Only update state if this is still the latest request
    if (!shouldContinue()) {
      setIsCalculating(false);
      return []; // Don't update state
    }
    
    const finalResults: ShippingCalculationResult[] = calculatedResults
      .map((result, index) => {
        // ✅ Handle fulfilled promises
        if (result.status === 'fulfilled' && result.value) {
          return result.value;
        }
        
        // ✅ Handle rejected or aborted promises
        return {
          partnerId: partnerCodes[index],
          partnerCode: partnerCodes[index],
          partnerName: partnerNames[partnerCodes[index]],
          accountSystemId: '',
          status: 'error' as const,
          services: [],
          error: result.status === 'rejected' ? (result.reason?.message || 'Lỗi kết nối') : 'Request cancelled',
        } as ShippingCalculationResult;
      })
      .filter((result): result is ShippingCalculationResult => result !== null && result.status !== undefined); // ✅ Filter out nulls

    // Update cache
    calculationCache.set(cacheKey, {
      result: finalResults,
      timestamp: Date.now(),
    });

    setResults(finalResults);
    setIsCalculating(false);

    return finalResults;
  }, []);

  const clearCache = React.useCallback(() => {
    calculationCache.clear();
  }, []);

  return {
    results,
    isCalculating,
    calculateFees,
    clearCache,
  };
}
