(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/settings/appearance/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getInitialAppearanceState",
    ()=>getInitialAppearanceState,
    "useAppearanceStore",
    ()=>useAppearanceStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const defaultCustomTheme = {
    '--background': 'oklch(1 0 0)',
    '--foreground': 'oklch(0.129 0.042 264.695)',
    '--card': 'oklch(1 0 0)',
    '--card-foreground': 'oklch(0.129 0.042 264.695)',
    '--popover': 'oklch(1 0 0)',
    '--popover-foreground': 'oklch(0.129 0.042 264.695)',
    '--primary': 'oklch(0.208 0.042 265.755)',
    '--primary-foreground': 'oklch(0.984 0.003 247.858)',
    '--secondary': 'oklch(0.968 0.007 247.896)',
    '--secondary-foreground': 'oklch(0.208 0.042 265.755)',
    '--muted': 'oklch(0.968 0.007 247.896)',
    '--muted-foreground': 'oklch(0.554 0.046 257.417)',
    '--accent': 'oklch(0.968 0.007 247.896)',
    '--accent-foreground': 'oklch(0.208 0.042 265.755)',
    '--destructive': 'oklch(0.577 0.245 27.325)',
    '--destructive-foreground': 'oklch(0.985 0 0)',
    '--border': 'oklch(0.929 0.013 255.508)',
    '--input': 'oklch(0.929 0.013 255.508)',
    '--ring': 'oklch(0.704 0.04 256.788)',
    '--radius': '0.625rem',
    '--font-sans': 'Inter',
    '--font-serif': 'Source Serif 4',
    '--font-mono': 'Geist Mono',
    '--shadow-x': '0px',
    '--shadow-y': '1px',
    '--shadow-blur': '2px',
    '--shadow-spread': '0px',
    '--shadow-color': 'hsl(0 0% 0% / 0.05)',
    '--chart-1': 'oklch(0.646 0.222 41.116)',
    '--chart-2': 'oklch(0.6 0.118 184.704)',
    '--chart-3': 'oklch(0.398 0.07 227.392)',
    '--chart-4': 'oklch(0.828 0.189 84.429)',
    '--chart-5': 'oklch(0.769 0.188 70.08)',
    '--sidebar': 'oklch(0.984 0.003 247.858)',
    '--sidebar-foreground': 'oklch(0.129 0.042 264.695)',
    '--sidebar-primary': 'oklch(0.208 0.042 265.755)',
    '--sidebar-primary-foreground': 'oklch(0.984 0.003 247.858)',
    '--sidebar-accent': 'oklch(0.968 0.007 247.896)',
    '--sidebar-accent-foreground': 'oklch(0.208 0.042 265.755)',
    '--sidebar-border': 'oklch(0.929 0.013 255.508)',
    '--sidebar-ring': 'oklch(0.704 0.04 256.788)',
    // Default heading sizes
    '--font-size-h1': '2.25rem',
    '--font-size-h2': '1.875rem',
    '--font-size-h3': '1.5rem',
    '--font-size-h4': '1.25rem',
    '--font-size-h5': '1.125rem',
    '--font-size-h6': '1rem'
};
// API sync helper
async function syncAppearanceToAPI(settings) {
    try {
        const response = await fetch('/api/user-preferences/appearance', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(settings)
        });
        return response.ok;
    } catch (error) {
        console.error('[Appearance API] sync error:', error);
        return false;
    }
}
const useAppearanceStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        theme: 'slate',
        colorMode: 'light',
        font: 'inter',
        fontSize: 'base',
        customThemeConfig: defaultCustomTheme,
        initialized: false,
        setTheme: (theme)=>{
            set({
                theme
            });
            syncAppearanceToAPI({
                theme
            }).catch(console.error);
        },
        setColorMode: (colorMode)=>{
            set({
                colorMode
            });
            syncAppearanceToAPI({
                colorMode
            }).catch(console.error);
        },
        setFont: (font)=>{
            set({
                font
            });
            syncAppearanceToAPI({
                font
            }).catch(console.error);
        },
        setFontSize: (size)=>{
            set({
                fontSize: size
            });
            syncAppearanceToAPI({
                fontSize: size
            }).catch(console.error);
        },
        setCustomThemeConfig: (config)=>{
            set({
                customThemeConfig: {
                    ...config
                }
            });
            syncAppearanceToAPI({
                customThemeConfig: config
            }).catch(console.error);
        },
        updateAppearance: (settings)=>{
            set((state)=>({
                    ...state,
                    ...settings
                }));
            syncAppearanceToAPI(settings).catch(console.error);
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/user-preferences/appearance', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || json;
                    if (data && Object.keys(data).length > 0) {
                        set({
                            ...data,
                            initialized: true,
                            customThemeConfig: data.customThemeConfig || defaultCustomTheme
                        });
                    } else {
                        set({
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('[Appearance Store] loadFromAPI error:', error);
            }
        }
    }));
