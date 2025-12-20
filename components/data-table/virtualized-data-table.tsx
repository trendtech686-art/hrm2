import * as React from "react"
import { Trash2, ChevronDown, ChevronsRight } from "lucide-react"
import { cn } from "../../lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import type { ColumnDef } from './types'

interface BulkAction<TData> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onSelect: (selectedRows: TData[]) => void
}

interface VirtualizedDataTableProps<TData extends { systemId: string }> {
  columns: ColumnDef<TData>[]
  data: TData[]
  rowSelection: Record<string, boolean>
  setRowSelection: (updater: React.SetStateAction<Record<string, boolean>>) => void
  onBulkDelete?: () => void
  showBulkDeleteButton?: boolean
  bulkActions?: BulkAction<TData>[]
  bulkActionButtons?: React.ReactNode
  allSelectedRows: TData[]
  renderSubComponent?: (row: TData) => React.ReactNode
  expanded: Record<string, boolean>
  setExpanded: (updater: React.SetStateAction<Record<string, boolean>>) => void
  sorting: { id: string, desc: boolean }
  setSorting: (updater: React.SetStateAction<{ id: string, desc: boolean }>) => void
  columnVisibility: Record<string, boolean>
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  columnOrder: string[]
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>
  pinnedColumns: string[]
  setPinnedColumns: React.Dispatch<React.SetStateAction<string[]>>
  onRowClick?: (row: TData) => void
  className?: string
  // Virtual scrolling specific props
  estimateRowHeight?: number
  overscan?: number
  // Infinite scroll props
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
}

