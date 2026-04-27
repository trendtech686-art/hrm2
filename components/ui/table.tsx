import { forwardRef, type ThHTMLAttributes, type TdHTMLAttributes, type HTMLAttributes } from 'react'

import { cn } from "../../lib/utils"

/**
 * Table — shadcn Table primitive.
 *
 * Wrap trong div `overflow-x-auto` để mobile tự scroll ngang khi table rộng
 * hơn viewport (tránh bị cắt cột). Desktop không ảnh hưởng vì chỉ scroll khi
 * content tràn.
 *
 * Pattern chuẩn shadcn: `<div class="relative w-full overflow-x-auto"><table/></div>`.
 */
type TableProps = HTMLAttributes<HTMLTableElement> & {
  /**
   * Additional classes for the inner scroll container (the `<div>` wrapping the `<table>`).
   * Pass `"!overflow-visible"` when the parent already handles horizontal scrolling (e.g. inside
   * ResponsiveDataTable with StickyScrollbar) to prevent a double scrollbar.
   */
  containerClassName?: string
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <div
      className={cn(
        "relative w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        containerClassName,
      )}
    >
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  ),
)
Table.displayName = "Table"

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b [&_tr]:border-border", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0 [&_tr:last-child]:border-border", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0 [&>tr]:last:border-border",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "group border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-9 px-4 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:px-3 [&:has([role=checkbox])]:w-12 [&:has([role=checkbox])]:text-center whitespace-nowrap",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-1 align-middle whitespace-nowrap [&:has([role=checkbox])]:px-3 [&:has([role=checkbox])]:w-12 [&:has([role=checkbox])]:text-center",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
