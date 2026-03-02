/**
 * Shipping Config API
 * Stores shipping partners configuration
 * 
 * NOTE: Now reads from ShippingPartner table (new system) 
 * and converts to the old format for backward compatibility
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

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
    VNPOST: { accounts: [] },
    NINJA_VAN: { accounts: [] },
    AHAMOVE: { accounts: [] },
  },
  global: {
    weight: { mode: 'FROM_PRODUCTS', customValue: 500 },
    dimensions: { length: 30, width: 20, height: 10 },
    requirement: 'ALLOW_CHECK_NOT_TRY',
    note: '',
    autoSyncCancelStatus: false,
    autoSyncCODCollection: false,
    latePickupWarningDays: 2,
    lateDeliveryWarningDays: 7,
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
        VNPOST: { accounts: [] },
        NINJA_VAN: { accounts: [] },
        AHAMOVE: { accounts: [] },
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

      return apiSuccess({
        version: 2,
        partners,
        global: (globalSetting?.value as Record<string, unknown>) || DEFAULT_CONFIG.global,
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
    console.error('[SHIPPING-CONFIG] GET error:', error)
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

    return apiSuccess({ success: true, lastUpdated: config.lastUpdated })
  } catch (error) {
    console.error('[SHIPPING-CONFIG] POST error:', error)
    return apiError('Internal server error', 500)
  }
}
