/**
 * Cross-module cache invalidation map.
 *
 * Each entry maps a module's root query-key to the *external* key prefixes
 * that must be invalidated when that module's data changes.
 * React Query prefix matching is used — ['customers'] matches ['customers', 'stats', id].
 *
 * Design: "maximum union" of all mutations per module.
 * invalidateQueries only marks data stale (cheap) — no network cost unless
 * a mounted component is observing the key.
 *
 * NOTE: ['activity-logs'] is handled globally by MutationCache.onSuccess in
 * query-client.ts, so it is NOT listed here.
 */

import type { QueryClient } from '@tanstack/react-query'

const INVALIDATION_MAP: Record<string, readonly (readonly string[])[]> = {
  // ── Order form bundle (GET /api/settings/order-form) ──────
  'payment-methods': [['settings', 'order-form']],
  'sales-channels': [['settings', 'order-form']],
  'pricing-policies': [['settings', 'order-form']],
  'shipping-partners': [['settings', 'order-form']],
  'taxes': [['settings', 'order-form']],
  'branches': [['settings', 'order-form']],
  'shipping-settings': [['settings', 'order-form']],

  // ── Sales ────────────────────────────────────────────────
  'orders': [
    ['customers'],
    ['shipments'],
    ['products'],
    ['receipts'],
  ],
  'sales-returns': [
    ['receipts'],
    ['payments'],
    ['orders'],
    ['products'],
    ['product-inventory'],
  ],

  // ── Procurement ──────────────────────────────────────────
  'purchase-orders': [
    ['suppliers'],
    ['supplier-debt-transactions'],
    ['supplier-products-ordered'],
    ['purchase-returns'],
    ['receipts'],
    ['products'],
  ],
  'purchase-returns': [
    ['purchase-orders'],
    ['inventory'],
    ['suppliers'],
    ['supplier-debt-transactions'],
    ['supplier-products-ordered'],
    ['supplier-products-returned'],
  ],

  // ── Finance ──────────────────────────────────────────────
  'cashbook': [
    ['cash-accounts'],
  ],
  'payments': [
    ['suppliers'],
    ['supplier-debt-transactions'],
    ['purchase-orders'],
    ['customers'],
    ['customer-debt'],
    ['customer-debt-transactions'],
  ],
  'receipts': [
    ['supplier-debt-transactions'],
    ['suppliers'],
    ['customer-debt'],
    ['customers'],
    ['orders'],
  ],

  // ── Inventory ────────────────────────────────────────────
  'stock-transfers': [
    ['products'],
  ],
  'inventory-checks': [
    ['products'],
  ],
  'inventory-receipts': [
    ['products'],
    ['price-history'],
    ['supplier-debt-transactions'],
    ['suppliers'],
    ['purchase-orders'],
    ['stock-history'],
  ],

  // ── Warranty ─────────────────────────────────────────────
  'warranties': [
    ['inventory'],
    ['products'],
    ['stock-history'],
    ['payments'],
    ['receipts'],
    ['customers'],
  ],
  'supplier-warranty': [
    ['suppliers', 'stats'],
    ['receipts'],
  ],

  // ── Config ───────────────────────────────────────────────
  'brands': [
    ['pkgx', 'settings'],
  ],
  'categories': [
    ['pkgx', 'settings'],
  ],

  // ── Tasks ────────────────────────────────────────────────
  'task-boards': [
    ['tasks'],
  ],
  'recurring-tasks': [
    ['tasks'],
  ],

  // ── Complaints ───────────────────────────────────────────
  'complaints': [
    ['payments'],
    ['penalties'],
    ['inventory-checks'],
    ['receipts'],
  ],

  // ── Reconciliation Sheets ────────────────────────────────
  'reconciliation-sheets': [
    ['reconciliation'],
  ],

  // ── Products ─────────────────────────────────────────────
  'products': [
    ['product-stats'],
    ['pkgx-mapping'],
    ['linked-products'],
    ['stock-history'],
  ],

  // ── PKGX Integration ────────────────────────────────────
  'pkgx-products': [
    ['product-stats'],
    ['pkgx-mapping'],
    ['linked-products'],
    ['products-unlinked'],
    ['products-unlinked-for-dialog'],
  ],

  // ── Payroll ──────────────────────────────────────────────
  'payroll': [
    ['payslips'],
  ],
  'payslips': [
    ['payroll'],
  ],
}

/**
 * Invalidate a module's own cache + all cross-module dependencies.
 *
 * Always invalidates `[moduleKey]` first (prefix match covers lists, details, stats).
 * Then walks the dependency map for external keys.
 *
 * For special cases (e.g. forced refetch), add extra calls after this helper:
 * ```ts
 * onSuccess: () => {
 *   invalidateRelated(queryClient, 'inventory-receipts')
 *   queryClient.refetchQueries({ queryKey: ['products'] }) // force immediate
 * }
 * ```
 */
export function invalidateRelated(queryClient: QueryClient, moduleKey: string) {
  queryClient.invalidateQueries({ queryKey: [moduleKey] })

  const related = INVALIDATION_MAP[moduleKey]
  if (related) {
    for (const key of related) {
      queryClient.invalidateQueries({ queryKey: [...key] })
    }
  }
}
