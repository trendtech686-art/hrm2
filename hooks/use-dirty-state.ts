import * as React from 'react'

/**
 * Detect whether a current state object differs from the stored (server) snapshot.
 *
 * Use for multi-tab settings pages where each tab holds `useState` with the current
 * form values, and we want to disable the Save button until user makes real changes.
 *
 * @example
 *   const stored = useQuery(...).data
 *   const [draft, setDraft] = React.useState(stored)
 *   const isDirty = useDirtyState(stored, draft)
 *   <Button disabled={!isDirty || pending}>Lưu</Button>
 *
 * Uses JSON.stringify as a cheap, deterministic deep-equal. Keep payloads modest
 * (single-tab settings objects, not large lists). For React Hook Form–backed forms,
 * prefer `form.formState.isDirty` instead.
 */
export function useDirtyState<T>(stored: T | undefined, current: T | undefined): boolean {
  return React.useMemo(() => {
    if (stored === undefined || current === undefined) return false
    return JSON.stringify(stored) !== JSON.stringify(current)
  }, [stored, current])
}
