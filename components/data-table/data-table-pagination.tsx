import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  rowCount: number;
  selectedRowCount: number;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  pageCount,
  rowCount,
  selectedRowCount,
  setPageIndex,
  setPageSize,
  canPreviousPage,
  canNextPage,
}: DataTablePaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsis = pageCount > 7;
    
    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);
      
      if (pageIndex <= 3) {
        // Near start: 1 2 3 4 5 ... last
        for (let i = 1; i < 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(pageCount - 1);
      } else if (pageIndex >= pageCount - 4) {
        // Near end: 1 ... N-4 N-3 N-2 N-1 N
        pages.push('ellipsis');
        for (let i = pageCount - 5; i < pageCount; i++) {
          pages.push(i);
        }
      } else {
        // Middle: 1 ... current-1 current current+1 ... last
        pages.push('ellipsis');
        pages.push(pageIndex - 1);
        pages.push(pageIndex);
        pages.push(pageIndex + 1);
        pages.push('ellipsis');
        pages.push(pageCount - 1);
      }
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedRowCount} của{" "}
        {rowCount} dòng được chọn.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Số dòng mỗi trang</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            className="px-3"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            Previous
          </Button>
          
          {pageNumbers.map((page, idx) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }
            
            return (
              <Button
                key={page}
                variant={pageIndex === page ? "default" : "outline"}
                size="sm"
                className="w-9 p-0"
                onClick={() => setPageIndex(page)}
              >
                {page + 1}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            size="sm"
            className="px-3"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={!canNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
