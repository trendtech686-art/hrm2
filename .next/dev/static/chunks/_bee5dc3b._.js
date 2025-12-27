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
(()=>{
    const e = new Error("Cannot find module '../lib/breadcrumb-system'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
                        breadcrumb = generateBreadcrumb(pathname, state.context);
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
                        const pageTitle = generatePageTitle(pathname, state.context);
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

//# sourceMappingURL=_bee5dc3b._.js.map