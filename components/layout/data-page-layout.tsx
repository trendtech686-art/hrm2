import * as React from "react";
import { Card, CardContent } from "../ui/card";
import { ResponsiveDataTable, BulkAction } from "../data-table/responsive-data-table";
import type { ColumnDef } from "../data-table/types";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "../data-table/dynamic-column-customizer";
import { DataTableExportDialog } from "../data-table/data-table-export-dialog";
import { DataTableImportDialog } from "../data-table/data-table-import-dialog";
import { MobileSearchBar } from "../mobile/mobile-search-bar";
import { TouchButton } from "../mobile/touch-button";
import { Button } from "../ui/button";
import { useMediaQuery } from "../../lib/use-media-query";
import { PlusCircle } from "lucide-react";

interface DataPageLayoutProps<T extends { systemId: string }> {
  // Data & Columns
  columns: ColumnDef<T>[];
  data: T[];
  allData: T[];
  filteredData: T[];
  
  // Pagination
  pageCount: number;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (updater: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => void;
  
  // Search & Filters
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  searchPlaceholder: string;
  
  // Selection & Actions
  rowSelection: Record<string, boolean>;
  setRowSelection: (updater: React.SetStateAction<Record<string, boolean>>) => void;
  bulkActions?: Array<{
    label: string;
    onSelect: (selectedRows: T[]) => void;
  }>;
  allSelectedRows: T[];
  onBulkDelete?: () => void;
  
  // Sorting & Expansion
  sorting: { id: string; desc: boolean };
  setSorting: (updater: React.SetStateAction<{ id: string; desc: boolean }>) => void;
  expanded: Record<string, boolean>;
  setExpanded: (updater: React.SetStateAction<Record<string, boolean>>) => void;
  
  // Column Management
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>> | ((value: Record<string, boolean>) => void);
  columnOrder: string[];
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>> | ((value: string[]) => void);
  pinnedColumns: string[];
  setPinnedColumns: React.Dispatch<React.SetStateAction<string[]>> | ((value: string[]) => void);
  
  // Callbacks
  onRowClick?: (item: T) => void;
  onAddNew: () => void;
  
  // Mobile Card Renderer
  renderMobileCard: (item: T) => React.ReactNode;
  
  // Export/Import Configs
  exportConfig?: {
    fileName: string;
    columns: ColumnDef<T>[];
  };
  importConfig?: {
    importer: (data: unknown[]) => void;
    fileName: string;
  };
  
  // Labels
  addButtonLabel: string;
  itemLabel: string; // e.g. "khách hàng", "sản phẩm"
  noDataMessage: string;
  
  // Additional Filters (optional)
  additionalFilters?: React.ReactNode;
}

export function DataPageLayout<T extends { systemId: string }>({
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
        <div className="shrink-0 space-y-4">
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
              
              <div className="flex justify-between items-center pt-2 border-t border-border">
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
              data.map((item, index) => (
                <div key={(item as { systemId?: string; id?: string }).systemId || (item as { id?: string }).id || index}>
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
              columns={columns as ColumnDef<{ systemId: string }>[]}
              data={data as { systemId: string }[]}
              renderMobileCard={renderMobileCard as unknown as (item: { systemId: string }, index: number) => React.ReactNode}
              pageCount={pageCount}
              pagination={pagination}
              setPagination={setPagination}
              rowCount={filteredData.length}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onBulkDelete={onBulkDelete}
              bulkActions={bulkActions as BulkAction<{ systemId: string }>[] | undefined}
              allSelectedRows={allSelectedRows as { systemId: string }[]}
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
              onRowClick={onRowClick as ((row: { systemId: string }) => void) | undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}