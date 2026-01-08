'use client';

import * as React from 'react';
import type Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';

/**
 * Hook để lazy load Fuse.js và thực hiện search
 * Fuse.js (~30KB) sẽ chỉ được load khi user bắt đầu search
 * 
 * @example
 * const { search, isLoading } = useFuseSearch(data, {
 *   keys: ['name', 'email'],
 *   threshold: 0.3
 * });
 * 
 * // Khi user nhập search
 * const results = await search(query);
 */
export function useFuseSearch<T>(
  data: T[],
  options: IFuseOptions<T>
) {
  const [FuseModule, setFuseModule] = React.useState<typeof Fuse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const fuseRef = React.useRef<Fuse<T> | null>(null);

  // Lazy load Fuse.js
  const loadFuse = React.useCallback(async () => {
    if (FuseModule) return FuseModule;
    setIsLoading(true);
    try {
      const module = await import('fuse.js');
      setFuseModule(() => module.default);
      return module.default;
    } finally {
      setIsLoading(false);
    }
  }, [FuseModule]);

  // Tạo hoặc update Fuse instance khi data thay đổi
  React.useEffect(() => {
    if (FuseModule && data) {
      fuseRef.current = new FuseModule(data, options);
    }
  }, [FuseModule, data, options]);

  // Search function - lazy load Fuse nếu chưa có
  const search = React.useCallback(async (query: string): Promise<T[]> => {
    if (!query.trim()) {
      return data;
    }

    // Lazy load Fuse nếu chưa có
    if (!fuseRef.current) {
      const Fuse = await loadFuse();
      fuseRef.current = new Fuse(data, options);
    }

    return fuseRef.current.search(query).map(r => r.item);
  }, [data, options, loadFuse]);

  // Sync search function (chỉ dùng sau khi Fuse đã load)
  const searchSync = React.useCallback((query: string): T[] => {
    if (!query.trim()) {
      return data;
    }

    if (!fuseRef.current) {
      // Fallback: simple includes search
      return data;
    }

    return fuseRef.current.search(query).map(r => r.item);
  }, [data]);

  return {
    search,
    searchSync,
    isLoading,
    isReady: !!FuseModule,
    // Preload Fuse (gọi khi user focus vào input search)
    preload: loadFuse,
  };
}

/**
 * Hook đơn giản hơn - trả về filtered data trực tiếp
 * Tự động load Fuse khi có query
 */
export function useFuseFilter<T>(
  data: T[],
  query: string,
  options: IFuseOptions<T>
): T[] {
  // Fast path: no query → just return data directly (no state updates)
  if (!query.trim()) {
    return data;
  }

  const [filteredData, setFilteredData] = React.useState<T[]>(data);
  const fuseRef = React.useRef<Fuse<T> | null>(null);
  const optionsRef = React.useRef(options);
  const dataRef = React.useRef(data);
  
  // Keep refs updated
  optionsRef.current = options;
  dataRef.current = data;

  React.useEffect(() => {
    let cancelled = false;

    const performSearch = async () => {
      // Lazy load Fuse
      if (!fuseRef.current) {
        const FuseModule = await import('fuse.js');
        if (cancelled) return;
        fuseRef.current = new FuseModule.default(dataRef.current, optionsRef.current);
      } else {
        // Update data in existing Fuse instance
        fuseRef.current.setCollection(dataRef.current);
      }

      const results = fuseRef.current.search(query).map(r => r.item);
      if (!cancelled) {
        setFilteredData(results);
      }
    };

    performSearch();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return filteredData;
}
