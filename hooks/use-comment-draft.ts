'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to manage comment draft with database persistence.
 * Drafts are auto-saved with debounce and cleared when comment is submitted.
 * 
 * Key format: comment-draft-{entityType}-{entityId}
 */
export function useCommentDraft(entityType: string, entityId: string, enabled: boolean = true) {
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  
  const draftKey = `comment-draft-${entityType}-${entityId}`;
  
  // Load draft from API on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    
    const loadDraft = async () => {
      try {
        const response = await fetch(`/api/user-preferences?category=drafts&key=${encodeURIComponent(draftKey)}`);
        if (!response.ok) throw new Error('Failed to load draft');
        
        const data = await response.json();
        if (isMountedRef.current && data.value) {
          setDraft(data.value);
        }
      } catch {
        // Silently fail - draft loading is optional
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    
    loadDraft();
    
    return () => {
      isMountedRef.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [draftKey, enabled]);
  
  // Save draft to API with debounce
  const saveDraft = useCallback(async (content: string) => {
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'drafts',
            key: draftKey
          })
        });
      } catch {
        // Silently fail - draft deletion is optional
      }
      return;
    }
    
    // Debounce save by 500ms
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'drafts',
            key: draftKey,
            value: content
          })
        });
      } catch {
        // Silently fail - draft save is optional
      }
    }, 500);
  }, [draftKey, enabled]);
  
  // Update draft (local state + trigger save)
  const updateDraft = useCallback((content: string) => {
    setDraft(content);
    saveDraft(content);
  }, [saveDraft]);
  
  // Clear draft immediately (used when comment is submitted)
  const clearDraft = useCallback(async () => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'drafts',
          key: draftKey
        })
      });
    } catch {
      // Silently fail - draft deletion is optional
    }
  }, [draftKey, enabled]);
  
  return {
    draft,
    updateDraft,
    clearDraft,
    isLoading
  };
}
