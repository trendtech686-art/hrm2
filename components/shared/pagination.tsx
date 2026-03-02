/**
 * Pagination Component
 * 
 * Server-side pagination UI component
 * Works with PaginatedResult from lib/data
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  /** Show page size selector */
  showPageSize?: boolean;
  /** Available page sizes */
  pageSizes?: number[];
  /** Callback when page changes (for client-side usage) */
  onPageChange?: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void;
  /** Use URL params for navigation (Server Component compatible) */
  useUrlParams?: boolean;
  /** Base URL for pagination links */
  baseUrl?: string;
}

export function Pagination({
  page,
  limit,
  total,
  totalPages,
  hasNext,
  hasPrev,
  showPageSize = true,
  pageSizes = [20, 50, 100],
  onPageChange,
  onPageSizeChange,
  useUrlParams = true,
  baseUrl,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Calculate display range
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Navigate to page
  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    if (onPageChange) {
      onPageChange(newPage);
    }

    if (useUrlParams) {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('page', String(newPage));
      router.push(`${baseUrl || ''}?${params.toString()}`);
    }
  };

  // Change page size
  const changePageSize = (newSize: string) => {
    const size = parseInt(newSize);
    
    if (onPageSizeChange) {
      onPageSizeChange(size);
    }

    if (useUrlParams) {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('limit', newSize);
      params.set('page', '1'); // Reset to first page
      router.push(`${baseUrl || ''}?${params.toString()}`);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (page > 3) {
        pages.push('ellipsis');
      }
      
      // Show pages around current
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      {/* Info & Page Size */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Hiển thị {startItem}-{endItem} / {total.toLocaleString()}
        </span>
        
        {showPageSize && (
          <div className="flex items-center gap-2">
            <span>Số dòng:</span>
            <Select value={String(limit)} onValueChange={changePageSize}>
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizes.map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => goToPage(1)}
          disabled={!hasPrev}
          title="Trang đầu"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => goToPage(page - 1)}
          disabled={!hasPrev}
          title="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((p, idx) => (
            p === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => goToPage(p)}
              >
                {p}
              </Button>
            )
          ))}
        </div>

        {/* Mobile: Current page */}
        <span className="sm:hidden px-3 text-sm">
          {page} / {totalPages}
        </span>

        {/* Next page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => goToPage(page + 1)}
          disabled={!hasNext}
          title="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => goToPage(totalPages)}
          disabled={!hasNext}
          title="Trang cuối"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
