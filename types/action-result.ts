/**
 * Shared Server Action Result Type
 * 
 * Used by all app/actions/*.ts files for consistent return format.
 * Import: import type { ActionResult } from '@/types/action-result'
 */
export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}
