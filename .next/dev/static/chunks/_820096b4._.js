(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Configuration Utilities
 * 
 * Centralized configuration for API endpoints.
 * All API URLs should use these utilities instead of hardcoding.
 */ /**
 * Get the API base URL from environment variables
 * Falls back to localhost:3001 for development
 */ __turbopack_context__.s([
    "getApiBaseUrl",
    ()=>getApiBaseUrl,
    "getApiUrl",
    ()=>getApiUrl,
    "getBaseUrl",
    ()=>getBaseUrl,
    "getFileUrl",
    ()=>getFileUrl
]);
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("lib/api-config.ts")}`;
    }
};
function getApiBaseUrl() {
    // Use relative path to leverage Vite proxy in development
    // This avoids CORS issues when frontend (5173) talks to backend (3001)
    if (__TURBOPACK__import$2e$meta__.env?.DEV) {
        return '/api';
    }
    return __TURBOPACK__import$2e$meta__.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
}
function getBaseUrl() {
    const apiUrl = getApiBaseUrl();
    return apiUrl.replace('/api', '');
}
function getFileUrl(relativePath) {
    if (!relativePath) return '';
    // If already a full URL, return as is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    // Build full URL
    const baseUrl = getBaseUrl();
    return `${baseUrl}${relativePath}`;
}
function getApiUrl(endpoint) {
    const apiBaseUrl = getApiBaseUrl();
    return `${apiBaseUrl}${endpoint}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/file-upload-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileUploadAPI",
    ()=>FileUploadAPI
]);
// API client để giao tiếp với server - Staging System
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-client] (ecmascript)");
;
const API_BASE_URL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiBaseUrl"])();
class FileUploadAPI {
    // Upload files vào staging (tạm thời)
    static async uploadToStaging(files, sessionId) {
        const formData = new FormData();
        files.forEach((file)=>{
            formData.append('files', file);
        });
        // CRITICAL FIX: sessionId in FormData doesn't work with multer
        // Send via query params instead
        const url = sessionId ? `${API_BASE_URL}/staging/upload?sessionId=${encodeURIComponent(sessionId)}` : `${API_BASE_URL}/staging/upload`;
        console.log('📤 Uploading to:', url);
        console.log('📦 Files:', files.map((f)=>`${f.name} (${(f.size / 1024).toFixed(1)}KB)`));
        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                body: formData
            });
        } catch (fetchError) {
            console.error('❌ Network fetch failed:', fetchError);
            throw new Error(`Không thể kết nối đến server (${API_BASE_URL}). Vui lòng kiểm tra server có đang chạy.`);
        }
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Server error:', response.status, errorText);
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Staging upload failed');
        }
        return {
            files: result.files,
            sessionId: result.sessionId
        };
    }
    // Confirm staging files → permanent với smart filename
    // NOTE: entitySystemId MUST be immutable (systemId) to avoid broken references
    static async confirmStagingFiles(sessionId, entitySystemId, documentType, documentName, metadata) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/${entitySystemId}/${documentType}/${encodeURIComponent(documentName)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                metadata
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm failed');
        }
        return result.files;
    }
    // Lấy staging files theo session
    static async getStagingFiles(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/files/${sessionId}`);
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch staging files');
        }
        return result.files;
    }
    // Xóa staging files (cancel)
    static async deleteStagingFiles(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/${sessionId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete staging failed');
        }
    }
    // Upload files lên server (legacy - direct permanent)
    // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
    static async uploadFiles(employeeId, documentType, documentName, files) {
        const formData = new FormData();
        files.forEach((file)=>{
            formData.append('files', file);
        });
        const response = await fetch(`${API_BASE_URL}/upload/${employeeId}/${documentType}/${encodeURIComponent(documentName)}`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Upload failed');
        }
        return result.files;
    }
    // Lấy danh sách file permanent
    // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
    static async getFiles(employeeId, documentType) {
        try {
            const url = documentType ? `${API_BASE_URL}/files/${employeeId}/${documentType}` : `${API_BASE_URL}/files/${employeeId}`;
            const response = await fetch(url);
            // Check if response is ok
            if (!response.ok) {
                return []; // Return empty array instead of throwing
            }
            const result = await response.json();
            if (!result.success) {
                return []; // Return empty array instead of throwing
            }
            return result.files || [];
        } catch (error) {
            return []; // Return empty array on network error
        }
    }
    // Xóa file permanent
    static async deleteFile(fileId) {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete failed');
        }
    }
    // Lấy URL file để hiển thị (bao gồm staging và permanent)
    static getFileUrl(file) {
        // ✅ Return relative path to use Vite proxy - avoid CORS
        // Server already returns relative path like /api/staging/files/...
        return file.url;
    }
    // Thống kê storage (chỉ permanent files)
    static async getStorageInfo() {
        const response = await fetch(`${API_BASE_URL}/storage/info`);
        const result = await response.json();
        if (!result.success) {
            throw new Error('Failed to get storage info');
        }
        return result.stats;
    }
    // Helper: Generate session ID cho staging
    static generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static async getProductFiles(productId) {
        return this.getFiles(productId, 'products');
    }
    // Get customer files (images)
    static async getCustomerFiles(customerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/customers/${customerId}`);
            if (!response.ok) {
                return [];
            }
            const result = await response.json();
            if (!result.success) {
                return [];
            }
            return result.files || [];
        } catch (error) {
            console.error('Failed to get customer files:', error);
            return [];
        }
    }
    // Get customer contract files
    static async getCustomerContractFiles(customerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/customers/${customerId}/contracts`);
            if (!response.ok) {
                return [];
            }
            const result = await response.json();
            if (!result.success) {
                return [];
            }
            return result.files || [];
        } catch (error) {
            console.error('Failed to get customer contract files:', error);
            return [];
        }
    }
    // Confirm customer contract files from staging to permanent
    static async confirmCustomerContractFiles(sessionId, customerId, customerData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/customers/${customerId}/contracts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm customer contract files failed');
        }
        return result.files;
    }
    // Confirm customer images from staging to permanent
    static async confirmCustomerImages(sessionId, customerId, customerData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/customers/${customerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm customer images failed');
        }
        return result.files;
    }
    // Confirm warranty images from staging to permanent
    static async confirmWarrantyImages(sessionId, warrantyId, imageType, warrantyData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/warranty/${warrantyId}/${imageType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                warrantyData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm warranty images failed');
        }
        return result.files;
    }
    // Delete staging session (cleanup on cancel)
    static async deleteStagingSession(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/${sessionId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete staging session failed');
        }
    }
    /**
   * Upload ảnh từ TipTap Editor vào STAGING
   * Ảnh sẽ được move sang permanent khi entity được save
   * 
   * @param file - File ảnh cần upload
   * @param sessionId - Session ID để group các ảnh cùng editor
   * @returns StagingFile với URL tạm thời
   */ static async uploadEditorImageToStaging(file, sessionId) {
        const result = await FileUploadAPI.uploadToStaging([
            file
        ], sessionId);
        return {
            file: result.files[0],
            sessionId: result.sessionId
        };
    }
    /**
   * Confirm ảnh editor từ staging sang permanent
   * Đồng thời replace staging URLs trong HTML content bằng permanent URLs
   * 
   * @param sessionId - Editor staging session
   * @param entityId - ID của entity (category, product, etc.)
   * @param entityType - Loại entity ('categories', 'products', etc.)
   * @param htmlContent - Nội dung HTML cần update URLs
   * @returns Updated HTML với permanent URLs
   */ static async confirmEditorImages(sessionId, entityId, entityType, htmlContent) {
        // Confirm staging files
        const confirmedFiles = await FileUploadAPI.confirmStagingFiles(sessionId, entityId, entityType, 'editor-images', {
            source: 'tiptap-editor'
        });
        // Replace staging URLs with permanent URLs in HTML
        let updatedHtml = htmlContent;
        for (const file of confirmedFiles){
            // Staging URL pattern: /api/staging/preview/{sessionId}/{filename}
            // Find and replace with permanent URL
            const stagingPattern = new RegExp(`/api/staging/preview/[^/]+/${file.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
            updatedHtml = updatedHtml.replace(stagingPattern, file.url);
        }
        return {
            html: updatedHtml,
            files: confirmedFiles
        };
    }
    static async uploadCommentImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/comments/upload-image`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh bình luận thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadPrintTemplateImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/print-templates/upload-image`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh mẫu in thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadComplaintCommentImage(complaintId, file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/upload`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh khiếu nại thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadTaskEvidence(taskId, files) {
        if (files.length === 0) {
            return [];
        }
        const formData = new FormData();
        files.forEach((file)=>formData.append('files', file));
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/evidence`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload bằng chứng công việc thất bại');
        }
        return (result.files || []).map((file, index)=>FileUploadAPI.mapDirectUpload(file, files[index]?.name || `evidence-${index}`));
    }
    static mapDirectUpload(file, fallbackName) {
        return {
            id: file.id,
            name: file.originalName || file.name || fallbackName,
            size: file.size || file.filesize || 0,
            type: file.mimetype || file.type || 'application/octet-stream',
            url: file.url,
            uploadedAt: file.uploadedAt || new Date().toISOString()
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/website-settings-sync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Website Settings Sync Utility
 * Synchronizes website settings with database as source of truth
 * Uses in-memory cache for fast synchronous access
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */ // Types
__turbopack_context__.s([
    "getRedirectsSync",
    ()=>getRedirectsSync,
    "getWebsiteSettingsSync",
    ()=>getWebsiteSettingsSync,
    "initWebsiteSettings",
    ()=>initWebsiteSettings,
    "loadRedirectsAsync",
    ()=>loadRedirectsAsync,
    "loadWebsiteSettingsAsync",
    ()=>loadWebsiteSettingsAsync,
    "refreshWebsiteSettings",
    ()=>refreshWebsiteSettings,
    "saveRedirectsAsync",
    ()=>saveRedirectsAsync,
    "saveWebsiteSettingsAsync",
    ()=>saveWebsiteSettingsAsync
]);
// API endpoint
const API_ENDPOINT = '/api/website-settings';
// Defaults
const DEFAULT_SETTINGS = {
    primaryDomain: '',
    additionalDomains: [],
    wwwRedirect: 'www-to-non-www',
    trailingSlash: 'remove',
    sslEnabled: true,
    forceHttps: true,
    sslCertExpiry: '',
    sslAutoRenew: true,
    custom404Enabled: false,
    custom404Title: 'Trang không tồn tại',
    custom404Content: '<p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>',
    custom404RedirectUrl: '',
    custom404RedirectDelay: 5
};
const DEFAULT_REDIRECTS = [];
// In-memory cache
let settingsCache = null;
let redirectsCache = null;
let isInitialized = false;
async function loadWebsiteSettingsAsync() {
    try {
        const res = await fetch(`${API_ENDPOINT}?type=settings`);
        if (res.ok) {
            const data = await res.json();
            settingsCache = {
                ...DEFAULT_SETTINGS,
                ...data
            };
            return settingsCache;
        }
    } catch (error) {
        console.error('[WebsiteSettings] Error loading from database:', error);
    }
    // Return cache or defaults if API fails
    return settingsCache ?? DEFAULT_SETTINGS;
}
function getWebsiteSettingsSync() {
    return settingsCache ?? DEFAULT_SETTINGS;
}
async function saveWebsiteSettingsAsync(settings) {
    // Update cache immediately
    settingsCache = settings;
    // Save to database
    try {
        await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'settings',
                data: settings
            })
        });
    } catch (error) {
        console.error('[WebsiteSettings] Error saving to database:', error);
    }
}
async function loadRedirectsAsync() {
    try {
        const res = await fetch(`${API_ENDPOINT}?type=redirects`);
        if (res.ok) {
            const data = await res.json();
            redirectsCache = data;
            return redirectsCache;
        }
    } catch (error) {
        console.error('[WebsiteSettings] Error loading redirects from database:', error);
    }
    // Return cache or defaults if API fails
    return redirectsCache ?? DEFAULT_REDIRECTS;
}
function getRedirectsSync() {
    return redirectsCache ?? DEFAULT_REDIRECTS;
}
async function saveRedirectsAsync(redirects) {
    // Update cache immediately
    redirectsCache = redirects;
    // Save to database
    try {
        await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'redirects',
                data: redirects
            })
        });
    } catch (error) {
        console.error('[WebsiteSettings] Error saving redirects to database:', error);
    }
}
async function initWebsiteSettings() {
    if (isInitialized) return;
    await Promise.all([
        loadWebsiteSettingsAsync(),
        loadRedirectsAsync()
    ]);
    isInitialized = true;
    console.log('[WebsiteSettings] Initialized from database');
}
async function refreshWebsiteSettings() {
    isInitialized = false;
    settingsCache = null;
    redirectsCache = null;
    await initWebsiteSettings();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-settings-storage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSettingValue",
    ()=>useSettingValue,
    "useSettingsStorage",
    ()=>useSettingsStorage
]);
/**
 * Settings Storage Hook
 * Sử dụng database API làm source of truth
 * localStorage đã bị remove khỏi codebase
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
const API_BASE = '/api/settings';
function useSettingsStorage(storageKey, defaultValue, group) {
    _s();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultValue);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load settings on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSettingsStorage.useEffect": ()=>{
            const loadSettings = {
                "useSettingsStorage.useEffect.loadSettings": async ()=>{
                    try {
                        const settingsGroup = group || storageKey.replace('-settings', '');
                        const res = await fetch(`${API_BASE}?group=${encodeURIComponent(settingsGroup)}`);
                        if (res.ok) {
                            const data = await res.json();
                            if (data.data && data.data.length > 0) {
                                const settingsMap = data.data.reduce({
                                    "useSettingsStorage.useEffect.loadSettings.settingsMap": (acc, item)=>{
                                        acc[item.key] = item.value;
                                        return acc;
                                    }
                                }["useSettingsStorage.useEffect.loadSettings.settingsMap"], {});
                                setSettings({
                                    "useSettingsStorage.useEffect.loadSettings": (prev)=>({
                                            ...prev,
                                            ...settingsMap
                                        })
                                }["useSettingsStorage.useEffect.loadSettings"]);
                            }
                        }
                    } catch (error) {
                        console.error(`Error loading settings for ${storageKey}:`, error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["useSettingsStorage.useEffect.loadSettings"];
            loadSettings();
        }
    }["useSettingsStorage.useEffect"], [
        storageKey,
        group
    ]);
    // Save settings to database
    const save = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingsStorage.useCallback[save]": async ()=>{
            setIsSaving(true);
            try {
                const settingsGroup = group || storageKey.replace('-settings', '');
                const settingsArray = Object.entries(settings).map({
                    "useSettingsStorage.useCallback[save].settingsArray": ([key, value])=>({
                            key,
                            group: settingsGroup,
                            value
                        })
                }["useSettingsStorage.useCallback[save].settingsArray"]);
                await fetch(API_BASE, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        settings: settingsArray
                    })
                });
            } catch (error) {
                console.error(`Error saving settings for ${storageKey}:`, error);
                throw error;
            } finally{
                setIsSaving(false);
            }
        }
    }["useSettingsStorage.useCallback[save]"], [
        settings,
        storageKey,
        group
    ]);
    return [
        settings,
        setSettings,
        {
            isLoading,
            isSaving,
            save
        }
    ];
}
_s(useSettingsStorage, "R8yTGmD71S9kYhAsUlaFcFQKqhk=");
function useSettingValue(key, defaultValue, group = 'general') {
    _s1();
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultValue);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSettingValue.useEffect": ()=>{
            const load = {
                "useSettingValue.useEffect.load": async ()=>{
                    try {
                        const res = await fetch(`${API_BASE}?key=${encodeURIComponent(key)}`);
                        if (res.ok) {
                            const data = await res.json();
                            if (data && data.value !== undefined) {
                                setValue(data.value);
                            }
                        }
                    } catch (error) {
                        console.error(`Error loading setting ${key}:`, error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["useSettingValue.useEffect.load"];
            load();
        }
    }["useSettingValue.useEffect"], [
        key
    ]);
    const updateValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSettingValue.useCallback[updateValue]": async (newValue)=>{
            setValue(newValue);
            try {
                await fetch(API_BASE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        key,
                        group,
                        value: newValue
                    })
                });
            } catch (error) {
                console.error(`Error saving setting ${key}:`, error);
            }
        }
    }["useSettingValue.useCallback[updateValue]"], [
        key,
        group
    ]);
    return [
        value,
        updateValue,
        isLoading
    ];
}
_s1(useSettingValue, "e4wO8EFpZh6DL8mrLkbG0aTS5nY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-due-date-notifications.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDueDateNotifications",
    ()=>useDueDateNotifications,
    "useNotificationSettings",
    ()=>useNotificationSettings
]);
/**
 * Due Date Notifications Hook
 * Manages automatic notifications for tasks with approaching due dates
 * 
 * Generic hook - can be used with any entity that has dueDate field
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const DEFAULT_SETTINGS = {
    enabled: true,
    checkInterval: 30,
    notifyOverdue: true,
    notifyDueToday: true,
    notifyDueTomorrow: true,
    notifyDueSoon: true,
    playSound: false,
    showDesktopNotification: false,
    completedStatuses: [
        'returned',
        'completed',
        'cancelled'
    ],
    linkPrefix: '/warranty/'
};
// Helper functions (moved from warranty utils)
function getDaysUntilDue(dueDate) {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
function getDueDateWarning(dueDate) {
    const daysRemaining = getDaysUntilDue(dueDate);
    if (daysRemaining < 0) {
        return {
            severity: 'overdue',
            status: 'overdue',
            message: `Quá hạn ${Math.abs(daysRemaining)} ngày`,
            daysRemaining
        };
    }
    if (daysRemaining === 0) {
        return {
            severity: 'critical',
            status: 'due-today',
            message: 'Hôm nay',
            daysRemaining
        };
    }
    if (daysRemaining === 1) {
        return {
            severity: 'critical',
            status: 'due-tomorrow',
            message: 'Ngày mai',
            daysRemaining
        };
    }
    if (daysRemaining <= 3) {
        return {
            severity: 'critical',
            status: 'due-soon',
            message: `Còn ${daysRemaining} ngày`,
            daysRemaining
        };
    }
    if (daysRemaining <= 7) {
        return {
            severity: 'warning',
            status: 'normal',
            message: `Còn ${daysRemaining} ngày`,
            daysRemaining
        };
    }
    return {
        severity: 'info',
        status: 'normal',
        message: `Còn ${daysRemaining} ngày`,
        daysRemaining
    };
}
function getTasksNeedingNotification(tasks, completedStatuses = [
    'returned',
    'completed',
    'cancelled'
]) {
    return tasks.filter((task)=>{
        if (!task.dueDate) return false;
        if (task.status && completedStatuses.includes(task.status)) return false;
        const warning = getDueDateWarning(task.dueDate);
        return [
            'overdue',
            'due-today',
            'due-tomorrow',
            'due-soon'
        ].includes(warning.status || '');
    });
}
function getDueDateNotificationMessage(task) {
    if (!task.dueDate) return '';
    const warning = getDueDateWarning(task.dueDate);
    const prefix = `[${task.systemId}]`;
    switch(warning.status){
        case 'overdue':
            return `${prefix} Công việc quá hạn ${Math.abs(warning.daysRemaining)} ngày`;
        case 'due-today':
            return `${prefix} Công việc đến hạn hôm nay`;
        case 'due-tomorrow':
            return `${prefix} Công việc đến hạn ngày mai`;
        case 'due-soon':
            return `${prefix} Công việc còn ${warning.daysRemaining} ngày`;
        default:
            return `${prefix} ${warning.message}`;
    }
}
// Track notified tasks to avoid duplicate notifications
const notifiedTasks = new Set();
function useDueDateNotifications(tasks, settings = {}) {
    _s();
    const mergedSettings = {
        ...DEFAULT_SETTINGS,
        ...settings
    };
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const checkAndNotify = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDueDateNotifications.useCallback[checkAndNotify]": ()=>{
            if (!mergedSettings.enabled) return;
            const tasksToNotify = getTasksNeedingNotification(tasks, mergedSettings.completedStatuses);
            tasksToNotify.forEach({
                "useDueDateNotifications.useCallback[checkAndNotify]": (task)=>{
                    if (!task.dueDate) return;
                    const warning = getDueDateWarning(task.dueDate);
                    const taskKey = `${task.systemId}-${warning.status}`;
                    // Skip if already notified for this status
                    if (notifiedTasks.has(taskKey)) return;
                    // Check if this warning type should be notified
                    const shouldNotify = warning.status === 'overdue' && mergedSettings.notifyOverdue || warning.status === 'due-today' && mergedSettings.notifyDueToday || warning.status === 'due-tomorrow' && mergedSettings.notifyDueTomorrow || warning.status === 'due-soon' && mergedSettings.notifyDueSoon;
                    if (!shouldNotify) return;
                    // Show toast notification
                    const message = getDueDateNotificationMessage(task);
                    const toastOptions = {
                        description: `${task.customerName ? `KH: ${task.customerName}` : ''}${task.employeeName ? ` | NV: ${task.employeeName}` : ''}`,
                        duration: warning.status === 'overdue' ? 10000 : 5000,
                        action: {
                            label: 'Xem',
                            onClick: {
                                "useDueDateNotifications.useCallback[checkAndNotify]": ()=>{
                                    const linkPrefix = mergedSettings.linkPrefix || '/warranty/';
                                    window.location.href = `${linkPrefix}${task.systemId}`;
                                }
                            }["useDueDateNotifications.useCallback[checkAndNotify]"]
                        }
                    };
                    switch(warning.status){
                        case 'overdue':
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message, toastOptions);
                            break;
                        case 'due-today':
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning(message, toastOptions);
                            break;
                        case 'due-tomorrow':
                        case 'due-soon':
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info(message, toastOptions);
                            break;
                    }
                    // Mark as notified
                    notifiedTasks.add(taskKey);
                    // Desktop notification (if enabled and permitted)
                    if (mergedSettings.showDesktopNotification && 'Notification' in window) {
                        if (Notification.permission === 'granted') {
                            new Notification('Nhắc nhở công việc', {
                                body: message,
                                icon: '/logo.png',
                                tag: taskKey
                            });
                        } else if (Notification.permission !== 'denied') {
                            Notification.requestPermission();
                        }
                    }
                    // Play sound (if enabled)
                    if (mergedSettings.playSound) {
                        const audio = new Audio('/notification-sound.mp3');
                        audio.play().catch(console.error);
                    }
                }
            }["useDueDateNotifications.useCallback[checkAndNotify]"]);
        }
    }["useDueDateNotifications.useCallback[checkAndNotify]"], [
        tasks,
        mergedSettings
    ]);
    // Initial check and periodic checks
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDueDateNotifications.useEffect": ()=>{
            if (!mergedSettings.enabled) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                return;
            }
            // Check immediately
            checkAndNotify();
            // Set up periodic checks
            const intervalMs = mergedSettings.checkInterval * 60 * 1000;
            intervalRef.current = setInterval(checkAndNotify, intervalMs);
            return ({
                "useDueDateNotifications.useEffect": ()=>{
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                }
            })["useDueDateNotifications.useEffect"];
        }
    }["useDueDateNotifications.useEffect"], [
        checkAndNotify,
        mergedSettings.enabled,
        mergedSettings.checkInterval
    ]);
    // Clear notification history for completed tasks
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDueDateNotifications.useEffect": ()=>{
            const completedStatuses = mergedSettings.completedStatuses || [
                'returned',
                'completed',
                'cancelled'
            ];
            tasks.forEach({
                "useDueDateNotifications.useEffect": (task)=>{
                    if (task.status && completedStatuses.includes(task.status)) {
                        // Remove all notifications for this task
                        Array.from(notifiedTasks).forEach({
                            "useDueDateNotifications.useEffect": (key)=>{
                                if (key.startsWith(task.systemId)) {
                                    notifiedTasks.delete(key);
                                }
                            }
                        }["useDueDateNotifications.useEffect"]);
                    }
                }
            }["useDueDateNotifications.useEffect"]);
        }
    }["useDueDateNotifications.useEffect"], [
        tasks,
        mergedSettings.completedStatuses
    ]);
    const clearNotificationHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDueDateNotifications.useCallback[clearNotificationHistory]": ()=>{
            notifiedTasks.clear();
        }
    }["useDueDateNotifications.useCallback[clearNotificationHistory]"], []);
    const requestDesktopPermission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDueDateNotifications.useCallback[requestDesktopPermission]": async ()=>{
            if ('Notification' in window && Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                return permission === 'granted';
            }
            return false;
        }
    }["useDueDateNotifications.useCallback[requestDesktopPermission]"], []);
    return {
        checkAndNotify,
        clearNotificationHistory,
        requestDesktopPermission,
        hasDesktopPermission: 'Notification' in window && Notification.permission === 'granted'
    };
}
_s(useDueDateNotifications, "ueHBB/kdINFbze6mDSH5pxwDK5U=");
function useNotificationSettings(storageKey = 'hrm-due-date-notification-settings') {
    _s1();
    // In-memory cache for settings
    const settingsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(DEFAULT_SETTINGS);
    const getSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotificationSettings.useCallback[getSettings]": ()=>{
            return settingsRef.current;
        }
    }["useNotificationSettings.useCallback[getSettings]"], []);
    const saveSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotificationSettings.useCallback[saveSettings]": (settings)=>{
            const updated = {
                ...settingsRef.current,
                ...settings
            };
            settingsRef.current = updated;
            return updated;
        }
    }["useNotificationSettings.useCallback[saveSettings]"], []);
    const resetSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotificationSettings.useCallback[resetSettings]": ()=>{
            settingsRef.current = DEFAULT_SETTINGS;
            return DEFAULT_SETTINGS;
        }
    }["useNotificationSettings.useCallback[resetSettings]"], []);
    return {
        getSettings,
        saveSettings,
        resetSettings,
        defaultSettings: DEFAULT_SETTINGS
    };
}
_s1(useNotificationSettings, "SdFuojEkt+DHFRGJQdZQ2itd2UE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(authenticated)/settings/other/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$other$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/other-page.tsx [app-client] (ecmascript)");
'use client';
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$other$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OtherSettingsPage"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_820096b4._.js.map