(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils/shipping-config-migration.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shipping Configuration Migration - V2 Multi-Account Structure
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */ __turbopack_context__.s([
    "addPartnerAccount",
    ()=>addPartnerAccount,
    "deletePartnerAccount",
    ()=>deletePartnerAccount,
    "exportShippingConfig",
    ()=>exportShippingConfig,
    "getDefaultAccount",
    ()=>getDefaultAccount,
    "getDefaultShippingConfig",
    ()=>getDefaultShippingConfig,
    "getPartnerAccounts",
    ()=>getPartnerAccounts,
    "importShippingConfig",
    ()=>importShippingConfig,
    "loadShippingConfig",
    ()=>loadShippingConfig,
    "loadShippingConfigAsync",
    ()=>loadShippingConfigAsync,
    "saveShippingConfig",
    ()=>saveShippingConfig,
    "setDefaultAccount",
    ()=>setDefaultAccount,
    "updateGlobalConfig",
    ()=>updateGlobalConfig,
    "updatePartnerAccount",
    ()=>updatePartnerAccount
]);
// In-memory cache
let configCache = null;
/**
 * Get default global config
 */ function getDefaultGlobalConfig() {
    return {
        weight: {
            mode: 'FROM_PRODUCTS',
            customValue: 500
        },
        dimensions: {
            length: 30,
            width: 20,
            height: 10
        },
        requirement: 'ALLOW_CHECK_NOT_TRY',
        note: '',
        autoSyncCancelStatus: false,
        autoSyncCODCollection: false,
        latePickupWarningDays: 2,
        lateDeliveryWarningDays: 7
    };
}
function getDefaultShippingConfig() {
    return {
        version: 2,
        partners: {
            GHN: {
                accounts: []
            },
            GHTK: {
                accounts: []
            },
            VTP: {
                accounts: []
            },
            'J&T': {
                accounts: []
            },
            SPX: {
                accounts: []
            },
            VNPOST: {
                accounts: []
            },
            NINJA_VAN: {
                accounts: []
            },
            AHAMOVE: {
                accounts: []
            }
        },
        global: getDefaultGlobalConfig(),
        lastUpdated: new Date().toISOString()
    };
}
async function loadShippingConfigAsync() {
    try {
        const response = await fetch('/api/shipping-config');
        if (!response.ok) throw new Error('Failed to fetch');
        const config = await response.json();
        configCache = config;
        return config;
    } catch (error) {
        console.error('[ShippingConfig] Failed to load from database:', error);
        // Return cached or default
        return configCache ?? getDefaultShippingConfig();
    }
}
function loadShippingConfig() {
    // Return cache if available
    if (configCache) return configCache;
    // Return default - async load should be triggered on app init
    return getDefaultShippingConfig();
}
function saveShippingConfig(config) {
    config.lastUpdated = new Date().toISOString();
    // Update cache
    configCache = config;
    // Save to database
    fetch('/api/shipping-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    }).then((response)=>{
        if (response.ok) {
            console.log('✅ Shipping config saved to database');
        } else {
            console.warn('⚠️ Failed to save shipping config to database');
        }
    }).catch((error)=>{
        console.error('❌ Error saving shipping config to database:', error);
    });
}
function getPartnerAccounts(config, partnerCode) {
    return config.partners[partnerCode]?.accounts || [];
}
function getDefaultAccount(config, partnerCode) {
    const accounts = getPartnerAccounts(config, partnerCode);
    const defaultAcc = accounts.find((acc)=>acc.isDefault && acc.active);
    if (defaultAcc) return defaultAcc;
    // Return first active account if no default
    return accounts.find((acc)=>acc.active) || null;
}
function addPartnerAccount(config, partnerCode, account) {
    const newAccount = {
        ...account,
        id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    config.partners[partnerCode].accounts.push(newAccount);
    saveShippingConfig(config);
    return config;
}
function updatePartnerAccount(config, partnerCode, accountId, updates) {
    const accounts = config.partners[partnerCode].accounts;
    const index = accounts.findIndex((acc)=>acc.id === accountId);
    if (index !== -1) {
        accounts[index] = {
            ...accounts[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        saveShippingConfig(config);
    }
    return config;
}
function deletePartnerAccount(config, partnerCode, accountId) {
    const accounts = config.partners[partnerCode].accounts;
    const account = accounts.find((acc)=>acc.id === accountId);
    // Remove the account
    config.partners[partnerCode].accounts = accounts.filter((acc)=>acc.id !== accountId);
    // Set a new default if we deleted the default account
    if (account?.isDefault && config.partners[partnerCode].accounts.length > 0) {
        config.partners[partnerCode].accounts[0].isDefault = true;
    }
    saveShippingConfig(config);
    return config;
}
function setDefaultAccount(config, partnerCode, accountId) {
    const accounts = config.partners[partnerCode].accounts;
    // Remove default from all accounts
    accounts.forEach((acc)=>{
        acc.isDefault = false;
    });
    // Set new default
    const account = accounts.find((acc)=>acc.id === accountId);
    if (account) {
        account.isDefault = true;
        account.updatedAt = new Date().toISOString();
    }
    saveShippingConfig(config);
    return config;
}
function updateGlobalConfig(config, updates) {
    config.global = {
        ...config.global,
        ...updates
    };
    saveShippingConfig(config);
    return config;
}
function exportShippingConfig() {
    const config = loadShippingConfig();
    return JSON.stringify(config, null, 2);
}
function importShippingConfig(jsonString) {
    try {
        const config = JSON.parse(jsonString);
        if (config.version !== 2) {
            throw new Error('Invalid config version');
        }
        saveShippingConfig(config);
        return config;
    } catch (error) {
        console.error('Import failed:', error);
        throw error;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils/get-shipping-credentials.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getActivePartners",
    ()=>getActivePartners,
    "getGHNCredentials",
    ()=>getGHNCredentials,
    "getGHTKCredentials",
    ()=>getGHTKCredentials,
    "hasActiveAccount",
    ()=>hasActiveAccount
]);
/**
 * Helper functions to get shipping partner credentials
 * Centralized source from shipping_partners_config (localStorage)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/shipping-config-migration.ts [app-client] (ecmascript)");
;
function getGHTKCredentials() {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadShippingConfig"])();
    const accounts = config.partners.GHTK.accounts;
    // Find default active account first, then any active account
    const activeAccount = accounts.find((a)=>a.isDefault && a.active) || accounts.find((a)=>a.active);
    if (!activeAccount) {
        throw new Error('Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.');
    }
    if (!activeAccount.credentials?.apiToken) {
        throw new Error('Tài khoản GHTK chưa có API Token. Vui lòng cấu hình lại.');
    }
    return {
        apiToken: activeAccount.credentials.apiToken,
        partnerCode: activeAccount.credentials.partnerCode || '',
        account: activeAccount
    };
}
function getGHNCredentials() {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadShippingConfig"])();
    const accounts = config.partners.GHN.accounts;
    const activeAccount = accounts.find((a)=>a.isDefault && a.active) || accounts.find((a)=>a.active);
    if (!activeAccount) {
        throw new Error('Chưa cấu hình GHN. Vui lòng vào Cài đặt → Đối tác vận chuyển.');
    }
    if (!activeAccount.credentials?.apiToken) {
        throw new Error('Tài khoản GHN chưa có API Token. Vui lòng cấu hình lại.');
    }
    return {
        apiToken: activeAccount.credentials.apiToken,
        partnerCode: activeAccount.credentials.partnerCode || '',
        account: activeAccount
    };
}
function hasActiveAccount(partnerCode) {
    try {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadShippingConfig"])();
        const accounts = config.partners[partnerCode].accounts;
        return accounts.some((a)=>a.active);
    } catch  {
        return false;
    }
}
function getActivePartners() {
    const partners = [
        'GHTK',
        'GHN',
        'VTP',
        'J&T',
        'SPX'
    ];
    return partners.filter((p)=>hasActiveAccount(p));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_utils_c48d7b20._.js.map