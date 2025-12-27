module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/features/settings/appearance/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getInitialAppearanceState",
    ()=>getInitialAppearanceState,
    "useAppearanceStore",
    ()=>useAppearanceStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
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
const useAppearanceStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
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
}),
"[project]/components/theme-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/appearance/store.ts [app-ssr] (ecmascript)");
;
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
    const customThemeConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppearanceStore"])((s)=>s.customThemeConfig);
    const colorMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppearanceStore"])((s)=>s.colorMode);
    const fontSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppearanceStore"])((s)=>s.fontSize);
    // Apply theme whenever store values change
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!customThemeConfig) return;
        applyTheme(customThemeConfig, colorMode, fontSize);
    }, [
        customThemeConfig,
        colorMode,
        fontSize
    ]);
    // Subscribe to store rehydration and apply theme
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        // Apply immediately with current store values
        const state = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppearanceStore"].getState();
        if (state.customThemeConfig) {
            applyTheme(state.customThemeConfig, state.colorMode, state.fontSize);
        }
        // Also subscribe to any changes (including rehydration)
        const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$appearance$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAppearanceStore"].subscribe((state)=>{
            if (state.customThemeConfig) {
                applyTheme(state.customThemeConfig, state.colorMode, state.fontSize);
            }
        });
        return unsubscribe;
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/contexts/breakpoint-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BreakpointProvider",
    ()=>BreakpointProvider,
    "useBreakpoint",
    ()=>useBreakpoint,
    "withBreakpoint",
    ()=>withBreakpoint
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const BreakpointContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](undefined);
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
    const [width, setWidth] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](()=>("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 1024);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        let timeout = null;
        const handleResize = ()=>{
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(()=>{
                setWidth(window.innerWidth);
            }, debounceMs);
        };
        window.addEventListener('resize', handleResize);
        return ()=>{
            if (timeout) clearTimeout(timeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [
        debounceMs
    ]);
    const breakpoint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>getBreakpoint(width), [
        width
    ]);
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            breakpoint,
            isMobile: breakpoint === "mobile",
            isTablet: breakpoint === "tablet",
            isDesktop: breakpoint === "desktop" || breakpoint === "wide",
            isWide: breakpoint === "wide",
            width
        }), [
        breakpoint,
        width
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BreakpointContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/breakpoint-context.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
function useBreakpoint() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"](BreakpointContext);
    if (context === undefined) {
        throw new Error('useBreakpoint must be used within BreakpointProvider');
    }
    return context;
}
function withBreakpoint(Component) {
    return (props)=>{
        const breakpoint = useBreakpoint();
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
            ...props,
            ...breakpoint
        }, void 0, false, {
            fileName: "[project]/contexts/breakpoint-context.tsx",
            lineNumber: 120,
            columnNumber: 12
        }, this);
    };
}
}),
"[project]/lib/settings-cache.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/settings-cache.ts [app-ssr] (ecmascript)");
;
;
;
;
const AuthContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](null);
// In-memory user cache
let cachedUser = null;
function AuthProvider({ children }) {
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    // REMOVED: Heavy store import - use employee from session instead
    // const { data: employees } = useEmployeeStore();
    const [user, setUser] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](cachedUser);
    const isLoading = status === 'loading';
    // Load general settings when authenticated
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (status === 'authenticated') {
            // Load settings from database into cache
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadGeneralSettings"])().catch(console.error);
        } else if (status === 'unauthenticated') {
            // Clear settings cache on logout
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearGeneralSettingsCache"])();
        }
    }, [
        status
    ]);
    // Sync user from NextAuth session
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
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
    }, [
        session,
        status
    ]);
    // Find employee based on email or employeeId
    // SIMPLIFIED: Use employee from session directly instead of store lookup
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!user) return null;
        // Use employee from user data if available (from NextAuth session)
        if (user.employee) return user.employee;
        // Return null - employee lookup should be done by components that need it
        return null;
    }, [
        user
    ]);
    // Logout via NextAuth
    const logout = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])({
                redirect: false
            });
            cachedUser = null;
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }, []);
    // Refresh user - just trigger session refresh
    const refreshUser = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async ()=>{
    // NextAuth session will be refreshed automatically
    // This is a no-op placeholder for compatibility
    }, []);
    const updateUser = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((updates)=>{
        setUser((prev)=>{
            if (!prev) return null;
            const updated = {
                ...prev,
                ...updates
            };
            cachedUser = updated;
            return updated;
        });
    }, []);
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            user,
            employee,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'ADMIN' || user?.role === 'admin',
            isLoading,
            logout,
            updateUser,
            refreshUser
        }), [
        user,
        employee,
        isLoading,
        logout,
        updateUser,
        refreshUser
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/auth-context.tsx",
        lineNumber: 133,
        columnNumber: 10
    }, this);
}
function useAuth() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"](AuthContext);
    if (!context) {
        // Development warning
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
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
}),
"[project]/components/providers/auth-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function AuthProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SessionProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/components/providers/auth-provider.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Smart Prefix System
 * Mapping entity types to their unique prefixes
 */ __turbopack_context__.s([
    "ENTITY_PREFIXES",
    ()=>ENTITY_PREFIXES,
    "getAllEntityTypes",
    ()=>getAllEntityTypes,
    "getEntityTypeFromPrefix",
    ()=>getEntityTypeFromPrefix,
    "getPrefix",
    ()=>getPrefix,
    "isValidEntityType",
    ()=>isValidEntityType
]);
const ENTITY_PREFIXES = {
    // ========================================
    // NHÂN SỰ & TỔ CHỨC (HR & ORGANIZATION)
    // ========================================
    'employees': 'NV',
    'departments': 'PB',
    'branches': 'CN',
    'job-titles': 'CV',
    // ========================================
    // KHÁCH HÀNG & ĐỐI TÁC (CUSTOMERS & PARTNERS)
    // ========================================
    'customers': 'KH',
    'suppliers': 'NCC',
    'shipping-partners': 'DVVC',
    // ========================================
    // SẢN PHẨM & KHO (PRODUCTS & INVENTORY)
    // ========================================
    'products': 'SP',
    'brands': 'TH',
    'categories': 'DM',
    'units': 'DVT',
    'stock-locations': 'KHO',
    'inventory-receipts': 'NK',
    'inventory-checks': 'PKK',
    'stock-transfers': 'PCK',
    'stock-history': 'LS',
    // ========================================
    // BÁN HÀNG (SALES)
    // ========================================
    'orders': 'DH',
    'sales-returns': 'TH',
    'sales-channels': 'KENH',
    'shipments': 'VC',
    // ========================================
    // MUA HÀNG (PURCHASING)
    // ========================================
    'purchase-orders': 'PO',
    'purchase-returns': 'TM',
    // ========================================
    // TÀI CHÍNH (FINANCE)
    // ========================================
    'receipts': 'PT',
    'payments': 'PC',
    'voucher-receipt': 'PT',
    'voucher-payment': 'PC',
    'cashbook': 'SCT',
    'reconciliation': 'DT',
    // Cài đặt tài chính
    'receipt-types': 'LT',
    'payment-types': 'LC',
    'cash-accounts': 'TK',
    'payment-methods': 'PTTT',
    'pricing-settings': 'GIA',
    'taxes': 'TAX',
    // ========================================
    // LƯƠNG & NHÂN SỰ (PAYROLL & HR)
    // ========================================
    'payroll': 'BL',
    'payslips': 'PL',
    'payroll-audit-log': 'PAL',
    'payroll-templates': 'BTP',
    'penalties': 'PF',
    'leaves': 'PN',
    'attendance': 'CC',
    'duty-schedule': 'PC',
    // ========================================
    // KPI & MỤC TIÊU (KPI & TARGETS)
    // ========================================
    'kpi': 'KPI',
    'target-groups': 'NHOM',
    'other-targets': 'MT',
    // ========================================
    // CÔNG VIỆC & DỊCH VỤ (TASKS & SERVICES)
    // ========================================
    'internal-tasks': 'CVNB',
    'task-templates': 'TMPL',
    'custom-fields': 'FIELD',
    'warranty': 'BH',
    'complaints': 'PKN',
    // ========================================
    // CÀI ĐẶT & DANH MỤC (SETTINGS & CATEGORIES)
    // ========================================
    'provinces': 'TP',
    'districts': 'QH',
    'wards': 'PX',
    'wiki': 'TL',
    'packaging': 'DG',
    'audit-log': 'LOG',
    // ========================================
    // CÀI ĐẶT KHÁCH HÀNG (CUSTOMER SETTINGS)
    // ========================================
    'customer-types': 'LKH',
    'customer-groups': 'NHKH',
    'customer-sources': 'NKH',
    'payment-terms': 'HTTT',
    'credit-ratings': 'XHTD',
    'lifecycle-stages': 'GDL',
    'sla-settings': 'SLA',
    // ========================================
    // CÀI ĐẶT NHÂN VIÊN (EMPLOYEE SETTINGS)
    // ========================================
    'employee-types': 'LNV',
    'employee-statuses': 'TTNV',
    'contract-types': 'LHD',
    'work-shifts': 'CA',
    'leave-types': 'LP',
    'salary-components': 'SC',
    // ========================================
    // CÀI ĐẶT KHÁC (OTHER SETTINGS)
    // ========================================
    'settings': 'CFG',
    // ========================================
    // AUTHENTICATION & USERS
    // ========================================
    'users': 'USER',
    // ========================================
    // PKGX INTEGRATION (phukiengiaxuong.com.vn)
    // ========================================
    'pkgx-categories': 'PKGXCAT',
    'pkgx-brands': 'PKGXBRAND',
    'pkgx-category-mappings': 'CATMAP',
    'pkgx-brand-mappings': 'BRANDMAP',
    'pkgx-price-mappings': 'PRICEMAP',
    'pkgx-sync-logs': 'PKGXLOG'
};
function getPrefix(entityType) {
    return ENTITY_PREFIXES[entityType];
}
function getAllEntityTypes() {
    return Object.keys(ENTITY_PREFIXES);
}
function isValidEntityType(entityType) {
    return entityType in ENTITY_PREFIXES;
}
function getEntityTypeFromPrefix(prefix) {
    const entry = Object.entries(ENTITY_PREFIXES).find(([_, p])=>p === prefix);
    return entry ? entry[0] : null;
}
}),
"[project]/lib/id-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ID_CONFIG",
    ()=>ID_CONFIG,
    "allowsCustomId",
    ()=>allowsCustomId,
    "createBusinessId",
    ()=>createBusinessId,
    "createSystemId",
    ()=>createSystemId,
    "exportConfig",
    ()=>exportConfig,
    "formatCounterInfo",
    ()=>formatCounterInfo,
    "getCategoryLabel",
    ()=>getCategoryLabel,
    "getEntitiesByCategory",
    ()=>getEntitiesByCategory,
    "getEntityCategories",
    ()=>getEntityCategories,
    "getEntityConfig",
    ()=>getEntityConfig,
    "getIDSystemStats",
    ()=>getIDSystemStats,
    "getStoreFactoryEntities",
    ()=>getStoreFactoryEntities,
    "getTotalEntityCount",
    ()=>getTotalEntityCount,
    "searchEntities",
    ()=>searchEntities,
    "validateIdFormat",
    ()=>validateIdFormat
]);
/**
 * ⚡ ENTERPRISE ID MANAGEMENT SYSTEM v2.0
 * 
 * SINGLE SOURCE OF TRUTH - Synced with smart-prefix.ts
 * 
 * Features:
 * - 60+ entity configurations
 * - TypeScript branded types (SystemId, BusinessId)
 * - Category grouping for UI
 * - Validation rules
 * - Store factory integration
 * - Backward compatibility
 * 
 * @version 2.0.0
 * @date 2025-11-10
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
;
function createSystemId(id) {
    return id;
}
function createBusinessId(id) {
    return id;
}
function formatCounterInfo(entityType, counters) {
    const config = ID_CONFIG[entityType];
    if (!config) {
        throw new Error(`Unknown entity type: ${entityType}`);
    }
    const currentBusinessCounter = Math.max(0, counters?.business ?? 0);
    const currentSystemCounter = Math.max(0, counters?.system ?? currentBusinessCounter);
    const nextBusinessCounter = currentBusinessCounter + 1;
    const nextSystemCounter = currentSystemCounter + 1;
    const paddedBusiness = String(nextBusinessCounter).padStart(config.digitCount, '0');
    const paddedSystem = String(nextSystemCounter).padStart(config.digitCount, '0');
    return {
        currentBusinessCounter,
        currentSystemCounter,
        nextBusinessId: createBusinessId(`${config.prefix}${paddedBusiness}`),
        nextSystemId: createSystemId(`${config.systemIdPrefix}${paddedSystem}`),
        digitCount: config.digitCount,
        prefix: config.prefix,
        systemIdPrefix: config.systemIdPrefix,
        displayName: config.displayName
    };
}
const ID_CONFIG = {
    // ========================================
    // 👥 HR & ORGANIZATION (NHÂN SỰ)
    // ========================================
    'employees': {
        entityType: 'employees',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employees'],
        systemIdPrefix: 'EMP',
        digitCount: 6,
        displayName: 'Nhân viên',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'departments': {
        entityType: 'departments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['departments'],
        systemIdPrefix: 'DEPT',
        digitCount: 6,
        displayName: 'Phòng ban',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'branches': {
        entityType: 'branches',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['branches'],
        systemIdPrefix: 'BRANCH',
        digitCount: 6,
        displayName: 'Chi nhánh',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'job-titles': {
        entityType: 'job-titles',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['job-titles'],
        systemIdPrefix: 'JOB',
        digitCount: 6,
        displayName: 'Chức vụ',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'attendance': {
        entityType: 'attendance',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['attendance'],
        systemIdPrefix: 'ATTEND',
        digitCount: 6,
        displayName: 'Chấm công',
        category: 'hr',
        usesStoreFactory: false
    },
    'duty-schedule': {
        entityType: 'duty-schedule',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['duty-schedule'],
        systemIdPrefix: 'DUTY',
        digitCount: 6,
        displayName: 'Phân công',
        category: 'hr',
        notes: 'Prefix conflict with "payments" (PC)'
    },
    'payroll': {
        entityType: 'payroll',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll'],
        systemIdPrefix: 'PAYROLL',
        digitCount: 6,
        displayName: 'Bảng lương',
        category: 'hr',
        usesStoreFactory: false
    },
    'payslips': {
        entityType: 'payslips',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payslips'],
        systemIdPrefix: 'PAYSLIP',
        digitCount: 6,
        displayName: 'Phiếu lương',
        category: 'hr',
        usesStoreFactory: false,
        notes: 'Sinh từ payroll batch store'
    },
    'payroll-audit-log': {
        entityType: 'payroll-audit-log',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll-audit-log'],
        systemIdPrefix: 'PAYROLLLOG',
        digitCount: 6,
        displayName: 'Nhật ký payroll',
        category: 'hr',
        usesStoreFactory: false
    },
    'payroll-templates': {
        entityType: 'payroll-templates',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll-templates'],
        systemIdPrefix: 'PAYTPL',
        digitCount: 6,
        displayName: 'Mẫu bảng lương',
        category: 'hr',
        usesStoreFactory: false,
        notes: 'Dùng cho trang template payroll Phase 3'
    },
    'penalties': {
        entityType: 'penalties',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['penalties'],
        systemIdPrefix: 'PENALTY',
        digitCount: 6,
        displayName: 'Phiếu phạt',
        category: 'hr',
        usesStoreFactory: true
    },
    'leaves': {
        entityType: 'leaves',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['leaves'],
        systemIdPrefix: 'LEAVE',
        digitCount: 6,
        displayName: 'Nghỉ phép',
        category: 'hr',
        usesStoreFactory: true
    },
    // ========================================
    // 👤 CUSTOMERS & PARTNERS (KHÁCH HÀNG)
    // ========================================
    'customers': {
        entityType: 'customers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customers'],
        systemIdPrefix: 'CUSTOMER',
        digitCount: 6,
        displayName: 'Khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'suppliers': {
        entityType: 'suppliers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['suppliers'],
        systemIdPrefix: 'SUPPLIER',
        digitCount: 6,
        displayName: 'Nhà cung cấp',
        category: 'purchasing',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'shipping-partners': {
        entityType: 'shipping-partners',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['shipping-partners'],
        systemIdPrefix: 'SHIPPING',
        digitCount: 6,
        displayName: 'Đơn vị vận chuyển',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    // ========================================
    // 📦 PRODUCTS & INVENTORY (SẢN PHẨM & KHO)
    // ========================================
    'products': {
        entityType: 'products',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['products'],
        systemIdPrefix: 'PRODUCT',
        digitCount: 6,
        displayName: 'Sản phẩm',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'brands': {
        entityType: 'brands',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['brands'],
        systemIdPrefix: 'BRAND',
        digitCount: 6,
        displayName: 'Thương hiệu',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'categories': {
        entityType: 'categories',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['categories'],
        systemIdPrefix: 'CATEGORY',
        digitCount: 6,
        displayName: 'Danh mục',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'units': {
        entityType: 'units',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['units'],
        systemIdPrefix: 'UNIT',
        digitCount: 6,
        displayName: 'Đơn vị tính',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'stock-locations': {
        entityType: 'stock-locations',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-locations'],
        systemIdPrefix: 'STOCK',
        digitCount: 6,
        displayName: 'Vị trí kho',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'inventory-receipts': {
        entityType: 'inventory-receipts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['inventory-receipts'],
        systemIdPrefix: 'INVRECEIPT',
        digitCount: 6,
        displayName: 'Nhập kho',
        category: 'inventory',
        usesStoreFactory: true
    },
    'inventory-checks': {
        entityType: 'inventory-checks',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['inventory-checks'],
        systemIdPrefix: 'INVCHECK',
        digitCount: 6,
        displayName: 'Phiếu kiểm kho',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'stock-transfers': {
        entityType: 'stock-transfers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-transfers'],
        systemIdPrefix: 'TRANSFER',
        digitCount: 6,
        displayName: 'Phiếu chuyển kho',
        category: 'inventory',
        usesStoreFactory: true,
        notes: 'systemId: TRANSFER000001, Business ID: PCK000001'
    },
    'stock-history': {
        entityType: 'stock-history',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-history'],
        systemIdPrefix: 'HISTORY',
        digitCount: 6,
        displayName: 'Lịch sử kho',
        category: 'inventory',
        usesStoreFactory: false
    },
    // ========================================
    // 🛒 SALES (BÁN HÀNG)
    // ========================================
    'orders': {
        entityType: 'orders',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['orders'],
        systemIdPrefix: 'ORDER',
        digitCount: 6,
        displayName: 'Đơn hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'sales-returns': {
        entityType: 'sales-returns',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sales-returns'],
        systemIdPrefix: 'RETURN',
        digitCount: 6,
        displayName: 'Trả hàng',
        category: 'sales',
        usesStoreFactory: true
    },
    'sales-channels': {
        entityType: 'sales-channels',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sales-channels'],
        systemIdPrefix: 'CHANNEL',
        digitCount: 6,
        displayName: 'Kênh bán hàng',
        category: 'sales',
        usesStoreFactory: true
    },
    'shipments': {
        entityType: 'shipments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['shipments'],
        systemIdPrefix: 'SHIPMENT',
        digitCount: 6,
        displayName: 'Vận chuyển',
        category: 'sales',
        usesStoreFactory: false
    },
    // ========================================
    // 🏭 PURCHASING (MUA HÀNG)
    // ========================================
    'purchase-orders': {
        entityType: 'purchase-orders',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['purchase-orders'],
        systemIdPrefix: 'PURCHASE',
        digitCount: 6,
        displayName: 'Đơn mua hàng',
        category: 'purchasing',
        usesStoreFactory: true
    },
    'purchase-returns': {
        entityType: 'purchase-returns',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['purchase-returns'],
        systemIdPrefix: 'PRETURN',
        digitCount: 6,
        displayName: 'Trả hàng NCC',
        category: 'purchasing',
        usesStoreFactory: true
    },
    // ========================================
    // 💰 FINANCE (TÀI CHÍNH)
    // ========================================
    'receipts': {
        entityType: 'receipts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['receipts'],
        systemIdPrefix: 'RECEIPT',
        digitCount: 6,
        displayName: 'Phiếu thu',
        category: 'finance',
        usesStoreFactory: true
    },
    'payments': {
        entityType: 'payments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payments'],
        systemIdPrefix: 'PAYMENT',
        digitCount: 6,
        displayName: 'Phiếu chi',
        category: 'finance',
        usesStoreFactory: true
    },
    'voucher-receipt': {
        entityType: 'voucher-receipt',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['voucher-receipt'],
        systemIdPrefix: 'RECEIPT',
        digitCount: 6,
        displayName: 'Phiếu thu (Voucher)',
        category: 'finance',
        usesStoreFactory: true,
        notes: 'Alias dùng cho các workflow voucher-only hoặc màn hình tổng hợp phiếu thu/chi.'
    },
    'voucher-payment': {
        entityType: 'voucher-payment',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['voucher-payment'],
        systemIdPrefix: 'PAYMENT',
        digitCount: 6,
        displayName: 'Phiếu chi (Voucher)',
        category: 'finance',
        usesStoreFactory: true,
        notes: 'Alias dùng cho các workflow voucher-only hoặc màn hình tổng hợp phiếu thu/chi.'
    },
    'cashbook': {
        entityType: 'cashbook',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['cashbook'],
        systemIdPrefix: 'CASHBOOK',
        digitCount: 6,
        displayName: 'Sổ quỹ tiền mặt',
        category: 'finance',
        usesStoreFactory: false
    },
    'reconciliation': {
        entityType: 'reconciliation',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['reconciliation'],
        systemIdPrefix: 'RECON',
        digitCount: 6,
        displayName: 'Đối chiếu',
        category: 'finance',
        usesStoreFactory: false
    },
    // Finance Settings
    'receipt-types': {
        entityType: 'receipt-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['receipt-types'],
        systemIdPrefix: 'RECTYPE',
        digitCount: 6,
        displayName: 'Loại thu',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'payment-types': {
        entityType: 'payment-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-types'],
        systemIdPrefix: 'PAYTYPE',
        digitCount: 6,
        displayName: 'Loại chi',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'cash-accounts': {
        entityType: 'cash-accounts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['cash-accounts'],
        systemIdPrefix: 'ACCOUNT',
        digitCount: 6,
        displayName: 'Tài khoản',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'payment-methods': {
        entityType: 'payment-methods',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-methods'],
        systemIdPrefix: 'METHOD',
        digitCount: 6,
        displayName: 'Phương thức thanh toán',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'pricing-settings': {
        entityType: 'pricing-settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pricing-settings'],
        systemIdPrefix: 'PRICING',
        digitCount: 6,
        displayName: 'Cài đặt giá',
        category: 'settings',
        usesStoreFactory: false
    },
    'taxes': {
        entityType: 'taxes',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['taxes'],
        systemIdPrefix: 'TAX',
        digitCount: 6,
        displayName: 'Thuế',
        category: 'settings',
        usesStoreFactory: true
    },
    // ========================================
    // 🎯 KPI & TARGETS (MỤC TIÊU)
    // ========================================
    'kpi': {
        entityType: 'kpi',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['kpi'],
        systemIdPrefix: 'KPI',
        digitCount: 6,
        displayName: 'KPI',
        category: 'hr',
        usesStoreFactory: false
    },
    'target-groups': {
        entityType: 'target-groups',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['target-groups'],
        systemIdPrefix: 'TARGET',
        digitCount: 6,
        displayName: 'Nhóm mục tiêu',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'other-targets': {
        entityType: 'other-targets',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['other-targets'],
        systemIdPrefix: 'OTHERTARGET',
        digitCount: 6,
        displayName: 'Mục tiêu khác',
        category: 'sales',
        usesStoreFactory: false
    },
    // ========================================
    // CUSTOMER SERVICE (DỊCH VỤ)
    // ========================================
    'internal-tasks': {
        entityType: 'internal-tasks',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['internal-tasks'],
        systemIdPrefix: 'TASK',
        digitCount: 6,
        displayName: 'Công việc nội bộ',
        category: 'system',
        usesStoreFactory: true,
        validation: {
            allowCustomId: true
        }
    },
    'task-templates': {
        entityType: 'task-templates',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['task-templates'],
        systemIdPrefix: 'TMPL',
        digitCount: 6,
        displayName: 'Mẫu công việc',
        category: 'system',
        usesStoreFactory: false
    },
    'custom-fields': {
        entityType: 'custom-fields',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['custom-fields'],
        systemIdPrefix: 'FIELD',
        digitCount: 6,
        displayName: 'Trường tùy chỉnh',
        category: 'settings',
        usesStoreFactory: false
    },
    'warranty': {
        entityType: 'warranty',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['warranty'],
        systemIdPrefix: 'WARRANTY',
        digitCount: 6,
        displayName: 'Bảo hành',
        category: 'service',
        usesStoreFactory: true,
        notes: 'systemId: WARRANTY000001, Business ID: BH000001'
    },
    'complaints': {
        entityType: 'complaints',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['complaints'],
        systemIdPrefix: 'COMPLAINT',
        digitCount: 6,
        displayName: 'Khiếu nại',
        category: 'service',
        usesStoreFactory: true,
        notes: 'systemId: COMPLAINT000001, Business ID: PKN000001'
    },
    // ========================================
    // ⚙️ SETTINGS & CATEGORIES
    // ========================================
    'provinces': {
        entityType: 'provinces',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['provinces'],
        systemIdPrefix: 'PROVINCE',
        digitCount: 6,
        displayName: 'Tỉnh/Thành phố',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'districts': {
        entityType: 'districts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['districts'],
        systemIdPrefix: 'DISTRICT',
        digitCount: 6,
        displayName: 'Quận/Huyện',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'wards': {
        entityType: 'wards',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['wards'],
        systemIdPrefix: 'WARD',
        digitCount: 6,
        displayName: 'Phường/Xã',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'wiki': {
        entityType: 'wiki',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['wiki'],
        systemIdPrefix: 'WIKI',
        digitCount: 6,
        displayName: 'Tài liệu',
        category: 'system',
        usesStoreFactory: false
    },
    'packaging': {
        entityType: 'packaging',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['packaging'],
        systemIdPrefix: 'PACKAGE',
        digitCount: 6,
        displayName: 'Đóng gói',
        category: 'inventory',
        usesStoreFactory: false
    },
    'audit-log': {
        entityType: 'audit-log',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['audit-log'],
        systemIdPrefix: 'LOG',
        digitCount: 10,
        displayName: 'Nhật ký',
        category: 'system',
        usesStoreFactory: false
    },
    // Customer Settings
    'customer-types': {
        entityType: 'customer-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-types'],
        systemIdPrefix: 'CUSTTYPE',
        digitCount: 6,
        displayName: 'Loại khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'customer-groups': {
        entityType: 'customer-groups',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-groups'],
        systemIdPrefix: 'CUSTGROUP',
        digitCount: 6,
        displayName: 'Nhóm khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'customer-sources': {
        entityType: 'customer-sources',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-sources'],
        systemIdPrefix: 'CUSTSOURCE',
        digitCount: 6,
        displayName: 'Nguồn khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'payment-terms': {
        entityType: 'payment-terms',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-terms'],
        systemIdPrefix: 'PAYTERM',
        digitCount: 6,
        displayName: 'Hình thức thanh toán',
        category: 'settings',
        usesStoreFactory: false
    },
    'credit-ratings': {
        entityType: 'credit-ratings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['credit-ratings'],
        systemIdPrefix: 'CREDIT',
        digitCount: 6,
        displayName: 'Xếp hạng tín dụng',
        category: 'settings',
        usesStoreFactory: false
    },
    'lifecycle-stages': {
        entityType: 'lifecycle-stages',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['lifecycle-stages'],
        systemIdPrefix: 'LIFECYCLE',
        digitCount: 6,
        displayName: 'Giai đoạn vòng đời khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'sla-settings': {
        entityType: 'sla-settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sla-settings'],
        systemIdPrefix: 'SLACFG',
        digitCount: 6,
        displayName: 'Cài đặt SLA khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    // Employee Settings
    'employee-types': {
        entityType: 'employee-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employee-types'],
        systemIdPrefix: 'EMPTYPE',
        digitCount: 6,
        displayName: 'Loại nhân viên',
        category: 'settings',
        usesStoreFactory: false
    },
    'employee-statuses': {
        entityType: 'employee-statuses',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employee-statuses'],
        systemIdPrefix: 'EMPSTATUS',
        digitCount: 6,
        displayName: 'Trạng thái nhân viên',
        category: 'settings',
        usesStoreFactory: false
    },
    'contract-types': {
        entityType: 'contract-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['contract-types'],
        systemIdPrefix: 'CONTRACT',
        digitCount: 6,
        displayName: 'Loại hợp đồng',
        category: 'settings',
        usesStoreFactory: false
    },
    'work-shifts': {
        entityType: 'work-shifts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['work-shifts'],
        systemIdPrefix: 'WSHIFT',
        digitCount: 6,
        displayName: 'Ca làm việc',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Dùng cho cài đặt ca làm việc & Dual ID trong attendance'
    },
    'leave-types': {
        entityType: 'leave-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['leave-types'],
        systemIdPrefix: 'LEAVETYPE',
        digitCount: 6,
        displayName: 'Loại nghỉ phép',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Quản lý danh mục phép năm/phép đặc biệt'
    },
    'salary-components': {
        entityType: 'salary-components',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['salary-components'],
        systemIdPrefix: 'SALCOMP',
        digitCount: 6,
        displayName: 'Thành phần lương',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Dùng cho cấu hình payroll engine'
    },
    // ========================================
    // 🔐 SYSTEM & AUTH
    // ========================================
    'settings': {
        entityType: 'settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['settings'],
        systemIdPrefix: 'CONFIG',
        digitCount: 6,
        displayName: 'Cấu hình',
        category: 'system',
        usesStoreFactory: false
    },
    'users': {
        entityType: 'users',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['users'],
        systemIdPrefix: 'USER',
        digitCount: 6,
        displayName: 'Người dùng',
        category: 'system',
        usesStoreFactory: false
    },
    // ========================================
    // 🌐 PKGX INTEGRATION (phukiengiaxuong.com.vn)
    // ========================================
    'pkgx-categories': {
        entityType: 'pkgx-categories',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-categories'],
        systemIdPrefix: 'PKGXCAT',
        digitCount: 6,
        displayName: 'Danh mục PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Danh mục từ website phukiengiaxuong.com.vn'
    },
    'pkgx-brands': {
        entityType: 'pkgx-brands',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-brands'],
        systemIdPrefix: 'PKGXBRAND',
        digitCount: 6,
        displayName: 'Thương hiệu PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Thương hiệu từ website phukiengiaxuong.com.vn'
    },
    'pkgx-category-mappings': {
        entityType: 'pkgx-category-mappings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-category-mappings'],
        systemIdPrefix: 'CATMAP',
        digitCount: 6,
        displayName: 'Mapping danh mục PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Mapping danh mục HRM ↔ PKGX'
    },
    'pkgx-brand-mappings': {
        entityType: 'pkgx-brand-mappings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-brand-mappings'],
        systemIdPrefix: 'BRANDMAP',
        digitCount: 6,
        displayName: 'Mapping thương hiệu PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Mapping thương hiệu HRM ↔ PKGX'
    },
    'pkgx-price-mappings': {
        entityType: 'pkgx-price-mappings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-price-mappings'],
        systemIdPrefix: 'PRICEMAP',
        digitCount: 6,
        displayName: 'Mapping giá PKGX',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Mapping bảng giá HRM → PKGX price fields'
    },
    'pkgx-sync-logs': {
        entityType: 'pkgx-sync-logs',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pkgx-sync-logs'],
        systemIdPrefix: 'PKGXLOG',
        digitCount: 6,
        displayName: 'Log đồng bộ PKGX',
        category: 'system',
        usesStoreFactory: false,
        notes: 'Lưu lịch sử đồng bộ với PKGX'
    }
};
function getEntityConfig(entityType) {
    const config = ID_CONFIG[entityType];
    if (!config) {
        throw new Error(`No configuration found for entity type: ${entityType}`);
    }
    return config;
}
function getEntitiesByCategory(category) {
    return Object.values(ID_CONFIG).filter((config)=>config.category === category).map((config)=>config.entityType);
}
function getEntityCategories() {
    const categories = {
        'hr': [],
        'finance': [],
        'inventory': [],
        'sales': [],
        'purchasing': [],
        'service': [],
        'settings': [],
        'system': []
    };
    Object.values(ID_CONFIG).forEach((config)=>{
        categories[config.category].push(config.entityType);
    });
    return categories;
}
function validateIdFormat(id, entityType) {
    const config = getEntityConfig(entityType);
    // Check prefix
    if (!id.startsWith(config.prefix)) {
        return {
            valid: false,
            error: `Invalid prefix. Expected "${config.prefix}", got "${id.slice(0, config.prefix.length)}"`
        };
    }
    // Check digit count
    const numberPart = id.substring(config.prefix.length);
    if (numberPart.length !== config.digitCount) {
        const expectedLength = config.prefix.length + config.digitCount;
        return {
            valid: false,
            error: `Invalid length. Expected ${expectedLength} characters, got ${id.length}`
        };
    }
    // Check if numeric
    if (!/^\d+$/.test(numberPart)) {
        return {
            valid: false,
            error: 'Numeric part must contain only digits'
        };
    }
    // Custom pattern validation
    if (config.validation?.pattern && !config.validation.pattern.test(id)) {
        return {
            valid: false,
            error: 'ID does not match required pattern'
        };
    }
    return {
        valid: true
    };
}
function allowsCustomId(entityType) {
    return getEntityConfig(entityType).validation?.allowCustomId ?? false;
}
function getStoreFactoryEntities() {
    return Object.values(ID_CONFIG).filter((config)=>config.usesStoreFactory === true).map((config)=>config.entityType);
}
function getCategoryLabel(category) {
    const labels = {
        'hr': 'Nhân sự & Tổ chức',
        'finance': 'Tài chính',
        'inventory': 'Kho hàng',
        'sales': 'Bán hàng',
        'purchasing': 'Mua hàng',
        'service': 'Dịch vụ khách hàng',
        'settings': 'Cài đặt',
        'system': 'Hệ thống'
    };
    return labels[category];
}
function searchEntities(query) {
    const lowerQuery = query.toLowerCase();
    return Object.values(ID_CONFIG).filter((config)=>config.displayName.toLowerCase().includes(lowerQuery) || config.prefix.toLowerCase().includes(lowerQuery) || config.entityType.includes(lowerQuery));
}
function getTotalEntityCount() {
    return Object.keys(ID_CONFIG).length;
}
function exportConfig() {
    return JSON.stringify(ID_CONFIG, null, 2);
}
function getIDSystemStats() {
    const configs = Object.values(ID_CONFIG);
    const byCategory = {};
    let storeFactoryEnabled = 0;
    let customIdAllowed = 0;
    let totalDigits = 0;
    configs.forEach((config)=>{
        // Count by category
        byCategory[config.category] = (byCategory[config.category] || 0) + 1;
        // Count features
        if (config.usesStoreFactory) storeFactoryEnabled++;
        if (config.validation?.allowCustomId) customIdAllowed++;
        totalDigits += config.digitCount;
    });
    return {
        totalEntities: configs.length,
        byCategory,
        storeFactoryEnabled,
        customIdAllowed,
        averageDigitCount: Math.round(totalDigits / configs.length * 10) / 10
    };
}
}),
"[project]/lib/breadcrumb-generator.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearBreadcrumbStores",
    ()=>clearBreadcrumbStores,
    "generateBreadcrumb",
    ()=>generateBreadcrumb,
    "generateDetailBreadcrumb",
    ()=>generateDetailBreadcrumb,
    "generateFormBreadcrumb",
    ()=>generateFormBreadcrumb,
    "getEntityDisplayInfo",
    ()=>getEntityDisplayInfo,
    "getRegisteredStores",
    ()=>getRegisteredStores,
    "registerBreadcrumbStore",
    ()=>registerBreadcrumbStore,
    "useBreadcrumb",
    ()=>useBreadcrumb
]);
/**
 * 🍞 BREADCRUMB AUTO-GENERATION SYSTEM
 * 
 * Automatically generates breadcrumbs from route metadata + entity data
 * 
 * Features:
 * - Auto-lookup entity name from systemId
 * - Falls back to route metadata if entity not found
 * - Type-safe with SystemId branded types
 * - Supports all entity types from id-config.ts
 * 
 * @example
 * ```typescript
 * // Route: /receipts/VOUCHER00000123
 * const crumbs = generateBreadcrumb(location.pathname);
 * // Result: ['Phiếu thu/chi', 'PT000051']
 * ```
 * 
 * @version 1.0.0
 * @date 2025-11-11
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-ssr] (ecmascript)");
;
let storeRegistry = {};
function registerBreadcrumbStore(entityType, getStore) {
    storeRegistry[entityType] = getStore;
}
/**
 * Find entity by systemId and return display name
 */ function findEntityDisplayName(entityType, systemId) {
    const getStore = storeRegistry[entityType];
    if (!getStore) return null;
    try {
        const store = getStore();
        const item = store.data.find((d)=>d.systemId === systemId);
        if (!item) return null;
        // Priority: name > title > id (business ID) > systemId
        return item.name || item.title || item.id || systemId;
    } catch (error) {
        console.warn(`[Breadcrumb] Failed to lookup ${entityType}:`, error);
        return null;
    }
}
function parseRouteEntity(pathname) {
    // Pattern: /{entity-type}/{systemId}
    const match = pathname.match(/^\/([^/]+)\/([^/]+)$/);
    if (!match) {
        return {
            entityType: null,
            systemId: null,
            displayName: null
        };
    }
    const [, routeType, id] = match;
    // Map route type to entity type
    const routeToEntityMap = {
        'receipts': 'voucher-receipt',
        'payments': 'voucher-payment',
        'employees': 'employees',
        'customers': 'customers',
        'products': 'products',
        'orders': 'orders',
        'suppliers': 'suppliers',
        'complaints': 'complaints',
        'warranty': 'warranty',
        'purchase-orders': 'purchase-orders',
        'sales-returns': 'sales-returns',
        'purchase-returns': 'purchase-returns',
        'inventory-checks': 'inventory-checks'
    };
    const entityType = routeToEntityMap[routeType] || null;
    if (!entityType) {
        return {
            entityType: null,
            systemId: id,
            displayName: null
        };
    }
    // Lookup display name
    const displayName = findEntityDisplayName(entityType, id);
    return {
        entityType,
        systemId: id,
        displayName
    };
}
function generateBreadcrumb(pathname, routeMeta) {
    // If route has static breadcrumb metadata, use it as base
    const baseCrumbs = routeMeta?.breadcrumb || [];
    // Try to enhance with entity data
    const entityInfo = parseRouteEntity(pathname);
    if (entityInfo.displayName) {
        // Replace last breadcrumb with entity display name
        return [
            ...baseCrumbs.slice(0, -1),
            entityInfo.displayName
        ];
    }
    // Fallback to route metadata
    return baseCrumbs;
}
function generateDetailBreadcrumb(entityType, systemId, listPageLabel) {
    const displayName = findEntityDisplayName(entityType, systemId);
    return [
        listPageLabel,
        displayName || systemId
    ];
}
function generateFormBreadcrumb(entityType, systemId, listPageLabel) {
    if (!systemId) {
        return [
            listPageLabel,
            'Thêm mới'
        ];
    }
    const displayName = findEntityDisplayName(entityType, systemId);
    return [
        listPageLabel,
        displayName || 'Chỉnh sửa'
    ];
}
function useBreadcrumb(entityType, systemId, listPageLabel) {
    if (!systemId) {
        return [
            listPageLabel,
            'Thêm mới'
        ];
    }
    return generateDetailBreadcrumb(entityType, systemId, listPageLabel);
}
function getEntityDisplayInfo(entityType) {
    try {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getEntityConfig"])(entityType);
        return {
            displayName: config.displayName,
            prefix: config.prefix,
            category: config.category
        };
    } catch  {
        return null;
    }
}
function clearBreadcrumbStores() {
    storeRegistry = {};
}
function getRegisteredStores() {
    return Object.keys(storeRegistry);
}
}),
"[project]/lib/breadcrumb-system.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateBreadcrumb",
    ()=>generateBreadcrumb,
    "generatePageTitle",
    ()=>generatePageTitle
]);
/**
 * Breadcrumb System
 * 
 * Central exports for breadcrumb functionality.
 * Re-exports from breadcrumb-generator.ts with additional types.
 */ // Re-export functions that still make sense
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/breadcrumb-generator.ts [app-ssr] (ecmascript)");
;
function generateBreadcrumb(pathname, context) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
        return [
            {
                label: 'Trang chủ',
                href: '/',
                isCurrent: true
            }
        ];
    }
    const breadcrumbs = [
        {
            label: 'Trang chủ',
            href: '/',
            isCurrent: false
        }
    ];
    let currentPath = '';
    segments.forEach((segment, index)=>{
        currentPath += `/${segment}`;
        const isLast = index === segments.length - 1;
        // Get display label for segment
        const label = getSegmentLabel(segment, context, isLast);
        breadcrumbs.push({
            label,
            href: currentPath,
            isCurrent: isLast
        });
    });
    return breadcrumbs;
}
/**
 * Get display label for a route segment
 */ function getSegmentLabel(segment, context, isLast) {
    // Check if context provides entity name
    if (context?.name && isLast) {
        return context.name;
    }
    if (context?.title && isLast) {
        return context.title;
    }
    if (context?.id && isLast) {
        return context.id;
    }
    // Route to label mapping
    const routeLabelMap = {
        // Core
        'dashboard': 'Tổng quan',
        'employees': 'Nhân viên',
        'customers': 'Khách hàng',
        'products': 'Sản phẩm',
        'orders': 'Đơn hàng',
        'suppliers': 'Nhà cung cấp',
        'receipts': 'Phiếu thu',
        'payments': 'Phiếu chi',
        'cashbook': 'Sổ quỹ',
        'purchase-orders': 'Đơn mua hàng',
        'purchase-returns': 'Trả hàng NCC',
        'sales-returns': 'Trả hàng',
        'inventory-receipts': 'Nhập kho',
        'inventory-checks': 'Kiểm kho',
        'stock-transfers': 'Chuyển kho',
        'stock-locations': 'Vị trí kho',
        'stock-history': 'Lịch sử kho',
        'cost-adjustments': 'Điều chỉnh giá vốn',
        // Settings
        'settings': 'Cài đặt',
        'store-info': 'Thông tin cửa hàng',
        'appearance': 'Giao diện',
        'taxes': 'Thuế',
        'pricing': 'Bảng giá',
        'shipping': 'Vận chuyển',
        'inventory': 'Kho hàng',
        'print-templates': 'Mẫu in',
        'employee-roles': 'Phân quyền',
        'workflow-templates': 'Quy trình',
        'id-counters': 'Mã tự động',
        'provinces': 'Tỉnh thành',
        'sales-config': 'Cấu hình bán hàng',
        'system-logs': 'Nhật ký hệ thống',
        'import-export-logs': 'Nhật ký nhập/xuất',
        // Operations
        'warranty': 'Bảo hành',
        'complaints': 'Khiếu nại',
        'tasks': 'Công việc',
        'wiki': 'Wiki',
        'shipments': 'Vận đơn',
        'packaging': 'Đóng gói',
        'attendance': 'Chấm công',
        'leaves': 'Nghỉ phép',
        'payroll': 'Bảng lương',
        // Reports
        'reports': 'Báo cáo',
        // Forms
        'new': 'Thêm mới',
        'edit': 'Chỉnh sửa',
        // Categories
        'categories': 'Danh mục',
        'brands': 'Thương hiệu'
    };
    return routeLabelMap[segment] || segment;
}
function generatePageTitle(pathname, context) {
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    const secondLastSegment = segments[segments.length - 2];
    // Check for entity display name in context
    if (context) {
        const displayName = context.name || context.title || context.id;
        if (displayName) {
            // Determine page type
            if (lastSegment === 'edit') {
                return {
                    title: `Chỉnh sửa ${displayName}`
                };
            }
            if (lastSegment === 'new') {
                const entityLabel = getSegmentLabel(secondLastSegment);
                return {
                    title: `Thêm ${entityLabel} mới`
                };
            }
            // Detail page
            return {
                title: displayName
            };
        }
    }
    // Default title from route
    const title = getSegmentLabel(lastSegment, context);
    return {
        title
    };
}
}),
"[project]/contexts/page-header-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/breadcrumb-system.ts [app-ssr] (ecmascript) <locals>");
;
;
;
;
const PageHeaderStateContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](null);
const PageHeaderDispatchContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](null);
function PageHeaderProvider({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [pageHeader, setPageHeaderState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({});
    // Auto-clear on route change (optional - can be disabled)
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
    // Don't auto-clear, let pages set their own headers
    // setPageHeaderState({});
    }, [
        pathname
    ]);
    const setPageHeader = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((state)=>{
        setPageHeaderState((prev)=>{
            // Auto-generate breadcrumb if not provided
            let breadcrumb = state.breadcrumb;
            if (!breadcrumb) {
                breadcrumb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateBreadcrumb"])(pathname, state.context);
            } else {
                // ✨ Transform route metadata breadcrumb format
                // Convert: ['Nhân viên', 'Chi tiết'] or [{ label: 'Nhân viên', href: '/employees' }, 'Chi tiết']
                // To: [{ label: 'Nhân viên', href: '/employees', isCurrent: false }, { label: 'Chi tiết', href: pathname, isCurrent: true }]
                breadcrumb = breadcrumb.map((item, index)=>{
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
                });
            }
            // Auto-generate title if not provided
            let title = state.title;
            if (!title) {
                const pageTitle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$system$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generatePageTitle"])(pathname, state.context);
                title = pageTitle.title;
            }
            // Auto back handler if not provided
            let onBack = state.onBack;
            if (!onBack && state.showBackButton !== false) {
                onBack = ()=>{
                    if (state.backPath) {
                        router.push(state.backPath);
                    } else {
                        router.back();
                    }
                };
            }
            // ✅ KHÔNG spread prev để tránh giữ lại state cũ (như badge)
            return {
                ...state,
                breadcrumb,
                title,
                onBack
            };
        });
    }, [
        pathname,
        router
    ]);
    const clearPageHeader = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setPageHeaderState({});
    }, []);
    const dispatchValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            setPageHeader,
            clearPageHeader
        }), [
        setPageHeader,
        clearPageHeader
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PageHeaderDispatchContext.Provider, {
        value: dispatchValue,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PageHeaderStateContext.Provider, {
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
function usePageHeaderState() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"](PageHeaderStateContext);
    if (!context) {
        throw new Error('usePageHeaderState must be used within PageHeaderProvider');
    }
    return context;
}
function usePageHeaderDispatch() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"](PageHeaderDispatchContext);
    if (!context) {
        throw new Error('usePageHeaderDispatch must be used within PageHeaderProvider');
    }
    return context;
}
function usePageHeaderContext() {
    const state = usePageHeaderState();
    const dispatch = usePageHeaderDispatch();
    return {
        pageHeader: state,
        ...dispatch
    };
}
function usePageHeader(config) {
    const { setPageHeader, clearPageHeader } = usePageHeaderDispatch();
    const configRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](config);
    // Update ref without causing re-render
    configRef.current = config;
    // Create a serializable fingerprint of the config
    const configFingerprint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const currentConfig = config;
        // Helper to recursively extract text from React elements
        const extractText = (node)=>{
            if (!node) return '';
            if (typeof node === 'string' || typeof node === 'number') return String(node);
            if (Array.isArray(node)) return node.map(extractText).join('');
            if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"](node)) {
                return extractText(node.props.children);
            }
            if (typeof node === 'object' && 'props' in node) {
                return extractText(node.props?.children);
            }
            return '';
        };
        const extractTextFromActions = (actions)=>{
            if (!actions) return '';
            const actionsArray = Array.isArray(actions) ? actions : [
                actions
            ];
            return actionsArray.map((node)=>{
                if (!/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"](node)) return extractText(node);
                const props = node.props;
                return `${extractText(node)}|${props.disabled}|${props.hidden}|${node.key}`;
            }).join('||');
        };
        return currentConfig ? JSON.stringify({
            title: typeof currentConfig.title === 'string' ? currentConfig.title : extractText(currentConfig.title),
            subtitle: currentConfig.subtitle,
            showBackButton: currentConfig.showBackButton,
            backPath: currentConfig.backPath,
            actionsText: extractTextFromActions(currentConfig.actions),
            breadcrumb: currentConfig.breadcrumb,
            badgeKey: /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"](currentConfig.badge) ? currentConfig.badge.key : undefined,
            context: currentConfig.context,
            docLink: currentConfig.docLink
        }) : 'EMPTY';
    }, [
        config
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const currentConfig = configRef.current;
        if (currentConfig) {
            setPageHeader(currentConfig);
        }
    }, [
        configFingerprint,
        setPageHeader
    ]);
    return {
        setPageHeader,
        clearPageHeader
    };
}
}),
"[project]/components/ui/sonner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
;
;
const Toaster = ({ ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {
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
;
}),
"[project]/lib/query-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
;
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
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
}),
"[project]/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/breakpoint-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/providers/auth-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-ssr] (ecmascript)");
// TEMPORARILY DISABLED: ApiSyncProvider gây chậm compile vì import 60+ stores
// import { ApiSyncProvider } from '@/hooks/api/sync'
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sonner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/sonner.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/query-client.ts [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["queryClient"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BreakpointProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageHeaderProvider"], {
                            children: [
                                children,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sonner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {}, void 0, false, {
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__393503a7._.js.map