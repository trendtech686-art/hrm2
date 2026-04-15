'use client'

import dynamic from 'next/dynamic';
import { Skeleton } from './skeleton';

// Re-export the props type from the implementation
export type { TipTapEditorProps } from './tiptap-editor-impl';

/**
 * Dynamic wrapper for TipTap Rich Text Editor
 * 
 * TipTap + extensions bundle is ~150KB — lazy-loaded on first render.
 * All 13+ consumers keep the same import path, no changes needed.
 */
export const TipTapEditor = dynamic(
  () => import('./tiptap-editor-impl').then(m => ({ default: m.TipTapEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        <div className="flex gap-1 border-b pb-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-50 w-full rounded-md" />
      </div>
    ),
  }
);
