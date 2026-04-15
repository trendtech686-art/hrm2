/**
 * Shipping Config API
 * Stores shipping partners configuration
 * 
 * NOTE: Now reads from ShippingPartner table (new system) 
 * and converts to the old format for backward compatibility
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const SETTING_KEY = 'shipping_partners_config'
const GROUP = 'shipping'

const DEFAULT_CONFIG = {
  version: 2,
  partners: {
    GHN: { accounts: [] },
    GHTK: { accounts: [] },
    VTP: { accounts: [] },
    'J&T': { accounts: [] },
    SPX: { accounts: [] },
  },
  global: {
    weight: { mode: 'FROM_PRODUCTS', customValue: 500 },
    dimensions: { length: 30, width: 20, height: 10 },
    requirement: 'ALLOW_CHECK_NOT_TRY',
    note: '',
    autoSyncCancelStatus: false,
    autoSyncCODCollection: false,
    autoCreateReconciliationSheet: false,
    latePickupWarningDays: 2,
    lateDeliveryWarningDays: 7,
    productSendMode: 'all',
  },
  lastUpdated: new Date().toISOString(),
}

// Helper: Convert ShippingPartner to old format account
function convertPartnerToAccounts(partner: {
  code: string;
  configuration: unknown;
  isActive?: boolean;
}): { accounts: Array<Record<string, unknown>> } {
  const config = partner.configuration as Record<string, unknown> | null;
  if (!config) return { accounts: [] };

  // Check if config has accounts array (new multi-account format)
  const rawAccounts = config.accounts as Array<Record<string, unknown>> | undefined;
  
  if (rawAccounts && Array.isArray(rawAccounts)) {
    // Map accounts to old format
    const accounts = rawAccounts.map((acc, idx) => ({
      id: acc.id || `${partner.code}_${idx + 1}`,
      name: acc.name || `Tài khoản ${partner.code} ${idx + 1}`,
      active: acc.isActive ?? true,
      isDefault: acc.isDefault ?? idx === 0,
      credentials: {
        apiToken: acc.apiToken,
        partnerCode: acc.partnerCode,
      },
      pickupAddresses: acc.pickupAddresses || [],
      defaultSettings: acc.defaultSettings || {},
    }));
    return { accounts };
  }

  // Single account format (old format in configuration)
  if (config.apiToken) {
    return {
      accounts: [{
        id: `${partner.code}_1`,
        name: config.name || `Tài khoản ${partner.code}`,
        active: partner.isActive ?? true,
        isDefault: true,
        credentials: {
          apiToken: config.apiToken,
          partnerCode: config.partnerCode,
        },
        pickupAddresses: config.pickupAddresses || [],
        defaultSettings: config.defaultSettings || {},
      }]
    };
  }

  return { accounts: [] };
}

// GET /api/shipping-config
export async function GET(_request: Request) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    // ✅ Read from ShippingPartner table first (new system)
    const shippingPartners = await prisma.shippingPartner.findMany({
      where: { isActive: true },
    });

    if (shippingPartners.length > 0) {
      // Convert to old format
      const partners: Record<string, { accounts: Array<Record<string, unknown>> }> = {
        GHN: { accounts: [] },
        GHTK: { accounts: [] },
        VTP: { accounts: [] },
        'J&T': { accounts: [] },
        SPX: { accounts: [] },
      };

      for (const partner of shippingPartners) {
        const code = partner.code;
        if (code in partners) {
          partners[code] = convertPartnerToAccounts(partner);
        }
      }

      // Also check for global settings in the Setting table
      const globalSetting = await prisma.setting.findUnique({
        where: {
          key_group: {
            key: 'shipping_global_config',
            group: GROUP,
          }
        }
      });

      // ✅ Merge DB global with defaults to ensure new fields have fallback values
      const dbGlobal = (globalSetting?.value as Record<string, unknown>) || {};
      const mergedGlobal = { ...DEFAULT_CONFIG.global, ...dbGlobal };

      return apiSuccess({
        version: 2,
        partners,
        global: mergedGlobal,
        lastUpdated: new Date().toISOString(),
      });
    }

    // Fallback: Try old Setting table
    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: GROUP,
        }
      }
    })

    if (!setting) {
      return apiSuccess(DEFAULT_CONFIG)
    }

    return apiSuccess(setting.value)
  } catch (error) {
    logError('[SHIPPING-CONFIG] GET error', error)
    return apiError('Internal server error', 500)
  }
}

// POST /api/shipping-config
export async function POST(request: Request) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const config = await request.json()
    
    if (!config) {
      return apiError('Config is required', 400)
    }

    // Read old configs for change tracking
    const oldGlobalSetting = await prisma.setting.findUnique({
      where: { key_group: { key: 'shipping_global_config', group: GROUP } },
    });
    const oldGlobal = (oldGlobalSetting?.value as Record<string, unknown>) || {};

    const oldSetting = await prisma.setting.findUnique({
      where: { key_group: { key: SETTING_KEY, group: GROUP } },
    });

    // Update lastUpdated
    config.lastUpdated = new Date().toISOString()

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: GROUP,
        }
      },
      update: {
        value: config,
        updatedAt: new Date(),
      },
      create: {
        key: SETTING_KEY,
        value: config,
        type: 'shipping',
        group: GROUP,
        category: 'system',
        description: 'Shipping partners configuration',
      }
    })

    // ✅ Also save global config separately so GET can read it from the correct key
    if (config.global) {
      await prisma.setting.upsert({
        where: {
          key_group: {
            key: 'shipping_global_config',
            group: GROUP,
          }
        },
        update: {
          value: config.global,
          updatedAt: new Date(),
        },
        create: {
          key: 'shipping_global_config',
          value: config.global,
          type: 'shipping',
          group: GROUP,
          category: 'system',
          description: 'Shipping global configuration',
        }
      })
    }

    // Log activity with detailed changes
    if (config.global) {
      const FIELD_LABELS: Record<string, string> = {
        weight: 'Cân nặng',
        dimensions: 'Kích thước',
        requirement: 'Yêu cầu giao hàng',
        note: 'Ghi chú',
        autoSyncCancelStatus: 'Tự động đồng bộ huỷ',
        autoSyncCODCollection: 'Tự động đồng bộ COD',
        autoCreateReconciliationSheet: 'Tự động tạo phiếu đối soát',
        latePickupWarningDays: 'Cảnh báo chậm lấy hàng (ngày)',
        lateDeliveryWarningDays: 'Cảnh báo chậm giao hàng (ngày)',
        productSendMode: 'Gửi sản phẩm qua API',
      }
      const newGlobal = config.global as Record<string, unknown>;
      const changes: Record<string, { from: unknown; to: unknown }> = {};
      const allKeys = new Set([...Object.keys(oldGlobal), ...Object.keys(newGlobal)]);
      for (const key of allKeys) {
        const oldVal = oldGlobal[key];
        const newVal = newGlobal[key];
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          const label = FIELD_LABELS[key] || key;
          changes[label] = { from: oldVal ?? null, to: newVal ?? null };
        }
      }

      if (Object.keys(changes).length > 0) {
        const changeDetail = Object.keys(changes).join(', ')
        createActivityLog({
          entityType: 'shipping_config',
          entityId: 'shipping_global_config',
          action: `Cập nhật cấu hình vận chuyển: ${changeDetail}`,
          actionType: 'update',
          changes,
          createdBy: session?.user.id ?? '',
        }).catch(e => logError('[SHIPPING-CONFIG] activity log failed', e));
      }
    }

    // Log activity for partner account changes
    if (config.partners) {
      const oldPartners = (oldSetting?.value as Record<string, unknown>)?.partners as Record<string, { accounts: Array<Record<string, unknown>> }> | undefined;
      const newPartners = config.partners as Record<string, { accounts: Array<Record<string, unknown>> }>;
      
      for (const [code, partnerData] of Object.entries(newPartners)) {
        const oldAccounts = oldPartners?.[code]?.accounts || [];
        const newAccounts = partnerData?.accounts || [];
        
        // Detect added accounts
        for (const newAcc of newAccounts) {
          if (!oldAccounts.find((o: Record<string, unknown>) => o.id === newAcc.id)) {
            createActivityLog({
              entityType: 'shipping_config',
              entityId: String(newAcc.id),
              action: `Thêm tài khoản ${code}: ${newAcc.name || 'N/A'}`,
              actionType: 'create',
              changes: { account: { from: null, to: newAcc.name } },
              createdBy: session?.user.id ?? '',
            }).catch(e => logError('[SHIPPING-CONFIG] activity log failed', e));
          }
        }
        
        // Detect deleted accounts
        for (const oldAcc of oldAccounts) {
          if (!newAccounts.find((n: Record<string, unknown>) => n.id === oldAcc.id)) {
            createActivityLog({
              entityType: 'shipping_config',
              entityId: String(oldAcc.id),
              action: `Xóa tài khoản ${code}: ${oldAcc.name || 'N/A'}`,
              actionType: 'delete',
              changes: { account: { from: oldAcc.name, to: null } },
              createdBy: session?.user.id ?? '',
            }).catch(e => logError('[SHIPPING-CONFIG] activity log failed', e));
          }
        }
      }
    }

    return apiSuccess({ success: true, lastUpdated: config.lastUpdated })
  } catch (error) {
    logError('[SHIPPING-CONFIG] POST error', error)
    return apiError('Internal server error', 500)
  }
}
