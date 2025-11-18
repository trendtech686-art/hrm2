import * as React from "react";
import { Card, CardContent } from "../ui/card.tsx";
import { ResponsiveDataTable } from "../data-table/responsive-data-table.tsx";
import { DataTableToolbar } from "../data-table/data-table-toolbar.tsx";
import { DataTableColumnCustomizer } from "../data-table/data-table-column-toggle.tsx";
import { DataTableExportDialog } from "../data-table/data-table-export-dialog.tsx";
import { DataTableImportDialog } from "../data-table/data-table-import-dialog.tsx";
import { MobileSearchBar } from "../mobile/mobile-search-bar.tsx";
import { TouchButton } from "../mobile/touch-button.tsx";
import { Button } from "../ui/button.tsx";
import { useMediaQuery } from "../../lib/use-media-query.ts";
import { PlusCircle } from "lucide-react";

interface DataPageLayoutProps<T> {
  // Data & Columns
  columns: any[];
  data: T[];
  allData: T[];
  filteredData: T[];
  
  // Pagination
  pageCount: number;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
  
  // Search & Filters
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  searchPlaceholder: string;
  
  // Selection & Actions
  rowSelection: Record<string, boolean>;
  setRowSelection: (selection: Record<string, boolean>) => void;
  bulkActions?: Array<{
    label: string;
    onSelect: (selectedRows: T[]) => void;
  }>;
  allSelectedRows: T[];
  onBulkDelete?: () => void;
  
  // Sorting & Expansion
  sorting: { id: string; desc: boolean };
  setSorting: (sorting: { id: string; desc: boolean }) => void;
  expanded: Record<string, boolean>;
  setExpanded: (expanded: Record<string, boolean>) => void;
  
  // Column Management
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
  columnOrder: string[];
  setColumnOrder: (order: string[]) => void;
  pinnedColumns: string[];
  setPinnedColumns: (pinned: string[]) => void;
  
  // Callbacks
  onRowClick?: (item: T) => void;
  onAddNew: () => void;
  
  // Mobile Card Renderer
  renderMobileCard: (item: T) => React.ReactNode;
  
  // Export/Import Configs
  exportConfig?: {
    fileName: string;
    columns: any[];
  };
  importConfig?: {
    importer: (data: any[]) => void;
    fileName: string;
  };
  
  // Labels
  addButtonLabel: string;
  itemLabel: string; // e.g. "khách hàng", "sản phẩm"
  noDataMessage: string;
  
  // Additional Filters (optional)
  additionalFilters?: React.ReactNode;
}

export function DataPageLayout<T>({
  columns,
  data,
  allData,
  filteredData,
  pageCount,
  pagination,
  setPagination,
  globalFilter,
  setGlobalFilter,
  searchPlaceholder,
  rowSelection,
  setRowSelection,
  bulkActions = [],
  allSelectedRows,
  onBulkDelete,
  sorting,
  setSorting,
  expanded,
  setExpanded,
  columnVisibility,
  setColumnVisibility,
  columnOrder,
  setColumnOrder,
  pinnedColumns,
  setPinnedColumns,
  onRowClick,
  onAddNew,
  renderMobileCard,
  exportConfig,
  importConfig,
  addButtonLabel,
  itemLabel,
  noDataMessage,
  additionalFilters,
}: DataPageLayoutProps<T>) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4">
        <div className="flex-shrink-0 space-y-4">
          {/* Header Actions */}
          {isMobile ? (
            <div className="space-y-3">
              {/* Primary Action Button */}
              <TouchButton 
                onClick={onAddNew} 
                size="default"
                className="w-full min-h-touch"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {addButtonLabel}
              </TouchButton>
              
              {/* Second Row - Action Buttons */}
              <div className="flex gap-2">
                {importConfig && <DataTableImportDialog config={importConfig} />}
                {exportConfig && <DataTableExportDialog allData={allData} filteredData={filteredData} pageData={data} config={exportConfig} />}
                <DataTableColumnCustomizer
                  columns={columns}
                  columnVisibility={columnVisibility}
                  setColumnVisibility={setColumnVisibility}
                  columnOrder={columnOrder}
                  setColumnOrder={setColumnOrder}
                  pinnedColumns={pinnedColumns}
                  setPinnedColumns={setPinnedColumns}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {importConfig && <DataTableImportDialog config={importConfig} />}
                {exportConfig && <DataTableExportDialog allData={allData} filteredData={filteredData} pageData={data} config={exportConfig} />}
                <DataTableColumnCustomizer
                  columns={columns}
                  columnVisibility={columnVisibility}
                  setColumnVisibility={setColumnVisibility}
                  columnOrder={columnOrder}
                  setColumnOrder={setColumnOrder}
                  pinnedColumns={pinnedColumns}
                  setPinnedColumns={setPinnedColumns}
                />
              </div>
              <Button 
                onClick={onAddNew} 
                size="sm"
              >
                <PlusCircle className="mr-2 h-3.5 w-3.5" />
                {addButtonLabel}
              </Button>
            </div>
          )}
          
          {/* Search and Filters */}
          {isMobile ? (
            <div className="space-y-3">
              <MobileSearchBar
                value={globalFilter}
                onChange={setGlobalFilter}
                placeholder={searchPlaceholder}
              />
              
              {additionalFilters && (
                <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-3">
                  {additionalFilters}
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="text-sm text-muted-foreground">{filteredData.length} {itemLabel}</p>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <DataTableToolbar 
                  search={globalFilter}
                  onSearchChange={setGlobalFilter}
                  searchPlaceholder={searchPlaceholder}
                  numResults={filteredData.length}
                >
                  {additionalFilters}
                </DataTableToolbar>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Content - Mobile Cards or Desktop Table */}
        {isMobile ? (
          <div className="space-y-3 pb-4">
            {data.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{noDataMessage}</p>
                </CardContent>
              </Card>
            ) : (
              data.map((item: any, index) => (
                <div key={item.systemId || item.id || index}>
                  {renderMobileCard(item)}
                </div>
              ))
            )}
            {/* Mobile Pagination */}
            {pageCount > 1 && (
              <div className="flex items-center justify-between pt-4">
                <TouchButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, pageIndex: Math.max(0, pagination.pageIndex - 1) })}
                  disabled={pagination.pageIndex === 0}
                >
                  Trước
                </TouchButton>
                <span className="text-sm text-muted-foreground">
                  Trang {pagination.pageIndex + 1} / {pageCount}
                </span>
                <TouchButton
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, pageIndex: Math.min(pageCount - 1, pagination.pageIndex + 1) })}
                  disabled={pagination.pageIndex >= pageCount - 1}
                >
                  Sau
                </TouchButton>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full">
            <ResponsiveDataTable
              columns={columns}
              data={data as any}
              renderMobileCard={renderMobileCard as any}
              pageCount={pageCount}
              pagination={pagination}
              setPagination={setPagination}
              rowCount={filteredData.length}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onBulkDelete={onBulkDelete}
              bulkActions={bulkActions as any}
              allSelectedRows={allSelectedRows as any}
              sorting={sorting}
              setSorting={setSorting}
              expanded={expanded}
              setExpanded={setExpanded}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
              onRowClick={onRowClick as any}
            />
          </div>
        )}
      </div>
    </div>
  );
}