export function VirtualizedDataTable<TData extends { systemId: string }>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  onBulkDelete,
  showBulkDeleteButton = true,
  bulkActions,
  bulkActionButtons,
  allSelectedRows,
  renderSubComponent,
  expanded,
  setExpanded,
  sorting,
  setSorting,
  columnVisibility,
  setColumnVisibility,
  columnOrder,
  setColumnOrder,
  pinnedColumns,
  setPinnedColumns,
  onRowClick,
  className,
  estimateRowHeight = 53,
  overscan = 10,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: VirtualizedDataTableProps<TData>) {
  
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  const headerTableRef = React.useRef<HTMLTableElement>(null)
  const bodyTableRef = React.useRef<HTMLTableElement>(null)
  
  const numSelected = Object.keys(rowSelection).length
  const isAllPageRowsSelected = data.length > 0 && data.every(row => rowSelection[row.systemId])
  const isSomePageRowsSelected = !isAllPageRowsSelected && data.some(row => rowSelection[row.systemId])
  
  const handleToggleAllPageRows = (value: boolean) => {
    const newSelection = { ...rowSelection }
    data.forEach(row => {
      if (value) {
        newSelection[row.systemId] = true
      } else {
        delete newSelection[row.systemId]
      }
    })
    setRowSelection(newSelection)
  }

  // Apply column visibility, order, and pinning
  const displayColumns = React.useMemo(() => {
    let cols = columns.filter(col => columnVisibility[col.id] !== false)
    
    if (columnOrder.length > 0) {
      cols = cols.sort((a, b) => {
        const aIndex = columnOrder.indexOf(a.id)
        const bIndex = columnOrder.indexOf(b.id)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })
    }

    const leftPinned = cols.filter(c => pinnedColumns.includes(c.id) && (c.meta as any)?.sticky === 'left')
    const rightPinned = cols.filter(c => pinnedColumns.includes(c.id) && (c.meta as any)?.sticky === 'right')
    const middle = cols.filter(c => !pinnedColumns.includes(c.id))

    return [...leftPinned, ...middle, ...rightPinned]
  }, [columns, columnVisibility, columnOrder, pinnedColumns])

  const leftStickyColumns = displayColumns.filter(c => (c.meta as any)?.sticky === 'left')
  const rightStickyColumns = displayColumns.filter(c => (c.meta as any)?.sticky === 'right')

  const leftOffsets = React.useMemo(() => {
    let offset = 0
    return leftStickyColumns.map(col => {
      const currentOffset = offset
      offset += col.size || 150
      return currentOffset
    })
  }, [leftStickyColumns])

  const rightOffsets = React.useMemo(() => {
    let offset = 0
    return rightStickyColumns.slice().reverse().map(col => {
      const currentOffset = offset
      offset += col.size || 150
      return currentOffset
    }).reverse()
  }, [rightStickyColumns])

  // Simple render - no virtual scrolling needed with pagination
  // Pagination ensures we never render more than 20-100 rows
  // Performance is excellent without virtualization complexity

  return (
    <div className={cn("w-full", className)}>
      {/* Header table - fixed */}
      <div className="rounded-t-md border border-b-0 bg-background overflow-hidden">
        <Table ref={headerTableRef}>
          <TableHeader>
            {numSelected > 0 && (
              <tr className="bg-muted/50 border-b">
                <th colSpan={displayColumns.length} className="p-0">
                  <div className="h-9 px-4 flex items-center gap-2">
                    {onBulkDelete && showBulkDeleteButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBulkDelete}
                        className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </Button>
                    )}
                    {bulkActions && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Action
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {bulkActions.map((action, index) => (
                            <DropdownMenuItem
                              key={index}
                              onSelect={() => action.onSelect(allSelectedRows)}
                            >
                              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    {bulkActionButtons}
                    <div className="flex-1"></div>
                    <span className="text-sm font-medium">{numSelected} mục đã chọn</span>
                  </div>
                </th>
              </tr>
            )}
            <TableRow className="h-9">
              {displayColumns.map((column, colIndex) => {
                const stickyMeta = (column.meta as any)?.sticky
                const hasFixedSize = column.size !== undefined
                const colSize = column.size || 150
                
                const style: React.CSSProperties = hasFixedSize ? { 
                  width: colSize, 
                  minWidth: colSize,
                  maxWidth: colSize,
                } : {
                  minWidth: 100,
                }
                
                let thClassName = "bg-muted whitespace-nowrap"

                const isLastLeftSticky = stickyMeta === 'left' && colIndex === leftStickyColumns.length - 1

                if (stickyMeta === 'left') {
                  const stickyIndex = leftStickyColumns.findIndex(c => c.id === column.id)
                  if (stickyIndex !== -1) {
                    (style as any).position = 'sticky';
                    (style as any).left = `${leftOffsets[stickyIndex]}px`;
                    (style as any).top = 0;
                    thClassName = cn(thClassName, "z-30 bg-muted")
                  }
                } else if (stickyMeta === 'right') {
                  const stickyIndex = rightStickyColumns.findIndex(c => c.id === column.id)
                  if (stickyIndex !== -1) {
                    (style as any).position = 'sticky';
                    (style as any).right = `${rightOffsets[stickyIndex]}px`;
                    (style as any).top = 0;
                    thClassName = cn(thClassName, "z-30 bg-muted shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]")
                  }
                }
                
                if (['control', 'select', 'expander', 'actions'].includes(column.id)) {
                  thClassName = cn(thClassName, "px-2 text-center")
                }

                return (
                  <TableHead 
                    key={column.id} 
                    style={style}
                    className={cn(thClassName, {
                      "border-r": isLastLeftSticky,
                    })}
                  >
                    {typeof column.header === 'function' 
                      // @ts-ignore
                      ? column.header({ 
                          isAllPageRowsSelected, 
                          isSomePageRowsSelected, 
                          onToggleAll: handleToggleAllPageRows,
                          sorting,
                          setSorting
                        }) 
                      : column.header}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* Body table - natural height, scroll entire page */}
      <div 
        ref={tableContainerRef}
        className="rounded-b-md border border-t-0 bg-background"
      >
        <Table ref={bodyTableRef}>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, index) => {

                return (
                  <React.Fragment key={row.systemId}>
                    <TableRow
                      data-state={rowSelection[row.systemId] && "selected"}
                      onClick={() => onRowClick?.(row)}
                      className={cn('group', onRowClick && 'cursor-pointer')}
                    >
                      {displayColumns.map((column, colIndex) => {
                        const isInteractiveColumn = ['select', 'control', 'actions', 'expander'].includes(column.id)
                        const stickyMeta = (column.meta as any)?.sticky
                        const hasFixedSize = column.size !== undefined
                        const colSize = column.size || 150
                        
                        const style: React.CSSProperties = hasFixedSize ? {
                          width: colSize,
                          minWidth: colSize,
                          maxWidth: colSize,
                        } : {
                          minWidth: 100,
                        }
                        
                        let tdClassName = ""
                        
                        const isLastLeftSticky = stickyMeta === 'left' && colIndex === leftStickyColumns.length - 1

                        if (stickyMeta === 'left') {
                          const stickyIndex = leftStickyColumns.findIndex(c => c.id === column.id)
                          if (stickyIndex !== -1) {
                            (style as any).position = 'sticky';
                            (style as any).left = `${leftOffsets[stickyIndex]}px`;
                            tdClassName = "z-10 bg-background group-hover:bg-muted/50 group-data-[state=selected]:bg-muted transition-colors"
                          }
                        } else if (stickyMeta === 'right') {
                          const stickyIndex = rightStickyColumns.findIndex(c => c.id === column.id)
                          if (stickyIndex !== -1) {
                            (style as any).position = 'sticky';
                            (style as any).right = `${rightOffsets[stickyIndex]}px`;
                            tdClassName = "z-10 bg-background group-hover:bg-muted/50 group-data-[state=selected]:bg-muted transition-colors shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                          }
                        }
                        
                        if (['control', 'select', 'expander', 'actions'].includes(column.id)) {
                          tdClassName = cn(tdClassName, "px-2 text-center")
                        }

                        return (
                          <TableCell 
                            key={column.id}
                            style={style}
                            className={cn(tdClassName, {
                              "border-r": isLastLeftSticky,
                            })}
                            onClick={isInteractiveColumn ? (e) => e.stopPropagation() : undefined}
                          >
                            {column.cell({ 
                              row, 
                              isSelected: !!rowSelection[row.systemId],
                              isExpanded: !!expanded[row.systemId],
                              onToggleSelect: (value) => {
                                setRowSelection(prev => {
                                  const newSelection = {...prev}
                                  if (value) {
                                    newSelection[row.systemId] = true
                                  } else {
                                    delete newSelection[row.systemId]
                                  }
                                  return newSelection
                                })
                              },
                              onToggleExpand: () => setExpanded(prev => ({ ...prev, [row.systemId]: !prev[row.systemId] })),
                            })}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                    {expanded[row.systemId] && renderSubComponent && (
                      <TableRow>
                        <TableCell colSpan={displayColumns.length} className="p-0">
                          {renderSubComponent(row)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={displayColumns.length} className="h-24 text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
