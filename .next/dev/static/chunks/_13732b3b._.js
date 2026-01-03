(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/repositories/in-memory-repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInMemoryRepository",
    ()=>createInMemoryRepository
]);
const createInMemoryRepository = (stateGetter)=>{
    const getStore = ()=>stateGetter();
    const ensureEntity = (systemId)=>{
        const entity = getStore().findById(systemId);
        if (!entity) {
            throw new Error(`Không tìm thấy entity với systemId=${systemId}`);
        }
        return entity;
    };
    return {
        async list () {
            return [
                ...getStore().data
            ];
        },
        async getById (systemId) {
            return getStore().findById(systemId);
        },
        async create (payload) {
            return getStore().add(payload);
        },
        async update (systemId, payload) {
            ensureEntity(systemId);
            getStore().update(systemId, payload);
            return ensureEntity(systemId);
        },
        async softDelete (systemId) {
            ensureEntity(systemId);
            getStore().remove(systemId);
        },
        async restore (systemId) {
            ensureEntity(systemId);
            getStore().restore(systemId);
            return getStore().findById(systemId);
        },
        async hardDelete (systemId) {
            ensureEntity(systemId);
            getStore().hardDelete(systemId);
        }
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-comment-draft.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCommentDraft",
    ()=>useCommentDraft
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useCommentDraft(entityType, entityId, enabled = true) {
    _s();
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    const draftKey = `comment-draft-${entityType}-${entityId}`;
    // Load draft from API on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCommentDraft.useEffect": ()=>{
            isMountedRef.current = true;
            if (!enabled) {
                setIsLoading(false);
                return;
            }
            const loadDraft = {
                "useCommentDraft.useEffect.loadDraft": async ()=>{
                    try {
                        const response = await fetch(`/api/user-preferences?category=drafts&key=${encodeURIComponent(draftKey)}`);
                        if (!response.ok) throw new Error('Failed to load draft');
                        const data = await response.json();
                        if (isMountedRef.current && data.value) {
                            setDraft(data.value);
                        }
                    } catch (error) {
                        console.warn('[useCommentDraft] Failed to load draft:', error);
                    } finally{
                        if (isMountedRef.current) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useCommentDraft.useEffect.loadDraft"];
            loadDraft();
            return ({
                "useCommentDraft.useEffect": ()=>{
                    isMountedRef.current = false;
                    if (saveTimeoutRef.current) {
                        clearTimeout(saveTimeoutRef.current);
                    }
                }
            })["useCommentDraft.useEffect"];
        }
    }["useCommentDraft.useEffect"], [
        draftKey,
        enabled
    ]);
    // Save draft to API with debounce
    const saveDraft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCommentDraft.useCallback[saveDraft]": async (content)=>{
            if (!enabled) return;
            // Clear any pending save
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            // If content is empty, delete the draft
            if (!content) {
                try {
                    await fetch('/api/user-preferences', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            category: 'drafts',
                            key: draftKey
                        })
                    });
                } catch (error) {
                    console.warn('[useCommentDraft] Failed to delete draft:', error);
                }
                return;
            }
            // Debounce save by 500ms
            saveTimeoutRef.current = setTimeout({
                "useCommentDraft.useCallback[saveDraft]": async ()=>{
                    try {
                        await fetch('/api/user-preferences', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                category: 'drafts',
                                key: draftKey,
                                value: content
                            })
                        });
                    } catch (error) {
                        console.warn('[useCommentDraft] Failed to save draft:', error);
                    }
                }
            }["useCommentDraft.useCallback[saveDraft]"], 500);
        }
    }["useCommentDraft.useCallback[saveDraft]"], [
        draftKey,
        enabled
    ]);
    // Update draft (local state + trigger save)
    const updateDraft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCommentDraft.useCallback[updateDraft]": (content)=>{
            setDraft(content);
            saveDraft(content);
        }
    }["useCommentDraft.useCallback[updateDraft]"], [
        saveDraft
    ]);
    // Clear draft immediately (used when comment is submitted)
    const clearDraft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCommentDraft.useCallback[clearDraft]": async ()=>{
            setDraft('');
            // Clear any pending save
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            if (!enabled) return;
            // Delete from API immediately
            try {
                await fetch('/api/user-preferences', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        category: 'drafts',
                        key: draftKey
                    })
                });
            } catch (error) {
                console.warn('[useCommentDraft] Failed to clear draft:', error);
            }
        }
    }["useCommentDraft.useCallback[clearDraft]"], [
        draftKey,
        enabled
    ]);
    return {
        draft,
        updateDraft,
        clearDraft,
        isLoading
    };
}
_s(useCommentDraft, "VzqVTQVMK0qUNIJG6dgRlU92Rkw=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-comments.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useComments",
    ()=>useComments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useComments(entityType, entityId) {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load comments from database
    const loadComments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useComments.useCallback[loadComments]": async ()=>{
            if (!entityType || !entityId) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/comments?entityType=${encodeURIComponent(entityType)}&entityId=${encodeURIComponent(entityId)}`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data || []);
                }
            } catch (error) {
                console.error(`Error loading comments for ${entityType}/${entityId}:`, error);
            } finally{
                setIsLoading(false);
            }
        }
    }["useComments.useCallback[loadComments]"], [
        entityType,
        entityId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useComments.useEffect": ()=>{
            loadComments();
        }
    }["useComments.useEffect"], [
        loadComments
    ]);
    // Add new comment
    const addComment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useComments.useCallback[addComment]": async (content, attachments = [])=>{
            if (!entityType || !entityId) return null;
            try {
                const res = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        entityType,
                        entityId,
                        content,
                        attachments,
                        createdBy: user?.systemId,
                        createdByName: user?.fullName || user?.email
                    })
                });
                if (res.ok) {
                    const newComment = await res.json();
                    setComments({
                        "useComments.useCallback[addComment]": (prev)=>[
                                newComment,
                                ...prev
                            ]
                    }["useComments.useCallback[addComment]"]);
                    return newComment;
                }
            } catch (error) {
                console.error('Error adding comment:', error);
            }
            return null;
        }
    }["useComments.useCallback[addComment]"], [
        entityType,
        entityId,
        user
    ]);
    // Delete comment
    const deleteComment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useComments.useCallback[deleteComment]": async (systemId)=>{
            try {
                const res = await fetch(`/api/comments?systemId=${encodeURIComponent(systemId)}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    setComments({
                        "useComments.useCallback[deleteComment]": (prev)=>prev.filter({
                                "useComments.useCallback[deleteComment]": (c)=>c.systemId !== systemId
                            }["useComments.useCallback[deleteComment]"])
                    }["useComments.useCallback[deleteComment]"]);
                    return true;
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
            return false;
        }
    }["useComments.useCallback[deleteComment]"], []);
    // Refresh comments
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useComments.useCallback[refresh]": ()=>{
            setIsLoading(true);
            loadComments();
        }
    }["useComments.useCallback[refresh]"], [
        loadComments
    ]);
    return {
        comments,
        isLoading,
        addComment,
        deleteComment,
        refresh,
        count: comments.length
    };
}
_s(useComments, "KSM6pXqSzJRNrSf1kLCkbdoW95c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_13732b3b._.js.map