function getInitialAppearanceState() {
    try {
        const stored = localStorage.getItem('hrm-appearance-storage');
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.state;
        }
    } catch  {
    // ignore
    }
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/appearance/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function applyTheme(customThemeConfig, colorMode, fontSize) {
    const root = window.document.documentElement;
    console.log('[ThemeProvider] Applying theme:', {
        colorMode,
        fontSize,
        primary: customThemeConfig['--primary']
    });
    // Color Mode
    root.classList.remove('light', 'dark');
    root.classList.add(colorMode);
    // Font Size
    root.classList.remove('font-size-sm', 'font-size-base', 'font-size-lg');
    root.classList.add(`font-size-${fontSize}`);
    // Apply CSS variables directly to root element for highest specificity
    const cssVars = [
        '--background',
        '--foreground',
        '--card',
        '--card-foreground',
        '--popover',
        '--popover-foreground',
        '--primary',
        '--primary-foreground',
        '--secondary',
        '--secondary-foreground',
        '--muted',
        '--muted-foreground',
        '--accent',
        '--accent-foreground',
        '--destructive',
        '--destructive-foreground',
        '--border',
        '--input',
        '--ring',
        '--chart-1',
        '--chart-2',
        '--chart-3',
        '--chart-4',
        '--chart-5',
        '--sidebar',
        '--sidebar-foreground',
        '--sidebar-primary',
        '--sidebar-primary-foreground',
        '--sidebar-accent',
        '--sidebar-accent-foreground',
        '--sidebar-border',
        '--sidebar-ring',
        '--radius',
        '--font-sans',
        '--font-serif',
        '--font-mono',
        '--font-size-h1',
        '--font-size-h2',
        '--font-size-h3',
        '--font-size-h4',
        '--font-size-h5',
        '--font-size-h6'
    ];
    cssVars.forEach((varName)=>{
        const value = customThemeConfig[varName];
        if (value) root.style.setProperty(varName, value);
    });
    // Shadow
    const shadow = `${customThemeConfig['--shadow-x'] || '0px'} ${customThemeConfig['--shadow-y'] || '1px'} ${customThemeConfig['--shadow-blur'] || '2px'} ${customThemeConfig['--shadow-spread'] || '0px'} ${customThemeConfig['--shadow-color'] || 'hsl(0 0% 0% / 0.05)'}`;
    root.style.setProperty('--shadow', shadow);
    // Force browser to recalculate styles by triggering a reflow
    root.style.display = 'none';
    void root.offsetHeight; // Force reflow
    root.style.display = '';
}
function ThemeProvider({ children }) {
    _s();
    const customThemeConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppearanceStore"])({
        "ThemeProvider.useAppearanceStore[customThemeConfig]": (s)=>s.customThemeConfig
    }["ThemeProvider.useAppearanceStore[customThemeConfig]"]);
    const colorMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppearanceStore"])({
        "ThemeProvider.useAppearanceStore[colorMode]": (s)=>s.colorMode
    }["ThemeProvider.useAppearanceStore[colorMode]"]);
    const fontSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppearanceStore"])({
        "ThemeProvider.useAppearanceStore[fontSize]": (s)=>s.fontSize
    }["ThemeProvider.useAppearanceStore[fontSize]"]);
    // Apply theme whenever store values change
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ThemeProvider.useEffect": ()=>{
            if (!customThemeConfig) return;
            applyTheme(customThemeConfig, colorMode, fontSize);
        }
    }["ThemeProvider.useEffect"], [
        customThemeConfig,
        colorMode,
        fontSize
    ]);
    // Subscribe to store rehydration and apply theme
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "ThemeProvider.useEffect": ()=>{
            // Apply immediately with current store values
            const state = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppearanceStore"].getState();
            if (state.customThemeConfig) {
                applyTheme(state.customThemeConfig, state.colorMode, state.fontSize);
            }
            // Also subscribe to any changes (including rehydration)
            const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppearanceStore"].subscribe({
                "ThemeProvider.useEffect.unsubscribe": (state)=>{
                    if (state.customThemeConfig) {
                        applyTheme(state.customThemeConfig, state.colorMode, state.fontSize);
                    }
                }
            }["ThemeProvider.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["ThemeProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(ThemeProvider, "3IOE2BgVOAidPreXIZHI88YbDZw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppearanceStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppearanceStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppearanceStore"]
    ];
});
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/breakpoint-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BreakpointProvider",
    ()=>BreakpointProvider,
    "useBreakpoint",
    ()=>useBreakpoint,
    "withBreakpoint",
    ()=>withBreakpoint
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const BreakpointContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
function getBreakpoint(width) {
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    if (width < 1536) return "desktop";
    return "wide";
}
function debounce(func, wait) {
    let timeout = null;
    return (...args)=>{
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(()=>func(...args), wait);
    };
}
function BreakpointProvider({ children, debounceMs = 150 }) {
    _s();
    const [width, setWidth] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        "BreakpointProvider.useState": ()=>("TURBOPACK compile-time truthy", 1) ? window.innerWidth : "TURBOPACK unreachable"
    }["BreakpointProvider.useState"]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "BreakpointProvider.useEffect": ()=>{
            let timeout = null;
            const handleResize = {
                "BreakpointProvider.useEffect.handleResize": ()=>{
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout({
                        "BreakpointProvider.useEffect.handleResize": ()=>{
                            setWidth(window.innerWidth);
                        }
                    }["BreakpointProvider.useEffect.handleResize"], debounceMs);
                }
            }["BreakpointProvider.useEffect.handleResize"];
            window.addEventListener('resize', handleResize);
            return ({
                "BreakpointProvider.useEffect": ()=>{
                    if (timeout) clearTimeout(timeout);
                    window.removeEventListener('resize', handleResize);
                }
            })["BreakpointProvider.useEffect"];
        }
    }["BreakpointProvider.useEffect"], [
        debounceMs
    ]);
    const breakpoint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "BreakpointProvider.useMemo[breakpoint]": ()=>getBreakpoint(width)
    }["BreakpointProvider.useMemo[breakpoint]"], [
        width
    ]);
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "BreakpointProvider.useMemo[value]": ()=>({
                breakpoint,
                isMobile: breakpoint === "mobile",
                isTablet: breakpoint === "tablet",
                isDesktop: breakpoint === "desktop" || breakpoint === "wide",
                isWide: breakpoint === "wide",
                width
            })
    }["BreakpointProvider.useMemo[value]"], [
        breakpoint,
        width
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BreakpointContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/breakpoint-context.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(BreakpointProvider, "kIvvkF6ddEy64fmeUxQXs5JvMKk=");
_c = BreakpointProvider;
function useBreakpoint() {
    _s1();
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](BreakpointContext);
    if (context === undefined) {
        throw new Error('useBreakpoint must be used within BreakpointProvider');
    }
    return context;
}
_s1(useBreakpoint, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function withBreakpoint(Component) {
    var _s = __turbopack_context__.k.signature();
    return _s((props)=>{
        _s();
        const breakpoint = useBreakpoint();
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
            ...props,
            ...breakpoint
        }, void 0, false, {
            fileName: "[project]/contexts/breakpoint-context.tsx",
            lineNumber: 120,
            columnNumber: 12
        }, this);
    }, "vDry4zHS/I48mvcyOApBMXDDBRo=", false, function() {
        return [
            useBreakpoint
        ];
    });
}
var _c;
__turbopack_context__.k.register(_c, "BreakpointProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/settings-cache.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Global Settings Cache
 * 
 * Cung cấp cache in-memory cho các settings đọc từ database.
 * Được sử dụng bởi các utility functions không thể dùng React hooks.
 * 
 * Flow:
 * 1. App khởi động -> gọi loadGeneralSettings() từ AuthProvider/Layout
 * 2. Utility functions đọc từ cache qua getGeneralSettingsSync()
 * 3. Nếu cache rỗng, fallback về default values
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */ __turbopack_context__.s([
    "DEFAULT_GENERAL_SETTINGS",
    ()=>DEFAULT_GENERAL_SETTINGS,
    "clearGeneralSettingsCache",
    ()=>clearGeneralSettingsCache,
    "getGeneralSettingsSync",
    ()=>getGeneralSettingsSync,
    "isSettingsLoaded",
    ()=>isSettingsLoaded,
    "isSettingsLoading",
    ()=>isSettingsLoading,
    "loadGeneralSettings",
    ()=>loadGeneralSettings,
    "updateGeneralSettingsCache",
    ()=>updateGeneralSettingsCache
]);
const DEFAULT_GENERAL_SETTINGS = {
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    language: 'vi',
    currency: 'VND',
    storeName: '',
    storeAddress: '',
    storePhone: ''
};
// In-memory cache
let settingsCache = null;
let isLoading = false;
let loadPromise = null;
async function loadGeneralSettings() {
    // Return cached if available
    if (settingsCache) {
        return settingsCache;
    }
    // Prevent multiple simultaneous loads
    if (loadPromise) {
        return loadPromise;
    }
    isLoading = true;
    loadPromise = (async ()=>{
        try {
            // Try API first
            const res = await fetch('/api/settings?group=general');
            if (res.ok) {
                const data = await res.json();
                if (data.grouped?.general) {
                    settingsCache = {
                        ...DEFAULT_GENERAL_SETTINGS,
                        ...data.grouped.general
                    };
                    return settingsCache;
                }
                // Parse array format
                if (data.data && Array.isArray(data.data)) {
                    const parsed = data.data.reduce((acc, item)=>{
                        acc[item.key] = item.value;
                        return acc;
                    }, {});
                    settingsCache = {
                        ...DEFAULT_GENERAL_SETTINGS,
                        ...parsed
                    };
                    return settingsCache;
                }
            }
        } catch (error) {
            console.error('Failed to load general settings from API:', error);
        }
        // Return defaults if API fails
        settingsCache = DEFAULT_GENERAL_SETTINGS;
        return settingsCache;
    })();
    try {
        return await loadPromise;
    } finally{
        isLoading = false;
        loadPromise = null;
    }
}
function getGeneralSettingsSync() {
    // Return from cache if available
    if (settingsCache) {
        return settingsCache;
    }
    return DEFAULT_GENERAL_SETTINGS;
}
function updateGeneralSettingsCache(settings) {
    settingsCache = {
        ...settingsCache || DEFAULT_GENERAL_SETTINGS,
        ...settings
    };
}
function clearGeneralSettingsCache() {
    settingsCache = null;
    loadPromise = null;
}
function isSettingsLoaded() {
    return settingsCache !== null;
}
function isSettingsLoading() {
    return isLoading;
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "getCurrentUserInfo",
    ()=>getCurrentUserInfo,
    "getCurrentUserName",
    ()=>getCurrentUserName,
    "getCurrentUserSystemId",
    ()=>getCurrentUserSystemId,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/settings-cache.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
const AuthContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](null);
// In-memory user cache
let cachedUser = null;
function AuthProvider({ children }) {
    _s();
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    // REMOVED: Heavy store import - use employee from session instead
    // const { data: employees } = useEmployeeStore();
    const [user, setUser] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](cachedUser);
    const isLoading = status === 'loading';
    // Load general settings when authenticated
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "AuthProvider.useEffect": ()=>{
            if (status === 'authenticated') {
                // Load settings from database into cache
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadGeneralSettings"])().catch(console.error);
            } else if (status === 'unauthenticated') {
                // Clear settings cache on logout
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearGeneralSettingsCache"])();
            }
        }
    }["AuthProvider.useEffect"], [
        status
    ]);
    // Sync user from NextAuth session
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "AuthProvider.useEffect": ()=>{
            if (status === 'authenticated' && session?.user) {
                const sessionUser = session.user;
                const userObj = {
                    systemId: sessionUser.id || sessionUser.systemId || '',
                    email: sessionUser.email || '',
                    fullName: sessionUser.name,
                    name: sessionUser.name || sessionUser.email,
                    role: sessionUser.role || 'STAFF',
                    employeeId: sessionUser.employeeId,
                    employee: sessionUser.employee
                };
                cachedUser = userObj;
                setUser(userObj);
            } else if (status === 'unauthenticated') {
                cachedUser = null;
                setUser(null);
            }
        }
    }["AuthProvider.useEffect"], [
        session,
        status
    ]);
    // Find employee based on email or employeeId
    // SIMPLIFIED: Use employee from session directly instead of store lookup
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AuthProvider.useMemo[employee]": ()=>{
            if (!user) return null;
            // Use employee from user data if available (from NextAuth session)
            if (user.employee) return user.employee;
            // Return null - employee lookup should be done by components that need it
            return null;
        }
    }["AuthProvider.useMemo[employee]"], [
        user
    ]);
    // Logout via NextAuth
    const logout = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "AuthProvider.useCallback[logout]": async ()=>{
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])({
                    redirect: false
                });
                cachedUser = null;
                setUser(null);
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    }["AuthProvider.useCallback[logout]"], []);
    // Refresh user - just trigger session refresh
    const refreshUser = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "AuthProvider.useCallback[refreshUser]": async ()=>{
        // NextAuth session will be refreshed automatically
        // This is a no-op placeholder for compatibility
        }
    }["AuthProvider.useCallback[refreshUser]"], []);
    const updateUser = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "AuthProvider.useCallback[updateUser]": (updates)=>{
            setUser({
                "AuthProvider.useCallback[updateUser]": (prev)=>{
                    if (!prev) return null;
                    const updated = {
                        ...prev,
                        ...updates
                    };
                    cachedUser = updated;
                    return updated;
                }
            }["AuthProvider.useCallback[updateUser]"]);
        }
    }["AuthProvider.useCallback[updateUser]"], []);
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "AuthProvider.useMemo[value]": ()=>({
                user,
                employee,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'ADMIN' || user?.role === 'admin',
                isLoading,
                logout,
                updateUser,
                refreshUser
            })
    }["AuthProvider.useMemo[value]"], [
        user,
        employee,
        isLoading,
        logout,
        updateUser,
        refreshUser
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/auth-context.tsx",
        lineNumber: 133,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "D5ocfiLXu5pLIlkRY/MZFCsDgHY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](AuthContext);
    if (!context) {
        // Development warning
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('useAuth must be used within AuthProvider - returning default values');
        }
        // Return safe defaults instead of throwing
        return {
            user: null,
            employee: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: true,
            logout: async ()=>{},
            updateUser: ()=>{},
            refreshUser: async ()=>{}
        };
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function getCurrentUserInfo() {
    // Use cached user if available
    if (cachedUser) {
        return {
            systemId: cachedUser.employeeId || cachedUser.systemId || 'SYSTEM',
            name: cachedUser.fullName || cachedUser.name || 'Hệ thống',
            email: cachedUser.email,
            role: cachedUser.role
        };
    }
    return {
        systemId: 'SYSTEM',
        name: 'Hệ thống'
    };
}
function getCurrentUserSystemId() {
    return getCurrentUserInfo().systemId;
}
function getCurrentUserName() {
    return getCurrentUserInfo().name;
}
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/providers/auth-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [app-client] (ecmascript)");
"use client";
;
;
function AuthProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SessionProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/components/providers/auth-provider.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/breadcrumb-system.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Advanced Breadcrumb & Title System
 * Features:
 * - Auto-generated breadcrumbs from path structure  
 * - Context-aware dynamic titles (employee name, order number, etc)
 * - Consistent naming across all modules
 * - Multi-language support ready
 * - Clickable navigation with back button
 * - Mobile-first responsive design
 * - Description support for each page
 */ // 1. Complete Module Definitions for all system features
__turbopack_context__.s([
    "MODULES",
    ()=>MODULES,
    "generateBreadcrumb",
    ()=>generateBreadcrumb,
    "generatePageTitle",
    ()=>generatePageTitle,
    "getBackPath",
    ()=>getBackPath,
    "shouldShowBackButton",
    ()=>shouldShowBackButton
]);
const MODULES = {
    DASHBOARD: {
        key: 'dashboard',
        name: 'Trang chủ',
        icon: 'Home',
        title: 'Dashboard',
        description: 'Tổng quan hệ thống và báo cáo chính'
    },
    // === HRM Module ===
    HRM: {
        key: 'hrm',
        name: 'HRM',
        icon: 'Users',
        sections: {
            EMPLOYEES: {
                key: 'employees',
                name: 'Nhân viên',
                icon: 'User',
                list: {
                    title: 'Danh sách nhân viên',
                    description: 'Quản lý thông tin và hồ sơ nhân viên'
                },
                detail: {
                    title: (name)=>name ? `Hồ sơ ${name}` : 'Chi tiết nhân viên',
                    description: 'Thông tin chi tiết và lịch sử làm việc'
                },
                edit: {
                    title: (name)=>name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa nhân viên',
                    description: 'Cập nhật thông tin nhân viên'
                },
                new: {
                    title: 'Thêm nhân viên mới',
                    description: 'Tạo hồ sơ nhân viên mới trong hệ thống'
                }
            },
            DEPARTMENTS: {
                key: 'departments',
                name: 'Phòng ban',
                icon: 'Building',
                list: {
                    title: 'Danh sách phòng ban',
                    description: 'Quản lý cơ cấu tổ chức và phòng ban'
                },
                detail: {
                    title: (name)=>name ? `Phòng ban ${name}` : 'Chi tiết phòng ban',
                    description: 'Thông tin chi tiết và nhân sự phòng ban'
                },
                edit: {
                    title: (name)=>name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa phòng ban',
                    description: 'Cập nhật thông tin phòng ban'
                },
                new: {
                    title: 'Thêm phòng ban mới',
                    description: 'Tạo phòng ban mới trong cơ cấu tổ chức'
                }
            },
            ORGANIZATION_CHART: {
                key: 'organization-chart',
                name: 'Sơ đồ tổ chức',
                icon: 'Sitemap',
                list: {
                    title: 'Sơ đồ tổ chức',
                    description: 'Cơ cấu tổ chức và mối quan hệ phòng ban'
                }
            },
            ATTENDANCE: {
                key: 'attendance',
                name: 'Chấm công',
                icon: 'Clock',
                list: {
                    title: 'Quản lý chấm công',
                    description: 'Theo dõi giờ làm việc và chấm công nhân viên'
                }
            },
            LEAVES: {
                key: 'leaves',
                name: 'Nghỉ phép',
                icon: 'Calendar',
                list: {
                    title: 'Quản lý nghỉ phép',
                    description: 'Đơn xin nghỉ phép và duyệt phép'
                },
                detail: {
                    title: (code)=>code ? `Đơn nghỉ phép ${code}` : 'Chi tiết nghỉ phép',
                    description: 'Thông tin chi tiết đơn nghỉ phép'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa đơn ${code}` : 'Chỉnh sửa đơn nghỉ phép',
                    description: 'Cập nhật thông tin đơn nghỉ phép'
                },
                new: {
                    title: 'Tạo đơn nghỉ phép mới',
                    description: 'Tạo đơn xin nghỉ phép'
                }
            },
            PAYROLL: {
                key: 'payroll',
                name: 'Bảng lương',
                icon: 'Banknote',
                list: {
                    title: 'Danh sách bảng lương',
                    description: 'Quản lý bảng lương theo tháng'
                },
                detail: {
                    title: (code)=>code ? `Bảng lương ${code}` : 'Chi tiết bảng lương',
                    description: 'Thông tin chi tiết bảng lương'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa bảng lương',
                    description: 'Cập nhật thông tin bảng lương'
                },
                new: {
                    title: 'Chạy bảng lương mới',
                    description: 'Tạo bảng lương cho kỳ mới'
                },
                templates: {
                    title: 'Mẫu bảng lương',
                    description: 'Quản lý bộ thành phần chuẩn để tái sử dụng'
                }
            }
        }
    },
    // === SALES Module ===
    SALES: {
        key: 'sales',
        name: 'Bán hàng',
        icon: 'ShoppingCart',
        sections: {
            CUSTOMERS: {
                key: 'customers',
                name: 'Khách hàng',
                icon: 'Users',
                list: {
                    title: 'Danh sách khách hàng',
                    description: 'Quản lý thông tin khách hàng và CRM'
                },
                detail: {
                    title: (name)=>name ? `Khách hàng ${name}` : 'Chi tiết khách hàng',
                    description: 'Lịch sử giao dịch và thông tin khách hàng'
                },
                edit: {
                    title: (name)=>name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa khách hàng',
                    description: 'Cập nhật thông tin khách hàng'
                },
                new: {
                    title: 'Thêm khách hàng mới',
                    description: 'Tạo hồ sơ khách hàng mới'
                }
            },
            PRODUCTS: {
                key: 'products',
                name: 'Sản phẩm',
                icon: 'Package',
                list: {
                    title: 'Danh sách sản phẩm',
                    description: 'Quản lý sản phẩm và danh mục'
                },
                detail: {
                    title: (name)=>name ? `Sản phẩm ${name}` : 'Chi tiết sản phẩm',
                    description: 'Thông tin chi tiết và kho hàng'
                },
                edit: {
                    title: (name)=>name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa sản phẩm',
                    description: 'Cập nhật thông tin sản phẩm'
                },
                new: {
                    title: 'Thêm sản phẩm mới',
                    description: 'Tạo sản phẩm mới trong hệ thống'
                }
            },
            ORDERS: {
                key: 'orders',
                name: 'Đơn hàng',
                icon: 'FileText',
                list: {
                    title: 'Danh sách đơn hàng',
                    description: 'Quản lý đơn hàng và trạng thái giao hàng'
                },
                detail: {
                    title: (code)=>code ? `Đơn hàng ${code}` : 'Chi tiết đơn hàng',
                    description: 'Thông tin chi tiết và trạng thái đơn hàng'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa đơn hàng',
                    description: 'Cập nhật thông tin đơn hàng'
                },
                new: {
                    title: 'Tạo đơn hàng mới',
                    description: 'Tạo đơn hàng cho khách hàng'
                }
            },
            RETURNS: {
                key: 'returns',
                name: 'Trả hàng',
                icon: 'RotateCcw',
                list: {
                    title: 'Danh sách trả hàng',
                    description: 'Quản lý đơn trả hàng và hoàn tiền'
                },
                detail: {
                    title: (code)=>code ? `Trả hàng ${code}` : 'Chi tiết trả hàng',
                    description: 'Thông tin chi tiết đơn trả hàng'
                }
            },
            BRANDS: {
                key: 'brands',
                name: 'Thương hiệu',
                icon: 'Tags',
                list: {
                    title: 'Danh sách thương hiệu',
                    description: 'Quản lý thương hiệu sản phẩm và SEO'
                },
                detail: {
                    title: (name)=>name ? `Thương hiệu ${name}` : 'Chi tiết thương hiệu',
                    description: 'Thông tin chi tiết và SEO thương hiệu'
                },
                edit: {
                    title: (name)=>name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa thương hiệu',
                    description: 'Cập nhật thông tin thương hiệu'
                },
                new: {
                    title: 'Thêm thương hiệu mới',
                    description: 'Tạo thương hiệu sản phẩm mới'
                }
            },
            CATEGORIES: {
                key: 'categories',
                name: 'Danh mục sản phẩm',
                icon: 'FolderTree',
                list: {
                    title: 'Danh mục sản phẩm',
                    description: 'Quản lý cây danh mục và SEO'
                },
                detail: {
                    title: (name)=>name ? `Danh mục ${name}` : 'Chi tiết danh mục',
                    description: 'Thông tin chi tiết và SEO danh mục'
                },
                edit: {
                    title: (name)=>name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa danh mục',
                    description: 'Cập nhật thông tin danh mục'
                },
                new: {
                    title: 'Thêm danh mục mới',
                    description: 'Tạo danh mục sản phẩm mới'
                }
            }
        }
    },
    // === PROCUREMENT Module ===
    PROCUREMENT: {
        key: 'procurement',
        name: 'Mua hàng',
        icon: 'Truck',
        sections: {
            SUPPLIERS: {
                key: 'suppliers',
                name: 'Nhà cung cấp',
                icon: 'Building2',
                list: {
                    title: 'Danh sách nhà cung cấp',
                    description: 'Quản lý thông tin nhà cung cấp'
                },
                detail: {
                    title: (name)=>name ? `Nhà cung cấp ${name}` : 'Chi tiết nhà cung cấp',
                    description: 'Lịch sử giao dịch và đánh giá'
                },
                edit: {
                    title: (name)=>name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa nhà cung cấp',
                    description: 'Cập nhật thông tin nhà cung cấp'
                },
                new: {
                    title: 'Thêm nhà cung cấp mới',
                    description: 'Tạo hồ sơ nhà cung cấp mới'
                }
            },
            PURCHASE_ORDERS: {
                key: 'purchase-orders',
                name: 'Đơn mua hàng',
                icon: 'ShoppingBag',
                list: {
                    title: 'Danh sách đơn mua hàng',
                    description: 'Quản lý đơn đặt hàng từ nhà cung cấp'
                },
                detail: {
                    title: (code)=>code ? `Đơn mua hàng ${code}` : 'Chi tiết đơn mua hàng',
                    description: 'Thông tin chi tiết và trạng thái đơn hàng'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa đơn mua hàng',
                    description: 'Cập nhật thông tin đơn mua hàng'
                },
                new: {
                    title: 'Tạo đơn mua hàng mới',
                    description: 'Tạo đơn đặt hàng từ nhà cung cấp'
                }
            },
            PURCHASE_RETURNS: {
                key: 'purchase-returns',
                name: 'Trả hàng nhập',
                icon: 'PackageX',
                list: {
                    title: 'Danh sách phiếu trả hàng',
                    description: 'Quản lý việc trả hàng cho nhà cung cấp'
                },
                detail: {
                    title: (code)=>code ? `Phiếu trả ${code}` : 'Chi tiết phiếu trả hàng',
                    description: 'Thông tin chi tiết phiếu trả hàng nhập'
                },
                new: {
                    title: 'Tạo phiếu trả hàng',
                    description: 'Tạo phiếu trả hàng cho nhà cung cấp'
                }
            },
            INVENTORY_RECEIPTS: {
                key: 'inventory-receipts',
                name: 'Phiếu nhập kho',
                icon: 'Package2',
                list: {
                    title: 'Danh sách phiếu nhập kho',
                    description: 'Quản lý việc nhập hàng vào kho'
                },
                detail: {
                    title: (code)=>code ? `Phiếu nhập ${code}` : 'Chi tiết phiếu nhập kho',
                    description: 'Thông tin chi tiết phiếu nhập kho'
                }
            }
        }
    },
    // === FINANCE Module ===
    FINANCE: {
        key: 'finance',
        name: 'Tài chính',
        icon: 'CreditCard',
        sections: {
            CASHBOOK: {
                key: 'cashbook',
                name: 'Sổ quỹ',
                icon: 'Book',
                list: {
                    title: 'Sổ quỹ tiền mặt',
                    description: 'Theo dõi thu chi tiền mặt'
                }
            },
            RECEIPTS: {
                key: 'receipts',
                name: 'Phiếu thu',
                icon: 'Receipt',
                list: {
                    title: 'Danh sách phiếu thu',
                    description: 'Quản lý các khoản thu'
                },
                detail: {
                    title: (code)=>code ? `Phiếu thu ${code}` : 'Chi tiết phiếu thu',
                    description: 'Thông tin chi tiết phiếu thu'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa phiếu thu',
                    description: 'Cập nhật thông tin phiếu thu'
                },
                new: {
                    title: 'Tạo phiếu thu mới',
                    description: 'Tạo phiếu thu tiền'
                }
            },
            PAYMENTS: {
                key: 'payments',
                name: 'Phiếu chi',
                icon: 'CreditCard',
                list: {
                    title: 'Danh sách phiếu chi',
                    description: 'Quản lý các khoản chi'
                },
                detail: {
                    title: (code)=>code ? `Phiếu chi ${code}` : 'Chi tiết phiếu chi',
                    description: 'Thông tin chi tiết phiếu chi'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa phiếu chi',
                    description: 'Cập nhật thông tin phiếu chi'
                },
                new: {
                    title: 'Tạo phiếu chi mới',
                    description: 'Tạo phiếu chi tiền'
                }
            }
        }
    },
    // === INVENTORY Module ===
    INVENTORY: {
        key: 'inventory',
        name: 'Kho hàng',
        icon: 'Warehouse',
        sections: {
            STOCK_LOCATIONS: {
                key: 'stock-locations',
                name: 'Vị trí kho',
                icon: 'MapPin',
                list: {
                    title: 'Danh sách vị trí kho',
                    description: 'Quản lý vị trí và khu vực kho'
                }
            },
            STOCK_HISTORY: {
                key: 'stock-history',
                name: 'Lịch sử kho',
                icon: 'History',
                list: {
                    title: 'Lịch sử xuất nhập kho',
                    description: 'Theo dõi biến động hàng hóa'
                }
            },
            INVENTORY_CHECKS: {
                key: 'inventory-checks',
                name: 'Kiểm hàng',
                icon: 'ClipboardCheck',
                list: {
                    title: 'Danh sách phiếu kiểm hàng',
                    description: 'Quản lý kiểm kê định kỳ hàng hóa'
                },
                detail: {
                    title: (code)=>code ? `Phiếu kiểm hàng ${code}` : 'Chi tiết phiếu kiểm hàng',
                    description: 'Thông tin chi tiết phiếu kiểm hàng'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa phiếu kiểm hàng',
                    description: 'Cập nhật thông tin phiếu kiểm hàng'
                },
                new: {
                    title: 'Tạo phiếu kiểm hàng mới',
                    description: 'Tạo phiếu kiểm kê định kỳ mới'
                }
            },
            STOCK_TRANSFERS: {
                key: 'stock-transfers',
                name: 'Chuyển kho',
                icon: 'Truck',
                list: {
                    title: 'Danh sách chuyển kho',
                    description: 'Quản lý phiếu chuyển kho giữa các chi nhánh'
                },
                detail: {
                    title: (code)=>code ? `Phiếu chuyển kho ${code}` : 'Chi tiết chuyển kho',
                    description: 'Thông tin chi tiết phiếu chuyển kho'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa chuyển kho',
                    description: 'Cập nhật thông tin phiếu chuyển kho'
                },
                new: {
                    title: 'Tạo phiếu chuyển kho',
                    description: 'Tạo phiếu chuyển kho mới'
                }
            },
            COST_ADJUSTMENTS: {
                key: 'cost-adjustments',
                name: 'Điều chỉnh giá vốn',
                icon: 'CircleDollarSign',
                list: {
                    title: 'Danh sách điều chỉnh giá vốn',
                    description: 'Quản lý các phiếu điều chỉnh giá vốn sản phẩm'
                },
                detail: {
                    title: (code)=>code ? `Phiếu điều chỉnh ${code}` : 'Chi tiết điều chỉnh',
                    description: 'Thông tin chi tiết phiếu điều chỉnh giá vốn'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa điều chỉnh',
                    description: 'Cập nhật thông tin phiếu điều chỉnh'
                },
                new: {
                    title: 'Tạo phiếu điều chỉnh giá vốn',
                    description: 'Tạo phiếu điều chỉnh giá vốn mới'
                }
            }
        }
    },
    // === INTERNAL OPERATIONS Module ===
    INTERNAL: {
        key: 'internal',
        name: 'Hoạt động nội bộ',
        icon: 'Settings',
        sections: {
            PACKAGING: {
                key: 'packaging',
                name: 'Đóng gói',
                icon: 'Package',
                list: {
                    title: 'Quản lý đóng gói',
                    description: 'Theo dõi việc đóng gói hàng hóa'
                }
            },
            SHIPMENTS: {
                key: 'shipments',
                name: 'Vận chuyển',
                icon: 'Truck',
                list: {
                    title: 'Quản lý vận chuyển',
                    description: 'Theo dõi vận chuyển và giao hàng'
                }
            },
            TASKS_WARRANTY: {
                key: 'warranty',
                name: 'Quản Lý Bảo Hành',
                icon: 'Wrench',
                list: {
                    title: 'Danh sách phiếu bảo hành',
                    description: 'Quản lý tiếp nhận và xử lý sản phẩm bảo hành'
                },
                detail: {
                    title: (code)=>code ? `Phiếu bảo hành ${code}` : 'Chi tiết phiếu bảo hành',
                    description: 'Thông tin chi tiết và xử lý sản phẩm bảo hành'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa phiếu bảo hành',
                    description: 'Cập nhật thông tin phiếu bảo hành'
                },
                new: {
                    title: 'Thêm phiếu bảo hành mới',
                    description: 'Tạo phiếu tiếp nhận bảo hành mới'
                }
            },
            INTERNAL_TASKS: {
                key: 'internal-tasks',
                name: 'Công việc nội bộ',
                icon: 'ClipboardList',
                list: {
                    title: 'Danh sách công việc nội bộ',
                    description: 'Quản lý công việc và nhiệm vụ nội bộ'
                }
            },
            COMPLAINTS: {
                key: 'complaints',
                name: 'Khiếu nại',
                icon: 'AlertCircle',
                list: {
                    title: 'Danh sách khiếu nại',
                    description: 'Quản lý và xử lý khiếu nại từ khách hàng'
                },
                detail: {
                    title: (code)=>code ? `Khiếu nại ${code}` : 'Chi tiết khiếu nại',
                    description: 'Thông tin chi tiết và lịch sử xử lý khiếu nại'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa khiếu nại',
                    description: 'Cập nhật thông tin khiếu nại'
                },
                new: {
                    title: 'Tạo khiếu nại mới',
                    description: 'Thêm khiếu nại mới vào hệ thống'
                },
                statistics: {
                    title: 'Thống kê khiếu nại',
                    description: 'Phân tích và báo cáo tổng quan khiếu nại'
                }
            },
            PENALTIES: {
                key: 'penalties',
                name: 'Phiếu phạt',
                icon: 'AlertTriangle',
                list: {
                    title: 'Danh sách phiếu phạt',
                    description: 'Theo dõi vi phạm và kỷ luật'
                },
                detail: {
                    title: (code)=>code ? `Phiếu phạt ${code}` : 'Chi tiết phiếu phạt',
                    description: 'Thông tin chi tiết vi phạm và kết quả xử lý'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa phiếu phạt ${code}` : 'Chỉnh sửa phiếu phạt',
                    description: 'Cập nhật thông tin phiếu phạt'
                },
                new: {
                    title: 'Tạo phiếu phạt mới',
                    description: 'Thêm bản ghi phiếu phạt mới vào hệ thống'
                }
            },
            TASKS: {
                key: 'tasks',
                name: 'Giao việc nội bộ',
                icon: 'ListTodo',
                list: {
                    title: 'Quản lý công việc',
                    description: 'Giao việc và theo dõi tiến độ công việc nội bộ'
                },
                detail: {
                    title: (code)=>code ? `Công việc ${code}` : 'Chi tiết công việc',
                    description: 'Thông tin chi tiết công việc và tiến độ'
                },
                edit: {
                    title: (code)=>code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa công việc',
                    description: 'Cập nhật thông tin công việc'
                },
                new: {
                    title: 'Tạo công việc mới',
                    description: 'Giao công việc mới cho nhân viên'
                },
                calendar: {
                    title: 'Lịch công việc',
                    description: 'Xem công việc theo dạng lịch'
                }
            },
            DUTY_SCHEDULE: {
                key: 'duty-schedule',
                name: 'Lịch trực',
                icon: 'Calendar',
                list: {
                    title: 'Lịch trực ca',
                    description: 'Sắp xếp lịch trực và ca làm việc'
                }
            },
            RECONCILIATION: {
                key: 'reconciliation',
                name: 'Đối soát',
                icon: 'Calculator',
                list: {
                    title: 'Đối soát tài khoản',
                    description: 'Đối soát và kiểm tra số liệu'
                }
            },
            WIKI: {
                key: 'wiki',
                name: 'Wiki',
                icon: 'BookOpen',
                list: {
                    title: 'Tài liệu Wiki',
                    description: 'Tài liệu hướng dẫn và kiến thức'
                },
                detail: {
                    title: (title)=>title || 'Chi tiết Wiki',
                    description: 'Nội dung tài liệu hướng dẫn'
                },
                edit: {
                    title: (title)=>title ? `Chỉnh sửa ${title}` : 'Chỉnh sửa Wiki',
                    description: 'Cập nhật nội dung tài liệu'
                },
                new: {
                    title: 'Tạo tài liệu mới',
                    description: 'Tạo tài liệu hướng dẫn mới'
                }
            }
        }
    },
    // === REPORTS Module ===
    REPORTS: {
        key: 'reports',
        name: 'Báo cáo',
        icon: 'BarChart',
        sections: {
            INDEX: {
                key: 'reports-index',
                name: 'Tổng quan báo cáo',
                icon: 'AreaChart',
                list: {
                    title: 'Báo cáo',
                    description: 'Trung tâm tổng hợp các báo cáo kinh doanh'
                }
            },
            SALES_BY_TIME: {
                key: 'sales-by-time',
                name: 'Bán hàng theo thời gian',
                icon: 'TrendingUp',
                list: {
                    title: 'Báo cáo bán hàng theo thời gian',
                    description: 'Thống kê doanh thu theo ngày, tuần, tháng'
                }
            },
            SALES_BY_EMPLOYEE: {
                key: 'sales-by-employee',
                name: 'Bán hàng theo nhân viên',
                icon: 'Users',
                list: {
                    title: 'Báo cáo bán hàng theo nhân viên',
                    description: 'Hiệu suất bán hàng của từng nhân viên'
                }
            },
            SALES_BY_PRODUCT: {
                key: 'sales-by-product',
                name: 'Bán hàng theo sản phẩm',
                icon: 'Package',
                list: {
                    title: 'Báo cáo bán hàng theo sản phẩm',
                    description: 'Doanh thu và số lượng bán từng sản phẩm'
                }
            },
            SALES_BY_BRANCH: {
                key: 'sales-by-branch',
                name: 'Bán hàng theo chi nhánh',
                icon: 'Building2',
                list: {
                    title: 'Báo cáo bán hàng theo chi nhánh',
                    description: 'So sánh doanh thu giữa các chi nhánh'
                }
            },
            SALES_REPORT: {
                key: 'sales-report',
                name: 'Báo cáo bán hàng',
                icon: 'TrendingUp',
                list: {
                    title: 'Báo cáo bán hàng',
                    description: 'Thống kê doanh thu và hiệu suất bán hàng'
                }
            },
            INVENTORY_REPORT: {
                key: 'inventory-report',
                name: 'Báo cáo kho',
                icon: 'Package',
                list: {
                    title: 'Báo cáo tồn kho',
                    description: 'Thống kê tình trạng kho hàng'
                }
            }
        }
    },
    // === SETTINGS Module ===
    SETTINGS: {
        key: 'settings',
        name: 'Cài đặt',
        icon: 'Settings',
        sections: {
            GENERAL: {
                key: 'general',
                name: 'Cài đặt chung',
                icon: 'Settings',
                list: {
                    title: 'Cài đặt hệ thống',
                    description: 'Cấu hình chung của hệ thống'
                }
            },
            APPEARANCE: {
                key: 'appearance',
                name: 'Giao diện',
                icon: 'Palette',
                list: {
                    title: 'Cài đặt giao diện',
                    description: 'Tùy chỉnh giao diện và theme'
                }
            },
            STORE_INFO: {
                key: 'store-info',
                name: 'Thông tin cửa hàng',
                icon: 'Store',
                list: {
                    title: 'Thông tin cửa hàng',
                    description: 'Cấu hình thông tin doanh nghiệp'
                }
            },
            PROVINCES: {
                key: 'provinces',
                name: 'Tỉnh thành',
                icon: 'Map',
                list: {
                    title: 'Quản lý tỉnh thành',
                    description: 'Danh sách tỉnh thành và địa chỉ'
                }
            },
            EMPLOYEE_SETTINGS: {
                key: 'employee-settings',
                name: 'Cài đặt nhân viên',
                icon: 'UserCog',
                list: {
                    title: 'Cài đặt nhân viên',
                    description: 'Cấu hình quy định về nhân viên'
                }
            },
            PRICING_SETTINGS: {
                key: 'pricing-settings',
                name: 'Cài đặt giá',
                icon: 'DollarSign',
                list: {
                    title: 'Cài đặt định giá',
                    description: 'Cấu hình chính sách giá'
                }
            },
            PAYMENT_SETTINGS: {
                key: 'payment-settings',
                name: 'Cài đặt thanh toán',
                icon: 'CreditCard',
                list: {
                    title: 'Cài đặt thanh toán',
                    description: 'Cấu hình phương thức thanh toán'
                }
            },
            INVENTORY_SETTINGS: {
                key: 'inventory-settings',
                name: 'Cài đặt kho',
                icon: 'Warehouse',
                list: {
                    title: 'Cài đặt kho hàng',
                    description: 'Cấu hình quản lý kho'
                }
            },
            SHIPPING_PARTNERS: {
                key: 'shipping-partners',
                name: 'Đối tác vận chuyển',
                icon: 'Truck',
                list: {
                    title: 'Đối tác vận chuyển',
                    description: 'Quản lý nhà cung cấp dịch vụ vận chuyển'
                }
            },
            SALES_CONFIG: {
                key: 'sales-config',
                name: 'Cấu hình bán hàng',
                icon: 'ShoppingCart',
                list: {
                    title: 'Cấu hình bán hàng',
                    description: 'Cài đặt quy trình bán hàng'
                }
            },
            ROOT: {
                key: 'settings',
                name: 'Cài đặt',
                icon: 'Settings',
                list: {
                    title: 'Cài đặt hệ thống',
                    description: 'Quản lý cài đặt và cấu hình'
                }
            },
            EMPLOYEES: {
                key: 'employees',
                name: 'Nhân viên',
                icon: 'Users',
                list: {
                    title: 'Cài đặt nhân viên',
                    description: 'Cấu hình liên quan nhân viên'
                }
            },
            TAXES: {
                key: 'taxes',
                name: 'Thuế',
                icon: 'Receipt',
                list: {
                    title: 'Cài đặt thuế',
                    description: 'Quản lý thuế suất'
                }
            },
            PAYMENT_METHODS: {
                key: 'payments',
                name: 'Phương thức thanh toán',
                icon: 'CreditCard',
                list: {
                    title: 'Phương thức thanh toán',
                    description: 'Cấu hình các hình thức thanh toán'
                }
            },
            PRINT_TEMPLATES: {
                key: 'print-templates',
                name: 'Mẫu in',
                icon: 'Printer',
                list: {
                    title: 'Mẫu in',
                    description: 'Quản lý mẫu in hóa đơn'
                }
            },
            STOCK_LOCATIONS: {
                key: 'stock-locations',
                name: 'Vị trí kho',
                icon: 'MapPin',
                list: {
                    title: 'Vị trí kho',
                    description: 'Quản lý vị trí trong kho'
                }
            },
            OTHER: {
                key: 'other',
                name: 'Khác',
                icon: 'MoreHorizontal',
                list: {
                    title: 'Cài đặt khác',
                    description: 'Các cài đặt khác'
                }
            },
            SYSTEM_LOGS: {
                key: 'system-logs',
                name: 'Nhật ký hệ thống',
                icon: 'FileText',
                list: {
                    title: 'Nhật ký hệ thống',
                    description: 'Xem lịch sử hoạt động'
                }
            },
            IMPORT_EXPORT_LOGS: {
                key: 'import-export-logs',
                name: 'Nhật ký xuất nhập',
                icon: 'Database',
                list: {
                    title: 'Nhật ký xuất/nhập',
                    description: 'Lịch sử xuất nhập file'
                }
            }
        }
    }
};
// 2. Path Pattern Mapping for smart routing
const PATH_PATTERNS = {
    // Dashboard
    '/dashboard': {
        module: 'DASHBOARD'
    },
    // === ROOT-LEVEL URL ALIASES (for backward compatibility) ===
    // HRM root aliases
    '/employees': {
        module: 'HRM',
        section: 'EMPLOYEES',
        action: 'list'
    },
    '/employees/new': {
        module: 'HRM',
        section: 'EMPLOYEES',
        action: 'new'
    },
    '/employees/trash': {
        module: 'HRM',
        section: 'EMPLOYEES',
        action: 'trash'
    },
    '/employees/:systemId': {
        module: 'HRM',
        section: 'EMPLOYEES',
        action: 'detail'
    },
    '/employees/:systemId/edit': {
        module: 'HRM',
        section: 'EMPLOYEES',
        action: 'edit'
    },
    '/departments': {
        module: 'HRM',
        section: 'DEPARTMENTS',
        action: 'list'
    },
    '/departments/new': {
        module: 'HRM',
        section: 'DEPARTMENTS',
        action: 'new'
    },
    '/departments/trash': {
        module: 'HRM',
        section: 'DEPARTMENTS',
        action: 'trash'
    },
    '/departments/:systemId': {
        module: 'HRM',
        section: 'DEPARTMENTS',
        action: 'detail'
    },
    '/departments/:systemId/edit': {
        module: 'HRM',
        section: 'DEPARTMENTS',
        action: 'edit'
    },
    '/departments/organization-chart': {
        module: 'HRM',
        section: 'ORGANIZATION_CHART',
        action: 'list'
    },
    '/attendance': {
        module: 'HRM',
        section: 'ATTENDANCE',
        action: 'list'
    },
    '/attendance/attendance': {
        module: 'HRM',
        section: 'ATTENDANCE',
        action: 'list'
    },
    '/leaves': {
        module: 'HRM',
        section: 'LEAVES',
        action: 'list'
    },
    '/leaves/:systemId': {
        module: 'HRM',
        section: 'LEAVES',
        action: 'detail'
    },
    // Payroll routes
    '/payroll': {
        module: 'HRM',
        section: 'PAYROLL',
        action: 'list'
    },
    '/payroll/run': {
        module: 'HRM',
        section: 'PAYROLL',
        action: 'new'
    },
    '/payroll/templates': {
        module: 'HRM',
        section: 'PAYROLL',
        action: 'templates'
    },
    '/payroll/:systemId': {
        module: 'HRM',
        section: 'PAYROLL',
        action: 'detail'
    },
    '/payroll/:systemId/edit': {
        module: 'HRM',
        section: 'PAYROLL',
        action: 'edit'
    },
    // Sales root aliases
    '/customers': {
        module: 'SALES',
        section: 'CUSTOMERS',
        action: 'list'
    },
    '/customers/new': {
        module: 'SALES',
        section: 'CUSTOMERS',
        action: 'new'
    },
    '/customers/trash': {
        module: 'SALES',
        section: 'CUSTOMERS',
        action: 'trash'
    },
    '/customers/:systemId': {
        module: 'SALES',
        section: 'CUSTOMERS',
        action: 'detail'
    },
    '/customers/:systemId/edit': {
        module: 'SALES',
        section: 'CUSTOMERS',
        action: 'edit'
    },
    '/products': {
        module: 'SALES',
        section: 'PRODUCTS',
        action: 'list'
    },
    '/products/new': {
        module: 'SALES',
        section: 'PRODUCTS',
        action: 'new'
    },
    '/products/trash': {
        module: 'SALES',
        section: 'PRODUCTS',
        action: 'trash'
    },
    '/products/:systemId': {
        module: 'SALES',
        section: 'PRODUCTS',
        action: 'detail'
    },
    '/products/:systemId/edit': {
        module: 'SALES',
        section: 'PRODUCTS',
        action: 'edit'
    },
    '/orders': {
        module: 'SALES',
        section: 'ORDERS',
        action: 'list'
    },
    '/orders/new': {
        module: 'SALES',
        section: 'ORDERS',
        action: 'new'
    },
    '/orders/trash': {
        module: 'SALES',
        section: 'ORDERS',
        action: 'trash'
    },
    '/orders/:systemId': {
        module: 'SALES',
        section: 'ORDERS',
        action: 'detail'
    },
    '/orders/:systemId/edit': {
        module: 'SALES',
        section: 'ORDERS',
        action: 'edit'
    },
    '/orders/:systemId/return': {
        module: 'SALES',
        section: 'RETURNS',
        action: 'new'
    },
    '/returns': {
        module: 'SALES',
        section: 'RETURNS',
        action: 'list'
    },
    '/returns/:systemId': {
        module: 'SALES',
        section: 'RETURNS',
        action: 'detail'
    },
    '/returns/new': {
        module: 'SALES',
        section: 'RETURNS',
        action: 'new'
    },
    // Brands & Categories
    '/brands': {
        module: 'SALES',
        section: 'BRANDS',
        action: 'list'
    },
    '/brands/new': {
        module: 'SALES',
        section: 'BRANDS',
        action: 'new'
    },
    '/brands/:systemId': {
        module: 'SALES',
        section: 'BRANDS',
        action: 'detail'
    },
    '/brands/:systemId/edit': {
        module: 'SALES',
        section: 'BRANDS',
        action: 'edit'
    },
    '/categories': {
        module: 'SALES',
        section: 'CATEGORIES',
        action: 'list'
    },
    '/categories/new': {
        module: 'SALES',
        section: 'CATEGORIES',
        action: 'new'
    },
    '/categories/:systemId': {
        module: 'SALES',
        section: 'CATEGORIES',
        action: 'detail'
    },
    '/categories/:systemId/edit': {
        module: 'SALES',
        section: 'CATEGORIES',
        action: 'edit'
    },
    // Procurement root aliases
    '/suppliers': {
        module: 'PROCUREMENT',
        section: 'SUPPLIERS',
        action: 'list'
    },
    '/suppliers/new': {
        module: 'PROCUREMENT',
        section: 'SUPPLIERS',
        action: 'new'
    },
    '/suppliers/:systemId': {
        module: 'PROCUREMENT',
        section: 'SUPPLIERS',
        action: 'detail'
    },
    '/suppliers/:systemId/edit': {
        module: 'PROCUREMENT',
        section: 'SUPPLIERS',
        action: 'edit'
    },
    '/purchase-orders': {
        module: 'PROCUREMENT',
        section: 'PURCHASE_ORDERS',
        action: 'list'
    },
    '/purchase-orders/new': {
        module: 'PROCUREMENT',
        section: 'PURCHASE_ORDERS',
        action: 'new'
    },
    '/purchase-orders/:systemId': {
        module: 'PROCUREMENT',
        section: 'PURCHASE_ORDERS',
        action: 'detail'
    },
    '/purchase-orders/:systemId/edit': {
        module: 'PROCUREMENT',
        section: 'PURCHASE_ORDERS',
        action: 'edit'
    },
    '/purchase-orders/:systemId/return': {
        module: 'PROCUREMENT',
        section: 'PURCHASE_RETURNS',
        action: 'new'
    },
    '/purchase-returns': {
        module: 'PROCUREMENT',
        section: 'PURCHASE_RETURNS',
        action: 'list'
    },
    '/purchase-returns/new': {
        module: 'PROCUREMENT',
        section: 'PURCHASE_RETURNS',
        action: 'new'
    },
    '/purchase-returns/:systemId': {
        module: 'PROCUREMENT',
        section: 'PURCHASE_RETURNS',
        action: 'detail'
    },
    '/inventory-receipts': {
        module: 'PROCUREMENT',
        section: 'INVENTORY_RECEIPTS',
        action: 'list'
    },
    '/inventory-receipts/:systemId': {
        module: 'PROCUREMENT',
        section: 'INVENTORY_RECEIPTS',
        action: 'detail'
    },
    // Finance root aliases
    '/cashbook': {
        module: 'FINANCE',
        section: 'CASHBOOK',
        action: 'list'
    },
    '/receipts': {
        module: 'FINANCE',
        section: 'RECEIPTS',
        action: 'list'
    },
    '/receipts/new': {
        module: 'FINANCE',
        section: 'RECEIPTS',
        action: 'new'
    },
    '/receipts/:systemId': {
        module: 'FINANCE',
        section: 'RECEIPTS',
        action: 'detail'
    },
    '/receipts/:systemId/edit': {
        module: 'FINANCE',
        section: 'RECEIPTS',
        action: 'edit'
    },
    '/payments': {
        module: 'FINANCE',
        section: 'PAYMENTS',
        action: 'list'
    },
    '/payments/new': {
        module: 'FINANCE',
        section: 'PAYMENTS',
        action: 'new'
    },
    '/payments/:systemId': {
        module: 'FINANCE',
        section: 'PAYMENTS',
        action: 'detail'
    },
    '/payments/:systemId/edit': {
        module: 'FINANCE',
        section: 'PAYMENTS',
        action: 'edit'
    },
    // Inventory root aliases
    '/stock-locations': {
        module: 'INVENTORY',
        section: 'STOCK_LOCATIONS',
        action: 'list'
    },
    '/stock-history': {
        module: 'INVENTORY',
        section: 'STOCK_HISTORY',
        action: 'list'
    },
    '/inventory-checks': {
        module: 'INVENTORY',
        section: 'INVENTORY_CHECKS',
        action: 'list'
    },
    '/inventory-checks/new': {
        module: 'INVENTORY',
        section: 'INVENTORY_CHECKS',
        action: 'new'
    },
    '/inventory-checks/:systemId': {
        module: 'INVENTORY',
        section: 'INVENTORY_CHECKS',
        action: 'detail'
    },
    '/inventory-checks/:systemId/edit': {
        module: 'INVENTORY',
        section: 'INVENTORY_CHECKS',
        action: 'edit'
    },
    '/inventory-checks/edit/:systemId': {
        module: 'INVENTORY',
        section: 'INVENTORY_CHECKS',
        action: 'edit'
    },
    '/inventory-settings': {
        module: 'SETTINGS',
        section: 'INVENTORY_SETTINGS',
        action: 'list'
    },
    // Stock Transfers
    '/stock-transfers': {
        module: 'INVENTORY',
        section: 'STOCK_TRANSFERS',
        action: 'list'
    },
    '/stock-transfers/new': {
        module: 'INVENTORY',
        section: 'STOCK_TRANSFERS',
        action: 'new'
    },
    '/stock-transfers/:systemId': {
        module: 'INVENTORY',
        section: 'STOCK_TRANSFERS',
        action: 'detail'
    },
    '/stock-transfers/:systemId/edit': {
        module: 'INVENTORY',
        section: 'STOCK_TRANSFERS',
        action: 'edit'
    },
    // Cost Adjustments
    '/cost-adjustments': {
        module: 'INVENTORY',
        section: 'COST_ADJUSTMENTS',
        action: 'list'
    },
    '/cost-adjustments/new': {
        module: 'INVENTORY',
        section: 'COST_ADJUSTMENTS',
        action: 'new'
    },
    '/cost-adjustments/:systemId': {
        module: 'INVENTORY',
        section: 'COST_ADJUSTMENTS',
        action: 'detail'
    },
    '/cost-adjustments/:systemId/edit': {
        module: 'INVENTORY',
        section: 'COST_ADJUSTMENTS',
        action: 'edit'
    },
    // Internal operations root aliases
    '/packaging': {
        module: 'INTERNAL',
        section: 'PACKAGING',
        action: 'list'
    },
    '/packaging/:systemId': {
        module: 'INTERNAL',
        section: 'PACKAGING',
        action: 'detail'
    },
    '/shipments': {
        module: 'INTERNAL',
        section: 'SHIPMENTS',
        action: 'list'
    },
    '/shipments/:systemId': {
        module: 'INTERNAL',
        section: 'SHIPMENTS',
        action: 'detail'
    },
    '/reconciliation': {
        module: 'INTERNAL',
        section: 'RECONCILIATION',
        action: 'list'
    },
    '/warranty': {
        module: 'INTERNAL',
        section: 'TASKS_WARRANTY',
        action: 'list'
    },
    '/warranty/:systemId': {
        module: 'INTERNAL',
        section: 'TASKS_WARRANTY',
        action: 'detail'
    },
    '/warranty/:systemId/edit': {
        module: 'INTERNAL',
        section: 'TASKS_WARRANTY',
        action: 'edit'
    },
    '/warranty/new': {
        module: 'INTERNAL',
        section: 'TASKS_WARRANTY',
        action: 'new'
    },
    '/complaints': {
        module: 'INTERNAL',
        section: 'COMPLAINTS',
        action: 'list'
    },
    '/complaints/statistics': {
        module: 'INTERNAL',
        section: 'COMPLAINTS',
        action: 'statistics'
    },
    '/complaints/new': {
        module: 'INTERNAL',
        section: 'COMPLAINTS',
        action: 'new'
    },
    '/complaints/:systemId': {
        module: 'INTERNAL',
        section: 'COMPLAINTS',
        action: 'detail'
    },
    '/complaints/:systemId/edit': {
        module: 'INTERNAL',
        section: 'COMPLAINTS',
        action: 'edit'
    },
    '/penalties': {
        module: 'INTERNAL',
        section: 'PENALTIES',
        action: 'list'
    },
    '/penalties/new': {
        module: 'INTERNAL',
        section: 'PENALTIES',
        action: 'new'
    },
    '/penalties/:systemId': {
        module: 'INTERNAL',
        section: 'PENALTIES',
        action: 'detail'
    },
    '/penalties/:systemId/edit': {
        module: 'INTERNAL',
        section: 'PENALTIES',
        action: 'edit'
    },
    '/penalties/edit/:systemId': {
        module: 'INTERNAL',
        section: 'PENALTIES',
        action: 'edit'
    },
    '/tasks': {
        module: 'INTERNAL',
        section: 'TASKS',
        action: 'list'
    },
    '/tasks/calendar': {
        module: 'INTERNAL',
        section: 'TASKS',
        action: 'calendar'
    },
    '/tasks/new': {
        module: 'INTERNAL',
        section: 'TASKS',
        action: 'new'
    },
    '/tasks/:systemId': {
        module: 'INTERNAL',
        section: 'TASKS',
        action: 'detail'
    },
    '/tasks/:systemId/edit': {
        module: 'INTERNAL',
        section: 'TASKS',
        action: 'edit'
    },
    '/internal-tasks': {
        module: 'INTERNAL',
        section: 'INTERNAL_TASKS',
        action: 'list'
    },
    '/internal-tasks/:systemId': {
        module: 'INTERNAL',
        section: 'INTERNAL_TASKS',
        action: 'detail'
    },
    '/wiki': {
        module: 'INTERNAL',
        section: 'WIKI',
        action: 'list'
    },
    '/wiki/new': {
        module: 'INTERNAL',
        section: 'WIKI',
        action: 'new'
    },
    '/wiki/:systemId': {
        module: 'INTERNAL',
        section: 'WIKI',
        action: 'detail'
    },
    '/wiki/:systemId/edit': {
        module: 'INTERNAL',
        section: 'WIKI',
        action: 'edit'
    },
    // Reports root aliases
    '/reports/sales-report': {
        module: 'REPORTS',
        section: 'SALES_REPORT',
        action: 'list'
    },
    '/reports/inventory-report': {
        module: 'REPORTS',
        section: 'INVENTORY_REPORT',
        action: 'list'
    },
    // Settings root aliases (already have most)
    '/provinces': {
        module: 'SETTINGS',
        section: 'PROVINCES',
        action: 'list'
    },
    '/provinces/:systemId': {
        module: 'SETTINGS',
        section: 'PROVINCES',
        action: 'detail'
    },
    '/pricing-settings': {
        module: 'SETTINGS',
        section: 'PRICING_SETTINGS',
        action: 'list'
    },
    '/payment-methods': {
        module: 'SETTINGS',
        section: 'PAYMENT_METHODS',
        action: 'list'
    },
    '/shipping-partners': {
        module: 'SETTINGS',
        section: 'SHIPPING_PARTNERS',
        action: 'list'
    }
};
// 3. Smart path matching with parameter support
function matchPath(pathname) {
    // Try exact match first
    if (PATH_PATTERNS[pathname]) {
        return PATH_PATTERNS[pathname];
    }
    // Try pattern matching with parameters
    for (const [pattern, config] of Object.entries(PATH_PATTERNS)){
        if (pattern.includes(':')) {
            const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
            const match = pathname.match(regex);
            if (match) {
                // Extract parameter names and values
                const paramNames = pattern.match(/:[^/]+/g)?.map((p)=>p.slice(1)) || [];
                const params = {};
                paramNames.forEach((name, index)=>{
                    params[name] = match[index + 1];
                });
                return {
                    ...config,
                    params
                };
            }
        }
    }
    return null;
}
function generateBreadcrumb(pathname, context) {
    const breadcrumb = [];
    const pathMatch = matchPath(pathname);
    if (!pathMatch) {
        return [
            {
                label: 'Trang chủ',
                href: '/dashboard'
            }
        ];
    }
    // Always start with Dashboard if not already there
    if (pathname !== '/dashboard') {
        breadcrumb.push({
            label: 'Trang chủ',
            href: '/dashboard'
        });
    }
    const module = MODULES[pathMatch.module];
    if (!module) return breadcrumb;
    // Add section level (list page link)
    if (pathMatch.section && module.sections) {
        const section = module.sections[pathMatch.section];
        if (section) {
            // Get list path - use first segment (e.g., /employees, /customers)
            const pathSegments = pathname.split('/').filter(Boolean);
            const listPath = '/' + pathSegments[0];
            breadcrumb.push({
                label: section.name,
                href: listPath,
                isCurrent: !pathMatch.action || pathMatch.action === 'list'
            });
            // Handle different actions with improved UX
            if (pathMatch.action && pathMatch.action !== 'list') {
                // NEW action: Trang chủ > Nhân viên > Thêm mới
                if (pathMatch.action === 'new') {
                    breadcrumb.push({
                        label: 'Thêm mới',
                        href: pathname,
                        isCurrent: true
                    });
                } else if (pathMatch.action === 'trash') {
                    breadcrumb.push({
                        label: 'Thùng rác',
                        href: pathname,
                        isCurrent: true
                    });
                } else if (pathMatch.action === 'detail' && pathMatch.params) {
                    const contextName = getContextName(pathMatch, context);
                    breadcrumb.push({
                        label: contextName,
                        href: pathname,
                        isParam: true,
                        isCurrent: true
                    });
                } else if (pathMatch.action === 'edit' && pathMatch.params) {
                    const contextName = getContextName(pathMatch, context);
                    const id = pathMatch.params.id || pathMatch.params.periodId;
                    // Build detail page URL (context item is clickable)
                    let detailPath = listPath;
                    if (id) {
                        // Check URL pattern to construct correct detail path
                        // Standard pattern: /${id}/edit → detail page is /${id}
                        if (pathname.includes(`/${id}/edit`)) {
                            detailPath = `${listPath}/${id}`;
                        }
                    }
                    // Add context breadcrumb (clickable to detail page)
                    breadcrumb.push({
                        label: contextName,
                        href: detailPath,
                        isParam: true
                    });
                    // Add edit action breadcrumb (current page)
                    breadcrumb.push({
                        label: 'Chỉnh sửa',
                        href: pathname,
                        isCurrent: true
                    });
                }
            }
        }
    }
    return breadcrumb;
}
function generatePageTitle(pathname, context) {
    const pathMatch = matchPath(pathname);
    if (!pathMatch) {
        return {
            title: '',
            description: ''
        };
    }
    const module = MODULES[pathMatch.module];
    if (!module) {
        return {
            title: '',
            description: ''
        };
    }
    // Dashboard special case
    if (pathMatch.module === 'DASHBOARD') {
        return {
            title: module.title || module.name,
            description: module.description
        };
    }
    // Module-only pages
    if (!pathMatch.section) {
        return {
            title: module.name,
            description: `Tổng quan module ${module.name.toLowerCase()}`
        };
    }
    const section = module.sections?.[pathMatch.section];
    if (!section) {
        return {
            title: '',
            description: ''
        };
    }
    // Generate title based on action
    switch(pathMatch.action){
        case 'list':
            return {
                title: section.list?.title || section.name,
                description: section.list?.description
            };
        case 'new':
            return {
                title: section.new?.title || `Thêm ${section.name.toLowerCase()} mới`,
                description: section.new?.description || `Tạo ${section.name.toLowerCase()} mới trong hệ thống`
            };
        case 'detail':
            const detailName = getContextName(pathMatch, context);
            return {
                title: typeof section.detail?.title === 'function' ? section.detail.title(detailName) : section.detail?.title || detailName,
                description: section.detail?.description
            };
        case 'edit':
            const editName = getContextName(pathMatch, context);
            return {
                title: typeof section.edit?.title === 'function' ? section.edit.title(editName) : section.edit?.title || `Chỉnh sửa ${editName}`,
                description: section.edit?.description
            };
        default:
            return {
                title: section.name,
                description: section.list?.description
            };
    }
}
// 6. Helper function to get context name for parameters
function getContextName(pathMatch, context) {
    if (!pathMatch.params) return 'Chi tiết';
    // Priority 1: Use name from context (best UX)
    // Example: "Bùi My" instead of "NV027"
    const contextName = context?.fullName || context?.name || context?.title || context?.displayName;
    if (contextName) return contextName;
    // Priority 2: Use ID code from context
    // Example: "NV027" from employee.id
    if (context?.id) return context.id;
    // Priority 3: Extract ID from URL params
    const id = pathMatch.params.id || pathMatch.params.periodId || pathMatch.params.systemId;
    if (id) {
        // Format based on ID pattern
        if (id.startsWith('ORD')) return `Đơn hàng #${id}`;
        if (id.startsWith('CUST')) return `Khách hàng #${id}`;
        if (id.startsWith('NV')) return id; // Employee code: NV001, NV027
        if (id.startsWith('PO')) return `Đơn mua #${id}`;
        return id; // Default: return as-is
    }
    return 'Chi tiết';
}
function getBackPath(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    // Remove last segment for back navigation
    if (segments.length <= 1) {
        return '/dashboard';
    }
    // Handle special cases
    if (pathname.endsWith('/edit') || pathname.endsWith('/new')) {
        // Remove last two segments for edit/new actions
        return '/' + segments.slice(0, -1).join('/');
    }
    // Remove last segment
    return '/' + segments.slice(0, -1).join('/');
}
function shouldShowBackButton(pathname) {
    return pathname !== '/dashboard' && pathname !== '/';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/page-header-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageHeaderProvider",
    ()=>PageHeaderProvider,
    "usePageHeader",
    ()=>usePageHeader,
    "usePageHeaderContext",
    ()=>usePageHeaderContext,
    "usePageHeaderDispatch",
    ()=>usePageHeaderDispatch,
    "usePageHeaderState",
    ()=>usePageHeaderState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/breadcrumb-system.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
;
;
;
const PageHeaderStateContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](null);
const PageHeaderDispatchContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](null);
function PageHeaderProvider({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pageHeader, setPageHeaderState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    // Auto-clear on route change (optional - can be disabled)
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PageHeaderProvider.useEffect": ()=>{
        // Don't auto-clear, let pages set their own headers
        // setPageHeaderState({});
        }
    }["PageHeaderProvider.useEffect"], [
        pathname
    ]);
    const setPageHeader = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "PageHeaderProvider.useCallback[setPageHeader]": (state)=>{
            setPageHeaderState({
                "PageHeaderProvider.useCallback[setPageHeader]": (prev)=>{
                    // Auto-generate breadcrumb if not provided
                    let breadcrumb = state.breadcrumb;
                    if (!breadcrumb) {
                        breadcrumb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateBreadcrumb"])(pathname, state.context);
                    } else {
                        // ✨ Transform route metadata breadcrumb format
                        // Convert: ['Nhân viên', 'Chi tiết'] or [{ label: 'Nhân viên', href: '/employees' }, 'Chi tiết']
                        // To: [{ label: 'Nhân viên', href: '/employees', isCurrent: false }, { label: 'Chi tiết', href: pathname, isCurrent: true }]
                        breadcrumb = breadcrumb.map({
                            "PageHeaderProvider.useCallback[setPageHeader]": (item, index)=>{
                                if (typeof item === 'string') {
                                    return {
                                        label: item,
                                        href: pathname,
                                        isCurrent: index === breadcrumb.length - 1
                                    };
                                }
                                return {
                                    ...item,
                                    isCurrent: index === breadcrumb.length - 1
                                };
                            }
                        }["PageHeaderProvider.useCallback[setPageHeader]"]);
                    }
                    // Auto-generate title if not provided
                    let title = state.title;
                    if (!title) {
                        const pageTitle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$system$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generatePageTitle"])(pathname, state.context);
                        title = pageTitle.title;
                    }
                    // Auto back handler if not provided
                    let onBack = state.onBack;
                    if (!onBack && state.showBackButton !== false) {
                        onBack = ({
                            "PageHeaderProvider.useCallback[setPageHeader]": ()=>{
                                if (state.backPath) {
                                    router.push(state.backPath);
                                } else {
                                    router.back();
                                }
                            }
                        })["PageHeaderProvider.useCallback[setPageHeader]"];
                    }
                    // ✅ KHÔNG spread prev để tránh giữ lại state cũ (như badge)
                    return {
                        ...state,
                        breadcrumb,
                        title,
                        onBack
                    };
                }
            }["PageHeaderProvider.useCallback[setPageHeader]"]);
        }
    }["PageHeaderProvider.useCallback[setPageHeader]"], [
        pathname,
        router
    ]);
    const clearPageHeader = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "PageHeaderProvider.useCallback[clearPageHeader]": ()=>{
            setPageHeaderState({});
        }
    }["PageHeaderProvider.useCallback[clearPageHeader]"], []);
    const dispatchValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PageHeaderProvider.useMemo[dispatchValue]": ()=>({
                setPageHeader,
                clearPageHeader
            })
    }["PageHeaderProvider.useMemo[dispatchValue]"], [
        setPageHeader,
        clearPageHeader
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PageHeaderDispatchContext.Provider, {
        value: dispatchValue,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PageHeaderStateContext.Provider, {
            value: pageHeader,
            children: children
        }, void 0, false, {
            fileName: "[project]/contexts/page-header-context.tsx",
            lineNumber: 123,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/contexts/page-header-context.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_s(PageHeaderProvider, "uOfDO1HBkU1tVG2Fdy/97ooF4QM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PageHeaderProvider;
function usePageHeaderState() {
    _s1();
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](PageHeaderStateContext);
    if (!context) {
        throw new Error('usePageHeaderState must be used within PageHeaderProvider');
    }
    return context;
}
_s1(usePageHeaderState, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function usePageHeaderDispatch() {
    _s2();
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](PageHeaderDispatchContext);
    if (!context) {
        throw new Error('usePageHeaderDispatch must be used within PageHeaderProvider');
    }
    return context;
}
_s2(usePageHeaderDispatch, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function usePageHeaderContext() {
    _s3();
    const state = usePageHeaderState();
    const dispatch = usePageHeaderDispatch();
    return {
        pageHeader: state,
        ...dispatch
    };
}
_s3(usePageHeaderContext, "vRwVMAMXcbWdQAbD0qOvCDQ3xh4=", false, function() {
    return [
        usePageHeaderState,
        usePageHeaderDispatch
    ];
});
function usePageHeader(config) {
    _s4();
    const { setPageHeader, clearPageHeader } = usePageHeaderDispatch();
    const configRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](config);
    // Update ref without causing re-render
    configRef.current = config;
    // Create a serializable fingerprint of the config
    const configFingerprint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "usePageHeader.useMemo[configFingerprint]": ()=>{
            const currentConfig = config;
            // Helper to recursively extract text from React elements
            const extractText = {
                "usePageHeader.useMemo[configFingerprint].extractText": (node)=>{
                    if (!node) return '';
                    if (typeof node === 'string' || typeof node === 'number') return String(node);
                    if (Array.isArray(node)) return node.map(extractText).join('');
                    if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](node)) {
                        return extractText(node.props.children);
                    }
                    if (typeof node === 'object' && 'props' in node) {
                        return extractText(node.props?.children);
                    }
                    return '';
                }
            }["usePageHeader.useMemo[configFingerprint].extractText"];
            const extractTextFromActions = {
                "usePageHeader.useMemo[configFingerprint].extractTextFromActions": (actions)=>{
                    if (!actions) return '';
                    const actionsArray = Array.isArray(actions) ? actions : [
                        actions
                    ];
                    return actionsArray.map({
                        "usePageHeader.useMemo[configFingerprint].extractTextFromActions": (node)=>{
                            if (!/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](node)) return extractText(node);
                            const props = node.props;
                            return `${extractText(node)}|${props.disabled}|${props.hidden}|${node.key}`;
                        }
                    }["usePageHeader.useMemo[configFingerprint].extractTextFromActions"]).join('||');
                }
            }["usePageHeader.useMemo[configFingerprint].extractTextFromActions"];
            return currentConfig ? JSON.stringify({
                title: typeof currentConfig.title === 'string' ? currentConfig.title : extractText(currentConfig.title),
                subtitle: currentConfig.subtitle,
                showBackButton: currentConfig.showBackButton,
                backPath: currentConfig.backPath,
                actionsText: extractTextFromActions(currentConfig.actions),
                breadcrumb: currentConfig.breadcrumb,
                badgeKey: /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](currentConfig.badge) ? currentConfig.badge.key : undefined,
                context: currentConfig.context,
                docLink: currentConfig.docLink
            }) : 'EMPTY';
        }
    }["usePageHeader.useMemo[configFingerprint]"], [
        config
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "usePageHeader.useEffect": ()=>{
            const currentConfig = configRef.current;
            if (currentConfig) {
                setPageHeader(currentConfig);
            }
        }
    }["usePageHeader.useEffect"], [
        configFingerprint,
        setPageHeader
    ]);
    return {
        setPageHeader,
        clearPageHeader
    };
}
_s4(usePageHeader, "TWuETLTi2G559yiMnKY0QXbuY9w=", false, function() {
    return [
        usePageHeaderDispatch
    ];
});
var _c;
__turbopack_context__.k.register(_c, "PageHeaderProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/sonner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
;
const Toaster = ({ ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
        className: "toaster group",
        toastOptions: {
            classNames: {
                toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                description: "group-[.toast]:text-muted-foreground",
                actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
            }
        },
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sonner.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Toaster;
;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/query-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "queryClient",
    ()=>queryClient,
    "queryKeys",
    ()=>queryKeys
]);
/**
 * React Query Configuration
 * Centralized configuration for @tanstack/react-query
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
;
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            // Stale time: 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache time: 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 3 times
            retry: 3,
            // Retry delay with exponential backoff
            retryDelay: (attemptIndex)=>Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus (useful for real-time updates)
            refetchOnWindowFocus: false,
            // Refetch on mount if data is stale
            refetchOnMount: true,
            // Refetch on reconnect
            refetchOnReconnect: true
        },
        mutations: {
            // Retry failed mutations 1 time
            retry: 1,
            // Show error notifications
            onError: (error)=>{
                console.error('Mutation error:', error);
            }
        }
    }
});
const queryKeys = {
    // Employee queries
    employees: {
        all: [
            'employees'
        ],
        lists: ()=>[
                ...queryKeys.employees.all,
                'list'
            ],
        list: (filters)=>[
                ...queryKeys.employees.lists(),
                {
                    filters
                }
            ],
        details: ()=>[
                ...queryKeys.employees.all,
                'detail'
            ],
        detail: (id)=>[
                ...queryKeys.employees.details(),
                id
            ]
    },
    // Customer queries
    customers: {
        all: [
            'customers'
        ],
        lists: ()=>[
                ...queryKeys.customers.all,
                'list'
            ],
        list: (filters)=>[
                ...queryKeys.customers.lists(),
                {
                    filters
                }
            ],
        details: ()=>[
                ...queryKeys.customers.all,
                'detail'
            ],
        detail: (id)=>[
                ...queryKeys.customers.details(),
                id
            ]
    },
    // Product queries
    products: {
        all: [
            'products'
        ],
        lists: ()=>[
                ...queryKeys.products.all,
                'list'
            ],
        list: (filters)=>[
                ...queryKeys.products.lists(),
                {
                    filters
                }
            ],
        details: ()=>[
                ...queryKeys.products.all,
                'detail'
            ],
        detail: (id)=>[
                ...queryKeys.products.details(),
                id
            ]
    },
    // Supplier queries
    suppliers: {
        all: [
            'suppliers'
        ],
        lists: ()=>[
                ...queryKeys.suppliers.all,
                'list'
            ],
        list: (filters)=>[
                ...queryKeys.suppliers.lists(),
                {
                    filters
                }
            ],
        details: ()=>[
                ...queryKeys.suppliers.all,
                'detail'
            ],
        detail: (id)=>[
                ...queryKeys.suppliers.details(),
                id
            ]
    },
    // Branch queries
    branches: {
        all: [
            'branches'
        ],
        lists: ()=>[
                ...queryKeys.branches.all,
                'list'
            ],
        list: (filters)=>[
                ...queryKeys.branches.lists(),
                {
                    filters
                }
            ]
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/breakpoint-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/providers/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-client] (ecmascript)");
// TEMPORARILY DISABLED: ApiSyncProvider gây chậm compile vì import 60+ stores
// import { ApiSyncProvider } from '@/hooks/api/sync'
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sonner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/sonner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/query-client.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryClient"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BreakpointProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageHeaderProvider"], {
                            children: [
                                children,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sonner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {}, void 0, false, {
                                    fileName: "[project]/app/providers.tsx",
                                    lineNumber: 25,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/providers.tsx",
                            lineNumber: 23,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/providers.tsx",
                        lineNumber: 20,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/providers.tsx",
                    lineNumber: 19,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/providers.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/providers.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_3c09f218._.js.map