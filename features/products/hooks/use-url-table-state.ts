'use client'

import * as React from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { DEFAULT_PRODUCT_SORT, type ProductQueryParams } from '../product-service'

/**
 * URL-based table state hook for products.
 * Replaces usePersistentState (localStorage) with searchParams sync.
 * Returns same [state, setState] API for compatibility with useTableStateHandlers.
 */
export function useUrlTableState(
  defaultState: ProductQueryParams
): [ProductQueryParams, (updater: ProductQueryParams | ((prev: ProductQueryParams) => ProductQueryParams)) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse URL → ProductQueryParams (only on mount)
  const initialState = React.useMemo((): ProductQueryParams => {
    const search = searchParams.get('search') || defaultState.search
    const statusFilter = (searchParams.get('statusFilter') || defaultState.statusFilter) as ProductQueryParams['statusFilter']
    const typeFilter = (searchParams.get('typeFilter') || defaultState.typeFilter) as ProductQueryParams['typeFilter']
    const categoryFilter = searchParams.get('categoryFilter') || defaultState.categoryFilter
    const brandFilter = searchParams.get('brandFilter') || defaultState.brandFilter
    const comboFilter = (searchParams.get('comboFilter') || defaultState.comboFilter) as ProductQueryParams['comboFilter']
    const stockLevelFilter = (searchParams.get('stockLevelFilter') || defaultState.stockLevelFilter) as ProductQueryParams['stockLevelFilter']
    const pkgxFilter = (searchParams.get('pkgxFilter') || defaultState.pkgxFilter) as ProductQueryParams['pkgxFilter']

    const dateFrom = searchParams.get('dateFrom') || undefined
    const dateTo = searchParams.get('dateTo') || undefined
    const dateRange = dateFrom || dateTo ? [dateFrom, dateTo] as [string | undefined, string | undefined] : defaultState.dateRange

    const pageIndex = parseInt(searchParams.get('pageIndex') || String(defaultState.pagination.pageIndex), 10)
    const pageSize = parseInt(searchParams.get('pageSize') || String(defaultState.pagination.pageSize), 10)

    const sortId = (searchParams.get('sortBy') || defaultState.sorting.id) as ProductQueryParams['sorting']['id']
    const sortDesc = searchParams.get('sortDesc') === 'true' ? true : searchParams.get('sortDesc') === 'false' ? false : defaultState.sorting.desc

    return {
      search, statusFilter, typeFilter, categoryFilter, brandFilter, comboFilter, stockLevelFilter, pkgxFilter, dateRange,
      pagination: { pageIndex, pageSize },
      sorting: { id: sortId, desc: sortDesc },
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // only parse URL on mount

  const [state, setStateInternal] = React.useState(initialState)

  // Sync state → URL via effect (NOT during render)
  const syncToUrl = React.useCallback((s: ProductQueryParams) => {
    const params = new URLSearchParams()

    if (s.search) params.set('search', s.search)
    if (s.statusFilter && s.statusFilter !== 'all') params.set('statusFilter', s.statusFilter)
    if (s.typeFilter && s.typeFilter !== 'all') params.set('typeFilter', s.typeFilter)
    if (s.categoryFilter && s.categoryFilter !== 'all') params.set('categoryFilter', s.categoryFilter)
    if (s.brandFilter && s.brandFilter !== 'all') params.set('brandFilter', s.brandFilter)
    if (s.comboFilter && s.comboFilter !== 'all') params.set('comboFilter', s.comboFilter)
    if (s.stockLevelFilter && s.stockLevelFilter !== 'all') params.set('stockLevelFilter', s.stockLevelFilter)
    if (s.pkgxFilter && s.pkgxFilter !== 'all') params.set('pkgxFilter', s.pkgxFilter)
    if (s.dateRange?.[0]) params.set('dateFrom', s.dateRange[0])
    if (s.dateRange?.[1]) params.set('dateTo', s.dateRange[1])
    if (s.pagination.pageIndex !== 0) params.set('pageIndex', String(s.pagination.pageIndex))
    if (s.pagination.pageSize !== 20) params.set('pageSize', String(s.pagination.pageSize))
    if (s.sorting.id !== DEFAULT_PRODUCT_SORT.id) params.set('sortBy', s.sorting.id)
    if (s.sorting.desc !== DEFAULT_PRODUCT_SORT.desc) params.set('sortDesc', String(s.sorting.desc))

    const qs = params.toString()
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [pathname, router])

  // Sync URL after state changes (in useEffect, not during render)
  const isInitialRender = React.useRef(true)
  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    syncToUrl(state)
  }, [state, syncToUrl])

  const setState = React.useCallback(
    (updater: ProductQueryParams | ((prev: ProductQueryParams) => ProductQueryParams)) => {
      setStateInternal(prev => {
        return typeof updater === 'function' ? updater(prev) : updater
      })
    },
    []
  )

  return [state, setState]
}
